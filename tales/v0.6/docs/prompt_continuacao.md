# Prompt para Continuação do Projeto SysADL Simulator

Copie e cole o texto abaixo como primeiro prompt para a próxima IA:

---

## PROMPT INÍCIO

Estamos trabalhando no simulador integrado da linguagem arquitetural SysADL. O projeto está em `tales/v0.6/`.

### Documentação obrigatória — leia ANTES de qualquer ação:

1. **`tales/v0.6/diretivas.txt`** — Restrições do projeto (NUNCA violar)
2. **`tales/v0.6/docs/technical_reference.md`** — Referência técnica completa (arquivos, AST, arquitetura do transformer, classes do framework, bugs conhecidos, próximos passos)
3. **`tales/v0.6/docs/implementation_plan.md`** — Plano de implementação com 6 fases (Fases 1 e 2 concluídas, Fase 3 em progresso)
4. **`tales/v0.6/docs/task.md`** — Tracker de tarefas com checklist detalhado
5. **`tales/v0.6/docs/SysADL.md`** — Explicação sobre a linguagem SysADL

### O que já foi feito:

- **Fase 1 ✅**: Parser validado — `sysadl-parser.js` parseia `RobAFIS.complete.sysadl` sem erros (18/18 tipos AST)
- **Fase 2 ✅**: Transformer atualizado — `transformer.js` gera `RobAFIS.complete-env-scen.js` (~2580 linhas) com todos os artefatos: 10 EnvPorts, 8 EnvConnectors, 12 EnvComponents, 5 BoundaryExtensions, 6 EnvironmentConfigurations, 1 EnvActivitiesDefinitions (com 26 ON/THEN/SEND clauses populados), 16 Scenes, 10 Scenarios, 2 ScenarioExecutions. O módulo passa no syntax check e carrega via `createEnvironmentModel()`.
- **Fase 3 (EM PROGRESSO)**: `SysADLSimulator.js` foi reescrito (~730 linhas) com:
  - `createExecutionContext()` — instancia a hierarquia de EnvComponents, conectores, e boundary extensions
  - Proxy `ctx` dinâmico que resolve: `ctx.unit1.transElevator.pieces[0].outPresence` → envPort correto
  - Proxy SET handler que mapeia `ctx.colorIn` e `ctx.pieceIn` para as portas corretas baseado no `activeAction`
  - `WrappedScenario.execute()` que executa scenes sequencialmente com cadeia ON/THEN/SEND via `handleSignal()`
  - `printExecutionSummary()` e `writeJsonLog()` para output JUnit-style
  - `SimulationScheduler` para injects com timing (immediate, after N)

### Bugs da Fase 2 — TODOS CORRIGIDOS:
- ✅ onClauses vazios nas activities → CORRIGIDO
- ✅ SyntaxError nas constraints do Model.js → CORRIGIDO

### Bug corrigido nesta sessão:

**OOM (Out of Memory) na propagação de valores** — CORRIGIDO

O `EnvPort.setValue()` no `SysADLBase.js` tinha uma lógica de propagação reativa que **coletava recursivamente TODOS os conectores** do environment inteiro (O(N²)) a cada mudança de valor. Isso causava cascata exponencial e crash com heap allocation failure (~4GB).

**Correção aplicada:**
- Substituída a coleta recursiva por **padrão observer direto**: cada conector se registra na porta source via `addObserver(connector)` durante a instanciação
- Adicionado **limite global de profundidade** (`MAX_PROPAGATION_DEPTH = 20`) para prevenir cascatas infinitas
- A instanciação de conectores em `SysADLSimulator.js` agora chama `srcPort.addObserver(connInstance)` após criar o conector
- Resultado: simulação processa assignments iniciais e propagação de conectores em ~40ms sem OOM

### PROBLEMA ATUAL — Simulação trava após initial assignments:

O simulador **não dá mais OOM**, mas **trava** após processar os initial assignments do `ScenarioExecution`. Ele entra no loop de polling de postconditions e nunca termina.

**Diagnóstico detalhado:**

A simulação segue este fluxo:
```
1. inject StartSimulationSig → handleSignal → param1C → unit1MissionC → OK ✅
2. Initial assignments (pieces[0].outPresence=true, etc.) → conectores propagam → OK ✅  
3. parallel { 8 scenarios } → Promise.all → cada Scenario executa suas Scenes
4. Para cada Scene:
   a. validatePreConditions(ctx) → avalia condição  
   b. handleSignal(startEvent, {}, ctx) → dispara cadeia ON/THEN/SEND
   c. Loop polling postconditions (2s timeout, poll cada 5ms) → TRAVA AQUI ❌
```

**Por que as postconditions falham:**

Tome como exemplo `SCN_MatrixDecision_SA_Unit1`:
- Precondição: `ctx.operator1.outParam === P0 && ctx.unit1.transElevator.outPieceColor === P1`
- Start event: `extractPieceT`
- Cadeia: `extractPieceT` (actionName) → `ExtractedPieceTSig` → guard(P0,P1) → `routeToSA` → `ctx.colorIn = NavColor.Green`
- Postcondição: `ctx.unit1.navPad.outColor === NavColor.Green`

O proxy SET para `colorIn` quando `activeAction === 'routeToSA'` faz:
```javascript
activeUnit.envPorts.outUnitNavPad.setValue(value);
```

Isso seta o valor na porta `outUnitNavPad` do **ProductionUnitEnvCP** (nível unit1). Mas a postcondição verifica `ctx.unit1.navPad.outColor` que é a porta `outColor` do **NavigationPadEnvCP** (sub-componente navPad dentro de unit1).

**O valor chega em `unit1.outUnitNavPad` mas a postcondição lê `unit1.navPad.outColor`**. Não existe envDelegation ou conector que propague de `unit1.outUnitNavPad` → `navPad.outColor` (ou vice-versa). A lógica de routing do proxy SET é hardcoded e não segue a topologia real dos envConnectors/envDelegations.

**Possíveis soluções (para avaliar):**

1. **Abordagem direta (mais rápida):** Fazer o proxy SET usar o caminho completo da topologia. Em vez de `activeUnit.envPorts.outUnitNavPad.setValue()`, resolver o caminho `unit1.navPad.outColor` baseado nas envDelegations do modelo (as envDelegations já existem no código gerado e mapeiam `navPad.outColor → outUnitNavPad`). Ou seja, setar diretamente `unit1.navPad.outColor` e deixar a envDelegation propagar para `outUnitNavPad`.

2. **Abordagem correta (mais robusta):** Eliminar o mapeamento hardcoded de `colorIn`/`pieceIn` no proxy. Em vez disso, fazer a cadeia ON/THEN/SEND resolver os nomes de variáveis (`colorIn`, `pieceIn`, `paramIn`) para os envPorts corretos usando as informações da EnvActivity (parâmetros de entrada/saída da action) e o envActivityAllocation (que mapeia activities para EnvComponents). Isso eliminaria todo o bloco `if (prop === 'colorIn')` do proxy.

3. **Abordagem de avaliação síncrona (alternativa):** Eliminar o loop de polling. Executar a cadeia ON/THEN/SEND de forma totalmente síncrona e, após a cadeia completar, avaliar as postconditions uma única vez. Se PASS → scene passa; se FAIL → scene falha. Sem polling.

### Arquivos relevantes (já modificados):

| Arquivo | Linhas | Descrição |
|---|---|---|
| `SysADLSimulator.js` | ~730 | Simulador CLI — **o problema está no proxy SET e no loop de postconditions** |
| `sysadl-framework/SysADLBase.js` | ~8050 | Framework — EnvPort.setValue() já corrigido com observer pattern |
| `generated/RobAFIS.complete-env-scen.js` | ~2580 | Código gerado — NÃO MODIFICAR (mudanças vão no transformer.js) |
| `transformer.js` | ~9600 | Transformer — pode precisar ajustes se a solução envolver mudança no código gerado |

### Regras importantes:
- Trabalhar APENAS em `tales/v0.6/`
- NUNCA modificar arquivos `.js` gerados — mudanças vão no `transformer.js`
- NUNCA modificar `.sysadl`, `sysadl.peg`, `sysadl-parser.js` sem autorização
- Solução genérica, sem hardcodes
- Testes na pasta `test/`
- Atualizar os docs em `tales/v0.6/docs/` conforme avançar

### Comandos úteis:
```bash
# Regenerar módulos
node transformer.js sysadl-models/RobAFIS.complete.sysadl -o generated/

# Verificar sintaxe
node --check generated/RobAFIS.complete-env-scen.js

# Rodar simulador
node SysADLSimulator.js sysadl-models/RobAFIS.complete.sysadl --verbose
```

### O que fazer agora:

1. Leia toda a documentação listada acima
2. Confirme que entendeu o contexto e o problema atual
3. Implemente uma das soluções propostas (recomendo a **abordagem 3** combinada com a **abordagem 1** — eliminar o polling e corrigir o routing de variáveis para seguir a topologia real)
4. Teste com `node SysADLSimulator.js sysadl-models/RobAFIS.complete.sysadl --verbose`
5. Valide que o output JUnit-style mostra PASS/FAIL para os 2 ScenarioExecutions (P0 e P1)

## PROMPT FIM

---
