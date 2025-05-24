"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logOrphanedIssues = logOrphanedIssues;
const ansi_styles_1 = __importDefault(require("ansi-styles"));
function logOrphanedIssues(orphanCount) {
    const orphanedIssues = `${ansi_styles_1.default.bold.open}[${ansi_styles_1.default.magenta.open}${orphanCount}${ansi_styles_1.default.magenta.close}] ${ansi_styles_1.default.blueBright.open}orphaned issues found${ansi_styles_1.default.blueBright.close}.${ansi_styles_1.default.bold.close}`;
    return orphanedIssues;
}
//# sourceMappingURL=log-orphaned-issues.js.map