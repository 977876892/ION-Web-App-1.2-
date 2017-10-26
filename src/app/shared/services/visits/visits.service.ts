import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';
import { API } from '../../api/api.urls';
import 'rxjs/add/operator/map';

@Injectable()
export class VisitsService {

  constructor(private http: Http) { }

  // Get all visits cservice
  getVisitsListService() {
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    return this.http.get(API.GET_VISITS_LIST(currentuser.username, currentuser.pwd)).map(
      (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]);
      });
  }

  // add visit service
  addVisitService() {
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    let visitObj;
    visitObj.resId = '';
    visitObj.ceId = '';
    visitObj.name = '';
    visitObj.email = '';
    visitObj.phone = '';
    visitObj.startdate = '';
    visitObj.starttime = '';
    visitObj.enddate = '';
    visitObj.endtime = '';
    visitObj.bookingDeposit = '';
    visitObj.bookingTotal = '';
    visitObj.userId = currentuser.id;
    return this.http.get(API.ADD_VISIT(visitObj)).map(
      (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]);
      });
  }
   // delete visit service
   deleteVisitService(id) {
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    return this.http.get(API.DELETE_VISIT(currentuser.username, currentuser.pwd, id)).map(
      (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]);
      });
  }

}
