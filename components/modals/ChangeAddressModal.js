import React from "react"
import {
  Button,
  Modal,
  FormControl,
  Input,
  Center
} from "native-base"

const ChangeAddressModal = ({showModal,setShowModal}) => {
    return (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Change Address</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Purok</FormControl.Label>
              <Input />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Street</FormControl.Label>
              <Input />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Barangay</FormControl.Label>
              <Input />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowModal(false)
                }}
              >
                Cancel
              </Button>
              <Button
                onPress={() => {
                  setShowModal(false)
                }}
              >
                Update
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    )
}

export default ChangeAddressModal
