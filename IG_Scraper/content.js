if (!window.hasRun) {
  window.hasRun = true;
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scrapeProfile") {
      const wtd = request.WTD;
      const wto = request.WTO;
      const wtn = request.WTN;
      const hcip = request.HCIP;
      const data = scrapeInstagramProfile(wtd, wto, wtn, hcip);
      sendResponse(data);
    }
  });
}
// scrapeInstagramProfile("", "", "", "");
function scrapeInstagramProfile(wtd, wto, wtn, hcip) {
  let profileLink = window.location.href;
  profileLink = profileLink.includes("/followers/")
    ? profileLink.split("/followers")[0]
    : profileLink;
  const bio = document.querySelector(
    "._ap3a._aaco._aacu._aacx._aad7._aade"
  ).innerText;
  let websiteLinks = [];
  let bioHtml = document.querySelectorAll(".x3nfvp2.x193iq5w");
  let bioURLS = document.querySelectorAll(
    ".xjbqb8w.x1qhh985.xcfux6l.xm0m39n.x1yvgwvq.x13fuv20.x178xt8z.x1ypdohk.xvs91rp.x1evy7pa.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x1wxaq2x.x1iorvi4.x1sxyh0.xjkvuk6.xurb0ha.x2b8uid.x87ps6o.xxymvpz.xh8yej3.x52vrxo.x4gyw5p.x5n08af"
  );

  const allBioURLS = bioHtml && bioURLS ? bioURLS : bioHtml ? bioHtml : [];

  // Extract all anchor tags
  if (allBioURLS.length > 0) {
    // const anchorTags = allBioURLS.getElementsByTagName("a");

    // Iterate through all anchor tags and log the href attribute
    allBioURLS.forEach((atg) => {
      let instagramRedirectUrl;
      if (bioURLS) {
        instagramRedirectUrl = atg.childNodes[0].href;
      } else if (bioHtml) {
        instagramRedirectUrl = atg.childNodes[1].childNodes[0].href;
      }
      const url = new URL(instagramRedirectUrl);
      const params = new URLSearchParams(url.search);

      // Extract the 'u' parameter which contains the encoded original URL
      const originalUrl = params.get("u");

      // Decode the URL
      const decodedUrl = decodeURIComponent(originalUrl);

      websiteLinks.push(decodedUrl);
    });
    // for (let i = 0; i < anchorTags.length; i++) {
    // instagramRedirectUrl = anchorTags[i].href;
    // const url = new URL(instagramRedirectUrl);
    // const params = new URLSearchParams(url.search);

    // // Extract the 'u' parameter which contains the encoded original URL
    // const originalUrl = params.get("u");

    // // Decode the URL
    // const decodedUrl = decodeURIComponent(originalUrl);

    // websiteLinks.push(decodedUrl);
    // }
  }
  const ele = document.querySelectorAll(".x5n08af.x1s688f");
  // const ele = elem ? document.querySelectorAll("._ac2a") : elem;

  const postsCount = parseInt(ele[0].innerText);

  const followersCount = parseInt(
    ele[1].getAttribute("title").replaceAll(",", "")
  );

  const bioText = bio ? bio : "";
  const emailPattern = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+/g;
  const phonePattern = /\+?\d[\d -]{8,}\d/g;
  const emailMatches = bioText.match(emailPattern);
  const phoneMatches = bioText.match(phonePattern);

  const email = emailMatches ? emailMatches[0] : null;
  const phone = phoneMatches ? phoneMatches[0] : null;

  // Extract meta tags
  const metaTags = document.getElementsByTagName("meta");

  // Create an object to store profile data
  const profileData = {};

  // Loop through meta tags to find relevant information
  for (let meta of metaTags) {
    if (meta.getAttribute("property") === "og:title") {
      let cont = meta
        .getAttribute("content")
        .replace("• Instagram photos and videos", "");
      profileData.name = cont.split("(")[0];
      profileData.username = cont
        .split("(@")[1]
        .replace(") • Instagram profile", "");
    }
    if (meta.getAttribute("property") === "og:description") {
      profileData.description = meta.getAttribute("content");
    }
    if (meta.getAttribute("property") === "og:image") {
      profileData.profileImage = meta.getAttribute("content");
    }
  }

  // let username = document.querySelector(
  //   ".x1lliihq.x193iq5w.x6ikm8r.x10wlt62.xlyipyv.xuxw1ft"
  // ).innerText;
  let username = profileData.username;
  // let name = document.querySelector(
  //   ".x1lliihq.x1plvlek.xryxfnj.x1n2onr6.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1i0vuye.xvs91rp.x1s688f.x5n08af.x10wh9bi.x1wdrske.x8viiok.x18hxmgj"
  // ).innerText;
  let name = profileData.name;
  username = `=HYPERLINK("${profileLink}", "${username}")`;
  websiteLinks = websiteLinks.toString().replaceAll(",", "\n");
  wto = wto.replaceAll(",", "\n");
  const allData = {
    name,
    username,
    wtd,
    wto,
    wtn,
    hcip,
    profileLink,
    bio,
    websiteLinks,
    followersCount,
    postsCount,
    email,
    phone,
  };
  // copyText(JSON.stringify(allData, null, 2));
  sendToGsheet(JSON.stringify(allData, null, 2));
  return allData;
}
function sendToGsheet(data) {
  const allD = data;
  const dat = JSON.parse(allD);
  fetch("http://localhost:1337/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dat),
  })
    .then((response) => response.data)
    .catch((error) => error.message);
}

// async function sendToGsheetViaAppScripts(data) {
//   const allD = data;
//   const dat = JSON.parse(allD);
//   // fetch("http://localhost:1337/add", {
//   //   method: "POST",
//   //   headers: {
//   //     "Content-Type": "application/json",
//   //   },
//   //   body: JSON.stringify(dat),
//   // })
//   //   .then((response) => console.log(response.data))
//   //   .catch((error) => console.error(error.message));

//   var url =
//     "https://script.google.com/macros/s/AKfycbzzt7OKaDd5nZCBr7jB2EwcLMCb0sFnPPYNk9HvcmSCIZde4z-0fOKynORBBT289vAqKg/exec";

//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: dat,
//     });

//     const data = await response.json();
//     console.log(data.status);
//   } catch (error) {
//     console.error("Error:", error);
//     console.log("An error occurred");
//   }
// }
function copyText(data) {
  // Define the text you want to copy
  const textToCopy = data;

  // Create a temporary input element
  const tempInput = document.createElement("input");
  tempInput.value = textToCopy;
  document.body.appendChild(tempInput);

  // Select the text in the input element
  tempInput.select();
  tempInput.setSelectionRange(0, 99999); // For mobile devices

  // Copy the selected text to the clipboard
  document.execCommand("copy");

  // Remove the temporary input element
  document.body.removeChild(tempInput);

  // Optionally, you can display a success message
  // console.log("Text copied to clipboard:", textToCopy);
}
