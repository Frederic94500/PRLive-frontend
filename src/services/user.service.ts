import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { Response } from '@interfaces/api.interface';
import { User } from "../interfaces/user.interface";

@Injectable()
export class UserService {
  private apiService = new ApiService();
  private apiEndpoint = 'user';

  public async getUser(id: string): Promise<Response> {
    return await this.apiService.getNoCred(`${this.apiEndpoint}/get/${id}`);
  }
  
  public async editUser(userData: User): Promise<Response> {
    return await this.apiService.postPutData(userData, `${this.apiEndpoint}/edit`, "PUT");
  }
}
