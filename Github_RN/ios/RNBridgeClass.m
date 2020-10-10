//
//  RNBridgeClass.m
//  Github_RN
//
//  Created by 刘子栋 on 2020/8/6.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "RNBridgeClass.h"

@implementation RNBridgeClass

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getNativeVersionInfo:(RCTResponseSenderBlock)callback) {
    
    NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
    NSString *localVersion = [infoDictionary objectForKey:@"CFBundleShortVersionString"];
    NSLog(@"localVersion - %@",localVersion);
    callback(@[localVersion]);
}

RCT_REMAP_METHOD(getNativeVersionInfoRequest, param:(NSDictionary *)param resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
    NSLog(@"来自RN的数据：params——%@ ",param);
    dispatch_sync(dispatch_get_main_queue(), ^{
        
      resolver(@{@"2":@"2"});
    });
}

@end
