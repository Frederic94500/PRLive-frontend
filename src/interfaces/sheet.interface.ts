export interface SheetSimple {
  prId: string;
  status: string;
}

export interface Sheet {
  prId: string;
  voterId: string;
  name: string;
  image: string;
  sheet: SheetSheet[];
}

export interface SheetSheet {
  uuid: string;
  orderId: number;
  rank: number;
  score: number;
  comment: string;
}

export interface SheetSheetFront {
  uuid: string;
  orderId: number;
  nominator?: string;
  artist: string;
  title: string;
  source?: string;
  type: string;
  urlVideo: string;
  urlAudio: string;
  rank: number;
  score: number;
  comment: string;
}
