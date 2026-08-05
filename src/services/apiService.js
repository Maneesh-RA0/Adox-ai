import { auth } from './firebaseConfig';

export const apiService = {
    // Simple secure request to your backend for AI interaction
    async makeAIRequest(aiModel, prompt) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('User not authenticated');

            const idToken = await user.getIdToken();

            // Direct call to your backend/Express server
            const response = await fetch(`${import.meta.env.VITE_CLOUD_API_ENDPOINT}/api/ai-request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}` // Secure route protection
                },
                body: JSON.stringify({
                    model: aiModel,
                    prompt
                })
            });

            if (!response.ok) throw new Error('AI request failed');

            const data = await response.json();

            return { success: true, response: data.result };
        } catch (error) {
            console.error('AI API Error:', error);
            return { success: false, error: error.message };
        }
    }
};

export default apiService;
