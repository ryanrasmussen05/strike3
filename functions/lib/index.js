"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const moment = require("moment");
exports.getDate = functions.https.onCall((data) => {
    const formattedDate = moment().format();
    return { date: formattedDate };
});
//# sourceMappingURL=index.js.map