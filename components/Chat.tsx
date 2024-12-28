import React, { useEffect, useRef } from "react";
import ReactMarkDown from "react-markdown";
import * as lucid from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import usePopupDimensions from "@/hooks/usePopupDimensions";
import useChatSession from "@/hooks/useChatSession";
import useWebsiteContent from "@/hooks/useWebsiteContent";
import useHandleMessages from "@/hooks/useHandleMessages";

export const ChatComponent: React.FC = () => {
  usePopupDimensions();
  const { theme, toggleTheme } = useTheme();
  const chatSession = useChatSession();
  const { messages, input, loading, handleInputChange, handleSubmit } =
    useHandleMessages(
      chatSession,
      useWebsiteContent((newMessages) => newMessages)
    );

  // Ref for the messages container
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll to bottom whenever messages or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  return (
    <div
      className={`w-96 h-[600px] flex flex-col ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div
        className={`${
          theme === "dark" ? "bg-purple-700" : "bg-purple-500"
        } text-white p-3 font-semibold text-sm flex justify-between items-center`}
      >
        <span>Chat Assistant</span>
        <button
          onClick={toggleTheme}
          className="p-1 rounded-full hover:bg-purple-600 transition-colors hover:opacity-80"
        >
          {theme === "dark" ? (
            <lucid.Sun size={16} />
          ) : (
            <lucid.Moon size={16} color="black" />
          )}
        </button>
      </div>
      <div
        className={`flex-1 overflow-y-auto p-4 space-y-4 ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-50"
        }`}
      >
        {messages
          .filter(
            (message) =>
              !(
                message.role === "assistant" &&
                message.content.startsWith("Here is the website content:")
              )
          )
          .map((message) => (
            <div
              key={message.id}
              className={`p-2 rounded-md ${
                message.role === "user"
                  ? theme === "dark"
                    ? "bg-blue-700 text-right"
                    : "bg-blue-100 text-right"
                  : theme === "dark"
                  ? "bg-gray-700 text-left"
                  : "bg-gray-200 text-left"
              }`}
            >
              <ReactMarkDown className="prose prose-sm max-w-none">
                {message.content}
              </ReactMarkDown>
            </div>
          ))}
        {loading && (
          <div
            className={`p-2 text-center ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            } animate-pulse`}
          >
            <lucid.SearchSlashIcon size={24} />
          </div>
        )}
        {/* Placeholder div to ensure scroll to bottom */}
        <div ref={messagesEndRef}></div>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`flex items-center space-x-2 p-3 ${
          theme === "dark"
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-200"
        } border-t`}
      >
        <input
          required
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Ask me anything..."
          className={`flex-1 px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            theme === "dark"
              ? "bg-gray-800 text-white border-gray-700"
              : "bg-white text-gray-900 border-gray-300"
          }`}
        />
        <button
          disabled={loading}
          type="submit"
          className={`px-3 py-1 text-sm ${
            theme === "dark"
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-purple-500 hover:bg-purple-600"
          } text-white rounded-md transition-colors`}
        >
          Send
        </button>
      </form>
    </div>
  );
};
