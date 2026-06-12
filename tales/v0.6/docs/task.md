# Task: Simulador SysADL Integrado

## Fase 1: Validar Parser com RobAFIS.complete.sysadl — ✅ CONCLUÍDA
- [x] Criar test/test-parser.js
- [x] Executar parser contra RobAFIS.complete.sysadl — ✅ PARSING SUCCEEDED
- [x] Identificar e corrigir falhas no parser/gramática — Nenhuma falha, parser OK!
- [x] Validar AST para todos os novos elementos — 18/18 checks passed
- [x] Dump AST para referência (RobAFIS.complete-ast.json)

## Fase 2: Atualizar Transformer para Nova Gramática — ✅ CONCLUÍDA
- [x] Atualizar classificação de nós AST (hasEnvironmentElements, separateElements) — ✅ Suporta nova e antiga gramática
- [x] Gerar código para EnvPortDef — ✅ 10 EnvPorts gerados
- [x] Gerar código para EnvConnectorDef (com participants/flows) — ✅ 8 EnvConnectors
- [x] Gerar código para EnvComponentDef (com envPorts, properties) — ✅ 12 EnvComponents
- [x] Gerar código para BoundaryComponentExtension — ✅ 5 bridges
- [x] Gerar código para environmentConfiguration (embutido) — ✅ 6 configs
- [x] Gerar código para EnvActivitiesDefinitions (SignalDef, EnvActionDef, EnvActivityDef com ON/THEN/SEND) — ✅ 1 class (ENVACT_RobAFISEnvironmentActivities)
- [x] Gerar código para SceneDefinitions — ✅ 16 Scenes
- [x] Gerar código para ScenarioDefinitions — ✅ 10 Scenarios
- [x] Gerar código para ScenarioExecution (nome, mode, parallel, inject com timing) — ✅ 2 executions
- [x] Gerar código para EnvActivityAllocation — ✅ Suportado
- [x] Testar transformação do RobAFIS.complete.sysadl — ✅ Módulo carrega OK, syntax check passa
- [x] Corrigir envExprToJS para ArrayAccess e EnumAccess — ✅ Expressões OK
- [x] Corrigir duplicação de classes Action (dedup) — ✅ Sem duplicata

---

## Fase 3: Refatorar para Arquitetura Genérica (Correção das Diretivas) — ✅ CONCLUÍDA

### Transformer.js
- [x] Atualizar `generateEnvironmentModule` para aceitar `activitiesToRegister`.
- [x] Exportar metadados de `delegates` nas classes geradas no `ENVACT_`.
- [x] Corrigir leitura de `action.returnType` no lugar de `action.outType`.

### SysADLSimulator.js
- [x] Remover mapeamento de abreviações hardcoded em `resolveInputPortValue` e usar resolução sibling genérica.
- [x] Implementar `setupReplicatedDelegations` genérico utilizando o caminho relativo das instâncias com `pieces`.
- [x] Implementar filtro de cenários genérico por branches sob a raiz do ambiente em `checkPassiveScenes`.
- [x] Implementar proxy `set` genérico que consome as delegações de atividades para atribuições de pinos.
- [x] Implementar commit e detecção de reinício de ciclo genéricos via rastreamento de sinais repetidos em `handleSignal`.
- [x] Atribuir `parent` na árvore em `instantiateEnvironment` para permitir caminhamento genérico de ancestrais.
- [x] Ajustar proxy `set` para caminhar até o componente replicado ancestral (corrigindo a verificação de `pieces` para ports como `pieces[i].outColor`).
- [x] Implementar `triggerGenericRestart` e `hasMoreReplicatedPieces` para reiniciar o ciclo ao término de ações terminais.
- [x] Remover todos os logs debug específicos de `unit1`, `unit2` de `WrappedScene` em `SysADLSimulator.js`.

---

## Fase 4: Formato de Logs — ✅ CONCLUÍDA
- [x] Implementar log JSON estruturado (formato definido no plano)
- [x] Implementar JUnit-style console output
- [x] Validar output com simulação bem-sucedida

## Fase 5: Atualizar Framework (SysADLBase) — ✅ CONCLUÍDA
- [x] Ajustar `ScenarioExecution` / `SceneExecutor` para reportar resultados de pre/post conditions de forma estruturada
- [x] Garantir que `EnvConnector` ao ser acionado dispare o fluxo na porta correspondente

## Fase 6: Validar Web App — ✅ CONCLUÍDA
- [x] Testar simulator.js com Simple.sysadl (transform + simulate)
- [x] Verificar que nada quebrou na interface web
- [x] Validar que server-node.js + transformer.js continuam gerando Model.js corretamente
