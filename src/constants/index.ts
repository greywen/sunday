/**
 * 正常 O 1
 * 调休 C 2
 * 休假 V 3
 * 事假 P 4
 * 病假 S 5
 * 未提交日志 X 6
 * 加班 J 7
 * 迟到 L 8
 */
export enum AttendanceState {
  'O' = 1,
  'C' = 2,
  'V' = 3,
  'P' = 4,
  'S' = 5,
  'X' = 6,
  'J' = 7,
  'L' = 8,
}

export enum GroupType {
  'back-end' = 1,
  'frond-end' = 2,
  'test' = 3,
  'nodejs' = 4,
}

export type THEMETYPE = 'dark' | 'light';
export const ACCOUNT_INFO = 'ACCOUNT_INFO';
export const THEME = 'THEME';

export enum TaskStatus {
  // 排队
  'Queuing' = 201,
  // 拉取代码
  'Pulling' = 202,
  // 编译
  'Compiling' = 203,
  // 打包
  'Packing' = 204,
  // 发布
  'Deploying' = 205,
  // 拉取代码错误
  'PullFailed' = 402,
  // 编译错误
  'CompileFailed' = 403,
  // 打包错误
  'PackFailed' = 404,
  // 发布错误
  'DeployFailed' = 405,
  // 成功
  'Succeed' = 200,
  // 失败
  'Failed' = 400,
}
