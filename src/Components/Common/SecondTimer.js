import React, {useRef} from 'react';
import {View, Text, StyleSheet, AppState} from 'react-native';
import {Timer} from 'react-native-element-timer';

const SecondTimer = () => {
    const timerRef = useRef(null);
return(
    <Timer
                    ref={timerRef}
                    // style={styles.timer}
                    // textStyle={styles.timerText}
                    // onTimes={e => {}}
                    // onPause={e => {}}
                    // onEnd={e => {}}
                />
)
}

export default SecondTimer;
