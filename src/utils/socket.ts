import { io } from "socket.io-client";
import { useAccount } from "./utils";
const account = useAccount();

const socket = io(`http://${location.hostname}:8090/timesheet`, {
    extraHeaders: {
        authorization: `Bearer ${account.token}`
    }
});

socket.on("connect", function () { });

export default socket;
