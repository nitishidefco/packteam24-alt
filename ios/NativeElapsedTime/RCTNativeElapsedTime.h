//
//  RCTNativeElapsedTime.h
//  packteam
//
//  Created by Vission Vivante Mac on 08/03/25.
//

#import <Foundation/Foundation.h>
#import <NativeElapsedTimeSpec/NativeElapsedTimeSpec.h>
NS_ASSUME_NONNULL_BEGIN

@interface RCTNativeElapsedTime : NSObject <NativeElapsedTimeSpec>

// Promise-based method to return uptime
- (void)getElapsedTime:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;

// TurboModule initialization
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params;

@end

NS_ASSUME_NONNULL_END
