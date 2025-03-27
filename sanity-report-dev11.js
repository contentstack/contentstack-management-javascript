const { App } = require("@slack/bolt");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

const user1 = process.env.USER1;
const user2 = process.env.USER2;
const user3 = process.env.USER3;
const user4 = process.env.USER4;

const mochawesomeJsonOutput = fs.readFileSync(
  "./mochawesome-report/mochawesome.json",
  "utf-8"
);
const mochawesomeReport = JSON.parse(mochawesomeJsonOutput);

const totalTests = mochawesomeReport.stats.tests;
const passedTests = mochawesomeReport.stats.passes;
const failedTests = mochawesomeReport.stats.failures;

let durationInSeconds = Math.floor(mochawesomeReport.stats.duration / 1000);
const durationInMinutes = Math.floor(durationInSeconds / 60);
durationInSeconds %= 60;

const resultMessage =
  passedTests === totalTests
    ? `:white_check_mark: Success (${passedTests} / ${totalTests} Passed)`
    : `:x: Failure (${passedTests} / ${totalTests} Passed)`;

const pipelineName = process.env.GO_PIPELINE_NAME;
const pipelineCounter = process.env.GO_PIPELINE_COUNTER;
const goCdServer = process.env.GOCD_SERVER;

const reportUrl = `http://${goCdServer}/go/files/${pipelineName}/${pipelineCounter}/sanity/1/sanity/test-results/mochawesome-report/sanity-report.html`;

let tagUsers =
  failedTests > 0 ? `<@${user1}> <@${user2}> <@${user3}> <@${user4}>` : "";

const slackMessage = {
  text: `Dev11, SDK-CMA Sanity\n*Result:* ${resultMessage}. ${durationInMinutes}m ${durationInSeconds}s\n*Failed Tests:* ${failedTests}\n<${reportUrl}|View Report>\n${tagUsers}`,
};

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const sendSlackMessage = async (message) => {
  try {
    const result = await app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: process.env.SLACK_CHANNEL2,
      text: message,
    });

    if (failedTests > 0) {
      await sendFailureDetails(result.ts);
    }
  } catch (error) {
    console.error("Error sending Slack message:", error);
  }
};

const sendFailureDetails = async (threadTs) => {
  const failedSuites = mochawesomeReport.results
    .flatMap((result) => result.suites)
    .filter((suite) => suite.failures.length > 0);

  let failureDetails = "*Failed Test Modules:*\n";
  for (const suite of failedSuites) {
    failureDetails += `- *${suite.title}*: ${suite.failures.length} failed\n`;
  }

  try {
    await app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: process.env.SLACK_CHANNEL2,
      text: failureDetails,
      thread_ts: threadTs,
    });
  } catch (error) {
    console.error("Error sending failure details:", error);
  }
};

sendSlackMessage(slackMessage.text);
