import { getOctokit } from '@actions/github';
import { Inputs } from '../types/inputs';
export declare const github: ReturnType<typeof getOctokit>;
export declare const owner: string, repo: string;
/**
 * Validates the Action's inputs and assigns them to the Inputs type
 *
 * @returns {Inputs} Valid inputs @see {@link Inputs}
 */
export declare function validateInputs(): Promise<Inputs>;
