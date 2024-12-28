import { useEffect, useState } from "react";
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}
const useWebsiteContent = (
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const [websiteContent, setWebsiteContent] = useState<string | null>(null);

  useEffect(() => {
    const fetchContentFromBackground = async () => {
      try {
        const response = await browser.runtime.sendMessage({
          action: "getContent",
        });

        if (response) {
          const { text, title, url } = response;
          setWebsiteContent(JSON.stringify(response));
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "assistant",
              content: `Here is the website content:\n\nTitle: ${title}\nURL: ${url}\n\nText:\n${text}`,
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "assistant",
              content: "No valid content found.",
            },
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: "Error fetching content.",
          },
        ]);
      }
    };

    fetchContentFromBackground();
  }, [setMessages]);

  return websiteContent;
};

export default useWebsiteContent;
