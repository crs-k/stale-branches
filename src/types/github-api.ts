export interface RulesetRule {
  type: string
  deletion?: boolean
  ruleset_source_type?: 'Repository' | 'Organization'
  ruleset_source?: string
  ruleset_id?: number
}

export interface RulesetResponse {
  data: RulesetRule[]
}
