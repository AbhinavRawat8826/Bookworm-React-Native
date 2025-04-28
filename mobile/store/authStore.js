import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isCheckingAuth :true,

  register: async (username, email, password) => {
    set({ isLoading: true });
    try {
      const response = await fetch(
        'https://bookworm-react-native-r4os.onrender.com/api/auth/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
            email,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Signup failed');

      
      
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      await AsyncStorage.setItem('token', data.token);
      
      set({ token: data.token, user: data.user, isLoading: false });
      

      set({ token: data.token, user: data.user, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userJson = await AsyncStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;

      set({ token, user });
    } catch (error) {
      console.log('Auth check failed', error);
    }
    finally{
      set({isCheckingAuth:false})
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await fetch(
        'https://bookworm-react-native-r4os.onrender.com/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      await AsyncStorage.setItem('token', data.token);

      set({ token: data.token, user: data.user, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      set({ token: null, user: null });
    } catch (error) {
      console.log('Logout failed', error);
    }
  },
}));
