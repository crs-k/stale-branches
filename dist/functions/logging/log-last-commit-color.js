"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logLastCommitColor = logLastCommitColor;
const ansi_styles_1 = __importDefault(require("ansi-styles"));
function logLastCommitColor(commitAge, daysBeforeStale, daysBeforeDelete) {
    let commitColor = `Last Commit: ${ansi_styles_1.default.magenta.open}${commitAge.toString()}${ansi_styles_1.default.magenta.close} days ago.`;
    //color group based on age of branch
    if (commitAge > daysBeforeDelete) {
        commitColor = `Last Commit: ${ansi_styles_1.default.redBright.open}${commitAge.toString()}${ansi_styles_1.default.redBright.close} days ago.`;
    }
    else if (commitAge > daysBeforeStale) {
        commitColor = `Last Commit: ${ansi_styles_1.default.yellowBright.open}${commitAge.toString()}${ansi_styles_1.default.yellowBright.close} days ago.`;
    }
    else if (commitAge < daysBeforeStale) {
        commitColor = `Last Commit: ${ansi_styles_1.default.greenBright.open}${commitAge.toString()}${ansi_styles_1.default.greenBright.close} days ago.`;
    }
    return commitColor;
}
//# sourceMappingURL=log-last-commit-color.js.map