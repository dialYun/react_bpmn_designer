import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import zhCN from "antd/es/locale/zh_CN";
import { ConfigProvider } from "antd";

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>,
  document.getElementById("root")
);
