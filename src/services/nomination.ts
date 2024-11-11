import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { Response } from "../interfaces/api.interface";
import { Song } from "../interfaces/song.interface";

@Injectable()
export class NominationService {
  private apiService = new ApiService();
  private apiEndpoint = 'nomination';

  public async getNomination(prId: string): Promise<Response> {
    return await this.apiService.getWithCred(`${this.apiEndpoint}/get/${prId}`);
  }

  public async nominateSong(prId: string, songData: Song): Promise<Response> {
    return await this.apiService.postPutData(
      songData,
      `${this.apiEndpoint}/nominate/${prId}`,
      'POST'
    );
  }

  public async endNomination(prId: string): Promise<Response> {
    return await this.apiService.postPutData(
      {},
      `${this.apiEndpoint}/endnomination/${prId}`,
      'PUT'
    );
  }
}