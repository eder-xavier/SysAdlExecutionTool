# SysADL Simulator — Technical Reference (AI Handoff Document)

> [!IMPORTANT]
> Este documento contém TODO o contexto técnico necessário para continuar a implementação do simulador SysADL integrado. Leia-o **antes** de consultar o código.
> O plano de implementação está em `implementation_plan.md` (mesmo diretório).
> O tracker de tarefas está em `task.md` (mesmo diretório).
> As diretivas do projeto estão em `../diretivas.txt`.

---

## 1. Visão Geral do Projeto

**Objetivo:** Criar um simulador CLI (`SysADLSimulator.js`) que recebe um `.sysadl` (linguagem arquitetural SysADL), transforma em JavaScript, e executa cenários de validação gerando resultados JUnit-style.

**Escopo:** Apenas a pasta `tales/v0.6/` do repositório.

**Arquivo de referência:** `sysadl-models/RobAFIS.complete.sysadl` — único arquivo na gramática nova.

**SysADL:** Documentação sobre a linguagem em `docs/SysADL.md`.

---

## 2. Mapa de Arquivos e Dependências

```
tales/v0.6/
├── sysadl.peg                    # Gramática PEG (nova, atualizada) — NÃO MODIFICAR
├── sysadl-parser.js              # Parser gerado do .peg — NÃO MODIFICAR
├── transformer.js                # 🔧 MODIFICAR: Transforma AST → .js (9597 linhas)
├── SysADLSimulator.js            # 🔧 MODIFICAR: Simulador CLI unificado (497 linhas)
├── sysadl-framework/
│   ├── SysADLBase.js             # 🔧 MODIFICAR: Classes base do runtime (7902 linhas)
│   ├── SimulationLogger.js       # Logger para logs JSON
│   ├── TaskExecutor.js           # Executor de tarefas (import no env-scen.js)
│   ├── ReactiveConditionWatcher.js  # Watcher de condições reativas (import no env-scen.js)
│   └── ExpressionEvaluator.js    # Avaliador de expressões (import no env-scen.js)
├── simulator.js                  # ⛔ NÃO TOCAR: Simulador web (structural)
├── visualizer.js                 # ⛔ NÃO TOCAR: Visualizador web
├── environment-simulator.js      # ⛔ LEGADO: Simulador antigo de ambiente (substituído pelo SysADLSimulator.js)
├── app.js                        # ⛔ NÃO TOCAR: Interface web
├── server-node.js                # ⛔ NÃO TOCAR: Servidor Express
├── diretivas.txt                 # Restrições do projeto (ver seção 8)
├── docs/
│   ├── SysADL.md                 # Explicação sobre a linguagem SysADL
│   ├── implementation_plan.md    # Plano de implementação detalhado
│   ├── task.md                   # Tracker de tarefas
│   └── technical_reference.md    # ESTE ARQUIVO
├── peg-old/                      # Gramática e parser antigos (referência)
├── sysadl-models/
│   ├── RobAFIS.complete.sysadl   # ✅ Modelo na gramática NOVA (milestone 1)
│   ├── RobAFIS.complete-ast.json # AST gerada pelo parser (referência)
│   ├── AGV-completo*.sysadl      # Modelos na gramática ANTIGA (milestone 2)
│   ├── Simple.sysadl             # Modelo simples (web only)
│   └── SmartPlace.sysadl         # Outro modelo
├── generated/                    # Output do transformer
│   ├── RobAFIS.complete.js       # ✅ Modelo estrutural gerado (1490 linhas) — tem erro pré-existente em constraints
│   └── RobAFIS.complete-env-scen.js  # ✅ Módulo env/scen gerado (1933 linhas) — syntax OK, carrega OK
├── logs/                         # Output do simulador (JSON logs)
└── test/
    ├── test-parser.js            # ✅ Script de teste do parser (já funciona)
    ├── mock-model.js             # Mock para testar env-scen.js sem Model.js
    └── ... (69 arquivos de teste)
```

### Pipeline de Transformação

```
RobAFIS.complete.sysadl
    │
    ▼ [sysadl-parser.js]
    AST (JSON)
    │
    ▼ [transformer.js]
    ├── generated/RobAFIS.complete.js          (modelo estrutural: Components, Ports, etc.)
    └── generated/RobAFIS.complete-env-scen.js (ambiente + cenários: EnvComponents, Scenes, etc.)
                │
                ▼ [SysADLSimulator.js]  ← PRÓXIMA FASE (Fase 3)
                Execução dos cenários → Resultados JUnit + logs JSON
```

O `transformer.js` separa os nós AST em dois grupos:
- **Model nodes** → `Model.js` (packages, components, ports, connectors, activities, actions, executables, constraints, allocations)
- **EnvScen nodes** → `Model-env-scen.js` (EnvPortDef, EnvConnectorDef, EnvComponentDef, BoundaryComponentExtension, EnvActivitiesDefinitions, SceneDefinitions, ScenarioDefinitions, ScenarioExecution, EnvActivityAllocation)

---

## 3. Estrutura AST dos Novos Elementos

Os nós abaixo são gerados pelo parser da **nova gramática** (`sysadl.peg`). Todos foram validados contra o RobAFIS.complete.sysadl.

> [!NOTE]
> Arrays PEG retornam `[whitespace_array, actual_value]`. Ao processar, extrair `arr[1]` ou `arr.map(x => x[1])`.

### 3.1. EnvPortDef
```
SysADL:  EnvPort def OutPieceColor { flow out PieceType }
```
```json
{
  "type": "EnvPortDef",
  "name": "OutPieceColor",
  "flowProp": "out",        // "in" | "out" | "inout"
  "flowType": "PieceType"   // tipo do dado
}
```

### 3.2. EnvConnectorDef
```
SysADL:  EnvConnector def DetectPieceColorEnvCN {
           participants: ~ outColor: OutPieceColor; ~ inColor: InPieceColor;
           flows: PieceType from outColor to inColor
         }
```
```json
{
  "type": "EnvConnectorDef",
  "name": "DetectPieceColorEnvCN",
  "participants": [
    { "type": "PortUse", "name": "outColor", "definition": "OutPieceColor", "isReverse": true },
    { "type": "PortUse", "name": "inColor",  "definition": "InPieceColor",  "isReverse": true }
  ],
  "flows": [
    { "type": "Flow", "flowType": "PieceType", "source": "outColor", "destination": "inColor" }
  ]
}
```

### 3.3. EnvComponentDef
```
SysADL:  EnvComponent def PieceEnvCP {
           envPorts: outColor : OutPieceColor ; inColor : InPieceColor ; ...
           properties: Property def color : PieceType ;
         }
```
```json
{
  "type": "EnvComponentDef",
  "name": "PieceEnvCP",
  "envPorts": [
    [ [], { "name": "outColor", "type": "OutPieceColor" } ],
    [ [], { "name": "inColor",  "type": "InPieceColor"  } ]
  ],
  "properties": [
    [ [], { "type": "EnvPropertyDef", "name": "color", "propertyType": "PieceType" } ]
  ],
  "envConfig": null   // ou EnvironmentConfiguration embutido (ver 3.6)
}
```

### 3.4. BoundaryComponentExtension
```
SysADL:  boundary component SysADL.Components::ParameterInputCP {
           envPorts: inParam : InParameter ;
         }
```
```json
{
  "type": "BoundaryComponentExtension",
  "name": "SysADL.Components.ParameterInputCP",   // QualifiedName com "." (parser converte :: → .)
  "envPorts": [
    [ [], { "name": "inParam", "type": "InParameter" } ]
  ]
}
```

### 3.5. EnvPropertyDef
```json
{ "type": "EnvPropertyDef", "name": "color", "propertyType": "PieceType" }
```

### 3.6. EnvironmentConfiguration (embutido no EnvComponentDef)
```
SysADL:  environmentConfiguration TransElevatorConfig {
           envComponents: pieces : PieceEnvCP [0..3] ;
           envDelegations: pieces.outPresence to outPresence ; inCommand to pieces.inCommand ;
         }
```
```json
{
  "type": "EnvironmentConfiguration",
  "name": "TransElevatorConfig",
  "definition": "TransElevatorEnvCP",
  "envComponents": [
    [ [], { "type": "ComponentInstance", "name": "pieces", "componentType": "PieceEnvCP", "bounds": { "lower": 0, "upper": 3 } } ]
  ],
  "components": [],          // system ComponentInstance[] (ex: unit_colorSens: ColorSensorCP)
  "envDelegations": [
    [ [], { "type": "Delegation", "source": "pieces.outPresence", "destination": "outPresence" } ],
    [ [], { "type": "Delegation", "source": "inCommand", "destination": "pieces.inCommand" } ]
  ],
  "envConnectors": []        // EnvConnectorUse[] (ver 3.7)
}
```

### 3.7. EnvConnectorUse (dentro de environmentConfiguration)
```
SysADL:  envConnectors:
           tPresenceC: ReadPresenceEnvCN bindings transElevator.outPresence = unit_tSens.inPresence ;
```
```json
{
  "type": "EnvConnectorUse",
  "name": "tPresenceC",
  "connectorType": "ReadPresenceEnvCN",
  "left": "transElevator.outPresence",    // source port path
  "right": "unit_tSens.inPresence"        // target port path
}
```

### 3.8. SignalDef
```json
{
  "type": "SignalDef",
  "name": "StartSimulationSig",
  "attributes": [
    [ [], { "name": "mission", "type": "MissionParameter" } ]
  ]
}
// Signals sem attributes: "attributes": []
```

### 3.9. EnvActionDef
```json
{
  "type": "EnvActionDef",
  "name": "PassMissionParameterAN",
  "inParameters": [ { "type": "Pin", "name": "paramIn", ... } ],
  "outType": "MissionParameter"
}
```

### 3.10. EnvActivityDef
```json
{
  "type": "EnvActivityDef",
  "name": "OperatorEA",
  "inParameters": [],
  "outParameters": [ [ [], { "name": "opParamOut", "type": "MissionParameter" } ] ],
  "body": {
    "actions": [...],         // action uses
    "delegates": [...],       // delegation mappings
    "onClauses": [...]        // ON/THEN/SEND clauses
  }
}
```

### 3.11. OnClause
```
SysADL:  ON StartSimulationSig
           THEN setMissionParametersOp { paramIn = StartSimulationSig.mission ; }
           SEND SetMissionParamSig { param = StartSimulationSig.mission ; }
```
```json
{
  "type": "OnClause",
  "signal": "StartSimulationSig",
  "condition": null,
  "actionName": "setMissionParametersOp",
  "actionAssigns": [
    [ [], { "type": "Assignment", "left": { "type": "Identifier", "name": "paramIn" },
            "right": { "type": "PropertyAccess", "object": { "name": "StartSimulationSig" }, "property": "mission" } } ]
  ],
  "sendSignal": "SetMissionParamSig",
  "sendAssigns": [
    [ [], { "type": "Assignment", "left": { "type": "Identifier", "name": "param" },
            "right": { "type": "PropertyAccess", "object": { "name": "StartSimulationSig" }, "property": "mission" } } ]
  ]
}
```

**OnClause com guard:**
```
SysADL:  ON UnitArrivedAtTSig [ inTPresence == true ]
           THEN exposePieceT { pieceIn = inTPieceColor ; }
           SEND GrabPieceTSig { pieceColor = inTPieceColor ; }
```
```json
{
  "type": "OnClause",
  "signal": "UnitArrivedAtTSig",
  "condition": {
    "type": "BinaryExpression",
    "left": { "type": "Identifier", "name": "inTPresence" },
    "operator": "==",
    "right": { "type": "BooleanLiteral", "value": true }
  },
  ...
}
```

> [!WARNING]
> O campo `condition.operator` no AST pode vir como um array complexo (whitespace + operator + whitespace + right). O parser gera `operator: [ws, "==", ws, rightExpr]` e `right: [ws, "==", ws, rightExpr]`. A função `envExprToJS()` no transformer já trata esta normalização.

### 3.12. SceneDef
```json
{
  "type": "SceneDef",
  "name": "SCN_ObstacleStop_Unit1",
  "preconditions": [                    // pode ser [] se sem precondition
    [ [], { "type": "BinaryExpression", ... } ]
  ],
  "start": "obstacleDetected",          // nome do action/signal de início
  "finish": "obstacleDetected",         // nome do action/signal de fim
  "postconditions": [
    [ [], { "type": "BinaryExpression", ... } ]
  ]
}
```
**Nota:** `precondition` (sem hífen) vs gramática antiga `pre-condition` (com hífen).

### 3.13. ScenarioDefinitions
```json
{
  "type": "ScenarioDefinitions",
  "name": "ValidationPlan_RobAFIS",
  "reference": "RobAFISScenes",
  "scenarios": [
    [ [], { "type": "ScenarioDef", "name": "Scenario_ObstacleHandling_Unit1", "body": [...] } ]
  ]
}
```

### 3.14. ScenarioDef
```json
{
  "type": "ScenarioDef",
  "name": "Scenario_ObstacleHandling_Unit1",
  "body": [
    { "type": "SceneCall", "sceneName": "SCN_ObstacleStop_Unit1" },
    { "type": "SceneCall", "sceneName": "SCN_ObstacleResume_Unit1" }
  ]
}
```

### 3.15. ScenarioExecution
```json
{
  "type": "ScenarioExecution",
  "name": "RobAFIS_Validation_Run_P0",
  "reference": "ValidationPlan_RobAFIS",
  "mode": "once",
  "items": [
    [ [], { "type": "EventInjection", ... } ],
    [ [], { "type": "Assignment", ... } ],       // initial state setup
    [ [], { "type": "ParallelBlock", ... } ]
  ]
}
```

### 3.16. EventInjection
```json
{
  "type": "EventInjection",
  "signal": "StartSimulationSig",
  "assignments": [
    [ [], { "type": "Assignment", "left": { "name": "mission" }, "right": { "object": { "name": "MissionParameter" }, "property": "P0" } } ]
  ],
  "timing": { "type": "immediate" }
}
// Timing variants: { "type": "immediate" } | { "type": "after", "time": 45 }
```

### 3.17. ParallelBlock
```json
{
  "type": "ParallelBlock",
  "calls": [
    [ [], { "type": "ScenarioCall", "scenarioName": "Scenario_RoutingLogic_P0_Unit1" } ],
    [ [], { "type": "ScenarioCall", "scenarioName": "Scenario_ObstacleHandling_Unit1" } ],
    ...
  ]
}
```

### 3.18. EnvActivityAllocation
```json
{
  "type": "EnvActivityAllocation",
  "source": "OperatorEA",
  "target": "HumanOperatorEnvCP"
}
```

---

## 4. Arquitetura do Transformer.js (9597 linhas)

O arquivo está organizado assim (linhas aproximadas após as modificações da Fase 2):

| Linhas | Função | Descrição |
|---|---|---|
| 1-8 | Imports | |
| 9-136 | Utilitários | `sanitizeId()`, `extractExecutableParams()`, `dbg()`, `traverse()` |
| 138-217 | Extração de configuração | `extractConfigurations()`, `collectComponentUses()`, `resolveInstanceName()` |
| **218-4080** | **`generateClassModule()`** | Função principal (~3862 linhas). Gera `Model.js`. Contém todas as sub-funções de geração de classes structural/behavioral/executable. Inclui deduplicação de classes (`_generatedClassNames` Set). |
| **4102-5350** | **`generateEnvironmentModule()`** | ✅ **REESCRITA NA FASE 2.** Gera `Model-env-scen.js`. Suporta gramática nova E antiga. |
| 4120-4210 | Coleta de elementos AST | `traverse(ast)` com switch que classifica nós em arrays (envPortDefs, envConnectorDefs, envComponentDefs, boundaryExtensions, etc.) |
| 4220-4280 | `envExprToJS()` | Helper que converte AST expressions para JS. Suporta: Identifier, PropertyAccess, ArrayAccess, EnumAccess, QualifiedName, BooleanLiteral, NumberLiteral, StringLiteral, LogicalExpression, BinaryExpression, ComparisonExpression, Assignment. |
| 4285-4330 | Geração de EnvPort classes | `EP_*` extends EnvPort |
| 4335-4400 | Geração de EnvConnector classes | `ECN_*` extends EnvConnector |
| 4405-4530 | Geração de EnvComponent classes | `ECP_*` extends EnvComponent (com envPorts, properties) |
| 4535-4600 | Geração de BoundaryComponentExtension | `BEX_*` bridges (apply function) |
| 4605-4750 | Geração de EnvironmentConfiguration | `apply_*()` functions (envComponents, components, envDelegations, envConnectors) |
| 4755-4870 | Geração de EnvActivitiesDefinitions | `ENVACT_*` class (signals, actions, activities com ON/THEN/SEND, handleSignal) |
| 4875-4950 | Geração de Scene classes | `SCN_*` extends Scene (pre/postconditions via envExprToJS) |
| 4955-5010 | Geração de Scenario classes | extends Scenario (body com SceneCalls) |
| 5015-5100 | Geração de ScenarioExecution | classes com mode, injects, assignments, parallel blocks |
| 5105-5200 | `createEnvironmentModel()` factory | Registra todos os artefatos gerados |
| 5205-5350 | Exports | module.exports com todas as classes |
| 5350-6800 | Funções auxiliares env/scen (LEGADO) | `extractEntityTypes()`, `extractEventTypes()`, etc. **Usadas pela gramática antiga, mantidas para backward compatibility.** |
| **7131-7145** | **`hasEnvironmentElements()`** | ✅ Atualizada: detecta nós da gramática nova (EnvPortDef, EnvComponentDef, etc.) E antiga (EnvironmentDefinition, etc.) |
| **7165-7260** | **`separateElements()`** | ✅ Atualizada: separa nós AST em modelElements vs environmentElements |
| 7265-7600 | `main()` | Entry point CLI. Lê .sysadl, parseia, chama `generateClassModule()` e `generateEnvironmentModule()`, salva arquivos. |

### Funções-chave adicionadas/modificadas na Fase 2:

| Função | Linha | O que faz |
|---|---|---|
| `envExprToJS(expr, contextPrefix)` | 4220 | Converte AST expressions para JavaScript válido |
| `hasEnvironmentElements(ast)` | 7131 | Detecta se AST tem elementos env/scen (nova ou antiga gramática) |
| `separateElements(ast)` | 7165 | Separa nós AST em dois grupos para geração dos dois módulos |
| `_generatedClassNames` Set | 2826 | Previne geração de classes Action duplicadas no Model.js |

---

## 5. Código Gerado: RobAFIS.complete-env-scen.js (1933 linhas)

O módulo gerado tem a seguinte estrutura:

```javascript
// Imports
const { EnvComponent, EnvPort, EnvConnector, ... } = require('../sysadl-framework/SysADLBase');
const { createModel } = require('./RobAFIS.complete');  // Modelo estrutural

// EnvPort classes (EP_*)
class EP_OutPieceColor extends EnvPort { ... }    // 10 classes

// EnvConnector classes (ECN_*)
class ECN_DetectPieceColorEnvCN extends EnvConnector { ... }  // 8 classes

// EnvComponent classes (ECP_*)
class ECP_PieceEnvCP extends EnvComponent { ... }  // 12 classes

// BoundaryComponentExtension objects (BEX_*)
const BEX_SysADL_Components_ParameterInputCP = { ... apply(component) { ... } }  // 5 bridges

// EnvironmentConfiguration apply functions
function apply_TransElevatorConfig(parent, systemModel) { ... }  // 6 functions

// EnvActivitiesDefinitions class (ENVACT_*)
class ENVACT_RobAFISEnvironmentActivities { 
  constructor() { this.signals = {...}; this.actions = {...}; this.activities = {...}; }
  handleSignal(signalName, signalData, ctx) { ... }
}

// Scene classes (SCN_*)
class SCN_ObstacleStop_Unit1 extends Scene { 
  validatePreConditions(ctx) { ... }
  validatePostConditions(ctx) { ... }
}  // 16 classes

// Scenario classes
class Scenario_ObstacleHandling_Unit1 extends Scenario { ... }  // 10 classes

// ScenarioExecution classes
class RobAFIS_Validation_Run_P0 extends ScenarioExecution { ... }  // 2 classes

// Factory function
function createEnvironmentModel(systemModel) { ... }

// Exports
module.exports = { createEnvironmentModel, EP_*, ECN_*, ECP_*, BEX_*, SCN_*, Scenario_*, ... }
```

### Verificação de carga:
```bash
# Testa apenas a sintaxe
node --check generated/RobAFIS.complete-env-scen.js   # ✅ Sem erros

# Testa carga com mock (Model.js tem erro pré-existente em constraints)
node -e "
const Module = require('module');
const origReq = Module.prototype.require;
Module.prototype.require = function(id) {
  if (id.includes('RobAFIS.complete') && !id.includes('env-scen'))
    return { createModel: () => ({ getComponentByType: (t,n) => ({name:n,type:t}) }) };
  return origReq.call(this, id);
};
const m = require('./generated/RobAFIS.complete-env-scen');
const model = m.createEnvironmentModel();
console.log('Scenes:', Object.keys(model.scenes).length);  // → 16
"
```

---

## 6. Hierarquia de Classes do SysADLBase.js (7902 linhas)

### Classes Estruturais (Model.js)
```
Element
├── SysADLBase
│   ├── Model                      # Container principal
│   ├── Component                  # Componentes do sistema
│   └── Connector                  # Conectores do sistema
├── Port                           # Porta de comunicação
│   ├── SimplePort
│   └── CompositePort
├── BehavioralElement
│   ├── Constraint
│   ├── Executable
│   ├── Action
│   └── Activity
└── SysADLType
    ├── ValueType (Int, Boolean, String, Void, Real)
    └── DataType
```

### Classes de Ambiente/Cenário (env-scen.js) — **A ESTENDER**
```
Element
├── Entity (→ renomeado conceitualmente para EnvComponent)
├── EnvComponent                   # Componente de ambiente (L5187-5287)
├── EnvPort                        # Porta de ambiente (L5288-5368)  
├── EnvConnector (Connection)      # Conector de ambiente (L5369-5462)
├── Event                          # Evento (L5463-5543)
├── Scene                          # Cena com pre/post conditions (L5565-5918)
├── Scenario                       # Cenário (L5919-6120)
├── EnvironmentDefinition          # Container de ambiente (L6121-6447)
├── EnvironmentConfiguration       # Configuração/instanciação (L6448-6726)
├── ScenarioExecution              # Execução de cenários (L6727-7045)
├── EventsDefinitions              # Container de eventos (L7046-7319)
├── SceneDefinitions               # Container de cenas (L7320-7344)
└── ScenarioDefinitions            # Container de cenários (L7345-final)
```

> [!IMPORTANT]
> As classes de ambiente no SysADLBase.js foram escritas para a gramática **antiga**. Precisam ser atualizadas para suportar:
> - Composição hierárquica de EnvComponents (similar a Component.configuration)
> - Signals como mecanismo de comunicação (ON/THEN/SEND)
> - EnvConnectors com participants e flows (similar a Connector)
> - BoundaryComponentExtension bridges
>
> **Esta atualização é parte da Fase 5.**

---

## 7. Cadeia de Execução (como deve funcionar)

```
ScenarioExecution (RobAFIS_Validation_Run_P0)
  │ mode: once
  │ inject StartSimulationSig { mission = P0 } immediate
  │ inject ObstacleDetectedSig after 45
  │
  │ assignments (initial state setup):
  │   unit1.transElevator.pieces[0].outPresence = true
  │   unit1.transElevator.pieces[0].outColor = P1
  │   ...
  │
  │ parallel {
  │   ├── Scenario_RoutingLogic_P0_Unit1
  │   │     ├── SCN_MatrixDecision_SA_Unit1
  │   │     │     preconditions: operator1.outParam == P0 AND unit1.transElevator.outPieceColor == P1
  │   │     │     start: extractPieceT → (cadeia ON/THEN/SEND) → finish: routeToSA
  │   │     │     postconditions: unit1.navPad.outColor == Green
  │   │     └── SCN_MatrixDecision_SPD_Unit1
  │   │           ...
  │   ├── Scenario_ObstacleHandling_Unit1
  │   │     ├── SCN_ObstacleStop_Unit1
  │   │     └── SCN_ObstacleResume_Unit1
  │   └── ... (6 mais cenários)
  │ }
```

A cadeia ON/THEN/SEND dentro de uma Scene funciona assim:
```
Scene start: extractPieceT
  ↓ [EnvActivity UnitEA processa]
  ON ExtractedPieceTSig [ inOpParam == P0 AND inUnitPieceColor == P1 ]
    THEN routeToSA { colorIn = NavColor::Green }
    SEND RoutedToSASig
  ↓ routeToSA é o finish da Scene → Scene concluída
```

---

## 8. Composição Hierárquica (Modelo Real)

O RobAFIS usa 4 níveis de composição:

```
AtelierEnvironment
└── AtelierConfig
    ├── unit1: ProductionUnitEnvCP
    │   └── UnitConfig
    │       ├── standbyPos: StandbyPositionEnvCP
    │       ├── transElevator: TransElevatorEnvCP
    │       │   └── TransElevatorConfig
    │       │       └── pieces: PieceEnvCP [0..3]
    │       ├── arrivalStock: ArrivalStockEnvCP
    │       │   └── ArrivalStockConfig
    │       │       └── pieces: PieceEnvCP [0..3]
    │       ├── entryStock: SharedEntryStockEnvCP
    │       │   └── SharedEntryConfig
    │       │       └── pieces: PieceEnvCP [0..3]
    │       ├── departureStock: SharedDepartureStockEnvCP
    │       │   └── SharedDepartureConfig
    │       │       └── pieces: PieceEnvCP [0..3]
    │       ├── navLine: NavigationLineEnvCP
    │       ├── navPad: NavigationPadEnvCP
    │       ├── machineZone: RestrictedMachineZoneEnvCP
    │       └── [system components]
    │           unit_colorSens: ColorSensorCP      ← boundary component COM envPorts
    │           unit_tSens: PresenceSensorCP        ← boundary component COM envPorts
    │           unit_speSens: PresenceSensorCP      ← boundary component COM envPorts
    │           unit_zoneSens: PresenceSensorCP     ← boundary component COM envPorts
    │           unit_grabber: GrabberCP             ← boundary component COM envPorts
    │           unit_driveSys: DriveSystemCP        ← boundary component COM envPorts
    ├── unit2: ProductionUnitEnvCP (mesma estrutura)
    ├── operator1: HumanOperatorEnvCP
    ├── operator2: HumanOperatorEnvCP
    ├── r1_pInput: ParameterInputCP (system boundary)
    └── r2_pInput: ParameterInputCP (system boundary)
```

**Esta hierarquia é similar à composição de Components** (que já funciona no transformer). O padrão `environmentConfiguration` embutido é análogo ao `configuration { components: ...; connectors: ... }` dos Components.

---

## 9. Diretivas do Projeto (Restrições)

De `diretivas.txt`:

1. Trabalhar exclusivamente em `tales/v0.6/`
2. Solução genérica, sem hardcodes
3. Não modificar arquivos `.sysadl`, `sysadl.peg`, `sysadl-parser.js` (sem autorização)
4. Não modificar arquivos `.js` gerados — mudanças vão no `transformer.js`
5. Testes na pasta `test/`
6. Transformação via `transformer.js`
7. Simulação via `SysADLSimulator.js` (substitui `environment-simulator.js`)
8. Log deve mostrar interações entre elementos do ambiente e o sistema modelado
9. A ligação ambiente↔sistema é via associations em environmentConfiguration

---

## 10. Estado Atual (Progresso) — Atualizado em 2026-06-10

| Fase | Status | Notas |
|---|---|---|
| Fase 1: Parser | ✅ Concluída | 18/18 checks passed. AST dump em `sysadl-models/RobAFIS.complete-ast.json` |
| Fase 2: Transformer | ✅ Concluída | Geração env/scen reescrita. Módulo carrega OK, 1933 linhas, todos os artefatos corretos |
| Fase 3: SysADLSimulator | ⬜ Não iniciada | **PRÓXIMA FASE.** Redesenhar execução + ScenarioReporter JUnit-style |
| Fase 4: Logs | ⬜ Não iniciada | JSON estruturado |
| Fase 5: SysADLBase | ⬜ Não iniciada | Composição hierárquica de EnvComponents |
| Fase 6: Web App | ⬜ Não iniciada | Validar que nada quebrou |

### Artefatos Criados/Modificados
- `test/test-parser.js` — Script de teste do parser ✅
- `sysadl-models/RobAFIS.complete-ast.json` — AST completa do RobAFIS ✅
- `generated/RobAFIS.complete-env-scen.js` — Módulo env/scen gerado (1933 linhas, syntax OK) ✅
- `generated/RobAFIS.complete.js` — Módulo estrutural gerado (1490 linhas, duplicação corrigida) ✅
- `test/mock-model.js` — Mock para testar env-scen.js sem dependência do Model.js ✅

### Decisões Tomadas (aprovadas pelo usuário)
1. Dois simuladores complementares: `simulator.js` (web) + `SysADLSimulator.js` (CLI)
2. Transformer: adaptar incrementalmente, só reescrever a parte env/scen
3. Primeiro milestone: RobAFIS.complete.sysadl
4. Composição hierárquica de EnvComponents: similar a Component (aprovado)
5. Execução paralela: simulada (sequencial com estado compartilhado) no primeiro milestone

### Bugs Conhecidos
Nenhum bug da Fase 2 está pendente. Ambos os bugs listados anteriormente (onClauses vazios nas activities e constraint syntax error) foram corrigidos.

---

## 11. Contagens do RobAFIS (Referência para Validação)

| Elemento | No .sysadl | No env-scen.js gerado | Status |
|---|---|---|---|
| Packages | 14 | N/A | ✅ |
| ComponentDef | 7 | N/A | ✅ |
| ConnectorDef | 5 | N/A | ✅ |
| PortDef | 12 | N/A | ✅ |
| ActivityDef | 6 | N/A | ✅ |
| ActionDef | 8 | N/A | ✅ |
| ExecutableDef | 12 | N/A | ✅ |
| Requirements | 25 | N/A | ✅ |
| **EnvPortDef** | **10** | **10** | ✅ |
| **EnvConnectorDef** | **8** | **8** | ✅ |
| **EnvComponentDef** | **12** | **12** | ✅ |
| **BoundaryComponentExtension** | **5** | **5** | ✅ |
| **EnvironmentConfiguration** | **6** | **6** | ✅ |
| **EnvActivitiesDefinitions** | **1** | **1** | ✅ |
| **SignalDef** | **21** | **21** | ✅ |
| **EnvActionDef** | **3** | **3** | ✅ |
| **EnvActivityDef** | **2** | **2** | ✅ |
| **OnClause** | **26** | **26** | ✅ |
| **SceneDefinitions** | **1** | N/A (16 Scene classes) | ✅ |
| **SceneDef** | **16** | **16** | ✅ |
| **ScenarioDefinitions** | **1** | N/A (10 Scenario classes) | ✅ |
| **ScenarioDef** | **10** | **10** | ✅ |
| **ScenarioExecution** | **2** | **2** | ✅ |
| **ParallelBlock** | **2** | **2** | ✅ |
| **EventInjection** | **6** | **6** | ✅ |
| **EnvActivityAllocation** | **2** | **2** | ✅ |

---

## 12. Próximos Passos (para a próxima IA)

### Prioridade 1: Fase 3 — Implementar SysADLSimulator.js
O `SysADLSimulator.js` (497 linhas) precisa ser redesenhado para:
1. Carregar o env-scen.js gerado
2. Instanciar a hierarquia de EnvComponents (usando as `apply_*Config` functions)
3. Processar os ScenarioExecution (mode, injects, assignments, parallel)
4. Para cada Scenario → para cada Scene → avaliar pre/postconditions + cadeia ON/THEN/SEND
5. Gerar output JUnit-style

### Prioridade 2: Fase 5 — Ajustar SysADLBase.js
As classes Scene, Scenario, ScenarioExecution no SysADLBase.js podem precisar de ajustes para suportar o novo formato gerado. Avaliar durante a Fase 3.

### Comandos Úteis
```bash
# Regenerar os módulos a partir do .sysadl
node transformer.js sysadl-models/RobAFIS.complete.sysadl -o generated/

# Verificar sintaxe do módulo gerado
node --check generated/RobAFIS.complete-env-scen.js

# Testar carga do módulo com mock
node -e "
const Module = require('module');
const origReq = Module.prototype.require;
Module.prototype.require = function(id) {
  if (id.includes('RobAFIS.complete') && !id.includes('env-scen'))
    return { createModel: () => ({ getComponentByType: (t,n) => ({name:n,type:t}) }) };
  return origReq.call(this, id);
};
const m = require('./generated/RobAFIS.complete-env-scen');
const model = m.createEnvironmentModel();
console.log('OK. Scenes:', Object.keys(model.scenes).length);
"
```
