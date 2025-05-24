"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logGetPr = logGetPr;
const ansi_styles_1 = __importDefault(require("ansi-styles"));
function logGetPr(prLength) {
    const getPr = `${ansi_styles_1.default.bold.open}[${ansi_styles_1.default.magenta.open}${prLength}${ansi_styles_1.default.magenta.close}] ${ansi_styles_1.default.blueBright.open}pull requests found${ansi_styles_1.default.blueBright.close}.${ansi_styles_1.default.bold.close}`;
    return getPr;
}
//# sourceMappingURL=log-get-pr.js.map