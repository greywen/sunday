import { ICodeLanguage, IRunCaseResult } from '@interfaces/code';
import http from '@utils/http';

export async function runCode(data: any): Promise<any> {
  return await http.post('/v1/language/run', { body: data });
}

export async function runCodeByCase(data: any): Promise<IRunCaseResult[]> {
  return await http.post('/v1/language/run/case', { body: data });
}

export async function getLanguages() {
  return await http.get<ICodeLanguage[]>('/v1/language/languages');
}
