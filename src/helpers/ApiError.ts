export default class ApiError extends Error {
  public status: number;
  public message: string;

  constructor(code: number, message: string) {
    super(message);
    this.status = code;
    this.message = message;
  }
}
