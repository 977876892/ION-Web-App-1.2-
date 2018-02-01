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
//
// get ionized blogs
getIonizedBlogs() {
  // const userId = this.storage.session.user ? this.storage.session.user.id : 0;
  const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
  const userId = currentuser.id;
  return this.http.get(API.GET_iONIZED_PROMOTIONS(userId,currentuser.auth)).map(
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
// Login user service
addPromotionService(promotionid,content,image,promotionTitle) {
  const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
  // let headers;
  var newDate=new Date();
  let dd:any=newDate.getDate();
  let mm:any=(newDate.getMonth()+1);
  if(dd<10){
    dd='0'+dd;
  } 
  if(mm<10){
    mm='0'+mm;
  } 
     let body = new FormData();
    var created=newDate.getFullYear()+"-"+mm+"-"+dd+" "+newDate.toString().split(" ")[4];
   //const headers = new Headers({'Content-Type' : 'application/X-www-form-urlencoded'});
    body.append('image',image);
    body.append('groupTags', '');
    body.append('write_content_hidden',content);
    body.append('publish_up',created);
    body.append('send_notification_emails',"1");
    body.append('copyrights','');
    body.append('created',created);
    body.append('write_content',content);
    body.append('copyrights','');
    body.append('published',"4");
    body.append('subscription','');
    body.append('title',promotionTitle+" "+created);
    body.append('content',content);
    body.append('tags','');
    body.append('frontpage','1');
    body.append('allowcomment','1');
    body.append('category_id',promotionid);
    body.append('publish_down','0000-00-00 00:00:00');
    body.append('blogpassword','');
    body.append('robots','');
    body.append('excerpt','');
    body.append('permalink','');
    body.append('key',currentuser.auth);
    //  let resData = 'image=' +image+
    //  '&groupTags=' +
    //   '&write_content_hidden=' +content +
    //   '&publish_up=' + created +
    //   '&copyrights= ' +
    //   '&send_notification_emails=1'+
    //   '&created=' + created +
    //   '&write_content=' + content +
    //   '&published=' + published +
    //   '&subscription=1' + 
    //   '&title=' + promotionTitle +
    //   '&content=' + content +
    //   '&tags=' +  
    //   '&frontpage=' +
    //   '&allowcomment=1' + 
    //   '&category_id=' + promotionid  +
    //   '&publish_down= 0000-00-00 00:00:00' +
    //   '&blogpassword=' +
    //   '&robots=' +
    //   '&excerpt=' +
    //   '&permalink=' +
    //   '&key='+currentuser.auth;
    //   console.log(resData);

    //let options = new RequestOptions({ headers });
   return this.http.post(API.ADD_PROMOTION(),body).map(
     (responseData) => {
       const key = '_body';
       return JSON.parse(responseData[key]);
     },
   );
 }
  updateThePromotion(promotionid,image,promotionTitle) {
  const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    let options;
    var newDate=new Date();
    let dd:any=newDate.getDate();
    let mm:any=(newDate.getMonth()+1);
    if(dd<10){
      dd='0'+dd;
    } 
    if(mm<10){
      mm='0'+mm;
    } 
    let body = new FormData();
    var created=newDate.getFullYear()+"-"+mm+"-"+dd+" "+newDate.toString().split(" ")[4];
    //var newDate=new Date();
    //var created=newDate.getFullYear()+"-"+(newDate.getMonth()+1)+"-"+newDate.getDate()+" "+ newDate.toString().split(" ")[4];
    const headers = new Headers({'Content-Type' : 'application/X-www-form-urlencoded'});
     let resData = 'image=' +image +
      '&groupTags=' +
      '&write_content_hidden=' +  encodeURIComponent(promotionTitle) +
      '&publish_up=' + created +
      '&copyrights=' +
      '&send_notification_emails=1'  +
      '&created=' + created +
      '&write_content=' + encodeURIComponent(promotionTitle) +
      '&subscription=1' +
      '&title=' +promotionTitle +
      '&content=' + encodeURIComponent(promotionTitle) +
      '&tags=' +
      '&frontpage=' + 
      '&allowcomment=1' +
      '&category_id=' +currentuser.publishid +
      '&publish_down= 0000-00-00' +
      '&blogpassword=' +
      '&robots=' +
      '&excerpt=' +
      '&permalink=' +
      '&key=' +currentuser.auth+
      '&published=1' +
      '&id=' + promotionid +
      "&encode=1";

      //  resData = {
      //     image:'',
      //     groupTags:'',
      //     write_content_hidden:blogData.textplain,
      //     publish_up:created,
      //     copyrights:'',
      //     send_notification_emails:1,
      //     created:created,
      //     write_content:blogData.textplain,
      //     published:publish,
      //     subscription:1,
      //     title:blogData.title,
      //     content:blogData.textplain,
      //     tags:'head',
      //     frontpage:'',
      //     allowcomment:1,
      //     category_id:65,
      //     publish_down:'0000-00-00',
      //     blogpassword:'',
      //     robots:'',
      //     excerpt:'',
      //     permalink:'',
      //     key:currentuser.auth,
      //     id:blogData.postid
      //  }
      
      console.log(resData);
        options = new RequestOptions({ headers });
        return this.http.put(API.CREATE_NEW_BLOG(), resData, options).map(
          (responseData) => {
            const key = '_body';
            return JSON.parse(responseData[key]);
          },
        );
 }
  SEND_SMS_USING_TAGS(tags,message){
    const headers = new Headers({'Content-Type' : 'application/X-www-form-urlencoded'});
    let options = new RequestOptions({ headers });
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    return this.http.post(API.SEND_SMS_USING_TAGS(tags,message,currentuser.username,currentuser.pwd),'').map(
     (responseData) => {
       const key = '_body';
       return JSON.parse(responseData[key]);
     },
   );
  }
  SEND_SMS_USING_PHONE_NUMBERS(phoneNo,message)
  {
    const headers = new Headers({'Content-Type' : 'application/X-www-form-urlencoded'});
    let options = new RequestOptions({ headers });
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    return this.http.post(API.SEND_SMS_USING_NUMBERS(phoneNo,message,currentuser.username,currentuser.pwd),'').map(
     (responseData) => {
       const key = '_body';
       return JSON.parse(responseData[key]);
     },
   );
  }
  getMessagesCount(tags){ 
    const headers = new Headers({'Content-Type' : 'application/X-www-form-urlencoded'});
    let options = new RequestOptions({ headers });
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    return this.http.post(API.GET_MESSAGES_COUNT(currentuser.teamid,tags),'').map(
     (responseData) => {
       const key = '_body';
       return JSON.parse(responseData[key]);
     },
   );
  }
}
