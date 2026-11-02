import { randomBytes } from 'crypto'

const token = (prefix) => `${prefix}${randomBytes(8).toString('hex')}`
const BASE32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
const base32 = (length) => Array.from(randomBytes(length), (b) => BASE32[b % 32]).join('')

export const TEST_PASSWORD = token('pw_')
export const WRONG_PASSWORD = token('wrong_pw_')
export const TEST_EMAIL = `${token('user_')}@example.com`
export const TFA_TEST_EMAIL = `${token('tfa_')}@example.com`
export const WRONG_EMAIL = `${token('wrong_')}@example.com`
export const INVALID_EMAIL = token('invalid_email_')
export const TEST_API_KEY = token('key_')
export const INVALID_API_KEY = token('invalid_key_')
export const TEST_MFA_SECRET = base32(16)
export const TEST_ACCESS_TOKEN = token('access_')
export const TEST_REFRESH_TOKEN = token('refresh_')
