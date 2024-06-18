export interface IUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  role: string;
}
export interface INavBar {
  id: number;
  name: string;
  link: string;
  type: string;
}

export interface IProduct {
  id:string,
  name: string,
  price: number,
  type: string,
  website: string,
}