<p align="center">
  <a href="https://github.com/crs-k/stale-branches/actions"><img alt="ci status" src="https://github.com/crs-k/stale-branches/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://github.com/crs-k/stale-branches/actions"><img alt="ci status" src="https://github.com/crs-k/stale-branches/actions/workflows/codeql-analysis.yml/badge.svg"></a>
</p>

# Stale Branches

This Action automatically deletes stale branches. 

When a branch has been inactive for the configured `days-before-stale` input, an issue is opened with the title `[branch-name] is STALE`. A branch will be deleted once it has been inactive longer than `days-before-delete`, which is assessed independently of `days-before-stale`.

* By default, a stale branch is defined as a branch that:
  * has had no commits in the last 120 days.
  * has no protection rules.
  * has no open pull requests.
  * is not the default branch of the repository. 
  * See [inputs](https://github.com/crs-k/stale-branches#inputs) for more info.
* See [example workflow](https://github.com/crs-k/stale-branches#example-workflow).

## Usage

### Pre-requisites
Create a workflow `.yml` file in your repository's `.github/workflows` directory. An [example workflow](#example-workflow) is available below. For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

### Inputs
Inputs are defined in [`action.yml`](action.yml):

| Name | Required | Description | Default |
| ---- | -------- | ----------- | ------- |
| `repo-token` | `Yes`| Token to use to authenticate with GitHub API. [GITHUB_TOKEN](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#about-the-github_token-secret) suggested. | N/A |
| `days-before-stale` | `No` | Number of days a branch has been inactive before it is considered stale. | 120 days |
| `days-before-delete` | `No` | Number of days a branch has been inactive before it is deleted. | 180 days |
| `comment-updates` | `No` | If this is enabled, a comment with updated information will be added to existing issues each workflow run. | false |
| `max-issues` | `No` | This dictates the number of issues that can exist. It also limits the number of branches that can be deleted per run. | 20 |
| `tag-committer` | `No` | When an issue is opened, this will tag the stale branchs last committer in the comments. | false |

### Outputs
Outputs are defined in [`action.yml`](action.yml):

| Name | Description |
| ---- | ----------- |
| `stale-branches` | List of all branches identified as stale during a workflow run. |
| `deleted-branches` | List of all branches deleted during a workflow run. |


## Example workflow

```yaml
# .github/workflows/stale-branches.yml

name: Stale Branches

on:
  schedule:
    - cron: '0 6 * * 1-5'
    
permissions:
  issues: write
  contents: write

jobs:
  stale_branches:
    runs-on: ubuntu-latest
    steps:
    - name: Stale Branches
      uses: crs-k/stale-branches@v1.0.0
      with:
        repo-token: "${{ secrets.GITHUB_TOKEN }}"
```

## Contributing
Contributions are welcomed. Please read the [contributing](https://github.com/crs-k/stale-branches/blob/main/CONTRIBUTING.md).
