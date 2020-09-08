import { toErrorFlipperObject } from './utils';

export const ERROR_INVALID_REQUEST: number = 1;
export const ERROR_DATABASE_INVALID: number = 2;
export const ERROR_SQL_EXECUTION_EXCEPTION: number = 3;
export const ERROR_UNSUPPORTED_COMMAND: number = 4;

export const ERROR_INVALID_REQUEST_MESSAGE: string =
  'The request received was invalid';

export const ERROR_DATABASE_INVALID_MESSAGE: string =
  'Could not access database';

export const getInvalidRequestError = () =>
  toErrorFlipperObject(ERROR_INVALID_REQUEST, ERROR_INVALID_REQUEST_MESSAGE);

export const getInvalidDatabaseError = () =>
  toErrorFlipperObject(ERROR_DATABASE_INVALID, ERROR_DATABASE_INVALID_MESSAGE);

export const getUnsupportedCommandError = (commandName: string) =>
  toErrorFlipperObject(
    ERROR_UNSUPPORTED_COMMAND,
    `Command '${commandName}' is NOT supported`
  );

export const getSqlExecutionError = (error: unknown) =>
  toErrorFlipperObject(ERROR_SQL_EXECUTION_EXCEPTION, String(error));
