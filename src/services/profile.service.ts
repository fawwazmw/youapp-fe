import api from './api';
import { Profile, UpdateProfileDto } from '../types/profile.types';

export const ProfileService = {
  getProfile: async (): Promise<Profile> => {
    return api.get('/getProfile');
  },
  
  createProfile: async (data: UpdateProfileDto): Promise<Profile> => {
    return api.post('/createProfile', data);
  },
  
  updateProfile: async (data: UpdateProfileDto): Promise<Profile> => {
    return api.patch('/updateProfile', data);
  }
};
