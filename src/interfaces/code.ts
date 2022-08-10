export interface ICodeLanguage {
  id: number;
  name: string;
  initialCode: string;
  version?: string;
}

export interface IQuestion {
  id: string;
  name: string;
  desribe: string;
  level: number;
  entrys: IEntryCode[];
}

export interface IRunCaseResult {
  comments: string;
  input: string;
  output: string;
  codeOutput?: string;
  elapsedTime?: string;
  logs?: string;
}

export interface IEntryCode {
  languageId: number;
  function: string; // 入口方法
  code: string;
}
