import { Injectable } from "@angular/core";
import { WhoAmI } from "../interfaces/whoami.interface";
import { environment } from "../environments/environment";

@Injectable()
export class ApiService {
  private api = environment.api;

  public async getWhoAmI(): Promise<WhoAmI> {
    const response = await fetch(`${this.api}/auth/whoami`, {
      credentials: 'include',
    });
    return response.json();
  }
}