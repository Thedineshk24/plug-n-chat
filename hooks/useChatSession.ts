import { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
const useChatSession = () => {
  const [chatSession, setChatSession] = useState<any>(null);

  useEffect(() => {
    const initializeChatSession = async () => {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
      });
      const session = model.startChat({
        generationConfig: {
          temperature: 1,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
          responseMimeType: "text/plain",
        },
        history: [],
      });
      setChatSession(session);
    };

    if (!chatSession) {
      initializeChatSession();
    }
  }, [chatSession]);

  return chatSession;
};

export default useChatSession;
