"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logGetBranches = logGetBranches;
const ansi_styles_1 = __importDefault(require("ansi-styles"));
function logGetBranches(branchLength) {
    const getBranches = `${ansi_styles_1.default.bold.open}[${ansi_styles_1.default.magenta.open}${branchLength}${ansi_styles_1.default.magenta.close}] ${ansi_styles_1.default.blueBright.open}branches found${ansi_styles_1.default.blueBright.close}.${ansi_styles_1.default.bold.close}`;
    return getBranches;
}
//# sourceMappingURL=log-get-branches.js.map