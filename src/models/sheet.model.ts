export class SheetModel {
  prId!: string;
  voterId!: string;
  sheet!: SheetSheetModel[];
}

export class SheetSheetModel {
  uuid!: string;
  orderId!: number;
  rank!: number;
  score!: number;
}
