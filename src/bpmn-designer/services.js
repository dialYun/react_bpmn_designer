/*
 * 调用后端接口
 */

import { newXml } from "../newXml";

// 获取xml数据
function getXmlData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(newXml), 1000);
  });
}

/*顶部操作按钮接口*/
// 保存并发布
function saveBpmnXml(param) {
  return new Promise((resolve) => {
    resolve();
  });
}

// 保存草稿
function saveBpmnXmlDraft(param) {
  return new Promise((resolve) => {
    resolve();
  });
}

/*右侧属性面板接口*/
// 获取常用监听器列表
function getListenerList(param) {
  const data = [
    {
      name: "end",
      event: "end",
      id: "1",
      listenerType: "1",
      valueType: "expression",
      implement: "测试测试",
    },
    {
      name: "start",
      event: "start",
      id: "2",
      listenerType: "1",
      valueType: "class",
      implement: "测试测试2",
    },
  ];
  return new Promise((resolve) => {
    resolve({ list: data, count: 30 });
  });
}

// 获取表单列表
function getFormList(param) {
  const data = [
    {
      name: "工单申请",
      version: "3",
      id: "1",
      type: 1,
      fields: [
        {
          id: "111",
          name: "单行文本",
          readable: true,
          writable: false,
        },
        {
          id: "1112",
          name: "单行文本2",
          readable: true,
          writable: true,
        },
      ],
    },
    {
      name: "工单申请2",
      version: "3",
      id: "2",
      type: 1,
      fields: [
        {
          id: "111",
          name: "单行文本3",
          readable: true,
          writable: false,
        },
        {
          id: "1112",
          name: "单行文本4",
          readable: true,
          writable: true,
        },
      ],
    },
  ];
  return new Promise((resolve) => {
    resolve(data);
  });
}

// 获取按钮列表
function getButtonList(param) {
  const data = [
    {
      id: "1406831300197498882",
      name: "派单",
      code: "_flow_assign",
      sort: 1,
    },
    {
      id: "1406832507825700866",
      name: "接单",
      code: "_flow_receive",
      sort: 2,
    },
  ];
  return new Promise((resolve) => {
    resolve({ list: data, count: 2 });
  });
}

// 获取用户列表
function getUserList(param) {
  const data = [
    {
      id: "11",
      loginName: "Admin",
      name: "Lily",
      company: {
        name: "xx公司",
      },
      office: {
        name: "开发一部",
      },
    },
    {
      id: "22",
      loginName: "Admin",
      name: "Alice",
      company: {
        name: "xx公司",
      },
      office: {
        name: "开发二部",
      },
    },
  ];
  return new Promise((resolve) => {
    resolve({ list: data, count: 30 });
  });
}

// 根据用户id获取用户信息
function getUserInfoById(param) {
  const data = {
    id: "11",
    loginName: "Admin",
    name: "Lily",
    company: {
      name: "xx公司",
    },
    office: {
      name: "开发一部",
    },
  };
  return new Promise((resolve) => {
    resolve(data);
  });
}

// 获取角色列表
function getRoleList(param) {
  const data = [
    {
      id: "11",
      name: "部门管理员",
      enname: "aa",
    },
    {
      id: "22",
      name: "部门管理员2",
      enname: "bb",
    },
  ];
  return new Promise((resolve) => {
    resolve({ list: data, count: 30 });
  });
}

// 根据角色id获取角色信息
function getRoleInfoById(param) {
  const data = {
    id: "11",
    name: "部门管理员",
    enname: "aa",
  };
  return new Promise((resolve) => {
    resolve(data);
  });
}

// 获取岗位列表
function getPostList(param) {
  const data = [
    {
      id: "11",
      name: "总裁",
      code: "aa",
    },
    {
      id: "22",
      name: "部长",
      code: "bb",
    },
  ];
  return new Promise((resolve) => {
    resolve({ list: data, count: 30 });
  });
}

// 根据id获取岗位信息
function getPostInfoById(param) {
  const data = {
    id: "22",
    name: "部长",
    code: "bb",
  };
  return new Promise((resolve) => {
    resolve(data);
  });
}

// 获取部门列表
function getDepartList() {
  const data = {
    name: "xx公司",
    id: "2343",
    children: [
      {
        name: "开发一部",
        id: "2323",
      },
      {
        name: "开发二部",
        id: "23123",
      },
    ],
  };
  return new Promise((resolve) => {
    resolve(data);
  });
}

// 根据id获取部门信息
function getDepartInfoById(param) {
  const data = {
    name: "开发一部",
    id: "2323",
  };
  return new Promise((resolve) => {
    resolve(data);
  });
}

// 获取流转条件表单字段
function getConditionField() {
  const data = [
    {
      name: "字段1",
      id: "2323",
    },
    {
      name: "字段2",
      id: "23232",
    },
  ];
  return new Promise((resolve) => {
    resolve(data);
  });
}

// 获取流程表达式
function getConditionExpress() {
  const data = [
    {
      name: "不同意",
      id: "2323",
      express: "${disagree}",
      note: "备注信息",
    },
    {
      name: "同意",
      id: "23232",
      express: "${agree}",
      note: "备注信息2",
    },
  ];
  return new Promise((resolve) => {
    resolve({ list: data, count: 30 });
  });
}

export {
  getListenerList,
  getFormList,
  saveBpmnXml,
  saveBpmnXmlDraft,
  getButtonList,
  getDepartList,
  getUserList,
  getUserInfoById,
  getRoleInfoById,
  getRoleList,
  getDepartInfoById,
  getPostInfoById,
  getPostList,
  getConditionField,
  getConditionExpress,
  getXmlData,
};
