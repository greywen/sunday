import { EllipsisOutlined } from "@ant-design/icons";
import { useAccount } from "@utils/utils";
import { Col, Row } from "antd";
import moment from "moment";
import React, { useState } from "react";

const UserCard = () => {
  const account = useAccount();
  const [welcomeText] = useState<string>(calcWelcomeText());
  function calcWelcomeText() {
    const hour = moment().hours();
    if (hour < 10) {
      return "早上好！";
    } else if (hour <= 11) {
      return "上午好！";
    } else if (hour <= 13) {
      return "中午好！";
    } else if (hour < 18) {
      return "下午好！";
    } else {
      return "晚上好！";
    }
  }

  function calcHiredDay() {
    return moment().diff(moment(account.hiredDate), "day");
  }

  return (
    <Col xxl={8} lg={12} md={24} sm={24} xs={24}>
      <div className="card card-sm">
        <div className="card-content">
          <div className="card-header">
            <Row justify="end">
              <EllipsisOutlined />
            </Row>
          </div>
          <div className="card-body">
            <div className="user-card">
              <div className="left">
                <div className="hello-text">
                  {account.username}，
                  <br />
                  {welcomeText}
                </div>
              </div>
              <div className="right">
                <div className="tiem-text">
                  {account.hiredDate > 0
                    ? `你已经来公司 ${calcHiredDay()} 天了！`
                    : "度过愉快的一天！"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card card-sm">
        <div className="card-content">
          <div className="card-header">
            <div className="row">
              <div className="col-7"></div>
              <div className="col-5"></div>
            </div>
          </div>
          <div className="row card-body">
            <div className="col-12"></div>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default UserCard;
