import { PR, PRInput } from '@interfaces/pr.interface';

import { ApiService } from '@services/api.service';
import { FileType } from '../enums/fileType.enum';
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

  public async deleteSongPR(prId: string, songUuid: string): Promise<Response> {
    return await this.apiService.deleteData(
      `${this.apiEndpoint}/deletesong/${prId}/${songUuid}`
    );
  }

  public async uploadFilePR(prId: string, type: FileType, file: File): Promise<Response> {
    return await this.apiService.postFile(
      `${this.apiEndpoint}/uploadfile/${prId}`,
      type,
      file
    );
  }

  public async updatePR(pr: PR): Promise<Response> {
    return await this.apiService.postPutData(
      pr,
      `${this.apiEndpoint}/update/${pr._id}`,
      'PUT'
    );
  }

  public async outputPR(prId: string): Promise<Response> {
    return await this.apiService.getWithCred(
      `${this.apiEndpoint}/output/${prId}`
    );
  }

  public async finishedPR(prId: string): Promise<Response> {
    return await this.apiService.getWithCred(
      `${this.apiEndpoint}/finished/${prId}`
    );
  }

  public async deletePR(prId: string): Promise<Response> {
    return await this.apiService.deleteData(
      `${this.apiEndpoint}/delete/${prId}`
    );
  }
}
