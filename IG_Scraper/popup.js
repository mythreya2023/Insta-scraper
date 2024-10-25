document.getElementById("sendButton").addEventListener("click", () => {
  const WTD = document.getElementById("WTD").value;
  const WTN = document.getElementById("WTN").value;
  const WTO = document.getElementById("WTO").value;
  const HCIP = document.getElementById("HCIP").value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        action: "scrapeProfile",
        WTD: WTD,
        WTN: WTN,
        WTO: WTO,
        HCIP: HCIP,
      },
      (results) => {
        document.getElementById("result").innerText = JSON.stringify(
          results,
          null,
          2
        );
      }
    );
  });
});
// document.getElementById("scrapeButton").addEventListener("click", () => {
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.scripting.executeScript(
    {
      target: { tabId: tabs[0].id },
      files: ["content.js"],
    },
    (results) => {
      console.log(results);
      if (results && results[0] && results[0].result) {
        const profileData = results[0].result;
        document.getElementById("result").innerText = JSON.stringify(
          profileData,
          null,
          2
        );
      }
    }
  );
});
// });
