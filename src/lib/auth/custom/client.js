'use client';

import axios from 'axios';
import jwt from 'jsonwebtoken';
import { HOST_API } from '@/config';

// const AUTH_URL = 'https://zfwppq9jk2.execute-api.us-east-1.amazonaws.com/stg'; //todo get from env

function generateToken() {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

const user = {
  id: 'USR-000',
  avatar: '/assets/avatar.png',
  firstName: 'Sofia',
  lastName: 'Rivers',
  email: 'sofia@devias.io',
};

class AuthClient {
  async updatePassword(obj) {
    try {
      // Make the API request to change the password
      const response = await axios.post(`${HOST_API}/auth/change-password`, obj);
  
     console.log(response.data,"response");  

     if(!response.data?.data){
      return { error: response?.data?.error[0] ||response?.data?.error?.message || 'Reset password failed' };

     }

  
      // Store the token in localStorage
      // localStorage.setItem('custom-auth-token', token);
  
      // Return the response or an empty object if not needed
      return response.data.data;
    } catch (error) {
      // Handle errors (log, rethrow, or return an error object)
      console.error('Error changing password:', error);
      return { error: error.response ? error.response.data.message : error.message };
    }
  }
  async signInWithOAuth(_) {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params) {
    const { email, password } = params;

    try {
      console.log("email",email)
      const response = await axios.post(`${HOST_API}/auth/sign-in`, { email, password });
      const { token } = response.data.data;

      console.log(token,"t");

      localStorage.setItem('custom-auth-token', token);

      return { data: token };
    } catch (error) {
      return { error: error.response?.data?.error || 'Invalid credentials' };
    }
  }

  async resetPassword(email) {
    try {
      const response = await axios.post(`${HOST_API}/auth/send-password-email`, 
        email
      );
  if(!response?.data?.data?.message){
    return { error: response?.data?.error[0] ||response?.data?.error?.message || 'Reset password failed' };
  }
      return { message: response?.data?.data?.message };
    } catch (error) {
      return { error: response?.data?.error[0] ||response?.data?.error?.message || 'Reset password failed' };
    }
  }

 

  async getUser() {

    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return { data: null };
    }


    const secretKey = 'CMPPRODSECRETKEYSKILLBOOKHELIVERSE'; // todo: get from env
    try {
      const verifiedDecoded = jwt.verify(token, secretKey);
      console.log("verifiedDecoded", verifiedDecoded)
      return { data: verifiedDecoded };
    } catch (err) {
      return { data: null };
    }


   
  }

  async signOut() {
    localStorage.removeItem('custom-auth-token');

    return {};
  }
}

export const authClient = new AuthClient();
