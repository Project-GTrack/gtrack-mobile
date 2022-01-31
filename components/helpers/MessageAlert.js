import React from 'react';
import { AlertDialog, Button } from "native-base";

const MessageAlert = ({alert,setAlert}) => {
  return (
    <AlertDialog isOpen={alert.visible} onClose={()=>setAlert((prevState) => ({ ...prevState, visible: false }))}>
        <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>{alert.header}</AlertDialog.Header>
            <AlertDialog.Body>
                {alert.message}
            </AlertDialog.Body>
            <AlertDialog.Footer>
                <Button.Group space={2}>
                  <Button colorScheme={alert.colorScheme} onPress={()=>setAlert((prevState) => ({ ...prevState, visible: false }))}>
                    Okay
                  </Button>
                </Button.Group>
            </AlertDialog.Footer>
        </AlertDialog.Content>
    </AlertDialog>
  );
};

export default MessageAlert;