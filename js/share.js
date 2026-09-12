/**
 * Kai Onnu Kaattikke! - Shareable Meme Card Generator
 * Uses HTML5 Canvas to render a high-resolution Ammachi & Anime Creature meme card.
 */

export class ShareCardGenerator {
  static async generateCard(result, handImageSrc) {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');

    // 1. Warm Comic Gradient Background
    const bgGrad = ctx.createLinearGradient(0, 0, 800, 1000);
    if (result.isClean) {
      bgGrad.addColorStop(0, '#065A60');
      bgGrad.addColorStop(0.5, '#0B525B');
      bgGrad.addColorStop(1, '#1B263B');
    } else {
      bgGrad.addColorStop(0, '#540804');
      bgGrad.addColorStop(0.5, '#3D1308');
      bgGrad.addColorStop(1, '#1E1B4B');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 800, 1000);

    // Decorative Yellow Border Stripe
    ctx.fillStyle = '#FFD166';
    ctx.fillRect(0, 0, 800, 18);

    // 2. Ammachi Header Badge
    ctx.fillStyle = '#FFB703';
    ctx.strokeStyle = '#1E1B4B';
    ctx.lineWidth = 4;
    this.roundRect(ctx, 140, 42, 520, 56, 28);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#1E1B4B';
    ctx.font = '900 24px "Fredoka", "Arial Rounded MT Bold", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('👵 AMMACHI HAND INSPECTION • കൈ പരിശോധന 😂', 400, 78);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '700 18px "Outfit", sans-serif';
    ctx.fillText('OFFICIAL GRANDMA HYGIENE & BATH VERDICT', 400, 128);

    // 3. Hand Photo Frame
    const photoSize = 380;
    const photoX = (800 - photoSize) / 2;
    const photoY = 150;

    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#1E1B4B';
    ctx.lineWidth = 6;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 8;
    this.roundRect(ctx, photoX - 12, photoY - 12, photoSize + 24, photoSize + 24, 28);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Draw hand photo
    const img = await this.loadImage(handImageSrc);
    ctx.save();
    this.roundRect(ctx, photoX, photoY, photoSize, photoSize, 20);
    ctx.clip();
    this.drawCoverImage(ctx, img, photoX, photoY, photoSize, photoSize);
    ctx.restore();

    // 4. Cleanliness Score Pill
    const scoreBadgeY = photoY + photoSize + 48;

    ctx.save();
    ctx.fillStyle = result.isClean ? '#06D6A0' : '#EF476F';
    ctx.strokeStyle = '#1E1B4B';
    ctx.lineWidth = 4;
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 10;
    this.roundRect(ctx, 210, scoreBadgeY - 28, 380, 56, 28);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 24px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`CLEANLINESS SCORE: ${result.score}/100`, 400, scoreBadgeY + 8);

    // 5. Large Malayalam Verdict Heading
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 44px "Noto Sans Malayalam", "Arial", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(result.malayalamMessage, 400, scoreBadgeY + 85);

    // 6. Subtitle
    ctx.fillStyle = '#FFD166';
    ctx.font = '700 24px "Fredoka", sans-serif';
    ctx.fillText(result.subtitleReaction, 400, scoreBadgeY + 124);

    // 7. Ammachi's Roast Box
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#1E1B4B';
    ctx.lineWidth = 3.5;
    this.roundRect(ctx, 70, scoreBadgeY + 150, 660, 96, 18);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = result.isClean ? '#059669' : '#D90429';
    ctx.font = 'bold 24px "Fredoka", "Noto Sans Malayalam", sans-serif';
    ctx.fillText(result.tierComment, 400, scoreBadgeY + 192);

    ctx.fillStyle = '#475569';
    ctx.font = '700 16px "Outfit", sans-serif';
    ctx.fillText(`Ammachi Rating: ${result.metrics.ammachiRating}`, 400, scoreBadgeY + 226);

    // 8. Footer
    ctx.fillStyle = '#FFD166';
    ctx.fillRect(0, 982, 800, 18);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '700 16px "Outfit", sans-serif';
    ctx.fillText('Ammachi checked my hand 😂🖐️ • #KaiOnnuKaattikke', 400, 965);

    return canvas;
  }

  static roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  static drawCoverImage(ctx, img, x, y, w, h) {
    const imgRatio = img.width / img.height;
    const boxRatio = w / h;
    let sW, sH, sX, sY;

    if (imgRatio > boxRatio) {
      sH = img.height;
      sW = img.height * boxRatio;
      sX = (img.width - sW) / 2;
      sY = 0;
    } else {
      sW = img.width;
      sH = img.width / boxRatio;
      sX = 0;
      sY = (img.height - sH) / 2;
    }
    ctx.drawImage(img, sX, sY, sW, sH, x, y, w, h);
  }

  static loadImage(src) {
    return new Promise((resolve, reject) => {
      if (src instanceof HTMLImageElement && src.complete) {
        return resolve(src);
      }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = typeof src === 'string' ? src : src.src;
    });
  }

  static downloadCard(canvas, filename = 'ammachi-hand-verdict.png') {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  static async shareCard(canvas, result) {
    if (navigator.share && navigator.canShare) {
      try {
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], 'ammachi-hand-verdict.png', { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'Ammachi checked my hand 😂🖐️',
              text: `Ammachi checked my hand 😂🖐️ Verdict: ${result.malayalamMessage} - Score: ${result.score}/100! “${result.tierComment}”`,
              files: [file]
            });
            return;
          }
          this.downloadCard(canvas);
        });
        return;
      } catch (e) {
        console.warn('Share cancelled or not supported, downloading instead:', e);
      }
    }
    this.downloadCard(canvas);
  }
}
