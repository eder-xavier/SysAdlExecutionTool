# SysADL Simulator — Guia de Uso (v0.6)

## 📖 Visão Geral

O **SysADLSimulator.js** é o orquestrador e executor unificado de simulações para a versão `v0.6`. Ele automatiza o fluxo completo de simulação:
1. **Validação**: Verifica a integridade estrutural e a extensão do arquivo de entrada `.sysadl`.
2. **Transpilação**: Invoca o compilador `transformer.js` para gerar arquivos de comportamento em JavaScript.
3. **Execução**: Carrega o modelo gerado e executa os cenários definidos (`ScenarioExecution`) em conformidade com as regras do framework.
4. **Relatórios**: Consolida os logs de execução e salva relatórios detalhados no formato JSON Lines (`.jsonl`).

---

## 🚀 Uso Básico via CLI

Para executar a simulação de um modelo SysADL:

```bash
node SysADLSimulator.js sysadl-models/RobAFIS.complete-novo.sysadl
```

### Fluxo de Execução Padrão:
* **Passo 1**: Validação do arquivo de entrada.
* **Passo 2**: Transpilação do `.sysadl` para arquivos `.js` na pasta de saída (padrão: `./generated/`).
* **Passo 3**: Execução em memória do modelo e cenários transpilados.
* **Passo 4**: Geração do sumário estruturado de testes (JUnit-style) no terminal.
* **Passo 5**: Gravação dos relatórios detalhados de execução na pasta de logs (padrão: `./logs/`).

---

## ⚙️ Opções da Interface de Linha de Comando (CLI)

O executor unificado aceita os seguintes parâmetros de controle:

### `--skip-transform`
Pula a etapa de compilação/transpilação de código. O executor buscará diretamente pelos arquivos `.js` correspondentes já gerados na pasta de saída.
```bash
node SysADLSimulator.js sysadl-models/RobAFIS.complete-novo.sysadl --skip-transform
```
> [!TIP]
> Use `--skip-transform` para economizar CPU e tempo de execução se você tiver certeza de que o arquivo `.sysadl` original não sofreu alterações desde a última simulação.

### `--verbose`
Exibe logs detalhados de baixo nível da execução do interpretador, incluindo mensagens detalhadas do compilador, vinculação de portas e instanciamento de hierarquias de conectores.
```bash
node SysADLSimulator.js sysadl-models/RobAFIS.complete-novo.sysadl --verbose
```

### `-h` ou `--help`
Exibe uma ajuda rápida das opções diretamente no console.

---

## 📁 Estrutura de Pastas e Cache

No ambiente CLI padrão do projeto, os arquivos são distribuídos da seguinte forma:

```
tales/v0.6/
├── generated/                              # Arquivos transpilados
│   ├── RobAFIS.complete-novo.js            # Modelo estrutural
│   └── RobAFIS.complete-novo-env-scen.js   # Ambiente, cenários e execuções
└── logs/                                   # Relatórios estruturados (.jsonl)
    └── simulation-ExecutionName-176473.jsonl
```

### 🌐 Organização na Aplicação Web (Editor React)
Quando integrado ao editor frontend (React/Vite), a persistência é mantida sob uma pasta raiz `/simulations` para fins de organização do workspace:
* **Código JavaScript compilado**: Armazenado em `./simulations/generated/`.
* **Trilhas de Auditoria / Logs**: Armazenadas em `./simulations/logs/`.

---

## 🔁 Modos de Execução do Simulador

O executor suporta múltiplos tipos de fluxo para cada bloco `ScenarioExecution` definido no modelo SysADL:

1. **Execução Única (`once`)**:
   Executa o cenário de testes uma única vez do início ao fim.
2. **Loop Iterativo (`loop: N`)**:
   Executa o mesmo cenário sequencialmente por exatamente `N` iterações.
3. **Loop Reativo / Condicional (`loop: while <condição>`)**:
   Executa o cenário continuamente enquanto a condição lógica monitorada for avaliada como verdadeira.
4. **Loop Infinito (`loop`)**:
   Executa indefinidamente até ser interrompido externamente.

---

## 🛑 Como Interromper a Simulação

Se a simulação entrar em um loop infinito ou de longa duração, utilize os seguintes procedimentos de parada de acordo com o ambiente:

### 1. No Terminal (CLI)
Pressione a combinação de teclas no teclado:
```text
Ctrl + C
```
Isso encerra imediatamente o processo Node.js executor.

### 2. No Editor Web (Frontend React)
Como os navegadores não possuem interrupção cooperativa para loops infinitos síncronos na thread principal:
1. O simulador roda dentro de um **Web Worker** em segundo plano.
2. Para parar a execução, o frontend aciona a chamada nativa:
   ```javascript
   worker.terminate();
   ```
3. O Worker é finalizado de forma abrupta e limpa, liberando os recursos de CPU imediatamente.
4. O editor altera o estado visual para `Interrompido` e instancia um novo Worker limpo para as próximas simulações.

---

## 📊 Estrutura do Relatório de Logs (.jsonl)

Cada simulação bem-sucedida gera um arquivo `.jsonl` na pasta de logs. A estrutura do JSON de relatório segue este padrão:

```json
{
  "simulation": {
    "model": "RobAFIS",
    "execution": "MainExecution",
    "timestamp": "2026-06-15T13:40:13.123Z",
    "mode": "once",
    "duration_ms": 42
  },
  "scenarios": [
    {
      "name": "Scenario_BatteryCheck",
      "status": "PASS",
      "scenes": [
        {
          "name": "Scene_BatteryLow",
          "status": "PASS",
          "preconditions": { "status": "PASS", "conditions": ["battery < 20"] },
          "execution": { "status": "PASS", "start_event": "Signal_Low", "finish_event": "Signal_Alert" },
          "postconditions": { "status": "PASS", "conditions": ["display == 'Low'"] }
        }
      ]
    }
  ],
  "summary": {
    "total_scenarios": 1,
    "passed": 1,
    "failed": 0,
    "total_scenes": 1,
    "scenes_passed": 1,
    "scenes_failed": 0,
    "scenes_skipped": 0
  }
}
```

---

## 🛠️ Execução Programática (Uso como Módulo Node)

O simulador unificado pode ser importado e usado de forma programática em scripts de teste ou integração:

```javascript
const SysADLSimulator = require('./SysADLSimulator');

// Instancia o simulador com configurações customizadas
const simulator = new SysADLSimulator({
    outputDir: './simulations/generated',
    logsDir: './simulations/logs',
    verbose: true
});

// Executa a simulação a partir do modelo original
simulator.run('sysadl-models/RobAFIS.complete-novo.sysadl')
    .then(() => {
        console.log('Orquestração de simulação concluída.');
    })
    .catch(err => {
        console.error('Erro na execução:', err.message);
    });
```
