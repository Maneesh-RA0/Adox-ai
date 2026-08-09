import axios from 'axios';

export const sendToLocalAI = async (userMessage, chatHistory = []) => {
    try {
        const response = await axios.post(' https://adox-ai-local-backend.onrender.com/api/chat', {
            prompt: userMessage,
            history: chatHistory
        });

        return response.data.reply;
    } catch (error) {
        console.error("Local AI Error:", error);
        return "💤 Rao Pro AI is currently offline because the host PC is sleeping! To use the AI, please join our Discord and message the owner in the #dev-talks channel to boot up the server. Join here: [https://discord.gg/uYFVBVCaf]";

    }
};
