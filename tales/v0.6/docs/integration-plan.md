# Plano de Integração: Simulador no Editor React

Este documento descreve a estratégia de integração do core do simulador SysADL (Projeto A) na aplicação do editor web baseada em React 19, Vite, React Flow e Monaco Editor (Projeto B), considerando as restrições de hospedagem estática (sem backend Node.js em produção).

---

## 1. Arquitetura Geral (Pure Client-Side)

Dado que a aplicação de destino é hospedada em um servidor web estático simples, todo o processamento (parsing, compilação/transformação e execução) deve ocorrer de forma autônoma **no navegador do usuário**.

Para garantir uma interface fluida, a simulação deve rodar fora da thread de renderização principal do React, usando **Web Workers** e **Blob URLs** para carregar os módulos gerados em tempo de execução.

```
+-------------------------------------------------------------------------+
|                          NAVEGADOR DO USUÁRIO                           |
|                                                                         |
|  +--------------------+                                                 |
|  | Monaco Editor      |                                                 |
|  | (Edição SysADL)    |                                                 |
|  +---------+----------+                                                 |
|            | Código (String)                                            |
|            v                                                            |
|  +---------+----------+      Mapeia Eventos      +-------------------+  |
|  | Thread React (UI)  |<-------------------------| Web Worker        |  |
|  | - React Flow       |   (postMessage / JSON)   | (Background Sim)  |  |
|  | - JUnit Tree View  |                          |                   |  |
|  +---------+----------+                          | - sysadl-parser   |  |
|            |                                     | - transformer     |  |
|            | Grava logs                          | - Engine          |  |
|            v                                     +---------+---------+  |
|  +---------+----------+                                    |            |
|  | Local File System  |<-----------------------------------+            |
|  | Access API         |                                                 |
|  +--------------------+                                                 |
+-------------------------------------------------------------------------+
```

---

## 2. Estratégia de Deploy e Sincronização de Código

Os projetos devem permanecer separados para evitar conflitos de escopo de IA. O Projeto A (Core) publica suas atualizações de forma unidirecional para o Projeto B (Editor) via script de sincronização.

### Arquivos Core Sincronizados
* [sysadl-parser.js](file:///Users/tales/desenv/SysAdlWebStudio/tales/v0.6/sysadl-parser.js): O parser Peggy gerado.
* [transformer.js](file:///Users/tales/desenv/SysAdlWebStudio/tales/v0.6/transformer.js): O transpiler de SysADL para JavaScript.
* [SysADLSimulator.js](file:///Users/tales/desenv/SysAdlWebStudio/tales/v0.6/SysADLSimulator.js): A lógica central de orquestração.
* A pasta [sysadl-framework/](file:///Users/tales/desenv/SysAdlWebStudio/tales/v0.6/sysadl-framework/): Toda a biblioteca de classes base e managers reativos.

### Script de Sincronização (`sync-to-editor.sh`)
Crie este script na raiz do Projeto A:

```bash
#!/bin/bash
# Script de Sincronização do Simulador com o Editor React

EDITOR_PATH="/Users/tales/desenv/sysadlstudioweb"
TARGET_DIR="$EDITOR_PATH/src/core/sysadl"

echo "🔄 Sincronizando core do simulador com o editor..."

# Garantir que pasta de destino exista
mkdir -p "$TARGET_DIR"

# Copiar arquivos do core
cp sysadl-parser.js "$TARGET_DIR/"
cp transformer.js "$TARGET_DIR/"
cp SysADLSimulator.js "$TARGET_DIR/"
cp -R sysadl-framework/ "$TARGET_DIR/sysadl-framework/"

echo "✅ Sincronização concluída com sucesso!"
```

---

## 3. Adaptações do Core para Compatibilidade com Navegador

Para que os arquivos sincronizados funcionem no ambiente Vite/Navegador, pequenos ajustes devem ser isolados do funcionamento CLI padrão.

### 3.1. Isolando I/O no `transformer.js`
O `transformer.js` atualmente lê e escreve arquivos físicos usando o módulo `fs` do Node.
* **Ajuste**: Criar uma função de entrada pura `transform(sysadlCodeString)` que recebe o código como string, chama o parser em memória e retorna a string de JavaScript gerada.
* **Exemplo**:
  ```javascript
  // Dentro de transformer.js (exportado para uso no browser/worker)
  function transform(sysadlCodeString) {
      const ast = parser.parse(sysadlCodeString);
      return generateJSFromAST(ast); // Retorna a string do código Javascript transpilado
  }
  module.exports = { transform, ... };
  ```

### 3.2. Caching de Transformação e Persistência no Sistema de Arquivos
Para aliviar a carga de processamento no navegador e evitar a compilação repetida de arquivos não alterados, o editor React pode utilizar a **File System Access API** para implementar uma lógica de cache incremental:

1. **Persistência Física**: O arquivo JavaScript transpilado é salvo fisicamente na pasta `./simulations/generated/` do projeto do usuário.
2. **Verificação de Modificação**: O editor compara o timestamp de última modificação (`lastModified`) do arquivo `.sysadl` de origem com o correspondente `.js` na pasta `./simulations/generated/`.
3. **Fluxo de Decisão**:
   * Se o `.js` existir e for mais recente que o `.sysadl`, o editor apenas lê o código JavaScript do disco (evitando re-executar o parser e o transformer).
   * Se o `.js` não existir ou estiver desatualizado, o editor realiza a transformação, grava o novo `.js` no sistema de arquivos local e prossegue para a execução.
4. **Carregamento para Execução**: Devido a restrições de segurança de sandbox (CORS/file://), o navegador não pode importar caminhos físicos diretamente via `import()`. Por isso, o editor lê a string de código do arquivo persistido em disco e a executa em memória via Blob URL.

```javascript
// Exemplo de verificação e caching de compilação no Editor
async function getOrCompileModel(sysadlFileHandle, simulationsDirHandle) {
    const sysadlFile = await sysadlFileHandle.getFile();
    const jsFileName = sysadlFile.name.replace('.sysadl', '.js');
    
    // Obtém acesso à subpasta 'generated' dentro de 'simulations'
    const generatedDirHandle = await simulationsDirHandle.getDirectoryHandle('generated', { create: true });
    
    let jsFileHandle;
    try {
        jsFileHandle = await generatedDirHandle.getFileHandle(jsFileName);
        const jsFile = await jsFileHandle.getFile();
        
        // Verifica se o JS existente é mais novo que a modificação do SysADL
        if (jsFile.lastModified >= sysadlFile.lastModified) {
            console.log("⚡ Cache hit: usando arquivo .js existente.");
            return await jsFile.text();
        }
    } catch (e) {
        // Arquivo .js não encontrado, prossegue para compilação
    }

    console.log("🔄 Cache miss ou desatualizado: compilando código SysADL...");
    const sysadlCode = await sysadlFile.text();
    const generatedJS = transformer.transform(sysadlCode);
    
    // Grava o arquivo .js fisicamente na pasta local do usuário
    jsFileHandle = await generatedDirHandle.getFileHandle(jsFileName, { create: true });
    const writable = await jsFileHandle.createWritable();
    await writable.write(generatedJS);
    await writable.close();
    
    return generatedJS;
}

// No Web Worker (Execução final)
const codeString = await getOrCompileModel(sysadlHandle, simulationsDirHandle);
const blob = new Blob([codeString], { type: 'application/javascript' });
const blobURL = URL.createObjectURL(blob);
const compiledModel = await import(blobURL);
```

### 3.3. Adaptação Orientada a Eventos no `SysADLSimulator.js`
O simulador atual escreve diretamente em `process.stdout` e utiliza dependências CLI.
* **Ajuste**: Introduzir ganchos de callback no construtor do `Simulator` ou usar um `EventEmitter` compartilhado para despachar eventos em vez de fazer `console.log`.
* **Lista de Eventos Recomendados**:
  * `simulation_start`: Início de toda a orquestração.
  * `scene_start`: Inicio da execução de uma cena (com detalhes de pre-conditions).
  * `scene_complete`: Término da cena (com status de pre/post conditions: `pass` ou `fail`).
  * `signal_fired`: Sinal emitido por um componente e seu destino.
  * `simulation_end`: Finalização do plano de execução.

---

## 4. Integração Visual no Editor React

O editor React (Projeto B) utiliza as mensagens do Web Worker para renderizar as informações na tela sem precisar de console.

### 4.1. Visualização JUnit (Árvore de Testes)
1. O React recebe a lista de cenários da AST gerada pelo parser.
2. Renderiza uma árvore colapsável lateral contendo os cenários e suas respectivas cenas.
3. À medida que os eventos `scene_start` e `scene_complete` chegam do Web Worker, o React atualiza o estado do componente correspondente para exibir um spinner, um check verde (`✅ PASS`) ou uma cruz vermelha (`❌ FAIL`).

### 4.2. Feedback no React Flow (Animação)
1. Quando o Worker emitir o evento `signal_fired`, ele enviará metadados contendo os componentes de origem e destino envolvidos.
2. O React Flow mapeia esses nomes para as arestas (edges) que conectam os componentes.
3. O React temporariamente adiciona uma classe CSS animada na aresta correspondente para exibir o fluxo de dados em movimento.

### 4.3. Gravação de Logs no Sistema de Arquivos Local
Se o usuário abrir um diretório usando a **File System Access API** (`showDirectoryPicker()`):
1. O editor React manterá a referência do `FileSystemDirectoryHandle` da raiz do projeto.
2. Ao final da simulação, o React obtém o diretório `./simulations/logs` (criando a estrutura de pastas recursivamente se necessário).
3. Cria um arquivo de log (ex.: `simulation-report-1781295064574.jsonl`) dentro de `./simulations/logs/`.
4. Grava o JSON estruturado contendo a história de execução de forma nativa e silenciosa, mantendo todos os artefatos organizados sob o diretório principal `/simulations`.

### 4.4. Controle e Interrupção de Simulações (Loops Infinitos)
Para gerenciar o ciclo de vida de simulações contínuas (como o modo `loop;`), a interface do editor React deve fornecer botões de controle (`Play`, `Pause`, `Stop`).
* **Pausa e Resumo**: Realizados via envio de mensagens (`postMessage`) para o Web Worker, que chama `model.pauseSimulation()` / `model.resumeSimulation()` cooperativamente.
* **Parada Imediata (Hard Stop)**: Em loops infinitos (`while (true)`), chamadas de stop lógicas podem não interromper o loop a tempo na thread. Por isso, a parada definitiva é feita encerrando o Web Worker:
  1. O componente React executa `worker.terminate()`, matando o processo em background na hora e liberando os recursos de CPU da máquina do usuário.
  2. A interface visual atualiza o estado de execução para `stopped`.
  3. Para uma nova simulação, o React simplesmente instancia um novo Worker.
