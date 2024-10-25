function scrapeInstagramProfile() {
  let name = "null";
  //   const username = window.location.pathname.split("/")[1];
  let username = "null";
  let profileLink = window.location.href;
  profileLink = profileLink.includes("/followers/")
    ? profileLink.split("/followers")[0]
    : profileLink;
  const bio = document.querySelector(
    "._ap3a._aaco._aacu._aacx._aad7._aade"
  ).innerText;
  let websiteLinks = [];
  let bioHtml = document.querySelector(".x3nfvp2.x193iq5w");
  let bioURLS = document.querySelector(
    ".x7r02ix.xf1ldfh.x131esax.xdajt7p.xxfnqb6.xb88tzc.xw2csxc.x1odjw0f.x5fp0pe"
  );

  const allBioURLS = bioHtml && bioURLS ? bioURLS : bioHtml ? bioHtml : null;

  // Extract all anchor tags
  if (allBioURLS) {
    const anchorTags = allBioURLS.getElementsByTagName("a");

    // Iterate through all anchor tags and log the href attribute
    for (let i = 0; i < anchorTags.length; i++) {
      instagramRedirectUrl = anchorTags[i].href;
      const url = new URL(instagramRedirectUrl);
      const params = new URLSearchParams(url.search);

      // Extract the 'u' parameter which contains the encoded original URL
      const originalUrl = params.get("u");

      // Decode the URL
      const decodedUrl = decodeURIComponent(originalUrl);

      websiteLinks.push(decodedUrl);
      // websiteLinks.push(`=HYPERLINK("${decodedUrl}", "${decodedUrl}")`);
      //   console.log(decodedUrl);
    }
  }
  let elem = document.querySelectorAll("._ac2a._ac2b");
  const ele = elem ? document.querySelectorAll("._ac2a") : elem;

  const postsCount = parseInt(ele[0].innerText.replaceAll(",", ""));

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
      profileData.username = cont.split("(@")[1].replace(")", "");
      name = profileData.name;
      username = profileData.username;
    }
    if (meta.getAttribute("property") === "og:description") {
      profileData.description = meta.getAttribute("content");
    }
    if (meta.getAttribute("property") === "og:image") {
      profileData.profileImage = meta.getAttribute("content");
    }
  }
  username = document.querySelector(
    ".x78zum5.x193iq5w.x6ikm8r.x10wlt62"
  ).innerText;
  name = document.querySelector(
    ".x1lliihq.x1plvlek.xryxfnj.x1n2onr6.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1i0vuye.xvs91rp.x1s688f.x5n08af.x10wh9bi.x1wdrske.x8viiok.x18hxmgj"
  ).innerText;
  websiteLinks = websiteLinks.toString().replaceAll(",", "\n");
  username = `=HYPERLINK("${profileLink}", "${username}")`;
  const allData = {
    name,
    username,
    profileLink,
    bio,
    websiteLinks,
    followersCount,
    postsCount,
    email,
    phone,
  };
  copyText(JSON.stringify(allData, null, 2));
  send(JSON.stringify(allData, null, 2));
  return allData;
}

function send(data) {
  const allD = data;
  const dat = JSON.parse(allD);
  fetch("http://localhost:1337/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dat),
  })
    .then((response) => console.log(response.data))
    .catch((error) => console.error(error.message));
}
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
  console.log("Text copied to clipboard:", textToCopy);
}

scrapeInstagramProfile();
