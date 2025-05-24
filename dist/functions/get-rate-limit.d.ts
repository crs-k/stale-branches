import { RateLimit } from '../types/rate-limit';
/**
 * Returns data on current rate limit usage for this repository
 *
 * @returns {RateLimit} data related to current rate limit usage @see {@link RateLimit}
 */
export declare function getRateLimit(): Promise<RateLimit>;
