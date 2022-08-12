import { IAccountInfo } from '@interfaces/user';
import { ACCOUNT_INFO, THEME, THEMETYPE } from '../constants/constants';
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
    return info && info.expires_at * 1000 > new Date().getTime();
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

export function uuidv4() {
  return (([1e7] as any) + -1e3 + -4e3 + -8e3 + -1e11).replace(
    /[018]/g,
    (c: any) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
  );
}

export function checkPermission(resource: string) {
  const { resources } = useAccount();
  return resources.includes(resource);
}
