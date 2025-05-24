"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logTotalAssessed = logTotalAssessed;
const ansi_styles_1 = __importDefault(require("ansi-styles"));
function logTotalAssessed(outputStales, outputTotal) {
    const totalAssessed = `${ansi_styles_1.default.bold.open}${ansi_styles_1.default.blueBright.open}Stale Branches Assessed${ansi_styles_1.default.blueBright.close}: [${ansi_styles_1.default.yellowBright.open}${outputStales}${ansi_styles_1.default.yellowBright.close}/${ansi_styles_1.default.magenta.open}${outputTotal}${ansi_styles_1.default.magenta.close}]${ansi_styles_1.default.bold.close}`;
    return totalAssessed;
}
//# sourceMappingURL=log-total-assessed.js.map