import { getUserToday } from "@apis/user";
import useAsyncEffect from "@hooks/useAsyncEffect";
import { IUserToday } from "@interfaces/user";
import { renderTheme, useTheme } from "@utils/utils";
import { Calendar, Col, DatePicker, Row } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useState } from "react";
import AttendanceCard from "./attendance.card";
import styles from "./index.module.less";
import NoticeCard from "./notice.card";
import RankCard from "./rank.card";
import ReportCard from "./report.card";
import UserCard from "./user.card";
import { CountUp } from "use-count-up";
import moment from "moment";

const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState("2022-02");

  return (
    <div className={styles.dashboardPage}>
      <div className={`${styles.userProfileArea}`}>
        <div className={styles.sideWrapper}>
          <div className={styles.userProfile}>
            <img
              src="https://img2.baidu.com/it/u=2514427884,2026247799&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500"
              className={styles.userPhoto}
            />
            <div className={styles.userName}>文旺 - 前端开发</div>
            <div className={styles.userAge}>0年3个月1天</div>
            <div className={styles.userMail}>gray.wen@outlook.com</div>
          </div>
        </div>
        <div className={styles.sideWrapper}>
          <div className={styles.sideTitle}>本月摸鱼</div>
          <div className={styles.progressStatus}>
            <span>第一名</span>
            <span>12/34</span>
          </div>
          <div className={styles.progress}>
            <div className={styles.progressBar}></div>
          </div>
        </div>
        <div className={styles.sideWrapper}>
          <div className={styles.sideTitle}>团队成员</div>
          <div className={styles.teamMember}>
            <img
              src="https://images.unsplash.com/flagged/photo-1574282893982-ff1675ba4900?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80"
              className={styles.members}
            />
            <img
              src="https://images.unsplash.com/flagged/photo-1574282893982-ff1675ba4900?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80"
              className={styles.members}
            />
            <img
              src="https://assets.codepen.io/3364143/Screen+Shot+2020-08-01+at+12.24.16.png"
              className={styles.members}
            />
            <img
              src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
              className={styles.members}
            />
            <img
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=998&q=80"
              className={styles.members}
            />
            <img
              src="https://images.unsplash.com/photo-1541647376583-8934aaf3448a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80"
              className={styles.members}
            />
          </div>
        </div>
      </div>
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardHeader}>
          <span>考勤</span>
          {/* <span>2022-07</span> */}
          <DatePicker
            picker="month"
            defaultValue={moment(currentDate)}
            allowClear={false}
            onChange={(date: any, dateString: string) => {
              setCurrentDate(dateString);
            }}
            suffixIcon={null}
          />
        </div>
        <div className={`${styles.attendStatus} ${styles.anim}`}>
          <div className={styles.attendStat}>
            <div className={styles.attendNumber}>
              <CountUp isCounting end={12} />
            </div>
            <div className={styles.attendCondition}>迟到时间(分钟)</div>
          </div>
          <div className={styles.attendStat}>
            <div className={styles.attendNumber}>
              <CountUp isCounting end={2} />
            </div>
            <div className={styles.attendCondition}>请假次数</div>
          </div>
          <div className={styles.attendStat}>
            <div className={styles.attendNumber}>
              <CountUp isCounting end={0} />
            </div>
            <div className={styles.attendCondition}>未填写钉钉日志</div>
          </div>
        </div>
        <div className={`${styles.calendar} ${styles.anim}`}>
          <Calendar
            value={moment(currentDate)}
            disabledDate={(current) => {
              const monthStart = moment(current._i).startOf("month");
              const monthEnd = moment(current._i).endOf("month");
              return monthStart > current || monthEnd < current;
            }}
            headerRender={() => {
              return null;
            }}
            // dateCellRender={dateCellRender}
            // monthCellRender={monthCellRender}
          />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
