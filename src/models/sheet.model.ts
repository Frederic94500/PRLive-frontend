export class SheetModel {
  prId!: string;
  voterId!: string;
  sheet!: {
    uuid: string;
    orderId: number;
    rank: number;
    score: number;
  }[];
}
