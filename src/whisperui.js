class WhisperUI {
  constructor() {
    this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.commands = [];

    // Ambil bahasa dari localStorage atau default ke Indonesia
    this.language = localStorage.getItem("whisperUI_lang") || "id-ID";
    this.recognition.lang = this.language;
  }

  start() {
    this.recognition.start();
    this.recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      console.log("🎤 Perintah suara:", transcript);
      this.runCommand(transcript);
    };
  }

  stop() {
    this.recognition.stop();
  }

  setLanguage(lang) {
    this.language = lang;
    this.recognition.lang = lang;
    localStorage.setItem("whisperUI_lang", lang);
    console.log(`🌎 Bahasa diubah ke: ${lang}`);
  }

  addCommand(pattern, action) {
    this.commands.push({ pattern: new RegExp(`^${pattern}$`, "i"), action });
  }

  runCommand(transcript) {
    for (const { pattern, action } of this.commands) {
      const match = transcript.match(pattern);
      if (match) {
        action(...match.slice(1)); // Kirim parameter dari perintah
        return;
      }
    }
  }
}

// Export sebagai modul
window.WhisperUI = WhisperUI;
