import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ContainerService {

  constructor(private http: HttpClient,
    private router: Router) { }
    getcontainerbyid(id){
      return this
        .http
        .get(`${environment.apiURL}container/${id}`);
    }
  getcontainerslist() {
    return this
      .http
      .get(`${environment.apiURL}container`);
  }
  getcontainerslistbytype(type) {
    return this
      .http
      .get(`${environment.apiURL}movablecontainer/${type}`);
  }
  addContainer(data: any) {
    var postData = new Object();
    if (data.lable != '') {
      postData["label"] = data.label;
    }

    postData["hold_type"] = data.hold_type;
    if (data.parent != '') {
      postData["parent"] = data.parent;
    }
    var data_json = JSON.stringify(postData);
    console.log(data_json);
    return this
      .http
      .post<any>(`${environment.apiURL}container`, postData);
  }
  isdeletable(id: number) {
    return this
      .http
      .get(`${environment.apiURL}getdeleteablecontainer/${id}`);
  }
  deletecontainer(id: any) {
    return this
      .http
      .get(`${environment.apiURL}deletecontainer/${id}`);
  }
  getposiblemoveablecontainer(id:any){
    return this
    .http
    .get(`${environment.apiURL}possiblemovablecontainers/${id}`);
  }
 
  movecontainer(to: any,from:any,to_move:any) {
    var postData = new Object();
    if (from != '') {
      postData["from"] = from;
    }

    postData["to_move"] = to_move;
   
      postData["to"] = to;
    
    var data_json = JSON.stringify(postData);
    console.log(data_json);
    return this
      .http
      .post<any>(`${environment.apiURL}movecontainer`, postData);
  }

}
