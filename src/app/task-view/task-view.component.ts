import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { DataStorageService } from '../data-storage.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    // Authorization: 'my-auth-token'
  }) 
};
@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit {

  constructor(private router:Router,private http:HttpClient, private storage: DataStorageService) { }


  @Input()  loadTasksFlg:boolean= false;

  // @ViewChildren('tasks', {read: ViewContainerRef}) 
  // public widgetTargets?: QueryList<ViewContainerRef>;

  @Input() tasks: any[] = [];
  ngOnInit(): void {
    this.http.get("http://192.168.1.236:9088/queryRunningTasks",  httpOptions).subscribe({
      complete: () => {  }, // completeHandler
      error: (e) => { console.log(e) },    // errorHandler 
      next: (res:any) => {
        console.log(res);
        for (var i = 0;i < res.RtnData.length;i++ ){
          //console.log(res.RtnData[i]);
          var tskInfo = this.storage.getTaskInfo(res.RtnData[i].Uid);
          //console.log(tskInfo);
          if (tskInfo != undefined) {
            this.tasks.push({Uid:res.RtnData[i].Uid, TaskInfo:tskInfo});
          }
        }
        
        this.loadTasksFlg = true;
        //console.log(this.tasks)
      },     // nextHandler
    });
  }

  navigateByUrl(url:string){
    //console.log(url);
    this.router.navigateByUrl(url);
  }
  


}
