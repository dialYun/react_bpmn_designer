import React, { useState, useEffect } from "react";
import { Input, Radio, Modal } from "antd";
import SelectUser from "../common/select-user";
import SelectRole from "../common/select-role";
import { getRoleInfoById, getUserInfoById } from "../../services";

/**
 * 权限设置
 */
export default function AuthorityConfig(props) {
  const { bpmnInstance } = props;
  const [selectUser, setSelectUser] = useState([]);
  const [selectRole, setSelectRole] = useState([]);
  const [user, setUser] = useState([]);
  const [role, setRole] = useState([]);
  const [authorityType, setAuthorityType] = useState("all");
  const [selectUserVisible, setSelectUserVisible] = useState(false);
  const [selectRoleVisible, setSelectRoleVisible] = useState(false);
  const { modeling, bpmnElement = {} } = bpmnInstance;

  // 读取已有配置
  useEffect(() => {
    if (bpmnElement.businessObject) {
      const { candidateStarterGroups = "", candidateStarterUsers = "" } =
        bpmnElement.businessObject;
      updateUserInfo(candidateStarterUsers);
      updateRoleInfo(candidateStarterGroups);

      // 初始化允许启动
      if (candidateStarterGroups.length || candidateStarterUsers.length)
        setAuthorityType("assign");
    }
  }, [bpmnElement.businessObject]);

  // 根据用户id获取用户信息
  async function updateUserInfo(str) {
    const list = str.split(",");
    const arr = [];
    if (list[0].length) {
      for (const id of list) {
        await getUserInfoById({ id }).then((data) => {
          arr.push(data);
        });
      }
    }
    setUser(arr);
  }

  // 根据角色id获取角色信息
  async function updateRoleInfo(str) {
    const list = str.split(",");
    const arr = [];
    if (list[0].length) {
      for (const id of list) {
        await getRoleInfoById({ id }).then((data) => {
          arr.push(data);
        });
      }
    }
    setRole(arr);
  }

  //添加用户
  function selectUserModalOk() {
    setSelectUserVisible(false);
    setUser(selectUser);
    modeling.updateProperties(bpmnElement, {
      "flowable:candidateStarterUsers": selectUser
        .map((item) => item.id)
        .join(","),
    });
  }

  //添加角色
  function selectRoleModalOk() {
    setSelectRoleVisible(false);
    setRole(selectRole);
    modeling.updateProperties(bpmnElement, {
      "flowable:candidateStarterGroups": selectRole
        .map((item) => item.id)
        .join(","),
    });
  }

  // 显示用户、角色名称
  function showName(list) {
    let str = "";
    for (const item of list) {
      str += item.name + ",";
    }
    return str.substring(0, str.length - 1);
  }

  // 打开添加用户对话框
  function openAddUserModal() {
    setSelectUserVisible(true);
    setSelectUser(user);
  }

  // 打开添加角色对话框
  function openAddRoleModal() {
    setSelectRoleVisible(true);
    setSelectRole(role);
  }

  //允许启动选择所有成员时要清空选择的用户和角色信息
  function onChangeType(e) {
    setAuthorityType(e.target.value);
    setRole([]);
    setUser([]);
    setSelectRole([]);
    setSelectUser([]);
    modeling.updateProperties(bpmnElement, {
      "flowable:candidateStarterGroups": "",
      "flowable:candidateStarterUsers": "",
    });
  }

  return (
    <>
      <div className="base-form">
        <div>
          <span>允许启动</span>
          <Radio.Group
            onChange={onChangeType}
            value={authorityType}
            style={{ marginTop: 5 }}
          >
            <Radio value="all">所有成员</Radio>
            <Radio value="assign">指定成员</Radio>
          </Radio.Group>
        </div>
        {authorityType === "assign" && (
          <>
            <div>
              <span>添加用户</span>
              <Input.Search
                placeholder="请选择"
                onSearch={openAddUserModal}
                enterButton
                style={{ width: 376, textAlign: "left" }}
                value={showName(user)}
              />
            </div>
            <div>
              <span>添加角色</span>
              <Input.Search
                placeholder="请选择"
                onSearch={openAddRoleModal}
                enterButton
                style={{ width: 376, textAlign: "left" }}
                value={showName(role)}
              />
            </div>
          </>
        )}
      </div>
      <Modal
        title="选择用户"
        width={1000}
        open={selectUserVisible}
        onOk={selectUserModalOk}
        onCancel={() => setSelectUserVisible(false)}
        bodyStyle={{ padding: 10 }}
        destroyOnClose
      >
        <SelectUser setSelectUser={setSelectUser} selectUser={selectUser} />
      </Modal>
      <Modal
        title="选择角色"
        width={788}
        open={selectRoleVisible}
        onOk={selectRoleModalOk}
        onCancel={() => setSelectRoleVisible(false)}
        bodyStyle={{ padding: 10 }}
        destroyOnClose
      >
        <SelectRole setSelectRole={setSelectRole} selectRole={selectRole} />
      </Modal>
    </>
  );
}
