import './global.less';
import React from 'react';
import ReactDom from 'react-dom';
import { ConfigProvider } from 'antd';
import Layout from './layout/layout';
import 'antd/dist/antd.variable.less';
import './font/font.less';
import { AuthProvider } from './providers/AuthProvider';

ReactDom.render(
  <ConfigProvider>
    <AuthProvider>
      <Layout />
    </AuthProvider>
  </ConfigProvider>,
  document.getElementById('root')
);
