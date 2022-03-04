import React from 'react';
import { AlertDialog, Button, Text, Center, VStack, Row } from "native-base";
import AnimatedEllipsis from '@xlanor/react-native-animated-ellipsis';

const MessageAlert = (props) => {
  return (
    <AlertDialog isOpen={props.alert.visible} onClose={()=>props.setAlert((prevState) => ({ ...prevState, visible: false }))}>
        <AlertDialog.Content>
            {props.alert.hasOwnProperty('getCoordinates') && props.alert.getCoordinates ? (<></>):(<AlertDialog.CloseButton />)}
            {props.alert.hasOwnProperty('getCoordinates') && props.alert.getCoordinates ? (<></>):(<AlertDialog.Header>{props.alert.header}</AlertDialog.Header>)}
            <AlertDialog.Body>
              {props.alert.hasOwnProperty('getCoordinates') && props.alert.getCoordinates ? (<Center>
                <Row><Text>{props.alert.message}</Text></Row>
                <Row marginTop={10} marginRight={5}><Text><AnimatedEllipsis numberOfDots={4}
                  minOpacity={0.4}
                  animationDelay={50}
                  style={{
                    color: '#10b981',
                    fontSize: 100,
                    letterSpacing: -15,
                  }}/></Text></Row>
              </Center>):(props.alert.message)}
            </AlertDialog.Body>
            {props.alert.hasOwnProperty('getCoordinates') && props.alert.getCoordinates ? (<></>):(<AlertDialog.Footer>
                <Button.Group space={2}>
                  <Button colorScheme={props.alert.colorScheme} onPress={()=>props.setAlert((prevState) => ({ ...prevState, visible: false }))}>
                    Okay
                  </Button>
                </Button.Group>
            </AlertDialog.Footer>)}
            
        </AlertDialog.Content>
    </AlertDialog>
  );
};

export default MessageAlert;