
const { Model, Component, Port, SimplePort, CompositePort, Connector, Activity, Action, Enum, Int, Boolean, String, Real, Void, valueType, dataType, dimension, unit, Constraint, Executable } = require('../sysadl-framework/SysADLBase');

// Types
const DM_types_Temperature = dimension('Temperature');
const UN_types_Celsius = unit('Celsius');
const UN_types_Fahrenheit = unit('Fahrenheit');
const VT_types_temperature = valueType('temperature', {});
const VT_types_FahrenheitTemperature = valueType('FahrenheitTemperature', {});
const VT_types_CelsiusTemperature = valueType('CelsiusTemperature', {});
const EN_types_Command = new Enum("On", "Off");
const DT_types_Commands = dataType('Commands', { heater: EN_types_Command, cooler: EN_types_Command });
const types = {
  Command: EN_types_Command,
  Commands: DT_types_Commands,
  temperature: VT_types_temperature,
  FahrenheitTemperature: VT_types_FahrenheitTemperature,
  CelsiusTemperature: VT_types_CelsiusTemperature,
  Celsius: UN_types_Celsius,
  Fahrenheit: UN_types_Fahrenheit
};

// Ports
class PT_Ports_FTemperatureOPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "out", { ...{ expectedType: "FahrenheitTemperature" }, ...opts });
  }
}
class PT_Ports_PresenceIPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "Boolean" }, ...opts });
  }
}
class PT_Ports_PresenceOPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "out", { ...{ expectedType: "Boolean" }, ...opts });
  }
}
class PT_Ports_CTemperatureIPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "CelsiusTemperature" }, ...opts });
  }
}
class PT_Ports_CommandIPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "Command" }, ...opts });
  }
}
class PT_Ports_CommandOPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "out", { ...{ expectedType: "Command" }, ...opts });
  }
}
class PT_Ports_CTemperatureOPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "out", { ...{ expectedType: "CelsiusTemperature" }, ...opts });
  }
}

// Connectors
class CN_Connectors_FahrenheitToCelsiusCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        Ft: {
          portClass: 'PT_Ports_FTemperatureOPT',
          direction: 'out',
          dataType: 'FahrenheitTemperature',
          role: 'source'
        },
        Ct: {
          portClass: 'PT_Ports_CTemperatureIPT',
          direction: 'out',
          dataType: 'FahrenheitTemperature',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'Ft',
          to: 'Ct',
          dataType: 'FahrenheitTemperature'
        }
      ]
    });
  }
}
class CN_Connectors_PresenceCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        pOut: {
          portClass: 'PT_Ports_PresenceOPT',
          direction: 'out',
          dataType: 'Boolean',
          role: 'source'
        },
        pIn: {
          portClass: 'PT_Ports_PresenceIPT',
          direction: 'out',
          dataType: 'Boolean',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'pOut',
          to: 'pIn',
          dataType: 'Boolean'
        }
      ]
    });
  }
}
class CN_Connectors_CommandCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        commandOut: {
          portClass: 'PT_Ports_CommandOPT',
          direction: 'out',
          dataType: 'Command',
          role: 'source'
        },
        commandIn: {
          portClass: 'PT_Ports_CommandIPT',
          direction: 'out',
          dataType: 'Command',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'commandOut',
          to: 'commandIn',
          dataType: 'Command'
        }
      ]
    });
  }
}
class CN_Connectors_CTemperatureCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        CtOut: {
          portClass: 'PT_Ports_CTemperatureOPT',
          direction: 'out',
          dataType: 'CelsiusTemperature',
          role: 'source'
        },
        ctIn: {
          portClass: 'PT_Ports_CTemperatureIPT',
          direction: 'out',
          dataType: 'CelsiusTemperature',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'CtOut',
          to: 'ctIn',
          dataType: 'CelsiusTemperature'
        }
      ]
    });
  }
}

// Components
class CP_Components_TemperatureSensorCP extends Component {
  constructor(name, opts={}) {
      super(name, { ...opts, isBoundary: true });
      // Add ports from component definition
      const portAliases = opts.portAliases || {};
      const portName_current = portAliases["current"] || "current";
      this.addPort(new PT_Ports_FTemperatureOPT(portName_current, { owner: name, originalName: "current" }));
    }
}
class CP_Components_PresenceSensorCP extends Component {
  constructor(name, opts={}) {
      super(name, { ...opts, isBoundary: true });
      // Add ports from component definition
      const portAliases = opts.portAliases || {};
      const portName_detected = portAliases["detected"] || "detected";
      this.addPort(new PT_Ports_PresenceOPT(portName_detected, { owner: name, originalName: "detected" }));
    }
}
class CP_Components_UserInterfaceCP extends Component {
  constructor(name, opts={}) {
      super(name, { ...opts, isBoundary: true });
      // Add ports from component definition
      const portAliases = opts.portAliases || {};
      const portName_desired = portAliases["desired"] || "desired";
      this.addPort(new PT_Ports_CTemperatureOPT(portName_desired, { owner: name, originalName: "desired" }));
    }
}
class CP_Components_CoolerCP extends Component {
  constructor(name, opts={}) {
      super(name, { ...opts, isBoundary: true });
      // Add ports from component definition
      const portAliases = opts.portAliases || {};
      const portName_controllerC = portAliases["controllerC"] || "controllerC";
      this.addPort(new PT_Ports_CommandIPT(portName_controllerC, { owner: name, originalName: "controllerC" }));
    }
}
class CP_Components_HeaterCP extends Component {
  constructor(name, opts={}) {
      super(name, { ...opts, isBoundary: true });
      // Add ports from component definition
      const portAliases = opts.portAliases || {};
      const portName_controllerH = portAliases["controllerH"] || "controllerH";
      this.addPort(new PT_Ports_CommandIPT(portName_controllerH, { owner: name, originalName: "controllerH" }));
    }
}
class CP_Components_RoomTemperatureControllerCP extends Component {
  constructor(name, opts={}) {
      super(name, opts);
      // Add ports from component definition
      const portAliases = opts.portAliases || {};
      const portName_detectedRTC = portAliases["detectedRTC"] || "detectedRTC";
      this.addPort(new PT_Ports_PresenceIPT(portName_detectedRTC, { owner: name, originalName: "detectedRTC" }));
      const portName_localTemp1 = portAliases["localTemp1"] || "localTemp1";
      this.addPort(new PT_Ports_CTemperatureIPT(portName_localTemp1, { owner: name, originalName: "localTemp1" }));
      const portName_localTemp2 = portAliases["localTemp2"] || "localTemp2";
      this.addPort(new PT_Ports_CTemperatureIPT(portName_localTemp2, { owner: name, originalName: "localTemp2" }));
      const portName_userTempRTC = portAliases["userTempRTC"] || "userTempRTC";
      this.addPort(new PT_Ports_CTemperatureIPT(portName_userTempRTC, { owner: name, originalName: "userTempRTC" }));
      const portName_heatingRTC = portAliases["heatingRTC"] || "heatingRTC";
      this.addPort(new PT_Ports_CommandOPT(portName_heatingRTC, { owner: name, originalName: "heatingRTC" }));
      const portName_coolingRTC = portAliases["coolingRTC"] || "coolingRTC";
      this.addPort(new PT_Ports_CommandOPT(portName_coolingRTC, { owner: name, originalName: "coolingRTC" }));
    }
}
class CP_Components_SensorsMonitorCP extends Component {
  constructor(name, opts={}) {
      super(name, opts);
      // Add ports from component definition
      const portAliases = opts.portAliases || {};
      const portName_s1 = portAliases["s1"] || "s1";
      this.addPort(new PT_Ports_CTemperatureIPT(portName_s1, { owner: name, originalName: "s1" }));
      const portName_s2 = portAliases["s2"] || "s2";
      this.addPort(new PT_Ports_CTemperatureIPT(portName_s2, { owner: name, originalName: "s2" }));
      const portName_average = portAliases["average"] || "average";
      this.addPort(new PT_Ports_CTemperatureOPT(portName_average, { owner: name, originalName: "average" }));
    }
}
class CP_Components_CommanderCP extends Component {
  constructor(name, opts={}) {
      super(name, opts);
      // Add ports from component definition
      const portAliases = opts.portAliases || {};
      const portName_target2 = portAliases["target2"] || "target2";
      this.addPort(new PT_Ports_CTemperatureIPT(portName_target2, { owner: name, originalName: "target2" }));
      const portName_average2 = portAliases["average2"] || "average2";
      this.addPort(new PT_Ports_CTemperatureIPT(portName_average2, { owner: name, originalName: "average2" }));
      const portName_heating = portAliases["heating"] || "heating";
      this.addPort(new PT_Ports_CommandOPT(portName_heating, { owner: name, originalName: "heating" }));
      const portName_cooling = portAliases["cooling"] || "cooling";
      this.addPort(new PT_Ports_CommandOPT(portName_cooling, { owner: name, originalName: "cooling" }));
    }
}
class CP_Components_PresenceCheckerCP extends Component {
  constructor(name, opts={}) {
      super(name, opts);
      // Add ports from component definition
      const portAliases = opts.portAliases || {};
      const portName_detected = portAliases["detected"] || "detected";
      this.addPort(new PT_Ports_PresenceIPT(portName_detected, { owner: name, originalName: "detected" }));
      const portName_userTemp = portAliases["userTemp"] || "userTemp";
      this.addPort(new PT_Ports_CTemperatureIPT(portName_userTemp, { owner: name, originalName: "userTemp" }));
      const portName_target = portAliases["target"] || "target";
      this.addPort(new PT_Ports_CTemperatureOPT(portName_target, { owner: name, originalName: "target" }));
    }
}
class CP_Components_RTCSystemCFD extends Component { }

// ===== Behavioral Element Classes =====
// Activity class: CalculateAverageTemperatureAC
class AC_Components_CalculateAverageTemperatureAC extends Activity {
  constructor(name, component = null, inputPorts = [], delegates = [], opts = {}) {
    super(name, component, inputPorts, delegates, {
      ...opts,
      inParameters: [{"name":"s1","type":"CelsiusTemperature","direction":"in"},{"name":"s2","type":"CelsiusTemperature","direction":"in"}],
      outParameters: [{"name":"average","type":"CelsiusTemperature","direction":"out"}]
    });
  }
}

// Activity class: CheckPresenceToSetTemperatureAC
class AC_Components_CheckPresenceToSetTemperatureAC extends Activity {
  constructor(name, component = null, inputPorts = [], delegates = [], opts = {}) {
    super(name, component, inputPorts, delegates, {
      ...opts,
      inParameters: [{"name":"detected","type":"Boolean","direction":"in"},{"name":"userTemp","type":"CelsiusTemperature","direction":"in"}],
      outParameters: [{"name":"target","type":"CelsiusTemperature","direction":"out"}]
    });
  }
}

// Activity class: DecideCommandAC
class AC_Components_DecideCommandAC extends Activity {
  constructor(name, component = null, inputPorts = [], delegates = [], opts = {}) {
    super(name, component, inputPorts, delegates, {
      ...opts,
      inParameters: [{"name":"average2","type":"CelsiusTemperature","direction":"in"},{"name":"target2","type":"CelsiusTemperature","direction":"in"}],
      outParameters: [{"name":"cooling","type":"Command","direction":"out"},{"name":"heating","type":"Command","direction":"out"}]
    });
  }
}

// Activity class: FahrenheitToCelsiusAC
class AC_Components_FahrenheitToCelsiusAC extends Activity {
  constructor(name, component = null, inputPorts = [], delegates = [], opts = {}) {
    super(name, component, inputPorts, delegates, {
      ...opts,
      inParameters: [{"name":"current1","type":"FahrenheitTemperature","direction":"in"}],
      outParameters: [{"name":"localTemp1","type":"CelsiusTemperature","direction":"out"}]
    });
  }
}

// Action class: CalculateAverageTemperatureAN
class AN_Components_CalculateAverageTemperatureAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"t1","type":"CelsiusTemperature","direction":"in"},{"name":"t2","type":"CelsiusTemperature","direction":"in"}],
      outParameters: [{"name":"cmds","type":"CelsiusTemperature","direction":"out"}],
      constraints: ["CalculateAverageTemperatureEQ"],
    });
  }
}

// Action class: CompareTemperatureAN
class AN_Components_CompareTemperatureAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"average2","type":"CelsiusTemperature","direction":"in"},{"name":"target2","type":"CelsiusTemperature","direction":"in"}],
      outParameters: [{"name":"cmds","type":"Commands","direction":"out"}],
      constraints: ["CompareTemperatureEQ"],
    });
  }
}

// Action class: CommandHeaterAN
class AN_Components_CommandHeaterAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"cmds","type":"Commands","direction":"in"}],
      outParameters: [{"name":"cmds","type":"Command","direction":"out"}],
      constraints: ["CommandHeaterEQ"],
    });
  }
}

// Action class: CommandCoolerAN
class AN_Components_CommandCoolerAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"cmds","type":"Commands","direction":"in"}],
      outParameters: [{"name":"cmds","type":"Command","direction":"out"}],
      constraints: ["CommandCoolerEQ"],
    });
  }
}

// Action class: FahrenheitToCelsiusAN
class AN_Components_FahrenheitToCelsiusAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"current1","type":"FahrenheitTemperature","direction":"in"}],
      outParameters: [{"name":"cmds","type":"CelsiusTemperature","direction":"out"}],
      constraints: ["FahrenheitToCelsiusEQ"],
    });
  }
}

// Action class: CheckPresenceToSetTemperatureAN
class AN_Components_CheckPresenceToSetTemperatureAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"detected","type":"Boolean","direction":"in"},{"name":"userTemp","type":"CelsiusTemperature","direction":"in"}],
      outParameters: [{"name":"cmds","type":"CelsiusTemperature","direction":"out"}],
      constraints: ["CheckPresenceToSetTemperatureEQ"],
    });
  }
}

// Constraint class: CalculateAverageTemperatureEQ
class CT_Components_CalculateAverageTemperatureEQ extends Constraint {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"t1","type":"CelsiusTemperature","direction":"in"},{"name":"t2","type":"CelsiusTemperature","direction":"in"}],
      outParameters: [{"name":"av","type":"CelsiusTemperature","direction":"out"}],
      equation: "(av === ((t1 + t2) / 2))",
      constraintFunction: function(params) {// Constraint equation: (av === ((t1 + t2) / 2))
          const { t1, t2, av } = params;
          
          // Type validation
          // Type validation for t1: CelsiusTemperature (no validation implemented)
          // Type validation for t2: CelsiusTemperature (no validation implemented)
          // Type validation for av: CelsiusTemperature (no validation implemented)
          return av === ((t1 + t2) / 2);
        }
    });
  }
}

// Constraint class: CompareTemperatureEQ
class CT_Components_CompareTemperatureEQ extends Constraint {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"target2","type":"CelsiusTemperature","direction":"in"},{"name":"average2","type":"CelsiusTemperature","direction":"in"}],
      outParameters: [{"name":"cmds","type":"Commands","direction":"out"}],
      equation: "((average2 > target2) ?  : )",
      constraintFunction: function(params) {// Conditional constraint: ((average2 > target2) ?  : )
          const { target2, average2, cmds } = params;
          
          // Type validation
          // Type validation for target2: CelsiusTemperature (no validation implemented)
          // Type validation for average2: CelsiusTemperature (no validation implemented)
          // Type validation for cmds: Commands (no validation implemented)
          return (average2 > target2) ?  : ;
        }
    });
  }
}

// Constraint class: FahrenheitToCelsiusEQ
class CT_Components_FahrenheitToCelsiusEQ extends Constraint {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"f","type":"FahrenheitTemperature","direction":"in"}],
      outParameters: [{"name":"c","type":"CelsiusTemperature","direction":"out"}],
      equation: "(c === ((5 * (f - 32)) / 9))",
      constraintFunction: function(params) {// Constraint equation: (c === ((5 * (f - 32)) / 9))
          const { f, c } = params;
          
          // Type validation
          // Type validation for f: FahrenheitTemperature (no validation implemented)
          // Type validation for c: CelsiusTemperature (no validation implemented)
          return c === ((5 * (f - 32)) / 9);
        }
    });
  }
}

// Constraint class: CommandHeaterEQ
class CT_Components_CommandHeaterEQ extends Constraint {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"cmds","type":"Commands","direction":"in"}],
      outParameters: [{"name":"c","type":"Command","direction":"out"}],
      equation: "(c === cmds.heater)",
      constraintFunction: function(params) {// Constraint equation: (c === cmds.heater)
          const { cmds, c, heater } = params;
          
          // Type validation
          // Type validation for cmds: Commands (no validation implemented)
          // Type validation for c: Command (no validation implemented)
          if (typeof heater !== 'number') throw new Error('Parameter heater must be a Real (number)');
          return c === cmds.heater;
        }
    });
  }
}

// Constraint class: CommandCoolerEQ
class CT_Components_CommandCoolerEQ extends Constraint {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"cmds","type":"Commands","direction":"in"}],
      outParameters: [{"name":"c","type":"Command","direction":"out"}],
      equation: "(c === cmds.cooler)",
      constraintFunction: function(params) {// Constraint equation: (c === cmds.cooler)
          const { cmds, c, cooler } = params;
          
          // Type validation
          // Type validation for cmds: Commands (no validation implemented)
          // Type validation for c: Command (no validation implemented)
          if (typeof cooler !== 'number') throw new Error('Parameter cooler must be a Real (number)');
          return c === cmds.cooler;
        }
    });
  }
}

// Constraint class: CheckPresenceToSetTemperatureEQ
class CT_Components_CheckPresenceToSetTemperatureEQ extends Constraint {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"detected","type":"Boolean","direction":"in"},{"name":"userTemp","type":"CelsiusTemperature","direction":"in"}],
      outParameters: [{"name":"target","type":"CelsiusTemperature","direction":"out"}],
      equation: "((detected === true) ?  : )",
      constraintFunction: function(params) {// Conditional constraint: ((detected === true) ?  : )
          const { detected, userTemp, target } = params;
          
          // Type validation
          if (typeof detected !== 'boolean') throw new Error('Parameter detected must be a Boolean');
          // Type validation for userTemp: CelsiusTemperature (no validation implemented)
          // Type validation for target: CelsiusTemperature (no validation implemented)
          return (detected === true) ?  : ;
        }
    });
  }
}

// Executable class: CommandCoolerEx
class EX_Components_CommandCoolerEx extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"cmds","type":"Commands","direction":"in"}],
      body: "executable def CommandCoolerEx(in cmds:Commands): out Command{return cmds->cooler ; }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for cmds: (auto-detected from usage)
          const { cmds } = params;
          return cmds.cooler;
        }
    });
  }
}

// Executable class: CommandHeaterEx
class EX_Components_CommandHeaterEx extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"cmds","type":"Commands","direction":"in"}],
      body: "executable def CommandHeaterEx(in cmds:Commands): out Command{return cmds->heater ; }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for cmds: (auto-detected from usage)
          const { cmds } = params;
          return cmds.heater;
        }
    });
  }
}

// Executable class: FahrenheitToCelsiusEx
class EX_Components_FahrenheitToCelsiusEx extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"f","type":"FahrenheitTemperature","direction":"in"}],
      body: "executable def FahrenheitToCelsiusEx(in f:FahrenheitTemperature): out CelsiusTemperature{return 5*(f - 32)/9 ; }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for f: (auto-detected from usage)
          const { f } = params;
          return 5*(f - 32)/9;
        }
    });
  }
}

// Executable class: CalculateAverageTemperatureEx
class EX_Components_CalculateAverageTemperatureEx extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"temp1","type":"CelsiusTemperature","direction":"in"},{"name":"temp2","type":"CelsiusTemperature","direction":"in"}],
      body: "executable def CalculateAverageTemperatureEx(in temp1:CelsiusTemperature,in temp2:CelsiusTemperature):out CelsiusTemperature{return (temp1 + temp2)/2 ; }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for temp1: (auto-detected from usage)
          // Type validation for temp2: (auto-detected from usage)
          const { temp1, temp2 } = params;
          return (temp1 + temp2)/2;
        }
    });
  }
}

// Executable class: CheckPresenceToSetTemperature
class EX_Components_CheckPresenceToSetTemperature extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"presence","type":"Boolean","direction":"in"},{"name":"userTemp","type":"CelsiusTemperature","direction":"in"}],
      body: "executable def CheckPresenceToSetTemperature(in presence:Boolean, in userTemp:CelsiusTemperature):out CelsiusTemperature{if(presence == true) return userTemp; else return 2; }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for presence: (auto-detected from usage)
          // Type validation for userTemp: (auto-detected from usage)
          const { presence, userTemp } = params;
          if(presence == true) return userTemp; else return 2;
        }
    });
  }
}

// Executable class: CompareTemperatureEx
class EX_Components_CompareTemperatureEx extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"target","type":"CelsiusTemperature","direction":"in"},{"name":"average","type":"CelsiusTemperature","direction":"in"}],
      body: "executable def CompareTemperatureEx(in target:CelsiusTemperature, in average:CelsiusTemperature):out Commands{let heater:Command = types.Command::Off; let cooler:Command = types.Command::Off; if(average > target) {heater = types.Command::Off; cooler = types.Command::On ; } else {heater = types.Command::On; cooler = types.Command::Off ;} }",
      executableFunction: function(params) {
          // Type validation
          // Type validation for target: (auto-detected from usage)
          // Type validation for average: (auto-detected from usage)
          const { target, average } = params;
          let heater = types.Command.Off; let cooler = types.Command.Off; if(average > target) {heater = types.Command.Off; cooler = types.Command.On ; } else {heater = types.Command.On; cooler = types.Command.Off ;}
return {heater: heater, cooler: cooler};
        }
    });
  }
}

// ===== End Behavioral Element Classes =====

class SysADLModel extends Model {
  constructor(){
    super("SysADLModel");
    this.RTCSystemCFD = new CP_Components_RTCSystemCFD("RTCSystemCFD", { sysadlDefinition: "RTCSystemCFD" });
    this.addComponent(this.RTCSystemCFD);
    this.RTCSystemCFD.a1 = new CP_Components_HeaterCP("a1", { isBoundary: true, sysadlDefinition: "HeaterCP", portAliases: {"controllerH":"controllerH"} });
    this.RTCSystemCFD.addComponent(this.RTCSystemCFD.a1);
    this.RTCSystemCFD.a2 = new CP_Components_CoolerCP("a2", { isBoundary: true, sysadlDefinition: "CoolerCP", portAliases: {"controllerC":"controllerC"} });
    this.RTCSystemCFD.addComponent(this.RTCSystemCFD.a2);
    this.RTCSystemCFD.rtc = new CP_Components_RoomTemperatureControllerCP("rtc", { sysadlDefinition: "RoomTemperatureControllerCP", portAliases: {"detectedRTC":"detected"} });
    this.RTCSystemCFD.addComponent(this.RTCSystemCFD.rtc);
    this.RTCSystemCFD.s1 = new CP_Components_TemperatureSensorCP("s1", { isBoundary: true, sysadlDefinition: "TemperatureSensorCP", portAliases: {"current":"current1"} });
    this.RTCSystemCFD.addComponent(this.RTCSystemCFD.s1);
    this.RTCSystemCFD.s2 = new CP_Components_TemperatureSensorCP("s2", { isBoundary: true, sysadlDefinition: "TemperatureSensorCP", portAliases: {"current":"current2"} });
    this.RTCSystemCFD.addComponent(this.RTCSystemCFD.s2);
    this.RTCSystemCFD.s3 = new CP_Components_PresenceSensorCP("s3", { isBoundary: true, sysadlDefinition: "PresenceSensorCP", portAliases: {"detected":"detectedS"} });
    this.RTCSystemCFD.addComponent(this.RTCSystemCFD.s3);
    this.RTCSystemCFD.ui = new CP_Components_UserInterfaceCP("ui", { isBoundary: true, sysadlDefinition: "UserInterfaceCP", portAliases: {"desired":"desired"} });
    this.RTCSystemCFD.addComponent(this.RTCSystemCFD.ui);
    this.RTCSystemCFD.rtc.cm = new CP_Components_CommanderCP("cm", { sysadlDefinition: "CommanderCP", portAliases: {} });
    this.RTCSystemCFD.rtc.addComponent(this.RTCSystemCFD.rtc.cm);
    this.RTCSystemCFD.rtc.pc = new CP_Components_PresenceCheckerCP("pc", { sysadlDefinition: "PresenceCheckerCP", portAliases: {"detected":"detected","userTemp":"userTemp","target":"target"} });
    this.RTCSystemCFD.rtc.addComponent(this.RTCSystemCFD.rtc.pc);
    this.RTCSystemCFD.rtc.sm = new CP_Components_SensorsMonitorCP("sm", { sysadlDefinition: "SensorsMonitorCP", portAliases: {"average":"average"} });
    this.RTCSystemCFD.rtc.addComponent(this.RTCSystemCFD.rtc.sm);

    this.RTCSystemCFD.rtc.addConnector(new CN_Connectors_CTemperatureCN("target"));
    this.RTCSystemCFD.rtc.addConnector(new CN_Connectors_CTemperatureCN("average"));
    this.RTCSystemCFD.addConnector(new CN_Connectors_FahrenheitToCelsiusCN("c1"));
    this.RTCSystemCFD.addConnector(new CN_Connectors_CTemperatureCN("uc"));
    this.RTCSystemCFD.addConnector(new CN_Connectors_CommandCN("cc2"));
    try { this.RTCSystemCFD.connectors["cc2"].activityName = "DecideCommandAC"; } catch(e) {}
    this.RTCSystemCFD.addConnector(new CN_Connectors_PresenceCN("pc"));
    this.RTCSystemCFD.addConnector(new CN_Connectors_FahrenheitToCelsiusCN("c2"));
    this.RTCSystemCFD.addConnector(new CN_Connectors_CommandCN("cc1"));
    try { this.RTCSystemCFD.connectors["cc1"].activityName = "DecideCommandAC"; } catch(e) {}

    const ac_s1 = new AC_Components_CalculateAverageTemperatureAC(
      "CalculateAverageTemperatureAC",
      "RTCSystemCFD.s1",
      ["current"],
      [{"from":"s1","to":"s1"},{"from":"s2","to":"s2"},{"from":"average","to":"CalcAvTemp"}],
      {"outParameters":[{"name":"s1","type":"Real","direction":"out"},{"name":"s2","type":"Real","direction":"out"},{"name":"average","type":"Real","direction":"out"}]}
    );
    try { ac_s1.portToPinMapping["s1"] = "s1"; } catch(e) {}
    try { ac_s1.portToPinMapping["s1"] = "s1"; } catch(e) {}
    try { ac_s1.portToPinMapping["s"] = "s1"; } catch(e) {}
    try { ac_s1.portToPinMapping["s"] = "s1"; } catch(e) {}
    try { ac_s1.portToPinMapping["s2"] = "s2"; } catch(e) {}
    try { ac_s1.portToPinMapping["s2"] = "s2"; } catch(e) {}
    try { ac_s1.portToPinMapping["s"] = "s2"; } catch(e) {}
    try { ac_s1.portToPinMapping["s"] = "s2"; } catch(e) {}
    try { ac_s1.portToPinMapping["CalcAvTemp"] = "average"; } catch(e) {}
    try { ac_s1.portToPinMapping["calcavtemp"] = "average"; } catch(e) {}
    this.registerActivity("CalculateAverageTemperatureAC", ac_s1);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.s1"] = ac_s1; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.s1"] = ac_s1; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["s1"] = ac_s1; } catch(e) {}
    const ac_s2 = new AC_Components_CalculateAverageTemperatureAC(
      "CalculateAverageTemperatureAC",
      "RTCSystemCFD.s2",
      ["current"],
      [{"from":"s1","to":"s1"},{"from":"s2","to":"s2"},{"from":"average","to":"CalcAvTemp"}],
      {"outParameters":[{"name":"s1","type":"Real","direction":"out"},{"name":"s2","type":"Real","direction":"out"},{"name":"average","type":"Real","direction":"out"}]}
    );
    try { ac_s2.portToPinMapping["s1"] = "s1"; } catch(e) {}
    try { ac_s2.portToPinMapping["s1"] = "s1"; } catch(e) {}
    try { ac_s2.portToPinMapping["s"] = "s1"; } catch(e) {}
    try { ac_s2.portToPinMapping["s"] = "s1"; } catch(e) {}
    try { ac_s2.portToPinMapping["s2"] = "s2"; } catch(e) {}
    try { ac_s2.portToPinMapping["s2"] = "s2"; } catch(e) {}
    try { ac_s2.portToPinMapping["s"] = "s2"; } catch(e) {}
    try { ac_s2.portToPinMapping["s"] = "s2"; } catch(e) {}
    try { ac_s2.portToPinMapping["CalcAvTemp"] = "average"; } catch(e) {}
    try { ac_s2.portToPinMapping["calcavtemp"] = "average"; } catch(e) {}
    this.registerActivity("CalculateAverageTemperatureAC", ac_s2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.s2"] = ac_s2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.s2"] = ac_s2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["s2"] = ac_s2; } catch(e) {}
    const ac_s3 = new AC_Components_CalculateAverageTemperatureAC(
      "CalculateAverageTemperatureAC",
      "RTCSystemCFD.s3",
      ["detected"],
      [{"from":"s1","to":"s1"},{"from":"s2","to":"s2"},{"from":"average","to":"CalcAvTemp"}],
      {"outParameters":[{"name":"s1","type":"Real","direction":"out"},{"name":"s2","type":"Real","direction":"out"},{"name":"average","type":"Real","direction":"out"}]}
    );
    try { ac_s3.portToPinMapping["s1"] = "s1"; } catch(e) {}
    try { ac_s3.portToPinMapping["s1"] = "s1"; } catch(e) {}
    try { ac_s3.portToPinMapping["s"] = "s1"; } catch(e) {}
    try { ac_s3.portToPinMapping["s"] = "s1"; } catch(e) {}
    try { ac_s3.portToPinMapping["s2"] = "s2"; } catch(e) {}
    try { ac_s3.portToPinMapping["s2"] = "s2"; } catch(e) {}
    try { ac_s3.portToPinMapping["s"] = "s2"; } catch(e) {}
    try { ac_s3.portToPinMapping["s"] = "s2"; } catch(e) {}
    try { ac_s3.portToPinMapping["CalcAvTemp"] = "average"; } catch(e) {}
    try { ac_s3.portToPinMapping["calcavtemp"] = "average"; } catch(e) {}
    this.registerActivity("CalculateAverageTemperatureAC", ac_s3);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.s3"] = ac_s3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.s3"] = ac_s3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["s3"] = ac_s3; } catch(e) {}
    const ac_ui = new AC_Components_CalculateAverageTemperatureAC(
      "CalculateAverageTemperatureAC",
      "RTCSystemCFD.ui",
      ["desired"],
      [{"from":"s1","to":"s1"},{"from":"s2","to":"s2"},{"from":"average","to":"CalcAvTemp"}],
      {"outParameters":[{"name":"s1","type":"Real","direction":"out"},{"name":"s2","type":"Real","direction":"out"},{"name":"average","type":"Real","direction":"out"}]}
    );
    try { ac_ui.portToPinMapping["s1"] = "s1"; } catch(e) {}
    try { ac_ui.portToPinMapping["s1"] = "s1"; } catch(e) {}
    try { ac_ui.portToPinMapping["s"] = "s1"; } catch(e) {}
    try { ac_ui.portToPinMapping["s"] = "s1"; } catch(e) {}
    try { ac_ui.portToPinMapping["s2"] = "s2"; } catch(e) {}
    try { ac_ui.portToPinMapping["s2"] = "s2"; } catch(e) {}
    try { ac_ui.portToPinMapping["s"] = "s2"; } catch(e) {}
    try { ac_ui.portToPinMapping["s"] = "s2"; } catch(e) {}
    try { ac_ui.portToPinMapping["CalcAvTemp"] = "average"; } catch(e) {}
    try { ac_ui.portToPinMapping["calcavtemp"] = "average"; } catch(e) {}
    this.registerActivity("CalculateAverageTemperatureAC", ac_ui);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.ui"] = ac_ui; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.ui"] = ac_ui; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["ui"] = ac_ui; } catch(e) {}
    const ac_a2 = new AC_Components_CalculateAverageTemperatureAC(
      "CalculateAverageTemperatureAC",
      "RTCSystemCFD.a2",
      ["controllerC"],
      [{"from":"s1","to":"s1"},{"from":"s2","to":"s2"},{"from":"average","to":"CalcAvTemp"}],
      {"outParameters":[{"name":"s1","type":"Real","direction":"out"},{"name":"s2","type":"Real","direction":"out"},{"name":"average","type":"Real","direction":"out"}]}
    );
    try { ac_a2.portToPinMapping["s1"] = "s1"; } catch(e) {}
    try { ac_a2.portToPinMapping["s1"] = "s1"; } catch(e) {}
    try { ac_a2.portToPinMapping["s"] = "s1"; } catch(e) {}
    try { ac_a2.portToPinMapping["s"] = "s1"; } catch(e) {}
    try { ac_a2.portToPinMapping["s2"] = "s2"; } catch(e) {}
    try { ac_a2.portToPinMapping["s2"] = "s2"; } catch(e) {}
    try { ac_a2.portToPinMapping["s"] = "s2"; } catch(e) {}
    try { ac_a2.portToPinMapping["s"] = "s2"; } catch(e) {}
    try { ac_a2.portToPinMapping["CalcAvTemp"] = "average"; } catch(e) {}
    try { ac_a2.portToPinMapping["calcavtemp"] = "average"; } catch(e) {}
    this.registerActivity("CalculateAverageTemperatureAC", ac_a2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.a2"] = ac_a2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.a2"] = ac_a2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["a2"] = ac_a2; } catch(e) {}
    const ac_a1 = new AC_Components_CalculateAverageTemperatureAC(
      "CalculateAverageTemperatureAC",
      "RTCSystemCFD.a1",
      ["controllerH"],
      [{"from":"s1","to":"s1"},{"from":"s2","to":"s2"},{"from":"average","to":"CalcAvTemp"}],
      {"outParameters":[{"name":"s1","type":"Real","direction":"out"},{"name":"s2","type":"Real","direction":"out"},{"name":"average","type":"Real","direction":"out"}]}
    );
    try { ac_a1.portToPinMapping["s1"] = "s1"; } catch(e) {}
    try { ac_a1.portToPinMapping["s1"] = "s1"; } catch(e) {}
    try { ac_a1.portToPinMapping["s"] = "s1"; } catch(e) {}
    try { ac_a1.portToPinMapping["s"] = "s1"; } catch(e) {}
    try { ac_a1.portToPinMapping["s2"] = "s2"; } catch(e) {}
    try { ac_a1.portToPinMapping["s2"] = "s2"; } catch(e) {}
    try { ac_a1.portToPinMapping["s"] = "s2"; } catch(e) {}
    try { ac_a1.portToPinMapping["s"] = "s2"; } catch(e) {}
    try { ac_a1.portToPinMapping["CalcAvTemp"] = "average"; } catch(e) {}
    try { ac_a1.portToPinMapping["calcavtemp"] = "average"; } catch(e) {}
    this.registerActivity("CalculateAverageTemperatureAC", ac_a1);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.a1"] = ac_a1; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.a1"] = ac_a1; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["a1"] = ac_a1; } catch(e) {}
    const ac_rtc = new AC_Components_CalculateAverageTemperatureAC(
      "CalculateAverageTemperatureAC",
      "RTCSystemCFD.rtc",
      ["s1"],
      [{"from":"s1","to":"s1"},{"from":"s2","to":"s2"},{"from":"average","to":"CalcAvTemp"}],
      {"outParameters":[{"name":"s2","type":"Real","direction":"out"},{"name":"average","type":"Real","direction":"out"}]}
    );
    try { ac_rtc.portToPinMapping["s1"] = "s1"; } catch(e) {}
    try { ac_rtc.portToPinMapping["s1"] = "s1"; } catch(e) {}
    try { ac_rtc.portToPinMapping["s"] = "s1"; } catch(e) {}
    try { ac_rtc.portToPinMapping["s"] = "s1"; } catch(e) {}
    try { ac_rtc.portToPinMapping["s2"] = "s2"; } catch(e) {}
    try { ac_rtc.portToPinMapping["s2"] = "s2"; } catch(e) {}
    try { ac_rtc.portToPinMapping["s"] = "s2"; } catch(e) {}
    try { ac_rtc.portToPinMapping["s"] = "s2"; } catch(e) {}
    try { ac_rtc.portToPinMapping["CalcAvTemp"] = "average"; } catch(e) {}
    try { ac_rtc.portToPinMapping["calcavtemp"] = "average"; } catch(e) {}
    this.registerActivity("CalculateAverageTemperatureAC", ac_rtc);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.rtc"] = ac_rtc; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.rtc"] = ac_rtc; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtc"] = ac_rtc; } catch(e) {}
    const ac_sm = new AC_Components_CalculateAverageTemperatureAC(
      "CalculateAverageTemperatureAC",
      "RTCSystemCFD.rtc.sm",
      ["s1"],
      [{"from":"s1","to":"s1"},{"from":"s2","to":"s2"},{"from":"average","to":"CalcAvTemp"}],
      {"outParameters":[{"name":"s2","type":"Real","direction":"out"},{"name":"average","type":"Real","direction":"out"}]}
    );
    try { ac_sm.portToPinMapping["s1"] = "s1"; } catch(e) {}
    try { ac_sm.portToPinMapping["s1"] = "s1"; } catch(e) {}
    try { ac_sm.portToPinMapping["s"] = "s1"; } catch(e) {}
    try { ac_sm.portToPinMapping["s"] = "s1"; } catch(e) {}
    try { ac_sm.portToPinMapping["s2"] = "s2"; } catch(e) {}
    try { ac_sm.portToPinMapping["s2"] = "s2"; } catch(e) {}
    try { ac_sm.portToPinMapping["s"] = "s2"; } catch(e) {}
    try { ac_sm.portToPinMapping["s"] = "s2"; } catch(e) {}
    try { ac_sm.portToPinMapping["CalcAvTemp"] = "average"; } catch(e) {}
    try { ac_sm.portToPinMapping["calcavtemp"] = "average"; } catch(e) {}
    this.registerActivity("CalculateAverageTemperatureAC", ac_sm);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.rtc.sm"] = ac_sm; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.rtc.sm"] = ac_sm; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtc.sm"] = ac_sm; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["sm"] = ac_sm; } catch(e) {}
    const ac_cm = new AC_Components_CalculateAverageTemperatureAC(
      "CalculateAverageTemperatureAC",
      "RTCSystemCFD.rtc.cm",
      ["target2"],
      [{"from":"s1","to":"s1"},{"from":"s2","to":"s2"},{"from":"average","to":"CalcAvTemp"}],
      {"outParameters":[{"name":"s1","type":"Real","direction":"out"},{"name":"s2","type":"Real","direction":"out"},{"name":"average","type":"Real","direction":"out"}]}
    );
    try { ac_cm.portToPinMapping["s1"] = "s1"; } catch(e) {}
    try { ac_cm.portToPinMapping["s1"] = "s1"; } catch(e) {}
    try { ac_cm.portToPinMapping["s"] = "s1"; } catch(e) {}
    try { ac_cm.portToPinMapping["s"] = "s1"; } catch(e) {}
    try { ac_cm.portToPinMapping["s2"] = "s2"; } catch(e) {}
    try { ac_cm.portToPinMapping["s2"] = "s2"; } catch(e) {}
    try { ac_cm.portToPinMapping["s"] = "s2"; } catch(e) {}
    try { ac_cm.portToPinMapping["s"] = "s2"; } catch(e) {}
    try { ac_cm.portToPinMapping["CalcAvTemp"] = "average"; } catch(e) {}
    try { ac_cm.portToPinMapping["calcavtemp"] = "average"; } catch(e) {}
    this.registerActivity("CalculateAverageTemperatureAC", ac_cm);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.rtc.cm"] = ac_cm; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.rtc.cm"] = ac_cm; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtc.cm"] = ac_cm; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["cm"] = ac_cm; } catch(e) {}
    const ac_pc = new AC_Components_CalculateAverageTemperatureAC(
      "CalculateAverageTemperatureAC",
      "RTCSystemCFD.rtc.pc",
      ["detected"],
      [{"from":"s1","to":"s1"},{"from":"s2","to":"s2"},{"from":"average","to":"CalcAvTemp"}],
      {"outParameters":[{"name":"s1","type":"Real","direction":"out"},{"name":"s2","type":"Real","direction":"out"},{"name":"average","type":"Real","direction":"out"}]}
    );
    try { ac_pc.portToPinMapping["s1"] = "s1"; } catch(e) {}
    try { ac_pc.portToPinMapping["s1"] = "s1"; } catch(e) {}
    try { ac_pc.portToPinMapping["s"] = "s1"; } catch(e) {}
    try { ac_pc.portToPinMapping["s"] = "s1"; } catch(e) {}
    try { ac_pc.portToPinMapping["s2"] = "s2"; } catch(e) {}
    try { ac_pc.portToPinMapping["s2"] = "s2"; } catch(e) {}
    try { ac_pc.portToPinMapping["s"] = "s2"; } catch(e) {}
    try { ac_pc.portToPinMapping["s"] = "s2"; } catch(e) {}
    try { ac_pc.portToPinMapping["CalcAvTemp"] = "average"; } catch(e) {}
    try { ac_pc.portToPinMapping["calcavtemp"] = "average"; } catch(e) {}
    this.registerActivity("CalculateAverageTemperatureAC", ac_pc);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.rtc.pc"] = ac_pc; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.rtc.pc"] = ac_pc; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtc.pc"] = ac_pc; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["pc"] = ac_pc; } catch(e) {}
    const ac_s1_2 = new AC_Components_CheckPresenceToSetTemperatureAC(
      "CheckPresenceToSetTemperatureAC",
      "RTCSystemCFD.s1",
      ["current"],
      [{"from":"detected","to":"detected"},{"from":"userTemp","to":"userTemp"},{"from":"target","to":"CheckPresenceToSetTemperatureAN"}],
      {"outParameters":[{"name":"detected","type":"Real","direction":"out"},{"name":"userTemp","type":"Real","direction":"out"},{"name":"target","type":"Real","direction":"out"}]}
    );
    const CheckPresenceToSetTemperatureAN_inst = new AN_Components_CheckPresenceToSetTemperatureAN("CheckPresenceToSetTemperatureAN");
    ac_s1_2.registerAction(CheckPresenceToSetTemperatureAN_inst);
    try { ac_s1_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_s1_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_s1_2.portToPinMapping["detectedS"] = "detected"; } catch(e) {}
    try { ac_s1_2.portToPinMapping["detecteds"] = "detected"; } catch(e) {}
    try { ac_s1_2.portToPinMapping["detectedRTC"] = "detected"; } catch(e) {}
    try { ac_s1_2.portToPinMapping["detectedrtc"] = "detected"; } catch(e) {}
    try { ac_s1_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_s1_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_s1_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_s1_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_s1_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_s1_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_s1_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_s1_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_s1_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_s1_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_s1_2.portToPinMapping["CheckPresenceToSetTemperatureAN"] = "target"; } catch(e) {}
    try { ac_s1_2.portToPinMapping["checkpresencetosettemperaturean"] = "target"; } catch(e) {}
    this.registerActivity("CheckPresenceToSetTemperatureAC", ac_s1_2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.s1"] = ac_s1_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.s1"] = ac_s1_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["s1"] = ac_s1_2; } catch(e) {}
    const ac_s2_2 = new AC_Components_CheckPresenceToSetTemperatureAC(
      "CheckPresenceToSetTemperatureAC",
      "RTCSystemCFD.s2",
      ["current"],
      [{"from":"detected","to":"detected"},{"from":"userTemp","to":"userTemp"},{"from":"target","to":"CheckPresenceToSetTemperatureAN"}],
      {"outParameters":[{"name":"detected","type":"Real","direction":"out"},{"name":"userTemp","type":"Real","direction":"out"},{"name":"target","type":"Real","direction":"out"}]}
    );
    const CheckPresenceToSetTemperatureAN_inst = new AN_Components_CheckPresenceToSetTemperatureAN("CheckPresenceToSetTemperatureAN");
    ac_s2_2.registerAction(CheckPresenceToSetTemperatureAN_inst);
    try { ac_s2_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_s2_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_s2_2.portToPinMapping["detectedS"] = "detected"; } catch(e) {}
    try { ac_s2_2.portToPinMapping["detecteds"] = "detected"; } catch(e) {}
    try { ac_s2_2.portToPinMapping["detectedRTC"] = "detected"; } catch(e) {}
    try { ac_s2_2.portToPinMapping["detectedrtc"] = "detected"; } catch(e) {}
    try { ac_s2_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_s2_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_s2_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_s2_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_s2_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_s2_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_s2_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_s2_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_s2_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_s2_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_s2_2.portToPinMapping["CheckPresenceToSetTemperatureAN"] = "target"; } catch(e) {}
    try { ac_s2_2.portToPinMapping["checkpresencetosettemperaturean"] = "target"; } catch(e) {}
    this.registerActivity("CheckPresenceToSetTemperatureAC", ac_s2_2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.s2"] = ac_s2_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.s2"] = ac_s2_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["s2"] = ac_s2_2; } catch(e) {}
    const ac_s3_2 = new AC_Components_CheckPresenceToSetTemperatureAC(
      "CheckPresenceToSetTemperatureAC",
      "RTCSystemCFD.s3",
      ["detected"],
      [{"from":"detected","to":"detected"},{"from":"userTemp","to":"userTemp"},{"from":"target","to":"CheckPresenceToSetTemperatureAN"}],
      {"outParameters":[{"name":"userTemp","type":"Real","direction":"out"},{"name":"target","type":"Real","direction":"out"}]}
    );
    const CheckPresenceToSetTemperatureAN_inst = new AN_Components_CheckPresenceToSetTemperatureAN("CheckPresenceToSetTemperatureAN");
    ac_s3_2.registerAction(CheckPresenceToSetTemperatureAN_inst);
    try { ac_s3_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_s3_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_s3_2.portToPinMapping["detectedS"] = "detected"; } catch(e) {}
    try { ac_s3_2.portToPinMapping["detecteds"] = "detected"; } catch(e) {}
    try { ac_s3_2.portToPinMapping["detectedRTC"] = "detected"; } catch(e) {}
    try { ac_s3_2.portToPinMapping["detectedrtc"] = "detected"; } catch(e) {}
    try { ac_s3_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_s3_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_s3_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_s3_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_s3_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_s3_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_s3_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_s3_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_s3_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_s3_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_s3_2.portToPinMapping["CheckPresenceToSetTemperatureAN"] = "target"; } catch(e) {}
    try { ac_s3_2.portToPinMapping["checkpresencetosettemperaturean"] = "target"; } catch(e) {}
    this.registerActivity("CheckPresenceToSetTemperatureAC", ac_s3_2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.s3"] = ac_s3_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.s3"] = ac_s3_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["s3"] = ac_s3_2; } catch(e) {}
    const ac_ui_2 = new AC_Components_CheckPresenceToSetTemperatureAC(
      "CheckPresenceToSetTemperatureAC",
      "RTCSystemCFD.ui",
      ["desired"],
      [{"from":"detected","to":"detected"},{"from":"userTemp","to":"userTemp"},{"from":"target","to":"CheckPresenceToSetTemperatureAN"}],
      {"outParameters":[{"name":"detected","type":"Real","direction":"out"},{"name":"userTemp","type":"Real","direction":"out"},{"name":"target","type":"Real","direction":"out"}]}
    );
    const CheckPresenceToSetTemperatureAN_inst = new AN_Components_CheckPresenceToSetTemperatureAN("CheckPresenceToSetTemperatureAN");
    ac_ui_2.registerAction(CheckPresenceToSetTemperatureAN_inst);
    try { ac_ui_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_ui_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_ui_2.portToPinMapping["detectedS"] = "detected"; } catch(e) {}
    try { ac_ui_2.portToPinMapping["detecteds"] = "detected"; } catch(e) {}
    try { ac_ui_2.portToPinMapping["detectedRTC"] = "detected"; } catch(e) {}
    try { ac_ui_2.portToPinMapping["detectedrtc"] = "detected"; } catch(e) {}
    try { ac_ui_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_ui_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_ui_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_ui_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_ui_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_ui_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_ui_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_ui_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_ui_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_ui_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_ui_2.portToPinMapping["CheckPresenceToSetTemperatureAN"] = "target"; } catch(e) {}
    try { ac_ui_2.portToPinMapping["checkpresencetosettemperaturean"] = "target"; } catch(e) {}
    this.registerActivity("CheckPresenceToSetTemperatureAC", ac_ui_2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.ui"] = ac_ui_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.ui"] = ac_ui_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["ui"] = ac_ui_2; } catch(e) {}
    const ac_a2_2 = new AC_Components_CheckPresenceToSetTemperatureAC(
      "CheckPresenceToSetTemperatureAC",
      "RTCSystemCFD.a2",
      ["controllerC"],
      [{"from":"detected","to":"detected"},{"from":"userTemp","to":"userTemp"},{"from":"target","to":"CheckPresenceToSetTemperatureAN"}],
      {"outParameters":[{"name":"detected","type":"Real","direction":"out"},{"name":"userTemp","type":"Real","direction":"out"},{"name":"target","type":"Real","direction":"out"}]}
    );
    const CheckPresenceToSetTemperatureAN_inst = new AN_Components_CheckPresenceToSetTemperatureAN("CheckPresenceToSetTemperatureAN");
    ac_a2_2.registerAction(CheckPresenceToSetTemperatureAN_inst);
    try { ac_a2_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_a2_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_a2_2.portToPinMapping["detectedS"] = "detected"; } catch(e) {}
    try { ac_a2_2.portToPinMapping["detecteds"] = "detected"; } catch(e) {}
    try { ac_a2_2.portToPinMapping["detectedRTC"] = "detected"; } catch(e) {}
    try { ac_a2_2.portToPinMapping["detectedrtc"] = "detected"; } catch(e) {}
    try { ac_a2_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_a2_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_a2_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_a2_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_a2_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_a2_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_a2_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_a2_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_a2_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_a2_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_a2_2.portToPinMapping["CheckPresenceToSetTemperatureAN"] = "target"; } catch(e) {}
    try { ac_a2_2.portToPinMapping["checkpresencetosettemperaturean"] = "target"; } catch(e) {}
    this.registerActivity("CheckPresenceToSetTemperatureAC", ac_a2_2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.a2"] = ac_a2_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.a2"] = ac_a2_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["a2"] = ac_a2_2; } catch(e) {}
    const ac_a1_2 = new AC_Components_CheckPresenceToSetTemperatureAC(
      "CheckPresenceToSetTemperatureAC",
      "RTCSystemCFD.a1",
      ["controllerH"],
      [{"from":"detected","to":"detected"},{"from":"userTemp","to":"userTemp"},{"from":"target","to":"CheckPresenceToSetTemperatureAN"}],
      {"outParameters":[{"name":"detected","type":"Real","direction":"out"},{"name":"userTemp","type":"Real","direction":"out"},{"name":"target","type":"Real","direction":"out"}]}
    );
    const CheckPresenceToSetTemperatureAN_inst = new AN_Components_CheckPresenceToSetTemperatureAN("CheckPresenceToSetTemperatureAN");
    ac_a1_2.registerAction(CheckPresenceToSetTemperatureAN_inst);
    try { ac_a1_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_a1_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_a1_2.portToPinMapping["detectedS"] = "detected"; } catch(e) {}
    try { ac_a1_2.portToPinMapping["detecteds"] = "detected"; } catch(e) {}
    try { ac_a1_2.portToPinMapping["detectedRTC"] = "detected"; } catch(e) {}
    try { ac_a1_2.portToPinMapping["detectedrtc"] = "detected"; } catch(e) {}
    try { ac_a1_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_a1_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_a1_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_a1_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_a1_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_a1_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_a1_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_a1_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_a1_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_a1_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_a1_2.portToPinMapping["CheckPresenceToSetTemperatureAN"] = "target"; } catch(e) {}
    try { ac_a1_2.portToPinMapping["checkpresencetosettemperaturean"] = "target"; } catch(e) {}
    this.registerActivity("CheckPresenceToSetTemperatureAC", ac_a1_2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.a1"] = ac_a1_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.a1"] = ac_a1_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["a1"] = ac_a1_2; } catch(e) {}
    const ac_rtc_2 = new AC_Components_CheckPresenceToSetTemperatureAC(
      "CheckPresenceToSetTemperatureAC",
      "RTCSystemCFD.rtc",
      ["detected"],
      [{"from":"detected","to":"detected"},{"from":"userTemp","to":"userTemp"},{"from":"target","to":"CheckPresenceToSetTemperatureAN"}],
      {"outParameters":[{"name":"userTemp","type":"Real","direction":"out"},{"name":"target","type":"Real","direction":"out"}]}
    );
    const CheckPresenceToSetTemperatureAN_inst = new AN_Components_CheckPresenceToSetTemperatureAN("CheckPresenceToSetTemperatureAN");
    ac_rtc_2.registerAction(CheckPresenceToSetTemperatureAN_inst);
    try { ac_rtc_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_rtc_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_rtc_2.portToPinMapping["detectedS"] = "detected"; } catch(e) {}
    try { ac_rtc_2.portToPinMapping["detecteds"] = "detected"; } catch(e) {}
    try { ac_rtc_2.portToPinMapping["detectedRTC"] = "detected"; } catch(e) {}
    try { ac_rtc_2.portToPinMapping["detectedrtc"] = "detected"; } catch(e) {}
    try { ac_rtc_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_rtc_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_rtc_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_rtc_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_rtc_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_rtc_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_rtc_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_rtc_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_rtc_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_rtc_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_rtc_2.portToPinMapping["CheckPresenceToSetTemperatureAN"] = "target"; } catch(e) {}
    try { ac_rtc_2.portToPinMapping["checkpresencetosettemperaturean"] = "target"; } catch(e) {}
    this.registerActivity("CheckPresenceToSetTemperatureAC", ac_rtc_2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.rtc"] = ac_rtc_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.rtc"] = ac_rtc_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtc"] = ac_rtc_2; } catch(e) {}
    const ac_sm_2 = new AC_Components_CheckPresenceToSetTemperatureAC(
      "CheckPresenceToSetTemperatureAC",
      "RTCSystemCFD.rtc.sm",
      ["s1"],
      [{"from":"detected","to":"detected"},{"from":"userTemp","to":"userTemp"},{"from":"target","to":"CheckPresenceToSetTemperatureAN"}],
      {"outParameters":[{"name":"detected","type":"Real","direction":"out"},{"name":"userTemp","type":"Real","direction":"out"},{"name":"target","type":"Real","direction":"out"}]}
    );
    const CheckPresenceToSetTemperatureAN_inst = new AN_Components_CheckPresenceToSetTemperatureAN("CheckPresenceToSetTemperatureAN");
    ac_sm_2.registerAction(CheckPresenceToSetTemperatureAN_inst);
    try { ac_sm_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_sm_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_sm_2.portToPinMapping["detectedS"] = "detected"; } catch(e) {}
    try { ac_sm_2.portToPinMapping["detecteds"] = "detected"; } catch(e) {}
    try { ac_sm_2.portToPinMapping["detectedRTC"] = "detected"; } catch(e) {}
    try { ac_sm_2.portToPinMapping["detectedrtc"] = "detected"; } catch(e) {}
    try { ac_sm_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_sm_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_sm_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_sm_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_sm_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_sm_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_sm_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_sm_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_sm_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_sm_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_sm_2.portToPinMapping["CheckPresenceToSetTemperatureAN"] = "target"; } catch(e) {}
    try { ac_sm_2.portToPinMapping["checkpresencetosettemperaturean"] = "target"; } catch(e) {}
    this.registerActivity("CheckPresenceToSetTemperatureAC", ac_sm_2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.rtc.sm"] = ac_sm_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.rtc.sm"] = ac_sm_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtc.sm"] = ac_sm_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["sm"] = ac_sm_2; } catch(e) {}
    const ac_cm_2 = new AC_Components_CheckPresenceToSetTemperatureAC(
      "CheckPresenceToSetTemperatureAC",
      "RTCSystemCFD.rtc.cm",
      ["target2"],
      [{"from":"detected","to":"detected"},{"from":"userTemp","to":"userTemp"},{"from":"target","to":"CheckPresenceToSetTemperatureAN"}],
      {"outParameters":[{"name":"detected","type":"Real","direction":"out"},{"name":"userTemp","type":"Real","direction":"out"},{"name":"target","type":"Real","direction":"out"}]}
    );
    const CheckPresenceToSetTemperatureAN_inst = new AN_Components_CheckPresenceToSetTemperatureAN("CheckPresenceToSetTemperatureAN");
    ac_cm_2.registerAction(CheckPresenceToSetTemperatureAN_inst);
    try { ac_cm_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_cm_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_cm_2.portToPinMapping["detectedS"] = "detected"; } catch(e) {}
    try { ac_cm_2.portToPinMapping["detecteds"] = "detected"; } catch(e) {}
    try { ac_cm_2.portToPinMapping["detectedRTC"] = "detected"; } catch(e) {}
    try { ac_cm_2.portToPinMapping["detectedrtc"] = "detected"; } catch(e) {}
    try { ac_cm_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_cm_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_cm_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_cm_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_cm_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_cm_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_cm_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_cm_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_cm_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_cm_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_cm_2.portToPinMapping["CheckPresenceToSetTemperatureAN"] = "target"; } catch(e) {}
    try { ac_cm_2.portToPinMapping["checkpresencetosettemperaturean"] = "target"; } catch(e) {}
    this.registerActivity("CheckPresenceToSetTemperatureAC", ac_cm_2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.rtc.cm"] = ac_cm_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.rtc.cm"] = ac_cm_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtc.cm"] = ac_cm_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["cm"] = ac_cm_2; } catch(e) {}
    const ac_pc_2 = new AC_Components_CheckPresenceToSetTemperatureAC(
      "CheckPresenceToSetTemperatureAC",
      "RTCSystemCFD.rtc.pc",
      ["detected"],
      [{"from":"detected","to":"detected"},{"from":"userTemp","to":"userTemp"},{"from":"target","to":"CheckPresenceToSetTemperatureAN"}],
      {"outParameters":[{"name":"userTemp","type":"Real","direction":"out"},{"name":"target","type":"Real","direction":"out"}]}
    );
    const CheckPresenceToSetTemperatureAN_inst = new AN_Components_CheckPresenceToSetTemperatureAN("CheckPresenceToSetTemperatureAN");
    ac_pc_2.registerAction(CheckPresenceToSetTemperatureAN_inst);
    try { ac_pc_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_pc_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_pc_2.portToPinMapping["detectedS"] = "detected"; } catch(e) {}
    try { ac_pc_2.portToPinMapping["detecteds"] = "detected"; } catch(e) {}
    try { ac_pc_2.portToPinMapping["detectedRTC"] = "detected"; } catch(e) {}
    try { ac_pc_2.portToPinMapping["detectedrtc"] = "detected"; } catch(e) {}
    try { ac_pc_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_pc_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_pc_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_pc_2.portToPinMapping["detected"] = "detected"; } catch(e) {}
    try { ac_pc_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_pc_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_pc_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_pc_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_pc_2.portToPinMapping["userTemp"] = "userTemp"; } catch(e) {}
    try { ac_pc_2.portToPinMapping["usertemp"] = "userTemp"; } catch(e) {}
    try { ac_pc_2.portToPinMapping["CheckPresenceToSetTemperatureAN"] = "target"; } catch(e) {}
    try { ac_pc_2.portToPinMapping["checkpresencetosettemperaturean"] = "target"; } catch(e) {}
    this.registerActivity("CheckPresenceToSetTemperatureAC", ac_pc_2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.rtc.pc"] = ac_pc_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.rtc.pc"] = ac_pc_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtc.pc"] = ac_pc_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["pc"] = ac_pc_2; } catch(e) {}
    const ac_s1_3 = new AC_Components_DecideCommandAC(
      "DecideCommandAC",
      "RTCSystemCFD.s1",
      ["current"],
      [{"from":"average2","to":"average2"},{"from":"target2","to":"target2"},{"from":"heating","to":"cmdH"},{"from":"cooling","to":"cmdC"}],
      {"outParameters":[{"name":"average2","type":"Real","direction":"out"},{"name":"target2","type":"Real","direction":"out"},{"name":"heating","type":"Real","direction":"out"},{"name":"cooling","type":"Real","direction":"out"}]}
    );
    try { ac_s1_3.portToPinMapping["average2"] = "average2"; } catch(e) {}
    try { ac_s1_3.portToPinMapping["average2"] = "average2"; } catch(e) {}
    try { ac_s1_3.portToPinMapping["average"] = "average2"; } catch(e) {}
    try { ac_s1_3.portToPinMapping["average"] = "average2"; } catch(e) {}
    try { ac_s1_3.portToPinMapping["target2"] = "target2"; } catch(e) {}
    try { ac_s1_3.portToPinMapping["target2"] = "target2"; } catch(e) {}
    try { ac_s1_3.portToPinMapping["target"] = "target2"; } catch(e) {}
    try { ac_s1_3.portToPinMapping["target"] = "target2"; } catch(e) {}
    try { ac_s1_3.portToPinMapping["cmdH"] = "heating"; } catch(e) {}
    try { ac_s1_3.portToPinMapping["cmdh"] = "heating"; } catch(e) {}
    try { ac_s1_3.portToPinMapping["cmdC"] = "cooling"; } catch(e) {}
    try { ac_s1_3.portToPinMapping["cmdc"] = "cooling"; } catch(e) {}
    this.registerActivity("DecideCommandAC", ac_s1_3);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.s1"] = ac_s1_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.s1"] = ac_s1_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["s1"] = ac_s1_3; } catch(e) {}
    const ac_s2_3 = new AC_Components_DecideCommandAC(
      "DecideCommandAC",
      "RTCSystemCFD.s2",
      ["current"],
      [{"from":"average2","to":"average2"},{"from":"target2","to":"target2"},{"from":"heating","to":"cmdH"},{"from":"cooling","to":"cmdC"}],
      {"outParameters":[{"name":"average2","type":"Real","direction":"out"},{"name":"target2","type":"Real","direction":"out"},{"name":"heating","type":"Real","direction":"out"},{"name":"cooling","type":"Real","direction":"out"}]}
    );
    try { ac_s2_3.portToPinMapping["average2"] = "average2"; } catch(e) {}
    try { ac_s2_3.portToPinMapping["average2"] = "average2"; } catch(e) {}
    try { ac_s2_3.portToPinMapping["average"] = "average2"; } catch(e) {}
    try { ac_s2_3.portToPinMapping["average"] = "average2"; } catch(e) {}
    try { ac_s2_3.portToPinMapping["target2"] = "target2"; } catch(e) {}
    try { ac_s2_3.portToPinMapping["target2"] = "target2"; } catch(e) {}
    try { ac_s2_3.portToPinMapping["target"] = "target2"; } catch(e) {}
    try { ac_s2_3.portToPinMapping["target"] = "target2"; } catch(e) {}
    try { ac_s2_3.portToPinMapping["cmdH"] = "heating"; } catch(e) {}
    try { ac_s2_3.portToPinMapping["cmdh"] = "heating"; } catch(e) {}
    try { ac_s2_3.portToPinMapping["cmdC"] = "cooling"; } catch(e) {}
    try { ac_s2_3.portToPinMapping["cmdc"] = "cooling"; } catch(e) {}
    this.registerActivity("DecideCommandAC", ac_s2_3);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.s2"] = ac_s2_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.s2"] = ac_s2_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["s2"] = ac_s2_3; } catch(e) {}
    const ac_s3_3 = new AC_Components_DecideCommandAC(
      "DecideCommandAC",
      "RTCSystemCFD.s3",
      ["detected"],
      [{"from":"average2","to":"average2"},{"from":"target2","to":"target2"},{"from":"heating","to":"cmdH"},{"from":"cooling","to":"cmdC"}],
      {"outParameters":[{"name":"average2","type":"Real","direction":"out"},{"name":"target2","type":"Real","direction":"out"},{"name":"heating","type":"Real","direction":"out"},{"name":"cooling","type":"Real","direction":"out"}]}
    );
    try { ac_s3_3.portToPinMapping["average2"] = "average2"; } catch(e) {}
    try { ac_s3_3.portToPinMapping["average2"] = "average2"; } catch(e) {}
    try { ac_s3_3.portToPinMapping["average"] = "average2"; } catch(e) {}
    try { ac_s3_3.portToPinMapping["average"] = "average2"; } catch(e) {}
    try { ac_s3_3.portToPinMapping["target2"] = "target2"; } catch(e) {}
    try { ac_s3_3.portToPinMapping["target2"] = "target2"; } catch(e) {}
    try { ac_s3_3.portToPinMapping["target"] = "target2"; } catch(e) {}
    try { ac_s3_3.portToPinMapping["target"] = "target2"; } catch(e) {}
    try { ac_s3_3.portToPinMapping["cmdH"] = "heating"; } catch(e) {}
    try { ac_s3_3.portToPinMapping["cmdh"] = "heating"; } catch(e) {}
    try { ac_s3_3.portToPinMapping["cmdC"] = "cooling"; } catch(e) {}
    try { ac_s3_3.portToPinMapping["cmdc"] = "cooling"; } catch(e) {}
    this.registerActivity("DecideCommandAC", ac_s3_3);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.s3"] = ac_s3_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.s3"] = ac_s3_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["s3"] = ac_s3_3; } catch(e) {}
    const ac_ui_3 = new AC_Components_DecideCommandAC(
      "DecideCommandAC",
      "RTCSystemCFD.ui",
      ["desired"],
      [{"from":"average2","to":"average2"},{"from":"target2","to":"target2"},{"from":"heating","to":"cmdH"},{"from":"cooling","to":"cmdC"}],
      {"outParameters":[{"name":"average2","type":"Real","direction":"out"},{"name":"target2","type":"Real","direction":"out"},{"name":"heating","type":"Real","direction":"out"},{"name":"cooling","type":"Real","direction":"out"}]}
    );
    try { ac_ui_3.portToPinMapping["average2"] = "average2"; } catch(e) {}
    try { ac_ui_3.portToPinMapping["average2"] = "average2"; } catch(e) {}
    try { ac_ui_3.portToPinMapping["average"] = "average2"; } catch(e) {}
    try { ac_ui_3.portToPinMapping["average"] = "average2"; } catch(e) {}
    try { ac_ui_3.portToPinMapping["target2"] = "target2"; } catch(e) {}
    try { ac_ui_3.portToPinMapping["target2"] = "target2"; } catch(e) {}
    try { ac_ui_3.portToPinMapping["target"] = "target2"; } catch(e) {}
    try { ac_ui_3.portToPinMapping["target"] = "target2"; } catch(e) {}
    try { ac_ui_3.portToPinMapping["cmdH"] = "heating"; } catch(e) {}
    try { ac_ui_3.portToPinMapping["cmdh"] = "heating"; } catch(e) {}
    try { ac_ui_3.portToPinMapping["cmdC"] = "cooling"; } catch(e) {}
    try { ac_ui_3.portToPinMapping["cmdc"] = "cooling"; } catch(e) {}
    this.registerActivity("DecideCommandAC", ac_ui_3);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.ui"] = ac_ui_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.ui"] = ac_ui_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["ui"] = ac_ui_3; } catch(e) {}
    const ac_a2_3 = new AC_Components_DecideCommandAC(
      "DecideCommandAC",
      "RTCSystemCFD.a2",
      ["controllerC"],
      [{"from":"average2","to":"average2"},{"from":"target2","to":"target2"},{"from":"heating","to":"cmdH"},{"from":"cooling","to":"cmdC"}],
      {"outParameters":[{"name":"average2","type":"Real","direction":"out"},{"name":"target2","type":"Real","direction":"out"},{"name":"heating","type":"Real","direction":"out"},{"name":"cooling","type":"Real","direction":"out"}]}
    );
    try { ac_a2_3.portToPinMapping["average2"] = "average2"; } catch(e) {}
    try { ac_a2_3.portToPinMapping["average2"] = "average2"; } catch(e) {}
    try { ac_a2_3.portToPinMapping["average"] = "average2"; } catch(e) {}
    try { ac_a2_3.portToPinMapping["average"] = "average2"; } catch(e) {}
    try { ac_a2_3.portToPinMapping["target2"] = "target2"; } catch(e) {}
    try { ac_a2_3.portToPinMapping["target2"] = "target2"; } catch(e) {}
    try { ac_a2_3.portToPinMapping["target"] = "target2"; } catch(e) {}
    try { ac_a2_3.portToPinMapping["target"] = "target2"; } catch(e) {}
    try { ac_a2_3.portToPinMapping["cmdH"] = "heating"; } catch(e) {}
    try { ac_a2_3.portToPinMapping["cmdh"] = "heating"; } catch(e) {}
    try { ac_a2_3.portToPinMapping["cmdC"] = "cooling"; } catch(e) {}
    try { ac_a2_3.portToPinMapping["cmdc"] = "cooling"; } catch(e) {}
    this.registerActivity("DecideCommandAC", ac_a2_3);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.a2"] = ac_a2_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.a2"] = ac_a2_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["a2"] = ac_a2_3; } catch(e) {}
    const ac_a1_3 = new AC_Components_DecideCommandAC(
      "DecideCommandAC",
      "RTCSystemCFD.a1",
      ["controllerH"],
      [{"from":"average2","to":"average2"},{"from":"target2","to":"target2"},{"from":"heating","to":"cmdH"},{"from":"cooling","to":"cmdC"}],
      {"outParameters":[{"name":"average2","type":"Real","direction":"out"},{"name":"target2","type":"Real","direction":"out"},{"name":"heating","type":"Real","direction":"out"},{"name":"cooling","type":"Real","direction":"out"}]}
    );
    try { ac_a1_3.portToPinMapping["average2"] = "average2"; } catch(e) {}
    try { ac_a1_3.portToPinMapping["average2"] = "average2"; } catch(e) {}
    try { ac_a1_3.portToPinMapping["average"] = "average2"; } catch(e) {}
    try { ac_a1_3.portToPinMapping["average"] = "average2"; } catch(e) {}
    try { ac_a1_3.portToPinMapping["target2"] = "target2"; } catch(e) {}
    try { ac_a1_3.portToPinMapping["target2"] = "target2"; } catch(e) {}
    try { ac_a1_3.portToPinMapping["target"] = "target2"; } catch(e) {}
    try { ac_a1_3.portToPinMapping["target"] = "target2"; } catch(e) {}
    try { ac_a1_3.portToPinMapping["cmdH"] = "heating"; } catch(e) {}
    try { ac_a1_3.portToPinMapping["cmdh"] = "heating"; } catch(e) {}
    try { ac_a1_3.portToPinMapping["cmdC"] = "cooling"; } catch(e) {}
    try { ac_a1_3.portToPinMapping["cmdc"] = "cooling"; } catch(e) {}
    this.registerActivity("DecideCommandAC", ac_a1_3);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.a1"] = ac_a1_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.a1"] = ac_a1_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["a1"] = ac_a1_3; } catch(e) {}
    const ac_rtc_3 = new AC_Components_DecideCommandAC(
      "DecideCommandAC",
      "RTCSystemCFD.rtc",
      ["average2"],
      [{"from":"average2","to":"average2"},{"from":"target2","to":"target2"},{"from":"heating","to":"cmdH"},{"from":"cooling","to":"cmdC"}],
      {"outParameters":[{"name":"target2","type":"Real","direction":"out"},{"name":"heating","type":"Real","direction":"out"},{"name":"cooling","type":"Real","direction":"out"}]}
    );
    try { ac_rtc_3.portToPinMapping["average2"] = "average2"; } catch(e) {}
    try { ac_rtc_3.portToPinMapping["average2"] = "average2"; } catch(e) {}
    try { ac_rtc_3.portToPinMapping["average"] = "average2"; } catch(e) {}
    try { ac_rtc_3.portToPinMapping["average"] = "average2"; } catch(e) {}
    try { ac_rtc_3.portToPinMapping["target2"] = "target2"; } catch(e) {}
    try { ac_rtc_3.portToPinMapping["target2"] = "target2"; } catch(e) {}
    try { ac_rtc_3.portToPinMapping["target"] = "target2"; } catch(e) {}
    try { ac_rtc_3.portToPinMapping["target"] = "target2"; } catch(e) {}
    try { ac_rtc_3.portToPinMapping["cmdH"] = "heating"; } catch(e) {}
    try { ac_rtc_3.portToPinMapping["cmdh"] = "heating"; } catch(e) {}
    try { ac_rtc_3.portToPinMapping["cmdC"] = "cooling"; } catch(e) {}
    try { ac_rtc_3.portToPinMapping["cmdc"] = "cooling"; } catch(e) {}
    this.registerActivity("DecideCommandAC", ac_rtc_3);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.rtc"] = ac_rtc_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.rtc"] = ac_rtc_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtc"] = ac_rtc_3; } catch(e) {}
    const ac_sm_3 = new AC_Components_DecideCommandAC(
      "DecideCommandAC",
      "RTCSystemCFD.rtc.sm",
      ["average"],
      [{"from":"average2","to":"average2"},{"from":"target2","to":"target2"},{"from":"heating","to":"cmdH"},{"from":"cooling","to":"cmdC"}],
      {"outParameters":[{"name":"average2","type":"Real","direction":"out"},{"name":"target2","type":"Real","direction":"out"},{"name":"heating","type":"Real","direction":"out"},{"name":"cooling","type":"Real","direction":"out"}]}
    );
    try { ac_sm_3.portToPinMapping["average2"] = "average2"; } catch(e) {}
    try { ac_sm_3.portToPinMapping["average2"] = "average2"; } catch(e) {}
    try { ac_sm_3.portToPinMapping["average"] = "average2"; } catch(e) {}
    try { ac_sm_3.portToPinMapping["average"] = "average2"; } catch(e) {}
    try { ac_sm_3.portToPinMapping["target2"] = "target2"; } catch(e) {}
    try { ac_sm_3.portToPinMapping["target2"] = "target2"; } catch(e) {}
    try { ac_sm_3.portToPinMapping["target"] = "target2"; } catch(e) {}
    try { ac_sm_3.portToPinMapping["target"] = "target2"; } catch(e) {}
    try { ac_sm_3.portToPinMapping["cmdH"] = "heating"; } catch(e) {}
    try { ac_sm_3.portToPinMapping["cmdh"] = "heating"; } catch(e) {}
    try { ac_sm_3.portToPinMapping["cmdC"] = "cooling"; } catch(e) {}
    try { ac_sm_3.portToPinMapping["cmdc"] = "cooling"; } catch(e) {}
    this.registerActivity("DecideCommandAC", ac_sm_3);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.rtc.sm"] = ac_sm_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.rtc.sm"] = ac_sm_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtc.sm"] = ac_sm_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["sm"] = ac_sm_3; } catch(e) {}
    const ac_cm_3 = new AC_Components_DecideCommandAC(
      "DecideCommandAC",
      "RTCSystemCFD.rtc.cm",
      ["average2"],
      [{"from":"average2","to":"average2"},{"from":"target2","to":"target2"},{"from":"heating","to":"cmdH"},{"from":"cooling","to":"cmdC"}],
      {"outParameters":[{"name":"target2","type":"Real","direction":"out"},{"name":"heating","type":"Real","direction":"out"},{"name":"cooling","type":"Real","direction":"out"}]}
    );
    try { ac_cm_3.portToPinMapping["average2"] = "average2"; } catch(e) {}
    try { ac_cm_3.portToPinMapping["average2"] = "average2"; } catch(e) {}
    try { ac_cm_3.portToPinMapping["average"] = "average2"; } catch(e) {}
    try { ac_cm_3.portToPinMapping["average"] = "average2"; } catch(e) {}
    try { ac_cm_3.portToPinMapping["target2"] = "target2"; } catch(e) {}
    try { ac_cm_3.portToPinMapping["target2"] = "target2"; } catch(e) {}
    try { ac_cm_3.portToPinMapping["target"] = "target2"; } catch(e) {}
    try { ac_cm_3.portToPinMapping["target"] = "target2"; } catch(e) {}
    try { ac_cm_3.portToPinMapping["cmdH"] = "heating"; } catch(e) {}
    try { ac_cm_3.portToPinMapping["cmdh"] = "heating"; } catch(e) {}
    try { ac_cm_3.portToPinMapping["cmdC"] = "cooling"; } catch(e) {}
    try { ac_cm_3.portToPinMapping["cmdc"] = "cooling"; } catch(e) {}
    this.registerActivity("DecideCommandAC", ac_cm_3);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.rtc.cm"] = ac_cm_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.rtc.cm"] = ac_cm_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtc.cm"] = ac_cm_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["cm"] = ac_cm_3; } catch(e) {}
    const ac_pc_3 = new AC_Components_DecideCommandAC(
      "DecideCommandAC",
      "RTCSystemCFD.rtc.pc",
      ["detected"],
      [{"from":"average2","to":"average2"},{"from":"target2","to":"target2"},{"from":"heating","to":"cmdH"},{"from":"cooling","to":"cmdC"}],
      {"outParameters":[{"name":"average2","type":"Real","direction":"out"},{"name":"target2","type":"Real","direction":"out"},{"name":"heating","type":"Real","direction":"out"},{"name":"cooling","type":"Real","direction":"out"}]}
    );
    try { ac_pc_3.portToPinMapping["average2"] = "average2"; } catch(e) {}
    try { ac_pc_3.portToPinMapping["average2"] = "average2"; } catch(e) {}
    try { ac_pc_3.portToPinMapping["average"] = "average2"; } catch(e) {}
    try { ac_pc_3.portToPinMapping["average"] = "average2"; } catch(e) {}
    try { ac_pc_3.portToPinMapping["target2"] = "target2"; } catch(e) {}
    try { ac_pc_3.portToPinMapping["target2"] = "target2"; } catch(e) {}
    try { ac_pc_3.portToPinMapping["target"] = "target2"; } catch(e) {}
    try { ac_pc_3.portToPinMapping["target"] = "target2"; } catch(e) {}
    try { ac_pc_3.portToPinMapping["cmdH"] = "heating"; } catch(e) {}
    try { ac_pc_3.portToPinMapping["cmdh"] = "heating"; } catch(e) {}
    try { ac_pc_3.portToPinMapping["cmdC"] = "cooling"; } catch(e) {}
    try { ac_pc_3.portToPinMapping["cmdc"] = "cooling"; } catch(e) {}
    this.registerActivity("DecideCommandAC", ac_pc_3);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.rtc.pc"] = ac_pc_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.rtc.pc"] = ac_pc_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtc.pc"] = ac_pc_3; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["pc"] = ac_pc_3; } catch(e) {}
    const ac_s1_4 = new AC_Components_FahrenheitToCelsiusAC(
      "FahrenheitToCelsiusAC",
      "RTCSystemCFD.s1",
      ["current"],
      [{"from":"localTemp1","to":"FtC"},{"from":"current1","to":"current1"}],
      {"outParameters":[{"name":"localTemp1","type":"Real","direction":"out"},{"name":"current1","type":"Real","direction":"out"}]}
    );
    try { ac_s1_4.portToPinMapping["FtC"] = "localTemp1"; } catch(e) {}
    try { ac_s1_4.portToPinMapping["ftc"] = "localTemp1"; } catch(e) {}
    try { ac_s1_4.portToPinMapping["current1"] = "current1"; } catch(e) {}
    try { ac_s1_4.portToPinMapping["current1"] = "current1"; } catch(e) {}
    try { ac_s1_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_s1_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_s1_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_s1_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    this.registerActivity("FahrenheitToCelsiusAC", ac_s1_4);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.s1"] = ac_s1_4; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.s1"] = ac_s1_4; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["s1"] = ac_s1_4; } catch(e) {}
    const ac_s2_4 = new AC_Components_FahrenheitToCelsiusAC(
      "FahrenheitToCelsiusAC",
      "RTCSystemCFD.s2",
      ["current"],
      [{"from":"localTemp1","to":"FtC"},{"from":"current1","to":"current1"}],
      {"outParameters":[{"name":"localTemp1","type":"Real","direction":"out"},{"name":"current1","type":"Real","direction":"out"}]}
    );
    try { ac_s2_4.portToPinMapping["FtC"] = "localTemp1"; } catch(e) {}
    try { ac_s2_4.portToPinMapping["ftc"] = "localTemp1"; } catch(e) {}
    try { ac_s2_4.portToPinMapping["current1"] = "current1"; } catch(e) {}
    try { ac_s2_4.portToPinMapping["current1"] = "current1"; } catch(e) {}
    try { ac_s2_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_s2_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_s2_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_s2_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    this.registerActivity("FahrenheitToCelsiusAC", ac_s2_4);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.s2"] = ac_s2_4; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.s2"] = ac_s2_4; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["s2"] = ac_s2_4; } catch(e) {}
    const ac_s3_4 = new AC_Components_FahrenheitToCelsiusAC(
      "FahrenheitToCelsiusAC",
      "RTCSystemCFD.s3",
      ["detected"],
      [{"from":"localTemp1","to":"FtC"},{"from":"current1","to":"current1"}],
      {"outParameters":[{"name":"localTemp1","type":"Real","direction":"out"},{"name":"current1","type":"Real","direction":"out"}]}
    );
    try { ac_s3_4.portToPinMapping["FtC"] = "localTemp1"; } catch(e) {}
    try { ac_s3_4.portToPinMapping["ftc"] = "localTemp1"; } catch(e) {}
    try { ac_s3_4.portToPinMapping["current1"] = "current1"; } catch(e) {}
    try { ac_s3_4.portToPinMapping["current1"] = "current1"; } catch(e) {}
    try { ac_s3_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_s3_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_s3_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_s3_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    this.registerActivity("FahrenheitToCelsiusAC", ac_s3_4);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.s3"] = ac_s3_4; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.s3"] = ac_s3_4; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["s3"] = ac_s3_4; } catch(e) {}
    const ac_ui_4 = new AC_Components_FahrenheitToCelsiusAC(
      "FahrenheitToCelsiusAC",
      "RTCSystemCFD.ui",
      ["desired"],
      [{"from":"localTemp1","to":"FtC"},{"from":"current1","to":"current1"}],
      {"outParameters":[{"name":"localTemp1","type":"Real","direction":"out"},{"name":"current1","type":"Real","direction":"out"}]}
    );
    try { ac_ui_4.portToPinMapping["FtC"] = "localTemp1"; } catch(e) {}
    try { ac_ui_4.portToPinMapping["ftc"] = "localTemp1"; } catch(e) {}
    try { ac_ui_4.portToPinMapping["current1"] = "current1"; } catch(e) {}
    try { ac_ui_4.portToPinMapping["current1"] = "current1"; } catch(e) {}
    try { ac_ui_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_ui_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_ui_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_ui_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    this.registerActivity("FahrenheitToCelsiusAC", ac_ui_4);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.ui"] = ac_ui_4; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.ui"] = ac_ui_4; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["ui"] = ac_ui_4; } catch(e) {}
    const ac_a2_4 = new AC_Components_FahrenheitToCelsiusAC(
      "FahrenheitToCelsiusAC",
      "RTCSystemCFD.a2",
      ["controllerC"],
      [{"from":"localTemp1","to":"FtC"},{"from":"current1","to":"current1"}],
      {"outParameters":[{"name":"localTemp1","type":"Real","direction":"out"},{"name":"current1","type":"Real","direction":"out"}]}
    );
    try { ac_a2_4.portToPinMapping["FtC"] = "localTemp1"; } catch(e) {}
    try { ac_a2_4.portToPinMapping["ftc"] = "localTemp1"; } catch(e) {}
    try { ac_a2_4.portToPinMapping["current1"] = "current1"; } catch(e) {}
    try { ac_a2_4.portToPinMapping["current1"] = "current1"; } catch(e) {}
    try { ac_a2_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_a2_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_a2_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_a2_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    this.registerActivity("FahrenheitToCelsiusAC", ac_a2_4);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.a2"] = ac_a2_4; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.a2"] = ac_a2_4; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["a2"] = ac_a2_4; } catch(e) {}
    const ac_a1_4 = new AC_Components_FahrenheitToCelsiusAC(
      "FahrenheitToCelsiusAC",
      "RTCSystemCFD.a1",
      ["controllerH"],
      [{"from":"localTemp1","to":"FtC"},{"from":"current1","to":"current1"}],
      {"outParameters":[{"name":"localTemp1","type":"Real","direction":"out"},{"name":"current1","type":"Real","direction":"out"}]}
    );
    try { ac_a1_4.portToPinMapping["FtC"] = "localTemp1"; } catch(e) {}
    try { ac_a1_4.portToPinMapping["ftc"] = "localTemp1"; } catch(e) {}
    try { ac_a1_4.portToPinMapping["current1"] = "current1"; } catch(e) {}
    try { ac_a1_4.portToPinMapping["current1"] = "current1"; } catch(e) {}
    try { ac_a1_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_a1_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_a1_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_a1_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    this.registerActivity("FahrenheitToCelsiusAC", ac_a1_4);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.a1"] = ac_a1_4; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.a1"] = ac_a1_4; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["a1"] = ac_a1_4; } catch(e) {}
    const ac_rtc_4 = new AC_Components_FahrenheitToCelsiusAC(
      "FahrenheitToCelsiusAC",
      "RTCSystemCFD.rtc",
      ["detectedRTC"],
      [{"from":"localTemp1","to":"FtC"},{"from":"current1","to":"current1"}],
      {"outParameters":[{"name":"localTemp1","type":"Real","direction":"out"},{"name":"current1","type":"Real","direction":"out"}]}
    );
    try { ac_rtc_4.portToPinMapping["FtC"] = "localTemp1"; } catch(e) {}
    try { ac_rtc_4.portToPinMapping["ftc"] = "localTemp1"; } catch(e) {}
    try { ac_rtc_4.portToPinMapping["current1"] = "current1"; } catch(e) {}
    try { ac_rtc_4.portToPinMapping["current1"] = "current1"; } catch(e) {}
    try { ac_rtc_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_rtc_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_rtc_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_rtc_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    this.registerActivity("FahrenheitToCelsiusAC", ac_rtc_4);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.rtc"] = ac_rtc_4; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.rtc"] = ac_rtc_4; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtc"] = ac_rtc_4; } catch(e) {}
    const ac_sm_4 = new AC_Components_FahrenheitToCelsiusAC(
      "FahrenheitToCelsiusAC",
      "RTCSystemCFD.rtc.sm",
      ["s1"],
      [{"from":"localTemp1","to":"FtC"},{"from":"current1","to":"current1"}],
      {"outParameters":[{"name":"localTemp1","type":"Real","direction":"out"},{"name":"current1","type":"Real","direction":"out"}]}
    );
    try { ac_sm_4.portToPinMapping["FtC"] = "localTemp1"; } catch(e) {}
    try { ac_sm_4.portToPinMapping["ftc"] = "localTemp1"; } catch(e) {}
    try { ac_sm_4.portToPinMapping["current1"] = "current1"; } catch(e) {}
    try { ac_sm_4.portToPinMapping["current1"] = "current1"; } catch(e) {}
    try { ac_sm_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_sm_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_sm_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_sm_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    this.registerActivity("FahrenheitToCelsiusAC", ac_sm_4);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.rtc.sm"] = ac_sm_4; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.rtc.sm"] = ac_sm_4; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtc.sm"] = ac_sm_4; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["sm"] = ac_sm_4; } catch(e) {}
    const ac_cm_4 = new AC_Components_FahrenheitToCelsiusAC(
      "FahrenheitToCelsiusAC",
      "RTCSystemCFD.rtc.cm",
      ["target2"],
      [{"from":"localTemp1","to":"FtC"},{"from":"current1","to":"current1"}],
      {"outParameters":[{"name":"localTemp1","type":"Real","direction":"out"},{"name":"current1","type":"Real","direction":"out"}]}
    );
    try { ac_cm_4.portToPinMapping["FtC"] = "localTemp1"; } catch(e) {}
    try { ac_cm_4.portToPinMapping["ftc"] = "localTemp1"; } catch(e) {}
    try { ac_cm_4.portToPinMapping["current1"] = "current1"; } catch(e) {}
    try { ac_cm_4.portToPinMapping["current1"] = "current1"; } catch(e) {}
    try { ac_cm_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_cm_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_cm_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_cm_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    this.registerActivity("FahrenheitToCelsiusAC", ac_cm_4);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.rtc.cm"] = ac_cm_4; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.rtc.cm"] = ac_cm_4; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtc.cm"] = ac_cm_4; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["cm"] = ac_cm_4; } catch(e) {}
    const ac_pc_4 = new AC_Components_FahrenheitToCelsiusAC(
      "FahrenheitToCelsiusAC",
      "RTCSystemCFD.rtc.pc",
      ["detected"],
      [{"from":"localTemp1","to":"FtC"},{"from":"current1","to":"current1"}],
      {"outParameters":[{"name":"localTemp1","type":"Real","direction":"out"},{"name":"current1","type":"Real","direction":"out"}]}
    );
    try { ac_pc_4.portToPinMapping["FtC"] = "localTemp1"; } catch(e) {}
    try { ac_pc_4.portToPinMapping["ftc"] = "localTemp1"; } catch(e) {}
    try { ac_pc_4.portToPinMapping["current1"] = "current1"; } catch(e) {}
    try { ac_pc_4.portToPinMapping["current1"] = "current1"; } catch(e) {}
    try { ac_pc_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_pc_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_pc_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    try { ac_pc_4.portToPinMapping["current"] = "current1"; } catch(e) {}
    this.registerActivity("FahrenheitToCelsiusAC", ac_pc_4);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["RTCSystemCFD.rtc.pc"] = ac_pc_4; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtcsystemcfd.rtc.pc"] = ac_pc_4; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["rtc.pc"] = ac_pc_4; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["pc"] = ac_pc_4; } catch(e) {}
  }

}

function createModel(){ 
  const model = new SysADLModel();
  
  model.typeRegistry = {
    'temperature': 'VT_types_temperature',
    'FahrenheitTemperature': 'VT_types_FahrenheitTemperature',
    'CelsiusTemperature': 'VT_types_CelsiusTemperature',
    'Command': 'EN_types_Command',
  };
  
  // Module context for class resolution
  model._moduleContext = {
    PT_Ports_FTemperatureOPT,
    PT_Ports_PresenceIPT,
    PT_Ports_PresenceOPT,
    PT_Ports_CTemperatureIPT,
    PT_Ports_CommandIPT,
    PT_Ports_CommandOPT,
    PT_Ports_CTemperatureOPT,
    CN_Connectors_FahrenheitToCelsiusCN,
    CN_Connectors_PresenceCN,
    CN_Connectors_CommandCN,
    CN_Connectors_CTemperatureCN,
    CT_Components_CalculateAverageTemperatureEQ,
    CT_Components_CompareTemperatureEQ,
    CT_Components_FahrenheitToCelsiusEQ,
    CT_Components_CommandHeaterEQ,
    CT_Components_CommandCoolerEQ,
    CT_Components_CheckPresenceToSetTemperatureEQ,
    EX_Components_CommandCoolerEx,
    EX_Components_CommandHeaterEx,
    EX_Components_FahrenheitToCelsiusEx,
    EX_Components_CalculateAverageTemperatureEx,
    EX_Components_CheckPresenceToSetTemperature,
    EX_Components_CompareTemperatureEx,
    EN_types_Command,
    DT_types_Commands,
    VT_types_temperature,
    VT_types_FahrenheitTemperature,
    VT_types_CelsiusTemperature,
    UN_types_Celsius,
    UN_types_Fahrenheit,
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

module.exports = { createModel, SysADLModel, VT_types_temperature, VT_types_FahrenheitTemperature, VT_types_CelsiusTemperature, EN_types_Command, DT_types_Commands, DM_types_Temperature, UN_types_Celsius, UN_types_Fahrenheit, PT_Ports_FTemperatureOPT, PT_Ports_PresenceIPT, PT_Ports_PresenceOPT, PT_Ports_CTemperatureIPT, PT_Ports_CommandIPT, PT_Ports_CommandOPT, PT_Ports_CTemperatureOPT };