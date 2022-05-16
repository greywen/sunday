import "./global.less";
import React from "react";
import ReactDom from "react-dom";
import { ConfigProvider } from "antd";
import Layout from "./layout/layout";
import "antd/dist/antd.css";
import "./font/font.less";
import { AuthProvider } from "./providers/AuthProvider";

ReactDom.render(
  <ConfigProvider>
    <AuthProvider>
      <Layout />
    </AuthProvider>

    {/* <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: "login-required",
      }}
    >
      <Layout />
    </ReactKeycloakProvider> */}
  </ConfigProvider>,
  document.getElementById("root")
);
