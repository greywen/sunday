import React from 'react';
import AttendanceCalendar from './attendanceCalendar.component';
import styles from './index.module.less';
import Profile from './profile.component';

const DashboardPage = () => {
  return (
    <div className={styles.dashboardPage}>
      <Profile />
      <div className={styles.dashboardContainer}>
        <AttendanceCalendar />
      </div>
    </div>
  );
};
export default DashboardPage;
