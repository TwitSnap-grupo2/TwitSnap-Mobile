export interface User {
  id: string;
  name: string;
  user: string;
  avatar: string;
  email: string;
  followers: Array<string>;
  followeds: Array<string>;
}
