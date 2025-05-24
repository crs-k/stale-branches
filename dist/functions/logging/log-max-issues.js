"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logMaxIssues = logMaxIssues;
const ansi_styles_1 = __importDefault(require("ansi-styles"));
function logMaxIssues(issueBudgetRemaining) {
    let maxIssues = `${ansi_styles_1.default.bold.open}[${ansi_styles_1.default.magenta.open}${issueBudgetRemaining}${ansi_styles_1.default.magenta.close}] ${ansi_styles_1.default.blueBright.open}max-issues budget remaining${ansi_styles_1.default.blueBright.close}.${ansi_styles_1.default.bold.close}`;
    //color group based on age of branch
    if (issueBudgetRemaining < 1) {
        maxIssues = `${ansi_styles_1.default.bold.open}[${ansi_styles_1.default.redBright.open}${issueBudgetRemaining}${ansi_styles_1.default.redBright.close}] ${ansi_styles_1.default.blueBright.open}max-issues budget remaining${ansi_styles_1.default.blueBright.close}.${ansi_styles_1.default.bold.close}`;
    }
    else if (issueBudgetRemaining < 5) {
        maxIssues = `${ansi_styles_1.default.bold.open}[${ansi_styles_1.default.yellowBright.open}${issueBudgetRemaining}${ansi_styles_1.default.yellowBright.close}] ${ansi_styles_1.default.blueBright.open}max-issues budget remaining${ansi_styles_1.default.blueBright.close}.${ansi_styles_1.default.bold.close}`;
    }
    return maxIssues;
}
//# sourceMappingURL=log-max-issues.js.map