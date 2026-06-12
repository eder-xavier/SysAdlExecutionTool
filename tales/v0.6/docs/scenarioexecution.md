The Mechanics of Scenario Execution (ScenarioExecution)

• Semantics: The ScenarioExecution orchestrator dictates the precise rules of how
tests will occur in the architecture, guiding the overall lifecycle of the simulation
through reactive state monitoring.
• Syntax: It is declared using the ScenarioExecution <Name> to <ScenarioDefinitions>
keywords, providing orchestration through three main mechanisms:

1. Execution Modes: Dictate the lifecycle of the entire plan:
• once: executes once (default).
• loop: executes in an infinite loop.
• loop: N: executes N times.
• loop: while <condition>: executes while the condition is true.

2. Concurrency and Loops: Architects can group scenarios dynamically using
constructs like repeat N <scenario> or parallel { <scenario1>; <scenario2> },
which is vital for testing concurrent operations in distributed physical units.

3. Event Injections: Allows the controlled introduction of external stimuli or
failures during execution. The syntax options include:
• inject <Signal> immediate: Forces the stimulus at the exact start of the simu-
lation.
• inject <Signal> after <time-in-seconds>: Introduces a stimulus based on
strict chronological delays.
• inject <Signal> after/before <task/scene>: Anchors the event to the com-
pletion of another architectural action.
• inject <Signal> when <condition>: Triggers the stimulus reactively when the
environment reaches a specific logical state