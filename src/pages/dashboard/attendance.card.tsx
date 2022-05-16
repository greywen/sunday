import { FrownOutlined, SmileOutlined } from "@ant-design/icons";
import { IUserToday } from "@interfaces/user";
import { Button, Col, Result, Row, Typography } from "antd";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
const { Text } = Typography;

const AttendanceCard: React.FC<{ today?: IUserToday }> = ({ today }) => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  return (
    <Col xxl={8} lg={12} md={24} sm={24} xs={24}>
      <div
        className="card"
        onClick={() => {
          const usernames = ["王中伟", "文旺", "周杰"];
          usernames.includes(authContext.userName)
            ? navigate("/attendances")
            : navigate("/attendance");
        }}
      >
        <div className="card-content">
          <div className="card-header">
            <div className="row">
              <div className="col-7">考勤</div>
              <div className="col-5"></div>
            </div>
          </div>
          <div className="row">
            <Row justify="center" className="card-body">
              {today && today?.attendance.tomorrowIsHoliday ? (
                <Result
                  icon={<SmileOutlined />}
                  title="Have a nice weekend!"
                  extra={<Button type="primary">查看考勤</Button>}
                />
              ) : (
                <Result
                  icon={
                    (!today || today) &&
                    !today?.attendance.late &&
                    !today?.attendance.notCommitReportCount ? (
                      <SmileOutlined />
                    ) : (
                      <FrownOutlined />
                    )
                  }
                  title={
                    <>
                      {today && today?.attendance.late > 0 && (
                        <>
                          本月迟到
                          <Text underline>{today?.attendance.late}</Text>
                          分钟，
                        </>
                      )}
                      {today && today?.attendance.notCommitReportCount > 0 && (
                        <>
                          <Text underline>
                            {today?.attendance.notCommitReportCount}
                          </Text>
                          次未提交日志
                        </>
                      )}
                      {(!today || today) &&
                        !today?.attendance.late &&
                        !today?.attendance.notCommitReportCount && (
                          <>本月考勤没有任何异常，太棒了！</>
                        )}
                    </>
                  }
                  extra={<Button type="primary">查看考勤</Button>}
                />
              )}
            </Row>
          </div>
        </div>
        <div className="card-footer"></div>
      </div>
    </Col>
  );
};

export default AttendanceCard;
