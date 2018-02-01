import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { HttpParams,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';
import { API } from '../../api/api.urls';
import 'rxjs/add/operator/map';
 declare var require: any;

@Injectable()
export class PublishService {

  constructor(private http: Http) { 
    
        
  }

  // Getting all PublishMessages.
  getAllPublishMessages(status, startfrom, to) {
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    return this.http.get(API.GET_PUBLISH_LIST(currentuser.publishid, status,currentuser.auth, startfrom, to)).map(
      (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]);
      },
    );
   }
   // create new blog service
createTheBlogService(createBlogForm,tags) {
      var format = require('date-fns/format');
      var published_date='',published_time='',finalpublished='';
      let body = new FormData();
      console.log(createBlogForm);
      const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
      var newDate=new Date();
      var created_date=format(newDate, ['YYYY-MM-DD HH:mm:ss']);
    //   if(createBlogForm.createdDate=='' ||createBlogForm.createdDate==null)
    //     {
    //         finalpublished='';
    //     }
    // else{
      
      published_date=format(createBlogForm.createdDate, ['YYYY-MM-DD']);
      published_time=format(createBlogForm.createdTime, ['HH:mm:ss']);
      finalpublished=published_date+" "+published_time;
    // }
      console.log(published_date);
      console.log(published_time);
      console.log(published_date+" "+published_time);
      body.append('image', createBlogForm.image);
      body.append('groupTags', '');
      body.append('write_content_hidden', createBlogForm.content);
      body.append('publish_up',finalpublished);
      body.append('send_notification_emails',"1");
      body.append('copyrights','');
      body.append('created',created_date);
      body.append('write_content',createBlogForm.content);
      body.append('copyrights','');
      body.append('published',createBlogForm.status);
      body.append('subscription','');
      body.append('title',createBlogForm.title);
      body.append('content',createBlogForm.content);
      body.append('tags',tags);
      body.append('frontpage','1');
      body.append('allowcomment','1');
      body.append('category_id',createBlogForm.type);
      body.append('publish_down','0000-00-00 00:00:00');
      body.append('blogpassword','');
      body.append('robots','');
      body.append('excerpt','');
      body.append('permalink','');
      body.append('key',currentuser.auth);
      body.append('topic_id',createBlogForm.topicId);
   return this.http.post(API.CREATE_NEW_BLOG(), body).map(
     (responseData) => {
       const key = '_body';
       return JSON.parse(responseData[key]);
     },
   );
 }
  // update blog service
updateBlogService(blogData,tags) {
  // let headers;
  var format = require('date-fns/format');
  var published_date='',published_time='',finalpublished='';
  const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
  console.log(blogData);
  //console.log(publish);
  
    let options;
    //var newDate=new Date();
    //var created=newDate.getFullYear()+"-"+(newDate.getMonth()+1)+"-"+newDate.getDate()+" "+ newDate.toString().split(" ")[4];
     var newDate=new Date();
     var created_date=format(newDate, ['YYYY-MM-DD HH:mm:ss']);
     //var published_date=format(blogData.createdDate, ['YYYY-MM-DD']);
     //var published_time=format(blogData.createdTime, ['HH:mm:ss']);
    //   if(blogData.createdDate=='' ||blogData.createdDate==null)
    //     {
    //          finalpublished='';
    //     }
    // else{
             published_date=format(blogData.createdDate, ['YYYY-MM-DD']);
             published_time=format(blogData.createdTime, ['HH:mm:ss']);
             finalpublished=published_date+" "+published_time;
   // }
     console.log(created_date);
     console.log(published_time);
     console.log(published_date);
    //var created_date=newDate.getFullYear()+"-"+(newDate.getMonth()+1)+"-"+newDate.getDate()+" "+ newDate.toString().split(" ")[4];
    //var published_date=blogData.createdDate.getFullYear()+"-"+(blogData.createdDate.getMonth()+1)+"-"+blogData.createdDate.getDate()+" "+ blogData.createdTime.toString().split(" ")[4];
    
    const headers = new Headers({'Content-Type' : 'application/X-www-form-urlencoded'});
     let resData = 'image=' +blogData.image +
      '&groupTags=' +
      '&write_content_hidden=' +  encodeURIComponent(blogData.content) +
      '&publish_up=' +  finalpublished +
      '&copyrights=' +
      '&send_notification_emails=1'  +
      '&write_content=' + encodeURIComponent(blogData.content) +
      '&subscription=1' +
      '&title=' + blogData.title +
      '&content=' + encodeURIComponent(blogData.content) +
      '&tags=' + tags +
      '&frontpage=' + 
      '&allowcomment=1' +
      '&category_id=' +blogData.type +
      '&publish_down= 0000-00-00' +
      '&blogpassword=' +
      '&robots=' +
      '&excerpt=' +
      '&permalink=' +
      '&key=' +currentuser.auth+
      '&published=' + blogData.status +
      '&id=' + blogData.postid +
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
  // Get blog detail view service
  getBlogDetailViewService(bID) {
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    return this.http.get(API.BLOG_DETAIL_VIEW(bID, currentuser.auth)).map(
      (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]);
      });
   }
   // Get blog comments service
  getBlogCommentsService(bID) {
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    return this.http.get(API.GET_BLOG_COMMENTS(bID,currentuser.id)).map(
      (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]);
      });
   }
    // add blog comments service
  addBlogCommentsService(bID, comments) {
    let body = new FormData();
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    body.append('comment', comments);
    return this.http.post(API.ADD_BLOG_COMMENTS(bID, currentuser.username, currentuser.pwd),body).map(
      (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]);
      });
   }
    // get publish calendar service
  getPublishCalendarService() {
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    return this.http.get(API.GET_PUBLISH_CALENDAR(currentuser.id)).map(
      (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]);
      });
   }
   
    // get publish calendar by month service
  getPublishCalendarByMonthService(month) {
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    return this.http.get(API.GET_PUBLISH_CALENDAR_BY_MONTH(currentuser.auth, currentuser.publishid, month)).map(
      (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]);
      });
   }
   // get all trending topics calendar service
  getAllTrendingTopicsService() {
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    return this.http.get(API.TRENDING_TOPICS_ALL(currentuser.id)).map(
      (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]);
      });
   }
    // get trending topics calendar service
  getTrendingTopicsService(month) {
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    return this.http.get(API.TRENDING_TOPICS_BY_MONTH(currentuser.id, month)).map(
      (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]);
      });
   }
   // add trending topic
  //  addTrendingTopicService(trendObjData) {
  //   const headers = new Headers({'Content-Type' : 'application/X-www-form-urlencoded'});
  //      return this.http.get(API.ADD_TRENDING_TOPIC(trendObjData)).map(
  //       (responseData) => {
  //         const key = '_body';
  //         return JSON.parse(responseData[key]);
  //       });
  //  }
   // Login user service
   

createBlogService(promotionid, content, promotionTitle) {
  const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
  // let headers;
   let resData;
   let options;
    var newDate=new Date();
    var created=newDate.getDate()+"-"+(newDate.getMonth()+1)+"-"+newDate.getFullYear()+" "+ newDate.toString().split(" ")[4];
   const headers = new Headers({'Content-Type' : 'application/X-www-form-urlencoded'});
     resData = 'image=' +
     '&groupTags=' +
      '&write_content_hidden=' +content +
      '&publish_up=' + created +
      '&copyrights= ' +
      '&send_notification_emails=1'  +
      '&created=' + created +
      '&write_content=' + content +
      '&published=' + 4 +
      '&subscription=1' + 
      '&title=' + promotionTitle +
      '&content=' + content +
      '&tags=' +  
      '&frontpage=' +
      '&allowcomment=' + 
      '&category_id=' + promotionid  +
      '&publish_down= 0000-00-00 00:00:00' +
      '&blogpassword=' +
      '&robots=' +
      '&excerpt=' +
      '&permalink=' +
      '&key='+currentuser.auth;
      console.log(resData);

   options = new RequestOptions({ headers });
   return this.http.post(API.CREATE_NEW_BLOG(), resData, options).map(
     (responseData) => {
       const key = '_body';
       return JSON.parse(responseData[key]);
     },
   );
 }

  // delete blog service call
  deleteBlogService(bid) {
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
       return this.http.delete(API.DELETE_BLOG(bid, currentuser.auth)).map(
        (responseData) => {
          const key = '_body';
          return JSON.parse(responseData[key]);
        });
   }
  getCategories(){
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
       return this.http.get(API.GET_CATEGORIES(currentuser.teamid)).map(
        (responseData) => {
          const key = '_body';
          return JSON.parse(responseData[key]);
        });
  }
  getBlogTags(){
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
       return this.http.get(API.GET_BLOG_TAGS(currentuser.auth)).map(
        (responseData) => {
          const key = '_body';
          return JSON.parse(responseData[key]);
        });
  }
    createTrendingTopic(topic,date){
   // const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    var format = require('date-fns/format');
      var created_date=format(date, ['YYYY-MM-DD HH:mm:ss']);
       return this.http.get(API.CREATE_TRENDING_TOPIC(topic,created_date)).map(
        (responseData) => {
          const key = '_body';
          return JSON.parse(responseData[key]);
        });
  }
   addTopicToCalendar(topic){
       const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
       return this.http.post(API.ADD_TOPIC_TO_CALENDAR(currentuser.auth,topic),'').map(
        (responseData) => {
          const key = '_body';
          return JSON.parse(responseData[key]);
        });
  }
  getBlogTypes(){
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
       return this.http.get(API.GET_BLOG_TYPES(currentuser.auth,currentuser.publishid)).map(
        (responseData) => {
          const key = '_body';
          return JSON.parse(responseData[key]);
        });
  }
  getBlogCountInCalendar(fromDate){
    
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
       return this.http.get(API.GET_BLOGS_COUNT_IN_CALENDAR(currentuser.id,fromDate)).map(
        (responseData) => {
          const key = '_body';
          return JSON.parse(responseData[key]);
        });
  }
      
}
