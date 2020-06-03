import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http: HttpClient,
    private router: Router) { }
  getinventorylist() {
    return this
      .http
      .get(`${environment.apiURL}inventory`);
  }
  addinventory(data: any) {
    var postData = new Object();
    if (data.lable != '') {
      postData["label"] = data.label;
    }
    if (data.parent != '') {
      postData["parent"] = data.parent;
    }
    var data_json = JSON.stringify(postData);
    console.log(data_json);
    return this
      .http
      .post<any>(`${environment.apiURL}inventory`, postData);
  } 
  deleteinventory(id: any) {
    return this
      .http
      .get(`${environment.apiURL}deleteinventory/${id}`);
  }
}