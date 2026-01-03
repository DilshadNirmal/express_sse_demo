import express from "express";
import { writeFileSync } from "fs";
import { join } from "path";

const dataRouter = express.Router();
let clients = new Set();

dataRouter.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  const sendData = (data) => {
    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  };

  clients.add(sendData);

  req.on("close", () => {
    clients.delete(sendData);
  });

  req.on("error", () => {
    clients.delete(sendData);
  });
});

dataRouter.post("/data", (req, res) => {
  try {
    const data = req.body;
    console.log("recieved data", data);

    // sending data  via sse
    clients.forEach((sendData) => {
      try {
        sendData(data);
      } catch (e) {}
    });

    // here comes the part to save in db
    const filePath = join(process.cwd(), "data.json");
    writeFileSync(filePath, JSON.stringify(data, null, 2));

    res.json({ saved: true });
  } catch (error) {
    console.log(`error occured during storing data in db: ${error}`);
    res.status(500).json({ error: "Failed to save data" });
  }
});

export default dataRouter;
