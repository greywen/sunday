import { IProjectListModel, IProjectModel } from '@interfaces/jasads';
import http from '@utils/http';
const jasadsHost = process.env.JASADS_API_URL;
export async function getProjects() {
  return await http.get<IProjectListModel[]>('/api/project', {
    host: jasadsHost,
  });
}

export async function getProjectDetails(id: string) {
  return await http.get<IProjectModel>('/api/project/' + id, {
    host: jasadsHost,
  });
}

export async function createProject(data: any) {
  return await http.post('/api/project', { host: jasadsHost, body: data });
}

export async function updateProject(data: any) {
  return await http.put('/api/project', { host: jasadsHost, body: data });
}

export async function deleteProject(projectId: string) {
  return await http.delete('/api/project/' + projectId, { host: jasadsHost });
}
