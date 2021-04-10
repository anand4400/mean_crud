import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  
  constructor(private http : HttpClient) { }

  public call_api_post(data:any){
    return this.http.post(environment.API_URL+data.get('url'), data );
  }

  public call_api_get(data:any){
    return this.http.get(environment.API_URL+data.url);
  }

  public call_api_put(data:any){
    return this.http.put(environment.API_URL+data.get('url'), data);
  }
  public call_api_delete(data:any){
    return this.http.delete(environment.API_URL+data.url);
  }
}
