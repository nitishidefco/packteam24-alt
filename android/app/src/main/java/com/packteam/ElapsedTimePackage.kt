package com.packteam

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.ModuleHolder
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class ElapsedTimePackage : TurboReactPackage() {
    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
        return if (name == ElapsedTimeModule.NAME) {
            ElapsedTimeModule(reactContext)
        } else {
            null
        }
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        return ReactModuleInfoProvider {
            mapOf(
                ElapsedTimeModule.NAME to ReactModuleInfo(
                    ElapsedTimeModule.NAME, // Module name
                    "ElapsedTimeModule",    // Class name
                    true,                   // Can override existing module
                    false,                  // Needs eager init
                    false,                  // Has constants
                    false,                  // Is C++ module
                    true                    // Is Turbo Module
                )
            )
        }
    }
}