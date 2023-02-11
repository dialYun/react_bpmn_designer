import { assign } from "min-dash";
import { isExpanded } from "bpmn-js/lib/util/DiUtil";
import { getChildLanes } from "bpmn-js/lib/features/modeling/util/LaneUtil";
import { hasPrimaryModifier } from "diagram-js/lib/util/Mouse";

/**
 * 自定义ContextPad
 */
export default function ContextPadProvider(
  config,
  injector,
  eventBus,
  contextPad,
  modeling,
  elementFactory,
  connect,
  create,
  popupMenu,
  canvas,
  rules,
  translate
) {
  config = config || {};

  contextPad.registerProvider(this);

  this._contextPad = contextPad;

  this._modeling = modeling;

  this._elementFactory = elementFactory;
  this._connect = connect;
  this._create = create;
  this._popupMenu = popupMenu;
  this._canvas = canvas;
  this._rules = rules;
  this._translate = translate;

  if (config.autoPlace !== false) {
    this._autoPlace = injector.get("autoPlace", false);
  }

  eventBus.on("create.end", 250, function (event) {
    let context = event.context,
      shape = context.shape;

    if (!hasPrimaryModifier(event) || !contextPad.isOpen(shape)) {
      return;
    }

    let entries = contextPad.getEntries(shape);

    if (entries.replace) {
      entries.replace.action.click(event, shape);
    }
  });
}

ContextPadProvider.$inject = [
  "config.contextPad",
  "injector",
  "eventBus",
  "contextPad",
  "modeling",
  "elementFactory",
  "connect",
  "create",
  "popupMenu",
  "canvas",
  "rules",
  "translate",
];

ContextPadProvider.prototype.getContextPadEntries = function (element) {
  let contextPad = this._contextPad,
    modeling = this._modeling,
    elementFactory = this._elementFactory,
    connect = this._connect,
    create = this._create,
    popupMenu = this._popupMenu,
    canvas = this._canvas,
    rules = this._rules,
    autoPlace = this._autoPlace,
    translate = this._translate;

  let actions = {};

  if (element.type === "label") {
    return actions;
  }

  let businessObject = element.businessObject;

  // 删除功能
  function removeElement(e) {
    modeling.removeElements([element]);
  }

  // 连接线功能
  function startConnect(event, element) {
    connect.start(event, element);
  }

  // 获取更改类型子菜单位置
  function getReplaceMenuPosition(element) {
    let Y_OFFSET = 5;

    let diagramContainer = canvas.getContainer(),
      pad = contextPad.getPad(element).html;

    let diagramRect = diagramContainer.getBoundingClientRect(),
      padRect = pad.getBoundingClientRect();

    let top = padRect.top - diagramRect.top;
    let left = padRect.left - diagramRect.left;

    let pos = {
      x: left,
      y: top + padRect.height + Y_OFFSET,
    };

    return pos;
  }

  /**
   * Create an append action
   *
   * @param {string} type
   * @param {string} className
   * @param {string} [title]
   * @param {Object} [options]
   *
   * @return {Object} descriptor
   */
  function appendAction(type, className, title, options = {}) {
    function appendStart(event, element) {
      const shape = elementFactory.createShape({ type, ...options });
      create.start(event, shape, {
        source: element,
      });
    }

    const append = autoPlace
      ? function (event, element) {
          const shape = elementFactory.createShape({ type, ...options });
          autoPlace.append(element, shape);
        }
      : appendStart;

    return {
      group: "model",
      className: className,
      title: title,
      action: {
        dragstart: appendStart,
        click: append,
      },
    };
  }

  function splitLaneHandler(count) {
    return function (event, element) {
      // actual split
      modeling.splitLane(element, count);

      // refresh context pad after split to
      // get rid of split icons
      contextPad.open(element, true);
    };
  }

  const deleteConfig = {
    group: "edit",
    className: "bpmn-icon-trash",
    title: translate("Remove"),
    action: {
      click: removeElement,
    },
  };

  const replaceConfig = {
    group: "edit",
    className: "bpmn-icon-screw-wrench",
    title: translate("Change type"),
    action: {
      click: function (event, element) {
        let position = assign(getReplaceMenuPosition(element), {
          cursor: { x: event.x, y: event.y },
        });

        popupMenu.open(element, "bpmn-replace", position);
      },
    },
  };

  const connectConfig = {
    group: "connect",
    className: "bpmn-icon-connection-multi",
    title: translate("Activate the global connect tool"),
    action: {
      click: startConnect,
      dragstart: startConnect,
    },
  };

  // 通用节点配置
  const normalConfig = {
    "append.end-event": appendAction(
      "bpmn:EndEvent",
      "bpmn-icon-end-event-none",
      translate("Create EndEvent")
    ),
    "append.gateway": appendAction(
      "bpmn:ExclusiveGateway",
      "bpmn-icon-gateway-xor",
      translate("Create Gateway")
    ),
    "append.task": appendAction(
      "bpmn:UserTask",
      "bpmn-icon-user-task",
      translate("Create Task")
    ),
    replace: replaceConfig,
    delete: deleteConfig,
    connect: connectConfig,
  };

  // 连线节点配置
  if (element.type === "bpmn:SequenceFlow") {
    return {
      replace: replaceConfig,
      delete: deleteConfig,
    };
  }

  // 中间定时器捕获事件配置
  if (element.type === "bpmn:IntermediateCatchEvent") {
    delete normalConfig.replace;
  }

  // 结束节点配置
  if (element.type === "bpmn:EndEvent") {
    return {
      replace: replaceConfig,
      delete: deleteConfig,
      connect: connectConfig,
    };
  }

  // 创建池配置
  if (element.type === "bpmn:Participant" && isExpanded(businessObject)) {
    let childLanes = getChildLanes(element);
    const config = {};

    assign(config, {
      "lane-insert-above": {
        group: "lane-insert-above",
        className: "bpmn-icon-lane-insert-above",
        title: translate("Add Lane above"),
        action: {
          click: function (event, element) {
            modeling.addLane(element, "top");
          },
        },
      },
    });

    if (childLanes.length < 2) {
      if (element.height >= 120) {
        assign(config, {
          "lane-divide-two": {
            group: "lane-divide",
            className: "bpmn-icon-lane-divide-two",
            title: translate("Divide into two Lanes"),
            action: {
              click: splitLaneHandler(2),
            },
          },
        });
      }

      if (element.height >= 180) {
        assign(config, {
          "lane-divide-three": {
            group: "lane-divide",
            className: "bpmn-icon-lane-divide-three",
            title: translate("Divide into three Lanes"),
            action: {
              click: splitLaneHandler(3),
            },
          },
        });
      }
    }

    assign(config, {
      "lane-insert-below": {
        group: "lane-insert-below",
        className: "bpmn-icon-lane-insert-below",
        title: translate("Add Lane below"),
        action: {
          click: function (event, element) {
            modeling.addLane(element, "bottom");
          },
        },
      },
    });

    return {
      ...config,
      replace: replaceConfig,
      delete: deleteConfig,
      connect: connectConfig,
    };
  }

  return normalConfig;
};
