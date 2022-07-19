import { LogoutOutlined } from '@ant-design/icons';
import { useAccount } from '@utils/utils';
import { Button } from 'antd';
import React, { Suspense, useContext, useEffect, useState } from 'react';
import { Link, Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import './index.less';
import styles from './index.module.less';

const Attendance = React.lazy(() => import('@pages/attendance'));
const Dashboard = React.lazy(() => import('@pages/dashboard'));
const MoyuRank = React.lazy(() => import('@pages/moyuRank'));
const TimeSheet = React.lazy(() => import('@pages/timesheet'));

interface IMenu {
  key: string;
  name: string;
  path: string;
  element: React.ReactNode;
}
const dashboardMenuKey = '1';
let menuList: IMenu[] = [
  { key: dashboardMenuKey, name: '首页', path: '/', element: <Dashboard /> },
  {
    key: '2',
    name: 'Timesheet',
    path: '/timesheet',
    element: <TimeSheet />,
  },
  {
    key: '3',
    name: '考勤管理',
    path: '/attendance',
    element: <Attendance />,
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
        return account.resources.includes(x.key);
      })
    );
    const currentMenu = menuList.find((x) => x.path === location.pathname);
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
              <Suspense fallback={<h3>Loading...</h3>}>
                <Routes>
                  {menus.map((x) => (
                    <Route
                      key={'router-' + x.key}
                      path={x.path}
                      element={x.element}
                    />
                  ))}
                  <Route key='moyu' path='/moyu' element={<MoyuRank />} />
                  {/* <Route
                    key='notfound'
                    path='*'
                    element={<Navigate to='/' />}
                  /> */}
                </Routes>
              </Suspense>
            </div>
          </div>
        </div>
      ) : (
        <h4>Loading...</h4>
      )}
    </Router>
  );
};

export default Layout;
