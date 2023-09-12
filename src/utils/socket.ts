import { io } from 'socket.io-client';
import CONFIG from 'src/constants/config';

const socket = io(CONFIG.BACKEND_URL, {
  auth: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`
  }
});

export default socket;
