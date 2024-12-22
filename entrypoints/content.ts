export default defineContentScript({
  matches: ["*://*/*"], // Match all pages if needed
  main() {
    console.log("Hello content script.");

    // Extract text content from the body
    const pageContent = document.body.innerText;

    // Optionally, you can extract additional content like title or URL
    const pageTitle = document.title;
    const pageUrl = window.location.href;

    // Log the extracted content for debugging purposes
    console.log("Page Content:", pageContent);
    console.log("Page Title:", pageTitle);
    console.log("Page URL:", pageUrl);

    // Send the extracted content back to the background script
    browser.runtime.sendMessage({
      action: "fetchContent",
      content: {
        text: pageContent,
        title: pageTitle,
        url: pageUrl,
      },
    });
  },
});
