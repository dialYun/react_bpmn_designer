import React, { useState, useEffect } from "react";
import { Button, Table, Select, Input, Modal, TreeSelect, message } from "antd";
import { assignInfo } from "../../utils";
import SelectUser from "../common/select-user";
import SelectRole from "../common/select-role";
import SelectPost from "../common/select-post";
import { getSelectTreeDepartList } from "../../services";

const { Option } = Select;

/*
 * 选择审核者组件
 */
export default function SelectAssignTable(props) {
  const { assignList, setAssignList } = props;
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [type, setType] = useState(null);
  const [typeName, setTypeName] = useState("");
  const [selectList, setSelectList] = useState([]);
  const [index, setIndex] = useState(-1);
  const [departData, setDepartData] = useState([]);

  useEffect(() => {
    // 查询部门数据
    getSelectTreeDepartList().then((data) => {
      setDepartData(data);
    });
  }, []);

  // 改变用户类型
  function onChangeType(value, index) {
    assignList[index].type = value;
    assignList[index].typeName = assignInfo[value].name;
    assignList[index].detail = "";
    if (["applyUserId", "previousExecutor", "currentUserId"].includes(value)) {
      assignList[index].value = assignInfo[value].name;
      assignList[index].valueName = assignInfo[value].name;
    } else {
      assignList[index].value = "";
      assignList[index].valueName = "";
    }

    setAssignList(JSON.parse(JSON.stringify(assignList)));
  }

  // 改变用户来自
  function onChangeValue(e, index) {
    const value = e.target.value;
    assignList[index].value = value;
    assignList[index].valueName = value;
    setAssignList(JSON.parse(JSON.stringify(assignList)));
  }

  // 打开选择对话框
  function onSelect(type, typeName, detail, index) {
    setType(type);
    setTypeName(typeName);
    setSelectModalVisible(true);
    setSelectList(JSON.parse(JSON.stringify(detail || [])));
    setIndex(index);
  }

  // 选择对话框点击确定
  function handSelectModalOk() {
    let valueName = "";
    let value = "";
    for (const item of selectList) {
      valueName += item.name + ",";
      value += item.id + ",";
    }
    assignList[index].value = value.substring(0, value.length - 1);
    assignList[index].valueName = valueName.substring(0, valueName.length - 1);
    assignList[index].detail = selectList;
    setAssignList(JSON.parse(JSON.stringify(assignList)));
    setSelectModalVisible(false);
  }

  // 修改部门
  function onChangeDepart(value, node, index) {
    const type = value.substring(0, 4);
    const id = value.substring(4);
    if (type === "com_") {
      message.warning(`不能选中根节点(${node})`);
    } else {
      assignList[index].value = id;
      assignList[index].valueName = node[0];
      setAssignList(JSON.parse(JSON.stringify(assignList)));
    }
  }

  //删除
  function deleteAssign(index) {
    assignList.splice(index, 1);
    setAssignList(JSON.parse(JSON.stringify(assignList)));
  }

  // 添加
  function addAssign() {
    assignList.push({ typeName: "", value: "", sort: 10 });
    setAssignList(JSON.parse(JSON.stringify(assignList)));
    setType(null);
  }

  const columns = [
    {
      title: "用户类型",
      dataIndex: "typeName",
      key: "typeName",
      width: 258,
      render: (rowValue, record, index) => (
        <Select
          style={{ width: "100%" }}
          value={rowValue}
          onChange={(type) => onChangeType(type, index)}
        >
          {Object.keys(assignInfo).map((key) => (
            <Option value={key} key={key}>
              {assignInfo[key].name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "用户来自",
      dataIndex: "valueName",
      key: "value",
      width: 358,
      render: function (rowValue, record, index) {
        const { type, typeName } = record;
        if (
          ["applyUserId", "previousExecutor", "currentUserId"].includes(type)
        ) {
          // 类型为：发起人，上一步执行人，当前登录用户
          return <span>{rowValue}</span>;
        } else if (["sql", "custom"].includes(type)) {
          // 类型为：sql脚本，自定义条件
          return (
            <Input.TextArea
              value={rowValue}
              onChange={(e) => onChangeValue(e, index)}
            />
          );
        }
        if (type === "depart") {
          // 类型为：部门
          return (
             <TreeSelect
              value={rowValue}
              placeholder="请选择"
              treeDefaultExpandAll
              onChange={(value, node) => onChangeDepart(value, node, index)}
              style={{ width: "100%" }}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              treeData={departData} // 使用 treeData 属性
            />
          );
        }
        if (["user", "post", "role"].includes(type)) {
          // 类型为：用户，岗位,角色
          return (
            <Input.Search
              placeholder="请选择"
              onSearch={() => onSelect(type, typeName, record.detail, index)}
              enterButton
              value={rowValue}
            />
          );
        }
        return null;
      },
    },
    {
      title: "排序",
      dataIndex: "sort",
      key: "sort",
      width: 100,
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      render: (value, record, index) => (
        <div className="table-btn">
          <Button type="link" onClick={() => deleteAssign(index)}>
            删除
          </Button>
        </div>
      ),
    },
  ];
  return (
    (<div>
      <Button type="primary" style={{ marginBottom: 10 }} onClick={addAssign}>
        添加
      </Button>
      <Table
        dataSource={assignList.map((item, index) => ({ ...item, key: index }))}
        columns={columns}
        pagination={false}
        bordered
      />
      <Modal
        title={"选择" + typeName}
        open={selectModalVisible}
        onOk={handSelectModalOk}
        onCancel={() => setSelectModalVisible(false)}
        width={1000}
        destroyOnClose
      >
        {type === "user" && (
          <SelectUser selectUser={selectList} setSelectUser={setSelectList} />
        )}
        {type === "role" && (
          <SelectRole selectRole={selectList} setSelectRole={setSelectList} />
        )}
        {type === "post" && (
          <SelectPost selectPost={selectList} setSelectPost={setSelectList} />
        )}
      </Modal>
    </div>)
  );
}
