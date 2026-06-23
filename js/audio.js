/**
 * Audio Management System
 * Handles all game sounds and audio effects
 */

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.musicVolume = 0.3;
        this.sfxVolume = 0.6;
        this.masterVolume = 0.8;
        
        this.initAudioContext();
    }

    initAudioContext() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
        } catch (e) {
            console.warn('Web Audio API not supported', e);
        }
    }

    // Simple tone generator for sound effects
    playTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = type;
        osc.frequency.value = frequency;

        gain.gain.setValueAtTime(volume * this.sfxVolume * this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.start(now);
        osc.stop(now + duration);
    }

    playNightAmbience() {
        // Play ambient background sound (low frequency hum)
        if (!this.audioContext) return;
        this.playTone(55, 1, 'sine', 0.15); // 55 Hz ambient hum
    }

    playHallwayCheck() {
        // Beep sound for hallway check
        this.playTone(800, 0.1, 'sine', 0.4);
        setTimeout(() => this.playTone(600, 0.1, 'sine', 0.4), 150);
    }

    playDoorClose() {
        // Deep thunk sound
        this.playTone(120, 0.3, 'sine', 0.5);
    }

    playDoorOpen() {
        // Creaking sound
        this.playTone(200, 0.4, 'sine', 0.3);
    }

    playJumpscare(animatronicName) {
        // Loud alarm/screech
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;
        
        // Create a scary noise
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.playTone(200 + (i * 100), 0.2, 'square', 0.7);
            }, i * 150);
        }
    }

    playPowerFailure() {
        // Warning alarm sound
        if (!this.audioContext) return;

        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.playTone(440, 0.2, 'sine', 0.6);
            }, i * 300);
        }
    }

    playNightComplete() {
        // Success chime
        if (!this.audioContext) return;

        this.playTone(523.25, 0.1, 'sine', 0.4); // C
        setTimeout(() => this.playTone(659.25, 0.1, 'sine', 0.4), 150); // E
        setTimeout(() => this.playTone(783.99, 0.2, 'sine', 0.4), 300); // G
    }

    playUIClick() {
        // Simple click sound
        this.playTone(400, 0.05, 'sine', 0.3);
    }

    playAnimatronicMove() {
        // Sound for when animatronic moves
        this.playTone(150, 0.15, 'sine', 0.2);
    }

    playWarning() {
        // Alert sound
        this.playTone(550, 0.2, 'sine', 0.4);
    }

    setVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }

    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
    }
}
