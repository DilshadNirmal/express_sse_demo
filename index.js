import express from "express";
import cors from "cors";
import dataRouter from "./routes/data.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/api", dataRouter);

app.listen(PORT, () => {
  console.log(`POC for realtime backend update: http://localhost:${PORT}`);
});
