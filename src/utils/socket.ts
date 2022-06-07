import { io } from 'socket.io-client';
import { useAccount } from './utils';
const account = useAccount();

const socket = io(`${process.env.API_URL}/timesheet`, {
  extraHeaders: {
    authorization: `Bearer ${account.token}`,
  },
});

socket.on('connect', function () {});

// const jasadsSocket = io(`${process.env.JASADS_API_URL}/deploy`, {
//   extraHeaders: {
//     authorization: `Bearer ${account.token}`,
//   },
// });

// jasadsSocket.on('connect', function () {});

// export { socket, jasadsSocket };
export { socket };
