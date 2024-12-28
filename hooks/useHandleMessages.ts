import { useState } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}
const useHandleMessages = (chatSession: any, websiteContent: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInput(e.target.value);

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
      setLoading(true);
      const result = await chatSession.sendMessage(prompt);
      const response = await result.response.text();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content:
            response || "Sorry, I couldn't find an answer for your question.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Error fetching response.",
        },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return { messages, input, loading, handleInputChange, handleSubmit };
};

export default useHandleMessages;
