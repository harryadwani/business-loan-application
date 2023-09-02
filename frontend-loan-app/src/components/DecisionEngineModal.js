import React from "react";
import { Button, Modal } from "semantic-ui-react";

function BalanceSheetModal({ showModal, handleCloseModal, data }) {
  return (
    <Modal open={showModal} onClose={handleCloseModal}>
      <Modal.Header>Decision Engine Results</Modal.Header>
      <Modal.Content>
        {data ? <pre>{data.message}</pre> : "Loading..."}
      </Modal.Content>

      <Modal.Actions>
        <Button onClick={handleCloseModal}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
}

export default BalanceSheetModal;
