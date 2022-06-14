import { IInfrom } from "@interfaces/inform";
import { IGetReportTemplateResult } from "@interfaces/report";
import http from "@utils/http";

export async function createPeport(data: any) {
  return await http.post("/v1/dingtalk/createPeport", { body: data });
}

export async function getReportTemplateByName(data: string) {
  return await http.post<IGetReportTemplateResult>("/v1/dingtalk/getReportTemplateByName", { body: {name: data} });
}

export async function getReportFinished() {
  return await http.get<boolean>("/v1/dingtalk/getReportFinished");
}
