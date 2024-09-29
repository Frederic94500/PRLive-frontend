export class UserModel {
  discordId!: string;
  username!: string;
  name!: string;
  image!: string;
  role!: string;
}

export class UserOutputModel {
  discordId!: string;
  username!: string;
  name!: string;
  hasFinished!: boolean;
  staller!: boolean;
  doubleRank!: boolean;
}
