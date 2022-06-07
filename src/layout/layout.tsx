import { renderTheme, useTheme } from "@utils/utils";
import { Content } from "antd/lib/layout/layout";
import React, { Suspense, useContext } from "react";
import {
  Route,
  Routes,
  BrowserRouter as Router
} from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import "./index.less";

const Attendance = React.lazy(() => import('@pages/attendance'))
const AttendanceReadonly = React.lazy(() => import('@pages/attendance/attendance-readonly'))
const Dashboard = React.lazy(() => import('@pages/dashboard'))
const MoyuRank = React.lazy(() => import('@pages/moyuRank'))
const TimeSheet = React.lazy(() => import('@pages/timesheet'))
const Inform = React.lazy(() => import('@pages/inform'))


const Layout: React.FC = () => {
  const authContext = useContext(AuthContext);
  const theme = useTheme();
  renderTheme(theme.get() === 'light')

  return (
    <>
      {authContext.isAuthenticated ? (
        <Router>
          <Content className="container">
            <Suspense fallback={<h3>Loading...</h3>}>
              <Routes>
                <Route key="dashboard" path="/" element={<Dashboard />} />
                <Route
                  key="attendances"
                  path="/attendances"
                  element={<Attendance />}
                />
                <Route
                  key="attendance"
                  path="/attendance"
                  element={<AttendanceReadonly />}
                ></Route>
                <Route key="moyu" path="/moyu" element={<MoyuRank />} />
                <Route
                  key="timesheet"
                  path="/timesheet"
                  element={<TimeSheet />}
                />
                <Route
                  key="timesheet-all"
                  path="/timesheet/all"
                  element={<TimeSheet />}
                />
                <Route
                  key="inform"
                  path="/inform"
                  element={<Inform />}
                />
              </Routes>
            </Suspense>
          </Content>
        </Router>
      ) : (
        <h4>Loading...</h4>
      )}
    </>
  );
};

export default Layout;
