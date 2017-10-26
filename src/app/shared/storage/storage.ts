import { Injectable } from '@angular/core';
// import { Locker } from './safeguard';

@Injectable()
export class Storage {
  driver: any;
  _session: any;
  _isSafariPrivate: any;

  constructor() {
    this._session = localStorage.get('session');
  }
  // SESSION
  get session() {
    return this._session;
  }
  set session(value) {
    this._session = value;
    localStorage.setItem('session', value);
  }
}
