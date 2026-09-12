"""
Kai Onnu Kaattikke! 🖐️😂
Flask Full-Stack Backend for Malayalam Hand Hygiene Judge
"""

import io
import os
import re
import sys
import base64
from flask import Flask, request, jsonify, render_template
from PIL import Image

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

app = Flask(__name__, template_folder='templates', static_folder='static')

app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max upload
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def is_skin_color(r, g, b):
    """RGB heuristic for human skin tone detection."""
    max_val = max(r, g, b)
    min_val = min(r, g, b)
    diff = max_val - min_val
    cond1 = r > 60 and g > 40 and b > 20
    cond2 = diff > 15 and r > g and r > b
    cond3 = abs(r - g) > 12
    return cond1 and cond2 and (cond3 or r > 110)


def analyze_hand_image(image_bytes, demo_mode=None):
    """
    Modular computer vision hand cleanliness analyzer.
    Analyzes visible hand and fingernails in-memory.
    No user images are permanently stored on disk (privacy guarantee).
    """
    if demo_mode == 'dirty':
        return build_result(25)
    elif demo_mode == 'clean':
        return build_result(95)

    try:
        img = Image.open(io.BytesIO(image_bytes))
        img = img.convert('RGB')
        width, height = 240, 240
        img = img.resize((width, height))
        pixels = img.load()

        skin_pixels = 0
        dirty_pixels = 0

        for y in range(height):
            for x in range(width):
                r, g, b = pixels[x, y]
                if is_skin_color(r, g, b):
                    skin_pixels += 1
                    brightness = (r * 299 + g * 587 + b * 114) // 1000
                    if brightness < 68 or (r < 95 and g < 80 and b < 68 and abs(r - g) < 25):
                        dirty_pixels += 1
                else:
                    brightness = (r * 299 + g * 587 + b * 114) // 1000
                    if brightness < 50:
                        dirty_pixels += 0.5

        # Edge analysis for fingernail grime in upper 65%
        upper_y = int(height * 0.65)
        edge_dirt = 0
        for y in range(1, upper_y, 2):
            for x in range(1, width - 1, 2):
                r1, g1, b1 = pixels[x, y]
                r2, g2, b2 = pixels[x + 1, y]
                bright1 = (r1 + g1 + b1) // 3
                bright2 = (r2 + g2 + b2) // 3
                if abs(bright1 - bright2) > 55 and bright1 < 70:
                    edge_dirt += 1

        total_area = max(skin_pixels, int(width * height * 0.15))
        dirt_pct = (dirty_pixels / total_area) * 100
        edge_idx = (edge_dirt / (width * upper_y * 0.25)) * 100

        if dirt_pct > 10 or edge_idx > 14:
            score = 25
        elif dirt_pct > 4.2 or edge_idx > 6.5:
            score = 28
        elif dirt_pct > 1.8:
            score = 70
        else:
            score = 95

        return build_result(score)
    except Exception:
        return build_result(25)


def build_result(score):
    """Constructs the JSON response with Malayalam, English, score, and comment."""
    is_clean = score > 60

    # 4-tier score comments
    if score <= 30:
        comment = "Bro… soap use cheyyu 😭"
    elif score <= 60:
        comment = "Kurachu cleaning venam 😂"
    elif score <= 80:
        comment = "Not bad 😌"
    else:
        comment = "Nalla kutti! ✨"

    if is_clean:
        malayalam_message = "നീ നല്ല കുട്ടിയാണ് 😌✨"
        english_message = "You are a good child!"
    else:
        malayalam_message = "ഒന്ന് പോയി കുളിക്കൂ 😭😂"
        english_message = "Go take a bath!"

    return {
        "clean": is_clean,
        "score": score,
        "malayalam_message": malayalam_message,
        "english_message": english_message,
        "comment": comment
    }


@app.route('/')
def index():
    """Serves the frontend template."""
    return render_template('index.html')


@app.route('/analyze', methods=['POST'])
def analyze():
    """
    API endpoint for hand cleanliness inspection.
    Receives image, validates, analyzes, and returns JSON.
    """
    try:
        demo_mode = request.form.get('demo_mode') or (request.is_json and request.json.get('demo_mode'))
        image_bytes = None

        # 1. Check multipart form file
        if 'file' in request.files:
            file = request.files['file']
            if file.filename != '' and allowed_file(file.filename):
                image_bytes = file.read()

        # 2. Check JSON with base64 image (Camera capture)
        elif request.is_json and 'image' in request.json:
            b64_str = request.json['image']
            b64_clean = re.sub(r'^data:image\/\w+;base64,', '', b64_str)
            try:
                image_bytes = base64.b64decode(b64_clean)
            except Exception:
                return jsonify({"error": "Invalid base64 image"}), 400

        # 3. Check raw binary stream
        elif request.data:
            image_bytes = request.data

        if not image_bytes:
            return jsonify({"error": "No hand image provided"}), 400

        # Perform modular in-memory analysis
        result = analyze_hand_image(image_bytes, demo_mode=demo_mode)
        return jsonify(result), 200

    except Exception as e:
        app.logger.error(f"Analysis error: {e}")
        return jsonify({"error": f"Failed to analyze image: {str(e)}"}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print("=" * 60)
    print("  🖐️ Kai Onnu Kaattikke! Flask Backend Starting...")
    print(f"  Access locally at: http://localhost:{port}")
    print("=" * 60)
    app.run(host='0.0.0.0', port=port, debug=True)
