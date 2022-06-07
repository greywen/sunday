import { IAccountInfo } from '@interfaces/user';
import { ACCOUNT_INFO, THEME, THEMETYPE } from '../constants';
import { dark, light } from '../theme/config';

export const useAccount = () => {
  function get(): IAccountInfo {
    const info = localStorage.getItem(ACCOUNT_INFO);
    return info ? JSON.parse(info) : null;
  }
  function set(data: IAccountInfo) {
    localStorage.setItem(ACCOUNT_INFO, JSON.stringify(data));
  }
  function checkWhetherExpire(): boolean {
    const info = get();
    return (
      info && (info.expires + info.refreshExpires) * 1000 > new Date().getTime()
    );
  }
  function remove() {
    localStorage.removeItem(ACCOUNT_INFO);
  }

  return {
    ...get(),
    set,
    remove,
    checkWhetherExpire,
  };
};

export const useTheme = () => {
  return {
    get: () =>
      localStorage.getItem(THEME) === null ||
      localStorage.getItem(THEME) === 'light'
        ? 'light'
        : 'dark',
    set: (data: THEMETYPE) => localStorage.setItem(THEME, data),
  };
};

export const renderTheme = (isLight: boolean) => {
  (isLight ? light : dark).forEach((item) => {
    document.body.style?.setProperty(item.name, item.color);
  });
};
