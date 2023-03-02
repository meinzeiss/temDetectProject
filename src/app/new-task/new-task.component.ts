import { Component,  OnInit, ViewChild, } from '@angular/core';
import { DualCylinderTaskComponent } from '../dual-cylinder-task/dual-cylinder-task.component';
import { SingleCylinderTaskComponent } from '../single-cylinder-task/single-cylinder-task.component';
import { TaskDirectiveDirective } from '../task-directive.directive';


@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent implements OnInit {

  @ViewChild(TaskDirectiveDirective, {static: true}) 
  private taskDirective!: TaskDirectiveDirective;  

  tskTypes = [
    {
      value: 1,
      viewValue:"单缸任务",
    },
    {
      value: 2,
      viewValue:"双缸任务",
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

  selectChanged(event:any){
    
  const viewContainerRef = this.taskDirective.viewContainerRef;
  viewContainerRef.clear();

  switch (event.value){
    case 1:
    
      //const componentRef = 
      viewContainerRef.createComponent(SingleCylinderTaskComponent);
      //componentRef.instance.data = adItem.data;
      break;
    case 2:
      //const componentRef = 
      viewContainerRef.createComponent(DualCylinderTaskComponent);
      //componentRef.instance.data = adItem.data;
      break;
      default:
        break;
    }
  }


}
