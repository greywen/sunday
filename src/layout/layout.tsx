import { LogoutOutlined } from '@ant-design/icons';
import { useAccount } from '@utils/utils';
import { Button } from 'antd';
import React, { Suspense, useContext, useEffect, useState } from 'react';
import {
  Link,
  Route,
  Routes,
  BrowserRouter as Router,
  Navigate,
} from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import './index.less';
import styles from './index.module.less';

const Attendance = React.lazy(
  () => import('@pages/attendance/attendance.page')
);
const Dashboard = React.lazy(() => import('@pages/dashboard/dashboard.page'));
const MoyuRank = React.lazy(() => import('@pages/moyuRank/moyuRank.page'));
const TimeSheet = React.lazy(() => import('@pages/timesheet/timesheet.page'));
const QuestionDetail = React.lazy(
  () => import('@pages/question/questionDetail.page')
);
const QuestionList = React.lazy(
  () => import('@pages/question/questionList.page')
);
const CodeOnlinePage = React.lazy(
  () => import('@pages/codes/code.online.page')
);

interface IMenu {
  permission: string;
  key: string;
  name: string;
  path: string;
  element: React.ReactNode;
}
const dashboardMenuKey = 'dashboard';
let menuList: IMenu[] = [
  {
    permission: '1',
    key: dashboardMenuKey,
    name: '首页',
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    permission: '2',
    key: 'timesheet',
    name: 'Timesheet',
    path: '/timesheet',
    element: <TimeSheet />,
  },
  {
    permission: '3',
    key: 'attendance',
    name: '考勤管理',
    path: '/attendance',
    element: <Attendance />,
  },
  {
    permission: '4',
    key: 'question',
    name: '题库',
    path: '/question',
    element: <QuestionList />,
  },
  {
    permission: '5',
    key: 'code-online',
    name: '代码编辑器(BETA)',
    path: '/code',
    element: <CodeOnlinePage />,
  },
];

const Layout: React.FC = () => {
  const authContext = useContext(AuthContext);
  const account = useAccount();
  const [activeMenuId, setActiveMenuId] = useState(dashboardMenuKey);
  const [menus, setMenus] = useState<IMenu[]>([]);

  useEffect(() => {
    setMenus(
      menuList.filter((x) => {
        return account.resources.includes(x.permission);
      })
    );
    const currentMenu = menuList.find((x) => {
      return location.pathname.includes(x.path);
    });
    setActiveMenuId(currentMenu ? currentMenu.key : dashboardMenuKey);
  }, []);

  return (
    <Router>
      {authContext.isAuthenticated ? (
        <div className={styles.container}>
          <div className={styles.mainArea}>
            <div className={styles.header}>
              <div className={styles.menu}>
                <div className={styles.menuLeft}>猿媛乐园</div>
                <div className={styles.menuCenter}>
                  <ul className={styles.menuItems}>
                    {menus.map((x) => (
                      <Link
                        key={'menus-' + x.key}
                        className={styles.menuItem}
                        to={x.path}
                      >
                        <li
                          className={`${
                            x.key === activeMenuId ? styles.menuActive : ''
                          }`}
                          onClick={() => setActiveMenuId(x.key)}
                        >
                          {x.name}
                        </li>
                      </Link>
                    ))}
                  </ul>
                </div>
                <div className={styles.menuRight}>
                  <Button
                    onClick={() => {
                      authContext.logout();
                    }}
                  >
                    <LogoutOutlined />
                  </Button>
                </div>
              </div>
            </div>
            <div className={styles.mainContainer}>
              <Suspense fallback={<h4>正在拼命加载中...</h4>}>
                <Routes>
                  {menus.map((x) => (
                    <Route
                      key={'router-' + x.key}
                      path={x.path}
                      element={x.element}
                    />
                  ))}
                  <Route key='moyu' path='/moyu' element={<MoyuRank />} />
                  <Route
                    key='question'
                    path='/question/:questionId'
                    element={<QuestionDetail />}
                  />
                  <Route
                    key='notfound'
                    path='*'
                    element={<Navigate to='/dashboard' />}
                  />
                </Routes>
              </Suspense>
            </div>
          </div>
        </div>
      ) : (
        <h4>正在拼命加载中...</h4>
      )}
    </Router>
  );
};

export default Layout;
