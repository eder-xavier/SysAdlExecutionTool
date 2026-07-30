/**
 * Visualizer for SysADL architecture based on generated JS code
 * Uses vis.js (vis-network) to render components, ports, and connectors
 */

import { Network } from 'https://cdn.jsdelivr.net/npm/vis-network@9.1.9/+esm';

const palette = {
  canvas: '#eef2ff',
  canvasAccent: 'radial-gradient(circle at 10% 20%, rgba(79, 70, 229, 0.18), transparent 70%)',
  componentBg: '#dbeafe',
  componentBorder: '#312e81',
  componentHighlight: '#4338ca',
  subcomponentBg: '#f1f5f9',
  subcomponentBorder: '#475569',
  subcomponentHighlight: '#2563eb',
  portOut: '#22d3ee',
  portIn: '#fb7185',
  portUnknown: '#94a3b8',
  portShadow: 'rgba(15, 23, 42, 0.18)',
  connectorEdge: '#334155',
  connectorHighlight: '#0ea5e9',
  connectorLabelBg: 'rgba(255, 255, 255, 0.94)',
  swimlaneStroke: 'rgba(148, 163, 184, 0.35)',
  portLink: '#b4c2d9'
};

class FlowAnimator {
  constructor(network, overlay) {
    this.network = network;
    this.overlay = overlay;
    this.markers = new Map();
    this.targets = new Map();
    this.radius = 18;
  }

  _key(flowId) {
    if (flowId && flowId !== '--') return String(flowId);
    return '__default';
  }

  _ensureMarker(flowId) {
    const key = this._key(flowId);
    if (this.markers.has(key)) return this.markers.get(key);
    const marker = document.createElement('div');
    marker.className = 'flow-marker';
    marker.dataset.state = 'hidden';
    marker.style.opacity = '0';
    const valueLabel = document.createElement('span');
    valueLabel.className = 'flow-marker-value';
    marker.appendChild(valueLabel);
    this.overlay.appendChild(marker);
    this.markers.set(key, marker);
    return marker;
  }

  _formatValue(value) {
    if (value === undefined) return '';
    if (value === null) return 'null';
    if (typeof value === 'object') {
      try {
        const str = JSON.stringify(value);
        return str;
      } catch {
        return '[object]';
      }
    }
    return String(value);
  }

  _positionMarker(marker, domPos) {
    if (!domPos) return;
    marker.style.transform = `translate(${domPos.x - this.radius}px, ${domPos.y - this.radius}px)`;
  }

  _getDomPosition(nodeId) {
    if (!nodeId) return null;
    const positions = this.network.getPositions([nodeId]);
    const canvasPos = positions[nodeId];
    if (!canvasPos) return null;
    return this.network.canvasToDOM(canvasPos);
  }

  _setValue(marker, value) {
    const label = marker.querySelector('.flow-marker-value');
    const stringValue = this._formatValue(value);
    const trimmed = stringValue.length > 14 ? `${stringValue.slice(0, 13)}…` : stringValue;
    if (label) {
      label.textContent = trimmed;
    }
    if (stringValue) {
      marker.title = stringValue;
      marker.setAttribute('data-value', stringValue);
    } else {
      marker.removeAttribute('title');
      marker.removeAttribute('data-value');
    }
  }

  deemphasize() {
    this.markers.forEach(marker => {
      if (marker.dataset.state === 'visible') {
        marker.classList.remove('active');
        marker.style.opacity = marker.style.opacity && Number(marker.style.opacity) > 0 ? '0.25' : '0';
      }
    });
  }

  focus(flowId) {
    const key = this._key(flowId);
    this.markers.forEach((marker, markerKey) => {
      if (marker.dataset.state !== 'visible') return;
      if (markerKey === key) {
        marker.classList.add('active');
        marker.style.opacity = '1';
      } else {
        marker.classList.remove('active');
        marker.style.opacity = '0.25';
      }
    });
  }

  moveToNode(flowId, nodeId, value) {
    const domPos = this._getDomPosition(nodeId);
    if (!domPos) return false;
    const marker = this._ensureMarker(flowId);
    marker.dataset.state = 'visible';
    marker.style.transition = 'transform 0.4s ease, opacity 0.3s ease';
    marker.style.opacity = '0.65';
    this._positionMarker(marker, domPos);
    this._setValue(marker, value);
    this.targets.set(this._key(flowId), { type: 'node', id: nodeId });
    return true;
  }

  animate(flowId, fromId, toId, value) {
    const fromDom = this._getDomPosition(fromId) || this._getDomPosition(toId);
    if (!fromDom) return false;
    const marker = this._ensureMarker(flowId);
    marker.dataset.state = 'visible';
    marker.style.transition = 'transform 0.45s ease, opacity 0.3s ease';
    marker.style.opacity = '0.65';
    this._positionMarker(marker, fromDom);
    this._setValue(marker, value);
    const toDom = this._getDomPosition(toId);
    if (toDom) {
      requestAnimationFrame(() => this._positionMarker(marker, toDom));
    }
    this.targets.set(this._key(flowId), { type: 'node', id: toId || fromId });
    return true;
  }

  hide(flowId) {
    const marker = this.markers.get(this._key(flowId));
    if (marker) {
      marker.dataset.state = 'hidden';
      marker.classList.remove('active');
      marker.style.opacity = '0';
    }
    this.targets.delete(this._key(flowId));
  }

  hideAll() {
    this.markers.forEach(marker => {
      marker.dataset.state = 'hidden';
      marker.classList.remove('active');
      marker.style.opacity = '0';
    });
    this.targets.clear();
  }

  refresh() {
    this.targets.forEach((target, key) => {
      if (!target || target.type !== 'node') return;
      const domPos = this._getDomPosition(target.id);
      const marker = this.markers.get(key);
      if (!domPos || !marker) return;
      marker.style.transition = 'none';
      this._positionMarker(marker, domPos);
      requestAnimationFrame(() => {
        if (marker.dataset.state === 'visible') {
          marker.style.transition = 'transform 0.4s ease, opacity 0.3s ease';
        }
      });
    });
  }

  getTarget(flowId) {
    return this.targets.get(this._key(flowId)) || null;
  }
}

// Function to create a model from generated JS code
function createDynamicModel(generatedCode, logElement) {
  try {
    let normalizedCode = generatedCode.replace(/['"]use strict['"];/g, '');

    const prelude = [
      'var module = { exports: {} };',
      'var exports = module.exports;',
      'function require(p) {',
      "  if (typeof p === 'string' && p.includes('SysADLBase')) {",
      "    if (!window.SysADLBase) { throw new Error('window.SysADLBase is not available!'); }",
      "    return window.SysADLBase;",
      "  }",
      "  throw new Error('require is not supported in the browser: '+p);",
      '}'
    ].join('\n');
    const suffix = '\nreturn module.exports;';
    const code = prelude + '\n' + normalizedCode + suffix;

    let modelModule;
    try {
      modelModule = eval(`(function() { ${code} })()`);
    } catch (evalError) {
      console.error('Error evaluating generated JavaScript:', evalError);
      if (logElement) logElement.textContent += `[ERROR] Failed to evaluate generated JavaScript: ${evalError.message}\n`;
      return null;
    }

    if (!modelModule) {
      console.error('Generated code did not export a module');
      if (logElement) logElement.textContent += '[ERROR] Generated code did not export a module\n';
      return null;
    }

    if (typeof modelModule.createModel !== 'function') {
      console.error('Module does not export createModel. Exports:', Object.keys(modelModule));
      if (logElement) logElement.textContent += `[ERROR] Module does not export createModel. Exports: ${Object.keys(modelModule).join(', ')}\n`;
      return null;
    }

    let model;
    try {
      model = modelModule.createModel();
    } catch (createError) {
      console.error('Error while executing createModel:', createError);
      if (logElement) logElement.textContent += `[ERROR] Failed to execute createModel: ${createError.message}\n`;
      return null;
    }

    if (!model || typeof model !== 'object') {
      console.error('createModel returned an invalid value:', model);
      if (logElement) logElement.textContent += `[ERROR] createModel returned an invalid value: ${String(model)}\n`;
      return null;
    }

    console.log('✅ Model instantiated successfully:', model.name || 'Unnamed');
    if (logElement) logElement.textContent += `[INFO] Model instantiated successfully: ${model.name || 'Unnamed'}\n`;
    return model;
  } catch (error) {
    console.error('Unexpected error while creating dynamic model:', error);
    if (logElement) logElement.textContent += `[ERROR] Unexpected error while creating dynamic model: ${error.message}\n`;
    return null;
  }
}

// Function to extract architecture data from generated JS model
function extractArchitectureData(model, logElement) {
  const nodes = new Map();
  const edges = [];
  const ports = new Map();
  const portIndex = new Map();
  const portPathIndex = new Map();
  const componentPathIndex = new Map();
  const edgeLookup = new Map();
  const rootModel = model;
  const componentPortMap = new Map();
  const componentNodeIds = new Set();
  const compositeBoxes = new Map(); // id -> { x, y, w, h, label, level }

  const warn = (message) => {
    console.warn(message);
    if (logElement) {
      logElement.textContent += `[WARN] ${message}\n`;
    }
  };

  function normalizeComponentId(name, fallback) {
    if (typeof name === 'string' && name.trim().length > 0) {
      return name.trim();
    }
    return fallback || 'anonymous-component';
  }

  function buildPortId(componentName, portName) {
    if (!componentName || !portName) return null;
    return `${componentName}.${portName}`;
  }

  function registerPath(map, key, id) {
    if (!key || !id) return;
    const norm = key.trim();
    if (!norm) return;
    const list = map.get(norm);
    if (list) {
      if (!list.includes(id)) list.push(id);
    } else {
      map.set(norm, [id]);
    }
  }

  function registerEdgeLookup(fromId, toId, edgeId) {
    if (!fromId || !toId || !edgeId) return;
    const key = `${fromId}->${toId}`;
    const list = edgeLookup.get(key);
    if (list) {
      list.push(edgeId);
    } else {
      edgeLookup.set(key, [edgeId]);
    }
  }

  function addComponentNode(comp, parentId = null, level = 0, parentPath = null) {
    if (!comp || !comp.name) {
      warn(`Invalid component or missing name: ${JSON.stringify(comp)}`);
      return;
    }
    const componentId = normalizeComponentId(comp.name, parentId ? `${parentId}-child` : 'component');
    componentNodeIds.add(componentId);
    const resolvedPath = parentPath ? `${parentPath}.${comp.name}` : comp.name;
    registerPath(componentPathIndex, resolvedPath, componentId);
    registerPath(componentPathIndex, comp.name, componentId);

    const isComposite = comp.components && typeof comp.components === 'object' && Object.keys(comp.components).length > 0;

    if (!componentPortMap.has(componentId)) {
      componentPortMap.set(componentId, { in: [], out: [], other: [] });
    }

    // Composite components are NOT added as vis-network nodes (to avoid z-index occlusion).
    // They are stored in compositeBoxes and painted via beforeDrawing.
    if (!isComposite) {
      nodes.set(componentId, {
        id: componentId,
        label: comp.name,
        group: parentId ? 'subcomponent' : 'component',
        parentId,
        isComposite: false,
        level,
        shape: 'box',
        shapeProperties: { borderRadius: 8 },
        borderWidth: 1,
        color: parentId
          ? {
              background: palette.subcomponentBg,
              border: palette.subcomponentBorder,
              highlight: { background: '#cbd5e1', border: palette.subcomponentHighlight },
              hover: { background: '#cbd5e1', border: palette.subcomponentHighlight }
            }
          : {
              background: palette.componentBg,
              border: palette.componentBorder,
              highlight: { background: '#bfdbfe', border: palette.componentHighlight },
              hover: { background: '#bfdbfe', border: palette.componentHighlight }
            },
        font: {
          color: '#0f172a',
          face: 'Inter, "Segoe UI", sans-serif',
          size: parentId ? 14 : 16,
          vadjust: 6
        },
        shadow: {
          enabled: true,
          size: parentId ? 6 : 12,
          x: 0,
          y: 6,
          color: 'rgba(15, 23, 42, 0.24)'
        },
        title: `Component: ${comp.name}${parentId ? ` (child of ${parentId})` : ''}`
      });
    } else {
      // Register composite placeholder (geometry filled later during layout).
      compositeBoxes.set(componentId, {
        id: componentId,
        label: comp.name,
        level,
        parentId,
        x: 0, y: 0, w: 0, h: 0
      });
    }

    if (comp.ports && typeof comp.ports === 'object') {
      Object.entries(comp.ports).forEach(([portName, port]) => {
        if (!port || !portName) {
          warn(`Invalid port detected in ${componentId}`);
          return;
        }

        const portId = `${componentId}.${portName}`;
        const direction = port.direction || 'unknown';
        const group = direction === 'out' ? 'port_out' : direction === 'in' ? 'port_in' : 'port_unknown';

        nodes.set(portId, {
          id: portId,
          label: portName,
          group,
          parentId: componentId,
          shape: 'dot',
          size: 12,
          borderWidth: 1.5,
          shadow: { enabled: true, size: 6, x: 0, y: 2, color: palette.portShadow },
          physics: false,
          level,
          title: `Port: ${portName}\nDirection: ${direction}\nExpected type: ${port.expectedType || 'unknown'}`
        });

        ports.set(portId, {
          componentId,
          name: portName,
          direction,
          expectedType: port.expectedType || 'unknown',
          portRef: port
        });

        portIndex.set(port, portId);
        registerPath(portPathIndex, `${resolvedPath}.${portName}`, portId);
        registerPath(portPathIndex, `${comp.name}.${portName}`, portId);
        registerPath(portPathIndex, portName, portId);

        const groupMeta = componentPortMap.get(componentId);
        const bucket = direction === 'out' ? 'out' : direction === 'in' ? 'in' : 'other';
        groupMeta[bucket].push({
          id: portId,
          name: portName,
          direction
        });

        const compPortEdgeId = `cp:${componentId}->${portId}:${edges.length}`;
        edges.push({
          id: compPortEdgeId,
          from: componentId,
          to: portId,
          color: { color: 'rgba(180,194,217,0.55)' },
          dashes: [4, 4],
          arrows: 'none',
          width: 0.8,
          smooth: false,
          physics: false,
          length: 32,
          selectionWidth: 0,
          hoverWidth: 0,
          hidden: false
        });
        registerEdgeLookup(componentId, portId, compPortEdgeId);
      });
    } else {
      warn(`No ports found for component: ${componentId}`);
    }

    if (comp.components && typeof comp.components === 'object') {
      Object.values(comp.components).forEach(child => addComponentNode(child, componentId, level + 1, resolvedPath));
    }
  }

  function getFlowSchema(connector) {
    if (Array.isArray(connector?.flowSchema)) return connector.flowSchema;
    if (Array.isArray(connector?.props?.flowSchema)) return connector.props.flowSchema;
    return [];
  }

  function getParticipantSchema(connector) {
    return connector?.participantSchema || connector?.props?.participantSchema || {};
  }

  function normalizeOwnerName(ownerPath) {
    if (!ownerPath) return null;
    if (typeof ownerPath === 'string') {
      const trimmed = ownerPath.trim();
      if (!trimmed) return null;
      return trimmed.includes('.') ? trimmed.split('.')[0] : trimmed;
    }
    if (ownerPath.name) return ownerPath.name;
    return null;
  }

  function bindingFromMap(binding, directionHint) {
    if (!binding) return null;
    const componentName = binding.componentName || normalizeOwnerName(binding.ownerPath || binding.owner);
    const portName = binding.portName || binding.port?.name || binding.portRef?.name || null;
    const portRef = binding.portRef || binding.port || null;
    const portId = portRef && portIndex.has(portRef) ? portIndex.get(portRef) : buildPortId(componentName, portName);
    return {
      componentName,
      portName,
      portId,
      portRef,
      direction: binding.direction || binding.port?.direction || directionHint || null
    };
  }

  function getBindingFromConnector(connector, role, directionHint) {
    if (!connector) return null;
    if (connector.boundParticipants && connector.boundParticipants[role]) {
      return bindingFromMap(connector.boundParticipants[role], directionHint);
    }
    if (connector.bindings && connector.bindings[role]) {
      return bindingFromMap(connector.bindings[role], directionHint);
    }
    return null;
  }

  function matchesSchema(port, portName, role, schema, directionHint) {
    if (!port) return false;
    const normalizedDirection = directionHint || schema?.direction || null;
    const schemaPortClass = schema?.portClass || null;
    const schemaType = schema?.dataType || null;

    if (role && portName === role) return true;
    if (schemaPortClass && port.constructor && port.constructor.name === schemaPortClass) return true;
    if (normalizedDirection && port.direction === normalizedDirection) return true;
    if (schemaType && port.expectedType === schemaType) return true;
    return false;
  }

  function searchPort(component, role, schema, directionHint) {
    if (!component) return null;

    if (component.ports && typeof component.ports === 'object') {
      for (const [portName, port] of Object.entries(component.ports)) {
        if (matchesSchema(port, portName, role, schema, directionHint)) {
          const componentName = component.name || normalizeComponentId(null, 'component');
          const portId = portIndex.get(port) || buildPortId(componentName, portName);
          return {
            componentName,
            portName,
            portId,
            portRef: port,
            direction: port.direction
          };
        }
      }
    }

    if (component.components && typeof component.components === 'object') {
      for (const child of Object.values(component.components)) {
        const candidate = searchPort(child, role, schema, directionHint);
        if (candidate) return candidate;
      }
    }

    return null;
  }

  function resolveBinding(connector, role, schema, directionHint) {
    const direct = getBindingFromConnector(connector, role, directionHint || schema?.direction);
    if (direct && direct.portId) {
      return direct;
    }
    const fallback = searchPort(rootModel, role, schema, directionHint);
    return fallback || direct || null;
  }

  function addConnectorEdges(comp) {
    if (!comp || !comp.connectors || typeof comp.connectors !== 'object') return;

    Object.entries(comp.connectors).forEach(([connName, conn]) => {
      if (!conn) {
        warn(`Connector ${connName} is null`);
        return;
      }

      const flows = getFlowSchema(conn);
      const participantSchema = getParticipantSchema(conn);

      if (flows.length > 0) {
        flows.forEach(flow => {
          if (!flow || !flow.from || !flow.to) return;
          const fromSchema = participantSchema[flow.from] || {};
          const toSchema = participantSchema[flow.to] || {};

          let fromBinding = resolveBinding(conn, flow.from, fromSchema, fromSchema.direction);
          let toBinding = resolveBinding(conn, flow.to, toSchema, toSchema.direction);

          const fromDir = (fromBinding?.portRef?.direction || fromBinding?.direction || '').toLowerCase();
          const toDir = (toBinding?.portRef?.direction || toBinding?.direction || '').toLowerCase();
          const shouldSwap =
            (fromDir === 'in' && toDir === 'out') ||
            (fromDir === 'in' && (!toDir || toDir === 'in')) ||
            (fromDir !== 'out' && toDir === 'out');

          if (shouldSwap) {
            const temp = fromBinding;
            fromBinding = toBinding;
            toBinding = temp;
          }

          const fromPortId = fromBinding?.portId;
          const toPortId = toBinding?.portId;

          if (fromPortId && toPortId && nodes.has(fromPortId) && nodes.has(toPortId)) {
            const edgeId = `conn:${connName}:${edges.length}`;
            const edgeCount = edges.filter(e => e.from === fromPortId || e.to === toPortId).length;
            edges.push({
              id: edgeId,
              from: fromPortId,
              to: toPortId,
              label: '',
              connLabel: connName,
              isConnector: true,
              channelIndex: edgeCount,
              arrows: 'none',
              color: { color: 'rgba(0,0,0,0)', highlight: palette.connectorHighlight, hover: palette.connectorHighlight },
              width: 0,
              smooth: false,
              selectionWidth: 8,
              hoverWidth: 8,
              chosen: false,
              title: `Connector: ${connName}\nFlow: ${flow.from} → ${flow.to}`
            });
            registerEdgeLookup(fromPortId, toPortId, edgeId);
          } else {
            warn(`Connector ${connName} could not map ports (${fromPortId || '??'} → ${toPortId || '??'})`);
          }
        });
      } else if (conn.from && conn.to) {
        const fromParts = conn.from.split('.');
        const toParts = conn.to.split('.');
        let fromPortId = buildPortId(fromParts[0], fromParts[1]);
        let toPortId = buildPortId(toParts[0], toParts[1]);

        if (fromPortId && toPortId && nodes.has(fromPortId) && nodes.has(toPortId)) {
          const fromNode = ports.get(fromPortId);
          const toNode = ports.get(toPortId);
          const fromDir = (fromNode?.direction || '').toLowerCase();
          const toDir = (toNode?.direction || '').toLowerCase();
          const shouldSwap =
            (fromDir === 'in' && toDir === 'out') ||
            (fromDir === 'in' && (!toDir || toDir === 'in')) ||
            (fromDir !== 'out' && toDir === 'out');
          if (shouldSwap) {
            const tmp = fromPortId;
            fromPortId = toPortId;
            toPortId = tmp;
          }
        }

        if (fromPortId && toPortId && nodes.has(fromPortId) && nodes.has(toPortId)) {
          const edgeId = `conn:${connName}:${edges.length}`;
          const edgeCount2 = edges.filter(e => e.from === fromPortId || e.to === toPortId).length;
          edges.push({
            id: edgeId,
            from: fromPortId,
            to: toPortId,
            label: '',
            connLabel: connName,
            isConnector: true,
            channelIndex: edgeCount2,
            arrows: 'none',
            color: { color: 'rgba(0,0,0,0)', highlight: palette.connectorHighlight, hover: palette.connectorHighlight },
            width: 0,
            smooth: false,
            selectionWidth: 8,
            hoverWidth: 8,
            chosen: false,
            title: `Connector: ${connName}\nDirect link: ${conn.from} → ${conn.to}`
          });
          registerEdgeLookup(fromPortId, toPortId, edgeId);
        } else {
          warn(`Connector ${connName} did not locate direct ports (${conn.from} → ${conn.to})`);
        }
      } else {
        warn(`Connector without a recognized flow schema: ${connName}`);
      }
    });

    if (comp.components && typeof comp.components === 'object') {
      Object.values(comp.components).forEach(child => addConnectorEdges(child));
    }
  }

  if (model && typeof model === 'object') {
    try {
      // Skip drawing the root 'SysADL model' node itself, but draw its inner components as roots
      if (model.components && typeof model.components === 'object') {
        Object.values(model.components).forEach(child => addComponentNode(child, null, 0, null));
      }
      addConnectorEdges(model);
    } catch (error) {
      console.error('Error extracting architecture data:', error);
      if (logElement) {
        logElement.textContent += `[ERROR] Failed to extract architecture data: ${error.message}\n`;
      }
    }
  } else {
    warn('Model is invalid or was not provided');
  }

  const nodesArray = Array.from(nodes.values());

  // childrenMap uses ALL ids — both nodes Map entries and compositeBoxes
  const childrenMap = new Map();
  const rootNodes = [];

  // Merge all known component ids
  const allCompIds = new Set([...nodes.keys(), ...compositeBoxes.keys()]);
  allCompIds.forEach(id => {
    const node = nodes.get(id) || compositeBoxes.get(id);
    if (!node) return;
    const group = node.group;
    // Only process component/subcomponent entries (not ports)
    if (id.includes('.') && !compositeBoxes.has(id)) return; // skip ports (component.port form)
    if (group === 'component' || group === 'subcomponent' || compositeBoxes.has(id)) {
      if (node.parentId) {
        if (!childrenMap.has(node.parentId)) childrenMap.set(node.parentId, []);
        childrenMap.get(node.parentId).push(id);
      } else {
        rootNodes.push(nodes.get(id) || compositeBoxes.get(id));
      }
    }
  });

  // 2. Bottom-up sizing
  const PADDING_TOP = 80;    // Space for the label pill at top
  const PADDING_BOTTOM = 55; // Space for bottom ports
  const PADDING_SIDE = 95;   // Generous horizontal padding for port labels
  const GAP_X = 220;         // Wider horizontal gap to completely prevent overlaps
  const GAP_Y = 180;         // Vertical gap between wrapped rows of subcomponents
  const MIN_WIDTH = 240;
  const MIN_HEIGHT = 90;

  function getNodeObj(id) {
    return nodes.get(id) || compositeBoxes.get(id);
  }

  function calculateLayout(nodeId) {
    const node = getNodeObj(nodeId);
    if (!node) return;

    const childrenList = childrenMap.get(nodeId) || [];
    
    // Base case
    if (childrenList.length === 0) {
      node.calcWidth = MIN_WIDTH;
      node.calcHeight = MIN_HEIGHT;
      node.widthConstraint = { minimum: node.calcWidth, maximum: node.calcWidth };
      node.heightConstraint = { minimum: node.calcHeight };
      return;
    }

    // Recursive case
    childrenList.forEach(childId => calculateLayout(childId));

    // Wrap children in rows of max 3 elements
    const maxCols = 3;
    const rows = [];
    for (let i = 0; i < childrenList.length; i += maxCols) {
      rows.push(childrenList.slice(i, i + maxCols));
    }

    // Width of parent is the maximum row width
    let maxRowWidth = 0;
    rows.forEach(row => {
      let rowWidth = 0;
      row.forEach((childId, idx) => {
        const childNode = getNodeObj(childId);
        if (childNode) {
          rowWidth += childNode.calcWidth || MIN_WIDTH;
          if (idx > 0) rowWidth += GAP_X;
        }
      });
      if (rowWidth > maxRowWidth) maxRowWidth = rowWidth;
    });

    // Height of parent is sum of row heights + gaps
    let totalRowsHeight = 0;
    rows.forEach((row, idx) => {
      let maxChildHeight = 0;
      row.forEach(childId => {
        const childNode = getNodeObj(childId);
        if (childNode && childNode.calcHeight > maxChildHeight) {
          maxChildHeight = childNode.calcHeight;
        }
      });
      totalRowsHeight += maxChildHeight;
      if (idx > 0) totalRowsHeight += GAP_Y;
    });

    node.calcWidth = maxRowWidth + (PADDING_SIDE * 2);
    node.calcHeight = totalRowsHeight + PADDING_TOP + PADDING_BOTTOM;

    // Expand bounding box for vis.js drawing plane only for real nodes
    if (nodes.has(nodeId)) {
      node.widthConstraint = { minimum: node.calcWidth, maximum: node.calcWidth };
      node.heightConstraint = { minimum: node.calcHeight };
      node.font = { ...node.font, vadjust: -(node.calcHeight / 2) + 24 };
    }

    // Sync compositeBox geometry
    if (compositeBoxes.has(nodeId)) {
      const cb = compositeBoxes.get(nodeId);
      cb.w = node.calcWidth;
      cb.h = node.calcHeight;
    }
  }

  rootNodes.forEach(root => calculateLayout(root.id));

  // 3. Top-down geometric mapping
  function assignPosition(nodeId, startX, startY) {
    const node = getNodeObj(nodeId);
    if (!node) return;

    // Center pivot calculation
    node.x = startX + node.calcWidth / 2;
    node.y = startY + node.calcHeight / 2;

    // Only fix position for real vis-network nodes
    if (nodes.has(nodeId)) {
      node.fixed = { x: true, y: true };
      node.physics = false;
    }

    // Sync compositeBox
    if (compositeBoxes.has(nodeId)) {
      const cb = compositeBoxes.get(nodeId);
      cb.x = startX;
      cb.y = startY;
      cb.w = node.calcWidth;
      cb.h = node.calcHeight;
    }

    // Distribute children sequentially inside (Topologically sorted based on data flow!)
    let childrenList = childrenMap.get(nodeId) || [];
    if (childrenList.length > 0) {
      
      // Compute Topological Sort left-to-right based on internal connectors
      const adj = {};
      const inDegree = {};
      childrenList.forEach(c => { adj[c] = []; inDegree[c] = 0; });
      
      edges.forEach(e => {
        const fromPort = nodes.get(e.from);
        const toPort = nodes.get(e.to);
        const fromComp = fromPort ? fromPort.parentId : null;
        const toComp = toPort ? toPort.parentId : null;
        
        if (fromComp && toComp && fromComp !== toComp && childrenList.includes(fromComp) && childrenList.includes(toComp)) {
          if (!adj[fromComp].includes(toComp)) {
            adj[fromComp].push(toComp);
            inDegree[toComp]++;
          }
        }
      });
      
      const sorted = [];
      const queue = childrenList.filter(c => inDegree[c] === 0);
      while(queue.length > 0) {
        const u = queue.shift();
        sorted.push(u);
        adj[u].forEach(v => {
          inDegree[v]--;
          if (inDegree[v] === 0) queue.push(v);
        });
      }
      
      // Append any components caught in loops or isolated
      childrenList.forEach(c => { if (!sorted.includes(c)) sorted.push(c); });
      childrenList = sorted;

      // Group children into rows of max 3 elements
      const maxCols = 3;
      const rows = [];
      for (let i = 0; i < childrenList.length; i += maxCols) {
        rows.push(childrenList.slice(i, i + maxCols));
      }

      let currentY = startY + PADDING_TOP;
      rows.forEach(row => {
        // Find max height of this row
        let rowMaxHeight = 0;
        row.forEach(childId => {
          const childNode = getNodeObj(childId);
          if (childNode && childNode.calcHeight > rowMaxHeight) {
            rowMaxHeight = childNode.calcHeight;
          }
        });

        // Distribute elements in the row horizontally
        let currentX = startX + PADDING_SIDE;
        row.forEach(childId => {
          const childNode = getNodeObj(childId);
          if (childNode) {
            // Align child vertically centered inside the row's height bounds
            const childStartY = currentY + (rowMaxHeight - childNode.calcHeight) / 2;
            assignPosition(childId, currentX, childStartY);
            currentX += childNode.calcWidth + GAP_X;
          }
        });

        currentY += rowMaxHeight + GAP_Y;
      });
    }
  }

  // Sort the root configurations functionally left-to-right as well
  let rootList = rootNodes.map(r => r.id);
  const rootAdj = {};
  const rootInDegree = {};
  rootList.forEach(c => { rootAdj[c] = []; rootInDegree[c] = 0; });
  edges.forEach(e => {
    const fromPort = nodes.get(e.from);
    const toPort = nodes.get(e.to);
    const fromComp = fromPort ? fromPort.parentId : null;
    const toComp = toPort ? toPort.parentId : null;
    if (fromComp && toComp && fromComp !== toComp && rootList.includes(fromComp) && rootList.includes(toComp)) {
      if (!rootAdj[fromComp].includes(toComp)) {
        rootAdj[fromComp].push(toComp);
        rootInDegree[toComp]++;
      }
    }
  });
  const rootSorted = [];
  const rootQueue = rootList.filter(c => rootInDegree[c] === 0);
  while(rootQueue.length > 0) {
    const u = rootQueue.shift();
    rootSorted.push(u);
    rootAdj[u].forEach(v => {
      rootInDegree[v]--;
      if (rootInDegree[v] === 0) rootQueue.push(v);
    });
  }
  rootList.forEach(c => { if (!rootSorted.includes(c)) rootSorted.push(c); });
  rootList = rootSorted;

  // Wrap root components into rows of max 2 elements to structure vertically
  const maxRootCols = 2;
  const rootRows = [];
  for (let i = 0; i < rootList.length; i += maxRootCols) {
    rootRows.push(rootList.slice(i, i + maxRootCols));
  }

  let currentRootY = 0;
  const ROOT_GAP_Y = 240; // Vertical gap between rows of root components

  rootRows.forEach(row => {
    let rowMaxHeight = 0;
    row.forEach(rootId => {
      const rootNode = getNodeObj(rootId);
      if (rootNode && rootNode.calcHeight > rowMaxHeight) {
        rowMaxHeight = rootNode.calcHeight;
      }
    });

    let currentRootX = 0;
    row.forEach(rootId => {
      const rootNode = getNodeObj(rootId);
      if (rootNode) {
        assignPosition(rootId, currentRootX, currentRootY);
        currentRootX += rootNode.calcWidth + 400; // Generous horizontal spacing between root components
      }
    });

    currentRootY += rowMaxHeight + ROOT_GAP_Y;
  });

  // 4. Distribute Ports geometrically mapping to container size
  componentPortMap.forEach((groups, componentId) => {
    // Composite components have geometry in compositeBoxes; leaf components in nodes
    const compNode = getNodeObj(componentId);
    if (!compNode) return;

    // For compositeBoxes, x/y is top-left corner; for vis nodes it's centre
    const isCompBox = compositeBoxes.has(componentId);
    const baseX = isCompBox ? compNode.x + compNode.w / 2 : compNode.x;
    const baseY = isCompBox ? compNode.y + compNode.h / 2 : compNode.y;
    const halfWidth  = (isCompBox ? compNode.w : compNode.calcWidth)  / 2;
    const halfHeight = (isCompBox ? compNode.h : compNode.calcHeight) / 2;

    const leftXApprox  = baseX - halfWidth  - 18;
    const rightXApprox = baseX + halfWidth  + 18;
    const bottomYApprox = baseY + halfHeight + 18;

    const verticalSpacing = 42;
    const horizontalSpacing = 60;

    const placePorts = (portsArr, targetX, targetY, align = 'vertical') => {
      if (!Array.isArray(portsArr) || portsArr.length === 0) return;
      const count = portsArr.length;
      portsArr.forEach((port, index) => {
        const portNode = nodes.get(port.id);
        if (!portNode) return;
        if (align === 'vertical') {
          const offset = (index - (count - 1) / 2) * verticalSpacing;
          portNode.x = targetX;
          portNode.y = targetY + offset;
        } else {
          const offset = (index - (count - 1) / 2) * horizontalSpacing;
          portNode.x = targetX + offset;
          portNode.y = targetY;
        }
        portNode.fixed = { x: true, y: true };
        portNode.physics = false;
      });
    };

    placePorts(groups?.in,  leftXApprox,  baseY, 'vertical');
    placePorts(groups?.out, rightXApprox, baseY, 'vertical');
    placePorts(groups?.other, baseX, bottomYApprox, 'horizontal');
  });

  return {
    nodes: Array.from(nodes.values()),
    edges,
    compositeBoxes: Array.from(compositeBoxes.values()),
    ports: Array.from(ports.entries()),
    componentPortMap: Object.fromEntries(componentPortMap),
    componentNodeIds: Array.from(componentNodeIds),
    portPathIndex: Array.from(portPathIndex.entries()),
    componentPathIndex: Array.from(componentPathIndex.entries()),
    edgeLookup: Array.from(edgeLookup.entries())
  };
}

// Function to render the visualization
function renderVisualization(containerId, generatedCode, logElement) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Visualization container not found:', containerId);
    if (logElement) logElement.textContent += `[ERROR] Visualization container not found: ${containerId}\n`;
    return;
  }

  try {
    const model = createDynamicModel(generatedCode, logElement);
    if (!model) {
      console.warn('No valid model available to visualize');
      if (logElement) logElement.textContent += '[ERROR] No valid model available to visualize\n';
      return;
    }
    const {
      nodes,
      edges,
      compositeBoxes,
      componentPortMap,
      componentNodeIds,
      portPathIndex,
      componentPathIndex,
      edgeLookup
    } = extractArchitectureData(model, logElement);
    const portPathMap = new Map(portPathIndex || []);
    const componentPathMap = new Map(componentPathIndex || []);
    const edgeLookupMap = new Map(edgeLookup || []);
    if (nodes.length === 0 && edges.length === 0) {
      console.warn('No architecture data available to visualize');
      if (logElement) logElement.textContent += '[ERROR] No architecture data available to visualize\n';
      return;
    }
    const data = { nodes, edges };
    container.style.background = palette.canvas;
    container.style.backgroundImage = 'none'; // Lisa (flat, smooth clean background)
    container.style.border = '1px solid rgba(99, 102, 241, 0.35)';
    container.style.borderRadius = '20px';
    container.style.boxShadow = '0 26px 52px rgba(15, 23, 42, 0.14)';
    container.style.padding = '0';
    container.style.minHeight = '600px';
    container.style.height = '600px';
    container.style.width = '100%';
    container.style.position = 'relative';
    container.style.overflow = 'hidden';

    const options = {
      layout: {
        improvedLayout: false
      },
      nodes: {
        shapeProperties: { borderRadius: 10 },
        margin: 24,
        font: {
          size: 16,
          face: 'Inter, "Segoe UI", sans-serif',
          color: '#0f172a',
          bold: { size: 18, color: '#0f172a' }
        },
        borderWidth: 0,
        shadow: { enabled: true, size: 12, x: 0, y: 6, color: 'rgba(15, 23, 42, 0.18)' },
        // Keep labels readable at any zoom level
        scaling: {
          label: {
            enabled: true,
            min: 10,
            max: 30,
            drawThreshold: 2,
            maxVisible: 30
          }
        }
      },
      groups: {
        component: {
          color: {
            background: palette.componentBg,
            border: palette.componentBorder
          },
          font: { color: '#0f172a', bold: { color: '#0f172a', size: 17 } }
        },
        subcomponent: {
          color: {
            background: palette.subcomponentBg,
            border: palette.subcomponentBorder
          },
          font: { color: '#0f172a', bold: { color: '#0f172a', size: 15 } }
        },
        port_out: {
          shape: 'square',
          color: { background: palette.portOut, border: '#0b5675' },
          size: 10,
          borderWidth: 1.5,
          font: { size: 11, color: '#0c4a6e', strokeWidth: 2, strokeColor: 'rgba(255,255,255,0.85)', face: 'Inter, "Segoe UI", sans-serif' },
          scaling: { label: { enabled: true, min: 9, max: 18, drawThreshold: 1 } }
        },
        port_in: {
          shape: 'square',
          color: { background: palette.portIn, border: '#c2410c' },
          size: 10,
          borderWidth: 1.5,
          font: { size: 11, color: '#7c1d04', strokeWidth: 2, strokeColor: 'rgba(255,255,255,0.85)', face: 'Inter, "Segoe UI", sans-serif' },
          scaling: { label: { enabled: true, min: 9, max: 18, drawThreshold: 1 } }
        },
        port_unknown: {
          shape: 'square',
          color: { background: palette.portUnknown, border: '#64748b' },
          size: 10,
          borderWidth: 1.5,
          font: { size: 11, color: '#334155', strokeWidth: 2, strokeColor: 'rgba(255,255,255,0.85)', face: 'Inter, "Segoe UI", sans-serif' },
          scaling: { label: { enabled: true, min: 9, max: 18, drawThreshold: 1 } }
        }
      },
      edges: {
        arrows: { to: { enabled: true, type: 'triangle', scaleFactor: 0.9 } },
        color: { color: palette.connectorEdge, highlight: palette.connectorHighlight },
        width: 2,
        // CAD-style horizontal-first orthogonal routing
        smooth: { enabled: true, type: 'cubicBezier', forceDirection: 'horizontal', roundness: 0.4 },
        shadow: { enabled: true, size: 4, x: 0, y: 2, color: 'rgba(15, 23, 42, 0.10)' },
        font: {
          size: 12,
          face: 'Inter, "Segoe UI", sans-serif',
          color: '#1e1b4b',
          background: palette.connectorLabelBg,
          strokeWidth: 2,
          strokeColor: 'rgba(255,255,255,0.9)',
          vadjust: -5,
          bold: false
        },
        chosen: false
      },
      physics: {
        enabled: false
      },
      interaction: {
        dragNodes: true,
        dragView: true,
        zoomView: true,
        hover: false,
        tooltipDelay: 120,
        hoverConnectedEdges: false,
        multiselect: true,
        selectable: true,
        navigationButtons: true,
        keyboard: { enabled: true, bindToWindow: false },
        selectConnectedEdges: false
      },
      manipulation: {
        enabled: false
      }
    };

    const network = new Network(container, data, options);

    // Reconstruct childrenMap (parent -> list of child component/subcomponent/composite IDs)
    const childrenMap = new Map();
    nodes.forEach(node => {
      if (node.parentId && (node.group === 'component' || node.group === 'subcomponent')) {
        if (!childrenMap.has(node.parentId)) childrenMap.set(node.parentId, []);
        childrenMap.get(node.parentId).push(node.id);
      }
    });
    compositeBoxes.forEach(box => {
      if (box.parentId) {
        if (!childrenMap.has(box.parentId)) childrenMap.set(box.parentId, []);
        childrenMap.get(box.parentId).push(box.id);
      }
    });

    const compositeBoxesMap = new Map(compositeBoxes.map(b => [b.id, b]));

    // Function to recursively recalculate bounds of composite boxes based on child positions
    const recalculateCompositeBoxes = () => {
      const computedBounds = new Map();

      const getBounds = (id) => {
        if (computedBounds.has(id)) {
          return computedBounds.get(id);
        }

        const children = childrenMap.get(id) || [];
        if (children.length === 0) return null;

        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;

        children.forEach(childId => {
          if (compositeBoxesMap.has(childId)) {
            const bounds = getBounds(childId);
            if (bounds) {
              minX = Math.min(minX, bounds.left);
              maxX = Math.max(maxX, bounds.right);
              minY = Math.min(minY, bounds.top);
              maxY = Math.max(maxY, bounds.bottom);
            }
          } else {
            const box = network.getBoundingBox(childId);
            if (box && isFinite(box.top) && isFinite(box.bottom) && isFinite(box.left) && isFinite(box.right)) {
              minX = Math.min(minX, box.left);
              maxX = Math.max(maxX, box.right);
              minY = Math.min(minY, box.top);
              maxY = Math.max(maxY, box.bottom);
            }
          }
        });

        if (minX === Infinity) return null;

        const left = minX - 50;
        const right = maxX + 50;
        const top = minY - 65;
        const bottom = maxY + 40;

        const bounds = { left, right, top, bottom, w: right - left, h: bottom - top };
        computedBounds.set(id, bounds);
        return bounds;
      };

      compositeBoxes.forEach(box => {
        const bounds = getBounds(box.id);
        if (bounds) {
          box.x = bounds.left;
          box.y = bounds.top;
          box.w = bounds.w;
          box.h = bounds.h;
        }
      });
    };

    // --- Draw composite container boxes BEHIND all nodes + edges ---
    // vis-network always draws nodes on top of edges; we bypass this by painting
    // composite containers manually via the beforeDrawing canvas hook.
    if (compositeBoxes && compositeBoxes.length > 0) {
      network.on('beforeDrawing', (ctx) => {
        // Always recalculate so the box follows nodes during drag
        recalculateCompositeBoxes();

        // Sort so outermost (lowest nesting level) boxes are drawn first (behind children)
        const sorted = [...compositeBoxes].sort((a, b) => (a.level || 0) - (b.level || 0));

        sorted.forEach(box => {
          if (!box.w || !box.h) return;

          const scale = network.getScale();
          const topLeft = network.canvasToDOM({ x: box.x, y: box.y });
          const bottomRight = network.canvasToDOM({ x: box.x + box.w, y: box.y + box.h });
          const canvasTopLeft = network.DOMtoCanvas(topLeft);
          const canvasBottomRight = network.DOMtoCanvas(bottomRight);
          const rx = canvasTopLeft.x;
          const ry = canvasTopLeft.y;
          const rw = canvasBottomRight.x - canvasTopLeft.x;
          const rh = canvasBottomRight.y - canvasTopLeft.y;
          const radius = Math.max(8, Math.min(18, rw * 0.04));

          const isNested = (box.level || 0) > 0;
          const fillColor = isNested ? 'rgba(238, 242, 255, 0.45)' : 'rgba(219, 234, 254, 0.30)';
          const borderColor = isNested ? '#4f46e5' : '#312e81';
          const dashPattern = isNested ? [6, 4] : [10, 6];
          const lineW = isNested ? 1.5 : 2.5;

          ctx.save();

          // Draw rounded rect
          ctx.beginPath();
          ctx.moveTo(rx + radius, ry);
          ctx.lineTo(rx + rw - radius, ry);
          ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + radius);
          ctx.lineTo(rx + rw, ry + rh - radius);
          ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - radius, ry + rh);
          ctx.lineTo(rx + radius, ry + rh);
          ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - radius);
          ctx.lineTo(rx, ry + radius);
          ctx.quadraticCurveTo(rx, ry, rx + radius, ry);
          ctx.closePath();

          // Fill
          ctx.fillStyle = fillColor;
          ctx.fill();

          // Dashed border
          ctx.setLineDash(dashPattern);
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = lineW;
          ctx.stroke();
          ctx.setLineDash([]);

          // Label pill
          const labelFontSize = Math.max(11, Math.round(13 * scale));
          ctx.font = `600 ${labelFontSize}px Inter, "Segoe UI", sans-serif`;
          const labelText = box.label || '';
          const textW = ctx.measureText(labelText).width;
          const pillPadX = 8 * scale;
          const pillH = (labelFontSize + 8) * scale;
          const pillX = rx + 10;
          const pillY = ry + 8;
          const pillW = textW + pillPadX * 2;
          const pr = pillH / 2;

          ctx.beginPath();
          ctx.moveTo(pillX + pr, pillY);
          ctx.lineTo(pillX + pillW - pr, pillY);
          ctx.quadraticCurveTo(pillX + pillW, pillY, pillX + pillW, pillY + pr);
          ctx.lineTo(pillX + pillW, pillY + pillH - pr);
          ctx.quadraticCurveTo(pillX + pillW, pillY + pillH, pillX + pillW - pr, pillY + pillH);
          ctx.lineTo(pillX + pr, pillY + pillH);
          ctx.quadraticCurveTo(pillX, pillY + pillH, pillX, pillY + pillH - pr);
          ctx.lineTo(pillX, pillY + pr);
          ctx.quadraticCurveTo(pillX, pillY, pillX + pr, pillY);
          ctx.closePath();
          ctx.fillStyle = isNested ? 'rgba(99,102,241,0.18)' : 'rgba(49,46,129,0.12)';
          ctx.fill();

          ctx.fillStyle = borderColor;
          ctx.fillText(labelText, pillX + pillPadX, pillY + pillH * 0.72);

          ctx.restore();
        });
      });
    }

    // ─── Intelligent Orthogonal (90-degree) Corridor Router ───────────────────
    const connectorEdgeData = edges.filter(e => e.isConnector);

    const drawArrow = (ctx, px, py, dx, dy, size) => {
      const angle = Math.atan2(dy, dx);
      const a1 = angle + Math.PI * 0.82;
      const a2 = angle - Math.PI * 0.82;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + Math.cos(a1) * size, py + Math.sin(a1) * size);
      ctx.lineTo(px + Math.cos(a2) * size, py + Math.sin(a2) * size);
      ctx.closePath();
      ctx.fill();
    };

    const drawEdgeLabel = (ctx, text, cx, cy, fontSize) => {
      ctx.font = `600 ${fontSize}px Inter, "Segoe UI", sans-serif`;
      const tw = ctx.measureText(text).width;
      const pw = tw + 10, ph = fontSize + 8;
      const rx2 = cx - pw / 2, ry2 = cy - ph / 2, rr = ph / 2;
      ctx.beginPath();
      ctx.moveTo(rx2 + rr, ry2);
      ctx.lineTo(rx2 + pw - rr, ry2);
      ctx.quadraticCurveTo(rx2 + pw, ry2, rx2 + pw, ry2 + rr);
      ctx.lineTo(rx2 + pw, ry2 + ph - rr);
      ctx.quadraticCurveTo(rx2 + pw, ry2 + ph, rx2 + pw - rr, ry2 + ph);
      ctx.lineTo(rx2 + rr, ry2 + ph);
      ctx.quadraticCurveTo(rx2, ry2 + ph, rx2, ry2 + ph - rr);
      ctx.lineTo(rx2, ry2 + rr);
      ctx.quadraticCurveTo(rx2, ry2, rx2 + rr, ry2);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255,255,255,0.94)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(99,102,241,0.45)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.fillStyle = '#1e1b4b';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, cx, cy);
    };

    const drawRoundedPath = (ctx, pts, radius) => {
      if (pts.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++) {
        const p0 = pts[i - 1];
        const p1 = pts[i];
        const p2 = pts[i + 1];

        const dx1 = p1.x - p0.x, dy1 = p1.y - p0.y;
        const len1 = Math.sqrt(dx1*dx1 + dy1*dy1) || 1;
        const dx2 = p2.x - p1.x, dy2 = p2.y - p1.y;
        const len2 = Math.sqrt(dx2*dx2 + dy2*dy2) || 1;

        const actualR = Math.min(radius, len1 / 2, len2 / 2);
        const startX = p1.x - (dx1 / len1) * actualR;
        const startY = p1.y - (dy1 / len1) * actualR;
        const endX = p1.x + (dx2 / len2) * actualR;
        const endY = p1.y + (dy2 / len2) * actualR;

        ctx.lineTo(startX, startY);
        ctx.quadraticCurveTo(p1.x, p1.y, endX, endY);
      }
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
    };

    const CHANNEL_SPACING = 14; 
    const EXIT_MARGIN     = 20; 

    network.on('afterDrawing', (ctx) => {
      if (!connectorEdgeData.length) return;
      const positions = network.getPositions();
      const scale = network.getScale();

      const edgeColor  = '#64748b'; // clean slate grey for thin visual edges
      const lineWidth  = Math.max(0.6, 1.25 / scale); // thin 1.2px visual thickness
      const arrowSize  = Math.max(4, 8 / scale);
      const fontSize   = Math.max(8.5, 11 / scale);
      const showLabels = scale > 0.15;

      const getLocalNodeObj = (id) => {
        const foundNode = nodes.find(n => n.id === id);
        if (foundNode) return foundNode;
        const foundBox = compositeBoxes.find(b => b.id === id);
        if (foundBox) return foundBox;
        return null;
      };

      const pairChannels = new Map();

      connectorEdgeData.forEach(edge => {
        const fromPos = positions[edge.from];
        const toPos   = positions[edge.to];
        if (!fromPos || !toPos) return;

        const pairKey = `${edge.from}::${edge.to}`;
        if (!pairChannels.has(pairKey)) pairChannels.set(pairKey, 0);
        const chIdx = pairChannels.get(pairKey);
        pairChannels.set(pairKey, chIdx + 1);

        const chOff = (chIdx % 2 === 0 ? 1 : -1) * Math.ceil(chIdx / 2) * CHANNEL_SPACING;

        const fx = fromPos.x, fy = fromPos.y;
        const tx = toPos.x,   ty = toPos.y;

        const exitX  = fx + EXIT_MARGIN + Math.abs(chOff) * 0.4;
        const entryX = tx - EXIT_MARGIN - Math.abs(chOff) * 0.4;
        
        let midX = (exitX + entryX) / 2 + chOff * 0.3;

        // Find parent composite ID of source and target to locate local vertical corridors
        const fromCompId = portOwnerMap.get(edge.from);
        const toCompId   = portOwnerMap.get(edge.to);
        
        let parentId = null;
        if (fromCompId && toCompId) {
          const nodeObjFrom = getLocalNodeObj(fromCompId);
          const nodeObjTo   = getLocalNodeObj(toCompId);
          if (nodeObjFrom && nodeObjTo && nodeObjFrom.parentId === nodeObjTo.parentId) {
            parentId = nodeObjFrom.parentId;
          }
        }

        // Get sibling horizontal bounds to find vertical corridors
        let siblings = [];
        if (parentId) {
          siblings = childrenMap.get(parentId) || [];
        } else {
          nodes.forEach(n => {
            if (!n.parentId && (n.group === 'component' || n.group === 'subcomponent')) {
              siblings.push(n.id);
            }
          });
          compositeBoxes.forEach(b => {
            if (!b.parentId) {
              siblings.push(b.id);
            }
          });
        }

        const siblingBounds = [];
        siblings.forEach(sibId => {
          if (compositeBoxesMap.has(sibId)) {
            const cb = compositeBoxesMap.get(sibId);
            siblingBounds.push({ left: cb.x, right: cb.x + cb.w });
          } else {
            const pos = positions[sibId];
            const nodeObj = getLocalNodeObj(sibId);
            if (pos && nodeObj) {
              const w = nodeObj.calcWidth || MIN_WIDTH;
              siblingBounds.push({ left: pos.x - w/2, right: pos.x + w/2 });
            }
          }
        });

        // Group into vertical columns
        const cols = [];
        siblingBounds.forEach(b => {
          let found = false;
          for (let col of cols) {
            if (!(b.right < col.left + 5 || b.left > col.right - 5)) {
              col.left = Math.min(col.left, b.left);
              col.right = Math.max(col.right, b.right);
              found = true;
              break;
            }
          }
          if (!found) {
            cols.push({ left: b.left, right: b.right });
          }
        });
        cols.sort((a, b) => a.left - b.left);

        // Vertical corridors: left, center gaps, right
        const corridors = [];
        if (cols.length > 0) {
          corridors.push(cols[0].left - 30);
          for (let i = 0; i < cols.length - 1; i++) {
            corridors.push((cols[i].right + cols[i+1].left) / 2);
          }
          corridors.push(cols[cols.length - 1].right + 30);
        }

        // Snap midX to the nearest corridor X coordinate
        if (corridors.length > 0) {
          let minD = Infinity;
          let bestX = midX;
          corridors.forEach(cx => {
            const d = Math.abs(cx - midX);
            if (d < minD) {
              minD = d;
              bestX = cx;
            }
          });
          midX = bestX + chOff * 0.35; // Apply minor stagger inside corridor
        }

        const pts = [
          { x: fx,     y: fy },
          { x: exitX,  y: fy },
          { x: midX,   y: fy },
          { x: midX,   y: ty },
          { x: entryX, y: ty },
          { x: tx,     y: ty }
        ];

        const cleanPts = [];
        pts.forEach(pt => {
          if (cleanPts.length === 0) {
            cleanPts.push(pt);
          } else {
            const last = cleanPts[cleanPts.length - 1];
            if (Math.abs(pt.x - last.x) > 1 || Math.abs(pt.y - last.y) > 1) {
              cleanPts.push(pt);
            }
          }
        });

        const isSelected = network.getSelectedEdges().includes(edge.id);
        const drawColor  = isSelected ? (palette.connectorHighlight || '#f59e0b') : edgeColor;

        ctx.save();
        ctx.strokeStyle = drawColor;
        ctx.lineWidth   = isSelected ? lineWidth * 1.8 : lineWidth;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';

        ctx.shadowColor   = 'rgba(15,23,42,0.06)';
        ctx.shadowBlur    = 2;
        ctx.shadowOffsetY = 1;

        // Draw orthogonal lines with small rounded corners (6px radius)
        drawRoundedPath(ctx, cleanPts, 6);
        ctx.stroke();
        ctx.shadowColor = 'transparent';

        // Filled arrowhead
        ctx.fillStyle = drawColor;
        const lastDx = tx - entryX;
        const dLen = Math.abs(lastDx) || 1;
        drawArrow(ctx, tx, ty, lastDx / dLen, 0, arrowSize);

        if (showLabels && edge.connLabel) {
          drawEdgeLabel(ctx, edge.connLabel, midX, (fy + ty) / 2, fontSize);
        }

        ctx.restore();
      });
    });

    Array.from(container.querySelectorAll('.flow-overlay')).forEach(el => el.remove());
    const overlay = document.createElement('div');
    overlay.className = 'flow-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    container.appendChild(overlay);
    const flowAnimator = new FlowAnimator(network, overlay);
    const portOwnerMap = new Map();
    Object.entries(componentPortMap || {}).forEach(([componentId, groups]) => {
      ['in', 'out', 'other'].forEach(bucket => {
        (groups?.[bucket] || []).forEach(port => {
          if (port?.id) portOwnerMap.set(port.id, componentId);
        });
      });
    });


    // Animation support: highlight nodes/edges based on trace events
    const baseNodeStyles = new Map(nodes.map(n => [n.id, { color: n.color, size: n.size, borderWidth: n.borderWidth, shadow: n.shadow }]));
    const baseEdgeStyles = new Map(edges.map(e => [e.id || `${e.from}->${e.to}`, { color: e.color, width: e.width }]));
    let activeNodes = new Set();
    let activeEdges = new Set();

    const nodeDataset = network.body?.data?.nodes;
    const edgeDataset = network.body?.data?.edges;

    const resolvePortNode = (path) => {
      if (!path) return null;
      const trimmed = path.trim();
      const mapHit = portPathMap.get(trimmed) || portPathMap.get(trimmed.split('.').slice(-2).join('.')) || portPathMap.get(trimmed.split('.').slice(-1)[0]);
      if (mapHit && nodeDataset?.get(mapHit[0])) return mapHit[0];
      const candidates = [trimmed, trimmed.substring(trimmed.lastIndexOf('.') + 1)];
      for (const cand of candidates) {
        if (nodeDataset?.get(cand)) return cand;
      }
      return null;
    };

    const resolveComponentNode = (path) => {
      if (!path) return null;
      if (componentPathMap.get(path)?.[0]) return componentPathMap.get(path)[0];
      const trimmed = path.substring(path.lastIndexOf('.') + 1);
      if (componentPathMap.get(trimmed)?.[0]) return componentPathMap.get(trimmed)[0];
      return nodeDataset?.get(path) ? path : null;
    };

    const resolveConnectorNode = (connectorName) => {
      if (!connectorName) return null;
      // Connectors are typically represented as nodes in the graph
      // Try direct lookup first
      if (nodeDataset?.get(connectorName)) return connectorName;
      // Try with common prefixes/suffixes
      const candidates = [
        connectorName,
        `connector_${connectorName}`,
        `CN_${connectorName}`
      ];
      for (const cand of candidates) {
        if (nodeDataset?.get(cand)) return cand;
      }
      return null;
    };

    const resetHighlights = () => {
      if (nodeDataset && activeNodes.size) {
        const updates = [];
        activeNodes.forEach(id => {
          const base = baseNodeStyles.get(id);
          if (!base) return;
          updates.push({ id, color: base.color, size: base.size, borderWidth: base.borderWidth, shadow: base.shadow });
        });
        if (updates.length) nodeDataset.update(updates);
      }
      if (edgeDataset && activeEdges.size) {
        const updates = [];
        activeEdges.forEach(id => {
          const base = baseEdgeStyles.get(id);
          if (!base) return;
          updates.push({ id, color: base.color, width: base.width });
        });
        if (updates.length) edgeDataset.update(updates);
      }
      activeNodes.clear();
      activeEdges.clear();
    };

    const glowNodes = (nodeIds) => {
      if (!nodeDataset || !nodeIds || !nodeIds.length) return;
      const updates = [];
      nodeIds.forEach(id => {
        if (!id || !nodeDataset.get(id)) return;
        if (!baseNodeStyles.has(id)) {
          const node = nodeDataset.get(id);
          baseNodeStyles.set(id, {
            color: node.color,
            size: node.size,
            borderWidth: node.borderWidth,
            shadow: node.shadow
          });
        }
        activeNodes.add(id);
        updates.push({
          id,
          color: { background: '#FFD700', border: '#FFA500' },
          size: 30,
          borderWidth: 3,
          shadow: { enabled: true, color: '#FFA500', size: 15, x: 0, y: 0 }
        });
      });
      if (updates.length) nodeDataset.update(updates);
    };

    const glowEdge = (fromId, toId) => {
      if (!edgeDataset || !fromId || !toId) return;
      const edgeId = `${fromId}-${toId}`;
      const edge = edgeDataset.get(edgeId);
      if (!edge) return;
      if (!baseEdgeStyles.has(edgeId)) {
        baseEdgeStyles.set(edgeId, { color: edge.color, width: edge.width });
      }
      activeEdges.add(edgeId);
      edgeDataset.update({
        id: edgeId,
        color: { color: '#FFA500', highlight: '#FF8C00' },
        width: 4
      });
    };

    const glowConnectorEdge = (connectorName) => {
      console.log('[GLOW CONNECTOR] Called with:', connectorName);
      if (!edgeDataset || !connectorName) {
        console.log('[GLOW CONNECTOR] Missing edgeDataset or connectorName');
        return false;
      }
      // Find edge with ID starting with conn:{connectorName}:
      const allEdges = edgeDataset.get();
      console.log('[GLOW CONNECTOR] Total edges:', allEdges.length);
      console.log('[GLOW CONNECTOR] Looking for edge starting with:', `conn:${connectorName}:`);

      const connectorEdge = allEdges.find(e => e.id && e.id.startsWith(`conn:${connectorName}:`));
      console.log('[GLOW CONNECTOR] Found edge:', connectorEdge ? connectorEdge.id : 'NOT FOUND');

      if (!connectorEdge) {
        // Try alternative patterns
        const altEdge = allEdges.find(e => e.label === connectorName);
        console.log('[GLOW CONNECTOR] Alternative search by label:', altEdge ? altEdge.id : 'NOT FOUND');
        if (altEdge) {
          const edgeId = altEdge.id;
          if (!baseEdgeStyles.has(edgeId)) {
            baseEdgeStyles.set(edgeId, { color: altEdge.color, width: altEdge.width });
          }
          activeEdges.add(edgeId);
          edgeDataset.update({
            id: edgeId,
            color: { color: '#FFA500', highlight: '#FF8C00' },
            width: 5,
            shadow: { enabled: true, size: 10, color: 'rgba(255, 165, 0, 0.6)' }
          });
          console.log('[GLOW CONNECTOR] Highlighted edge by label:', edgeId);
          return true;
        }
        return false;
      }

      const edgeId = connectorEdge.id;
      if (!baseEdgeStyles.has(edgeId)) {
        baseEdgeStyles.set(edgeId, { color: connectorEdge.color, width: connectorEdge.width });
      }
      activeEdges.add(edgeId);
      edgeDataset.update({
        id: edgeId,
        color: { color: '#FFA500', highlight: '#FF8C00' },
        width: 5,
        shadow: { enabled: true, size: 10, color: 'rgba(255, 165, 0, 0.6)' }
      });
      console.log('[GLOW CONNECTOR] Highlighted edge:', edgeId);
      return true;
    };

    const getComponentForPort = (portId) => {
      if (!portId) return null;
      if (portOwnerMap.has(portId)) return portOwnerMap.get(portId);
      const parts = portId.split('.');
      parts.pop();
      const candidate = parts.join('.');
      if (candidate && nodeDataset?.get(candidate)) return candidate;
      return null;
    };

    const highlightPortContext = (portId) => {
      if (!portId) return;
      glowNodes([portId]);
    };

    const moveTokenToNode = (flowId, targetId, value) => {
      if (!targetId) return false;
      const lastTarget = flowAnimator.getTarget(flowId);
      const fromId = lastTarget?.id;
      if (fromId && fromId !== targetId) {
        glowEdge(fromId, targetId);
        const animated = flowAnimator.animate(flowId, fromId, targetId, value);
        if (animated) return true;
      }
      return flowAnimator.moveToNode(flowId, targetId, value);
    };

    const highlightConnectorPath = (fromId, toId) => {
      if (fromId && toId) {
        glowEdge(fromId, toId);
        return true;
      }
      return false;
    };

    const highlightComponentNode = (componentPath, value, flowId) => {
      const compId = resolveComponentNode(componentPath);
      if (!compId) return false;
      glowNodes([compId]);
      return flowAnimator.moveToNode(flowId, compId, value);
    };

    const highlightEvent = (event) => {
      resetHighlights();
      if (!event) {
        flowAnimator.hideAll();
        return 'No event';
      }

      flowAnimator.deemphasize();

      const data = event.data || {};
      const flowId = event.flowId;
      let message = event.type;
      let moved = false;

      switch (event.type) {
        case 'PARAM_SET': {
          const portId = resolvePortNode(`${data.component}.${data.port}`);
          highlightPortContext(portId);
          moved = moveTokenToNode(flowId, portId, data.value);
          message = `Set ${data.component}.${data.port} = ${data.value}`;
          break;
        }
        case 'PORT_SEND':
        case 'PORT_RECEIVE': {
          const pid = resolvePortNode(data.portPath);
          highlightPortContext(pid);

          // If value came from a connector, animate from connector to port
          if (event.type === 'PORT_RECEIVE' && data.sourceConnector) {
            const connectorId = resolveConnectorNode(data.sourceConnector);
            if (connectorId) {
              glowNodes([connectorId]);
              moved = flowAnimator.animate(flowId, connectorId, pid, data.value);
            } else {
              moved = moveTokenToNode(flowId, pid, data.value);
            }
          } else {
            moved = moveTokenToNode(flowId, pid, data.value);
          }

          message = `${event.type.replace('_', ' ')} ${data.portPath}${data.value !== undefined ? ` = ${data.value}` : ''}`;
          break;
        }
        case 'CONNECTOR_TRIGGERED': {
          const fromId = resolvePortNode(data.from);
          const toId = resolvePortNode(data.to);
          highlightConnectorPath(fromId, toId);
          moved = flowAnimator.animate(flowId, fromId || flowAnimator.getTarget(flowId)?.id, toId || fromId, data.value ?? data.activityName ?? data.connectorName ?? '');
          message = `Connector ${data.connectorName || ''}: ${data.from} → ${data.to}`;
          break;
        }
        case 'CONNECTOR_DIRECT_TRANSFER': {
          const fromId = resolvePortNode(data.from || '');
          const toId = resolvePortNode(data.to || '');
          highlightConnectorPath(fromId, toId);
          moved = flowAnimator.animate(flowId, fromId || flowAnimator.getTarget(flowId)?.id, toId || fromId, data.value);
          message = `Direct transfer ${data.connectorName || ''}`;
          break;
        }
        case 'ACTIVITY_WRITE_OUTPUT': {
          const targetId = resolvePortNode(data.targetPort);
          highlightPortContext(targetId);
          moved = moveTokenToNode(flowId, targetId, data.value);
          message = `Activity ${data.activityName || ''} → ${data.targetPort}`;
          break;
        }
        case 'COMPONENT_NO_ACTIVITY': {
          // Skip visual animation for "no activity" events
          message = `${event.type.replace('_', ' ')} ${data.component || ''}`;
          break;
        }
        case 'COMPONENT_INSTANTIATION':
        case 'SYNC_DECISION':
        case 'SYNC_CHECK': {
          if (data.component) {
            moved = highlightComponentNode(data.component, data.value ?? data.reason ?? '', flowId);
            message = `${event.type.replace('_', ' ')} ${data.component}`;
          }
          break;
        }
        case 'ACTIVITY_START':
        case 'ACTIVITY_INPUT_PINS':
        case 'ACTIVITY_DELEGATES':
        case 'ACTIVITY_WRITE_OUTPUT':
        case 'ACTIVITY_END': {
          // Highlight the component or connector where the activity is running
          const owner = data.owner || data.component;
          const ownerType = data.ownerType || '';

          console.log('[ACTIVITY EVENT]', event.type, 'owner:', owner, 'ownerType:', ownerType, 'data:', data);

          if (ownerType.toLowerCase().includes('connector') || (owner && owner.match(/^c\d+$/))) {
            // It's a connector - highlight the connector edge
            console.log('[ACTIVITY EVENT] Detected as connector, calling glowConnectorEdge');
            const highlighted = glowConnectorEdge(owner);
            if (highlighted) {
              moved = true;
            }
          } else if (owner) {
            // It's a component
            console.log('[ACTIVITY EVENT] Detected as component');
            moved = highlightComponentNode(owner, data.activityName || data.value || '', flowId);
          }
          message = `${event.type.replace(/_/g, ' ')} ${data.activityName || owner || ''}`;
          break;
        }
        case 'ACTION_START':
        case 'ACTION_INPUT_PARAMS':
        case 'ACTION_DELEGATES':
        case 'ACTION_OUTPUT':
        case 'ACTION_END': {
          // Actions run within activities - try to highlight the activity's owner
          // For now, just show message (could be enhanced to track activity->owner mapping)
          message = `${event.type.replace(/_/g, ' ')} ${data.actionName || ''}`;
          break;
        }
        case 'EXECUTABLE_CALL':
        case 'EXECUTABLE_INPUT':
        case 'EXECUTABLE_EXECUTION':
        case 'EXECUTABLE_OUTPUT': {
          // Executables run within actions - show message
          message = `${event.type.replace(/_/g, ' ')} ${data.executableName || ''}`;
          break;
        }
        default: {
          if (data.component) {
            moved = highlightComponentNode(data.component, data.value ?? data.result ?? '', flowId);
            message = `${event.type} ${data.component}`;
          }
          break;
        }
      }

      if (moved) {
        flowAnimator.focus(flowId);
      }

      return message;
    };

    const pinPortsToComponents = () => {
      if (!componentPortMap || !network?.body?.data?.nodes) return;
      
      // Composite boundaries are recalculated in beforeDrawing every frame;
      // here we just re-use the latest values for port positioning.

      const updates = [];
      const nodesDataset = network.body.data.nodes;

      Object.entries(componentPortMap).forEach(([componentId, groups]) => {
        let box;
        if (compositeBoxesMap.has(componentId)) {
          const cb = compositeBoxesMap.get(componentId);
          box = {
            left: cb.x,
            top: cb.y,
            right: cb.x + cb.w,
            bottom: cb.y + cb.h
          };
        } else {
          box = network.getBoundingBox(componentId);
        }

        if (!box || !isFinite(box.top) || !isFinite(box.bottom)) return;

        const height = Math.max(box.bottom - box.top, 80);
        const width = Math.max(box.right - box.left, 120);
        // Wider offset so ports don't sit on the box border
        const leftX = box.left - 22;
        const rightX = box.right + 22;
        const topY = box.top;
        const bottomY = box.bottom;

        const inPorts = Array.isArray(groups?.in) ? groups.in : [];
        const outPorts = Array.isArray(groups?.out) ? groups.out : [];
        const otherPorts = Array.isArray(groups?.other) ? groups.other : [];

        const inStep = height / Math.max(inPorts.length + 1, 2);
        inPorts.forEach((port, index) => {
          if (!nodesDataset.get(port.id)) return;
          const y = topY + inStep * (index + 1);
          updates.push({ id: port.id, x: leftX, y, fixed: { x: true, y: true } });
        });

        const outStep = height / Math.max(outPorts.length + 1, 2);
        outPorts.forEach((port, index) => {
          if (!nodesDataset.get(port.id)) return;
          const y = topY + outStep * (index + 1);
          updates.push({ id: port.id, x: rightX, y, fixed: { x: true, y: true } });
        });

        const otherStep = width / Math.max(otherPorts.length + 1, 2);
        otherPorts.forEach((port, index) => {
          if (!nodesDataset.get(port.id)) return;
          const x = box.left + otherStep * (index + 1);
          const y = bottomY + 12;
          updates.push({ id: port.id, x, y, fixed: { x: true, y: true } });
        });
      });

      if (updates.length) {
        nodesDataset.update(updates);
        network.redraw();
      }
      flowAnimator.refresh();
    };

    network.once('stabilized', () => {
      requestAnimationFrame(() => {
        pinPortsToComponents();
        requestAnimationFrame(() => pinPortsToComponents());
      });
    });

    let pinQueued = false;
    const schedulePin = () => {
      if (pinQueued) return;
      pinQueued = true;
      requestAnimationFrame(() => {
        pinQueued = false;
        pinPortsToComponents();
      });
    };

    const releaseComponentsForDrag = () => {
      const updates = [];
      const nodesDataset = network.body.data.nodes;
      componentNodeIds.forEach(id => {
        const node = nodesDataset.get(id);
        if (!node) return;
        updates.push({ id, fixed: false });
      });
      if (updates.length) {
        nodesDataset.update(updates);
      }
    };

    network.once('afterDrawing', schedulePin);
    network.on('dragStart', schedulePin);
    network.on('dragging', schedulePin);
    network.on('dragEnd', schedulePin);
    network.on('zoom', schedulePin);
    network.on('resize', schedulePin);

    schedulePin();
    requestAnimationFrame(releaseComponentsForDrag);

    const controller = {
      highlightEvent,
      clearHighlights: () => {
        resetHighlights();
        flowAnimator.hideAll();
      },
      fit: () => {
        if (network) {
          network.fit({ animation: { duration: 500, easingFunction: 'easeInOutQuad' } });
        }
      }
    };

    console.log('✅ Visualization rendered with', nodes.length, 'nodes and', edges.length, 'edges');
    if (logElement) logElement.textContent += `[INFO] Visualization rendered with ${nodes.length} nodes and ${edges.length} edges\n`;
    return controller;
  } catch (error) {
    console.error('Error while rendering visualization:', error);
    if (logElement) logElement.textContent += `[ERROR] Failed to render visualization: ${error.message}\n`;
    return null;
  }
}

// Export for use in app.js
export { renderVisualization };
