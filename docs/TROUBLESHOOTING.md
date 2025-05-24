# Troubleshooting Guide

## Common Issues

### 1. Permission Errors

**Problem:** Action fails with permission denied errors.

**Solution:**
Ensure your workflow has the necessary permissions:

```yaml
permissions:
  issues: write      # Required for creating/closing issues
  contents: write    # Required for deleting branches
  pull-requests: read # Required if using pr-check
```

For protected branches, you may need admin permissions:
```yaml
permissions:
  administration: read # Required for include-protected-branches
```

### 2. Rate Limit Issues

**Problem:** Action stops due to rate limit exceeded.

**Solutions:**
- Enable rate limiting protection: `rate-limit: true` (default)
- Reduce `max-issues` to process fewer branches per run
- Schedule the action less frequently
- Use a personal access token with higher rate limits

### 3. No Branches Being Processed

**Problem:** Action runs but doesn't find any branches to process.

**Debugging steps:**
1. Check the `branches-filter-regex` input - it might be too restrictive
2. Verify `days-before-stale` isn't too high
3. Check if all branches have recent activity
4. Review the action logs for branch filtering information

### 4. Issues Not Being Created

**Problem:** Stale branches are detected but no issues are created.

**Solutions:**
- Ensure `ignore-issue-interaction: false`
- Check if `max-issues` limit has been reached
- Verify the repository has issues enabled
- Check if `dry-run: false`

### 5. Branches Not Being Deleted

**Problem:** Branches are marked as stale but not deleted.

**Solutions:**
- Wait for branches to exceed `days-before-delete` threshold
- Check if branches are protected or have active pull requests
- Verify `compare-branches` setting (if set to "save", diverged branches won't be deleted)
- Ensure `dry-run: false`

## Debugging Tips

### Enable Detailed Logging

The action provides detailed logging by default. Key information includes:
- Branch processing groups (color-coded)
- Rate limit status
- Issue creation/update status
- Branch comparison results

### Common Configuration Issues

**Incorrect Date Values:**
```yaml
# ❌ Wrong - these values are backwards
days-before-stale: 180
days-before-delete: 120

# ✅ Correct - stale threshold should be less than delete threshold
days-before-stale: 120
days-before-delete: 180
```

**Regex Patterns:**
```yaml
# ❌ Wrong - this excludes everything
branches-filter-regex: '^(?!.*)'

# ✅ Correct - this excludes dependabot branches
branches-filter-regex: '^((?!dependabot))'
```

### Testing Your Configuration

Use `dry-run: true` to test your configuration without making changes:

```yaml
- name: Test Stale Branches Configuration
  uses: crs-k/stale-branches@v5.0.0
  with:
    dry-run: true
    days-before-stale: 7    # Lower for testing
    days-before-delete: 14  # Lower for testing
```

## Performance Optimization

### Large Repositories

For repositories with many branches:
1. Use `branches-filter-regex` to limit scope
2. Set reasonable `max-issues` limits
3. Consider running less frequently
4. Enable `rate-limit` protection

### Reducing API Calls

- Set `compare-branches: off` if not needed
- Disable `pr-check` if not required
- Use `ignore-commit-messages` sparingly

## Getting Help

If you're still experiencing issues:

1. Check the [GitHub Discussions](https://github.com/crs-k/stale-branches/discussions)
2. Review [existing issues](https://github.com/crs-k/stale-branches/issues)
3. Create a new issue with:
   - Your action configuration
   - Relevant logs (with sensitive data removed)
   - Repository context (size, branch protection rules, etc.)
