// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  fetch("http://localhost:3000/data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request.data),
  })
    .then((response) => sendResponse({ status: response.status }))
    .catch((error) => sendResponse({ error: error.message }));
  return true;
});
