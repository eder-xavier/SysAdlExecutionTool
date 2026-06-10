# Prompt para Continuação do Projeto SysADL Simulator

Copie e cole o texto abaixo como primeiro prompt para a próxima IA:

---

## PROMPT INÍCIO

Estamos trabalhando no simulador integrado da linguagem arquitetural SysADL. O projeto está em `tales/v0.6/`.

### Documentação obrigatória — leia ANTES de qualquer ação:

1. **`tales/v0.6/diretivas.txt`** — Restrições do projeto (NUNCA violar)
2. **`tales/v0.6/docs/technical_reference.md`** — Referência técnica completa (arquivos, AST, arquitetura do transformer, classes do framework, bugs conhecidos, próximos passos)
3. **`tales/v0.6/docs/implementation_plan.md`** — Plano de implementação com 6 fases (Fases 1 e 2 concluídas, Fase 3 é a próxima)
4. **`tales/v0.6/docs/task.md`** — Tracker de tarefas com checklist detalhado
5. **`tales/v0.6/docs/SysADL.md`** — Explicação sobre a linguagem SysADL

### O que já foi feito:

- **Fase 1 ✅**: Parser validado — `sysadl-parser.js` parseia `RobAFIS.complete.sysadl` sem erros (18/18 tipos AST)
- **Fase 2 ✅**: Transformer atualizado — `transformer.js` gera `RobAFIS.complete-env-scen.js` (1933 linhas) com todos os artefatos: 10 EnvPorts, 8 EnvConnectors, 12 EnvComponents, 5 BoundaryExtensions, 6 EnvironmentConfigurations, 1 EnvActivitiesDefinitions, 16 Scenes, 10 Scenarios, 2 ScenarioExecutions. O módulo passa no syntax check e carrega via `createEnvironmentModel()`.

### O que precisa ser feito agora (por ordem de prioridade):

**1. Corrigir bugs pendentes da Fase 2:**
- Os arrays `onClauses` nas activities do `ENVACT_RobAFISEnvironmentActivities` estão **vazios** (OperatorEA e UnitEA). Os 26 ON/THEN/SEND clauses existem no AST mas não são inseridos nas activities. Verificar no `transformer.js` (linhas ~4755-4870) a lógica de geração de EnvActivitiesDefinitions.
- O `generated/RobAFIS.complete.js` (modelo estrutural) tem `SyntaxError: Unexpected token '=='` na conversão de `equation = x == y` das constraints. Corrigir no transformer, na função `generateClassModule()`.

**2. Implementar Fase 3 — Refatorar `SysADLSimulator.js`:**
- Redesenhar para carregar o `env-scen.js` gerado, instanciar a hierarquia de EnvComponents, processar ScenarioExecutions (mode, injects, assignments, parallel), avaliar pre/postconditions das Scenes, e executar cadeias ON/THEN/SEND.
- Gerar output JUnit-style (formato descrito no `implementation_plan.md`).

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

# Testar carga com mock (Model.js tem bug de constraint)
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
console.log('Scenes:', Object.keys(model.scenes).length);
"
```

Leia toda a documentação listada acima, confirme que entendeu o contexto, e comece pela correção dos bugs pendentes da Fase 2 (onClauses vazios).

## PROMPT FIM

---
