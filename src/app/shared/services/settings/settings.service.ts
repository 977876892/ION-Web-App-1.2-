import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { IonServer } from '../../globals/global';
import { API } from '../../api/api.urls';
@Injectable()
export class SettingsService {

  constructor(private http: Http) { }


 changePwdListService(pwditem) {
       console.log(pwditem);
       const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
       console.log(currentuser.username);
       console.log(currentuser.pwd);
       console.log(IonServer.ION_SERVER+"/index.php/request?module=user&action=post&resource=changepassword&username="+currentuser.username+"&password="+currentuser.pwd+"&newpassword="+pwditem+"&encode=true");
  return this.http.get(IonServer.ION_SERVER+"/index.php/request?module=user&action=post&resource=changepassword&username="+currentuser.username+"&password="+currentuser.pwd+"&newpassword="+pwditem+"&encode=true")
  .map(
    (responseData) => {
     //  console.log("change");
       console.log(IonServer.ION_SERVER+"/index.php/request?module=user&action=post&resource=changepassword&username="+currentuser.username+"&password="+currentuser.pwd+"&newpassword="+pwditem+"&encode=true");
    });
   }
   
editProfileListService(item,img) {
  console.log(img);
   const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
   //console.log(currentuser.id);)
   console.log(IonServer.ION_SERVER+"/index.php/request?action=profileupdate&module=ionize&resource=posts&user_id="+currentuser.id+"&firstname="+item.fname+"&lastname="+item.lname+"&email="+item.email+"&phone="+item.mobile+"&role="+item.role+"&overview="+item.aboutme);
  return this.http.get(IonServer.ION_SERVER+"/index.php/request?action=profileupdate&module=ionize&resource=posts&user_id="+currentuser.id+"&firstname="+item.fname+"&lastname="+item.lname+"&email="+item.email+"&phone="+item.mobile+"&role="+item.role+"&overview="+item.aboutme)
  .map(
    (responseData) => {

       console.log(IonServer.ION_SERVER+"/index.php/request?action=profileupdate&module=ionize&resource=posts&user_id="+currentuser.id+"&firstname="+item.fname+"&lastname="+item.lname+"&email="+item.email+"&phone="+item.mobile+"&role="+item.role+"&overview="+item.aboutme);
    // console.log(responseData);
    });
}

getUsersListService(){
  const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
  return this.http.get(API.GET_USERS_DATA(currentuser.auth)).map(
    (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]); 
      
    });
}
getUserDetails(id){
   const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
   console.log(currentuser);
   return this.http.get(API.GET_USER_DATA(id,currentuser.auth)).map(
    (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]);
      
    });
}

addNewUserService(userform){
  // console.log(ids);
 //  console.log(item);
 console.log(userform);
 const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
   let data = 
        "username="+ userform.username+"&password=" +userform.password+"&password2=" +userform.reTypePassword+"&name="+userform.firstname +"&lastname"+userform.surname +
        "&email="+userform.email+"&groups="+userform.groups+"&category="+userform.categories+"&key="+currentuser.auth+"&avatar="+userform.image;
  
    
    //let body = JSON.stringify(data);
    let headers    = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options    = new RequestOptions({ headers: headers });
    console.log(data);
   
   return this.http.post(API.ADD_USER_PROFILE(),data,options)
    .map(res =>  res.json());
  }
  updateUserService(userform,id){

      const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
  //  let data =  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  //       "username="+ userform.username+"&password=" +userform.password+"&password2=" +userform.reTypePassword+"&name="+userform.firstname +" "+userform.surname +
  //       "&email="+userform.email+"&groups="+userform.groups+"&category="+userform.categories+"&key="+currentuser.auth+"&userid="+id;
    //   let headers =new Headers({'Access-Control-Allow-Methods': '*'});
    //   let options    = new RequestOptions({ headers: headers });
      return this.http.put(API.UPDATE_USER_PROFILE(userform,currentuser.auth,id),'')
        .map(res =>  res.json());
      }

selectCategoriesService(){
  const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
  return this.http.get(API.GET_QUERIES_CATEGORIES(currentuser.id)).map(
    (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]);
      
    });
}
getIonSubscriptionDetails(){
   const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
  return this.http.get(API.ION_SUBSCRIPTION(currentuser.id)).map(
    (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]);
      
    });
}


}
