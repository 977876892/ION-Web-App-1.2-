import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';
import { API } from '../../api/api.urls';
import 'rxjs/add/operator/map';

@Injectable()
export class PromotionsService {

  constructor(private http: Http) { }
// get promotions call
getPromotionsData() {
  // const userId = this.storage.session.user ? this.storage.session.user.id : 0;
  const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
  const userId = currentuser.id;
  return this.http.get(API.GET_PROMOTIONS(userId)).map(
    (responseData) => {
      const key = '_body';
      return JSON.parse(responseData[key]);
    },
  );
}
// get ionized blogs
getIonizedBlogs() {
  // const userId = this.storage.session.user ? this.storage.session.user.id : 0;
  const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
  const userId = currentuser.id;
  return this.http.get(API.GET_iONIZED_PROMOTIONS(userId)).map(
    (responseData) => {
      const key = '_body';
      return JSON.parse(responseData[key]);
    },
  );
}
// bLOG FULL VIEW DISPLAY
getBlogFullView() {
  // const userId = this.storage.session.user ? this.storage.session.user.id : 0;
  const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
  const userId = currentuser.id;
  return this.http.get(API.GET_BLOG_FULL_VIEW(userId)).map(
    (responseData) => {
      const key = '_body';
      return JSON.parse(responseData[key]);
    },
  );
}
}
