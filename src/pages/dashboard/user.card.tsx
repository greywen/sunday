import { EllipsisOutlined } from '@ant-design/icons';
import { useAccount } from '@utils/utils';
import { Col, Dropdown, Menu, Row } from 'antd';
import moment from 'moment';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import styles from './index.module.less';

const UserCard = () => {
  const account = useAccount();
  const [welcomeText] = useState<string>(calcWelcomeText());
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  function calcWelcomeText() {
    const hour = moment().hours();
    if (hour < 10) {
      return '早上好！';
    } else if (hour <= 11) {
      return '上午好！';
    } else if (hour <= 13) {
      return '中午好！';
    } else if (hour < 18) {
      return '下午好！';
    } else {
      return '晚上好！';
    }
  }

  function calcHiredDay() {
    return moment().diff(moment(account.hiredDate), 'day');
  }

  const menu = (
    <Menu
      items={[
        {
          key: 'signout',
          label: (
            <a
              target='_blank'
              onClick={() => {
                authContext.logout();
              }}
            >
              登 出
            </a>
          ),
        },
      ]}
    />
  );

  return (
    <Col xxl={8} lg={12} md={24} sm={24} xs={24}>
      <div className={`${styles.card} ${styles.cardSm}`}>
        <div className={styles.cardContent}>
          <div className={styles.cardHeader}>
            <Row justify='end'>
              <Dropdown overlay={menu} placement='bottom'>
                <EllipsisOutlined />
              </Dropdown>
            </Row>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.userCard}>
              <div className='left'>
                <div className={styles.helloText}>
                  {account.username}，
                  <br />
                  {welcomeText}
                </div>
              </div>
              <div className='right'>
                <div className={styles.tiemText}>
                  {account.hiredDate > 0
                    ? `你已经来公司 ${calcHiredDay()} 天了！`
                    : '度过愉快的一天！'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${styles.card} ${styles.cardSm}`}
        onClick={() => {
          navigate('jasads');
        }}
      >
        <div className={styles.cardContent}>
          <div className={styles.cardHeader}></div>
          <div className={styles.cardBody}></div>
        </div>
      </div>
    </Col>
  );
};

export default UserCard;
