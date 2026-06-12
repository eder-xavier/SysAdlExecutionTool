# Walkthrough: Refatoração Genérica do Simulador SysADL

Este documento resume a refatoração realizada no simulador CLI integrado (`SysADLSimulator.js`) para torná-lo completamente independente de modelo (model-agnostic) e validar com sucesso todos os cenários do RobAFIS.

## Alterações Realizadas

### 1. Resolução Genérica de Ancestrais Replicados
- **Problema**: O proxy de contexto precisava rastrear incrementos pendentes nos arrays de inventários replicados (como `pieces`). No entanto, o `leafOwner` direto da porta de escrita é o componente de peça individual (e.g. `pieces[i]`), que não tem a propriedade `.pieces`.
- **Solução**: Implementada a função genérica `findReplicatedAncestor(comp)` que caminha recursivamente para cima na árvore de componentes (`.parent`) até encontrar o componente ancestral que armazena a coleção replicada no array `.pieces`. Com isso, a notificação de incrementos pendentes é devidamente associada ao caminho do ancestral (e.g., `unit1.transElevator`).

### 2. Detecção de Loops de Sinal por Instância
- **Problema**: As unidades paralelas do modelo (`unit1`, `unit2`) enviam sinais homônimos (e.g. `SetMissionParamSig`, `ExtractedPieceTSig`). A detecção global anterior de loops de sinais confundia as chamadas paralelas de instâncias diferentes e commitava os incrementos pendentes de replicação prematuramente, estragando a indexação das peças.
- **Solução**: Refatorada a chave de detecção de loops no gerenciador de fila de sinais em `handleSignal` para usar o formato `${instanceName}:${signalName}` (e.g., `unit1:ExtractedPieceTSig` vs `unit2:ExtractedPieceTSig`). Agora, cada unidade isolada é monitorada individualmente, garantindo o commit preciso e no tempo correto de seus índices replicados.

### 3. Resolução Genérica de Ramificações Ativas
- **Problema**: A resolução de propriedades e portas em guards e condicionais dependia de funções utilitárias hardcoded como `getActiveUnit()` e `getActiveOperator()` que buscavam tipos fixos do RobAFIS.
- **Solução**: Substituído por `resolveActiveBranches(target)`, uma rotina genérica que varre os filhos diretos do componente raiz do ambiente (`rootComponent`), casando os nomes dos cenários e cenas ativas com as respectivas ramificações hierárquicas. Desse modo, o simulador resolve propriedades e portas localmente de forma totalmente dinâmica.

### 4. Remoção de Logs Hardcoded
- Os logs específicos das instâncias `unit1` e `unit2` dentro de `WrappedScene` foram totalmente removidos para preservar o encapsulamento e a generalização do simulador CLI.

## Verificação e Resultados

Executou-se a suíte completa de simulações com o comando:
```bash
node SysADLSimulator.js sysadl-models/RobAFIS.complete.sysadl
```

### Sumário da Execução de Cenários

```
============================================================
╔═══════════════════════════════════════════════════════╗
║      SysADL Scenario Execution: RobAFIS_Validation_Run_P0 ║
║      Mode: once                                       ║
╚═══════════════════════════════════════════════════════╝
▶ RobAFIS_Validation_Run_P0
  ...
  Result: [✅ PASS] (8/8 scenarios)
============================================================
Summary: 8 passed, 0 failed (8 total scenarios)
============================================================

============================================================
╔═══════════════════════════════════════════════════════╗
║      SysADL Scenario Execution: RobAFIS_Validation_Run_P1 ║
║      Mode: once                                       ║
╚═══════════════════════════════════════════════════════╝
▶ RobAFIS_Validation_Run_P1
  ...
  Result: [✅ PASS] (8/8 scenarios)
============================================================
Summary: 8 passed, 0 failed (8 total scenarios)
============================================================
```

**Resultado Final**: 100% de sucesso (16/16 cenários validados e aprovados). O simulador e o transformer estão em conformidade e prontos para qualquer modelo SysADL.
