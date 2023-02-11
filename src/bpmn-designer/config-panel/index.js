import React, { useState, useEffect, Fragment } from "react";
import { Collapse, Icon } from "antd";
import BaseConfig from "./base-config";
import ListenerConfig from "./listener-config";
import FormConfig from "./form-config";
import ButtonConfig from "./button-config";
import AuthorityConfig from "./authority-config";
import AssignConfig from "./assign-config";
import CountersignConfig from "./countersign-config";
import TimeConfig from "./time-config";
import ConditionConfig from "./condition-config";

const { Panel } = Collapse;

/**
 * 属性面板
 */
export default function ConfigPanel(props) {
  const { bpmnInstance } = props;
  const [type, setType] = useState("Process");
  const { bpmnElement = {} } = bpmnInstance;

  // 读取已有配置
  useEffect(() => {
    if (bpmnElement.businessObject) {
      setType(bpmnElement.businessObject.$type.slice(5));
    }
  }, [bpmnElement.businessObject]);
  const header = (title) => (
    <Fragment>
      {title}
      <Icon type="info-circle" style={{ marginLeft: 3 }} />
    </Fragment>
  );
  return (
    <aside className="config-panel">
      <Collapse
        accordion
        ordered={false}
        defaultActiveKey={["1"]}
        expandIconPosition="right"
      >
        <Panel header={header("基本设置")} key="1">
          <BaseConfig bpmnInstance={bpmnInstance} />
        </Panel>
        {["UserTask"].includes(type) && (
          <Panel header={header("审核者")} key="2">
            <AssignConfig bpmnInstance={bpmnInstance} />
          </Panel>
        )}
        {["StartEvent", "UserTask"].includes(type) && (
          <Panel header={header("表单设置")} key="3">
            <FormConfig bpmnInstance={bpmnInstance} />
          </Panel>
        )}
        {["UserTask"].includes(type) && (
          <Panel header={header("按钮配置")} key="4">
            <ButtonConfig bpmnInstance={bpmnInstance} />
          </Panel>
        )}
        {["IntermediateCatchEvent"].includes(type) && (
          <Panel header={header("边界时间属性设置")} key="5">
            <TimeConfig bpmnInstance={bpmnInstance} />
          </Panel>
        )}
        {["SequenceFlow"].includes(type) && (
          <Panel header={header("流转条件")} key="6">
            <ConditionConfig bpmnInstance={bpmnInstance} />
          </Panel>
        )}
        {[
          "StartEvent",
          "UserTask",
          "IntermediateThrowEvent",
          "EndEvent",
          "SubProcess",
          "Process",
          "IntermediateCatchEvent",
          "SequenceFlow",
        ].includes(type) && (
          <Panel header={header("执行监听器")} key="7">
            <ListenerConfig bpmnInstance={bpmnInstance} type="Execution" />
          </Panel>
        )}
        {["UserTask"].includes(type) && (
          <Panel header={header("任务监听器")} key="8">
            <ListenerConfig bpmnInstance={bpmnInstance} type="Task" />
          </Panel>
        )}
        {["UserTask"].includes(type) && (
          <Panel header={header("会签设置")} key="9">
            <CountersignConfig bpmnInstance={bpmnInstance} />
          </Panel>
        )}
        {["Process"].includes(type) && (
          <Panel header={header("权限设置")} key="10">
            <AuthorityConfig bpmnInstance={bpmnInstance} />
          </Panel>
        )}
      </Collapse>
    </aside>
  );
}
