// index.js
// This is our main server file

// include express
const express = require("express");
// create object to interface with express
const app = express();
const fetch = require("cross-fetch");
// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})

// No static server or /public because this server
// is only for AJAX requests

app.get("/query/getResponse", (req, res, next) => {
  console.log("Received GET request from React server");
  res.json({msg: "Here is your response!"});
});

app.get("/query/getCDECData", async (req, res, next) => {
  console.log("Received /getCDECData request from React server");
  
  const month = req.query.month;
  const year = req.query.year;
  // const month = 4;
  // const year = 2022;
  let waterData = await getWaterData(month, year);
  res.json(waterData);
  
  // res.json({msg: "Here is your response!"});
});

// respond to all AJAX querires with this message
app.use(function(req, res, next) {
  res.json({msg: "No such AJAX request"});
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});

async function getWaterData(month, year) {
  const apiUrl =  `https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=SHA,ORO,CLE,NML,SNL,DNP,BER&SensorNums=15&dur_code=M&Start=${year}-${month}&End=${year}-${month}`;
  // send it off
  let fetchResponse = await fetch(apiUrl);
  let data = await fetchResponse.json()
  return data;
}