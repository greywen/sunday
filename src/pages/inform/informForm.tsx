import { addInform, modifyInform } from '@apis/inform';
import MyEditor from '../../business.components/myEditor';
import { IInfrom } from '@interfaces/inform';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Space,
} from 'antd';
import moment from 'moment';
import React, { useState } from 'react';

const { RangePicker } = DatePicker;

interface IProps {
  onclose: () => void;
  defaultValue?: IInfrom;
}

const InformForm = (props: IProps) => {
  const { onclose, defaultValue } = props;
  const [html, setHtml] = useState(defaultValue?.content);

  const onFinish = async (res: any) => {
    res.content = html;
    res.date[0] = res.date[0].format('YYYY-MM-DD');
    res.date[1] = res.date[1].format('YYYY-MM-DD');
    if (defaultValue) {
      res.id = defaultValue.id;
      const result = await modifyInform(res);
      if (result) {
        message.success('修改成功');
      }
    } else {
      const result = await addInform(res);
      if (result) {
        message.success('添加成功');
      }
    }
    onclose();
  };

  return (
    <Form
      onFinish={(res) => {
        onFinish(res);
      }}
      initialValues={
        defaultValue && {
          ...defaultValue,
          date: [
            moment(defaultValue?.date[0], 'YYYY-MM-DD'),
            moment(defaultValue?.date[1], 'YYYY-MM-DD'),
          ],
        }
      }
    >
      <Form.Item
        label='标题'
        name='title'
        rules={[{ required: true, message: '请输入标题!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label='权重'
        name='weight'
        rules={[{ required: true, message: '请输入权重!' }]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        label='日期'
        name='date'
        rules={[{ required: true, message: '请输入日期!' }]}
      >
        <RangePicker />
      </Form.Item>
      <MyEditor
        html={html || ''}
        onchange={(res) => {
          setHtml(res);
        }}
      />
      <Row justify='end' style={{ marginTop: 16 }}>
        <Button type='primary' htmlType='submit'>
          确定
        </Button>
      </Row>
    </Form>
  );
};
export default InformForm;
