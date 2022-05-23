import "./index.less";
import React, { useEffect, useState } from "react";
import { Col, Row, Tooltip } from "antd";
import TextArea from "@components/textarea";
import moment from "moment";
import socket from "@utils/socket";
import useAsyncEffect from "@hooks/useAsyncEffect";
import { getTimeSheetData, updateTemplate } from "@apis/user";
import { ISheetTemplate, ITimeSheetData } from "@interfaces/timesheet";
import { GroupType } from "../../constants";
import { useLocation } from "react-router-dom";
import BackHome from "@components/backhome";

let globalMembers: ITimeSheetData[] = [];
let globalTemplate: ISheetTemplate = {};
let groups = [GroupType["back-end"], GroupType["frond-end"], GroupType.test];

const TimeSheet = () => {
  const [template, setTemplate] = useState<ISheetTemplate>();
  const [members, setMembers] = useState<ITimeSheetData[]>();
  const [enabledTemplate, setEnabledTemplate] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>();
  const location = useLocation();
  const [showAll] = useState<boolean>(location.pathname.includes("all"));

  useAsyncEffect(async () => {
    const timeSheetData = await getTimeSheetData();
    setTemplate(timeSheetData.template);
    globalMembers = timeSheetData.data;
    globalTemplate = timeSheetData.template;
    setMembers(timeSheetData.data);
    calcSummary(timeSheetData.data);

    socket.on("receiveMessage", (data: ITimeSheetData) => {
      const _members = globalMembers?.map((x) => {
        if (x.name === data.name) {
          x.userid = data.userid;
          x.value = data.value;
        }
        return x;
      });
      calcSummary(_members);
      setMembers(_members);
    });

    document.getElementsByTagName;
  }, []);

  useEffect(() => {
    if (template) {
      globalTemplate = template;
    }
  }, [template]);

  function prepareTicketRegExp(start: string, end = "###") {
    var reg = new RegExp(`(?=${start})[\\s\\S]*?((?=${end})|(?=$))`, "g");
    return reg;
  }
  function clearEmptyLine(searchValue: string, replaceValue = "") {
    return searchValue.replaceAll(/^\s*\n/gm, replaceValue);
  }

  function clearTickets(value: string, reg: RegExp) {
    const result = value.replaceAll(reg, "");
    return clearEmptyLine(result);
  }

  function getTickets(value: string, reg: RegExp) {
    const result = value.match(reg);
    return result;
  }

  function calcSummary(datas: ITimeSheetData[]) {
    let backend = "",
      frontend = "",
      test = "";

    datas.forEach((x) => {
      if (!x.value) return;
      if (x.groupid === 1) {
        backend += "\n" + x.value;
      } else if (x.groupid === 2) {
        frontend += "\n" + x.value;
      } else {
        test += "\n" + x.value;
      }
    });

    let backendTicketReg = prepareTicketRegExp("\\* HSENG-", "\n");
    let frontendTicketReg = prepareTicketRegExp("\\* SAENG-", "\n");

    let backendTickets = getTickets(backend, backendTicketReg);
    let backendOther = clearTickets(backend, backendTicketReg);

    let frontendTickets = getTickets(frontend, frontendTicketReg);
    let frontendOther = clearTickets(frontend, frontendTicketReg);
    const backendSummary = `${
      globalTemplate?.backend
    }\nDimSum:\n${backendOther}\nSupport:\n${backendTickets?.join("\n") || ""}`;
    const frontendSummary = `${
      globalTemplate?.frontend
    }\n${frontendOther}\nTickets:\n${frontendTickets?.join("\n") || ""}`;
    const testSummary = `${globalTemplate?.test}\n${test}`;

    setSummary(
      `#${moment().format(
        "YYYY-MM-DD"
      )}\n\n${backendSummary}\n\n${frontendSummary}\n\n${testSummary}`
    );
  }

  async function changeTimeSheet(userid: string, value?: string) {
    const _member = members?.map((x) => {
      if (x.userid === userid) {
        x.value = value;
      }
      return x;
    });
    setMembers(_member);
  }

  async function sendMessage(userid: string) {
    socket.emit(
      "sendMessage",
      members?.find((x) => x.userid === userid)
    );
  }

  async function updateTimeSheetTemplate() {
    await updateTemplate(template!);
    calcSummary(members!);
  }

  return (
    <div className="timesheet-page">
      <BackHome />
      <Row>
        <Col span={24} hidden={showAll}>
          <h2
            onDoubleClick={() => {
              setEnabledTemplate(true);
            }}
          >
            Time Sheet {`(${moment().format("YYYY-MM-DD")})`}
          </h2>
        </Col>
      </Row>
      <Row hidden={showAll}>
        <Col span={24} className="timesheet-card">
          <Row>
            {groups.map((type) => {
              return (
                <Col key={`key-type-${type}`} lg={8} md={24} xs={24}>
                  <Row>
                    {type === GroupType["back-end"] && (
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
                    )}

                    {type === GroupType["frond-end"] && (
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
                    )}

                    {type === GroupType["test"] && (
                      <Col span={24}>
                        <TextArea
                          onChange={async (value) => {
                            setTemplate({ ...template, test: value });
                          }}
                          onBlur={async () => {
                            await updateTimeSheetTemplate();
                          }}
                          disabled={!enabledTemplate}
                          value={template?.test}
                        ></TextArea>
                      </Col>
                    )}

                    <Col span={24}>
                      {members
                        ?.filter((x) => x.groupid === type)
                        ?.map((x) => {
                          return (
                            <Tooltip
                              key={`key-tooltip-${x.userid}`}
                              trigger="focus"
                              placement="topLeft"
                              title={x.name}
                            >
                              <div>
                                <TextArea
                                  onChange={(value) => {
                                    changeTimeSheet(x.userid, value);
                                    sendMessage(x.userid);
                                  }}
                                  value={x.value}
                                  key={x.userid}
                                  placeholder={x.name}
                                ></TextArea>
                              </div>
                            </Tooltip>
                          );
                        })}
                    </Col>
                  </Row>
                </Col>
              );
            })}
          </Row>
        </Col>
      </Row>
      {showAll && (
        <Row>
          <TextArea
            onChange={(value) => {
              setSummary(value);
            }}
            value={summary}
          ></TextArea>
        </Row>
      )}
    </div>
  );
};

export default TimeSheet;
