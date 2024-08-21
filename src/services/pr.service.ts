import { PR, PRInput } from '@interfaces/pr.interface';

import { ApiService } from '@services/api.service';
import { Injectable } from '@angular/core';
import { Response } from '@interfaces/api.interface';
import { SongInput } from '@interfaces/song.interface';

@Injectable()
export class PRService {
  private apiService = new ApiService();
  private apiEndpoint = 'pr';

  public async getPRSimple(): Promise<Response> {
    return await this.apiService.getNoCred(`${this.apiEndpoint}/getsimple`);
  }

  public async getPRs(): Promise<Response> {
    return await this.apiService.getWithCred(`${this.apiEndpoint}/gets`);
  }

  public async getPR(prId: string): Promise<Response> {
    return await this.apiService.getWithCred(`${this.apiEndpoint}/get/${prId}`);
  }

  public async createPR(pr: PRInput): Promise<Response> {
    return await this.apiService.postPutData(
      pr,
      `${this.apiEndpoint}/create`,
      'POST'
    );
  }

  public async addSongPR(prId: string, song: SongInput): Promise<Response> {
    return await this.apiService.postPutData(
      song,
      `${this.apiEndpoint}/addsong/${prId}`,
      'POST'
    );
  }

  public async updatePR(pr: PR): Promise<Response> {
    return await this.apiService.postPutData(
      pr,
      `${this.apiEndpoint}/update`,
      'PUT'
    );
  }

  public async outputPR(prId: string): Promise<Response> {
    return await this.apiService.getWithCred(
      `${this.apiEndpoint}/output/${prId}`
    );
  }

  public async deletePR(prId: string): Promise<Response> {
    return await this.apiService.deleteData(
      `${this.apiEndpoint}/delete/${prId}`
    );
  }
}
