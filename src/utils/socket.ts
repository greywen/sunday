import { io } from "socket.io-client";

const socket = io("http://192.168.3.39:3334/timesheet");

export default socket;
