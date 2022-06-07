import { IInfrom } from "@interfaces/inform";
import http from "@utils/http";

export async function getInform() {
  return await http.get<IInfrom[]>("/v1/inform/getAll")
}

export async function getCurInform() {
  return await http.get<IInfrom[]>("/v1/inform/getCur")
}

export async function addInform(data: any) {
  return await http.post("/v1/inform/add", { body: data })
}

export async function delInform(data: any) {
  return await http.post("/v1/inform/del", { body: data })
}

export async function modifyInform(data: any) {
  return await http.post("/v1/inform/modify", { body: data })
}