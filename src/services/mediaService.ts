import { MediaDeviceItem } from '../types';

export class MediaService {
  /**
   * Check if getUserMedia is supported in the current browser environment
   */
  static isSupported(): boolean {
    return Boolean(
      typeof navigator !== 'undefined' &&
        navigator.mediaDevices &&
        typeof navigator.mediaDevices.getUserMedia === 'function'
    );
  }

  /**
   * Request actual camera and microphone media stream
   */
  static async requestMediaStream(
    audioDeviceId?: string,
    videoDeviceId?: string
  ): Promise<MediaStream> {
    if (!this.isSupported()) {
      throw new Error('MEDIA_UNSUPPORTED');
    }

    const audioConstraints: boolean | MediaTrackConstraints = audioDeviceId
      ? { deviceId: { exact: audioDeviceId }, echoCancellation: true, noiseSuppression: true }
      : { echoCancellation: true, noiseSuppression: true };

    const videoConstraints: boolean | MediaTrackConstraints = videoDeviceId
      ? {
          deviceId: { exact: videoDeviceId },
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30, max: 60 },
        }
      : {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: 'user',
        };

    try {
      return await navigator.mediaDevices.getUserMedia({
        audio: audioConstraints,
        video: videoConstraints,
      });
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        throw new Error('PERMISSION_DENIED');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        throw new Error('DEVICE_NOT_FOUND');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        throw new Error('DEVICE_IN_USE');
      } else if (err.name === 'OverconstrainedError') {
        // Fallback with minimal constraints
        return await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
      }
      throw err;
    }
  }

  /**
   * Stop all tracks in a MediaStream completely, freeing hardware camera & mic
   */
  static stopAllTracks(stream: MediaStream | null): void {
    if (!stream) return;
    stream.getTracks().forEach((track) => {
      try {
        track.stop();
      } catch (e) {
        console.error('Error stopping media track:', e);
      }
    });
  }

  /**
   * Enable or disable audio tracks (Mute / Unmute)
   */
  static setAudioEnabled(stream: MediaStream | null, enabled: boolean): void {
    if (!stream) return;
    stream.getAudioTracks().forEach((track) => {
      track.enabled = enabled;
    });
  }

  /**
   * Enable or disable video tracks (Camera On / Off)
   */
  static setVideoEnabled(stream: MediaStream | null, enabled: boolean): void {
    if (!stream) return;
    stream.getVideoTracks().forEach((track) => {
      track.enabled = enabled;
    });
  }

  /**
   * Enumerate connected cameras and microphones
   */
  static async enumerateConnectedDevices(): Promise<{
    cameras: MediaDeviceItem[];
    microphones: MediaDeviceItem[];
  }> {
    if (!this.isSupported() || !navigator.mediaDevices.enumerateDevices) {
      return { cameras: [], microphones: [] };
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras: MediaDeviceItem[] = [];
      const microphones: MediaDeviceItem[] = [];

      devices.forEach((device, index) => {
        if (device.kind === 'videoinput') {
          cameras.push({
            deviceId: device.deviceId,
            label: device.label || `Camera ${cameras.length + 1}`,
            kind: 'videoinput',
          });
        } else if (device.kind === 'audioinput') {
          microphones.push({
            deviceId: device.deviceId,
            label: device.label || `Microphone ${microphones.length + 1}`,
            kind: 'audioinput',
          });
        }
      });

      return { cameras, microphones };
    } catch (e) {
      console.warn('Unable to enumerate media devices:', e);
      return { cameras: [], microphones: [] };
    }
  }
}
