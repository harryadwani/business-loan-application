const express = require("express");
const app = express();
const port = process.env.PORT || 3003;
const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.post("/decision-engine", (req, res) => {
  try {
    const requestData = req.body;

    if (!requestData || !requestData.loanAmount || !requestData.preAssessment) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const loanAmountWithoutCommas = requestData.loanAmount.replace(/,/g, "");

    if (
      isNaN(Number(loanAmountWithoutCommas)) ||
      isNaN(Number(requestData.preAssessment))
    ) {
      return res
        .status(400)
        .json({ error: "Invalid loan amount or pre-assessment value" });
    }

    const approvedAmount = Math.floor(
      (Number(loanAmountWithoutCommas) * Number(requestData.preAssessment)) /
        100
    );

    res.status(200).json({
      message: `${requestData.preAssessment}% of the loan amount can be approved, which is Rs ${approvedAmount}`,
    });
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

app.listen(port, () => {
  console.log(`Decision engine is running on port ${port}`);
});
