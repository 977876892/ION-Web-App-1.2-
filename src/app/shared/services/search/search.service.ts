import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';
import { API } from '../../api/api.urls';
import 'rxjs/add/operator/map';

@Injectable()
export class SearchService {

  constructor(private http: Http) { }

  // getting all searches.
  getSearchAllService(type) {
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    return this.http.get(API.GET_ALL_SEARCHES(currentuser.id, type)).map(
      (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]);
      });
  }
}
