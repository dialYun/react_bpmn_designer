import React, { useState, useRef, useEffect } from "react";
import { Button, Modal } from "antd";
import ButtonForm from "./ButtonForm";
import SelectButtonTable from "./SelectButtonTable";
import ButtonTable from "./ButtonTable";
import { updateElementExtensions } from "../../utils";

/**
 *按钮配置
 */
export default function ButtonConfig(props) {
  const { bpmnInstance } = props;
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [otherList, setOtherList] = useState([]);
  const [buttonList, setButtonList] = useState([]);
  const [buttonIndex, setButtonIndex] = useState(-1);
  const [record, setRecord] = useState({});
  const [selectedRow, setSelectedRow] = useState([]);
  const formRef = useRef(null);
  const { bpmnElement = {} } = bpmnInstance;

  // 读取扩展属性中的按钮
  useEffect(() => {
    if (bpmnElement.businessObject) {
      const busObj = bpmnElement.businessObject;
      const other = [];
      const list =
        (busObj.extensionElements &&
          busObj.extensionElements.values &&
          busObj.extensionElements.values.filter((ex) => {
            if (ex.$type.indexOf("Button") !== -1) {
              return true;
            }
            other.push(ex);
          })) ||
        [];
      setButtonList(list);
      setOtherList(other);
    }
  }, [bpmnElement.businessObject]);

  // 删除按钮
  const deleteButton = (index) => {
    buttonList.splice(index, 1);
    setButtonList(JSON.parse(JSON.stringify(buttonList))); // 深拷贝一下才会触发子组件ListenerTable更新
    updateElementExtensions([...buttonList, ...otherList], bpmnInstance);
  };

  // 保存监听器
  const handAddModalOk = () => {
    formRef.current
      .validateFields()
      .then((values) => {
        const object = bpmnInstance.moddle.create(`flowable:Button`, {
          ...values,
          next: "0",
        });
        if (buttonIndex === -1) {
          buttonList.push(object);
        } else {
          buttonList.splice(buttonIndex, 1, object);
        }
        setButtonList(JSON.parse(JSON.stringify(buttonList)));
        updateElementExtensions([...buttonList, ...otherList], bpmnInstance);
        setAddModalVisible(false);
        setButtonIndex(-1);
        setRecord({});
        formRef.current.resetFields();
      })
      .catch((error) => {});
  };

  // 把选择的按钮加入列表
  const handSelectModalOk = () => {
    for (const item of selectedRow) {
      if (buttonList.filter((btn) => btn.id === item.id).length) continue;
      const object = bpmnInstance.moddle.create("flowable:Button", {
        ...item,
        isHide: "0",
        next: "0",
      });
      buttonList.push(object);
    }
    setButtonList(JSON.parse(JSON.stringify(buttonList)));
    updateElementExtensions([...buttonList, ...otherList], bpmnInstance);
    setSelectModalVisible(false);
  };

  // 注入选择的行数据
  const selectButton = (selectedRow) => {
    setSelectedRow(selectedRow);
  };

  // 编辑表单时传入选中行
  const editButton = (record, index) => {
    setAddModalVisible(true);
    setRecord(record);
    setButtonIndex(index);
  };

  // 取消编辑表单
  function handAddModalCancel() {
    setRecord({});
    setAddModalVisible(false);
  }

  return (
    <>
      <div className="config-btn">
        <Button
          type="primary"
          onClick={() => setSelectModalVisible(true)}
          style={{ width: 80 }}
        >
          选择按钮
        </Button>
        <Button
          type="primary"
          onClick={() => setAddModalVisible(true)}
          style={{ width: 80 }}
        >
          添加按钮
        </Button>
      </div>
      <ButtonTable
        editButton={editButton}
        buttonList={buttonList}
        deleteButton={deleteButton}
      />
      <Modal
        title="选择按钮"
        open={selectModalVisible}
        onOk={handSelectModalOk}
        onCancel={() => setSelectModalVisible(false)}
        destroyOnClose
      >
        <SelectButtonTable
          selectButton={selectButton}
          buttonList={buttonList}
        />
      </Modal>
      <Modal
        title="添加按钮"
        open={addModalVisible}
        onOk={handAddModalOk}
        onCancel={handAddModalCancel}
      >
        <ButtonForm ref={formRef} record={record} key={Math.random() * 10} />
      </Modal>
    </>
  );
}
