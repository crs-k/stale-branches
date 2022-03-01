export interface RateLimit {
  /**
   * The total limit allocated
   */
  limit: number

  /**
   * The amount left
   */
  remaining: number

  /**
   * The epoch time of reset
   */
  reset: number

  /**
   * The amount used
   */
  used: number
}
