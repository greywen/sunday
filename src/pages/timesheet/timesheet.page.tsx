import styles from './index.module.less';
import React, { useEffect, useState } from 'react';
import { Col, DatePicker, Row, Tooltip } from 'antd';
import TextArea from '../../components/textarea';
import moment from 'moment';
import { socket } from '@utils/socket';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { getTimeSheetData, updateTemplate } from '@apis/user';
import { ISheetTemplate, ITimeSheetData } from '@interfaces/timesheet';
import { GroupType } from '../../constants/constants';
import { useLocation } from 'react-router-dom';
import { RangePickerProps } from 'antd/lib/date-picker';

let globalMembers: ITimeSheetData[] = [];
let globalTemplate: ISheetTemplate = {};
let groups = [
  GroupType['back-end'],
  GroupType['frond-end'],
  GroupType.nodejs,
  GroupType.test,
];
let enabledMembers = false;

const TimeSheetPage = () => {
  const [template, setTemplate] = useState<ISheetTemplate>();
  const [members, setMembers] = useState<ITimeSheetData[]>();
  const [enabledTemplate, setEnabledTemplate] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>();
  const location = useLocation();
  const [showAll, setShowAll] = useState<boolean>(false);
  const today = moment().format('YYYY-MM-DD');

  useAsyncEffect(async () => {
    const timeSheetData = await getTimeSheetData(today);
    setTemplate(timeSheetData.template);
    globalMembers = timeSheetData.data;
    globalTemplate = timeSheetData.template;
    setMembers(timeSheetData.data);
    calcSummary(timeSheetData.data);

    socket.on('receiveMessage', (data: ITimeSheetData) => {
      if (enabledMembers) return;
      const _members = globalMembers?.map((x) => {
        if (x.name === data.name) {
          x.userid = data.userid;
          x.value = data.value;
          x.createTime = data.createTime;
          x.updateTime = data.updateTime;
        }
        return x;
      });
      calcSummary(_members);
      setMembers(_members);
    });

    document.getElementsByTagName;
    return () => {
      enabledMembers = false;
    };
  }, []);

  useEffect(() => {
    if (template) {
      globalTemplate = template;
    }
  }, [template]);

  function prepareTicketRegExp(start: string, end = '###') {
    var reg = new RegExp(`(?=${start})[\\s\\S]*?((?=${end})|(?=$))`, 'g');
    return reg;
  }
  function clearEmptyLine(searchValue: string, replaceValue = '') {
    return searchValue.replaceAll(/^\s*\n/gm, replaceValue);
  }

  function clearTickets(value: string, reg: RegExp) {
    const result = value.replaceAll(reg, '');
    return clearEmptyLine(result);
  }

  function getTickets(value: string, reg: RegExp) {
    const result = value.match(reg);
    return result;
  }

  function addLineFeedSymbol(value: string) {
    if (value) {
      return `\n${value}`;
    }
    return '';
  }

  function calcSummary(datas: ITimeSheetData[]) {
    let backend = '',
      frontend = '',
      test = '',
      nodejs = '';

    datas.forEach((x) => {
      if (!x.value) return;
      if (x.groupid === 1) {
        backend += '\n' + x.value;
      } else if (x.groupid === 2) {
        frontend += '\n' + x.value;
      } else if (x.groupid === 3) {
        test += '\n' + x.value;
      } else {
        nodejs += '\n' + x.value;
      }
    });

    let backendTicketReg = prepareTicketRegExp('\\* HSENG-', '\n');
    let frontendTicketReg = prepareTicketRegExp('\\* SAENG-', '\n');

    let backendTickets = getTickets(backend, backendTicketReg);
    let backendOther = clearTickets(backend, backendTicketReg);

    let frontendTickets = getTickets(frontend, frontendTicketReg);
    let frontendOther = clearTickets(frontend, frontendTicketReg);

    let nodejsTickets = getTickets(nodejs, frontendTicketReg);
    let nodejsOther = clearTickets(nodejs, frontendTicketReg);

    const backendSummary = `${globalTemplate?.backend}${addLineFeedSymbol(
      backendOther
    )}\nTickets:\n${backendTickets?.join('\n') || ''}`;

    const frontendSummary = `${globalTemplate?.frontend}${addLineFeedSymbol(
      frontendOther
    )}\nTickets:\n${frontendTickets?.join('\n') || ''}`;

    const nodejsSummary = `${globalTemplate?.nodejs}${addLineFeedSymbol(
      nodejsOther
    )}\nTickets:\n${nodejsTickets?.join('\n') || ''}`;

    const testSummary = `${globalTemplate?.test}\n${test}`;

    setSummary(
      `#${moment().format(
        'YYYY-MM-DD'
      )}\n\n${backendSummary}\n\n${frontendSummary}\n\n${nodejsSummary}\n\n${testSummary}`
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
      'sendMessage',
      members?.find((x) => x.userid === userid)
    );
  }

  async function updateTimeSheetTemplate() {
    await updateTemplate(template!);
    calcSummary(members!);
  }

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return (
      current > moment().endOf('day') || current < moment().add(-7, 'days')
    );
  };

  const switchDate = async (dateString: string) => {
    if (dateString === today) {
      enabledMembers = false;
    } else {
      enabledMembers = true;
    }
    const timeSheetData = await getTimeSheetData(dateString);
    setMembers(timeSheetData.data);
  };

  return (
    <div className={styles.timesheetPage}>
      <Row className={styles.timesheetHeader} align='middle'>
        <Col span={20}>
          <h2
            hidden={showAll}
            onDoubleClick={() => {
              setEnabledTemplate(true);
            }}
          >
            Time Sheet -
            <DatePicker
              inputReadOnly
              disabledDate={disabledDate}
              defaultValue={moment()}
              allowClear={false}
              onChange={(date: any, dateString: string) => {
                switchDate(dateString);
              }}
              suffixIcon={null}
            />
          </h2>
        </Col>
        <Col span={4} className={styles.timesheetActions}>
          {showAll ? (
            <div className='link' onClick={() => setShowAll(false)}>
              返回
            </div>
          ) : (
            <div className='link' onClick={() => setShowAll(true)}>
              查看全部
            </div>
          )}
        </Col>
      </Row>
      <Row hidden={showAll}>
        <Col span={24} className={styles.timesheetCard}>
          <Row>
            {groups.map((type) => {
              return (
                <Col key={`key-type-${type}`} lg={6} md={24} xs={24}>
                  <Row>
                    {type === GroupType['back-end'] && (
                      <Col span={24}>
                        <TextArea
                          noBorder={true}
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

                    {type === GroupType['frond-end'] && (
                      <Col span={24}>
                        <TextArea
                          noBorder={true}
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

                    {type === GroupType['nodejs'] && (
                      <Col span={24}>
                        <TextArea
                          noBorder={true}
                          onChange={async (value) => {
                            setTemplate({ ...template, nodejs: value });
                          }}
                          onBlur={async () => {
                            await updateTimeSheetTemplate();
                          }}
                          disabled={!enabledTemplate}
                          value={template?.nodejs}
                        ></TextArea>
                      </Col>
                    )}

                    {type === GroupType['test'] && (
                      <Col span={24}>
                        <TextArea
                          noBorder={true}
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
                              style={{ maxWidth: '393px' }}
                              key={`key-tooltip-${x.userid}`}
                              trigger='focus'
                              placement='topLeft'
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
                                  disabled={enabledMembers}
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
          <Col span={24}>
            <TextArea
              onChange={(value) => {
                setSummary(value);
              }}
              value={summary}
            />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default TimeSheetPage;
