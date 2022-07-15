import React from 'react';
import AttendanceCalendar from './attendance.calendar';
import styles from './index.module.less';
import Profile from './profile';

const Dashboard = () => {
  return (
    <div className={styles.dashboardPage}>
      <Profile />
      <div className={styles.dashboardContainer}>
        <AttendanceCalendar />
      </div>
    </div>
  );
};
export default Dashboard;
