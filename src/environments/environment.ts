// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

export const AppInfo = {
  Title: '',
  MonitorUrl:'',
};

export const SrvInfo = {
  BaseUrl: '',
};

export const SrvWsInfo = {
  WsUrl: '',
};

export const SrvOptions = {
  SamplingPeriodEnable: '',
  SamplingPeriod: 1,
  ChannelCntType: 15,
};

export const url = (route: string) => {
  return SrvInfo.BaseUrl + route;
}

export const Api_HeartCheck = '/heart';
export const Api_LastTaskDataInMins = '/task/data';
export const Api_StopTask = '/task/stop';
export const Api_AddTask = '/task/add';
export const Api_HistoryTasks = '/task/list';
export const Api_HistoryTaskDetail = '/task/data';
export const Api_CalcResult = '/calcResult';
export const Api_TaskDetailDownload = '/task/excel';
export const Api_CheckMaintain = '/maintain';
export const Api_GetMaintainInfo = '/maintain ';
export const Api_SetMaintainDesc = '/maintain/desc';
export const Api_SetMaintainConfig = '/maintain/data';
export const Api_SendMaintainOperation= '/maintain/check ';
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
