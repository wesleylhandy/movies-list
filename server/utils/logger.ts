import { createLogger, transports } from 'winston';

export const logger = createLogger({
    exitOnError: false,
    transports: [
      new transports.File({
        filename: 'app-info.log',
        level: 'info',
        options: { flags: 'w' }
      }),
      new transports.File({
        filename: 'app-error.log',
        level: 'error',
        options: { flags: 'w' }
      })
    ]
  });

  // tslint:disable-next-line no-console
  logger.on('error', (err) => console.error({"Winston Logging Error": err}));