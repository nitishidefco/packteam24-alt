//
//  RCTNativeElapsedTime.mm
//  packteam
//
//  Created by Vission Vivante Mac on 08/03/25.
//

#import "RCTNativeElapsedTime.h"
#include <sys/sysctl.h>

@implementation RCTNativeElapsedTime

RCT_EXPORT_MODULE(NativeElapsedTime)

+ (void)initialize {
    NSLog(@"NativeElapsedTime class loaded");
}

// Helper method to calculate uptime in seconds since boot
- (time_t)uptime {
    struct timeval boottime;
    int mib[2] = {CTL_KERN, KERN_BOOTTIME};
    size_t size = sizeof(boottime);
    time_t now;
    time_t uptime = -1;

    (void)time(&now);

    if (sysctl(mib, 2, &boottime, &size, NULL, 0) != -1 && boottime.tv_sec != 0) {
        uptime = now - boottime.tv_sec;
    }

    return uptime;
}

// Promise-based method to return uptime
- (void)getElapsedTime:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    NSLog(@"getElapsedTime called");
    time_t uptimeSeconds = [self uptime];
    if (uptimeSeconds != -1) {
        resolve(@(uptimeSeconds)); // Return uptime as an NSNumber
    } else {
        reject(@"UPTIME_ERROR", @"Failed to calculate uptime", nil);
    }
}

// TurboModule initialization
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
    NSLog(@"NativeElapsedTime module initialized");
    return std::make_shared<facebook::react::NativeElapsedTimeSpecJSI>(params);
}

@end