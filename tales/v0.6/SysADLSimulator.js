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

class SimulationScheduler {
  constructor(ctx) {
    this.ctx = ctx;
    this.timers = [];
  }
  
  scheduleInject(signalName, signalData, delayMs) {
    console.log(`⏱️  [SCHEDULER] Scheduled injection: ${signalName} in ${delayMs}ms`);
    const timer = setTimeout(() => {
      console.log(`⚡ [SCHEDULER] Injecting signal: ${signalName}`);
      if (this.ctx.envActivities) {
        const results = this.ctx.envActivities.handleSignal(signalName, signalData, this.ctx);
        let pending = results.filter(r => r.signal);
        let maxIter = 100;
        while (pending.length > 0 && maxIter-- > 0) {
          const next = [];
          for (const p of pending) {
            const sub = this.ctx.envActivities.handleSignal(p.signal, p.data || {}, this.ctx);
            next.push(...sub.filter(r => r.signal));
          }
          pending = next;
        }
      }
    }, delayMs);
    this.timers.push(timer);
  }
  
  clearAll() {
    for (const t of this.timers) {
      clearTimeout(t);
    }
    this.timers = [];
  }
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
      if (key === 'environment' || key === 'model' || key === 'owner' || key === 'parent') continue;
      const val = component[key];
      if (val && typeof val === 'object') {
        if (val.envComponentType) {
          instantiateEnvironment(val, envModel, rootComponent);
        } else if (Array.isArray(val)) {
          for (const item of val) {
            if (item && item.envComponentType) {
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
    if (key === 'environment' || key === 'model' || key === 'owner' || key === 'parent') continue;
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
      if (key === 'environment' || key === 'model' || key === 'owner' || key === 'parent') continue;
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

function getActiveUnit(ctxProxy) {
  const name = ctxProxy.activeSceneName || ctxProxy.activeScenarioName || '';
  if (name.includes('Unit2')) {
    return ctxProxy.rootComponent.unit2;
  }
  return ctxProxy.rootComponent.unit1;
}

function getActiveOperator(ctxProxy) {
  const name = ctxProxy.activeSceneName || ctxProxy.activeScenarioName || '';
  if (name.includes('operator2') || name.includes('Unit2')) {
    return ctxProxy.rootComponent.operator2;
  }
  return ctxProxy.rootComponent.operator1;
}

function createExecutionContext(envModel) {
  const rootTypeName = findRootConfigName(envModel);
  const rootComponent = new envModel.envComponentDefs[rootTypeName]('atelier');
  
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
    sceneResults: {},
    parallelResults: [],
    
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
  
  ctx.scheduler = new SimulationScheduler(ctx);
  
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
          async execute(c) {
            c.activeScenarioName = this.name;
            const origSequence = this.sceneSequence;
            const res = [];
            for (const sceneName of origSequence) {
              c.activeSceneName = sceneName;
              const SceneClass = c.scenes[sceneName];
              if (!SceneClass) {
                res.push({ scene: sceneName, status: 'NOT_FOUND' });
                continue;
              }
              const sceneInstance = new SceneClass();
              
              const preOk = sceneInstance.validatePreConditions(c);
              if (!preOk) {
                res.push({ scene: sceneName, status: 'PRECONDITION_FAIL' });
                continue;
              }
              
              if (c.envActivities) {
                const chain = c.envActivities.handleSignal(sceneInstance.opts?.startEvent || sceneInstance.startEvent, {}, c);
                let pending = chain.filter(r => r.signal);
                let maxIter = 100;
                while (pending.length > 0 && maxIter-- > 0) {
                  const next = [];
                  for (const p of pending) {
                    const sub = c.envActivities.handleSignal(p.signal, p.data || {}, c);
                    next.push(...sub.filter(r => r.signal));
                  }
                  pending = next;
                }
              }
              
              let postOk = false;
              const startTime = Date.now();
              const timeout = 2000;
              while (Date.now() - startTime < timeout) {
                postOk = sceneInstance.validatePostConditions(c);
                if (postOk) break;
                await new Promise(r => setTimeout(r, 5));
              }
              res.push({ scene: sceneName, status: postOk ? 'PASS' : 'POSTCONDITION_FAIL' });
            }
            return res;
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
        return origApply.call(this, c, signalData);
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
          return target.rootComponent[prop];
        }
        if (target.envModel.typeRegistry && prop in target.envModel.typeRegistry) {
          const enumName = target.envModel.typeRegistry[prop];
          return target.envModel._moduleContext[enumName];
        }
        
        const activeUnit = getActiveUnit(receiver);
        if (activeUnit && activeUnit.envPorts && prop in activeUnit.envPorts) {
          return activeUnit.envPorts[prop].getValue();
        }
        if (activeUnit && activeUnit.properties && prop in activeUnit.properties) {
          return activeUnit.getProperty(prop);
        }
        
        const activeOperator = getActiveOperator(receiver);
        if (activeOperator && activeOperator.envPorts && prop in activeOperator.envPorts) {
          return activeOperator.envPorts[prop].getValue();
        }
        if (activeOperator && activeOperator.properties && prop in activeOperator.properties) {
          return activeOperator.getProperty(prop);
        }
      }
      return Reflect.get(target, prop, receiver);
    },
    
    set(target, prop, value, receiver) {
      if (typeof prop === 'string') {
        if (prop in target) {
          target[prop] = value;
          return true;
        }
        if (target.rootComponent && prop in target.rootComponent) {
          target.rootComponent[prop] = value;
          return true;
        }
        
        const activeUnit = getActiveUnit(receiver);
        const activeOperator = getActiveOperator(receiver);
        
        if (prop === 'colorIn') {
          const action = receiver.activeAction;
          if (['leavePA', 'turnRight', 'returnJourney', 'obstacleDetected', 'obstacleRemoved', 'arriveAtPA'].includes(action)) {
            if (action === 'arriveAtPA') {
              activeUnit.envPorts.outUnitPAColor.setValue(value);
            } else {
              activeUnit.envPorts.outUnitNavLine.setValue(value);
            }
            return true;
          } else if (['detectGreenPad', 'detectRedPad', 'stopAtT', 'routeToSA', 'routeToSPD', 'stopAtSPE', 'arriveAtTargetStock'].includes(action)) {
            activeUnit.envPorts.outUnitNavPad.setValue(value);
            return true;
          }
        } else if (prop === 'pieceIn') {
          const action = receiver.activeAction;
          if (action === 'extractPieceT' || action === 'extractPieceSPE') {
            activeUnit.envPorts.outUnitPieceColor.setValue(value);
            return true;
          } else if (action === 'insertPieceSA') {
            activeUnit.envPorts.outSAPieceColor.setValue(value);
            return true;
          } else if (action === 'insertPieceSPD') {
            activeUnit.envPorts.outSPDPieceColor.setValue(value);
            return true;
          }
        } else if (prop === 'paramIn') {
          activeOperator.envPorts.outParam.setValue(value);
          return true;
        }
        
        if (activeUnit && activeUnit.envPorts && prop in activeUnit.envPorts) {
          activeUnit.envPorts[prop].setValue(value);
          return true;
        }
        if (activeUnit && activeUnit.properties && prop in activeUnit.properties) {
          activeUnit.setProperty(prop, value);
          return true;
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
            console.log('\n📦 Loading environment scenario module...');
            delete require.cache[require.resolve(path.resolve(generatedFiles.envScen))];
            const envModule = require(path.resolve(generatedFiles.envScen));
            const envModel = envModule.createEnvironmentModel();
            
            // 3. Create Execution Context Proxy
            console.log('🔧 Instantiating environment hierarchy, connectors and bridges...');
            const ctxProxy = createExecutionContext(envModel);
            
            // 4. Run Scenarios
            console.log('\nExecuting scenario executions...');
            
            for (const [execName, execution] of Object.entries(envModel.scenarioExecutions)) {
                console.log(`\n▶ Starting execution: ${execName}`);
                const runStartTime = Date.now();
                
                if (execution.executeAsync) {
                    await execution.executeAsync(ctxProxy);
                } else if (execution.start) {
                    await execution.start(ctxProxy);
                }
                
                ctxProxy.scheduler.clearAll();
                const durationMs = Date.now() - runStartTime;
                
                // 5. Print JUnit-style log report
                printExecutionSummary(execName, ctxProxy);
                
                // 6. Write JSON log
                writeJsonLog(execName, durationMs, ctxProxy, envModel);
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
