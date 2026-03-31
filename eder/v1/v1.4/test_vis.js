const fs = require('fs');
const { execSync } = require('child_process');

console.log("Running transformer...");
execSync('node transformer.js Simple.sysadl generated/Simple.js', { stdio: 'inherit' });

const jsCode = fs.readFileSync('generated/Simple.js', 'utf8');

// Mock browser env
global.window = {
  SysADLBase: require('./sysadl-framework/SysADLBase.js')
};

const prelude = [
  'var module = { exports: {} };',
  'var exports = module.exports;',
  'function require(p) { return global.window.SysADLBase; }'
].join('\n');
const suffix = '\nreturn module.exports;';
const code = prelude + '\n' + jsCode + suffix;

let modelModule = eval(`(function() {\n${code}\n})()`);
let model = modelModule.createModel();

const visualizerCode = fs.readFileSync('visualizer.js', 'utf8');
const extractFuncMatch = visualizerCode.match(/function extractArchitectureData[\s\S]*?(?=\n\/\/ Function to render the visualization)/);

let safeFuncCode = extractFuncMatch[0].replace('const warn =', 'const palette = {}; const warn =');
// Add debug logs to addConnectorEdges
safeFuncCode = safeFuncCode.replace(
  /function addConnectorEdges\(comp\) \{/,
  'function addConnectorEdges(comp) { console.log("[DEBUG] addConnectorEdges called for:", comp && comp.name);'
);
eval(safeFuncCode);

const result = extractArchitectureData(model, null);

console.log("Nodes:");
result.nodes.forEach(n => {
  console.log(`  [${n.id}] group="${n.group}" (x=${n.x}, y=${n.y}, parent=${n.parentId})`);
});

const portEdges = result.edges.filter(e => e.id.startsWith('conn:'));
console.log("\nConnector Edges:");
if (portEdges.length === 0) {
  console.log('  ❌ NO CONNECTOR EDGES FOUND! Total edges:', result.edges.length);
} else {
  portEdges.forEach(e => {
    console.log(`  ✅ [${e.id}] ${e.from} -> ${e.to}`);
  });
}

process.exit(0);
