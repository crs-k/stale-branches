import * as githubActual from '../../src/functions/get-context'
// eslint-disable-next-line import/named
import {GetResponseTypeFromEndpointMethod} from '@octokit/types'
import {BranchResponse} from '../../src/types/branches'
import {Inputs} from '../../src/types/inputs'

export const context = {
  repo: {
    owner: 'owner',
    repo: 'repo'
  }
}

export const validInputs: Inputs = {
  daysBeforeStale: 1,
  daysBeforeDelete: 150,
  commentUpdates: true,
  maxIssues: 30,
  tagLastCommitter: true,
  staleBranchLabel: 'stale branch 🗑️',
  compareBranches: 'save',
  rateLimit: true,
  prCheck: false,
  dryRun: false,
  ignoreIssueInteraction: false,
  includeProtectedBranches: false,
}

type ListIssuesResponseDataType = GetResponseTypeFromEndpointMethod<typeof githubActual.github.rest.issues.listForRepo>

type ListBranchesResponseDataType = GetResponseTypeFromEndpointMethod<typeof githubActual.github.rest.repos.listBranches>

type ListDefaultBranchResponseDataType = GetResponseTypeFromEndpointMethod<typeof githubActual.github.rest.repos.get>

let defaultBranchResponse: ListDefaultBranchResponseDataType = {
  headers: {},
  status: 200,
  url: 'string',
  data: {
    id: 1296269,
    node_id: 'MDEwOlJlcG9zaXRvcnkxMjk2MjY5',
    name: 'Hello-World',
    full_name: 'octocat/Hello-World',
    owner: {
      login: 'octocat',
      id: 1,
      node_id: 'MDQ6VXNlcjE=',
      avatar_url: 'https://github.com/images/error/octocat_happy.gif',
      gravatar_id: '',
      url: 'https://api.github.com/users/octocat',
      html_url: 'https://github.com/octocat',
      followers_url: 'https://api.github.com/users/octocat/followers',
      following_url: 'https://api.github.com/users/octocat/following{/other_user}',
      gists_url: 'https://api.github.com/users/octocat/gists{/gist_id}',
      starred_url: 'https://api.github.com/users/octocat/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/octocat/subscriptions',
      organizations_url: 'https://api.github.com/users/octocat/orgs',
      repos_url: 'https://api.github.com/users/octocat/repos',
      events_url: 'https://api.github.com/users/octocat/events{/privacy}',
      received_events_url: 'https://api.github.com/users/octocat/received_events',
      type: 'User',
      site_admin: false
    },
    private: false,
    html_url: 'https://github.com/octocat/Hello-World',
    description: 'This your first repo!',
    fork: false,
    url: 'https://api.github.com/repos/octocat/Hello-World',
    archive_url: 'https://api.github.com/repos/octocat/Hello-World/{archive_format}{/ref}',
    assignees_url: 'https://api.github.com/repos/octocat/Hello-World/assignees{/user}',
    blobs_url: 'https://api.github.com/repos/octocat/Hello-World/git/blobs{/sha}',
    branches_url: 'https://api.github.com/repos/octocat/Hello-World/branches{/branch}',
    collaborators_url: 'https://api.github.com/repos/octocat/Hello-World/collaborators{/collaborator}',
    comments_url: 'https://api.github.com/repos/octocat/Hello-World/comments{/number}',
    commits_url: 'https://api.github.com/repos/octocat/Hello-World/commits{/sha}',
    compare_url: 'https://api.github.com/repos/octocat/Hello-World/compare/{base}...{head}',
    contents_url: 'https://api.github.com/repos/octocat/Hello-World/contents/{+path}',
    contributors_url: 'https://api.github.com/repos/octocat/Hello-World/contributors',
    deployments_url: 'https://api.github.com/repos/octocat/Hello-World/deployments',
    downloads_url: 'https://api.github.com/repos/octocat/Hello-World/downloads',
    events_url: 'https://api.github.com/repos/octocat/Hello-World/events',
    forks_url: 'https://api.github.com/repos/octocat/Hello-World/forks',
    git_commits_url: 'https://api.github.com/repos/octocat/Hello-World/git/commits{/sha}',
    git_refs_url: 'https://api.github.com/repos/octocat/Hello-World/git/refs{/sha}',
    git_tags_url: 'https://api.github.com/repos/octocat/Hello-World/git/tags{/sha}',
    git_url: 'git:github.com/octocat/Hello-World.git',
    issue_comment_url: 'https://api.github.com/repos/octocat/Hello-World/issues/comments{/number}',
    issue_events_url: 'https://api.github.com/repos/octocat/Hello-World/issues/events{/number}',
    issues_url: 'https://api.github.com/repos/octocat/Hello-World/issues{/number}',
    keys_url: 'https://api.github.com/repos/octocat/Hello-World/keys{/key_id}',
    labels_url: 'https://api.github.com/repos/octocat/Hello-World/labels{/name}',
    languages_url: 'https://api.github.com/repos/octocat/Hello-World/languages',
    merges_url: 'https://api.github.com/repos/octocat/Hello-World/merges',
    milestones_url: 'https://api.github.com/repos/octocat/Hello-World/milestones{/number}',
    notifications_url: 'https://api.github.com/repos/octocat/Hello-World/notifications{?since,all,participating}',
    pulls_url: 'https://api.github.com/repos/octocat/Hello-World/pulls{/number}',
    releases_url: 'https://api.github.com/repos/octocat/Hello-World/releases{/id}',
    ssh_url: 'git@github.com:octocat/Hello-World.git',
    stargazers_url: 'https://api.github.com/repos/octocat/Hello-World/stargazers',
    statuses_url: 'https://api.github.com/repos/octocat/Hello-World/statuses/{sha}',
    subscribers_url: 'https://api.github.com/repos/octocat/Hello-World/subscribers',
    subscription_url: 'https://api.github.com/repos/octocat/Hello-World/subscription',
    tags_url: 'https://api.github.com/repos/octocat/Hello-World/tags',
    teams_url: 'https://api.github.com/repos/octocat/Hello-World/teams',
    trees_url: 'https://api.github.com/repos/octocat/Hello-World/git/trees{/sha}',
    clone_url: 'https://github.com/octocat/Hello-World.git',
    mirror_url: 'git:git.example.com/octocat/Hello-World',
    hooks_url: 'https://api.github.com/repos/octocat/Hello-World/hooks',
    svn_url: 'https://svn.github.com/octocat/Hello-World',
    homepage: 'https://github.com',
    language: null,
    forks_count: 9,
    forks: 9,
    stargazers_count: 80,
    watchers_count: 80,
    watchers: 80,
    size: 108,
    default_branch: 'master',
    open_issues_count: 0,
    open_issues: 0,
    is_template: false,
    topics: ['octocat', 'atom', 'electron', 'api'],
    has_issues: true,
    has_projects: true,
    has_wiki: true,
    has_pages: false,
    has_downloads: true,
    has_discussions: true,
    archived: false,
    disabled: false,
    visibility: 'public',
    pushed_at: '2011-01-26T19:06:43Z',
    created_at: '2011-01-26T19:01:12Z',
    updated_at: '2011-01-26T19:14:43Z',
    permissions: {
      pull: true,
      push: false,
      admin: false
    },
    allow_rebase_merge: true,
    template_repository: {
      id: 1296269,
      node_id: 'MDEwOlJlcG9zaXRvcnkxMjk2MjY5',
      name: 'Hello-World-Template',
      full_name: 'octocat/Hello-World-Template',
      owner: {
        login: 'octocat',
        id: 1,
        node_id: 'MDQ6VXNlcjE=',
        avatar_url: 'https://github.com/images/error/octocat_happy.gif',
        gravatar_id: '',
        url: 'https://api.github.com/users/octocat',
        html_url: 'https://github.com/octocat',
        followers_url: 'https://api.github.com/users/octocat/followers',
        following_url: 'https://api.github.com/users/octocat/following{/other_user}',
        gists_url: 'https://api.github.com/users/octocat/gists{/gist_id}',
        starred_url: 'https://api.github.com/users/octocat/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/octocat/subscriptions',
        organizations_url: 'https://api.github.com/users/octocat/orgs',
        repos_url: 'https://api.github.com/users/octocat/repos',
        events_url: 'https://api.github.com/users/octocat/events{/privacy}',
        received_events_url: 'https://api.github.com/users/octocat/received_events',
        type: 'User',
        site_admin: false
      },
      private: false,
      html_url: 'https://github.com/octocat/Hello-World-Template',
      description: 'This your first repo!',
      fork: false,
      url: 'https://api.github.com/repos/octocat/Hello-World-Template',
      archive_url: 'https://api.github.com/repos/octocat/Hello-World-Template/{archive_format}{/ref}',
      assignees_url: 'https://api.github.com/repos/octocat/Hello-World-Template/assignees{/user}',
      blobs_url: 'https://api.github.com/repos/octocat/Hello-World-Template/git/blobs{/sha}',
      branches_url: 'https://api.github.com/repos/octocat/Hello-World-Template/branches{/branch}',
      collaborators_url: 'https://api.github.com/repos/octocat/Hello-World-Template/collaborators{/collaborator}',
      comments_url: 'https://api.github.com/repos/octocat/Hello-World-Template/comments{/number}',
      commits_url: 'https://api.github.com/repos/octocat/Hello-World-Template/commits{/sha}',
      compare_url: 'https://api.github.com/repos/octocat/Hello-World-Template/compare/{base}...{head}',
      contents_url: 'https://api.github.com/repos/octocat/Hello-World-Template/contents/{+path}',
      contributors_url: 'https://api.github.com/repos/octocat/Hello-World-Template/contributors',
      deployments_url: 'https://api.github.com/repos/octocat/Hello-World-Template/deployments',
      downloads_url: 'https://api.github.com/repos/octocat/Hello-World-Template/downloads',
      events_url: 'https://api.github.com/repos/octocat/Hello-World-Template/events',
      forks_url: 'https://api.github.com/repos/octocat/Hello-World-Template/forks',
      git_commits_url: 'https://api.github.com/repos/octocat/Hello-World-Template/git/commits{/sha}',
      git_refs_url: 'https://api.github.com/repos/octocat/Hello-World-Template/git/refs{/sha}',
      git_tags_url: 'https://api.github.com/repos/octocat/Hello-World-Template/git/tags{/sha}',
      git_url: 'git:github.com/octocat/Hello-World-Template.git',
      issue_comment_url: 'https://api.github.com/repos/octocat/Hello-World-Template/issues/comments{/number}',
      issue_events_url: 'https://api.github.com/repos/octocat/Hello-World-Template/issues/events{/number}',
      issues_url: 'https://api.github.com/repos/octocat/Hello-World-Template/issues{/number}',
      keys_url: 'https://api.github.com/repos/octocat/Hello-World-Template/keys{/key_id}',
      labels_url: 'https://api.github.com/repos/octocat/Hello-World-Template/labels{/name}',
      languages_url: 'https://api.github.com/repos/octocat/Hello-World-Template/languages',
      merges_url: 'https://api.github.com/repos/octocat/Hello-World-Template/merges',
      milestones_url: 'https://api.github.com/repos/octocat/Hello-World-Template/milestones{/number}',
      notifications_url: 'https://api.github.com/repos/octocat/Hello-World-Template/notifications{?since,all,participating}',
      pulls_url: 'https://api.github.com/repos/octocat/Hello-World-Template/pulls{/number}',
      releases_url: 'https://api.github.com/repos/octocat/Hello-World-Template/releases{/id}',
      ssh_url: 'git@github.com:octocat/Hello-World-Template.git',
      stargazers_url: 'https://api.github.com/repos/octocat/Hello-World-Template/stargazers',
      statuses_url: 'https://api.github.com/repos/octocat/Hello-World-Template/statuses/{sha}',
      subscribers_url: 'https://api.github.com/repos/octocat/Hello-World-Template/subscribers',
      subscription_url: 'https://api.github.com/repos/octocat/Hello-World-Template/subscription',
      tags_url: 'https://api.github.com/repos/octocat/Hello-World-Template/tags',
      teams_url: 'https://api.github.com/repos/octocat/Hello-World-Template/teams',
      trees_url: 'https://api.github.com/repos/octocat/Hello-World-Template/git/trees{/sha}',
      clone_url: 'https://github.com/octocat/Hello-World-Template.git',
      mirror_url: 'git:git.example.com/octocat/Hello-World-Template',
      hooks_url: 'https://api.github.com/repos/octocat/Hello-World-Template/hooks',
      svn_url: 'https://svn.github.com/octocat/Hello-World-Template',
      homepage: 'https://github.com',
      language: null,
      forks: 9,
      forks_count: 9,
      stargazers_count: 80,
      watchers_count: 80,
      watchers: 80,
      size: 108,
      default_branch: 'master',
      open_issues: 0,
      open_issues_count: 0,
      is_template: true,
      license: {
        key: 'mit',
        name: 'MIT License',
        url: 'https://api.github.com/licenses/mit',
        spdx_id: 'MIT',
        node_id: 'MDc6TGljZW5zZW1pdA==',
        html_url: 'https://api.github.com/licenses/mit'
      },
      topics: ['octocat', 'atom', 'electron', 'api'],
      has_issues: true,
      has_projects: true,
      has_wiki: true,
      has_pages: false,
      has_downloads: true,
      archived: false,
      disabled: false,
      visibility: 'public',
      pushed_at: '2011-01-26T19:06:43Z',
      created_at: '2011-01-26T19:01:12Z',
      updated_at: '2011-01-26T19:14:43Z',
      permissions: {
        admin: false,
        push: false,
        pull: true
      },
      allow_rebase_merge: true,
      temp_clone_token: 'ABTLWHOULUVAXGTRYU7OC2876QJ2O',
      allow_squash_merge: true,
      allow_auto_merge: false,
      delete_branch_on_merge: true,
      allow_merge_commit: true,
      subscribers_count: 42,
      network_count: 0
    },
    temp_clone_token: 'ABTLWHOULUVAXGTRYU7OC2876QJ2O',
    allow_squash_merge: true,
    allow_auto_merge: false,
    delete_branch_on_merge: true,
    allow_merge_commit: true,
    subscribers_count: 42,
    network_count: 0,
    license: {
      key: 'mit',
      name: 'MIT License',
      spdx_id: 'MIT',
      url: 'https://api.github.com/licenses/mit',
      node_id: 'MDc6TGljZW5zZW1pdA=='
    },
    organization: {
      login: 'octocat',
      id: 1,
      node_id: 'MDQ6VXNlcjE=',
      avatar_url: 'https://github.com/images/error/octocat_happy.gif',
      gravatar_id: '',
      url: 'https://api.github.com/users/octocat',
      html_url: 'https://github.com/octocat',
      followers_url: 'https://api.github.com/users/octocat/followers',
      following_url: 'https://api.github.com/users/octocat/following{/other_user}',
      gists_url: 'https://api.github.com/users/octocat/gists{/gist_id}',
      starred_url: 'https://api.github.com/users/octocat/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/octocat/subscriptions',
      organizations_url: 'https://api.github.com/users/octocat/orgs',
      repos_url: 'https://api.github.com/users/octocat/repos',
      events_url: 'https://api.github.com/users/octocat/events{/privacy}',
      received_events_url: 'https://api.github.com/users/octocat/received_events',
      type: 'Organization',
      site_admin: false
    },
    parent: {
      id: 1296269,
      node_id: 'MDEwOlJlcG9zaXRvcnkxMjk2MjY5',
      name: 'Hello-World',
      full_name: 'octocat/Hello-World',
      owner: {
        login: 'octocat',
        id: 1,
        node_id: 'MDQ6VXNlcjE=',
        avatar_url: 'https://github.com/images/error/octocat_happy.gif',
        gravatar_id: '',
        url: 'https://api.github.com/users/octocat',
        html_url: 'https://github.com/octocat',
        followers_url: 'https://api.github.com/users/octocat/followers',
        following_url: 'https://api.github.com/users/octocat/following{/other_user}',
        gists_url: 'https://api.github.com/users/octocat/gists{/gist_id}',
        starred_url: 'https://api.github.com/users/octocat/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/octocat/subscriptions',
        organizations_url: 'https://api.github.com/users/octocat/orgs',
        repos_url: 'https://api.github.com/users/octocat/repos',
        events_url: 'https://api.github.com/users/octocat/events{/privacy}',
        received_events_url: 'https://api.github.com/users/octocat/received_events',
        type: 'User',
        site_admin: false
      },
      private: false,
      html_url: 'https://github.com/octocat/Hello-World',
      description: 'This your first repo!',
      fork: false,
      url: 'https://api.github.com/repos/octocat/Hello-World',
      archive_url: 'https://api.github.com/repos/octocat/Hello-World/{archive_format}{/ref}',
      assignees_url: 'https://api.github.com/repos/octocat/Hello-World/assignees{/user}',
      blobs_url: 'https://api.github.com/repos/octocat/Hello-World/git/blobs{/sha}',
      branches_url: 'https://api.github.com/repos/octocat/Hello-World/branches{/branch}',
      collaborators_url: 'https://api.github.com/repos/octocat/Hello-World/collaborators{/collaborator}',
      comments_url: 'https://api.github.com/repos/octocat/Hello-World/comments{/number}',
      commits_url: 'https://api.github.com/repos/octocat/Hello-World/commits{/sha}',
      compare_url: 'https://api.github.com/repos/octocat/Hello-World/compare/{base}...{head}',
      contents_url: 'https://api.github.com/repos/octocat/Hello-World/contents/{+path}',
      contributors_url: 'https://api.github.com/repos/octocat/Hello-World/contributors',
      deployments_url: 'https://api.github.com/repos/octocat/Hello-World/deployments',
      downloads_url: 'https://api.github.com/repos/octocat/Hello-World/downloads',
      events_url: 'https://api.github.com/repos/octocat/Hello-World/events',
      forks_url: 'https://api.github.com/repos/octocat/Hello-World/forks',
      git_commits_url: 'https://api.github.com/repos/octocat/Hello-World/git/commits{/sha}',
      git_refs_url: 'https://api.github.com/repos/octocat/Hello-World/git/refs{/sha}',
      git_tags_url: 'https://api.github.com/repos/octocat/Hello-World/git/tags{/sha}',
      git_url: 'git:github.com/octocat/Hello-World.git',
      issue_comment_url: 'https://api.github.com/repos/octocat/Hello-World/issues/comments{/number}',
      issue_events_url: 'https://api.github.com/repos/octocat/Hello-World/issues/events{/number}',
      issues_url: 'https://api.github.com/repos/octocat/Hello-World/issues{/number}',
      keys_url: 'https://api.github.com/repos/octocat/Hello-World/keys{/key_id}',
      labels_url: 'https://api.github.com/repos/octocat/Hello-World/labels{/name}',
      languages_url: 'https://api.github.com/repos/octocat/Hello-World/languages',
      merges_url: 'https://api.github.com/repos/octocat/Hello-World/merges',
      milestones_url: 'https://api.github.com/repos/octocat/Hello-World/milestones{/number}',
      notifications_url: 'https://api.github.com/repos/octocat/Hello-World/notifications{?since,all,participating}',
      pulls_url: 'https://api.github.com/repos/octocat/Hello-World/pulls{/number}',
      releases_url: 'https://api.github.com/repos/octocat/Hello-World/releases{/id}',
      ssh_url: 'git@github.com:octocat/Hello-World.git',
      stargazers_url: 'https://api.github.com/repos/octocat/Hello-World/stargazers',
      statuses_url: 'https://api.github.com/repos/octocat/Hello-World/statuses/{sha}',
      subscribers_url: 'https://api.github.com/repos/octocat/Hello-World/subscribers',
      subscription_url: 'https://api.github.com/repos/octocat/Hello-World/subscription',
      tags_url: 'https://api.github.com/repos/octocat/Hello-World/tags',
      teams_url: 'https://api.github.com/repos/octocat/Hello-World/teams',
      trees_url: 'https://api.github.com/repos/octocat/Hello-World/git/trees{/sha}',
      clone_url: 'https://github.com/octocat/Hello-World.git',
      mirror_url: 'git:git.example.com/octocat/Hello-World',
      hooks_url: 'https://api.github.com/repos/octocat/Hello-World/hooks',
      svn_url: 'https://svn.github.com/octocat/Hello-World',
      homepage: 'https://github.com',
      language: null,
      forks_count: 9,
      stargazers_count: 80,
      watchers_count: 80,
      size: 108,
      default_branch: 'master',
      open_issues_count: 0,
      is_template: true,
      topics: ['octocat', 'atom', 'electron', 'api'],
      has_issues: true,
      has_projects: true,
      has_wiki: true,
      has_pages: false,
      has_downloads: true,
      archived: false,
      disabled: false,
      visibility: 'public',
      pushed_at: '2011-01-26T19:06:43Z',
      created_at: '2011-01-26T19:01:12Z',
      updated_at: '2011-01-26T19:14:43Z',
      permissions: {
        admin: false,
        push: false,
        pull: true
      },
      allow_rebase_merge: true,
      temp_clone_token: 'ABTLWHOULUVAXGTRYU7OC2876QJ2O',
      allow_squash_merge: true,
      allow_auto_merge: false,
      delete_branch_on_merge: true,
      allow_merge_commit: true,
      subscribers_count: 42,
      network_count: 0,
      license: {
        key: 'mit',
        name: 'MIT License',
        url: 'https://api.github.com/licenses/mit',
        spdx_id: 'MIT',
        node_id: 'MDc6TGljZW5zZW1pdA==',
        html_url: 'https://api.github.com/licenses/mit'
      },
      forks: 1,
      open_issues: 1,
      watchers: 1
    },
    source: {
      id: 1296269,
      node_id: 'MDEwOlJlcG9zaXRvcnkxMjk2MjY5',
      name: 'Hello-World',
      full_name: 'octocat/Hello-World',
      owner: {
        login: 'octocat',
        id: 1,
        node_id: 'MDQ6VXNlcjE=',
        avatar_url: 'https://github.com/images/error/octocat_happy.gif',
        gravatar_id: '',
        url: 'https://api.github.com/users/octocat',
        html_url: 'https://github.com/octocat',
        followers_url: 'https://api.github.com/users/octocat/followers',
        following_url: 'https://api.github.com/users/octocat/following{/other_user}',
        gists_url: 'https://api.github.com/users/octocat/gists{/gist_id}',
        starred_url: 'https://api.github.com/users/octocat/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/octocat/subscriptions',
        organizations_url: 'https://api.github.com/users/octocat/orgs',
        repos_url: 'https://api.github.com/users/octocat/repos',
        events_url: 'https://api.github.com/users/octocat/events{/privacy}',
        received_events_url: 'https://api.github.com/users/octocat/received_events',
        type: 'User',
        site_admin: false
      },
      private: false,
      html_url: 'https://github.com/octocat/Hello-World',
      description: 'This your first repo!',
      fork: false,
      url: 'https://api.github.com/repos/octocat/Hello-World',
      archive_url: 'https://api.github.com/repos/octocat/Hello-World/{archive_format}{/ref}',
      assignees_url: 'https://api.github.com/repos/octocat/Hello-World/assignees{/user}',
      blobs_url: 'https://api.github.com/repos/octocat/Hello-World/git/blobs{/sha}',
      branches_url: 'https://api.github.com/repos/octocat/Hello-World/branches{/branch}',
      collaborators_url: 'https://api.github.com/repos/octocat/Hello-World/collaborators{/collaborator}',
      comments_url: 'https://api.github.com/repos/octocat/Hello-World/comments{/number}',
      commits_url: 'https://api.github.com/repos/octocat/Hello-World/commits{/sha}',
      compare_url: 'https://api.github.com/repos/octocat/Hello-World/compare/{base}...{head}',
      contents_url: 'https://api.github.com/repos/octocat/Hello-World/contents/{+path}',
      contributors_url: 'https://api.github.com/repos/octocat/Hello-World/contributors',
      deployments_url: 'https://api.github.com/repos/octocat/Hello-World/deployments',
      downloads_url: 'https://api.github.com/repos/octocat/Hello-World/downloads',
      events_url: 'https://api.github.com/repos/octocat/Hello-World/events',
      forks_url: 'https://api.github.com/repos/octocat/Hello-World/forks',
      git_commits_url: 'https://api.github.com/repos/octocat/Hello-World/git/commits{/sha}',
      git_refs_url: 'https://api.github.com/repos/octocat/Hello-World/git/refs{/sha}',
      git_tags_url: 'https://api.github.com/repos/octocat/Hello-World/git/tags{/sha}',
      git_url: 'git:github.com/octocat/Hello-World.git',
      issue_comment_url: 'https://api.github.com/repos/octocat/Hello-World/issues/comments{/number}',
      issue_events_url: 'https://api.github.com/repos/octocat/Hello-World/issues/events{/number}',
      issues_url: 'https://api.github.com/repos/octocat/Hello-World/issues{/number}',
      keys_url: 'https://api.github.com/repos/octocat/Hello-World/keys{/key_id}',
      labels_url: 'https://api.github.com/repos/octocat/Hello-World/labels{/name}',
      languages_url: 'https://api.github.com/repos/octocat/Hello-World/languages',
      merges_url: 'https://api.github.com/repos/octocat/Hello-World/merges',
      milestones_url: 'https://api.github.com/repos/octocat/Hello-World/milestones{/number}',
      notifications_url: 'https://api.github.com/repos/octocat/Hello-World/notifications{?since,all,participating}',
      pulls_url: 'https://api.github.com/repos/octocat/Hello-World/pulls{/number}',
      releases_url: 'https://api.github.com/repos/octocat/Hello-World/releases{/id}',
      ssh_url: 'git@github.com:octocat/Hello-World.git',
      stargazers_url: 'https://api.github.com/repos/octocat/Hello-World/stargazers',
      statuses_url: 'https://api.github.com/repos/octocat/Hello-World/statuses/{sha}',
      subscribers_url: 'https://api.github.com/repos/octocat/Hello-World/subscribers',
      subscription_url: 'https://api.github.com/repos/octocat/Hello-World/subscription',
      tags_url: 'https://api.github.com/repos/octocat/Hello-World/tags',
      teams_url: 'https://api.github.com/repos/octocat/Hello-World/teams',
      trees_url: 'https://api.github.com/repos/octocat/Hello-World/git/trees{/sha}',
      clone_url: 'https://github.com/octocat/Hello-World.git',
      mirror_url: 'git:git.example.com/octocat/Hello-World',
      hooks_url: 'https://api.github.com/repos/octocat/Hello-World/hooks',
      svn_url: 'https://svn.github.com/octocat/Hello-World',
      homepage: 'https://github.com',
      language: null,
      forks_count: 9,
      stargazers_count: 80,
      watchers_count: 80,
      size: 108,
      default_branch: 'master',
      open_issues_count: 0,
      is_template: true,
      topics: ['octocat', 'atom', 'electron', 'api'],
      has_issues: true,
      has_projects: true,
      has_wiki: true,
      has_pages: false,
      has_downloads: true,
      archived: false,
      disabled: false,
      visibility: 'public',
      pushed_at: '2011-01-26T19:06:43Z',
      created_at: '2011-01-26T19:01:12Z',
      updated_at: '2011-01-26T19:14:43Z',
      permissions: {
        admin: false,
        push: false,
        pull: true
      },
      allow_rebase_merge: true,
      temp_clone_token: 'ABTLWHOULUVAXGTRYU7OC2876QJ2O',
      allow_squash_merge: true,
      allow_auto_merge: false,
      delete_branch_on_merge: true,
      allow_merge_commit: true,
      subscribers_count: 42,
      network_count: 0,
      license: {
        key: 'mit',
        name: 'MIT License',
        url: 'https://api.github.com/licenses/mit',
        spdx_id: 'MIT',
        node_id: 'MDc6TGljZW5zZW1pdA==',
        html_url: 'https://api.github.com/licenses/mit'
      },
      forks: 1,
      open_issues: 1,
      watchers: 1
    }
  }
}

let branchesFiltered: BranchResponse[] = [
  {branchName: 'Branch 1', commmitSha: 'SHA 1'},
  {branchName: 'Branch 2', commmitSha: 'SHA 2'},
  {branchName: 'Branch 3', commmitSha: 'SHA 3'},
  {branchName: 'Branch 4', commmitSha: 'SHA 4'},
  {branchName: 'Branch 5', commmitSha: 'SHA 5'},
  {branchName: 'Branch 6', commmitSha: 'SHA 6'}
]

let branches: ListBranchesResponseDataType = {
  headers: {},
  status: 200,
  url: 'string',
  data: [
    {
      name: 'main',
      commit: {
        sha: 'c5b97d5ae6c19d5c5df71a34c7fbeeda2479ccbc',
        url: 'https://api.github.com/repos/octocat/Hello-World/commits/c5b97d5ae6c19d5c5df71a34c7fbeeda2479ccbc'
      },
      protected: true,
      protection: {

      },
      protection_url: 'https://api.github.com/repos/octocat/hello-world/branches/master/protection'
    }
  ]
}

let issues: ListIssuesResponseDataType = {
  headers: {},
  status: 200,
  url: 'string',
  data: [
    {
      id: 1,
      node_id: 'MDU6SXNzdWUx',
      url: 'https://api.github.com/repos/octocat/Hello-World/issues/1347',
      repository_url: 'https://api.github.com/repos/octocat/Hello-World',
      labels_url: 'https://api.github.com/repos/octocat/Hello-World/issues/1347/labels{/name}',
      comments_url: 'https://api.github.com/repos/octocat/Hello-World/issues/1347/comments',
      events_url: 'https://api.github.com/repos/octocat/Hello-World/issues/1347/events',
      html_url: 'https://github.com/octocat/Hello-World/issues/1347',
      number: 1347,
      state: 'open',
      title: 'Found a bug',
      body: "I'm having a problem with this.",
      user: {
        login: 'octocat',
        id: 1,
        node_id: 'MDQ6VXNlcjE=',
        avatar_url: 'https://github.com/images/error/octocat_happy.gif',
        gravatar_id: '',
        url: 'https://api.github.com/users/octocat',
        html_url: 'https://github.com/octocat',
        followers_url: 'https://api.github.com/users/octocat/followers',
        following_url: 'https://api.github.com/users/octocat/following{/other_user}',
        gists_url: 'https://api.github.com/users/octocat/gists{/gist_id}',
        starred_url: 'https://api.github.com/users/octocat/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/octocat/subscriptions',
        organizations_url: 'https://api.github.com/users/octocat/orgs',
        repos_url: 'https://api.github.com/users/octocat/repos',
        events_url: 'https://api.github.com/users/octocat/events{/privacy}',
        received_events_url: 'https://api.github.com/users/octocat/received_events',
        type: 'User',
        site_admin: false
      },
      labels: [
        {
          id: 208045946,
          node_id: 'MDU6TGFiZWwyMDgwNDU5NDY=',
          url: 'https://api.github.com/repos/octocat/Hello-World/labels/bug',
          name: 'bug',
          description: "Something isn't working",
          color: 'f29513',
          default: true
        }
      ],
      assignee: {
        login: 'octocat',
        id: 1,
        node_id: 'MDQ6VXNlcjE=',
        avatar_url: 'https://github.com/images/error/octocat_happy.gif',
        gravatar_id: '',
        url: 'https://api.github.com/users/octocat',
        html_url: 'https://github.com/octocat',
        followers_url: 'https://api.github.com/users/octocat/followers',
        following_url: 'https://api.github.com/users/octocat/following{/other_user}',
        gists_url: 'https://api.github.com/users/octocat/gists{/gist_id}',
        starred_url: 'https://api.github.com/users/octocat/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/octocat/subscriptions',
        organizations_url: 'https://api.github.com/users/octocat/orgs',
        repos_url: 'https://api.github.com/users/octocat/repos',
        events_url: 'https://api.github.com/users/octocat/events{/privacy}',
        received_events_url: 'https://api.github.com/users/octocat/received_events',
        type: 'User',
        site_admin: false
      },
      assignees: [
        {
          login: 'octocat',
          id: 1,
          node_id: 'MDQ6VXNlcjE=',
          avatar_url: 'https://github.com/images/error/octocat_happy.gif',
          gravatar_id: '',
          url: 'https://api.github.com/users/octocat',
          html_url: 'https://github.com/octocat',
          followers_url: 'https://api.github.com/users/octocat/followers',
          following_url: 'https://api.github.com/users/octocat/following{/other_user}',
          gists_url: 'https://api.github.com/users/octocat/gists{/gist_id}',
          starred_url: 'https://api.github.com/users/octocat/starred{/owner}{/repo}',
          subscriptions_url: 'https://api.github.com/users/octocat/subscriptions',
          organizations_url: 'https://api.github.com/users/octocat/orgs',
          repos_url: 'https://api.github.com/users/octocat/repos',
          events_url: 'https://api.github.com/users/octocat/events{/privacy}',
          received_events_url: 'https://api.github.com/users/octocat/received_events',
          type: 'User',
          site_admin: false
        }
      ],
      milestone: {
        url: 'https://api.github.com/repos/octocat/Hello-World/milestones/1',
        html_url: 'https://github.com/octocat/Hello-World/milestones/v1.0',
        labels_url: 'https://api.github.com/repos/octocat/Hello-World/milestones/1/labels',
        id: 1002604,
        node_id: 'MDk6TWlsZXN0b25lMTAwMjYwNA==',
        number: 1,
        state: 'open',
        title: 'v1.0',
        description: 'Tracking milestone for version 1.0',
        creator: {
          login: 'octocat',
          id: 1,
          node_id: 'MDQ6VXNlcjE=',
          avatar_url: 'https://github.com/images/error/octocat_happy.gif',
          gravatar_id: '',
          url: 'https://api.github.com/users/octocat',
          html_url: 'https://github.com/octocat',
          followers_url: 'https://api.github.com/users/octocat/followers',
          following_url: 'https://api.github.com/users/octocat/following{/other_user}',
          gists_url: 'https://api.github.com/users/octocat/gists{/gist_id}',
          starred_url: 'https://api.github.com/users/octocat/starred{/owner}{/repo}',
          subscriptions_url: 'https://api.github.com/users/octocat/subscriptions',
          organizations_url: 'https://api.github.com/users/octocat/orgs',
          repos_url: 'https://api.github.com/users/octocat/repos',
          events_url: 'https://api.github.com/users/octocat/events{/privacy}',
          received_events_url: 'https://api.github.com/users/octocat/received_events',
          type: 'User',
          site_admin: false
        },
        open_issues: 4,
        closed_issues: 8,
        created_at: '2011-04-10T20:09:31Z',
        updated_at: '2014-03-03T18:58:10Z',
        closed_at: '2013-02-12T13:22:01Z',
        due_on: '2012-10-09T23:39:01Z'
      },
      locked: true,
      active_lock_reason: 'too heated',
      comments: 0,
      pull_request: {
        url: 'https://api.github.com/repos/octocat/Hello-World/pulls/1347',
        html_url: 'https://github.com/octocat/Hello-World/pull/1347',
        diff_url: 'https://github.com/octocat/Hello-World/pull/1347.diff',
        patch_url: 'https://github.com/octocat/Hello-World/pull/1347.patch'
      },
      closed_at: null,
      created_at: '2011-04-22T13:33:48Z',
      updated_at: '2011-04-22T13:33:48Z',
      closed_by: {
        login: 'octocat',
        id: 1,
        node_id: 'MDQ6VXNlcjE=',
        avatar_url: 'https://github.com/images/error/octocat_happy.gif',
        gravatar_id: '',
        url: 'https://api.github.com/users/octocat',
        html_url: 'https://github.com/octocat',
        followers_url: 'https://api.github.com/users/octocat/followers',
        following_url: 'https://api.github.com/users/octocat/following{/other_user}',
        gists_url: 'https://api.github.com/users/octocat/gists{/gist_id}',
        starred_url: 'https://api.github.com/users/octocat/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/octocat/subscriptions',
        organizations_url: 'https://api.github.com/users/octocat/orgs',
        repos_url: 'https://api.github.com/users/octocat/repos',
        events_url: 'https://api.github.com/users/octocat/events{/privacy}',
        received_events_url: 'https://api.github.com/users/octocat/received_events',
        type: 'User',
        site_admin: false
      },
      author_association: 'COLLABORATOR'
    }
  ]
}

let update = jest.fn().mockReturnValue({
  data: {issue_number: 1, owner: 'owner', repo: 'repo', state: 'closed'}
})

let create = jest.fn().mockReturnValue({
  data: {id: 1, owner: 'owner', repo: 'repo'}
})

let deleteRef = jest.fn().mockReturnValue({
  data: {id: 1, owner: 'owner', repo: 'repo'}
})

let listBranches = jest.fn().mockReturnValue(branches)

let getCommit = jest.fn().mockReturnValue({
  data: {
    id: 1,
    commit: {committer: {date: 'January 25, 2006'}},
    repo: 'repo',
    committer: {login: 'crs-k'}
  }
})

let compareCommitsWithBasehead = jest.fn().mockReturnValue({
  data: {
    ahead_by: 1,
    behind_by: 2,
    status: 'diverged',
    total_commits: 3
  }
})

let listForRepo = jest.fn().mockReturnValue(issues)

let createComment = jest.fn().mockReturnValue({
  data: {id: 1, owner: 'owner', repo: 'repo'}
})

let paginate = jest.fn().mockReturnValue(branchesFiltered)

let get = jest.fn().mockReturnValue(defaultBranchResponse)

// Mock for getRateLimit
let getRateLimit = jest.fn().mockReturnValue({
  data: {
    resources: {
      core: {
        limit: 5000,
        used: 1000,
        remaining: 4000,
        reset: 1640995200
      }
    }
  }
})

// Mock for getPr
let pullsList = jest.fn().mockReturnValue({data: []})

const github = {
  rest: {
    git: {deleteRef},
    issues: {
      update,
      create,
      listForRepo,
      createComment
    },
    repos: {
      get,
      listBranches,
      getCommit,
      compareCommitsWithBasehead
    },
    rateLimit: {
      get: getRateLimit
    },
    pulls: {
      list: pullsList
    }
  },
  paginate
}

export const getOctokit = jest.fn().mockImplementation(() => github)
