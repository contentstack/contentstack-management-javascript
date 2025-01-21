import Slack from '@slack/bolt'
const { App } = Slack
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

const mochawesomeJsonOutput = fs.readFileSync('./mochawesome-report/mochawesome.json', 'utf-8')
const mochawesomeReport = JSON.parse(mochawesomeJsonOutput)
const report = `./mochawesome-report/sanity-report.html`

const totalSuites = mochawesomeReport.stats.suites
const totalTests = mochawesomeReport.stats.tests
const passedTests = mochawesomeReport.stats.passes
const failedTests = mochawesomeReport.stats.failures
const pendingTests = mochawesomeReport.stats.pending
let durationInSeconds = mochawesomeReport.stats.duration / 1000
const durationInMinutes = Math.floor(durationInSeconds / 60)
durationInSeconds %= 60

console.log(`Total Suites: ${totalSuites}`)
console.log(`Total Tests: ${totalTests}`)
console.log(`Passed Tests: ${passedTests}`)
console.log(`Failed Tests: ${failedTests}`)
console.log(`Pending Tests: ${pendingTests}`)
console.log(`Total Duration: ${durationInMinutes}m ${durationInSeconds.toFixed(2)}s`)

const slackMessage = `
*JavaScript CMA Report*
• Total Suites: *${totalSuites}*
• Total Tests: *${totalTests}*
• Passed Tests: *${passedTests}*
• Failed Tests: *${failedTests}*
• Pending Tests: *${pendingTests}*
• Total Duration: *${durationInMinutes}m ${durationInSeconds.toFixed(2)}s*
`

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
})

async function publishMessage (text, report) {
  await app.client.chat.postMessage({
    token: process.env.SLACK_BOT_TOKEN,
    channel: process.env.SLACK_CHANNEL,
    text: text
  })
  await app.client.files.uploadV2({
    token: process.env.SLACK_BOT_TOKEN,
    channel_id: process.env.SLACK_CHANNEL_ID,
    initial_comment: '*Here is the report generated*',
    filetype: 'html',
    filename: 'sanity-report.html',
    file: fs.createReadStream(report)
  })
}

publishMessage(slackMessage, report)
