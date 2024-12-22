export default defineBackground(() => {
  // Listen for messages from popup
  console.log("Background script initialized, waiting for message...");

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchContent") {
      console.log("Received 'fetchContent' action, querying active tab...");

      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const activeTab = tabs[0];

        if (activeTab?.id !== undefined) {
          console.log("Active tab found, sending message to content script...");

          chrome.tabs.sendMessage(
            activeTab.id,
            {action: "getPageContent"},
            (response) => {
              console.log("Received response from content script...");

              if (response && response.content) {
                console.log("Valid response, extracting content...");
                const {text, title, url} = response.content;
                sendResponse({text, title, url});
              } else {
                console.log("No content received from content script.");
                sendResponse({
                  error: "No content received from content script.",
                });
              }
            }
          );
        }
      });

      return true; // Keeps the message channel open for async response
    }
  });
});

// TODO: temporary commented 

// export default defineBackground(() => {
//   // background.js - Listens for messages from the popup (React component)
//   chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "fetchContent") {
//       // Query the active tab and send the message to the content script
//       chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
//         const activeTab = tabs[0];
//         if (activeTab) {
//           if (activeTab.id !== undefined) {
//             // Send message to content script to get page content
//             chrome.tabs.sendMessage(
//               activeTab.id,
//               {action: "getPageContent"},
//               (response) => {
//                 // Check if the response from the content script is valid
//                 if (response && response.content) {
//                   // Extract the content from the response
//                   const {text, title, url} = response.content;

//                   // Send back the extracted content to the popup or wherever needed
//                   sendResponse({
//                     text: text,
//                     title: title,
//                     url: url,
//                   });
//                 } else {
//                   sendResponse({
//                     error: "No content received from content script.",
//                   });
//                 }
//               }
//             );
//           }
//         }
//       });
//       return true; // Indicates that the response will be sent asynchronously
//     }
//   });
// });


