import "./index.less";
import React, { useState } from "react";
import { Col, Row, Select } from "antd";
import TextArea from "@components/textarea";
import moment from "moment";
import socket from "@utils/socket";
import useAsyncEffect from "@hooks/useAsyncEffect";
import { getTimeSheetData, updateTemplate } from "@apis/user";
import { ISheetTemplate, ITimeSheetData } from "@interfaces/timesheet";
const { Option } = Select;

socket.on("connect", function () {});
let globalMembers: ITimeSheetData[] = [];
const TimeSheet = () => {
  const [template, setTemplate] = useState<ISheetTemplate>();
  const [members, setMembers] = useState<ITimeSheetData[]>();
  const [enabledTemplate, setEnabledTemplate] = useState<boolean>(false);

  useAsyncEffect(async () => {
    const timeSheetData = await getTimeSheetData();
    setTemplate(timeSheetData.template);
    globalMembers = timeSheetData.data;
    setMembers(timeSheetData.data);

    socket.on("receiveMessage", (data: ITimeSheetData) => {
      console.log("receiveMessage", data);
      const _members = globalMembers?.map((x) => {
        if (x.name === data.name) {
          x.value = data.value;
        }
        return x;
      });
      setMembers(_members);
    });

    document.getElementsByTagName;
  }, []);

  async function changeTimeSheet(name: string, value?: string) {
    const _member = members?.map((x) => {
      if (x.name === name) {
        x.value = value;
      }
      return x;
    });
    setMembers(_member);
  }

  async function sendMessage(name: string) {
    socket.emit(
      "sendMessage",
      members?.find((x) => x.name === name)
    );
  }

  async function updateTimeSheetTemplate() {
    await updateTemplate(template!);
  }
  return (
    <div className="timesheet-page">
      <Row gutter={16}>
        <Col span={20}>
          <h1
            onDoubleClick={() => {
              setEnabledTemplate(true);
            }}
          >
            Time Sheet {`(${moment().format("YYYY-MM-DD")})`}
          </h1>
        </Col>
        <Col span={4}>
          {/* <Select
            defaultValue="lucy"
            style={{ width: 120 }}
            onChange={handleChange}
          >
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="disabled" disabled>
              Disabled
            </Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select> */}
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Row>
            {/* <Col className="timesheet-bar" lg={2} md={0} xs={0}>
              <div className="items">
                {members?.map((x) => {
                  return (
                    <div className="item">
                      <div
                        className={`${x.value ? "success-dot" : "default-dot"}`}
                      ></div>
                      {x.name}
                    </div>
                  );
                })}
              </div>
            </Col> */}
            <Col className="timesheet-box" lg={8} md={24} xs={24}>
              <Row>
                <Col span={24}>
                  <TextArea
                    onChange={async (value) => {
                      setTemplate({ ...template, backend: value });
                    }}
                    onBlur={async () => {
                      await updateTimeSheetTemplate();
                    }}
                    disabled={!enabledTemplate}
                    value={template?.backend}
                  ></TextArea>
                </Col>
                <Col span={24}>
                  {members
                    ?.filter((x) => x.groupid === 1)
                    ?.map((x) => {
                      return (
                        <TextArea
                          onChange={(value) => {
                            changeTimeSheet(x.name, value);
                            sendMessage(x.name);
                          }}
                          value={x.value}
                          key={x.name}
                          placeholder={x.name}
                        ></TextArea>
                      );
                    })}
                </Col>
              </Row>
            </Col>
            <Col className="timesheet-box" lg={8} md={24} xs={24}>
              <Row>
                <Col span={24}>
                  <TextArea
                    onChange={async (value) => {
                      setTemplate({ ...template, frontend: value });
                    }}
                    onBlur={async () => {
                      await updateTimeSheetTemplate();
                    }}
                    disabled={!enabledTemplate}
                    value={template?.frontend}
                  ></TextArea>
                </Col>
                <Col span={24}>
                  {members
                    ?.filter((x) => x.groupid === 2)
                    ?.map((x) => {
                      return (
                        <TextArea
                          onChange={(value) => {
                            changeTimeSheet(x.name, value);
                            sendMessage(x.name);
                          }}
                          value={x.value}
                          key={x.name}
                          placeholder={x.name}
                        ></TextArea>
                      );
                    })}
                </Col>
              </Row>
            </Col>
            <Col className="timesheet-box" lg={8} md={24} xs={24}>
              <Row>
                <Col span={24}>
                  <TextArea
                    onChange={(value) => {
                      setTemplate({ ...template, test: value });
                    }}
                    onBlur={async () => {
                      await updateTimeSheetTemplate();
                    }}
                    disabled={!enabledTemplate}
                    value={template?.test}
                  ></TextArea>
                </Col>
                <Col span={24}>
                  {members
                    ?.filter((x) => x.groupid === 3)
                    ?.map((x) => {
                      return (
                        <TextArea
                          onChange={(value) => {
                            changeTimeSheet(x.name, value);
                            sendMessage(x.name);
                          }}
                          value={x.value}
                          key={x.name}
                          placeholder={x.name}
                        ></TextArea>
                      );
                    })}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        {/* <Col span={24}>
          <Row justify="center" className="timesheet-input-container">
            <Col span={12}>
              <TextArea
                className="timesheet-input"
                placeholder="Please enter the content."
              />
            </Col>
          </Row>
        </Col> */}
      </Row>
    </div>
  );
};

export default TimeSheet;
