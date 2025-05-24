"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logDeleteBranch = logDeleteBranch;
const ansi_styles_1 = __importDefault(require("ansi-styles"));
function logDeleteBranch(refFull) {
    const deleteBranch = `Branch: ${ansi_styles_1.default.redBright.open}${refFull}${ansi_styles_1.default.redBright.close} has been ${ansi_styles_1.default.redBright.open}deleted${ansi_styles_1.default.redBright.close}.`;
    return deleteBranch;
}
//# sourceMappingURL=log-delete-branch.js.map