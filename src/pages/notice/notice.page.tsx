import {
  Button,
  DatePicker,
  message,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
} from 'antd';
import styles from './index.module.less';
import React, { useState } from 'react';
import NoticeForm from './noticeForm.component';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { delInform, getInform } from '@apis/notice';
import { INotice } from '@interfaces/notice';

const { RangePicker } = DatePicker;

const NoticePage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [informs, setInforms] = useState<INotice[]>([]);

  const [curInform, setCurInform] = useState<INotice | undefined>(undefined);

  useAsyncEffect(async () => {
    if (!modalVisible) {
      const informs = await getInform();
      setInforms(informs);
    }
  }, [modalVisible]);

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '权重',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: (res: string[]) => {
        return <span>{`${res[0]}~${res[1]}`}</span>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (res: INotice) => (
        <Space size='middle'>
          <a
            onClick={() => {
              setModalVisible(true);
              setCurInform(res);
            }}
          >
            修改
          </a>
          <Popconfirm
            title='确定删除嘛?'
            okText='Yes'
            cancelText='No'
            onConfirm={async () => {
              const result = await delInform(res.id);
              if (result) {
                message.success('删除成功');
              }
              setInforms(await getInform());
            }}
          >
            <a href='#' style={{ color: 'red' }}>
              删除
            </a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Row className={styles.page}>
      <Row>
        <h2>通知管理</h2>
      </Row>
      <div className={styles.container}>
        <Button
          className={styles.button}
          onClick={() => {
            setModalVisible(true);
            setCurInform(undefined);
          }}
          type="primary"
        >
          添加
        </Button>
        <Table rowKey={'id'} columns={columns} dataSource={informs} />
        <Modal
          title={curInform ? '修改通知' : '添加通知'}
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          destroyOnClose={true}
          footer={null}
          width={'80vw'}
        >
          <NoticeForm
            onclose={() => setModalVisible(false)}
            defaultValue={curInform}
          />
        </Modal>
      </div>
    </Row>
  );
};

export default NoticePage;
