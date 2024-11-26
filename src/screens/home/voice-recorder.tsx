import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Image, Linking, Pressable, Text, View, StyleSheet, Platform, Alert, Modal, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { IWaveformRef, RecorderState, UpdateFrequency, useAudioPermission, PermissionStatus, Waveform } from '@simform_solutions/react-native-audio-waveform';
import LinearGradient from 'react-native-linear-gradient';
import RNFS from 'react-native-fs';
import DeviceInfo from 'react-native-device-info';
import { requestPermissions } from '../../utils/permissions';
import { Icons } from '../../../assets/images';

export interface ListItem {
    fromCurrentUser: boolean;
    path: string;
}

const { width } = Dimensions.get('window');

const LivePlayerComponent = ({ setList }: { setList: Dispatch<SetStateAction<ListItem[]>> }) => {
    const ref = useRef<IWaveformRef>(null);
    const [recorderState, setRecorderState] = useState(RecorderState.stopped);
    const [paused, setPaused] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const { checkHasAudioRecorderPermission, getAudioRecorderPermission } = useAudioPermission();
    const [recordingPath, setRecordingPath] = useState('');
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [recordingName, setRecordingName] = useState('');
    const [defaultName, setDefaultName] = useState('');
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    const generateDefaultName = () => {
        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');
        return `audit_${date}_${time}`;
    };

    useEffect(() => {
        const defaultRecordingName = generateDefaultName();
        setDefaultName(defaultRecordingName);
        setRecordingName(defaultRecordingName);
    }, []);

    const checkAvailableStorage = async () => {
        try {
            const freeSpace = await DeviceInfo.getFreeDiskStorage();
            return freeSpace / (1024 * 1024);
        } catch (error) {
            console.warn("Error checking available storage:", error);
            return 0;
        }
    };

    useEffect(() => {
        const requestAppPermissions = async () => {
            await requestPermissions();
        };

        requestAppPermissions();
    }, []);

    const saveRecording = async () => {
        try {
            const availableStorage = await checkAvailableStorage();
            if (availableStorage < 10) {
                Alert.alert('Storage Full', 'There is not enough storage space to save the recording. Please free up some space and try again.');
                return;
            }

            if (!recordingPath) {
                Alert.alert('Error', 'No recording to save');
                return;
            }

            if (!recordingName.trim()) {
                Alert.alert('Error', 'Please enter a recording name');
                return;
            }

            const sanitizedName = recordingName.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
            const fileExtension = Platform.OS === 'android' ? '.mp3' : '.m4a';
            const fileName = `${sanitizedName}${fileExtension}`;
            const destPath = Platform.OS === 'android'
                ? `${RNFS.ExternalStorageDirectoryPath}/Music/${fileName}`
                : `${RNFS.DocumentDirectoryPath}/${fileName}`;

            if (Platform.OS === 'android') {
                await RNFS.mkdir(`${RNFS.ExternalStorageDirectoryPath}/Music`);
            }

            await RNFS.copyFile(recordingPath, destPath);
            Alert.alert('Success', `Recording saved as ${fileName}`, [{ text: 'OK', onPress: () => setShowSaveModal(false) }]);
        } catch (error) {
            console.error('Failed to save recording:', error);
            Alert.alert('Error', 'Failed to save recording.');
        }
    };

    const startRecording = () => {
        ref.current?.startRecord({ updateFrequency: UpdateFrequency.high })
            .then(() => {
                setRecorderState(RecorderState.recording);
                setPaused(false);
                setRecordingTime(0);


                const id = setInterval(() => {
                    setRecordingTime((prevTime) => prevTime + 1);
                }, 1000);

                setIntervalId(id);
            })
            .catch(() => { });
    };

    const pauseRecording = () => {
        if (ref.current) {
            ref.current.pauseRecord();
            setRecorderState(RecorderState.paused);
            setPaused(true);
        }
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    };

    const resumeRecording = () => {
        if (ref.current) {
            ref.current.resumeRecord();
            setRecorderState(RecorderState.recording);
            setPaused(false);
            const id = setInterval(() => {
                setRecordingTime((prevTime) => prevTime + 1);
            }, 1000);

            setIntervalId(id);
        }
    };

    const handleRecorderAction = async () => {
        if (recorderState === RecorderState.stopped) {
            const hasPermission = await checkHasAudioRecorderPermission();
            if (hasPermission === PermissionStatus.granted) {
                startRecording();
            } else if (hasPermission === PermissionStatus.undetermined) {
                const permissionStatus = await getAudioRecorderPermission();
                if (permissionStatus === PermissionStatus.granted) {
                    startRecording();
                }
            } else {
                Linking.openSettings();
            }
        } else if (recorderState === RecorderState.recording) {
            pauseRecording();
        } else if (recorderState === RecorderState.paused) {
            resumeRecording();
        }
    };

    const stopRecording = () => {
        ref.current?.stopRecord().then(path => {
            setRecordingPath(path);
            setList(prev => [...prev, { fromCurrentUser: true, path }]);
            setRecorderState(RecorderState.stopped);
            setRecordingTime(0);
            setShowSaveModal(true);
            if (intervalId) {
                clearInterval(intervalId);
                setIntervalId(null);
            }
        }).catch(error => console.error('Error stopping recording', error));
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    return (
        <View style={styles.liveWaveformContainer}>
            <Text style={styles.recordingName}>
                {recorderState === RecorderState.recording
                    ? 'Recording...'
                    : recorderState === RecorderState.paused
                        ? 'Recording Paused'
                        : 'Ready to Record'}
            </Text>

            <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>

            <Waveform
                mode="live"
                containerStyle={styles.liveWaveformView}
                ref={ref}
                candleSpace={2}
                candleWidth={4}
                candleHeightScale={8}
                waveColor={"#ffffff"}
                onRecorderStateChange={setRecorderState}

            />

            {recorderState === RecorderState.recording ? (
                <Pressable onPress={pauseRecording} style={styles.recordAudioPressable}>
                    <Image source={Icons.pause} style={styles.buttonImageLive} resizeMode="contain" />
                </Pressable>
            ) : recorderState === RecorderState.paused ? (
                <Pressable onPress={resumeRecording} style={styles.recordAudioPressable}>
                    <Image source={Icons.resume} style={styles.buttonImageLive} resizeMode="contain" />
                </Pressable>
            ) : (
                <Pressable onPress={handleRecorderAction} style={styles.recordAudioPressable}>
                    <Image source={Icons.mic} style={styles.buttonImageLive} resizeMode="contain" />
                </Pressable>
            )}

            {recorderState !== RecorderState.stopped && (
                <Pressable onPress={stopRecording} style={styles.recordAudioPressable}>
                    <Image source={Icons.stop} style={styles.buttonImageLive} resizeMode="contain" />
                </Pressable>
            )}

            <Modal visible={showSaveModal} transparent animationType="fade" onRequestClose={() => setShowSaveModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Save Recording</Text>

                        <Text style={styles.modalLabel}>Recording Name:</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={recordingName}
                            onChangeText={setRecordingName}
                            placeholder="Enter recording name"
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowSaveModal(false)}>
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={saveRecording}>
                                <Text style={[styles.modalButtonText, { color: 'white' }]}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const VoiceRecorder = () => {
    const [list, setList] = useState<ListItem[]>([]);

    return (
        <LinearGradient colors={['#4ade80', '#38bdf8']} style={styles.appContainer}>
            <GestureHandlerRootView style={styles.appContainer}>
                <View style={styles.screenBackground}>
                    <LivePlayerComponent setList={setList} />
                </View>
            </GestureHandlerRootView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    appContainer: { flex: 1 },
    recordingName: { color: 'white', fontSize: 24, fontWeight: '600', textAlign: 'center', marginBottom: 10 },
    timerText: { fontSize: 48, fontWeight: '600', color: '#fff', textAlign: 'center', marginBottom: 20 },
    liveWaveformContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16, overflow: 'hidden', },
    liveWaveformView: { width: '100%', height: 100, marginBottom: 30, overflow: 'hidden', },
    buttonImageLive: { height: 50, width: 50, tintColor: '#ffffff' },
    recordAudioPressable: { height: 50, width: 50, marginBottom: 20 },
    screenBackground: { flex: 1, justifyContent: 'center' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: 'white', borderRadius: 15, padding: 20, width: width * 0.9, maxWidth: 400 },
    modalTitle: { fontSize: 24, fontWeight: '600', marginBottom: 20, textAlign: 'center' },
    modalLabel: { fontSize: 16, marginBottom: 8, color: '#666' },
    modalInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 20 },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
    modalButton: { flex: 0.48, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
    cancelButton: { backgroundColor: '#f1f1f1' },
    saveButton: { backgroundColor: '#4CAF50' },
    modalButtonText: { fontSize: 16, fontWeight: '600' },
});

export default VoiceRecorder;




