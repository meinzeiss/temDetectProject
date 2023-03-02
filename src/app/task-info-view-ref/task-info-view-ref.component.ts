import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TaskDirectiveDirective } from '../task-directive.directive';
import { TaskRunningVDualComponent } from '../task-running-vdual/task-running-vdual.component';
import { TaskRunningVSingleComponent } from '../task-running-vsingle/task-running-vsingle.component';


const ArtPos = [
  "",
  "looks_one",
  "looks_two",
  "looks_3",
  "looks_4",
  "looks_5",
  "looks_6",
  "looks_7",
  "looks_8",
]

@Component({
  selector: 'app-task-info-view-ref',
  templateUrl: './task-info-view-ref.component.html',
  styleUrls: ['./task-info-view-ref.component.css']
})
export class TaskInfoViewRefComponent implements OnInit {
  @Input() TaskCfg:any;
  @Input() TaskUid:any;
  
  constructor() { }


  @ViewChild(TaskDirectiveDirective, {static: true}) 
  private taskDirective!: TaskDirectiveDirective;  

  @Input() taskUid!:string;
  @Input() poses:string[] = [];
  ngOnInit(): void {
    //console.log(this.TaskUid);
    this.taskUid = this.TaskUid;
    this.transPosExpress(this.TaskCfg.Pos);

    this.switchView();
  }

  

  transPosExpress(pos:number[]){
    //console.log(pos);
    for (let i = 0;i < pos.length; i++) {
      if (pos[i]> 0 ) {
        this.poses.push(ArtPos[pos[i]]);
      }
    }
  }

  switchView(){
    
   const viewContainerRef = this.taskDirective.viewContainerRef;
    if (this.TaskCfg.ScriptFileName == '1AC_pullOrPush.lua') {
      let ref = viewContainerRef.createComponent(TaskRunningVSingleComponent);
      ref.instance.taskCfg = this.TaskCfg;

    } else if  (this.TaskCfg.ScriptFileName == '2AC_pullOrPush.lua') {
      let ref = viewContainerRef.createComponent(TaskRunningVDualComponent);
      ref.instance.taskCfg = this.TaskCfg;
    }
  }
}
