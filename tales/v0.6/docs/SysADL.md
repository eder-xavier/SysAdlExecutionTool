O que é a SysADL?

A SysADL (Systems Architecture Description Language) é uma Linguagem de Descrição de Arquitetura baseada no padrão OMG SysML, projetada para projetar e executar modelos arquiteturais de software. Ela utiliza o conceito de viewpoints (pontos de vista) para separar preocupações, descrevendo formalmente a estrutura, o comportamento e a execução do sistema. Recentemente, a linguagem foi estendida com os novos viewpoints de Ambiente (Environment) e Cenários (Scenario) para isolar o sistema computacional de seus testes e do mundo físico circundante.

1. Viewpoints Clássicos e seus Elementos

1.1 Structural Viewpoint (Visão Estrutural) Define a topologia estática da arquitetura.

Components (component def): Unidades computacionais da arquitetura. Podem ser atômicos ou compostos. Os Boundary Components (boundary component def) são componentes de fronteira que interagem diretamente com o ambiente externo, sem revelar comportamento interno observável.

Ports (port def): Pontos de interação de componentes e conectores. Podem ser portas simples (com fluxo in ou out) ou portas compostas.

Connectors (connector def): Intermedeiam a comunicação entre portas. O fluxo de dados especifica a direção, tipicamente indo do participante source para o destination.

Configurations (configuration): O bloco interno de componentes compostos ou da arquitetura raiz (architecture def) que define instâncias de componentes (components), conectores e suas amarrações através do comando bind (ex: bind portaA to portaB) e repasses através de delegations.

1.2 Behavioral Viewpoint (Visão Comportamental) Descreve o comportamento através de fluxos contínuos e atômicos.

Activities (activity def): Orquestram o fluxo geral com uma semântica de fluxo de dados (a atividade inicia quando todos os seus parâmetros de entrada recebem dados). Seu corpo (body { }) pode misturar livremente declarações de variáveis de dados (datastore, databuffer), fluxos lógicos (flow from X to Y) e delegações (delegate), delegando tarefas a ações internas.

Actions (action def): Unidades atômicas de execução (semântica start-stop). Executam do início ao fim sem interrupção.

Protocols (protocol): Definem máquinas de estado que regem as portas, controlando o comportamento dinâmico através das palavras-chave always (sempre), several (várias vezes), once (uma vez) e perhaps (talvez) combinadas com comandos send e receive.

Constraints (constraint): Regras matemáticas/lógicas descritas através de equações (equation = ...) ou condições de contorno (pre-condition, post-condition ou invariant), essenciais para definir o que uma ação faz.

1.3 Executable Viewpoint (Visão Executável) Fornece o código e os tipos de dados necessários para simular a arquitetura.

Types: Suporta declarações primitivas e complexas, incluindo datatype (com múltiplos atributos), enum, valuetype, dimension e unit.

Executables (executable def): Implementação algorítmica das actions. Aceitam construções como blocos de repetição (for, while, do ... while), decisões lógicas (if ... else, switch ... case), declarações de variáveis (let), invocações, incrementos e o operador ternário condicional (condição ? true : false).

2. Novos Viewpoints de Validação e Ambiente

2.1 Environment Viewpoint Modela o mundo físico e o isola da lógica do software.
Elementos Físicos: Usa EnvComponent, EnvPort e EnvConnector para instanciar o mundo físico (ex: motores, sensores, esteiras).

Decoração de Fronteira: Os componentes estruturais definidos como boundary são "reabertos" neste viewpoint para a injeção de portas de ambiente (envPorts), fazendo a ponte segura entre as interfaces estruturais de software e os estímulos físicos.

EnvironmentConfigurations: Orquestra a montagem dessas instâncias, conectando o software ao modelo de ambiente através de envDelegations e ligações de portas ambientais.

2.2 Scenario Viewpoint Provê um orquestrador de execução para validação formal por simulação.

Sinais e Tarefas Ambientais: signal def descreve estímulos e mensagens assíncronas; EnvAction descreve tarefas simuladas pelo ambiente.

EnvActivitiesDefinitions: Orquestra a lógica temporal através de blocos EnvActivity, usando um sistema reativo robusto estruturado com gatilhos de captura (ON sinal), execução e atribuições opcionais de variáveis (THEN) e disparos opcionais de próximos sinais (SEND sinal).

Contratos de Verificação (SceneDefinitions): Cenas (scene def) definem contratos estritos contendo condições de início/fim (start / finish) validando se o sistema reage corretamente do estado precondition até a postcondition.

ScenarioExecution: É o "motor" (engine) que coloca tudo em funcionamento. Permite configurar o modo da execução (mode: once, loop, etc.), injetar sinais com delays temporais (inject sinal after 45;), atribuir dados contextuais e chamar cenários de testes encadeados, inclusive concorrentemente via blocos parallel { }.

3. Integração (Allocations) e Sintaxe (AST)
Allocations: Todos os elementos dos viewpoints de comportamento e execução precisam ser alocados aos nós arquiteturais corretos na tabela de allocations. O lado esquerdo define a tipologia da função (activity, envactivity, executable) e o lado direito repassa o componente alvo ou ação usando apenas o seu nome qualificado semântico. O parser aceita variações case-insensitive no tipo de alocação (ex: suporta tanto envactivity, EnvActivity, quanto envActivity).

Dicas de Parsing/Sintaxe (Para IA):

No corpo das Atividades (ActivityBody), a declaração de conectores lógicos, fluxos, objetos de dados e delegações não depende de ordem estrita.
Se for necessário criar nomes de atributos que coincidam com palavras reservadas (ex: value), deve-se aplicar o caractere de escape do Xtext ^ antes da palavra (ex: ^value), o qual é abstraído pelo parser.
A gramática entende nativamente números reais com notação científica (EFloat) bem como permite blocos de comentários flexíveis (/ * * /).