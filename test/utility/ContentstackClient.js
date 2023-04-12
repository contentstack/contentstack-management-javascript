import * as contentstack from '../../lib/contentstack.js'
import dotenv from 'dotenv'
dotenv.config()
function contentstackClient (authtoken = null) {
  var params = { host: process.env.HOST, version: process.env.VERSION || 'v3', defaultHostName: process.env.DEFAULTHOST }
  if (authtoken) {
    params.authtoken = authtoken
  }
  return contentstack.client(params)
}

export { contentstackClient }
