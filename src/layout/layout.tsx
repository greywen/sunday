import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { renderTheme, useTheme } from "@utils/utils";
import { Button } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { Suspense, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import "./index.less";
import styles from "./index.module.less";

const Attendance = React.lazy(() => import("@pages/attendance"));
const AttendanceReadonly = React.lazy(
  () => import("@pages/attendance/attendance-readonly")
);
const Dashboard = React.lazy(() => import("@pages/dashboard"));
const MoyuRank = React.lazy(() => import("@pages/moyuRank"));
const TimeSheet = React.lazy(() => import("@pages/timesheet"));
const Inform = React.lazy(() => import("@pages/inform"));

interface IMenu {
  name: string;
  key: string;
  path: string;
  element: React.ReactNode;
}

const menus: IMenu[] = [
  { name: "首页", key: "dashboard", path: "/", element: <Dashboard /> },
  {
    name: "Timesheet",
    key: "timesheet",
    path: "/timesheet",
    element: <TimeSheet />,
  },
  {
    name: "考勤管理",
    key: "attendance",
    path: "/attendance",
    element: <Attendance />,
  },
];

const Layout: React.FC = () => {
  const authContext = useContext(AuthContext);
  const pathname = location.pathname.replace("/", "");
  const [activeMenuKey, setActiveMenuKey] = useState(
    pathname ? pathname : "dashboard"
  );

  return (
    <>
      {authContext.isAuthenticated ? (
        <div className={styles.container}>
          <Router>
            <div className={styles.mainArea}>
              <div className={styles.header}>
                <div className={styles.menu}>
                  <div className={styles.menuLeft}>猿媛乐园</div>
                  <div className={styles.menuCenter}>
                    <ul className={styles.menuItems}>
                      {menus.map((x) => (
                        <Link
                          key={x.key}
                          className={styles.menuItem}
                          to={x.path}
                        >
                          <li
                            className={`${
                              x.key === activeMenuKey ? styles.menuActive : ""
                            }`}
                            onClick={() => setActiveMenuKey(x.key)}
                          >
                            {x.name}
                          </li>
                        </Link>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.menuRight}>
                    <Button>
                      <LogoutOutlined />
                    </Button>
                  </div>
                </div>
              </div>
              <div className={styles.mainContainer}>
                <Suspense fallback={<h3>Loading...</h3>}>
                  <Routes>
                    <Route key="dashboard" path="/" element={<Dashboard />} />
                    <Route
                      key="attendance"
                      path="/attendance"
                      element={<Attendance />}
                    />
                    <Route
                      key="attendances"
                      path="/attendances"
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
                    <Route key="inform" path="/inform" element={<Inform />} />
                  </Routes>
                </Suspense>
              </div>
            </div>
          </Router>
        </div>
      ) : (
        <h4>Loading...</h4>
      )}
    </>
  );
};

export default Layout;
