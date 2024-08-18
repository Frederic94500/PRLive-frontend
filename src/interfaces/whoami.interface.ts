export interface User {
  id: string;
  username: string;
  avatar: string;
}

export interface WhoAmI {
  code: number;
  data: User | undefined;
}
