import * as contentstack from '../../../lib/contentstack.js'
import dotenv from 'dotenv'
dotenv.config()

const requiredVars = ['HOST', 'EMAIL', 'PASSWORD', 'ORGANIZATION', 'API_KEY']
const missingVars = requiredVars.filter((key) => !process.env[key])

if (missingVars.length > 0) {
  console.error(`\x1b[31mError: Missing environment variables - ${missingVars.join(', ')}`)
  process.exit(1)
}

function contentstackClient (authtoken = null) {
  var params = { host: process.env.HOST, defaultHostName: process.env.DEFAULTHOST }
  if (authtoken) {
    params.authtoken = authtoken
  }
  return contentstack.client(params)
}

export { contentstackClient }
