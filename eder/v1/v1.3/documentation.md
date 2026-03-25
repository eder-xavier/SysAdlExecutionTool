SysADL Web Studio – Comprehensive Documentation
==============================================

This document describes the architecture, file structure, execution flow, and visualisation aspects of the SysADL Web Studio project.

---

## 1. Project Overview

The **SysADL Web Studio** is a full-featured client–server toolchain that allows hardware/software engineers and architects to model, transform, simulate, and visualise architectures described in SysADL.

*   **Modeling:** Takes place in a browser-based Monaco Editor instance.
*   **Transformation:** Happens on a robust Node.js backend. Each model transformation request posts the SysADL source to `/api/transform`, which validates and compiles the design into executable JavaScript.
*   **Simulation:** Executed entirely in the client's browser. The generated JavaScript runs within an isolated environment utilizing a custom underlying runtime block (`sysadl-framework/SysADLBase.js`).
*   **Visualisation:** Managed by `visualizer.js` which evaluates the generated bundle, instantiates the architecture, and uses `vis-network` to render components, ports, and connectors interactively.

---

## 2. Key Directories and Responsibilities

| File / Folder | Purpose |
| --- | --- |
| `index.html` & `styles.css` | The main static shell: Monaco editors, toolbar, log window, architecture canvas, trace panel, and light-theme SysADL Studio styling. |
| `app.js` | The main front-end controller. Loads Monaco, calls the Node backend `/api/transform`, triggers visualisation, runs simulations, and updates the trace table/playback. |
| `visualizer.js` | Parses the simulated model tree. Extracts nodes/edges, docks ports to component borders, enforces connector directions, and draws the architecture via `vis-network`. |
| `simulator.js` | Loads and evaluates the generated JS returned from the transformation server, wrapping it in a browser-safe structure. |
| `sysadl-framework/` | Contains the `SysADLBase.js` runtime simulating architectural flows, composite/simple ports, and `SimulationLogger.js` to track the event trace. |
| `server-node.js` | The backend HTTP server. Proxies `/api/transform` requests to `transformer.js` via a spawned child process and serves static web assets. |
| `sysadl.peg` & `sysadl-parser.js` | The PEG.js grammar syntax rules for SysADL and the built parser that generates an Abstract Syntax Tree (AST) from raw text. |
| `transformer.js` | The core code generator. Transpiles the AST into Javascript classes that extend from the `SysADLBase` framework. |
| `generated/` & `temp/` | Temporary file storage during the compilation phase on the Node.js server. |

---

## 3. Transformation & Visualisation Flow

1.  **Author SysADL** in the left Monaco editor in the browser.
2.  **Transform ▶** triggers `transformSysADLToJS` in `app.js`, which POSTs the code to `/api/transform`.
3.  The Node.js server runs `transformer.js`, compiles the JS code, deposits a fallback in `generated/`, and responds with the raw Javascript text plus metadata.
4.  The generated JS is stored in the right-hand Monaco editor, ready for download or review.
5.  **Visualize Architecture** calls `renderVisualization()` inside `visualizer.js`:
    *   Evaluating the bundle dynamically and invoking the generated `createModel()`.
    *   Walking the simulated model tree, grabbing nodes for all nested components/ports.
    *   Using `boundParticipants` to perfectly reconstruct connector lines from outputs to inputs.
    *   Laying components out horizontally by level. Input ports are docked to the left edge; output ports to the right.
6.  **Simulation Configuration & Execution:** The tool allows users to distinctively configure inputs and monitor targets:
    *   **Available Boundary Components:** Set runtime parameters injected directly into the boundary output ports.
    *   **Monitored Variables:** Select boundary input ports to precisely track and render their final data state onto an elegant DOM card, separated from the raw execution trace.
    *   **Log Filtering:** Users can toggle architecture 'building' phase events on/off to declutter the simulation output streams.
7.  The log panel additionally captures explicit `[INFO]`, `[WARN]`, and `[ERROR]` messages emitted during execution to trace bindings and potential model faults.

---

## 4. Current Visualisation Behaviour

*   **Component layout:** Deterministic left‑to‑right hierarchy. Levels expand dynamically.
*   **Port docking:** Inputs sit along the left vertical border, outputs along the right vertical border. Any typeless/directionless port falls back to the bottom.
*   **Edges:** Arrowheads enforce flow direction. When bindings arrive inverted, the graph visually swaps endpoints to preserve logical flow.
*   **Palette:** UML-style pastel fills identify components, cyan for outputs, rose for inputs.
*   **Interactive editing:** Draggable components (after stabilisation). Port hook listeners guarantee they remain glued to component edges during drags.
*   **Trace playback:** "Simulate" runs the code against `SimulationLogger` and populates the trace panel. An animated token moves along connectors during playback, mimicking real-time data flow with speed presets. Active elements pulsate.

---

## 5. Known Limitations & Open Items

1.  **Runtime definitions:** Extreme zoom levels or manual coordinate overriding can introduce very slight port visual misalignment, as they strictly rely on bounding boxes reported by `vis-network`.
2.  **Transformer Metadata:** The `transformer.js` occasionally loses sub-participant directions for deeply nested structures. The visualizer currently compensates manually.
3.  **Testing coverage:** Primarily manual verification. Need headless DOM unit testing for `visualizer.js`.

---

## 6. Running the Project Locally

1.  Navigate to the `\eder\v1\v1.3` directory.
2.  Ensure you have Node.js 18+ installed. Install dependencies (e.g., `nodemon`):
    ```bash
    npm install
    ```
3.  Start the Node.js server:
    ```bash
    node server-node.js
    ```
4.  Open `http://localhost:3000` in any modern browser.

---

## 7. Troubleshooting Checklist

| Symptom | Possible Cause | Suggested Fix |
| --- | --- | --- |
| "Transformation error" banner | `transformer` failed logic / syntax. | Check the server terminal console for the `stderr` dump. Verify SysADL syntax. |
| Architecture canvas stays blank | Generated JS failed to instantiate. | Check the log panel for `[ERROR] Failed to evaluate model` entries or missing SysADL imports. |
| Connectors missing | Disconnected ports; lack of `boundParticipants`. | Ensure `connector` lines in SysADL accurately map to defined component instances. |

---

### Revision History

| Date | Summary |
| --- | --- |
| (Current) | Refined overarching documentation encompassing parser, transformer, and Node server. Added dynamic simulation features: Log Phase building filtering, parametric boundary inputs, and "Final Components Value" node monitoring. |
| 2025‑11‑20 | Added per-event trace table with data flow animated markers. |
| 2025‑10‑29 | Introduced SysADL Studio style light theme, throttling logic for ports, and mobile UI resizing. |
| 2025‑10‑28 | Layout overhauled; ported out strict browser-wrapped Python wrappers to a pure Node.js architecture. |
