import React, { useState, useEffect } from "react";
import { Select, Radio, InputNumber } from "antd";

const { Option } = Select;

/**
 * 会签设置
 */
export default function CountersignConfig(props) {
  const { bpmnInstance } = props;
  const [type, setType] = useState(0);
  const [passType, setPassType] = useState("all");
  const [rate, setRate] = useState("100");
  const [instance, setInstance] = useState(null);
  const { modeling, bpmnElement = {}, moddle } = bpmnInstance;

  // 读取已有配置
  useEffect(() => {
    if (
      bpmnElement.businessObject &&
      bpmnElement.businessObject.loopCharacteristics
    ) {
      const { isSequential, completionCondition = {} } =
        bpmnElement.businessObject.loopCharacteristics;
      setType(isSequential ? 2 : 1);
      if (completionCondition.body) {
        const { body } = completionCondition;
        const index = body.indexOf("=");
        const num = body.substring(index + 1, body.length - 2) * 100;
        setRate(num);
        setPassType(num === 100 ? "all" : "rate");

        //创建实例
        createInstance(type);
      }
    } else {
      setType(0);
    }
  }, [bpmnElement.businessObject]);

  // 创建实例
  function createInstance(type) {
    modeling.updateProperties(bpmnElement, {
      "flowable:assignee": "${assignee}",
    });
    const attr = {
      "flowable:collection": "${mutiInstanceHandler.getList(execution)}",
      "flowable:elementVariable": "assignee",
      rate: 50,
    };
    if (type === 2) {
      attr.isSequential = true;
    }
    const obj = moddle.create("bpmn:MultiInstanceLoopCharacteristics", attr);
    setInstance(obj);
    modeling.updateProperties(bpmnElement, {
      loopCharacteristics: obj,
    });
    return obj;
  }

  // 改变多实例类型
  function onChangeType(type) {
    setType(type);

    // 取消多实例配置
    if (type === 0) {
      modeling.updateProperties(bpmnElement, {
        loopCharacteristics: null,
        "flowable:assignee": "",
      });
      return;
    }
    //配置多实例
    createInstance(type);
  }

  // 改变完成条件
  function onChangePassType(e) {
    setPassType(e.target.value);
    setRate(100);
    const body = "${nrOfCompletedInstances/nrOfInstances &gt;= 1 }";
    const completionCondition = moddle.create("bpmn:FormalExpression", {
      body,
    });
    modeling.updateModdleProperties(bpmnElement, instance, {
      completionCondition,
    });
  }

  // 改变比例
  function onChangeRate(value) {
    setRate(value);
    const body =
      "${nrOfCompletedInstances/nrOfInstances &gt;= " + value / 100 + " }";
    const completionCondition = moddle.create("bpmn:FormalExpression", {
      body,
    });
    modeling.updateModdleProperties(bpmnElement, instance, {
      completionCondition,
    });
  }

  return (
    <div className="base-form">
      <div>
        <span>多实例类型</span>
        <Select style={{ width: "100%" }} onChange={onChangeType} value={type}>
          <Option value={0}>非会签</Option>
          <Option value={1}>并行会签</Option>
          <Option value={2}>串行会签</Option>
        </Select>
      </div>
      {type !== 0 && (
        <>
          <div>
            <span style={{ marginLeft: -15 }}>完成条件</span>
            <Radio.Group
              onChange={onChangePassType}
              value={passType}
              style={{ marginTop: 5 }}
            >
              <Radio value="all">全部通过</Radio>
              <Radio value="rate">按比例通过</Radio>
            </Radio.Group>
          </div>
          <div>
            <InputNumber
              min={1}
              max={100}
              defaultValue={100}
              value={rate}
              onChange={onChangeRate}
              style={{ marginLeft: 86, width: 150 }}
              disabled={passType === "all"}
            />
            <span style={{ marginLeft: -68 }}>%</span>
          </div>
        </>
      )}
    </div>
  );
}
