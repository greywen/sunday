export interface ICodeLanguage {
  id: number;
  name: string;
  initialCode: string;
  version?: string;
}

export interface IQuestion {
  id: string;
  name: string;
  describe: string;
  level: number;
  entryCodes: IEntryCode[];
  isPassed: boolean;
  elapsedTime: number;
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
  function?: string; // 入口方法
  code?: string;
}

export interface IQuestionCreate {
  id?: string;
  name: string;
  describe?: string | null;
  level?: number;
  entryCodes: IEntryCode[];
  cases?: IQuestionCase[];
  enabled?: boolean;
}

export interface IQuestionCase {
  id: string;
  languageId: number;
  comments?: string;
  input?: string;
  output?: string;
}
