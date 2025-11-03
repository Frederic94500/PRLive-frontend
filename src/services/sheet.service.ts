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

  public async getSheetNoAuth(prId: string, voterId: string, sheetId: string): Promise<Response> {
    return await this.apiService.getNoCred(`${this.apiEndpoint}/${prId}/${voterId}/${sheetId}`);
  }

  public async putSheet(prId: string, sheet: Sheet): Promise<Response> {
    return await this.apiService.postPutData(
      sheet,
      `${this.apiEndpoint}/${prId}`,
      'PUT'
    );
  }

  public async putSheetNoAuth(prId: string, voterId: string, sheetId: string, sheet: Sheet): Promise<Response> {
    return await this.apiService.postPutDataNoCred(
      sheet,
      `${this.apiEndpoint}/${prId}/${voterId}/${sheetId}`,
      'PUT'
    );
  }

  public async deleteSheet(prId: string): Promise<Response> {
    return await this.apiService.deleteData(`${this.apiEndpoint}/delete/${prId}`);
  }

  public async deleteSheetNoAuth(prId: string, voterId: string, sheetId: string): Promise<Response> {
    return await this.apiService.deleteData(`${this.apiEndpoint}/delete/${prId}/${voterId}/${sheetId}`);
  }

  public async deleteSheetUser(
    prId: string,
    userId: string
  ): Promise<Response> {
    return await this.apiService.deleteData(
      `${this.apiEndpoint}/delete/${prId}/${userId}`
    );
  }

  public async getGSheetLink(
    prId: string,
    voterId: string,
    sheetId: string
  ): Promise<Response> {
    return await this.apiService.getNoCred(
      `${this.apiEndpoint}/gsheet/${prId}/${voterId}/${sheetId}`
    );
  }

  public async getImportGSheet(
    prId: string,
    voterId: string,
    sheetId: string
  ): Promise<Response> {
    return await this.apiService.getWithCred(
      `${this.apiEndpoint}/gsheet/import/${prId}/${voterId}/${sheetId}`
    );
  }
}
