import { ref } from 'vue';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export class VoiceService {
  private recognition: any = null;
  
  constructor() {
    // Check for browser support and initialize
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.setupRecognition();
      }
    }
  }

  private setupRecognition() {
    if (this.recognition) {
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'de-DE';
    }
  }

  startListening(onResult: (text: string) => void, onError: (error: any) => void) {
    if (!this.recognition) {
      onError(new Error('Speech recognition is not supported in your browser'));
      return;
    }

    this.recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      console.log('Voice input received:', text);
      onResult(text);
    };

    this.recognition.onerror = (event: any) => {
      console.error('Voice recognition error:', event.error);
      onError(event.error);
    };

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      onError(error);
    }
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Failed to stop voice recognition:', error);
      }
    }
  }
}

export const voiceService = new VoiceService();