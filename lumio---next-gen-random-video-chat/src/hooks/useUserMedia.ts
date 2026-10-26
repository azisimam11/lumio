import { useState, useEffect, useCallback, useRef } from 'react';
import { MediaService } from '../services/mediaService';
import { MediaPermissionStatus, MediaDeviceItem } from '../types';

export function useUserMedia() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<MediaPermissionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);

  const [availableCameras, setAvailableCameras] = useState<MediaDeviceItem[]>([]);
  const [availableMics, setAvailableMics] = useState<MediaDeviceItem[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [selectedMicId, setSelectedMicId] = useState<string>('');

  // Ref to hold current stream for reliable cleanup
  const streamRef = useRef<MediaStream | null>(null);

  const refreshDevices = useCallback(async () => {
    const { cameras, microphones } = await MediaService.enumerateConnectedDevices();
    setAvailableCameras(cameras);
    setAvailableMics(microphones);
    if (cameras.length > 0 && !selectedCameraId) {
      setSelectedCameraId(cameras[0].deviceId);
    }
    if (microphones.length > 0 && !selectedMicId) {
      setSelectedMicId(microphones[0].deviceId);
    }
  }, [selectedCameraId, selectedMicId]);

  /**
   * Acquire local camera and mic stream via getUserMedia
   */
  const startMedia = useCallback(
    async (camId?: string, micId?: string) => {
      if (!MediaService.isSupported()) {
        setPermissionStatus('unavailable');
        setErrorMessage('Browser does not support camera or microphone capture.');
        return null;
      }

      setPermissionStatus('requesting');
      setErrorMessage(null);

      // Clean up existing stream before acquiring new one
      if (streamRef.current) {
        MediaService.stopAllTracks(streamRef.current);
        streamRef.current = null;
        setStream(null);
      }

      try {
        const newStream = await MediaService.requestMediaStream(
          micId || selectedMicId,
          camId || selectedCameraId
        );

        streamRef.current = newStream;
        setStream(newStream);
        setPermissionStatus('granted');

        // Apply current mute / video-off states
        MediaService.setAudioEnabled(newStream, !isMuted);
        MediaService.setVideoEnabled(newStream, !isVideoOff);

        // Enumerate devices once permission has been granted (labels now available)
        await refreshDevices();

        return newStream;
      } catch (err: any) {
        if (err.message === 'PERMISSION_DENIED') {
          setPermissionStatus('denied');
          setErrorMessage('Camera or microphone permission was denied. Please allow camera access in your browser settings.');
        } else if (err.message === 'DEVICE_NOT_FOUND') {
          setPermissionStatus('unavailable');
          setErrorMessage('No camera or microphone hardware found on your system.');
        } else if (err.message === 'DEVICE_IN_USE') {
          setPermissionStatus('error');
          setErrorMessage('Camera is currently in use by another application.');
        } else {
          setPermissionStatus('error');
          setErrorMessage(err.message || 'Failed to acquire camera stream.');
        }
        return null;
      }
    },
    [selectedCameraId, selectedMicId, isMuted, isVideoOff, refreshDevices]
  );

  /**
   * Stop all media tracks completely
   */
  const stopMedia = useCallback(() => {
    if (streamRef.current) {
      MediaService.stopAllTracks(streamRef.current);
      streamRef.current = null;
    }
    setStream(null);
    setPermissionStatus('idle');
  }, []);

  /**
   * Toggle Audio Mute
   */
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (streamRef.current) {
        MediaService.setAudioEnabled(streamRef.current, !next);
      }
      return next;
    });
  }, []);

  /**
   * Toggle Video On / Off
   */
  const toggleVideo = useCallback(() => {
    setIsVideoOff((prev) => {
      const next = !prev;
      if (streamRef.current) {
        MediaService.setVideoEnabled(streamRef.current, !next);
      }
      return next;
    });
  }, []);

  /**
   * Switch Camera Hardware
   */
  const switchCamera = useCallback(
    async (deviceId: string) => {
      setSelectedCameraId(deviceId);
      if (streamRef.current) {
        await startMedia(deviceId, selectedMicId);
      }
    },
    [selectedMicId, startMedia]
  );

  /**
   * Switch Microphone Hardware
   */
  const switchMic = useCallback(
    async (deviceId: string) => {
      setSelectedMicId(deviceId);
      if (streamRef.current) {
        await startMedia(selectedCameraId, deviceId);
      }
    },
    [selectedCameraId, startMedia]
  );

  /**
   * Toggle Mirror Preview
   */
  const toggleMirror = useCallback(() => {
    setIsMirrored((prev) => !prev);
  }, []);

  // Cleanup tracks on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        MediaService.stopAllTracks(streamRef.current);
      }
    };
  }, []);

  return {
    stream,
    permissionStatus,
    errorMessage,
    isMuted,
    isVideoOff,
    isMirrored,
    availableCameras,
    availableMics,
    selectedCameraId,
    selectedMicId,
    startMedia,
    stopMedia,
    toggleMute,
    toggleVideo,
    toggleMirror,
    switchCamera,
    switchMic,
    refreshDevices,
  };
}
