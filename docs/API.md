# API Documentation

## Core Functions

### Main Entry Points

#### `run()`
The main function that orchestrates the stale branch detection and cleanup process.

**Returns:** `Promise<void>`

**Throws:** 
- `StaleBranchesError` - For known application errors
- `ValidationError` - For input validation failures
- `RateLimitError` - When GitHub API rate limits are exceeded

### Branch Processing

#### `getBranches(includeProtectedBranches: boolean)`
Retrieves all branches from the repository.

**Parameters:**
- `includeProtectedBranches` - Whether to include protected branches in the results

**Returns:** `Promise<BranchResponse[]>`

#### `filterBranches(branches: BranchResponse[], regex: string)`
Filters branches based on a regular expression pattern.

**Parameters:**
- `branches` - Array of branch objects to filter
- `regex` - Regular expression pattern for filtering

**Returns:** `Promise<BranchResponse[]>`

### Issue Management

#### `createIssue(branchName, commitAge, lastCommitLogin, daysBeforeDelete, label, tagCommitter)`
Creates a new GitHub issue for a stale branch.

#### `closeIssue(issueNumber: number)`
Closes an existing GitHub issue.

#### `createIssueComment(issueNumber, branchName, commitAge, lastCommitLogin, commentUpdates, daysBeforeDelete, label, tagCommitter)`
Adds a comment to an existing issue with updated branch information.

### Utility Functions

#### `getRecentCommitAge(commitSha: string)`
Gets the age in days of the most recent commit on a branch.

#### `getRecentCommitLogin(commitSha: string)`
Gets the GitHub login of the last committer on a branch.

#### `compareBranches(branchName: string, compareMode: string)`
Compares a branch with the default branch to determine relationship (ahead, behind, diverged, identical).

## Types

### `Inputs`
Configuration object containing all action inputs.

### `BranchResponse`
Represents a branch with its name and latest commit SHA.

### `IssueResponse`
Represents a GitHub issue with title and number.

## Error Handling

The action uses a structured error handling approach with custom error types:

- `StaleBranchesError` - Base error class
- `ValidationError` - Input validation errors
- `RateLimitError` - GitHub API rate limit errors
- `GitHubAPIError` - General GitHub API errors

## Rate Limiting

The action respects GitHub API rate limits by:
- Checking rate limit usage before expensive operations
- Stopping execution when usage exceeds 95%
- Providing detailed logging of rate limit status

## Logging

The action provides color-coded terminal output with grouping:
- 🟢 Green: Active branches
- 🟡 Yellow: Stale branches
- 🔴 Red: Branches to be deleted
- 🔵 Blue: Skipped branches
