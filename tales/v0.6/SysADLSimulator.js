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
  if (!comp || !comp.envPorts) return null;
  if (comp.envPorts[portName]) return comp.envPorts[portName];
  
  const portNameLower = portName.toLowerCase();
  if (comp.envPorts[portNameLower]) return comp.envPorts[portNameLower];
  
  // 1. Direct case-insensitive match or match after stripping in/out prefix/suffix
  const cleanPortName = portNameLower.replace(/^(in|out)/, '').replace(/(in|out)$/, '');
  
  for (const [key, port] of Object.entries(comp.envPorts)) {
    const keyLower = key.toLowerCase();
    if (keyLower === portNameLower) return port;
    
    const cleanKey = keyLower.replace(/^(in|out)/, '').replace(/(in|out)$/, '');
    if (cleanKey === cleanPortName) return port;
  }
  
  // 2. Fallback: substring matching on the stripped names
  for (const [key, port] of Object.entries(comp.envPorts)) {
    const keyLower = key.toLowerCase();
    const cleanKey = keyLower.replace(/^(in|out)/, '').replace(/(in|out)$/, '');
    if (cleanKey && cleanPortName && (cleanKey.includes(cleanPortName) || cleanPortName.includes(cleanKey))) {
      return port;
    }
  }
  // 3. Default: return first port if there is only one port
  const keys = Object.keys(comp.envPorts);
  if (keys.length === 1) {
    return comp.envPorts[keys[0]];
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
    
    if (this.ctx.reactiveWatcher && conditionExprStr) {
      try {
        const conditionId = `inject_${signalName}_cond_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
        this.ctx.reactiveWatcher.watchCondition(
          conditionId,
          conditionExprStr,
          () => {
            console.log(`⚡ [SCHEDULER] Condition met: ${conditionExprStr}. Injecting: ${signalName}`);
            if (this.ctx.envActivities) {
              this.ctx.envActivities.handleSignal(signalName, signalData, this.ctx);
            }
          },
          { maxTriggers: 1 }
        );
        this.conditionWatchers.push(() => this.ctx.reactiveWatcher.unwatchCondition(conditionId));
        return;
      } catch (e) {
        console.warn(`[SCHEDULER] Polling fallback triggered:`, e.message);
      }
    }

    // Polling fallback
    const interval = setInterval(() => {
      try {
        if (conditionFn()) {
          console.log(`⚡ [SCHEDULER] Condition met (polling). Injecting: ${signalName}`);
          clearInterval(interval);
          if (this.ctx.envActivities) {
            this.ctx.envActivities.handleSignal(signalName, signalData, this.ctx);
          }
        }
      } catch (e) {}
    }, 100);
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

function resolveInputPortValue(port, activeUnit) {
  if (!port) return undefined;
  
  if (port.direction !== 'in') {
    return port.getValue();
  }
  
  const val = port.getValue();
  if (val !== undefined && val !== null) {
    return val;
  }
  
  const outName = port.name.replace(/^in/, 'out').replace(/^In/, 'Out');
  const siblingOut = port.owner?.envPorts?.[outName];
  if (siblingOut) {
    const siblingVal = siblingOut.getValue();
    if (siblingVal !== undefined && siblingVal !== null) {
      return siblingVal;
    }
  }
  
  if (port.portBinding) {
    const targetPort = port.portBinding;
    if (typeof targetPort.getValue === 'function') {
      const targetVal = targetPort.getValue();
      if (targetVal !== undefined && targetVal !== null) {
        return targetVal;
      }
    }
    const targetOwner = targetPort.owner;
    if (targetOwner && targetOwner.envPorts) {
      const targetOutName = targetPort.name.replace(/^in/, 'out').replace(/^In/, 'Out');
      const targetSiblingOut = targetOwner.envPorts[targetOutName];
      if (targetSiblingOut) {
        const targetSiblingVal = targetSiblingOut.getValue();
        if (targetSiblingVal !== undefined && targetSiblingVal !== null) {
          return targetSiblingVal;
        }
      }
      const targetClean = targetPort.name.replace(/^(in|out|In|Out)/, '').toLowerCase();
      for (const sibling of Object.values(targetOwner.envPorts)) {
        if (sibling.direction === 'out') {
          const sibClean = sibling.name.replace(/^(in|out|In|Out)/, '').toLowerCase();
          if (sibClean === targetClean || sibClean.includes(targetClean) || targetClean.includes(sibClean)) {
            const sibVal = sibling.getValue();
            if (sibVal !== undefined && sibVal !== null) {
              return sibVal;
            }
          }
        }
      }
    }
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
  
  const signalTokens = signalName.toLowerCase().split(/[^a-z0-9]+/);
  const attrLower = attributeName.toLowerCase();
  
  let bestPort = null;
  let bestScore = -1;
  
  for (const [portName, port] of Object.entries(activeComp.envPorts)) {
    const portLower = portName.toLowerCase();
    if (portLower.endsWith(attrLower)) {
      const portTokens = portName.toLowerCase().split(/[^a-z0-9]+/);
      let score = 0;
      for (const token of signalTokens) {
        if (token !== 'sig' && token !== 'signal' && portTokens.includes(token)) {
          score++;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestPort = port;
      }
    }
  }
  
  if (bestPort) {
    console.log(`[FALLBACK] Resolved signal attribute '${attributeName}' from signal '${signalName}' to port '${bestPort.name}'`);
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

function instantiateEnvironment(component, envModel, rootComponent = null) {
  if (!rootComponent) rootComponent = component;
  component.environment = rootComponent;
  component.model = envModel;

  for (const [portName, port] of Object.entries(component.envPorts || {})) {
    port.owner = component;
    port.model = envModel;
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
            
            for (const [portName, envPort] of Object.entries(val.envPorts || {})) {
              const sysPort = val.ports?.[portName];
              if (sysPort) {
                envPort.model = envModel;
                envPort.bindToPort(sysPort);
                console.log(`  🔗 Implicitly bound envPort ${val.name}.${portName} <-> systemPort ${val.name}.${portName}`);
              }
            }
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
  if (!c.activeScenarios) return;
  
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
        
        const preOk = sceneInstance.validatePreConditions(c);
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
      if (checkPhase !== 'start' && shouldCheckFinish && eventName === finishEvent && sceneInstance.started) {
        c.activeScenarioName = scen.name;
        c.activeSceneName = sceneName;
        
        const postOk = sceneInstance.validatePostConditions(c);
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

function createComponentProxy(comp, ctxProxy) {
  if (!comp || typeof comp !== 'object') return comp;
  if (comp._isProxy) return comp;
  if (comp._proxy) return comp._proxy;
  
  const proxy = new Proxy(comp, {
    get(target, prop, receiver) {
      if (prop === '_isProxy') return true;
      if (prop === '_raw') return target;
      
      if (typeof prop === 'string') {
        if (prop in target) {
          const val = target[prop];
          if (val && typeof val === 'object') {
            if (val.envComponentType) {
              return createComponentProxy(val, ctxProxy);
            }
            if (Array.isArray(val)) {
              return new Proxy(val, {
                get(arrTarget, arrProp, arrReceiver) {
                  const item = Reflect.get(arrTarget, arrProp, arrReceiver);
                  if (item && typeof item === 'object' && item.envComponentType) {
                    return createComponentProxy(item, ctxProxy);
                  }
                  return item;
                }
              });
            }
          }
          return val;
        }
        if (target.envPorts) {
          const port = findCompPortFuzzy(target, prop);
          if (port) {
            return port.getValue ? port.getValue() : port.value;
          }
        }
        if (target.properties && prop in target.properties) {
          return target.getProperty ? target.getProperty(prop) : target.properties[prop];
        }
      }
      return Reflect.get(target, prop, receiver);
    },
    
    set(target, prop, value, receiver) {
      if (typeof prop === 'string') {
        if (prop in target) {
          return Reflect.set(target, prop, value, receiver);
        }
        if (target.envPorts) {
          const port = findCompPortFuzzy(target, prop);
          if (port) {
            port.setValue(value);
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
              
              if (!on.guard || on.guard(c)) {
                if (instance) {
                  console.log(`   [HANDLER] Executing '${on.actionName}' for instance '${instance.name}'`);
                } else {
                  console.log(`   [HANDLER] Executing '${on.actionName}'`);
                }
                
                const wrappedSignalData = { [on.signal]: proxiedSignalData };
                on.applyAction(c, wrappedSignalData);
                
                if (on.sendSignal) {
                  const sendData = on.buildSendData(c, wrappedSignalData);
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
        
        const stepResults = this.handleSignalOneStep(current.signal, current.data, c, current.sourceInstance);
        allResults.push(...stepResults);
        
        // Check passive scenes on signal start (preconditions check, before index increments)
        checkPassiveScenes(c, current.signal, 'signal', current.sourceInstance, 'start');

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
            const res = super.validatePreConditions(c);
            c.recordPrecondition(this.name, this.preconditionExprs || [], res);
            return res;
          }
          validatePostConditions(c) {
            if (c.scenePostconditionResults && this.name in c.scenePostconditionResults) {
              const res = c.scenePostconditionResults[this.name];
              console.log(`[POSTCONDITION] Using pre-recorded result for ${this.name}: ${res ? '✅ PASS' : '❌ FAIL'}`);
              c.recordPostcondition(this.name, this.postconditionExprs || [], res);
              return res;
            }
            const res = super.validatePostConditions(c);
            c.recordPostcondition(this.name, this.postconditionExprs || [], res);
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
        if (prop in target) {
          return target[prop];
        }
        if (target.rootComponent && prop in target.rootComponent) {
          const val = target.rootComponent[prop];
          if (val && typeof val === 'object' && val.envComponentType) {
            return createComponentProxy(val, ctxProxy);
          }
          return val;
        }
        if (target.envModel.typeRegistry && prop in target.envModel.typeRegistry) {
          const enumName = target.envModel.typeRegistry[prop];
          return target.envModel._moduleContext[enumName];
        }
        
        if (target.activeInstance) {
          const inst = target.activeInstance;
          if (inst.envPorts && prop in inst.envPorts) {
            return resolveInputPortValue(inst.envPorts[prop], inst);
          }
          if (inst.properties && prop in inst.properties) {
            return inst.getProperty(prop);
          }
        }
        
        const activeBranches = resolveActiveBranches(target);
        for (const inst of activeBranches) {
          if (inst.envPorts && prop in inst.envPorts) {
            return resolveInputPortValue(inst.envPorts[prop], inst);
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
            const delegate = activityDef.delegates.find(d => d.to === activeAction);
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
                      if (leafPort.direction === 'in') {
                        leafPort.setValue(value);
                      } else {
                        target[prop] = value;
                      }
                      if (replicatedAncestor.envPath) {
                        target.replicatedIndices.pending[replicatedAncestor.envPath] = 1;
                        console.log(`[COUNT] Recorded pending increment for replicated component: ${replicatedAncestor.envPath}`);
                      }
                    } else {
                      leafPort.setValue(value);
                    }
                  });
                  return true;
                }
              }
            }
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
                        if (msg.includes('===') || msg.includes('║') || msg.includes('▶') || msg.includes('Result:') || msg.includes('Summary:') || msg.includes('passed') || msg.includes('failed') || msg.includes('[INFO]') || msg.includes('[ERROR]') || msg.includes('Starting execution:') || msg.includes('[SCENARIO]') || msg.includes('[POSTCONDITION]') || msg.includes('[COUNT]') || msg.includes('[DEBUG]')) {
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
            if (this.config.verbose) console.error(error.stack);
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

module.exports = SysADLSimulator;
