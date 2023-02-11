import { assign } from "min-dash";

/**
 * 自定义左侧工具栏
 */
export default function PaletteProvider(
  palette,
  create,
  elementFactory,
  handTool,
  lassoTool,
  spaceTool,
  globalConnect,
  translate
) {
  this.create = create;
  this.elementFactory = elementFactory;
  this.handTool = handTool;
  this.lassoTool = lassoTool;
  this.spaceTool = spaceTool;
  this.globalConnect = globalConnect;
  this.translate = translate;

  // 指定这是一个palette
  palette.registerProvider(this);
}

// 使用$inject注入一些需要的变量
PaletteProvider.$inject = [
  "palette",
  "create",
  "elementFactory",
  "handTool",
  "lassoTool",
  "spaceTool",
  "globalConnect",
  "translate",
];

// 重写PaletteProvider原型上的getPaletteEntries方法，覆盖工具栏
PaletteProvider.prototype.getPaletteEntries = function (element) {
  const {
    create,
    elementFactory,
    lassoTool,
    handTool,
    globalConnect,
    translate,
  } = this;

  function createAction(type, group, className, title, options = null) {
    // 点击或拖拽事件，即创建shape添加到画布上
    function createListener(event) {
      const shape = elementFactory.createShape(assign({ type: type }, options));

      if (options) {
        shape.businessObject.di.isExpanded = options.isExpanded;
      }

      create.start(event, shape);
    }

    // 返回自定义组件
    return {
      group, // 属于哪个分组, 比如tools、event、gateway、activity等等,用于分类
      className, // 样式类名, 我们可以通过它给元素修改样式
      title, // 鼠标移动到元素上面给出的提示信息
      action: {
        // 用户操作时会触发的事件
        dragstart: createListener,
        click: createListener,
      },
    };
  }

  function createSubprocess(event) {
    let subProcess = elementFactory.createShape({
      type: "bpmn:SubProcess",
      x: 0,
      y: 0,
      isExpanded: true,
    });

    let startEvent = elementFactory.createShape({
      type: "bpmn:StartEvent",
      x: 40,
      y: 82,
      parent: subProcess,
    });

    create.start(event, [subProcess, startEvent], {
      hints: {
        autoSelect: [startEvent],
      },
    });
  }

  function createParticipant(event) {
    create.start(event, elementFactory.createParticipantShape());
  }

  return {
    "hand-tool": {
      group: "tools",
      className: "bpmn-icon-hand-tool",
      action: {
        click: function (event) {
          handTool.activateHand(event);
        },
      },
      title: translate("Activate the hand tool"),
    },
    "lasso-tool": {
      group: "tools",
      className: "bpmn-icon-lasso-tool",
      action: {
        click: function (event) {
          lassoTool.activateSelection(event);
        },
      },
      title: translate("Activate the lasso tool"),
    },
    "global-connect-tool": {
      group: "tools",
      className: "bpmn-icon-connection-multi",
      action: {
        click: function (event) {
          try {
            globalConnect.toggle(event);
          } catch (e) {}
        },
      },
      title: translate("Activate the global connect tool"),
    },
    "tool-separator": {
      group: "tools",
      separator: true,
    },
    "create.start-event": createAction(
      "bpmn:StartEvent",
      "event",
      "bpmn-icon-start-event-none",
      translate("Create StartEvent")
    ),
    "create.intermediate-event": createAction(
      "bpmn:IntermediateCatchEvent",
      "event",
      "bpmn-icon-intermediate-event-catch-timer",
      translate("Create TimerIntermediateCatchEvent"),
      { eventDefinitionType: "bpmn:TimerEventDefinition" }
    ),
    "create.end-event": createAction(
      "bpmn:EndEvent",
      "event",
      "bpmn-icon-end-event-none",
      translate("Create EndEvent")
    ),
    "create.exclusive-gateway": createAction(
      "bpmn:ExclusiveGateway",
      "gateway",
      "bpmn-icon-gateway-xor",
      translate("Create Gateway")
    ),
    "create.task": createAction(
      "bpmn:UserTask",
      "activity",
      "bpmn-icon-user-task",
      translate("Create Task")
    ),
    "create.subprocess-expanded": {
      group: "activity",
      className: "bpmn-icon-subprocess-expanded",
      title: translate("Create expanded SubProcess"),
      action: {
        dragstart: createSubprocess,
        click: createSubprocess,
      },
    },
    "create.participant-expanded": {
      group: "collaboration",
      className: "bpmn-icon-participant",
      title: translate("Create Pool/Participant"),
      action: {
        dragstart: createParticipant,
        click: createParticipant,
      },
    },
  };
};
