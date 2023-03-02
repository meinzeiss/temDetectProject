import { HttpClient, HttpHeaders, HttpResponse, } from '@angular/common/http';
import { Component, OnInit, } from '@angular/core';
import { HeartCheckService } from '../heart-check-service';
import { LogService } from '../log.service';
import * as env from '@environment';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    // Authorization: 'my-auth-token'
  })
};

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoading: boolean = false;
  loginStatus: number = 0;
  runningTask?: string;
  taskUid: string = '';
  sysStatus: boolean = true;
  taskInfo: string;
  localColor: string;
  logSrv: LogService;
  cookieSrv: CookieService;
  cmptName: string = 'HeaderComponent';
  http: HttpClient;
  appTitle: string = '';
  showDialog: boolean = false;
  showPwDialog: boolean = false;
  dialogMsg: string = '';
  loginPw: string = '';
  showMaintianBell:boolean = false;

  constructor(private router: Router, heartSrv: HeartCheckService, logger: LogService, httpClient: HttpClient, private cookieService: CookieService) {
    this.taskInfo = '无任务';
    this.localColor = 'primary';
    this.logSrv = logger;
    this.http = httpClient;
    this.cookieSrv = cookieService;
    heartSrv.getSubject().subscribe(this.Deal.bind(this));
  }

  Deal(res: any) {
    // console.log(res);
    if (res != undefined && res.RtnData != undefined) {
      // console.log(res.RtnData);
      this.sysStatus = true;
      this.runningTask = res.RtnData.RunningTask;
      if (res.RtnData.RunningTask != null && res.RtnData.RunningTask != undefined
        && res.RtnData.RunningTask.Uid != null && res.RtnData.RunningTask.Uid != undefined) {
        let taskUid = res.RtnData.RunningTask.Uid;
        if (taskUid.length > 0) {
          this.taskUid = taskUid;
        } else {
          this.taskUid = '';
        }
      } else {
        this.taskUid = '';
      }
      this.taskInfo = this.taskUid != null && this.taskUid.length > 0 ? '进行中' : '无任务';
      if (this.taskUid.length > 0) {
        this.logSrv.info(this.cmptName, `--任务ID [${this.taskUid}] 正在进行中--`);
      } else {
        this.logSrv.info(this.cmptName, `--暂无任务--`);
      }
    } else if (res == undefined || res == null) {
      this.taskUid = '';
      this.sysStatus = false;
      this.runningTask = undefined;
      this.taskInfo = '无任务';
      this.logSrv.info(this.cmptName, `--与服务端WebSocket通讯已中断--`);
    }    
    // console.log('Deal,res =', res);
    let status = res.status;
    if(status == 0){
      this.sysStatus = false;
    }
    this.localColor = this.taskUid != undefined && this.taskUid.length > 0 ?
      'accent' : (this.sysStatus ? 'primary' : 'warn');
  }

  ngOnInit(): void {
    this.appTitle = env.AppInfo.Title;
    this.loginCheck();
  }
  ngAfterViewInit(): void {
    this.checkMaintainFlg();
  }
  setScripts() {
    this.router.navigateByUrl('/mainboard/setScripts');
  }
  loginOrLogout() {
    this.isLoading = false;
    var chktoken = this.cookieSrv.get('AppToken');
    console.log('chktoken =', chktoken);
    if (chktoken != null && chktoken != undefined
      && chktoken.length > 0 && this.loginStatus == 1) {
      this.loginStatus = 0;
      this.cookieSrv.delete('AppToken');
    } else {
      this.showPasswordDialog();
    }
  }
  loginWithPw() {
    console.log('this.isLoading =',this.isLoading);
    setTimeout(() => {
      if (!this.isLoading) {
        this.isLoading = true;
        // var chktoken = this.cookieSrv.get('AppToken');
        console.log('loginWithPw-loginPw =', this.loginPw);
        let param = {
          password: this.loginPw,
        }
        let json = JSON.stringify(param);
        this.http.post(env.url(env.Api_Login), json, httpOptions).subscribe({
          complete: () => { }, // completeHandler
          error: (e: any) => {
            console.warn(e);
            this.isLoading = false;
            this.loginStatus = 0;
            this.dialogMsg = '登录失败';
            this.showMsgDialog();
          },    // errorHandler 
          next: (res: any) => {
            this.isLoading = false;
            console.log(res);
            if (res.Code == 0) {
              this.loginStatus = 1;
              this.dialogMsg = '登录成功';
              this.showMsgDialog();
              let cookie = res.RtnData.token;
              console.log('loginWithPw-new cookie =', cookie);
              this.cookieSrv.set('AppToken', cookie);
              this.loginPw = '';
              // let chktoken = this.cookieSrv.get('AppToken');
              // console.log('chktoken =', chktoken);
              // this.cookieSrv.set('AppToken', 'Hello World');
              //console.log(this.tasks)
            } else {
              this.loginStatus = 0;
              this.dialogMsg = '登录失败, Code=' + res.Code;
              this.showMsgDialog();
            }
          },     // nextHandler
        });
      }
    }, 300);
  }
  loginCheck() {
    setTimeout(() => {
      if (!this.isLoading) {
        this.isLoading = true;
        var chktoken = this.cookieSrv.get('AppToken');
        // console.log('loginCheck-token =', chktoken);
        if (chktoken != null && chktoken != undefined && chktoken.length > 0) {
          let myheaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'token': chktoken,
          });
          // console.log('myheaders =', myheaders);
          this.http.post(env.url(env.Api_LoginCheck), null, { headers: myheaders }).subscribe({
            complete: () => { }, // completeHandler
            error: (e: any) => {
              console.warn(e);
              this.isLoading = false;
              this.loginStatus = 0;
              this.cookieSrv.delete('AppToken');
              // this.dialogMsg = '登录状态已过期，请重新登录';
              // this.showMsgDialog();
            },    // errorHandler 
            next: (res: any) => {
              // console.log(res);
              this.isLoading = false;
              this.loginStatus = 1;
              // this.dialogMsg = '登录状态有效';
              // this.showMsgDialog();
            },     // nextHandler
          });
        }
      }
    }, 300);
  }
  gotoMonitor(){
    console.log('monitorPlatform =', env.AppInfo.MonitorUrl);
    // window.location.href = env.AppInfo.MonitorUrl;
    let cookie = this.cookieSrv.get('AppToken');
    let fullUrl = env.AppInfo.MonitorUrl + '?token=' + cookie;
    console.log('fullUrl =', fullUrl);
    // window.location.href = fullUrl;
    window.open(fullUrl, '_blank', 'noopener'); 
  }
  checkMaintainFlg(){
    setTimeout(() => {
      let url = env.url(env.Api_CheckMaintain);      
      // console.log('FullUrl =',url);
      this.http.get(env.url(env.Api_CheckMaintain)).subscribe({
        complete: () => { }, // completeHandler
        error: (e) => {
          // console.log('error');
          console.warn(e);
        },    // errorHandler 
        next: (res: any) => {
          // console.log(res);
          if(res != null && res != undefined && res.Code == 0
            && res.RtnData != null && res.RtnData != undefined){
            let lastInfo = res.RtnData.Last;
            let lastDate = new Date(lastInfo).getTime()/1000;// - (60*60*24*90); //for test
            let nowDate = new Date().getTime()/1000;
            let diffDay = Math.round((nowDate - lastDate) / (60*60*24));
            let duration = res.RtnData.Duration;
            let notifyDay = res.RtnData.NotifyDay;   
            // console.log('lastDate =',lastDate);          
            // console.log('diffDay =',diffDay);
            // console.log('duration =',duration);
            // console.log('notifyDay =',notifyDay);
            if(diffDay >= (duration - notifyDay)){
              this.showMaintianBell = true;
            }else{
              this.showMaintianBell = false;
            }
          }else{
            this.showMaintianBell = false;
          }
        },     // nextHandler
      });
    }, 200);
  }
  // monitorPlatform() {
  //   console.warn('monitorPlatform =', env.AppInfo.MonitorUrl);
  //   // this.router.navigateByUrl('/mainboard/monitor');
  // }
  refresh() {
    location.reload();
  }
  showMsgDialog() {
    this.showDialog = true;
  }
  handleOk(): void {
    // console.log('Button ok clicked!');
    this.showDialog = false;
  }
  handleCancel(): void {
    // console.log('Button cancel clicked!');
    this.showDialog = false;
  }
  showPasswordDialog() {
    this.showPwDialog = true;
  }
  pwHandleCancel(): void {
    // console.log('Button cancel clicked!');
    this.showPwDialog = false;
  }
  pwHandleOk(): void {
    console.log('pwHandleOk clicked!');
    this.loginWithPw();
    this.showPwDialog = false;
  }
  // login() {
  //   // this.cookieSrv.delete('MyTest');
  //   // let token = this.cookieSrv.get('token');
  //   // console.log('token =', token);
  //   // let cookieValue = this.cookieSrv.get('MyTest');
  //   // console.log('MyTest.cookieValue =', cookieValue);
  //   this.isLoading = true;

  //   var chktoken = this.cookieSrv.get('AppToken');
  //   console.log('chktoken =', chktoken);

  //   if (this.loginStatus == 1) {
  //     console.log('loginStatus == 1');
  //     // httpOptions.headers.append('token',chktoken);
  //     let myheaders = new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'token': chktoken,
  //       // Authorization: 'my-auth-token'
  //     });
  //     // myheaders.append('AppToken',chktoken,);
  //     // myheaders.set('Token',chktoken,);
  //     console.log('myheaders =', myheaders);
  //     this.http.post(env.url(env.Api_LoginCheck), null, { headers: myheaders }).subscribe({
  //       complete: () => { }, // completeHandler
  //       error: (e) => {
  //         console.warn(e);
  //         this.loginStatus = 1;
  //         this.isLoading = false;
  //         this.dialogMsg = '退出登录失败';
  //         this.showMsgDialog();
  //         this.isLoading = false;
  //       },    // errorHandler 
  //       next: (res: any) => {
  //         console.log(res);
  //         this.loginStatus = 0;
  //         this.isLoading = false;
  //         this.dialogMsg = '退出登录成功';
  //         this.showMsgDialog();
  //         this.isLoading = false;
  //       },     // nextHandler
  //     });
  //   } else {
  //       // let queryParams = new HttpParams().append("password", "123456");
  //       // let param = {
  //       //   password:'123456'
  //       // }
  //       // let json = JSON.stringify(param);
  //       // console.log('param =',json);
  //       // this.http.post<any>(env.url(env.Api_Login),json, {observe: 'response',responseType: 'json'})
  //       //   .subscribe((response: HttpResponse<any>) => {
  //       //     try {
  //       //       if (response != null && response != undefined) {
  //       //         console.log('check cookie: ', response.headers.get('Set-Cookie'));
  //       //         console.log('response Called');
  //       //         console.log(response);
  //       //         console.warn('cookieSrv chk cookie=', this.cookieSrv.check('token'));
  //       //         console.warn('cookie all =', this.cookieSrv.getAll());
  //       //         const headers: HttpHeaders = response.headers;
  //       //         const body: any = response.body;
  //       //         let type = headers.get('content-type');
  //       //         console.log(type);
  //       //         let cookie = headers.get('Set-Cookie');
  //       //         console.log('Set-Cookie = ',cookie);
  //       //         console.log('headers = ', response.clone());
  //       //         if (type != null && !type.includes('application/json')) {
  //       //           // let buffer = body as ArrayBuffer;
  //       //           // var protoBuf = Buffer.from(buffer);
  //       //           // let protoMsg = this.protocSrc.deserializeMessageBinary(protoBuf);
  //       //           // let array = protoMsg.array;
  //       //           // console.log(array);
  //       //         } else {
  //       //           console.log(body);
  //       //         }
  //       //       }
  //       //     } catch (error) {
  //       //       console.log(error);
  //       //     }
  //       //     // this.showChartLoading(false);
  //       //   });
  //   }
  // }
}
