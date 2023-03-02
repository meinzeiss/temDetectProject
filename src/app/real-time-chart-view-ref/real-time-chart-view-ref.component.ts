import { Component, OnInit, ViewChild } from '@angular/core';
import { RealTimeChartViewComponent } from '../real-time-chart-view/real-time-chart-view.component';
import { RealTimeChartView8ChannelComponent } from '../real-time-chart-view8-channel/real-time-chart-view8-channel.component';
import { TaskDirectiveDirective } from '../task-directive.directive';
import * as env from '@environment';

@Component({
  selector: 'app-real-time-chart-view-ref',
  templateUrl: './real-time-chart-view-ref.component.html',
  styleUrls: ['./real-time-chart-view-ref.component.css']
})
export class RealTimeChartViewRefComponent implements OnInit {

  constructor() { }

  @ViewChild(TaskDirectiveDirective, {static: true}) 
  private taskDirective!: TaskDirectiveDirective;  
  
  ngOnInit(): void {
    this.switchView();
  }


  switchView(){
    
    const viewContainerRef = this.taskDirective.viewContainerRef;
    const channelCnt = env.SrvOptions.ChannelCntType;
    if (channelCnt == 15 || channelCnt == 0) {
       let ref = viewContainerRef.createComponent(RealTimeChartViewComponent);
       //ref.instance.taskCfg = this.TaskCfg;
 
     } else if  (channelCnt == 8) {
       let ref = viewContainerRef.createComponent(RealTimeChartView8ChannelComponent);
       //ref.instance.taskCfg = this.TaskCfg;
     }
   }
}
