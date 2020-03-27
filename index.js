const core = require('@actions/core');
const github = require('@actions/github');

function hasValidLabel(labels, validLabels) {
  let ok = false;

  for(const label in labels) {
    if(validLabels.indexOf(label) !== -1) {
      ok = true;
    }
  }

  return ok;
}

try {
  const token = core.getInput('github-token');
  const octokit = new github.GitHub(token);

  const context = github.context;

  const owner = context.payload.repository.owner.login;
  const repo = context.payload.repository.name;

  const validLabels = core.getInput('labels').split(",");
  console.log(`Eligible labels are ${validLabels}`);

  const triage = core.getInput("triage_label");
  console.log(`Triage label is ${triage}`);

  const action = context.payload.action;
  console.log(`Action is ${action}`);


  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);

  if(github.context.payload.issue !== undefined) {
    console.log("This is an issue");

    // const issue = octokit.issues.get({
      // owner,
      // repo,
      // context.issue.number
    // });
    const labels = context.issue.label;
    console.log(`Issue #${context.issue.umber} has labels: ${labels}`);

    if(!hasValidLabel(labels, validLabels)) {
      console.log("Does not have valid label -> add triage label");
      await octokit.issues.addLabels({
        owner,
        repo,
        issue_number: context.issue.number,
        labels: triage
      });
    }
    else {
      console.log("Has valid label, do nothing.");
    }

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
