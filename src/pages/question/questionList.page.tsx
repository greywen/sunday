import { getQuestionList } from '@apis/questionBank';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { IQuestion } from '@interfaces/code';
import React, { useState } from 'react';
import { Button, Col, List, Row } from 'antd';
import { Link } from 'react-router-dom';
import { QuestionLevels } from '@constants/constants';
import styles from './index.module.less';
import { PlusOutlined } from '@ant-design/icons';
import { checkPermission } from '@utils/utils';
import { Resources } from '@constants/resources';

const QuestionListPage = () => {
  const [questionList, setQuestionList] = useState<IQuestion[]>([]);
  useAsyncEffect(async () => {
    const data = await getQuestionList();
    setQuestionList(data);
  }, []);
  return (
    <div className={styles.questionDetailList}>
      <Row justify={'end'} style={{ padding: '24px 0' }}>
        <Col>
          {checkPermission(Resources.createQuestion) && (
            <Link to={`/question/operation`}>
              <Button icon={<PlusOutlined />}>添加题目</Button>
            </Link>
          )}
        </Col>
      </Row>
      <List
        bordered
        itemLayout='horizontal'
        dataSource={questionList}
        header={
          <>
            <Row>
              <Col span={6}>题目</Col>
              <Col span={4}>难度</Col>
              <Col span={10}></Col>
              <Col span={2}>是否通过</Col>
              {checkPermission(Resources.updateQuestion) && (
                <Col span={2}>操作</Col>
              )}
            </Row>
          </>
        }
        renderItem={(item, index) => (
          <Row className={styles.questionItem}>
            <Col span={6}>
              <Link to={`/question/${item.id}`}>
                {`${index + 1}. `}
                {item.name}
              </Link>
            </Col>
            <Col span={4} className={styles[`questionLevel-${item.level}`]}>
              {QuestionLevels[item.level]}
            </Col>
            <Col span={10}></Col>
            <Col span={2}>
              <div className={styles.notPass}>
                {item?.isPassed === false && '未通过'}
              </div>
              <div className={styles.passed}>{item?.isPassed && '已通过'}</div>
            </Col>
            {checkPermission(Resources.updateQuestion) && (
              <Col span={2}>
                <Link to={`/question/operation/${item.id}`}>编辑</Link>
              </Col>
            )}
          </Row>
        )}
      />
    </div>
  );
};
export default QuestionListPage;
