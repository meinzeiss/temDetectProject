import {  Component, Input, OnInit } from '@angular/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatSelect } from '@angular/material/select';
import { MatSlider, MatSliderChange } from '@angular/material/slider';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { DataStorageService } from '../data-storage.service';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    // Authorization: 'my-auth-token'
  }) 
};

class HttpReq_SingleCylinderTask {
  ScriptFileName!: string
  Pos! :number[]
  PosLimitSw! :number[]
  TotalTimes!: number
  TaskType!: number
}


@Component({
  selector: 'app-single-cylinder-task',
  templateUrl: './single-cylinder-task.component.html',
  styleUrls: ['./single-cylinder-task.component.css']
})
export class SingleCylinderTaskComponent implements OnInit {

  constructor(private http: HttpClient,private storage: DataStorageService,private router:Router) { }

  ngOnInit(): void {
  }

poses = [
  {
    value : 1,
    viewValue: "工位1",
  },
  {
    value : 2,
    viewValue: "工位2",
  },
];

taskTypes = [
  {
    value : 1,
    viewValue: "单推",
  },
  {
    value : 2,
    viewValue: "单拉",
  },
  {
    value : 3,
    viewValue: "推拉",
  },
]


  @Input() valTimes:number = 10;
  setValue_Times(evnt:MatSliderChange){
    if (evnt.value == null) return;
    this.valTimes = evnt.value;
  }

  @Input() valForce:number = 1000;
  setValue_Force(evnt:MatSliderChange){
    if (evnt.value == null) return;
    this.valForce = evnt.value;
  }

  posSelected:number = 0;
  posSelChanged(event:any) {
    this.posSelected = event.value;
  }
  tskTypeSelected:number = 0;
  tskTypeSelChanged(event:any) {
    console.log(event);
    this.tskTypeSelected = event.value;
  }

    
  barMode:ProgressBarMode = 'determinate';
  runTask(){
    this.clearWarn();
    if (this.checkInput() == false) return;

    this.barMode = 'query' ;

    var task = new HttpReq_SingleCylinderTask;
    task.Pos = [];
    task.Pos.push(this.posSelected);
    task.PosLimitSw = [];
    task.PosLimitSw.push(0,0);
    task.TotalTimes = this.valTimes;
    task.TaskType = this.tskTypeSelected;
    task.ScriptFileName = "1AC_pullOrPush.lua";
    console.log("post me");
    this.http.post("http://192.168.1.236:9088/newTask", task, httpOptions).subscribe({
      complete: () => { console.log("completed"); }, // completeHandler
      error: (e) => { console.log(e) },    // errorHandler 
      next: (res:any) => {
         console.log(res);
         this.storage.saveTaskInfo(res.RtnData, task);
         this.router.navigateByUrl('/mainboard/taskView');
       },     // nextHandler
    });
  }

  handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }


  checkInput() {
    if (this.posSelected == 0) {
      this.hideWarn_Pos = false;
      return false;
    }
    if (this.tskTypeSelected == 0) {
      this.hideWarn_TskType = false;
      return false;
    }
    return true;
  }
  clearWarn(){
    this.hideWarn_Pos = true;
    this.hideWarn_TskType = true;
  }
  @Input() hideWarn_Pos:boolean = true;

  @Input() hideWarn_TskType:boolean = true;

}
