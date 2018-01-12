import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';
import { API } from '../../api/api.urls';
import 'rxjs/add/operator/map';
import { IonServer } from '../../globals/global';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Injectable()
export class QueriesService {

  constructor(private http: Http,private router:Router) { }
  // Getting all queries.
  
  getAllQueries(startFrom,limit) {
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    if(this.router.url == '/queries/popular'){
      console.log("/queries/popular");
      console.log(IonServer.ION_SERVER+"/index.php/request?module=easydiscuss&action=get&resource=posts&username="+currentuser.username+"&limitstart=0&limit=15&featured=1");
      return this.http.get(IonServer.ION_SERVER+"/index.php/request?module=easydiscuss&action=get&resource=posts&username="+currentuser.username+"&limitstart=0&limit=15&featured=1")
      .map(
        (responseData) => {
            const key = '_body';
            return JSON.parse(responseData[key]); 
        });
    }else{
      return this.http.get(API.GET_ALL_QUERIES(currentuser.id,currentuser.username,startFrom,limit)).map(
        (responseData) => {
          const key = '_body';
          return JSON.parse(responseData[key]);
        },
      );
    }
   
   }

   // Getting unanswered queris.
   getUnAnsweredQueries(startFrom,limit) {
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    return this.http.get(API.GET_UNANSWERED_QUERIES(currentuser.id, currentuser.username,startFrom,limit)).map(
      (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]);
      },
    );
   }
    // Getting answered queris.
    getAnsweredQueries(startFrom,limit) {
      const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
      return this.http.get(API.GET_ANSWERED_QUERIES(currentuser.id, currentuser.username,startFrom,limit)).map(
        (responseData) => {
          const key = '_body';
          return JSON.parse(responseData[key]);
        },
      );
     }
     // Get detail querie
     getDetailQuerie(id) {
     const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
      return this.http.get(API.GET_DETAILS_QUERIE(id,currentuser.id)).map(
        (responseData) => {
          const key = '_body';
          return JSON.parse(responseData[key]);
        },
      );
     }
     // Adding answer to querie
     addAnswerToQuerie(replyData, qId,publishOrNotValue,attachments) {
       console.log(publishOrNotValue);
       
      const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
      return this.http.get(API.ADD_ANSWER_TO_QUERIE(qId, replyData, currentuser.id, currentuser.username, currentuser.pwd,publishOrNotValue,attachments)).map(
        (responseData) => {
          const key = '_body';
          return JSON.parse(responseData[key]);
        });
     }
     // Get querie reply templates
     getQuerieReplyTemplates() {
      const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
      return this.http.get(API.GET_QUERIE_TEMPLATES(currentuser.id)).map(
        (responseData) => {
          const key = '_body';
          return JSON.parse(responseData[key]);
        });
     }
     // Get querie reply templates
     addQuerieReplyTemplate(title) {
      const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
      return this.http.get(API.ADD_QUERIE_TEMPLATE(currentuser.id, title)).map(
        (responseData) => {
          const key = '_body';
          return JSON.parse(responseData[key]);
        });
     }
     // delete querie template call
     deleteQuerieTemplateData(tId) {
     // const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
      return this.http.get(API.DELETE_QUERIE_TEMPLATE(tId)).map(
        (responseData) => {
          const key = '_body';
          return JSON.parse(responseData[key]);
        });
     }
      dowmloadQuries(){
        const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
        return this.http.get(API.DOWNLOAD_QUERIES(currentuser.username)).map(
        (responseData) => {
          return responseData['_body'];
          // const key = '_body';
          // return JSON.parse(responseData[key]);
        });
       
      }
      getQueryCategories(){
        const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
        return this.http.get(API.GET_QUERIES_CATEGORIES(currentuser.teamid)).map(
        (responseData) => {
           const key = '_body';
          return JSON.parse(responseData[key]);
        });
      }
      queryTrasfer(catid,questionId){
         const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
        return this.http.get(API.TRANSER_QUERY(currentuser.username,currentuser.pwd,questionId,catid)).map(
        (responseData) => {
           const key = '_body';
          return JSON.parse(responseData[key]);
        });
      }
      editQuerieService(qid, title, content) {
        const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
       return this.http.get(API.UPDATE_QUERIE(qid, title, content, currentuser.username, currentuser.pwd)).map(
       (responseData) => {
          const key = '_body';
         return JSON.parse(responseData[key]);
       });
     }
    deleteQuery(questionId){
       const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
       return this.http.get(API.DELETE_QUERY(currentuser.username, currentuser.pwd,questionId)).map(
       (responseData) => {
          const key = '_body';
         return JSON.parse(responseData[key]);
       });
    }
     quickReplyUpdateService(content,editId){
          console.log(content);
         return this.http.get(API.UPDATE_QUICK_REPLY(content,editId)).map(
       (responseData) => {
          const key = '_body';
         return JSON.parse(responseData[key]); 
       });
     }
    makeTheQuestionASPoular(questionId){
       const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
       return this.http.put(API.MAKE_AS_POPULAR(currentuser.username, currentuser.pwd,questionId),'').map(
       (responseData) => {
          const key = '_body';
         return JSON.parse(responseData[key]);
       });
    }
      makeTheQuestionASPoularUnPopular(questionId)
      {
         const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
       return this.http.put(API.MAKE_AS_UNPOPULAR(currentuser.username, currentuser.pwd,questionId),'').map(
       (responseData) => {
          const key = '_body';
         return JSON.parse(responseData[key]);
       });
      }

}
