import { ICodeLanguage, IQuestion, IRunCaseResult } from '@interfaces/code';
import http from '@utils/http';

export async function runCode(data: any): Promise<any> {
  return await http.post('/v1/code/run', { body: data });
}

export async function runCodeByCase(data: any): Promise<IRunCaseResult[]> {
  return await http.post('/v1/code/run/case', { body: data });
}

export async function getLanguages() {
  return await http.get<ICodeLanguage[]>('/v1/code/languages');
}

export async function getQuestion(quertionId: string) {
  return await http.get<IQuestion>('/v1/code/question/' + quertionId);
}
