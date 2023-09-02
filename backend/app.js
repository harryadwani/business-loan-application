import express from "express";
import axios from "axios";
import _ from "lodash";
import cors from "cors";

const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.status(200).send("You have reached the backend application");
});

app.get("/balance-sheet", async (req, res) => {
  try {
    const provider = _.get(req.query, "provider");

    if (!provider) {
      return res
        .status(400)
        .json({ error: "Provider query parameter is missing" });
    }

    const response = await axios.get(
      `http://accounting-software:3002/balance-sheet?provider=${provider}`
    );

    if (response.status !== 200) {
      return res
        .status(response.status)
        .json({ error: "Error fetching data from accounting software" });
    }

    const data = response.data;
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/decision-engine", async (req, res) => {
  try {
    const response = await axios.post(
      `http://decision-engine:3003/decision-engine`,
      req.body
    );

    if (response.status !== 200) {
      return res
        .status(response.status)
        .json({ error: "Error communicating with the decision engine" });
    }

    const data = response.data;
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Backend app listening on port ${PORT}`);
});
