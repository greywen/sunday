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
