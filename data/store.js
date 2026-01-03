import { createObjectCsvWriter } from "csv-writer";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";

const csvFile = join(
  new URL("./../data/dashboard.csv", import.meta.url).pathname
);
const csvWriter = createObjectCsvWriter({
  path: csvFile,
  header: [
    { id: "id", title: "ID" },
    { id: "sensor", title: "Sensor" },
    { id: "value", title: "Value" },
    { id: "timestamp", title: "Timestamp" },
  ],
  append: true,
});

const saveData = async (data) => {
  const dataDir = dirname(csvFile);
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir);
  }

  const record = {
    id: Date.now(),
    sensor: data.sensor || Object.keys(data)[0],
    value: data.value || Object.values(data)[0],
    timestamp: new Date().toISOString(),
  };

  await csvWriter.writeRecords([record]);
  return record;
};

export default saveData;
