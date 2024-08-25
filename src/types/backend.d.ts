export {};
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript
declare global {
  export interface IResLogin {
    data?: Data;
    error?: Error;
  }

  export interface Data {
    token: string;
    uuid: string;
    email: string;
    fullname: string;
  }

  export interface Error {
    code: number;
    message: string;
  }
}
