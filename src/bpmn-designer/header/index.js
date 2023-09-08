import React from "react";
import { Button, Tooltip, message } from "antd";
import { saveBpmnXml, saveBpmnXmlDraft } from "../services";
import { initXml } from "../initXml";
import { FileProtectOutlined, SaveOutlined,PlayCircleFilled, DownOutlined, UndoOutlined, RedoOutlined,DragOutlined,ZoomInOutlined,ZoomOutOutlined  } from "@ant-design/icons";

/**
 * 顶部操作栏
 */
export default function Header(props) {
  const { bpmnInstance } = props;
  const { modelId } = props;
  let fileInputRef = null;
  const { modeler } = bpmnInstance;

  // 根据所需类型进行转码并返回下载地址
  function setEncoded(type, filename = "diagram", data) {
    const encodedData = encodeURIComponent(data);
    return {
      filename: `${filename}.${type}`,
      href: `data:application/${
        type === "svg" ? "text/xml" : "bpmn20-xml"
      };charset=UTF-8,${encodedData}`,
      data: data,
    };
  }

  // 下载流程文件
  async function downloadFile(type, name) {
    try {
      // 按需要类型创建文件并下载
      if (type === "xml" || type === "bpmn") {
        const { err, xml } = await modeler.saveXML({ format: true });
        // 读取异常时抛出异常
        if (err) {
          console.error(`[Process Designer Warn ]: ${err.message || err}`);
        }
        let { href, filename } = setEncoded("bpmn", name, xml);
        downloadFunc(href, filename);
      } else {
        const { err, svg } = await modeler.saveSVG();
        // 读取异常时抛出异常
        if (err) {
          return console.error(err);
        }
        let { href, filename } = setEncoded("SVG", name, svg);
        downloadFunc(href, filename);
      }
    } catch (e) {
      console.error(`[Process Designer Warn ]: ${e.message || e}`);
    }
    // 文件下载方法
    function downloadFunc(href, filename) {
      if (href && filename) {
        let a = document.createElement("a");
        a.download = filename; //指定下载的文件名
        a.href = href; //  URL对象
        a.click(); // 模拟点击
        URL.revokeObjectURL(a.href); // 释放URL 对象
      }
    }
  }

  //加载本地文件
  function importLocalFile() {
    const file = fileInputRef.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
      let xmlStr = this.result;
      createNewDiagram(xmlStr);
      window.fromLocalFile = true;
      window.hasChangeName = false
    };
  }

  // 创建流程图
  async function createNewDiagram(xmlString) {
    try {
      let { warnings } = await modeler.importXML(xmlString);
      // if (warnings && warnings.length) {
      // warnings.forEach((warn) => console.warn(warn));
      // }
    } catch (e) {
      console.error(`[Process Designer Warn]: ${e.message || e}`);
    }
  }

 // 保存并发布
 async function save(deployFn) {
  const { xml } = await modeler.saveXML({ format: true });
  saveBpmnXml( xml, modelId, modeler, deployFn, "默认" ).then(() => message.success("操作成功"));
}


  const btnGroup = [
    {
      icon: <SaveOutlined />,
      title: "保存并发布",
      onClick: () => save(true),
    },
    {
      icon: <SaveOutlined />,
      title: "保存草稿",
      onClick: () => save(false),
    },
  ];
  const iconBtnGroup = [
    {
      type: "primary",
      icon: <FileProtectOutlined />,
      title: "打开流程文件",
      onClick: () => fileInputRef && fileInputRef.click(),
    },
    {
      type: "primary",
      icon: <PlayCircleFilled/>,
      title: "创建新的流程图",
      onClick: () => {
        window.hasChangeName = false
        modeler.importXML(initXml)
      },
    },
    {
      type: "primary",
      icon: <DownOutlined />,
      title: "下载流程图",
      onClick: () => downloadFile("svg"),
    },
    {
      type: "primary",
      icon: <DownOutlined />,
      title: "下载流程文件",
      onClick: () => downloadFile("bpmn"),
    },
    {
      icon: <UndoOutlined />,
      title: "撤销",
      onClick: () => modeler.get("commandStack").undo(),
    },
    {
      icon: <RedoOutlined />,
      title: "恢复",
      onClick: () => modeler.get("commandStack").redo(),
    },
    {
      icon: <ZoomInOutlined />,
      title: "放大",
      onClick: () => modeler.get("zoomScroll").stepZoom(1),
    },
    {
      icon: <ZoomOutOutlined />,
      title: "缩小",
      onClick: () => modeler.get("zoomScroll").stepZoom(-1),
    },
    {
      icon: <DragOutlined />,
      title: "重置",
      onClick: () => modeler.get("canvas").zoom("fit-viewport", "auto"),
    },
  ];
  return (
    <header className="header">
      <Button.Group>
        {btnGroup.map((item, index) => (
          <Tooltip
            placement="bottom"
            title={item.title}
            key={index}
            overlayStyle={{ fontSize: 12 }}
          >
            <Button type="primary" {...item}>
              {item.title}
            </Button>
          </Tooltip>
        ))}
        {iconBtnGroup.map((item, index) => (
          <Tooltip
            placement="bottom"
            title={item.title}
            key={index}
            overlayStyle={{ fontSize: 12 }}
          >
            <Button {...item} style={{ width: 44 }}></Button>
          </Tooltip>
        ))}
      </Button.Group>
      <input
        type="file"
        ref={(ref) => (fileInputRef = ref)}
        style={{ display: "none" }}
        accept=".xml, .bpmn"
        onChange={importLocalFile}
      />
    </header>
  );
}
