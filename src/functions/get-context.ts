import * as core from '@actions/core'
import {context, getOctokit} from '@actions/github'

const repoToken = core.getInput('repo-token', {required: true})
core.setSecret(repoToken)
export const github = getOctokit(repoToken)
export const {owner: owner, repo: repo} = context.repo
