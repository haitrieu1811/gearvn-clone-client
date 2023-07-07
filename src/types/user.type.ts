export interface User {
  _id: string;
  email: string;
  role: number;
  fullName: string;
  avatar: string;
  gender: number;
  verify: number;
  phoneNumber: string;
  addresses: never[];
  date_of_birth: string;
}
