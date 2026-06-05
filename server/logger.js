const winston = require("winston");
const logger = winston.createLogger({
    level: "info",
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File(
            {
                filename: "logs/error.log",
                level: "error",
                maxsize: 5 * 1024 * 1024,
                maxFiles: 3
            }
        ),
        new winston.transports.File(
            {
                filename: "logs/combined.log",
                maxsize: 5 * 1024 * 1024,
                maxFiles: 3
            }
        )
    ]
});
module.exports = logger;
