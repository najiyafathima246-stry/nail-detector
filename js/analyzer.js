/**
 * Kai Onnu Kaattikke! - Hand & Nail Dirt Analyzer for Ammachi
 * Calculates cleanliness score (0 - 100) and produces Ammachi's hilarious 4-tier verdicts.
 */

export class HandAnalyzer {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
  }

  async analyze(imageSource) {
    const width = 240;
    const height = 240;
    this.canvas.width = width;
    this.canvas.height = height;

    this.ctx.drawImage(imageSource, 0, 0, width, height);
    const imageData = this.ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    let skinPixelCount = 0;
    let dirtyPixelCount = 0;
    const skinMask = new Uint8Array(width * height);

    // Pass 1: Skin and grime heuristic
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        const isSkin = this.isSkinColor(r, g, b);

        if (isSkin) {
          skinPixelCount++;
          skinMask[y * width + x] = 1;

          // Muddy discoloration check
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          if (brightness < 68 || (r < 95 && g < 80 && b < 68 && Math.abs(r - g) < 25)) {
            dirtyPixelCount++;
          }
        } else {
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          if (brightness < 50) {
            let nearSkin = false;
            for (let dy = -3; dy <= 3; dy += 3) {
              for (let dx = -3; dx <= 3; dx += 3) {
                const ny = y + dy;
                const nx = x + dx;
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                  if (skinMask[ny * width + nx]) {
                    nearSkin = true;
                    break;
                  }
                }
              }
              if (nearSkin) break;
            }
            if (nearSkin) {
              dirtyPixelCount += 1.5;
            }
          }
        }
      }
    }

    // Pass 2: Nail edge grime check in top 65% of image
    const upperYLimit = Math.floor(height * 0.65);
    let edgeDirtCount = 0;

    for (let y = 1; y < upperYLimit; y += 2) {
      for (let x = 1; x < width - 1; x += 2) {
        const idx = (y * width + x) * 4;
        const currentBrightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        const nextBrightness = (data[idx + 4] + data[idx + 5] + data[idx + 6]) / 3;

        const diff = Math.abs(currentBrightness - nextBrightness);
        if (diff > 55 && currentBrightness < 70) {
          edgeDirtCount++;
        }
      }
    }

    const totalHandArea = Math.max(skinPixelCount, width * height * 0.15);
    const dirtPercentage = (dirtyPixelCount / totalHandArea) * 100;
    const edgeDirtIndex = (edgeDirtCount / (width * upperYLimit * 0.25)) * 100;

    // Determine Cleanliness Score (0 to 100)
    let score;
    if (dirtPercentage > 10 || edgeDirtIndex > 14) {
      score = 25; // Default dirty score requested by user
    } else if (dirtPercentage > 4.2 || edgeDirtIndex > 6.5) {
      score = Math.floor(22 + Math.random() * 8); // 22 - 30
    } else if (dirtPercentage > 1.8) {
      score = Math.floor(65 + Math.random() * 12); // 65 - 77
    } else {
      score = 95; // Default clean score requested by user
    }

    score = Math.max(10, Math.min(98, score));
    return this.buildResult(score);
  }

  isSkinColor(r, g, b) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    const condition1 = r > 60 && g > 40 && b > 20;
    const condition2 = diff > 15 && r > g && r > b;
    const condition3 = Math.abs(r - g) > 12;
    return condition1 && condition2 && (condition3 || r > 110);
  }

  buildResult(score) {
    const isClean = score > 60;

    // The user's exact 4-tier score comments:
    // 0–30   → “Bro… soap use cheyyu 😭🧼”
    // 31–60  → “Kurachu cleaning venam 😂”
    // 61–80  → “Not bad 😌”
    // 81–100 → “Nalla kutti! ✨”
    let tierComment = '';
    if (score <= 30) {
      tierComment = 'Bro… soap use cheyyu 😭🧼';
    } else if (score <= 60) {
      tierComment = 'Kurachu cleaning venam 😂';
    } else if (score <= 80) {
      tierComment = 'Not bad 😌';
    } else {
      tierComment = 'Nalla kutti! ✨';
    }

    let malayalamMessage = '';
    let voiceMessage = '';
    let subtitleReaction = '';
    let badgeEmoji = '';
    let characterMood = '';
    let animeMood = '';

    if (!isClean) {
      // Dirty Result
      malayalamMessage = 'ഒന്ന് പോയി കുളിക്കൂ 😭😂🚿';
      voiceMessage = 'ഒന്ന് പോയി കുളിക്കൂ!';
      subtitleReaction = 'അയ്യോ... സോപ്പ് എവിടെ? 😭';
      badgeEmoji = '🧼😭';
      characterMood = 'dirty';
      animeMood = 'dirty';
    } else {
      // Clean Result
      malayalamMessage = 'നീ നല്ല കുട്ടിയാണ് 😌✨';
      voiceMessage = (score >= 90) ? 'നീ നല്ല കുട്ടിയാണ്!' : 'നീ നല്ല കുട്ടിയാണ്!';
      subtitleReaction = 'അടിപൊളി! അമ്മച്ചിക്ക് അഭിമാനം! 😂❤️';
      badgeEmoji = '✨🏆';
      characterMood = 'clean';
      animeMood = 'clean';
    }

    return {
      score,
      isClean,
      characterMood,
      animeMood,
      malayalamMessage,
      voiceMessage,
      subtitleReaction,
      tierComment,
      badgeEmoji,
      metrics: {
        nailHygiene: isClean ? Math.min(100, Math.floor(score * 1.02)) : Math.floor(score * 0.8),
        mudIndex: Math.max(0, Math.min(100, 100 - score)),
        ammachiRating: isClean 
          ? (score >= 90 ? '⭐⭐⭐⭐⭐ (നല്ല കുട്ടി!)' : '⭐⭐⭐⭐ (Not Bad)') 
          : (score <= 30 ? '🚨 സോപ്പ് അത്യാഹിതം' : '⚠️ കുറച്ചു കഴുകണം')
      }
    };
  }
}
