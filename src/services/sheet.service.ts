import { ApiService } from '@services/api.service';
import { Injectable } from '@angular/core';
import { Response } from '@interfaces/api.interface';
import { Sheet } from '@interfaces/sheet.interface';

@Injectable()
export class SheetService {
  private apiService = new ApiService();
  private apiEndpoint = 'sheet';

  public async getSheetSimple(): Promise<Response> {
    return await this.apiService.getWithCred(`${this.apiEndpoint}/gets`);
  }

  public async getSheet(prId: string): Promise<Response> {
    return await this.apiService.getWithCred(`${this.apiEndpoint}/${prId}`);
  }

  public async getUserSheet(
    prId: string,
    discordId: string
  ): Promise<Response> {
    return await this.apiService.getWithCred(
      `${this.apiEndpoint}/${prId}/${discordId}`
    );
  }

  public async putSheet(prId: string, sheet: Sheet): Promise<Response> {
    return await this.apiService.postPutData(
      sheet,
      `${this.apiEndpoint}/${prId}`,
      'PUT'
    );
  }

  public async deleteSheetUser(
    prId: string,
    userId: string
  ): Promise<Response> {
    return await this.apiService.deleteData(
      `${this.apiEndpoint}/delete/${prId}/${userId}`
    );
  }
}
