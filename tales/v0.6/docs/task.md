# Task: Simulador SysADL Integrado

## Fase 1: Validar Parser com RobAFIS.complete.sysadl
- [x] Criar test/test-parser.js
- [x] Executar parser contra RobAFIS.complete.sysadl — ✅ PARSING SUCCEEDED
- [x] Identificar e corrigir falhas no parser/gramática — Nenhuma falha, parser OK!
- [x] Validar AST para todos os novos elementos — 18/18 checks passed
- [x] Dump AST para referência (RobAFIS.complete-ast.json)

## Fase 2: Atualizar Transformer para Nova Gramática
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

## Fase 3: Refatorar SysADLSimulator.js
- [ ] Eliminar performBinding manual
- [ ] Implementar novo fluxo de execução
- [ ] Suportar mode (once, etc.)
- [ ] Suportar inject com timing (immediate, after N)
- [ ] Suportar parallel blocks (simulado/sequencial)
- [ ] Implementar ScenarioReporter (JUnit-style output)

## Fase 4: Formato de Logs
- [ ] Implementar log JSON estruturado
- [ ] Manter log do simulator.js intacto

## Fase 5: Atualizar Framework (SysADLBase)
- [ ] Suportar composição hierárquica de EnvComponents (similar a Component)
- [ ] Ajustar ScenarioExecution/SceneExecutor para reportar pre/post conditions
- [ ] Garantir EnvConnector com bindings dispare fluxo correto

## Fase 6: Validar Web App
- [ ] Testar simulator.js com Simple.sysadl (transform + simulate)
- [ ] Verificar que nada quebrou
