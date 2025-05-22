package com.packteam24

import android.os.SystemClock
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.packteam24.NativeElapsedTimeSpec

class ElapsedTimeModule(reactContext: ReactApplicationContext) : NativeElapsedTimeSpec(reactContext) {

    companion object {
        const val NAME = "NativeElapsedTime" 
    }
    override fun getElapsedTime(promise: Promise) {
        val elapsedTime = SystemClock.elapsedRealtime()
        promise.resolve(elapsedTime.toDouble())
    }
}