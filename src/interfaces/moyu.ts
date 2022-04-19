export interface IRankList {
  count: number,
  integral: number,
  nickName: string,
  wxUserAvatarUrl: string,
  wxUserAvatarUrlStyle: string,
  wxUserId: number,
}



export interface IMoYuRecord {
  wxUserId: number;
  wxUserNickName: string;
  wxUserAvatarUrl: string;
  imageUrl?: any;
  desc: string;
  creationTime: string;
  moYuRealTime: string;
  moYuType: number;
  date: string;
  hour: string;
  wxUserAvatarUrlStyle: string;
  imageUrlStyle: string;
  id: number;
}