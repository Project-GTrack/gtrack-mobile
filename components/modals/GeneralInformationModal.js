import React,{useState} from "react"
import {
  Button,
  Modal,
  FormControl,
  Input,
  Center,
  VStack,
  Icon,
  HStack
} from "native-base"
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { MaterialIcons } from "@expo/vector-icons"

const GeneralInformationModal = ({showModal,setShowModal}) => {
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date(moment()));
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };
    return (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>General Information</Modal.Header>
          <Modal.Body>
              <Center  style={{alignSelf:'stretch'}}>
                  <HStack space={1}>
                    <Input value="John" style={{alignSelf:'stretch',width:'50%'}}/>
                    <Input value="Snow" style={{alignSelf:'stretch',width:'50%'}}/>
                  </HStack>
                  <Input value="johnsnow@gmail.com" isDisabled mt={2} style={{alignSelf:'stretch'}}/>
                  <Input value="09123456789" mt={2} style={{alignSelf:'stretch'}}/>
                  <Button 
                    leftIcon={ <Icon
                        as={<MaterialIcons name="cake" />}
                        color={'white'}
                        size={5}
                    />} 
                    colorScheme="success"
                    onPress={()=>setShow(true)} 
                    mt={2} 
                    style={{alignSelf:'stretch'}}
                  >
                    {moment(date).format('MMMM DD, YYYY')}
                  </Button>
                  {show && (
                    <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={'date'}
                    display="default"
                    onChange={onChange}
                    />
                )}
              </Center>
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

export default GeneralInformationModal
