"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logTotalDeleted = logTotalDeleted;
const ansi_styles_1 = __importDefault(require("ansi-styles"));
function logTotalDeleted(outputDeletes, outputStales) {
    const totalDeleted = `${ansi_styles_1.default.bold.open}${ansi_styles_1.default.blueBright.open}Stale Branches Deleted${ansi_styles_1.default.blueBright.close}: [${ansi_styles_1.default.redBright.open}${outputDeletes}${ansi_styles_1.default.redBright.close}/${ansi_styles_1.default.yellowBright.open}${outputStales}${ansi_styles_1.default.yellowBright.close}]${ansi_styles_1.default.bold.close}`;
    return totalDeleted;
}
//# sourceMappingURL=log-total-deleted.js.map