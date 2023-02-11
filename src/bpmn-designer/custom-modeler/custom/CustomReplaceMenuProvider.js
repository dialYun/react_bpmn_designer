import { getBusinessObject, is } from "bpmn-js/lib/util/ModelUtil";
import { isEventSubProcess, isExpanded } from "bpmn-js/lib/util/DiUtil";
import { isDifferentType } from "bpmn-js/lib/features/popup-menu/util/TypeUtil";
import { filter } from "min-dash";
import * as replaceOptions from "./ReplaceOptions"; // 自定义ReplaceOptions文件
import ReplaceMenuProvider from "bpmn-js/lib/features/popup-menu/ReplaceMenuProvider"; // 引入默认的ReplaceMenuProvider

/**
 * ‘更改类型’的弹出菜单，继承默认的ReplaceMenuProvider，修改ReplaceOptions文件即可修改各节点的配置
 */
export default function CustomReplaceMenuProvider(
  bpmnFactory,
  popupMenu,
  modeling,
  moddle,
  bpmnReplace,
  rules,
  translate
) {
  this._bpmnFactory = bpmnFactory;
  this._popupMenu = popupMenu;
  this._modeling = modeling;
  this._moddle = moddle;
  this._bpmnReplace = bpmnReplace;
  this._rules = rules;
  this._translate = translate;

  this.register();
}

CustomReplaceMenuProvider.$inject = [
  "bpmnFactory",
  "popupMenu",
  "modeling",
  "moddle",
  "bpmnReplace",
  "rules",
  "translate",
];

// 继承默认的ReplaceMenuProvider
CustomReplaceMenuProvider.prototype = Object.create(
  ReplaceMenuProvider.prototype
);
CustomReplaceMenuProvider.prototype.constructor = CustomReplaceMenuProvider;

/**
 * Get all entries from replaceOptions for the given element and apply filters
 * on them. Get for example only elements, which are different from the current one.
 *
 * @param {djs.model.Base} element
 *
 * @return {Array<Object>} a list of menu entry items
 */
CustomReplaceMenuProvider.prototype.getEntries = function (element) {
  // 该方法用来配置各类型节点的popup menu,一般只用修改配置文件ReplaceOptions即可

  let businessObject = element.businessObject;

  let rules = this._rules;

  let entries;

  if (!rules.allowed("shape.replace", { element: element })) {
    return [];
  }

  let differentType = isDifferentType(element);

  if (is(businessObject, "bpmn:DataObjectReference")) {
    return this._createEntries(element, replaceOptions.DATA_OBJECT_REFERENCE);
  }

  if (is(businessObject, "bpmn:DataStoreReference")) {
    return this._createEntries(element, replaceOptions.DATA_STORE_REFERENCE);
  }

  // start events outside sub processes
  if (
    is(businessObject, "bpmn:StartEvent") &&
    !is(businessObject.$parent, "bpmn:SubProcess")
  ) {
    entries = filter(replaceOptions.START_EVENT, differentType);

    return this._createEntries(element, entries);
  }

  // expanded/collapsed pools
  if (is(businessObject, "bpmn:Participant")) {
    entries = filter(replaceOptions.PARTICIPANT, function (entry) {
      return isExpanded(businessObject) !== entry.target.isExpanded;
    });

    return this._createEntries(element, entries);
  }

  // start events inside event sub processes
  if (
    is(businessObject, "bpmn:StartEvent") &&
    isEventSubProcess(businessObject.$parent)
  ) {
    entries = filter(
      replaceOptions.EVENT_SUB_PROCESS_START_EVENT,
      function (entry) {
        let target = entry.target;

        let isInterrupting = target.isInterrupting !== false;

        let isInterruptingEqual =
          getBusinessObject(element).isInterrupting === isInterrupting;

        // filters elements which types and event definition are equal but have have different interrupting types
        return (
          differentType(entry) ||
          (!differentType(entry) && !isInterruptingEqual)
        );
      }
    );

    return this._createEntries(element, entries);
  }

  // start events inside sub processes
  if (
    is(businessObject, "bpmn:StartEvent") &&
    !isEventSubProcess(businessObject.$parent) &&
    is(businessObject.$parent, "bpmn:SubProcess")
  ) {
    entries = filter(replaceOptions.START_EVENT_SUB_PROCESS, differentType);

    return this._createEntries(element, entries);
  }

  // end events
  if (is(businessObject, "bpmn:EndEvent")) {
    entries = filter(replaceOptions.END_EVENT, function (entry) {
      let target = entry.target;

      // hide cancel end events outside transactions
      if (
        target.eventDefinitionType == "bpmn:CancelEventDefinition" &&
        !is(businessObject.$parent, "bpmn:Transaction")
      ) {
        return false;
      }

      return differentType(entry);
    });

    return this._createEntries(element, entries);
  }

  // boundary events
  if (is(businessObject, "bpmn:BoundaryEvent")) {
    entries = filter(replaceOptions.BOUNDARY_EVENT, function (entry) {
      let target = entry.target;

      if (
        target.eventDefinitionType == "bpmn:CancelEventDefinition" &&
        !is(businessObject.attachedToRef, "bpmn:Transaction")
      ) {
        return false;
      }
      let cancelActivity = target.cancelActivity !== false;

      let isCancelActivityEqual =
        businessObject.cancelActivity == cancelActivity;

      return (
        differentType(entry) ||
        (!differentType(entry) && !isCancelActivityEqual)
      );
    });

    return this._createEntries(element, entries);
  }

  // intermediate events
  if (
    is(businessObject, "bpmn:IntermediateCatchEvent") ||
    is(businessObject, "bpmn:IntermediateThrowEvent")
  ) {
    entries = filter(replaceOptions.INTERMEDIATE_EVENT, differentType);

    return this._createEntries(element, entries);
  }

  // gateways
  if (is(businessObject, "bpmn:Gateway")) {
    entries = filter(replaceOptions.GATEWAY, differentType);

    return this._createEntries(element, entries);
  }

  // transactions
  if (is(businessObject, "bpmn:Transaction")) {
    entries = filter(replaceOptions.TRANSACTION, differentType);

    return this._createEntries(element, entries);
  }

  // expanded event sub processes
  if (isEventSubProcess(businessObject) && isExpanded(businessObject)) {
    entries = filter(replaceOptions.EVENT_SUB_PROCESS, differentType);

    return this._createEntries(element, entries);
  }

  // expanded sub processes
  if (is(businessObject, "bpmn:SubProcess") && isExpanded(businessObject)) {
    entries = filter(replaceOptions.SUBPROCESS_EXPANDED, differentType);

    return this._createEntries(element, entries);
  }

  // collapsed ad hoc sub processes
  if (
    is(businessObject, "bpmn:AdHocSubProcess") &&
    !isExpanded(businessObject)
  ) {
    entries = filter(replaceOptions.TASK, function (entry) {
      let target = entry.target;

      let isTargetSubProcess = target.type === "bpmn:SubProcess";

      let isTargetExpanded = target.isExpanded === true;

      return (
        isDifferentType(element, target) &&
        (!isTargetSubProcess || isTargetExpanded)
      );
    });

    return this._createEntries(element, entries);
  }

  // sequence flows
  if (is(businessObject, "bpmn:SequenceFlow")) {
    return this._createSequenceFlowEntries(
      element,
      replaceOptions.SEQUENCE_FLOW
    );
  }

  // flow nodes
  if (is(businessObject, "bpmn:FlowNode")) {
    entries = filter(replaceOptions.TASK, differentType);

    // collapsed SubProcess can not be replaced with itself
    if (is(businessObject, "bpmn:SubProcess") && !isExpanded(businessObject)) {
      entries = filter(entries, function (entry) {
        return entry.label !== "Sub Process (collapsed)";
      });
    }

    return this._createEntries(element, entries);
  }

  return [];
};

/**
 * Get a list of header items for the given element. This includes buttons
 * for multi instance markers and for the ad hoc marker.
 *
 * @param {djs.model.Base} element
 *
 * @return {Array<Object>} a list of menu entry items
 */
CustomReplaceMenuProvider.prototype.getHeaderEntries = function (element) {
  // 该方法用来配置各类型节点的popup menu的头部

  let headerEntries = [];

  if (is(element, "bpmn:Activity") && !isEventSubProcess(element)) {
    headerEntries = headerEntries.concat(this._getLoopEntries(element));
  }

  if (is(element, "bpmn:DataObjectReference")) {
    headerEntries = headerEntries.concat(
      this._getDataObjectIsCollection(element)
    );
  }

  // 去掉创建池弹出菜单的头部
  // if (is(element, "bpmn:Participant")) {
  //   headerEntries = headerEntries.concat(
  //     this._getParticipantMultiplicity(element)
  //   );
  // }

  if (
    is(element, "bpmn:SubProcess") &&
    !is(element, "bpmn:Transaction") &&
    !isEventSubProcess(element)
  ) {
    headerEntries.push(this._getAdHocEntry(element));
  }

  return headerEntries;
};
