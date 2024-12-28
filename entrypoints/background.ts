import { defineBackground } from "wxt/sandbox";

let latestContent: { text: any; title: any; url: any; } | null = null;

function main() {
  console.log("Background script initialized, waiting for messages...");

  // Listen for messages from the popup or content script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received message:", request);

    if (request && request.content) {
      // Safely destructure the content
      const { text, title, url } = request.content;

      console.log("Received content from content script:", {
        text,
        title,
        url,
      });

      // Store the latest content
      latestContent = { text, title, url };

      // Respond with a success message
      sendResponse({
        status: "Content received successfully",
        text,
        title,
        url,
      });
      return true;
    } else if (request.action === "getContent") {
      // Respond with the latest content
      sendResponse(latestContent);
      return true;
    } else {
      // Respond with an error message
      sendResponse({
        status: "No valid content received",
      });
    }

    // Return true to indicate the response will be sent asynchronously (if needed)
    return true;
  });
}

// Export the background script using `defineBackground`
export default defineBackground(main);
