const core = require('@actions/core');
const github = require('@actions/github');

try {
  const labels = core.getInput('labels').split(",");
  console.log(`Eligible labels are ${labels}`);

  const triage = core.getInput("triage_label");
  console.log(`Triage label is ${triage}`);

  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);

  const action = github.context.payload.action;
  console.log(`Action is ${action}`);

  if(github.context.payload.issue !== undefined) {
    console.log("This is an issue");
  }
  else if(github.context.payload.pull_request !== undefined) {
    console.log("This is an issue");
  }
  else {
    core.setFailed("Invalid event combination");
  }
  




} catch (error) {
  core.setFailed(error.message);
}
