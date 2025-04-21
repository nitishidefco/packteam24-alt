import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';


export interface Spec extends TurboModule {
  getElapsedTime(): Promise<number>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeElapsedTime');

// ios code
// import Foundation

// @objc(ElapsedTime)
// class ElapsedTime: NSObject, RCTNativeElapsedTimeSpec { // Adjust to generated name
//     func getElapsedTime(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
//         let elapsedTime = NSProcessInfo.processInfo.systemUptime * 1000
//         resolve(elapsedTime)
//     }
// }
