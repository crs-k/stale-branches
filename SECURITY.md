# Security Policy

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 5.x.x   | :white_check_mark: |
| < 5.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

### 1. **Do NOT** open a public issue

Please do not report security vulnerabilities through public GitHub issues.

### 2. Report privately

Send an email to the maintainer with the following information:

- Description of the vulnerability
- Steps to reproduce (if applicable)
- Potential impact
- Suggested fix (if you have one)

### 3. Response timeline

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Initial Assessment**: We will provide an initial assessment within 1 week
- **Fix Development**: We will work on a fix and keep you updated on progress
- **Release**: We will release a patched version and publicly disclose the vulnerability after the fix is available

### 4. Responsible disclosure

We practice responsible disclosure and ask that you:

- Give us a reasonable amount of time to fix the vulnerability before public disclosure
- Avoid accessing or modifying other users' data
- Do not perform actions that could negatively impact other users

## Security Best Practices

When using this action:

1. **Use specific version tags** instead of `@main` or `@latest`
2. **Review action permissions** and use the minimum required permissions
3. **Audit your workflow files** regularly for security issues
4. **Keep dependencies updated** by enabling Dependabot
5. **Use secrets management** for sensitive data like tokens

## Dependencies

This action automatically:

- Updates dependencies through Dependabot
- Runs security audits in CI/CD
- Uses CodeQL for static analysis

If you notice any security issues with dependencies, please report them as described above.
