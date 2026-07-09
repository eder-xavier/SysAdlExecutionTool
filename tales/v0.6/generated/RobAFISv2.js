
const { Model, Component, Port, SimplePort, CompositePort, Connector, Activity, Action, Enum, Int, Boolean, String, Real, Void, valueType, dataType, dimension, unit, Constraint, Executable } = require('../sysadl-framework/SysADLBase');

// Types
const EN_PieceColor = new Enum("Blue", "Red", "None");
const EN_MissionParameter = new Enum("P0", "P1");
const EN_StrategyParameter = new Enum("T_First", "SPE_First");
const EN_MotorCommand = new Enum("On", "Off");
const EN_Direction = new Enum("Forward", "Left", "Right", "SoftLeft", "SoftRight", "Stop");
const EN_NavColor = new Enum("Black", "Green", "Red", "None");
const DT_MissionConfig = dataType('MissionConfig', { mission: EN_MissionParameter, strategy: EN_StrategyParameter });
const DT_RobotCommands = dataType('RobotCommands', { dir: EN_Direction, grab: EN_MotorCommand });
const types = {
  PieceColor: EN_PieceColor,
  MissionParameter: EN_MissionParameter,
  StrategyParameter: EN_StrategyParameter,
  MotorCommand: EN_MotorCommand,
  Direction: EN_Direction,
  NavColor: EN_NavColor,
  MissionConfig: DT_MissionConfig,
  RobotCommands: DT_RobotCommands
};

// Ports
class PT_SysADL_Ports_ParameterIPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "MissionParameter" }, ...opts });
  }
}
class PT_SysADL_Ports_ParameterOPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "out", { ...{ expectedType: "MissionParameter" }, ...opts });
  }
}
class PT_SysADL_Ports_StrategyIPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "StrategyParameter" }, ...opts });
  }
}
class PT_SysADL_Ports_StrategyOPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "out", { ...{ expectedType: "StrategyParameter" }, ...opts });
  }
}
class PT_SysADL_Ports_PieceColorIPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "PieceColor" }, ...opts });
  }
}
class PT_SysADL_Ports_PieceColorOPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "out", { ...{ expectedType: "PieceColor" }, ...opts });
  }
}
class PT_SysADL_Ports_BooleanIPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "Boolean" }, ...opts });
  }
}
class PT_SysADL_Ports_BooleanOPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "out", { ...{ expectedType: "Boolean" }, ...opts });
  }
}
class PT_SysADL_Ports_DirectionIPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "Direction" }, ...opts });
  }
}
class PT_SysADL_Ports_DirectionOPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "out", { ...{ expectedType: "Direction" }, ...opts });
  }
}
class PT_SysADL_Ports_CommandIPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "MotorCommand" }, ...opts });
  }
}
class PT_SysADL_Ports_CommandOPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "out", { ...{ expectedType: "MotorCommand" }, ...opts });
  }
}
class PT_SysADL_Ports_IntIPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "Int" }, ...opts });
  }
}
class PT_SysADL_Ports_IntOPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "out", { ...{ expectedType: "Int" }, ...opts });
  }
}
class PT_SysADL_Ports_NavColorIPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "NavColor" }, ...opts });
  }
}
class PT_SysADL_Ports_NavColorOPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "out", { ...{ expectedType: "NavColor" }, ...opts });
  }
}
class PT_SysADL_Ports_MissionConfigIPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "MissionConfig" }, ...opts });
  }
}
class PT_SysADL_Ports_MissionConfigOPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "out", { ...{ expectedType: "MissionConfig" }, ...opts });
  }
}
class PT_EnvPortsRobAFIS_InPieceColor extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "PieceColor" }, ...opts });
  }
}
class PT_EnvPortsRobAFIS_OutPieceColor extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "PieceColor" }, ...opts });
  }
}
class PT_EnvPortsRobAFIS_InNavColor extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "NavColor" }, ...opts });
  }
}
class PT_EnvPortsRobAFIS_OutNavColor extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "NavColor" }, ...opts });
  }
}
class PT_EnvPortsRobAFIS_InBoolean extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "Boolean" }, ...opts });
  }
}
class PT_EnvPortsRobAFIS_OutBoolean extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "Boolean" }, ...opts });
  }
}
class PT_EnvPortsRobAFIS_InParameter extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "MissionParameter" }, ...opts });
  }
}
class PT_EnvPortsRobAFIS_OutParameter extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "MissionParameter" }, ...opts });
  }
}
class PT_EnvPortsRobAFIS_InStrategy extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "StrategyParameter" }, ...opts });
  }
}
class PT_EnvPortsRobAFIS_OutStrategy extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "StrategyParameter" }, ...opts });
  }
}
class PT_EnvPortsRobAFIS_InMotorCommand extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "MotorCommand" }, ...opts });
  }
}
class PT_EnvPortsRobAFIS_OutMotorCommand extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "MotorCommand" }, ...opts });
  }
}
class PT_EnvPortsRobAFIS_InDirection extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "Direction" }, ...opts });
  }
}
class PT_EnvPortsRobAFIS_OutDirection extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "Direction" }, ...opts });
  }
}
class PT_EnvPortsRobAFIS_InInt extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "Int" }, ...opts });
  }
}
class PT_EnvPortsRobAFIS_OutInt extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "Int" }, ...opts });
  }
}
class PT_EnvPortsRobAFIS_InPresence extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "Boolean" }, ...opts });
  }
}
class PT_EnvPortsRobAFIS_OutPresence extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "Boolean" }, ...opts });
  }
}

// Connectors
class CN_SysADL_Connectors_ParamCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        outP: {
          portClass: 'PT_SysADL_Ports_ParameterOPT',
          direction: 'out',
          dataType: 'MissionParameter',
          role: 'source'
        },
        inP: {
          portClass: 'PT_SysADL_Ports_ParameterIPT',
          direction: 'out',
          dataType: 'MissionParameter',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outP',
          to: 'inP',
          dataType: 'MissionParameter'
        }
      ]
    });
  }
}
class CN_SysADL_Connectors_StrategyCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        outS: {
          portClass: 'PT_SysADL_Ports_StrategyOPT',
          direction: 'out',
          dataType: 'StrategyParameter',
          role: 'source'
        },
        inS: {
          portClass: 'PT_SysADL_Ports_StrategyIPT',
          direction: 'out',
          dataType: 'StrategyParameter',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outS',
          to: 'inS',
          dataType: 'StrategyParameter'
        }
      ]
    });
  }
}
class CN_SysADL_Connectors_PieceColorCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        outC: {
          portClass: 'PT_SysADL_Ports_PieceColorOPT',
          direction: 'out',
          dataType: 'PieceColor',
          role: 'source'
        },
        inC: {
          portClass: 'PT_SysADL_Ports_PieceColorIPT',
          direction: 'out',
          dataType: 'PieceColor',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outC',
          to: 'inC',
          dataType: 'PieceColor'
        }
      ]
    });
  }
}
class CN_SysADL_Connectors_BooleanCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        outB: {
          portClass: 'PT_SysADL_Ports_BooleanOPT',
          direction: 'out',
          dataType: 'Boolean',
          role: 'source'
        },
        inB: {
          portClass: 'PT_SysADL_Ports_BooleanIPT',
          direction: 'out',
          dataType: 'Boolean',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outB',
          to: 'inB',
          dataType: 'Boolean'
        }
      ]
    });
  }
}
class CN_SysADL_Connectors_DirectionCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        outD: {
          portClass: 'PT_SysADL_Ports_DirectionOPT',
          direction: 'out',
          dataType: 'Direction',
          role: 'source'
        },
        inD: {
          portClass: 'PT_SysADL_Ports_DirectionIPT',
          direction: 'out',
          dataType: 'Direction',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outD',
          to: 'inD',
          dataType: 'Direction'
        }
      ]
    });
  }
}
class CN_SysADL_Connectors_CommandCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        outC: {
          portClass: 'PT_SysADL_Ports_CommandOPT',
          direction: 'out',
          dataType: 'MotorCommand',
          role: 'source'
        },
        inC: {
          portClass: 'PT_SysADL_Ports_CommandIPT',
          direction: 'out',
          dataType: 'MotorCommand',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outC',
          to: 'inC',
          dataType: 'MotorCommand'
        }
      ]
    });
  }
}
class CN_SysADL_Connectors_IntCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        outI: {
          portClass: 'PT_SysADL_Ports_IntOPT',
          direction: 'out',
          dataType: 'Int',
          role: 'source'
        },
        inI: {
          portClass: 'PT_SysADL_Ports_IntIPT',
          direction: 'out',
          dataType: 'Int',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outI',
          to: 'inI',
          dataType: 'Int'
        }
      ]
    });
  }
}
class CN_SysADL_Connectors_NavColorCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        outN: {
          portClass: 'PT_SysADL_Ports_NavColorOPT',
          direction: 'out',
          dataType: 'NavColor',
          role: 'source'
        },
        inN: {
          portClass: 'PT_SysADL_Ports_NavColorIPT',
          direction: 'out',
          dataType: 'NavColor',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outN',
          to: 'inN',
          dataType: 'NavColor'
        }
      ]
    });
  }
}
class CN_SysADL_Connectors_MissionConfigCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        outMC: {
          portClass: 'PT_SysADL_Ports_MissionConfigOPT',
          direction: 'out',
          dataType: 'MissionConfig',
          role: 'source'
        },
        inMC: {
          portClass: 'PT_SysADL_Ports_MissionConfigIPT',
          direction: 'out',
          dataType: 'MissionConfig',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outMC',
          to: 'inMC',
          dataType: 'MissionConfig'
        }
      ]
    });
  }
}
class CN_EnvConnectorsRobAFIS_PieceColorEnvCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        outColor: {
          portClass: 'PT_EnvPortsRobAFIS_OutPieceColor',
          direction: 'out',
          dataType: 'PieceColor',
          role: 'source'
        },
        inColor: {
          portClass: 'PT_EnvPortsRobAFIS_InPieceColor',
          direction: 'out',
          dataType: 'PieceColor',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outColor',
          to: 'inColor',
          dataType: 'PieceColor'
        }
      ]
    });
  }
}
class CN_EnvConnectorsRobAFIS_NavColorEnvCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        outColor: {
          portClass: 'PT_EnvPortsRobAFIS_OutNavColor',
          direction: 'out',
          dataType: 'NavColor',
          role: 'source'
        },
        inColor: {
          portClass: 'PT_EnvPortsRobAFIS_InNavColor',
          direction: 'out',
          dataType: 'NavColor',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outColor',
          to: 'inColor',
          dataType: 'NavColor'
        }
      ]
    });
  }
}
class CN_EnvConnectorsRobAFIS_BooleanEnvCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        outB: {
          portClass: 'PT_EnvPortsRobAFIS_OutBoolean',
          direction: 'out',
          dataType: 'Boolean',
          role: 'source'
        },
        inB: {
          portClass: 'PT_EnvPortsRobAFIS_InBoolean',
          direction: 'out',
          dataType: 'Boolean',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outB',
          to: 'inB',
          dataType: 'Boolean'
        }
      ]
    });
  }
}
class CN_EnvConnectorsRobAFIS_ParamEnvCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        outP: {
          portClass: 'PT_EnvPortsRobAFIS_OutParameter',
          direction: 'out',
          dataType: 'MissionParameter',
          role: 'source'
        },
        inP: {
          portClass: 'PT_EnvPortsRobAFIS_InParameter',
          direction: 'out',
          dataType: 'MissionParameter',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outP',
          to: 'inP',
          dataType: 'MissionParameter'
        }
      ]
    });
  }
}
class CN_EnvConnectorsRobAFIS_StrategyEnvCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        outS: {
          portClass: 'PT_EnvPortsRobAFIS_OutStrategy',
          direction: 'out',
          dataType: 'StrategyParameter',
          role: 'source'
        },
        inS: {
          portClass: 'PT_EnvPortsRobAFIS_InStrategy',
          direction: 'out',
          dataType: 'StrategyParameter',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outS',
          to: 'inS',
          dataType: 'StrategyParameter'
        }
      ]
    });
  }
}
class CN_EnvConnectorsRobAFIS_DirectionEnvCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        outD: {
          portClass: 'PT_EnvPortsRobAFIS_OutDirection',
          direction: 'out',
          dataType: 'Direction',
          role: 'source'
        },
        inD: {
          portClass: 'PT_EnvPortsRobAFIS_InDirection',
          direction: 'out',
          dataType: 'Direction',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outD',
          to: 'inD',
          dataType: 'Direction'
        }
      ]
    });
  }
}
class CN_EnvConnectorsRobAFIS_MotorCommandEnvCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        outC: {
          portClass: 'PT_EnvPortsRobAFIS_OutMotorCommand',
          direction: 'out',
          dataType: 'MotorCommand',
          role: 'source'
        },
        inC: {
          portClass: 'PT_EnvPortsRobAFIS_InMotorCommand',
          direction: 'out',
          dataType: 'MotorCommand',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outC',
          to: 'inC',
          dataType: 'MotorCommand'
        }
      ]
    });
  }
}
class CN_EnvConnectorsRobAFIS_IntEnvCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        outI: {
          portClass: 'PT_EnvPortsRobAFIS_OutInt',
          direction: 'out',
          dataType: 'Int',
          role: 'source'
        },
        inI: {
          portClass: 'PT_EnvPortsRobAFIS_InInt',
          direction: 'out',
          dataType: 'Int',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outI',
          to: 'inI',
          dataType: 'Int'
        }
      ]
    });
  }
}
class CN_EnvConnectorsRobAFIS_ReadPresenceEnvCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        outPresence: {
          portClass: 'PT_EnvPortsRobAFIS_OutPresence',
          direction: 'out',
          dataType: 'Boolean',
          role: 'source'
        },
        inPresence: {
          portClass: 'PT_EnvPortsRobAFIS_InPresence',
          direction: 'out',
          dataType: 'Boolean',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outPresence',
          to: 'inPresence',
          dataType: 'Boolean'
        }
      ]
    });
  }
}
class CN_EnvConnectorsRobAFIS_ReadPieceColorEnvCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        outColor: {
          portClass: 'PT_EnvPortsRobAFIS_OutPieceColor',
          direction: 'out',
          dataType: 'PieceColor',
          role: 'source'
        },
        inColor: {
          portClass: 'PT_EnvPortsRobAFIS_InPieceColor',
          direction: 'out',
          dataType: 'PieceColor',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outColor',
          to: 'inColor',
          dataType: 'PieceColor'
        }
      ]
    });
  }
}
class CN_EnvConnectorsRobAFIS_DetectPieceColorEnvCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        outColor: {
          portClass: 'PT_EnvPortsRobAFIS_OutPieceColor',
          direction: 'out',
          dataType: 'PieceColor',
          role: 'source'
        },
        inColor: {
          portClass: 'PT_EnvPortsRobAFIS_InPieceColor',
          direction: 'out',
          dataType: 'PieceColor',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outColor',
          to: 'inColor',
          dataType: 'PieceColor'
        }
      ]
    });
  }
}
class CN_EnvConnectorsRobAFIS_DetectParameterEnvCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        outParam: {
          portClass: 'PT_EnvPortsRobAFIS_OutParameter',
          direction: 'out',
          dataType: 'MissionParameter',
          role: 'source'
        },
        inParam: {
          portClass: 'PT_EnvPortsRobAFIS_InParameter',
          direction: 'out',
          dataType: 'MissionParameter',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outParam',
          to: 'inParam',
          dataType: 'MissionParameter'
        }
      ]
    });
  }
}
class CN_EnvConnectorsRobAFIS_ReadParameterEnvCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        outParam: {
          portClass: 'PT_EnvPortsRobAFIS_OutParameter',
          direction: 'out',
          dataType: 'MissionParameter',
          role: 'source'
        },
        inParam: {
          portClass: 'PT_EnvPortsRobAFIS_InParameter',
          direction: 'out',
          dataType: 'MissionParameter',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outParam',
          to: 'inParam',
          dataType: 'MissionParameter'
        }
      ]
    });
  }
}
class CN_EnvConnectorsRobAFIS_SendMotorCommandEnvCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        outCommand: {
          portClass: 'PT_EnvPortsRobAFIS_OutMotorCommand',
          direction: 'out',
          dataType: 'MotorCommand',
          role: 'source'
        },
        inCommand: {
          portClass: 'PT_EnvPortsRobAFIS_InMotorCommand',
          direction: 'out',
          dataType: 'MotorCommand',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outCommand',
          to: 'inCommand',
          dataType: 'MotorCommand'
        }
      ]
    });
  }
}
class CN_EnvConnectorsRobAFIS_SendEnvironmentalDirectionEnvCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        outColor: {
          portClass: 'PT_EnvPortsRobAFIS_OutNavColor',
          direction: 'out',
          dataType: 'NavColor',
          role: 'source'
        },
        inColor: {
          portClass: 'PT_EnvPortsRobAFIS_InNavColor',
          direction: 'out',
          dataType: 'NavColor',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outColor',
          to: 'inColor',
          dataType: 'NavColor'
        }
      ]
    });
  }
}
class CN_EnvConnectorsRobAFIS_SendPieceColorEnvCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        outColor: {
          portClass: 'PT_EnvPortsRobAFIS_OutPieceColor',
          direction: 'out',
          dataType: 'PieceColor',
          role: 'source'
        },
        inColor: {
          portClass: 'PT_EnvPortsRobAFIS_InPieceColor',
          direction: 'out',
          dataType: 'PieceColor',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outColor',
          to: 'inColor',
          dataType: 'PieceColor'
        }
      ]
    });
  }
}

// Components
class CP_SysADL_Components_MissionPlannerCP extends Component {
  constructor(name, opts={}) {
      super(name, opts);
      // Add ports from component definition
      const portAliases = opts.portAliases || {};
      const portName_planner_inParam = portAliases["planner_inParam"] || "planner_inParam";
      this.addPort(new PT_SysADL_Ports_ParameterIPT(portName_planner_inParam, { owner: name, originalName: "planner_inParam" }));
      const portName_planner_inStrategy = portAliases["planner_inStrategy"] || "planner_inStrategy";
      this.addPort(new PT_SysADL_Ports_StrategyIPT(portName_planner_inStrategy, { owner: name, originalName: "planner_inStrategy" }));
      const portName_planner_outConfig = portAliases["planner_outConfig"] || "planner_outConfig";
      this.addPort(new PT_SysADL_Ports_MissionConfigOPT(portName_planner_outConfig, { owner: name, originalName: "planner_outConfig" }));
    }
}
class CP_SysADL_Components_NavigatorCP extends Component {
  constructor(name, opts={}) {
      super(name, opts);
      // Add ports from component definition
      const portAliases = opts.portAliases || {};
      const portName_navigator_inFloorColor = portAliases["navigator_inFloorColor"] || "navigator_inFloorColor";
      this.addPort(new PT_SysADL_Ports_NavColorIPT(portName_navigator_inFloorColor, { owner: name, originalName: "navigator_inFloorColor" }));
      const portName_navigator_inLineOffset = portAliases["navigator_inLineOffset"] || "navigator_inLineOffset";
      this.addPort(new PT_SysADL_Ports_IntIPT(portName_navigator_inLineOffset, { owner: name, originalName: "navigator_inLineOffset" }));
      const portName_navigator_inZoneAlarm = portAliases["navigator_inZoneAlarm"] || "navigator_inZoneAlarm";
      this.addPort(new PT_SysADL_Ports_BooleanIPT(portName_navigator_inZoneAlarm, { owner: name, originalName: "navigator_inZoneAlarm" }));
      const portName_navigator_inObstacle = portAliases["navigator_inObstacle"] || "navigator_inObstacle";
      this.addPort(new PT_SysADL_Ports_BooleanIPT(portName_navigator_inObstacle, { owner: name, originalName: "navigator_inObstacle" }));
      const portName_navigator_inConfig = portAliases["navigator_inConfig"] || "navigator_inConfig";
      this.addPort(new PT_SysADL_Ports_MissionConfigIPT(portName_navigator_inConfig, { owner: name, originalName: "navigator_inConfig" }));
      const portName_navigator_outDir = portAliases["navigator_outDir"] || "navigator_outDir";
      this.addPort(new PT_SysADL_Ports_DirectionOPT(portName_navigator_outDir, { owner: name, originalName: "navigator_outDir" }));
    }
}
class CP_SysADL_Components_CargoHandlerCP extends Component {
  constructor(name, opts={}) {
      super(name, opts);
      // Add ports from component definition
      const portAliases = opts.portAliases || {};
      const portName_cargo_inPieceColor = portAliases["cargo_inPieceColor"] || "cargo_inPieceColor";
      this.addPort(new PT_SysADL_Ports_PieceColorIPT(portName_cargo_inPieceColor, { owner: name, originalName: "cargo_inPieceColor" }));
      const portName_cargo_inConfig = portAliases["cargo_inConfig"] || "cargo_inConfig";
      this.addPort(new PT_SysADL_Ports_MissionConfigIPT(portName_cargo_inConfig, { owner: name, originalName: "cargo_inConfig" }));
      const portName_cargo_outGrab = portAliases["cargo_outGrab"] || "cargo_outGrab";
      this.addPort(new PT_SysADL_Ports_CommandOPT(portName_cargo_outGrab, { owner: name, originalName: "cargo_outGrab" }));
    }
}
class CP_SysADL_Components_ParameterInputCP extends Component {
  constructor(name, opts={}) {
      super(name, { ...opts, isBoundary: true });
      // Add ports from component definition
      const portAliases = opts.portAliases || {};
      const portName_pOut = portAliases["pOut"] || "pOut";
      this.addPort(new PT_SysADL_Ports_ParameterOPT(portName_pOut, { owner: name, originalName: "pOut" }));
      const portName_strategyOut = portAliases["strategyOut"] || "strategyOut";
      this.addPort(new PT_SysADL_Ports_StrategyOPT(portName_strategyOut, { owner: name, originalName: "strategyOut" }));
    }
}
class CP_SysADL_Components_CameraSensorCP extends Component {
  constructor(name, opts={}) {
      super(name, { ...opts, isBoundary: true });
      // Add ports from component definition
      const portAliases = opts.portAliases || {};
      const portName_floorColorOut = portAliases["floorColorOut"] || "floorColorOut";
      this.addPort(new PT_SysADL_Ports_NavColorOPT(portName_floorColorOut, { owner: name, originalName: "floorColorOut" }));
      const portName_lineOffsetOut = portAliases["lineOffsetOut"] || "lineOffsetOut";
      this.addPort(new PT_SysADL_Ports_IntOPT(portName_lineOffsetOut, { owner: name, originalName: "lineOffsetOut" }));
      const portName_zoneAlarmOut = portAliases["zoneAlarmOut"] || "zoneAlarmOut";
      this.addPort(new PT_SysADL_Ports_BooleanOPT(portName_zoneAlarmOut, { owner: name, originalName: "zoneAlarmOut" }));
      const portName_pieceColorOut = portAliases["pieceColorOut"] || "pieceColorOut";
      this.addPort(new PT_SysADL_Ports_PieceColorOPT(portName_pieceColorOut, { owner: name, originalName: "pieceColorOut" }));
    }
}
class CP_SysADL_Components_ObstacleSensorCP extends Component {
  constructor(name, opts={}) {
      super(name, { ...opts, isBoundary: true });
      // Add ports from component definition
      const portAliases = opts.portAliases || {};
      const portName_obstacleOut = portAliases["obstacleOut"] || "obstacleOut";
      this.addPort(new PT_SysADL_Ports_BooleanOPT(portName_obstacleOut, { owner: name, originalName: "obstacleOut" }));
    }
}
class CP_SysADL_Components_DriveSystemCP extends Component {
  constructor(name, opts={}) {
      super(name, { ...opts, isBoundary: true });
      // Add ports from component definition
      const portAliases = opts.portAliases || {};
      const portName_dirIn = portAliases["dirIn"] || "dirIn";
      this.addPort(new PT_SysADL_Ports_DirectionIPT(portName_dirIn, { owner: name, originalName: "dirIn" }));
    }
}
class CP_SysADL_Components_GrabberCP extends Component {
  constructor(name, opts={}) {
      super(name, { ...opts, isBoundary: true });
      // Add ports from component definition
      const portAliases = opts.portAliases || {};
      const portName_cmdIn = portAliases["cmdIn"] || "cmdIn";
      this.addPort(new PT_SysADL_Ports_CommandIPT(portName_cmdIn, { owner: name, originalName: "cmdIn" }));
    }
}
class CP_SysADL_Components_RobAFISControllerCP extends Component {
  constructor(name, opts={}) {
      super(name, opts);
      // Add ports from component definition
      const portAliases = opts.portAliases || {};
      const portName_controller_inParam = portAliases["controller_inParam"] || "controller_inParam";
      this.addPort(new PT_SysADL_Ports_ParameterIPT(portName_controller_inParam, { owner: name, originalName: "controller_inParam" }));
      const portName_controller_inStrategy = portAliases["controller_inStrategy"] || "controller_inStrategy";
      this.addPort(new PT_SysADL_Ports_StrategyIPT(portName_controller_inStrategy, { owner: name, originalName: "controller_inStrategy" }));
      const portName_controller_inFloorColor = portAliases["controller_inFloorColor"] || "controller_inFloorColor";
      this.addPort(new PT_SysADL_Ports_NavColorIPT(portName_controller_inFloorColor, { owner: name, originalName: "controller_inFloorColor" }));
      const portName_controller_inLineOffset = portAliases["controller_inLineOffset"] || "controller_inLineOffset";
      this.addPort(new PT_SysADL_Ports_IntIPT(portName_controller_inLineOffset, { owner: name, originalName: "controller_inLineOffset" }));
      const portName_controller_inZoneAlarm = portAliases["controller_inZoneAlarm"] || "controller_inZoneAlarm";
      this.addPort(new PT_SysADL_Ports_BooleanIPT(portName_controller_inZoneAlarm, { owner: name, originalName: "controller_inZoneAlarm" }));
      const portName_controller_inObstacle = portAliases["controller_inObstacle"] || "controller_inObstacle";
      this.addPort(new PT_SysADL_Ports_BooleanIPT(portName_controller_inObstacle, { owner: name, originalName: "controller_inObstacle" }));
      const portName_controller_inPieceColor = portAliases["controller_inPieceColor"] || "controller_inPieceColor";
      this.addPort(new PT_SysADL_Ports_PieceColorIPT(portName_controller_inPieceColor, { owner: name, originalName: "controller_inPieceColor" }));
      const portName_controller_outDir = portAliases["controller_outDir"] || "controller_outDir";
      this.addPort(new PT_SysADL_Ports_DirectionOPT(portName_controller_outDir, { owner: name, originalName: "controller_outDir" }));
      const portName_controller_outGrab = portAliases["controller_outGrab"] || "controller_outGrab";
      this.addPort(new PT_SysADL_Ports_CommandOPT(portName_controller_outGrab, { owner: name, originalName: "controller_outGrab" }));
    }
}
class CP_SysADL_Components_RobAFISSystemCP extends Component { }

// ===== Behavioral Element Classes =====
// Activity class: MissionPlannerAC
class AC_SysADL_Behavior_MissionPlannerAC extends Activity {
  constructor(name, component = null, inputPorts = [], delegates = [], opts = {}) {
    super(name, component, inputPorts, delegates, {
      ...opts,
      inParameters: [{"name":"actParam","type":"MissionParameter","direction":"in"},{"name":"actStrategy","type":"StrategyParameter","direction":"in"}],
      outParameters: [{"name":"actConfig","type":"MissionConfig","direction":"out"}]
    });
  }
}

// Activity class: NavigatorAC
class AC_SysADL_Behavior_NavigatorAC extends Activity {
  constructor(name, component = null, inputPorts = [], delegates = [], opts = {}) {
    super(name, component, inputPorts, delegates, {
      ...opts,
      inParameters: [{"name":"actFloorColor","type":"NavColor","direction":"in"},{"name":"actLineOffset","type":"Int","direction":"in"},{"name":"actZoneAlarm","type":"Boolean","direction":"in"},{"name":"actObstacle","type":"Boolean","direction":"in"},{"name":"actConfig","type":"MissionConfig","direction":"in"}],
      outParameters: [{"name":"actDir","type":"Direction","direction":"out"}]
    });
  }
}

// Activity class: CargoHandlerAC
class AC_SysADL_Behavior_CargoHandlerAC extends Activity {
  constructor(name, component = null, inputPorts = [], delegates = [], opts = {}) {
    super(name, component, inputPorts, delegates, {
      ...opts,
      inParameters: [{"name":"actPieceColor","type":"PieceColor","direction":"in"},{"name":"actConfig","type":"MissionConfig","direction":"in"}],
      outParameters: [{"name":"actGrab","type":"MotorCommand","direction":"out"}]
    });
  }
}

// Activity class: ParameterInputAC
class AC_BoundaryBehavior_ParameterInputAC extends Activity {
  constructor(name, component = null, inputPorts = [], delegates = [], opts = {}) {
    super(name, component, inputPorts, delegates, {
      ...opts,
      inParameters: [{"name":"envParam","type":"MissionParameter","direction":"in"},{"name":"envStrategy","type":"StrategyParameter","direction":"in"}],
      outParameters: [{"name":"sysParam","type":"MissionParameter","direction":"out"},{"name":"sysStrategy","type":"StrategyParameter","direction":"out"}]
    });
  }
}

// Activity class: CameraSensorAC
class AC_BoundaryBehavior_CameraSensorAC extends Activity {
  constructor(name, component = null, inputPorts = [], delegates = [], opts = {}) {
    super(name, component, inputPorts, delegates, {
      ...opts,
      inParameters: [{"name":"envFloor","type":"NavColor","direction":"in"},{"name":"envOffset","type":"Int","direction":"in"},{"name":"envZone","type":"Boolean","direction":"in"},{"name":"envPiece","type":"PieceColor","direction":"in"}],
      outParameters: [{"name":"sysFloor","type":"NavColor","direction":"out"},{"name":"sysOffset","type":"Int","direction":"out"},{"name":"sysZone","type":"Boolean","direction":"out"},{"name":"sysPiece","type":"PieceColor","direction":"out"}]
    });
  }
}

// Activity class: ObstacleSensorAC
class AC_BoundaryBehavior_ObstacleSensorAC extends Activity {
  constructor(name, component = null, inputPorts = [], delegates = [], opts = {}) {
    super(name, component, inputPorts, delegates, {
      ...opts,
      inParameters: [{"name":"envObstacle","type":"Boolean","direction":"in"}],
      outParameters: [{"name":"sysObstacle","type":"Boolean","direction":"out"}]
    });
  }
}

// Activity class: DriveSystemAC
class AC_BoundaryBehavior_DriveSystemAC extends Activity {
  constructor(name, component = null, inputPorts = [], delegates = [], opts = {}) {
    super(name, component, inputPorts, delegates, {
      ...opts,
      inParameters: [{"name":"sysDir","type":"Direction","direction":"in"}],
      outParameters: [{"name":"envDir","type":"Direction","direction":"out"}]
    });
  }
}

// Activity class: GrabberAC
class AC_BoundaryBehavior_GrabberAC extends Activity {
  constructor(name, component = null, inputPorts = [], delegates = [], opts = {}) {
    super(name, component, inputPorts, delegates, {
      ...opts,
      inParameters: [{"name":"sysCmd","type":"MotorCommand","direction":"in"}],
      outParameters: [{"name":"envCmd","type":"MotorCommand","direction":"out"}]
    });
  }
}

// Activity class: OperatorEA
class AC_PkgScenarios_OperatorEA extends Activity {
  constructor(name, component = null, inputPorts = [], delegates = [], opts = {}) {
    super(name, component, inputPorts, delegates, {
      ...opts,
      inParameters: [],
      outParameters: [{"name":"opParamOut","type":"MissionParameter","direction":"out"},{"name":"opStratOut","type":"StrategyParameter","direction":"out"}]
    });
  }
}

// Activity class: UnitEA
class AC_PkgScenarios_UnitEA extends Activity {
  constructor(name, component = null, inputPorts = [], delegates = [], opts = {}) {
    super(name, component, inputPorts, delegates, {
      ...opts,
      inParameters: [{"name":"OpParam","type":"MissionParameter","direction":"in"},{"name":"OpStrategy","type":"StrategyParameter","direction":"in"},{"name":"LineOffset","type":"Int","direction":"in"},{"name":"Obstacle","type":"Boolean","direction":"in"},{"name":"ZoneAlarm","type":"Boolean","direction":"in"},{"name":"TPieceColor","type":"PieceColor","direction":"in"},{"name":"SPEPieceColor","type":"PieceColor","direction":"in"}],
      outParameters: [{"name":"UnitNavLine","type":"NavColor","direction":"out"},{"name":"UnitNavPad","type":"NavColor","direction":"out"},{"name":"UnitPieceColor","type":"PieceColor","direction":"out"},{"name":"SPEPieceColor","type":"PieceColor","direction":"out"},{"name":"UnitLineOffset","type":"Int","direction":"out"},{"name":"UnitZoneAlarm","type":"Boolean","direction":"out"},{"name":"UnitObstacle","type":"Boolean","direction":"out"}]
    });
  }
}

// Action class: ConfigureMissionAN
class AN_SysADL_Behavior_ConfigureMissionAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"paramIn","type":"MissionParameter","direction":"in"},{"name":"strategyIn","type":"StrategyParameter","direction":"in"}],
      outParameters: [{"name":"ConfigureMissionAN","type":"MissionConfig","direction":"out"}],
    });
  }
}

// Action class: DecideCommandAN
class AN_SysADL_Behavior_DecideCommandAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"decFloorColor","type":"NavColor","direction":"in"},{"name":"decOffset","type":"Int","direction":"in"},{"name":"decZoneAlarm","type":"Boolean","direction":"in"},{"name":"decObstacle","type":"Boolean","direction":"in"},{"name":"decConfig","type":"MissionConfig","direction":"in"}],
      outParameters: [{"name":"cmds","type":"RobotCommands","direction":"out"}],
    });
  }
}

// Action class: ExtractDirAN
class AN_SysADL_Behavior_ExtractDirAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"extDirCmd","type":"RobotCommands","direction":"in"}],
      outParameters: [{"name":"ExtractDirAN","type":"Direction","direction":"out"}],
    });
  }
}

// Action class: VerifyCargoAN
class AN_SysADL_Behavior_VerifyCargoAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"cargoPieceColor","type":"PieceColor","direction":"in"},{"name":"cargoConfig","type":"MissionConfig","direction":"in"}],
      outParameters: [{"name":"cmds","type":"RobotCommands","direction":"out"}],
    });
  }
}

// Action class: ExtractGrabAN
class AN_SysADL_Behavior_ExtractGrabAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"extGrabCmd","type":"RobotCommands","direction":"in"}],
      outParameters: [{"name":"cmds","type":"MotorCommand","direction":"out"}],
    });
  }
}

// Action class: PassBooleanAN
class AN_PkgScenarios_PassBooleanAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"boolIn","type":"Boolean","direction":"in"}],
      outParameters: [{"name":"PassBooleanAN","type":"Boolean","direction":"out"}],
    });
  }
}

// Action class: PassIntAN
class AN_PkgScenarios_PassIntAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"tIn","type":"Int","direction":"in"}],
      outParameters: [{"name":"PassIntAN","type":"Int","direction":"out"}],
    });
  }
}

// Action class: PassNavColorAN
class AN_PkgScenarios_PassNavColorAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"colorIn","type":"NavColor","direction":"in"}],
      outParameters: [{"name":"PassNavColorAN","type":"NavColor","direction":"out"}],
    });
  }
}

// Action class: PassPieceColorAN
class AN_PkgScenarios_PassPieceColorAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"pColorIn","type":"PieceColor","direction":"in"}],
      outParameters: [{"name":"PassPieceColorAN","type":"PieceColor","direction":"out"}],
    });
  }
}

// Action class: PassDirectionAN
class AN_BoundaryBehavior_PassDirectionAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"dirIn","type":"Direction","direction":"in"}],
      outParameters: [{"name":"PassDirectionAN","type":"Direction","direction":"out"}],
    });
  }
}

// Action class: PassMotorCommandAN
class AN_BoundaryBehavior_PassMotorCommandAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"cmdIn","type":"MotorCommand","direction":"in"}],
      outParameters: [{"name":"cmds","type":"MotorCommand","direction":"out"}],
    });
  }
}

// Action class: PassMissionParameterAN
class AN_PkgScenarios_PassMissionParameterAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"paramIn","type":"MissionParameter","direction":"in"}],
      outParameters: [{"name":"PassMissionParameterAN","type":"MissionParameter","direction":"out"}],
    });
  }
}

// Action class: PassStrategyParameterAN
class AN_PkgScenarios_PassStrategyParameterAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"strategyIn","type":"StrategyParameter","direction":"in"}],
      outParameters: [{"name":"PassStrategyParameterAN","type":"StrategyParameter","direction":"out"}],
    });
  }
}

// Action class: PassMissionParameterAN (skipped - duplicate of AN_PkgScenarios_PassMissionParameterAN)
// Action class: PassStrategyParameterAN (skipped - duplicate of AN_PkgScenarios_PassStrategyParameterAN)
// Action class: PassNavColorAN (skipped - duplicate of AN_PkgScenarios_PassNavColorAN)
// Action class: PassIntAN (skipped - duplicate of AN_PkgScenarios_PassIntAN)
// Action class: PassBooleanAN (skipped - duplicate of AN_PkgScenarios_PassBooleanAN)
// Action class: PassPieceColorAN (skipped - duplicate of AN_PkgScenarios_PassPieceColorAN)
// Executable class: ConfigureMissionEX
class EX_SysADL_Execution_ConfigureMissionEX extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"paramIn","type":"MissionParameter","direction":"in"},{"name":"strategyIn","type":"StrategyParameter","direction":"in"}],
      body: "executable def ConfigureMissionEX ( in paramIn : MissionParameter , in strategyIn : StrategyParameter ) : out MissionConfig {\n        let cfg : MissionConfig ;\n    \tcfg->mission = paramIn;\n    \tcfg->strategy = strategyIn;\n    \t\n        return cfg;\n    }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for paramIn: (auto-detected from usage)
          // Type validation for strategyIn: (auto-detected from usage)
          const { paramIn, strategyIn } = params;
          let cfg;
    	cfg.mission = paramIn;
    	cfg.strategy = strategyIn;
    	
        return cfg;
        }
    });
  }
}

// Executable class: DecideCommandEX
class EX_SysADL_Execution_DecideCommandEX extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"decFloorColor","type":"NavColor","direction":"in"},{"name":"decOffset","type":"Int","direction":"in"},{"name":"decZoneAlarm","type":"Boolean","direction":"in"},{"name":"decObstacle","type":"Boolean","direction":"in"},{"name":"decConfig","type":"MissionConfig","direction":"in"}],
      body: "executable def DecideCommandEX ( in decFloorColor : NavColor , in decOffset : Int , in decZoneAlarm : Boolean , in decObstacle : Boolean , in decConfig : MissionConfig ) : out RobotCommands {\n        let cmds : RobotCommands ;\n        \n        // 1. Zone Machine collision or intrusion safeguard\n        if (decObstacle == true) {\n            cmds->dir = Direction::Stop ;\n            cmds->grab = MotorCommand::Off ;\n            return cmds ;\n        }\n        \n        if (decZoneAlarm == true) {\n            cmds->dir = Direction::Stop ;\n            cmds->grab = MotorCommand::Off ;\n            return cmds ;\n        }\n\n        // 2. Proportional trajectory control logic\n        if (decOffset < (0 - 10)) {\n            cmds->dir = Direction::SoftLeft ;\n            cmds->grab = MotorCommand::Off ;\n            return cmds ;\n        }\n        \n        if (decOffset > 10) {\n            cmds->dir = Direction::SoftRight ;\n            cmds->grab = MotorCommand::Off ;\n            return cmds ;\n        }\n\n        // 3. Logic based on strategy and soil color\n        if (decConfig->strategy == StrategyParameter::SPE_First) {\n            if (decFloorColor == NavColor::Green) {\n                cmds->dir = Direction::Stop ;\n                cmds->grab = MotorCommand::Off ;\n                return cmds ;\n            }\n        }\n\n        if (decFloorColor == NavColor::Red) {\n            cmds->dir = Direction::Stop ;\n            cmds->grab = MotorCommand::Off ;\n            return cmds ;\n        }\n\n        // 4. Nominal rectilinear trajectory\n        cmds->dir = Direction::Forward ;\n        cmds->grab = MotorCommand::Off ;\n        return cmds ;\n    }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for decFloorColor: (auto-detected from usage)
          // Type validation for decOffset: (auto-detected from usage)
          // Type validation for decZoneAlarm: (auto-detected from usage)
          // Type validation for decObstacle: (auto-detected from usage)
          // Type validation for decConfig: (auto-detected from usage)
          const { decFloorColor, decOffset, decZoneAlarm, decObstacle, decConfig } = params;
          let cmds;
        
        // 1. Zone Machine collision or intrusion safeguard
        if (decObstacle == true) {
            cmds.dir = Direction.Stop ;
            cmds.grab = MotorCommand.Off ;
            return cmds ;
        }
        
        if (decZoneAlarm == true) {
            cmds.dir = Direction.Stop ;
            cmds.grab = MotorCommand.Off ;
            return cmds ;
        }

        // 2. Proportional trajectory control logic
        if (decOffset < (0 - 10)) {
            cmds.dir = Direction.SoftLeft ;
            cmds.grab = MotorCommand.Off ;
            return cmds ;
        }
        
        if (decOffset > 10) {
            cmds.dir = Direction.SoftRight ;
            cmds.grab = MotorCommand.Off ;
            return cmds ;
        }

        // 3. Logic based on strategy and soil color
        if (decConfig.strategy == StrategyParameter.SPE_First) {
            if (decFloorColor == NavColor.Green) {
                cmds.dir = Direction.Stop ;
                cmds.grab = MotorCommand.Off ;
                return cmds ;
            }
        }

        if (decFloorColor == NavColor.Red) {
            cmds.dir = Direction.Stop ;
            cmds.grab = MotorCommand.Off ;
            return cmds ;
        }

        // 4. Nominal rectilinear trajectory
        cmds.dir = Direction.Forward ;
        cmds.grab = MotorCommand.Off ;
        return cmds ;
        }
    });
  }
}

// Executable class: ExtractDirEX
class EX_SysADL_Execution_ExtractDirEX extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"extDirCmd","type":"RobotCommands","direction":"in"}],
      body: "executable def ExtractDirEX ( in extDirCmd : RobotCommands ) : out Direction {\n        return extDirCmd->dir ;\n    }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for extDirCmd: (auto-detected from usage)
          const { extDirCmd } = params;
          return extDirCmd.dir;
        }
    });
  }
}

// Executable class: VerifyCargoEX
class EX_SysADL_Execution_VerifyCargoEX extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"cargoPieceColor","type":"PieceColor","direction":"in"},{"name":"cargoConfig","type":"MissionConfig","direction":"in"}],
      body: "executable def VerifyCargoEX ( in cargoPieceColor : PieceColor , in cargoConfig : MissionConfig ) : out RobotCommands {\n        let cmds : RobotCommands ;\n        cmds->dir = Direction::Forward ;\n        \n        if (cargoPieceColor == PieceColor::Blue) {\n            cmds->grab = MotorCommand::On ;\n            return cmds ;\n        }\n        if (cargoPieceColor == PieceColor::Red) {\n            cmds->grab = MotorCommand::On ;\n            return cmds ;\n        }\n        cmds->grab = MotorCommand::Off ;\n        return cmds ;\n    }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for cargoPieceColor: (auto-detected from usage)
          // Type validation for cargoConfig: (auto-detected from usage)
          const { cargoPieceColor, cargoConfig } = params;
          let cmds;
        cmds.dir = Direction.Forward ;
        
        if (cargoPieceColor == PieceColor.Blue) {
            cmds.grab = MotorCommand.On ;
            return cmds ;
        }
        if (cargoPieceColor == PieceColor.Red) {
            cmds.grab = MotorCommand.On ;
            return cmds ;
        }
        cmds.grab = MotorCommand.Off ;
        return cmds ;
        }
    });
  }
}

// Executable class: ExtractGrabEX
class EX_SysADL_Execution_ExtractGrabEX extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"extGrabCmd","type":"RobotCommands","direction":"in"}],
      body: "executable def ExtractGrabEX ( in extGrabCmd : RobotCommands ) : out MotorCommand {\n        return extGrabCmd->grab ;\n    }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for extGrabCmd: (auto-detected from usage)
          const { extGrabCmd } = params;
          return extGrabCmd.grab;
        }
    });
  }
}

// Executable class: PassBooleanEX
class EX_BoundaryExecution_PassBooleanEX extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"boolIn","type":"Boolean","direction":"in"}],
      body: "executable def PassBooleanEX ( in boolIn : Boolean ) : out Boolean {\n        return boolIn ;\n    }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for boolIn: (auto-detected from usage)
          const { boolIn } = params;
          return boolIn;
        }
    });
  }
}

// Executable class: PassIntEX
class EX_BoundaryExecution_PassIntEX extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"intIn","type":"Int","direction":"in"}],
      body: "executable def PassIntEX ( in intIn : Int ) : out Int {\n        return intIn ;\n    }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for intIn: (auto-detected from usage)
          const { intIn } = params;
          return intIn;
        }
    });
  }
}

// Executable class: PassNavColorEX
class EX_BoundaryExecution_PassNavColorEX extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"colorIn","type":"NavColor","direction":"in"}],
      body: "executable def PassNavColorEX ( in colorIn : NavColor ) : out NavColor {\n        return colorIn ;\n    }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for colorIn: (auto-detected from usage)
          const { colorIn } = params;
          return colorIn;
        }
    });
  }
}

// Executable class: PassPieceColorEX
class EX_BoundaryExecution_PassPieceColorEX extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"pColorIn","type":"PieceColor","direction":"in"}],
      body: "executable def PassPieceColorEX ( in pColorIn : PieceColor ) : out PieceColor {\n        return pColorIn ;\n    }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for pColorIn: (auto-detected from usage)
          const { pColorIn } = params;
          return pColorIn;
        }
    });
  }
}

// Executable class: PassDirectionEX
class EX_BoundaryExecution_PassDirectionEX extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"dirIn","type":"Direction","direction":"in"}],
      body: "executable def PassDirectionEX ( in dirIn : Direction ) : out Direction {\n        return dirIn ;\n    }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for dirIn: (auto-detected from usage)
          const { dirIn } = params;
          return dirIn;
        }
    });
  }
}

// Executable class: PassMotorCommandEX
class EX_BoundaryExecution_PassMotorCommandEX extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"cmdIn","type":"MotorCommand","direction":"in"}],
      body: "executable def PassMotorCommandEX ( in cmdIn : MotorCommand ) : out MotorCommand {\n        return cmdIn ;\n    }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for cmdIn: (auto-detected from usage)
          const { cmdIn } = params;
          return cmdIn;
        }
    });
  }
}

// Executable class: PassMissionParameterEX
class EX_BoundaryExecution_PassMissionParameterEX extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"paramIn","type":"MissionParameter","direction":"in"}],
      body: "executable def PassMissionParameterEX ( in paramIn : MissionParameter ) : out MissionParameter {\n        return paramIn ;\n    }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for paramIn: (auto-detected from usage)
          const { paramIn } = params;
          return paramIn;
        }
    });
  }
}

// Executable class: PassStrategyParameterEX
class EX_BoundaryExecution_PassStrategyParameterEX extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"strategyIn","type":"StrategyParameter","direction":"in"}],
      body: "executable def PassStrategyParameterEX ( in strategyIn : StrategyParameter ) : out StrategyParameter {\n        return strategyIn ;\n    }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for strategyIn: (auto-detected from usage)
          const { strategyIn } = params;
          return strategyIn;
        }
    });
  }
}

// Executable class: MapDirectionToColorEX
class EX_BoundaryExecution_MapDirectionToColorEX extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"dirIn","type":"Direction","direction":"in"}],
      body: "executable def MapDirectionToColorEX ( in dirIn : Direction ) : out NavColor {\n        if (dirIn == Direction::Forward) {\n            return NavColor::Black ;\n        }\n        if (dirIn == Direction::Left) {\n            return NavColor::Green ;\n        }\n        if (dirIn == Direction::Right) {\n            return NavColor::Red ;\n        }\n        return NavColor::None ;\n    }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for dirIn: (auto-detected from usage)
          const { dirIn } = params;
          if (dirIn == Direction.Forward) {
            return NavColor.Black ;
        }
        if (dirIn == Direction.Left) {
            return NavColor.Green ;
        }
        if (dirIn == Direction.Right) {
            return NavColor.Red ;
        }
        return NavColor.None ;
        }
    });
  }
}

// ===== End Behavioral Element Classes =====

class SysADLModel extends Model {
  constructor(){
    super("SysADLModel");
    this.RobAFISSystemCP = new CP_SysADL_Components_RobAFISSystemCP("RobAFISSystemCP", { sysadlDefinition: "RobAFISSystemCP" });
    this.addComponent(this.RobAFISSystemCP);
    this.RobAFISSystemCP.camera = new CP_SysADL_Components_CameraSensorCP("camera", { isBoundary: true, sysadlDefinition: "CameraSensorCP", portAliases: {"floorColorOut":"floorColorOut","lineOffsetOut":"lineOffsetOut","zoneAlarmOut":"zoneAlarmOut","pieceColorOut":"pieceColorOut"} });
    this.RobAFISSystemCP.addComponent(this.RobAFISSystemCP.camera);
    this.RobAFISSystemCP.controller = new CP_SysADL_Components_RobAFISControllerCP("controller", { sysadlDefinition: "RobAFISControllerCP", portAliases: {"controller_inParam":"controller_inParam","controller_inStrategy":"controller_inStrategy","controller_inFloorColor":"controller_inFloorColor","controller_inLineOffset":"controller_inLineOffset","controller_inPieceColor":"controller_inPieceColor","controller_outDir":"controller_outDir","controller_outGrab":"controller_outGrab"} });
    this.RobAFISSystemCP.addComponent(this.RobAFISSystemCP.controller);
    this.RobAFISSystemCP.driveSys = new CP_SysADL_Components_DriveSystemCP("driveSys", { isBoundary: true, sysadlDefinition: "DriveSystemCP", portAliases: {"dirIn":"dirIn"} });
    this.RobAFISSystemCP.addComponent(this.RobAFISSystemCP.driveSys);
    this.RobAFISSystemCP.grabber = new CP_SysADL_Components_GrabberCP("grabber", { isBoundary: true, sysadlDefinition: "GrabberCP", portAliases: {"cmdIn":"cmdIn"} });
    this.RobAFISSystemCP.addComponent(this.RobAFISSystemCP.grabber);
    this.RobAFISSystemCP.obstacleSens = new CP_SysADL_Components_ObstacleSensorCP("obstacleSens", { isBoundary: true, sysadlDefinition: "ObstacleSensorCP", portAliases: {"obstacleOut":"obstacleOut"} });
    this.RobAFISSystemCP.addComponent(this.RobAFISSystemCP.obstacleSens);
    this.RobAFISSystemCP.pInput = new CP_SysADL_Components_ParameterInputCP("pInput", { isBoundary: true, sysadlDefinition: "ParameterInputCP", portAliases: {"pOut":"pOut","strategyOut":"strategyOut"} });
    this.RobAFISSystemCP.addComponent(this.RobAFISSystemCP.pInput);
    this.RobAFISSystemCP.controller.cargo = new CP_SysADL_Components_CargoHandlerCP("cargo", { sysadlDefinition: "CargoHandlerCP", portAliases: {"cargo_inPieceColor":"cargo_inPieceColor","cargo_inConfig":"cargo_inConfig","cargo_outGrab":"cargo_outGrab"} });
    this.RobAFISSystemCP.controller.addComponent(this.RobAFISSystemCP.controller.cargo);
    this.RobAFISSystemCP.controller.navigator = new CP_SysADL_Components_NavigatorCP("navigator", { sysadlDefinition: "NavigatorCP", portAliases: {"navigator_inFloorColor":"navigator_inFloorColor","navigator_inLineOffset":"navigator_inLineOffset","navigator_inConfig":"navigator_inConfig","navigator_outDir":"navigator_outDir"} });
    this.RobAFISSystemCP.controller.addComponent(this.RobAFISSystemCP.controller.navigator);
    this.RobAFISSystemCP.controller.planner = new CP_SysADL_Components_MissionPlannerCP("planner", { sysadlDefinition: "MissionPlannerCP", portAliases: {"planner_inParam":"planner_inParam","planner_inStrategy":"planner_inStrategy","planner_outConfig":"planner_outConfig"} });
    this.RobAFISSystemCP.controller.addComponent(this.RobAFISSystemCP.controller.planner);

    this.RobAFISSystemCP.controller.addConnector(new CN_SysADL_Connectors_MissionConfigCN("c_config1"));
    this.RobAFISSystemCP.controller.addConnector(new CN_SysADL_Connectors_MissionConfigCN("c_config2"));
    this.RobAFISSystemCP.addConnector(new CN_SysADL_Connectors_ParamCN("c1"));
    this.RobAFISSystemCP.addConnector(new CN_SysADL_Connectors_StrategyCN("c2"));
    this.RobAFISSystemCP.addConnector(new CN_SysADL_Connectors_NavColorCN("c3"));
    this.RobAFISSystemCP.addConnector(new CN_SysADL_Connectors_IntCN("c4"));
    this.RobAFISSystemCP.addConnector(new CN_SysADL_Connectors_BooleanCN("c5"));
    this.RobAFISSystemCP.addConnector(new CN_SysADL_Connectors_BooleanCN("c6"));
    this.RobAFISSystemCP.addConnector(new CN_SysADL_Connectors_PieceColorCN("c7"));
    this.RobAFISSystemCP.addConnector(new CN_SysADL_Connectors_DirectionCN("c8"));
    this.RobAFISSystemCP.addConnector(new CN_SysADL_Connectors_CommandCN("c9"));
    try { this.RobAFISSystemCP.connectors["c9"].activityName = "DecideCommandAC"; } catch(e) {}

    const ac_planner = new AC_SysADL_Behavior_MissionPlannerAC(
      "MissionPlannerAC",
      "RobAFISSystemCP.controller.planner",
      ["planner_inParam"],
      [{"from":"actParam","to":"paramIn"},{"from":"actStrategy","to":"strategyIn"},{"from":"actConfig","to":"configAct"}],
      {"outParameters":[{"name":"actParam","type":"Real","direction":"out"},{"name":"actStrategy","type":"Real","direction":"out"},{"name":"actConfig","type":"Real","direction":"out"}]}
    );
    try { ac_planner.portToPinMapping["paramIn"] = "actParam"; } catch(e) {}
    try { ac_planner.portToPinMapping["paramin"] = "actParam"; } catch(e) {}
    try { ac_planner.portToPinMapping["strategyIn"] = "actStrategy"; } catch(e) {}
    try { ac_planner.portToPinMapping["strategyin"] = "actStrategy"; } catch(e) {}
    try { ac_planner.portToPinMapping["configAct"] = "actConfig"; } catch(e) {}
    try { ac_planner.portToPinMapping["configact"] = "actConfig"; } catch(e) {}
    this.registerActivity("MissionPlannerAC", ac_planner);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.controller.planner"] = ac_planner; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.controller.planner"] = ac_planner; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["controller.planner"] = ac_planner; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["planner"] = ac_planner; } catch(e) {}
    const ac_navigator = new AC_SysADL_Behavior_NavigatorAC(
      "NavigatorAC",
      "RobAFISSystemCP.controller.navigator",
      ["navigator_inFloorColor"],
      [{"from":"actFloorColor","to":"decFloorColor"},{"from":"actLineOffset","to":"decOffset"},{"from":"actZoneAlarm","to":"decZoneAlarm"},{"from":"actObstacle","to":"decObstacle"},{"from":"actConfig","to":"decConfig"},{"from":"actDir","to":"extDirAct"}],
      {"outParameters":[{"name":"actFloorColor","type":"Real","direction":"out"},{"name":"actLineOffset","type":"Real","direction":"out"},{"name":"actZoneAlarm","type":"Real","direction":"out"},{"name":"actObstacle","type":"Real","direction":"out"},{"name":"actConfig","type":"Real","direction":"out"},{"name":"actDir","type":"Real","direction":"out"}]}
    );
    try { ac_navigator.portToPinMapping["decFloorColor"] = "actFloorColor"; } catch(e) {}
    try { ac_navigator.portToPinMapping["decfloorcolor"] = "actFloorColor"; } catch(e) {}
    try { ac_navigator.portToPinMapping["decOffset"] = "actLineOffset"; } catch(e) {}
    try { ac_navigator.portToPinMapping["decoffset"] = "actLineOffset"; } catch(e) {}
    try { ac_navigator.portToPinMapping["decZoneAlarm"] = "actZoneAlarm"; } catch(e) {}
    try { ac_navigator.portToPinMapping["deczonealarm"] = "actZoneAlarm"; } catch(e) {}
    try { ac_navigator.portToPinMapping["decObstacle"] = "actObstacle"; } catch(e) {}
    try { ac_navigator.portToPinMapping["decobstacle"] = "actObstacle"; } catch(e) {}
    try { ac_navigator.portToPinMapping["decConfig"] = "actConfig"; } catch(e) {}
    try { ac_navigator.portToPinMapping["decconfig"] = "actConfig"; } catch(e) {}
    try { ac_navigator.portToPinMapping["extDirAct"] = "actDir"; } catch(e) {}
    try { ac_navigator.portToPinMapping["extdiract"] = "actDir"; } catch(e) {}
    this.registerActivity("NavigatorAC", ac_navigator);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.controller.navigator"] = ac_navigator; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.controller.navigator"] = ac_navigator; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["controller.navigator"] = ac_navigator; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["navigator"] = ac_navigator; } catch(e) {}
    const ac_cargo = new AC_SysADL_Behavior_CargoHandlerAC(
      "CargoHandlerAC",
      "RobAFISSystemCP.controller.cargo",
      ["cargo_inPieceColor"],
      [{"from":"actPieceColor","to":"cargoPieceColor"},{"from":"actConfig","to":"cargoConfig"},{"from":"actGrab","to":"extGrabAct"}],
      {"outParameters":[{"name":"actPieceColor","type":"Real","direction":"out"},{"name":"actConfig","type":"Real","direction":"out"},{"name":"actGrab","type":"Real","direction":"out"}]}
    );
    try { ac_cargo.portToPinMapping["cargoPieceColor"] = "actPieceColor"; } catch(e) {}
    try { ac_cargo.portToPinMapping["cargopiececolor"] = "actPieceColor"; } catch(e) {}
    try { ac_cargo.portToPinMapping["cargoConfig"] = "actConfig"; } catch(e) {}
    try { ac_cargo.portToPinMapping["cargoconfig"] = "actConfig"; } catch(e) {}
    try { ac_cargo.portToPinMapping["extGrabAct"] = "actGrab"; } catch(e) {}
    try { ac_cargo.portToPinMapping["extgrabact"] = "actGrab"; } catch(e) {}
    this.registerActivity("CargoHandlerAC", ac_cargo);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.controller.cargo"] = ac_cargo; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.controller.cargo"] = ac_cargo; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["controller.cargo"] = ac_cargo; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["cargo"] = ac_cargo; } catch(e) {}
    const ac_pInput = new AC_BoundaryBehavior_ParameterInputAC(
      "ParameterInputAC",
      "RobAFISSystemCP.pInput",
      ["pOut"],
      [{"from":"envParam","to":"passP.paramIn"},{"from":"sysParam","to":"passP.paramOut"},{"from":"envStrategy","to":"passS.strategyIn"},{"from":"sysStrategy","to":"passS.strategyOut"}],
      {"outParameters":[{"name":"envParam","type":"Real","direction":"out"},{"name":"sysParam","type":"Real","direction":"out"},{"name":"envStrategy","type":"Real","direction":"out"},{"name":"sysStrategy","type":"Real","direction":"out"}]}
    );
    try { ac_pInput.portToPinMapping["passP.paramIn"] = "envParam"; } catch(e) {}
    try { ac_pInput.portToPinMapping["passp.paramin"] = "envParam"; } catch(e) {}
    try { ac_pInput.portToPinMapping["passP.paramOut"] = "sysParam"; } catch(e) {}
    try { ac_pInput.portToPinMapping["passp.paramout"] = "sysParam"; } catch(e) {}
    try { ac_pInput.portToPinMapping["passS.strategyIn"] = "envStrategy"; } catch(e) {}
    try { ac_pInput.portToPinMapping["passs.strategyin"] = "envStrategy"; } catch(e) {}
    try { ac_pInput.portToPinMapping["passS.strategyOut"] = "sysStrategy"; } catch(e) {}
    try { ac_pInput.portToPinMapping["passs.strategyout"] = "sysStrategy"; } catch(e) {}
    this.registerActivity("ParameterInputAC", ac_pInput);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.pInput"] = ac_pInput; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.pinput"] = ac_pInput; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["pInput"] = ac_pInput; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["pinput"] = ac_pInput; } catch(e) {}
    const ac_camera = new AC_BoundaryBehavior_CameraSensorAC(
      "CameraSensorAC",
      "RobAFISSystemCP.camera",
      ["floorColorOut"],
      [{"from":"envFloor","to":"passF.colorIn"},{"from":"sysFloor","to":"passF.colorOut"},{"from":"envOffset","to":"passO.intIn"},{"from":"sysOffset","to":"passO.intOut"},{"from":"envZone","to":"passZ.boolIn"},{"from":"sysZone","to":"passZ.boolOut"},{"from":"envPiece","to":"passP.pColorIn"},{"from":"sysPiece","to":"passP.pColorOut"}],
      {"outParameters":[{"name":"envFloor","type":"Real","direction":"out"},{"name":"sysFloor","type":"Real","direction":"out"},{"name":"envOffset","type":"Real","direction":"out"},{"name":"sysOffset","type":"Real","direction":"out"},{"name":"envZone","type":"Real","direction":"out"},{"name":"sysZone","type":"Real","direction":"out"},{"name":"envPiece","type":"Real","direction":"out"},{"name":"sysPiece","type":"Real","direction":"out"}]}
    );
    try { ac_camera.portToPinMapping["passF.colorIn"] = "envFloor"; } catch(e) {}
    try { ac_camera.portToPinMapping["passf.colorin"] = "envFloor"; } catch(e) {}
    try { ac_camera.portToPinMapping["passF.colorOut"] = "sysFloor"; } catch(e) {}
    try { ac_camera.portToPinMapping["passf.colorout"] = "sysFloor"; } catch(e) {}
    try { ac_camera.portToPinMapping["passO.intIn"] = "envOffset"; } catch(e) {}
    try { ac_camera.portToPinMapping["passo.intin"] = "envOffset"; } catch(e) {}
    try { ac_camera.portToPinMapping["passO.intOut"] = "sysOffset"; } catch(e) {}
    try { ac_camera.portToPinMapping["passo.intout"] = "sysOffset"; } catch(e) {}
    try { ac_camera.portToPinMapping["passZ.boolIn"] = "envZone"; } catch(e) {}
    try { ac_camera.portToPinMapping["passz.boolin"] = "envZone"; } catch(e) {}
    try { ac_camera.portToPinMapping["passZ.boolOut"] = "sysZone"; } catch(e) {}
    try { ac_camera.portToPinMapping["passz.boolout"] = "sysZone"; } catch(e) {}
    try { ac_camera.portToPinMapping["passP.pColorIn"] = "envPiece"; } catch(e) {}
    try { ac_camera.portToPinMapping["passp.pcolorin"] = "envPiece"; } catch(e) {}
    try { ac_camera.portToPinMapping["passP.pColorOut"] = "sysPiece"; } catch(e) {}
    try { ac_camera.portToPinMapping["passp.pcolorout"] = "sysPiece"; } catch(e) {}
    this.registerActivity("CameraSensorAC", ac_camera);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.camera"] = ac_camera; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.camera"] = ac_camera; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["camera"] = ac_camera; } catch(e) {}
    const ac_obstacleSens = new AC_BoundaryBehavior_ObstacleSensorAC(
      "ObstacleSensorAC",
      "RobAFISSystemCP.obstacleSens",
      ["obstacleOut"],
      [{"from":"envObstacle","to":"passObstacle.boolIn"},{"from":"sysObstacle","to":"passObstacle.boolOut"}],
      {"outParameters":[{"name":"envObstacle","type":"Real","direction":"out"},{"name":"sysObstacle","type":"Real","direction":"out"}]}
    );
    try { ac_obstacleSens.portToPinMapping["passObstacle.boolIn"] = "envObstacle"; } catch(e) {}
    try { ac_obstacleSens.portToPinMapping["passobstacle.boolin"] = "envObstacle"; } catch(e) {}
    try { ac_obstacleSens.portToPinMapping["passObstacle.boolOut"] = "sysObstacle"; } catch(e) {}
    try { ac_obstacleSens.portToPinMapping["passobstacle.boolout"] = "sysObstacle"; } catch(e) {}
    this.registerActivity("ObstacleSensorAC", ac_obstacleSens);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.obstacleSens"] = ac_obstacleSens; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.obstaclesens"] = ac_obstacleSens; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["obstacleSens"] = ac_obstacleSens; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["obstaclesens"] = ac_obstacleSens; } catch(e) {}
    const ac_driveSys = new AC_BoundaryBehavior_DriveSystemAC(
      "DriveSystemAC",
      "RobAFISSystemCP.driveSys",
      ["dirIn"],
      [{"from":"sysDir","to":"passDir.dirIn"},{"from":"envDir","to":"passDir.dirOut"}],
      {"outParameters":[{"name":"sysDir","type":"Real","direction":"out"},{"name":"envDir","type":"Real","direction":"out"}]}
    );
    try { ac_driveSys.portToPinMapping["passDir.dirIn"] = "sysDir"; } catch(e) {}
    try { ac_driveSys.portToPinMapping["passdir.dirin"] = "sysDir"; } catch(e) {}
    try { ac_driveSys.portToPinMapping["passDir.dirOut"] = "envDir"; } catch(e) {}
    try { ac_driveSys.portToPinMapping["passdir.dirout"] = "envDir"; } catch(e) {}
    this.registerActivity("DriveSystemAC", ac_driveSys);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.driveSys"] = ac_driveSys; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.drivesys"] = ac_driveSys; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["driveSys"] = ac_driveSys; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["drivesys"] = ac_driveSys; } catch(e) {}
    const ac_grabber = new AC_BoundaryBehavior_GrabberAC(
      "GrabberAC",
      "RobAFISSystemCP.grabber",
      ["cmdIn"],
      [{"from":"sysCmd","to":"passCmd.cmdIn"},{"from":"envCmd","to":"passCmd.cmdOut"}],
      {"outParameters":[{"name":"sysCmd","type":"Real","direction":"out"},{"name":"envCmd","type":"Real","direction":"out"}]}
    );
    try { ac_grabber.portToPinMapping["passCmd.cmdIn"] = "sysCmd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["passcmd.cmdin"] = "sysCmd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["passCmd.cmdOut"] = "envCmd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["passcmd.cmdout"] = "envCmd"; } catch(e) {}
    this.registerActivity("GrabberAC", ac_grabber);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.grabber"] = ac_grabber; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.grabber"] = ac_grabber; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["grabber"] = ac_grabber; } catch(e) {}
    const ac_planner_2 = new AC_PkgScenarios_OperatorEA(
      "OperatorEA",
      "RobAFISSystemCP.controller.planner",
      ["planner_inParam"],
      [{"from":"opParamOut","to":"setMissionParametersOp"},{"from":"opStratOut","to":"setStrategyOp"}],
      {"outParameters":[{"name":"opParamOut","type":"Real","direction":"out"},{"name":"opStratOut","type":"Real","direction":"out"}]}
    );
    try { ac_planner_2.portToPinMapping["setMissionParametersOp"] = "opParamOut"; } catch(e) {}
    try { ac_planner_2.portToPinMapping["setmissionparametersop"] = "opParamOut"; } catch(e) {}
    try { ac_planner_2.portToPinMapping["setStrategyOp"] = "opStratOut"; } catch(e) {}
    try { ac_planner_2.portToPinMapping["setstrategyop"] = "opStratOut"; } catch(e) {}
    this.registerActivity("OperatorEA", ac_planner_2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.controller.planner"] = ac_planner_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.controller.planner"] = ac_planner_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["controller.planner"] = ac_planner_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["planner"] = ac_planner_2; } catch(e) {}
    const ac_navigator_2 = new AC_PkgScenarios_OperatorEA(
      "OperatorEA",
      "RobAFISSystemCP.controller.navigator",
      ["navigator_inFloorColor"],
      [{"from":"opParamOut","to":"setMissionParametersOp"},{"from":"opStratOut","to":"setStrategyOp"}],
      {"outParameters":[{"name":"opParamOut","type":"Real","direction":"out"},{"name":"opStratOut","type":"Real","direction":"out"}]}
    );
    try { ac_navigator_2.portToPinMapping["setMissionParametersOp"] = "opParamOut"; } catch(e) {}
    try { ac_navigator_2.portToPinMapping["setmissionparametersop"] = "opParamOut"; } catch(e) {}
    try { ac_navigator_2.portToPinMapping["setStrategyOp"] = "opStratOut"; } catch(e) {}
    try { ac_navigator_2.portToPinMapping["setstrategyop"] = "opStratOut"; } catch(e) {}
    this.registerActivity("OperatorEA", ac_navigator_2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.controller.navigator"] = ac_navigator_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.controller.navigator"] = ac_navigator_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["controller.navigator"] = ac_navigator_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["navigator"] = ac_navigator_2; } catch(e) {}
    const ac_cargo_2 = new AC_PkgScenarios_OperatorEA(
      "OperatorEA",
      "RobAFISSystemCP.controller.cargo",
      ["cargo_inPieceColor"],
      [{"from":"opParamOut","to":"setMissionParametersOp"},{"from":"opStratOut","to":"setStrategyOp"}],
      {"outParameters":[{"name":"opParamOut","type":"Real","direction":"out"},{"name":"opStratOut","type":"Real","direction":"out"}]}
    );
    try { ac_cargo_2.portToPinMapping["setMissionParametersOp"] = "opParamOut"; } catch(e) {}
    try { ac_cargo_2.portToPinMapping["setmissionparametersop"] = "opParamOut"; } catch(e) {}
    try { ac_cargo_2.portToPinMapping["setStrategyOp"] = "opStratOut"; } catch(e) {}
    try { ac_cargo_2.portToPinMapping["setstrategyop"] = "opStratOut"; } catch(e) {}
    this.registerActivity("OperatorEA", ac_cargo_2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.controller.cargo"] = ac_cargo_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.controller.cargo"] = ac_cargo_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["controller.cargo"] = ac_cargo_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["cargo"] = ac_cargo_2; } catch(e) {}
    const ac_pInput_2 = new AC_PkgScenarios_OperatorEA(
      "OperatorEA",
      "RobAFISSystemCP.pInput",
      ["pOut"],
      [{"from":"opParamOut","to":"setMissionParametersOp"},{"from":"opStratOut","to":"setStrategyOp"}],
      {"outParameters":[{"name":"opParamOut","type":"Real","direction":"out"},{"name":"opStratOut","type":"Real","direction":"out"}]}
    );
    try { ac_pInput_2.portToPinMapping["setMissionParametersOp"] = "opParamOut"; } catch(e) {}
    try { ac_pInput_2.portToPinMapping["setmissionparametersop"] = "opParamOut"; } catch(e) {}
    try { ac_pInput_2.portToPinMapping["setStrategyOp"] = "opStratOut"; } catch(e) {}
    try { ac_pInput_2.portToPinMapping["setstrategyop"] = "opStratOut"; } catch(e) {}
    this.registerActivity("OperatorEA", ac_pInput_2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.pInput"] = ac_pInput_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.pinput"] = ac_pInput_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["pInput"] = ac_pInput_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["pinput"] = ac_pInput_2; } catch(e) {}
    const ac_camera_2 = new AC_PkgScenarios_OperatorEA(
      "OperatorEA",
      "RobAFISSystemCP.camera",
      ["floorColorOut"],
      [{"from":"opParamOut","to":"setMissionParametersOp"},{"from":"opStratOut","to":"setStrategyOp"}],
      {"outParameters":[{"name":"opParamOut","type":"Real","direction":"out"},{"name":"opStratOut","type":"Real","direction":"out"}]}
    );
    try { ac_camera_2.portToPinMapping["setMissionParametersOp"] = "opParamOut"; } catch(e) {}
    try { ac_camera_2.portToPinMapping["setmissionparametersop"] = "opParamOut"; } catch(e) {}
    try { ac_camera_2.portToPinMapping["setStrategyOp"] = "opStratOut"; } catch(e) {}
    try { ac_camera_2.portToPinMapping["setstrategyop"] = "opStratOut"; } catch(e) {}
    this.registerActivity("OperatorEA", ac_camera_2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.camera"] = ac_camera_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.camera"] = ac_camera_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["camera"] = ac_camera_2; } catch(e) {}
    const ac_obstacleSens_2 = new AC_PkgScenarios_OperatorEA(
      "OperatorEA",
      "RobAFISSystemCP.obstacleSens",
      ["obstacleOut"],
      [{"from":"opParamOut","to":"setMissionParametersOp"},{"from":"opStratOut","to":"setStrategyOp"}],
      {"outParameters":[{"name":"opParamOut","type":"Real","direction":"out"},{"name":"opStratOut","type":"Real","direction":"out"}]}
    );
    try { ac_obstacleSens_2.portToPinMapping["setMissionParametersOp"] = "opParamOut"; } catch(e) {}
    try { ac_obstacleSens_2.portToPinMapping["setmissionparametersop"] = "opParamOut"; } catch(e) {}
    try { ac_obstacleSens_2.portToPinMapping["setStrategyOp"] = "opStratOut"; } catch(e) {}
    try { ac_obstacleSens_2.portToPinMapping["setstrategyop"] = "opStratOut"; } catch(e) {}
    this.registerActivity("OperatorEA", ac_obstacleSens_2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.obstacleSens"] = ac_obstacleSens_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.obstaclesens"] = ac_obstacleSens_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["obstacleSens"] = ac_obstacleSens_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["obstaclesens"] = ac_obstacleSens_2; } catch(e) {}
    const ac_driveSys_2 = new AC_PkgScenarios_OperatorEA(
      "OperatorEA",
      "RobAFISSystemCP.driveSys",
      ["dirIn"],
      [{"from":"opParamOut","to":"setMissionParametersOp"},{"from":"opStratOut","to":"setStrategyOp"}],
      {"outParameters":[{"name":"opParamOut","type":"Real","direction":"out"},{"name":"opStratOut","type":"Real","direction":"out"}]}
    );
    try { ac_driveSys_2.portToPinMapping["setMissionParametersOp"] = "opParamOut"; } catch(e) {}
    try { ac_driveSys_2.portToPinMapping["setmissionparametersop"] = "opParamOut"; } catch(e) {}
    try { ac_driveSys_2.portToPinMapping["setStrategyOp"] = "opStratOut"; } catch(e) {}
    try { ac_driveSys_2.portToPinMapping["setstrategyop"] = "opStratOut"; } catch(e) {}
    this.registerActivity("OperatorEA", ac_driveSys_2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.driveSys"] = ac_driveSys_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.drivesys"] = ac_driveSys_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["driveSys"] = ac_driveSys_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["drivesys"] = ac_driveSys_2; } catch(e) {}
    const ac_grabber_2 = new AC_PkgScenarios_OperatorEA(
      "OperatorEA",
      "RobAFISSystemCP.grabber",
      ["cmdIn"],
      [{"from":"opParamOut","to":"setMissionParametersOp"},{"from":"opStratOut","to":"setStrategyOp"}],
      {"outParameters":[{"name":"opParamOut","type":"Real","direction":"out"},{"name":"opStratOut","type":"Real","direction":"out"}]}
    );
    try { ac_grabber_2.portToPinMapping["setMissionParametersOp"] = "opParamOut"; } catch(e) {}
    try { ac_grabber_2.portToPinMapping["setmissionparametersop"] = "opParamOut"; } catch(e) {}
    try { ac_grabber_2.portToPinMapping["setStrategyOp"] = "opStratOut"; } catch(e) {}
    try { ac_grabber_2.portToPinMapping["setstrategyop"] = "opStratOut"; } catch(e) {}
    this.registerActivity("OperatorEA", ac_grabber_2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.grabber"] = ac_grabber_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.grabber"] = ac_grabber_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["grabber"] = ac_grabber_2; } catch(e) {}
    const ac_controller = new AC_PkgScenarios_OperatorEA(
      "OperatorEA",
      "RobAFISSystemCP.controller",
      ["controller_inParam"],
      [{"from":"opParamOut","to":"setMissionParametersOp"},{"from":"opStratOut","to":"setStrategyOp"}],
      {"outParameters":[{"name":"opParamOut","type":"Real","direction":"out"},{"name":"opStratOut","type":"Real","direction":"out"}]}
    );
    try { ac_controller.portToPinMapping["setMissionParametersOp"] = "opParamOut"; } catch(e) {}
    try { ac_controller.portToPinMapping["setmissionparametersop"] = "opParamOut"; } catch(e) {}
    try { ac_controller.portToPinMapping["setStrategyOp"] = "opStratOut"; } catch(e) {}
    try { ac_controller.portToPinMapping["setstrategyop"] = "opStratOut"; } catch(e) {}
    this.registerActivity("OperatorEA", ac_controller);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.controller"] = ac_controller; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.controller"] = ac_controller; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["controller"] = ac_controller; } catch(e) {}
    const ac_planner_3 = new AC_PkgScenarios_UnitEA(
      "UnitEA",
      "RobAFISSystemCP.controller.planner",
      ["planner_inParam"],
      [{"from":"outUnitNavLine","to":"leavePA"},{"from":"outUnitNavLine","to":"turnRight"},{"from":"outUnitNavLine","to":"returnJourney"},{"from":"outUnitNavPad","to":"detectGreenPad"},{"from":"outUnitNavPad","to":"detectRedPad"},{"from":"outUnitNavPad","to":"stopAtT"},{"from":"outUnitNavPad","to":"routeToSA"},{"from":"outUnitNavPad","to":"routeToSPD"},{"from":"outUnitNavPad","to":"stopAtSPE"},{"from":"outUnitNavPad","to":"arriveAtTargetStock"},{"from":"outUnitPieceColor","to":"extractPieceT"},{"from":"outSPEPieceColor","to":"extractPieceSPE"},{"from":"outUnitPAColor","to":"arriveAtPA"},{"from":"outObstacle","to":"setObstacleTrue"},{"from":"outObstacle","to":"setObstacleFalse"}],
      {"outParameters":[{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitPieceColor","type":"Real","direction":"out"},{"name":"outSPEPieceColor","type":"Real","direction":"out"},{"name":"outUnitPAColor","type":"Real","direction":"out"},{"name":"outObstacle","type":"Real","direction":"out"},{"name":"outObstacle","type":"Real","direction":"out"}]}
    );
    try { ac_planner_3.portToPinMapping["leavePA"] = "outUnitNavLine"; } catch(e) {}
    try { ac_planner_3.portToPinMapping["leavepa"] = "outUnitNavLine"; } catch(e) {}
    try { ac_planner_3.portToPinMapping["turnRight"] = "outUnitNavLine"; } catch(e) {}
    try { ac_planner_3.portToPinMapping["turnright"] = "outUnitNavLine"; } catch(e) {}
    try { ac_planner_3.portToPinMapping["returnJourney"] = "outUnitNavLine"; } catch(e) {}
    try { ac_planner_3.portToPinMapping["returnjourney"] = "outUnitNavLine"; } catch(e) {}
    try { ac_planner_3.portToPinMapping["detectGreenPad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_planner_3.portToPinMapping["detectgreenpad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_planner_3.portToPinMapping["detectRedPad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_planner_3.portToPinMapping["detectredpad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_planner_3.portToPinMapping["stopAtT"] = "outUnitNavPad"; } catch(e) {}
    try { ac_planner_3.portToPinMapping["stopatt"] = "outUnitNavPad"; } catch(e) {}
    try { ac_planner_3.portToPinMapping["routeToSA"] = "outUnitNavPad"; } catch(e) {}
    try { ac_planner_3.portToPinMapping["routetosa"] = "outUnitNavPad"; } catch(e) {}
    try { ac_planner_3.portToPinMapping["routeToSPD"] = "outUnitNavPad"; } catch(e) {}
    try { ac_planner_3.portToPinMapping["routetospd"] = "outUnitNavPad"; } catch(e) {}
    try { ac_planner_3.portToPinMapping["stopAtSPE"] = "outUnitNavPad"; } catch(e) {}
    try { ac_planner_3.portToPinMapping["stopatspe"] = "outUnitNavPad"; } catch(e) {}
    try { ac_planner_3.portToPinMapping["arriveAtTargetStock"] = "outUnitNavPad"; } catch(e) {}
    try { ac_planner_3.portToPinMapping["arriveattargetstock"] = "outUnitNavPad"; } catch(e) {}
    try { ac_planner_3.portToPinMapping["extractPieceT"] = "outUnitPieceColor"; } catch(e) {}
    try { ac_planner_3.portToPinMapping["extractpiecet"] = "outUnitPieceColor"; } catch(e) {}
    try { ac_planner_3.portToPinMapping["extractPieceSPE"] = "outSPEPieceColor"; } catch(e) {}
    try { ac_planner_3.portToPinMapping["extractpiecespe"] = "outSPEPieceColor"; } catch(e) {}
    try { ac_planner_3.portToPinMapping["arriveAtPA"] = "outUnitPAColor"; } catch(e) {}
    try { ac_planner_3.portToPinMapping["arriveatpa"] = "outUnitPAColor"; } catch(e) {}
    try { ac_planner_3.portToPinMapping["setObstacleTrue"] = "outObstacle"; } catch(e) {}
    try { ac_planner_3.portToPinMapping["setobstacletrue"] = "outObstacle"; } catch(e) {}
    try { ac_planner_3.portToPinMapping["setObstacleFalse"] = "outObstacle"; } catch(e) {}
    try { ac_planner_3.portToPinMapping["setobstaclefalse"] = "outObstacle"; } catch(e) {}
    this.registerActivity("UnitEA", ac_planner_3);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.controller.planner"] = ac_planner_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.controller.planner"] = ac_planner_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["controller.planner"] = ac_planner_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["planner"] = ac_planner_3; } catch(e) {}
    const ac_navigator_3 = new AC_PkgScenarios_UnitEA(
      "UnitEA",
      "RobAFISSystemCP.controller.navigator",
      ["navigator_inFloorColor"],
      [{"from":"outUnitNavLine","to":"leavePA"},{"from":"outUnitNavLine","to":"turnRight"},{"from":"outUnitNavLine","to":"returnJourney"},{"from":"outUnitNavPad","to":"detectGreenPad"},{"from":"outUnitNavPad","to":"detectRedPad"},{"from":"outUnitNavPad","to":"stopAtT"},{"from":"outUnitNavPad","to":"routeToSA"},{"from":"outUnitNavPad","to":"routeToSPD"},{"from":"outUnitNavPad","to":"stopAtSPE"},{"from":"outUnitNavPad","to":"arriveAtTargetStock"},{"from":"outUnitPieceColor","to":"extractPieceT"},{"from":"outSPEPieceColor","to":"extractPieceSPE"},{"from":"outUnitPAColor","to":"arriveAtPA"},{"from":"outObstacle","to":"setObstacleTrue"},{"from":"outObstacle","to":"setObstacleFalse"}],
      {"outParameters":[{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitPieceColor","type":"Real","direction":"out"},{"name":"outSPEPieceColor","type":"Real","direction":"out"},{"name":"outUnitPAColor","type":"Real","direction":"out"},{"name":"outObstacle","type":"Real","direction":"out"},{"name":"outObstacle","type":"Real","direction":"out"}]}
    );
    try { ac_navigator_3.portToPinMapping["leavePA"] = "outUnitNavLine"; } catch(e) {}
    try { ac_navigator_3.portToPinMapping["leavepa"] = "outUnitNavLine"; } catch(e) {}
    try { ac_navigator_3.portToPinMapping["turnRight"] = "outUnitNavLine"; } catch(e) {}
    try { ac_navigator_3.portToPinMapping["turnright"] = "outUnitNavLine"; } catch(e) {}
    try { ac_navigator_3.portToPinMapping["returnJourney"] = "outUnitNavLine"; } catch(e) {}
    try { ac_navigator_3.portToPinMapping["returnjourney"] = "outUnitNavLine"; } catch(e) {}
    try { ac_navigator_3.portToPinMapping["detectGreenPad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_navigator_3.portToPinMapping["detectgreenpad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_navigator_3.portToPinMapping["detectRedPad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_navigator_3.portToPinMapping["detectredpad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_navigator_3.portToPinMapping["stopAtT"] = "outUnitNavPad"; } catch(e) {}
    try { ac_navigator_3.portToPinMapping["stopatt"] = "outUnitNavPad"; } catch(e) {}
    try { ac_navigator_3.portToPinMapping["routeToSA"] = "outUnitNavPad"; } catch(e) {}
    try { ac_navigator_3.portToPinMapping["routetosa"] = "outUnitNavPad"; } catch(e) {}
    try { ac_navigator_3.portToPinMapping["routeToSPD"] = "outUnitNavPad"; } catch(e) {}
    try { ac_navigator_3.portToPinMapping["routetospd"] = "outUnitNavPad"; } catch(e) {}
    try { ac_navigator_3.portToPinMapping["stopAtSPE"] = "outUnitNavPad"; } catch(e) {}
    try { ac_navigator_3.portToPinMapping["stopatspe"] = "outUnitNavPad"; } catch(e) {}
    try { ac_navigator_3.portToPinMapping["arriveAtTargetStock"] = "outUnitNavPad"; } catch(e) {}
    try { ac_navigator_3.portToPinMapping["arriveattargetstock"] = "outUnitNavPad"; } catch(e) {}
    try { ac_navigator_3.portToPinMapping["extractPieceT"] = "outUnitPieceColor"; } catch(e) {}
    try { ac_navigator_3.portToPinMapping["extractpiecet"] = "outUnitPieceColor"; } catch(e) {}
    try { ac_navigator_3.portToPinMapping["extractPieceSPE"] = "outSPEPieceColor"; } catch(e) {}
    try { ac_navigator_3.portToPinMapping["extractpiecespe"] = "outSPEPieceColor"; } catch(e) {}
    try { ac_navigator_3.portToPinMapping["arriveAtPA"] = "outUnitPAColor"; } catch(e) {}
    try { ac_navigator_3.portToPinMapping["arriveatpa"] = "outUnitPAColor"; } catch(e) {}
    try { ac_navigator_3.portToPinMapping["setObstacleTrue"] = "outObstacle"; } catch(e) {}
    try { ac_navigator_3.portToPinMapping["setobstacletrue"] = "outObstacle"; } catch(e) {}
    try { ac_navigator_3.portToPinMapping["setObstacleFalse"] = "outObstacle"; } catch(e) {}
    try { ac_navigator_3.portToPinMapping["setobstaclefalse"] = "outObstacle"; } catch(e) {}
    this.registerActivity("UnitEA", ac_navigator_3);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.controller.navigator"] = ac_navigator_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.controller.navigator"] = ac_navigator_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["controller.navigator"] = ac_navigator_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["navigator"] = ac_navigator_3; } catch(e) {}
    const ac_cargo_3 = new AC_PkgScenarios_UnitEA(
      "UnitEA",
      "RobAFISSystemCP.controller.cargo",
      ["cargo_inPieceColor"],
      [{"from":"outUnitNavLine","to":"leavePA"},{"from":"outUnitNavLine","to":"turnRight"},{"from":"outUnitNavLine","to":"returnJourney"},{"from":"outUnitNavPad","to":"detectGreenPad"},{"from":"outUnitNavPad","to":"detectRedPad"},{"from":"outUnitNavPad","to":"stopAtT"},{"from":"outUnitNavPad","to":"routeToSA"},{"from":"outUnitNavPad","to":"routeToSPD"},{"from":"outUnitNavPad","to":"stopAtSPE"},{"from":"outUnitNavPad","to":"arriveAtTargetStock"},{"from":"outUnitPieceColor","to":"extractPieceT"},{"from":"outSPEPieceColor","to":"extractPieceSPE"},{"from":"outUnitPAColor","to":"arriveAtPA"},{"from":"outObstacle","to":"setObstacleTrue"},{"from":"outObstacle","to":"setObstacleFalse"}],
      {"outParameters":[{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitPieceColor","type":"Real","direction":"out"},{"name":"outSPEPieceColor","type":"Real","direction":"out"},{"name":"outUnitPAColor","type":"Real","direction":"out"},{"name":"outObstacle","type":"Real","direction":"out"},{"name":"outObstacle","type":"Real","direction":"out"}]}
    );
    try { ac_cargo_3.portToPinMapping["leavePA"] = "outUnitNavLine"; } catch(e) {}
    try { ac_cargo_3.portToPinMapping["leavepa"] = "outUnitNavLine"; } catch(e) {}
    try { ac_cargo_3.portToPinMapping["turnRight"] = "outUnitNavLine"; } catch(e) {}
    try { ac_cargo_3.portToPinMapping["turnright"] = "outUnitNavLine"; } catch(e) {}
    try { ac_cargo_3.portToPinMapping["returnJourney"] = "outUnitNavLine"; } catch(e) {}
    try { ac_cargo_3.portToPinMapping["returnjourney"] = "outUnitNavLine"; } catch(e) {}
    try { ac_cargo_3.portToPinMapping["detectGreenPad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_cargo_3.portToPinMapping["detectgreenpad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_cargo_3.portToPinMapping["detectRedPad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_cargo_3.portToPinMapping["detectredpad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_cargo_3.portToPinMapping["stopAtT"] = "outUnitNavPad"; } catch(e) {}
    try { ac_cargo_3.portToPinMapping["stopatt"] = "outUnitNavPad"; } catch(e) {}
    try { ac_cargo_3.portToPinMapping["routeToSA"] = "outUnitNavPad"; } catch(e) {}
    try { ac_cargo_3.portToPinMapping["routetosa"] = "outUnitNavPad"; } catch(e) {}
    try { ac_cargo_3.portToPinMapping["routeToSPD"] = "outUnitNavPad"; } catch(e) {}
    try { ac_cargo_3.portToPinMapping["routetospd"] = "outUnitNavPad"; } catch(e) {}
    try { ac_cargo_3.portToPinMapping["stopAtSPE"] = "outUnitNavPad"; } catch(e) {}
    try { ac_cargo_3.portToPinMapping["stopatspe"] = "outUnitNavPad"; } catch(e) {}
    try { ac_cargo_3.portToPinMapping["arriveAtTargetStock"] = "outUnitNavPad"; } catch(e) {}
    try { ac_cargo_3.portToPinMapping["arriveattargetstock"] = "outUnitNavPad"; } catch(e) {}
    try { ac_cargo_3.portToPinMapping["extractPieceT"] = "outUnitPieceColor"; } catch(e) {}
    try { ac_cargo_3.portToPinMapping["extractpiecet"] = "outUnitPieceColor"; } catch(e) {}
    try { ac_cargo_3.portToPinMapping["extractPieceSPE"] = "outSPEPieceColor"; } catch(e) {}
    try { ac_cargo_3.portToPinMapping["extractpiecespe"] = "outSPEPieceColor"; } catch(e) {}
    try { ac_cargo_3.portToPinMapping["arriveAtPA"] = "outUnitPAColor"; } catch(e) {}
    try { ac_cargo_3.portToPinMapping["arriveatpa"] = "outUnitPAColor"; } catch(e) {}
    try { ac_cargo_3.portToPinMapping["setObstacleTrue"] = "outObstacle"; } catch(e) {}
    try { ac_cargo_3.portToPinMapping["setobstacletrue"] = "outObstacle"; } catch(e) {}
    try { ac_cargo_3.portToPinMapping["setObstacleFalse"] = "outObstacle"; } catch(e) {}
    try { ac_cargo_3.portToPinMapping["setobstaclefalse"] = "outObstacle"; } catch(e) {}
    this.registerActivity("UnitEA", ac_cargo_3);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.controller.cargo"] = ac_cargo_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.controller.cargo"] = ac_cargo_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["controller.cargo"] = ac_cargo_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["cargo"] = ac_cargo_3; } catch(e) {}
    const ac_pInput_3 = new AC_PkgScenarios_UnitEA(
      "UnitEA",
      "RobAFISSystemCP.pInput",
      ["pOut"],
      [{"from":"outUnitNavLine","to":"leavePA"},{"from":"outUnitNavLine","to":"turnRight"},{"from":"outUnitNavLine","to":"returnJourney"},{"from":"outUnitNavPad","to":"detectGreenPad"},{"from":"outUnitNavPad","to":"detectRedPad"},{"from":"outUnitNavPad","to":"stopAtT"},{"from":"outUnitNavPad","to":"routeToSA"},{"from":"outUnitNavPad","to":"routeToSPD"},{"from":"outUnitNavPad","to":"stopAtSPE"},{"from":"outUnitNavPad","to":"arriveAtTargetStock"},{"from":"outUnitPieceColor","to":"extractPieceT"},{"from":"outSPEPieceColor","to":"extractPieceSPE"},{"from":"outUnitPAColor","to":"arriveAtPA"},{"from":"outObstacle","to":"setObstacleTrue"},{"from":"outObstacle","to":"setObstacleFalse"}],
      {"outParameters":[{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitPieceColor","type":"Real","direction":"out"},{"name":"outSPEPieceColor","type":"Real","direction":"out"},{"name":"outUnitPAColor","type":"Real","direction":"out"},{"name":"outObstacle","type":"Real","direction":"out"},{"name":"outObstacle","type":"Real","direction":"out"}]}
    );
    try { ac_pInput_3.portToPinMapping["leavePA"] = "outUnitNavLine"; } catch(e) {}
    try { ac_pInput_3.portToPinMapping["leavepa"] = "outUnitNavLine"; } catch(e) {}
    try { ac_pInput_3.portToPinMapping["turnRight"] = "outUnitNavLine"; } catch(e) {}
    try { ac_pInput_3.portToPinMapping["turnright"] = "outUnitNavLine"; } catch(e) {}
    try { ac_pInput_3.portToPinMapping["returnJourney"] = "outUnitNavLine"; } catch(e) {}
    try { ac_pInput_3.portToPinMapping["returnjourney"] = "outUnitNavLine"; } catch(e) {}
    try { ac_pInput_3.portToPinMapping["detectGreenPad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_pInput_3.portToPinMapping["detectgreenpad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_pInput_3.portToPinMapping["detectRedPad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_pInput_3.portToPinMapping["detectredpad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_pInput_3.portToPinMapping["stopAtT"] = "outUnitNavPad"; } catch(e) {}
    try { ac_pInput_3.portToPinMapping["stopatt"] = "outUnitNavPad"; } catch(e) {}
    try { ac_pInput_3.portToPinMapping["routeToSA"] = "outUnitNavPad"; } catch(e) {}
    try { ac_pInput_3.portToPinMapping["routetosa"] = "outUnitNavPad"; } catch(e) {}
    try { ac_pInput_3.portToPinMapping["routeToSPD"] = "outUnitNavPad"; } catch(e) {}
    try { ac_pInput_3.portToPinMapping["routetospd"] = "outUnitNavPad"; } catch(e) {}
    try { ac_pInput_3.portToPinMapping["stopAtSPE"] = "outUnitNavPad"; } catch(e) {}
    try { ac_pInput_3.portToPinMapping["stopatspe"] = "outUnitNavPad"; } catch(e) {}
    try { ac_pInput_3.portToPinMapping["arriveAtTargetStock"] = "outUnitNavPad"; } catch(e) {}
    try { ac_pInput_3.portToPinMapping["arriveattargetstock"] = "outUnitNavPad"; } catch(e) {}
    try { ac_pInput_3.portToPinMapping["extractPieceT"] = "outUnitPieceColor"; } catch(e) {}
    try { ac_pInput_3.portToPinMapping["extractpiecet"] = "outUnitPieceColor"; } catch(e) {}
    try { ac_pInput_3.portToPinMapping["extractPieceSPE"] = "outSPEPieceColor"; } catch(e) {}
    try { ac_pInput_3.portToPinMapping["extractpiecespe"] = "outSPEPieceColor"; } catch(e) {}
    try { ac_pInput_3.portToPinMapping["arriveAtPA"] = "outUnitPAColor"; } catch(e) {}
    try { ac_pInput_3.portToPinMapping["arriveatpa"] = "outUnitPAColor"; } catch(e) {}
    try { ac_pInput_3.portToPinMapping["setObstacleTrue"] = "outObstacle"; } catch(e) {}
    try { ac_pInput_3.portToPinMapping["setobstacletrue"] = "outObstacle"; } catch(e) {}
    try { ac_pInput_3.portToPinMapping["setObstacleFalse"] = "outObstacle"; } catch(e) {}
    try { ac_pInput_3.portToPinMapping["setobstaclefalse"] = "outObstacle"; } catch(e) {}
    this.registerActivity("UnitEA", ac_pInput_3);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.pInput"] = ac_pInput_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.pinput"] = ac_pInput_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["pInput"] = ac_pInput_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["pinput"] = ac_pInput_3; } catch(e) {}
    const ac_camera_3 = new AC_PkgScenarios_UnitEA(
      "UnitEA",
      "RobAFISSystemCP.camera",
      ["floorColorOut"],
      [{"from":"outUnitNavLine","to":"leavePA"},{"from":"outUnitNavLine","to":"turnRight"},{"from":"outUnitNavLine","to":"returnJourney"},{"from":"outUnitNavPad","to":"detectGreenPad"},{"from":"outUnitNavPad","to":"detectRedPad"},{"from":"outUnitNavPad","to":"stopAtT"},{"from":"outUnitNavPad","to":"routeToSA"},{"from":"outUnitNavPad","to":"routeToSPD"},{"from":"outUnitNavPad","to":"stopAtSPE"},{"from":"outUnitNavPad","to":"arriveAtTargetStock"},{"from":"outUnitPieceColor","to":"extractPieceT"},{"from":"outSPEPieceColor","to":"extractPieceSPE"},{"from":"outUnitPAColor","to":"arriveAtPA"},{"from":"outObstacle","to":"setObstacleTrue"},{"from":"outObstacle","to":"setObstacleFalse"}],
      {"outParameters":[{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitPieceColor","type":"Real","direction":"out"},{"name":"outSPEPieceColor","type":"Real","direction":"out"},{"name":"outUnitPAColor","type":"Real","direction":"out"},{"name":"outObstacle","type":"Real","direction":"out"},{"name":"outObstacle","type":"Real","direction":"out"}]}
    );
    try { ac_camera_3.portToPinMapping["leavePA"] = "outUnitNavLine"; } catch(e) {}
    try { ac_camera_3.portToPinMapping["leavepa"] = "outUnitNavLine"; } catch(e) {}
    try { ac_camera_3.portToPinMapping["turnRight"] = "outUnitNavLine"; } catch(e) {}
    try { ac_camera_3.portToPinMapping["turnright"] = "outUnitNavLine"; } catch(e) {}
    try { ac_camera_3.portToPinMapping["returnJourney"] = "outUnitNavLine"; } catch(e) {}
    try { ac_camera_3.portToPinMapping["returnjourney"] = "outUnitNavLine"; } catch(e) {}
    try { ac_camera_3.portToPinMapping["detectGreenPad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_camera_3.portToPinMapping["detectgreenpad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_camera_3.portToPinMapping["detectRedPad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_camera_3.portToPinMapping["detectredpad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_camera_3.portToPinMapping["stopAtT"] = "outUnitNavPad"; } catch(e) {}
    try { ac_camera_3.portToPinMapping["stopatt"] = "outUnitNavPad"; } catch(e) {}
    try { ac_camera_3.portToPinMapping["routeToSA"] = "outUnitNavPad"; } catch(e) {}
    try { ac_camera_3.portToPinMapping["routetosa"] = "outUnitNavPad"; } catch(e) {}
    try { ac_camera_3.portToPinMapping["routeToSPD"] = "outUnitNavPad"; } catch(e) {}
    try { ac_camera_3.portToPinMapping["routetospd"] = "outUnitNavPad"; } catch(e) {}
    try { ac_camera_3.portToPinMapping["stopAtSPE"] = "outUnitNavPad"; } catch(e) {}
    try { ac_camera_3.portToPinMapping["stopatspe"] = "outUnitNavPad"; } catch(e) {}
    try { ac_camera_3.portToPinMapping["arriveAtTargetStock"] = "outUnitNavPad"; } catch(e) {}
    try { ac_camera_3.portToPinMapping["arriveattargetstock"] = "outUnitNavPad"; } catch(e) {}
    try { ac_camera_3.portToPinMapping["extractPieceT"] = "outUnitPieceColor"; } catch(e) {}
    try { ac_camera_3.portToPinMapping["extractpiecet"] = "outUnitPieceColor"; } catch(e) {}
    try { ac_camera_3.portToPinMapping["extractPieceSPE"] = "outSPEPieceColor"; } catch(e) {}
    try { ac_camera_3.portToPinMapping["extractpiecespe"] = "outSPEPieceColor"; } catch(e) {}
    try { ac_camera_3.portToPinMapping["arriveAtPA"] = "outUnitPAColor"; } catch(e) {}
    try { ac_camera_3.portToPinMapping["arriveatpa"] = "outUnitPAColor"; } catch(e) {}
    try { ac_camera_3.portToPinMapping["setObstacleTrue"] = "outObstacle"; } catch(e) {}
    try { ac_camera_3.portToPinMapping["setobstacletrue"] = "outObstacle"; } catch(e) {}
    try { ac_camera_3.portToPinMapping["setObstacleFalse"] = "outObstacle"; } catch(e) {}
    try { ac_camera_3.portToPinMapping["setobstaclefalse"] = "outObstacle"; } catch(e) {}
    this.registerActivity("UnitEA", ac_camera_3);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.camera"] = ac_camera_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.camera"] = ac_camera_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["camera"] = ac_camera_3; } catch(e) {}
    const ac_obstacleSens_3 = new AC_PkgScenarios_UnitEA(
      "UnitEA",
      "RobAFISSystemCP.obstacleSens",
      ["obstacleOut"],
      [{"from":"outUnitNavLine","to":"leavePA"},{"from":"outUnitNavLine","to":"turnRight"},{"from":"outUnitNavLine","to":"returnJourney"},{"from":"outUnitNavPad","to":"detectGreenPad"},{"from":"outUnitNavPad","to":"detectRedPad"},{"from":"outUnitNavPad","to":"stopAtT"},{"from":"outUnitNavPad","to":"routeToSA"},{"from":"outUnitNavPad","to":"routeToSPD"},{"from":"outUnitNavPad","to":"stopAtSPE"},{"from":"outUnitNavPad","to":"arriveAtTargetStock"},{"from":"outUnitPieceColor","to":"extractPieceT"},{"from":"outSPEPieceColor","to":"extractPieceSPE"},{"from":"outUnitPAColor","to":"arriveAtPA"},{"from":"outObstacle","to":"setObstacleTrue"},{"from":"outObstacle","to":"setObstacleFalse"}],
      {"outParameters":[{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitPieceColor","type":"Real","direction":"out"},{"name":"outSPEPieceColor","type":"Real","direction":"out"},{"name":"outUnitPAColor","type":"Real","direction":"out"},{"name":"outObstacle","type":"Real","direction":"out"},{"name":"outObstacle","type":"Real","direction":"out"}]}
    );
    try { ac_obstacleSens_3.portToPinMapping["leavePA"] = "outUnitNavLine"; } catch(e) {}
    try { ac_obstacleSens_3.portToPinMapping["leavepa"] = "outUnitNavLine"; } catch(e) {}
    try { ac_obstacleSens_3.portToPinMapping["turnRight"] = "outUnitNavLine"; } catch(e) {}
    try { ac_obstacleSens_3.portToPinMapping["turnright"] = "outUnitNavLine"; } catch(e) {}
    try { ac_obstacleSens_3.portToPinMapping["returnJourney"] = "outUnitNavLine"; } catch(e) {}
    try { ac_obstacleSens_3.portToPinMapping["returnjourney"] = "outUnitNavLine"; } catch(e) {}
    try { ac_obstacleSens_3.portToPinMapping["detectGreenPad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_obstacleSens_3.portToPinMapping["detectgreenpad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_obstacleSens_3.portToPinMapping["detectRedPad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_obstacleSens_3.portToPinMapping["detectredpad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_obstacleSens_3.portToPinMapping["stopAtT"] = "outUnitNavPad"; } catch(e) {}
    try { ac_obstacleSens_3.portToPinMapping["stopatt"] = "outUnitNavPad"; } catch(e) {}
    try { ac_obstacleSens_3.portToPinMapping["routeToSA"] = "outUnitNavPad"; } catch(e) {}
    try { ac_obstacleSens_3.portToPinMapping["routetosa"] = "outUnitNavPad"; } catch(e) {}
    try { ac_obstacleSens_3.portToPinMapping["routeToSPD"] = "outUnitNavPad"; } catch(e) {}
    try { ac_obstacleSens_3.portToPinMapping["routetospd"] = "outUnitNavPad"; } catch(e) {}
    try { ac_obstacleSens_3.portToPinMapping["stopAtSPE"] = "outUnitNavPad"; } catch(e) {}
    try { ac_obstacleSens_3.portToPinMapping["stopatspe"] = "outUnitNavPad"; } catch(e) {}
    try { ac_obstacleSens_3.portToPinMapping["arriveAtTargetStock"] = "outUnitNavPad"; } catch(e) {}
    try { ac_obstacleSens_3.portToPinMapping["arriveattargetstock"] = "outUnitNavPad"; } catch(e) {}
    try { ac_obstacleSens_3.portToPinMapping["extractPieceT"] = "outUnitPieceColor"; } catch(e) {}
    try { ac_obstacleSens_3.portToPinMapping["extractpiecet"] = "outUnitPieceColor"; } catch(e) {}
    try { ac_obstacleSens_3.portToPinMapping["extractPieceSPE"] = "outSPEPieceColor"; } catch(e) {}
    try { ac_obstacleSens_3.portToPinMapping["extractpiecespe"] = "outSPEPieceColor"; } catch(e) {}
    try { ac_obstacleSens_3.portToPinMapping["arriveAtPA"] = "outUnitPAColor"; } catch(e) {}
    try { ac_obstacleSens_3.portToPinMapping["arriveatpa"] = "outUnitPAColor"; } catch(e) {}
    try { ac_obstacleSens_3.portToPinMapping["setObstacleTrue"] = "outObstacle"; } catch(e) {}
    try { ac_obstacleSens_3.portToPinMapping["setobstacletrue"] = "outObstacle"; } catch(e) {}
    try { ac_obstacleSens_3.portToPinMapping["setObstacleFalse"] = "outObstacle"; } catch(e) {}
    try { ac_obstacleSens_3.portToPinMapping["setobstaclefalse"] = "outObstacle"; } catch(e) {}
    this.registerActivity("UnitEA", ac_obstacleSens_3);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.obstacleSens"] = ac_obstacleSens_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.obstaclesens"] = ac_obstacleSens_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["obstacleSens"] = ac_obstacleSens_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["obstaclesens"] = ac_obstacleSens_3; } catch(e) {}
    const ac_driveSys_3 = new AC_PkgScenarios_UnitEA(
      "UnitEA",
      "RobAFISSystemCP.driveSys",
      ["dirIn"],
      [{"from":"outUnitNavLine","to":"leavePA"},{"from":"outUnitNavLine","to":"turnRight"},{"from":"outUnitNavLine","to":"returnJourney"},{"from":"outUnitNavPad","to":"detectGreenPad"},{"from":"outUnitNavPad","to":"detectRedPad"},{"from":"outUnitNavPad","to":"stopAtT"},{"from":"outUnitNavPad","to":"routeToSA"},{"from":"outUnitNavPad","to":"routeToSPD"},{"from":"outUnitNavPad","to":"stopAtSPE"},{"from":"outUnitNavPad","to":"arriveAtTargetStock"},{"from":"outUnitPieceColor","to":"extractPieceT"},{"from":"outSPEPieceColor","to":"extractPieceSPE"},{"from":"outUnitPAColor","to":"arriveAtPA"},{"from":"outObstacle","to":"setObstacleTrue"},{"from":"outObstacle","to":"setObstacleFalse"}],
      {"outParameters":[{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitPieceColor","type":"Real","direction":"out"},{"name":"outSPEPieceColor","type":"Real","direction":"out"},{"name":"outUnitPAColor","type":"Real","direction":"out"},{"name":"outObstacle","type":"Real","direction":"out"},{"name":"outObstacle","type":"Real","direction":"out"}]}
    );
    try { ac_driveSys_3.portToPinMapping["leavePA"] = "outUnitNavLine"; } catch(e) {}
    try { ac_driveSys_3.portToPinMapping["leavepa"] = "outUnitNavLine"; } catch(e) {}
    try { ac_driveSys_3.portToPinMapping["turnRight"] = "outUnitNavLine"; } catch(e) {}
    try { ac_driveSys_3.portToPinMapping["turnright"] = "outUnitNavLine"; } catch(e) {}
    try { ac_driveSys_3.portToPinMapping["returnJourney"] = "outUnitNavLine"; } catch(e) {}
    try { ac_driveSys_3.portToPinMapping["returnjourney"] = "outUnitNavLine"; } catch(e) {}
    try { ac_driveSys_3.portToPinMapping["detectGreenPad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_driveSys_3.portToPinMapping["detectgreenpad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_driveSys_3.portToPinMapping["detectRedPad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_driveSys_3.portToPinMapping["detectredpad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_driveSys_3.portToPinMapping["stopAtT"] = "outUnitNavPad"; } catch(e) {}
    try { ac_driveSys_3.portToPinMapping["stopatt"] = "outUnitNavPad"; } catch(e) {}
    try { ac_driveSys_3.portToPinMapping["routeToSA"] = "outUnitNavPad"; } catch(e) {}
    try { ac_driveSys_3.portToPinMapping["routetosa"] = "outUnitNavPad"; } catch(e) {}
    try { ac_driveSys_3.portToPinMapping["routeToSPD"] = "outUnitNavPad"; } catch(e) {}
    try { ac_driveSys_3.portToPinMapping["routetospd"] = "outUnitNavPad"; } catch(e) {}
    try { ac_driveSys_3.portToPinMapping["stopAtSPE"] = "outUnitNavPad"; } catch(e) {}
    try { ac_driveSys_3.portToPinMapping["stopatspe"] = "outUnitNavPad"; } catch(e) {}
    try { ac_driveSys_3.portToPinMapping["arriveAtTargetStock"] = "outUnitNavPad"; } catch(e) {}
    try { ac_driveSys_3.portToPinMapping["arriveattargetstock"] = "outUnitNavPad"; } catch(e) {}
    try { ac_driveSys_3.portToPinMapping["extractPieceT"] = "outUnitPieceColor"; } catch(e) {}
    try { ac_driveSys_3.portToPinMapping["extractpiecet"] = "outUnitPieceColor"; } catch(e) {}
    try { ac_driveSys_3.portToPinMapping["extractPieceSPE"] = "outSPEPieceColor"; } catch(e) {}
    try { ac_driveSys_3.portToPinMapping["extractpiecespe"] = "outSPEPieceColor"; } catch(e) {}
    try { ac_driveSys_3.portToPinMapping["arriveAtPA"] = "outUnitPAColor"; } catch(e) {}
    try { ac_driveSys_3.portToPinMapping["arriveatpa"] = "outUnitPAColor"; } catch(e) {}
    try { ac_driveSys_3.portToPinMapping["setObstacleTrue"] = "outObstacle"; } catch(e) {}
    try { ac_driveSys_3.portToPinMapping["setobstacletrue"] = "outObstacle"; } catch(e) {}
    try { ac_driveSys_3.portToPinMapping["setObstacleFalse"] = "outObstacle"; } catch(e) {}
    try { ac_driveSys_3.portToPinMapping["setobstaclefalse"] = "outObstacle"; } catch(e) {}
    this.registerActivity("UnitEA", ac_driveSys_3);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.driveSys"] = ac_driveSys_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.drivesys"] = ac_driveSys_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["driveSys"] = ac_driveSys_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["drivesys"] = ac_driveSys_3; } catch(e) {}
    const ac_grabber_3 = new AC_PkgScenarios_UnitEA(
      "UnitEA",
      "RobAFISSystemCP.grabber",
      ["cmdIn"],
      [{"from":"outUnitNavLine","to":"leavePA"},{"from":"outUnitNavLine","to":"turnRight"},{"from":"outUnitNavLine","to":"returnJourney"},{"from":"outUnitNavPad","to":"detectGreenPad"},{"from":"outUnitNavPad","to":"detectRedPad"},{"from":"outUnitNavPad","to":"stopAtT"},{"from":"outUnitNavPad","to":"routeToSA"},{"from":"outUnitNavPad","to":"routeToSPD"},{"from":"outUnitNavPad","to":"stopAtSPE"},{"from":"outUnitNavPad","to":"arriveAtTargetStock"},{"from":"outUnitPieceColor","to":"extractPieceT"},{"from":"outSPEPieceColor","to":"extractPieceSPE"},{"from":"outUnitPAColor","to":"arriveAtPA"},{"from":"outObstacle","to":"setObstacleTrue"},{"from":"outObstacle","to":"setObstacleFalse"}],
      {"outParameters":[{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitPieceColor","type":"Real","direction":"out"},{"name":"outSPEPieceColor","type":"Real","direction":"out"},{"name":"outUnitPAColor","type":"Real","direction":"out"},{"name":"outObstacle","type":"Real","direction":"out"},{"name":"outObstacle","type":"Real","direction":"out"}]}
    );
    try { ac_grabber_3.portToPinMapping["leavePA"] = "outUnitNavLine"; } catch(e) {}
    try { ac_grabber_3.portToPinMapping["leavepa"] = "outUnitNavLine"; } catch(e) {}
    try { ac_grabber_3.portToPinMapping["turnRight"] = "outUnitNavLine"; } catch(e) {}
    try { ac_grabber_3.portToPinMapping["turnright"] = "outUnitNavLine"; } catch(e) {}
    try { ac_grabber_3.portToPinMapping["returnJourney"] = "outUnitNavLine"; } catch(e) {}
    try { ac_grabber_3.portToPinMapping["returnjourney"] = "outUnitNavLine"; } catch(e) {}
    try { ac_grabber_3.portToPinMapping["detectGreenPad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_grabber_3.portToPinMapping["detectgreenpad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_grabber_3.portToPinMapping["detectRedPad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_grabber_3.portToPinMapping["detectredpad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_grabber_3.portToPinMapping["stopAtT"] = "outUnitNavPad"; } catch(e) {}
    try { ac_grabber_3.portToPinMapping["stopatt"] = "outUnitNavPad"; } catch(e) {}
    try { ac_grabber_3.portToPinMapping["routeToSA"] = "outUnitNavPad"; } catch(e) {}
    try { ac_grabber_3.portToPinMapping["routetosa"] = "outUnitNavPad"; } catch(e) {}
    try { ac_grabber_3.portToPinMapping["routeToSPD"] = "outUnitNavPad"; } catch(e) {}
    try { ac_grabber_3.portToPinMapping["routetospd"] = "outUnitNavPad"; } catch(e) {}
    try { ac_grabber_3.portToPinMapping["stopAtSPE"] = "outUnitNavPad"; } catch(e) {}
    try { ac_grabber_3.portToPinMapping["stopatspe"] = "outUnitNavPad"; } catch(e) {}
    try { ac_grabber_3.portToPinMapping["arriveAtTargetStock"] = "outUnitNavPad"; } catch(e) {}
    try { ac_grabber_3.portToPinMapping["arriveattargetstock"] = "outUnitNavPad"; } catch(e) {}
    try { ac_grabber_3.portToPinMapping["extractPieceT"] = "outUnitPieceColor"; } catch(e) {}
    try { ac_grabber_3.portToPinMapping["extractpiecet"] = "outUnitPieceColor"; } catch(e) {}
    try { ac_grabber_3.portToPinMapping["extractPieceSPE"] = "outSPEPieceColor"; } catch(e) {}
    try { ac_grabber_3.portToPinMapping["extractpiecespe"] = "outSPEPieceColor"; } catch(e) {}
    try { ac_grabber_3.portToPinMapping["arriveAtPA"] = "outUnitPAColor"; } catch(e) {}
    try { ac_grabber_3.portToPinMapping["arriveatpa"] = "outUnitPAColor"; } catch(e) {}
    try { ac_grabber_3.portToPinMapping["setObstacleTrue"] = "outObstacle"; } catch(e) {}
    try { ac_grabber_3.portToPinMapping["setobstacletrue"] = "outObstacle"; } catch(e) {}
    try { ac_grabber_3.portToPinMapping["setObstacleFalse"] = "outObstacle"; } catch(e) {}
    try { ac_grabber_3.portToPinMapping["setobstaclefalse"] = "outObstacle"; } catch(e) {}
    this.registerActivity("UnitEA", ac_grabber_3);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.grabber"] = ac_grabber_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.grabber"] = ac_grabber_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["grabber"] = ac_grabber_3; } catch(e) {}
    const ac_controller_2 = new AC_PkgScenarios_UnitEA(
      "UnitEA",
      "RobAFISSystemCP.controller",
      ["controller_inParam"],
      [{"from":"outUnitNavLine","to":"leavePA"},{"from":"outUnitNavLine","to":"turnRight"},{"from":"outUnitNavLine","to":"returnJourney"},{"from":"outUnitNavPad","to":"detectGreenPad"},{"from":"outUnitNavPad","to":"detectRedPad"},{"from":"outUnitNavPad","to":"stopAtT"},{"from":"outUnitNavPad","to":"routeToSA"},{"from":"outUnitNavPad","to":"routeToSPD"},{"from":"outUnitNavPad","to":"stopAtSPE"},{"from":"outUnitNavPad","to":"arriveAtTargetStock"},{"from":"outUnitPieceColor","to":"extractPieceT"},{"from":"outSPEPieceColor","to":"extractPieceSPE"},{"from":"outUnitPAColor","to":"arriveAtPA"},{"from":"outObstacle","to":"setObstacleTrue"},{"from":"outObstacle","to":"setObstacleFalse"}],
      {"outParameters":[{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitPieceColor","type":"Real","direction":"out"},{"name":"outSPEPieceColor","type":"Real","direction":"out"},{"name":"outUnitPAColor","type":"Real","direction":"out"},{"name":"outObstacle","type":"Real","direction":"out"},{"name":"outObstacle","type":"Real","direction":"out"}]}
    );
    try { ac_controller_2.portToPinMapping["leavePA"] = "outUnitNavLine"; } catch(e) {}
    try { ac_controller_2.portToPinMapping["leavepa"] = "outUnitNavLine"; } catch(e) {}
    try { ac_controller_2.portToPinMapping["turnRight"] = "outUnitNavLine"; } catch(e) {}
    try { ac_controller_2.portToPinMapping["turnright"] = "outUnitNavLine"; } catch(e) {}
    try { ac_controller_2.portToPinMapping["returnJourney"] = "outUnitNavLine"; } catch(e) {}
    try { ac_controller_2.portToPinMapping["returnjourney"] = "outUnitNavLine"; } catch(e) {}
    try { ac_controller_2.portToPinMapping["detectGreenPad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_controller_2.portToPinMapping["detectgreenpad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_controller_2.portToPinMapping["detectRedPad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_controller_2.portToPinMapping["detectredpad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_controller_2.portToPinMapping["stopAtT"] = "outUnitNavPad"; } catch(e) {}
    try { ac_controller_2.portToPinMapping["stopatt"] = "outUnitNavPad"; } catch(e) {}
    try { ac_controller_2.portToPinMapping["routeToSA"] = "outUnitNavPad"; } catch(e) {}
    try { ac_controller_2.portToPinMapping["routetosa"] = "outUnitNavPad"; } catch(e) {}
    try { ac_controller_2.portToPinMapping["routeToSPD"] = "outUnitNavPad"; } catch(e) {}
    try { ac_controller_2.portToPinMapping["routetospd"] = "outUnitNavPad"; } catch(e) {}
    try { ac_controller_2.portToPinMapping["stopAtSPE"] = "outUnitNavPad"; } catch(e) {}
    try { ac_controller_2.portToPinMapping["stopatspe"] = "outUnitNavPad"; } catch(e) {}
    try { ac_controller_2.portToPinMapping["arriveAtTargetStock"] = "outUnitNavPad"; } catch(e) {}
    try { ac_controller_2.portToPinMapping["arriveattargetstock"] = "outUnitNavPad"; } catch(e) {}
    try { ac_controller_2.portToPinMapping["extractPieceT"] = "outUnitPieceColor"; } catch(e) {}
    try { ac_controller_2.portToPinMapping["extractpiecet"] = "outUnitPieceColor"; } catch(e) {}
    try { ac_controller_2.portToPinMapping["extractPieceSPE"] = "outSPEPieceColor"; } catch(e) {}
    try { ac_controller_2.portToPinMapping["extractpiecespe"] = "outSPEPieceColor"; } catch(e) {}
    try { ac_controller_2.portToPinMapping["arriveAtPA"] = "outUnitPAColor"; } catch(e) {}
    try { ac_controller_2.portToPinMapping["arriveatpa"] = "outUnitPAColor"; } catch(e) {}
    try { ac_controller_2.portToPinMapping["setObstacleTrue"] = "outObstacle"; } catch(e) {}
    try { ac_controller_2.portToPinMapping["setobstacletrue"] = "outObstacle"; } catch(e) {}
    try { ac_controller_2.portToPinMapping["setObstacleFalse"] = "outObstacle"; } catch(e) {}
    try { ac_controller_2.portToPinMapping["setobstaclefalse"] = "outObstacle"; } catch(e) {}
    this.registerActivity("UnitEA", ac_controller_2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.controller"] = ac_controller_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.controller"] = ac_controller_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["controller"] = ac_controller_2; } catch(e) {}
  }

}

function createModel(){ 
  const model = new SysADLModel();
  
  model.typeRegistry = {
    'PieceColor': 'EN_PieceColor',
    'MissionParameter': 'EN_MissionParameter',
    'StrategyParameter': 'EN_StrategyParameter',
    'MotorCommand': 'EN_MotorCommand',
    'Direction': 'EN_Direction',
    'NavColor': 'EN_NavColor',
  };
  
  // Module context for class resolution
  model._moduleContext = {
    PT_SysADL_Ports_ParameterIPT,
    PT_SysADL_Ports_ParameterOPT,
    PT_SysADL_Ports_StrategyIPT,
    PT_SysADL_Ports_StrategyOPT,
    PT_SysADL_Ports_PieceColorIPT,
    PT_SysADL_Ports_PieceColorOPT,
    PT_SysADL_Ports_BooleanIPT,
    PT_SysADL_Ports_BooleanOPT,
    PT_SysADL_Ports_DirectionIPT,
    PT_SysADL_Ports_DirectionOPT,
    PT_SysADL_Ports_CommandIPT,
    PT_SysADL_Ports_CommandOPT,
    PT_SysADL_Ports_IntIPT,
    PT_SysADL_Ports_IntOPT,
    PT_SysADL_Ports_NavColorIPT,
    PT_SysADL_Ports_NavColorOPT,
    PT_SysADL_Ports_MissionConfigIPT,
    PT_SysADL_Ports_MissionConfigOPT,
    PT_EnvPortsRobAFIS_InPieceColor,
    PT_EnvPortsRobAFIS_OutPieceColor,
    PT_EnvPortsRobAFIS_InNavColor,
    PT_EnvPortsRobAFIS_OutNavColor,
    PT_EnvPortsRobAFIS_InBoolean,
    PT_EnvPortsRobAFIS_OutBoolean,
    PT_EnvPortsRobAFIS_InParameter,
    PT_EnvPortsRobAFIS_OutParameter,
    PT_EnvPortsRobAFIS_InStrategy,
    PT_EnvPortsRobAFIS_OutStrategy,
    PT_EnvPortsRobAFIS_InMotorCommand,
    PT_EnvPortsRobAFIS_OutMotorCommand,
    PT_EnvPortsRobAFIS_InDirection,
    PT_EnvPortsRobAFIS_OutDirection,
    PT_EnvPortsRobAFIS_InInt,
    PT_EnvPortsRobAFIS_OutInt,
    PT_EnvPortsRobAFIS_InPresence,
    PT_EnvPortsRobAFIS_OutPresence,
    CN_SysADL_Connectors_ParamCN,
    CN_SysADL_Connectors_StrategyCN,
    CN_SysADL_Connectors_PieceColorCN,
    CN_SysADL_Connectors_BooleanCN,
    CN_SysADL_Connectors_DirectionCN,
    CN_SysADL_Connectors_CommandCN,
    CN_SysADL_Connectors_IntCN,
    CN_SysADL_Connectors_NavColorCN,
    CN_SysADL_Connectors_MissionConfigCN,
    CN_EnvConnectorsRobAFIS_PieceColorEnvCN,
    CN_EnvConnectorsRobAFIS_NavColorEnvCN,
    CN_EnvConnectorsRobAFIS_BooleanEnvCN,
    CN_EnvConnectorsRobAFIS_ParamEnvCN,
    CN_EnvConnectorsRobAFIS_StrategyEnvCN,
    CN_EnvConnectorsRobAFIS_DirectionEnvCN,
    CN_EnvConnectorsRobAFIS_MotorCommandEnvCN,
    CN_EnvConnectorsRobAFIS_IntEnvCN,
    CN_EnvConnectorsRobAFIS_ReadPresenceEnvCN,
    CN_EnvConnectorsRobAFIS_ReadPieceColorEnvCN,
    CN_EnvConnectorsRobAFIS_DetectPieceColorEnvCN,
    CN_EnvConnectorsRobAFIS_DetectParameterEnvCN,
    CN_EnvConnectorsRobAFIS_ReadParameterEnvCN,
    CN_EnvConnectorsRobAFIS_SendMotorCommandEnvCN,
    CN_EnvConnectorsRobAFIS_SendEnvironmentalDirectionEnvCN,
    CN_EnvConnectorsRobAFIS_SendPieceColorEnvCN,
    EX_SysADL_Execution_ConfigureMissionEX,
    EX_SysADL_Execution_DecideCommandEX,
    EX_SysADL_Execution_ExtractDirEX,
    EX_SysADL_Execution_VerifyCargoEX,
    EX_SysADL_Execution_ExtractGrabEX,
    EX_BoundaryExecution_PassBooleanEX,
    EX_BoundaryExecution_PassIntEX,
    EX_BoundaryExecution_PassNavColorEX,
    EX_BoundaryExecution_PassPieceColorEX,
    EX_BoundaryExecution_PassDirectionEX,
    EX_BoundaryExecution_PassMotorCommandEX,
    EX_BoundaryExecution_PassMissionParameterEX,
    EX_BoundaryExecution_PassStrategyParameterEX,
    EX_BoundaryExecution_MapDirectionToColorEX,
    EN_PieceColor,
    EN_MissionParameter,
    EN_StrategyParameter,
    EN_MotorCommand,
    EN_Direction,
    EN_NavColor,
    DT_MissionConfig,
    DT_RobotCommands,
  };
  
  // Initialize all connectors now that _moduleContext is available
  model.initializeAllConnectors();
  
  // Resolve constraints and executables for all registered activities
  Object.values(model._activities || {}).forEach(activity => {
    if (activity && activity.actions) {
      activity.actions.forEach(action => {
        if (action.constraintNames && action.constraintNames.length > 0) {
          action.resolveConstraints(model._moduleContext);
        }
        if (action.executableNames && action.executableNames.length > 0) {
          action.resolveExecutables(model._moduleContext);
        }
      });
    }
  });
  
  return model;
}

module.exports = { createModel, SysADLModel, EN_PieceColor, EN_MissionParameter, EN_StrategyParameter, EN_MotorCommand, EN_Direction, EN_NavColor, DT_MissionConfig, DT_RobotCommands, PT_SysADL_Ports_ParameterIPT, PT_SysADL_Ports_ParameterOPT, PT_SysADL_Ports_StrategyIPT, PT_SysADL_Ports_StrategyOPT, PT_SysADL_Ports_PieceColorIPT, PT_SysADL_Ports_PieceColorOPT, PT_SysADL_Ports_BooleanIPT, PT_SysADL_Ports_BooleanOPT, PT_SysADL_Ports_DirectionIPT, PT_SysADL_Ports_DirectionOPT, PT_SysADL_Ports_CommandIPT, PT_SysADL_Ports_CommandOPT, PT_SysADL_Ports_IntIPT, PT_SysADL_Ports_IntOPT, PT_SysADL_Ports_NavColorIPT, PT_SysADL_Ports_NavColorOPT, PT_SysADL_Ports_MissionConfigIPT, PT_SysADL_Ports_MissionConfigOPT, PT_EnvPortsRobAFIS_InPieceColor, PT_EnvPortsRobAFIS_OutPieceColor, PT_EnvPortsRobAFIS_InNavColor, PT_EnvPortsRobAFIS_OutNavColor, PT_EnvPortsRobAFIS_InBoolean, PT_EnvPortsRobAFIS_OutBoolean, PT_EnvPortsRobAFIS_InParameter, PT_EnvPortsRobAFIS_OutParameter, PT_EnvPortsRobAFIS_InStrategy, PT_EnvPortsRobAFIS_OutStrategy, PT_EnvPortsRobAFIS_InMotorCommand, PT_EnvPortsRobAFIS_OutMotorCommand, PT_EnvPortsRobAFIS_InDirection, PT_EnvPortsRobAFIS_OutDirection, PT_EnvPortsRobAFIS_InInt, PT_EnvPortsRobAFIS_OutInt, PT_EnvPortsRobAFIS_InPresence, PT_EnvPortsRobAFIS_OutPresence };