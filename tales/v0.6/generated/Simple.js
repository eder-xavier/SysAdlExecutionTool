
const { Model, Component, Port, SimplePort, CompositePort, Connector, Activity, Action, Enum, Int, Boolean, String, Real, Void, valueType, dataType, dimension, unit, Constraint, Executable } = require('../sysadl-framework/SysADLBase');


// Ports
class PT_Elements_CTempIPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "in", { ...{ expectedType: "Real" }, ...opts });
  }
}
class PT_Elements_CTempOPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "out", { ...{ expectedType: "Real" }, ...opts });
  }
}
class PT_Elements_FTempOPT extends SimplePort {
  constructor(name, opts = {}) {
    super(name, "out", { ...{ expectedType: "Real" }, ...opts });
  }
}

// Connectors
class CN_Elements_FarToCelCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        f: {
          portClass: 'PT_Elements_FTempOPT',
          direction: 'out',
          dataType: 'Real',
          role: 'source'
        },
        c: {
          portClass: 'PT_Elements_CTempIPT',
          direction: 'out',
          dataType: 'Real',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'f',
          to: 'c',
          dataType: 'Real'
        }
      ]
    });
  }
}
class CN_Elements_CelToCelCN extends Connector {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      participantSchema: {
        c1: {
          portClass: 'PT_Elements_CTempOPT',
          direction: 'out',
          dataType: 'Real',
          role: 'source'
        },
        c2: {
          portClass: 'PT_Elements_CTempIPT',
          direction: 'out',
          dataType: 'Real',
          role: 'target'
        }
      },
      flowSchema: [
        {
          from: 'c1',
          to: 'c2',
          dataType: 'Real'
        }
      ]
    });
  }
}

// Components
class CP_Elements_SensorCP extends Component {
  constructor(name, opts={}) {
      super(name, { ...opts, isBoundary: true });
      // Add ports from component definition
      const portAliases = opts.portAliases || {};
      const portName_current = portAliases["current"] || "current";
      this.addPort(new PT_Elements_FTempOPT(portName_current, { owner: name, originalName: "current" }));
    }
}
class CP_Elements_TempMonitorCP extends Component {
  constructor(name, opts={}) {
      super(name, opts);
      // Add ports from component definition
      const portAliases = opts.portAliases || {};
      const portName_s1 = portAliases["s1"] || "s1";
      this.addPort(new PT_Elements_CTempIPT(portName_s1, { owner: name, originalName: "s1" }));
      const portName_s2 = portAliases["s2"] || "s2";
      this.addPort(new PT_Elements_CTempIPT(portName_s2, { owner: name, originalName: "s2" }));
      const portName_average = portAliases["average"] || "average";
      this.addPort(new PT_Elements_CTempOPT(portName_average, { owner: name, originalName: "average" }));
    }
}
class CP_Elements_StdOutCP extends Component {
  constructor(name, opts={}) {
      super(name, { ...opts, isBoundary: true });
      // Add ports from component definition
      const portAliases = opts.portAliases || {};
      const portName_c3 = portAliases["c3"] || "c3";
      this.addPort(new PT_Elements_CTempIPT(portName_c3, { owner: name, originalName: "c3" }));
    }
}
class CP_Elements_SystemCP extends Component { }

// ===== Behavioral Element Classes =====
// Activity class: FarToCelAC
class AC_Elements_FarToCelAC extends Activity {
  constructor(name, component = null, inputPorts = [], delegates = [], opts = {}) {
    super(name, component, inputPorts, delegates, {
      ...opts,
      inParameters: [{"name":"far","type":"Real","direction":"in"}],
      outParameters: [{"name":"cel","type":"Real","direction":"out"}]
    });
  }
}

// Activity class: TempMonitorAC
class AC_Elements_TempMonitorAC extends Activity {
  constructor(name, component = null, inputPorts = [], delegates = [], opts = {}) {
    super(name, component, inputPorts, delegates, {
      ...opts,
      inParameters: [{"name":"s1","type":"Real","direction":"in"},{"name":"s2","type":"Real","direction":"in"}],
      outParameters: [{"name":"average","type":"Real","direction":"out"}]
    });
  }
}

// Action class: FarToCelAN
class AN_Elements_FarToCelAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"far","type":"Real","direction":"in"}],
      outParameters: [{"name":"FarToCelAN","type":"Real","direction":"out"}],
      delegates: [{"from":"far","to":"f"},{"from":"FarToCelAN","to":"c"}],
      constraints: ["FarToCelEQ"],
    });
  }
}

// Action class: TempMonitorAN
class AN_Elements_TempMonitorAN extends Action {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"t1","type":"Real","direction":"in"},{"name":"t2","type":"Real","direction":"in"}],
      outParameters: [{"name":"TempMonitorAN","type":"Real","direction":"out"}],
      delegates: [{"from":"t1","to":"t1"},{"from":"t2","to":"t2"},{"from":"TempMonitorAN","to":"av"}],
      constraints: ["CalcAverageEQ"],
    });
  }
}

// Constraint class: FarToCelEQ
class CT_Elements_FarToCelEQ extends Constraint {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"f","type":"Real","direction":"in"}],
      outParameters: [{"name":"c","type":"Real","direction":"out"}],
      equation: "(c === ((5 * (f - 32)) / 9))",
      constraintFunction: function(params) {// Constraint equation: (c === ((5 * (f - 32)) / 9))
          const { f, c } = params;
          
          // Type validation
          if (typeof f !== 'number') throw new Error('Parameter f must be a Real (number)');
          if (typeof c !== 'number') throw new Error('Parameter c must be a Real (number)');
          return c === ((5 * (f - 32)) / 9);
        }
    });
  }
}

// Constraint class: CalcAverageEQ
class CT_Elements_CalcAverageEQ extends Constraint {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"t1","type":"Real","direction":"in"},{"name":"t2","type":"Real","direction":"in"}],
      outParameters: [{"name":"av","type":"Real","direction":"out"}],
      equation: "(av === ((t1 + t2) / 2))",
      constraintFunction: function(params) {// Constraint equation: (av === ((t1 + t2) / 2))
          const { t1, t2, av } = params;
          
          // Type validation
          if (typeof t1 !== 'number') throw new Error('Parameter t1 must be a Real (number)');
          if (typeof t2 !== 'number') throw new Error('Parameter t2 must be a Real (number)');
          if (typeof av !== 'number') throw new Error('Parameter av must be a Real (number)');
          return av === ((t1 + t2) / 2);
        }
    });
  }
}

// Executable class: FarToCelEX
class EX_Elements_FarToCelEX extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"f","type":"Real","direction":"in"}],
      body: "executable def FarToCelEX (in f:Real): out Real {\n\t\treturn 5*(f - 32)/9 ;\n\t}",
      executableFunction: function(params) {
          // Type validation
          // Type validation for f: (auto-detected from usage)
          const { f } = params;
          return 5*(f - 32)/9;
        }
    });
  }
}

// Executable class: CalcAverageEX
class EX_Elements_CalcAverageEX extends Executable {
  constructor(name, opts = {}) {
    super(name, {
      ...opts,
      inParameters: [{"name":"temp1","type":"Real","direction":"in"},{"name":"temp2","type":"Real","direction":"in"}],
      body: "executable def CalcAverageEX(in temp1:Real,in temp2:Real):out Real{\n\t\treturn (temp1 + temp2)/2 ;\n\t}",
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

// ===== End Behavioral Element Classes =====

class SysADLModel extends Model {
  constructor(){
    super("SysADLModel");
    this.SystemCP = new CP_Elements_SystemCP("SystemCP", { sysadlDefinition: "SystemCP" });
    this.addComponent(this.SystemCP);
    this.SystemCP.s1 = new CP_Elements_SensorCP("s1", { isBoundary: true, sysadlDefinition: "SensorCP", portAliases: {"current":"temp1"} });
    this.SystemCP.addComponent(this.SystemCP.s1);
    this.SystemCP.s2 = new CP_Elements_SensorCP("s2", { isBoundary: true, sysadlDefinition: "SensorCP", portAliases: {"current":"temp2"} });
    this.SystemCP.addComponent(this.SystemCP.s2);
    this.SystemCP.stdOut = new CP_Elements_StdOutCP("stdOut", { isBoundary: true, sysadlDefinition: "StdOutCP", portAliases: {"c3":"avg"} });
    this.SystemCP.addComponent(this.SystemCP.stdOut);
    this.SystemCP.tempMon = new CP_Elements_TempMonitorCP("tempMon", { sysadlDefinition: "TempMonitorCP", portAliases: {"average":"average"} });
    this.SystemCP.addComponent(this.SystemCP.tempMon);

    this.SystemCP.addConnector(new CN_Elements_FarToCelCN("c1"));
    this.SystemCP.addConnector(new CN_Elements_FarToCelCN("c2"));
    this.SystemCP.addConnector(new CN_Elements_CelToCelCN("c3"));

    const ac_s1 = new AC_Elements_FarToCelAC(
      "FarToCelAC",
      "SystemCP.s1",
      ["current"],
      [{"from":"far","to":"far"},{"from":"cel","to":"ftoc"}],
      {"outParameters":[{"name":"far","type":"Real","direction":"out"},{"name":"cel","type":"Real","direction":"out"}]}
    );
    try { ac_s1.portToPinMapping["far"] = "far"; } catch(e) {}
    try { ac_s1.portToPinMapping["far"] = "far"; } catch(e) {}
    try { ac_s1.portToPinMapping["ftoc"] = "cel"; } catch(e) {}
    try { ac_s1.portToPinMapping["ftoc"] = "cel"; } catch(e) {}
    this.registerActivity("FarToCelAC", ac_s1);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["SystemCP.s1"] = ac_s1; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["systemcp.s1"] = ac_s1; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["s1"] = ac_s1; } catch(e) {}
    const ac_s2 = new AC_Elements_FarToCelAC(
      "FarToCelAC",
      "SystemCP.s2",
      ["current"],
      [{"from":"far","to":"far"},{"from":"cel","to":"ftoc"}],
      {"outParameters":[{"name":"far","type":"Real","direction":"out"},{"name":"cel","type":"Real","direction":"out"}]}
    );
    try { ac_s2.portToPinMapping["far"] = "far"; } catch(e) {}
    try { ac_s2.portToPinMapping["far"] = "far"; } catch(e) {}
    try { ac_s2.portToPinMapping["ftoc"] = "cel"; } catch(e) {}
    try { ac_s2.portToPinMapping["ftoc"] = "cel"; } catch(e) {}
    this.registerActivity("FarToCelAC", ac_s2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["SystemCP.s2"] = ac_s2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["systemcp.s2"] = ac_s2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["s2"] = ac_s2; } catch(e) {}
    const ac_tempMon = new AC_Elements_FarToCelAC(
      "FarToCelAC",
      "SystemCP.tempMon",
      ["s1"],
      [{"from":"far","to":"far"},{"from":"cel","to":"ftoc"}],
      {"outParameters":[{"name":"far","type":"Real","direction":"out"},{"name":"cel","type":"Real","direction":"out"}]}
    );
    try { ac_tempMon.portToPinMapping["far"] = "far"; } catch(e) {}
    try { ac_tempMon.portToPinMapping["far"] = "far"; } catch(e) {}
    try { ac_tempMon.portToPinMapping["ftoc"] = "cel"; } catch(e) {}
    try { ac_tempMon.portToPinMapping["ftoc"] = "cel"; } catch(e) {}
    this.registerActivity("FarToCelAC", ac_tempMon);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["SystemCP.tempMon"] = ac_tempMon; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["systemcp.tempmon"] = ac_tempMon; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["tempMon"] = ac_tempMon; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["tempmon"] = ac_tempMon; } catch(e) {}
    const ac_stdOut = new AC_Elements_FarToCelAC(
      "FarToCelAC",
      "SystemCP.stdOut",
      ["c3"],
      [{"from":"far","to":"far"},{"from":"cel","to":"ftoc"}],
      {"outParameters":[{"name":"far","type":"Real","direction":"out"},{"name":"cel","type":"Real","direction":"out"}]}
    );
    try { ac_stdOut.portToPinMapping["far"] = "far"; } catch(e) {}
    try { ac_stdOut.portToPinMapping["far"] = "far"; } catch(e) {}
    try { ac_stdOut.portToPinMapping["ftoc"] = "cel"; } catch(e) {}
    try { ac_stdOut.portToPinMapping["ftoc"] = "cel"; } catch(e) {}
    this.registerActivity("FarToCelAC", ac_stdOut);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["SystemCP.stdOut"] = ac_stdOut; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["systemcp.stdout"] = ac_stdOut; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["stdOut"] = ac_stdOut; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["stdout"] = ac_stdOut; } catch(e) {}
    const ac_tempMon_2 = new AC_Elements_TempMonitorAC(
      "TempMonitorAC",
      "SystemCP.tempMon",
      ["s1"],
      [{"from":"s1","to":"t1"},{"from":"s2","to":"t2"},{"from":"average","to":"TempMonitorAN"}],
      {"outParameters":[{"name":"s2","type":"Real","direction":"out"},{"name":"average","type":"Real","direction":"out"}]}
    );
    try { ac_tempMon_2.portToPinMapping["t1"] = "s1"; } catch(e) {}
    try { ac_tempMon_2.portToPinMapping["t1"] = "s1"; } catch(e) {}
    try { ac_tempMon_2.portToPinMapping["t"] = "s1"; } catch(e) {}
    try { ac_tempMon_2.portToPinMapping["t"] = "s1"; } catch(e) {}
    try { ac_tempMon_2.portToPinMapping["t2"] = "s2"; } catch(e) {}
    try { ac_tempMon_2.portToPinMapping["t2"] = "s2"; } catch(e) {}
    try { ac_tempMon_2.portToPinMapping["t"] = "s2"; } catch(e) {}
    try { ac_tempMon_2.portToPinMapping["t"] = "s2"; } catch(e) {}
    try { ac_tempMon_2.portToPinMapping["TempMonitorAN"] = "average"; } catch(e) {}
    try { ac_tempMon_2.portToPinMapping["tempmonitoran"] = "average"; } catch(e) {}
    this.registerActivity("TempMonitorAC", ac_tempMon_2);
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["SystemCP.tempMon"] = ac_tempMon_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["systemcp.tempmon"] = ac_tempMon_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["tempMon"] = ac_tempMon_2; } catch(e) {}
    try { if (!this._activityOwnerIndex) this._activityOwnerIndex = {}; this._activityOwnerIndex["tempmon"] = ac_tempMon_2; } catch(e) {}
  }

}

function createModel(){ 
  const model = new SysADLModel();
  
  model.typeRegistry = {
  };
  
  // Module context for class resolution
  model._moduleContext = {
    PT_Elements_CTempIPT,
    PT_Elements_CTempOPT,
    PT_Elements_FTempOPT,
    CN_Elements_FarToCelCN,
    CN_Elements_CelToCelCN,
    CT_Elements_FarToCelEQ,
    CT_Elements_CalcAverageEQ,
    EX_Elements_FarToCelEX,
    EX_Elements_CalcAverageEX,
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

module.exports = { createModel, SysADLModel, PT_Elements_CTempIPT, PT_Elements_CTempOPT, PT_Elements_FTempOPT };