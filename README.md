# 🚀 Rao Pro AI - Next-Gen Conversational AI
🔗 **Live Project Link:** [https://adox-ai.vercel.app/]
> 🔴 **SERVER STATUS NOTICE:** 
> **Rao Pro AI runs locally on my personal machine's hardware.** If you test the live link and the AI is unresponsive, it means my local server (PC) is currently offline. 
> 
> 🟢 **Want to test it live?** 
> Join my Discord server and drop a message! I will boot up the local AI engine for you.
> 👉 **[Join My Discord Server Here](YAHAN_APNA_DISCORD_LINK_DAAL_DENA)**

---
## 👨‍💻 Developer Bio & Architectural Milestone
**Built by Maneesh**
This project represents a major engineering milestone in zero-cost cloud architecture. I successfully engineered a highly complex, tunneled pipeline to host and run heavy, hardware-dependent local AI models entirely on **free-tier cloud services (Vercel & Render)**. 
**Key Technical Achievements:**
* **Free-Tier Local LLM Hosting:** Successfully bridged a local Ollama (Llama 3) instance with a deployed cloud frontend via secure Ngrok TCP tunneling, bypassing expensive cloud GPU costs.
* **Local Voice Engine Integration (Piper TTS):** Integrated the Piper Text-to-Speech C++ executable (`en_US-amy-medium.onnx`) directly into the pipeline, achieving real-time, low-latency audio generation without relying on paid APIs.
* **Full-Stack Synergy:** Seamlessly connected a React/Tailwind frontend on Vercel with a Node/Express backend on Render, talking directly to local AI hardware.
---
## 🖥️ ⚠️ Important Platform Notice (PC-First Design)
**This application is strictly designed and optimized for PC/Desktop environments.** 
To experience the immersive 3D visual effects, Sci-Fi UI, and complex interactive canvases as intended, please use a Desktop or Laptop. While the application *can* run on Android/Mobile browsers, the interface and layout are not optimized for smaller screens, and mobile users may experience significant design variations and UI overlapping. 
---
## ✨ Core Features
### 1. Live 3D & Sci-Fi UI/UX
* **Futuristic Visual Effects:** Interactive live 3D animations, particle canvases, and dynamic neon glows.
* **Dual Interface Design:** Includes two unique UI layouts within a single application, featuring dynamic visual transitions.
### 2. Local Voice Engine Integration
* **Piper TTS Integration:** Powered by the Piper Local Voice Engine for real-time, offline, low-latency text-to-speech audio generation.
### 3. Frictionless & Secure Custom Authentication
* **No Gmail Required:** Custom username-based authentication system.
* **Instant Onboarding:** Users create a unique ID & password inside the app to log in directly without requiring third-party OAuth accounts.
### 4. Advanced Chat Privacy & Management
* **Chat Lock System:** Passcode protection for individual chat sessions to secure private conversations.
* **Firestore Data Persistence:** Persistent chat history securely stored using Firebase Cloud Firestore.
* **Chat Control:** Full capability to manage, lock, unlock, and delete chat sessions on demand.
---
## 📝 Note on AI Model Integrations (Placeholders)
*Please note: The model names listed in the UI preview (e.g., Claude 3.5, GPT-4o, Cursor Pro, GitHub Copilot) are temporary visual placeholders/labels used during initial UI development.* 
The underlying backend is highly modular. It was successfully built and tested using **Ollama (Llama 3)** via secure tunneling, and the architecture is easily configurable to integrate any external LLM provider API (Groq, OpenAI, HuggingFace) or custom fine-tuned local models.
---
## 🛠️ Tech Stack & Architecture

| Layer | Technology Used |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS, Canvas API, Lucide Icons |
| **Backend API** | Node.js, Express.js, Axios, Ngrok Tunneling |
| **Voice / TTS** | Piper TTS (ONNX Runtime, C++ Executable Engine) |
| **Database & Auth** | Firebase Auth, Google Cloud Firestore |
| **Styling & Effects** | Custom CSS3 Animations, Sci-Fi Glow Effects, Glassmorphism |
