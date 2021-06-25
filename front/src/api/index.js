import axios from 'axios'
import { decodeToken } from 'react-jwt'

export const server = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
})

export function Start() {
  const token = decodeToken(localStorage.auth_token)
  if (token && token?.aud !== `${process.env.REACT_APP_JWT_AUD}/auth`)
    localStorage.clear()
}
