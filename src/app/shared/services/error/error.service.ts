import { Injectable } from '@angular/core';
import { IonServer } from '../../globals/global';
@Injectable()
export class ErrorService {

  constructor() {}

  logError(err){
         if(err.status  === 400){
             let details = err.json();
             return details.message;
           }
        else if(err.status  === 500 ||err.status  === 503){
            return IonServer.nointernet_connection_err;
        }
        else if(err.status  === 0){
            return "Please Try Again.";
        }
  }
}