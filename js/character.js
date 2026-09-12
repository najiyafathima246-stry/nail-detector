/**
 * Kai Onnu Kaattikke! - Animated Cartoon Characters:
 * 1. "Ammachi" - Funny Malayalam Grandmother (Silver Hair Bun, Spectacles, Kasavu Saree)
 * 2. "Kuttusan" - Expressive Anime Reaction Creature (Chibi Mascot)
 */

export class CharacterJudge {
  constructor(containerElement, speechElement) {
    this.container = containerElement;
    this.speechElement = speechElement;
    this.currentMood = 'idle';
    this.render();
  }

  setMood(mood, dialogue = null) {
    this.currentMood = mood;
    this.render();
    if (dialogue) {
      this.speak(dialogue);
    }
  }

  speak(text) {
    if (this.speechElement) {
      this.speechElement.innerHTML = text;
      this.speechElement.classList.remove('pop-anim');
      void this.speechElement.offsetWidth; // trigger reflow
      this.speechElement.classList.add('pop-anim');
    }
  }

  render() {
    let svgContent = '';

    switch (this.currentMood) {
      case 'scanning':
        svgContent = this.getScanningSvg();
        break;
      case 'dirty':
        svgContent = this.getDirtySvg();
        break;
      case 'clean':
        svgContent = this.getCleanSvg();
        break;
      case 'idle':
      default:
        svgContent = this.getIdleSvg();
        break;
    }

    this.container.innerHTML = svgContent;
  }

  // ==========================================================================
  // AMMACHI - IDLE: Smiling warmly over spectacles, waving hand
  // ==========================================================================
  getIdleSvg() {
    return `
      <svg viewBox="0 0 200 200" class="character-svg ammachi-idle" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFD6A5" />
            <stop offset="100%" stop-color="#FFB385" />
          </linearGradient>
          <linearGradient id="kasavuGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FCFBF7" />
            <stop offset="100%" stop-color="#EFE8D8" />
          </linearGradient>
        </defs>

        <!-- Traditional Kerala Kasavu Saree Body -->
        <path d="M 40 170 Q 100 145 160 170 L 175 200 L 25 200 Z" fill="url(#kasavuGrad)" stroke="#1E1B4B" stroke-width="3" />
        <!-- Golden Kasavu Border (Kara) -->
        <path d="M 48 174 Q 100 152 152 174" stroke="#FFB703" stroke-width="7" fill="none" />
        <path d="M 50 174 Q 100 152 150 174" stroke="#FB8500" stroke-width="2" fill="none" stroke-dasharray="3,3" />

        <!-- Gold Necklace (Thali / Mala) -->
        <path d="M 82 165 Q 100 182 118 165" stroke="#FFB703" stroke-width="4" fill="none" />
        <circle cx="100" cy="180" r="4" fill="#FFB703" stroke="#1E1B4B" stroke-width="1.5" />

        <!-- Grey Hair Bun (Kondai) on Side with Jasmine Flowers (Mullappoo) 🌸 -->
        <g id="hairBun">
          <circle cx="152" cy="78" r="24" fill="#64748B" stroke="#1E1B4B" stroke-width="3" />
          <circle cx="156" cy="74" r="18" fill="#94A3B8" />
          <!-- Jasmine flowers garland (white with yellow centers) -->
          <circle cx="140" cy="62" r="5" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="1.5" />
          <circle cx="150" cy="56" r="5" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="1.5" />
          <circle cx="162" cy="58" r="5" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="1.5" />
          <circle cx="170" cy="68" r="5" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="1.5" />
          <circle cx="172" cy="80" r="5" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="1.5" />
          <circle cx="166" cy="92" r="5" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="1.5" />
        </g>

        <!-- Ears with traditional gold stud earrings (Kunukku) -->
        <circle cx="44" cy="114" r="13" fill="#FFB385" stroke="#1E1B4B" stroke-width="2.5" />
        <circle cx="44" cy="116" r="4.5" fill="#FFB703" stroke="#1E1B4B" stroke-width="1.5" />
        <circle cx="156" cy="114" r="13" fill="#FFB385" stroke="#1E1B4B" stroke-width="2.5" />
        <circle cx="156" cy="116" r="4.5" fill="#FFB703" stroke="#1E1B4B" stroke-width="1.5" />

        <!-- Ammachi Head / Face -->
        <ellipse cx="100" cy="115" rx="56" ry="56" fill="url(#skinGrad)" stroke="#1E1B4B" stroke-width="3.5" />

        <!-- Front Grey Hair parted in middle with waves -->
        <path d="M 46 95 C 50 48, 150 48, 154 95 C 135 68, 115 62, 100 68 C 85 62, 65 68, 46 95 Z" fill="#64748B" stroke="#1E1B4B" stroke-width="3" />
        <path d="M 75 66 C 85 75, 95 82, 100 82 C 105 82, 115 75, 125 66" stroke="#94A3B8" stroke-width="2.5" fill="none" />

        <!-- Red Bindi / Chandana Kuri on Forehead -->
        <circle cx="100" cy="84" r="4" fill="#D90429" />
        <path d="M 92 84 L 108 84" stroke="#FFEAA7" stroke-width="3" stroke-linecap="round" />

        <!-- Cute Grandma Eyebrows with grey streaks -->
        <path d="M 66 94 Q 78 88 88 95" stroke="#475569" stroke-width="4" stroke-linecap="round" fill="none" />
        <path d="M 112 95 Q 122 88 134 94" stroke="#475569" stroke-width="4" stroke-linecap="round" fill="none" />

        <!-- Laugh Lines / Wrinkles -->
        <path d="M 58 108 Q 63 115 58 122" stroke="#E07A5F" stroke-width="2" stroke-linecap="round" fill="none" />
        <path d="M 142 108 Q 137 115 142 122" stroke="#E07A5F" stroke-width="2" stroke-linecap="round" fill="none" />

        <!-- Big Expressive Eyes looking over spectacles -->
        <circle cx="76" cy="106" r="10" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="2.5" />
        <circle cx="78" cy="106" r="5" fill="#1E1B4B" />
        <circle cx="80" cy="104" r="2" fill="#FFFFFF" />

        <circle cx="124" cy="106" r="10" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="2.5" />
        <circle cx="126" cy="106" r="5" fill="#1E1B4B" />
        <circle cx="128" cy="104" r="2" fill="#FFFFFF" />

        <!-- Round Silver Spectacles perched on nose -->
        <g id="spectacles">
          <circle cx="76" cy="112" r="17" fill="rgba(255,255,255,0.4)" stroke="#64748B" stroke-width="3" />
          <circle cx="124" cy="112" r="17" fill="rgba(255,255,255,0.4)" stroke="#64748B" stroke-width="3" />
          <!-- Bridge over nose -->
          <path d="M 93 110 Q 100 106 107 110" stroke="#64748B" stroke-width="3.5" fill="none" />
          <!-- Glass glare -->
          <line x1="68" y1="104" x2="74" y2="114" stroke="#FFFFFF" stroke-width="2" />
          <line x1="116" y1="104" x2="122" y2="114" stroke="#FFFFFF" stroke-width="2" />
        </g>

        <!-- Cute Round Nose -->
        <ellipse cx="100" cy="120" rx="7" ry="6" fill="#FFA570" stroke="#1E1B4B" stroke-width="2" />

        <!-- Warm Grandma Smile with Rosy Cheeks -->
        <circle cx="66" cy="125" r="7" fill="#FF85A1" opacity="0.6" />
        <circle cx="134" cy="125" r="7" fill="#FF85A1" opacity="0.6" />
        <path d="M 85 136 Q 100 152 115 136" stroke="#991B1B" stroke-width="3.5" stroke-linecap="round" fill="none" />

        <!-- Waving Grandma Hand calling "കൈ ഒന്ന് കാണിച്ചേ..." -->
        <g transform="translate(150, 126)">
          <circle cx="12" cy="14" r="11" fill="#FFB385" stroke="#1E1B4B" stroke-width="2.5" />
          <rect x="8" y="2" width="6" height="12" rx="3" fill="#FFB385" stroke="#1E1B4B" stroke-width="2" />
          <rect x="15" y="4" width="6" height="12" rx="3" fill="#FFB385" stroke="#1E1B4B" stroke-width="2" />
        </g>
      </svg>
    `;
  }

  // ==========================================================================
  // AMMACHI - SCANNING: Squinting through huge magnifying glass
  // ==========================================================================
  getScanningSvg() {
    return `
      <svg viewBox="0 0 200 200" class="character-svg ammachi-scanning" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lensGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(255, 209, 102, 0.7)" />
            <stop offset="100%" stop-color="rgba(239, 71, 111, 0.4)" />
          </linearGradient>
        </defs>

        <!-- Kasavu Saree Body -->
        <path d="M 40 170 Q 100 145 160 170 L 175 200 L 25 200 Z" fill="#FCFBF7" stroke="#1E1B4B" stroke-width="3" />
        <path d="M 48 174 Q 100 152 152 174" stroke="#FFB703" stroke-width="7" fill="none" />

        <!-- Grey Hair Bun with Jasmine Flowers -->
        <circle cx="152" cy="78" r="24" fill="#64748B" stroke="#1E1B4B" stroke-width="3" />
        <circle cx="140" cy="62" r="5" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="1.5" />
        <circle cx="156" cy="58" r="5" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="1.5" />
        <circle cx="168" cy="70" r="5" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="1.5" />

        <!-- Ears -->
        <circle cx="44" cy="114" r="13" fill="#FFB385" stroke="#1E1B4B" stroke-width="2.5" />
        <circle cx="156" cy="114" r="13" fill="#FFB385" stroke="#1E1B4B" stroke-width="2.5" />

        <!-- Head -->
        <ellipse cx="100" cy="115" rx="56" ry="56" fill="#FFD6A5" stroke="#1E1B4B" stroke-width="3.5" />

        <!-- Front Hair -->
        <path d="M 46 95 C 50 48, 150 48, 154 95 C 135 68, 115 62, 100 68 C 85 62, 65 68, 46 95 Z" fill="#64748B" stroke="#1E1B4B" stroke-width="3" />

        <!-- Left Eye: Squinting in deep curiosity -->
        <path d="M 64 104 Q 76 96 88 104" stroke="#1E1B4B" stroke-width="5" stroke-linecap="round" fill="none" />
        <circle cx="76" cy="112" r="17" fill="rgba(255,255,255,0.4)" stroke="#64748B" stroke-width="3" />

        <!-- Right Eye: Enormous Magnifying Glass examining hand -->
        <g transform="translate(126, 106)">
          <circle cx="0" cy="0" r="32" fill="url(#lensGrad2)" stroke="#FFB703" stroke-width="5" />
          <!-- Gigantic Open Eye inside lens -->
          <circle cx="-2" cy="-2" r="15" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="2" />
          <circle cx="-1" cy="-2" r="8" fill="#1E1B4B" />
          <circle cx="1" cy="-4" r="3" fill="#FFFFFF" />
          <!-- Laser Scan Line -->
          <line x1="-30" y1="0" x2="30" y2="0" stroke="#EF476F" stroke-width="3" />
          <!-- Wooden Handle -->
          <path d="M 24 24 L 48 48" stroke="#8D6331" stroke-width="9" stroke-linecap="round" />
        </g>

        <!-- Nose -->
        <ellipse cx="98" cy="118" rx="7" ry="6" fill="#FFA570" stroke="#1E1B4B" stroke-width="2" />

        <!-- Curious 'O' Mouth: "നോക്കട്ടെ..." -->
        <circle cx="98" cy="144" r="6.5" fill="#1E1B4B" />
      </svg>
    `;
  }

  // ==========================================================================
  // AMMACHI - DIRTY: Angry/Shocked 😱, Pointing at Hand 👉, Holding Soap 🧼
  // ==========================================================================
  getDirtySvg() {
    return `
      <svg viewBox="0 0 200 200" class="character-svg ammachi-dirty" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="soapGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FF5D8F" />
            <stop offset="100%" stop-color="#EF476F" />
          </linearGradient>
          <linearGradient id="tearGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#4CC9F0" />
            <stop offset="100%" stop-color="#4361EE" />
          </linearGradient>
        </defs>

        <!-- Stink Fumes rising above head 🤢 -->
        <path d="M 45 35 Q 35 15 50 5 Q 65 0 70 20" stroke="#606C38" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.8" />
        <path d="M 155 30 Q 168 15 152 4 Q 138 0 135 18" stroke="#606C38" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.8" />

        <!-- Kasavu Saree Body -->
        <path d="M 40 170 Q 100 145 160 170 L 175 200 L 25 200 Z" fill="#FCFBF7" stroke="#1E1B4B" stroke-width="3" />
        <path d="M 48 174 Q 100 152 152 174" stroke="#EF476F" stroke-width="7" fill="none" />

        <!-- Hair Bun shaken in utter shock -->
        <g transform="translate(0, -4)">
          <circle cx="152" cy="78" r="24" fill="#64748B" stroke="#1E1B4B" stroke-width="3" />
          <circle cx="140" cy="62" r="5" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="1.5" />
          <circle cx="156" cy="58" r="5" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="1.5" />
          <circle cx="168" cy="70" r="5" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="1.5" />
        </g>

        <!-- Ears -->
        <circle cx="44" cy="114" r="13" fill="#FFB385" stroke="#1E1B4B" stroke-width="2.5" />
        <circle cx="156" cy="114" r="13" fill="#FFB385" stroke="#1E1B4B" stroke-width="2.5" />

        <!-- Head shaken in horror -->
        <ellipse cx="100" cy="115" rx="56" ry="56" fill="#FFCDB2" stroke="#1E1B4B" stroke-width="3.5" />

        <!-- Front Hair standing slightly up -->
        <path d="M 44 95 C 40 40, 160 40, 156 95 C 135 65, 115 58, 100 65 C 85 58, 65 65, 44 95 Z" fill="#64748B" stroke="#1E1B4B" stroke-width="3" />

        <!-- Shocked Brows tilted up -->
        <path d="M 60 84 L 86 96" stroke="#1E1B4B" stroke-width="5" stroke-linecap="round" />
        <path d="M 140 84 L 114 96" stroke="#1E1B4B" stroke-width="5" stroke-linecap="round" />

        <!-- Wide Shocked Eyes -->
        <circle cx="74" cy="106" r="15" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="3" />
        <circle cx="74" cy="106" r="5" fill="#1E1B4B" />
        <circle cx="126" cy="106" r="15" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="3" />
        <circle cx="126" cy="106" r="5" fill="#1E1B4B" />

        <!-- Glasses skewed in shock -->
        <g transform="rotate(-6 100 112)">
          <circle cx="74" cy="108" r="18" fill="rgba(255,255,255,0.4)" stroke="#64748B" stroke-width="3" />
          <circle cx="126" cy="108" r="18" fill="rgba(255,255,255,0.4)" stroke="#64748B" stroke-width="3" />
          <path d="M 92 106 Q 100 102 108 106" stroke="#64748B" stroke-width="3.5" fill="none" />
        </g>

        <!-- Comic Waterfall Tears 😭 -->
        <path d="M 70 118 C 65 135, 74 160, 68 185" stroke="url(#tearGrad2)" stroke-width="6" stroke-linecap="round" fill="none" />
        <path d="M 130 118 C 135 135, 126 160, 132 185" stroke="url(#tearGrad2)" stroke-width="6" stroke-linecap="round" fill="none" />

        <!-- Agonized Open Screaming Mouth: "ഒന്ന് പോയി കുളിക്കൂ!" -->
        <ellipse cx="100" cy="150" rx="19" ry="14" fill="#780000" stroke="#1E1B4B" stroke-width="2.5" />
        <ellipse cx="100" cy="157" rx="10" ry="5" fill="#D90429" />
        <path d="M 86 141 Q 100 145 114 141" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" />

        <!-- Left Hand holding big SOAP bar 🧼 out to the user -->
        <g transform="translate(12, 132)">
          <rect x="0" y="0" width="40" height="26" rx="8" fill="url(#soapGrad2)" stroke="#1E1B4B" stroke-width="2.5" />
          <text x="20" y="17" font-size="10" font-weight="900" fill="#FFFFFF" text-anchor="middle" font-family="Arial">SOAP</text>
          <!-- Bubbles -->
          <circle cx="8" cy="-5" r="4.5" fill="rgba(255,255,255,0.7)" stroke="#1E1B4B" stroke-width="1.5" />
          <circle cx="28" cy="-8" r="6" fill="rgba(255,255,255,0.8)" stroke="#1E1B4B" stroke-width="1.5" />
        </g>

        <!-- Right Hand pointing accusingly 👉 at user's hand -->
        <g transform="translate(155, 142)">
          <circle cx="10" cy="10" r="10" fill="#FFB385" stroke="#1E1B4B" stroke-width="2.5" />
          <!-- Index Finger pointing -->
          <rect x="-10" y="6" width="18" height="8" rx="3.5" fill="#FFB385" stroke="#1E1B4B" stroke-width="2" />
        </g>
      </svg>
    `;
  }

  // ==========================================================================
  // AMMACHI - CLEAN: Proud 😌, Beaming Smile, Big Thumbs-Up 👍
  // ==========================================================================
  getCleanSvg() {
    return `
      <svg viewBox="0 0 200 200" class="character-svg ammachi-clean" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cleanSaree" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FCFBF7" />
            <stop offset="100%" stop-color="#FFF3D6" />
          </linearGradient>
        </defs>

        <!-- Golden Sparkles Background ✨ -->
        <g class="sparkles">
          <path d="M 22 45 L 26 32 L 30 45 L 43 49 L 30 53 L 26 66 L 22 53 L 9 49 Z" fill="#FFD166" stroke="#1E1B4B" stroke-width="1.5" />
          <path d="M 174 45 L 177 35 L 180 45 L 190 48 L 180 51 L 177 61 L 174 51 L 164 48 Z" fill="#06D6A0" stroke="#1E1B4B" stroke-width="1.5" />
        </g>

        <!-- Kasavu Saree with Rich Golden Zari Border -->
        <path d="M 40 170 Q 100 145 160 170 L 175 200 L 25 200 Z" fill="url(#cleanSaree)" stroke="#1E1B4B" stroke-width="3" />
        <path d="M 46 172 Q 100 148 154 172" stroke="#FFB703" stroke-width="9" fill="none" />
        <path d="M 48 172 Q 100 148 152 172" stroke="#FB8500" stroke-width="3" fill="none" stroke-dasharray="4,4" />

        <!-- Sandalwood Paste & Red Tilak on Forehead -->
        <path d="M 90 78 L 110 78" stroke="#FFEAA7" stroke-width="5" stroke-linecap="round" />
        <circle cx="100" cy="78" r="3" fill="#D63031" />

        <!-- Grey Hair Bun with Full Jasmine Garland -->
        <circle cx="152" cy="78" r="24" fill="#64748B" stroke="#1E1B4B" stroke-width="3" />
        <circle cx="140" cy="62" r="6" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="1.5" />
        <circle cx="152" cy="56" r="6" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="1.5" />
        <circle cx="164" cy="60" r="6" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="1.5" />
        <circle cx="172" cy="72" r="6" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="1.5" />

        <!-- Ears with Golden Kunukku Earrings -->
        <circle cx="44" cy="114" r="13" fill="#FFB385" stroke="#1E1B4B" stroke-width="2.5" />
        <circle cx="44" cy="116" r="5" fill="#FFB703" stroke="#1E1B4B" stroke-width="1.5" />
        <circle cx="156" cy="114" r="13" fill="#FFB385" stroke="#1E1B4B" stroke-width="2.5" />
        <circle cx="156" cy="116" r="5" fill="#FFB703" stroke="#1E1B4B" stroke-width="1.5" />

        <!-- Glowing Clean Face -->
        <ellipse cx="100" cy="115" rx="56" ry="56" fill="#FFD6A5" stroke="#1E1B4B" stroke-width="3.5" />
        <!-- Front Hair -->
        <path d="M 46 95 C 50 48, 150 48, 154 95 C 135 68, 115 62, 100 68 C 85 62, 65 68, 46 95 Z" fill="#64748B" stroke="#1E1B4B" stroke-width="3" />

        <!-- Proud Spectacles with Glint -->
        <circle cx="76" cy="112" r="17" fill="rgba(255,255,255,0.4)" stroke="#FFB703" stroke-width="3.5" />
        <circle cx="124" cy="112" r="17" fill="rgba(255,255,255,0.4)" stroke="#FFB703" stroke-width="3.5" />
        <path d="M 93 110 Q 100 106 107 110" stroke="#FFB703" stroke-width="3.5" fill="none" />

        <!-- Happy Curved Smiling Eyes (^ ^) -->
        <path d="M 67 110 Q 76 100 85 110" stroke="#1E1B4B" stroke-width="4" stroke-linecap="round" fill="none" />
        <path d="M 115 110 Q 124 100 133 110" stroke="#1E1B4B" stroke-width="4" stroke-linecap="round" fill="none" />

        <!-- Nose -->
        <ellipse cx="100" cy="120" rx="7" ry="6" fill="#FFA570" stroke="#1E1B4B" stroke-width="2" />

        <!-- Radiant Proud Smile with Laugh Lines -->
        <circle cx="64" cy="124" r="8" fill="#FF758F" opacity="0.6" />
        <circle cx="136" cy="124" r="8" fill="#FF758F" opacity="0.6" />
        <path d="M 82 136 Q 100 160 118 136 Z" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="3" />

        <!-- Giant Golden Thumbs-Up 👍 -->
        <g transform="translate(142, 110)">
          <circle cx="18" cy="18" r="16" fill="#FFB385" stroke="#1E1B4B" stroke-width="2.5" />
          <rect x="13" y="-6" width="10" height="18" rx="5" fill="#FFB385" stroke="#1E1B4B" stroke-width="2" />
          <text x="18" y="24" font-size="16" text-anchor="middle">👍</text>
        </g>
      </svg>
    `;
  }
}

// ============================================================================
// ANIME CREATURE COMPONENT ("Kuttusan" - The Expressive Mascot)
// Reacts alongside Ammachi with exaggerated anime expressions!
// ============================================================================
export class AnimeCreature {
  constructor(containerElement) {
    this.container = containerElement;
    this.currentMood = 'idle';
    this.render();
  }

  setMood(mood) {
    this.currentMood = mood;
    this.render();
  }

  render() {
    let svgContent = '';
    switch (this.currentMood) {
      case 'scanning':
        svgContent = this.getScanningSvg();
        break;
      case 'dirty':
        svgContent = this.getDirtySvg();
        break;
      case 'clean':
        svgContent = this.getCleanSvg();
        break;
      case 'idle':
      default:
        svgContent = this.getIdleSvg();
        break;
    }
    if (this.container) {
      this.container.innerHTML = svgContent;
    }
  }

  // IDLE: Cute bouncy anime creature with big shiny anime eyes
  getIdleSvg() {
    return `
      <svg viewBox="0 0 120 120" class="anime-creature-svg anime-idle" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="creatureGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFD166" />
            <stop offset="100%" stop-color="#FF9E00" />
          </linearGradient>
        </defs>

        <!-- Cute Fluffy Ears -->
        <polygon points="25,45 15,10 45,28" fill="#FF9E00" stroke="#1E1B4B" stroke-width="2.5" />
        <polygon points="25,40 20,18 40,28" fill="#FF85A1" />
        <polygon points="95,45 105,10 75,28" fill="#FF9E00" stroke="#1E1B4B" stroke-width="2.5" />
        <polygon points="95,40 100,18 80,28" fill="#FF85A1" />

        <!-- Round Chibi Body -->
        <circle cx="60" cy="68" r="42" fill="url(#creatureGrad)" stroke="#1E1B4B" stroke-width="3" />

        <!-- Rosy Anime Blush -->
        <ellipse cx="36" cy="74" rx="7" ry="4" fill="#FF5D8F" opacity="0.6" />
        <ellipse cx="84" cy="74" rx="7" ry="4" fill="#FF5D8F" opacity="0.6" />

        <!-- Big Sparkling Anime Eyes ✨ -->
        <ellipse cx="44" cy="62" rx="9" ry="12" fill="#1E1B4B" />
        <ellipse cx="42" cy="58" rx="4" ry="6" fill="#FFFFFF" />
        <circle cx="46" cy="68" r="2" fill="#FFFFFF" />

        <ellipse cx="76" cy="62" rx="9" ry="12" fill="#1E1B4B" />
        <ellipse cx="74" cy="58" rx="4" ry="6" fill="#FFFFFF" />
        <circle cx="78" cy="68" r="2" fill="#FFFFFF" />

        <!-- Cute Cat Mouth :3 -->
        <path d="M 52 74 Q 56 78 60 74 Q 64 78 68 74" stroke="#1E1B4B" stroke-width="2.5" stroke-linecap="round" fill="none" />

        <!-- Tiny Paws -->
        <circle cx="48" cy="98" r="8" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="2" />
        <circle cx="72" cy="98" r="8" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="2" />
      </svg>
    `;
  }

  // SCANNING: Anime creature holding magnifying glass with sweat drop
  getScanningSvg() {
    return `
      <svg viewBox="0 0 120 120" class="anime-creature-svg anime-scanning" xmlns="http://www.w3.org/2000/svg">
        <!-- Ears -->
        <polygon points="25,45 15,10 45,28" fill="#FF9E00" stroke="#1E1B4B" stroke-width="2.5" />
        <polygon points="95,45 105,10 75,28" fill="#FF9E00" stroke="#1E1B4B" stroke-width="2.5" />

        <!-- Body -->
        <circle cx="60" cy="68" r="42" fill="#FFD166" stroke="#1E1B4B" stroke-width="3" />

        <!-- Giant Anime Sweat Drop 💧 -->
        <path d="M 88 35 C 84 45, 96 50, 96 42 C 96 35, 90 28, 88 35 Z" fill="#4CC9F0" stroke="#1E1B4B" stroke-width="1.5" />

        <!-- Left Eye: Spiral Dizzy Eye @ @ -->
        <path d="M 44 62 m -6,0 a 6,6 0 1,0 12,0 a 6,6 0 1,0 -12,0 a 3,3 0 1,0 6,0" stroke="#1E1B4B" stroke-width="2" fill="none" />

        <!-- Right Eye: Big Anime Eye with Spyglass -->
        <circle cx="76" cy="62" r="14" fill="rgba(76,201,240,0.4)" stroke="#1E1B4B" stroke-width="2.5" />
        <ellipse cx="76" cy="62" rx="7" ry="9" fill="#1E1B4B" />
        <circle cx="74" cy="59" r="3" fill="#FFFFFF" />

        <!-- Open Wobbly Mouth -->
        <ellipse cx="60" cy="78" rx="5" ry="6" fill="#1E1B4B" />
      </svg>
    `;
  }

  // DIRTY: Shocked, Fainting, Waterfall Tears, Holding Nose (😱 🤢 😭)
  getDirtySvg() {
    return `
      <svg viewBox="0 0 120 120" class="anime-creature-svg anime-dirty" xmlns="http://www.w3.org/2000/svg">
        <!-- Ears drooping in despair -->
        <polygon points="25,50 5,30 35,42" fill="#FF9E00" stroke="#1E1B4B" stroke-width="2.5" />
        <polygon points="95,50 115,30 85,42" fill="#FF9E00" stroke="#1E1B4B" stroke-width="2.5" />

        <!-- Green Disgusted Face Hue 🤢 -->
        <circle cx="60" cy="68" r="42" fill="#D4E09B" stroke="#1E1B4B" stroke-width="3" />

        <!-- Huge Anime Sweat Drop 💧 -->
        <path d="M 96 36 C 92 48, 106 52, 106 44 C 106 36, 98 28, 96 36 Z" fill="#4CC9F0" stroke="#1E1B4B" stroke-width="2" />

        <!-- Huge Horrified Anime Eyes with White Pupils (Anime Shock 😱) -->
        <circle cx="42" cy="62" r="13" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="2.5" />
        <circle cx="42" cy="62" r="4" fill="#1E1B4B" />
        <circle cx="78" cy="62" r="13" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="2.5" />
        <circle cx="78" cy="62" r="4" fill="#1E1B4B" />

        <!-- Anime Waterfall Tears 😭 -->
        <path d="M 38 72 C 34 85, 40 102, 36 114" stroke="#4CC9F0" stroke-width="5" stroke-linecap="round" fill="none" />
        <path d="M 82 72 C 86 85, 80 102, 84 114" stroke="#4CC9F0" stroke-width="5" stroke-linecap="round" fill="none" />

        <!-- Paws Pinching Nose tightly 🤢 -->
        <circle cx="54" cy="74" r="6" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="2" />
        <circle cx="66" cy="74" r="6" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="2" />

        <!-- Screaming Anime Mouth -->
        <path d="M 48 84 Q 60 98 72 84 Z" fill="#780000" stroke="#1E1B4B" stroke-width="2" />
      </svg>
    `;
  }

  // CLEAN: Celebratory Anime Mode with Starry Eyes & Sunglasses (✨ 😌 😎 🎉)
  getCleanSvg() {
    return `
      <svg viewBox="0 0 120 120" class="anime-creature-svg anime-clean" xmlns="http://www.w3.org/2000/svg">
        <!-- Golden Sparkles ✨ -->
        <path d="M 16 25 L 19 16 L 22 25 L 31 28 L 22 31 L 19 40 L 16 31 L 7 28 Z" fill="#FFD166" />
        <path d="M 104 25 L 106 18 L 108 25 L 115 27 L 108 29 L 106 36 L 104 29 L 97 27 Z" fill="#06D6A0" />

        <!-- Happy Perky Ears -->
        <polygon points="25,42 12,8 45,24" fill="#FF9E00" stroke="#1E1B4B" stroke-width="2.5" />
        <polygon points="95,42 108,8 75,24" fill="#FF9E00" stroke="#1E1B4B" stroke-width="2.5" />

        <!-- Golden Glowing Body -->
        <circle cx="60" cy="68" r="42" fill="#FFE066" stroke="#1E1B4B" stroke-width="3" />

        <!-- Rosy Happy Cheeks -->
        <ellipse cx="34" cy="75" rx="7" ry="5" fill="#FF758F" opacity="0.7" />
        <ellipse cx="86" cy="75" rx="7" ry="5" fill="#FF758F" opacity="0.7" />

        <!-- Cool Thug-Life Anime Sunglasses 😎 -->
        <polygon points="26,54 56,54 52,70 30,70" fill="#0F172A" stroke="#FFD166" stroke-width="2" />
        <polygon points="64,54 94,54 90,70 68,70" fill="#0F172A" stroke="#FFD166" stroke-width="2" />
        <line x1="52" y1="58" x2="68" y2="58" stroke="#FFD166" stroke-width="3" />
        <!-- Glare -->
        <line x1="32" y1="58" x2="42" y2="68" stroke="rgba(255,255,255,0.7)" stroke-width="2" />
        <line x1="70" y1="58" x2="80" y2="68" stroke="rgba(255,255,255,0.7)" stroke-width="2" />

        <!-- Radiant Smiling Cat Mouth ( ^ ▽ ^ ) -->
        <path d="M 50 78 Q 60 90 70 78 Z" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="2" />

        <!-- Cheering Paws Raised in Victory 🎉 -->
        <circle cx="32" cy="52" r="7" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="2" />
        <circle cx="88" cy="52" r="7" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="2" />
      </svg>
    `;
  }
}
