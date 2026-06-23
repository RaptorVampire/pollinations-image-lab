# 🎨 Pollinations Image Lab

[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?logo=github)](https://raptorvampire.github.io/pollinations-image-lab)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Pollinations.ai](https://img.shields.io/badge/API-Pollinations.ai-ff69b4)](https://pollinations.ai)

A modern, mobile-friendly AI image generator that turns your text prompts into stunning artwork using the [Pollinations.ai](https://pollinations.ai) API. Built with vanilla HTML, CSS, and JavaScript – no frameworks, no build steps.

---

## 🚀 Live Demo

**[Launch the app →](https://raptorvampire.github.io/pollinations-image-lab)**  
(hosted on GitHub Pages – always up to date)

---

## ✨ Features

- 🖼️ **Instant generation** – Type a prompt, tap *Generate*, and see your image in seconds.
- ⚙️ **Customisable settings**
  - Choose from multiple AI models.
  - Set custom width / height (64–2048px).
  - Optional seed for reproducible results.
  - Toggle transparency (for models that support it).
- 🔐 **API key support** – Use your own Pollinations API key to unlock all models and higher limits.
- 📜 **Generation history** – Every image you create is saved locally (in your browser), with thumbnails, prompts, and quick‑reuse buttons.
- 📱 **Mobile‑first design** – Works beautifully on phones, tablets, and desktops.
- 🌌 **Sleek UI** – Dark theme with subtle particle effects, smooth animations, and glass‑morphism panels.
- 📎 **Copy URL / Download** – Save images directly or copy the direct URL.
- 🔒 **Privacy first** – Everything runs in your browser; your API key is stored only in `localStorage`.

---

## 📖 How to use

1. **Get an API key**  
   Visit [enter.pollinations.ai](https://enter.pollinations.ai) and copy your key (it looks like `sk_...` or `pk_...`).

2. **Open the app**  
   Go to the [live demo](https://raptorvampire.github.io/pollinations-image-lab) and paste your key when prompted (or later in the **Settings** panel).

3. **Generate!**  
   - Type a descriptive prompt (e.g., “cyberpunk samurai in neon rain”).
   - Click **Generate** or press Enter.
   - Watch the magic happen ✨

4. **Explore**  
   - Use the **Settings** icon (⚙️) to change the model, size, seed, or toggle transparency.
   - Open the **History** panel (⏱️) to see your previous creations, reuse prompts, or delete items.

---

## ⚙️ Configuration

| Setting       | Description                                                                 |
|---------------|-----------------------------------------------------------------------------|
| **API Key**   | Your Pollinations API key (required for generation).                         |
| **Model**     | AI model to use (list auto‑fetched from Pollinations).                       |
| **Width / Height** | Output dimensions (64–2048px, step 64).                                 |
| **Seed**      | Optional integer for deterministic results; leave blank for random.          |
| **Transparent** | Toggle to request a PNG with transparency (model‑dependent).               |

All settings are saved automatically in your browser.

---

## 🗂️ Project structure

```

pollinations-image-lab/
├── index.html          # Main app shell
├── css/
│   └── style.css       # All styling (mobile‑first, dark theme)
├── js/
│   ├── app.js          # Main application logic
│   └── modules/
│       ├── config.js   # Default settings & storage keys
│       ├── api.js      # Pollinations API helpers
│       ├── history.js  # Local history management
│       ├── generator.js# Image generation logic
│       ├── settings.js # Settings load / save
│       ├── ui.js       # UI toggle helpers
│       └── utils.js    # Escape, toast, copy utilities
└── README.md

```

---

## 🛠️ Tech stack

- **HTML5** – semantic structure, meta tags for PWA‑like experience.
- **CSS3** – custom properties, animations, glass‑morphism, responsive layout.
- **JavaScript (ES6 modules)** – clean separation of concerns, no dependencies.
- **Pollinations.ai API** – [`https://gen.pollinations.ai/image/...`](https://pollinations.ai)
- **Browser storage** – `localStorage` for settings and history.

---

## 🙏 Acknowledgements

- [Pollinations.ai](https://pollinations.ai) for providing the generous free image generation API.
- The open‑source community for inspiration and iconography.
- You, for checking out this project! 🌟

---

## 📝 License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and share it.

---

**Made with ❤️ and a lot of neon gradients.**  
If you like this, give the repo a ⭐ and share it with your friends!
=======
# pollinations-image-lab
A modern AI image generator powered by Pollinations.ai with model selection, generation history, custom dimensions, seeds, and transparent image support.
