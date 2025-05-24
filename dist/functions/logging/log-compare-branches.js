"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logCompareBranches = logCompareBranches;
const ansi_styles_1 = __importDefault(require("ansi-styles"));
function logCompareBranches(branchComparison, base, head) {
    let compareBranches;
    compareBranches = `${ansi_styles_1.default.bold.open}${head} has a status of [${branchComparison.branchStatus}] in comparison to ${base}. ${head} is ahead by ${branchComparison.aheadBy} commits and behind by ${branchComparison.behindBy} commits.${ansi_styles_1.default.bold.close}`;
    switch (branchComparison.branchStatus) {
        case 'diverged':
            compareBranches = `${ansi_styles_1.default.bold.open}${head} has ${ansi_styles_1.default.red.open}diverged${ansi_styles_1.default.red.close} from ${base}, and is ahead by ${ansi_styles_1.default.magenta.open}${branchComparison.aheadBy}${ansi_styles_1.default.magenta.close} commits and behind by ${ansi_styles_1.default.magenta.open}${branchComparison.behindBy}${ansi_styles_1.default.magenta.close} commits.${ansi_styles_1.default.bold.close}`;
            break;
        case 'ahead':
            compareBranches = `${ansi_styles_1.default.bold.open}${head} is ${ansi_styles_1.default.yellow.open}ahead${ansi_styles_1.default.yellow.close} of ${base} by ${ansi_styles_1.default.magenta.open}${branchComparison.aheadBy}${ansi_styles_1.default.magenta.close} commits.${ansi_styles_1.default.bold.close}`;
            break;
        case 'behind':
            compareBranches = `${ansi_styles_1.default.bold.open}${head} is ${ansi_styles_1.default.yellow.open}behind${ansi_styles_1.default.yellow.close} ${base} by ${ansi_styles_1.default.magenta.open}${branchComparison.behindBy}${ansi_styles_1.default.magenta.close} commits.${ansi_styles_1.default.bold.close}`;
            break;
        case 'identical':
            compareBranches = `${ansi_styles_1.default.bold.open}${head} is ${ansi_styles_1.default.green.open}identical${ansi_styles_1.default.green.close} to ${base}.${ansi_styles_1.default.bold.close}`;
            break;
    }
    return compareBranches;
}
//# sourceMappingURL=log-compare-branches.js.map