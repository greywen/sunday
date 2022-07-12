import { getUserAttendance } from '@apis/user';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { IUserAttendance } from '@interfaces/user';
import { Calendar, DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import React, { useState } from 'react';
import { CountUp } from 'use-count-up';
import { AttendanceState } from '../../constants';
import styles from './index.module.less';

interface IAttendanceStatistics {
  lateMinute: number;
  leaveCount: number;
  notCommitReportCount: number;
}

const AttendanceCalendar = () => {
  const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM'));
  const [userAttendances, setUserAttendances] = useState<Record<
    string,
    IUserAttendance[]
  > | null>(null);

  const [attendanceStatistics, setAttendanceStatistics] =
    useState<IAttendanceStatistics>({
      lateMinute: 0,
      leaveCount: 0,
      notCommitReportCount: 0,
    });

  useAsyncEffect(async () => {
    const data = await getUserAttendance(currentDate);
    const { calendarData, statistics } = prepareAttendanceData(data);
    setUserAttendances(calendarData);
    setAttendanceStatistics(statistics);
  }, [currentDate]);

  function prepareAttendanceData(data: IUserAttendance[][]) {
    const dataMap = {} as Record<string, IUserAttendance[]>;
    let statistics = {
      lateMinute: 0,
      leaveCount: 0,
      notCommitReportCount: 0,
    } as IAttendanceStatistics;
    data.map((x, i) => {
      const dataKey = moment(currentDate)
        .startOf('month')
        .add(i, 'days')
        .format('YYYY-MM-DD');
      x.sort((a, b) => {
        return b.state - a.state;
      });
      const states = x.map((item) => {
        if (
          item.state === AttendanceState.C ||
          item.state === AttendanceState.P ||
          item.state === AttendanceState.S ||
          item.state === AttendanceState.V
        ) {
          item.value = '请假 ' + item.value + ' 小时';
          statistics.leaveCount += 1;
        } else if (item.state === AttendanceState.J) {
          item.value = '加班 ' + item.value;
        } else if (item.state === AttendanceState.L) {
          item.value = '迟到 ' + item.value + ' 分钟';
          statistics.lateMinute += parseFloat(item.value);
        } else if (item.state === AttendanceState.X) {
          item.value = '未提交日志';
          statistics.notCommitReportCount += 1;
        }
        return item;
      });
      dataMap[dataKey] = states;
    });
    return { calendarData: dataMap, statistics: statistics };
  }

  return (
    <>
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
            <CountUp isCounting end={attendanceStatistics.lateMinute} />
          </div>
          <div className={styles.attendCondition}>迟到时间(分钟)</div>
        </div>
        <div className={styles.attendStat}>
          <div className={styles.attendNumber}>
            <CountUp isCounting end={attendanceStatistics.leaveCount} />
          </div>
          <div className={styles.attendCondition}>请假次数</div>
        </div>
        <div className={styles.attendStat}>
          <div className={styles.attendNumber}>
            <CountUp
              isCounting
              end={attendanceStatistics.notCommitReportCount}
            />
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
    </>
  );
};

export default AttendanceCalendar;
