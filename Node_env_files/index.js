const express = require("express");
const { google } = require("googleapis");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/add", async (req, res) => {
  let {
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
  } = req.body;
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  // const spreadsheetId = "1W_mLKf1mTAF0lqWvuhT7SvU0rk9dVD2rH1BqpIVsTA0";
  const spreadsheetId = "1MUPZY66yt1oLTiBwmk-hXlx2Ch2h6QtcUSL1ARzj8_A";

  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1!A:N",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [
        [
          0,
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
        ],
      ],
    },
  });

  //   values: [[request, name, sambar]],
  res.send("Successfully submitted! Thank you!");
});

app.listen(1337, (req, res) => console.log("running on 1337"));
