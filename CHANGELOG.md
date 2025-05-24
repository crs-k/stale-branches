# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Enhanced TypeScript configuration with stricter type checking
- Improved error handling with custom error types
- Modular architecture with separated concerns
- Better test setup and configuration
- Enhanced security with updated dependencies

### Changed
- Modernized Jest configuration to TypeScript
- Updated build output from `lib/` to `dist/` for consistency
- Improved package.json scripts with additional utilities
- Enhanced ESLint configuration for better code quality

### Fixed
- Security vulnerabilities in dependencies
- Build output path consistency between action.yml and package.json
- TypeScript strict mode compliance

### Security
- Updated dependencies to fix moderate security vulnerabilities
- Added audit fixes for @babel/helpers and micromatch

## [5.0.0] - Previous Release

### Added
- Initial version of stale branches action
- Support for protected branches
- Branch comparison functionality
- Pull request checking
- Dry run mode
- Issue interaction controls

### Features
- Configurable days before stale/delete
- Branch filtering with regex
- Rate limiting protection
- Commit message filtering
- Comprehensive logging with colored output
