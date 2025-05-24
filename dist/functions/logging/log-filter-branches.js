"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logFilterBranches = logFilterBranches;
const ansi_styles_1 = __importDefault(require("ansi-styles"));
function logFilterBranches(branchLength) {
    return `${ansi_styles_1.default.bold.open}[${ansi_styles_1.default.magenta.open}${branchLength}${ansi_styles_1.default.magenta.close}] ${ansi_styles_1.default.blueBright.open}passed the RegEx filter${ansi_styles_1.default.blueBright.close}.${ansi_styles_1.default.bold.close}`;
}
//# sourceMappingURL=log-filter-branches.js.map