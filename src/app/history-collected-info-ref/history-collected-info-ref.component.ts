import { Component, OnInit, ViewChild } from '@angular/core';
import { HistoryCollectedInfoComponent } from '../history-collected-info/history-collected-info.component';
import { HistoryCollectedInfo8ChannelComponent } from '../history-collected-info8-channel/history-collected-info8-channel.component';
import { TaskDirectiveDirective } from '../task-directive.directive';
import * as env from '@environment';

@Component({
  selector: 'app-history-collected-info-ref',
  templateUrl: './history-collected-info-ref.component.html',
  styleUrls: ['./history-collected-info-ref.component.css']
})
export class HistoryCollectedInfoRefComponent implements OnInit {
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
       let ref = viewContainerRef.createComponent(HistoryCollectedInfoComponent);
       //ref.instance.taskCfg = this.TaskCfg;
 
     } else if  (channelCnt == 8) {
       let ref = viewContainerRef.createComponent(HistoryCollectedInfo8ChannelComponent);
       //ref.instance.taskCfg = this.TaskCfg;
     }
   }
}
