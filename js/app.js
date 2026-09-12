/**
 * Kai Onnu Kaattikke! - Main App Controller for Ammachi & Anime Creature
 */

import { sound } from './audio.js';
import { ParticleSystem } from './confetti.js';
import { CharacterJudge, AnimeCreature } from './character.js';
import { AiVisionService } from './ai-service.js';
import { ShareCardGenerator } from './share.js';

class KaiApp {
  constructor() {
    this.aiService = new AiVisionService();
    this.particles = new ParticleSystem(document.getElementById('particleCanvas'));
    this.character = new CharacterJudge(
      document.getElementById('characterAvatar'),
      document.getElementById('speechBubble')
    );
    this.animeCreature = new AnimeCreature(
      document.getElementById('animeCreatureAvatar')
    );

    this.currentStream = null;
    this.facingMode = 'environment';
    this.currentImageDataUrl = null;
    this.currentResult = null;

    this.initDOMElements();
    this.bindEvents();
    this.loadSettings();
  }

  initDOMElements() {
    // Top Bar
    this.soundToggleBtn = document.getElementById('soundToggleBtn');
    this.soundIcon = document.getElementById('soundIcon');
    this.settingsBtn = document.getElementById('settingsBtn');

    // Speech Elements
    this.speechSpeaker = document.getElementById('speechSpeaker');
    this.speechText = document.getElementById('speechText');
    this.speechSub = document.getElementById('speechSub');

    // Stages
    this.inputStage = document.getElementById('inputStage');
    this.scanningStage = document.getElementById('scanningStage');
    this.resultStage = document.getElementById('resultStage');

    // Camera
    this.cameraWrapper = document.getElementById('cameraWrapper');
    this.cameraVideo = document.getElementById('cameraVideo');
    this.cameraControls = document.getElementById('cameraControls');
    this.captureBtn = document.getElementById('captureBtn');
    this.cancelCameraBtn = document.getElementById('cancelCameraBtn');
    this.flipCameraBtn = document.getElementById('flipCameraBtn');

    // Square Buttons & Upload Area
    this.uploadArea = document.getElementById('uploadArea');
    this.startCameraBtn = document.getElementById('startCameraBtn');
    this.browseFileBtn = document.getElementById('browseFileBtn');
    this.dropzone = document.getElementById('dropzone');
    this.fileInput = document.getElementById('fileInput');

    // 4 Scanning Steps
    this.scanPreviewImg = document.getElementById('scanPreviewImg');
    this.step1 = document.getElementById('step1');
    this.step2 = document.getElementById('step2');
    this.step3 = document.getElementById('step3');
    this.step4 = document.getElementById('step4');
    this.step1Status = document.getElementById('step1Status');
    this.step2Status = document.getElementById('step2Status');
    this.step3Status = document.getElementById('step3Status');
    this.step4Status = document.getElementById('step4Status');
    this.step4Icon = document.getElementById('step4Icon');
    this.step4Text = document.getElementById('step4Text');
    this.scanProgress = document.getElementById('scanProgress');
    this.scanPercentText = document.getElementById('scanPercentText');

    // Results Elements
    this.resultBadge = document.getElementById('resultBadge');
    this.badgeIcon = document.getElementById('badgeIcon');
    this.badgeTitle = document.getElementById('badgeTitle');
    this.resultPropsBanner = document.getElementById('resultPropsBanner');
    this.verdictMalayalam = document.getElementById('verdictMalayalam');
    this.verdictEnglish = document.getElementById('verdictEnglish');
    this.scoreNumber = document.getElementById('scoreNumber');
    this.scoreCategory = document.getElementById('scoreCategory');
    this.scoreTagline = document.getElementById('scoreTagline');
    this.roastCommentary = document.getElementById('roastCommentary');
    this.meterFill = document.getElementById('meterFill');
    this.valNails = document.getElementById('valNails');
    this.valMud = document.getElementById('valMud');
    this.valRating = document.getElementById('valRating');

    // Result Action Buttons
    this.checkAgainBtn = document.getElementById('checkAgainBtn');
    this.shareResultBtn = document.getElementById('shareResultBtn');
    this.speakVoiceBtn = document.getElementById('speakVoiceBtn');

    // Settings Modal
    this.settingsModal = document.getElementById('settingsModal');
    this.closeSettingsBtn = document.getElementById('closeSettingsBtn');
    this.analysisModeSelect = document.getElementById('analysisModeSelect');
    this.geminiApiKeyInput = document.getElementById('geminiApiKeyInput');
    this.saveSettingsBtn = document.getElementById('saveSettingsBtn');
  }

  bindEvents() {
    // Sound toggle
    this.soundToggleBtn.addEventListener('click', () => {
      const isMuted = sound.toggleMute();
      this.soundIcon.textContent = isMuted ? '🔇' : '🔊';
      if (!isMuted) sound.playPop();
    });

    // Square Buttons
    this.startCameraBtn.addEventListener('click', () => this.startCamera());
    this.browseFileBtn.addEventListener('click', () => this.fileInput.click());

    // Camera buttons
    this.captureBtn.addEventListener('click', () => this.capturePhoto());
    this.cancelCameraBtn.addEventListener('click', () => this.stopCamera());
    this.flipCameraBtn.addEventListener('click', () => this.flipCamera());

    // File input & Dropzone
    this.dropzone.addEventListener('click', () => this.fileInput.click());
    this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

    // Drag & Drop
    ['dragenter', 'dragover'].forEach(name => {
      this.dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        this.dropzone.classList.add('drag-over');
      });
    });
    ['dragleave', 'drop'].forEach(name => {
      this.dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        this.dropzone.classList.remove('drag-over');
      });
    });
    this.dropzone.addEventListener('drop', (e) => {
      const file = e.dataTransfer?.files?.[0];
      if (file && file.type.startsWith('image/')) {
        this.processImageFile(file);
      }
    });

    // Instant Demo Preset Chips (1-Click Test)
    document.querySelectorAll('.sample-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const type = chip.dataset.sample;
        const imgPath = type === 'clean' ? 'samples/clean_hand.jpg' : 'samples/dirty_hand.jpg';
        this.loadSampleImage(imgPath);
      });
    });

    // Result action buttons
    this.checkAgainBtn.addEventListener('click', () => this.resetToCheckAgain());
    this.shareResultBtn.addEventListener('click', () => this.handleShare());
    this.speakVoiceBtn.addEventListener('click', () => this.speakCurrentVerdict());

    // Settings Modal
    this.settingsBtn.addEventListener('click', () => {
      sound.playPop();
      this.settingsModal.classList.remove('hidden');
    });
    this.closeSettingsBtn.addEventListener('click', () => {
      this.settingsModal.classList.add('hidden');
    });
    this.saveSettingsBtn.addEventListener('click', () => {
      sound.playPop();
      this.aiService.setMode(this.analysisModeSelect.value);
      this.aiService.setApiKey(this.geminiApiKeyInput.value);
      this.settingsModal.classList.add('hidden');
    });
  }

  loadSettings() {
    this.analysisModeSelect.value = this.aiService.getMode();
    this.geminiApiKeyInput.value = this.aiService.getApiKey();
  }

  // ==========================================================================
  // CAMERA MANAGEMENT
  // ==========================================================================
  async startCamera() {
    sound.playPop();
    this.uploadArea.classList.add('hidden');
    this.cameraWrapper.classList.remove('hidden');
    this.cameraControls.classList.remove('hidden');

    this.character.setMood('idle', `
      <div class="speech-title"><span class="speech-officer-icon">📸</span> ക്യാമറ റെഡി!</div>
      <div class="speech-text">കൈ നേരെ ക്യാമറയ്ക്ക് മുന്നിൽ കാട്ടൂ! 👀</div>
      <div class="speech-sub">Hold your hand clearly inside the box for Ammachi!</div>
    `);
    sound.speakMalayalam('കൈ നേരെ ക്യാമറയ്ക്ക് മുന്നിൽ കാട്ടൂ');

    try {
      if (this.currentStream) {
        this.stopCameraStream();
      }
      this.currentStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: this.facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      this.cameraVideo.srcObject = this.currentStream;
    } catch (err) {
      console.warn('Camera access unavailable:', err);
      alert('Camera access is not permitted or unavailable on this device. You can click "Upload Image" or "Presentation Demo"!');
      this.stopCamera();
    }
  }

  stopCameraStream() {
    if (this.currentStream) {
      this.currentStream.getTracks().forEach(track => track.stop());
      this.currentStream = null;
    }
  }

  stopCamera() {
    this.stopCameraStream();
    this.cameraWrapper.classList.add('hidden');
    this.cameraControls.classList.add('hidden');
    this.uploadArea.classList.remove('hidden');

    this.character.setMood('idle', `
      <div class="speech-title"><span class="speech-officer-icon">👵</span> അമ്മച്ചി കാത്തിരിക്കുന്നു:</div>
      <div class="speech-text">കൈ ഒന്ന് കാണിച്ചേ... 😂</div>
      <div class="speech-sub">"Show your hand to Ammachi!"</div>
    `);
  }

  async flipCamera() {
    this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
    await this.startCamera();
  }

  capturePhoto() {
    sound.playCameraClick();
    const video = this.cameraVideo;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');

    if (this.facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    this.stopCamera();
    this.beginAnalysis(dataUrl);
  }

  handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (file) {
      this.processImageFile(file);
    }
  }

  processImageFile(file) {
    sound.playPop();
    const reader = new FileReader();
    reader.onload = (event) => {
      this.beginAnalysis(event.target.result);
    };
    reader.readAsDataURL(file);
  }

  loadSampleImage(path) {
    sound.playPop();
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      this.beginAnalysis(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.src = path;
  }

  // ==========================================================================
  // AMMACHI & ANIME CREATURE 4-STAGE SCANNING SEQUENCE 😂
  // ==========================================================================
  async beginAnalysis(imageDataUrl) {
    this.currentImageDataUrl = imageDataUrl;

    // Switch stages: hide input, show scanning
    this.inputStage.classList.add('hidden');
    this.resultStage.classList.add('hidden');
    this.scanningStage.classList.remove('hidden');

    this.scanPreviewImg.src = imageDataUrl;
    this.resetScanningSteps();

    // Characters enter scanning mood
    this.character.setMood('scanning', `
      <div class="speech-title"><span class="speech-officer-icon">🔍</span> അമ്മച്ചി പരിശോധിക്കുന്നു:</div>
      <div class="speech-text">കൈ ഒന്ന് കാണിക്കൂ... 👀</div>
      <div class="speech-sub">Ammachi is inspecting your hand with her magnifying glass!</div>
    `);
    this.animeCreature.setMood('scanning');

    // Start background image analysis in parallel
    const imgElement = new Image();
    imgElement.src = imageDataUrl;
    await new Promise(res => { imgElement.onload = res; });

    const analysisPromise = this.aiService.analyzeHand(imgElement, imageDataUrl);

    // ========================================================================
    // STEP 1: “🔍 Kai nokkunnu...”
    // Voice: “കൈ ഒന്ന് കാണിക്കൂ...”
    // ========================================================================
    this.setStepActive(this.step1, this.step1Status, '🔍 നോക്കുന്നു...');
    this.setScanProgress(25);
    sound.playScan(1);
    sound.speakMalayalam('കൈ ഒന്ന് കാണിക്കൂ...');
    await this.delay(1200);
    this.setStepDone(this.step1, this.step1Status, '✅ Done');

    // ========================================================================
    // STEP 2: “🕵️ Nails check cheyyunnu...”
    // Voice: “നോക്കട്ടെ... നഖം ഒന്ന് പരിശോധിക്കട്ടെ...”
    // ========================================================================
    this.character.speak(`
      <div class="speech-title"><span class="speech-officer-icon">🕵️</span> നഖം പരിശോധന:</div>
      <div class="speech-text">നോക്കട്ടെ... നഖം ഒന്ന് പരിശോധിക്കട്ടെ... 🔍</div>
      <div class="speech-sub">Inspecting fingernails closely for dirt and grime...</div>
    `);
    this.setStepActive(this.step2, this.step2Status, '🕵️ നോക്കുന്നു...');
    this.setScanProgress(50);
    sound.playScan(2);
    sound.speakMalayalam('നോക്കട്ടെ... നഖം ഒന്ന് പരിശോധിക്കട്ടെ...');
    await this.delay(1200);
    this.setStepDone(this.step2, this.step2Status, '✅ Done');

    // ========================================================================
    // STEP 3: “👀 മണ്ണുണ്ടോ എന്ന് നോക്കട്ടെ...”
    // ========================================================================
    this.character.speak(`
      <div class="speech-title"><span class="speech-officer-icon">👀</span> മണ്ണ് സൂക്ഷ്മപരിശോധന:</div>
      <div class="speech-text">മണ്ണുണ്ടോ എന്ന് നോക്കട്ടെ... 🕵️</div>
      <div class="speech-sub">Scanning for mud, dust, and grime...</div>
    `);
    this.setStepActive(this.step3, this.step3Status, '👀 നോക്കുന്നു...');
    this.setScanProgress(75);
    sound.playScan(3);
    await this.delay(1100);
    this.setStepDone(this.step3, this.step3Status, '✅ Done');

    // Await analysis result
    const result = await analysisPromise;
    this.currentResult = result;

    // ========================================================================
    // STEP 4: “👵 Ammachi verdict parayatte...”
    // Dirty Voice: “അയ്യോ... ഇത് എന്താ മോനെ/മോളെ?”
    // Clean Voice: “അടിപൊളി! കൈ നല്ല വൃത്തിയാണല്ലോ!”
    // ========================================================================
    this.setScanProgress(95);
    sound.playDrumroll();

    if (!result.isClean) {
      this.step4Icon.textContent = '😱';
      this.step4Text.textContent = 'അയ്യോ... ഇത് എന്താ മോനെ/മോളെ? 😭';
      this.setStepActive(this.step4, this.step4Status, '🚨 അയ്യോ!');
      this.character.speak(`
        <div class="speech-title"><span class="speech-officer-icon">😱</span> അമ്മച്ചി ഞെട്ടിപ്പോയി!</div>
        <div class="speech-text">അയ്യോ... ഇത് എന്താ മോനെ/മോളെ? 😭</div>
        <div class="speech-sub">Ammachi is horrified by the mud on your hands!</div>
      `);
      sound.speakMalayalam('അയ്യോ... ഇത് എന്താ മോനെ മോളെ?');
    } else {
      this.step4Icon.textContent = '✨';
      this.step4Text.textContent = 'അടിപൊളി! കൈ നല്ല വൃത്തിയാണല്ലോ! ✨';
      this.setStepActive(this.step4, this.step4Status, '✨ അടിപൊളി!');
      this.character.speak(`
        <div class="speech-title"><span class="speech-officer-icon">✨</span> അമ്മച്ചിക്ക് സന്തോഷമായി!</div>
        <div class="speech-text">അടിപൊളി! കൈ നല്ല വൃത്തിയാണല്ലോ! ✨</div>
        <div class="speech-sub">Spotless clean! Ammachi is super proud of you!</div>
      `);
      sound.speakMalayalam('അടിപൊളി! കൈ നല്ല വൃത്തിയാണല്ലോ!');
    }

    await this.delay(1400);
    this.setStepDone(this.step4, this.step4Status, '👵 വിധി തയ്യാർ!');
    this.setScanProgress(100);
    await this.delay(350);

    // Render Verdict Screen
    this.displayResult(result);
  }

  resetScanningSteps() {
    [this.step1, this.step2, this.step3, this.step4].forEach(step => {
      step.classList.remove('active', 'done');
    });
    this.step1Status.textContent = '⏳';
    this.step2Status.textContent = '⏸️';
    this.step3Status.textContent = '⏸️';
    this.step4Status.textContent = '⏸️';
    this.step4Icon.textContent = '👵';
    this.step4Text.textContent = 'Ammachi verdict parayatte...';
    this.setScanProgress(0);
  }

  setStepActive(stepEl, statusEl, statusText) {
    stepEl.classList.add('active');
    statusEl.textContent = statusText;
  }

  setStepDone(stepEl, statusEl, statusText) {
    stepEl.classList.remove('active');
    stepEl.classList.add('done');
    statusEl.textContent = statusText;
  }

  setScanProgress(pct) {
    this.scanProgress.style.width = `${pct}%`;
    this.scanPercentText.textContent = `${pct}%`;
  }

  // ==========================================================================
  // DISPLAY VERDICT (AMMACHI + ANIME CREATURE)
  // ==========================================================================
  displayResult(result) {
    this.scanningStage.classList.add('hidden');
    this.resultStage.classList.remove('hidden');

    const isClean = result.isClean;

    // Both Ammachi and the Anime Creature react dynamically!
    this.character.setMood(result.characterMood);
    this.animeCreature.setMood(result.animeMood);

    if (!isClean) {
      // 1. DIRTY HAND VERDICT
      this.resultStage.className = 'main-stage-card comic-card result-card card-dirty';

      this.resultBadge.className = 'result-status-badge badge-dirty';
      this.badgeIcon.textContent = '🧼😭';
      this.badgeTitle.textContent = 'DIRTY HAND DETECTED';

      this.resultPropsBanner.className = 'result-props-banner banner-dirty';
      this.resultPropsBanner.innerHTML = `
        <span class="prop-item prop-1">🧼</span>
        <span class="prop-item prop-2">🚿</span>
        <span class="prop-item prop-3">🪣</span>
        <span class="prop-item prop-4">🧽</span>
      `;

      this.verdictMalayalam.className = 'verdict-malayalam-heading verdict-dirty-text';
      this.verdictMalayalam.textContent = result.malayalamMessage; // “ഒന്ന് പോയി കുളിക്കൂ 😭😂🚿”
      this.verdictEnglish.textContent = result.subtitleReaction;   // “അയ്യോ... സോപ്പ് എവിടെ? 😭”

      this.scoreCategory.textContent = result.tierComment; // e.g. “Bro… soap use cheyyu 😭🧼”
      this.scoreTagline.textContent = 'അമ്മച്ചി ഞെട്ടി, കുട്ടുസൻ തലകറങ്ങി വീണു! 😵‍💫';
      this.roastCommentary.textContent = result.tierComment;

      this.character.speak(`
        <div class="speech-title"><span class="speech-officer-icon">👵</span> അമ്മച്ചി വിധി:</div>
        <div class="speech-text">ഒന്ന് പോയി കുളിക്കൂ! 😭😂🚿</div>
        <div class="speech-sub">“അയ്യോ... സോപ്പ് എവിടെ? 😭” • കുട്ടുസൻ തലകറങ്ങി!</div>
      `);

      sound.playDirtyBuzzer();
      this.particles.celebrateDirty();

      // Speak Ammachi's Malayalam voice: “ഒന്ന് പോയി കുളിക്കൂ!”
      sound.speakMalayalam('ഒന്ന് പോയി കുളിക്കൂ!');

    } else {
      // 2. CLEAN HAND VERDICT
      this.resultStage.className = 'main-stage-card comic-card result-card';

      this.resultBadge.className = 'result-status-badge badge-clean';
      this.badgeIcon.textContent = '✨🏆';
      this.badgeTitle.textContent = 'CLEAN HAND VERIFIED';

      this.resultPropsBanner.className = 'result-props-banner banner-clean';
      this.resultPropsBanner.innerHTML = `
        <span class="prop-item prop-1">✨</span>
        <span class="prop-item prop-2">🏆</span>
        <span class="prop-item prop-3">🌸</span>
        <span class="prop-item prop-4">💎</span>
      `;

      this.verdictMalayalam.className = 'verdict-malayalam-heading verdict-clean-text';
      this.verdictMalayalam.textContent = result.malayalamMessage; // “നീ നല്ല കുട്ടിയാണ് 😌✨”
      this.verdictEnglish.textContent = result.subtitleReaction;   // “അടിപൊളി! അമ്മച്ചിക്ക് അഭിമാനം! 😂❤️”

      this.scoreCategory.textContent = result.tierComment; // e.g. “Nalla kutti! ✨”
      this.scoreTagline.textContent = 'അമ്മച്ചിയും കുട്ടുസനും സല്യൂട്ട് നൽകുന്നു! 🫡✨';
      this.roastCommentary.textContent = `${result.tierComment} • ${result.subtitleReaction}`;

      this.character.speak(`
        <div class="speech-title"><span class="speech-officer-icon">👵</span> അമ്മച്ചി വിധി:</div>
        <div class="speech-text">നീ നല്ല കുട്ടിയാണ്! 😌✨</div>
        <div class="speech-sub">“അടിപൊളി! അമ്മച്ചിക്ക് അഭിമാനം! 😂❤️”</div>
      `);

      sound.playCleanFanfare();
      this.particles.celebrateClean();

      // Speak Ammachi's Malayalam voice: “നീ നല്ല കുട്ടിയാണ്!”
      sound.speakMalayalam('നീ നല്ല കുട്ടിയാണ്!');
    }

    // Animate score gauge
    this.animateScoreMeter(result.score, isClean);

    // Metrics
    this.valNails.textContent = `${result.metrics.nailHygiene}%`;
    this.valMud.textContent = `${result.metrics.mudIndex}%`;
    this.valRating.textContent = result.metrics.ammachiRating;
  }

  animateScoreMeter(targetScore, isClean) {
    const circumference = 314.159;
    this.meterFill.style.stroke = isClean ? '#06D6A0' : '#EF476F';

    let current = 0;
    const duration = 1000;
    const startTime = performance.now();

    const updateScore = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / duration);
      current = Math.floor(progress * targetScore);
      this.scoreNumber.textContent = current;

      const offset = circumference - (current / 100) * circumference;
      this.meterFill.style.strokeDashoffset = offset;

      if (progress < 1) {
        requestAnimationFrame(updateScore);
      } else {
        this.scoreNumber.textContent = targetScore;
      }
    };
    requestAnimationFrame(updateScore);
  }

  // ==========================================================================
  // RESET, SHARE, VOICE
  // ==========================================================================
  resetToCheckAgain() {
    sound.playPop();
    this.particles.stop();
    this.resultStage.classList.add('hidden');
    this.scanningStage.classList.add('hidden');
    this.inputStage.classList.remove('hidden');
    this.uploadArea.classList.remove('hidden');
    this.fileInput.value = '';

    this.character.setMood('idle', `
      <div class="speech-title"><span class="speech-officer-icon">👵</span> അമ്മച്ചി:</div>
      <div class="speech-text">കൈ ഒന്ന് കാണിച്ചേ... 😂</div>
      <div class="speech-sub">"Show your hand to Ammachi!"</div>
    `);
    this.animeCreature.setMood('idle');
    sound.speakMalayalam('കൈ ഒന്ന് കാണിച്ചേ');
  }

  speakCurrentVerdict() {
    sound.playPop();
    if (!this.currentResult) return;
    sound.speakMalayalam(this.currentResult.voiceMessage);
  }

  async handleShare() {
    sound.playPop();
    if (!this.currentResult || !this.currentImageDataUrl) return;

    this.shareResultBtn.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">ഉണ്ടാക്കുന്നു...</span>';

    try {
      const cardCanvas = await ShareCardGenerator.generateCard(
        this.currentResult,
        this.currentImageDataUrl
      );
      await ShareCardGenerator.shareCard(cardCanvas, this.currentResult);
    } catch (err) {
      console.warn('Share error:', err);
    } finally {
      this.shareResultBtn.innerHTML = '<span class="btn-icon">📤</span><span class="btn-text">Share Result (പങ്കിടൂ)</span>';
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.kaiApp = new KaiApp();
});
