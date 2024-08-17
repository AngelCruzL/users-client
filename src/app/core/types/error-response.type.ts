export interface CustomError extends Error {
  error: ErrorResponse;
}

export interface ErrorResponse {
  timestamp: string;
  message: string;
  path: string;
  statusCode: string;
}
