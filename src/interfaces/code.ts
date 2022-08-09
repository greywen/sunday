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
  code: string;
}

export interface IRunCaseResult {
  comments: string;
  input: string;
  output: string;
  codeOutput?: string;
  elapsedTime?: string;
  logs?: string;
}
