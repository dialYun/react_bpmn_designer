import React, { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import SelectAssignTable from "./SelectAssignTable";
import AssignTable from "./AssignTable";
import { assignInfo, updateElementExtensions } from "../../utils";

/**
 *审核者配置
 */
export default function AssignConfig(props) {
  const { bpmnInstance } = props;
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [assignList, setAssignList] = useState([]);
  const [assignAttr, setAssignAttr] = useState([]);
  const [otherAttr, setOtherAttr] = useState([]);
  const { bpmnElement = {} } = bpmnInstance;

  // 读取扩展属性中的按钮
  useEffect(() => {
    if (bpmnElement.businessObject) {
      const busObj = bpmnElement.businessObject;
      const other = [];
      const assign =
        (busObj.extensionElements &&
          busObj.extensionElements.values &&
          busObj.extensionElements.values.filter((ex) => {
            if (ex.$type.indexOf("Assignee") !== -1) {
              return true;
            }
            other.push(ex);
          })) ||
        [];
      setOtherAttr(other);
      updateAssign(assign);
    }
  }, [bpmnElement.businessObject]);

  // 通过id获取审核者的名字，显示列表
  async function updateAssign(assign) {
    const list = [];
    for (const item of assign) {
      const { type, value = "", sort } = item;
      if (assignInfo[type]) {
        const { getInfoById, name } = assignInfo[type];
        if (
          ["applyUserId", "previousExecutor", "currentUserId"].includes(type)
        ) {
          // 类型为：发起人，上一步执行人，当前登录用户
          list.push({ typeName: name, valueName: name, type, sort });
        } else if (["sql", "custom"].includes(type)) {
          // 类型为：sql脚本，自定义条件
          list.push({
            typeName: name,
            valueName: value,
            type,
            sort,
            value: value,
          });
        } else {
          // 类型为：用户，岗位，部门，角色
          const valueList = value.split(",");
          if (valueList[0].length) {
            const detail = [];
            let valueName = "";
            for (const i of valueList) {
              await getInfoById({ id: i }).then((data) => {
                valueName += data.name + ",";
                detail.push(data);
              });
            }
            list.push({
              ...item,
              typeName: name,
              valueName: valueName.substring(0, valueName.length - 1),
              detail,
            });
          }
        }
      }
    }
    setAssignAttr(list);
  }

  // 添加人员
  function handSelectModalOk() {
    const list = JSON.parse(JSON.stringify(assignList));
    const arr = [];
    const arr2 = [];
    for (const item of list) {
      //除发起人，上一步执行人，当前登录用户，value为空，不加入
      if (
        !item.value &&
        !["applyUserId", "previousExecutor", "currentUserId"].includes(
          item.type
        )
      )
        continue;

      //加入审核者列表
      const obj = JSON.parse(JSON.stringify(item));
      arr2.push(obj);

      // 删除多余属性
      delete item.typeName;
      delete item.valueName;
      delete item.detail;
      delete item.$type;

      const object = bpmnInstance.moddle.create("flowable:Assignee", {
        ...item,
        condition: 0,
        operationType: 0,
      });
      arr.push(object);
    }
    updateElementExtensions([...otherAttr, ...arr], bpmnInstance);
    setAssignAttr(arr2);
    setSelectModalVisible(false);
  }

  // 打开对话框
  function openModal() {
    setSelectModalVisible(true);
    setAssignList(JSON.parse(JSON.stringify(assignAttr)));
  }

  return (
    <>
      <div className="config-btn">
        <Button type="primary" onClick={openModal} style={{ width: 80 }}>
          分配人员
        </Button>
      </div>
      <AssignTable assignList={assignAttr} />
      <Modal
        title="节点人员设置"
        open={selectModalVisible}
        onOk={handSelectModalOk}
        onCancel={() => setSelectModalVisible(false)}
        width={1000}
        destroyOnClose
      >
        <SelectAssignTable
          assignList={assignList}
          setAssignList={setAssignList}
        />
      </Modal>
    </>
  );
}
