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
        return "💤 Rao Pro AI is currently offline because the host PC is sleeping! Please check the GitHub repository README for the Discord link to wake up the server.";


    }
};
