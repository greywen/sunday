import { IUserToday } from '@interfaces/user';
import { Button, Col, Result, Row } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.less';

const ReportCard: React.FC<{ today?: IUserToday }> = ({ today }) => {
  const navigate = useNavigate();
  return (
    <Col xxl={8} lg={12} md={24} sm={24} xs={24}>
      <div
        className={styles.card}
        onClick={() => {
          navigate('/timesheet');
        }}
      >
        <div className={styles.cardContent}>
          <div className={styles.cardHeader}>
            <Row>日志</Row>
          </div>
          <Row justify='center' className={styles.cardBody}>
            {today?.timesheet?.value ? (
              <Result status='success' title='今日已成功提交日志!' />
            ) : (
              <Result
                title='今日还未提交日志!'
                extra={
                  <Button type='primary' key='console'>
                    现在就去
                  </Button>
                }
              />
            )}
            {/* <p>1. 今日还未提交TimeSheet</p>
          <p>2. 显示今日日志</p>
          <p>3. 显示提交进度</p> */}
          </Row>
        </div>
        <div className='card-footer'></div>
      </div>
    </Col>
  );
};
export default ReportCard;
