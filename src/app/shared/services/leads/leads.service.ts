import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';
import { API } from '../../api/api.urls';
import 'rxjs/add/operator/map';

@Injectable()
export class LeadsService {

  constructor(private http: Http) { }

// Get all leads service
getLeadsListService() {
  const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
  return this.http.get(API.GET_ALL_LEADS(currentuser.id, currentuser.username, currentuser.pwd)).map(
    (responseData) => {
      const key = '_body';
      return JSON.parse(responseData[key]);
    });
}


}
