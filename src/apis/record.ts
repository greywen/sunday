import http from '@utils/http';
export async function createRecord(data: any[]) {
  return await http.post<number>(`/v1/record`, {
    body: { data: JSON.stringify(data) },
  });
}

export async function getRecord(id: string) {
  return await http.get(`/v1/record/` + id);
}
