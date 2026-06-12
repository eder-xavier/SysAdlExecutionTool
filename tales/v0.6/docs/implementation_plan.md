# Plano: Simulador SysADL Integrado

## Contexto

O objetivo é criar um simulador integrado funcional que:
1. Receba um `.sysadl` (nova gramática) → transforme → execute cenários → gere resultados
2. Mantenha a aplicação web (simulator.js) funcionando para simulação estrutural
3. Gere resultados no estilo JUnit (✅/❌ por cenário/cena) e logs estruturados em JSON

O modelo de referência para a nova gramática e execução é `sysadl-models/RobAFIS.complete.sysadl`.

---

## Decisões de Arquitetura (Aprovadas)

| Decisão | Escolha |
|---|---|
| Simuladores | Dois complementares: `simulator.js` (web) + `SysADLSimulator.js` (CLI) |
| Transformer | Adaptação incremental — só reescrita da parte de ambiente e cenários (`*-env-scen.js`) |
| Resolução de Portas | Dinâmica via metadados de delegação (`delegates`) gerados pelo Transformer |
| Índices de Replicação | Dinâmicos e indexados via mapa de caminhos relativos de componentes |
| Ciclos de Simulação | Commit de replicação e reinício disparados por detecção genérica de loop de sinais |
| Execução Paralela | Simulada (sequencial com estado compartilhado) no primeiro milestone |

---

## Fase 1: Validar Parser com RobAFIS.complete.sysadl — ✅ CONCLUÍDA

- Parser valida RobAFIS.complete.sysadl sem erros.
- 18/18 tipos de nós AST reconhecidos.
- AST dump gerado em `sysadl-models/RobAFIS.complete-ast.json`.
- Script de teste criado em `test/test-parser.js`.

---

## Fase 2: Atualizar Transformer para Nova Gramática — ✅ CONCLUÍDA

- A função `generateEnvironmentModule()` em `transformer.js` foi reescrita para suportar a nova gramática PEG.
- Geração automática de classes para `EP_`, `ECN_`, `ECP_`, `BEX_`, `ENVACT_`, `SCN_`, `Scenario_`, `ScenarioExecution`.
- Correção de guards com expressions (`equation = x == y`, onClauses populados, etc.).

---

## Fase 3: Refatorar SysADLSimulator.js e Transformer.js para Arquitetura Genérica — 🟡 EM PROGRESSO

O simulador, o transformador e o framework base devem ser completamente genéricos e livres de referências específicas ao modelo RobAFIS.

### 3.1. Metadados de Delegação no Transformer.js
Para evitar o mapeamento manual de ações para portas do ambiente no simulador, o `transformer.js` passará a exportar as delegações de atividades (`ActivityDelegation`) normalizadas diretamente no módulo de ambiente gerado (`*-env-scen.js`).
- Passar `activitiesToRegister` como argumento para `generateEnvironmentModule()`.
- Para cada atividade gerada no objeto `this.activities`, injetar a propriedade `delegates` contendo a lista de mapeamentos `{ from: parentPortName, to: actionName }`.
- Corrigir a leitura de tipo de retorno de `EnvAction` no transformer para ler de `action.returnType` em vez de `action.outType`.

### 3.2. Resolução Genérica de Propagação de Ações no Simulador
No proxy de contexto do simulador, a interceptação de atribuições de variáveis de ações (como `colorIn`, `pieceIn`, etc.) será feita de forma genérica:
- Quando uma propriedade é alterada via proxy `set`:
  1. Identificar se há uma ação ativa (`c.activeAction`) e atividade ativa (`c.activeActivity`).
  2. Buscar nas delegações da atividade ativa o mapeamento correspondente à ação ativa (`to === activeAction`).
  3. Encontrar a porta pai correspondente (`from`).
  4. Resolver a porta no componente ativo (`target.activeInstance`).
  5. Obter as portas folha reais associadas via `resolveLeafBindingPorts(port)`.
  6. Para cada porta folha, verificar se pertence a um componente replicado (subindo a árvore de `parent` para encontrar se algum ancestral possui a propriedade `pieces` contendo o dono da porta folha):
     - Se sim, obter o caminho relativo (`envPath`) do componente replicado ancestral.
     - Se for uma porta de entrada (`direction === 'in'`), propagar o valor (inserção).
     - Se for uma porta de saída (`direction === 'out'`), guardar no contexto sem propagar para a folha (extração).
     - Enfileirar incremento pendente de replicação para o componente sob `replicatedIndices.pending[replicatedPath] = 1`.
     - Caso contrário, propagar o valor chamando `setValue(value)` nas portas folha.

### 3.3. Índices de Replicação Genéricos e Estrutura de Parentesco
Eliminar a estrutura de contagem específica (`extractedCount.unit1.T`, etc.) em favor de um mapa genérico de componentes replicados:
- **Parentesco na Instanciação**: Em `instantiateEnvironment`, atribuir `val.parent = component` e `item.parent = component` ao percorrer a árvore. Isso permite determinar a ascendência dos componentes.
- **Estrutura no Contexto**: `ctx.replicatedIndices = { current: {}, pending: {} }`.
- **Caminhamento de Replicação**:
  - Varre a hierarquia do ambiente. Para cada componente `comp` que contém um array `pieces`:
    - Inicializa seu índice atual e pendente em `0`.
    - Guarda seu caminho relativo (e.g. `'unit1.transElevator'`).
    - Sobrescreve dinamicamente a leitura (`getValue`) de suas portas de saída para buscar o valor do componente de peça ativo em `pieces[idx]`.

### 3.4. Reinício de Ciclo Genérico e Commits
Para simular a continuidade da cadeia de execução de múltiplos ciclos sem depender de hardcodes do RobAFIS:
- **Detecção de Fim de Ciclo**: Ao executar uma cláusula `ON` que não possui `sendSignal` (um "terminal action") em uma instância ativa do componente:
  - Verificar se existem mais peças replicadas para processar sob a instância (verificação dinâmica nas listas de peças com presença ativa).
  - Se houver mais peças:
    - Identificar os sinais de entrada ("entry signals") da atividade associada (sinais das cláusulas `ON` que não são emitidos por nenhuma cláusula `SEND` da própria atividade).
    - Mapear os atributos do sinal de entrada para portas/propriedades da instância (fuzzy matching).
    - Agendar o disparo do sinal de entrada na instância ativa no próximo tick (`setTimeout` com 0ms).
- **Loop de Sinais**: Em `handleSignal`, manter um conjunto `seenSignals` temporário durante a execução da cadeia. Se um sinal se repetir no fluxo, commit dos índices replicados.
- **Fim da Cadeia**: Ao término de uma cadeia de sinais (fila vazia em `handleSignal`), commit dos índices replicados pendentes.
- **Limpeza de Hardcodes**: Remover todas as impressões e logs model-specific em `validatePreConditions` e `validatePostConditions`.

---

## Fase 4: Formato de Logs — ⬜ NÃO INICIADA

### Log JSON Estruturado (novo formato para SysADLSimulator)
Gerar logs detalhados na pasta `./logs` com estatísticas de execução de cenários e cenas, incluindo validações de pre/postconditions.

---

## Fase 5: Atualizar Framework (SysADLBase) se necessário — ⬜ NÃO INICIADA

- Ajustar `ScenarioExecution` / `SceneExecutor` para reportar resultados de pre/post conditions de forma estruturada.
- Garantir que `EnvConnector` ao ser acionado dispare o fluxo na porta do sistema correspondente.

---

## Fase 6: Manter Aplicação Web Funcionando — ⬜ NÃO INICIADA

- Garantir que o `simulator.js` e `visualizer.js` na interface web continuam executando sem erros.
- Assegurar que a geração de `Model.js` pelo transformer antigo para a web não sofreu regressões.

---

## Verification Plan

### Automated Tests
```bash
# Fase 2: Transformer
node transformer.js sysadl-models/RobAFIS.complete.sysadl -o generated/
node --check generated/RobAFIS.complete-env-scen.js

# Fase 3: Simulador
node SysADLSimulator.js sysadl-models/RobAFIS.complete.sysadl --verbose
```

### Manual Verification
1. Executar `SysADLSimulator.js` com RobAFIS.complete.sysadl.
2. Verificar que o output JUnit-style mostra PASS/FAIL corretamente para os 2 ScenarioExecutions (P0 e P1).
3. Verificar que os logs JSON em `./logs` são estruturados de forma genérica.
