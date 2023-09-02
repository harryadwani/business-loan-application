import express from "express";
import data from "./mockData.json" assert { type: "json" };
import _ from "lodash";

const app = express();
const PORT = process.env.PORT || 3002;

app.get("/", (req, res) => {
  res.status(200).send("You have reached the accounting application");
});

app.get("/balance-sheet", (req, res) => {
  const provider = _.get(req.query, "provider");

  if (!provider) {
    return res
      .status(400)
      .json({ error: "Provider query parameter is missing" });
  }

  const balanceSheet = data[provider];

  if (!balanceSheet) {
    return res.status(404).json({ error: "Provider not found" });
  }

  res.status(200).json(balanceSheet);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Accounting application listening on port ${PORT}`);
});
