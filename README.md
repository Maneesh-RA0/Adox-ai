# 🚀 Adox AI — Next-Gen Futuristic Sci-Fi AI Workspace

A high-performance, futuristic AI chat platform built with a 3D Sci-Fi interface, custom local TTS voice engine, seamless multi-model LLM integration, and privacy-first database architecture.

---

## ✨ Key Features

### 🎨 1. Live 3D & Sci-Fi UI/UX
* **Futuristic Visual Effects:** Interactive live 3D animations, particle canvases, dynamic neon glows, and Sci-Fi themes.
* **Dual Interface Design:** Includes two unique UI layouts within a single application, each featuring dynamic 3D visual dynamics.

### 🔊 2. Local Voice Engine Integration
* **Piper TTS Integration:** Powered by Piper Local Voice Engine (`en_US-amy-medium.onnx`) for real-time, offline, low-latency text-to-speech audio generation.

### 🛡️ 3. Frictionless & Secure Custom Authentication
* **No Gmail Required:** Custom username-based authentication system.
* **Instant Onboarding:** Users create a unique ID & password inside the app to log in directly without requiring third-party OAuth/Gmail accounts.

### 🔐 4. Advanced Chat Privacy & Management
* **Chat Lock System:** Passcode protection for individual chat sessions to secure private conversations.
* **Firestore Data Persistence:** Persistent chat history securely stored using Firebase Cloud Firestore.
* **Chat Control:** Full capability to manage, lock, unlock, and delete chat sessions on demand.

> ⚠️ **Note on AI Model Integrations:**  
> Model names listed in the UI UI preview (e.g., *Claude 3.5, GPT-4o, Cursor Pro, GitHub Copilot*) are **placeholder / temporary model labels**. The underlying backend is modular and easily configurable to integrate any LLM provider API (e.g., Groq, Ollama, OpenAI, HuggingFace) or custom fine-tuned local models.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology Used |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS, Canvas API, Lucide Icons |
| **Backend API** | Node.js, Express.js, Axios |
| **Voice / TTS** | Piper TTS (ONNX Runtime, C++ Executable Engine) |
| **Database & Auth** | Firebase Auth, Google Cloud Firestore |
| **Styling & Effects** | Custom CSS3 Animations, Sci-Fi Glow Effects, Glassmorphism |

---

## 📦 Project Setup & Installation

### 1. Clone the Repository
```bash

git clone https://github.com/Maneesh-RA0/adox-ai.git
cd adox-ai
