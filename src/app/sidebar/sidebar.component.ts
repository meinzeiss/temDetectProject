import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  onCylinderView(){
    this.router.navigateByUrl('/mainboard/cylinderView');
  }
  
  onTaskView(){
    this.router.navigateByUrl('/mainboard/taskView');
  }
  
  onMenuView(){
    this.router.navigateByUrl('/mainboard/menuView');
  }
  onTaskHistory(){
    this.router.navigateByUrl('/mainboard/taskHistory');
  }
  onRealTimeChartView(){
    this.router.navigateByUrl('/mainboard/realTimeChart');
  }
  // onRealTimeChartView8chn(){
  //   this.router.navigateByUrl('/mainboard/realTimeChart8Channel');
  // }
  onNewCollectTaskView(){
    this.router.navigateByUrl('/mainboard/newCollectTask');
  }
  onHistoryCollectedTaskView(){
    this.router.navigateByUrl('/mainboard/historyCollectedTask');
  }
  // onHistoryCollectedTaskView8chn(){
  //   this.router.navigateByUrl('/mainboard/historyCollectedTask8Channel');
  // }
  onSystemStatusView(){
    this.router.navigateByUrl('/mainboard/systemStatus');
  }
  onSystemConfigView(){
    this.router.navigateByUrl('/mainboard/systemConfig');
  }
  onDevMaintainView(){
    this.router.navigateByUrl('/mainboard/devMaintain');
  }
}
