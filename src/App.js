import React from "react";
import BpmnDesigner from "./bpmn-designer";
import { getXmlData } from "./bpmn-designer/services";
import { Spin } from "antd";

class App extends React.Component {
  state = {
    data: "",
    spinning: true,
    type: "add",
  };
  componentDidMount() {
    if (this.state.type !== "add") {
      getXmlData().then((data) => {
        this.setState({ data, spinning: false });
      });
    } else {
      this.setState({ spinning: false, data: "" });
    }
  }

  render(h) {
    const { data, spinning, type } = this.state;
    return (
      <Spin spinning={spinning}>
        <div style={{ width: "100%", height: "92vh" }}>
          <BpmnDesigner xml={data} type={type} />
        </div>
      </Spin>
    );
  }
}

export default App;
