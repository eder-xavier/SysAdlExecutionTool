#!/usr/bin/env node
/**
 * SysADL Parser Test Script
 * 
 * Parses a .sysadl file with the new grammar and reports:
 * 1. Whether parsing succeeded
 * 2. All AST node types found (especially new env/scen types)
 * 3. Summary of key elements
 */

const fs = require('fs');
const path = require('path');

// Load the parser
const parserPath = path.join(__dirname, '..', 'sysadl-parser.js');
if (!fs.existsSync(parserPath)) {
    console.error(`[ERROR] Parser not found at: ${parserPath}`);
    process.exit(1);
}
const parser = require(parserPath);

// Get input file
const inputFile = process.argv[2];
if (!inputFile) {
    console.error('Usage: node test-parser.js <file.sysadl>');
    process.exit(1);
}

const filePath = path.resolve(inputFile);
if (!fs.existsSync(filePath)) {
    console.error(`[ERROR] File not found: ${filePath}`);
    process.exit(1);
}

const source = fs.readFileSync(filePath, 'utf8');
console.log(`\n📄 Parsing: ${path.basename(filePath)}`);
console.log(`   Size: ${source.length} bytes, ${source.split('\n').length} lines`);
console.log('='.repeat(60));

// Parse
let ast;
try {
    ast = parser.parse(source);
    console.log('\n✅ PARSING SUCCEEDED\n');
} catch (e) {
    console.error('\n❌ PARSING FAILED\n');
    console.error(`   Location: Line ${e.location?.start?.line}, Column ${e.location?.start?.column}`);
    console.error(`   Expected: ${e.expected?.map(e => e.description || e.text || JSON.stringify(e)).join(' | ')}`);
    console.error(`   Found:    ${e.found ? JSON.stringify(e.found) : 'end of input'}`);
    
    // Show context around the error
    if (e.location) {
        const lines = source.split('\n');
        const errorLine = e.location.start.line;
        const start = Math.max(0, errorLine - 3);
        const end = Math.min(lines.length, errorLine + 2);
        console.error('\n   Context:');
        for (let i = start; i < end; i++) {
            const marker = i + 1 === errorLine ? ' >>>' : '    ';
            console.error(`   ${marker} ${i + 1}: ${lines[i]}`);
        }
    }
    process.exit(1);
}

// Collect all node types recursively
const nodeTypes = new Map(); // type -> count
const elements = {
    packages: [],
    envPortDefs: [],
    envConnectorDefs: [],
    envComponentDefs: [],
    boundaryExtensions: [],
    envActivitiesDefinitions: [],
    signalDefs: [],
    envActionDefs: [],
    envActivityDefs: [],
    onClauses: [],
    sceneDefinitions: [],
    sceneDefs: [],
    scenarioDefinitions: [],
    scenarioDefs: [],
    scenarioExecutions: [],
    envConfigurations: [],
    envActivityAllocations: [],
    parallelBlocks: [],
    eventInjections: [],
    // structural
    componentDefs: [],
    connectorDefs: [],
    portDefs: [],
    activityDefs: [],
    actionDefs: [],
    executableDefs: [],
    requirements: [],
    allocations: [],
};

function walk(node, depth = 0) {
    if (!node || typeof node !== 'object') return;
    
    if (Array.isArray(node)) {
        node.forEach(n => walk(n, depth));
        return;
    }
    
    const type = node.type;
    if (type) {
        nodeTypes.set(type, (nodeTypes.get(type) || 0) + 1);
        
        // Classify
        switch (type) {
            case 'Package': elements.packages.push(node.name); break;
            case 'EnvPortDef': elements.envPortDefs.push(node.name); break;
            case 'EnvConnectorDef': elements.envConnectorDefs.push(node.name); break;
            case 'EnvComponentDef': elements.envComponentDefs.push(node.name); break;
            case 'BoundaryComponentExtension': elements.boundaryExtensions.push(node.component || node.name); break;
            case 'EnvActivitiesDefinitions': elements.envActivitiesDefinitions.push(node.name); break;
            case 'SignalDef': elements.signalDefs.push(node.name); break;
            case 'EnvActionDef': elements.envActionDefs.push(node.name); break;
            case 'EnvActivityDef': elements.envActivityDefs.push(node.name); break;
            case 'OnClause': elements.onClauses.push(node.signal || node.trigger || '(unknown)'); break;
            case 'SceneDefinitions': elements.sceneDefinitions.push(node.name); break;
            case 'SceneDef': elements.sceneDefs.push(node.name); break;
            case 'ScenarioDefinitions': elements.scenarioDefinitions.push(node.name); break;
            case 'ScenarioDef': elements.scenarioDefs.push(node.name); break;
            case 'ScenarioExecution': elements.scenarioExecutions.push(node.name || '(unnamed)'); break;
            case 'EnvironmentConfiguration': elements.envConfigurations.push(node.name); break;
            case 'EnvActivityAllocation': elements.envActivityAllocations.push(`${node.source} -> ${node.target}`); break;
            case 'ParallelBlock': elements.parallelBlocks.push('parallel'); break;
            case 'EventInjection': elements.eventInjections.push(node.eventName || node.signal || '(unknown)'); break;
            // structural
            case 'ComponentDef': elements.componentDefs.push(node.name); break;
            case 'ConnectorDef': elements.connectorDefs.push(node.name); break;
            case 'PortDef': elements.portDefs.push(node.name); break;
            case 'ActivityDef': elements.activityDefs.push(node.name); break;
            case 'ActionDef': elements.actionDefs.push(node.name); break;
            case 'ExecutableDef': elements.executableDefs.push(node.name); break;
            case 'Requirement': elements.requirements.push(node.name); break;
            case 'AllocationTable': elements.allocations.push('(table)'); break;
        }
    }
    
    // Recurse into all properties
    for (const key of Object.keys(node)) {
        if (key === 'location') continue; // skip location objects
        const val = node[key];
        if (val && typeof val === 'object') {
            walk(val, depth + 1);
        }
    }
}

walk(ast);

// Report
console.log('📊 AST NODE TYPES FOUND:');
console.log('-'.repeat(40));
const sortedTypes = [...nodeTypes.entries()].sort((a, b) => b[1] - a[1]);
for (const [type, count] of sortedTypes) {
    console.log(`   ${type.padEnd(35)} ${count}`);
}

console.log('\n📋 ELEMENT SUMMARY:');
console.log('-'.repeat(60));

function printSection(label, items, emoji = '  ') {
    if (items.length > 0) {
        console.log(`\n${emoji} ${label} (${items.length}):`);
        items.forEach(name => console.log(`     - ${name}`));
    }
}

// Structural
printSection('Packages', elements.packages, '📦');
printSection('Component Defs', elements.componentDefs, '🧱');
printSection('Port Defs', elements.portDefs, '🔌');
printSection('Connector Defs', elements.connectorDefs, '🔗');
printSection('Activity Defs', elements.activityDefs, '⚙️');
printSection('Action Defs', elements.actionDefs, '▶️');
printSection('Executable Defs', elements.executableDefs, '💻');
printSection('Requirements', elements.requirements, '📝');

// Environment / Scenario (new grammar)
console.log('\n' + '='.repeat(60));
console.log('🌍 ENVIRONMENT / SCENARIO VIEWPOINTS (NEW GRAMMAR):');
console.log('='.repeat(60));

printSection('EnvPort Defs', elements.envPortDefs, '🔌');
printSection('EnvConnector Defs', elements.envConnectorDefs, '🔗');
printSection('EnvComponent Defs', elements.envComponentDefs, '🏗️');
printSection('Boundary Component Extensions', elements.boundaryExtensions, '🌉');
printSection('Environment Configurations', elements.envConfigurations, '⚙️');
printSection('EnvActivitiesDefinitions', elements.envActivitiesDefinitions, '📡');
printSection('Signal Defs', elements.signalDefs, '📨');
printSection('EnvAction Defs', elements.envActionDefs, '▶️');
printSection('EnvActivity Defs', elements.envActivityDefs, '🔄');
printSection('ON Clauses', elements.onClauses, '⚡');
printSection('Scene Definitions (containers)', elements.sceneDefinitions, '🎬');
printSection('Scene Defs', elements.sceneDefs, '🎥');
printSection('Scenario Definitions (containers)', elements.scenarioDefinitions, '📋');
printSection('Scenario Defs', elements.scenarioDefs, '🎯');
printSection('Scenario Executions', elements.scenarioExecutions, '🚀');
printSection('Parallel Blocks', elements.parallelBlocks, '⏩');
printSection('Event Injections', elements.eventInjections, '💉');
printSection('EnvActivity Allocations', elements.envActivityAllocations, '📌');

// Check completeness
console.log('\n' + '='.repeat(60));
console.log('✅ COMPLETENESS CHECK:');
console.log('='.repeat(60));

const checks = [
    ['EnvPortDef', elements.envPortDefs.length > 0],
    ['EnvConnectorDef', elements.envConnectorDefs.length > 0],
    ['EnvComponentDef', elements.envComponentDefs.length > 0],
    ['BoundaryComponentExtension', elements.boundaryExtensions.length > 0],
    ['EnvironmentConfiguration', elements.envConfigurations.length > 0],
    ['EnvActivitiesDefinitions', elements.envActivitiesDefinitions.length > 0],
    ['SignalDef', elements.signalDefs.length > 0],
    ['EnvActionDef', elements.envActionDefs.length > 0],
    ['EnvActivityDef', elements.envActivityDefs.length > 0],
    ['OnClause', elements.onClauses.length > 0],
    ['SceneDefinitions', elements.sceneDefinitions.length > 0],
    ['SceneDef', elements.sceneDefs.length > 0],
    ['ScenarioDefinitions', elements.scenarioDefinitions.length > 0],
    ['ScenarioDef', elements.scenarioDefs.length > 0],
    ['ScenarioExecution', elements.scenarioExecutions.length > 0],
    ['ParallelBlock', elements.parallelBlocks.length > 0],
    ['EventInjection', elements.eventInjections.length > 0],
    ['EnvActivityAllocation', elements.envActivityAllocations.length > 0],
];

let passed = 0, failed = 0;
for (const [name, ok] of checks) {
    const status = ok ? '✅' : '❌';
    console.log(`   ${status} ${name}`);
    if (ok) passed++; else failed++;
}

console.log(`\n   Result: ${passed}/${checks.length} checks passed`);
if (failed > 0) {
    console.log(`   ⚠️  ${failed} element type(s) NOT found in AST`);
}

// Optionally dump full AST
if (process.argv.includes('--dump')) {
    const dumpFile = filePath.replace('.sysadl', '-ast.json');
    fs.writeFileSync(dumpFile, JSON.stringify(ast, null, 2));
    console.log(`\n💾 Full AST dumped to: ${dumpFile}`);
}

if (process.argv.includes('--dump-stdout')) {
    console.log('\n📄 FULL AST:');
    console.log(JSON.stringify(ast, null, 2));
}
