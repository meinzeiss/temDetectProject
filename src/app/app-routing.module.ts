import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CylinderViewComponent } from './cylinder-view/cylinder-view.component';
import { DualCylinderTaskComponent } from './dual-cylinder-task/dual-cylinder-task.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MenuViewComponent } from './menu-view/menu-view.component';
import { NewTaskComponent } from './new-task/new-task.component';
import { SetScriptsComponent } from './set-scripts/set-scripts.component';
import { SingleCylinderTaskComponent } from './single-cylinder-task/single-cylinder-task.component';
import { TaskHistoryComponent } from './task-history/task-history.component';
import { TaskViewComponent } from './task-view/task-view.component';
import { TestAComponent } from './test-a/test-a.component';
import { RealTimeChartViewComponent } from './real-time-chart-view/real-time-chart-view.component';
import { RealTimeChartView8ChannelComponent } from './real-time-chart-view8-channel/real-time-chart-view8-channel.component';
import { NewCollectTaskComponent } from './new-collect-task/new-collect-task.component';
import { HistoryCollectedInfoComponent } from './history-collected-info/history-collected-info.component';
import { HistoryCollectedInfo8ChannelComponent } from './history-collected-info8-channel/history-collected-info8-channel.component';
import { SystemStatusComponent } from './system-status/system-status.component';
import { SystemConfigComponent } from './system-config/system-config.component';
import { RedirectComponent } from './redirect/redirect.component';
import { RealTimeChartViewRefComponent } from './real-time-chart-view-ref/real-time-chart-view-ref.component';
import { HistoryCollectedInfoRefComponent } from './history-collected-info-ref/history-collected-info-ref.component';
import { DeviceMaintainComponent } from './device-maintain/device-maintain.component';

const routes: Routes = [
  {
    path:'',
    redirectTo: '/mainboard',
    pathMatch: 'full',
  },
  {
    path: 'mainboard',
    component: MainLayoutComponent,
    children: [
      {path: '', component:RealTimeChartViewRefComponent  },  //RealTimeChartViewComponent
      {path:'cylinderView', component: CylinderViewComponent },
      {path:'taskView', component:TaskViewComponent},
      {path:'menuView', component: MenuViewComponent },
      {path:'taskHistory', component: TaskHistoryComponent},
      {path:'newTask', component: NewTaskComponent},
      {path:'setScripts', component: SetScriptsComponent},
      {path:'singleCylinderTask', component: SingleCylinderTaskComponent},
      {path:'dualCylinderTask', component:DualCylinderTaskComponent},
      {path: 'a', component: TestAComponent},
      {path:'realTimeChart', component: RealTimeChartViewRefComponent},
      {path:'newCollectTask', component: NewCollectTaskComponent},
      {path:'historyCollectedTask', component: HistoryCollectedInfoRefComponent},
      {path:'systemStatus', component: SystemStatusComponent},
      {path:'systemConfig', component: SystemConfigComponent},
      {path:'devMaintain', component: DeviceMaintainComponent},
      //{path:'realTimeChart8Channel', component: RealTimeChartView8ChannelComponent},
      //{path:'historyCollectedTask8Channel', component: HistoryCollectedInfo8ChannelComponent},
      {path:'monitor', component: RedirectComponent, pathMatch:'full'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
