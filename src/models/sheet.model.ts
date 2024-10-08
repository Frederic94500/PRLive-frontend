export class SheetModel {
  prId!: string;
  voterId!: string;
  name!: string;
  image!: string;
  sheet!: SheetSheetModel[];
}

export class SheetSheetModel {
  uuid!: string;
  orderId!: number;
  rank!: number;
  score!: number;
}

export class SheetSheetFrontModel {
  uuid!: string;
  orderId!: number;
  nominatedId?: string;
  artist!: string;
  title!: string;
  anime?: string;
  type!: string;
  urlVideo!: string;
  urlAudio!: string;
  rank!: number;
  score!: number;
}
