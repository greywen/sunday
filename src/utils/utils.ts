import { IAccountInfo } from "@interfaces/user";
import { ACCOUNT_INFO } from "../constants"

export const useAccount = () => {
    function get(): IAccountInfo {
        const info = localStorage.getItem(ACCOUNT_INFO);
        return info ? JSON.parse(info) : null;
    };
    function set(data: IAccountInfo) {
        localStorage.setItem(ACCOUNT_INFO, JSON.stringify(data));
    }
    function checkWhetherExpire(): boolean {
        const info = get();
        return info && ((info.expires + info.refreshExpires) * 1000) > new Date().getTime();
    }
    function remove() {
        localStorage.removeItem(ACCOUNT_INFO);
    }

    return {
        ...get(),
        set,
        remove,
        checkWhetherExpire
    }
}