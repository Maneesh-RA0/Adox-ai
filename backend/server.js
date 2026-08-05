
const express = require("express");
const cors = require("cors");
const helmet = require("helmet"); // Security Layer
const rateLimit = require("express-rate-limit");
const Groq = require("groq-sdk");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(helmet());
app.use(cors({
    origin: "*",
    methods: ["POST", "GET"]
}));

app.use(express.json({ limit: "50kb" }));

const chatLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: { reply: "⚠ Too many requests. Thodi der baad try karein." },
    standardHeaders: true,
    legacyHeaders: false,
});

const speakLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 30,
    message: { error: "⚠ Too many voice requests. Thodi der baad try karein." },
    standardHeaders: true,
    legacyHeaders: false,
});
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.get("/", (req, res) => {
    res.send("Secure Backend is running 🟩");
});

app.post("/api/chat", chatLimiter, async (req, res) => {
    try {
        const { chatHistory, message, aiModel } = req.body;
        let historyArray = [];

        if (chatHistory && Array.isArray(chatHistory)) {
            historyArray = chatHistory;
        }
        else if (message && typeof message === "string") {
            historyArray = [{ sender: "user", text: message }];
        }
        else {
            return res.status(400).json({ reply: "⚠ Valid chat data is required" });
        }

        if (historyArray.length > 50) {
            return res.status(400).json({ reply: "⚠ Chat history is too long. Please start a new chat." });
        }

        let aiText = "";
        let modelName = aiModel ? aiModel.toLowerCase() : "";

        if (modelName.includes("jimmu") || modelName.includes("jammu")) {

            const formattedMessages = [];

            formattedMessages.push({
                role: "system",
                content: "You are Jimmu AI, a smart, friendly, and fast AI assistant created by Maneesh. Always remember the context of the conversation."
            });

            historyArray.forEach(msg => {
                if (msg.text && typeof msg.text === "string" && msg.text.trim() !== "") {
                    // Decide role based on sender
                    const role = (msg.sender === "user" || msg.role === "user") ? "user" : "assistant";

                    formattedMessages.push({
                        role: role,
                        content: msg.text.trim().substring(0, 2000)
                    });
                }
            });

            const chatCompletion = await groq.chat.completions.create({
                messages: formattedMessages,
                model: "llama-3.1-8b-instant",
            });

            aiText = chatCompletion.choices[0]?.message?.content || "Sorry, Jimmu ko samajh nahi aaya.";

        } else if (modelName.includes("rao pro") || modelName.includes("raopro")) {

            aiText = "⚙️ [RAO PRO AI] system is currently under development. Yahan Maneesh apna highly advanced custom AI engine connect karega!";

        } else {
            aiText = "⚠ UI se koi valid AI system select nahi hua hai.";
        }

        res.json({ reply: aiText });

    } catch (error) {
        console.error("❌ API Error:", error.message || error);
        res.status(500).json({ reply: "⚠ System Error: Backend se connect nahi ho pa raha. Baad mein try karein." });
    }
});

app.post('/api/speak', speakLimiter, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || typeof text !== "string") {
            return res.status(400).json({ error: 'Valid text is required' });
        }

        const safeText = text.trim().substring(0, 500);
        const voiceBackendDir = "C:\\Users\\Manish\\OneDrive\\Desktop\\Adox.ai\\adox-ai\\voice-backend";
        const piperDir = voiceBackendDir;
        const piperPath = path.join(piperDir, 'piper.exe');
        const modelPath = path.join(voiceBackendDir, 'en_US-amy-medium.onnx');
        const configPath = path.join(voiceBackendDir, 'en_US-amy-medium.onnx.json');
        const outputPath = path.join(voiceBackendDir, `output_${Date.now()}.wav`);

        const piperProcess = spawn(piperPath, [
            '--model', modelPath,
            '--config', configPath,
            '--output_file', outputPath
        ], {
            cwd: piperDir
        });

        piperProcess.stdin.write(safeText + "\n");
        piperProcess.stdin.end();

        piperProcess.on('close', (code) => {
            if (code === 0) {
                try {
                    const stats = fs.statSync(outputPath);
                    if (stats.size === 0) {
                        return res.status(500).json({ error: 'Voice engine failed (0 bytes)' });
                    }
                    const audioBuffer = fs.readFileSync(outputPath);
                    res.setHeader('Content-Type', 'audio/wav');
                    res.send(audioBuffer);

                    fs.unlinkSync(outputPath);
                } catch (fileErr) {
                    if (!res.headersSent) {
                        res.status(500).json({ error: 'Failed to read audio' });
                    }
                }
            } else {
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Engine failed' });
                }
            }
        });

        piperProcess.on('error', (err) => {
            console.error("❌ Voice Engine Error:", err);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Could not start engine' });
            }
        });

    } catch (error) {
        console.error("Speak API Error:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});


app.listen(PORT, () => {
    console.log(`🔒 Secure Server chal raha hai: http://localhost:${PORT}`);
});
