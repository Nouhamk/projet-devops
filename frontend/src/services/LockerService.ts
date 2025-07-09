// src/services/lockerService.ts
import api from './api';

const lockerService = {
  getAllLockers: () => {
    return api.get('/lockers');
  },
  
  getLockerById: (id: string) => {
    return api.get(`/lockers/${id}`);
  },
  
  reserveLocker: (lockerId: string, duration: number) => {
    return api.post('/reservations', { lockerId, duration });
  },
  
  getUserReservations: () => {
    return api.get('/reservations/user');
  }
};

export default lockerService;