import React from "react"
import {
  Button,
  Modal,
  FormControl,
  Input,
  Center
} from "native-base"

const ChangePasswordModal = ({showModal,setShowModal}) => {
    return (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Change Password</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Current password</FormControl.Label>
              <Input type="password"/>
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>New Password</FormControl.Label>
              <Input type="password"/>
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Repeat New Password</FormControl.Label>
              <Input type="password"/>
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

export default ChangePasswordModal
