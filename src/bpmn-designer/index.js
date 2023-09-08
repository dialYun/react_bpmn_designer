import React, { useState, useEffect } from "react";

// bpmn自带样式
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

// 国际化
import customTranslate from "./translate/customTranslate";
import translationsCN from "./translate/zh";

// 引入描述符文件
import flowableModdleDescriptor from "./flow.json";

import "./bpmn-designer.less";
import CustomModeler from "./custom-modeler";
import { initXml } from "./initXml";
import Header from "./header";
import ConfigPanel from "./config-panel";

export default function BpmnDesigner(props) {
  const { xml, type, modelId } = props;
  const [bpmnInstance, setBpmnInstance] = useState({});
  const translate = customTranslate(translationsCN);

  useEffect(() => {
    const bpmnModeler = new CustomModeler({
      container: "#flowCanvas",
      additionalModules: [
        { translate: ["value", translate] }, //国际化
      ],
      moddleExtensions: {
        flowable: flowableModdleDescriptor, //添加flowable前缀
      },
    });

    // 注册bpmn实例
    const instance = {
      modeler: bpmnModeler,
      modeling: bpmnModeler.get("modeling"),
      moddle: bpmnModeler.get("moddle"),
      eventBus: bpmnModeler.get("eventBus"),
      bpmnFactory: bpmnModeler.get("bpmnFactory"),
      elementRegistry: bpmnModeler.get("elementRegistry"),
      replace: bpmnModeler.get("replace"),
      selection: bpmnModeler.get("selection"),
    };
    setBpmnInstance(instance);
    getActiveElement(instance);
    if (type === "add") bpmnModeler.importXML(initXml);

    // 修改节点hover时的背景色
    const container = document.getElementsByClassName("djs-container")[0];
    container.style.setProperty(
      "--shape-drop-allowed-fill-color",
      "transparent"
    );
  }, []);

  // 加载xml
  useEffect(() => {
    if (bpmnInstance.modeler && type === "edit") {
      bpmnInstance.modeler.importXML(xml || initXml);
    }
  }, [xml]);

  // 设置选中元素
  function getActiveElement(instance) {
    const { modeler } = instance;
    // 初始第一个选中元素 bpmn:Process
    initFormOnChanged(null, instance);
    modeler.on("import.done", (e) => {
      initFormOnChanged(null, instance);
    });
    // 监听选择事件，修改当前激活的元素以及表单
    modeler.on("selection.changed", ({ newSelection }) => {
      initFormOnChanged(newSelection[0] || null, instance);
    });
  }
  // 初始化数据
  function initFormOnChanged(element, instance) {
    let activatedElement = element;
    const elementRegistry = instance.modeler.get("elementRegistry");
    if (!activatedElement) {
      activatedElement =
        elementRegistry.find((el) => el.type === "bpmn:Process") ||
        elementRegistry.find((el) => el.type === "bpmn:Collaboration");
    }
    if (!activatedElement) return;
    // console.log(`
    //           ----------
    //   select element changed:
    //             id:  ${activatedElement.id}
    //           type:  ${activatedElement.businessObject.$type}
    //           ----------
    //           `);
    console.log("businessObject: ", activatedElement.businessObject);
    setBpmnInstance({ bpmnElement: activatedElement, ...instance });
  }

  return (
    <div className="bpmn-designer">
      <div>
        <Header bpmnInstance={bpmnInstance} modelId={modelId}/>
        <div id="flowCanvas" className="flow-canvas"></div>
      </div>
      <ConfigPanel bpmnInstance={bpmnInstance} />
    </div>
  );
}
