export interface IErrors {
  message: string | undefined
  response: {
        data: {
              message: string | undefined
              data: Record<string, string[]>;
            }
          | undefined
        status: number | undefined
      }
    | undefined
}

export interface IErrorMessage {
  message: string | undefined
}

export interface IErrorResponse {
  response:
    | {
        data:
          | {
              message: string | undefined
            }
          | undefined
      }
    | undefined
}
