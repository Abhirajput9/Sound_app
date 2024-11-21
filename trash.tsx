

// import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
// import { ActivityIndicator, Image, Linking, Pressable, StatusBar, Text, View, StyleSheet, Platform, PermissionsAndroid, Alert, Modal, TextInput, TouchableOpacity, Dimensions } from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
// import { Icons } from './assets';
// import { IWaveformRef, RecorderState, UpdateFrequency, useAudioPermission, PermissionStatus, Waveform } from '@simform_solutions/react-native-audio-waveform';
// import LinearGradient from 'react-native-linear-gradient';
// import { Color } from './src/components/colors';
// import RNFS from 'react-native-fs';

// export interface ListItem {
//   fromCurrentUser: boolean;
//   path: string;
// }
// const { width } = Dimensions.get('window');
// const LivePlayerComponent = ({ setList }: { setList: Dispatch<SetStateAction<ListItem[]>> }) => {
//   const ref = useRef<IWaveformRef>(null);
//   const [recorderState, setRecorderState] = useState(RecorderState.stopped);
//   const [paused, setPaused] = useState(false);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const { checkHasAudioRecorderPermission, getAudioRecorderPermission } = useAudioPermission();
//   const [recordingPath, setRecordingPath] = useState('');
//   const [showSaveModal, setShowSaveModal] = useState(false);
//   const [recordingName, setRecordingName] = useState('');
//   const [defaultName, setDefaultName] = useState('');

//   useEffect(() => {
//     let timerId: NodeJS.Timeout | null = null;

//     if (recorderState === RecorderState.recording) {
//       timerId = setInterval(() => {
//         setRecordingTime(prevTime => prevTime + 1);
//       }, 1000);
//     } else if (recorderState === RecorderState.paused || recorderState === RecorderState.stopped) {
//       if (timerId) clearInterval(timerId);
//     }

//     return () => {
//       if (timerId) clearInterval(timerId);
//     };
//   }, [recorderState]);



//   const generateDefaultName = () => {
//     const now = new Date();
//     const date = now.toISOString().split('T')[0];
//     const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');
//     return `audit_${date}_${time}`;
//   };

//   const getRecordingPath = () => {
//     const fileName = generateDefaultName();
//     if (Platform.OS === 'android') {
//       return `${RNFS.ExternalDirectoryPath}/${fileName}.mp3`;
//     }
//     return `${RNFS.DocumentDirectoryPath}/${fileName}.m4a`;
//   };

//   const requestPermissions = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.requestMultiple([
//           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//           PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//         ]);

//         const allPermissionsGranted = Object.values(granted).every(
//           permission => permission === PermissionsAndroid.RESULTS.GRANTED,
//         );

//         if (!allPermissionsGranted) {
//           Alert.alert('Error', 'Required permissions not granted');
//         } else {
//           console.log('All permissions granted!');
//         }
//       } catch (err) {
//         console.warn(err);
//         Alert.alert('Error', 'Failed to request permissions');
//       }
//     }
//   };



//   const saveRecording = async () => {
//     try {
//       // Validate if there is a valid recording path and name
//       if (!recordingPath) {
//         Alert.alert('Error', 'No recording to save');
//         return;
//       }

//       if (!recordingName.trim()) {
//         Alert.alert('Error', 'Please enter a recording name');
//         return;
//       }

//       const sanitizedName = recordingName.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
//       const fileExtension = Platform.OS === 'android' ? '.mp3' : '.m4a';
//       const fileName = `${sanitizedName}${fileExtension}`;

//       // Set destination path
//       const destPath = Platform.OS === 'android'
//         ? `${RNFS.ExternalStorageDirectoryPath}/Music/${fileName}` // Use Music folder in External Storage for Android
//         : `${RNFS.DocumentDirectoryPath}/${fileName}`; // For iOS, use DocumentDirectory

//       // Ensure the Music directory exists on Android
//       if (Platform.OS === 'android') {
//         await RNFS.mkdir(`${RNFS.ExternalStorageDirectoryPath}/Music`);
//       }

//       // Copy the recording to the destination path
//       await RNFS.copyFile(recordingPath, destPath);

//       // Show success alert
//       Alert.alert(
//         'Success',
//         `Recording saved as ${fileName} in ${Platform.OS === 'android' ? 'Music folder' : 'Documents directory'}`,
//         [{
//           text: 'OK',
//           onPress: () => {
//             setShowSaveModal(false);
//             setRecordingName('');
//           }
//         }]
//       );
//     } catch (error) {
//       console.error('Failed to save recording:', error);
//       Alert.alert('Error', 'Failed to save recording');
//     }
//   };



//   const startRecording = () => {
//     ref.current?.startRecord({
//       updateFrequency: UpdateFrequency.high,
//     }).then(() => {
//       setRecorderState(RecorderState.recording);
//       setPaused(false);
//       setRecordingTime(0);
//     }).catch(() => { });
//   };

//   const pauseRecording = () => {
//     if (ref.current) {
//       ref.current.pauseRecord();
//       setRecorderState(RecorderState.paused);
//       setPaused(true);
//     }
//   };

//   const resumeRecording = () => {
//     if (ref.current) {
//       ref.current.resumeRecord();
//       setRecorderState(RecorderState.recording);
//       setPaused(false);
//     }
//   };

//   const handleRecorderAction = async () => {
//     if (recorderState === RecorderState.stopped) {
//       // Request permission to record
//       let hasPermission = await checkHasAudioRecorderPermission();

//       if (hasPermission === PermissionStatus.granted) {
//         startRecording();
//       } else if (hasPermission === PermissionStatus.undetermined) {
//         const permissionStatus = await getAudioRecorderPermission();
//         if (permissionStatus === PermissionStatus.granted) {
//           startRecording();
//         }
//       } else {
//         Linking.openSettings();
//       }
//     } else if (recorderState === RecorderState.recording) {
//       // If recording, pause the recording
//       pauseRecording();
//     } else if (recorderState === RecorderState.paused) {
//       // If paused, resume the recording
//       resumeRecording();
//     }
//   };

//   // const stopRecording = () => {
//   //   ref.current?.stopRecord().then(path => {
//   //     setList(prev => [...prev, { fromCurrentUser: true, path }]);
//   //     setRecorderState(RecorderState.stopped);
//   //     setRecordingTime(0); // Reset time after stop
//   //   });
//   // };

//   const stopRecording = () => {
//     ref.current?.stopRecord().then(path => {
//       setRecordingPath(path); // Ensure recordingPath is set after stopping the recording
//       setList(prev => [...prev, { fromCurrentUser: true, path }]);
//       setRecorderState(RecorderState.stopped);
//       setRecordingTime(0); // Reset time after stop
//       setShowSaveModal(true); // Show modal to save recording
//     }).catch(error => {
//       console.error('Error stopping recording', error);
//     });
//   };


//   const formatTime = (seconds: number) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
//   };

//   return (
//     <View style={styles.liveWaveformContainer}>
//       {/* Ready to Record Text */}
//       <Text style={styles.recordingName}>
//         {recorderState === RecorderState.recording
//           ? (paused ? 'Recording Paused' : 'Recording...')
//           : 'Ready to Record'}
//       </Text>


//       {/* Timer Text */}
//       <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>

//       {/* Waveform */}
//       <Waveform
//         mode="live"
//         containerStyle={styles.liveWaveformView}
//         ref={ref}
//         candleSpace={2}
//         candleWidth={4}
//         candleHeightScale={8}
//         waveColor={"#ffffff"}
//         onRecorderStateChange={setRecorderState}
//       />

//       {/* Pause/Resume Button */}
//       {recorderState === RecorderState.recording && (
//         <Pressable onPress={pauseRecording} style={styles.recordAudioPressable}>
//           <Image source={Icons.pause} style={styles.buttonImageLive} resizeMode="contain" />
//         </Pressable>
//       )}

//       {/* Resume Button */}
//       {recorderState === RecorderState.paused && (
//         <Pressable onPress={resumeRecording} style={styles.recordAudioPressable}>
//           <Image source={Icons.resume} style={styles.buttonImageLive} resizeMode="contain" />
//         </Pressable>
//       )}

//       {/* Start/Stop Button */}
//       {recorderState === RecorderState.stopped ? (
//         <Pressable onPress={handleRecorderAction} style={styles.recordAudioPressable}>
//           <Image source={Icons.mic} style={styles.buttonImageLive} resizeMode="contain" />
//         </Pressable>
//       ) : (
//         <Pressable onPress={stopRecording} style={styles.recordAudioPressable}>
//           <Image source={Icons.stop} style={styles.buttonImageLive} resizeMode="contain" />
//         </Pressable>
//       )}

//       <Modal
//         visible={showSaveModal}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setShowSaveModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Save Recording</Text>

//             <Text style={styles.modalLabel}>Recording Name:</Text>
//             <TextInput
//               style={styles.modalInput}
//               value={recordingName}
//               onChangeText={setRecordingName}
//               placeholder="Enter recording name"
//               placeholderTextColor="#666"
//             />

//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.cancelButton]}
//                 onPress={() => setShowSaveModal(false)}
//               >
//                 <Text style={styles.modalButtonText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.modalButton, styles.saveButton]}
//                 onPress={saveRecording}
//               >
//                 <Text style={[styles.modalButtonText, { color: 'white' }]}>Save</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//     </View>
//   );
// };

// const AppContainer = () => {
//   const [list, setList] = useState<ListItem[]>([]);  // List state (for storing the recorded audio)
//   const { top, bottom } = useSafeAreaInsets();

//   return (
//     <LinearGradient
//       colors={['#4ade80', '#38bdf8']}
//       style={styles.appContainer}>
//       <GestureHandlerRootView style={styles.appContainer}>
//         <View style={[styles.screenBackground, { paddingBottom: bottom }]}>
//           <LivePlayerComponent setList={setList} />
//         </View>
//       </GestureHandlerRootView>
//     </LinearGradient>
//   );
// };


// import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
// import { ActivityIndicator, Image, Linking, Pressable, StatusBar, Text, View, StyleSheet, Platform, PermissionsAndroid, Alert, Modal, TextInput, TouchableOpacity, Dimensions } from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
// import { Icons } from './assets';
// import { IWaveformRef, RecorderState, UpdateFrequency, useAudioPermission, PermissionStatus, Waveform } from '@simform_solutions/react-native-audio-waveform';
// import LinearGradient from 'react-native-linear-gradient';
// import { Color } from './src/components/colors';
// import RNFS from 'react-native-fs';
// import DeviceInfo from 'react-native-device-info';
// import { requestPermissions } from './src/utils/permissions';


// export interface ListItem {
//   fromCurrentUser: boolean;
//   path: string;
// }
// const { width } = Dimensions.get('window');

// const LivePlayerComponent = ({ setList }: { setList: Dispatch<SetStateAction<ListItem[]>> }) => {
//   const ref = useRef<IWaveformRef>(null);
//   const [recorderState, setRecorderState] = useState(RecorderState.stopped);
//   const [paused, setPaused] = useState(false);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const { checkHasAudioRecorderPermission, getAudioRecorderPermission } = useAudioPermission();
//   const [recordingPath, setRecordingPath] = useState('');
//   const [showSaveModal, setShowSaveModal] = useState(false);
//   const [recordingName, setRecordingName] = useState('');
//   const [defaultName, setDefaultName] = useState('');


//   const generateDefaultName = () => {
//     const now = new Date();
//     const date = now.toISOString().split('T')[0];
//     const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');
//     return `audit_${date}_${time}`;
//   };


//   useEffect(() => {
//     const defaultRecordingName = generateDefaultName();
//     setDefaultName(defaultRecordingName);
//     setRecordingName(defaultRecordingName);
//   }, []);

//   const checkAvailableStorage = async () => {
//     try {
//       const freeSpace = await DeviceInfo.getFreeDiskStorage();
//       const freeSpaceMB = freeSpace / (1024 * 1024);
//       return freeSpaceMB;
//     } catch (error) {
//       console.warn("Error checking available storage:", error);
//       return 0;
//     }
//   };

//   useEffect(() => {
//     const requestAppPermissions = async () => {
//       await requestPermissions(); 
//     };

//     requestAppPermissions();
//   }, []);








//   const saveRecording = async () => {
//     try {
//       // Check available storage space before attempting to save the file
//       const availableStorage = await checkAvailableStorage();
//       if (availableStorage < 10) {  // If less than 10 MB is available, show an error
//         Alert.alert(
//           'Storage Full',
//           'There is not enough storage space to save the recording. Please free up some space and try again.',
//           [{ text: 'OK' }]
//         );
//         return;  // Prevent further processing if not enough storage
//       }

//       if (!recordingPath) {
//         Alert.alert('Error', 'No recording to save');
//         return;
//       }

//       if (!recordingName.trim()) {
//         Alert.alert('Error', 'Please enter a recording name');
//         return;
//       }

//       // Sanitize the recording name
//       const sanitizedName = recordingName.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
//       const fileExtension = Platform.OS === 'android' ? '.mp3' : '.m4a';
//       const fileName = `${sanitizedName}${fileExtension}`;

//       // Set the destination path based on platform
//       const destPath = Platform.OS === 'android'
//         ? `${RNFS.ExternalStorageDirectoryPath}/Music/${fileName}`
//         : `${RNFS.DocumentDirectoryPath}/${fileName}`;

//       // Ensure the directory exists on Android
//       if (Platform.OS === 'android') {
//         await RNFS.mkdir(`${RNFS.ExternalStorageDirectoryPath}/Music`);
//       }

//       // Try to copy the recording file to the destination
//       await RNFS.copyFile(recordingPath, destPath);

//       Alert.alert('Success', `Recording saved as ${fileName} in ${Platform.OS === 'android' ? 'Music folder' : 'Documents directory'}`, [
//         { text: 'OK', onPress: () => setShowSaveModal(false) },
//       ]);
//     } catch (error) {
//       console.error('Failed to save recording:', error);
//       Alert.alert('Error', 'Failed to save recording. There may be an issue with your storage.');
//     }
//   };

//   const startRecording = () => {
//     ref.current?.startRecord({
//       updateFrequency: UpdateFrequency.high,
//     }).then(() => {
//       setRecorderState(RecorderState.recording);
//       setPaused(false);
//       setRecordingTime(0);
//     }).catch(() => { });
//   };

//   const pauseRecording = () => {
//     if (ref.current) {
//       ref.current.pauseRecord();
//       setRecorderState(RecorderState.paused);
//       setPaused(true);
//     }
//   };

//   const resumeRecording = () => {
//     if (ref.current) {
//       ref.current.resumeRecord();
//       setRecorderState(RecorderState.recording);
//       setPaused(false);
//     }
//   };

//   const handleRecorderAction = async () => {
//     if (recorderState === RecorderState.stopped) {
//       let hasPermission = await checkHasAudioRecorderPermission();

//       if (hasPermission === PermissionStatus.granted) {
//         startRecording();
//       } else if (hasPermission === PermissionStatus.undetermined) {
//         const permissionStatus = await getAudioRecorderPermission();
//         if (permissionStatus === PermissionStatus.granted) {
//           startRecording();
//         }
//       } else {
//         Linking.openSettings();
//       }
//     } else if (recorderState === RecorderState.recording) {
//       pauseRecording();
//     } else if (recorderState === RecorderState.paused) {
//       resumeRecording();
//     }
//   };

//   const stopRecording = () => {
//     ref.current?.stopRecord().then(path => {
//       setRecordingPath(path);
//       setList(prev => [...prev, { fromCurrentUser: true, path }]);
//       setRecorderState(RecorderState.stopped);
//       setRecordingTime(0);
//       setShowSaveModal(true);
//     }).catch(error => {
//       console.error('Error stopping recording', error);
//     });
//   };

//   const formatTime = (seconds: number) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
//   };

//   return (
//     <View style={styles.liveWaveformContainer}>
//       <Text style={styles.recordingName}>
//         {recorderState === RecorderState.recording
//           ? (paused ? 'Recording Paused' : 'Recording...')
//           : 'Ready to Record'}
//       </Text>

//       <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>

//       <Waveform
//         mode="live"
//         containerStyle={styles.liveWaveformView}
//         ref={ref}
//         candleSpace={2}
//         candleWidth={4}
//         candleHeightScale={8}
//         waveColor={"#ffffff"}
//         onRecorderStateChange={setRecorderState}
//       />

//       {recorderState === RecorderState.recording && (
//         <Pressable onPress={pauseRecording} style={styles.recordAudioPressable}>
//           <Image source={Icons.pause} style={styles.buttonImageLive} resizeMode="contain" />
//         </Pressable>
//       )}

//       {recorderState === RecorderState.paused && (
//         <Pressable onPress={resumeRecording} style={styles.recordAudioPressable}>
//           <Image source={Icons.resume} style={styles.buttonImageLive} resizeMode="contain" />
//         </Pressable>
//       )}

//       {recorderState === RecorderState.stopped ? (
//         <Pressable onPress={handleRecorderAction} style={styles.recordAudioPressable}>
//           <Image source={Icons.mic} style={styles.buttonImageLive} resizeMode="contain" />
//         </Pressable>
//       ) : (
//         <Pressable onPress={stopRecording} style={styles.recordAudioPressable}>
//           <Image source={Icons.stop} style={styles.buttonImageLive} resizeMode="contain" />
//         </Pressable>
//       )}



//       <Modal visible={showSaveModal} transparent animationType="fade" onRequestClose={() => setShowSaveModal(false)}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Save Recording</Text>

//             <Text style={styles.modalLabel}>Recording Name:</Text>
//             <TextInput
//               style={styles.modalInput}
//               value={recordingName}
//               onChangeText={setRecordingName}
//               placeholder="Enter recording name"
//               placeholderTextColor="#666"
//             />

//             <View style={styles.modalButtons}>
//               <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowSaveModal(false)}>
//                 <Text style={styles.modalButtonText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={saveRecording}>
//                 <Text style={[styles.modalButtonText, { color: 'white' }]}>Save</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//     </View>
//   );
// };

// const AppContainer = () => {
//   const [list, setList] = useState<ListItem[]>([]);
//   const { top, bottom } = useSafeAreaInsets();

//   return (
//     <LinearGradient colors={['#4ade80', '#38bdf8']} style={styles.appContainer}>
//       <GestureHandlerRootView style={styles.appContainer}>
//         <View style={[styles.screenBackground, { paddingBottom: bottom }]}>
//           <LivePlayerComponent setList={setList} />
//         </View>
//       </GestureHandlerRootView>
//     </LinearGradient>
//   );
// };




// const styles = StyleSheet.create({
//   appContainer: {
//     flex: 1,
//   },
//   recordingName: {
//     color: 'white',
//     fontSize: 24,
//     fontWeight: '600',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   timerText: {
//     fontSize: 48,
//     fontWeight: '600',
//     color: '#000',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   liveWaveformContainer: {
//     flex: 1,
//     justifyContent: 'center', // Center all the content
//     alignItems: 'center',
//     paddingHorizontal: 16,
//   },
//   liveWaveformView: {
//     width: '100%',
//     height: 100,
//     marginBottom: 30,
//   },
//   buttonImageLive: {
//     height: 50,
//     width: 50,
//     tintColor: Color.primaryWhite,
//   },
//   recordAudioPressable: {
//     height: 50,
//     width: 50,
//     padding: 8,
//     marginBottom: 20,
//   },
//   screenBackground: {
//     flex: 1,
//     justifyContent: 'center',
//   },



//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     borderRadius: 15,
//     padding: 20,
//     width: width * 0.9,
//     maxWidth: 400,
//   },
//   modalTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#333',
//   },
//   modalLabel: {
//     fontSize: 16,
//     marginBottom: 8,
//     color: '#666',
//   },
//   modalInput: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     marginBottom: 20,
//     color: '#333',
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   modalButton: {
//     flex: 0.48,
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   cancelButton: {
//     backgroundColor: '#f1f1f1',
//   },
//   saveButton: {
//     backgroundColor: '#4CAF50',
//   },
//   modalButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default function App() {
//   return (
//     <SafeAreaProvider>
//       <AppContainer />
//     </SafeAreaProvider>
//   );
// }




// import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
// import { ActivityIndicator, Image, Linking, Pressable, Text, View, StyleSheet, Platform, Alert, Modal, TextInput, TouchableOpacity, Dimensions } from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
// import { Icons } from './assets';
// import { IWaveformRef, RecorderState, UpdateFrequency, useAudioPermission, PermissionStatus, Waveform } from '@simform_solutions/react-native-audio-waveform';
// import LinearGradient from 'react-native-linear-gradient';
// import RNFS from 'react-native-fs';
// import DeviceInfo from 'react-native-device-info';
// import { requestPermissions } from './src/utils/permissions';

// export interface ListItem {
//   fromCurrentUser: boolean;
//   path: string;
// }

// const { width } = Dimensions.get('window');

// const LivePlayerComponent = ({ setList }: { setList: Dispatch<SetStateAction<ListItem[]>> }) => {
//   const ref = useRef<IWaveformRef>(null);
//   const [recorderState, setRecorderState] = useState(RecorderState.stopped);
//   const [paused, setPaused] = useState(false);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const { checkHasAudioRecorderPermission, getAudioRecorderPermission } = useAudioPermission();
//   const [recordingPath, setRecordingPath] = useState('');
//   const [showSaveModal, setShowSaveModal] = useState(false);
//   const [recordingName, setRecordingName] = useState('');
//   const [defaultName, setDefaultName] = useState('');

//   const generateDefaultName = () => {
//     const now = new Date();
//     const date = now.toISOString().split('T')[0];
//     const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');
//     return `audit_${date}_${time}`;
//   };

//   useEffect(() => {
//     const defaultRecordingName = generateDefaultName();
//     setDefaultName(defaultRecordingName);
//     setRecordingName(defaultRecordingName);
//   }, []);

//   const checkAvailableStorage = async () => {
//     try {
//       const freeSpace = await DeviceInfo.getFreeDiskStorage();
//       return freeSpace / (1024 * 1024); // Convert to MB
//     } catch (error) {
//       console.warn("Error checking available storage:", error);
//       return 0;
//     }
//   };

//   useEffect(() => {
//     const requestAppPermissions = async () => {
//       await requestPermissions();
//     };

//     requestAppPermissions();
//   }, []);

//   const saveRecording = async () => {
//     try {
//       const availableStorage = await checkAvailableStorage();
//       if (availableStorage < 10) {
//         Alert.alert('Storage Full', 'There is not enough storage space to save the recording. Please free up some space and try again.');
//         return;
//       }

//       if (!recordingPath) {
//         Alert.alert('Error', 'No recording to save');
//         return;
//       }

//       if (!recordingName.trim()) {
//         Alert.alert('Error', 'Please enter a recording name');
//         return;
//       }

//       const sanitizedName = recordingName.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
//       const fileExtension = Platform.OS === 'android' ? '.mp3' : '.m4a';
//       const fileName = `${sanitizedName}${fileExtension}`;
//       const destPath = Platform.OS === 'android'
//         ? `${RNFS.ExternalStorageDirectoryPath}/Music/${fileName}`
//         : `${RNFS.DocumentDirectoryPath}/${fileName}`;

//       if (Platform.OS === 'android') {
//         await RNFS.mkdir(`${RNFS.ExternalStorageDirectoryPath}/Music`);
//       }

//       await RNFS.copyFile(recordingPath, destPath);
//       Alert.alert('Success', `Recording saved as ${fileName}`, [{ text: 'OK', onPress: () => setShowSaveModal(false) }]);
//     } catch (error) {
//       console.error('Failed to save recording:', error);
//       Alert.alert('Error', 'Failed to save recording.');
//     }
//   };

//   const startRecording = () => {
//     ref.current?.startRecord({ updateFrequency: UpdateFrequency.high })
//       .then(() => {
//         setRecorderState(RecorderState.recording);
//         setPaused(false);
//         setRecordingTime(0);
//       })
//       .catch(() => { });
//   };

//   const pauseRecording = () => {
//     if (ref.current) {
//       ref.current.pauseRecord();
//       setRecorderState(RecorderState.paused);
//       setPaused(true);
//     }
//   };

//   const resumeRecording = () => {
//     if (ref.current) {
//       ref.current.resumeRecord();
//       setRecorderState(RecorderState.recording);
//       setPaused(false);
//     }
//   };

//   const handleRecorderAction = async () => {
//     if (recorderState === RecorderState.stopped) {
//       const hasPermission = await checkHasAudioRecorderPermission();
//       if (hasPermission === PermissionStatus.granted) {
//         startRecording();
//       } else if (hasPermission === PermissionStatus.undetermined) {
//         const permissionStatus = await getAudioRecorderPermission();
//         if (permissionStatus === PermissionStatus.granted) {
//           startRecording();
//         }
//       } else {
//         Linking.openSettings();
//       }
//     } else if (recorderState === RecorderState.recording) {
//       pauseRecording();
//     } else if (recorderState === RecorderState.paused) {
//       resumeRecording();
//     }
//   };

//   const stopRecording = () => {
//     ref.current?.stopRecord().then(path => {
//       setRecordingPath(path);
//       setList(prev => [...prev, { fromCurrentUser: true, path }]);
//       setRecorderState(RecorderState.stopped);
//       setRecordingTime(0);
//       setShowSaveModal(true);
//     }).catch(error => console.error('Error stopping recording', error));
//   };

//   const formatTime = (seconds: number) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
//   };

//   return (
//     <View style={styles.liveWaveformContainer}>
//       <Text style={styles.recordingName}>
//         {recorderState === RecorderState.recording ? (paused ? 'Recording Paused' : 'Recording...') : 'Ready to Record'}
//       </Text>

//       <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>

//       <Waveform
//         mode="live"
//         containerStyle={styles.liveWaveformView}
//         ref={ref}
//         candleSpace={2}
//         candleWidth={4}
//         candleHeightScale={8}
//         waveColor={"#ffffff"}
//         onRecorderStateChange={setRecorderState}
//       />

//       {recorderState === RecorderState.recording ? (
//         <Pressable onPress={pauseRecording} style={styles.recordAudioPressable}>
//           <Image source={Icons.pause} style={styles.buttonImageLive} resizeMode="contain" />
//         </Pressable>
//       ) : recorderState === RecorderState.paused ? (
//         <Pressable onPress={resumeRecording} style={styles.recordAudioPressable}>
//           <Image source={Icons.resume} style={styles.buttonImageLive} resizeMode="contain" />
//         </Pressable>
//       ) : (
//         <Pressable onPress={handleRecorderAction} style={styles.recordAudioPressable}>
//           <Image source={Icons.mic} style={styles.buttonImageLive} resizeMode="contain" />
//         </Pressable>
//       )}

//       {recorderState !== RecorderState.stopped && (
//         <Pressable onPress={stopRecording} style={styles.recordAudioPressable}>
//           <Image source={Icons.stop} style={styles.buttonImageLive} resizeMode="contain" />
//         </Pressable>
//       )}

//       <Modal visible={showSaveModal} transparent animationType="fade" onRequestClose={() => setShowSaveModal(false)}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Save Recording</Text>

//             <Text style={styles.modalLabel}>Recording Name:</Text>
//             <TextInput
//               style={styles.modalInput}
//               value={recordingName}
//               onChangeText={setRecordingName}
//               placeholder="Enter recording name"
//             />

//             <View style={styles.modalButtons}>
//               <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowSaveModal(false)}>
//                 <Text style={styles.modalButtonText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={saveRecording}>
//                 <Text style={[styles.modalButtonText, { color: 'white' }]}>Save</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const AppContainer = () => {
//   const [list, setList] = useState<ListItem[]>([]);
//   const { bottom } = useSafeAreaInsets();

//   return (
//     <LinearGradient colors={['#4ade80', '#38bdf8']} style={styles.appContainer}>
//       <GestureHandlerRootView style={styles.appContainer}>
//         <View style={[styles.screenBackground, { paddingBottom: bottom }]}>
//           <LivePlayerComponent setList={setList} />
//         </View>
//       </GestureHandlerRootView>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   appContainer: { flex: 1 },
//   recordingName: { color: 'white', fontSize: 24, fontWeight: '600', textAlign: 'center', marginBottom: 10 },
//   timerText: { fontSize: 48, fontWeight: '600', color: '#000', textAlign: 'center', marginBottom: 20 },
//   liveWaveformContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 },
//   liveWaveformView: { width: '100%', height: 100, marginBottom: 30 },
//   buttonImageLive: { height: 50, width: 50, tintColor: '#ffffff' },
//   recordAudioPressable: { height: 50, width: 50, padding: 8, marginBottom: 20 },
//   screenBackground: { flex: 1, justifyContent: 'center' },
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
//   modalContent: { backgroundColor: 'white', borderRadius: 15, padding: 20, width: width * 0.9, maxWidth: 400 },
//   modalTitle: { fontSize: 24, fontWeight: '600', marginBottom: 20, textAlign: 'center' },
//   modalLabel: { fontSize: 16, marginBottom: 8, color: '#666' },
//   modalInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 20 },
//   modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
//   modalButton: { flex: 0.48, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
//   cancelButton: { backgroundColor: '#f1f1f1' },
//   saveButton: { backgroundColor: '#4CAF50' },
//   modalButtonText: { fontSize: 16, fontWeight: '600' },
// });

// export default function App() {
//   return (
//     <SafeAreaProvider>
//       <AppContainer />
//     </SafeAreaProvider>
//   );
// }


////////////////////////////////// App.tsx////////////////////////////////////////////////////////





// import React, { useState, useEffect } from 'react';
// import {
//     View,
//     Text,
//     TouchableOpacity,
//     StyleSheet,
//     Platform,
//     PermissionsAndroid,
//     Alert,
//     TextInput,
//     Modal,
//     Dimensions,
// } from 'react-native';
// import AudioRecorderPlayer from 'react-native-audio-recorder-player';
// import LinearGradient from 'react-native-linear-gradient';
// import RNFS from 'react-native-fs';

// const { width } = Dimensions.get('window');
// const audioRecorderPlayer = new AudioRecorderPlayer();

// const VoiceRecorder = () => {
//     const [isRecording, setIsRecording] = useState(false);
//     const [isPaused, setIsPaused] = useState(false);
//     const [recordingTime, setRecordingTime] = useState('00:00');
//     const [recordingCount, setRecordingCount] = useState(1);
//     const [currentPositionSec, setCurrentPositionSec] = useState(0);
//     const [currentDurationSec, setCurrentDurationSec] = useState(0);
//     const [recordingPath, setRecordingPath] = useState('');
//     const [showSaveModal, setShowSaveModal] = useState(false);
//     const [recordingName, setRecordingName] = useState('');
//     const [defaultName, setDefaultName] = useState('');

//     useEffect(() => {
//         requestPermissions();
//         return () => {
//             handleCleanup();
//         };
//     }, []);

//     const handleCleanup = async () => {
//         if (isRecording) {
//             await audioRecorderPlayer.stopRecorder();
//         }
//         audioRecorderPlayer.removeRecordBackListener();
//         setIsRecording(false);
//         setIsPaused(false);
//         setRecordingTime('00:00');
//     };

//     const generateDefaultName = () => {
//         const now = new Date();
//         const date = now.toISOString().split('T')[0];
//         const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');
//         return `audit_${date}_${time}`;
//     };

//     const getRecordingPath = () => {
//         const fileName = generateDefaultName();
//         if (Platform.OS === 'android') {
//             return `${RNFS.ExternalDirectoryPath}/${fileName}.mp3`;
//         }
//         return `${RNFS.DocumentDirectoryPath}/${fileName}.m4a`;
//     };

//     const requestPermissions = async () => {
//         if (Platform.OS === 'android') {
//             try {
//                 const grants = await PermissionsAndroid.requestMultiple([
//                     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//                     PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//                     PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//                 ]);

//                 const allPermissionsGranted = Object.values(grants).every(
//                     permission => permission === PermissionsAndroid.RESULTS.GRANTED,
//                 );

//                 if (!allPermissionsGranted) {
//                     // Alert.alert('Error', 'Required permissions not granted');
//                 } else {
//                     console.log('All permissions granted!');
//                 }
//             } catch (err) {
//                 console.warn(err);
//                 Alert.alert('Error', 'Failed to request permissions');
//             }
//         }
//     };

//     const formatTime = (seconds) => {
//         if (!seconds || seconds < 0) return '00:00';
//         const mins = Math.floor(seconds / 60);
//         const secs = Math.floor(seconds % 60);
//         return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//     };

//     const onStartRecord = async () => {
//         try {
//             const path = getRecordingPath();
//             const result = await audioRecorderPlayer.startRecorder(path);
//             setRecordingPath(path);

//             audioRecorderPlayer.addRecordBackListener((e) => {
//                 if (e && e.currentPosition >= 0) {
//                     const seconds = Math.floor(e.currentPosition / 1000);
//                     setCurrentPositionSec(seconds);
//                     setRecordingTime(formatTime(seconds));
//                 }
//             });
//             setIsRecording(true);
//             setIsPaused(false);
//         } catch (error) {
//             console.error('Failed to start recording:', error);
//             Alert.alert('Error', 'Failed to start recording');
//         }
//     };

//     const onStopRecord = async () => {
//         try {
//             await audioRecorderPlayer.stopRecorder();
//             audioRecorderPlayer.removeRecordBackListener();
//             setRecordingTime('00:00');
//             setCurrentPositionSec(0);
//             setIsRecording(false);
//             setRecordingCount(prev => prev + 1);
//             setIsPaused(false);

//             // Generate default name and show modal
//             const defaultFileName = generateDefaultName();
//             setDefaultName(defaultFileName);
//             setRecordingName(defaultFileName);
//             setShowSaveModal(true);
//         } catch (error) {
//             console.error('Failed to stop recording:', error);
//             Alert.alert('Error', 'Failed to stop recording');
//         }
//     };

//     const onPauseRecord = async () => {
//         try {
//             if (isRecording && !isPaused) {
//                 await audioRecorderPlayer.pauseRecorder();
//                 setIsPaused(true);
//             }
//         } catch (error) {
//             console.error('Failed to pause recording:', error);
//             Alert.alert('Error', 'Failed to pause recording');
//         }
//     };

//     const onResumeRecord = async () => {
//         try {
//             if (isRecording && isPaused) {
//                 await audioRecorderPlayer.resumeRecorder();
//                 setIsPaused(false);
//             }
//         } catch (error) {
//             console.error('Failed to resume recording:', error);
//             Alert.alert('Error', 'Failed to resume recording');
//         }
//     };

//     const saveRecording = async () => {
//         try {
//             if (!recordingPath) {
//                 Alert.alert('Error', 'No recording to save');
//                 return;
//             }

//             if (!recordingName.trim()) {
//                 Alert.alert('Error', 'Please enter a recording name');
//                 return;
//             }

//             const sanitizedName = recordingName.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
//             const fileName = `${sanitizedName}${Platform.OS === 'android' ? '.mp3' : '.m4a'}`;
//             const destPath = `${RNFS.ExternalStorageDirectoryPath}/Music/${fileName}`;

//             await RNFS.mkdir(`${RNFS.ExternalStorageDirectoryPath}/Music`).catch(() => {});
//             await RNFS.copyFile(recordingPath, destPath);

//             Alert.alert(
//                 'Success',
//                 `Recording saved as ${fileName} in Music folder`,
//                 [{ text: 'OK', onPress: () => {
//                     setShowSaveModal(false);
//                     setRecordingName('');
//                 }}]
//             );
//         } catch (error) {
//             console.error('Failed to save recording:', error);
//             Alert.alert('Error', 'Failed to save recording');
//         }
//     };

//     const renderWaveform = () => {
//         return (
//             <View style={styles.waveform}>
//                 {Array.from({ length: 30 }).map((_, index) => (
//                     <View
//                         key={index}
//                         style={[styles.waveformBar, {
//                             height: isRecording && !isPaused
//                                 ? Math.random() * 30 + 10
//                                 : 20,
//                         }]}
//                     />
//                 ))}
//             </View>
//         );
//     };

//     return (
//         <LinearGradient
//             colors={['#4ade80', '#38bdf8']}
//             style={styles.container}>
//             <View style={styles.content}>

//                 <Text style={styles.recordingName}>
//                     {isRecording ? (isPaused ? 'Recording Paused' : 'Recording...') : 'Ready to Record'}
//                 </Text>

//                 <Text style={styles.timer}>{recordingTime}</Text>

//                 {renderWaveform()}

//                 <View style={styles.controls}>
//                     {isRecording && (
//                         <TouchableOpacity
//                             style={[styles.pauseButton, { backgroundColor: isPaused ? '#ff6347' : '#ffcc00' }]}
//                             onPress={isPaused ? onResumeRecord : onPauseRecord}>
//                             <Text style={styles.buttonText}>
//                                 {isPaused ? 'Resume' : 'Pause'}
//                             </Text>
//                         </TouchableOpacity>
//                     )}

//                     <TouchableOpacity
//                         style={[styles.controlButton, { backgroundColor: 'white' }]}
//                         onPress={isRecording ? onStopRecord : onStartRecord}>
//                         <Text style={styles.buttonText}>{isRecording ? 'Stop' : 'Start'}</Text>
//                     </TouchableOpacity>
//                 </View>

//                 {/* Save Modal */}
//                 <Modal
//                     visible={showSaveModal}
//                     transparent
//                     animationType="fade"
//                     onRequestClose={() => setShowSaveModal(false)}
//                 >
//                     <View style={styles.modalOverlay}>
//                         <View style={styles.modalContent}>
//                             <Text style={styles.modalTitle}>Save Recording</Text>

//                             <Text style={styles.modalLabel}>Recording Name:</Text>
//                             <TextInput
//                                 style={styles.modalInput}
//                                 value={recordingName}
//                                 onChangeText={setRecordingName}
//                                 placeholder="Enter recording name"
//                                 placeholderTextColor="#666"
//                             />

//                             <View style={styles.modalButtons}>
//                                 <TouchableOpacity
//                                     style={[styles.modalButton, styles.cancelButton]}
//                                     onPress={() => setShowSaveModal(false)}
//                                 >
//                                     <Text style={styles.modalButtonText}>Cancel</Text>
//                                 </TouchableOpacity>

//                                 <TouchableOpacity
//                                     style={[styles.modalButton, styles.saveButton]}
//                                     onPress={saveRecording}
//                                 >
//                                     <Text style={[styles.modalButtonText, { color: 'white' }]}>Save</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         </View>
//                     </View>
//                 </Modal>
//             </View>
//         </LinearGradient>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     content: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingHorizontal: 20,
//     },

//     recordingName: {
//         color: 'white',
//         fontSize: 24,
//         fontWeight: '600',
//         marginBottom: 10,
//     },
//     timer: {
//         color: 'white',
//         fontSize: 20,
//         marginBottom: 30,
//     },
//     waveform: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         height: 50,
//         marginBottom: 40,
//     },
//     waveformBar: {
//         width: 3,
//         backgroundColor: 'white',
//         marginHorizontal: 2,
//         borderRadius: 3,
//     },
//     controls: {
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         width: '100%',
//         height: "25%",
//         alignSelf: "center",
//     },
//     controlButton: {
//         paddingHorizontal: 40,
//         paddingVertical: 15,
//         borderRadius: 25,
//         alignSelf: "center",
//         alignItems: "center",
//         marginBottom: 20,
//     },
//     pauseButton: {
//         width: 70,
//         height: 70,
//         borderRadius: 50,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: 20,
//     },
//     buttonText: {
//         color: '#4ade80',
//         fontSize: 18,
//         fontWeight: '600',
//     },
//     // Modal Styles
//     modalOverlay: {
//         flex: 1,
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     modalContent: {
//         backgroundColor: 'white',
//         borderRadius: 15,
//         padding: 20,
//         width: width * 0.9,
//         maxWidth: 400,
//     },
//     modalTitle: {
//         fontSize: 24,
//         fontWeight: '600',
//         marginBottom: 20,
//         textAlign: 'center',
//         color: '#333',
//     },
//     modalLabel: {
//         fontSize: 16,
//         marginBottom: 8,
//         color: '#666',
//     },
//     modalInput: {
//         borderWidth: 1,
//         borderColor: '#ddd',
//         borderRadius: 8,
//         padding: 12,
//         fontSize: 16,
//         marginBottom: 20,
//         color: '#333',
//     },
//     modalButtons: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     modalButton: {
//         flex: 0.48,
//         paddingVertical: 12,
//         borderRadius: 8,
//         alignItems: 'center',
//     },
//     cancelButton: {
//         backgroundColor: '#f1f1f1',
//     },
//     saveButton: {
//         backgroundColor: '#4CAF50',
//     },
//     modalButtonText: {
//         fontSize: 16,
//         fontWeight: '600',
//     },
// });

// export default VoiceRecorder;





// import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
// import { ActivityIndicator, Image, Linking, Pressable, Text, View, StyleSheet, Platform, Alert, Modal, TextInput, TouchableOpacity, Dimensions } from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// import { IWaveformRef, RecorderState, UpdateFrequency, useAudioPermission, PermissionStatus, Waveform } from '@simform_solutions/react-native-audio-waveform';
// import LinearGradient from 'react-native-linear-gradient';
// import RNFS from 'react-native-fs';
// import DeviceInfo from 'react-native-device-info';
// import { requestPermissions } from '../../utils/permissions';
// import { Icons } from '../../assets/Icon';


// export interface ListItem {
//     fromCurrentUser: boolean;
//     path: string;
// }

// const { width } = Dimensions.get('window');

// const LivePlayerComponent = ({ setList }: { setList: Dispatch<SetStateAction<ListItem[]>> }) => {
//     const ref = useRef<IWaveformRef>(null);
//     const [recorderState, setRecorderState] = useState(RecorderState.stopped);
//     const [paused, setPaused] = useState(false);
//     const [recordingTime, setRecordingTime] = useState(0);
//     const { checkHasAudioRecorderPermission, getAudioRecorderPermission } = useAudioPermission();
//     const [recordingPath, setRecordingPath] = useState('');
//     const [showSaveModal, setShowSaveModal] = useState(false);
//     const [recordingName, setRecordingName] = useState('');
//     const [defaultName, setDefaultName] = useState('');

//     const generateDefaultName = () => {
//         const now = new Date();
//         const date = now.toISOString().split('T')[0];
//         const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');
//         return `audit_${date}_${time}`;
//     };

//     useEffect(() => {
//         const defaultRecordingName = generateDefaultName();
//         setDefaultName(defaultRecordingName);
//         setRecordingName(defaultRecordingName);
//     }, []);

//     const checkAvailableStorage = async () => {
//         try {
//             const freeSpace = await DeviceInfo.getFreeDiskStorage();
//             return freeSpace / (1024 * 1024); // Convert to MB
//         } catch (error) {
//             console.warn("Error checking available storage:", error);
//             return 0;
//         }
//     };

//     useEffect(() => {
//         const requestAppPermissions = async () => {
//             await requestPermissions();
//         };

//         requestAppPermissions();
//     }, []);

//     const saveRecording = async () => {
//         try {
//             const availableStorage = await checkAvailableStorage();
//             if (availableStorage < 10) {
//                 Alert.alert('Storage Full', 'There is not enough storage space to save the recording. Please free up some space and try again.');
//                 return;
//             }

//             if (!recordingPath) {
//                 Alert.alert('Error', 'No recording to save');
//                 return;
//             }

//             if (!recordingName.trim()) {
//                 Alert.alert('Error', 'Please enter a recording name');
//                 return;
//             }

//             const sanitizedName = recordingName.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
//             const fileExtension = Platform.OS === 'android' ? '.mp3' : '.m4a';
//             const fileName = `${sanitizedName}${fileExtension}`;
//             const destPath = Platform.OS === 'android'
//                 ? `${RNFS.ExternalStorageDirectoryPath}/Music/${fileName}`
//                 : `${RNFS.DocumentDirectoryPath}/${fileName}`;

//             if (Platform.OS === 'android') {
//                 await RNFS.mkdir(`${RNFS.ExternalStorageDirectoryPath}/Music`);
//             }

//             await RNFS.copyFile(recordingPath, destPath);
//             Alert.alert('Success', `Recording saved as ${fileName}`, [{ text: 'OK', onPress: () => setShowSaveModal(false) }]);
//         } catch (error) {
//             console.error('Failed to save recording:', error);
//             Alert.alert('Error', 'Failed to save recording.');
//         }
//     };

//     const startRecording = () => {
//         ref.current?.startRecord({ updateFrequency: UpdateFrequency.high })
//             .then(() => {
//                 setRecorderState(RecorderState.recording);
//                 setPaused(false);
//                 setRecordingTime(0);
//             })
//             .catch(() => { });
//     };

//     const pauseRecording = () => {
//         if (ref.current) {
//             ref.current.pauseRecord();
//             setRecorderState(RecorderState.paused);
//             setPaused(true);
//         }
//     };

//     const resumeRecording = () => {
//         if (ref.current) {
//             ref.current.resumeRecord();
//             setRecorderState(RecorderState.recording);
//             setPaused(false);
//         }
//     };

//     const handleRecorderAction = async () => {
//         if (recorderState === RecorderState.stopped) {
//             const hasPermission = await checkHasAudioRecorderPermission();
//             if (hasPermission === PermissionStatus.granted) {
//                 startRecording();
//             } else if (hasPermission === PermissionStatus.undetermined) {
//                 const permissionStatus = await getAudioRecorderPermission();
//                 if (permissionStatus === PermissionStatus.granted) {
//                     startRecording();
//                 }
//             } else {
//                 Linking.openSettings();
//             }
//         } else if (recorderState === RecorderState.recording) {
//             pauseRecording();
//         } else if (recorderState === RecorderState.paused) {
//             resumeRecording();
//         }
//     };

//     const stopRecording = () => {
//         ref.current?.stopRecord().then(path => {
//             setRecordingPath(path);
//             setList(prev => [...prev, { fromCurrentUser: true, path }]);
//             setRecorderState(RecorderState.stopped);
//             setRecordingTime(0);
//             setShowSaveModal(true);
//         }).catch(error => console.error('Error stopping recording', error));
//     };

//     const formatTime = (seconds: number) => {
//         const minutes = Math.floor(seconds / 60);
//         const remainingSeconds = seconds % 60;
//         return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
//     };

//     return (
//         <View style={styles.liveWaveformContainer}>
//             <Text style={styles.recordingName}>
//                 {recorderState === RecorderState.recording ? (paused ? 'Recording Paused' : 'Recording...') : 'Ready to Record'}
//             </Text>

//             <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>

//             <Waveform
//                 mode="live"
//                 containerStyle={styles.liveWaveformView}
//                 ref={ref}
//                 candleSpace={2}
//                 candleWidth={4}
//                 candleHeightScale={8}
//                 waveColor={"#ffffff"}
//                 onRecorderStateChange={setRecorderState}
//             />

//             {recorderState === RecorderState.recording ? (
//                 <Pressable onPress={pauseRecording} style={styles.recordAudioPressable}>
//                     <Image source={Icons.pause} style={styles.buttonImageLive} resizeMode="contain" />
//                 </Pressable>
//             ) : recorderState === RecorderState.paused ? (
//                 <Pressable onPress={resumeRecording} style={styles.recordAudioPressable}>
//                     <Image source={Icons.resume} style={styles.buttonImageLive} resizeMode="contain" />
//                 </Pressable>
//             ) : (
//                 <Pressable onPress={handleRecorderAction} style={styles.recordAudioPressable}>
//                     <Image source={Icons.mic} style={styles.buttonImageLive} resizeMode="contain" />
//                 </Pressable>
//             )}

//             {recorderState !== RecorderState.stopped && (
//                 <Pressable onPress={stopRecording} style={styles.recordAudioPressable}>
//                     <Image source={Icons.stop} style={styles.buttonImageLive} resizeMode="contain" />
//                 </Pressable>
//             )}

//             <Modal visible={showSaveModal} transparent animationType="fade" onRequestClose={() => setShowSaveModal(false)}>
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.modalContent}>
//                         <Text style={styles.modalTitle}>Save Recording</Text>

//                         <Text style={styles.modalLabel}>Recording Name:</Text>
//                         <TextInput
//                             style={styles.modalInput}
//                             value={recordingName}
//                             onChangeText={setRecordingName}
//                             placeholder="Enter recording name"
//                         />

//                         <View style={styles.modalButtons}>
//                             <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowSaveModal(false)}>
//                                 <Text style={styles.modalButtonText}>Cancel</Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={saveRecording}>
//                                 <Text style={[styles.modalButtonText, { color: 'white' }]}>Save</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </View>
//             </Modal>
//         </View>
//     );
// };

// const VoiceRecorder = () => {
//     const [list, setList] = useState<ListItem[]>([]);
//     const { bottom } = useSafeAreaInsets();

//     return (
//         <LinearGradient colors={['#4ade80', '#38bdf8']} style={styles.appContainer}>
//             <GestureHandlerRootView style={styles.appContainer}>
//                 <View style={[styles.screenBackground, { paddingBottom: bottom }]}>
//                     <LivePlayerComponent setList={setList} />
//                 </View>
//             </GestureHandlerRootView>
//         </LinearGradient>
//     );
// };

// const styles = StyleSheet.create({
//     appContainer: { flex: 1 },
//     recordingName: { color: 'white', fontSize: 24, fontWeight: '600', textAlign: 'center', marginBottom: 10 },
//     timerText: { fontSize: 48, fontWeight: '600', color: '#000', textAlign: 'center', marginBottom: 20 },
//     liveWaveformContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 },
//     liveWaveformView: { width: '100%', height: 100, marginBottom: 30 },
//     buttonImageLive: { height: 50, width: 50, tintColor: '#ffffff' },
//     recordAudioPressable: { height: 50, width: 50, padding: 8, marginBottom: 20 },
//     screenBackground: { flex: 1, justifyContent: 'center' },
//     modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
//     modalContent: { backgroundColor: 'white', borderRadius: 15, padding: 20, width: width * 0.9, maxWidth: 400 },
//     modalTitle: { fontSize: 24, fontWeight: '600', marginBottom: 20, textAlign: 'center' },
//     modalLabel: { fontSize: 16, marginBottom: 8, color: '#666' },
//     modalInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 20 },
//     modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
//     modalButton: { flex: 0.48, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
//     cancelButton: { backgroundColor: '#f1f1f1' },
//     saveButton: { backgroundColor: '#4CAF50' },
//     modalButtonText: { fontSize: 16, fontWeight: '600' },
// });

// export default VoiceRecorder;