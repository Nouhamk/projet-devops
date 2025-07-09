import api from './api';

const authService = {
  login: async (email: string, password: string) => {
    const data = await api.post('/auth/login', { email, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },
  
  register: async (name: string, email: string, password: string) => {
    return api.post('/auth/register', { name, email, password });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  isLoggedIn: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    const isValid = await authService.getUser();
    if (!isValid) {
      localStorage.removeItem('token');
    }

    return isValid;
  },

  getUser: async () => {
    const data = await api.get('/auth/me');
    if (!data?.user) {
      authService.logout();
      return null;
    }
    return data.user;
  },

  
  isAdmin: async () => {
    const data = await api.get('/auth/me');
    if (!data?.user) {
      authService.logout();
      return false;
    }
    return data?.user?.isAdmin ?? false;
  }
};

export default authService;