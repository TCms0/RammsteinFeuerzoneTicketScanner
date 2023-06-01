var axios = require("axios");
var TelegramToken = config.TelegramToken;
var ChatId = config.ChatId;
const TelegramBot = require("node-telegram-bot-api");
var SentUrs = [];
const bot = new TelegramBot(TelegramToken, { polling: true });

console.log("Checking for Tickets...");
StartChecking();
//Rerun Script every 30 seconds
setInterval(function () {
  process.stdout.write(".");
  StartChecking();
}, 30000);

// Function to start checking
async function StartChecking() {
  try {
    var TicketData = await GetTicketData();
    var Handle = await HandleData(TicketData);
  } catch (error) {
    console.log(error);
  }
}

function GetTicketData() {
  var config = {
    method: "get",
    url: "https://www.fansale.nl/fansale/json/offer?groupEventId=15803282&maxResults=2500&dataMode=evdetails&addPrerenderedList=false&_=1685638131914",
    headers: {
      Accept: "application/json, text/javascript, */*; q=0.01",
      "Accept-Language": "nl-NL,nl;q=0.9,en-US;q=0.8,en;q=0.7",
      Connection: "keep-alive",
      Referer: "https://www.fansale.nl/fansale/tickets/rock-amp-pop/rammstein/74176/15803282",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 OPR/98.0.0.0",
      "X-Requested-With": "XMLHttpRequest",
    },
  };
  return new Promise((resolve, reject) => {
    axios(config)
      .then(function (response) {
        var Data = response.data;
        return resolve(Data);
      })
      .catch(function (error) {
        console.log(error);
      });
  });
}

function HandleData(TicketData) {
  try {
    for (Ticket of TicketData.offers) {
      for (TicketType of Ticket.tickets) {
        if (TicketType.locationInfo != "STAANPLAATS" && TicketType.locationInfo.includes("TRIBUNE") == false) {
          var URL = "https://www.fansale.nl/fansale" + Ticket.offerUrl;
          if (SentUrs.includes(URL) == false) {
            SentUrs.push(URL);
            TelegramBotSend(TelegramToken, ChatId, URL);
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function TelegramBotSend(Tgtoken, ChatId, URL) {
  if (Tgtoken == undefined) {
    console.log("Starting Tg Bot...");
  } else {
    datenow = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
    bot.sendMessage(ChatId, "FEUERZONE Ticket Beschikbaar " + `\n` + "URL:" + URL);
  }
}
