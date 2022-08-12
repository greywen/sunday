import http from '@utils/http';
import { IQuestion, IQuestionCase, IQuestionCreate } from '@interfaces/code';

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

export async function createQuestion(question: IQuestionCreate) {
  return await http.post<IQuestion>(`/v1/question`, { body: question });
}

export async function updateQuestion(question: IQuestionCreate) {
  return await http.put(`/v1/question`, { body: question });
}
