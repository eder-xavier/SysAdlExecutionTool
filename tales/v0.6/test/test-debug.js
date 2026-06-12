const envModule = require('../generated/RobAFIS.complete-env-scen');
const envModel = envModule.createEnvironmentModel();

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
  
  if (port.portBinding && typeof port.portBinding.getValue === 'function') {
    const targetPort = port.portBinding;
    const targetVal = targetPort.getValue();
    if (targetVal !== undefined && targetVal !== null) {
      return targetVal;
    }
    if (targetPort.direction === 'in') {
      const targetOutName = targetPort.name.replace(/^in/, 'out').replace(/^In/, 'Out');
      const targetSiblingOut = targetPort.owner?.envPorts?.[targetOutName];
      if (targetSiblingOut) {
        const targetSiblingVal = targetSiblingOut.getValue();
        if (targetSiblingVal !== undefined && targetSiblingVal !== null) {
          return targetSiblingVal;
        }
      }
    }
  }
  
  return val;
}

function findInstancesOfType(comp, type) {
  const results = [];
  
  function traverse(node) {
    if (!node) return;
    if (node.envComponentType === type) {
      results.push(node);
    }
    for (const key of Object.keys(node)) {
      if (key === 'environment' || key === 'model' || key === 'owner' || key === 'parent') continue;
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

// Instantiate the environment
const rootTypeName = Object.keys(envModel.envConfigs).find(t => {
  return t.includes('Atelier') || t.includes('atelier') || t.includes('Environment');
});
const rootComponent = new envModel.envComponentDefs[rootTypeName]('atelier');
envModel.rootComponent = rootComponent;

// Run the instantiation logic similar to SysADLSimulator.js
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

instantiateEnvironment(rootComponent, envModel);

// Now apply initial assignments:
console.log('--- Setting unit1.transElevator.pieces[0].outPresence = true ---');
rootComponent.unit1.transElevator.pieces[0].envPorts.outPresence.setValue(true);

console.log('Checking port binding on unit1.inTPresence:');
const inTPresencePort = rootComponent.unit1.envPorts.inTPresence;
console.log('  - name:', inTPresencePort.name);
console.log('  - owner name:', inTPresencePort.owner.name);
console.log('  - portBinding name:', inTPresencePort.portBinding?.name);
console.log('  - portBinding owner name:', inTPresencePort.portBinding?.owner?.name);
console.log('  - portBinding direction:', inTPresencePort.portBinding?.direction);

console.log('Checking resolveInputPortValue(inTPresencePort, unit1):');
const resolvedVal = resolveInputPortValue(inTPresencePort, rootComponent.unit1);
console.log('  - resolved value:', resolvedVal);
