import http from '@utils/http';
import { IQuestion } from '@interfaces/code';

export async function getQuestion(quertionId: string) {
  return await http.get<IQuestion>('/v1/question/' + quertionId);
}

export async function getQuestionList() {
  return await http.get<IQuestion[]>('/v1/question/list');
}

export async function getLastQuestionAnswer(
  questionId: string,
  languageId: number
) {
  return await http.get<string>(`/v1/answer/last/${questionId}/${languageId}`);
}
