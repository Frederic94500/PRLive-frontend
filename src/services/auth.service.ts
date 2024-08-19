import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { Response } from "../interfaces/api.interface";

@Injectable()
export class AuthService {
  private apiService = new ApiService();
  private apiEndpoint = 'auth';

  public async getWhoAmI(): Promise<Response> {
    return await this.apiService.getWithCred(`${this.apiEndpoint}/whoami`);
  }
}