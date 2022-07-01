import { IMoYuRecord, IRankList } from '@interfaces/moyu';
import http from '@utils/http';

const host = process.env.MOYU_API_URL;

export async function getRankList() {
  return await http.get<IRankList[]>(
    '/api/services/client/WxUser/GetStatisticBy',
    { host }
  );
}

export async function getRecords() {
  return await http.get<IMoYuRecord[]>(
    '/api/services/client/MoYuRecord/GetMoYuRecords',
    { host, data: { params: { tag: 0 } } }
  );
}
