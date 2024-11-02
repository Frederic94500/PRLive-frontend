export class SongModel {
  uuid!: string;
  orderId!: number;
  nominatedId?: string;
  artist!: string;
  title!: string;
  anime?: string;
  type!: string;
  startSample!: number;
  sampleLength!: number;
  urlVideo!: string;
  urlAudio!: string;
  [key: string]: string | number | undefined;
}
