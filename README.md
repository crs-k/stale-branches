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

| Name                            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Default                                                                                                  |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `repo-token`                    | Token used to authenticate with GitHub's API. Can be passed in using [`${{ secrets.GITHUB_TOKEN }}`](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#about-the-github_token-secret).                                                                                                                                                                                                                                                                                                        | [`${{ github.token }}`](https://docs.github.com/en/actions/learn-github-actions/contexts#github-context) |
| `days-before-stale`             | Number of days a branch has been inactive before it is considered stale.                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 120 days                                                                                                 |
| `days-before-delete`            | Number of days a branch has been inactive before it is deleted.                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 180 days                                                                                                 |
| `comment-updates`               | A comment with updated information will be added to existing issues each workflow run.                                                                                                                                                                                                                                                                                                                                                                                                                                        | false                                                                                                    |
| `max-issues`                    | This dictates the number of `stale branch 🗑️` issues that can exist. Also, the max number of branches that can be deleted per run.                                                                                                                                                                                                                                                                                                                                                                                            | 20                                                                                                       |
| `tag-committer`                 | When an issue is opened, the last committer will be tagged in the comments.                                                                                                                                                                                                                                                                                                                                                                                                                                                   | false                                                                                                    |
| `stale-branch-label`            | Label to be applied to issues created for stale branches. <br>**As of v2, this _must_ be unique to this workflow**.                                                                                                                                                                                                                                                                                                                                                                                                           | `stale branch 🗑️`                                                                                        |
| `compare-branches`              | This compares each branch to the repo's default branch. <ul><li>When set to `info`, additional output describes if the current branch is ahead, behind, diverged, or identical to the default branch.<br>![image](https://user-images.githubusercontent.com/26232872/157590411-7c97806c-a509-4002-b7a5-a1e4a5da08eb.png)</li> <li>When set to `save`, this prevents branches from being deleted if they are ahead of or diverged from the default branch.</li> <li>When set to `off`, no additional calls are made.</li></ul> | off                                                                                                      |
| `branches-filter-regex`         | An optional Regex that will be used to filter branches from this action.                                                                                                                                                                                                                                                                                                                                                                                                                                                      | ''                                                                                                       |
| `rate-limit`                    | If this is enabled, the action will stop if it exceeds 95% of the GitHub API rate limit.                                                                                                                                                                                                                                                                                                                                                                                                                                      | true                                                                                                     |
| `pr-check`                      | If this is enabled, the action will first check for incoming/outgoing PRs associated with the branch. If a branch has an active pr, it will be ignored.                                                                                                                                                                                                                                                                                                                                                                       | false                                                                                                    |
| `dry-run`                       | If this is enabled, the action will not delete or tag any branches.                                                                                                                                                                                                                                                                                                                                                                                                                                                           | false                                                                                                    |
| `ignore-issue-interaction`      | If this is enabled, the action will not interact with Github issues.                                                                                                                                                                                                                                                                                                                                                                                                                                                          | false                                                                                                    |
| `include-protected-branches`    | If this is enabled, the action will include branches with legacy branch protection rules in the process.<br>**⚠️ IMPORTANT: When you use this, the token passed to `repo-token` must include "Administration" repository permissions (read)**. This is required to check branch protection rules. See the [Token Permissions](#token-permissions) section below for details.                                                                                                                                             | false                                                                                                    |
| `include-ruleset-branches`      | If this is enabled, the action will include branches protected by repository rulesets in the process.<br>**⚠️ IMPORTANT: When you use this, the token passed to `repo-token` must include "Administration" repository permissions (read)**. This is required to check repository rulesets. See the [Token Permissions](#token-permissions) section below for details.                                                                                                                                                      | false                                                                                                    |
| `ignore-commit-messages`        | Comma-separated list of commit messages (or substrings) to ignore when determining commit age. If provided, commits with these messages will be ignored when calculating branch age. e.g. Ignore commits produced by automated workflows.                                                                                                                                                                                                                                                                                     |
| `ignore-committers`             | Comma-separated list of committer usernames to ignore when calculating the most recent commit.                                                                                                                                                                                                                                                                                                                                                                                                                                | ''                                                                                                       |
| `ignore-default-branch-commits` | If true, ignore commits that are also present in the default branch when determining the last meaningful commit. This fetches all default branch commits up to the staleness window (days-before-delete), ensuring robust filtering even for large/active repos.                                                                                                                                                                                                                                                              | false                                                                                                    |

### Token Permissions

The action requires different GitHub token permissions depending on which features you use:

#### Standard Operation (Default)
For basic stale branch detection and deletion, the default `GITHUB_TOKEN` permissions are sufficient:

```yaml
permissions:
  issues: write
  contents: write
```

**Note:** Commit filtering features (`ignore-commit-messages`, `ignore-committers`, `ignore-default-branch-commits`) work with these standard permissions and require no additional token permissions.

#### Protected Branch Processing

**Legacy Branch Protection (`include-protected-branches: true`):**

Fine-grained personal access token:

- Repository permissions: **Read access to administration**

Classic personal access token:

- `repo` scope (full repository access)

**Repository Rulesets (`include-ruleset-branches: true`):**

Fine-grained personal access token:

- Repository permissions: **Read access to metadata**

Classic personal access token:

- `repo` scope (full repository access)

**Using Both Features:**

Fine-grained personal access token:

- Repository permissions: **Read access to administration and metadata**

Classic personal access token:

- `repo` scope (full repository access)

⚠️ **Important Notes**:

- The default `GITHUB_TOKEN` does not have administration permissions and cannot be used with protected branch features
- For rulesets only, you can use a fine-grained token with just `metadata` permissions
- For legacy branch protection, you need `administration` permissions
- You can enable `include-protected-branches` and `include-ruleset-branches` independently
- Classic tokens require the full `repo` scope due to their coarse-grained nature

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
- Branch protection status is logged for all branches:
  - `protected branch: false (processing)` - unprotected branches
  - `protected branch: true (included)` or `(skipped)` - protected branches

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
          include-protected-branches: false
          include-ruleset-branches: false
          ignore-commit-messages: ''
          ignore-committers: ''
```

### Ignoring Commits by Message, Committer, and Default Branch

You can use `ignore-commit-messages`, `ignore-committers`, and `ignore-default-branch-commits` together. A commit will be ignored if **any** of these conditions match:

- Its message matches any ignored message
- Its committer matches any ignored committer
- Its SHA is present in the default branch (e.g., from a merge or rebase) **within the staleness window**

> **Note:** The action fetches all default branch commits up to the staleness window (days-before-delete), not just a fixed number. This ensures that even old commits in main are ignored if they fall within the relevant window.

This allows you to filter out automated commits, bots, specific users, or commits that are not unique to the feature branch when determining branch staleness.

**Example:**

```yaml
with:
  ignore-commit-messages: 'WIP,auto-update'
  ignore-committers: 'dependabot[bot],github-actions[bot]'
  ignore-default-branch-commits: true
```

This will ignore any commit with a message containing "WIP" or "auto-update", any commit made by the users `dependabot[bot]` or `github-actions[bot]`, and any commit that is also present in the
default branch (such as merges from `main`).

### Using with Repository Rulesets

If your repository uses modern repository rulesets instead of legacy branch protection rules, you can enable only ruleset checking:

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
          repo-token: '${{ secrets.PERSONAL_ACCESS_TOKEN }}'
          include-protected-branches: false  # Disable legacy branch protection checks
          include-ruleset-branches: true     # Enable repository ruleset checks
```

This is particularly useful when using fine-grained personal access tokens that have access to rulesets but not legacy branch protection rules.

## Troubleshooting

### Branch Protection Issues

**Problem**: "All branches are being marked as protected"

- **Cause**: This was a bug in version 8.2.0 where API errors incorrectly marked branches as protected
- **Solution**: Update to the latest version which fixes this issue

**Problem**: "403 Forbidden errors when checking branch protection"

- **Cause**: Your token doesn't have the required permissions for branch protection or rulesets
- **Solution**:
  - If you only need ruleset checking: Use `include-ruleset-branches: true` and `include-protected-branches: false`
  - If you only need legacy branch protection: Use `include-protected-branches: true` and `include-ruleset-branches: false`
  - For both: Ensure your token has "Administration" repository permissions

**API Error Handling**: If GitHub API calls fail, you'll see warning messages but branches will be treated as unprotected to prevent false positives.

## Contributing

Contributions are welcomed. Please read the [contributing](https://github.com/crs-k/stale-branches/blob/main/CONTRIBUTING.md).
