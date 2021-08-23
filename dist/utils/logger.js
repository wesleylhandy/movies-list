"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
exports.logger = winston_1.createLogger({
    exitOnError: false,
    transports: [
        new winston_1.transports.File({
            filename: 'app-info.log',
            level: 'info',
            options: { flags: 'w' }
        }),
        new winston_1.transports.File({
            filename: 'app-error.log',
            level: 'error',
            options: { flags: 'w' }
        })
    ]
});
// tslint:disable-next-line no-console
exports.logger.on('error', (err) => console.error({ "Winston Logging Error": err }));
//# sourceMappingURL=logger.js.map