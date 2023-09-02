import React, { useState } from "react";
import { Button, Checkbox, Form, Input, Label } from "semantic-ui-react";
import AccountingSoftwareDropdown from "./AccountingSoftwareDropdown";
import BalanceSheetModal from "./BalanceSheetModal";
import axios from "axios";

const BusinessDetailsForm = () => {
  const [formData, setFormData] = useState({
    businessName: "Example Business Name",
    yearEstablished: "2002",
    loanAmount: "1,00,000",
  });

  const [selectedAccountingSoftware, setSelectedAccountingSoftware] =
    useState("XERO");

  const [showModal, setShowModal] = useState(false);
  const [balanceSheetData, setBalanceSheetData] = useState(null);
  const [isConditionsChecked, setIsConditionsChecked] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxClick = (event, data) => {
    setIsConditionsChecked(data.checked);
  };

  const handleGetBalanceSheet = async (provider) => {
    try {
      setShowModal(true);
      const response = await axios.get(
        `http://localhost:3001/balance-sheet?provider=${provider}`
      );
      setBalanceSheetData(response.data);
    } catch (error) {
      console.error("Error fetching balance sheet:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setBalanceSheetData(null);
  };

  return (
    <>
      <h2>Fill Business Details</h2>
      <Form size="big">
        <Form.Field>
          <label>Business Name</label>
          <input
            placeholder="Business Name"
            name="businessName"
            value={formData.businessName}
            onChange={handleInputChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Year Established</label>
          <input
            placeholder="Year Established"
            name="yearEstablished"
            value={formData.yearEstablished}
            onChange={handleInputChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Loan Amount</label>
          <Input labelPosition="right" type="text" placeholder="Amount">
            <Label basic>Rs.</Label>
            <input
              placeholder="Loan Amount"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleInputChange}
            />
            <Label>.00</Label>
          </Input>
        </Form.Field>
        <Form.Field>
          <label>Select Accounting Provider</label>
          <AccountingSoftwareDropdown
            selectedValue={selectedAccountingSoftware}
            onSelectionChange={setSelectedAccountingSoftware}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label="I agree to the Terms and Conditions"
            name="isConditionsChecked"
            checked={isConditionsChecked}
            onChange={handleCheckboxClick}
          />
        </Form.Field>
        <Button
          disabled={!isConditionsChecked}
          type="submit"
          onClick={() => handleGetBalanceSheet(selectedAccountingSoftware)}
        >
          Request Balance Sheet
        </Button>

        <BalanceSheetModal
          showModal={showModal}
          handleCloseModal={handleCloseModal}
          balanceSheetData={balanceSheetData}
          formData={formData}
        />
      </Form>
    </>
  );
};

export default BusinessDetailsForm;
