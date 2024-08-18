import { env } from '../common/env-config';
import { createLogger, format, transports } from 'winston';

const messageFormat = format.printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${message};`;
});

/** For correct logging of objects use interpolation "%o" e.g. logger.info('log data: %o', myData); */
export const logger = createLogger({
  format: format.combine(format.timestamp(), format.splat(), messageFormat),
  transports: [new transports.Console({ level: env.WINSTON_LOG_LEVEL })],
});
