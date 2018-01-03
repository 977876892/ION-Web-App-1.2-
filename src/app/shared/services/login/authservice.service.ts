import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';
import { API } from '../../api/api.urls';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthserviceService {

  constructor(private http: Http) { }
// Login user service
  loginUser(loginForm) {
   // let headers;
    let resData;
    let options;
    const headers = new Headers({'Content-Type' : 'application/X-www-form-urlencoded'});
    resData = 'username=' + loginForm.username + '&password=' + loginForm.password;
    options = new RequestOptions({ headers });
    return this.http.post(API.LOGIN_API(), resData, options).map(
      (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]); 
      },
    );
  }
  // Forgot password service
  forgotPasswordService(emailId) {
    return this.http.get(API.FORGOT_PASSWORD_API(emailId)).map(
      (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]);
      },
    );
   };
  getCommonDetails(teamid){
    return this.http.get(API.GET_COMMON_DETAILS(teamid)).map(
      (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]);
      },
    );
  }
  // image upload service
  uploadImageService(formData) {
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    return this.http.post(API.UPLOAD_IMAGE(),
    formData).map(
      (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]);
      },
    );
  }

  termsandcondition(){
    return this.http.get(API.TERM_CONDITIONS())
    .map((responseData)=>{
      // console.log(responseData);
      const key = '_body';
      return JSON.parse(responseData[key]);
    });
  }
}
