/**
 * 🖐️ Kai Onnu Kaattikke! 😂 - Frontend Controller
 * Kerala Aesthetic Cartoon Edition starring Ammachi with magnifying glass
 * Handles Webcam, Image Upload, Flask /analyze fetch, Malayalam TTS, & Audio FX
 */

// Application State
const state = {
  selectedImageBase64: null,
  selectedFile: null,
  demoMode: null,
  isCameraActive: false,
  stream: null,
  facingMode: 'user',
  soundEnabled: true,
  currentResult: null
};

// DOM References
const elements = {
  // Main Panel Step Containers
  panelInputState: document.getElementById('panelInputState'),
  panelScanningState: document.getElementById('panelScanningState'),
  panelResultState: document.getElementById('panelResultState'),

  // Preview Box States
  dashedPreviewBox: document.getElementById('dashedPreviewBox'),
  emptyPlaceholder: document.getElementById('emptyPlaceholder'),
  activePreviewWrap: document.getElementById('activePreviewWrap'),
  previewImage: document.getElementById('previewImage'),
  scanLaser: document.getElementById('scanLaser'),

  // Ammachi Character & Speech
  grandmaFigureWrap: document.getElementById('grandmaFigureWrap'),
  grandmaMood: document.getElementById('grandmaMood'),
  speechSpeaker: document.getElementById('speechSpeaker'),
  speechText: document.getElementById('speechText'),
  speechTrans: document.getElementById('speechTrans'),

  // Buttons
  openCameraBtn: document.getElementById('openCameraBtn'),
  triggerUploadBtn: document.getElementById('triggerUploadBtn'),
  fileInput: document.getElementById('fileInput'),
  demoCleanBtn: document.getElementById('demoCleanBtn'),
  demoDirtyBtn: document.getElementById('demoDirtyBtn'),
  analyzeBtn: document.getElementById('analyzeBtn'),
  retakeBtn: document.getElementById('retakeBtn'),
  checkAgainBtn: document.getElementById('checkAgainBtn'),
  shareResultBtn: document.getElementById('shareResultBtn'),
  replayVoiceBtn: document.getElementById('replayVoiceBtn'),
  soundToggleBtn: document.getElementById('soundToggleBtn'),
  soundIcon: document.getElementById('soundIcon'),

  // Camera Modal
  cameraModal: document.getElementById('cameraModal'),
  webcamVideo: document.getElementById('webcamVideo'),
  captureBtn: document.getElementById('captureBtn'),
  flipCameraBtn: document.getElementById('flipCameraBtn'),
  closeCameraBtn: document.getElementById('closeCameraBtn'),
  cancelCameraBtn: document.getElementById('cancelCameraBtn'),

  // Scanning Stepper
  scanStep1: document.getElementById('scanStep1'),
  scanStep2: document.getElementById('scanStep2'),
  scanStep3: document.getElementById('scanStep3'),
  scanHumorText: document.getElementById('scanHumorText'),

  // Verdict & Results
  resultBanner: document.getElementById('resultBanner'),
  verdictTag: document.getElementById('verdictTag'),
  verdictMalayalam: document.getElementById('verdictMalayalam'),
  verdictEnglish: document.getElementById('verdictEnglish'),
  scoreNumber: document.getElementById('scoreNumber'),
  scoreMeterFill: document.getElementById('scoreMeterFill'),
  scoreComment: document.getElementById('scoreComment'),

  // FX & Toast
  fxCanvas: document.getElementById('fxCanvas'),
  toast: document.getElementById('toast')
};

/* ==========================================================================
   Sound Synthesis & Malayalam Audio Engine
   ========================================================================== */

let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSound(type) {
  if (!state.soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  if (type === 'beep') {
    // Gentle scanner blip
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(550, now);
    osc.frequency.exponentialRampToValueAtTime(1050, now + 0.12);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  } else if (type === 'clean') {
    // Cheerful triumphant Kerala brass bell / chime
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      gain.gain.setValueAtTime(0.2, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.35);
    });
  } else if (type === 'dirty') {
    // Funny sliding disappointed trombone whistle
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.55);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.55);
  }
}

// Malayalam Speech Synthesis (Web Speech API)
function speakMalayalam(text) {
  if (!state.soundEnabled || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.15;

    const voices = window.speechSynthesis.getVoices();
    const mlVoice = voices.find(v => v.lang.includes('ml') || v.lang.includes('ML') || v.name.toLowerCase().includes('malayalam'));
    if (mlVoice) {
      utterance.voice = mlVoice;
      utterance.lang = mlVoice.lang;
    } else {
      utterance.lang = 'ml-IN';
    }
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}

/* ==========================================================================
   Confetti & Festive Celebration FX
   ========================================================================== */

let confettiParticles = [];
let animFrameId = null;

function triggerConfetti() {
  const canvas = elements.fxCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  confettiParticles = [];
  const colors = ['#f97316', '#22c55e', '#38bdf8', '#facc15', '#ec4899', '#d97706'];

  for (let i = 0; i < 85; i++) {
    confettiParticles.push({
      x: canvas.width * 0.5 + (Math.random() - 0.5) * 220,
      y: canvas.height * 0.35 + (Math.random() - 0.5) * 120,
      vx: (Math.random() - 0.5) * 11,
      vy: (Math.random() - 0.8) * 13,
      size: Math.random() * 8 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8,
      alpha: 1
    });
  }

  if (animFrameId) cancelAnimationFrame(animFrameId);

  function renderParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    confettiParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.32; // gentle gravity
      p.rotation += p.rotSpeed;
      p.alpha -= 0.009;

      if (p.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (alive) {
      animFrameId = requestAnimationFrame(renderParticles);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  renderParticles();
}

/* ==========================================================================
   Toast & Ammachi Emotional States
   ========================================================================== */

function showToast(msg) {
  const toast = elements.toast;
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 2600);
}

function setAmmachiMood(mood) {
  elements.grandmaFigureWrap.classList.remove('shake-anim', 'celebrate-anim');

  if (mood === 'idle') {
    elements.grandmaMood.textContent = '🔍';
    elements.speechSpeaker.textContent = '👵 അമ്മച്ചി പറയുന്നു (Ammachi):';
    elements.speechText.textContent = '“കൈ ഒന്ന് കാണിച്ചേ... നോക്കട്ടെ!”';
    elements.speechTrans.textContent = '“Show your hand child... let me check!”';
  } else if (mood === 'ready') {
    elements.grandmaMood.textContent = '🧐';
    elements.speechSpeaker.textContent = '👵 അമ്മച്ചി നോക്കുന്നു (Inspecting):';
    elements.speechText.textContent = '“കൈ ഇവിടെ വെച്ചോളൂ... ഭൂതക്കണ്ണാടി തയ്യാറാണ്!”';
    elements.speechTrans.textContent = '“Hand in place! Magnifying glass ready to check!”';
  } else if (mood === 'scanning') {
    elements.grandmaMood.textContent = '🔍';
    elements.speechSpeaker.textContent = '👵 സൂക്ഷ്മ പരിശോധന (Inspecting):';
    elements.speechText.textContent = '“നോക്കട്ടെ... നഖം ഒന്ന് പരിശോധിക്കട്ടെ...!”';
    elements.speechTrans.textContent = '“Let me see... inspecting fingernails closely!”';
  } else if (mood === 'dirty') {
    elements.grandmaFigureWrap.classList.add('shake-anim');
    elements.grandmaMood.textContent = '😡';
    elements.speechSpeaker.textContent = '👵 അമ്മച്ചി ദേഷ്യത്തിൽ (Ammachi Shocked):';
    elements.speechText.textContent = '“ഒന്ന് പോയി കുളിക്കൂ! കൈ നിറയെ അഴുക്കാണല്ലോ!” 🧼😭';
    elements.speechTrans.textContent = '“Go take a bath! Full of dirt and grime!”';
  } else if (mood === 'clean') {
    elements.grandmaFigureWrap.classList.add('celebrate-anim');
    elements.grandmaMood.textContent = '😌';
    elements.speechSpeaker.textContent = '👵 അമ്മച്ചി അഭിമാനത്തോടെ (Ammachi Proud):';
    elements.speechText.textContent = '“നീ നല്ല കുട്ടിയാണ്! കൈ നല്ല വൃത്തിയാണല്ലോ!” 😌✨';
    elements.speechTrans.textContent = '“You are a good child! Sparkling clean hands!”';
  }
}

function showPanelStep(step) {
  elements.panelInputState.classList.add('hidden');
  elements.panelScanningState.classList.add('hidden');
  elements.panelResultState.classList.add('hidden');

  if (step === 'input') {
    elements.panelInputState.classList.remove('hidden');
    if (!state.selectedImageBase64) {
      elements.emptyPlaceholder.classList.remove('hidden');
      elements.activePreviewWrap.classList.add('hidden');
      setAmmachiMood('idle');
    } else {
      elements.emptyPlaceholder.classList.add('hidden');
      elements.activePreviewWrap.classList.remove('hidden');
      setAmmachiMood('ready');
    }
  } else if (step === 'scanning') {
    elements.panelScanningState.classList.remove('hidden');
    setAmmachiMood('scanning');
  } else if (step === 'result') {
    elements.panelResultState.classList.remove('hidden');
  }
}

/* ==========================================================================
   Camera Viewfinder Controls
   ========================================================================== */

async function startCamera() {
  elements.cameraModal.classList.remove('hidden');
  try {
    if (state.stream) {
      state.stream.getTracks().forEach(track => track.stop());
    }
    const constraints = {
      video: {
        facingMode: state.facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };
    state.stream = await navigator.mediaDevices.getUserMedia(constraints);
    elements.webcamVideo.srcObject = state.stream;
    state.isCameraActive = true;
  } catch (err) {
    console.error('Camera access error:', err);
    elements.cameraModal.classList.add('hidden');
    showToast('⚠️ Camera access denied or unavailable.');
    elements.fileInput.click();
  }
}

function stopCamera() {
  if (state.stream) {
    state.stream.getTracks().forEach(track => track.stop());
    state.stream = null;
  }
  state.isCameraActive = false;
  elements.cameraModal.classList.add('hidden');
}

function captureCameraFrame() {
  const video = elements.webcamVideo;
  if (!video.videoWidth) return;

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const base64 = canvas.toDataURL('image/jpeg', 0.9);
  state.selectedImageBase64 = base64;
  state.selectedFile = null;
  state.demoMode = null;

  stopCamera();
  displayPreview(base64);
  playSound('beep');
  speakMalayalam('കൈ ഒന്ന് കാണിക്കൂ...');
}

/* ==========================================================================
   Image Upload & File Selection
   ========================================================================== */

function handleFileSelected(file) {
  if (!file) return;
  state.selectedFile = file;
  state.demoMode = null;

  const reader = new FileReader();
  reader.onload = (e) => {
    state.selectedImageBase64 = e.target.result;
    displayPreview(e.target.result);
    playSound('beep');
    speakMalayalam('കൈ ഒന്ന് കാണിക്കൂ...');
  };
  reader.readAsDataURL(file);
}

function displayPreview(src) {
  elements.previewImage.src = src;
  elements.emptyPlaceholder.classList.add('hidden');
  elements.activePreviewWrap.classList.remove('hidden');
  setAmmachiMood('ready');
}

// Quick Hand Demos (for rapid testing without camera)
function loadDemoHand(type) {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#faf5ea';
  ctx.fillRect(0, 0, 400, 400);

  // Hand silhouette
  ctx.fillStyle = '#f5c6a5';
  ctx.beginPath();
  ctx.roundRect(120, 160, 160, 180, [40, 40, 20, 20]);
  ctx.fill();

  // Fingers
  const fingerPositions = [130, 165, 205, 245];
  fingerPositions.forEach(x => {
    ctx.beginPath();
    ctx.roundRect(x, 70, 30, 120, 15);
    ctx.fill();
    // Nails
    ctx.fillStyle = type === 'dirty' ? '#452c16' : '#fff1f2';
    ctx.beginPath();
    ctx.roundRect(x + 4, 75, 22, 28, 8);
    ctx.fill();
    ctx.fillStyle = '#f5c6a5';
  });

  // Thumb
  ctx.beginPath();
  ctx.roundRect(85, 190, 45, 90, 20);
  ctx.fill();

  if (type === 'dirty') {
    ctx.fillStyle = '#4a2e16';
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      const dx = 100 + Math.random() * 200;
      const dy = 80 + Math.random() * 220;
      const r = Math.random() * 9 + 3;
      ctx.arc(dx, dy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const base64 = canvas.toDataURL('image/jpeg', 0.9);
  state.selectedImageBase64 = base64;
  state.selectedFile = null;
  state.demoMode = type;

  displayPreview(base64);
  playSound('beep');
}

/* ==========================================================================
   Backend API Communication & 3-Step Scanning Sequence
   ========================================================================== */

async function startAnalysisFlow() {
  if (!state.selectedImageBase64 && !state.selectedFile) {
    showToast('⚠️ Please take a picture or upload an image first!');
    return;
  }

  showPanelStep('scanning');
  elements.scanLaser.classList.remove('hidden');

  // Reset steps
  [elements.scanStep1, elements.scanStep2, elements.scanStep3].forEach(s => {
    s.className = 'scan-step-box';
    const icon = s.querySelector('.step-status-icon') || s.querySelector('.step-indicator');
    if (icon) icon.textContent = '⏳';
  });

  // Step 1: 🔍 Kai nokkunnu...
  elements.scanStep1.classList.add('active');
  elements.scanHumorText.textContent = '🔍 കൈ ഒന്ന് സൂക്ഷിച്ചു നോക്കുന്നു... (Kai nokkunnu)';
  playSound('beep');
  speakMalayalam('കൈ ഒന്ന് കാണിക്കൂ...');

  // Start backend fetch in parallel
  const fetchPromise = executeBackendFetch();

  // Stage 1 -> 2 (750ms)
  await new Promise(r => setTimeout(r, 750));
  elements.scanStep1.classList.remove('active');
  elements.scanStep1.classList.add('done');
  const icon1 = elements.scanStep1.querySelector('.step-status-icon') || elements.scanStep1.querySelector('.step-indicator');
  if (icon1) icon1.textContent = '✅';

  // Step 2: 🕵️ Nails check cheyyunnu...
  elements.scanStep2.classList.add('active');
  elements.scanHumorText.textContent = '🕵️ നഖങ്ങളിൽ അഴുക്കുണ്ടോ എന്ന് ചികയുന്നു... (Nails check cheyyunnu)';
  playSound('beep');
  speakMalayalam('നഖം ഒന്ന് പരിശോധിക്കട്ടെ...');

  // Stage 2 -> 3 (750ms)
  await new Promise(r => setTimeout(r, 750));
  elements.scanStep2.classList.remove('active');
  elements.scanStep2.classList.add('done');
  const icon2 = elements.scanStep2.querySelector('.step-status-icon') || elements.scanStep2.querySelector('.step-indicator');
  if (icon2) icon2.textContent = '✅';

  // Step 3: 👮 Verdict ready aakkunnu...
  elements.scanStep3.classList.add('active');
  elements.scanHumorText.textContent = '👮 അമ്മച്ചിയുടെ അന്തിമ വിധി വരുന്നു... (Verdict ready aakkunnu)';
  playSound('beep');
  speakMalayalam('നോക്കട്ടെ...');

  // Await results
  const [data] = await Promise.all([
    fetchPromise,
    new Promise(r => setTimeout(r, 700))
  ]);

  elements.scanStep3.classList.remove('active');
  elements.scanStep3.classList.add('done');
  const icon3 = elements.scanStep3.querySelector('.step-status-icon') || elements.scanStep3.querySelector('.step-indicator');
  if (icon3) icon3.textContent = '✅';
  elements.scanLaser.classList.add('hidden');

  renderVerdict(data);
}

async function executeBackendFetch() {
  try {
    let response;

    if (state.selectedFile) {
      const formData = new FormData();
      formData.append('file', state.selectedFile);
      if (state.demoMode) formData.append('demo_mode', state.demoMode);
      response = await fetch('/analyze', {
        method: 'POST',
        body: formData
      });
    } else {
      const payload = { image: state.selectedImageBase64 };
      if (state.demoMode) payload.demo_mode = state.demoMode;
      response = await fetch('/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    if (!response.ok) {
      throw new Error(`Server status ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.warn('Backend fetch fallback:', err);
    const isClean = state.demoMode !== 'dirty';
    return {
      clean: isClean,
      score: isClean ? 95 : 25,
      malayalam_message: isClean ? 'നീ നല്ല കുട്ടിയാണ് 😌✨' : 'ഒന്ന് പോയി കുളിക്കൂ 😭😂',
      english_message: isClean ? 'You are a good child!' : 'Go take a bath!',
      comment: isClean ? 'Nalla kutti! ✨' : 'Bro… soap use cheyyu 😭'
    };
  }
}

/* ==========================================================================
   Render Verdict Screen
   ========================================================================== */

function renderVerdict(result) {
  state.currentResult = result;
  showPanelStep('result');

  const { clean, score, malayalam_message, english_message, comment } = result;

  // Banner
  elements.resultBanner.className = 'verdict-display-banner ' + (clean ? 'banner-clean' : 'banner-dirty');
  elements.verdictTag.textContent = clean ? '✨ CLEAN HAND VERDICT' : '⚠️ DIRTY HAND DETECTED';
  elements.verdictMalayalam.textContent = malayalam_message;
  elements.verdictEnglish.textContent = english_message;

  // Score
  elements.scoreNumber.textContent = `${score}/100`;
  elements.scoreMeterFill.style.width = '0%';
  setTimeout(() => {
    elements.scoreMeterFill.style.width = `${Math.min(100, Math.max(0, score))}%`;
  }, 60);

  // Comment
  elements.scoreComment.textContent = `“${comment}”`;

  // Reactions
  if (clean) {
    setAmmachiMood('clean');
    playSound('clean');
    triggerConfetti();
    speakMalayalam('നീ നല്ല കുട്ടിയാണ്!');
  } else {
    setAmmachiMood('dirty');
    playSound('dirty');
    speakMalayalam('ഒന്ന് പോയി കുളിക്കൂ!');
  }
}

/* ==========================================================================
   Event Listeners & Bootstrapping
   ========================================================================== */

function setupEventListeners() {
  // Sound toggle button (top-right)
  elements.soundToggleBtn.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    elements.soundIcon.textContent = state.soundEnabled ? '🔊' : '🔇';
    showToast(state.soundEnabled ? 'Sound Enabled 🔊' : 'Sound Muted 🔇');
    if (state.soundEnabled) playSound('beep');
  });

  // Open camera
  elements.openCameraBtn.addEventListener('click', startCamera);
  elements.closeCameraBtn.addEventListener('click', stopCamera);
  elements.cancelCameraBtn.addEventListener('click', stopCamera);
  elements.flipCameraBtn.addEventListener('click', () => {
    state.facingMode = state.facingMode === 'user' ? 'environment' : 'user';
    startCamera();
  });
  elements.captureBtn.addEventListener('click', captureCameraFrame);

  // Upload trigger
  elements.triggerUploadBtn.addEventListener('click', () => {
    elements.fileInput.value = '';
    elements.fileInput.click();
  });

  elements.fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  });

  // Quick hand demo buttons
  elements.demoCleanBtn.addEventListener('click', () => loadDemoHand('clean'));
  elements.demoDirtyBtn.addEventListener('click', () => loadDemoHand('dirty'));

  // Analyze button
  elements.analyzeBtn.addEventListener('click', startAnalysisFlow);

  // Retake button
  elements.retakeBtn.addEventListener('click', () => {
    state.selectedImageBase64 = null;
    state.selectedFile = null;
    state.demoMode = null;
    showPanelStep('input');
  });

  // Check Again
  elements.checkAgainBtn.addEventListener('click', () => {
    state.selectedImageBase64 = null;
    state.selectedFile = null;
    state.demoMode = null;
    showPanelStep('input');
  });

  // Replay Ammachi Voice
  elements.replayVoiceBtn.addEventListener('click', () => {
    if (state.currentResult) {
      if (state.currentResult.clean) {
        playSound('clean');
        speakMalayalam('നീ നല്ല കുട്ടിയാണ്!');
      } else {
        playSound('dirty');
        speakMalayalam('ഒന്ന് പോയി കുളിക്കൂ!');
      }
    }
  });

  // Share result
  elements.shareResultBtn.addEventListener('click', async () => {
    if (!state.currentResult) return;
    const shareText = `🖐️ Kai Onnu Kaattikke! 😂\n\n` +
      `Ammachi's Verdict: ${state.currentResult.malayalam_message}\n` +
      `("${state.currentResult.english_message}")\n` +
      `Cleanliness Score: ${state.currentResult.score}/100\n` +
      `Comment: ${state.currentResult.comment}\n\n` +
      `Check your hand with Ammachi! 🧼`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: '🖐️ Kai Onnu Kaattikke! 😂',
          text: shareText,
          url: window.location.href
        });
        return;
      } catch (err) {
        // user cancelled or fallback
      }
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareText);
        showToast('📋 Result copied to clipboard! 😂');
      } catch (err) {
        showToast('Could not copy to clipboard.');
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  showPanelStep('input');
  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }
});
