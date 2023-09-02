import React, { useState } from "react";
import { Button, Table, Modal } from "semantic-ui-react";
import DecisionEngineModal from "./DecisionEngineModal";
import axios from "axios";

function BalanceSheetModal({
  showModal,
  handleCloseModal,
  balanceSheetData,
  formData,
}) {
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decision, setDecision] = useState(null);
  const handleCloseDecisionModal = () => {
    setShowDecisionModal(false);
    setDecision(null);
  };

  const handleSendDecisionEngine = () => {
    setShowDecisionModal(true);
    const profitLossSummary = {};

    balanceSheetData.forEach((entry) => {
      const year = entry.year;
      const profitOrLoss = entry.profitOrLoss;

      if (!profitLossSummary[year]) {
        profitLossSummary[year] = 0;
      }

      profitLossSummary[year] += profitOrLoss;
    });

    const currentDate = new Date();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(currentDate.getMonth() - 11);

    // Filter the data for the last 12 months
    const last12MonthsData = balanceSheetData.filter((entry) => {
      const entryDate = new Date(entry.year, entry.month - 1);
      return entryDate >= twelveMonthsAgo && entryDate <= currentDate;
    });

    const totalAssetsLast12Months = last12MonthsData.reduce((total, entry) => {
      return total + entry.assetsValue;
    });

    let preAssessment = "20";
    if (totalAssetsLast12Months / 12 > formData.loanAmount) {
      preAssessment = "100";
    } else {
      const totalProfitLast12Months = last12MonthsData.reduce(
        (total, entry) => {
          return total + entry.profitOrLoss;
        },
        0
      );
      if (totalProfitLast12Months > 0) {
        preAssessment = "60";
      }
    }

    const postData = {
      businessName: formData.businessName,
      yearEstablished: formData.yearEstablished,
      loanAmount: formData.loanAmount,
      profitLossSummary,
      preAssessment,
    };

    axios
      .post("http://localhost:3001/decision-engine", postData)
      .then((res) => setDecision(res.data))
      .catch((error) => console.log(error));
  };

  return (
    <>
      <Modal open={showModal} onClose={handleCloseModal}>
        <Modal.Header>Balance Sheet</Modal.Header>
        <Modal.Content>
          {balanceSheetData ? (
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Year</Table.HeaderCell>
                  <Table.HeaderCell>Month</Table.HeaderCell>
                  <Table.HeaderCell>Profit or Loss</Table.HeaderCell>
                  <Table.HeaderCell>Assets Value</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {balanceSheetData.map((item, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{item.year}</Table.Cell>
                    <Table.Cell>{item.month}</Table.Cell>
                    <Table.Cell>{item.profitOrLoss}</Table.Cell>
                    <Table.Cell>{item.assetsValue}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : (
            "Loading..."
          )}
        </Modal.Content>

        <Modal.Actions>
          <Button onClick={handleCloseModal}>Close</Button>
          <Button onClick={handleSendDecisionEngine}>
            Send to Decision Engine
          </Button>
        </Modal.Actions>
      </Modal>
      <DecisionEngineModal
        showModal={showDecisionModal}
        handleCloseModal={handleCloseDecisionModal}
        data={decision}
      />
    </>
  );
}

export default BalanceSheetModal;
