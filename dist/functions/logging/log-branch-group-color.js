"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logBranchGroupColor = logBranchGroupColor;
const ansi_styles_1 = __importDefault(require("ansi-styles"));
function logBranchGroupColor(branchName, commitAge, daysBeforeStale, daysBeforeDelete) {
    let groupColor = `[${ansi_styles_1.default.greenBright.open}${branchName}${ansi_styles_1.default.greenBright.close}]`;
    //color group based on age of branch
    if (commitAge > daysBeforeDelete) {
        groupColor = `[${ansi_styles_1.default.redBright.open}${branchName}${ansi_styles_1.default.redBright.close}]`;
    }
    else if (commitAge > daysBeforeStale) {
        groupColor = `[${ansi_styles_1.default.yellowBright.open}${branchName}${ansi_styles_1.default.yellowBright.close}]`;
    }
    else if (commitAge < daysBeforeStale) {
        groupColor = `[${ansi_styles_1.default.greenBright.open}${branchName}${ansi_styles_1.default.greenBright.close}]`;
    }
    return groupColor;
}
//# sourceMappingURL=log-branch-group-color.js.map