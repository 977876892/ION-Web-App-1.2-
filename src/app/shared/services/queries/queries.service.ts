import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';
import { API } from '../../api/api.urls';
import 'rxjs/add/operator/map';

@Injectable()
export class QueriesService {

  constructor(private http: Http) { }
  // Getting all queries.
  getAllQueries() {
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    return this.http.get(API.GET_ALL_QUERIES(currentuser.username)).map(
      (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]);
      },
    );
   }

   // Getting unanswered queris.
   getUnAnsweredQueries() {
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    return this.http.get(API.GET_UNANSWERED_QUERIES(currentuser.id, currentuser.username)).map(
      (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]);
      },
    );
   }
    // Getting answered queris.
    getAnsweredQueries() {
      const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
      return this.http.get(API.GET_ANSWERED_QUERIES(currentuser.id, currentuser.username)).map(
        (responseData) => {
          const key = '_body';
          return JSON.parse(responseData[key]);
        },
      );
     }
     // Get detail querie
     getDetailQuerie(id) {
     // const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
      return this.http.get(API.GET_DETAILS_QUERIE(id)).map(
        (responseData) => {
          const key = '_body';
          return JSON.parse(responseData[key]);
        },
      );
     }
     // Adding answer to querie
     addAnswerToQuerie(replyData, qId) {
      const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
      return this.http.get(API.ADD_ANSWER_TO_QUERIE(qId, replyData, currentuser.id, currentuser.username, currentuser.pwd)).map(
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

}
