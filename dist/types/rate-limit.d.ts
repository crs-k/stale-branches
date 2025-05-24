export interface RateLimit {
    /**
     * The amount of rate limit remaining expressed as a percentage
     *
     * Calculated as: Math.round((remaining / limit) * 100)
     *
     * Example: 23
     */
    remaining: number;
    /**
     * The number of minutes remaining before the rate limit resets
     *
     * Calculated as: getMinutes(Date().getTime(), Date(rateLimit.reset * 1000))
     *
     * Example: 45
     */
    reset: number;
    /**
     * The time the rate limit resets
     *
     * Calculated as: new Date(reset * 1000)
     *
     * Example: Mon Jul 01 2013 13:47:53 GMT-0400 (EDT)
     */
    resetDateTime: Date;
    /**
     * The amount of rate limit used expressed as a percentage
     *
     * Calculated as: Math.round((used / limit) * 100)
     *
     * Example: 77
     */
    used: number;
}
