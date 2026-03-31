// Simplified app that relies on the Node.js server
// Removes browser wrapper requirements

import { parse as sysadlParse, SyntaxError as SysADLSyntaxError } from './sysadl-parser.js';
import { registerSysADLLanguage } from './sysadl-monaco.js';
import { renderVisualization } from './visualizer.js';

// 1) Monaco via AMD
const monacoReady = new Promise((resolve, reject) => {
  const amdRequire = window.amdRequire || window.require;
  if (!amdRequire) {
    console.warn('AMD require not available, Monaco will not load');
    reject(new Error('AMD require not available'));
    return;
  }

  try {
    amdRequire.config({
      paths: {
        'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
      }
    });

    amdRequire(['vs/editor/editor.main'], () => {
      console.log('Monaco successfully loaded via AMD');

      try {
        registerSysADLLanguage();
        console.log('✅ SysADL language support registered');
      } catch (error) {
        console.warn('⚠️ Error registering SysADL language:', error);
      }

      resolve();
    }, (err) => {
      console.error('Error loading Monaco:', err);
      reject(err);
    });
  } catch (error) {
    console.error('Error setting up Monaco:', error);
    reject(error);
  }
});

// 2) UI refs
const els = {
  editor: document.getElementById('editor'),
  btnTransform: document.getElementById('btnTransform'),
  btnRun: document.getElementById('btnRun'),
  btnExample: document.getElementById('btnExample'),
  fileInput: document.getElementById('fileInput'),
  jsFileInput: document.getElementById('jsFileInput'),
  jsFileIndicator: document.getElementById('jsFileIndicator'),
  jsFileName: document.getElementById('jsFileName'),
  clearJsFile: document.getElementById('clearJsFile'),
  copyArch: document.getElementById('copyArch'),
  saveArch: document.getElementById('saveArch'),
  btnVisualize: document.getElementById('btnVisualize'),
  log: document.getElementById('log'),
  clearLog: document.getElementById('clearLog'),
  downloadLog: document.getElementById('downloadLog'),
  btnTracePlay: document.getElementById('btnTracePlay'),
  btnTracePause: document.getElementById('btnTracePause'),
  btnTraceStep: document.getElementById('btnTraceStep'),
  btnTraceStepBack: document.getElementById('btnTraceStepBack'),
  traceStatus: document.getElementById('traceStatus'),
  traceToggle: document.getElementById('traceToggle'),
  loopCount: document.getElementById('loopCount'),
  traceSpeed: document.getElementById('traceSpeed'),
  simulationParams: document.getElementById('simulationParams'),
  availablePortsList: document.getElementById('availablePortsList'),
  monitoredPortsList: document.getElementById('monitoredPortsList'),
  copyParams: document.getElementById('copyParams'),
  parseErr: document.getElementById('parseErr'),
  architectureViz: document.getElementById('architectureViz'),
  btnToggleViz: document.getElementById('btnToggleViz'),
  traceTableBody: document.getElementById('traceTableBody'),
  traceEventCount: document.getElementById('traceEventCount'),
  traceTableWrapper: document.querySelector('.trace-table-wrapper'),
  logShowBuilding: document.getElementById('logShowBuilding')
};

// 3) Monaco init
let editor;
let generatedJavaScript = '';
let isCustomJSLoaded = false;
let visualizationController = null;
let traceEvents = [];
let traceAnimator = null;
let traceTimer = null;
let traceIndex = -1;
let tracePlaying = false;

const TRACE_DELAY_BASE_MS = 900;
let traceSpeedMultiplier = 1;

monacoReady.then(() => {
  console.log('Monaco loaded, creating editors...');

  try {
    const defaultSysADL = `// Paste a SysADL model here and click Transform ▶
// Simple example:
model Sample
configuration {
  component Sensor s1;
  component Display d1;
  connector Wire w1 (s1.out -> d1.in);
}`;
    const savedSysADL = localStorage.getItem('sysadlCode');

    // SysADL editor (left pane)
    editor = monaco.editor.create(els.editor, {
      value: (savedSysADL || defaultSysADL).trim(),
      language: 'sysadl',
      theme: 'vs-dark',
      automaticLayout: true,
      fontSize: 14,
      minimap: { enabled: false },
      wordWrap: 'on',
      bracketPairColorization: { enabled: true },
      suggest: { showKeywords: true, showSnippets: true },
      quickSuggestions: { other: true, comments: false, strings: false }
    });

    console.log('✅ Monaco SysADL editor created successfully');

    // Auto-save SysADL code
    editor.onDidChangeModelContent(() => {
      localStorage.setItem('sysadlCode', editor.getValue());
    });

  } catch (error) {
    console.error('Error creating Monaco editor:', error);
    createFallbackEditor();
  }
}).catch(error => {
  console.error('Error loading Monaco:', error);
  createFallbackEditor();
});

// Fallback editor
function createFallbackEditor() {
  // SysADL editor (fallback)
  const fallbackTextarea = document.createElement('textarea');
  fallbackTextarea.id = 'fallback-editor';
  fallbackTextarea.style.cssText = `
    width: 100%; height: 100%; 
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 14px; background: #1e1e1e; color: #d4d4d4;
    border: 1px solid #3c3c3c; padding: 10px; resize: none;
  `;
  const defaultSysADL = `model Sample
configuration {
  component Sensor s1;
  component Display d1;
  connector Wire w1 (s1.out -> d1.in);
}`;
  const savedSysADL = localStorage.getItem('sysadlCode');
  fallbackTextarea.value = savedSysADL || defaultSysADL;

  fallbackTextarea.addEventListener('input', () => {
    localStorage.setItem('sysadlCode', fallbackTextarea.value);
  });

  els.editor.appendChild(fallbackTextarea);

  editor = {
    getValue: () => fallbackTextarea.value,
    setValue: (value) => { fallbackTextarea.value = value; }
  };

  console.log('✅ Fallback editor created');
}

// 4) Transform SysADL using the Node.js server
async function transformSysADLToJS(source) {
  els.parseErr.textContent = '';

  try {
    console.log('🔄 Sending SysADL code to the Node.js server...');

    // Request transformation from the Node.js server
    const response = await fetch('/api/transform', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sysadlCode: source,
        options: {
          includeMetadata: true,
          optimize: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Unknown transformation error');
    }

    console.log('✅ Transformation completed by the server');
    console.log('📊 Metadata:', result.metadata);

    return result.javascript;

  } catch (error) {
    console.error('❌ Transformation error:', error);
    els.parseErr.textContent = `Transformation error: ${error.message}`;
    throw error;
  }
}

// 5) Utilities
function saveAs(filename, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function cjsPrelude() {
  return [
    'var module = { exports: {} };',
    'var exports = module.exports;',
    'function require(p){',
    "  if (p && String(p).includes('SysADLBase')) {",
    "    if (!window.SysADLBase) { console.error('window.SysADLBase is not available!'); return {}; }",
    "    return window.SysADLBase;",
    "  }",
    "  throw new Error('require is not supported in the browser: '+p);",
    '}'
  ].join('\n');
}

function cjsReturn() {
  return '\n;module.exports';
}

function cloneEvent(evt) {
  if (!evt) return null;
  try {
    return {
      timestamp: evt.timestamp,
      flowId: evt.flowId,
      type: evt.type,
      data: evt.data ? JSON.parse(JSON.stringify(evt.data)) : {}
    };
  } catch (error) {
    return { ...evt, data: evt.data || {} };
  }
}

function collectTraceEvents() {
  const logger = window._simulationLogger;
  const buildingTypes = ['COMPONENT_INSTANTIATION', 'PORT_INSTANTIATION', 'CONNECTION_ESTABLISHED'];
  if (logger && Array.isArray(logger.events) && logger.events.length) {
    traceEvents = logger.events.map(cloneEvent).filter(e => e && !buildingTypes.includes(e.type));
    console.log(`[Trace] Loaded ${traceEvents.length} events from SimulationLogger`);
  } else {
    traceEvents = [];
    console.warn('[Trace] No SimulationLogger events available; run a simulation first.');
  }
  traceIndex = -1;
  tracePlaying = false;
  if (traceAnimator && traceAnimator.clear) traceAnimator.clear();
  renderTraceTable(traceEvents);
  highlightTraceTableRow(-1);
  updateTraceControls();
}

function updateTraceControls() {
  const ready = traceEvents.length > 0 && visualizationController;
  [els.btnTracePlay, els.btnTracePause, els.btnTraceStep, els.btnTraceStepBack].forEach(btn => {
    if (!btn) return;
    btn.disabled = !ready;
  });
  if (els.traceStatus) {
    if (!traceEvents.length) {
      els.traceStatus.textContent = 'Run a simulation to enable trace animation.';
    } else if (!visualizationController) {
      els.traceStatus.textContent = 'Visualize the architecture to play the trace.';
    } else if (tracePlaying) {
      els.traceStatus.textContent = `Playing event ${Math.min(traceIndex + 1, traceEvents.length)}/${traceEvents.length}`;
    } else if (traceIndex >= 0) {
      els.traceStatus.textContent = `Paused at event ${traceIndex + 1}/${traceEvents.length}`;
    } else {
      els.traceStatus.textContent = `Trace ready (${traceEvents.length} events)`;
    }
  }
}

function getTraceDelay() {
  const base = TRACE_DELAY_BASE_MS;
  const multiplier = Number.isFinite(traceSpeedMultiplier) && traceSpeedMultiplier > 0 ? traceSpeedMultiplier : 1;
  return Math.max(150, base / multiplier);
}

function formatEventDescription(event) {
  if (!event) return '';
  const data = event.data || {};
  switch (event.type) {
    case 'PARAM_SET':
      return `${data.component || '?'}.${data.port || '?'}`;
    case 'PORT_SEND':
    case 'PORT_RECEIVE':
      return data.portPath || event.type;
    case 'CONNECTOR_TRIGGERED':
      return `${data.connectorName || 'Conector'} (${data.from || '?'} → ${data.to || '?'})`;
    case 'CONNECTOR_DIRECT_TRANSFER':
      return `${data.connectorName || 'Conector'} (direto)`;
    case 'ACTIVITY_WRITE_OUTPUT':
      return `${data.activityName || 'Atividade'} → ${data.targetPort || '?'}`;
    default:
      return event.type ? event.type.replace(/_/g, ' ') : 'Evento';
  }
}

function formatEventValue(event) {
  if (!event) return '';
  const data = event.data || {};
  const candidate = data.value ?? data.result ?? data.output ?? data.activityName ?? data.connectorName;
  if (candidate === undefined || candidate === null) return '';
  if (typeof candidate === 'object') {
    try {
      const serialized = JSON.stringify(candidate);
      return serialized.length > 36 ? `${serialized.slice(0, 35)}…` : serialized;
    } catch {
      return '[obj]';
    }
  }
  const text = String(candidate);
  return text.length > 32 ? `${text.slice(0, 31)}…` : text;
}

function updateTraceEventCount(count) {
  if (!els.traceEventCount) return;
  if (!count) {
    els.traceEventCount.textContent = 'Nenhum evento';
    return;
  }
  els.traceEventCount.textContent = `${count} evento${count === 1 ? '' : 's'}`;
}

function renderTraceTable(events) {
  if (!els.traceTableBody) return;
  els.traceTableBody.innerHTML = '';

  if (!events || !events.length) {
    const emptyRow = document.createElement('tr');
    emptyRow.className = 'trace-empty';
    const cell = document.createElement('td');
    cell.colSpan = 5;
    cell.textContent = 'Execute a simulação para listar os eventos.';
    emptyRow.appendChild(cell);
    els.traceTableBody.appendChild(emptyRow);
    updateTraceEventCount(0);
    return;
  }

  const fragment = document.createDocumentFragment();
  events.forEach((evt, idx) => {
    const row = document.createElement('tr');
    row.dataset.index = idx;
    const addCell = (text, title) => {
      const cell = document.createElement('td');
      cell.textContent = text;
      if (title) cell.title = title;
      row.appendChild(cell);
    };
    addCell(String(idx + 1));
    addCell(evt.timestamp !== undefined ? String(evt.timestamp) : '—');
    addCell(evt.flowId || '--');
    const desc = formatEventDescription(evt);
    addCell(desc, desc);
    const value = formatEventValue(evt);
    addCell(value, value);

    const jumpToEvent = () => {
      if (!traceEvents.length || !visualizationController) return;
      pauseTrace();
      traceIndex = idx - 1;
      advanceTrace();
    };
    row.addEventListener('click', jumpToEvent);
    row.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        jumpToEvent();
      }
    });
    row.tabIndex = 0;
    fragment.appendChild(row);
  });

  els.traceTableBody.appendChild(fragment);
  updateTraceEventCount(events.length);
}

function highlightTraceTableRow(index, { smooth = false } = {}) {
  if (!els.traceTableBody) return;
  const prev = els.traceTableBody.querySelector('tr.active');
  if (prev) prev.classList.remove('active');
  if (index === undefined || index === null || index < 0) return;
  const row = els.traceTableBody.querySelector(`tr[data-index="${index}"]`);
  if (!row) return;
  row.classList.add('active');
  scrollTraceTableRowIntoView(row, { smooth });
}

function clearTraceTableSelection() {
  if (!els.traceTableBody) return;
  els.traceTableBody.querySelectorAll('tr.active').forEach(row => row.classList.remove('active'));
}

function scrollTraceTableRowIntoView(row, { smooth = false } = {}) {
  const container = els.traceTableWrapper || document.querySelector('.trace-table-wrapper');
  if (!container || !row) return;
  const rowRect = row.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const behavior = smooth ? 'smooth' : 'auto';

  if (rowRect.top < containerRect.top) {
    const delta = rowRect.top - containerRect.top - 6;
    container.scrollBy({ top: delta, behavior });
  } else if (rowRect.bottom > containerRect.bottom) {
    const delta = rowRect.bottom - containerRect.bottom + 6;
    container.scrollBy({ top: delta, behavior });
  }
}

function stopTraceTimer() {
  if (traceTimer) {
    clearTimeout(traceTimer);
    traceTimer = null;
  }
}

function clearTraceHighlights() {
  if (visualizationController?.clearHighlights) {
    visualizationController.clearHighlights();
  }
  clearTraceTableSelection();
}

function playTrace() {
  if (!(traceEvents.length && visualizationController)) {
    updateTraceControls();
    return;
  }
  tracePlaying = true;
  advanceTrace();
}

function pauseTrace() {
  tracePlaying = false;
  stopTraceTimer();
  updateTraceControls();
}

function stepTrace() {
  tracePlaying = false;
  stopTraceTimer();
  advanceTrace();
}

function stepBackTrace() {
  if (!(traceEvents.length && visualizationController)) {
    return;
  }
  tracePlaying = false;
  stopTraceTimer();

  // Go back one step
  traceIndex -= 1;
  if (traceIndex < 0) {
    traceIndex = 0;
  }

  // Display the event at the new index
  const evt = traceEvents[traceIndex];
  if (visualizationController.highlightEvent) {
    visualizationController.highlightEvent(evt);
  }
  highlightTraceTableRow(traceIndex, { smooth: false });
  updateTraceControls();
}

function advanceTrace() {
  if (!(traceEvents.length && visualizationController)) {
    pauseTrace();
    return;
  }
  traceIndex += 1;
  if (traceIndex >= traceEvents.length) {
    traceIndex = traceEvents.length - 1;
    pauseTrace();
    clearTraceHighlights();
    updateTraceControls();
    highlightTraceTableRow(-1);
    return;
  }

  const evt = traceEvents[traceIndex];
  if (visualizationController.highlightEvent) {
    visualizationController.highlightEvent(evt);
  }
  highlightTraceTableRow(traceIndex, { smooth: tracePlaying });
  updateTraceControls();

  if (tracePlaying) {
    traceTimer = setTimeout(() => advanceTrace(), getTraceDelay());
  }
}
function formatLogLine(line) {
  if (!line.trim()) return '';
  let cssClass = 'log-default';
  
  if (line.includes('[ERROR]') || line.includes('MODELING ERROR:')) {
    cssClass = 'log-error';
  } else if (line.includes('[WARN]')) {
    cssClass = 'log-warn';
  } else if (line.includes('[INFO]')) {
    cssClass = 'log-info';
  } else if (line.match(/^\|\s*\d+\.\d+s\s*\|/)) {
    // Time-based log lines like from SimulationLogger
    cssClass = 'log-event';
    // Highlight the time portion
    line = line.replace(/^(\|\s*\d+\.\d+s\s*\|)/, '<span class="log-time">$1</span>');
  }

  // Escape HTML to prevent injection, but keep our span if we added it
  const isEscaped = line.includes('<span');
  const safeLine = isEscaped ? line : line.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  return `<span class="log-line ${cssClass}">${safeLine}</span>`;
}

function appendToLog(text) {
  if (!text) return;
  const lines = text.split('\n');
  const formatted = lines.map(l => formatLogLine(l)).join('');
  els.log.innerHTML += formatted;
  els.log.scrollTop = els.log.scrollHeight;
}

// 6) Simulation execution
function runSimulation(generatedCode, { trace = false, loops = 1, params = {}, showBuilding = false, monitoredPorts = [] } = {}) {
  const prelude = cjsPrelude();
  const suffix = cjsReturn();
  const code = prelude + '\n' + generatedCode + suffix;

  const options = {
    trace: !!trace,
    loop: loops > 1,
    count: Math.max(1, Number(loops) || 1),
    params: params,
    showBuilding: showBuilding,
    monitoredPorts: monitoredPorts
  };

    try {
    const output = window.Simulator.run(code, options);
    appendToLog(output + '\n');
    
    // Attempt to render final values to the visual card
    if (window._simulationLogger && typeof window._simulationLogger.getFinalValues === 'function') {
      const finalValues = window._simulationLogger.getFinalValues(showBuilding, monitoredPorts);
      const finalValuesCard = document.getElementById('finalValuesCard');
      const finalValuesList = document.getElementById('finalValuesList');
      
      if (finalValuesCard && finalValuesList) {
        if (Object.keys(finalValues).length > 0) {
          finalValuesCard.style.display = 'block';
          finalValuesList.innerHTML = '';
          Object.entries(finalValues).forEach(([port, value]) => {
            const li = document.createElement('li');
            li.style.marginBottom = '4px';
            li.innerHTML = `<strong>${port}</strong> <span style="color: #666; margin: 0 8px;">=</span> <span style="color: #2e7d32; font-weight: bold;">${value}</span>`;
            finalValuesList.appendChild(li);
          });
        } else {
          finalValuesCard.style.display = 'none';
          finalValuesList.innerHTML = '';
        }
      }
    }

    // Refresh trace table
    collectTraceEvents();
  } catch (err) {
    // Format error message based on type
    let errorMessage = '';

    if (err.message.includes('MODELING ERROR:')) {
      // Already formatted by simulator - use as is
      errorMessage = `\n${err.message}\n`;
    } else if (err.message.includes('Expected PT_') || err.message.includes('port type')) {
      // Port binding error that wasn't caught - format it
      errorMessage = `\nMODELING ERROR: ${err.message}\n`;
    } else {
      // Generic error
      errorMessage = `\n[ERROR] ${err.message}\n`;
    }

    appendToLog(errorMessage);

    // Log to console without stack trace for modeling errors
    if (err.name === 'ModelingError' || err.message.includes('MODELING ERROR:')) {
      // Don't log modeling errors to console to avoid stack trace
    } else {
      console.error('Simulation error:', err.message);
    }
  }
}

// 6.0) Extract type definitions and generate examples
function extractTypeExamples(generatedCode) {
  const typeExamples = {};
  const enumMap = {}; // Map from full enum name (EN_*) to values

  try {
    // Extract Enums: const EN_[package_]TypeName = new Enum("value1", "value2", ...);
    // Pattern: EN_package_Type -> where 'Type' is the actual SysADL type name
    // Examples: EN_types_Command, EN_NotificationToSupervisory
    const enumPattern = /const\s+(EN_\w+)\s*=\s*new\s+Enum\(((?:"[^"]*"(?:\s*,\s*)?)+)\)/g;
    let match;

    while ((match = enumPattern.exec(generatedCode)) !== null) {
      const [, enumName, valuesStr] = match;
      const values = valuesStr.match(/"([^"]+)"/g).map(v => v.replace(/"/g, ''));
      const exampleText = values.join(' | ');

      // Store with full name for reference in DataTypes (EN_types_Command)
      enumMap[enumName] = exampleText;

      // Extract actual type name (last part after last underscore)
      // EN_types_Command -> Command
      // EN_NotificationToSupervisory -> NotificationToSupervisory
      const parts = enumName.split('_');
      const actualTypeName = parts[parts.length - 1]; // Last part is always the SysADL type name
      typeExamples[actualTypeName] = exampleText;

      console.log(`📌 Enum: ${enumName} -> type "${actualTypeName}" = ${exampleText}`);
    }

    // Extract DataTypes: const DT_[package_]TypeName = dataType('TypeName', { field1: Type1, ... });
    // Pattern: DT_package_Type -> where 'TypeName' in dataType() call is the actual SysADL type name
    // Examples: DT_types_Commands, DT_Location, DT_SmartPlaceComponents_AirConditioner
    const dataTypePattern = /const\s+(DT_\w+)\s*=\s*dataType\('(\w+)',\s*\{([^}]+)\}\)/g;

    while ((match = dataTypePattern.exec(generatedCode)) !== null) {
      const [, dtName, typeName, fieldsStr] = match;

      // The 'typeName' from dataType('TypeName', ...) is the actual SysADL type name
      // We don't need to parse it from dtName, it's already correct in the call

      // Parse fields: field1: Type1, field2: Type2
      const fields = {};
      const fieldPattern = /(\w+):\s*(\w+)/g;
      let fieldMatch;

      while ((fieldMatch = fieldPattern.exec(fieldsStr)) !== null) {
        const [, fieldName, fieldType] = fieldMatch;

        // Check if fieldType is a known type
        if (fieldType === 'String') {
          fields[fieldName] = '""';
        } else if (fieldType === 'Int' || fieldType === 'Real') {
          fields[fieldName] = '0';
        } else if (fieldType === 'Boolean') {
          fields[fieldName] = 'true';
        } else if (fieldType.startsWith('EN_')) {
          // It's an enum reference - use the mapped value from enumMap
          const enumExample = enumMap[fieldType];
          if (enumExample) {
            fields[fieldName] = `"${enumExample.split(' | ')[0]}"`;
          } else {
            fields[fieldName] = '"..."';
          }
        } else if (fieldType.startsWith('DT_')) {
          // It's a nested dataType
          fields[fieldName] = '{...}';
        } else {
          fields[fieldName] = '...';
        }
      }

      typeExamples[typeName] = JSON.stringify(fields, null, 0);
      console.log(`📌 DataType: ${dtName} -> type "${typeName}" = ${typeExamples[typeName]}`);
    }

    console.log('📝 Extracted type examples:', typeExamples);

  } catch (error) {
    console.error('Error extracting type examples:', error);
  }

  return typeExamples;
}

// 6.1) Extract available ports from generated code
function extractAvailablePorts(generatedCode) {
  try {
    const availablePorts = [];

    // Parse the code statically to find boundary components and their ports
    // Pattern: new CP_*_ComponentName("instanceName", { isBoundary: true, ... })

    // First, find all component instantiations with isBoundary: true
    const boundaryComponentPattern = /new\s+(\w+)\("(\w+)",\s*\{\s*isBoundary:\s*true[^}]*portAliases:\s*\{([^}]*)\}/g;

    let match;
    const boundaryComponents = [];

    while ((match = boundaryComponentPattern.exec(generatedCode)) !== null) {
      const [, className, instanceName, portAliasesStr] = match;

      // Parse port aliases: {"portName":"aliasName", ...}
      const portAliases = {};
      const aliasPattern = /"(\w+)"\s*:\s*"(\w+)"/g;
      let aliasMatch;
      while ((aliasMatch = aliasPattern.exec(portAliasesStr)) !== null) {
        portAliases[aliasMatch[1]] = aliasMatch[2];
      }

      boundaryComponents.push({
        className,
        instanceName,
        portAliases
      });
    }

    console.log('Found boundary components:', boundaryComponents);

    // Now find the component class definitions to get port information
    for (const comp of boundaryComponents) {
      // Find the component class definition - need to match multiline constructor
      // Pattern: class CP_*_ComponentName extends Component {
      //   constructor(name, opts={}) {
      //     ...
      //     this.addPort(new PT_*_PortType(...));

      const classStartPattern = new RegExp(`class\\s+${comp.className}\\s+extends\\s+Component\\s*\\{`, 'g');
      const classStartMatch = classStartPattern.exec(generatedCode);

      if (!classStartMatch) {
        console.warn(`Could not find class definition for ${comp.className}`);
        continue;
      }

      // Find the constructor block - start from class definition
      const classStartIndex = classStartMatch.index;
      const constructorPattern = /constructor\s*\([^)]*\)\s*\{/g;
      constructorPattern.lastIndex = classStartIndex;
      const constructorMatch = constructorPattern.exec(generatedCode);

      if (!constructorMatch) {
        console.warn(`Could not find constructor for ${comp.className}`);
        continue;
      }

      // Find the matching closing brace for constructor
      let braceCount = 1;
      let constructorEndIndex = constructorMatch.index + constructorMatch[0].length;

      while (braceCount > 0 && constructorEndIndex < generatedCode.length) {
        const char = generatedCode[constructorEndIndex];
        if (char === '{') braceCount++;
        else if (char === '}') braceCount--;
        constructorEndIndex++;
      }

      const constructorBody = generatedCode.substring(constructorMatch.index + constructorMatch[0].length, constructorEndIndex - 1);

      // Extract port definitions from constructor
      // Pattern: this.addPort(new PT_*_PortType(portName_*, { owner: name, originalName: "portName" }));
      const portPattern = /this\.addPort\(new\s+(PT_\w+_(\w+))\(portName_\w+,\s*\{\s*owner:\s*name,\s*originalName:\s*"(\w+)"/g;
      let portMatch;

      while ((portMatch = portPattern.exec(constructorBody)) !== null) {
        const [, portFullClassName, portClassName, originalPortName] = portMatch;

        console.log(`Looking for port class: ${portFullClassName}`);

        // First, check if it's a CompositePort
        const compositePortPattern = new RegExp(`class\\s+${portFullClassName}\\s+extends\\s+CompositePort`);
        const isCompositePort = compositePortPattern.test(generatedCode);

        let direction = 'unknown';
        let dataType = 'unknown';
        let subPorts = null;

        if (isCompositePort) {
          direction = 'composite';
          dataType = 'CompositePort';

          // Extract sub-ports from CompositePort constructor
          // Find the class and its constructor
          const compositeClassStartPattern = new RegExp(`class\\s+${portFullClassName}\\s+extends\\s+CompositePort\\s*\\{`);
          const compositeClassStartMatch = compositeClassStartPattern.exec(generatedCode);

          if (compositeClassStartMatch) {
            const classStartIndex = compositeClassStartMatch.index;

            // Find constructor start
            const constructorStartPattern = /constructor\s*\([^)]*\)\s*\{/g;
            constructorStartPattern.lastIndex = classStartIndex;
            const constructorStartMatch = constructorStartPattern.exec(generatedCode);

            if (constructorStartMatch) {
              // Find matching closing brace
              let braceCount = 1;
              let constructorEndIndex = constructorStartMatch.index + constructorStartMatch[0].length;

              while (braceCount > 0 && constructorEndIndex < generatedCode.length) {
                const char = generatedCode[constructorEndIndex];
                if (char === '{') braceCount++;
                else if (char === '}') braceCount--;
                constructorEndIndex++;
              }

              const compositeConstructorBody = generatedCode.substring(
                constructorStartMatch.index + constructorStartMatch[0].length,
                constructorEndIndex - 1
              );

              // Pattern: this.addSubPort("portName", new SimplePort("portName", "in/out/inout", { ...{ expectedType: "Type" }, ...}));
              const subPortPattern = /this\.addSubPort\s*\(\s*"(\w+)"\s*,\s*new\s+SimplePort\s*\([^,]+,\s*"(in|out|inout)"\s*,[^{]*\{\s*\.\.\.\s*\{\s*expectedType:\s*"([^"]+)"/g;
              let subPortMatch;
              subPorts = [];

              while ((subPortMatch = subPortPattern.exec(compositeConstructorBody)) !== null) {
                const [, subPortName, subDirection, subType] = subPortMatch;
                const mappedDir = subDirection === 'out' ? 'output' : (subDirection === 'inout' ? 'inout' : 'input');
                subPorts.push({
                  name: subPortName,
                  direction: mappedDir,
                  type: subType
                });
              }

              console.log(`✓ Found composite port class ${portFullClassName} with ${subPorts.length} sub-ports:`, subPorts);
            } else {
              console.warn(`Could not find constructor for composite port ${portFullClassName}`);
            }
          } else {
            console.log(`✓ Found composite port class ${portFullClassName} (could not extract details)`);
          }
        } else {
          // Find the SimplePort class definition to get direction and type
          // Pattern: class PT_*_PortType extends SimplePort {
          //   constructor(name, opts = {}) {
          //     super(name, "in", { ...{ expectedType: "Real" }, ...opts });
          // Need to match across newlines and handle nested braces
          const portClassPattern = new RegExp(`class\\s+${portFullClassName}\\s+extends\\s+SimplePort\\s*\\{[\\s\\S]*?constructor[\\s\\S]*?\\{[\\s\\S]*?super\\s*\\([^,]+,\\s*"(in|out|inout)"[\\s\\S]*?expectedType:\\s*"([^"]+)"`, 'm');
          const portClassMatch = portClassPattern.exec(generatedCode);

          if (portClassMatch) {
            const rawDir = portClassMatch[1];
            direction = rawDir === 'out' ? 'output' : (rawDir === 'inout' ? 'inout' : 'input');
            dataType = portClassMatch[2];
            console.log(`✓ Found port class ${portFullClassName}: direction=${direction}, type=${dataType}`);
          } else {
            // If not found, log the pattern we're looking for to debug
            console.warn(`Could not find port class definition for ${portFullClassName}`);

            // Try to find the class at least to see what it looks like
            const simpleClassPattern = new RegExp(`class\\s+${portFullClassName}\\s+extends\\s+SimplePort[\\s\\S]{0,300}`);
            const simpleMatch = simpleClassPattern.exec(generatedCode);
            if (simpleMatch) {
              console.log('Found class snippet:', simpleMatch[0]);
            }
          }
        }

        // Use alias if available, otherwise use original port name
        const displayPortName = comp.portAliases[originalPortName] || originalPortName;

        // Build the full path - need to find where this component is instantiated
        // Pattern: this.ComponentPath.instanceName = new CP_...
        const instantiationPattern = new RegExp(`(this(?:\\.\\w+)*)\\.${comp.instanceName}\\s*=\\s*new\\s+${comp.className}`);
        const instMatch = instantiationPattern.exec(generatedCode);

        let fullPath = comp.instanceName + '.' + displayPortName;

        if (instMatch) {
          // Extract the path from "this.ComponentPath"
          const pathMatch = instMatch[1].replace(/^this\./, '');
          if (pathMatch) {
            fullPath = pathMatch + '.' + comp.instanceName + '.' + displayPortName;
          }
        }

        availablePorts.push({
          path: fullPath,
          direction: direction,
          type: dataType,
          component: comp.instanceName,
          isBoundary: true,
          subPorts: subPorts
        });
      }
    }

    // Filter ports: keep only output or inout ports (for param ports),
    // and input or inout ports (for monitor ports).
    const paramPorts = [];
    const monitorPorts = [];

    for (const p of availablePorts) {
      if (p.subPorts && Array.isArray(p.subPorts)) {
        const keptOut = p.subPorts.filter(sp => sp.direction === 'output' || sp.direction === 'inout');
        if (keptOut.length > 0) {
          const copyOut = Object.assign({}, p);
          copyOut.subPorts = keptOut;
          paramPorts.push(copyOut);
        }

        const keptIn = p.subPorts.filter(sp => sp.direction === 'input' || sp.direction === 'inout');
        if (keptIn.length > 0) {
          const copyIn = Object.assign({}, p);
          copyIn.subPorts = keptIn;
          monitorPorts.push(copyIn);
        }
      } else {
        if (p.direction === 'output' || p.direction === 'inout') paramPorts.push(p);
        if (p.direction === 'input' || p.direction === 'inout') monitorPorts.push(p);
      }
    }

    return { paramPorts, monitorPorts };

  } catch (error) {
    console.error('Error extracting available ports:', error);
    return { paramPorts: [], monitorPorts: [] };
  }
}

// 6.2) Create interactive ports list and update JSON automatically
function createInteractivePortsList(ports, typeExamples = {}) {
  if (!ports || ports.length === 0) {
    els.availablePortsList.innerHTML = '<p style="color: #666; font-style: italic; margin: 0;">No boundary component ports found.</p>';
    return;
  }

  // Clear the list
  els.availablePortsList.innerHTML = '';

  // Group by component
  const byComponent = {};
  for (const port of ports) {
    if (!byComponent[port.component]) {
      byComponent[port.component] = [];
    }
    byComponent[port.component].push(port);
  }

  // Create interactive list
  for (const [component, componentPorts] of Object.entries(byComponent)) {
    for (const port of componentPorts) {
      if (port.subPorts && port.subPorts.length > 0) {
        // CompositePort - show header without checkbox
        const compositeHeader = document.createElement('div');
        compositeHeader.style.cssText = 'margin-top: 6px; margin-bottom: 4px; color: #666; font-style: italic;';
        compositeHeader.innerHTML = `⇄ ${port.path} <span style="color: #999;">[CompositePort]</span>`;
        els.availablePortsList.appendChild(compositeHeader);

        // Show sub-ports with checkboxes
        for (const subPort of port.subPorts) {
          const subPortPath = `${port.path}.${subPort.name}`;
          createPortCheckbox(subPortPath, subPort.direction, subPort.type, 12, typeExamples); // 12px indent for sub-ports
        }
      } else {
        // SimplePort - show with checkbox
        createPortCheckbox(port.path, port.direction, port.type, 0, typeExamples); // No indent
      }
    }
  }

  // Initialize JSON as empty
  updateSimulationParamsJSON();
}

// Helper function to create a port checkbox with input
function createPortCheckbox(portPath, direction, type, indentPx, typeExamples = {}) {
  const portDiv = document.createElement('div');
  portDiv.style.cssText = `margin-left: ${indentPx}px; margin-bottom: 4px; display: flex; align-items: center; gap: 8px;`;

  // Checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = `port_${portPath.replace(/\./g, '_')}`;
  checkbox.dataset.portPath = portPath;
  checkbox.style.cursor = 'pointer';

  // Port label
  const arrow = direction === 'output' ? '→' : direction === 'input' ? '←' : '⇄';
  const label = document.createElement('label');
  label.htmlFor = checkbox.id;
  label.style.cssText = 'flex: 1; cursor: pointer; font-family: "Fira Mono", "Consolas", monospace; font-size: 13px;';
  label.innerHTML = `${arrow} ${portPath} <span style="color: #999;">[${type}]</span>`;

  // Get example for this type
  const typeExample = typeExamples[type] || getDefaultValue(type);

  // Value input - increased size to 350px
  const valueInput = document.createElement('input');
  valueInput.type = 'text';
  valueInput.placeholder = typeExample;
  valueInput.dataset.portPath = portPath;
  valueInput.dataset.typeExample = typeExample;
  valueInput.style.cssText = 'width: 350px; padding: 6px 10px; font-family: "Fira Mono", "Consolas", monospace; font-size: 13px; border: 1px solid #ccc; border-radius: 4px;';
  valueInput.disabled = true; // Disabled until checkbox is checked

  // "Use example" button
  const exampleButton = document.createElement('button');
  exampleButton.textContent = '📋';
  exampleButton.title = 'Use example value';
  exampleButton.style.cssText = 'padding: 4px 8px; font-size: 14px; border: 1px solid #ccc; border-radius: 4px; background: #f9f9f9; cursor: pointer; display: none;';
  exampleButton.disabled = true;

  // Event listeners
  checkbox.addEventListener('change', () => {
    valueInput.disabled = !checkbox.checked;
    exampleButton.disabled = !checkbox.checked;
    exampleButton.style.display = checkbox.checked ? 'inline-block' : 'none';

    if (checkbox.checked && !valueInput.value) {
      valueInput.value = typeExample;
    }
    updateSimulationParamsJSON();
  });

  valueInput.addEventListener('input', () => {
    if (checkbox.checked) {
      updateSimulationParamsJSON();
    }
  });

  exampleButton.addEventListener('click', (e) => {
    e.preventDefault();
    valueInput.value = typeExample;
    if (checkbox.checked) {
      updateSimulationParamsJSON();
    }
  });

  portDiv.appendChild(checkbox);
  portDiv.appendChild(label);
  portDiv.appendChild(valueInput);
  portDiv.appendChild(exampleButton);

  els.availablePortsList.appendChild(portDiv);
}

// 6.3) Create interactive list for ports that can only be monitored
function createMonitorablePortsList(ports) {
  if (!ports || ports.length === 0) {
    els.monitoredPortsList.innerHTML = '<p style="color: #666; font-style: italic; margin: 0;">No monitorable boundary input ports found in the model.</p>';
    return;
  }
  els.monitoredPortsList.innerHTML = '';
  
  const byComponent = {};
  for (const port of ports) {
    if (!byComponent[port.component]) byComponent[port.component] = [];
    byComponent[port.component].push(port);
  }

  for (const [component, componentPorts] of Object.entries(byComponent)) {
    for (const port of componentPorts) {
      if (port.subPorts && port.subPorts.length > 0) {
        const compositeHeader = document.createElement('div');
        compositeHeader.style.cssText = 'margin-top: 6px; margin-bottom: 4px; color: #666; font-style: italic;';
        compositeHeader.innerHTML = `⇄ ${port.path} <span style="color: #999;">[CompositePort]</span>`;
        els.monitoredPortsList.appendChild(compositeHeader);
        for (const subPort of port.subPorts) {
          createMonitorCheckbox(`${port.path}.${subPort.name}`, subPort.direction, subPort.type, 12);
        }
      } else {
        createMonitorCheckbox(port.path, port.direction, port.type, 0);
      }
    }
  }
}

function createMonitorCheckbox(portPath, direction, type, indentPx) {
  const portDiv = document.createElement('div');
  portDiv.style.cssText = `margin-left: ${indentPx}px; margin-bottom: 4px; display: flex; align-items: center; gap: 8px;`;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'monitor-only-checkbox';
  checkbox.dataset.portPath = portPath;
  checkbox.id = `monitor_${portPath.replace(/\./g, '_')}`;
  checkbox.style.cursor = 'pointer';

  const arrow = direction === 'output' ? '→' : direction === 'input' ? '←' : '⇄';
  const label = document.createElement('label');
  label.htmlFor = checkbox.id;
  label.style.cssText = 'flex: 1; cursor: pointer; font-family: "Fira Mono", "Consolas", monospace; font-size: 13px;';
  label.innerHTML = `${arrow} ${portPath} <span style="color: #999;">[${type}]</span>`;

  portDiv.appendChild(checkbox);
  portDiv.appendChild(label);
  els.monitoredPortsList.appendChild(portDiv);
}

// Get default value based on type
function getDefaultValue(type) {
  if (type === 'Boolean' || type === 'boolean') return 'true';
  if (type === 'String' || type === 'string') return '""';
  if (type.includes('Int') || type.includes('Real')) return '0';
  return '0';
}

// Update the JSON textarea based on selected checkboxes
function updateSimulationParamsJSON() {
  const params = {};

  // Find all checked checkboxes
  const checkboxes = els.availablePortsList.querySelectorAll('input[type="checkbox"]:checked');

  checkboxes.forEach(checkbox => {
    const portPath = checkbox.dataset.portPath;
    const valueInput = els.availablePortsList.querySelector(`input[type="text"][data-port-path="${portPath}"]`);

    if (valueInput && valueInput.value) {
      let value = valueInput.value.trim();

      // Try to parse as JSON value (number, boolean, string, etc.)
      try {
        // If it's a number
        if (!isNaN(value) && value !== '') {
          params[portPath] = Number(value);
        }
        // If it's a boolean
        else if (value === 'true' || value === 'false') {
          params[portPath] = value === 'true';
        }
        // If it's a string (with quotes)
        else if (value.startsWith('"') && value.endsWith('"')) {
          params[portPath] = value.substring(1, value.length - 1);
        }
        // Otherwise, treat as string
        else {
          params[portPath] = value;
        }
      } catch (e) {
        params[portPath] = value;
      }
    }
  });

  // Update the JSON textarea
  if (Object.keys(params).length > 0) {
    els.simulationParams.value = JSON.stringify(params, null, 2);
    localStorage.setItem('sysadlParams', els.simulationParams.value);
  } else {
    els.simulationParams.value = '';
    localStorage.removeItem('sysadlParams');
  }

  // Save monitored ports as well
  const monitorNodes = els.monitoredPortsList ? els.monitoredPortsList.querySelectorAll('input.monitor-only-checkbox:checked') : [];
  const monitoredPorts = Array.from(monitorNodes).map(node => node.dataset.portPath);
  if (monitoredPorts.length > 0) {
    localStorage.setItem('sysadlMonitored', JSON.stringify(monitoredPorts));
  } else {
    localStorage.removeItem('sysadlMonitored');
  }
}

// Ensure monitored ports trigger save when changed manually
if (els.monitoredPortsList) {
  els.monitoredPortsList.addEventListener('change', (e) => {
    if (e.target && e.target.classList.contains('monitor-only-checkbox')) {
      updateSimulationParamsJSON(); // reuse the same trigger function so both states save
    }
  });
}

function restoreSimulationSelections() {
  try {
    // Restore params
    const savedParams = localStorage.getItem('sysadlParams');
    if (savedParams) {
      els.simulationParams.value = savedParams;
      const parsed = JSON.parse(savedParams);
      for (const [key, val] of Object.entries(parsed)) {
        const checkbox = els.availablePortsList.querySelector(`input[type="checkbox"][data-port-path="${key}"]`);
        const valueInput = els.availablePortsList.querySelector(`input[type="text"][data-port-path="${key}"]`);
        if (checkbox && valueInput) {
          checkbox.checked = true;
          valueInput.value = typeof val === 'object' ? JSON.stringify(val) : String(val);
          valueInput.disabled = false;
          const btn = valueInput.nextElementSibling;
          if (btn && btn.tagName === 'BUTTON') {
             btn.disabled = false;
             btn.style.display = 'inline-block';
          }
        }
      }
    }
    
    // Restore monitors
    const savedMonitored = localStorage.getItem('sysadlMonitored');
    if (savedMonitored) {
      const parsedMonitors = JSON.parse(savedMonitored);
      for (const key of parsedMonitors) {
        const checkbox = els.monitoredPortsList.querySelector(`input.monitor-only-checkbox[data-port-path="${key}"]`);
        if (checkbox) checkbox.checked = true;
      }
    }
  } catch (err) {
    console.warn("Could not restore previous selections:", err);
  }
}

// 7) Event Handlers
els.btnTransform.addEventListener('click', async () => {
  console.log('🔄 Transform process started');
  els.log.innerHTML = '';
  const src = editor.getValue();

  try {
    const js = await transformSysADLToJS(src);
    if (!isCustomJSLoaded) {
      generatedJavaScript = js;
      if (els.saveArch) els.saveArch.disabled = false;
      if (els.copyArch) els.copyArch.disabled = false;
    }
    console.log('✅ Transformation completed successfully');

    // Extract type examples and available ports
    const typeExamples = extractTypeExamples(js);
    const { paramPorts, monitorPorts } = extractAvailablePorts(js);
    createInteractivePortsList(paramPorts, typeExamples);
    createMonitorablePortsList(monitorPorts);
    restoreSimulationSelections(); // Recall state from LocalStorage after lists are created
    console.log(`📋 Found ${paramPorts.length} parametrizable ports and ${monitorPorts.length} monitorable ports`);

    // Auto-visualize after successful transformation
    if (els.architectureViz) {
      console.log('🔍 Auto-visualizing architecture...');
      const jsToRun = isCustomJSLoaded ? generatedJavaScript : js;
      visualizationController = renderVisualization('architectureViz', jsToRun, els.log) || null;
      clearTraceHighlights();
      updateTraceControls();
    }

  } catch (err) {
    if (!generatedJavaScript) {
      generatedJavaScript = '';
    }
    els.availablePortsList.innerHTML = '<p style="color: #dc2626; font-style: italic; margin: 0;">Transformation failed. Please fix errors and try again.</p>';
    appendToLog(`[ERROR] Transformation error: ${err.message}\n`);
    console.error('❌ Transformation error:', err);
  }
});

els.btnVisualize.addEventListener('click', () => {
  console.log('🔍 Visualize architecture button clicked');
  const js = generatedJavaScript.trim();
  if (!js) {
    appendToLog('[WARN] Generate the JS first (Transform ▶) or upload a custom JS file.\n');
    return;
  }
  if (!els.architectureViz) {
    console.warn('Visualization container not found');
    appendToLog('[ERROR] Visualization container not found\n');
    return;
  }
  visualizationController = renderVisualization('architectureViz', js, els.log) || null;
  clearTraceHighlights();
  updateTraceControls();
});

if (els.btnToggleViz) {
  els.btnToggleViz.addEventListener('click', () => {
    const wrapper = document.querySelector('.viz-wrapper');
    if (wrapper) {
      wrapper.classList.toggle('maximized');
      setTimeout(() => {
        if (visualizationController && visualizationController.fit) {
          visualizationController.fit();
        }
        if (visualizationController && visualizationController.refresh) {
          setTimeout(() => visualizationController.refresh(), 100);
          setTimeout(() => visualizationController.refresh(), 300);
          setTimeout(() => visualizationController.refresh(), 500);
        }
      }, 50);
    }
  });
}

els.btnRun.addEventListener('click', async () => {
  const js = generatedJavaScript.trim();
  if (!js) {
    appendToLog('[WARN] Generate the JS first (Transform ▶) or upload a custom JS file.\n');
    return;
  }
  if (!window.SysADLBase) {
    appendToLog('[ERROR] window.SysADLBase not available!\n');
    return;
  }

  const trace = !!els.traceToggle.checked;
  const loops = Number(els.loopCount.value || 1);
  const showBuilding = els.logShowBuilding ? els.logShowBuilding.checked : false;

  const monitorNodes = els.monitoredPortsList ? els.monitoredPortsList.querySelectorAll('input.monitor-only-checkbox:checked') : [];
  const monitoredPorts = Array.from(monitorNodes).map(node => node.dataset.portPath);

  let params = {};
  const paramsText = els.simulationParams.value.trim();
  if (paramsText) {
    try {
      params = JSON.parse(paramsText);
    } catch (error) {
      appendToLog(`[ERROR] Invalid JSON parameters: ${error.message}\n`);
      return;
    }
  }

  runSimulation(js, { trace, loops, params, showBuilding, monitoredPorts });
});

if (els.copyArch) {
  els.copyArch.addEventListener('click', async () => {
    if (generatedJavaScript) {
      await navigator.clipboard.writeText(generatedJavaScript);
    }
  });
}

if (els.copyParams) {
  els.copyParams.addEventListener('click', async () => {
    await navigator.clipboard.writeText(els.simulationParams.value);
  });
}

if (els.saveArch) {
  els.saveArch.addEventListener('click', () => {
    if (generatedJavaScript) saveAs('generated_architecture.js', generatedJavaScript);
  });
}

els.clearLog.addEventListener('click', () => {
  els.log.innerHTML = '';
  const finalValuesCard = document.getElementById('finalValuesCard');
  if (finalValuesCard) finalValuesCard.style.display = 'none';
  
  traceEvents = [];
  traceIndex = -1;
  tracePlaying = false;
  clearTraceHighlights();
  renderTraceTable(traceEvents);
  updateTraceControls();
});

if (els.downloadLog) {
  els.downloadLog.addEventListener('click', () => {
    const content = els.log.innerText || els.log.textContent || '';
    if (!content.trim()) {
      appendToLog('[INFO] Nothing to download. Log is empty.\n');
      return;
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    saveAs(`simulation-log-${timestamp}.log`, content);
  });
}

els.btnTracePlay?.addEventListener('click', playTrace);
els.btnTracePause?.addEventListener('click', pauseTrace);
els.btnTraceStep?.addEventListener('click', stepTrace);
els.btnTraceStepBack?.addEventListener('click', stepBackTrace);
els.traceSpeed?.addEventListener('change', (event) => {
  const value = parseFloat(event.target.value);
  traceSpeedMultiplier = Number.isFinite(value) && value > 0 ? value : 1;
  if (tracePlaying) {
    stopTraceTimer();
    traceTimer = setTimeout(() => advanceTrace(), getTraceDelay());
  }
});

// Load SysADL File
els.fileInput.addEventListener('change', async (ev) => {
  const f = ev.target.files && ev.target.files[0];
  if (!f) return;

  try {
    const txt = await f.text();
    if (editor && typeof editor.setValue === 'function') {
      editor.setValue(txt);
    } else {
      const textarea = document.querySelector('#fallback-editor');
      if (textarea) textarea.value = txt;
    }
  } catch (error) {
    console.error('Error loading file:', error);
  }
});

// Load Custom JS File OVERRIDE
if (els.jsFileInput) {
  els.jsFileInput.addEventListener('change', async (ev) => {
    const f = ev.target.files && ev.target.files[0];
    if (!f) return;

    try {
      const js = await f.text();
      generatedJavaScript = js;
      isCustomJSLoaded = true;
      
      // Update UI 
      if (els.jsFileIndicator) els.jsFileIndicator.style.display = 'block';
      if (els.jsFileName) els.jsFileName.textContent = f.name;
      
      // Disable architecture copy/save for custom code
      if (els.saveArch) els.saveArch.disabled = true;
      if (els.copyArch) els.copyArch.disabled = true;
      
      // Attempt to extract params
      const typeExamples = extractTypeExamples(js);
      const { paramPorts, monitorPorts } = extractAvailablePorts(js);
      createInteractivePortsList(paramPorts, typeExamples);
      createMonitorablePortsList(monitorPorts);
      
      els.log.innerHTML += `<span class="log-line log-info">[INFO] Custom JavaScript model loaded: ${f.name}</span>\n`;
    } catch (error) {
      console.error('Error loading custom JS file:', error);
      appendToLog(`[ERROR] Failed to read custom JS file: ${error.message}\n`);
    }
  });
}

// Clear Custom JS File OVERRIDE
if (els.clearJsFile) {
  els.clearJsFile.addEventListener('click', () => {
    isCustomJSLoaded = false;
    generatedJavaScript = ''; // Will be repopulated next time user clicks Transform
    
    // Reset UI
    if (els.jsFileIndicator) els.jsFileIndicator.style.display = 'none';
    if (els.jsFileInput) els.jsFileInput.value = '';
    
    appendToLog(`[INFO] Custom JS model removed. Click Transform to generate code from the SysADL editor.\n`);
  });
}

// Only add event listener if button exists
if (els.btnExample) {
  els.btnExample.addEventListener('click', async () => {
    try {
      const response = await fetch('./AGV-completo.sysadl');
      if (response.ok) {
        const exampleCode = await response.text();
        if (editor && typeof editor.setValue === 'function') {
          editor.setValue(exampleCode);
        } else {
          const textarea = document.querySelector('#fallback-editor');
          if (textarea) textarea.value = exampleCode;
        }
      } else {
        throw new Error('File not found');
      }
    } catch (error) {
      console.error('Failed to load example:', error);
      const fallback = `model Demo
configuration {
  component Producer p1;
  component Consumer c1;
  connector Pipe link1 (p1.out -> c1.in);
}`;

      if (editor && typeof editor.setValue === 'function') {
        editor.setValue(fallback);
      } else {
        const textarea = document.querySelector('#fallback-editor');
        if (textarea) textarea.value = fallback;
      }
    }
  });
}

traceAnimator = { clear: clearTraceHighlights };
updateTraceControls();

console.log('✅ App ready - using Node.js server for transformations');
