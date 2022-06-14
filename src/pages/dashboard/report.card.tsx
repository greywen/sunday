import { getReportFinished } from "@apis/report";
import { getUserToday } from "@apis/user";
import useAsyncEffect from "@hooks/useAsyncEffect";
import { IUserToday } from "@interfaces/user";
import { Button, Col, Result, Row, Space } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.less";

const ReportCard: React.FC<{ today?: IUserToday }> = ({ today }) => {
  const isSubmitLog = today?.timesheet?.value;
  const navigate = useNavigate();
  const [isFinishReport, setIsFinishReport] = useState<boolean>();

  useAsyncEffect(async () => {
    const data = await getReportFinished();
    setIsFinishReport(data);
  }, []);
  return (
    <Col xxl={8} lg={12} md={24} sm={24} xs={24}>
      <div className={styles.card}>
        <div className={styles.cardContent}>
          <div className={styles.cardHeader}>
            <Row>日志</Row>
          </div>
          <div className={styles.cardItem}>
            <Row
              className={`${styles.content} ${styles.first}`}
              justify="space-between"
              align="middle"
            >
              <Col
                style={isSubmitLog ? { textDecoration: "line-through" } : {}}
              >
                <div className={styles.contentText}>
                  {isSubmitLog ? "今日已成功提交TIMESHEET!" : "今日还未提交TIMESHEET!"}
                </div>
                <div className={styles.dateText}>
                  {moment().format("YYYY-MM-DD")}
                </div>
              </Col>
              <Col>
                <Button
                  className={styles.btn}
                  type="primary"
                  size="small"
                  onClick={() => {
                    navigate("/timesheet");
                  }}
                >
                  现在就去
                </Button>
              </Col>
            </Row>
          </div>
          <div className={styles.cardItem}>
            <Row
              className={`${styles.content} ${styles.second}`}
              justify="space-between"
              align="middle"
            >
              <Col
                style={isFinishReport ? { textDecoration: "line-through" } : {}}
              >
                <div className={styles.contentText}>
                  {isFinishReport
                    ? "今日已成功提交钉钉日志!"
                    : "今日还未提交钉钉日志!"}
                </div>
                <div className={styles.dateText}>
                  {moment().format("YYYY-MM-DD")}
                </div>
              </Col>
              <Col>
                <Button
                  className={styles.btn}
                  type="primary"
                  size="small"
                  onClick={() => {
                    navigate("/report");
                  }}
                >
                  现在就去
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Col>
  );
};
export default ReportCard;
