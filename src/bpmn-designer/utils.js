import {
  getSelectTreeDepartList,
  getDepartInfoById,
  getPostList,
  getPostInfoById,
  getUserList,
  getUserInfoById,
  getRoleList,
  getRoleInfoById,
} from "./services";

export function updateElementExtensions(extensionList, bpmnInstance) {
  const { modeling, bpmnElement, moddle } = bpmnInstance;
  const list = [];
  for (const item of extensionList) {
    item.__proto__ = moddle.create(item.$type, {}).__proto__;
    list.push(item);
  }

  const extensions = moddle.create("bpmn:ExtensionElements", {
    values: list,
  });
  modeling.updateProperties(bpmnElement, {
    extensionElements: extensions,
  });
}

// 创建监听器实例
export function createListenerObject(options, isTask, bpmnInstances) {
  const listenerObj = Object.create(null);
  listenerObj.event = options.event;
  isTask && (listenerObj.id = options.id);
  switch (options.listenerType) {
    case "expression":
      listenerObj.expression = options.expression;
      break;
    case "delegateExpression":
      listenerObj.delegateExpression = options.delegateExpression;
      break;
    default:
      listenerObj.class = options.class;
  }
  return bpmnInstances.moddle.create(
    `flowable:${isTask ? "TaskListener" : "ExecutionListener"}`,
    listenerObj
  );
}

// 审核者配置信息
export const assignInfo = {
  user: {
    name: "用户",
    getList: getUserList,
    getInfoById: getUserInfoById,
  },
  post: {
    name: "岗位",
    getList: getPostList,
    getInfoById: getPostInfoById,
  },
  depart: {
    name: "部门",
    getList: getSelectTreeDepartList,
    getInfoById: getDepartInfoById,
  },
  role: {
    name: "角色",
    getList: getRoleList,
    getInfoById: getRoleInfoById,
  },
  applyUserId: {
    name: "发起人",
  },
  previousExecutor: {
    name: "上一步执行人",
  },
  currentUserId: {
    name: "当前登录用户",
  },
  sql: {
    name: "sql脚本",
  },
  custom: {
    name: "自定义条件",
  },
};

export const pagination = (total) => ({
  total,
  pageSize: 10,
  size: "small",
  hideOnSinglePage: false,
  showSizeChanger: true,
  pageSizeOptions: ["5", "10", "50", "100"],
  showQuickJumper: true,
  showTotal: () => `共${total}条`,
});


export function Type_Script_Is(element, type) {
  var bo = getBusinessObject(element);

  return bo && (typeof bo.$instanceOf === 'function') && bo.$instanceOf(type);
}

export function getBusinessObject(element) {
  return (element && element.businessObject) || element;
}