export class HttpException extends Error {
  constructor(public readonly code: number, message: string) {
    super(message);
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(customMessage?: string) {
    super(500, customMessage ?? "Internal Server Error");
  }
}

export class BadException extends HttpException {
  constructor(customMessage?: string) {
    super(400, customMessage ?? "Bad Request");
  }
}
