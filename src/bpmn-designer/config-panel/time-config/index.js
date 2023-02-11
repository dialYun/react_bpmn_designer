import React, { useState, useEffect } from "react";
import { Input, Select } from "antd";

const { Option } = Select;

/**
 * 边界时间属性设置
 */
export default function TimeConfig(props) {
  const { bpmnInstance } = props;
  const [type, setType] = useState(null);
  const [value, setValue] = useState(null);
  const [instance, setInstance] = useState(null);
  const { modeling, bpmnElement = {}, moddle } = bpmnInstance;

  // 读取已有配置
  useEffect(() => {
    if (
      bpmnElement.businessObject &&
      bpmnElement.businessObject.eventDefinitions &&
      bpmnElement.businessObject.eventDefinitions.length
    ) {
      const info = bpmnElement.businessObject.eventDefinitions[0];
      if (info.timeDate) {
        setType("timeDate");
        setValue(info.timeDate.body);
      } else if (info.timeDuration) {
        setType("timeDuration");
        setValue(info.timeDuration.body);
      } else if (info.timeCycle) {
        setType("timeCycle");
        setValue(info.timeCycle.body);
      }

      //创建实例
      setInstance(info);
    }
  }, [bpmnElement.businessObject]);

  // 更新实例
  function updateInstance(type, value) {
    const obj = moddle.create("bpmn:FormalExpression", {
      body: value,
    });
    modeling.updateModdleProperties(bpmnElement, instance, { [type]: obj });
  }

  //改变定时类型
  function onChangeType(type) {
    setType(type);
    updateInstance(type, value);
  }

  // 改变值
  function onChangeValue(e) {
    const value = e.target.value;
    setValue(value);
    updateInstance(type, value);
  }

  return (
    <div className="base-form">
      <div>
        <span>定时类型</span>
        <Select style={{ width: "100%" }} onChange={onChangeType} value={type}>
          <Option value="timeDate">Date(采用ISO-8601日期时间)</Option>
          <Option value="timeDuration">Duration(持续时间)</Option>
          <Option value="timeCycle">Cycle(时间周期)</Option>
        </Select>
      </div>
      <div>
        <span>值</span>
        <Input value={value} onChange={onChangeValue} />
      </div>
    </div>
  );
}
