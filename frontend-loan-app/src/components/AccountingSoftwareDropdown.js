import React from "react";
import { Dropdown } from "semantic-ui-react";

const options = [
  { key: "XERO", text: "XERO", value: "XERO" },
  { key: "MYOB", text: "MYOB", value: "MYOB" },
  {
    key: "More in future",
    text: "More in future",
    value: "More in future",
    disabled: true,
  },
];

const AccountingSoftwareDropdown = ({ selectedValue, onSelectionChange }) => {
  const handleDropdownChange = (event, data) => {
    onSelectionChange(data.value);
  };

  return (
    <Dropdown
      placeholder="Select Accounting Software"
      search
      selection
      options={options}
      value={selectedValue}
      onChange={handleDropdownChange}
    />
  );
};

export default AccountingSoftwareDropdown;
