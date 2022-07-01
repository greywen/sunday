import { ExclamationCircleOutlined } from "@ant-design/icons";
import { createPeport, getReportTemplateByName } from "@apis/report";
import BackHome from "../../business.components/backhome";
import useAsyncEffect from "@hooks/useAsyncEffect";
import { IGetReportTemplateResult } from "@interfaces/report";
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Space,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useState } from "react";
import styles from "./index.module.less";
import { useNavigate } from "react-router-dom";

const Report = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [reportTemplate, setReportTemplate] =
    useState<IGetReportTemplateResult>();

  useAsyncEffect(async () => {
    const result = await getReportTemplateByName();
    setReportTemplate(result);
  }, []);

  const onFinish = async (res: any) => {
    const result = await createPeport(res);
    if (result) {
      message.success("发送成功");
      navigate("/");
    } else {
      message.success("发送失败");
    }
  };

  const title = (
    <Row>
      1. 此功能是为方便用户快捷提交钉钉日志
      <br />
      2. 提交完成后请在钉钉再次检查是否提交成功
      <br />
      3. 如造成任何财产损失概不负责
    </Row>
  );

  const confirm = () => {
    Modal.confirm({
      title: "温馨提示",
      icon: <ExclamationCircleOutlined />,
      content: title,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        form.submit();
      },
    });
  };

  return (
    <Row className={styles.page}>
      <BackHome />
      <Row>
        <h2>钉钉-TIMESHEET</h2>
      </Row>
      <div className={styles.container}>
        {reportTemplate && (
          <Form
            form={form}
            initialValues={{ taskStatus: reportTemplate?.value }}
            onFinish={(res: any) => {
              onFinish(res);
            }}
            layout="vertical"
          >
            <Form.Item label="任务简述" name="taskDescription">
              <Input />
            </Form.Item>
            <Form.Item
              label="任务状态"
              name="taskStatus"
              rules={[{ required: true, message: "不能为空!" }]}
            >
              <TextArea rows={4} placeholder='请侧重"完成"或"完成百分比"' />
            </Form.Item>
            <Form.Item
              label="花费时间"
              name="taketime"
              rules={[{ required: true, message: "不能为空!" }]}
            >
              <InputNumber
                placeholder="请输入数字（小时）"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Space direction="vertical" size={"large"}>
              {reportTemplate?.default_receivers && (
                <div>
                  发送到人:&nbsp;&nbsp;
                  {reportTemplate?.default_receivers?.map((receiver) => {
                    return receiver.user_name;
                  })}
                </div>
              )}
              <div>发送到群:&nbsp;&nbsp;百宝门</div>
              <Form.Item>
                <Button type="primary" onClick={confirm}>
                  提交
                </Button>
              </Form.Item>
            </Space>
          </Form>
        )}
      </div>
    </Row>
  );
};

export default Report;
