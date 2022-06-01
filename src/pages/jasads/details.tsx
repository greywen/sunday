import { LoadingOutlined } from '@ant-design/icons';
import { getProjectDetails } from '@apis/jasads';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { IJasadsSocketResult, IProjectModel } from '@interfaces/jasads';
// import { jasadsSocket } from '@utils/socket';
import { Card, Row, Steps } from 'antd';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { TaskStatus } from '../../constants';
import './index.less';
const { Step } = Steps;

interface IKeyTabs {
  key: string;
  tab: string;
}

const JasadsDetailsPage = () => {
  const [project, setProject] = useState<IProjectModel>();
  const [tabList, setTabList] = useState<IKeyTabs[]>();
  const { id } = useParams();
  const [task, setTask] = useState({
    status: TaskStatus.Queuing,
    logs: '',
  });
  useAsyncEffect(async () => {
    const _project = await getProjectDetails(id!);
    setProject(_project);
    setTabList(
      _project.environments?.map((x) => {
        return { key: x.envName, tab: x.envName };
      })
    );
    // jasadsSocket.on('receiveMessage', (data: IJasadsSocketResult) => {
    //   console.log(data);
    //   let _logs =
    //     data.pullLogs + data.compileLogs + data.packLogs + data.deployLogs;
    //   setTask({ status: data.status, logs: _logs.replaceAll('\n', '<br />') });
    // });
  }, []);

  return (
    <Row className='jasads-page'>
      <Row className='jasads-card'>
        <Card
          style={{ width: '100%' }}
          title={<h2>{project?.projectName}</h2>}
          extra={<a href='#'>编辑</a>}
          tabList={tabList}
          activeTabKey={tabList && tabList[0].key}
          // onTabChange={(key) => {
          //   onTab1Change(key);
          // }}
        >
          <div hidden={task.status === TaskStatus.Queuing}>
            <Steps>
              <Step
                status={
                  task.status === TaskStatus.Pulling
                    ? 'process'
                    : task.status === 402
                    ? 'error'
                    : [200, 203, 204, 205, 403, 404, 405].includes(task.status)
                    ? 'finish'
                    : 'wait'
                }
                icon={task.status === TaskStatus.Pulling && <LoadingOutlined />}
                title='拉取代码'
              />
              <Step
                status={
                  task.status === TaskStatus.Compiling
                    ? 'process'
                    : task.status === 403
                    ? 'error'
                    : [200, 204, 205, 404, 405].includes(task.status)
                    ? 'finish'
                    : 'wait'
                }
                title='编译'
                icon={
                  task.status === TaskStatus.Compiling && <LoadingOutlined />
                }
              />
              <Step
                status={
                  task.status === TaskStatus.Packing
                    ? 'process'
                    : task.status === 404
                    ? 'error'
                    : [200, 205, 405].includes(task.status)
                    ? 'finish'
                    : 'wait'
                }
                title='打包'
                icon={task.status === TaskStatus.Packing && <LoadingOutlined />}
              />
              <Step
                status={
                  task.status === TaskStatus.Deploying
                    ? 'process'
                    : task.status === 405
                    ? 'error'
                    : task.status === 200
                    ? 'finish'
                    : 'wait'
                }
                title='部署'
                icon={
                  task.status === TaskStatus.Deploying && <LoadingOutlined />
                }
              />
            </Steps>
          </div>
          <div dangerouslySetInnerHTML={{ __html: task.logs }}></div>
          {/* <Descriptions title='仓库配置'>
            <Descriptions.Item label='Git URL(HTTPS)'>value</Descriptions.Item>
            <Descriptions.Item label='访问令牌'>value</Descriptions.Item>
            <Descriptions.Item label='发布分支'>value</Descriptions.Item>
          </Descriptions>
          <Descriptions title='项目配置'>
            <Descriptions.Item label='项目目录'>value</Descriptions.Item>
            <Descriptions.Item label='服务器目录'>value</Descriptions.Item>
          </Descriptions>
          <Descriptions title='打包命令'>
            <Descriptions.Item label='命令行'>value</Descriptions.Item>
          </Descriptions>
          <Descriptions title='服务器配置'>
            <Descriptions.Item label='主机地址'>value</Descriptions.Item>
            <Descriptions.Item label='用户名'>value</Descriptions.Item>
            <Descriptions.Item label='登录密码'>value</Descriptions.Item>
            <Descriptions.Item label='端口号'>value</Descriptions.Item>
          </Descriptions>
          <Descriptions title='服务器命令配置'>
            <Descriptions.Item label='命令行'>value</Descriptions.Item>
          </Descriptions> */}
        </Card>
      </Row>
    </Row>
  );
};

export default JasadsDetailsPage;
