import axios from 'axios';

export interface User {
  id: number;
  name: string;
  email: string;
}

export const fetchUser = async (id: number): Promise<User> => {
  const response = await axios.get(`/api/users/${id}`);
  return response.data;
};