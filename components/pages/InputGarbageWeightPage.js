import React, { useState } from "react";
import {
  Text,
  Image,
  Button,
  Center,
  Input,
  ScrollView,
  Select,
  Icon,
  CheckIcon,
  TextArea,
  Stack,
  VStack,
  View,
  HStack,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import GtrackMainLogo from "../../assets/gtrack-logo-1.png";
import DateTimePicker from "@react-native-community/datetimepicker";
import { fontSize, padding } from "styled-system";
import { Platform } from "react-native";

const InputGarbageWeightPage = () => {
  const [date, setDate] = useState("");
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [curShow, setCurShow] = useState("");

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    console.log(new Date(currentDate).toISOString());
    if(curShow === "date"){
      setDate(currentDate.toISOString().split('T')[0]);
    }else if(curShow === "StartTime"){
      setStartTime(currentDate.toString().substring(16,21));
    }else{
      setEndTime(currentDate.toString().substring(16,21));
    }
    
    console.log(Platform.OS);
    console.log(date);
  };

  const showMode = (currentMode) => {
    setShow(true);
    if(currentMode === "StartTime" || currentMode === "EndTime"){
      setMode("time");
      setCurShow(currentMode);
    }else{
      setMode(currentMode);
      setCurShow(currentMode);
    }
  
    
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showStartTimepicker = () => {
    showMode("StartTime");
  };
  const showEndTimepicker = () => {
    showMode("EndTime");
  };
  return (
    <View>
      <ScrollView>
        <Center>
          <Image
            size={230}
            borderRadius="md"
            resizeMode={"contain"}
            source={GtrackMainLogo}
            alt="GTrack Logo"
          />
        </Center>
        <VStack
          marginLeft={3}
          marginRight={3}
          marginTop={2}
          marginBottom={2}
          shadow={2}
          borderRadius="sm"
          backgroundColor="white"
        >
          <Center px={5} mt={10}>
            <Stack space={3} style={{ alignSelf: "stretch" }}>
              <HStack>
                <VStack paddingRight={5}>
                <Input size="md" width={120} bg={"white"} value={date.toString()} placeholder="Date" isReadOnly="true" isDisabled="true"/>
                </VStack>
                <VStack paddingRight={2}>
                <Input size="sm" bg={"white"} value={startTime.toString()} placeholder="Start Time" isReadOnly="true" isDisabled="true"/>
                </VStack>
                <VStack>
                <Input size="sm" bg={"white"} value={endTime.toString()} placeholder="End Time" isReadOnly="true" isDisabled="true"/>
                </VStack>
              </HStack>
              
              <Center>
                <HStack>
                  <VStack paddingRight={15} marginLeft={2}>
                    <Button
                      onPress={showDatepicker}
                      bgColor="#10b981"
                      title="Show date picker!"
                    >
                      Date
                    </Button>
                  </VStack>
                  <VStack paddingRight={2}>
                    <Button
                      onPress={showStartTimepicker}
                      bgColor="#10b981"
                      title="Show time picker!"
                    >
                      Start Time
                    </Button>
                  </VStack>
                  <VStack>
                    <Button
                      onPress={showEndTimepicker}
                      bgColor="#10b981"
                      title="Show time picker!"
                    >
                      End Time
                    </Button>
                  </VStack>
                </HStack>
              </Center>

              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={new Date()}
                  mode={mode}
                  is24Hour={false}
                  display="default"
                  onChange={onChange}
                />
              )}

              <Select
                accessibilityLabel="Choose Collection Route"
                placeholder="Choose Collection Route"
                _selectedItem={{
                  bg: "success.500",
                  endIcon: <CheckIcon size="5" />,
                }}
                dropdownIcon={
                  <Icon
                    as={<MaterialIcons name="unfold-more" />}
                    color={"#10b981"}
                    size={7}
                  />
                }
                style={{
                  borderWidth: 1,
                  borderColor: "#10b981",
                }}
                onValueChange={(itemValue) => console.log(itemValue)}
              >
                <Select.Item
                  label="Municipal Grounds"
                  value="Municipal Grounds"
                />
                <Select.Item label="Market" value="Market" />
                <Select.Item label="School SCI-TECH" value="School SCI-TECH" />
              </Select>
              <Input
                size="md"
                placeholder="Input Weight Volume Here..."
                bg={"white"}
              />
            </Stack>
            <Button
              bgColor={"#f43f5e"}
              mt={5}
              mb={2}
              leftIcon={
                <Icon
                  as={<MaterialIcons name="send" />}
                  color={"white"}
                  size={5}
                />
              }
            >
              Submit
            </Button>
          </Center>
        </VStack>
      </ScrollView>
    </View>
  );
};
export default InputGarbageWeightPage;
