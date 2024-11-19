import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const mochawesomeJsonOutput = fs.readFileSync(
  "./mochawesome-report/mochawesome.json",
  "utf-8"
);
const mochawesomeReport = JSON.parse(mochawesomeJsonOutput);

const totalTests = mochawesomeReport.stats.tests;
const passedTests = mochawesomeReport.stats.passes;
const failedTests = mochawesomeReport.stats.failures;

const resultMessage =
  passedTests === totalTests
    ? `:white_check_mark: Success (${passedTests} / ${totalTests} Passed)`
    : `:x: Failure (${passedTests} / ${totalTests} Passed)`;

const pipelineName = process.env.GO_PIPELINE_NAME;
const pipelineCounter = process.env.GO_PIPELINE_COUNTER;
const goCdServer = process.env.GOCD_SERVER;

const reportUrl = `http://${goCdServer}/go/files/${pipelineName}/${pipelineCounter}/sanity/1/sanity/test-results/mochawesome-report/sanity-report.html`;

const slackMessage = {
  text: `Dev11, CMA SDK Full Sanity
*Result:* ${resultMessage}
*Failed Tests:* ${failedTests}
<${reportUrl}|View Report>`,
};

const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

const sendSlackMessage = async (message) => {
  const payload = {
    text: message,
  };

  try {
    const response = await fetch(slackWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error sending message to Slack: ${response.statusText}`);
    }

    console.log("Message sent to Slack successfully");
  } catch (error) {
    console.error("Error:", error);
  }
};
sendSlackMessage(slackMessage.text);
