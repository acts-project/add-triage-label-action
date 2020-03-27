const core = require('@actions/core');
const github = require('@actions/github');

function hasValidLabel(labels, validLabels) {
  let ok = false;

  for(const label of labels) {
    if(validLabels.indexOf(label) !== -1) {
      ok = true;
    }
  }

  return ok;
}

async function run() {
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



  if(github.context.payload.issue !== undefined) {
    console.log("This is an issue");

    const issue = context.payload.issue;

    var labels = [];
    for(const lab of issue.labels) {
      labels.push(lab.name);
    }
    console.log(`Issue #${issue.number} has labels: ${labels}`);

    if(!hasValidLabel(labels, validLabels)) {
      console.log("Does not have valid label -> add triage label");
      await octokit.issues.addLabels({
        owner,
        repo,
        issue_number: issue.number,
        labels: [triage]
      });
    }
    else {
      console.log("Has valid label, make sure triage label is not among them");
      const index = labels.indexOf(triage);
      if(index > -1) {
        await octokit.issues.deleteLabel({
          owner,
          repo,
          issue_number: issue.number,
          name: triage
        });
      }
    }

  }
  else if(github.context.payload.pull_request !== undefined) {
    console.log("This is a pull request ");

    const pr = context.payload.pull_request;

    var labels = [];
    for(const lab of pr.labels) {
      labels.push(lab.name);
    }
    console.log(`PR #${pr.number} has labels: ${labels}`);

    if(!hasValidLabel(labels, validLabels)) {
      console.log("Does not have valid label -> add triage label");
      await octokit.issues.addLabels({
        owner,
        repo,
        issue_number: pr.number,
        labels: [triage]
      });
    }
    else {
      console.log("Has valid label, make sure triage label is not among them");
      const index = labels.indexOf(triage);
      if(index > -1) {
        await octokit.issues.deleteLabel({
          owner,
          repo,
          issue_number: pr.number,
          name: triage
        });
      }
    }


  }
  else {
    core.setFailed("Invalid event combination");
  }

}

function handleError(err) {
    console.error(err)

  if (err && err.message) {
        core.setFailed(err.message)
      
  } else {
        core.setFailed(`Unhandled error: ${err}`)
      
  }
  
}

run().catch(handleError)

const payload = JSON.stringify(github.context.payload, undefined, 2)
console.log(`The event payload: ${payload}`);
