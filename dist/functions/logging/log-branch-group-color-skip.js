"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logBranchGroupColorSkip = logBranchGroupColorSkip;
const ansi_styles_1 = __importDefault(require("ansi-styles"));
function logBranchGroupColorSkip(branchName) {
    const groupColor = `[${ansi_styles_1.default.blueBright.open}${branchName}${ansi_styles_1.default.blueBright.close}]`;
    return groupColor;
}
//# sourceMappingURL=log-branch-group-color-skip.js.map