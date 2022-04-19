import "./global.less";
import React from "react";
import ReactDom from "react-dom";
import { ConfigProvider } from "antd";
import Layout from "./layout/layout";
import "antd/dist/antd.css";

window.currentIndex = 0;
window.interval = null;

ReactDom.render(
  <ConfigProvider>
    <Layout />
  </ConfigProvider>,
  document.getElementById("root")
);
