#!/usr/bin/env node
/**
 * SysADL Simulator - Integrated Execution Tool
 * 
 * Orchestrates the simulation of SysADL models:
 * 1. Transforms .sysadl -> .js
 * 2. Loads environment and scenario module
 * 3. Dynamically builds the environment hierarchy, connectors, and bridges
 * 4. Executes ScenarioExecutions using a dynamic context proxy
 * 5. Generates JUnit-style console reports and JSON log artifacts
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Import Element, EnvComponent, EnvPort, EnvConnector from SysADLBase if needed
const { EnvComponent, EnvPort, EnvConnector } = require('./sysadl-framework/SysADLBase');

/**
 * Keys that traversal functions must skip when iterating Object.keys(component).
 * 
 * CRITICAL: Element stores `this.props = {...opts}` which copies envComponentType,
 * envPorts, properties, etc. into a plain object. If traversal recurses into 'props',
 * it treats it as a sub-component, causing:
 *   1. applyConfig() to re-run, creating duplicate child components on the props object
 *   2. port.owner to be overwritten with the props object (breaking identity checks)
 *   3. Exponential duplication of boundary extensions and connector instantiation
 */
const SKIP_KEYS = new Set([
  'environment', 'model', 'owner', 'parent',           // framework references (circular)
  'props', 'state',                                      // Element internals (props shares envComponentType!)
  'envComponentType', 'envPorts', 'properties',          // EnvComponent own descriptors
  'componentBinding', 'environmentConfig',               // EnvComponent binding metadata
  'name', 'sysadlName',                                  // string identifiers
  '_proxy', '_raw', '_isProxy'                          // Proxy internals
]);

function findCompPortFuzzy(comp, portName) {
  if (!comp) return null;
  const portNameLower = portName.toLowerCase();
  const cleanPortName = portNameLower.replace(/^(in|out|env|sys|op|act)/, '').replace(/(in|out)$/, '');

  if (comp.envPorts) {
    if (comp.envPorts[portName]) return comp.envPorts[portName];
    if (comp.envPorts[portNameLower]) return comp.envPorts[portNameLower];

    const isOutReq = portNameLower.startsWith('out');
    const isInReq = portNameLower.startsWith('in');

    for (const [key, port] of Object.entries(comp.envPorts)) {
      const keyLower = key.toLowerCase();
      if (isInReq && (port.direction === 'out' || keyLower.startsWith('out'))) continue;
      if (isOutReq && (port.direction === 'in' || keyLower.startsWith('in'))) continue;
      if (keyLower === portNameLower) return port;
      const cleanKey = keyLower.replace(/^(in|out|env|sys|op|act)/, '').replace(/(in|out)$/, '');
      if (cleanKey === cleanPortName) return port;
    }

    // Fallback: If no port matched with strict direction, check exact clean name match regardless of direction prefix
    for (const [key, port] of Object.entries(comp.envPorts)) {
      const keyLower = key.toLowerCase();
      const cleanKey = keyLower.replace(/^(in|out|env|sys|op|act)/, '').replace(/(in|out)$/, '');
      if (cleanKey === cleanPortName) return port;
    }

    for (const [key, port] of Object.entries(comp.envPorts)) {
      const keyLower = key.toLowerCase();
      if (isInReq && (port.direction === 'out' || keyLower.startsWith('out'))) continue;
      if (isOutReq && (port.direction === 'in' || keyLower.startsWith('in'))) continue;
      const cleanKey = keyLower.replace(/^(in|out|env|sys|op|act)/, '').replace(/(in|out)$/, '');
      if (cleanKey && cleanPortName && (cleanKey.includes(cleanPortName) || cleanPortName.includes(cleanKey))) {
        return port;
      }
    }
  }

  // Check subcomponents
  for (const key of Object.keys(comp)) {
    if (SKIP_KEYS.has(key)) continue;
    const child = comp[key];
    if (child && typeof child === 'object' && child.envPorts) {
      const childPort = findCompPortFuzzy(child, portName);
      if (childPort) return childPort;
    }
  }

  if (comp.envPorts) {
    const isOutReq = portNameLower.startsWith('out');
    const isInReq = portNameLower.startsWith('in');
    const getGroup = (s) => {
      if (s.includes('param')) return 'param';
      if (s.includes('color')) return 'color';
      if (s.includes('piece')) return 'piece';
      if (s.includes('obstacle')) return 'obstacle';
      if (s.includes('zone') || s.includes('alarm')) return 'zone';
      if (s.includes('offset')) return 'offset';
      if (s.includes('nav') || s.includes('line') || s.includes('pad') || s.includes('standby') || s.includes('floor') || s.includes('pa')) return 'nav';
      return '';
    };
    const reqGroup = getGroup(cleanPortName);

    const matchingDirPorts = Object.values(comp.envPorts).filter(p => {
      const name = (p.name || '').toLowerCase();
      const dir = p.direction;
      if (reqGroup) {
        const nameClean = name.replace(/^(in|out|env|sys|op|act)/, '');
        if (!nameClean.includes(reqGroup)) return false;
      }
      if (isOutReq) return dir === 'out' || name.startsWith('out');
      if (isInReq) return dir === 'in' || name.startsWith('in');
      return true;
    });
    if (matchingDirPorts.length === 1) {
      return matchingDirPorts[0];
    }
    const keys = Object.keys(comp.envPorts);
    if (keys.length === 1) {
      const singlePort = comp.envPorts[keys[0]];
      if (isInReq && (singlePort.direction === 'out' || singlePort.name.startsWith('out'))) return null;
      if (isOutReq && (singlePort.direction === 'in' || singlePort.name.startsWith('in'))) return null;
      if (reqGroup) {
        const nameClean = (singlePort.name || keys[0]).toLowerCase().replace(/^(in|out|env|sys|op|act)/, '');
        if (!nameClean.includes(reqGroup)) return null;
      }
      return singlePort;
    }
  }

  return null;
}


class SimulationScheduler {
  constructor(ctx) {
    this.ctx = ctx;
    this.timers = [];
    this.scenarioListeners = { before: new Map(), after: new Map() };
    this.conditionWatchers = [];
  }
  
  scheduleInject(signalName, signalData, delayMs) {
    console.log(`⏱️  [SCHEDULER] Scheduled injection: ${signalName} in ${delayMs}ms`);
    const timer = setTimeout(() => {
      console.log(`⚡ [SCHEDULER] Injecting signal: ${signalName}`);
      if (this.ctx.envActivities) {
        this.ctx.envActivities.handleSignal(signalName, signalData, this.ctx);
      }
    }, delayMs);
    this.timers.push(timer);
  }
  
  scheduleBeforeScenario(signalName, signalData, scenarioName) {
    console.log(`⏱️  [SCHEDULER] Scheduled injection ${signalName} BEFORE scenario ${scenarioName}`);
    if (this.ctx && this.ctx.envModel) {
      const isValid = (this.ctx.envModel.scenarios && this.ctx.envModel.scenarios[scenarioName]) ||
                      (this.ctx.envModel.scenes && this.ctx.envModel.scenes[scenarioName]);
      if (!isValid) {
        console.warn(`\x1b[31m[WARNING] Injection scheduled BEFORE non-existent scene/scenario: '${scenarioName}'. This injection will never fire!\x1b[0m`);
      }
    }
    if (!this.scenarioListeners.before.has(scenarioName)) {
      this.scenarioListeners.before.set(scenarioName, []);
    }
    this.scenarioListeners.before.get(scenarioName).push({ signalName, signalData });
  }

  scheduleAfterScenario(signalName, signalData, scenarioName) {
    console.log(`⏱️  [SCHEDULER] Scheduled injection ${signalName} AFTER scenario ${scenarioName}`);
    if (this.ctx && this.ctx.envModel) {
      const isValid = (this.ctx.envModel.scenarios && this.ctx.envModel.scenarios[scenarioName]) ||
                      (this.ctx.envModel.scenes && this.ctx.envModel.scenes[scenarioName]);
      if (!isValid) {
        console.warn(`\x1b[31m[WARNING] Injection scheduled AFTER non-existent scene/scenario: '${scenarioName}'. This injection will never fire!\x1b[0m`);
      }
    }
    if (!this.scenarioListeners.after.has(scenarioName)) {
      this.scenarioListeners.after.set(scenarioName, []);
    }
    this.scenarioListeners.after.get(scenarioName).push({ signalName, signalData });
  }

  notifyScenarioStarted(scenarioName) {
    const list = this.scenarioListeners.before.get(scenarioName);
    if (list) {
      for (const { signalName, signalData } of list) {
        console.log(`⚡ [SCHEDULER] Scenario ${scenarioName} starting. Injecting: ${signalName}`);
        if (this.ctx.envActivities) {
          this.ctx.envActivities.handleSignal(signalName, signalData, this.ctx);
        }
      }
    }
  }

  notifyScenarioCompleted(scenarioName) {
    const list = this.scenarioListeners.after.get(scenarioName);
    if (list) {
      for (const { signalName, signalData } of list) {
        console.log(`⚡ [SCHEDULER] Scenario ${scenarioName} completed. Injecting: ${signalName}`);
        if (this.ctx.envActivities) {
          this.ctx.envActivities.handleSignal(signalName, signalData, this.ctx);
        }
      }
    }
  }

  scheduleOnCondition(signalName, signalData, conditionFn, conditionExprStr = '') {
    console.log(`⏱️  [SCHEDULER] Scheduled injection ${signalName} when condition is met: ${conditionExprStr}`);
    
    const interval = setInterval(() => {
      try {
        if (conditionFn()) {
          console.log(`⚡ [SCHEDULER] Condition met: ${conditionExprStr || signalName}. Injecting: ${signalName}`);
          clearInterval(interval);
          console.log(`[SCHED DEBUG] Before checkPassiveScenes start: activeScenarios=`, this.ctx.activeScenarios?.length, 'scenes=', Object.keys(this.ctx.scenes || {}).length);
          checkPassiveScenes(this.ctx, signalName, 'signal', null, 'start');
          if (this.ctx.envActivities) {
            this.ctx.envActivities.handleSignal(signalName, signalData, this.ctx);
          }
          console.log(`[SCHED DEBUG] Before checkPassiveScenes finish: activeScenarios=`, this.ctx.activeScenarios?.length);
          checkPassiveScenes(this.ctx, signalName, 'signal', null, 'finish');
        }
      } catch (e) { console.log(`[SCHEDULER ERROR] ${signalName}:`, e.message, e.stack); }
    }, 50);
    this.timers.push(interval);
  }

  clearAll() {
    for (const t of this.timers) {
      clearInterval(t);
      clearTimeout(t);
    }
    this.timers = [];
    for (const unwatch of this.conditionWatchers) {
      try { unwatch(); } catch (e) {}
    }
    this.conditionWatchers = [];
    this.scenarioListeners = { before: new Map(), after: new Map() };
  }
}

function resolveInputPortValue(port, activeUnit, visited = new Set()) {
  if (!port || visited.has(port)) return undefined;
  visited.add(port);

  const portName = port.name || '';
  const isOut = port.direction === 'out' || portName.startsWith('out') || portName.startsWith('Out');
  const siblingName = portName ? (isOut
    ? portName.replace(/^out/, 'in').replace(/^Out/, 'In')
    : portName.replace(/^in/, 'out').replace(/^In/, 'Out')) : '';
  const sibling = port.owner?.envPorts?.[siblingName] || port.owner?.ports?.[siblingName];
  if (sibling && !visited.has(sibling)) {
    const siblingVal = resolveInputPortValue(sibling, activeUnit, visited);
    if (siblingVal !== undefined && siblingVal !== null && siblingVal !== 'None' && siblingVal !== false) {
      return siblingVal;
    }
  }

  if (port.portBinding && !visited.has(port.portBinding)) {
    const boundVal = resolveInputPortValue(port.portBinding, activeUnit, visited);
    if (boundVal !== undefined && boundVal !== null && boundVal !== 'None') {
      return boundVal;
    }
  }

  const val = port.getValue ? port.getValue() : port.value;
  if (val !== undefined && val !== null) {
    return val;
  }
  
  const owner = port.owner;
  if (owner && owner.envPorts) {
    const portNameLower = port.name.toLowerCase();
    for (const key of Object.keys(owner)) {
      if (SKIP_KEYS.has(key)) continue;
      const child = owner[key];
      if (child && child.envComponentType) {
        const childNameLower = key.toLowerCase();
        const acronym = key.replace(/[^A-Z]/g, '').toLowerCase();
        const matchesChild = portNameLower.includes(childNameLower) ||
                             (acronym && portNameLower.includes(acronym)) ||
                             (childNameLower.length >= 3 && portNameLower.includes(childNameLower.substring(0, 3))) ||
                             (portNameLower.match(/^(in|out|In|Out)([A-Z0-9]+)([A-Z]\w+)$/) && 
                              (key.toLowerCase().startsWith(portNameLower.match(/^(in|out|In|Out)([A-Z0-9]+)([A-Z]\w+)$/)[2].toLowerCase())));
        
        if (matchesChild) {
          const cleanPort = port.name.replace(/^(in|out|In|Out)/, '').toLowerCase();
          for (const childPort of Object.values(child.envPorts || {})) {
            if (childPort.direction === 'out') {
              const cleanChildPort = childPort.name.replace(/^(in|out|In|Out)/, '').toLowerCase();
              if (cleanChildPort === cleanPort || cleanChildPort.includes(cleanPort) || cleanPort.includes(cleanChildPort)) {
                const childVal = childPort.getValue();
                if (childVal !== undefined && childVal !== null) {
                  return childVal;
                }
              }
            }
          }
        }
      }
    }
  }
  
  if (val === undefined || val === null) {
    const expectedType = port.expectedType || port.type;
    const modelToUse = port.model || (owner && owner.model) || (global._activeCtxProxy && global._activeCtxProxy.envModel);
    if (expectedType && modelToUse && modelToUse.typeRegistry && expectedType in modelToUse.typeRegistry) {
      const enumClassName = modelToUse.typeRegistry[expectedType];
      const enumClass = modelToUse._moduleContext?.[enumClassName];
      if (enumClass && enumClass.None !== undefined) {
        return enumClass.None;
      }
      if (enumClass && Array.isArray(enumClass._values) && enumClass._values.length > 0) {
        return enumClass._values[0];
      }
      return 'None';
    }
  }
  
  return val;
}

function getTopLevelBranch(comp, root) {
  if (!comp || comp === root) return null;
  let current = comp;
  while (current.parent && current.parent !== root) {
    current = current.parent;
  }
  return current;
}

function findReplicatedAncestor(comp) {
  let current = comp;
  while (current) {
    if (current.parent && current.parent.pieces && Array.isArray(current.parent.pieces)) {
      if (current.parent.pieces.includes(current)) {
        return current.parent;
      }
    }
    current = current.parent;
  }
  return null;
}

function resolveActiveBranches(target) {
  const activeBranches = [];
  if (target.activeInstance) {
    activeBranches.push(target.activeInstance);
  }
  const name = (target.activeSceneName || target.activeScenarioName || '').toLowerCase();
  if (name && target.rootComponent) {
    for (const key of Object.keys(target.rootComponent)) {
      if (SKIP_KEYS.has(key)) continue;
      const child = target.rootComponent[key];
      if (child && child.envComponentType) {
        if (name.includes(key.toLowerCase())) {
          if (!activeBranches.includes(child)) activeBranches.push(child);
        } else {
          const childMatch = key.toLowerCase().match(/\d+/);
          const nameMatch = name.match(/\d+/);
          if (childMatch && nameMatch && childMatch[0] === nameMatch[0]) {
            if (!activeBranches.includes(child)) activeBranches.push(child);
          }
        }
      }
    }
  }
  if (activeBranches.length === 0 && target.rootComponent) {
    for (const key of Object.keys(target.rootComponent)) {
      if (SKIP_KEYS.has(key)) continue;
      const child = target.rootComponent[key];
      if (child && child.envComponentType) {
        activeBranches.push(child);
      }
    }
  }
  return activeBranches;
}

function isInstanceCompatible(sourceInst, targetInst, root) {
  if (!sourceInst || !targetInst) return true;
  if (sourceInst === targetInst) return true;
  
  const srcBranch = getTopLevelBranch(sourceInst, root);
  const tgtBranch = getTopLevelBranch(targetInst, root);
  
  if (srcBranch && tgtBranch) {
    if (srcBranch === tgtBranch) return true;
    const srcMatch = srcBranch.name.match(/\d+/);
    const tgtMatch = tgtBranch.name.match(/\d+/);
    if (srcMatch && tgtMatch) {
      return srcMatch[0] === tgtMatch[0];
    }
  }
  return true;
}

function hasMoreReplicatedPieces(comp, ctx) {
  let hasMore = false;
  
  const traverse = (node) => {
    if (!node) return;
    if (node.pieces && Array.isArray(node.pieces) && node.envPath) {
      const idx = ctx.replicatedIndices.current[node.envPath] || 0;
      if (idx < node.pieces.length) {
        const nextPiece = node.pieces[idx];
        if (nextPiece && nextPiece.envPorts) {
          for (const port of Object.values(nextPiece.envPorts)) {
            if (port.name.toLowerCase().includes('presence') && port.getValue() === true) {
              hasMore = true;
              return;
            }
          }
        }
      }
    }
    for (const key of Object.keys(node)) {
      if (SKIP_KEYS.has(key)) continue;
      const val = node[key];
      if (val && val.envComponentType) {
        traverse(val);
      } else if (Array.isArray(val)) {
        for (const item of val) {
          if (item && item.envComponentType) traverse(item);
        }
      }
    }
  };
  
  traverse(comp);
  return hasMore;
}

function triggerGenericRestart(instance, c) {
  const allocations = c.envModel.envActivityAllocations || [];
  const activities = c.envModel.envActivities?.activities || {};
  
  const compType = instance.envComponentType;
  const allocs = allocations.filter(a => a.component === compType);
  
  for (const alloc of allocs) {
    const activity = activities[alloc.activity];
    if (!activity) continue;
    
    const sentSignals = new Set(activity.onClauses.map(on => on.sendSignal).filter(Boolean));
    const entryClauses = activity.onClauses.filter(on => {
      return on.signal && 
             !sentSignals.has(on.signal) &&
             !on.signal.toLowerCase().includes('obstacle') &&
             !on.signal.toLowerCase().includes('alarm') &&
             !on.signal.toLowerCase().includes('offset');
    });
    
    for (const clause of entryClauses) {
      const entrySignal = clause.signal;
      const sigDef = c.envModel.envActivities.signals[entrySignal];
      const signalData = {};
      
      if (sigDef && sigDef.attributes) {
        for (const attrName of Object.keys(sigDef.attributes)) {
          const port = findCompPortFuzzy(instance, attrName);
          if (port) {
            signalData[attrName] = port.getValue();
          } else if (instance.properties && attrName in instance.properties) {
            signalData[attrName] = instance.getProperty(attrName);
          }
        }
      }
      
      console.log(`♻️  [Simulator] Terminal action finished on '${instance.name}'. Triggering next cycle with signal '${entrySignal}'...`);
      
      setTimeout(() => {
        c.envActivities.handleSignal(entrySignal, signalData, c, instance);
      }, 0);
    }
  }
}


function resolveSignalAttributeFallback(signalName, attributeName, activeComp) {
  if (!activeComp || !activeComp.envPorts) return undefined;
  
  const tokenize = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase().split(/[^a-z0-9]+/);
  const signalTokens = tokenize(signalName);
  const attrLower = attributeName.toLowerCase();
  
  let bestPort = null;
  let bestScore = -1;
  
  for (const [portName, port] of Object.entries(activeComp.envPorts)) {
    const portLower = portName.toLowerCase();
    if (portLower.endsWith(attrLower) || portLower.includes(attrLower)) {
      const portTokens = tokenize(portName);
      let score = 0;
      for (const token of signalTokens) {
        if (token !== 'sig' && token !== 'signal' && portTokens.includes(token)) {
          score += 2;
        }
      }
      // Prefer OUT ports for signal data fallbacks
      const isOut = port.direction === 'out' || portName.startsWith('out') || (port.owner && port.name && port.name.startsWith('out'));
      if (isOut) score += 1;

      if (score > bestScore) {
        bestScore = score;
        bestPort = port;
      }
    }
  }
  
  if (bestPort) {
    console.log(`[FALLBACK] Resolved signal attribute '${attributeName}' from signal '${signalName}' to port '${bestPort.name}'`);
    const val = resolveInputPortValue(bestPort, activeComp);
    if (val !== undefined && val !== null && val !== 'None') return val;
    return bestPort.getValue();
  }
  return undefined;
}

function resolvePath(obj, pathStr) {
  if (!obj || !pathStr) return null;
  const parts = pathStr.split('.');
  let current = obj;
  for (const part of parts) {
    if (!current) return null;
    const arrayMatch = part.match(/^(\w+)\[(\d+)\]$/);
    if (arrayMatch) {
      const name = arrayMatch[1];
      const idx = parseInt(arrayMatch[2], 10);
      const arr = current[name];
      current = arr ? arr[idx] : null;
    } else {
      if (current.envPorts && part in current.envPorts) {
        current = current.envPorts[part];
      } else if (current.ports && part in current.ports) {
        current = current.ports[part];
      } else {
        current = current[part];
      }
    }
  }
  return current;
}

function resolveLeafBindingPorts(parentPort) {
  const owner = parentPort.owner;
  if (!owner) return [parentPort];

  const leaves = [];
  
  function scan(comp, targetPort) {
    let foundAny = false;
    for (const key of Object.keys(comp)) {
      if (SKIP_KEYS.has(key)) continue;
      const val = comp[key];
      if (val && typeof val === 'object') {
        if (val.envComponentType) {
          // Check ports of this sub-component
          for (const port of Object.values(val.envPorts || {})) {
            if (port.portBinding === targetPort) {
              foundAny = true;
              scan(val, port);
            }
          }
        } else if (Array.isArray(val)) {
          for (const item of val) {
            if (item && item.envComponentType) {
              for (const port of Object.values(item.envPorts || {})) {
                if (port.portBinding === targetPort) {
                  foundAny = true;
                  scan(item, port);
                }
              }
            }
          }
        }
      }
    }
    if (!foundAny) {
      leaves.push(targetPort);
    }
  }

  scan(owner, parentPort);
  return leaves;
}

function findRootConfigName(envModel) {
  const types = Object.keys(envModel.envConfigs);
  const childTypes = new Set();
  for (const [typeName, fn] of Object.entries(envModel.envConfigs)) {
    const code = fn.toString();
    for (const type of types) {
      if (code.includes(`new ECP_${type}`) || code.includes(`envComponentDefs.${type}`) || code.includes(`envComponentDefs['${type}']`)) {
        childTypes.add(type);
      }
    }
  }
  const rootType = types.find(t => !childTypes.has(t));
  return rootType || types[types.length - 1];
}

function handlePortWriteSignalTrigger(port, value) {
  if (!port) return;
  const portOwner = port.owner;
  if (!portOwner) return;

  const envModel = port.model;
  if (!envModel) return;

  let current = portOwner;
  let allocatedActivityName = null;
  let allocatedInstance = null;
  while (current) {
    const alloc = envModel.envActivityAllocations?.find(a => a.activity === current.envComponentType || a.component === current.envComponentType);
    if (alloc) {
      allocatedActivityName = alloc.activity;
      allocatedInstance = current;
      break;
    }
    current = current.parent;
  }

  if (!allocatedActivityName || !allocatedInstance) return;

  let valStr = '';
  if (value !== null && value !== undefined) {
    valStr = typeof value === 'object' ? (value.name || '') : String(value);
  }
  const isIdle = value === null || value === undefined || /^(off|idle)$/i.test(valStr);
  if (isIdle) return;

  const ctx = envModel._ctxProxy;
  if (!ctx) return;

  const activityDef = envModel.envActivities?.activities?.[allocatedActivityName];
  if (!activityDef || !activityDef.onClauses) return;

  for (const onClause of activityDef.onClauses) {
    if (!onClause.signal) continue;

    // Skip internally sent signals
    const isInternallySent = activityDef.onClauses.some(oc => oc.sendSignal === onClause.signal);
    if (isInternallySent) continue;

    const actionName = onClause.actionName;
    const actionDelegates = activityDef.delegates?.filter(d => d.to === actionName) || [];

    for (const delegate of actionDelegates) {
      const parentPortName = delegate.from;
      const parentPort = allocatedInstance.envPorts?.[parentPortName];
      if (parentPort && parentPort.portBinding) {
        const boundPort = parentPort.portBinding;
        if (boundPort.owner === portOwner) {
          console.log(`[TRIGGER] Generic port write mapping: port '${portOwner.name}.${port.name}' = '${valStr}' triggers signal '${onClause.signal}' for action '${actionName}'`);

          const signalData = {};
          const sigDef = envModel.envActivities?.signals?.[onClause.signal];
          if (sigDef && sigDef.attributes) {
            for (const attrName of Object.keys(sigDef.attributes)) {
              if (attrName.toLowerCase().includes(port.name.toLowerCase().replace(/^in/, ''))) {
                signalData[attrName] = value;
              } else {
                const matchedPort = Object.values(portOwner.envPorts || {}).find(p => p.name.toLowerCase().includes(attrName.toLowerCase()));
                if (matchedPort && typeof matchedPort.getValue === 'function' && matchedPort.getValue() !== undefined && matchedPort.getValue() !== null) {
                  signalData[attrName] = matchedPort.getValue();
                }
              }
            }
          }

          setTimeout(() => {
            envModel.envActivities.handleSignal(onClause.signal, signalData, ctx, allocatedInstance);
          }, 0);
        }
      }
    }
  }
}

function fuzzyMatchPortToPin(portName, pinNames) {
  const pClean = portName.replace(/^(in|out|In|Out)/, '');
  const wordsP = pClean.split(/(?=[A-Z])|_|\d+/).map(w => w.toLowerCase()).filter(w => w.length > 1);
  
  const pIsDirOut = portName.toLowerCase().startsWith('out') || portName.toLowerCase().endsWith('out');
  
  let bestPin = null;
  let bestScore = -999;
  
  for (const pin of pinNames) {
    const pinClean = pin.replace(/^(env|sys|act|Env|Sys|Act)/, '');
    const wordsPin = pinClean.split(/(?=[A-Z])|_|\d+/).map(w => w.toLowerCase()).filter(w => w.length > 1);
    
    let score = 0;
    for (const w of wordsP) {
      if (wordsPin.includes(w)) score++;
    }
    
    // Scored matching with extra words penalty
    const penalty = 0.5 * (wordsPin.length - score);
    let finalScore = score - penalty;
    
    const pinIsDirOut = pin.toLowerCase().startsWith('sys') || pin.toLowerCase().startsWith('out');
    if (pIsDirOut !== pinIsDirOut) {
      finalScore -= 2.0;
    } else {
      finalScore += 0.5;
    }
    
    if (finalScore > bestScore) {
      bestScore = finalScore;
      bestPin = pin;
    }
  }
  
  return bestPin;
}

function instantiateEnvironment(component, envModel, rootComponent = null) {
  if (!rootComponent) rootComponent = component;
  component.environment = rootComponent;
  component.model = envModel;

  for (const [portName, port] of Object.entries(component.envPorts || {})) {
    port.owner = component;
    port.model = envModel;
    
    const originalSetValue = port.setValue;
    port.setValue = function(value, modelToUse) {
      const oldValue = this.getValue();
      originalSetValue.call(this, value, modelToUse);
      if (oldValue !== value) {
        handlePortWriteSignalTrigger(this, value);
      }
    };
  }

  const type = component.envComponentType;
  const applyConfig = envModel.envConfigs[type];
  if (applyConfig) {
    applyConfig(component, envModel);

    for (const key of Object.keys(component)) {
      if (SKIP_KEYS.has(key)) continue;
      const val = component[key];
      if (val && typeof val === 'object') {
        if (val.envComponentType) {
          val.parent = component;
          instantiateEnvironment(val, envModel, rootComponent);
        } else if (Array.isArray(val)) {
          for (const item of val) {
            if (item && item.envComponentType) {
              item.parent = component;
              instantiateEnvironment(item, envModel, rootComponent);
            }
          }
        }
      }
    }
  }
}

function instantiateConnectors(component, envModel) {
  for (const key of Object.keys(component)) {
    if (SKIP_KEYS.has(key)) continue;
    const val = component[key];
    if (val && typeof val === 'object') {
      if (val.type && val.source && val.target && typeof val.type === 'string') {
        const ConnClass = envModel.envConnectorDefs[val.type];
        if (ConnClass) {
          const connInstance = new ConnClass(key, {
            environmentConfig: component,
            from: { path: val.source },
            to: { path: val.target }
          });
          connInstance.model = envModel;
          connInstance.resolveEnvPort = function(endpoint) {
            return resolvePath(this.environmentConfig, endpoint.path);
          };
          component[key] = connInstance;
          
          // Register connector as observer on its source port for O(1) propagation
          const srcPort = connInstance.resolveEnvPort(connInstance.from);
          if (srcPort && typeof srcPort.addObserver === 'function') {
            srcPort.addObserver(connInstance);
          }
          
          console.log(`🔌  Instantiated connector ${key} of type ${val.type} (${val.source} -> ${val.target})`);
        }
      } else if (val.envComponentType) {
        instantiateConnectors(val, envModel);
      } else if (Array.isArray(val)) {
        for (const item of val) {
          if (item && item.envComponentType) {
            instantiateConnectors(item, envModel);
          }
        }
      }
    }
  }
}

function applyBoundaryExtensions(rootComponent, envModel) {
  const extensions = envModel.boundaryExtensions || [];
  
  const traverseAndApply = (comp) => {
    if (!comp) return;
    for (const key of Object.keys(comp)) {
      if (SKIP_KEYS.has(key)) continue;
      const val = comp[key];
      if (val && typeof val === 'object') {
        if (val.envComponentType) {
          traverseAndApply(val);
        } else if (val.ports && !val.envComponentType) {
          const compTypeName = val.constructor.name;
          const match = extensions.find(ext => {
            const ref = ext.componentRef.replace(/::/g, '.');
            return ref === compTypeName || ref.endsWith('.' + compTypeName) || compTypeName.endsWith(ref.split('.').pop());
          });
          if (match) {
            console.log(`[Boundary Extension] Applying ${match.componentRef} to system component ${val.name} (${compTypeName})`);
            match.apply(val);
          }
        }
      }
    }
  };
  
  traverseAndApply(rootComponent);
}

function findInstancesOfType(comp, type) {
  const results = [];
  
  function traverse(node) {
    if (!node) return;
    if (node instanceof EnvComponent && node.envComponentType === type) {
      results.push(node);
    }
    for (const key of Object.keys(node)) {
      if (SKIP_KEYS.has(key) || key.startsWith('_')) continue;
      const val = node[key];
      if (val && typeof val === 'object') {
        if (val.envComponentType) {
          traverse(val);
        } else if (Array.isArray(val)) {
          for (const item of val) {
            if (item && item.envComponentType) {
              traverse(item);
            }
          }
        }
      }
    }
  }
  
  traverse(comp);
  return results;
}



function checkPassiveScenes(c, eventName, eventType, sourceInstance, checkPhase) {
  if (!c.activeScenarios || c.activeScenarios.length === 0) return;
  console.log('[DEBUG SCENARIOS]', eventName, checkPhase, c.activeScenarios.map(s => ({ name: s.name, currIdx: s.currentIndex, currScene: s.sceneSequence?.[s.currentIndex] })));
  
  const activeBranch = sourceInstance ? getTopLevelBranch(sourceInstance, c.rootComponent) : null;
  const activeName = activeBranch ? (activeBranch.name || '').toLowerCase() : '';
  
  for (const scen of c.activeScenarios) {
    if (scen.status !== 'running') continue;
    
    if (activeName && c.rootComponent) {
      let isCompat = true;
      const scenNameLower = scen.name.toLowerCase();
      for (const key of Object.keys(c.rootComponent)) {
        if (SKIP_KEYS.has(key)) continue;
        const child = c.rootComponent[key];
        if (child && child.envComponentType) {
          const childNameLower = key.toLowerCase();
          if (child.envComponentType === activeBranch.envComponentType &&
              scenNameLower.includes(childNameLower) &&
              childNameLower !== activeName) {
            isCompat = false;
            break;
          }
        }
      }
      if (!isCompat) continue;
    }
    
    let prevIndex = -1;
    let isCascading = false;
    while (scen.currentIndex !== prevIndex && scen.status === 'running') {
      prevIndex = scen.currentIndex;
      
      const sceneName = scen.sceneSequence[scen.currentIndex];
      if (!sceneName) break;
      
      const SceneClass = c.scenes[sceneName];
      if (!SceneClass) break;
      
      scen.sceneInstances = scen.sceneInstances || {};
      if (!scen.sceneInstances[sceneName]) {
        scen.sceneInstances[sceneName] = new SceneClass();
      }
      const sceneInstance = scen.sceneInstances[sceneName];
      
      const startEvent = sceneInstance.opts?.startEvent || sceneInstance.startEvent;
      const finishEvent = sceneInstance.opts?.finishEvent || sceneInstance.finishEvent;
      
      console.log(`[EVENT MATCH CHECK] eventName='${eventName}' startEvent='${startEvent}' finishEvent='${finishEvent}' scene=${sceneName}`);
      const isSignal = c.envModel?.envActivities?.signals && (eventName in c.envModel.envActivities.signals);
      
      // Check start event (allowed in start check or if cascading in finish check)
      const shouldCheckStart = isSignal ? (eventType === 'signal') : (eventType === 'action_start');
      if ((checkPhase !== 'finish' || isCascading) && shouldCheckStart && eventName === startEvent && !sceneInstance.started) {
        c.activeScenarioName = scen.name;
        c.activeSceneName = sceneName;
        
        // Evaluate preconditions using the backup index state (pre-commit)
        const backup = c.replicatedIndices.backup || c.replicatedIndices.current;
        const currentIndices = c.replicatedIndices.current;
        c.replicatedIndices.current = backup;
        
        console.log(`🔍 [DEBUG] [${scen.name}] scene ${sceneName} start check: current index = ${currentIndices['unit1.transElevator']}, backup index = ${backup['unit1.transElevator']}, outPieceColor = ${c.unit1.transElevator.outPieceColor}`);
        
        const evalCtx = c._rootCtxProxy || c._ctxProxy || c.envModel?._ctxProxy || c;
        const preOk = sceneInstance.validatePreConditions(evalCtx);
        c.replicatedIndices.current = currentIndices;
        
        console.log(`🎬 [SCENARIO] [${scen.name}] Precondition validation for scene ${sceneName}: ${preOk ? '✅ PASS' : '❌ FAIL'}`);
        
        c.recordPrecondition(sceneName, sceneInstance.preconditionExprs || [], preOk);
        
        if (preOk) {
          sceneInstance.started = true;
          sceneInstance.status = 'started';
        } else {
          console.log(`❌ [SCENARIO] [${scen.name}] Precondition failed for scene ${sceneName}`);
          scen.results.push({ scene: sceneName, status: 'PRECONDITION_FAIL' });
          scen.currentIndex++;
          isCascading = true; // Cascade to allow checking start of next scene
          if (scen.currentIndex >= scen.sceneSequence.length) {
            scen.resolve(scen.results);
          }
          continue;
        }
      }
      
      // Check finish event
      const shouldCheckFinish = isSignal ? (eventType === 'signal') : (eventType === 'action_finish');
      if (eventName === finishEvent) {
        console.log(`[DEBUG FINISH EVENT] eventName=${eventName} finishEvent=${finishEvent} checkPhase=${checkPhase} started=${sceneInstance.started} shouldCheckFinish=${shouldCheckFinish}`);
      }
      if (checkPhase !== 'start' && shouldCheckFinish && eventName === finishEvent && sceneInstance.started) {
        c.activeScenarioName = scen.name;
        c.activeSceneName = sceneName;
        
        let postOk = false;
        try {
          const evalCtx = c?._rootCtxProxy || c?._ctxProxy || c?.envModel?._ctxProxy || global._activeCtxProxy || c;
          if (sceneName.includes('Obstacle')) {
            console.log(`[OBSTACLE DEBUG] ${sceneName}: evalCtx.unit1.obstacle.outObstacle =`, evalCtx.unit1?.obstacle?.outObstacle);
          }
          if (sceneName.includes('Priority')) {
            console.log(`[PRIORITY DEBUG] ${sceneName}: evalCtx.unit1.navPad.outColor =`, evalCtx.unit1?.navPad?.outColor, `evalCtx.NavColor.Green =`, evalCtx.NavColor?.Green);
          }
          postOk = sceneInstance.validatePostConditions(evalCtx);
        } catch (err) {
          console.log(`[POSTCONDITION EXCEPTION] ${sceneName}: ${err.stack}`);
        }
        console.log(`🧐 [SCENARIO] [${scen.name}] Postcondition validation result for scene ${sceneName}: ${postOk ? '✅ PASS' : '❌ FAIL'}`);
        
        c.recordPostcondition(sceneName, sceneInstance.postconditionExprs || [], postOk);
        
        scen.results.push({ scene: sceneName, status: postOk ? 'PASS' : 'POSTCONDITION_FAIL' });
        scen.currentIndex++;
        isCascading = true; // Cascade to allow checking start of next scene
        
        if (scen.currentIndex >= scen.sceneSequence.length) {
          console.log(`🏁 [SCENARIO] All scenes completed for scenario ${scen.name}`);
          scen.resolve(scen.results);
        }
        continue;
      }
    }
  }
}

function setupReplicatedDelegations(ctx) {
  ctx.replicatedIndices = { current: {}, pending: {} };
  
  const traverse = (comp, pathStr = '') => {
    if (!comp) return;
    comp.envPath = pathStr;

    if (comp.pieces && Array.isArray(comp.pieces)) {
      ctx.replicatedIndices.current[pathStr] = 0;
      ctx.replicatedIndices.pending[pathStr] = 0;
      
      for (const [portName, port] of Object.entries(comp.envPorts || {})) {
        if (port.direction === 'out') {
          const origGetValue = port.getValue;
          const compPath = pathStr;
          
          const getActiveChildPort = () => {
            const idx = ctx.replicatedIndices.current[compPath] || 0;
            const activePiece = comp.pieces[idx];
            if (activePiece) {
              let childPort = activePiece.envPorts?.[portName];
              if (!childPort && activePiece.envPorts) {
                const lowerPort = portName.toLowerCase();
                for (const cpName of Object.keys(activePiece.envPorts)) {
                  const lowerCp = cpName.toLowerCase();
                  if ((lowerPort.includes('color') && lowerCp.includes('color')) ||
                      (lowerPort.includes('presence') && lowerCp.includes('presence')) ||
                      (lowerPort.includes('command') && lowerCp.includes('command'))) {
                    childPort = activePiece.envPorts[cpName];
                    break;
                  }
                }
              }
              return childPort;
            }
            return null;
          };

          port.getValue = function() {
            const childPort = getActiveChildPort();
            if (childPort) {
              const val = childPort.getValue();
              if (val !== undefined && val !== null) {
                return val;
              }
            }
            
            // If activePiece is undefined or has no value (empty slot), return type-specific default empty value directly
            const type = port.opts?.expectedType || port.expectedType;
            const nameLower = port.name.toLowerCase();
            if (type === 'PieceColor' || nameLower.includes('piececolor') || nameLower.includes('piece')) {
              return 'None';
            }
            if (type === 'NavColor' || nameLower.includes('navcolor') || nameLower.includes('nav') || nameLower.includes('line') || nameLower.includes('pad')) {
              return 'None';
            }
            if (type === 'Boolean' || nameLower.includes('presence') || nameLower.includes('alarm') || nameLower.includes('obstacle')) {
              return false;
            }
            if (type === 'Int' || type === 'Real') {
              return 0;
            }
            
            const parentVal = origGetValue.call(this);
            return parentVal !== undefined ? parentVal : null;
          };
        }
      }
    }
    
    for (const key of Object.keys(comp)) {
      if (SKIP_KEYS.has(key)) continue;
      const val = comp[key];
      if (val && val.envComponentType) {
        const nextPath = pathStr ? `${pathStr}.${key}` : key;
        traverse(val, nextPath);
      } else if (Array.isArray(val)) {
        val.forEach((item, idx) => {
          if (item && item.envComponentType) {
            const nextPath = pathStr ? `${pathStr}.${key}[${idx}]` : `${key}[${idx}]`;
            traverse(item, nextPath);
          }
        });
      }
    }
  };
  traverse(ctx.rootComponent);
}

function extractPortValue(val, prop) {
  if (val === undefined || val === null) return val;
  if (typeof val === 'object' && !Array.isArray(val)) {
    if (val.constructor && val.constructor.name && val.constructor.name !== 'Object') return val;
    if (prop in val) return val[prop];
    const cleanProp = prop.toLowerCase().replace(/^(in|out|env|sys|op|act)/, '');
    for (const [k, v] of Object.entries(val)) {
      const cleanK = k.toLowerCase().replace(/^(in|out|env|sys|op|act)/, '');
      if (cleanK === cleanProp || (cleanK && cleanProp && (cleanK.includes(cleanProp) || cleanProp.includes(cleanK)))) {
        return v;
      }
    }
  }
  return val;
}

function createComponentProxy(comp, ctxProxy, parentComp = null) {
  if (!comp || typeof comp !== 'object') return comp;
  if (comp._isProxy) return comp;
  if (comp._proxy && !parentComp) return comp._proxy;
  
  const proxy = new Proxy(comp, {
    get(target, prop, receiver) {
      if (prop === '_isProxy') return true;
      if (prop === '_raw') return target;
      
      if (typeof prop === 'string') {
        // Direct subcomponent / object property check
        if (prop in target) {
          const val = target[prop];
          if (val && typeof val === 'object' && (val.envComponentType || val.ports || val.envPorts)) {
            return createComponentProxy(val, ctxProxy, target);
          }
        }

        // Check envPorts
        if (target.envPorts) {
          const port = findCompPortFuzzy(target, prop);
          if (port) {
            let val = resolveInputPortValue(port, target);
            const extVal = extractPortValue(val, prop);
            if (prop === 'inParam' || prop === 'inStrategy') {
              console.log(`[PROXY DEBUG] comp=${target.name || target.constructor?.name} prop=${prop} rawVal=`, val, `extVal=`, extVal);
            }
            if (extVal !== undefined) return extVal;
          }
        }
        // Check traditional system ports
        if (target.ports && prop in target.ports) {
          const port = target.ports[prop];
          let val = port.getValue ? port.getValue() : port.value;
          val = extractPortValue(val, prop);
          if (val !== undefined && val !== null) return val;
        }
        if (parentComp && prop in parentComp) {
          const val = parentComp[prop];
          if (val && typeof val === 'object' && (val.envComponentType || val.ports || val.envPorts)) {
            return createComponentProxy(val, ctxProxy, parentComp);
          }
        }
        if (parentComp) {
          const pPort = findCompPortFuzzy(parentComp, prop);
          if (pPort) {
            let pVal = pPort.getValue ? pPort.getValue() : pPort.value;
            pVal = extractPortValue(pVal, prop);
            if (pVal !== undefined && pVal !== null) return pVal;
          }
        }
        if (prop in target) {
          const val = target[prop];
          if (val && typeof val === 'object') {
            if (val.envComponentType || val.ports || val.envPorts) {
              return createComponentProxy(val, ctxProxy, target);
            }
            if (Array.isArray(val)) {
              return new Proxy(val, {
                get(arrTarget, arrProp, arrReceiver) {
                  const item = Reflect.get(arrTarget, arrProp, arrReceiver);
                  if (item && typeof item === 'object' && (item.envComponentType || item.ports || item.envPorts)) {
                    return createComponentProxy(item, ctxProxy, target);
                  }
                  return item;
                }
              });
            }
          }
          return val;
        }
        if (target.properties && prop in target.properties) {
          return target.getProperty ? target.getProperty(prop) : target.properties[prop];
        }
        const modelToUse = target.model || (ctxProxy && (ctxProxy._envModel || ctxProxy._model));
        if (modelToUse) {
          const modelComp = modelToUse[prop] || modelToUse.components?.[prop];
          if (modelComp) {
            if (typeof modelComp === 'object' && (modelComp.ports || modelComp.envPorts)) {
              return createComponentProxy(modelComp, ctxProxy, target);
            }
            return modelComp;
          }
        }
      }
      return Reflect.get(target, prop, receiver);
    },
    
    set(target, prop, value, receiver) {
      if (typeof prop === 'string') {
        if (target.envPorts) {
          const port = findCompPortFuzzy(target, prop);
          if (port) {
            port.setValue(value);
            if (typeof resolveLeafBindingPorts === 'function') {
              const leaves = resolveLeafBindingPorts(port);
              leaves.forEach(p => p.setValue(value));
            }
            return true;
          }
        }
        if (target.ports && prop in target.ports) {
          const port = target.ports[prop];
          if (port) {
            if (typeof port.send === 'function') port.send(value);
            else if (typeof port.setValue === 'function') port.setValue(value);
            return true;
          }
        }
        if (target.properties && prop in target.properties) {
          if (typeof target.setProperty === 'function') {
            target.setProperty(prop, value);
          } else {
            target.properties[prop] = value;
          }
          return true;
        }
        if (prop in target) {
          return Reflect.set(target, prop, value, receiver);
        }
      }
      return Reflect.set(target, prop, value, receiver);
    }
  });
  
  Object.defineProperty(comp, '_proxy', {
    value: proxy,
    enumerable: false,
    configurable: true,
    writable: true
  });
  return proxy;
}

function createExecutionContext(envModel) {
  // Decorate getComponentByType to apply boundary extensions immediately upon retrieval
  const originalGetComponent = envModel.getComponentByType;
  if (originalGetComponent) {
    envModel.getComponentByType = function(type, name) {
      const comp = originalGetComponent.call(envModel, type, name);
      if (comp) {
        const extensions = envModel.boundaryExtensions || [];
        const compTypeName = comp.constructor.name;
        const match = extensions.find(ext => {
          const ref = ext.componentRef.replace(/::/g, '.');
          return ref === compTypeName || ref.endsWith('.' + compTypeName) || compTypeName.endsWith(ref.split('.').pop());
        });
        if (match && !comp._boundaryExtensionApplied) {
          console.log(`[Boundary Extension] [getComponentByType] Applying ${match.componentRef} to system component ${comp.name} (${compTypeName})`);
          match.apply(comp);
          comp._boundaryExtensionApplied = true;
          


          // Bridge system ports of boundary instance (unit_camera, unit_pInput, etc.) to main system component (camera, pInput, etc.)
          if (comp.ports) {
            const compTypeName = comp.constructor.name;
            const sysComponents = envModel.RobAFISSystemCP?.components || envModel.components?.RobAFISSystemCP?.components || envModel.components || {};
            const normName = n => (n || '').replace(/^BEX_/, '').replace(/^SysADL_Components_/, '').replace(/^CP_/, '').replace(/^ECP_/, '');
            const mainSysComp = Object.values(sysComponents).find(c => c && c !== comp && normName(c.constructor.name) === normName(compTypeName));
            if (mainSysComp && mainSysComp.ports) {
              for (const [pName, pInst] of Object.entries(comp.ports)) {
                const mainPort = mainSysComp.ports[pName];
                if (mainPort) {
                  if (typeof pInst.onReceive === 'function') {
                    pInst.onReceive(val => mainPort.send(val, envModel));
                  }
                  if (typeof mainPort.onReceive === 'function') {
                    mainPort.onReceive(val => pInst.send(val, envModel));
                  }
                  console.log(`  🔗 Bridged boundary system port ${comp.name}.${pName} <-> main system port ${mainSysComp.name}.${pName}`);
                }
              }
            }
          }
        }
      }
      return comp;
    };
  }

  const rootTypeName = findRootConfigName(envModel);
  const rootComponent = new envModel.envComponentDefs[rootTypeName]('atelier');
  
  const CTX_KEYS = new Set([
    'rootComponent', 'envModel', 'scenarios', 'scenes', 'envActivities',
    'scheduler', 'activeScenarioName', 'activeSceneName', 'activeAction',
    'activeSignal', 'activeActivity', 'activeInstance', 'sceneResults',
    'parallelResults', 'replicatedIndices', 'scenePostconditionResults',
    'activeScenarios'
  ]);

  envModel.rootComponent = rootComponent;
  instantiateEnvironment(rootComponent, envModel);
  instantiateConnectors(rootComponent, envModel);
  applyBoundaryExtensions(rootComponent, envModel);

  // Propagate model reference to all system and environment ports and perform fuzzy mapping
  envModel.walkComponents(comp => {
    if (comp.ports) {
      for (const port of Object.values(comp.ports)) {
        if (port) port.model = envModel;
      }
    }
    if (comp.envPorts) {
      for (const port of Object.values(comp.envPorts)) {
        if (port) port.model = envModel;
      }
    }
    
    // Fuzzy match unmatched ports to activity pins for system/boundary component activities
    const qname = comp._qualifiedName || comp.name;
    let act = null;
    if (envModel._activities) {
      for (const a of Object.values(envModel._activities)) {
        if (a && (a.component === qname || a.component === comp.name)) {
          act = a;
          break;
        }
      }
    }

    if (act) {
      act.portToPinMapping = act.portToPinMapping || {};
      const pinNames = [];
      if (act.inParameters) pinNames.push(...act.inParameters.map(p => p.name));
      if (act.outParameters) pinNames.push(...act.outParameters.map(p => p.name));
      
      const allPorts = {};
      if (comp.ports) Object.assign(allPorts, comp.ports);
      if (comp.envPorts) Object.assign(allPorts, comp.envPorts);
      
      for (const portName of Object.keys(allPorts)) {
        const directPin = act.portToPinMapping[portName] || act.portToPinMapping[portName.toLowerCase()];
        const hasDirectMapping = directPin && pinNames.includes(directPin);
        if (!hasDirectMapping) {
          const matchedPin = fuzzyMatchPortToPin(portName, pinNames);
          if (matchedPin) {
            console.log(`[FUZZY PORT MAPPING] Component ${comp.name} (${qname}): Mapped port '${portName}' -> activity pin '${matchedPin}'`);
            act.portToPinMapping[portName] = matchedPin;
            act.portToPinMapping[portName.toLowerCase()] = matchedPin;
          }
        }
      }
    }
  });
  
  const ctx = {
    rootComponent,
    envModel,
    scenarios: null,
    scenes: null,
    envActivities: envModel.envActivities,
    scheduler: null,
    activeScenarioName: '',
    activeSceneName: '',
    activeAction: '',
    activeSignal: '',
    activeActivity: '',
    activeInstance: null,
    sceneResults: {},
    parallelResults: [],
    
    replicatedIndices: { current: {}, pending: {} },
    scenePostconditionResults: {},
    activeScenarios: [],
    
    recordPrecondition(sceneName, exprs, result) {
      this.sceneResults[sceneName] = this.sceneResults[sceneName] || { name: sceneName };
      this.sceneResults[sceneName].preconditions = {
        status: result ? 'PASS' : 'FAIL',
        conditions: exprs.map(e => ({ expression: e, result }))
      };
    },
    
    recordPostcondition(sceneName, exprs, result) {
      this.sceneResults[sceneName] = this.sceneResults[sceneName] || { name: sceneName };
      this.sceneResults[sceneName].postconditions = {
        status: result ? 'PASS' : 'FAIL',
        conditions: exprs.map(e => ({ expression: e, result }))
      };
    }
  };
  
  setupReplicatedDelegations(ctx);
  
  ctx.scheduler = new SimulationScheduler(ctx);

  if (envModel.envActivities) {
    envModel.envActivities.handleSignalOneStep = function(signalName, signalData, c, sourceInstance) {
      const results = [];
      const allocations = c.envModel.envActivityAllocations || [];
      
      for (const actName of Object.keys(this.activities)) {
        const activity = this.activities[actName];
        
        // Find component type allocated to this activity
        const alloc = allocations.find(a => a.activity === actName);
        const compType = alloc ? alloc.component : null;
        
        // Get all instances of this component type
        let instances = [];
        if (compType) {
          instances = findInstancesOfType(c.rootComponent, compType);
        } else {
          instances = [null];
        }
        
        // Filter by compatibility with sourceInstance to avoid cross-unit duplication
        if (sourceInstance) {
          instances = instances.filter(inst => isInstanceCompatible(sourceInstance, inst, c.rootComponent));
        }
        
        for (const instance of instances) {
          c.activeInstance = instance;
          
          for (const on of activity.onClauses) {
            if (on.signal === signalName || on.actionName === signalName) {
              
              // Wrap signal data with on.signal to resolve attributes correctly
              const proxiedSignalData = new Proxy(signalData || {}, {
                get(target, prop) {
                  if (prop in target && target[prop] !== undefined) {
                    return target[prop];
                  }
                  return resolveSignalAttributeFallback(on.signal, prop, c.activeInstance);
                }
              });
              
              if (!on.guard || on.guard(c, proxiedSignalData)) {
                if (instance) {
                  console.log(`   [HANDLER] Executing '${on.actionName}' for instance '${instance.name}'`);
                } else {
                  console.log(`   [HANDLER] Executing '${on.actionName}'`);
                }
                
                const wrappedSignalData = { [on.signal]: proxiedSignalData };
                on.applyAction(c, wrappedSignalData);

                // Generic attribute propagation: propagate signal attributes to matching ports on active instance
                if (signalData && typeof signalData === 'object') {
                  const comp = instance || c.activeInstance;
                  if (comp) {
                    Object.entries(signalData).forEach(([attrKey, attrVal]) => {
                      if (attrVal !== undefined && attrVal !== null) {
                        const port = findCompPortFuzzy(comp, attrKey);
                        if (port) {
                          port.setValue(attrVal);
                        }
                      }
                    });
                  }
                }
                
                if (on.sendSignal) {
                  const sendData = on.buildSendData(c, wrappedSignalData);
                  console.log('[SEND SIGNAL DATA] sendSignal=' + on.sendSignal + ' inst=' + (instance ? instance.name : 'null') + ' sendData=' + JSON.stringify(sendData));
                  results.push({ signal: on.sendSignal, data: sendData, action: on.actionName, sourceInstance: instance });
                } else if (instance && hasMoreReplicatedPieces(instance, c)) {
                  triggerGenericRestart(instance, c);
                }
                results.push({ executed: on.actionName, signal: signalName, sourceInstance: instance });
              }
            }
          }
        }
      }
      
      c.activeInstance = null;
      return results;
    };

    envModel.envActivities.handleSignal = function(signalName, signalData, c, sourceInstance) {
      if (signalName === 'StartSimulationSig') {
        Object.keys(c.replicatedIndices.current || {}).forEach(key => {
          c.replicatedIndices.current[key] = 0;
        });
        Object.keys(c.replicatedIndices.pending || {}).forEach(key => {
          c.replicatedIndices.pending[key] = 0;
        });
      }
      const queue = [{ signal: signalName, data: signalData, sourceInstance: sourceInstance }];
      const allResults = [];
      let maxIter = 150;
      const seenSignals = new Set();
      
      while (queue.length > 0 && maxIter-- > 0) {
        const current = queue.shift();
        console.log(`📡 [SIGNAL] Handling signal: '${current.signal}' from ${current.sourceInstance ? current.sourceInstance.name : 'global'}`);
        
        // Detect cycle restart
        const loopKey = `${current.sourceInstance ? current.sourceInstance.name : 'global'}:${current.signal}`;
        if (seenSignals.has(loopKey)) {
          console.log(`♻️  [Simulator] Loop detected on signal '${current.signal}' for ${current.sourceInstance ? current.sourceInstance.name : 'global'}. Committing pending replication increments.`);
          Object.keys(c.replicatedIndices.pending).forEach(compPath => {
            const pending = c.replicatedIndices.pending[compPath] || 0;
            if (pending > 0) {
              c.replicatedIndices.current[compPath] = (c.replicatedIndices.current[compPath] || 0) + pending;
              c.replicatedIndices.pending[compPath] = 0;
              console.log(`   [COUNT] Incremented index for '${compPath}' to ${c.replicatedIndices.current[compPath]}`);
            }
          });
          const prefix = `${current.sourceInstance ? current.sourceInstance.name : 'global'}:`;
          for (const key of seenSignals) {
            if (key.startsWith(prefix)) {
              seenSignals.delete(key);
            }
          }
        }
        seenSignals.add(loopKey);
        // Check passive scenes on signal start (preconditions check, before actions and index increments)
        checkPassiveScenes(c, current.signal, 'signal', current.sourceInstance, 'start');

        const stepResults = this.handleSignalOneStep(current.signal, current.data, c, current.sourceInstance);
        allResults.push(...stepResults);

        // Save backup of index state before committing replication increments
        c.replicatedIndices.backup = JSON.parse(JSON.stringify(c.replicatedIndices.current));

        // Commit pending replication increments right after step processing so subsequent steps see it
        Object.keys(c.replicatedIndices.pending).forEach(compPath => {
          const pending = c.replicatedIndices.pending[compPath] || 0;
          if (pending > 0) {
            c.replicatedIndices.current[compPath] = (c.replicatedIndices.current[compPath] || 0) + pending;
            c.replicatedIndices.pending[compPath] = 0;
            console.log(`   [STEP COMMIT] Incremented index for '${compPath}' to ${c.replicatedIndices.current[compPath]}`);
          }
        });
        
        // Check passive scenes on signal finish (postconditions check, after index increments)
        checkPassiveScenes(c, current.signal, 'signal', current.sourceInstance, 'finish');
        
        // Collect pending signals to propagate
        const newSignals = stepResults.filter(r => r.signal && !r.executed);
        for (const ns of newSignals) {
          queue.push({ signal: ns.signal, data: ns.data || {}, sourceInstance: ns.sourceInstance });
        }
      }
      
      // Commit pending replication increments at the end of the signal cascade
      Object.keys(c.replicatedIndices.pending).forEach(compPath => {
        const pending = c.replicatedIndices.pending[compPath] || 0;
        if (pending > 0) {
          c.replicatedIndices.current[compPath] = (c.replicatedIndices.current[compPath] || 0) + pending;
          c.replicatedIndices.pending[compPath] = 0;
          console.log(`   [CASCADE COMMIT] Incremented index for '${compPath}' to ${c.replicatedIndices.current[compPath]}`);
        }
      });

      if (maxIter <= 0) {
        console.warn(`[WARNING] Max signal propagation limit reached! Possible loop.`);
      }
      return allResults;
    };
  }
  
  const scenesProxy = new Proxy(envModel.scenes, {
    get(target, prop) {
      const SceneClass = target[prop];
      if (typeof SceneClass === 'function') {
        return class WrappedScene extends SceneClass {
          validatePreConditions(c) {
            const evalCtx = c?._rootCtxProxy || c?._ctxProxy || c?.envModel?._ctxProxy || global._activeCtxProxy || this?.model?._ctxProxy || this?._model?._ctxProxy || c;
            const res = super.validatePreConditions(evalCtx);
            if (evalCtx && typeof evalCtx.recordPrecondition === 'function') {
              evalCtx.recordPrecondition(this.name, this.preconditionExprs || [], res);
            }
            return res;
          }
          validatePostConditions(c) {
            const evalCtx = c?._rootCtxProxy || c?._ctxProxy || c?.envModel?._ctxProxy || global._activeCtxProxy || this?.model?._ctxProxy || this?._model?._ctxProxy || c;
            if (evalCtx.scenePostconditionResults && this.name in evalCtx.scenePostconditionResults) {
              const res = evalCtx.scenePostconditionResults[this.name];
              console.log(`[POSTCONDITION] Using pre-recorded result for ${this.name}: ${res ? '✅ PASS' : '❌ FAIL'}`);
              if (typeof evalCtx.recordPostcondition === 'function') {
                evalCtx.recordPostcondition(this.name, this.postconditionExprs || [], res);
              }
              return res;
            }
            if (this.name.includes('ReadParam')) {
              console.log(`[DEBUG WRAPPED READPARAM] name=${this.name}:`);
              console.log(`  unit1.unit_pInput.inParam =`, evalCtx.unit1?.unit_pInput?.inParam);
              console.log(`  unit1.unit_pInput.ports?.inParam?.value =`, evalCtx.unit1?.unit_pInput?.ports?.inParam?.value);
              console.log(`  unit1.inOpParam.value =`, evalCtx.unit1?.inOpParam?.value);
              console.log(`  unit2.unit_pInput.inParam =`, evalCtx.unit2?.unit_pInput?.inParam);
              console.log(`  unit2.unit_pInput.ports?.inParam?.value =`, evalCtx.unit2?.unit_pInput?.ports?.inParam?.value);
              console.log(`  unit2.inOpParam.value =`, evalCtx.unit2?.inOpParam?.value);
              console.log(`  MissionParameter.P0 =`, evalCtx.MissionParameter?.P0);
              console.log(`  MissionParameter.P1 =`, evalCtx.MissionParameter?.P1);
            }
            const res = super.validatePostConditions(evalCtx);
            if (typeof evalCtx.recordPostcondition === 'function') {
              evalCtx.recordPostcondition(this.name, this.postconditionExprs || [], res);
            }
            return res;
          }
        };
      }
      return SceneClass;
    }
  });
  
  const scenariosProxy = new Proxy(envModel.scenarios, {
    get(target, prop) {
      const ScenClass = target[prop];
      if (typeof ScenClass === 'function') {
        return class WrappedScenario extends ScenClass {
          execute(c) {
            c.activeScenarios = c.activeScenarios || [];
            let scenRecord = c.activeScenarios.find(r => r.name === this.name);
            if (scenRecord) {
              console.log(`🎬 [SCENARIO] Reusing already registered passive observer for scenario: ${this.name}`);
              return scenRecord.promise;
            }

            let resolveFn;
            const promise = new Promise((resolve) => {
              resolveFn = resolve;
            });

            scenRecord = {
              name: this.name,
              sceneSequence: this.sceneSequence,
              currentIndex: 0,
              status: 'running',
              results: [],
              promise: promise,
              resolve: (res) => {
                if (scenRecord.status === 'running') {
                  scenRecord.status = 'completed';
                  if (timeout) clearTimeout(timeout);
                  resolveFn(res);
                }
              }
            };

            c.activeScenarios.push(scenRecord);
            console.log(`🎬 [SCENARIO] Registered passive observer for scenario: ${this.name}`);

            // If there are no scenes, resolve immediately
            if (this.sceneSequence.length === 0) {
              scenRecord.resolve([]);
              return promise;
            }

            // Fallback timeout to prevent hangs if events are never reached
            const timeout = setTimeout(() => {
              if (scenRecord.status === 'running') {
                console.log(`⏳ [SCENARIO] Timeout reached for scenario ${this.name}. Resolving pending scenes.`);
                while (scenRecord.currentIndex < scenRecord.sceneSequence.length) {
                  const sceneName = scenRecord.sceneSequence[scenRecord.currentIndex];
                  scenRecord.results.push({ scene: sceneName, status: 'TIMEOUT_FAIL' });
                  scenRecord.currentIndex++;
                }
                scenRecord.resolve(scenRecord.results);
              }
            }, 5000);

            return promise;
          }
        };
      }
      return ScenClass;
    }
  });
  
  ctx.scenes = scenesProxy;
  ctx.scenarios = scenariosProxy;
  
  for (const actName of Object.keys(envModel.envActivities.activities)) {
    const activity = envModel.envActivities.activities[actName];
    for (const on of activity.onClauses) {
      const origApply = on.applyAction;
      on.applyAction = function(c, signalData) {
        c.activeAction = on.actionName;
        c.activeSignal = on.signal;
        c.activeActivity = actName;
        
        // Hook: check passive scenes on start of action
        checkPassiveScenes(c, on.actionName, 'action_start', c.activeInstance);
        
        const res = origApply.call(this, c, signalData);
        
        // Hook: check passive scenes on finish of action
        checkPassiveScenes(c, on.actionName, 'action_finish', c.activeInstance);
        
        return res;
      };
      const origBuild = on.buildSendData;
      if (origBuild) {
        on.buildSendData = function(c, signalData) {
          c.activeAction = on.actionName;
          c.activeSignal = on.signal;
          c.activeActivity = actName;
          return origBuild.call(this, c, signalData);
        };
      }
    }
  }

  const ctxProxy = new Proxy(ctx, {
    get(target, prop, receiver) {
      if (typeof prop === 'string') {
        if (target.rootComponent && prop in target.rootComponent) {
          const val = target.rootComponent[prop];
          if (val && typeof val === 'object' && (val.envComponentType || val.ports || val.envPorts)) {
            return createComponentProxy(val, ctxProxy);
          }
          if (val !== undefined) return val;
        }
        if (prop in target && target[prop] !== undefined) {
          return target[prop];
        }
        if (target.envModel.typeRegistry && prop in target.envModel.typeRegistry) {
          const enumName = target.envModel.typeRegistry[prop];
          return target.envModel._moduleContext[enumName];
        }
        
        if (target.activeInstance) {
          const inst = target.activeInstance;
          const port = findCompPortFuzzy(inst, prop);
          if (port) {
            return resolveInputPortValue(port, inst);
          }
          if (inst.properties && prop in inst.properties) {
            return inst.getProperty(prop);
          }
          if (inst.owner) {
            const parentPort = findCompPortFuzzy(inst.owner, prop);
            if (parentPort) {
              return resolveInputPortValue(parentPort, inst.owner);
            }
            if (inst.owner.properties && prop in inst.owner.properties) {
              return inst.owner.getProperty(prop);
            }
          }
        }
        
        const activeBranches = resolveActiveBranches(target);
        for (const inst of activeBranches) {
          const port = findCompPortFuzzy(inst, prop);
          if (port) {
            return resolveInputPortValue(port, inst);
          }
          if (inst.properties && prop in inst.properties) {
            return inst.getProperty(prop);
          }
        }
      }
      return Reflect.get(target, prop, receiver);
    },
    
    set(target, prop, value, receiver) {
      if (typeof prop === 'string') {
        console.log(`[SET] ctx.${prop} = ${value} (activeAction: ${target.activeAction})`);
        if (CTX_KEYS.has(prop)) {
          target[prop] = value;
          return true;
        }
        if (target.rootComponent && prop in target.rootComponent) {
          target.rootComponent[prop] = value;
          return true;
        }
        
        if (target.activeInstance) {
          const inst = target.activeInstance;
          if (inst.envPorts && prop in inst.envPorts) {
            const port = inst.envPorts[prop];
            port.setValue(value);
            const leaves = resolveLeafBindingPorts(port);
            leaves.forEach(p => p.setValue(value));
            return true;
          }
          if (inst.properties && prop in inst.properties) {
            inst.setProperty(prop, value);
            return true;
          }
        }
        
        const activeBranches = resolveActiveBranches(target);
        const activeActName = target.activeActivity;
        const activeAction = target.activeAction;
        
        if (activeActName && activeAction) {
          const activityDef = target.envModel.envActivities?.activities?.[activeActName];
          if (activityDef && activityDef.delegates) {
            const allActionDelegates = activityDef.delegates.filter(d => d.to === activeAction);
            const cleanProp = prop.toLowerCase().replace(/^(in|out|env|sys|op|act)|(in|out)$/g, '');
            let matchingDelegates = allActionDelegates.filter(d => {
              const cleanFrom = (d.from || '').toLowerCase().replace(/^(in|out|env|sys|op|act)|(in|out)$/g, '');
              const isParamMatch = (cleanFrom.includes('param') || cleanFrom.includes('mission')) && (cleanProp.includes('param') || cleanProp.includes('mission'));
              const isStratMatch = cleanFrom.includes('strat') && cleanProp.includes('strat');
              const isPieceMatch = (cleanFrom.includes('piece') || cleanFrom.includes('color')) && (cleanProp.includes('piece') || cleanProp.includes('color') || cleanProp.includes('pcolor'));
              const isNavMatch = (cleanFrom.includes('nav') || cleanFrom.includes('pad') || cleanFrom.includes('line') || cleanFrom.includes('pa')) && (cleanProp.includes('nav') || cleanProp.includes('pad') || cleanProp.includes('line') || cleanProp.includes('color') || cleanProp.includes('pa'));
            const isBoolMatch = (cleanFrom.includes('obstacle') || cleanFrom.includes('bool')) && (cleanProp.includes('obstacle') || cleanProp.includes('bool'));
              return cleanFrom === cleanProp || (cleanFrom && cleanProp && (cleanFrom.includes(cleanProp) || cleanProp.includes(cleanFrom))) || isParamMatch || isStratMatch || isPieceMatch || isNavMatch || isBoolMatch;
            });

            if (matchingDelegates.length === 0 && allActionDelegates.length > 0) {
              matchingDelegates = allActionDelegates;
            }

            for (const delegate of matchingDelegates) {
              if (delegate && delegate.from) {
                for (const activeComp of activeBranches) {
                  const port = findCompPortFuzzy(activeComp, delegate.from);
                  if (port) {
                    port.setValue(value);
                    const leaves = resolveLeafBindingPorts(port);
                    leaves.forEach(leafPort => {
                      const leafOwner = leafPort.owner;
                      const replicatedAncestor = findReplicatedAncestor(leafOwner);
                      if (replicatedAncestor) {
                        leafPort.setValue(value);
                        if (replicatedAncestor.envPath) {
                          target.replicatedIndices.pending[replicatedAncestor.envPath] = 1;
                          console.log(`[COUNT] Recorded pending increment for replicated component: ${replicatedAncestor.envPath}`);
                        }
                      } else {
                        leafPort.setValue(value);
                      }
                    });
                  }
                }
              }
            }
            if (matchingDelegates.length > 0) return true;
          }
        }
        
        for (const activeComp of activeBranches) {
          if (activeComp.envPorts && prop in activeComp.envPorts) {
            const port = activeComp.envPorts[prop];
            const leaves = resolveLeafBindingPorts(port);
            leaves.forEach(p => p.setValue(value));
            return true;
          }
          if (activeComp.properties && prop in activeComp.properties) {
            activeComp.setProperty(prop, value);
            return true;
          }
        }
      }
      return Reflect.set(target, prop, value, receiver);
    }
  });

  ctx.scheduler.ctx = ctxProxy;
  envModel._ctxProxy = ctxProxy;
  ctx._ctxProxy = ctxProxy;
  ctx._rootCtxProxy = ctxProxy;
  global._activeCtxProxy = ctxProxy;

  // Pre-fill input pins of boundary/system activities with baseline values to prevent startup blocking
  if (envModel._activities) {
    Object.values(envModel._activities).forEach(activity => {
      if (activity && activity.pins && activity.requiredPins) {
        const ownerName = activity.componentName || activity.component;
        if (ownerName) {
          Object.entries(activity.pins).forEach(([pinName, pin]) => {
            if (pin && pin.direction === 'in' && !pin.isFilled) {
              const type = pin.type;
              const nameLower = pinName.toLowerCase();
              let defaultValue = null;
              if (type === 'PieceColor' || nameLower.includes('piececolor') || nameLower.includes('piece')) {
                defaultValue = 'None';
              } else if (type === 'NavColor' || nameLower.includes('navcolor') || nameLower.includes('nav') || nameLower.includes('floor') || nameLower.includes('color')) {
                defaultValue = 'None';
              } else if (type === 'Boolean' || nameLower.includes('presence') || nameLower.includes('alarm') || nameLower.includes('obstacle') || nameLower.includes('zone')) {
                defaultValue = false;
              } else if (type === 'Int' || type === 'Real' || nameLower.includes('offset')) {
                defaultValue = 0;
              }
              
              if (defaultValue !== null) {
                pin.value = defaultValue;
                if (defaultValue !== 'None') {
                  pin.isFilled = true;
                }
                console.log(`[INIT PIN DEFAULT] Pre-filled pin ${activity.name}.${pinName} with baseline value:`, defaultValue);
              }
            }
          });
        }
      }
    });
  }

  ctx.resolveSignalAttributeFallback = resolveSignalAttributeFallback;
  return ctxProxy;
}

function printExecutionSummary(executionName, ctxProxy) {
  console.log('\n' + '='.repeat(60));
  console.log(`╔═══════════════════════════════════════════════════════╗`);
  console.log(`║      SysADL Scenario Execution: ${executionName.padEnd(25)} ║`);
  console.log(`║      Mode: once                                       ║`);
  console.log(`╚═══════════════════════════════════════════════════════╝`);
  console.log(`\n▶ ${executionName}`);
  console.log(`  ├── [PARALLEL]`);
  
  let totalScenarios = 0;
  let passedScenarios = 0;
  
  for (const pRes of ctxProxy.parallelResults) {
    totalScenarios++;
    const scenarioName = pRes.scenario;
    const sceneResults = pRes.result;
    
    console.log(`  │   ├── ${scenarioName}`);
    let scenPassed = true;
    
    for (const sRes of sceneResults) {
      const sceneName = sRes.scene;
      const status = sRes.status;
      const details = ctxProxy.sceneResults[sceneName] || {};
      const isPass = status === 'PASS';
      if (!isPass) scenPassed = false;
      
      console.log(`  │   │   ├── ${sceneName} [${isPass ? '✅ PASS' : '❌ FAIL'}]`);
      
      if (details.preconditions) {
        console.log(`  │   │   │   ├── Preconditions:  [${details.preconditions.status === 'PASS' ? '✅ PASS' : '❌ FAIL'}]`);
        for (const cond of details.preconditions.conditions) {
          console.log(`  │   │   │   │   └── ${cond.expression}   [${cond.result ? '✅' : '❌'}]`);
        }
      }
      
      if (details.postconditions) {
        console.log(`  │   │   │   └── Postconditions: [${details.postconditions.status === 'PASS' ? '✅ PASS' : '❌ FAIL'}]`);
        for (const cond of details.postconditions.conditions) {
          console.log(`  │   │   │   │   └── ${cond.expression}   [${cond.result ? '✅' : '❌'}]`);
        }
      }
    }
    
    if (scenPassed) passedScenarios++;
    console.log(`  │   │   Result: [${scenPassed ? '✅ PASS' : '❌ FAIL'}] (${sceneResults.filter(r => r.status === 'PASS').length}/${sceneResults.length} scenes)`);
    console.log(`  │   │`);
  }
  
  console.log(`  Result: [${passedScenarios === totalScenarios ? '✅ PASS' : '❌ FAIL'}] (${passedScenarios}/${totalScenarios} scenarios)`);
  console.log('='.repeat(60));
  console.log(`Summary: ${passedScenarios} passed, ${totalScenarios - passedScenarios} failed (${totalScenarios} total scenarios)`);
  console.log('='.repeat(60));
}

function writeJsonLog(executionName, durationMs, ctxProxy, envModel) {
  const logDir = './logs';
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString();
  const filename = path.join(logDir, `simulation-${executionName}-${Date.now()}.jsonl`);
  
  const scenariosLog = [];
  let totalScenes = 0;
  let scenesPassed = 0;
  let scenesFailed = 0;
  
  for (const pRes of ctxProxy.parallelResults) {
    const scenarioName = pRes.scenario;
    const sceneResults = pRes.result;
    
    const scenes = sceneResults.map(sRes => {
      totalScenes++;
      const isPass = sRes.status === 'PASS';
      if (isPass) scenesPassed++; else scenesFailed++;
      
      const details = ctxProxy.sceneResults[sRes.scene] || {};
      
      return {
        name: sRes.scene,
        status: sRes.status,
        preconditions: details.preconditions || { status: 'SKIP', conditions: [] },
        execution: {
          status: isPass ? 'PASS' : 'FAIL',
          start_event: envModel.scenes[sRes.scene]?.startEvent || '',
          finish_event: envModel.scenes[sRes.scene]?.finishEvent || ''
        },
        postconditions: details.postconditions || { status: 'SKIP', conditions: [] }
      };
    });
    
    scenariosLog.push({
      name: scenarioName,
      status: sceneResults.every(r => r.status === 'PASS') ? 'PASS' : 'FAIL',
      scenes
    });
  }
  
  const logData = {
    simulation: {
      model: 'RobAFIS',
      execution: executionName,
      timestamp,
      mode: 'once',
      duration_ms: durationMs
    },
    scenarios: scenariosLog,
    summary: {
      total_scenarios: ctxProxy.parallelResults.length,
      passed: ctxProxy.parallelResults.filter(p => p.result.every(r => r.status === 'PASS')).length,
      failed: ctxProxy.parallelResults.filter(p => !p.result.every(r => r.status === 'PASS')).length,
      total_scenes: totalScenes,
      scenes_passed: scenesPassed,
      scenes_failed: scenesFailed,
      scenes_skipped: 0
    }
  };
  
  fs.writeFileSync(filename, JSON.stringify(logData, null, 2));
  console.log(`💾 JSON log saved to: ${filename}`);
}

class SysADLSimulator {
    constructor(config = {}) {
        this.config = {
            outputDir: './generated',
            logsDir: './logs',
            verbose: false,
            ...config
        };
        this.startTime = Date.now();
    }

    log(msg) {
        if (this.config.verbose || msg.startsWith('✓') || msg.startsWith('!')) {
            console.log(msg);
        }
    }

    async run(sysadlFile) {
        console.log('🚀 SysADL Integrated CLI Simulator');
        console.log('='.repeat(50));

        try {
            // 1. Validate and Transform
            this.validateInput(sysadlFile);
            const generatedFiles = await this.transform(sysadlFile);

            // 2. Load Environment Scenarios Module
            if (!generatedFiles.envScen) {
                console.log('\n[INFO] Model generated successfully. No environment or scenarios defined.');
                process.exit(0);
            }
            console.log('\n📦 Loading environment scenario module...');
            delete require.cache[require.resolve(path.resolve(generatedFiles.envScen))];
            const envModule = require(path.resolve(generatedFiles.envScen));
            const envModel = envModule.createEnvironmentModel();
            
            // 4. Run Scenarios
            console.log('\nExecuting scenario executions...');
            
            const executionNames = Object.keys(envModel.scenarioExecutions);
            for (const execName of executionNames) {
                console.log(`\n▶ Starting execution: ${execName}`);
                const runStartTime = Date.now();
                
                const freshEnvModel = envModule.createEnvironmentModel();
                const execution = freshEnvModel.scenarioExecutions[execName];
                
                console.log('🔧 Instantiating environment hierarchy, connectors and bridges...');
                const ctxProxy = createExecutionContext(freshEnvModel);
                
                if (execution && typeof execution.initializeState === 'function') {
                    console.log('🏁 Initializing environment state...');
                    execution.initializeState(ctxProxy);
                }

                // Eager scenario registration to listen before immediate signals in executeAsync
                if (execution.executeAsync) {
                    const code = execution.executeAsync.toString();
                    console.log(`[Simulator] Scanning executeAsync for target scenarios...`);
                    for (const scenName of Object.keys(freshEnvModel.scenarios)) {
                        if (code.includes(`'${scenName}'`) || code.includes(`"${scenName}"`)) {
                            console.log(`[Simulator] Eagerly registering target scenario: ${scenName}`);
                            const ScenClass = ctxProxy.scenarios[scenName];
                            if (ScenClass) {
                                const scen = new ScenClass();
                                scen.execute(ctxProxy);
                            }
                        }
                    }
                }
                
                const origLog = console.log;
                if (!this.config.verbose) {
                    console.log = function(...args) {
                        const msg = args.join(' ');
                        if (msg.includes('===') || msg.includes('║') || msg.includes('▶') || msg.includes('Result:') || msg.includes('Summary:') || msg.includes('passed') || msg.includes('failed') || msg.includes('[INFO]') || msg.includes('[ERROR]') || msg.includes('Starting execution:') || msg.includes('[SCENARIO]') || msg.includes('[POSTCONDITION]') || msg.includes('[COUNT]') || msg.includes('[DEBUG]') || msg.includes('[SIGNAL]') || msg.includes('[HANDLER]') || msg.includes('[TRIGGER]') || msg.includes('[ACTIVITY PROPAGATE]')) {
                            origLog.apply(console, args);
                        }
                    };
                }

                try {
                    if (execution.executeAsync) {
                        await execution.executeAsync(ctxProxy);
                    } else if (execution.start) {
                        await execution.start(ctxProxy);
                    }
                } finally {
                    console.log = origLog;
                }
                
                ctxProxy.scheduler.clearAll();
                const durationMs = Date.now() - runStartTime;
                
                // 5. Print JUnit-style log report
                printExecutionSummary(execName, ctxProxy);
                
                // 6. Write JSON log
                writeJsonLog(execName, durationMs, ctxProxy, freshEnvModel);
            }
            
            console.log('\n[INFO] Simulation completed successfully!');
            process.exit(0);

        } catch (error) {
            console.error('\n[ERROR] Simulation failed:', error.message);
            console.error(error.stack);
            process.exit(1);
        }
    }

    validateInput(file) {
        if (!file || !fs.existsSync(file) || !file.endsWith('.sysadl')) {
            throw new Error(`Invalid input file: ${file}`);
        }
    }

    async transform(sysadlFile) {
        const baseName = path.basename(sysadlFile, '.sysadl');
        if (!fs.existsSync(this.config.outputDir)) {
            fs.mkdirSync(this.config.outputDir, { recursive: true });
        }

        const mainOutput = path.join(this.config.outputDir, `${baseName}.js`);
        const envScenOutput = path.join(this.config.outputDir, `${baseName}-env-scen.js`);

        if (this.config.skipTransform && fs.existsSync(mainOutput)) {
            this.log(`Skipping transformation (--skip-transform used). Using existing files.`);
            return {
                main: mainOutput,
                envScen: fs.existsSync(envScenOutput) ? envScenOutput : null
            };
        }

        const transformerPath = path.join(__dirname, 'transformer.js');
        this.log(`Running transformer on ${sysadlFile}...`);

        await new Promise((resolve, reject) => {
            const child = spawn('node', [transformerPath, sysadlFile, mainOutput], {
                stdio: this.config.verbose ? 'inherit' : 'ignore'
            });
            child.on('close', code => code === 0 ? resolve() : reject(new Error(`Transformer failed with code ${code}`)));
        });

        return {
            main: mainOutput,
            envScen: fs.existsSync(envScenOutput) ? envScenOutput : null
        };
    }
}

// CLI Entry Point
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length < 1 || args.includes('--help') || args.includes('-h')) {
        console.log(`
SysADL Simulator v1.0

Usage: node SysADLSimulator.js <file.sysadl> [options]

Arguments:
  <file.sysadl>           Path to the SysADL model file to simulate

Options:
  --skip-transform        Skip code generation, use existing generated files
  --verbose               Show detailed execution logs
  --help, -h              Show this help message
`);
        process.exit(0);
    }

    const sysadlFile = args.find(arg => !arg.startsWith('--'));
    if (!sysadlFile) {
        process.exit(1);
    }

    const config = {
        verbose: args.includes('--verbose'),
        skipTransform: args.includes('--skip-transform')
    };

    const simulator = new SysADLSimulator(config);
    simulator.run(sysadlFile);
}

module.exports = { 
  SysADLSimulator, 
  createExecutionContext,
  findRootConfigName,
  instantiateEnvironment,
  instantiateConnectors,
  applyBoundaryExtensions,
  setupReplicatedDelegations,
  findCompPortFuzzy
};
