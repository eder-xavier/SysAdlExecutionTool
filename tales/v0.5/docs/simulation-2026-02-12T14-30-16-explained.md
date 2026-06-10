# Simulation Log Explanation

**File:** `simulation-2026-02-12T14-30-16.jsonl`
**Total lines:** 86
**Simulation duration:** timestamp 5 → 153082 (~153 seconds of simulated time)

---

## 1. JSONL Format and Field Glossary

Each line is a self-contained JSON object. The common fields are:

| Field | Description |
|---|---|
| `timestamp` | Simulated time (in milliseconds) when the event occurred. |
| `flowId` | Unique ID for this log entry. `"SYS"` = system/engine-level event; `"F1"`, `"F2"`, … = sequential flow identifiers for entity-level events. |
| `type` | The kind of event. One of: `STATE_CHANGE`, `CONNECTOR_TRIGGERED`, `EVENT_FIRED`, `SCENARIO_START`, `SCENARIO_EXECUTION_STOPPED`. |
| `data` | Payload with details specific to the event type. |

### Event Types

| Type | Meaning |
|---|---|
| **STATE_CHANGE** | A property of an entity (e.g. `agv1.location`) was assigned a new value. |
| **CONNECTOR_TRIGGERED** | A connector (wire/channel) between two ports was activated, transferring data from a source port to a destination port. |
| **EVENT_FIRED** | A named event from the `EventsDefinitions` was triggered (by condition or after a scenario). |
| **SCENARIO_START** | A scenario began executing. |
| **SCENARIO_EXECUTION_STOPPED** | The scenario execution was terminated (in this case, by a timeout or external stop signal). |

### Entities in This Simulation

| Entity | Class | Role |
|---|---|---|
| `agv1` | `Vehicle` | Automated Guided Vehicle #1 |
| `agv2` | `Vehicle` | Automated Guided Vehicle #2 |
| `part` | `PartX` | A physical part to be transported between stations |
| `supervisor` | `Supervisory` | The supervisory control that issues commands and receives notifications |

### Ports and Properties

| Property | Entity | Meaning |
|---|---|---|
| `location` | Vehicle / PartX | Current station where the entity is located |
| `outCommand` | Supervisory | Output port: the command being sent to a vehicle `{destination, armCommand}` |
| `inCommand` | Vehicle | Input port: the command received by a vehicle |
| `outNotification` | Vehicle | Output port: notification sent back to the supervisor `{notification}` |
| `inNotification` | Supervisory | Input port: notification received from a vehicle |
| `arm` | Vehicle | Physical arm port of the vehicle (used for attach/detach) |
| `surface` | PartX | Surface port of the part (used for attach/detach) |

### Connectors

| Connector | Type | Direction | Meaning |
|---|---|---|---|
| `Command` | DynamicConnection | supervisor → vehicle | Sends a movement/arm command |
| `Notify` | DynamicConnection | vehicle → supervisor | Sends a notification back |
| `Attach` | DynamicConnection | vehicle.arm → part.surface | Physically attaches the vehicle arm to the part |
| `Detach` | DynamicConnection | vehicle.arm → part.surface | Physically detaches the vehicle arm from the part |

---

## 2. Line-by-Line Explanation

### Phase 1: Initialization (timestamp 5)

#### Line 1 — `agv1` initial location
```json
{"timestamp":5,"flowId":"F1","type":"STATE_CHANGE","data":{"entityName":"agv1","entityClass":"Vehicle","property":"location","oldValue":null,"newValue":"StationC"}}
```
- **What:** `agv1` (Vehicle) has its `location` property initialized to `"StationC"`.
- **Why `oldValue: null`:** This is the first assignment — no previous value existed.
- **Meaning:** AGV1 starts at StationC.

#### Line 2 — `agv2` initial location
```json
{"timestamp":5,"flowId":"F2","type":"STATE_CHANGE","data":{"entityName":"agv2","entityClass":"Vehicle","property":"location","oldValue":null,"newValue":"StationD"}}
```
- **What:** `agv2` (Vehicle) starts at `"StationD"`.

#### Line 3 — `part` initial location
```json
{"timestamp":5,"flowId":"F3","type":"STATE_CHANGE","data":{"entityName":"part","entityClass":"PartX","property":"location","oldValue":null,"newValue":"StationA"}}
```
- **What:** The part (`PartX`) starts at `"StationA"`.

> **Summary of initial state at t=5:**
> - `agv1` → StationC
> - `agv2` → StationD
> - `part` → StationA

---

### Phase 2: Scenario Start (timestamp 6)

#### Line 4 — Scenario begins
```json
{"timestamp":6,"flowId":"SYS","type":"SCENARIO_START","data":{"name":"Scenario1","executionName":"MyScenariosExecution","parentExecution":"MyScenariosExecution"}}
```
- **What:** The system starts `Scenario1` under the execution context `MyScenariosExecution`.
- **flowId `"SYS"`:** System-level event, not tied to a specific entity.
- **Meaning:** The scripted sequence of actions begins.

---

### Phase 3: First Supervisor Commands and AGV2 Response (timestamp 8)

#### Line 5 — Supervisor issues first command (no old value)
```json
{"timestamp":8,"flowId":"F4","type":"STATE_CHANGE","data":{"entityName":"supervisor","entityClass":"Supervisory","property":"outCommand","newValue":{"destination":"stationA","armCommand":"idle"}}}
```
- **What:** `supervisor.outCommand` is set for the first time to `{"destination":"stationA", "armCommand":"idle"}`.
- **No `oldValue`:** First assignment of this property.
- **Meaning:** Supervisor wants a vehicle to go to StationA with arm idle (no pick/place action).

#### Line 6 — Supervisor outCommand set again (same value)
```json
{"timestamp":8,"flowId":"F5","type":"STATE_CHANGE","data":{"entityName":"supervisor","entityClass":"Supervisory","property":"outCommand","oldValue":{"destination":"stationA","armCommand":"idle"},"newValue":{"destination":"stationA","armCommand":"idle"}}}
```
- **What:** `outCommand` is written again with the same value.
- **Note:** `oldValue == newValue`. This is a redundant write — the supervisor's logic wrote the same command twice, possibly because two separate scenario steps both assign the same output.

#### Line 7 — Command connector triggers to `agv2`
```json
{"timestamp":8,"flowId":"F6","type":"CONNECTOR_TRIGGERED","data":{"connectorName":"Command","connectorClass":"DynamicConnection","from":"supervisor.outCommand","to":"agv2.inCommand","hasActivity":false,"activityName":null}}
```
- **What:** The `Command` connector fires, sending `supervisor.outCommand` → `agv2.inCommand`.
- **`hasActivity: false`:** No transformation activity is applied during transfer; data flows directly.
- **Meaning:** AGV2 receives the go-to-StationA command.

#### Line 8 — AGV2 responds with notification
```json
{"timestamp":8,"flowId":"F7","type":"STATE_CHANGE","data":{"entityName":"agv2","entityClass":"Vehicle","property":"outNotification","newValue":{"notification":"loaded"}}}
```
- **What:** `agv2.outNotification` is set to `{"notification":"loaded"}`.
- **Meaning:** AGV2 acknowledges / notifies it has completed some action (notification = "loaded").

#### Line 9 — Notify connector from AGV2 to supervisor
```json
{"timestamp":8,"flowId":"F8","type":"CONNECTOR_TRIGGERED","data":{"connectorName":"Notify","connectorClass":"DynamicConnection","from":"agv2.outNotification","to":"supervisor.inNotification","hasActivity":false,"activityName":null}}
```
- **What:** The `Notify` connector carries AGV2's notification back to the supervisor.

---

### Phase 4: Commands to AGV1 (timestamp 9)

#### Line 10 — Supervisor outCommand (redundant write #1)
```json
{"timestamp":9,"flowId":"F9","type":"STATE_CHANGE","data":{"entityName":"supervisor","entityClass":"Supervisory","property":"outCommand","oldValue":{"destination":"stationA","armCommand":"idle"},"newValue":{"destination":"stationA","armCommand":"idle"}}}
```
- **What:** Supervisor writes `outCommand` again — same value as before.

#### Line 11 — Supervisor outCommand (redundant write #2)
```json
{"timestamp":9,"flowId":"F10","type":"STATE_CHANGE","data":{"entityName":"supervisor","entityClass":"Supervisory","property":"outCommand","oldValue":{"destination":"stationA","armCommand":"idle"},"newValue":{"destination":"stationA","armCommand":"idle"}}}
```
- **What:** Another identical write to `outCommand`.

#### Line 12 — Command connector triggers to `agv1`
```json
{"timestamp":9,"flowId":"F11","type":"CONNECTOR_TRIGGERED","data":{"connectorName":"Command","connectorClass":"DynamicConnection","from":"supervisor.outCommand","to":"agv1.inCommand","hasActivity":false,"activityName":null}}
```
- **What:** AGV1 receives the command to go to StationA.

#### Line 13 — AGV1 responds with notification
```json
{"timestamp":9,"flowId":"F12","type":"STATE_CHANGE","data":{"entityName":"agv1","entityClass":"Vehicle","property":"outNotification","newValue":{"notification":"loaded"}}}
```
- **What:** AGV1 notifies `"loaded"` — first assignment (no `oldValue`).

---

### Phase 5: Ongoing Communication Pattern (timestamps 11–16)

#### Line 14 (t=11) — Notify connector from AGV1
```json
{"timestamp":11,"flowId":"F13","type":"CONNECTOR_TRIGGERED","data":{"connectorName":"Notify","connectorClass":"DynamicConnection","from":"agv1.outNotification","to":"supervisor.inNotification","hasActivity":false,"activityName":null}}
```
- **What:** AGV1's "loaded" notification reaches the supervisor.

#### Line 15 (t=14) — AGV1 outNotification redundant write
```json
{"timestamp":14,"flowId":"F14","type":"STATE_CHANGE","data":{"entityName":"agv1","entityClass":"Vehicle","property":"outNotification","oldValue":{"notification":"loaded"},"newValue":{"notification":"loaded"}}}
```
- **What:** AGV1 writes the same notification again (redundant).

#### Line 16 (t=14) — Notify connector from AGV1 again
```json
{"timestamp":14,"flowId":"F15","type":"CONNECTOR_TRIGGERED","data":{"connectorName":"Notify","connectorClass":"DynamicConnection","from":"agv1.outNotification","to":"supervisor.inNotification","hasActivity":false,"activityName":null}}
```

#### Lines 17–18 (t=14) — Supervisor outCommand double writes (same value)
```json
L17: supervisor.outCommand = {"destination":"stationA","armCommand":"idle"} (old == new)
L18: supervisor.outCommand = {"destination":"stationA","armCommand":"idle"} (old == new)
```
- **Pattern:** The supervisor consistently writes `outCommand` twice per cycle, always with the same `{destination: "stationA", armCommand: "idle"}` value.

#### Line 19 (t=14) — Command to AGV1
```json
{"timestamp":14,"flowId":"F18","type":"CONNECTOR_TRIGGERED","data":{"connectorName":"Command","connectorClass":"DynamicConnection","from":"supervisor.outCommand","to":"agv1.inCommand","hasActivity":false,"activityName":null}}
```

---

### Phase 6: Physical Attachment (timestamp 15)

#### Line 20 (t=15) — **Attach** connector fires
```json
{"timestamp":15,"flowId":"F19","type":"CONNECTOR_TRIGGERED","data":{"connectorName":"Attach","connectorClass":"DynamicConnection","from":"agv1.arm","to":"part.surface","hasActivity":false,"activityName":null}}
```
- **What:** AGV1's arm physically attaches to the part. This is a **physical interaction** — the vehicle is now carrying the part.
- **Meaning:** AGV1 picks up the part at its current station.

#### Lines 21–24 (t=15) — Post-attach: notification + supervisor command cycle
- L21: `agv1.outNotification` = `"loaded"` (redundant write)
- L22: `Notify` connector AGV1 → supervisor
- L23–24: supervisor `outCommand` double writes (same value)

#### Line 25 (t=16) — Command to AGV1
```json
{"timestamp":16,"flowId":"F24","type":"CONNECTOR_TRIGGERED","data":{"connectorName":"Command","connectorClass":"DynamicConnection","from":"supervisor.outCommand","to":"agv1.inCommand","hasActivity":false,"activityName":null}}
```

---

### Phase 7: Event Fired — AGV2 at StationD (timestamp 17)

#### Line 26 — Event: `AGV2atStationD`
```json
{"timestamp":17,"flowId":"SYS","type":"EVENT_FIRED","data":{"name":"AGV2atStationD","triggerType":"after_scenario","eventNumber":1,"scenarioName":"SCN_MoveAGV1toA"}}
```
- **What:** The named event `AGV2atStationD` fires.
- **`triggerType: "after_scenario"`:** This event was configured to fire after the scenario `SCN_MoveAGV1toA` completes.
- **`eventNumber: 1`:** It's the first event in the EventsDefinitions sequence.
- **Meaning:** The system observes that AGV2 is indeed at StationD after the sub-scenario `SCN_MoveAGV1toA` finished.

---

### Phase 8: Continued Operation (timestamps 18–21)

#### Lines 27–28 (t=18) — AGV2 notification cycle
- L27: `agv2.outNotification` = `"loaded"` (redundant, same value)
- L28: `Notify` connector AGV2 → supervisor

#### Lines 29–32 (t=19) — AGV1 double notification
- L29: `agv1.outNotification` = `"loaded"` (redundant)
- L30: `Notify` connector AGV1 → supervisor
- L31: `agv1.outNotification` = `"loaded"` again (redundant)
- L32: `Notify` connector AGV1 → supervisor again
- **Note:** AGV1 fires two notifications in the same timestamp — likely two scenario steps executing back-to-back.

#### Lines 33–36 (t=20) — Supervisor command + **Detach**
- L33–34: supervisor `outCommand` double writes (same value)
- L35: `Command` connector → `agv1.inCommand`
- **L36:** **Detach** connector: `agv1.arm` → `part.surface`

```json
{"timestamp":20,"flowId":"F34","type":"CONNECTOR_TRIGGERED","data":{"connectorName":"Detach","connectorClass":"DynamicConnection","from":"agv1.arm","to":"part.surface","hasActivity":false,"activityName":null}}
```
- **What:** AGV1 releases (detaches) the part. The part is now placed at the current station.

#### Lines 37–40 (t=20) — Post-detach: notification + command cycle
- L37: `agv1.outNotification` = `"loaded"` (redundant)
- L38: `Notify` AGV1 → supervisor
- L39–40: supervisor `outCommand` double writes

#### Lines 41–47 (t=21) — AGV2 receives command + Attach
- L41: `Command` connector → `agv2.inCommand`
- **L42:** `Attach` connector: `agv2.arm` → `part.surface` — **AGV2 picks up the part**
- L43: `agv2.outNotification` = `"loaded"` (redundant)
- L44: `Notify` AGV2 → supervisor
- L45–46: supervisor `outCommand` double writes
- L47: `Command` connector → `agv2.inCommand`

---

### Phase 9: Condition Event (timestamp 106)

#### Line 48 — Event: `SetAGV2SensorStationD`
```json
{"timestamp":106,"flowId":"SYS","type":"EVENT_FIRED","data":{"name":"SetAGV2SensorStationD","triggerType":"condition","eventNumber":2}}
```
- **What:** A **condition-based** event fires. Unlike line 26 which was `after_scenario`, this one fires because a monitored condition became true.
- **`eventNumber: 2`:** The second event in the EventsDefinitions sequence.
- **Meaning:** The sensor condition for AGV2 being at StationD was satisfied.

---

### Phase 10: Repeating Timeout Cycles (timestamps 30024, 61036, 92055, 123069)

> ⚠️ **CRITICAL OBSERVATION:** Starting at line 49 (t=30024), there is a **massive time jump** — from t=106 to t=30024. This ~30s gap repeats between each subsequent cycle:
> - **Cycle 1:** t=30024–30028 (lines 49–57)
> - **Cycle 2:** t=61036–61045 (lines 58–66)
> - **Cycle 3:** t=92055–92062 (lines 67–75)
> - **Cycle 4:** t=123069–123073 (lines 76–84)
>
> Each gap is approximately **31,000ms (~31 seconds)**, which corresponds to the **30-second timeout + processing delay**. This means the simulation is stuck in a loop — each cycle times out waiting for an expected state change that never arrives, then the permissive mode allows execution to continue with the same values.

#### Cycle Pattern (identical in each of the 4 cycles):

Each cycle follows this exact pattern using AGV1:

| Step | Type | Description |
|---|---|---|
| 1 | STATE_CHANGE | supervisor.outCommand = same value (redundant) |
| 2 | STATE_CHANGE | supervisor.outCommand = same value again (redundant) |
| 3 | CONNECTOR_TRIGGERED | Command → agv1.inCommand |
| 4 | CONNECTOR_TRIGGERED | Attach: agv1.arm → part.surface |
| 5 | STATE_CHANGE | agv1.outNotification = "loaded" (redundant) |
| 6 | CONNECTOR_TRIGGERED | Notify: agv1 → supervisor |
| 7 | STATE_CHANGE | supervisor.outCommand = same (redundant) |
| 8 | STATE_CHANGE | supervisor.outCommand = same (redundant) |
| 9 | CONNECTOR_TRIGGERED | Command → agv1.inCommand |

**This is a deadlock/livelock pattern.** The system:
1. Issues a command to AGV1 (always `destination: stationA, armCommand: idle`)
2. AGV1 tries to attach to the part
3. AGV1 notifies "loaded"
4. Supervisor issues the same command again
5. 30-second timeout expires → cycle restarts

The `oldValue == newValue` in every STATE_CHANGE confirms no real state change is happening — the simulation is not progressing.

---

### Phase 11: Simulation Stops (timestamps 153081–153082)

#### Line 85 — Scenario execution stopped (#1)
```json
{"timestamp":153081,"flowId":"SYS","type":"SCENARIO_EXECUTION_STOPPED","data":{"elementType":"scenario_execution_stopped","execution":"MyScenariosExecution","when":1770906769194}}
```
- **What:** The scenario execution `MyScenariosExecution` is forcefully stopped.
- **`when: 1770906769194`:** The **real wall-clock time** (Unix milliseconds) when the stop occurred (Feb 12, 2026, ~14:32:49 UTC-3).
- **Meaning:** After multiple timeout cycles with no progress, the execution was terminated.

#### Line 86 — Scenario execution stopped (#2)
```json
{"timestamp":153082,"flowId":"SYS","type":"SCENARIO_EXECUTION_STOPPED","data":{"elementType":"scenario_execution_stopped","execution":"MyScenariosExecution","when":1770906769196}}
```
- **What:** A second stop event, 1ms later and 2ms later in wall-clock time.
- **Why two?** The stop signal likely propagated through two levels of the execution hierarchy (the scenario execution itself and its parent context).

---

## 3. Timeline Summary

```
t=5       ┃ INITIALIZATION: agv1→StationC, agv2→StationD, part→StationA
t=6       ┃ SCENARIO_START: Scenario1 begins
t=8       ┃ Supervisor commands AGV2 → StationA (Command connector)
          ┃ AGV2 responds "loaded" (Notify connector)
t=9       ┃ Supervisor commands AGV1 → StationA
          ┃ AGV1 responds "loaded"
t=11-16   ┃ Multiple notification/command cycles (AGV1 active)
t=15      ┃ ★ ATTACH: agv1.arm → part.surface (AGV1 picks up part)
t=17      ┃ EVENT: AGV2atStationD (after_scenario)
t=18-21   ┃ Communication cycles continue
t=20      ┃ ★ DETACH: agv1.arm → part.surface (AGV1 drops part)
t=21      ┃ ★ ATTACH: agv2.arm → part.surface (AGV2 picks up part)
t=106     ┃ EVENT: SetAGV2SensorStationD (condition)
          ┃
t=30024   ┃ ⚠️ TIMEOUT CYCLE #1 — 30s gap, same pattern repeats
t=61036   ┃ ⚠️ TIMEOUT CYCLE #2 — 31s gap
t=92055   ┃ ⚠️ TIMEOUT CYCLE #3 — 31s gap
t=123069  ┃ ⚠️ TIMEOUT CYCLE #4 — 31s gap
          ┃
t=153081  ┃ ✖ EXECUTION STOPPED (timeout / forced termination)
t=153082  ┃ ✖ EXECUTION STOPPED (propagated stop)
```

---

## 4. Key Observations and Potential Issues

### 4.1 Redundant State Changes (oldValue == newValue)
Throughout the entire log, `supervisor.outCommand` is always written with `{"destination":"stationA","armCommand":"idle"}` — the value never changes. This suggests:
- The supervisor logic always resolves to the same decision
- Or the supervisor is not reacting to the notifications it receives

### 4.2 Notification Value Never Changes
Every `outNotification` from both AGVs always say `{"notification":"loaded"}`. There is no variation (e.g. `"arrived"`, `"unloaded"`, `"error"`), suggesting the notification mechanism may not be fully implemented or the vehicle logic always emits the same status.

### 4.3 Repeated Attach Without Prior Detach (Cycles 1–4)
In the timeout cycles (lines 49–84), AGV1 keeps executing `Attach` to `part.surface` without a `Detach` first. This could indicate:
- The part was already detached through a mechanism not logged
- Or the simulation is incorrectly trying to attach to an already-attached part

### 4.4 ~30s Timeout Gaps
The jumps from t=106→30024→61036→92055→123069 each represent ~30 seconds of waiting. In permissive mode, when an expected condition is not met within 30 seconds, the engine proceeds anyway — but since the state hasn't changed, the same scenario step repeats endlessly.

### 4.5 Two SCENARIO_EXECUTION_STOPPED Events
Two stop events (lines 85–86) with 1ms timestamp difference suggest either:
- Two levels of execution hierarchy being terminated (parent + child)
- Or a dual-signal mechanism for clean shutdown

---

## 5. Connector Summary Table

| Connector | Occurrences | Direction | Purpose |
|---|---|---|---|
| `Command` | 14 times | supervisor → vehicle | Send movement/arm command |
| `Notify` | 12 times | vehicle → supervisor | Send status notification |
| `Attach` | 5 times | vehicle.arm → part.surface | Pick up the part |
| `Detach` | 1 time | vehicle.arm → part.surface | Release the part |

---

## 6. Event Summary

| # | Event Name | Trigger Type | Timestamp | Context |
|---|---|---|---|---|
| 1 | `AGV2atStationD` | `after_scenario` | t=17 | Fires after `SCN_MoveAGV1toA` |
| 2 | `SetAGV2SensorStationD` | `condition` | t=106 | Fires when a sensor condition is met |
