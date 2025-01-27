import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { Response } from '@interfaces/api.interface';
import { Server } from "../interfaces/server.interface";

@Injectable()
export class ServerService {
  private apiService = new ApiService();
  private apiEndpoint = 'server';

  public async create(serverData: Server): Promise<Response> {
    return await this.apiService.postPutData(serverData, `${this.apiEndpoint}/create`, "POST");
  }

  public async get(id: string): Promise<Response> {
    return await this.apiService.getNoCred(`${this.apiEndpoint}/get/${id}`);
  }

  public async gets(): Promise<Response> {
    return await this.apiService.getWithCred(`${this.apiEndpoint}/gets`);
  }

  public async edit(id: string, serverData: Server): Promise<Response> {
    return await this.apiService.postPutData(serverData, `${this.apiEndpoint}/edit/${id}`, "PUT");
  }

  public async delete(id: string): Promise<Response> {
    return await this.apiService.deleteData(`${this.apiEndpoint}/delete/${id}`);
  }
}