import * as core from '@actions/core'
import {context, getOctokit} from '@actions/github'

const repoToken = core.getInput('repo-token', {required: true})
core.setSecret(repoToken)
export const github = getOctokit(repoToken)
export const {owner: owner, repo: repo} = context.repo
export const daysBeforeStale = Number(core.getInput('days-before-stale'))
export const daysBeforeDelete = Number(core.getInput('days-before-delete'))
export const commentUpdates = core.getBooleanInput('comment-updates')
export const maxIssues = Number(core.getInput('max-issues'))
export const tagLastCommitter = core.getBooleanInput('tag-committer')
export const staleBranchLabel = String(core.getInput('stale-branch-label'))
