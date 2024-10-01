import { Server } from "../enums/server.enum";

export class UserModel {
  discordId!: string;
  username!: string;
  name!: string;
  image!: string;
  role!: string;
  server!: Server;
}

export class UserOutputModel {
  discordId!: string;
  username!: string;
  name!: string;
  hasFinished!: boolean;
  staller!: boolean;
  doubleRank!: boolean;
}
