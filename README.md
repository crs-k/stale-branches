<p align="center">
  <a href="https://github.com/crs-k/stale-branches/actions"><img alt="ci status" src="https://github.com/crs-k/stale-branches/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://github.com/crs-k/stale-branches/actions"><img alt="ci status" src="https://github.com/crs-k/stale-branches/actions/workflows/codeql-analysis.yml/badge.svg"></a>
</p>

# Stale Branches

Finds and deletes stale branches. By default it aligns with
[this](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-branches-in-your-repository/viewing-branches-in-your-repository) definition, but can be
configured for other use cases.

When a branch has been inactive for more than the `days-before-stale` input, it is considered stale. The branch will be deleted once it has been inactive longer than `days-before-delete`.

- By default, a stale branch is defined as a branch that:
  - has had no commits in the last 120 days.
  - has no protection rules.
  - is not the default branch of the repository.
  - See [inputs](https://github.com/crs-k/stale-branches#inputs) for more info.
- See [example workflow](https://github.com/crs-k/stale-branches#example-workflow).

## Usage

### Pre-requisites

Create a workflow `.yml` file in your repository's `.github/workflows` directory. An [example workflow](#example-workflow) is available below. For more information, reference the GitHub Help
Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

### Inputs

Inputs are defined in [`action.yml`](action.yml). None are required.:

| Name                         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Default                                                                                                  |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `repo-token`                 | Token used to authenticate with GitHub's API. Can be passed in using [`${{ secrets.GITHUB_TOKEN }}`](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#about-the-github_token-secret).                                                                                                                                                                                                                                                                                                        | [`${{ github.token }}`](https://docs.github.com/en/actions/learn-github-actions/contexts#github-context) |
| `days-before-stale`          | Number of days a branch has been inactive before it is considered stale.                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 120 days                                                                                                 |
| `days-before-delete`         | Number of days a branch has been inactive before it is deleted.                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 180 days                                                                                                 |
| `comment-updates`            | A comment with updated information will be added to existing issues each workflow run.                                                                                                                                                                                                                                                                                                                                                                                                                                        | false                                                                                                    |
| `max-issues`                 | This dictates the number of `stale branch 🗑️` issues that can exist. Also, the max number of branches that can be deleted per run.                                                                                                                                                                                                                                                                                                                                                                                            | 20                                                                                                       |
| `tag-committer`              | When an issue is opened, the last committer will be tagged in the comments.                                                                                                                                                                                                                                                                                                                                                                                                                                                   | false                                                                                                    |
| `stale-branch-label`         | Label to be applied to issues created for stale branches. <br>**As of v2, this _must_ be unique to this workflow**.                                                                                                                                                                                                                                                                                                                                                                                                           | `stale branch 🗑️`                                                                                        |
| `compare-branches`           | This compares each branch to the repo's default branch. <ul><li>When set to `info`, additional output describes if the current branch is ahead, behind, diverged, or identical to the default branch.<br>![image](https://user-images.githubusercontent.com/26232872/157590411-7c97806c-a509-4002-b7a5-a1e4a5da08eb.png)</li> <li>When set to `save`, this prevents branches from being deleted if they are ahead of or diverged from the default branch.</li> <li>When set to `off`, no additional calls are made.</li></ul> | off                                                                                                      |
| `branches-filter-regex`      | An optional Regex that will be used to filter branches from this action.                                                                                                                                                                                                                                                                                                                                                                                                                                                      | ''                                                                                                       |
| `rate-limit`                 | If this is enabled, the action will stop if it exceeds 95% of the GitHub API rate limit.                                                                                                                                                                                                                                                                                                                                                                                                                                      | true                                                                                                     |
| `pr-check`                   | If this is enabled, the action will first check for incoming/outgoing PRs associated with the branch. If a branch has an active pr, it will be ignored.                                                                                                                                                                                                                                                                                                                                                                       | false                                                                                                    |
| `dry-run`                    | If this is enabled, the action will not delete or tag any branches.                                                                                                                                                                                                                                                                                                                                                                                                                                                           | false                                                                                                    |
| `ignore-issue-interaction`   | If this is enabled, the action will not interact with Github issues.                                                                                                                                                                                                                                                                                                                                                                                                                                                          | false                                                                                                    |
| `include-protected-branches` | If this is enabled, the action will include protected branches in the process.<br>**Note: When you use this, the token passed to `repo-token` must include "Administration" repository permissions (read)**. For details, see https://docs.github.com/en/rest/branches/branch-protection?apiVersion=2022-11-28                                                                                                                                                                                                                | false                                                                                                    |
| `ignore-commit-messages`     | Comma-separated list of commit messages (or substrings) to ignore when determining commit age. If provided, commits with these messages will be ignored when calculating branch age. e.g. Ignore commits produced by automated workflows.                                                                                                                                                                                                                                                                                     |

### Outputs

Outputs are defined in [`action.yml`](action.yml):

| Name               | Description                                                     |
| ------------------ | --------------------------------------------------------------- |
| `stale-branches`   | List of all branches identified as stale during a workflow run. |
| `deleted-branches` | List of all branches deleted during a workflow run.             |

#### Terminal Output Groups

- Output is grouped by branch.
  - Active branches are green
  - Stale branches are yellow
  - Dead branches are red
  - Skipped branches are blue

![image](https://user-images.githubusercontent.com/26232872/155919116-50a2ded9-2839-4957-aaa2-caa9c40c91c9.png)

## Example workflow

### With defaults

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
        uses: crs-k/stale-branches@v5.0.0
```

### With Inputs

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
        uses: crs-k/stale-branches@v5.0.0
        with:
          repo-token: '${{ secrets.GITHUB_TOKEN }}'
          days-before-stale: 120
          days-before-delete: 180
          comment-updates: false
          max-issues: 20
          tag-committer: false
          stale-branch-label: 'stale branch 🗑️'
          compare-branches: 'info'
          branches-filter-regex: '^((?!dependabot))'
          rate-limit: false
          pr-check: false
          dry-run: false
          ignore-issue-interaction: false
          ignore-commit-messages: ''
```

## Advanced Examples

### Enterprise Setup with Custom Rules

```yaml
name: Enterprise Stale Branch Cleanup

on:
  schedule:
    - cron: '0 9 * * 1,3,5'  # Run M/W/F at 9 AM

permissions:
  issues: write
  contents: write
  pull-requests: read

jobs:
  stale_branches:
    runs-on: ubuntu-latest
    steps:
      - name: Stale Branches
        uses: crs-k/stale-branches@v5.0.0
        with:
          days-before-stale: 90
          days-before-delete: 180
          max-issues: 10
          tag-committer: true
          compare-branches: 'save'
          branches-filter-regex: '^((?!main|develop|staging|release/))'
          pr-check: true
          ignore-commit-messages: 'Automated commit,CI update,Bot:'
```

### Development Team Workflow

```yaml
name: Dev Team Branch Cleanup

on:
  schedule:
    - cron: '0 10 * * 1'  # Weekly on Monday

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Notify About Stale Branches
        uses: crs-k/stale-branches@v5.0.0
        with:
          days-before-stale: 30
          days-before-delete: 90
          comment-updates: true
          tag-committer: true
          stale-branch-label: '🧹 stale-branch'
          compare-branches: 'info'
          pr-check: true
```

### Safe Mode with Manual Review

```yaml
name: Safe Stale Branch Detection

on:
  schedule:
    - cron: '0 8 * * 1'

jobs:
  detect_only:
    runs-on: ubuntu-latest
    steps:
      - name: Find Stale Branches (No Deletion)
        uses: crs-k/stale-branches@v5.0.0
        with:
          days-before-stale: 60
          days-before-delete: 999999  # Never delete automatically
          compare-branches: 'info'
          tag-committer: true
```

## Troubleshooting

For common issues and solutions, see our [Troubleshooting Guide](docs/TROUBLESHOOTING.md).

Quick debugging tips:
- Use `dry-run: true` to test configuration
- Check action logs for detailed branch processing information
- Verify repository permissions and branch protection rules

## Documentation

- [API Documentation](docs/API.md) - Detailed function and type reference
- [Troubleshooting Guide](docs/TROUBLESHOOTING.md) - Common issues and solutions
