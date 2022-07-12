import { getUserAttendance, getUserToday } from '@apis/user';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { IUserAttendance, IUserToday } from '@interfaces/user';
import { renderTheme, useTheme } from '@utils/utils';
import { Calendar, Col, DatePicker, Row } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import React, { useState } from 'react';
import AttendanceCard from './attendance.card';
import styles from './index.module.less';
import NoticeCard from './notice.card';
import RankCard from './rank.card';
import ReportCard from './report.card';
import UserCard from './user.card';
import { CountUp } from 'use-count-up';
import moment, { Moment } from 'moment';
import Profile from './profile';

const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM'));
  const [userAttendances, setUserAttendances] = useState<Record<
    string,
    IUserAttendance[]
  > | null>(null);

  useAsyncEffect(async () => {
    const result = await getUserAttendance(currentDate);
    setUserAttendances(result);
  }, [currentDate]);

  return (
    <div className={styles.dashboardPage}>
      <Profile />
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardHeader}>
          <span>考勤</span>
          {/* <span>2022-07</span> */}
          <DatePicker
            inputReadOnly
            picker='month'
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
              const monthStart = moment(currentDate).startOf('month');
              const monthEnd = moment(currentDate).endOf('month');
              return monthStart > current || monthEnd < current;
            }}
            headerRender={() => {
              return null;
            }}
            dateCellRender={(value: Moment) => {
              const date = value.format('YYYY-MM-DD');
              return (
                <div>
                  {userAttendances &&
                    userAttendances[date] &&
                    userAttendances[date].map((item, index) => {
                      return (
                        <div
                          key={index}
                          className={`${styles[`state-${item.state}`]} ${
                            styles.item
                          }`}
                        >
                          {item.value}
                        </div>
                      );
                    })}
                </div>
              );
            }}
            // monthCellRender={monthCellRender}
          />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
