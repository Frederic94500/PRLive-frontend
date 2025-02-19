import { FileType } from '../enums/fileType.enum';
import { Injectable } from '@angular/core';
import { Response } from '@interfaces/api.interface';
import { environment } from '@environments/environment';

@Injectable()
export class ApiService {
  private apiUrl = environment.apiUrl;
  private apiEndpoint = 'api';

  public async getNoCred(endpoint: string): Promise<Response> {
    const response = await fetch(`${this.apiUrl}/${this.apiEndpoint}/${endpoint}`, {});
    return response.json();
  }

  public async getWithCred(endpoint: string): Promise<Response> {
    const response = await fetch(`${this.apiUrl}/${this.apiEndpoint}/${endpoint}`, {
      credentials: 'include',
    });
    return response.json();
  }

  public async postPutDataNoCred(
    data: any,
    endpoint: string,
    method: string
  ): Promise<Response> {
    const response = await fetch(`${this.apiUrl}/${this.apiEndpoint}/${endpoint}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  public async postPutData(
    data: any,
    endpoint: string,
    method: string
  ): Promise<Response> {
    const response = await fetch(`${this.apiUrl}/${this.apiEndpoint}/${endpoint}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  public async postFile(endpoint: string, type: FileType, file: File, params?: {item: string, value: any}[]): Promise<Response> {
    const formData = new FormData();
    formData.append('type', type);
    for (const param of params??[]) {
      formData.append(param.item, param.value);
    }
    formData.append('file', file);
    const response = await fetch(`${this.apiUrl}/${this.apiEndpoint}/${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    return response.json();
  }

  public async postImage(endpoint: string, file: File): Promise<Response> {
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch(`${this.apiUrl}/${this.apiEndpoint}/${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    return response.json();
  }

  public async deleteData(endpoint: string): Promise<Response> {
    const response = await fetch(`${this.apiUrl}/${this.apiEndpoint}/${endpoint}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return response.json();
  }

  public async deleteDataNoCred(endpoint: string): Promise<Response> {
    const response = await fetch(`${this.apiUrl}/${this.apiEndpoint}/${endpoint}`, {
      method: 'DELETE',
    });
    return response.json();
  }
}
