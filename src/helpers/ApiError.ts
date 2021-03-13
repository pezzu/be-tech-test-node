export default class ApiError extends Error {
  constructor(code: number, message: string) {
    super(message);
  }
}
