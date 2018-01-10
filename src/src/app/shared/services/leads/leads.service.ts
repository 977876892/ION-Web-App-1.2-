import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';
import { API } from '../../api/api.urls';
import 'rxjs/add/operator/map';

@Injectable()
export class LeadsService {

  constructor(private http: Http) { }

// Get all leads service
getLeadsListService() {
  const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
  return this.http.get(API.GET_ALL_LEADS(currentuser.teamid, currentuser.username, currentuser.pwd)).map(
    (responseData) => {
      const key = '_body';
      return JSON.parse(responseData[key]);
    });
}
// add lead service
addLeadService(leadObj) {
  const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
  leadObj.uid = currentuser.teamid;
  //leadObj.ctags = 'head';
  console.log(leadObj);
  return this.http.get(API.ADD_LEAD(leadObj)).map(
    (responseData) => {
      const key = '_body';
      return JSON.parse(responseData[key]);
    });
}
  updateLeadService(leadObj){
        const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
        leadObj.uid = currentuser.teamid;
       // leadObj.ctags = 'head';
       console.log(leadObj);
        return this.http.put(API.UPDATE_LEAD(leadObj,currentuser.username,currentuser.pwd),'').map(
          (responseData) => {
            const key = '_body';
            return JSON.parse(responseData[key]);
          });

  }
// filter leads service
filterLeads(filterObj) {
  console.log(filterObj.vlaue);
  const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
  return this.http.get(API.GET_LEADS_BY_FILTER(currentuser.id, currentuser.username, currentuser.pwd,filterObj.value)).map(
    (responseData) => {
      const key = '_body';
      return JSON.parse(responseData[key]);
    });
}
  //down load leads
  downloadLeads() {
  //console.log(filterObj.vlaue);
  const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
  return this.http.get(API.GET_DOWNLOAD_LEADS(currentuser.id,currentuser.username, currentuser.pwd)).map(
    (responseData) => {
      const key = '_body';
      return responseData['_body'];
    });
}
  //delete leads
  deleteLeads(ids){
    //console.log(filterObj.vlaue);
  const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
  return this.http.get(API.DELETE_LEADS(currentuser.id,currentuser.username, currentuser.pwd,ids)).map(
    (responseData) => {
      const key = '_body';
      return responseData['_body'];
    });
  }
  //get lead tags

  getLeadTags(){
      const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
      return this.http.get(API.GET_LEAD_TAGS(currentuser.id)).map(
        (responseData) => {
          const key = '_body';
          return JSON.parse(responseData[key]);
        });
    
  }
  getLeadsListServiceByLimit(start,limit,filterObj){
    if(filterObj.value.tags==null)
      {
        filterObj.value.tags='';
      }
   const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    return this.http.get(API.GET_ALL_LEADS_LIMIT(currentuser.teamid, currentuser.username, currentuser.pwd,start,limit,filterObj.value)).map(
      (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]);
      });
    }
    addTagsToContacts(tags,ids){
      const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
      return this.http.get(API.ADD_TAGS_TO_CONTACTS(currentuser.teamid,tags,ids)).map(
      (responseData) => {
        const key = '_body';
        return JSON.parse(responseData[key]);
      });
    }


}
export class DataService{
      public static dataFromService='';
}