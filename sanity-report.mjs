import Slack from '@slack/bolt'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

const mochawesomeJsonOutput = fs.readFileSync('./mochawesome-report/mochawesome.json', 'utf-8')
const mochawesomeReport = JSON.parse(mochawesomeJsonOutput)

const totalSuites = mochawesomeReport.stats.suites
const totalTests = mochawesomeReport.stats.tests
const passedTests = mochawesomeReport.stats.passes
const failedTests = mochawesomeReport.stats.failures
const pendingTests = mochawesomeReport.stats.pending
const durationInSeconds = mochawesomeReport.stats.duration / 1000

console.log(`Total Suites: ${totalSuites}`)
console.log(`Total Tests: ${totalTests}`)
console.log(`Passed Tests: ${passedTests}`)
console.log(`Failed Tests: ${failedTests}`)
console.log(`Pending Tests: ${pendingTests}`)
console.log(`Total Duration: ${durationInSeconds.toFixed(2)} seconds`)

const slackMessage = `
*Test Summary*
Total Suites: ${totalSuites}
Total Tests: ${totalTests}
Passed Tests: ${passedTests}
Failed Tests: ${failedTests}
Pending Tests: ${pendingTests}
Total Duration: ${durationInSeconds.toFixed(2)} seconds
`

const app = new Slack.App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
})

async function publishMessage (text) {
  await app.client.chat.postMessage({
    token: process.env.SLACK_BOT_TOKEN,
    channel: process.env.SLACK_CHANNEL,
    text: text
  })
}

publishMessage(slackMessage)
