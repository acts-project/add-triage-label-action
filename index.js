const core = require('@actions/core');
const github = require('@actions/github');

try {
  const labels = core.getInput('labels').split(",");
  console.log(`Eligible labels are ${labels}`);

  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
