import { getQuestionList } from '@apis/questionBank';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { IQuestion } from '@interfaces/code';
import React, { useState } from 'react';
import { Col, List, Row } from 'antd';
import { Link } from 'react-router-dom';
import { QuestionLevels } from '@constants/constants';
import styles from './index.module.less';

const QuestionListPage = () => {
  const [questionList, setQuestionList] = useState<IQuestion[]>([]);
  const [initLoading, setInitLoading] = useState(true);
  useAsyncEffect(async () => {
    const data = await getQuestionList();
    setQuestionList(data);
    setInitLoading(true);
  }, []);
  return (
    <div className={styles.questionDetailList}>
      <List
        bordered
        className='demo-loadmore-list'
        // loading={initLoading}
        itemLayout='horizontal'
        // loadMore={loadMore}
        dataSource={questionList}
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
          </Row>
        )}
      />
    </div>
  );
};
export default QuestionListPage;
