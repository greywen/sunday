import './global.less';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import Layout from './layout/layout';
import 'antd/dist/antd.variable.less';
import './font/font.less';
import { AuthProvider } from './providers/AuthProvider';
import zhCN from 'antd/lib/locale/zh_CN';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ConfigProvider locale={zhCN}>
    <AuthProvider>
      <Layout />
    </AuthProvider>
  </ConfigProvider>
);
