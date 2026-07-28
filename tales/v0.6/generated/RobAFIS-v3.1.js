
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
const PieceColor = EN_PieceColor;
const MissionParameter = EN_MissionParameter;
const StrategyParameter = EN_StrategyParameter;
const MotorCommand = EN_MotorCommand;
const Direction = EN_Direction;
const NavColor = EN_NavColor;
const MissionConfig = DT_MissionConfig;
const RobotCommands = DT_RobotCommands;

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
class CN_EnvConnectorsRobAFIS_OffsetEnvCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        outOffset: {
          portClass: 'PT_EnvPortsRobAFIS_OutInt',
          direction: 'out',
          dataType: 'Int',
          role: 'source'
        },
        inOffset: {
          portClass: 'PT_EnvPortsRobAFIS_InInt',
          direction: 'out',
          dataType: 'Int',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outOffset',
          to: 'inOffset',
          dataType: 'Int'
        }
      ]
    });
  }
}
class CN_EnvConnectorsRobAFIS_ObstacleEnvCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        outObstacle: {
          portClass: 'PT_EnvPortsRobAFIS_OutBoolean',
          direction: 'out',
          dataType: 'Boolean',
          role: 'source'
        },
        inObstacle: {
          portClass: 'PT_EnvPortsRobAFIS_InBoolean',
          direction: 'out',
          dataType: 'Boolean',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outObstacle',
          to: 'inObstacle',
          dataType: 'Boolean'
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
class CP_EnvComponentsRobAFIS_PieceEnvCP extends Component { }
class CP_EnvComponentsRobAFIS_ArrivalStockEnvCP extends Component { }
class CP_EnvComponentsRobAFIS_MachineZoneEnvCP extends Component { }
class CP_EnvComponentsRobAFIS_NavigationLineEnvCP extends Component { }
class CP_EnvComponentsRobAFIS_NavigationPadEnvCP extends Component { }
class CP_EnvComponentsRobAFIS_ObstacleEnvCP extends Component { }
class CP_EnvComponentsRobAFIS_HumanOperatorEnvCP extends Component { }
class CP_EnvComponentsRobAFIS_StandbyPositionEnvCP extends Component { }
class CP_EnvComponentsRobAFIS_TransElevatorEnvCP extends Component { }
class CP_EnvComponentsRobAFIS_SharedStockEnvCP extends Component { }
class CP_EnvComponentsRobAFIS_ProductionUnitEnvCP extends Component { }
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
      inParameters: [{"name":"envFloor","type":"NavColor","direction":"in"},{"name":"envPad","type":"NavColor","direction":"in"},{"name":"envStandby","type":"NavColor","direction":"in"},{"name":"envOffset","type":"Int","direction":"in"},{"name":"envZone","type":"NavColor","direction":"in"},{"name":"envPiece","type":"PieceColor","direction":"in"},{"name":"envSaPiece","type":"PieceColor","direction":"in"},{"name":"envSpePiece","type":"PieceColor","direction":"in"}],
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
      outParameters: [{"name":"envGrabT","type":"MotorCommand","direction":"out"},{"name":"envGrabSa","type":"MotorCommand","direction":"out"},{"name":"envGrabSpe","type":"MotorCommand","direction":"out"},{"name":"envGrabSpd","type":"MotorCommand","direction":"out"}]
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
      inParameters: [{"name":"inOpParam","type":"MissionParameter","direction":"in"},{"name":"inOpStrategy","type":"StrategyParameter","direction":"in"},{"name":"inLineOffset","type":"Int","direction":"in"},{"name":"inObstacle","type":"Boolean","direction":"in"},{"name":"inZoneAlarm","type":"Boolean","direction":"in"},{"name":"inTPieceColor","type":"PieceColor","direction":"in"},{"name":"inSPEPieceColor","type":"PieceColor","direction":"in"}],
      outParameters: [{"name":"outUnitNavLine","type":"NavColor","direction":"out"},{"name":"outUnitNavPad","type":"NavColor","direction":"out"},{"name":"outUnitPieceColor","type":"PieceColor","direction":"out"},{"name":"outSPEPieceColor","type":"PieceColor","direction":"out"},{"name":"outSAPieceColor","type":"PieceColor","direction":"out"},{"name":"outSPDPieceColor","type":"PieceColor","direction":"out"},{"name":"outUnitLineOffset","type":"Int","direction":"out"},{"name":"outUnitZoneAlarm","type":"Boolean","direction":"out"},{"name":"outUnitObstacle","type":"Boolean","direction":"out"},{"name":"outUnitPAColor","type":"NavColor","direction":"out"}]
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
      executables: ["SysADL.Execution.ConfigureMissionEX"],
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
      executables: ["SysADL.Execution.DecideCommandEX"],
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
      executables: ["SysADL.Execution.ExtractDirEX"],
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
      executables: ["SysADL.Execution.VerifyCargoEX"],
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
      executables: ["SysADL.Execution.ExtractGrabEX"],
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
      executables: ["BoundaryExecution.PassBooleanEX"],
    });
  }
}

// Action class: PassIntAN
class AN_PkgScenarios_PassIntAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"intIn","type":"Int","direction":"in"}],
      outParameters: [{"name":"PassIntAN","type":"Int","direction":"out"}],
      executables: ["BoundaryExecution.PassIntEX"],
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
      executables: ["BoundaryExecution.PassNavColorEX"],
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
      executables: ["BoundaryExecution.PassPieceColorEX"],
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
      executables: ["BoundaryExecution.PassDirectionEX"],
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
      executables: ["BoundaryExecution.PassMotorCommandEX"],
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
      executables: ["BoundaryExecution.PassMissionParameterEX"],
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
      executables: ["BoundaryExecution.PassStrategyParameterEX"],
    });
  }
}

// Action class: MultiplexPieceColorAN
class AN_BoundaryBehavior_MultiplexPieceColorAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"colorT","type":"PieceColor","direction":"in"},{"name":"colorSa","type":"PieceColor","direction":"in"},{"name":"colorSpe","type":"PieceColor","direction":"in"}],
      outParameters: [{"name":"MultiplexPieceColorAN","type":"PieceColor","direction":"out"}],
      executables: ["BoundaryExecution.MultiplexPieceColorEX"],
    });
  }
}

// Action class: MultiplexFloorColorAN
class AN_BoundaryBehavior_MultiplexFloorColorAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"floor","type":"NavColor","direction":"in"},{"name":"pad","type":"NavColor","direction":"in"},{"name":"standby","type":"NavColor","direction":"in"}],
      outParameters: [{"name":"MultiplexFloorColorAN","type":"NavColor","direction":"out"}],
      executables: ["BoundaryExecution.MultiplexFloorColorEX"],
    });
  }
}

// Action class: ProcessZoneAlarmAN
class AN_BoundaryBehavior_ProcessZoneAlarmAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"zoneColor","type":"NavColor","direction":"in"}],
      outParameters: [{"name":"ProcessZoneAlarmAN","type":"Boolean","direction":"out"}],
      executables: ["BoundaryExecution.ProcessZoneAlarmEX"],
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

// Executable class: MultiplexPieceColorEX
class EX_BoundaryExecution_MultiplexPieceColorEX extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"colorT","type":"PieceColor","direction":"in"},{"name":"colorSa","type":"PieceColor","direction":"in"},{"name":"colorSpe","type":"PieceColor","direction":"in"}],
      body: "executable def MultiplexPieceColorEX ( \n        in colorT : PieceColor , \n        in colorSa : PieceColor , \n        in colorSpe : PieceColor \n    ) : out PieceColor {\n        if (colorT != PieceColor::None) {\n            return colorT ;\n        }\n        if (colorSa != PieceColor::None) {\n            return colorSa ;\n        }\n        if (colorSpe != PieceColor::None) {\n            return colorSpe ;\n        }\n        return PieceColor::None ;\n    }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for colorT: (auto-detected from usage)
          // Type validation for colorSa: (auto-detected from usage)
          // Type validation for colorSpe: (auto-detected from usage)
          const { colorT, colorSa, colorSpe } = params;
          if (colorT != PieceColor.None) {
            return colorT ;
        }
        if (colorSa != PieceColor.None) {
            return colorSa ;
        }
        if (colorSpe != PieceColor.None) {
            return colorSpe ;
        }
        return PieceColor.None ;
        }
    });
  }
}

// Executable class: MultiplexFloorColorEX
class EX_BoundaryExecution_MultiplexFloorColorEX extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"floor","type":"NavColor","direction":"in"},{"name":"pad","type":"NavColor","direction":"in"},{"name":"standby","type":"NavColor","direction":"in"}],
      body: "executable def MultiplexFloorColorEX ( \n        in floor : NavColor , \n        in pad : NavColor , \n        in standby : NavColor \n    ) : out NavColor {\n        if (standby != NavColor::None) {\n            return standby ;\n        }\n        if (pad != NavColor::None) {\n            return pad ;\n        }\n        return floor ;\n    }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for floor: (auto-detected from usage)
          // Type validation for pad: (auto-detected from usage)
          // Type validation for standby: (auto-detected from usage)
          const { floor, pad, standby } = params;
          if (standby != NavColor.None) {
            return standby ;
        }
        if (pad != NavColor.None) {
            return pad ;
        }
        return floor ;
        }
    });
  }
}

// Executable class: ProcessZoneAlarmEX
class EX_BoundaryExecution_ProcessZoneAlarmEX extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"zoneColor","type":"NavColor","direction":"in"}],
      body: "executable def ProcessZoneAlarmEX ( in zoneColor : NavColor ) : out Boolean {\n        if (zoneColor == NavColor::Black) {\n            return true ;\n        }\n        return false ;\n    }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for zoneColor: (auto-detected from usage)
          const { zoneColor } = params;
          if (zoneColor == NavColor.Black) {
            return true ;
        }
        return false ;
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
    this.arrivalStock = new CP_EnvComponentsRobAFIS_ArrivalStockEnvCP("arrivalStock", { sysadlDefinition: "ArrivalStockEnvCP", portAliases: {} });
    this.addComponent(this.arrivalStock);
    this.instance1 = new CP_SysADL_Components_GrabberCP("instance1", { isBoundary: true, sysadlDefinition: "GrabberCP", portAliases: {} });
    this.addComponent(this.instance1);
    this.machineZone = new CP_EnvComponentsRobAFIS_MachineZoneEnvCP("machineZone", { sysadlDefinition: "MachineZoneEnvCP", portAliases: {} });
    this.addComponent(this.machineZone);
    this.navLine = new CP_EnvComponentsRobAFIS_NavigationLineEnvCP("navLine", { sysadlDefinition: "NavigationLineEnvCP", portAliases: {} });
    this.addComponent(this.navLine);
    this.navPad = new CP_EnvComponentsRobAFIS_NavigationPadEnvCP("navPad", { sysadlDefinition: "NavigationPadEnvCP", portAliases: {} });
    this.addComponent(this.navPad);
    this.obstacle = new CP_EnvComponentsRobAFIS_ObstacleEnvCP("obstacle", { sysadlDefinition: "ObstacleEnvCP", portAliases: {} });
    this.addComponent(this.obstacle);
    this.operator = new CP_EnvComponentsRobAFIS_HumanOperatorEnvCP("operator", { sysadlDefinition: "HumanOperatorEnvCP", portAliases: {} });
    this.addComponent(this.operator);
    this.pieces = new CP_EnvComponentsRobAFIS_PieceEnvCP("pieces", { sysadlDefinition: "PieceEnvCP", portAliases: {} });
    this.addComponent(this.pieces);
    this.pieces = new CP_EnvComponentsRobAFIS_PieceEnvCP("pieces", { sysadlDefinition: "PieceEnvCP", portAliases: {} });
    this.addComponent(this.pieces);
    this.pieces = new CP_EnvComponentsRobAFIS_PieceEnvCP("pieces", { sysadlDefinition: "PieceEnvCP", portAliases: {} });
    this.addComponent(this.pieces);
    this.spd1_spe2 = new CP_EnvComponentsRobAFIS_SharedStockEnvCP("spd1_spe2", { sysadlDefinition: "SharedStockEnvCP", portAliases: {} });
    this.addComponent(this.spd1_spe2);
    this.spe1_spd2 = new CP_EnvComponentsRobAFIS_SharedStockEnvCP("spe1_spd2", { sysadlDefinition: "SharedStockEnvCP", portAliases: {} });
    this.addComponent(this.spe1_spd2);
    this.standbyPos = new CP_EnvComponentsRobAFIS_StandbyPositionEnvCP("standbyPos", { sysadlDefinition: "StandbyPositionEnvCP", portAliases: {} });
    this.addComponent(this.standbyPos);
    this.transElevator = new CP_EnvComponentsRobAFIS_TransElevatorEnvCP("transElevator", { sysadlDefinition: "TransElevatorEnvCP", portAliases: {} });
    this.addComponent(this.transElevator);
    this.unit_camera = new CP_SysADL_Components_CameraSensorCP("unit_camera", { isBoundary: true, sysadlDefinition: "CameraSensorCP", portAliases: {} });
    this.addComponent(this.unit_camera);
    this.unit_obstacleSens = new CP_SysADL_Components_ObstacleSensorCP("unit_obstacleSens", { isBoundary: true, sysadlDefinition: "ObstacleSensorCP", portAliases: {} });
    this.addComponent(this.unit_obstacleSens);
    this.unit_pInput = new CP_SysADL_Components_ParameterInputCP("unit_pInput", { isBoundary: true, sysadlDefinition: "ParameterInputCP", portAliases: {} });
    this.addComponent(this.unit_pInput);
    this.unit1 = new CP_EnvComponentsRobAFIS_ProductionUnitEnvCP("unit1", { sysadlDefinition: "ProductionUnitEnvCP", portAliases: {} });
    this.addComponent(this.unit1);
    this.unit2 = new CP_EnvComponentsRobAFIS_ProductionUnitEnvCP("unit2", { sysadlDefinition: "ProductionUnitEnvCP", portAliases: {} });
    this.addComponent(this.unit2);
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
    const c_config1 = this.RobAFISSystemCP.controller.connectors["c_config1"];
    c_config1.bind(this.RobAFISSystemCP.controller.planner.getPort("planner_outConfig"), this.RobAFISSystemCP.controller.navigator.getPort("navigator_inConfig"));
    try { (function(){ const _binds = [{"source":"planner_outConfig","destination":"navigator_inConfig","left":"planner_outConfig","right":"navigator_inConfig"}]; _binds.forEach(b => { try { const left = String(b.left || b.source || b.from); const right = String(b.right || b.destination || b.to); Object.values(model._activities || {}).forEach(act => { try { if (act && act.portToPinMapping) { const mapped = act.portToPinMapping[right] || act.portToPinMapping[String(right).toLowerCase()]; if (mapped) { try { act.portToPinMapping[left] = mapped; } catch(e){} } else {  try { act.portToPinMapping[left] = right; } catch(e){} } } } catch(e){} }); } catch(e){} }); })(); } catch(e) {}
    this.RobAFISSystemCP.controller.addConnector(new CN_SysADL_Connectors_MissionConfigCN("c_config2"));
    const c_config2 = this.RobAFISSystemCP.controller.connectors["c_config2"];
    c_config2.bind(this.RobAFISSystemCP.controller.planner.getPort("planner_outConfig"), this.RobAFISSystemCP.controller.cargo.getPort("cargo_inConfig"));
    try { (function(){ const _binds = [{"source":"planner_outConfig","destination":"cargo_inConfig","left":"planner_outConfig","right":"cargo_inConfig"}]; _binds.forEach(b => { try { const left = String(b.left || b.source || b.from); const right = String(b.right || b.destination || b.to); Object.values(model._activities || {}).forEach(act => { try { if (act && act.portToPinMapping) { const mapped = act.portToPinMapping[right] || act.portToPinMapping[String(right).toLowerCase()]; if (mapped) { try { act.portToPinMapping[left] = mapped; } catch(e){} } else {  try { act.portToPinMapping[left] = right; } catch(e){} } } } catch(e){} }); } catch(e){} }); })(); } catch(e) {}
    this.RobAFISSystemCP.addConnector(new CN_SysADL_Connectors_ParamCN("c1"));
    const c1 = this.RobAFISSystemCP.connectors["c1"];
    c1.bind(this.RobAFISSystemCP.pInput.getPort("pOut"), this.RobAFISSystemCP.controller.getPort("controller_inParam"));
    try { (function(){ const _binds = [{"source":"pOut","destination":"controller_inParam","left":"pOut","right":"controller_inParam"}]; _binds.forEach(b => { try { const left = String(b.left || b.source || b.from); const right = String(b.right || b.destination || b.to); Object.values(model._activities || {}).forEach(act => { try { if (act && act.portToPinMapping) { const mapped = act.portToPinMapping[right] || act.portToPinMapping[String(right).toLowerCase()]; if (mapped) { try { act.portToPinMapping[left] = mapped; } catch(e){} } else {  try { act.portToPinMapping[left] = right; } catch(e){} } } } catch(e){} }); } catch(e){} }); })(); } catch(e) {}
    this.RobAFISSystemCP.addConnector(new CN_SysADL_Connectors_StrategyCN("c2"));
    const c2 = this.RobAFISSystemCP.connectors["c2"];
    c2.bind(this.RobAFISSystemCP.pInput.getPort("strategyOut"), this.RobAFISSystemCP.controller.getPort("controller_inStrategy"));
    try { (function(){ const _binds = [{"source":"strategyOut","destination":"controller_inStrategy","left":"strategyOut","right":"controller_inStrategy"}]; _binds.forEach(b => { try { const left = String(b.left || b.source || b.from); const right = String(b.right || b.destination || b.to); Object.values(model._activities || {}).forEach(act => { try { if (act && act.portToPinMapping) { const mapped = act.portToPinMapping[right] || act.portToPinMapping[String(right).toLowerCase()]; if (mapped) { try { act.portToPinMapping[left] = mapped; } catch(e){} } else {  try { act.portToPinMapping[left] = right; } catch(e){} } } } catch(e){} }); } catch(e){} }); })(); } catch(e) {}
    this.RobAFISSystemCP.addConnector(new CN_SysADL_Connectors_NavColorCN("c3"));
    const c3 = this.RobAFISSystemCP.connectors["c3"];
    c3.bind(this.RobAFISSystemCP.camera.getPort("floorColorOut"), this.RobAFISSystemCP.controller.getPort("controller_inFloorColor"));
    try { (function(){ const _binds = [{"source":"floorColorOut","destination":"controller_inFloorColor","left":"floorColorOut","right":"controller_inFloorColor"}]; _binds.forEach(b => { try { const left = String(b.left || b.source || b.from); const right = String(b.right || b.destination || b.to); Object.values(model._activities || {}).forEach(act => { try { if (act && act.portToPinMapping) { const mapped = act.portToPinMapping[right] || act.portToPinMapping[String(right).toLowerCase()]; if (mapped) { try { act.portToPinMapping[left] = mapped; } catch(e){} } else {  try { act.portToPinMapping[left] = right; } catch(e){} } } } catch(e){} }); } catch(e){} }); })(); } catch(e) {}
    this.RobAFISSystemCP.addConnector(new CN_SysADL_Connectors_IntCN("c4"));
    const c4 = this.RobAFISSystemCP.connectors["c4"];
    c4.bind(this.RobAFISSystemCP.camera.getPort("lineOffsetOut"), this.RobAFISSystemCP.controller.getPort("controller_inLineOffset"));
    try { (function(){ const _binds = [{"source":"lineOffsetOut","destination":"controller_inLineOffset","left":"lineOffsetOut","right":"controller_inLineOffset"}]; _binds.forEach(b => { try { const left = String(b.left || b.source || b.from); const right = String(b.right || b.destination || b.to); Object.values(model._activities || {}).forEach(act => { try { if (act && act.portToPinMapping) { const mapped = act.portToPinMapping[right] || act.portToPinMapping[String(right).toLowerCase()]; if (mapped) { try { act.portToPinMapping[left] = mapped; } catch(e){} } else {  try { act.portToPinMapping[left] = right; } catch(e){} } } } catch(e){} }); } catch(e){} }); })(); } catch(e) {}
    this.RobAFISSystemCP.addConnector(new CN_SysADL_Connectors_BooleanCN("c5"));
    const c5 = this.RobAFISSystemCP.connectors["c5"];
    c5.bind(this.RobAFISSystemCP.camera.getPort("zoneAlarmOut"), this.RobAFISSystemCP.controller.getPort("controller_inZoneAlarm"));
    try { (function(){ const _binds = [{"source":"zoneAlarmOut","destination":"controller_inZoneAlarm","left":"zoneAlarmOut","right":"controller_inZoneAlarm"}]; _binds.forEach(b => { try { const left = String(b.left || b.source || b.from); const right = String(b.right || b.destination || b.to); Object.values(model._activities || {}).forEach(act => { try { if (act && act.portToPinMapping) { const mapped = act.portToPinMapping[right] || act.portToPinMapping[String(right).toLowerCase()]; if (mapped) { try { act.portToPinMapping[left] = mapped; } catch(e){} } else {  try { act.portToPinMapping[left] = right; } catch(e){} } } } catch(e){} }); } catch(e){} }); })(); } catch(e) {}
    this.RobAFISSystemCP.addConnector(new CN_SysADL_Connectors_BooleanCN("c6"));
    const c6 = this.RobAFISSystemCP.connectors["c6"];
    c6.bind(this.RobAFISSystemCP.obstacleSens.getPort("obstacleOut"), this.RobAFISSystemCP.controller.getPort("controller_inObstacle"));
    try { (function(){ const _binds = [{"source":"obstacleOut","destination":"controller_inObstacle","left":"obstacleOut","right":"controller_inObstacle"}]; _binds.forEach(b => { try { const left = String(b.left || b.source || b.from); const right = String(b.right || b.destination || b.to); Object.values(model._activities || {}).forEach(act => { try { if (act && act.portToPinMapping) { const mapped = act.portToPinMapping[right] || act.portToPinMapping[String(right).toLowerCase()]; if (mapped) { try { act.portToPinMapping[left] = mapped; } catch(e){} } else {  try { act.portToPinMapping[left] = right; } catch(e){} } } } catch(e){} }); } catch(e){} }); })(); } catch(e) {}
    this.RobAFISSystemCP.addConnector(new CN_SysADL_Connectors_PieceColorCN("c7"));
    const c7 = this.RobAFISSystemCP.connectors["c7"];
    c7.bind(this.RobAFISSystemCP.camera.getPort("pieceColorOut"), this.RobAFISSystemCP.controller.getPort("controller_inPieceColor"));
    try { (function(){ const _binds = [{"source":"pieceColorOut","destination":"controller_inPieceColor","left":"pieceColorOut","right":"controller_inPieceColor"}]; _binds.forEach(b => { try { const left = String(b.left || b.source || b.from); const right = String(b.right || b.destination || b.to); Object.values(model._activities || {}).forEach(act => { try { if (act && act.portToPinMapping) { const mapped = act.portToPinMapping[right] || act.portToPinMapping[String(right).toLowerCase()]; if (mapped) { try { act.portToPinMapping[left] = mapped; } catch(e){} } else {  try { act.portToPinMapping[left] = right; } catch(e){} } } } catch(e){} }); } catch(e){} }); })(); } catch(e) {}
    this.RobAFISSystemCP.addConnector(new CN_SysADL_Connectors_DirectionCN("c8"));
    const c8 = this.RobAFISSystemCP.connectors["c8"];
    c8.bind(this.RobAFISSystemCP.controller.getPort("controller_outDir"), this.RobAFISSystemCP.driveSys.getPort("dirIn"));
    try { (function(){ const _binds = [{"source":"controller_outDir","destination":"dirIn","left":"controller_outDir","right":"dirIn"}]; _binds.forEach(b => { try { const left = String(b.left || b.source || b.from); const right = String(b.right || b.destination || b.to); Object.values(model._activities || {}).forEach(act => { try { if (act && act.portToPinMapping) { const mapped = act.portToPinMapping[right] || act.portToPinMapping[String(right).toLowerCase()]; if (mapped) { try { act.portToPinMapping[left] = mapped; } catch(e){} } else {  try { act.portToPinMapping[left] = right; } catch(e){} } } } catch(e){} }); } catch(e){} }); })(); } catch(e) {}
    this.RobAFISSystemCP.addConnector(new CN_SysADL_Connectors_CommandCN("c9"));
    try { this.RobAFISSystemCP.connectors["c9"].activityName = "DecideCommandAC"; } catch(e) {}
    const c9 = this.RobAFISSystemCP.connectors["c9"];
    c9.bind(this.RobAFISSystemCP.controller.getPort("controller_outGrab"), this.RobAFISSystemCP.grabber.getPort("cmdIn"));
    try { (function(){ const _binds = [{"source":"controller_outGrab","destination":"cmdIn","left":"controller_outGrab","right":"cmdIn"}]; _binds.forEach(b => { try { const left = String(b.left || b.source || b.from); const right = String(b.right || b.destination || b.to); Object.values(model._activities || {}).forEach(act => { try { if (act && act.portToPinMapping) { const mapped = act.portToPinMapping[right] || act.portToPinMapping[String(right).toLowerCase()]; if (mapped) { try { act.portToPinMapping[left] = mapped; } catch(e){} } else {  try { act.portToPinMapping[left] = right; } catch(e){} } } } catch(e){} }); } catch(e){} }); })(); } catch(e) {}

    const ac_planner = new AC_SysADL_Behavior_MissionPlannerAC(
      "MissionPlannerAC",
      "RobAFISSystemCP.controller.planner",
      ["planner_inParam","planner_inStrategy"],
      [{"from":"actParam","to":"paramIn"},{"from":"actStrategy","to":"strategyIn"},{"from":"actConfig","to":"configAct"}],
      {"outParameters":[{"name":"actParam","type":"Real","direction":"out"},{"name":"actStrategy","type":"Real","direction":"out"},{"name":"actConfig","type":"Real","direction":"out"}]}
    );
    const configAct = new AN_SysADL_Behavior_ConfigureMissionAN("configAct", { usingPins: ["paramIn","strategyIn"] });
    ac_planner.registerAction(configAct);
    try { ac_planner.portToPinMapping["paramIn"] = "actParam"; } catch(e) {}
    try { ac_planner.portToPinMapping["paramin"] = "actParam"; } catch(e) {}
    try { ac_planner.portToPinMapping["strategyIn"] = "actStrategy"; } catch(e) {}
    try { ac_planner.portToPinMapping["strategyin"] = "actStrategy"; } catch(e) {}
    try { ac_planner.portToPinMapping["configAct"] = "actConfig"; } catch(e) {}
    try { ac_planner.portToPinMapping["configact"] = "actConfig"; } catch(e) {}
    try { ac_planner.portToPinMapping["planner_inParam"] = "actParam"; } catch(e) {}
    try { ac_planner.portToPinMapping["planner_inparam"] = "actParam"; } catch(e) {}
    try { ac_planner.portToPinMapping["planner_inStrategy"] = "actStrategy"; } catch(e) {}
    try { ac_planner.portToPinMapping["planner_instrategy"] = "actStrategy"; } catch(e) {}
    this.registerActivity("MissionPlannerAC", ac_planner);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.controller.planner"] = ac_planner; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.controller.planner"] = ac_planner; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["controller.planner"] = ac_planner; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["planner"] = ac_planner; } catch(e) {}
    const ac_navigator = new AC_SysADL_Behavior_NavigatorAC(
      "NavigatorAC",
      "RobAFISSystemCP.controller.navigator",
      ["navigator_inFloorColor","navigator_inLineOffset","navigator_inZoneAlarm","navigator_inObstacle","navigator_inConfig"],
      [{"from":"actFloorColor","to":"decFloorColor"},{"from":"actLineOffset","to":"decOffset"},{"from":"actZoneAlarm","to":"decZoneAlarm"},{"from":"actObstacle","to":"decObstacle"},{"from":"actConfig","to":"decConfig"},{"from":"actDir","to":"extDirAct"}],
      {"outParameters":[{"name":"actFloorColor","type":"Real","direction":"out"},{"name":"actLineOffset","type":"Real","direction":"out"},{"name":"actZoneAlarm","type":"Real","direction":"out"},{"name":"actObstacle","type":"Real","direction":"out"},{"name":"actConfig","type":"Real","direction":"out"},{"name":"actDir","type":"Real","direction":"out"}]}
    );
    const navAct = new AN_SysADL_Behavior_DecideCommandAN("navAct", { usingPins: ["decFloorColor","decOffset","decZoneAlarm","decObstacle","decConfig"] });
    ac_navigator.registerAction(navAct);
    const extDirAct = new AN_SysADL_Behavior_ExtractDirAN("extDirAct", { usingPins: ["extDirCmd"] });
    ac_navigator.registerAction(extDirAct);
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
    try { ac_navigator.portToPinMapping["navigator_inFloorColor"] = "actFloorColor"; } catch(e) {}
    try { ac_navigator.portToPinMapping["navigator_infloorcolor"] = "actFloorColor"; } catch(e) {}
    try { ac_navigator.portToPinMapping["navigator_inLineOffset"] = "actLineOffset"; } catch(e) {}
    try { ac_navigator.portToPinMapping["navigator_inlineoffset"] = "actLineOffset"; } catch(e) {}
    try { ac_navigator.portToPinMapping["navigator_inZoneAlarm"] = "actZoneAlarm"; } catch(e) {}
    try { ac_navigator.portToPinMapping["navigator_inzonealarm"] = "actZoneAlarm"; } catch(e) {}
    try { ac_navigator.portToPinMapping["navigator_inObstacle"] = "actObstacle"; } catch(e) {}
    try { ac_navigator.portToPinMapping["navigator_inobstacle"] = "actObstacle"; } catch(e) {}
    try { ac_navigator.portToPinMapping["navigator_inConfig"] = "actConfig"; } catch(e) {}
    try { ac_navigator.portToPinMapping["navigator_inconfig"] = "actConfig"; } catch(e) {}
    this.registerActivity("NavigatorAC", ac_navigator);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.controller.navigator"] = ac_navigator; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.controller.navigator"] = ac_navigator; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["controller.navigator"] = ac_navigator; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["navigator"] = ac_navigator; } catch(e) {}
    const ac_cargo = new AC_SysADL_Behavior_CargoHandlerAC(
      "CargoHandlerAC",
      "RobAFISSystemCP.controller.cargo",
      ["cargo_inPieceColor","cargo_inConfig"],
      [{"from":"actPieceColor","to":"cargoPieceColor"},{"from":"actConfig","to":"cargoConfig"},{"from":"actGrab","to":"extGrabAct"}],
      {"outParameters":[{"name":"actPieceColor","type":"Real","direction":"out"},{"name":"actConfig","type":"Real","direction":"out"},{"name":"actGrab","type":"Real","direction":"out"}]}
    );
    const cargoAct = new AN_SysADL_Behavior_VerifyCargoAN("cargoAct", { usingPins: ["cargoPieceColor","cargoConfig"] });
    ac_cargo.registerAction(cargoAct);
    const extGrabAct = new AN_SysADL_Behavior_ExtractGrabAN("extGrabAct", { usingPins: ["extGrabCmd"] });
    ac_cargo.registerAction(extGrabAct);
    try { ac_cargo.portToPinMapping["cargoPieceColor"] = "actPieceColor"; } catch(e) {}
    try { ac_cargo.portToPinMapping["cargopiececolor"] = "actPieceColor"; } catch(e) {}
    try { ac_cargo.portToPinMapping["cargoConfig"] = "actConfig"; } catch(e) {}
    try { ac_cargo.portToPinMapping["cargoconfig"] = "actConfig"; } catch(e) {}
    try { ac_cargo.portToPinMapping["extGrabAct"] = "actGrab"; } catch(e) {}
    try { ac_cargo.portToPinMapping["extgrabact"] = "actGrab"; } catch(e) {}
    try { ac_cargo.portToPinMapping["cargo_inPieceColor"] = "actPieceColor"; } catch(e) {}
    try { ac_cargo.portToPinMapping["cargo_inpiececolor"] = "actPieceColor"; } catch(e) {}
    try { ac_cargo.portToPinMapping["cargo_inConfig"] = "actConfig"; } catch(e) {}
    try { ac_cargo.portToPinMapping["cargo_inconfig"] = "actConfig"; } catch(e) {}
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
    const passP = new AN_PkgScenarios_PassMissionParameterAN("passP", { usingPins: ["paramIn","paramOut"] });
    ac_pInput.registerAction(passP);
    const passS = new AN_PkgScenarios_PassStrategyParameterAN("passS", { usingPins: ["strategyIn","strategyOut"] });
    ac_pInput.registerAction(passS);
    try { ac_pInput.portToPinMapping["passP.paramIn"] = "envParam"; } catch(e) {}
    try { ac_pInput.portToPinMapping["passp.paramin"] = "envParam"; } catch(e) {}
    try { ac_pInput.portToPinMapping["passP.paramOut"] = "sysParam"; } catch(e) {}
    try { ac_pInput.portToPinMapping["passp.paramout"] = "sysParam"; } catch(e) {}
    try { ac_pInput.portToPinMapping["passS.strategyIn"] = "envStrategy"; } catch(e) {}
    try { ac_pInput.portToPinMapping["passs.strategyin"] = "envStrategy"; } catch(e) {}
    try { ac_pInput.portToPinMapping["passS.strategyOut"] = "sysStrategy"; } catch(e) {}
    try { ac_pInput.portToPinMapping["passs.strategyout"] = "sysStrategy"; } catch(e) {}
    try { ac_pInput.portToPinMapping["pOut"] = "envParam"; } catch(e) {}
    try { ac_pInput.portToPinMapping["pout"] = "envParam"; } catch(e) {}
    this.registerActivity("ParameterInputAC", ac_pInput);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.pInput"] = ac_pInput; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.pinput"] = ac_pInput; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["pInput"] = ac_pInput; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["pinput"] = ac_pInput; } catch(e) {}
    const ac_unit_pInput = new AC_BoundaryBehavior_ParameterInputAC(
      "ParameterInputAC",
      "unit_pInput",
      ["pOut"],
      [{"from":"envParam","to":"passP.paramIn"},{"from":"sysParam","to":"passP.paramOut"},{"from":"envStrategy","to":"passS.strategyIn"},{"from":"sysStrategy","to":"passS.strategyOut"}],
      {"outParameters":[{"name":"envParam","type":"Real","direction":"out"},{"name":"sysParam","type":"Real","direction":"out"},{"name":"envStrategy","type":"Real","direction":"out"},{"name":"sysStrategy","type":"Real","direction":"out"}]}
    );
    const passP_2 = new AN_PkgScenarios_PassMissionParameterAN("passP", { usingPins: ["paramIn","paramOut"] });
    ac_unit_pInput.registerAction(passP_2);
    const passS_2 = new AN_PkgScenarios_PassStrategyParameterAN("passS", { usingPins: ["strategyIn","strategyOut"] });
    ac_unit_pInput.registerAction(passS_2);
    try { ac_unit_pInput.portToPinMapping["passP.paramIn"] = "envParam"; } catch(e) {}
    try { ac_unit_pInput.portToPinMapping["passp.paramin"] = "envParam"; } catch(e) {}
    try { ac_unit_pInput.portToPinMapping["passP.paramOut"] = "sysParam"; } catch(e) {}
    try { ac_unit_pInput.portToPinMapping["passp.paramout"] = "sysParam"; } catch(e) {}
    try { ac_unit_pInput.portToPinMapping["passS.strategyIn"] = "envStrategy"; } catch(e) {}
    try { ac_unit_pInput.portToPinMapping["passs.strategyin"] = "envStrategy"; } catch(e) {}
    try { ac_unit_pInput.portToPinMapping["passS.strategyOut"] = "sysStrategy"; } catch(e) {}
    try { ac_unit_pInput.portToPinMapping["passs.strategyout"] = "sysStrategy"; } catch(e) {}
    try { ac_unit_pInput.portToPinMapping["pOut"] = "envParam"; } catch(e) {}
    try { ac_unit_pInput.portToPinMapping["pout"] = "envParam"; } catch(e) {}
    this.registerActivity("ParameterInputAC", ac_unit_pInput);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["unit_pInput"] = ac_unit_pInput; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["unit_pinput"] = ac_unit_pInput; } catch(e) {}
    const ac_camera = new AC_BoundaryBehavior_CameraSensorAC(
      "CameraSensorAC",
      "RobAFISSystemCP.camera",
      ["floorColorOut"],
      [{"from":"envFloor","to":"floor"},{"from":"envPad","to":"pad"},{"from":"envStandby","to":"standby"},{"from":"sysFloor","to":"floorOut"},{"from":"envOffset","to":"intIn"},{"from":"sysOffset","to":"intOut"},{"from":"envZone","to":"zoneColor"},{"from":"sysZone","to":"alarmOut"},{"from":"envPiece","to":"colorT"},{"from":"envSaPiece","to":"colorSa"},{"from":"envSpePiece","to":"colorSpe"},{"from":"sysPiece","to":"pieceOut"}],
      {"outParameters":[{"name":"envFloor","type":"Real","direction":"out"},{"name":"envPad","type":"Real","direction":"out"},{"name":"envStandby","type":"Real","direction":"out"},{"name":"sysFloor","type":"Real","direction":"out"},{"name":"envOffset","type":"Real","direction":"out"},{"name":"sysOffset","type":"Real","direction":"out"},{"name":"envZone","type":"Real","direction":"out"},{"name":"sysZone","type":"Real","direction":"out"},{"name":"envPiece","type":"Real","direction":"out"},{"name":"envSaPiece","type":"Real","direction":"out"},{"name":"envSpePiece","type":"Real","direction":"out"},{"name":"sysPiece","type":"Real","direction":"out"}]}
    );
    const muxF = new AN_BoundaryBehavior_MultiplexFloorColorAN("muxF", { usingPins: ["floor","pad","standby","floorOut"] });
    ac_camera.registerAction(muxF);
    const passO = new AN_PkgScenarios_PassIntAN("passO", { usingPins: ["intIn","intOut"] });
    ac_camera.registerAction(passO);
    const detectZ = new AN_BoundaryBehavior_ProcessZoneAlarmAN("detectZ", { usingPins: ["zoneColor","alarmOut"] });
    ac_camera.registerAction(detectZ);
    const muxP = new AN_BoundaryBehavior_MultiplexPieceColorAN("muxP", { usingPins: ["colorT","colorSa","colorSpe","pieceOut"] });
    ac_camera.registerAction(muxP);
    try { ac_camera.portToPinMapping["floor"] = "envFloor"; } catch(e) {}
    try { ac_camera.portToPinMapping["floor"] = "envFloor"; } catch(e) {}
    try { ac_camera.portToPinMapping["pad"] = "envPad"; } catch(e) {}
    try { ac_camera.portToPinMapping["pad"] = "envPad"; } catch(e) {}
    try { ac_camera.portToPinMapping["standby"] = "envStandby"; } catch(e) {}
    try { ac_camera.portToPinMapping["standby"] = "envStandby"; } catch(e) {}
    try { ac_camera.portToPinMapping["floorOut"] = "sysFloor"; } catch(e) {}
    try { ac_camera.portToPinMapping["floorout"] = "sysFloor"; } catch(e) {}
    try { ac_camera.portToPinMapping["intIn"] = "envOffset"; } catch(e) {}
    try { ac_camera.portToPinMapping["intin"] = "envOffset"; } catch(e) {}
    try { ac_camera.portToPinMapping["intOut"] = "sysOffset"; } catch(e) {}
    try { ac_camera.portToPinMapping["intout"] = "sysOffset"; } catch(e) {}
    try { ac_camera.portToPinMapping["zoneColor"] = "envZone"; } catch(e) {}
    try { ac_camera.portToPinMapping["zonecolor"] = "envZone"; } catch(e) {}
    try { ac_camera.portToPinMapping["alarmOut"] = "sysZone"; } catch(e) {}
    try { ac_camera.portToPinMapping["alarmout"] = "sysZone"; } catch(e) {}
    try { ac_camera.portToPinMapping["colorT"] = "envPiece"; } catch(e) {}
    try { ac_camera.portToPinMapping["colort"] = "envPiece"; } catch(e) {}
    try { ac_camera.portToPinMapping["colorSa"] = "envSaPiece"; } catch(e) {}
    try { ac_camera.portToPinMapping["colorsa"] = "envSaPiece"; } catch(e) {}
    try { ac_camera.portToPinMapping["colorSpe"] = "envSpePiece"; } catch(e) {}
    try { ac_camera.portToPinMapping["colorspe"] = "envSpePiece"; } catch(e) {}
    try { ac_camera.portToPinMapping["pieceOut"] = "sysPiece"; } catch(e) {}
    try { ac_camera.portToPinMapping["pieceout"] = "sysPiece"; } catch(e) {}
    try { ac_camera.portToPinMapping["floorColorOut"] = "envFloor"; } catch(e) {}
    try { ac_camera.portToPinMapping["floorcolorout"] = "envFloor"; } catch(e) {}
    this.registerActivity("CameraSensorAC", ac_camera);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.camera"] = ac_camera; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.camera"] = ac_camera; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["camera"] = ac_camera; } catch(e) {}
    const ac_unit_camera = new AC_BoundaryBehavior_CameraSensorAC(
      "CameraSensorAC",
      "unit_camera",
      ["floorColorOut"],
      [{"from":"envFloor","to":"floor"},{"from":"envPad","to":"pad"},{"from":"envStandby","to":"standby"},{"from":"sysFloor","to":"floorOut"},{"from":"envOffset","to":"intIn"},{"from":"sysOffset","to":"intOut"},{"from":"envZone","to":"zoneColor"},{"from":"sysZone","to":"alarmOut"},{"from":"envPiece","to":"colorT"},{"from":"envSaPiece","to":"colorSa"},{"from":"envSpePiece","to":"colorSpe"},{"from":"sysPiece","to":"pieceOut"}],
      {"outParameters":[{"name":"envFloor","type":"Real","direction":"out"},{"name":"envPad","type":"Real","direction":"out"},{"name":"envStandby","type":"Real","direction":"out"},{"name":"sysFloor","type":"Real","direction":"out"},{"name":"envOffset","type":"Real","direction":"out"},{"name":"sysOffset","type":"Real","direction":"out"},{"name":"envZone","type":"Real","direction":"out"},{"name":"sysZone","type":"Real","direction":"out"},{"name":"envPiece","type":"Real","direction":"out"},{"name":"envSaPiece","type":"Real","direction":"out"},{"name":"envSpePiece","type":"Real","direction":"out"},{"name":"sysPiece","type":"Real","direction":"out"}]}
    );
    const muxF_2 = new AN_BoundaryBehavior_MultiplexFloorColorAN("muxF", { usingPins: ["floor","pad","standby","floorOut"] });
    ac_unit_camera.registerAction(muxF_2);
    const passO_2 = new AN_PkgScenarios_PassIntAN("passO", { usingPins: ["intIn","intOut"] });
    ac_unit_camera.registerAction(passO_2);
    const detectZ_2 = new AN_BoundaryBehavior_ProcessZoneAlarmAN("detectZ", { usingPins: ["zoneColor","alarmOut"] });
    ac_unit_camera.registerAction(detectZ_2);
    const muxP_2 = new AN_BoundaryBehavior_MultiplexPieceColorAN("muxP", { usingPins: ["colorT","colorSa","colorSpe","pieceOut"] });
    ac_unit_camera.registerAction(muxP_2);
    try { ac_unit_camera.portToPinMapping["floor"] = "envFloor"; } catch(e) {}
    try { ac_unit_camera.portToPinMapping["floor"] = "envFloor"; } catch(e) {}
    try { ac_unit_camera.portToPinMapping["pad"] = "envPad"; } catch(e) {}
    try { ac_unit_camera.portToPinMapping["pad"] = "envPad"; } catch(e) {}
    try { ac_unit_camera.portToPinMapping["standby"] = "envStandby"; } catch(e) {}
    try { ac_unit_camera.portToPinMapping["standby"] = "envStandby"; } catch(e) {}
    try { ac_unit_camera.portToPinMapping["floorOut"] = "sysFloor"; } catch(e) {}
    try { ac_unit_camera.portToPinMapping["floorout"] = "sysFloor"; } catch(e) {}
    try { ac_unit_camera.portToPinMapping["intIn"] = "envOffset"; } catch(e) {}
    try { ac_unit_camera.portToPinMapping["intin"] = "envOffset"; } catch(e) {}
    try { ac_unit_camera.portToPinMapping["intOut"] = "sysOffset"; } catch(e) {}
    try { ac_unit_camera.portToPinMapping["intout"] = "sysOffset"; } catch(e) {}
    try { ac_unit_camera.portToPinMapping["zoneColor"] = "envZone"; } catch(e) {}
    try { ac_unit_camera.portToPinMapping["zonecolor"] = "envZone"; } catch(e) {}
    try { ac_unit_camera.portToPinMapping["alarmOut"] = "sysZone"; } catch(e) {}
    try { ac_unit_camera.portToPinMapping["alarmout"] = "sysZone"; } catch(e) {}
    try { ac_unit_camera.portToPinMapping["colorT"] = "envPiece"; } catch(e) {}
    try { ac_unit_camera.portToPinMapping["colort"] = "envPiece"; } catch(e) {}
    try { ac_unit_camera.portToPinMapping["colorSa"] = "envSaPiece"; } catch(e) {}
    try { ac_unit_camera.portToPinMapping["colorsa"] = "envSaPiece"; } catch(e) {}
    try { ac_unit_camera.portToPinMapping["colorSpe"] = "envSpePiece"; } catch(e) {}
    try { ac_unit_camera.portToPinMapping["colorspe"] = "envSpePiece"; } catch(e) {}
    try { ac_unit_camera.portToPinMapping["pieceOut"] = "sysPiece"; } catch(e) {}
    try { ac_unit_camera.portToPinMapping["pieceout"] = "sysPiece"; } catch(e) {}
    try { ac_unit_camera.portToPinMapping["floorColorOut"] = "envFloor"; } catch(e) {}
    try { ac_unit_camera.portToPinMapping["floorcolorout"] = "envFloor"; } catch(e) {}
    this.registerActivity("CameraSensorAC", ac_unit_camera);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["unit_camera"] = ac_unit_camera; } catch(e) {}
    const ac_obstacleSens = new AC_BoundaryBehavior_ObstacleSensorAC(
      "ObstacleSensorAC",
      "RobAFISSystemCP.obstacleSens",
      ["obstacleOut"],
      [{"from":"envObstacle","to":"passObstacle.boolIn"},{"from":"sysObstacle","to":"passObstacle.boolOut"}],
      {"outParameters":[{"name":"envObstacle","type":"Real","direction":"out"},{"name":"sysObstacle","type":"Real","direction":"out"}]}
    );
    const passObstacle = new AN_PkgScenarios_PassBooleanAN("passObstacle", { usingPins: ["boolIn","boolOut"] });
    ac_obstacleSens.registerAction(passObstacle);
    try { ac_obstacleSens.portToPinMapping["passObstacle.boolIn"] = "envObstacle"; } catch(e) {}
    try { ac_obstacleSens.portToPinMapping["passobstacle.boolin"] = "envObstacle"; } catch(e) {}
    try { ac_obstacleSens.portToPinMapping["passObstacle.boolOut"] = "sysObstacle"; } catch(e) {}
    try { ac_obstacleSens.portToPinMapping["passobstacle.boolout"] = "sysObstacle"; } catch(e) {}
    try { ac_obstacleSens.portToPinMapping["obstacleOut"] = "envObstacle"; } catch(e) {}
    try { ac_obstacleSens.portToPinMapping["obstacleout"] = "envObstacle"; } catch(e) {}
    this.registerActivity("ObstacleSensorAC", ac_obstacleSens);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.obstacleSens"] = ac_obstacleSens; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.obstaclesens"] = ac_obstacleSens; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["obstacleSens"] = ac_obstacleSens; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["obstaclesens"] = ac_obstacleSens; } catch(e) {}
    const ac_unit_obstacleSens = new AC_BoundaryBehavior_ObstacleSensorAC(
      "ObstacleSensorAC",
      "unit_obstacleSens",
      ["obstacleOut"],
      [{"from":"envObstacle","to":"passObstacle.boolIn"},{"from":"sysObstacle","to":"passObstacle.boolOut"}],
      {"outParameters":[{"name":"envObstacle","type":"Real","direction":"out"},{"name":"sysObstacle","type":"Real","direction":"out"}]}
    );
    const passObstacle_2 = new AN_PkgScenarios_PassBooleanAN("passObstacle", { usingPins: ["boolIn","boolOut"] });
    ac_unit_obstacleSens.registerAction(passObstacle_2);
    try { ac_unit_obstacleSens.portToPinMapping["passObstacle.boolIn"] = "envObstacle"; } catch(e) {}
    try { ac_unit_obstacleSens.portToPinMapping["passobstacle.boolin"] = "envObstacle"; } catch(e) {}
    try { ac_unit_obstacleSens.portToPinMapping["passObstacle.boolOut"] = "sysObstacle"; } catch(e) {}
    try { ac_unit_obstacleSens.portToPinMapping["passobstacle.boolout"] = "sysObstacle"; } catch(e) {}
    try { ac_unit_obstacleSens.portToPinMapping["obstacleOut"] = "envObstacle"; } catch(e) {}
    try { ac_unit_obstacleSens.portToPinMapping["obstacleout"] = "envObstacle"; } catch(e) {}
    this.registerActivity("ObstacleSensorAC", ac_unit_obstacleSens);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["unit_obstacleSens"] = ac_unit_obstacleSens; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["unit_obstaclesens"] = ac_unit_obstacleSens; } catch(e) {}
    const ac_driveSys = new AC_BoundaryBehavior_DriveSystemAC(
      "DriveSystemAC",
      "RobAFISSystemCP.driveSys",
      ["dirIn"],
      [{"from":"sysDir","to":"passDir.dirIn"},{"from":"envDir","to":"passDir.dirOut"}],
      {"outParameters":[{"name":"sysDir","type":"Real","direction":"out"},{"name":"envDir","type":"Real","direction":"out"}]}
    );
    const passDir = new AN_BoundaryBehavior_PassDirectionAN("passDir", { usingPins: ["dirIn","dirOut"] });
    ac_driveSys.registerAction(passDir);
    try { ac_driveSys.portToPinMapping["passDir.dirIn"] = "sysDir"; } catch(e) {}
    try { ac_driveSys.portToPinMapping["passdir.dirin"] = "sysDir"; } catch(e) {}
    try { ac_driveSys.portToPinMapping["passDir.dirOut"] = "envDir"; } catch(e) {}
    try { ac_driveSys.portToPinMapping["passdir.dirout"] = "envDir"; } catch(e) {}
    try { ac_driveSys.portToPinMapping["dirIn"] = "sysDir"; } catch(e) {}
    try { ac_driveSys.portToPinMapping["dirin"] = "sysDir"; } catch(e) {}
    this.registerActivity("DriveSystemAC", ac_driveSys);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.driveSys"] = ac_driveSys; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.drivesys"] = ac_driveSys; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["driveSys"] = ac_driveSys; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["drivesys"] = ac_driveSys; } catch(e) {}
    const ac_grabber = new AC_BoundaryBehavior_GrabberAC(
      "GrabberAC",
      "RobAFISSystemCP.grabber",
      ["cmdIn"],
      [{"from":"sysCmd","to":"cmdIn"},{"from":"envGrabT","to":"cmdOut"},{"from":"sysCmd","to":"cmdIn"},{"from":"envGrabSa","to":"cmdOut"},{"from":"sysCmd","to":"cmdIn"},{"from":"envGrabSpe","to":"cmdOut"},{"from":"sysCmd","to":"cmdIn"},{"from":"envGrabSpd","to":"cmdOut"}],
      {"outParameters":[{"name":"sysCmd","type":"Real","direction":"out"},{"name":"envGrabT","type":"Real","direction":"out"},{"name":"sysCmd","type":"Real","direction":"out"},{"name":"envGrabSa","type":"Real","direction":"out"},{"name":"sysCmd","type":"Real","direction":"out"},{"name":"envGrabSpe","type":"Real","direction":"out"},{"name":"sysCmd","type":"Real","direction":"out"},{"name":"envGrabSpd","type":"Real","direction":"out"}]}
    );
    const passCmdT = new AN_BoundaryBehavior_PassMotorCommandAN("passCmdT", { usingPins: ["cmdIn","cmdOut"] });
    ac_grabber.registerAction(passCmdT);
    const passCmdSa = new AN_BoundaryBehavior_PassMotorCommandAN("passCmdSa", { usingPins: ["cmdIn","cmdOut"] });
    ac_grabber.registerAction(passCmdSa);
    const passCmdSpe = new AN_BoundaryBehavior_PassMotorCommandAN("passCmdSpe", { usingPins: ["cmdIn","cmdOut"] });
    ac_grabber.registerAction(passCmdSpe);
    const passCmdSpd = new AN_BoundaryBehavior_PassMotorCommandAN("passCmdSpd", { usingPins: ["cmdIn","cmdOut"] });
    ac_grabber.registerAction(passCmdSpd);
    try { ac_grabber.portToPinMapping["cmdIn"] = "sysCmd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdin"] = "sysCmd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdIn"] = "sysCmd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdin"] = "sysCmd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdIn"] = "sysCmd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdin"] = "sysCmd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdOut"] = "envGrabT"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdout"] = "envGrabT"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdIn"] = "sysCmd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdin"] = "sysCmd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdIn"] = "sysCmd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdin"] = "sysCmd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdIn"] = "sysCmd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdin"] = "sysCmd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdOut"] = "envGrabSa"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdout"] = "envGrabSa"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdIn"] = "sysCmd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdin"] = "sysCmd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdIn"] = "sysCmd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdin"] = "sysCmd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdIn"] = "sysCmd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdin"] = "sysCmd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdOut"] = "envGrabSpe"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdout"] = "envGrabSpe"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdIn"] = "sysCmd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdin"] = "sysCmd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdIn"] = "sysCmd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdin"] = "sysCmd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdIn"] = "sysCmd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdin"] = "sysCmd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdOut"] = "envGrabSpd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdout"] = "envGrabSpd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdIn"] = "sysCmd"; } catch(e) {}
    try { ac_grabber.portToPinMapping["cmdin"] = "sysCmd"; } catch(e) {}
    this.registerActivity("GrabberAC", ac_grabber);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCP.grabber"] = ac_grabber; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcp.grabber"] = ac_grabber; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["grabber"] = ac_grabber; } catch(e) {}
    const ac_operator = new AC_PkgScenarios_OperatorEA(
      "OperatorEA",
      "operator",
      [],
      [{"from":"opParamOut","to":"setMissionParametersOp"},{"from":"opStratOut","to":"setStrategyOp"}],
      {"outParameters":[{"name":"opParamOut","type":"Real","direction":"out"},{"name":"opStratOut","type":"Real","direction":"out"}]}
    );
    const setMissionParametersOp = new AN_PkgScenarios_PassMissionParameterAN("setMissionParametersOp", { usingPins: ["paramIn"] });
    ac_operator.registerAction(setMissionParametersOp);
    const setStrategyOp = new AN_PkgScenarios_PassStrategyParameterAN("setStrategyOp", { usingPins: ["strategyIn"] });
    ac_operator.registerAction(setStrategyOp);
    try { ac_operator.portToPinMapping["setMissionParametersOp"] = "opParamOut"; } catch(e) {}
    try { ac_operator.portToPinMapping["setmissionparametersop"] = "opParamOut"; } catch(e) {}
    try { ac_operator.portToPinMapping["setStrategyOp"] = "opStratOut"; } catch(e) {}
    try { ac_operator.portToPinMapping["setstrategyop"] = "opStratOut"; } catch(e) {}
    this.registerActivity("OperatorEA", ac_operator);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["operator"] = ac_operator; } catch(e) {}
    const ac_unit1 = new AC_PkgScenarios_UnitEA(
      "UnitEA",
      "unit1",
      [],
      [{"from":"outUnitNavLine","to":"leavePA"},{"from":"outUnitNavLine","to":"turnRight"},{"from":"outUnitNavLine","to":"returnJourney"},{"from":"outUnitNavPad","to":"detectGreenPad"},{"from":"outUnitNavPad","to":"detectRedPad"},{"from":"outUnitNavPad","to":"stopAtT"},{"from":"outUnitNavPad","to":"routeToSA"},{"from":"outUnitNavPad","to":"routeToSPD"},{"from":"outUnitNavPad","to":"stopAtSPE"},{"from":"outUnitNavPad","to":"arriveAtTargetStock"},{"from":"outUnitPieceColor","to":"extractPieceT"},{"from":"outSPEPieceColor","to":"extractPieceSPE"},{"from":"outSAPieceColor","to":"insertPieceSA"},{"from":"outSPDPieceColor","to":"insertPieceSPD"},{"from":"outUnitObstacle","to":"setObstacleTrue"},{"from":"outUnitObstacle","to":"setObstacleFalse"},{"from":"outUnitPAColor","to":"arriveAtPA"}],
      {"outParameters":[{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitPieceColor","type":"Real","direction":"out"},{"name":"outSPEPieceColor","type":"Real","direction":"out"},{"name":"outSAPieceColor","type":"Real","direction":"out"},{"name":"outSPDPieceColor","type":"Real","direction":"out"},{"name":"outUnitObstacle","type":"Real","direction":"out"},{"name":"outUnitObstacle","type":"Real","direction":"out"},{"name":"outUnitPAColor","type":"Real","direction":"out"}]}
    );
    const leavePA = new AN_PkgScenarios_PassNavColorAN("leavePA", { usingPins: ["colorIn"] });
    ac_unit1.registerAction(leavePA);
    const detectGreenPad = new AN_PkgScenarios_PassNavColorAN("detectGreenPad", { usingPins: ["colorIn"] });
    ac_unit1.registerAction(detectGreenPad);
    const turnRight = new AN_PkgScenarios_PassNavColorAN("turnRight", { usingPins: ["colorIn"] });
    ac_unit1.registerAction(turnRight);
    const detectRedPad = new AN_PkgScenarios_PassNavColorAN("detectRedPad", { usingPins: ["colorIn"] });
    ac_unit1.registerAction(detectRedPad);
    const stopAtT = new AN_PkgScenarios_PassNavColorAN("stopAtT", { usingPins: ["colorIn"] });
    ac_unit1.registerAction(stopAtT);
    const routeToSA = new AN_PkgScenarios_PassNavColorAN("routeToSA", { usingPins: ["colorIn"] });
    ac_unit1.registerAction(routeToSA);
    const routeToSPD = new AN_PkgScenarios_PassNavColorAN("routeToSPD", { usingPins: ["colorIn"] });
    ac_unit1.registerAction(routeToSPD);
    const stopAtSPE = new AN_PkgScenarios_PassNavColorAN("stopAtSPE", { usingPins: ["colorIn"] });
    ac_unit1.registerAction(stopAtSPE);
    const arriveAtTargetStock = new AN_PkgScenarios_PassNavColorAN("arriveAtTargetStock", { usingPins: ["colorIn"] });
    ac_unit1.registerAction(arriveAtTargetStock);
    const returnJourney = new AN_PkgScenarios_PassNavColorAN("returnJourney", { usingPins: ["colorIn"] });
    ac_unit1.registerAction(returnJourney);
    const arriveAtPA = new AN_PkgScenarios_PassNavColorAN("arriveAtPA", { usingPins: ["colorIn"] });
    ac_unit1.registerAction(arriveAtPA);
    const acknowledgeTarget = new AN_PkgScenarios_PassNavColorAN("acknowledgeTarget", { usingPins: ["colorIn"] });
    ac_unit1.registerAction(acknowledgeTarget);
    const extractPieceT = new AN_PkgScenarios_PassPieceColorAN("extractPieceT", { usingPins: ["pieceIn"] });
    ac_unit1.registerAction(extractPieceT);
    const extractPieceSPE = new AN_PkgScenarios_PassPieceColorAN("extractPieceSPE", { usingPins: ["pieceIn"] });
    ac_unit1.registerAction(extractPieceSPE);
    const insertPieceSA = new AN_PkgScenarios_PassPieceColorAN("insertPieceSA", { usingPins: ["pieceIn"] });
    ac_unit1.registerAction(insertPieceSA);
    const insertPieceSPD = new AN_PkgScenarios_PassPieceColorAN("insertPieceSPD", { usingPins: ["pieceIn"] });
    ac_unit1.registerAction(insertPieceSPD);
    const exposePieceT = new AN_PkgScenarios_PassPieceColorAN("exposePieceT", { usingPins: ["pieceIn"] });
    ac_unit1.registerAction(exposePieceT);
    const exposePieceSPE = new AN_PkgScenarios_PassPieceColorAN("exposePieceSPE", { usingPins: ["pieceIn"] });
    ac_unit1.registerAction(exposePieceSPE);
    const setObstacleTrue = new AN_PkgScenarios_PassBooleanAN("setObstacleTrue", { usingPins: ["boolIn"] });
    ac_unit1.registerAction(setObstacleTrue);
    const setObstacleFalse = new AN_PkgScenarios_PassBooleanAN("setObstacleFalse", { usingPins: ["boolIn"] });
    ac_unit1.registerAction(setObstacleFalse);
    try { ac_unit1.portToPinMapping["leavePA"] = "outUnitNavLine"; } catch(e) {}
    try { ac_unit1.portToPinMapping["leavepa"] = "outUnitNavLine"; } catch(e) {}
    try { ac_unit1.portToPinMapping["turnRight"] = "outUnitNavLine"; } catch(e) {}
    try { ac_unit1.portToPinMapping["turnright"] = "outUnitNavLine"; } catch(e) {}
    try { ac_unit1.portToPinMapping["returnJourney"] = "outUnitNavLine"; } catch(e) {}
    try { ac_unit1.portToPinMapping["returnjourney"] = "outUnitNavLine"; } catch(e) {}
    try { ac_unit1.portToPinMapping["detectGreenPad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_unit1.portToPinMapping["detectgreenpad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_unit1.portToPinMapping["detectRedPad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_unit1.portToPinMapping["detectredpad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_unit1.portToPinMapping["stopAtT"] = "outUnitNavPad"; } catch(e) {}
    try { ac_unit1.portToPinMapping["stopatt"] = "outUnitNavPad"; } catch(e) {}
    try { ac_unit1.portToPinMapping["routeToSA"] = "outUnitNavPad"; } catch(e) {}
    try { ac_unit1.portToPinMapping["routetosa"] = "outUnitNavPad"; } catch(e) {}
    try { ac_unit1.portToPinMapping["routeToSPD"] = "outUnitNavPad"; } catch(e) {}
    try { ac_unit1.portToPinMapping["routetospd"] = "outUnitNavPad"; } catch(e) {}
    try { ac_unit1.portToPinMapping["stopAtSPE"] = "outUnitNavPad"; } catch(e) {}
    try { ac_unit1.portToPinMapping["stopatspe"] = "outUnitNavPad"; } catch(e) {}
    try { ac_unit1.portToPinMapping["arriveAtTargetStock"] = "outUnitNavPad"; } catch(e) {}
    try { ac_unit1.portToPinMapping["arriveattargetstock"] = "outUnitNavPad"; } catch(e) {}
    try { ac_unit1.portToPinMapping["extractPieceT"] = "outUnitPieceColor"; } catch(e) {}
    try { ac_unit1.portToPinMapping["extractpiecet"] = "outUnitPieceColor"; } catch(e) {}
    try { ac_unit1.portToPinMapping["extractPieceSPE"] = "outSPEPieceColor"; } catch(e) {}
    try { ac_unit1.portToPinMapping["extractpiecespe"] = "outSPEPieceColor"; } catch(e) {}
    try { ac_unit1.portToPinMapping["insertPieceSA"] = "outSAPieceColor"; } catch(e) {}
    try { ac_unit1.portToPinMapping["insertpiecesa"] = "outSAPieceColor"; } catch(e) {}
    try { ac_unit1.portToPinMapping["insertPieceSPD"] = "outSPDPieceColor"; } catch(e) {}
    try { ac_unit1.portToPinMapping["insertpiecespd"] = "outSPDPieceColor"; } catch(e) {}
    try { ac_unit1.portToPinMapping["setObstacleTrue"] = "outUnitObstacle"; } catch(e) {}
    try { ac_unit1.portToPinMapping["setobstacletrue"] = "outUnitObstacle"; } catch(e) {}
    try { ac_unit1.portToPinMapping["setObstacleFalse"] = "outUnitObstacle"; } catch(e) {}
    try { ac_unit1.portToPinMapping["setobstaclefalse"] = "outUnitObstacle"; } catch(e) {}
    try { ac_unit1.portToPinMapping["arriveAtPA"] = "outUnitPAColor"; } catch(e) {}
    try { ac_unit1.portToPinMapping["arriveatpa"] = "outUnitPAColor"; } catch(e) {}
    this.registerActivity("UnitEA", ac_unit1);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["unit1"] = ac_unit1; } catch(e) {}
    const ac_unit2 = new AC_PkgScenarios_UnitEA(
      "UnitEA",
      "unit2",
      [],
      [{"from":"outUnitNavLine","to":"leavePA"},{"from":"outUnitNavLine","to":"turnRight"},{"from":"outUnitNavLine","to":"returnJourney"},{"from":"outUnitNavPad","to":"detectGreenPad"},{"from":"outUnitNavPad","to":"detectRedPad"},{"from":"outUnitNavPad","to":"stopAtT"},{"from":"outUnitNavPad","to":"routeToSA"},{"from":"outUnitNavPad","to":"routeToSPD"},{"from":"outUnitNavPad","to":"stopAtSPE"},{"from":"outUnitNavPad","to":"arriveAtTargetStock"},{"from":"outUnitPieceColor","to":"extractPieceT"},{"from":"outSPEPieceColor","to":"extractPieceSPE"},{"from":"outSAPieceColor","to":"insertPieceSA"},{"from":"outSPDPieceColor","to":"insertPieceSPD"},{"from":"outUnitObstacle","to":"setObstacleTrue"},{"from":"outUnitObstacle","to":"setObstacleFalse"},{"from":"outUnitPAColor","to":"arriveAtPA"}],
      {"outParameters":[{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavLine","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitNavPad","type":"Real","direction":"out"},{"name":"outUnitPieceColor","type":"Real","direction":"out"},{"name":"outSPEPieceColor","type":"Real","direction":"out"},{"name":"outSAPieceColor","type":"Real","direction":"out"},{"name":"outSPDPieceColor","type":"Real","direction":"out"},{"name":"outUnitObstacle","type":"Real","direction":"out"},{"name":"outUnitObstacle","type":"Real","direction":"out"},{"name":"outUnitPAColor","type":"Real","direction":"out"}]}
    );
    const leavePA_2 = new AN_PkgScenarios_PassNavColorAN("leavePA", { usingPins: ["colorIn"] });
    ac_unit2.registerAction(leavePA_2);
    const detectGreenPad_2 = new AN_PkgScenarios_PassNavColorAN("detectGreenPad", { usingPins: ["colorIn"] });
    ac_unit2.registerAction(detectGreenPad_2);
    const turnRight_2 = new AN_PkgScenarios_PassNavColorAN("turnRight", { usingPins: ["colorIn"] });
    ac_unit2.registerAction(turnRight_2);
    const detectRedPad_2 = new AN_PkgScenarios_PassNavColorAN("detectRedPad", { usingPins: ["colorIn"] });
    ac_unit2.registerAction(detectRedPad_2);
    const stopAtT_2 = new AN_PkgScenarios_PassNavColorAN("stopAtT", { usingPins: ["colorIn"] });
    ac_unit2.registerAction(stopAtT_2);
    const routeToSA_2 = new AN_PkgScenarios_PassNavColorAN("routeToSA", { usingPins: ["colorIn"] });
    ac_unit2.registerAction(routeToSA_2);
    const routeToSPD_2 = new AN_PkgScenarios_PassNavColorAN("routeToSPD", { usingPins: ["colorIn"] });
    ac_unit2.registerAction(routeToSPD_2);
    const stopAtSPE_2 = new AN_PkgScenarios_PassNavColorAN("stopAtSPE", { usingPins: ["colorIn"] });
    ac_unit2.registerAction(stopAtSPE_2);
    const arriveAtTargetStock_2 = new AN_PkgScenarios_PassNavColorAN("arriveAtTargetStock", { usingPins: ["colorIn"] });
    ac_unit2.registerAction(arriveAtTargetStock_2);
    const returnJourney_2 = new AN_PkgScenarios_PassNavColorAN("returnJourney", { usingPins: ["colorIn"] });
    ac_unit2.registerAction(returnJourney_2);
    const arriveAtPA_2 = new AN_PkgScenarios_PassNavColorAN("arriveAtPA", { usingPins: ["colorIn"] });
    ac_unit2.registerAction(arriveAtPA_2);
    const acknowledgeTarget_2 = new AN_PkgScenarios_PassNavColorAN("acknowledgeTarget", { usingPins: ["colorIn"] });
    ac_unit2.registerAction(acknowledgeTarget_2);
    const extractPieceT_2 = new AN_PkgScenarios_PassPieceColorAN("extractPieceT", { usingPins: ["pieceIn"] });
    ac_unit2.registerAction(extractPieceT_2);
    const extractPieceSPE_2 = new AN_PkgScenarios_PassPieceColorAN("extractPieceSPE", { usingPins: ["pieceIn"] });
    ac_unit2.registerAction(extractPieceSPE_2);
    const insertPieceSA_2 = new AN_PkgScenarios_PassPieceColorAN("insertPieceSA", { usingPins: ["pieceIn"] });
    ac_unit2.registerAction(insertPieceSA_2);
    const insertPieceSPD_2 = new AN_PkgScenarios_PassPieceColorAN("insertPieceSPD", { usingPins: ["pieceIn"] });
    ac_unit2.registerAction(insertPieceSPD_2);
    const exposePieceT_2 = new AN_PkgScenarios_PassPieceColorAN("exposePieceT", { usingPins: ["pieceIn"] });
    ac_unit2.registerAction(exposePieceT_2);
    const exposePieceSPE_2 = new AN_PkgScenarios_PassPieceColorAN("exposePieceSPE", { usingPins: ["pieceIn"] });
    ac_unit2.registerAction(exposePieceSPE_2);
    const setObstacleTrue_2 = new AN_PkgScenarios_PassBooleanAN("setObstacleTrue", { usingPins: ["boolIn"] });
    ac_unit2.registerAction(setObstacleTrue_2);
    const setObstacleFalse_2 = new AN_PkgScenarios_PassBooleanAN("setObstacleFalse", { usingPins: ["boolIn"] });
    ac_unit2.registerAction(setObstacleFalse_2);
    try { ac_unit2.portToPinMapping["leavePA"] = "outUnitNavLine"; } catch(e) {}
    try { ac_unit2.portToPinMapping["leavepa"] = "outUnitNavLine"; } catch(e) {}
    try { ac_unit2.portToPinMapping["turnRight"] = "outUnitNavLine"; } catch(e) {}
    try { ac_unit2.portToPinMapping["turnright"] = "outUnitNavLine"; } catch(e) {}
    try { ac_unit2.portToPinMapping["returnJourney"] = "outUnitNavLine"; } catch(e) {}
    try { ac_unit2.portToPinMapping["returnjourney"] = "outUnitNavLine"; } catch(e) {}
    try { ac_unit2.portToPinMapping["detectGreenPad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_unit2.portToPinMapping["detectgreenpad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_unit2.portToPinMapping["detectRedPad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_unit2.portToPinMapping["detectredpad"] = "outUnitNavPad"; } catch(e) {}
    try { ac_unit2.portToPinMapping["stopAtT"] = "outUnitNavPad"; } catch(e) {}
    try { ac_unit2.portToPinMapping["stopatt"] = "outUnitNavPad"; } catch(e) {}
    try { ac_unit2.portToPinMapping["routeToSA"] = "outUnitNavPad"; } catch(e) {}
    try { ac_unit2.portToPinMapping["routetosa"] = "outUnitNavPad"; } catch(e) {}
    try { ac_unit2.portToPinMapping["routeToSPD"] = "outUnitNavPad"; } catch(e) {}
    try { ac_unit2.portToPinMapping["routetospd"] = "outUnitNavPad"; } catch(e) {}
    try { ac_unit2.portToPinMapping["stopAtSPE"] = "outUnitNavPad"; } catch(e) {}
    try { ac_unit2.portToPinMapping["stopatspe"] = "outUnitNavPad"; } catch(e) {}
    try { ac_unit2.portToPinMapping["arriveAtTargetStock"] = "outUnitNavPad"; } catch(e) {}
    try { ac_unit2.portToPinMapping["arriveattargetstock"] = "outUnitNavPad"; } catch(e) {}
    try { ac_unit2.portToPinMapping["extractPieceT"] = "outUnitPieceColor"; } catch(e) {}
    try { ac_unit2.portToPinMapping["extractpiecet"] = "outUnitPieceColor"; } catch(e) {}
    try { ac_unit2.portToPinMapping["extractPieceSPE"] = "outSPEPieceColor"; } catch(e) {}
    try { ac_unit2.portToPinMapping["extractpiecespe"] = "outSPEPieceColor"; } catch(e) {}
    try { ac_unit2.portToPinMapping["insertPieceSA"] = "outSAPieceColor"; } catch(e) {}
    try { ac_unit2.portToPinMapping["insertpiecesa"] = "outSAPieceColor"; } catch(e) {}
    try { ac_unit2.portToPinMapping["insertPieceSPD"] = "outSPDPieceColor"; } catch(e) {}
    try { ac_unit2.portToPinMapping["insertpiecespd"] = "outSPDPieceColor"; } catch(e) {}
    try { ac_unit2.portToPinMapping["setObstacleTrue"] = "outUnitObstacle"; } catch(e) {}
    try { ac_unit2.portToPinMapping["setobstacletrue"] = "outUnitObstacle"; } catch(e) {}
    try { ac_unit2.portToPinMapping["setObstacleFalse"] = "outUnitObstacle"; } catch(e) {}
    try { ac_unit2.portToPinMapping["setobstaclefalse"] = "outUnitObstacle"; } catch(e) {}
    try { ac_unit2.portToPinMapping["arriveAtPA"] = "outUnitPAColor"; } catch(e) {}
    try { ac_unit2.portToPinMapping["arriveatpa"] = "outUnitPAColor"; } catch(e) {}
    this.registerActivity("UnitEA", ac_unit2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["unit2"] = ac_unit2; } catch(e) {}
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
    PT_EnvPortsRobAFIS_InInt,
    PT_EnvPortsRobAFIS_OutInt,
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
    CN_EnvConnectorsRobAFIS_ParamEnvCN,
    CN_EnvConnectorsRobAFIS_StrategyEnvCN,
    CN_EnvConnectorsRobAFIS_MotorCommandEnvCN,
    CN_EnvConnectorsRobAFIS_OffsetEnvCN,
    CN_EnvConnectorsRobAFIS_ObstacleEnvCN,
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
    EX_BoundaryExecution_MultiplexPieceColorEX,
    EX_BoundaryExecution_MultiplexFloorColorEX,
    EX_BoundaryExecution_ProcessZoneAlarmEX,
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
  
  // Delegations for instance: model.RobAFISSystemCP.controller
  try {
    const parentPort = model.RobAFISSystemCP.controller.getPort("controller_inParam");
    let childPort = null;
    if (model.RobAFISSystemCP.controller.components) {
      for (const child of Object.values(model.RobAFISSystemCP.controller.components)) {
        childPort = child.getPort("planner_inParam");
        if (childPort) break;
      }
    }
    if (parentPort && childPort) {
      if (parentPort.direction === 'in') {
        parentPort.addDelegation(childPort);
      } else {
        childPort.addDelegation(parentPort);
      }
    }
  } catch(e) { console.warn("[DELEGATION ERROR] model.RobAFISSystemCP.controller delegation error: " + e.message); }
  try {
    const parentPort = model.RobAFISSystemCP.controller.getPort("controller_inStrategy");
    let childPort = null;
    if (model.RobAFISSystemCP.controller.components) {
      for (const child of Object.values(model.RobAFISSystemCP.controller.components)) {
        childPort = child.getPort("planner_inStrategy");
        if (childPort) break;
      }
    }
    if (parentPort && childPort) {
      if (parentPort.direction === 'in') {
        parentPort.addDelegation(childPort);
      } else {
        childPort.addDelegation(parentPort);
      }
    }
  } catch(e) { console.warn("[DELEGATION ERROR] model.RobAFISSystemCP.controller delegation error: " + e.message); }
  try {
    const parentPort = model.RobAFISSystemCP.controller.getPort("controller_inFloorColor");
    let childPort = null;
    if (model.RobAFISSystemCP.controller.components) {
      for (const child of Object.values(model.RobAFISSystemCP.controller.components)) {
        childPort = child.getPort("navigator_inFloorColor");
        if (childPort) break;
      }
    }
    if (parentPort && childPort) {
      if (parentPort.direction === 'in') {
        parentPort.addDelegation(childPort);
      } else {
        childPort.addDelegation(parentPort);
      }
    }
  } catch(e) { console.warn("[DELEGATION ERROR] model.RobAFISSystemCP.controller delegation error: " + e.message); }
  try {
    const parentPort = model.RobAFISSystemCP.controller.getPort("controller_inLineOffset");
    let childPort = null;
    if (model.RobAFISSystemCP.controller.components) {
      for (const child of Object.values(model.RobAFISSystemCP.controller.components)) {
        childPort = child.getPort("navigator_inLineOffset");
        if (childPort) break;
      }
    }
    if (parentPort && childPort) {
      if (parentPort.direction === 'in') {
        parentPort.addDelegation(childPort);
      } else {
        childPort.addDelegation(parentPort);
      }
    }
  } catch(e) { console.warn("[DELEGATION ERROR] model.RobAFISSystemCP.controller delegation error: " + e.message); }
  try {
    const parentPort = model.RobAFISSystemCP.controller.getPort("controller_inZoneAlarm");
    let childPort = null;
    if (model.RobAFISSystemCP.controller.components) {
      for (const child of Object.values(model.RobAFISSystemCP.controller.components)) {
        childPort = child.getPort("navigator_inZoneAlarm");
        if (childPort) break;
      }
    }
    if (parentPort && childPort) {
      if (parentPort.direction === 'in') {
        parentPort.addDelegation(childPort);
      } else {
        childPort.addDelegation(parentPort);
      }
    }
  } catch(e) { console.warn("[DELEGATION ERROR] model.RobAFISSystemCP.controller delegation error: " + e.message); }
  try {
    const parentPort = model.RobAFISSystemCP.controller.getPort("controller_inObstacle");
    let childPort = null;
    if (model.RobAFISSystemCP.controller.components) {
      for (const child of Object.values(model.RobAFISSystemCP.controller.components)) {
        childPort = child.getPort("navigator_inObstacle");
        if (childPort) break;
      }
    }
    if (parentPort && childPort) {
      if (parentPort.direction === 'in') {
        parentPort.addDelegation(childPort);
      } else {
        childPort.addDelegation(parentPort);
      }
    }
  } catch(e) { console.warn("[DELEGATION ERROR] model.RobAFISSystemCP.controller delegation error: " + e.message); }
  try {
    const parentPort = model.RobAFISSystemCP.controller.getPort("controller_inPieceColor");
    let childPort = null;
    if (model.RobAFISSystemCP.controller.components) {
      for (const child of Object.values(model.RobAFISSystemCP.controller.components)) {
        childPort = child.getPort("cargo_inPieceColor");
        if (childPort) break;
      }
    }
    if (parentPort && childPort) {
      if (parentPort.direction === 'in') {
        parentPort.addDelegation(childPort);
      } else {
        childPort.addDelegation(parentPort);
      }
    }
  } catch(e) { console.warn("[DELEGATION ERROR] model.RobAFISSystemCP.controller delegation error: " + e.message); }
  try {
    const parentPort = model.RobAFISSystemCP.controller.getPort("controller_outDir");
    let childPort = null;
    if (model.RobAFISSystemCP.controller.components) {
      for (const child of Object.values(model.RobAFISSystemCP.controller.components)) {
        childPort = child.getPort("navigator_outDir");
        if (childPort) break;
      }
    }
    if (parentPort && childPort) {
      if (parentPort.direction === 'in') {
        parentPort.addDelegation(childPort);
      } else {
        childPort.addDelegation(parentPort);
      }
    }
  } catch(e) { console.warn("[DELEGATION ERROR] model.RobAFISSystemCP.controller delegation error: " + e.message); }
  try {
    const parentPort = model.RobAFISSystemCP.controller.getPort("controller_outGrab");
    let childPort = null;
    if (model.RobAFISSystemCP.controller.components) {
      for (const child of Object.values(model.RobAFISSystemCP.controller.components)) {
        childPort = child.getPort("cargo_outGrab");
        if (childPort) break;
      }
    }
    if (parentPort && childPort) {
      if (parentPort.direction === 'in') {
        parentPort.addDelegation(childPort);
      } else {
        childPort.addDelegation(parentPort);
      }
    }
  } catch(e) { console.warn("[DELEGATION ERROR] model.RobAFISSystemCP.controller delegation error: " + e.message); }
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

module.exports = { createModel, SysADLModel, EN_PieceColor, EN_MissionParameter, EN_StrategyParameter, EN_MotorCommand, EN_Direction, EN_NavColor, DT_MissionConfig, DT_RobotCommands, PT_SysADL_Ports_ParameterIPT, PT_SysADL_Ports_ParameterOPT, PT_SysADL_Ports_StrategyIPT, PT_SysADL_Ports_StrategyOPT, PT_SysADL_Ports_PieceColorIPT, PT_SysADL_Ports_PieceColorOPT, PT_SysADL_Ports_BooleanIPT, PT_SysADL_Ports_BooleanOPT, PT_SysADL_Ports_DirectionIPT, PT_SysADL_Ports_DirectionOPT, PT_SysADL_Ports_CommandIPT, PT_SysADL_Ports_CommandOPT, PT_SysADL_Ports_IntIPT, PT_SysADL_Ports_IntOPT, PT_SysADL_Ports_NavColorIPT, PT_SysADL_Ports_NavColorOPT, PT_SysADL_Ports_MissionConfigIPT, PT_SysADL_Ports_MissionConfigOPT, PT_EnvPortsRobAFIS_InPieceColor, PT_EnvPortsRobAFIS_OutPieceColor, PT_EnvPortsRobAFIS_InNavColor, PT_EnvPortsRobAFIS_OutNavColor, PT_EnvPortsRobAFIS_InBoolean, PT_EnvPortsRobAFIS_OutBoolean, PT_EnvPortsRobAFIS_InParameter, PT_EnvPortsRobAFIS_OutParameter, PT_EnvPortsRobAFIS_InStrategy, PT_EnvPortsRobAFIS_OutStrategy, PT_EnvPortsRobAFIS_InMotorCommand, PT_EnvPortsRobAFIS_OutMotorCommand, PT_EnvPortsRobAFIS_InInt, PT_EnvPortsRobAFIS_OutInt };