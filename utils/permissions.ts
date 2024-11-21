// import { PermissionsAndroid, Alert, Platform } from 'react-native';
// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// export const requestPermissions = async () => {
//     try {
//         if (Platform.OS === 'android') {
     
//             const storagePermission = await PermissionsAndroid.requestMultiple([
//                 PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//                 PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//             ]);

//             const audioPermission = await PermissionsAndroid.request(
//                 PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
//             );

//             if (
//                 Object.values(storagePermission).includes(PermissionsAndroid.RESULTS.GRANTED) &&
//                 audioPermission === PermissionsAndroid.RESULTS.GRANTED
//             ) {
//                 console.log('All permissions granted on Android');
//             } else {
//                 Alert.alert('Permissions Denied', 'Required permissions were not granted');
//             }
//         } else if (Platform.OS === 'ios') {
    
//             const microphoneStatus = await check(PERMISSIONS.IOS.MICROPHONE);
//             if (microphoneStatus === RESULTS.GRANTED) {
//                 console.log('Microphone permission granted');
//             } else {
//                 const newMicrophoneStatus = await request(PERMISSIONS.IOS.MICROPHONE);
//                 if (newMicrophoneStatus === RESULTS.GRANTED) {
//                     console.log('Microphone permission granted after request');
//                 } else {
//                     Alert.alert('Permission Denied', 'Microphone access is required to record');
//                 }
//             }
//             const storageStatus = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
//             if (storageStatus === RESULTS.GRANTED) {
//                 console.log('Storage permission granted');
//             } else {
//                 const newStorageStatus = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
//                 if (newStorageStatus === RESULTS.GRANTED) {
//                     console.log('Storage permission granted after request');
//                 } else {
//                     Alert.alert('Permission Denied', 'Storage access is required to save the recording');
//                 }
//             }
//         }
//     } catch (error) {
//         console.warn('Error requesting permissions:', error);
//         Alert.alert('Error', 'Failed to request permissions');
//     }
// };


import { PermissionsAndroid, Alert, Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const requestPermissions = async () => {
    try {
        if (Platform.OS === 'android') {

            const permissions = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
            ]);
            const allPermissionsGranted =
                permissions[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED &&
                permissions[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED &&
                permissions[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED;

            if (allPermissionsGranted) {
                console.log('All permissions granted on Android');
            } else {
            }
        } else if (Platform.OS === 'ios') {
            let microphoneStatus = await check(PERMISSIONS.IOS.MICROPHONE);
            if (microphoneStatus !== RESULTS.GRANTED) {
                microphoneStatus = await request(PERMISSIONS.IOS.MICROPHONE);
            }

            let storageStatus = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
            if (storageStatus !== RESULTS.GRANTED) {
                storageStatus = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
            }

            if (microphoneStatus !== RESULTS.GRANTED || storageStatus !== RESULTS.GRANTED) {
                Alert.alert('Permissions Denied', 'Microphone or Storage access is required');
            } else {
                console.log('Microphone and Storage permissions granted on iOS');
            }
        }
    } catch (error) {
        console.warn('Error requesting permissions:', error);
        Alert.alert('Error', 'Failed to request permissions');
    }
};
