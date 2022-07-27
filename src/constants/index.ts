/**
 * 正常 O 1
 * 调休 C 2
 * 休假 V 3
 * 事假 P 4
 * 病假 S 5
 * 未提交日志 X 6
 * 加班 J 7
 * 迟到 L 8
 * 考勤时间 A 9
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
  'A' = 9,
  'Anomalous' = 10,
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
