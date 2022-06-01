import { getUserToday } from '@apis/user';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { IUserToday } from '@interfaces/user';
import { renderTheme, useTheme } from '@utils/utils';
import { Col, Row } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import React, { useState } from 'react';
import AttendanceCard from './attendance.card';
import styles from './index.module.less';
import NoticeCard from './notice.card';
import RankCard from './rank.card';
import ReportCard from './report.card';
import UserCard from './user.card';
const Dashboard = () => {
  const theme = useTheme();
  const [today, setToday] = useState<IUserToday>();
  const [lightVisible, setLightVisible] = useState(theme.get() === 'light');

  useAsyncEffect(async () => {
    const data = await getUserToday();
    setToday(data);
  }, []);

  const switchTheme = () => {
    if (lightVisible) {
      theme.set('dark');
    } else {
      theme.set('light');
    }
    setLightVisible(!lightVisible);
    renderTheme(!lightVisible);
  };
  return (
    <Content className={styles.dashboardPage}>
      <Row justify='end'>
        <Col>
          <div
            className={`iconfont ${
              lightVisible ? 'icon-DND_mode' : 'icon-brightness'
            }`}
            style={{ fontSize: '40px', paddingRight: '4px' }}
            onClick={() => switchTheme()}
          ></div>
        </Col>
      </Row>
      <Row>
        <UserCard />
        <ReportCard today={today} />
        <AttendanceCard today={today} />
        <RankCard />
        <NoticeCard />
      </Row>
      <Row justify='end'>
        <Col xxl={24} lg={24} md={24} sm={24} xs={24} style={{ padding: 12 }}>
          {`© ${new Date().getFullYear()} 猿媛乐园. All Rights Reserved.`}
        </Col>
      </Row>
    </Content>
  );
};
export default Dashboard;
