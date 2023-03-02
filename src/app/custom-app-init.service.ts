import { HttpClient } from '@angular/common/http';
import * as env from '../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CustomAppInitService {
  constructor(private httpClient: HttpClient) {}

  initEnvironment(resolve: any, reject: any) {    
    this.httpClient.get("assets/constant-info/app-data.json").subscribe({
      complete: () => { }, // completeHandler
      error: (e: any) => {
        // console.log(e);
        reject(e);
      },    // errorHandler 
      next: (res: any) => {
        // console.log(res);
        env.SrvInfo.BaseUrl = res.app.ip;
        env.SrvWsInfo.WsUrl = res.app.ws;
        // console.log('initEnvironment, BaseUrl = ', env.SrvInfo.BaseUrl);
        // console.log('initEnvironment WsUrl = ', env.SrvWsInfo.WsUrl);
        resolve(res);
      },     // nextHandler
    });    
  };

  srartInit(): Promise<any> {
    // console.log('initEnvironment srartInit onCalled');
    return new Promise((resolve, reject) => {
      this.httpClient.get("assets/constant-info/app-data.json").subscribe({
        complete: () => { }, // completeHandler
        error: (e: any) => {
          // console.log(e);
          reject(e);
        },    // errorHandler 
        next: (res: any) => {
          // console.log(res);
          env.SrvInfo.BaseUrl = res.app.ip;
          env.SrvWsInfo.WsUrl = res.app.ws;
          // console.log('initEnvironment, BaseUrl = ', env.SrvInfo.BaseUrl);
          // console.log('initEnvironment WsUrl = ', env.SrvWsInfo.WsUrl);
          resolve(res);
        },     // nextHandler
      });    
    });
  };

}
