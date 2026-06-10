
const { Model, Component, Port, SimplePort, CompositePort, Connector, Activity, Action, Enum, Int, Boolean, String, Real, Void, valueType, dataType, dimension, unit, Constraint, Executable } = require('../sysadl-framework/SysADLBase');

// Types
const EN_PieceType = new Enum("P1", "P2");
const EN_MissionParameter = new Enum("P0", "P1");
const EN_MotorCommand = new Enum("On", "Off");
const EN_Direction = new Enum("Forward", "Left", "Right", "Stop");
const EN_NavColor = new Enum("Black", "Green", "Red", "None");
const DT_RobotCommands = dataType('RobotCommands', { dir: EN_Direction, grab: EN_MotorCommand });
const types = {
  PieceType: EN_PieceType,
  MissionParameter: EN_MissionParameter,
  MotorCommand: EN_MotorCommand,
  Direction: EN_Direction,
  NavColor: EN_NavColor,
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
class PT_SysADL_Ports_PieceTypeIPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "PieceType" }, ...opts });
  }
}
class PT_SysADL_Ports_PieceTypeOPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "out", { ...{ expectedType: "PieceType" }, ...opts });
  }
}
class PT_SysADL_Ports_PresenceIPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "Boolean" }, ...opts });
  }
}
class PT_SysADL_Ports_PresenceOPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "out", { ...{ expectedType: "Boolean" }, ...opts });
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
class PT_EnvPortsRobAFIS_OutPieceColor extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "PieceType" }, ...opts });
  }
}
class PT_EnvPortsRobAFIS_InPieceColor extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "PieceType" }, ...opts });
  }
}
class PT_EnvPortsRobAFIS_OutNavColor extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "NavColor" }, ...opts });
  }
}
class PT_EnvPortsRobAFIS_InNavColor extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "NavColor" }, ...opts });
  }
}
class PT_EnvPortsRobAFIS_OutPresence extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "Boolean" }, ...opts });
  }
}
class PT_EnvPortsRobAFIS_InPresence extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "Boolean" }, ...opts });
  }
}
class PT_EnvPortsRobAFIS_OutParameter extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "MissionParameter" }, ...opts });
  }
}
class PT_EnvPortsRobAFIS_InParameter extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "MissionParameter" }, ...opts });
  }
}
class PT_EnvPortsRobAFIS_OutMotorCommand extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "MotorCommand" }, ...opts });
  }
}
class PT_EnvPortsRobAFIS_InMotorCommand extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "MotorCommand" }, ...opts });
  }
}

// Connectors
class CN_SysADL_Connectors_ParameterCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        parameterOPT: {
          portClass: 'PT_SysADL_Ports_ParameterOPT',
          direction: 'out',
          dataType: 'MissionParameter',
          role: 'source'
        },
        parameterIPT: {
          portClass: 'PT_SysADL_Ports_ParameterIPT',
          direction: 'out',
          dataType: 'MissionParameter',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'parameterOPT',
          to: 'parameterIPT',
          dataType: 'MissionParameter'
        }
      ]
    });
  }
}
class CN_SysADL_Connectors_PieceTypeCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        pieceTypeOPT: {
          portClass: 'PT_SysADL_Ports_PieceTypeOPT',
          direction: 'out',
          dataType: 'PieceType',
          role: 'source'
        },
        pieceTypeIPT: {
          portClass: 'PT_SysADL_Ports_PieceTypeIPT',
          direction: 'out',
          dataType: 'PieceType',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'pieceTypeOPT',
          to: 'pieceTypeIPT',
          dataType: 'PieceType'
        }
      ]
    });
  }
}
class CN_SysADL_Connectors_PresenceCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        presenceOPT: {
          portClass: 'PT_SysADL_Ports_PresenceOPT',
          direction: 'out',
          dataType: 'Boolean',
          role: 'source'
        },
        presenceIPT: {
          portClass: 'PT_SysADL_Ports_PresenceIPT',
          direction: 'out',
          dataType: 'Boolean',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'presenceOPT',
          to: 'presenceIPT',
          dataType: 'Boolean'
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
        commandOPT: {
          portClass: 'PT_SysADL_Ports_CommandOPT',
          direction: 'out',
          dataType: 'MotorCommand',
          role: 'source'
        },
        commandIPT: {
          portClass: 'PT_SysADL_Ports_CommandIPT',
          direction: 'out',
          dataType: 'MotorCommand',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'commandOPT',
          to: 'commandIPT',
          dataType: 'MotorCommand'
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
        directionOPT: {
          portClass: 'PT_SysADL_Ports_DirectionOPT',
          direction: 'out',
          dataType: 'Direction',
          role: 'source'
        },
        directionIPT: {
          portClass: 'PT_SysADL_Ports_DirectionIPT',
          direction: 'out',
          dataType: 'Direction',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'directionOPT',
          to: 'directionIPT',
          dataType: 'Direction'
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
          dataType: 'PieceType',
          role: 'source'
        },
        inColor: {
          portClass: 'PT_EnvPortsRobAFIS_InPieceColor',
          direction: 'out',
          dataType: 'PieceType',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outColor',
          to: 'inColor',
          dataType: 'PieceType'
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
class CN_EnvConnectorsRobAFIS_ReadPieceColorEnvCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        outColor: {
          portClass: 'PT_EnvPortsRobAFIS_OutPieceColor',
          direction: 'out',
          dataType: 'PieceType',
          role: 'source'
        },
        inColor: {
          portClass: 'PT_EnvPortsRobAFIS_InPieceColor',
          direction: 'out',
          dataType: 'PieceType',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outColor',
          to: 'inColor',
          dataType: 'PieceType'
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
          dataType: 'PieceType',
          role: 'source'
        },
        inColor: {
          portClass: 'PT_EnvPortsRobAFIS_InPieceColor',
          direction: 'out',
          dataType: 'PieceType',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'outColor',
          to: 'inColor',
          dataType: 'PieceType'
        }
      ]
    });
  }
}

// Components
class CP_SysADL_Components_ParameterInputCP extends Component {
  constructor(name, opts={}) {
      super(name, { ...opts, isBoundary: true });
      // Add ports from component definition
      const portAliases = opts.portAliases || {};
      const portName_pOut = portAliases["pOut"] || "pOut";
      this.addPort(new PT_SysADL_Ports_ParameterOPT(portName_pOut, { owner: name, originalName: "pOut" }));
    }
}
class CP_SysADL_Components_ColorSensorCP extends Component {
  constructor(name, opts={}) {
      super(name, { ...opts, isBoundary: true });
      // Add ports from component definition
      const portAliases = opts.portAliases || {};
      const portName_colorOut = portAliases["colorOut"] || "colorOut";
      this.addPort(new PT_SysADL_Ports_PieceTypeOPT(portName_colorOut, { owner: name, originalName: "colorOut" }));
    }
}
class CP_SysADL_Components_PresenceSensorCP extends Component {
  constructor(name, opts={}) {
      super(name, { ...opts, isBoundary: true });
      // Add ports from component definition
      const portAliases = opts.portAliases || {};
      const portName_presenceOut = portAliases["presenceOut"] || "presenceOut";
      this.addPort(new PT_SysADL_Ports_PresenceOPT(portName_presenceOut, { owner: name, originalName: "presenceOut" }));
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
      const portName_pIn = portAliases["pIn"] || "pIn";
      this.addPort(new PT_SysADL_Ports_ParameterIPT(portName_pIn, { owner: name, originalName: "pIn" }));
      const portName_colorIn = portAliases["colorIn"] || "colorIn";
      this.addPort(new PT_SysADL_Ports_PieceTypeIPT(portName_colorIn, { owner: name, originalName: "colorIn" }));
      const portName_spePresenceIn = portAliases["spePresenceIn"] || "spePresenceIn";
      this.addPort(new PT_SysADL_Ports_PresenceIPT(portName_spePresenceIn, { owner: name, originalName: "spePresenceIn" }));
      const portName_tPresenceIn = portAliases["tPresenceIn"] || "tPresenceIn";
      this.addPort(new PT_SysADL_Ports_PresenceIPT(portName_tPresenceIn, { owner: name, originalName: "tPresenceIn" }));
      const portName_dirOut = portAliases["dirOut"] || "dirOut";
      this.addPort(new PT_SysADL_Ports_DirectionOPT(portName_dirOut, { owner: name, originalName: "dirOut" }));
      const portName_grabOut = portAliases["grabOut"] || "grabOut";
      this.addPort(new PT_SysADL_Ports_CommandOPT(portName_grabOut, { owner: name, originalName: "grabOut" }));
    }
}
class CP_SysADL_Components_RobAFISSystemCFD extends Component { }

// ===== Behavioral Element Classes =====
// Activity class: RobAFISControllerAC
class AC_SysADL_Behavior_RobAFISControllerAC extends Activity {
  constructor(name, component = null, inputPorts = [], delegates = [], opts = {}) {
    super(name, component, inputPorts, delegates, {
      ...opts,
      inParameters: [{"name":"pIn","type":"MissionParameter","direction":"in"},{"name":"colorIn","type":"PieceType","direction":"in"},{"name":"spePresenceIn","type":"Boolean","direction":"in"},{"name":"tPresenceIn","type":"Boolean","direction":"in"}],
      outParameters: [{"name":"dirOut","type":"Direction","direction":"out"},{"name":"grabOut","type":"MotorCommand","direction":"out"}]
    });
  }
}

// Activity class: ParameterInputAC
class AC_SysADL_Boundary_Behavior_ParameterInputAC extends Activity {
  constructor(name, component = null, inputPorts = [], delegates = [], opts = {}) {
    super(name, component, inputPorts, delegates, {
      ...opts,
      inParameters: [{"name":"Param","type":"MissionParameter","direction":"in"}],
      outParameters: [{"name":"pOut","type":"MissionParameter","direction":"out"}]
    });
  }
}

// Activity class: ColorSensorAC
class AC_SysADL_Boundary_Behavior_ColorSensorAC extends Activity {
  constructor(name, component = null, inputPorts = [], delegates = [], opts = {}) {
    super(name, component, inputPorts, delegates, {
      ...opts,
      inParameters: [{"name":"Color","type":"PieceType","direction":"in"}],
      outParameters: [{"name":"colorOut","type":"PieceType","direction":"out"}]
    });
  }
}

// Activity class: PresenceSensorAC
class AC_SysADL_Boundary_Behavior_PresenceSensorAC extends Activity {
  constructor(name, component = null, inputPorts = [], delegates = [], opts = {}) {
    super(name, component, inputPorts, delegates, {
      ...opts,
      inParameters: [{"name":"Presence","type":"Boolean","direction":"in"}],
      outParameters: [{"name":"presenceOut","type":"Boolean","direction":"out"}]
    });
  }
}

// Activity class: GrabberAC
class AC_SysADL_Boundary_Behavior_GrabberAC extends Activity {
  constructor(name, component = null, inputPorts = [], delegates = [], opts = {}) {
    super(name, component, inputPorts, delegates, {
      ...opts,
      inParameters: [{"name":"cmdIn","type":"MotorCommand","direction":"in"}],
      outParameters: [{"name":"Command","type":"MotorCommand","direction":"out"}]
    });
  }
}

// Activity class: DriveSystemAC
class AC_SysADL_Boundary_Behavior_DriveSystemAC extends Activity {
  constructor(name, component = null, inputPorts = [], delegates = [], opts = {}) {
    super(name, component, inputPorts, delegates, {
      ...opts,
      inParameters: [{"name":"dirIn","type":"Direction","direction":"in"}],
      outParameters: [{"name":"Color","type":"NavColor","direction":"out"}]
    });
  }
}

// Activity class: OperatorEA
class AC_ScenariosRobAFIS_OperatorEA extends Activity {
  constructor(name, component = null, inputPorts = [], delegates = [], opts = {}) {
    super(name, component, inputPorts, delegates, {
      ...opts,
      inParameters: [],
      outParameters: [{"name":"opParamOut","type":"MissionParameter","direction":"out"}]
    });
  }
}

// Activity class: UnitEA
class AC_ScenariosRobAFIS_UnitEA extends Activity {
  constructor(name, component = null, inputPorts = [], delegates = [], opts = {}) {
    super(name, component, inputPorts, delegates, {
      ...opts,
      inParameters: [{"name":"OpParam","type":"MissionParameter","direction":"in"},{"name":"UnitNavPad","type":"NavColor","direction":"in"},{"name":"UnitPieceColor","type":"PieceType","direction":"in"},{"name":"SPEPresence","type":"Boolean","direction":"in"},{"name":"TPresence","type":"Boolean","direction":"in"},{"name":"TPieceColor","type":"PieceType","direction":"in"},{"name":"SPEPieceColor","type":"PieceType","direction":"in"}],
      outParameters: [{"name":"UnitNavLine","type":"NavColor","direction":"out"},{"name":"UnitNavPad","type":"NavColor","direction":"out"},{"name":"UnitPieceColor","type":"PieceType","direction":"out"},{"name":"SAPieceColor","type":"PieceType","direction":"out"},{"name":"SPDPieceColor","type":"PieceType","direction":"out"},{"name":"UnitPAColor","type":"NavColor","direction":"out"}]
    });
  }
}

// Action class: DecideCommandAN
class AN_SysADL_Behavior_DecideCommandAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"pIn","type":"MissionParameter","direction":"in"},{"name":"colorIn","type":"PieceType","direction":"in"},{"name":"speIn","type":"Boolean","direction":"in"},{"name":"tIn","type":"Boolean","direction":"in"}],
      outParameters: [{"name":"cmds","type":"RobotCommands","direction":"out"}],
      constraints: ["DecideCommandEQ"],
    });
  }
}

// Action class: ExtractDirAN
class AN_SysADL_Behavior_ExtractDirAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"cmds","type":"RobotCommands","direction":"in"}],
      outParameters: [{"name":"cmds","type":"Direction","direction":"out"}],
      constraints: ["ExtractDirEQ"],
    });
  }
}

// Action class: ExtractGrabAN
class AN_SysADL_Behavior_ExtractGrabAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"cmds","type":"RobotCommands","direction":"in"}],
      outParameters: [{"name":"cmds","type":"MotorCommand","direction":"out"}],
      constraints: ["ExtractGrabEQ"],
    });
  }
}

// Action class: PassParameterAN
class AN_SysADL_Boundary_Behavior_PassParameterAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"Param","type":"MissionParameter","direction":"in"}],
      outParameters: [{"name":"cmds","type":"MissionParameter","direction":"out"}],
    });
  }
}

// Action class: PassPieceTypeAN
class AN_ScenariosRobAFIS_PassPieceTypeAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"Color","type":"PieceType","direction":"in"}],
      outParameters: [{"name":"cmds","type":"PieceType","direction":"out"}],
    });
  }
}

// Action class: PassPresenceAN
class AN_SysADL_Boundary_Behavior_PassPresenceAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"Presence","type":"Boolean","direction":"in"}],
      outParameters: [{"name":"cmds","type":"Boolean","direction":"out"}],
    });
  }
}

// Action class: PassMotorCommandAN
class AN_SysADL_Boundary_Behavior_PassMotorCommandAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"Cmd","type":"MotorCommand","direction":"in"}],
      outParameters: [{"name":"cmds","type":"MotorCommand","direction":"out"}],
    });
  }
}

// Action class: TranslateDirectionToColorAN
class AN_SysADL_Boundary_Behavior_TranslateDirectionToColorAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"Dir","type":"Direction","direction":"in"}],
      outParameters: [{"name":"cmds","type":"NavColor","direction":"out"}],
    });
  }
}

// Action class: PassMissionParameterAN
class AN_ScenariosRobAFIS_PassMissionParameterAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"paramIn","type":"MissionParameter","direction":"in"}],
      outParameters: [{"name":"cmds","type":"MissionParameter","direction":"out"}],
    });
  }
}

// Action class: PassNavColorAN
class AN_ScenariosRobAFIS_PassNavColorAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"colorIn","type":"NavColor","direction":"in"}],
      outParameters: [{"name":"cmds","type":"NavColor","direction":"out"}],
    });
  }
}

// Action class: PassPieceTypeAN (skipped - duplicate of AN_ScenariosRobAFIS_PassPieceTypeAN)
// Constraint class: DecideCommandEQ
class CT_SysADL_Behavior_DecideCommandEQ extends Constraint {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"pIn","type":"MissionParameter","direction":"in"},{"name":"colorIn","type":"PieceType","direction":"in"},{"name":"speIn","type":"Boolean","direction":"in"},{"name":"tIn","type":"Boolean","direction":"in"},{"name":"cmdsOut","type":"RobotCommands","direction":"in"}],
      outParameters: [],
      equation: "(cmdsOut === cmdsOut)",
      constraintFunction: function(params) {// Constraint equation: (cmdsOut === cmdsOut)
          const { pIn, colorIn, speIn, tIn, cmdsOut } = params;
          
          // Type validation
          // Type validation for pIn: MissionParameter (no validation implemented)
          // Type validation for colorIn: PieceType (no validation implemented)
          if (typeof speIn !== 'boolean') throw new Error('Parameter speIn must be a Boolean');
          if (typeof tIn !== 'boolean') throw new Error('Parameter tIn must be a Boolean');
          // Type validation for cmdsOut: RobotCommands (no validation implemented)
          return cmdsOut === cmdsOut;
        }
    });
  }
}

// Constraint class: ExtractDirEQ
class CT_SysADL_Behavior_ExtractDirEQ extends Constraint {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"cmds","type":"RobotCommands","direction":"in"},{"name":"dir","type":"Direction","direction":"in"}],
      outParameters: [],
      equation: "(dir === cmds.dir)",
      constraintFunction: function(params) {// Constraint equation: (dir === cmds.dir)
          const { cmds, dir } = params;
          
          // Type validation
          // Type validation for cmds: RobotCommands (no validation implemented)
          // Type validation for dir: Direction (no validation implemented)
          return dir === cmds.dir;
        }
    });
  }
}

// Constraint class: ExtractGrabEQ
class CT_SysADL_Behavior_ExtractGrabEQ extends Constraint {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"cmds","type":"RobotCommands","direction":"in"},{"name":"grab","type":"MotorCommand","direction":"in"}],
      outParameters: [],
      equation: "(grab === cmds.grab)",
      constraintFunction: function(params) {// Constraint equation: (grab === cmds.grab)
          const { cmds, grab } = params;
          
          // Type validation
          // Type validation for cmds: RobotCommands (no validation implemented)
          // Type validation for grab: MotorCommand (no validation implemented)
          return grab === cmds.grab;
        }
    });
  }
}

// Executable class: DecideCommandEX
class EX_SysADL_Execution_DecideCommandEX extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"pIn","type":"MissionParameter","direction":"in"},{"name":"colorIn","type":"PieceType","direction":"in"},{"name":"spePresenceIn","type":"Boolean","direction":"in"},{"name":"tPresenceIn","type":"Boolean","direction":"in"}],
      body: "executable def DecideCommandEX ( in pIn : MissionParameter, in colorIn : PieceType, in spePresenceIn : Boolean, in tPresenceIn : Boolean ) : out RobotCommands {\n        \n        let cmds : RobotCommands;\n\n        if (spePresenceIn == true) {\n            cmds->dir = Direction::Forward;\n            cmds->grab = MotorCommand::On;\n        } \n        else if (tPresenceIn == true) {\n            if (pIn == MissionParameter::P0) {\n                if (colorIn == PieceType::P1) {\n                    cmds->dir = Direction::Left;   \n                } else {\n                    cmds->dir = Direction::Right;  \n                }\n            } else if (pIn == MissionParameter::P1) {\n                if (colorIn == PieceType::P2) {\n                    cmds->dir = Direction::Left;   \n                } else {\n                    cmds->dir = Direction::Right;  \n                }\n            }\n            cmds->grab = MotorCommand::On;\n        } \n        else {\n            cmds->dir = Direction::Stop;\n            cmds->grab = MotorCommand::Off;\n        }\n\n        return cmds;\n    }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for pIn: (auto-detected from usage)
          // Type validation for colorIn: (auto-detected from usage)
          // Type validation for spePresenceIn: (auto-detected from usage)
          // Type validation for tPresenceIn: (auto-detected from usage)
          const { pIn, colorIn, spePresenceIn, tPresenceIn } = params;
          let cmds;

        if (spePresenceIn == true) {
            cmds.dir = Direction.Forward;
            cmds.grab = MotorCommand.On;
        } 
        else if (tPresenceIn == true) {
            if (pIn == MissionParameter.P0) {
                if (colorIn == PieceType.P1) {
                    cmds.dir = Direction.Left;   
                } else {
                    cmds.dir = Direction.Right;  
                }
            } else if (pIn == MissionParameter.P1) {
                if (colorIn == PieceType.P2) {
                    cmds.dir = Direction.Left;   
                } else {
                    cmds.dir = Direction.Right;  
                }
            }
            cmds.grab = MotorCommand.On;
        } 
        else {
            cmds.dir = Direction.Stop;
            cmds.grab = MotorCommand.Off;
        }

        return cmds;
        }
    });
  }
}

// Executable class: ExtractDirEX
class EX_SysADL_Execution_ExtractDirEX extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"cmds","type":"RobotCommands","direction":"in"}],
      body: "executable def ExtractDirEX ( in cmds : RobotCommands ) : out Direction {\n        return cmds->dir;\n    }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for cmds: (auto-detected from usage)
          const { cmds } = params;
          return cmds.dir;
        }
    });
  }
}

// Executable class: ExtractGrabEX
class EX_SysADL_Execution_ExtractGrabEX extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"cmds","type":"RobotCommands","direction":"in"}],
      body: "executable def ExtractGrabEX ( in cmds : RobotCommands ) : out MotorCommand {\n        return cmds->grab;\n    }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for cmds: (auto-detected from usage)
          const { cmds } = params;
          return cmds.grab;
        }
    });
  }
}

// Executable class: TranslateDirectionToColorEX
class EX_SysADL_Boundary_Execution_TranslateDirectionToColorEX extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"inDir","type":"Direction","direction":"in"}],
      body: "executable def TranslateDirectionToColorEX(in inDir: Direction) : out NavColor {\n        if (inDir == Direction::Stop) {\n            return NavColor::None;\n        }\n        else if (inDir == Direction::Left) {\n            return NavColor::Green;\n        }\n        else if (inDir == Direction::Right) {\n            return NavColor::Red;\n        }\n        else {\n            return NavColor::Black;  \n        }\n    }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for inDir: (auto-detected from usage)
          const { inDir } = params;
          if (inDir == Direction.Stop) {
            return NavColor.None;
        }
        else if (inDir == Direction.Left) {
            return NavColor.Green;
        }
        else if (inDir == Direction.Right) {
            return NavColor.Red;
        }
        else {
            return NavColor.Black;  
        }
        }
    });
  }
}

// Executable class: PassParameterEX
class EX_SysADL_Boundary_Execution_PassParameterEX extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"inParam","type":"MissionParameter","direction":"in"}],
      body: "executable def PassParameterEX (in inParam : MissionParameter) : out MissionParameter {\n        return inParam;\n    }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for inParam: (auto-detected from usage)
          const { inParam } = params;
          return inParam;
        }
    });
  }
}

// Executable class: PassPieceTypeEX
class EX_ScenariosRobAFIS_Execution_PassPieceTypeEX extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"inColor","type":"PieceType","direction":"in"}],
      body: "executable def PassPieceTypeEX (in inColor : PieceType) : out PieceType {\n        return inColor;\n    }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for inColor: (auto-detected from usage)
          const { inColor } = params;
          return inColor;
        }
    });
  }
}

// Executable class: PassPresenceEX
class EX_SysADL_Boundary_Execution_PassPresenceEX extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"inPresence","type":"Boolean","direction":"in"}],
      body: "executable def PassPresenceEX (in inPresence : Boolean) : out Boolean {\n        return inPresence;\n    }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for inPresence: (auto-detected from usage)
          const { inPresence } = params;
          return inPresence;
        }
    });
  }
}

// Executable class: PassMotorCommandEX
class EX_ScenariosRobAFIS_Execution_PassMotorCommandEX extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"inCmd","type":"MotorCommand","direction":"in"}],
      body: "executable def PassMotorCommandEX (in inCmd : MotorCommand) : out MotorCommand {\n        return inCmd;\n    }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for inCmd: (auto-detected from usage)
          const { inCmd } = params;
          return inCmd;
        }
    });
  }
}

// Executable class: PassMissionParameterEX
class EX_ScenariosRobAFIS_Execution_PassMissionParameterEX extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"paramIn","type":"MissionParameter","direction":"in"}],
      body: "executable def PassMissionParameterEX (in paramIn: MissionParameter) : out MissionParameter { return paramIn; }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for paramIn: (auto-detected from usage)
          const { paramIn } = params;
          return paramIn;
        }
    });
  }
}

// Executable class: PassNavColorEX
class EX_ScenariosRobAFIS_Execution_PassNavColorEX extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"colorIn","type":"NavColor","direction":"in"}],
      body: "executable def PassNavColorEX (in colorIn: NavColor) : out NavColor { return colorIn; }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for colorIn: (auto-detected from usage)
          const { colorIn } = params;
          return colorIn;
        }
    });
  }
}

// ===== End Behavioral Element Classes =====

class SysADLModel extends Model {
  constructor(){
    super("SysADLModel");
    this.RobAFISSystemCFD = new CP_SysADL_Components_RobAFISSystemCFD("RobAFISSystemCFD", { sysadlDefinition: "RobAFISSystemCFD" });
    this.addComponent(this.RobAFISSystemCFD);
    this.RobAFISSystemCFD.colorSens = new CP_SysADL_Components_ColorSensorCP("colorSens", { isBoundary: true, sysadlDefinition: "ColorSensorCP", portAliases: {"colorOut":"colorOut"} });
    this.RobAFISSystemCFD.addComponent(this.RobAFISSystemCFD.colorSens);
    this.RobAFISSystemCFD.controller = new CP_SysADL_Components_RobAFISControllerCP("controller", { sysadlDefinition: "RobAFISControllerCP", portAliases: {"pIn":"pIn","colorIn":"colorIn","dirOut":"dirOut","grabOut":"grabOut"} });
    this.RobAFISSystemCFD.addComponent(this.RobAFISSystemCFD.controller);
    this.RobAFISSystemCFD.drive = new CP_SysADL_Components_DriveSystemCP("drive", { isBoundary: true, sysadlDefinition: "DriveSystemCP", portAliases: {"dirIn":"dirIn"} });
    this.RobAFISSystemCFD.addComponent(this.RobAFISSystemCFD.drive);
    this.RobAFISSystemCFD.grabber = new CP_SysADL_Components_GrabberCP("grabber", { isBoundary: true, sysadlDefinition: "GrabberCP", portAliases: {"cmdIn":"cmdIn"} });
    this.RobAFISSystemCFD.addComponent(this.RobAFISSystemCFD.grabber);
    this.RobAFISSystemCFD.pInput = new CP_SysADL_Components_ParameterInputCP("pInput", { isBoundary: true, sysadlDefinition: "ParameterInputCP", portAliases: {"pOut":"pOut"} });
    this.RobAFISSystemCFD.addComponent(this.RobAFISSystemCFD.pInput);
    this.RobAFISSystemCFD.speSens = new CP_SysADL_Components_PresenceSensorCP("speSens", { isBoundary: true, sysadlDefinition: "PresenceSensorCP", portAliases: {"presenceOut":"spePresenceOut"} });
    this.RobAFISSystemCFD.addComponent(this.RobAFISSystemCFD.speSens);
    this.RobAFISSystemCFD.tSens = new CP_SysADL_Components_PresenceSensorCP("tSens", { isBoundary: true, sysadlDefinition: "PresenceSensorCP", portAliases: {"presenceOut":"tPresenceOut"} });
    this.RobAFISSystemCFD.addComponent(this.RobAFISSystemCFD.tSens);

    this.RobAFISSystemCFD.addConnector(new CN_SysADL_Connectors_ParameterCN("pConn"));
    this.RobAFISSystemCFD.addConnector(new CN_SysADL_Connectors_PieceTypeCN("colorConn"));
    this.RobAFISSystemCFD.addConnector(new CN_SysADL_Connectors_PresenceCN("speConn"));
    this.RobAFISSystemCFD.addConnector(new CN_SysADL_Connectors_PresenceCN("tConn"));
    this.RobAFISSystemCFD.addConnector(new CN_SysADL_Connectors_DirectionCN("dirConn"));
    this.RobAFISSystemCFD.addConnector(new CN_SysADL_Connectors_CommandCN("grabConn"));
    try { this.RobAFISSystemCFD.connectors["grabConn"].activityName = "DecideCommandAC"; } catch(e) {}

    const ac_controller = new AC_SysADL_Behavior_RobAFISControllerAC(
      "RobAFISControllerAC",
      "RobAFISSystemCFD.controller",
      ["pIn"],
      [{"from":"pIn","to":"pIn"},{"from":"colorIn","to":"colorIn"},{"from":"spePresenceIn","to":"speIn"},{"from":"tPresenceIn","to":"tIn"},{"from":"grabOut","to":"ExtractGrabAN"},{"from":"dirOut","to":"ExtractDirAN"}],
      {"outParameters":[{"name":"colorIn","type":"Real","direction":"out"},{"name":"spePresenceIn","type":"Real","direction":"out"},{"name":"tPresenceIn","type":"Real","direction":"out"},{"name":"grabOut","type":"Real","direction":"out"},{"name":"dirOut","type":"Real","direction":"out"}]}
    );
    try { ac_controller.portToPinMapping["pIn"] = "pIn"; } catch(e) {}
    try { ac_controller.portToPinMapping["pin"] = "pIn"; } catch(e) {}
    try { ac_controller.portToPinMapping["pIn"] = "pIn"; } catch(e) {}
    try { ac_controller.portToPinMapping["pin"] = "pIn"; } catch(e) {}
    try { ac_controller.portToPinMapping["pIn"] = "pIn"; } catch(e) {}
    try { ac_controller.portToPinMapping["pin"] = "pIn"; } catch(e) {}
    try { ac_controller.portToPinMapping["colorIn"] = "colorIn"; } catch(e) {}
    try { ac_controller.portToPinMapping["colorin"] = "colorIn"; } catch(e) {}
    try { ac_controller.portToPinMapping["colorIn"] = "colorIn"; } catch(e) {}
    try { ac_controller.portToPinMapping["colorin"] = "colorIn"; } catch(e) {}
    try { ac_controller.portToPinMapping["colorIn"] = "colorIn"; } catch(e) {}
    try { ac_controller.portToPinMapping["colorin"] = "colorIn"; } catch(e) {}
    try { ac_controller.portToPinMapping["speIn"] = "spePresenceIn"; } catch(e) {}
    try { ac_controller.portToPinMapping["spein"] = "spePresenceIn"; } catch(e) {}
    try { ac_controller.portToPinMapping["tIn"] = "tPresenceIn"; } catch(e) {}
    try { ac_controller.portToPinMapping["tin"] = "tPresenceIn"; } catch(e) {}
    try { ac_controller.portToPinMapping["ExtractGrabAN"] = "grabOut"; } catch(e) {}
    try { ac_controller.portToPinMapping["extractgraban"] = "grabOut"; } catch(e) {}
    try { ac_controller.portToPinMapping["ExtractDirAN"] = "dirOut"; } catch(e) {}
    try { ac_controller.portToPinMapping["extractdiran"] = "dirOut"; } catch(e) {}
    this.registerActivity("RobAFISControllerAC", ac_controller);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCFD.controller"] = ac_controller; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcfd.controller"] = ac_controller; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["controller"] = ac_controller; } catch(e) {}
    const ac_pInput = new AC_SysADL_Boundary_Behavior_ParameterInputAC(
      "ParameterInputAC",
      "RobAFISSystemCFD.pInput",
      ["pOut"],
      [{"from":"inParam","to":"inParam"},{"from":"pOut","to":"passParam"}],
      {"outParameters":[{"name":"inParam","type":"Real","direction":"out"}]}
    );
    try { ac_pInput.portToPinMapping["inParam"] = "inParam"; } catch(e) {}
    try { ac_pInput.portToPinMapping["inparam"] = "inParam"; } catch(e) {}
    try { ac_pInput.portToPinMapping["passParam"] = "pOut"; } catch(e) {}
    try { ac_pInput.portToPinMapping["passparam"] = "pOut"; } catch(e) {}
    this.registerActivity("ParameterInputAC", ac_pInput);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCFD.pInput"] = ac_pInput; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcfd.pinput"] = ac_pInput; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["pInput"] = ac_pInput; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["pinput"] = ac_pInput; } catch(e) {}
    const ac_colorSens = new AC_SysADL_Boundary_Behavior_ColorSensorAC(
      "ColorSensorAC",
      "RobAFISSystemCFD.colorSens",
      ["colorOut"],
      [{"from":"inColor","to":"inColor"},{"from":"colorOut","to":"passColor"}],
      {"outParameters":[{"name":"inColor","type":"Real","direction":"out"}]}
    );
    try { ac_colorSens.portToPinMapping["inColor"] = "inColor"; } catch(e) {}
    try { ac_colorSens.portToPinMapping["incolor"] = "inColor"; } catch(e) {}
    try { ac_colorSens.portToPinMapping["passColor"] = "colorOut"; } catch(e) {}
    try { ac_colorSens.portToPinMapping["passcolor"] = "colorOut"; } catch(e) {}
    this.registerActivity("ColorSensorAC", ac_colorSens);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCFD.colorSens"] = ac_colorSens; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcfd.colorsens"] = ac_colorSens; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["colorSens"] = ac_colorSens; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["colorsens"] = ac_colorSens; } catch(e) {}
    const ac_speSens = new AC_SysADL_Boundary_Behavior_PresenceSensorAC(
      "PresenceSensorAC",
      "RobAFISSystemCFD.speSens",
      ["presenceOut"],
      [{"from":"inPresence","to":"inPresence"},{"from":"presenceOut","to":"passPresence"}],
      {"outParameters":[{"name":"inPresence","type":"Real","direction":"out"}]}
    );
    try { ac_speSens.portToPinMapping["inPresence"] = "inPresence"; } catch(e) {}
    try { ac_speSens.portToPinMapping["inpresence"] = "inPresence"; } catch(e) {}
    try { ac_speSens.portToPinMapping["passPresence"] = "presenceOut"; } catch(e) {}
    try { ac_speSens.portToPinMapping["passpresence"] = "presenceOut"; } catch(e) {}
    this.registerActivity("PresenceSensorAC", ac_speSens);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCFD.speSens"] = ac_speSens; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcfd.spesens"] = ac_speSens; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["speSens"] = ac_speSens; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["spesens"] = ac_speSens; } catch(e) {}
    const ac_tSens = new AC_SysADL_Boundary_Behavior_PresenceSensorAC(
      "PresenceSensorAC",
      "RobAFISSystemCFD.tSens",
      ["presenceOut"],
      [{"from":"inPresence","to":"inPresence"},{"from":"presenceOut","to":"passPresence"}],
      {"outParameters":[{"name":"inPresence","type":"Real","direction":"out"}]}
    );
    try { ac_tSens.portToPinMapping["inPresence"] = "inPresence"; } catch(e) {}
    try { ac_tSens.portToPinMapping["inpresence"] = "inPresence"; } catch(e) {}
    try { ac_tSens.portToPinMapping["passPresence"] = "presenceOut"; } catch(e) {}
    try { ac_tSens.portToPinMapping["passpresence"] = "presenceOut"; } catch(e) {}
    this.registerActivity("PresenceSensorAC", ac_tSens);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCFD.tSens"] = ac_tSens; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcfd.tsens"] = ac_tSens; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["tSens"] = ac_tSens; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["tsens"] = ac_tSens; } catch(e) {}
    const ac_grabber = new AC_SysADL_Boundary_Behavior_GrabberAC(
      "GrabberAC",
      "RobAFISSystemCFD.grabber",
      ["cmdIn"],
      [{"from":"cmdIn","to":"inCmd"},{"from":"outCommand","to":"passCmd"}],
      {"outParameters":[{"name":"outCommand","type":"Real","direction":"out"}]}
    );
    try { ac_grabber.portToPinMapping["inCmd"] = "cmdIn"; } catch(e) {}
    try { ac_grabber.portToPinMapping["incmd"] = "cmdIn"; } catch(e) {}
    try { ac_grabber.portToPinMapping["passCmd"] = "outCommand"; } catch(e) {}
    try { ac_grabber.portToPinMapping["passcmd"] = "outCommand"; } catch(e) {}
    this.registerActivity("GrabberAC", ac_grabber);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCFD.grabber"] = ac_grabber; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcfd.grabber"] = ac_grabber; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["grabber"] = ac_grabber; } catch(e) {}
    const ac_drive = new AC_SysADL_Boundary_Behavior_DriveSystemAC(
      "DriveSystemAC",
      "RobAFISSystemCFD.drive",
      ["dirIn"],
      [{"from":"dirIn","to":"inDir"},{"from":"outColor","to":"translateDir"}],
      {"outParameters":[{"name":"outColor","type":"Real","direction":"out"}]}
    );
    try { ac_drive.portToPinMapping["inDir"] = "dirIn"; } catch(e) {}
    try { ac_drive.portToPinMapping["indir"] = "dirIn"; } catch(e) {}
    try { ac_drive.portToPinMapping["translateDir"] = "outColor"; } catch(e) {}
    try { ac_drive.portToPinMapping["translatedir"] = "outColor"; } catch(e) {}
    this.registerActivity("DriveSystemAC", ac_drive);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCFD.drive"] = ac_drive; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcfd.drive"] = ac_drive; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["drive"] = ac_drive; } catch(e) {}
    const ac_pInput_2 = new AC_ScenariosRobAFIS_OperatorEA(
      "OperatorEA",
      "RobAFISSystemCFD.pInput",
      ["pOut"],
      [{}],
      {"outParameters":[]}
    );
    this.registerActivity("OperatorEA", ac_pInput_2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCFD.pInput"] = ac_pInput_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcfd.pinput"] = ac_pInput_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["pInput"] = ac_pInput_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["pinput"] = ac_pInput_2; } catch(e) {}
    const ac_colorSens_2 = new AC_ScenariosRobAFIS_OperatorEA(
      "OperatorEA",
      "RobAFISSystemCFD.colorSens",
      ["colorOut"],
      [{}],
      {"outParameters":[]}
    );
    this.registerActivity("OperatorEA", ac_colorSens_2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCFD.colorSens"] = ac_colorSens_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcfd.colorsens"] = ac_colorSens_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["colorSens"] = ac_colorSens_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["colorsens"] = ac_colorSens_2; } catch(e) {}
    const ac_speSens_2 = new AC_ScenariosRobAFIS_OperatorEA(
      "OperatorEA",
      "RobAFISSystemCFD.speSens",
      ["presenceOut"],
      [{}],
      {"outParameters":[]}
    );
    this.registerActivity("OperatorEA", ac_speSens_2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCFD.speSens"] = ac_speSens_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcfd.spesens"] = ac_speSens_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["speSens"] = ac_speSens_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["spesens"] = ac_speSens_2; } catch(e) {}
    const ac_tSens_2 = new AC_ScenariosRobAFIS_OperatorEA(
      "OperatorEA",
      "RobAFISSystemCFD.tSens",
      ["presenceOut"],
      [{}],
      {"outParameters":[]}
    );
    this.registerActivity("OperatorEA", ac_tSens_2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCFD.tSens"] = ac_tSens_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcfd.tsens"] = ac_tSens_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["tSens"] = ac_tSens_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["tsens"] = ac_tSens_2; } catch(e) {}
    const ac_drive_2 = new AC_ScenariosRobAFIS_OperatorEA(
      "OperatorEA",
      "RobAFISSystemCFD.drive",
      ["dirIn"],
      [{}],
      {"outParameters":[]}
    );
    this.registerActivity("OperatorEA", ac_drive_2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCFD.drive"] = ac_drive_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcfd.drive"] = ac_drive_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["drive"] = ac_drive_2; } catch(e) {}
    const ac_grabber_2 = new AC_ScenariosRobAFIS_OperatorEA(
      "OperatorEA",
      "RobAFISSystemCFD.grabber",
      ["cmdIn"],
      [{}],
      {"outParameters":[]}
    );
    this.registerActivity("OperatorEA", ac_grabber_2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCFD.grabber"] = ac_grabber_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcfd.grabber"] = ac_grabber_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["grabber"] = ac_grabber_2; } catch(e) {}
    const ac_controller_2 = new AC_ScenariosRobAFIS_OperatorEA(
      "OperatorEA",
      "RobAFISSystemCFD.controller",
      ["pIn"],
      [{}],
      {"outParameters":[]}
    );
    this.registerActivity("OperatorEA", ac_controller_2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCFD.controller"] = ac_controller_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcfd.controller"] = ac_controller_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["controller"] = ac_controller_2; } catch(e) {}
    const ac_pInput_3 = new AC_ScenariosRobAFIS_UnitEA(
      "UnitEA",
      "RobAFISSystemCFD.pInput",
      ["pOut"],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      {"outParameters":[]}
    );
    this.registerActivity("UnitEA", ac_pInput_3);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCFD.pInput"] = ac_pInput_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcfd.pinput"] = ac_pInput_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["pInput"] = ac_pInput_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["pinput"] = ac_pInput_3; } catch(e) {}
    const ac_colorSens_3 = new AC_ScenariosRobAFIS_UnitEA(
      "UnitEA",
      "RobAFISSystemCFD.colorSens",
      ["colorOut"],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      {"outParameters":[]}
    );
    this.registerActivity("UnitEA", ac_colorSens_3);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCFD.colorSens"] = ac_colorSens_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcfd.colorsens"] = ac_colorSens_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["colorSens"] = ac_colorSens_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["colorsens"] = ac_colorSens_3; } catch(e) {}
    const ac_speSens_3 = new AC_ScenariosRobAFIS_UnitEA(
      "UnitEA",
      "RobAFISSystemCFD.speSens",
      ["presenceOut"],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      {"outParameters":[]}
    );
    this.registerActivity("UnitEA", ac_speSens_3);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCFD.speSens"] = ac_speSens_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcfd.spesens"] = ac_speSens_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["speSens"] = ac_speSens_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["spesens"] = ac_speSens_3; } catch(e) {}
    const ac_tSens_3 = new AC_ScenariosRobAFIS_UnitEA(
      "UnitEA",
      "RobAFISSystemCFD.tSens",
      ["presenceOut"],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      {"outParameters":[]}
    );
    this.registerActivity("UnitEA", ac_tSens_3);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCFD.tSens"] = ac_tSens_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcfd.tsens"] = ac_tSens_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["tSens"] = ac_tSens_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["tsens"] = ac_tSens_3; } catch(e) {}
    const ac_drive_3 = new AC_ScenariosRobAFIS_UnitEA(
      "UnitEA",
      "RobAFISSystemCFD.drive",
      ["dirIn"],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      {"outParameters":[]}
    );
    this.registerActivity("UnitEA", ac_drive_3);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCFD.drive"] = ac_drive_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcfd.drive"] = ac_drive_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["drive"] = ac_drive_3; } catch(e) {}
    const ac_grabber_3 = new AC_ScenariosRobAFIS_UnitEA(
      "UnitEA",
      "RobAFISSystemCFD.grabber",
      ["cmdIn"],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      {"outParameters":[]}
    );
    this.registerActivity("UnitEA", ac_grabber_3);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCFD.grabber"] = ac_grabber_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcfd.grabber"] = ac_grabber_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["grabber"] = ac_grabber_3; } catch(e) {}
    const ac_controller_3 = new AC_ScenariosRobAFIS_UnitEA(
      "UnitEA",
      "RobAFISSystemCFD.controller",
      ["pIn"],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      {"outParameters":[]}
    );
    this.registerActivity("UnitEA", ac_controller_3);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RobAFISSystemCFD.controller"] = ac_controller_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["robafissystemcfd.controller"] = ac_controller_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["controller"] = ac_controller_3; } catch(e) {}
  }

}

function createModel(){ 
  const model = new SysADLModel();
  
  model.typeRegistry = {
    'PieceType': 'EN_PieceType',
    'MissionParameter': 'EN_MissionParameter',
    'MotorCommand': 'EN_MotorCommand',
    'Direction': 'EN_Direction',
    'NavColor': 'EN_NavColor',
  };
  
  // Module context for class resolution
  model._moduleContext = {
    PT_SysADL_Ports_ParameterIPT,
    PT_SysADL_Ports_ParameterOPT,
    PT_SysADL_Ports_PieceTypeIPT,
    PT_SysADL_Ports_PieceTypeOPT,
    PT_SysADL_Ports_PresenceIPT,
    PT_SysADL_Ports_PresenceOPT,
    PT_SysADL_Ports_CommandIPT,
    PT_SysADL_Ports_CommandOPT,
    PT_SysADL_Ports_DirectionIPT,
    PT_SysADL_Ports_DirectionOPT,
    PT_EnvPortsRobAFIS_OutPieceColor,
    PT_EnvPortsRobAFIS_InPieceColor,
    PT_EnvPortsRobAFIS_OutNavColor,
    PT_EnvPortsRobAFIS_InNavColor,
    PT_EnvPortsRobAFIS_OutPresence,
    PT_EnvPortsRobAFIS_InPresence,
    PT_EnvPortsRobAFIS_OutParameter,
    PT_EnvPortsRobAFIS_InParameter,
    PT_EnvPortsRobAFIS_OutMotorCommand,
    PT_EnvPortsRobAFIS_InMotorCommand,
    CN_SysADL_Connectors_ParameterCN,
    CN_SysADL_Connectors_PieceTypeCN,
    CN_SysADL_Connectors_PresenceCN,
    CN_SysADL_Connectors_CommandCN,
    CN_SysADL_Connectors_DirectionCN,
    CN_EnvConnectorsRobAFIS_DetectPieceColorEnvCN,
    CN_EnvConnectorsRobAFIS_DetectParameterEnvCN,
    CN_EnvConnectorsRobAFIS_ReadParameterEnvCN,
    CN_EnvConnectorsRobAFIS_ReadPieceColorEnvCN,
    CN_EnvConnectorsRobAFIS_ReadPresenceEnvCN,
    CN_EnvConnectorsRobAFIS_SendMotorCommandEnvCN,
    CN_EnvConnectorsRobAFIS_SendEnvironmentalDirectionEnvCN,
    CN_EnvConnectorsRobAFIS_SendPieceColorEnvCN,
    CT_SysADL_Behavior_DecideCommandEQ,
    CT_SysADL_Behavior_ExtractDirEQ,
    CT_SysADL_Behavior_ExtractGrabEQ,
    EX_SysADL_Execution_DecideCommandEX,
    EX_SysADL_Execution_ExtractDirEX,
    EX_SysADL_Execution_ExtractGrabEX,
    EX_SysADL_Boundary_Execution_TranslateDirectionToColorEX,
    EX_SysADL_Boundary_Execution_PassParameterEX,
    EX_ScenariosRobAFIS_Execution_PassPieceTypeEX,
    EX_SysADL_Boundary_Execution_PassPresenceEX,
    EX_ScenariosRobAFIS_Execution_PassMotorCommandEX,
    EX_ScenariosRobAFIS_Execution_PassMissionParameterEX,
    EX_ScenariosRobAFIS_Execution_PassNavColorEX,
    EN_PieceType,
    EN_MissionParameter,
    EN_MotorCommand,
    EN_Direction,
    EN_NavColor,
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

module.exports = { createModel, SysADLModel, EN_PieceType, EN_MissionParameter, EN_MotorCommand, EN_Direction, EN_NavColor, DT_RobotCommands, PT_SysADL_Ports_ParameterIPT, PT_SysADL_Ports_ParameterOPT, PT_SysADL_Ports_PieceTypeIPT, PT_SysADL_Ports_PieceTypeOPT, PT_SysADL_Ports_PresenceIPT, PT_SysADL_Ports_PresenceOPT, PT_SysADL_Ports_CommandIPT, PT_SysADL_Ports_CommandOPT, PT_SysADL_Ports_DirectionIPT, PT_SysADL_Ports_DirectionOPT, PT_EnvPortsRobAFIS_OutPieceColor, PT_EnvPortsRobAFIS_InPieceColor, PT_EnvPortsRobAFIS_OutNavColor, PT_EnvPortsRobAFIS_InNavColor, PT_EnvPortsRobAFIS_OutPresence, PT_EnvPortsRobAFIS_InPresence, PT_EnvPortsRobAFIS_OutParameter, PT_EnvPortsRobAFIS_InParameter, PT_EnvPortsRobAFIS_OutMotorCommand, PT_EnvPortsRobAFIS_InMotorCommand };