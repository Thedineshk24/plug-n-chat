import React, {useEffect, useState} from "react";
import {GoogleGenerativeAI} from "@google/generative-ai";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [websiteContent, setWebsiteContent] = useState<string | null>(null);
  const [chatSession, setChatSession] = useState<any>(null);
  const [loading, setLoading] = useState(false); // For loading state
  const [test, setTest] = useState("");

  // Initialize chat session once on component mount
  useEffect(() => {
    const initializeChatSession = async () => {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
      });
      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      };
      const session = model.startChat({
        generationConfig,
        history: [],
      });
      setChatSession(session);
    };

    if (!chatSession) {
      initializeChatSession();
    }
  }, [chatSession]);

  // Fetch website content from the background script
  useEffect(() => {
    const fetchContentFromTab = async () => {
      try {
        setLoading(true); // Set loading state to true when fetching content
        await chrome.runtime.sendMessage(
          {action: "fetchContent"},
          (response) => {
            console.log("Content fetched from the website:", response);
            setTest(JSON.stringify(response));
            if (response?.content) {
              setWebsiteContent(JSON.stringify(response.content));
              setMessages((prev) => [
                ...prev,
                {
                  id: Date.now().toString(),
                  role: "assistant",
                  content: `Here is the website content:\n\n${response.content}`,
                },
              ]);
            } else {
              console.error("No content fetched from the website.");
            }
            setLoading(false); // Reset loading state after response
          }
        );
      } catch (error) {
        console.error("Error fetching website details:", error);
        setLoading(false); // Reset loading state in case of error
      }
    };

    fetchContentFromTab();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatSession) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const prompt = `Context: ${
        websiteContent || "No website content available."
      }\n\nUser Question: ${input}`;
      setLoading(true); // Set loading state before AI response
      const result = await chatSession.sendMessage(prompt);
      const response = await result.response.text();

      if (response) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: response,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: "Sorry, I couldn't find an answer for your question.",
          },
        ]);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Sorry, there was an error fetching the response.",
        },
      ]);
    }
    setLoading(false); // Reset loading state after AI response
    setInput("");
  };

  return (
    <div className="w-96 h-[28rem] flex flex-col bg-white shadow-lg p-4 rounded-lg">
      <div className="flex-1 overflow-y-auto border rounded-md p-2 space-y-2 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-2 rounded-md ${
              message.role === "user"
                ? "bg-blue-100 text-right"
                : "bg-gray-200 text-left"
            }`}
          >
            {message.content}
          </div>
        ))}
        {loading && (
          <div className="text-center text-sm text-gray-500">Loading...</div>
        )}
        {
          // show content from the website if it exists
          test && (
            <div className="p-2 rounded-md bg-gray-200 text-left">
              {test}
            </div>
          )
        }
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center space-x-2 mt-3"
      >
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="flex-1 px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Send
        </button>
      </form>
    </div>
  );
};
