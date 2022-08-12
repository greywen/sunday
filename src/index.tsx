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

const EmptyComponent = () => {
  return <>没有找到相关数据</>;
};

root.render(
  <ConfigProvider
    renderEmpty={() => {
      return <EmptyComponent />;
    }}
    locale={zhCN}
  >
    <AuthProvider>
      <Layout />
    </AuthProvider>
  </ConfigProvider>
);
