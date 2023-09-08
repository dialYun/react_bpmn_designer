import React, { useState, useRef, useEffect } from "react";
import { Button, Modal } from "antd";
import ListenerForm from "./ListenerForm";
import SelectListenerTable from "./SelectListenerTable";
import ListenerTable from "./ListenerTable";
import { updateElementExtensions, createListenerObject } from "../../utils";

/**
 *监听器配置
 */
export default function ListenerConfig(props) {
  const { bpmnInstance, type = "Execution" } = props;
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [eventListener, setEventListener] = useState([]);
  const [otherListener, setOtherListener] = useState([]);
  const [listenerIndex, setListenIndex] = useState(-1);
  const [record, setRecord] = useState({});
  const [selectedRow, setSelectedRow] = useState([]);
  const formRef = useRef(null);
  const { bpmnElement = {} } = bpmnInstance;

  // 读取扩展属性中的监听器
  useEffect(() => {
    if (bpmnElement.businessObject) {
      const busObj = bpmnElement.businessObject;
      const other = [];
      const event =
        (busObj.extensionElements &&
          busObj.extensionElements.values &&
          busObj.extensionElements.values.filter((ex) => {
            if (ex.$type.indexOf(type + "Listener") !== -1) {
              return true;
            }
            other.push(ex);
          })) ||
        [];
      setOtherListener(other);
      setEventListener(event);
    }
  }, [bpmnElement.businessObject]);

  // 删除监听器
  const deleteListener = (index) => {
    eventListener.splice(index, 1);
    setEventListener(JSON.parse(JSON.stringify(eventListener))); // 深拷贝一下才会触发子组件ListenerTable更新
    updateElementExtensions([...otherListener, ...eventListener], bpmnInstance);
  };

  // 保存监听器
  const handAddModalOk = () => {
    formRef.current
      .validateFields()
      .then((values) => {
        const listenerObject = createListenerObject(
          values,
          type === "Task",
          bpmnInstance
        );
        if (listenerIndex === -1) {
          eventListener.push(listenerObject);
        } else {
          eventListener.splice(listenerIndex, 1, listenerObject);
        }
        setEventListener(JSON.parse(JSON.stringify(eventListener))); // 深拷贝一下才会触发子组件ListenerTable更新
        updateElementExtensions(
          [...otherListener, ...eventListener],
          bpmnInstance
        );
        setAddModalVisible(false);
        setListenIndex(-1);
        setRecord({});
        formRef.current.resetFields();
      })
      .catch((error) => {});
  };

  // 把选择的监听器加入列表
  const handSelectModalOk = () => {
    for (const item of selectedRow) {
      const { event, valueType, implement } = item;
      const obj = {
        event: event,
        listenerType: valueType,
        [valueType]: implement,
      };
      const listenerObject = createListenerObject(
        obj,
        type === "Task",
        bpmnInstance
      );
      eventListener.push(listenerObject);
      setEventListener(JSON.parse(JSON.stringify(eventListener))); // 深拷贝一下才会触发子组件ListenerTable更新
      updateElementExtensions(
        [...otherListener, ...eventListener],
        bpmnInstance
      );
      setSelectModalVisible(false);
    }
  };

  // 注入选择的行数据
  const selectListener = (selectedRow) => {
    setSelectedRow(selectedRow);
  };

  // 编辑表单时传入选中行
  const editListener = (record, index) => {
    setAddModalVisible(true);
    setRecord(record);
    setListenIndex(index);
  };

  // 取消编辑表单
  function handAddModalCancel() {
    setRecord({});
    formRef.current.resetFields();
    setAddModalVisible(false);
  }

  return (
    <>
      <div className="config-btn">
        <Button type="primary" onClick={() => setAddModalVisible(true)}>
          添加
        </Button>
        <Button type="primary" onClick={() => setSelectModalVisible(true)}>
          选择
        </Button>
      </div>
      <ListenerTable
        editListener={editListener}
        listener={eventListener}
        deleteListener={deleteListener}
      />
      <Modal
        title={type === "Task" ? "添加任务监听器" : "添加执行监听器"}
        open={addModalVisible}
        onOk={handAddModalOk}
        onCancel={handAddModalCancel}
      >
        {/* 还有一种方式：手动调用form.setFieldsValue来更新值，而不是依赖useEffect来做这件事 */}
        <ListenerForm ref={formRef} record={record} key={Math.random() * 10} />
      </Modal>
      <Modal
        title="选择常用监听器"
        open={selectModalVisible}
        onOk={handSelectModalOk}
        onCancel={() => setSelectModalVisible(false)}
        width={800}
        destroyOnClose
      >
        <SelectListenerTable selectListener={selectListener} type={type} />
      </Modal>
    </>
  );
}
