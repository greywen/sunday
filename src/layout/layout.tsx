import Attendance from "@pages/attendance";
import AttendanceForShow from "@pages/attendance-for-show";
import CleanOffice from "@pages/clean-office";
import Rank from "@pages/moyu";
import MoyuRank from "@pages/moyuRank";
import TimeSheet from "@pages/timesheet";
import React, { Suspense } from "react";
import {
  Route,
  Routes,
  BrowserRouter as Router,
  useNavigate,
} from "react-router-dom";
import "./index.less";

interface IRouters {
  path: string;
  element: JSX.Element;
}

const Layout = () => {
  return (
    <Router>
      <div className="container">
        <Suspense fallback={<h3>Loading...</h3>}>
          <Routers />
        </Suspense>
      </div>
    </Router>
  );
};

const Routers = () => {
  const routers: IRouters[] = [
    { path: "/", element: <AttendanceForShow /> },
    { path: "/attendance", element: <Attendance /> },
    { path: "/clean", element: <CleanOffice /> },
    { path: "/moyu", element: <Rank /> },
    { path: "/moyu2", element: <MoyuRank /> },
    { path: "/timesheet", element: <TimeSheet /> },
  ];

  // const navigate = useNavigate();

  // clearInterval(window.interval);
  // window.interval = setInterval(() => {
  //   if (window.currentIndex === routers.length - 1) {
  //     window.currentIndex = 0;
  //   } else {
  //     ++window.currentIndex;
  //   }
  //   console.log(window.currentIndex);
  //   navigate(routers[window.currentIndex].path);
  // }, 3000);

  return (
    <Routes>
      {routers.map((x) => (
        <Route key={x.path} path={x.path} element={x.element} />
      ))}
    </Routes>
  );
};

export default Layout;
