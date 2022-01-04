import React, { useState } from "react";
import {
  Modal,
  FormControl,
  Input,
  Center,
  Text,
  Row,
  ScrollView,
  VStack,
  Button,
  View,
  Column,
  Icon,
} from "native-base";
import { StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import GtrackMainLogo from "../../assets/gtrack-logo-1.png";
import GoogleIcon from "../../assets/google-icon.png";
import { SliderBox } from "react-native-image-slider-box";

const EventModal = (props) => {
  return (
    <>
      <Modal isOpen={props.showModal} onClose={() => props.setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header><Text bold>{props.title}</Text></Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Name</FormControl.Label>
              <Input />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Email</FormControl.Label>
              <Input />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowModal(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onPress={() => {
                  setShowModal(false);
                }}
              >
                Join
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default EventModal;
