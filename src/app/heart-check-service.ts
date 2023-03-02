import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, } from '@angular/core';
import { Subject, } from 'rxjs';
import * as env from '@environment';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    // Authorization: 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})

export class HeartCheckService {
  // observable: Observable<any>;
  // interTime: any;              // 连接成功
  period:number = 1000;                        // 10秒检查一次
  result: any;
  heartIntv : any;
  subject : Subject<any>;

  constructor(private http: HttpClient) {
    // console.log('On ngOnInit');

    this.subject = new Subject<any>();

    this.heartIntv = setInterval(() => {

      // this.http.get("http://121.196.8.190:9085/heart", httpOptions).subscribe({
      this.http.get(env.url(env.Api_HeartCheck), httpOptions).subscribe({
        complete: () => {  }, // completeHandler
        error: (e) => { 
          // console.log(e);
          this.subject.next(e);
        },    // errorHandler 
        next: (res:any) => {
          this.subject.next(res);
        },     // nextHandler
      });
    }, this.period);
  }  
  
  getSubject() {
    return this.subject;
  }

}
