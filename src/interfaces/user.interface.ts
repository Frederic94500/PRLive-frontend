import { Server } from "../enums/server.enum";

export interface User {
  _id?: string;
  discordId: string;
  username: string;
  name: string;
  image: string;
  role: string;
  server: Server;
}

export interface UserOutput {
  discordId: string;
  username: string;
  name: string;
  image: string;
  hasFinished: boolean;
  staller: boolean;
  doubleRank: boolean;
}
