import { io } from 'socket.io-client';
import CONFIG from 'src/constants/config';

export const initSocket = (accessToken: string) => {
  const socket = io(CONFIG.BACKEND_URL, {
    auth: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return socket;
};

const socket = io(CONFIG.BACKEND_URL, {
  auth: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`
  }
});

export default socket;
