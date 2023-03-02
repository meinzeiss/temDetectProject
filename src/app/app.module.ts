import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as env from '@environment';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CylinderViewComponent } from './cylinder-view/cylinder-view.component';
import { TaskViewComponent } from './task-view/task-view.component';
import { MenuViewComponent } from './menu-view/menu-view.component';
import { CylinderInfoComponent } from './cylinder-info/cylinder-info.component';
// https://www.npmjs.com/package/angular-disable-browser-back-button
// 防止页面后退
import { BackButtonDisableModule } from 'angular-disable-browser-back-button';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { LoggerModule, NgxLoggerLevel} from 'ngx-logger';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { TaskHistoryComponent } from './task-history/task-history.component';
import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { TaskInfoComponent } from './task-info/task-info.component';
import { NewTaskComponent } from './new-task/new-task.component';
import { TaskDirectiveDirective } from './task-directive.directive';
import { SingleCylinderTaskComponent } from './single-cylinder-task/single-cylinder-task.component';
import { DualCylinderTaskComponent } from './dual-cylinder-task/dual-cylinder-task.component';
import { SetScriptsComponent } from './set-scripts/set-scripts.component';
import { HttpClientModule } from '@angular/common/http';
import { TaskRunningVSingleComponent } from './task-running-vsingle/task-running-vsingle.component';
import { TaskRunningVDualComponent } from './task-running-vdual/task-running-vdual.component';
import { TaskInfoViewRefComponent } from './task-info-view-ref/task-info-view-ref.component';
import { TestAComponent } from './test-a/test-a.component';
import { NewCollectTaskComponent } from './new-collect-task/new-collect-task.component';
import { HistoryCollectedInfoComponent } from './history-collected-info/history-collected-info.component';
import { HistoryCollectedInfo8ChannelComponent } from './history-collected-info8-channel/history-collected-info8-channel.component';

import { SystemStatusComponent } from './system-status/system-status.component';
import { SystemConfigComponent } from './system-config/system-config.component';
// for table demo test
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { RealTimeChartViewComponent } from './real-time-chart-view/real-time-chart-view.component';
import { RealTimeChartView8ChannelComponent } from './real-time-chart-view8-channel/real-time-chart-view8-channel.component';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
import { RedirectComponent } from './redirect/redirect.component';
import { CookieService } from 'ngx-cookie-service';
import { RealTimeChartViewRefComponent } from './real-time-chart-view-ref/real-time-chart-view-ref.component';
import { HistoryCollectedInfoRefComponent } from './history-collected-info-ref/history-collected-info-ref.component';
import { DeviceMaintainComponent } from './device-maintain/device-maintain.component';

registerLocaleData(zh);


@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    HeaderComponent,
    SidebarComponent,
    CylinderViewComponent,
    TaskViewComponent,
    MenuViewComponent,
    CylinderInfoComponent,
    TaskHistoryComponent,
    TaskInfoComponent,
    NewTaskComponent,
    TaskDirectiveDirective,
    SingleCylinderTaskComponent,
    DualCylinderTaskComponent,
    SetScriptsComponent,
    TaskRunningVSingleComponent,
    TaskRunningVDualComponent,
    TaskInfoViewRefComponent,
    TestAComponent,
    RealTimeChartViewComponent,
    NewCollectTaskComponent,
    HistoryCollectedInfoComponent,
    SystemStatusComponent,
    SystemConfigComponent,
    RealTimeChartView8ChannelComponent,
    HistoryCollectedInfo8ChannelComponent,
    RedirectComponent,
    RealTimeChartViewRefComponent,
    HistoryCollectedInfoRefComponent,
    DeviceMaintainComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatSliderModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatTableModule,
    HttpClientModule,
    NgxEchartsModule.forRoot({ echarts }),
    BackButtonDisableModule.forRoot(),
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgbModule,
    NzTimePickerModule,
    NzDatePickerModule,
    NzTableModule,
    NzDescriptionsModule,
    NzDividerModule,
    NzSwitchModule,
    NzCheckboxModule,
    NzModalModule,
    NzDrawerModule,
    NzIconModule,
    NzDropDownModule,
    NzButtonModule,
    LoggerModule.forRoot({
      serverLoggingUrl: '/api/logs',
      level:NgxLoggerLevel.DEBUG,
      serverLogLevel:NgxLoggerLevel.ERROR,
    }),
  ],
  // providers: [{ provide: NZ_I18N, useValue: zh_CN }],
  providers: [CookieService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [HttpClient],
      multi: true
    },
    {
      provide: NZ_I18N, 
      useValue: zh_CN,  
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function initializeApp(httpClient: HttpClient) {
  // console.log("initializeApp called");
  return () => new Promise((resolve, reject) => {
    httpClient.get("assets/constant-info/app-data.json").subscribe({
      complete: () => { }, // completeHandler
      error: (e: any) => {
        // console.log(e);
        reject(e);
      },    // errorHandler 
      next: (res: any) => {
        // console.log(res);
        env.SrvInfo.BaseUrl = res.app.ip;
        env.SrvWsInfo.WsUrl = res.app.ws;
        env.SrvOptions.SamplingPeriodEnable = res.app.samplingPeriodEnable;
        env.SrvOptions.SamplingPeriod = res.app.samplingPeriod;
        env.SrvOptions.ChannelCntType = res.app.channelMode;
        env.AppInfo.Title = res.app.appTitle;
        env.AppInfo.MonitorUrl = res.app.monitorCenterUrl;
        // console.log('initEnvironment, BaseUrl = ', env.SrvInfo.BaseUrl);
        // console.log('initEnvironment WsUrl = ', env.SrvWsInfo.WsUrl);
        resolve(null);
      },     // nextHandler
    });
  });

}