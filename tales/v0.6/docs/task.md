# Task: Simulador SysADL Integrado

## Fase 1: Validar Parser com RobAFIS.complete.sysadl — ✅ CONCLUÍDA
- [x] Criar test/test-parser.js
- [x] Executar parser contra RobAFIS.complete.sysadl — ✅ PARSING SUCCEEDED
- [x] Identificar e corrigir falhas no parser/gramática — Nenhuma falha, parser OK!
- [x] Validar AST para todos os novos elementos — 18/18 checks passed
- [x] Dump AST para referência (RobAFIS.complete-ast.json)

## Fase 2: Atualizar Transformer para Nova Gramática — ✅ CONCLUÍDA
- [x] Atualizar classificação de nós AST (hasEnvironmentElements, separateElements) — ✅ Suporta nova e antiga gramática
- [x] Gerar código para EnvPortDef — ✅ 10 EnvPorts gerados (EP_OutPieceColor, EP_InPieceColor, etc.)
- [x] Gerar código para EnvConnectorDef (com participants/flows) — ✅ 8 EnvConnectors (ECN_DetectPieceColorEnvCN, etc.)
- [x] Gerar código para EnvComponentDef (com envPorts, properties) — ✅ 12 EnvComponents (ECP_PieceEnvCP, etc.)
- [x] Gerar código para BoundaryComponentExtension — ✅ 5 bridges (BEX_SysADL_Components_ParameterInputCP, etc.)
- [x] Gerar código para environmentConfiguration (embutido, com envComponents, components, envDelegations, envConnectors) — ✅ 6 configs (apply_TransElevatorConfig, etc.)
- [x] Gerar código para EnvActivitiesDefinitions (SignalDef, EnvActionDef, EnvActivityDef com ON/THEN/SEND) — ✅ 1 class (ENVACT_RobAFISEnvironmentActivities)
- [x] Gerar código para SceneDefinitions (nova sintaxe: precondition sem hífen) — ✅ 16 Scenes
- [x] Gerar código para ScenarioDefinitions — ✅ 10 Scenarios
- [x] Gerar código para ScenarioExecution (nome, mode, parallel, inject com timing) — ✅ 2 executions
- [x] Gerar código para EnvActivityAllocation — ✅ Suportado
- [x] Testar transformação do RobAFIS.complete.sysadl — ✅ Módulo carrega OK, syntax check passa
- [x] Corrigir envExprToJS para ArrayAccess e EnumAccess — ✅ Expressões `pieces[0].outPresence` e `PieceType::P1` OK
- [x] Corrigir duplicação de classes Action (dedup) — ✅ AN_ScenariosRobAFIS_PassPieceTypeAN sem duplicata

### Bugs pendentes da Fase 2 (a corrigir antes ou durante Fase 3):
- [x] Inserir onClauses nas activities do ENVACT_ (atualmente arrays vazios em OperatorEA e UnitEA)
- [x] Corrigir conversão de `equation = x == y` nas constraints do Model.js (SyntaxError: Unexpected token '==')

## Fase 3: Refatorar SysADLSimulator.js — 🟡 EM PROGRESSO
- [x] Corrigir onClauses vazios nas EnvActivities (pré-requisito para execução)
- [x] Eliminar performBinding manual
- [x] Implementar novo fluxo de execução (carregar env-scen.js → instanciar → executar)
- [x] Suportar mode (once, etc.)
- [x] Suportar inject com timing (immediate, after N)
- [x] Suportar parallel blocks (Promise.all)
- [x] Implementar avaliação de pre/postconditions das Scenes
- [x] Implementar cadeia ON/THEN/SEND dentro das Scenes (via handleSignal)
- [x] Implementar ScenarioReporter (JUnit-style output) e JSON log writer
- [ ] **🐛 BUG: Corrigir routing de variáveis no proxy SET** — `colorIn`/`pieceIn` setam portas do nível errado (unit1.outUnitNavPad em vez de unit1.navPad.outColor). Ver prompt_continuacao.md para detalhes.
- [ ] **🐛 BUG: Eliminar loop de polling de postconditions** — usar avaliação síncrona após cadeia ON/THEN/SEND completar
- [ ] Testar com RobAFIS_Validation_Run_P0 e RobAFIS_Validation_Run_P1

## Fase 4: Formato de Logs — 🟡 EM PROGRESSO
- [x] Implementar log JSON estruturado (formato definido no implementation_plan.md)
- [x] Implementar JUnit-style console output
- [ ] Validar output (depende da Fase 3 funcionar)
- [ ] Manter log do simulator.js intacto

## Fase 5: Atualizar Framework (SysADLBase) — 🟡 EM PROGRESSO
- [x] EnvPort.setValue() — substituído coleta recursiva O(N²) por observer pattern O(1)
- [x] Limite global de profundidade de propagação (MAX_PROPAGATION_DEPTH=20)
- [x] EnvComponent constructor com Proxy para get/set de envPorts e properties
- [x] Instanciação de conectores registra observers nas portas source
- [ ] Avaliar se envDelegations precisam propagar valores automaticamente (envDelegation unit1.navPad.outColor → outUnitNavPad)
- [ ] Avaliar necessidade de ajustes em Scene, Scenario, ScenarioExecution classes base

## Fase 6: Validar Web App — ⬜ NÃO INICIADA
- [ ] Testar simulator.js com Simple.sysadl (transform + simulate)
- [ ] Verificar que nada quebrou na interface web
- [ ] Validar que server-node.js + transformer.js continuam gerando Model.js corretamente

