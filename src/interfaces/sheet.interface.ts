export interface SheetSimple {
  prId: string;
  finished: boolean;
}

export interface Sheet {
  prId: string;
  voterId: string;
  name: string;
  image: string;
  sheet: {
    uuid: string;
    orderId: number;
    rank: number;
    score: number;
  }[];
}
