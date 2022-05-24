import Attendance from "@pages/attendance";
import AttendanceReadonly from "@pages/attendance/attendance-readonly";
import Dashboard from "@pages/dashboard";
import MoyuRank from "@pages/moyuRank";
import TimeSheet from "@pages/timesheet";
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
