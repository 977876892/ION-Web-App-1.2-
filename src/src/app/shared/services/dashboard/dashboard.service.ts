import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';
import { API } from '../../api/api.urls';
import 'rxjs/add/operator/map';
// import { Storage } from '../../../shared/storage/storage';

@Injectable()
export class DashboardService {

  constructor(private http: Http) { }
// Dashboard statistics api call
  getDashboardStatistics() {
    // const userId = this.storage.session.user ? this.storage.session.user.id : 0;
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    const userId = currentuser.id;
    return this.http.get(API.GET_DASHBOARD_STATISTICS(userId)).map(
      (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]);
      },
    );
  }

  // Get feeds
  getDashboardFeeds() {
    // const userId = this.storage.session.user ? this.storage.session.user.id : 0;
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    const userId = currentuser.id;
    return this.http.get(API.GET_DASHBOARD_FEEDS(userId)).map(
      (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]);
      },
    );
  }
   // Get NOTIFICATION feeds
   getDashboardNotificationFeeds() {
    // const userId = this.storage.session.user ? this.storage.session.user.id : 0;
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    const userId = currentuser.id;
    return this.http.get(API.GET_DASHBOARD_NOTIFICATIONS(userId,currentuser.auth)).map(
      (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]);
      },
    );
  }

  getBlogs(limitStart) {
    console.log(limitStart);

    return this.http.get(API.GET_BLOGS('', '', 1)).map(
      (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]);
      },
    );
  }
  congartulate(feedid){
     const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
        return this.http.get(API.CONGRATULATE(feedid,currentuser.id)).map(
      (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]);
      },
    );
  }

}
