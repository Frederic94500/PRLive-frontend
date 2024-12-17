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

  public async getNominationSong(prId: string, songId: string): Promise<Response> {
    return await this.apiService.getWithCred(
      `${this.apiEndpoint}/getnomination/${prId}/${songId}`
    );
  }

  public async editNominationSong(prId: string, songId: string, songData: Song): Promise<Response> {
    return await this.apiService.postPutData(
      songData,
      `${this.apiEndpoint}/editnomination/${prId}/${songId}`,
      'PUT'
    );
  }

  public async deleteNominationSong(prId: string, songId: string): Promise<Response> {
    return await this.apiService.deleteData(`${this.apiEndpoint}/deletenomination/${prId}/${songId}`);
  }

  public async endNomination(prId: string): Promise<Response> {
    return await this.apiService.postPutData(
      {},
      `${this.apiEndpoint}/endnomination/${prId}`,
      'PUT'
    );
  }
}