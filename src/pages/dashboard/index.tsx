import { getUserToday } from "@apis/user";
import useAsyncEffect from "@hooks/useAsyncEffect";
import { IUserToday } from "@interfaces/user";
import { Col, Row } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useState } from "react";
import AttendanceCard from "./attendance.card";
import "./index.less";
import NoticeCard from "./notice.card";
import RankCard from "./rank.card";
import ReportCard from "./report.card";
import UserCard from "./user.card";
const Dashboard = () => {
  const [today, setToday] = useState<IUserToday>();

  useAsyncEffect(async () => {
    const data = await getUserToday();
    setToday(data);
  }, []);

  return (
    <Content className="dashboard-page">
      {/* <Row justify="end">
        <Col>
          <SettingFilled
            style={{ fontSize: 24, paddingRight: 14, color: "#333" }}
          />
        </Col>
      </Row> */}
      <Row>
        <UserCard />
        <ReportCard today={today} />
        <AttendanceCard today={today} />
        <RankCard />
        <NoticeCard />
      </Row>
      <Row justify="end">
        <Col xxl={24} lg={24} md={24} sm={24} xs={24} style={{ padding: 12 }}>
          {`© ${new Date().getFullYear()} 猿媛乐园. All Rights Reserved.`}
        </Col>
      </Row>
    </Content>
  );
};
export default Dashboard;
