import { Injectable } from '@angular/core';
import * as goog from 'google-protobuf';

declare function require(path: string) : any;
let proto = require('../assets/proto-js/schemas_pb.js');

@Injectable({
  providedIn: 'root'
})

export class ProtobufService {
  readonly proto: any = proto;

  constructor() {

  }

  // serializeBinaryMessage(data:any): Uint8Array {
  //   console.log('ProtobufService 1');
  //   var message = new proto.Msg_Data();
  //   console.log(message);
  //   // message.setStartTime(data.StartTime);
  //   // message.setSecOffset(data.SecOffset);
  //   // message.setTmp(data.Tmp);
  //   console.log('ProtobufService 2');

  //   return message.serializeBinary();
  // }

  deserializeMessageBinary(data: any) {
    console.log('ProtobufService 3');
    return proto.Msg_Data.deserializeBinary(data);
  }

}