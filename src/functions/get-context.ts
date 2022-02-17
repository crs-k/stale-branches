import * as core from '@actions/core'
import {context, getOctokit} from '@actions/github'

const repoToken = core.getInput('repo-token', {required: true})
core.setSecret(repoToken)
export const github = getOctokit(repoToken)
export const {owner: owner, repo: repo} = context.repo
export const daysBeforeStale = Number(core.getInput('days-before-stale', {required: false}))
export const daysBeforeDelete = Number(core.getInput('days-before-delete', {required: false}))
export const commentUpdates = core.getBooleanInput('comment-updates', {required: false})
export const maxIssues = Number(core.getInput('max-issues', {required: false}))
export const tagLastComitter = core.getBooleanInput('tag-committer', {required: false})
