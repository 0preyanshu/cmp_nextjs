'use client';

import axios from 'axios';
import jwt from 'jsonwebtoken';

const AUTH_URL = 'https://zfwppq9jk2.execute-api.us-east-1.amazonaws.com/stg'; //todo get from env

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
  async signUp(_) {
    // Make API request

    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);

    return {};
  }

  async signInWithOAuth(_) {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params) {
    const { email, password } = params;

    try {
      const response = await axios.post(`${AUTH_URL}/auth/sign-in`, { email, password });
      const { token } = response.data.data;

      localStorage.setItem('custom-auth-token', token);

      return { data: token };
    } catch (error) {
      return { error: error.response?.data?.error || 'Invalid credentials' };
    }
  }

  async resetPassword(_) {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_) {
    return { error: 'Update reset not implemented' };
  }

  async getUser() {

    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return { data: null };
    }


    const secretKey = 'StagingSecretKey'; // todo: get from env
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
