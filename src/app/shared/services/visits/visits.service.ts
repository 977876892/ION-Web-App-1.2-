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
  getVisitsListService(current_date) {
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    return this.http.get(API.GET_VISITS_LIST(currentuser.username, currentuser.pwd,current_date)).map(
      (responseData) => {
        console.log(responseData['_body']);
        const key = '_body';
        return JSON.parse(responseData[key]);
      });
  }

  // add visit service
  addVisitService(visitObj, udfObj) {
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    visitObj.credit_used = '';
    visitObj.user_id = currentuser.id;
    return this.http.get(API.ADD_VISIT(visitObj, udfObj)).map(
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
   // update visit service
   updateVisitService(visitObj,strUDFs) {
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    visitObj.credit_used = '';
    visitObj.user_id = currentuser.id;
    return this.http.get(API.UPDATE_VISIT(currentuser.username, currentuser.pwd,visitObj,strUDFs)).map(
      (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]);
      });
  }
 // Get categeories visits cservice
 getCategeoriesService() {
  const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
  return this.http.get(API.GET_CATEGEORIES_LIST(currentuser.username, currentuser.pwd, currentuser.categoryid)).map(
    (responseData) => {
      const key = '_body';
      return JSON.parse(responseData[key]);
    });
}
// get doctors list service
getDoctorsService(catId) {
  const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
  return this.http.get(API.GET_DOCTORS_LIST(currentuser.username, currentuser.pwd, catId)).map(
    (responseData) => {
      const key = '_body';
      return JSON.parse(responseData[key]);
    });
}
// get timeslots service
getTimeSlotsService(resId, tsDate) {
  const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
  return this.http.get(API.GET_DOCTORS_TIME_SLOTS_LIST(resId, tsDate, currentuser.username, currentuser.pwd)).map(
    (responseData) => {
      const key = '_body';
      return JSON.parse(responseData[key]);
    });
}
  //download visits
  downloadVisits(){
      const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
      return this.http.get(API.GET_DOWNLOAD_VISITS(currentuser.id,currentuser.username, currentuser.pwd)).map(
        (responseData) => {
          const key = '_body';
          return responseData['_body'];
        });
  }
      getAppintmentsBetweenDates(resId,startDate,days){
       // GET_APPOINTMENTS_BETWEEN_DATES(resId, startDate,days,docotor_id, username, pwd)
         const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
          return this.http.get(API.GET_APPOINTMENTS_BETWEEN_DATES(resId, startDate,days, currentuser.username, currentuser.pwd)).map(
            (responseData) => {
              const key = '_body';
              return JSON.parse(responseData['_body']);
            });
      }

}
