import { TaskStatus } from '../constants';

export interface IProjectBaseModel {
  projectName: string;
  environments?: IProjectEnvironmentModel[];
}

export interface IProjectModel extends IProjectBaseModel {
  id: string;
}
export interface IProjectCreateModel extends IProjectBaseModel {}
export interface IProjectUpdateModel extends IProjectBaseModel {
  id: string;
}

export interface IProjectEnvironmentModel {
  envName: string;
  servers?: IProjectServerModel[];
  git?: IProjectGitModel;
  commands?: string[];
  serverCommands?: string[];
  config?: IProjectConfigModel;
}

export interface IProjectServerModel {
  host: string;
  username: string;
  password: string;
  port?: number;
  rsa?: string;
}

export interface IProjectGitModel {
  url?: string;
  token?: string;
}

export interface IProjectConfigModel {
  packDirectoryName?: string;
  deployDirectory?: string;
}

export interface IProjectBuildConfigModel {
  taskId: string;
  projectId: string;
  projectName: string;
  envName: string;
  servers?: IProjectServerModel[];
  git?: IProjectGitModel;
  commands?: string[];
  serverCommands?: string[];
  config?: IProjectConfigModel;
}

export interface IProjectListModel {
  id: string;
  projectName: string;
  createTime: string;
}

export interface IJasadsSocketResult {
  taskId: string;
  status: TaskStatus;
  pullLogs: string;
  compileLogs: string;
  packLogs: string;
  deployLogs: string;
}
