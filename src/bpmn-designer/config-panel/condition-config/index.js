import React, { useState, useEffect } from "react";
import { Radio, Divider, Button, Modal, Input } from "antd";
import { updateElementExtensions } from "../../utils";
import FieldTable from "./FieldTable";
import ExpressTable from "./ExpressTable";

/**
 * 流转条件
 */
export default function ConditionConfig(props) {
  const { bpmnInstance } = props;
  const [type, setType] = useState(0);
  const [fieldList, setFieldList] = useState([]);
  const [otherList, setOtherList] = useState([]);
  const [express, setExpress] = useState("");
  const [selectModalVisible, setSelectModalVisible] = useState(false);

  const { bpmnElement = {}, modeling, moddle } = bpmnInstance;

  // 读取数据
  useEffect(() => {
    if (bpmnElement.businessObject) {
      const busObj = bpmnElement.businessObject;

      // 设置流程表达式
      if (busObj.conditionExpression) {
        setType(0);
        setExpress(busObj.conditionExpression.body);
      }

      // 设置表单字段
      const other = [];
      const list =
        (busObj.extensionElements &&
          busObj.extensionElements.values &&
          busObj.extensionElements.values.filter((ex) => {
            if (ex.$type.indexOf("Condition") !== -1) {
              return true;
            }
            other.push(ex);
          })) ||
        [];
      setOtherList(other);
      setFieldList(list);
    }
  }, [bpmnElement.businessObject]);

  // 保存表单字段
  useEffect(() => {
    const list = [];
    let i = 0;
    for (const item of fieldList) {
      const { field, compare, value, logic } = item;
      const obj = { field, compare, value, logic, sort: i++ };
      list.push(bpmnInstance.moddle.create("flowable:Condition", obj));
    }
    updateElementExtensions([...list, ...otherList], bpmnInstance);
  }, [fieldList]);

  // 添加表单字段
  function addField() {
    fieldList.push({ field: "", compare: "<", value: "", logic: "and" });
    setFieldList(JSON.parse(JSON.stringify(fieldList)));
  }

  // 添加表达式
  function handSelectModalOk() {
    setSelectModalVisible(false);
    const conditionExpression = moddle.create("bpmn:FormalExpression", {
      body: express,
    });
    modeling.updateProperties(bpmnElement, {
      conditionExpression,
    });
  }

  return (
    <>
      <Radio.Group onChange={(e) => setType(e.target.value)} value={type}>
        <Radio value={0}>表单字段</Radio>
        <Radio value={1}>流程表达式</Radio>
      </Radio.Group>
      <Divider />
      {type === 0 && (
        <>
          <div className="config-btn">
            <Button type="primary" onClick={addField}>
              添加
            </Button>
          </div>
          <FieldTable fieldList={fieldList} setFieldList={setFieldList} />
        </>
      )}
      {type === 1 && (
        <div className="base-form">
          <div>
            <span>流程表达式</span>
            <Input.Search
              placeholder="请选择"
              onSearch={() => setSelectModalVisible(true)}
              enterButton
              style={{ width: 376, textAlign: "left" }}
              value={express}
            />
          </div>
        </div>
      )}
      <Modal
        title="选择常用流程表达式"
        open={selectModalVisible}
        onOk={handSelectModalOk}
        onCancel={() => setSelectModalVisible(false)}
        destroyOnClose
        width={700}
      >
        <ExpressTable setExpress={setExpress} />
      </Modal>
    </>
  );
}
