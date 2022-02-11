import React, { useEffect, useState } from "react";
import { Text, Image, Button, Center, Modal } from "native-base";
import GreenTrash from "../../../assets/greentrash.png";
import RedDump from "../../../assets/reddump.png";
import * as Location from "expo-location";
import envs from "../../../config/env";
import MapView, { Marker } from "react-native-maps";
import { Dimensions } from "react-native";
import Firebase from "../../helpers/Firebase";
import { uuidGenerator } from "../../helpers/uuidGenerator.js";
import axios from "axios";
import MessageAlert from "../../helpers/MessageAlert";
import ActivityIndicator from "../../helpers/ActivityIndicator";
import AsyncStorage from '@react-native-async-storage/async-storage';

const db = Firebase.app().database();
const MarkDumpsterPage = () => {
  const [loading, setLoading] = useState(false);
  const [user,setUser]=useState({});
  const [dumpsters, setDumpsters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [empty, setEmpty] = useState(true);
  const [data, setData] = useState({});
  const [initLoc, setInitLoc] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  // useEffect(() => {
  //   axios
  //     .get(`${envs.BACKEND_URL}/mobile/dumpster/get-dumpsters`)
  //     .then((res) => {
  //       if (res.data.success) {
  //         var temp = res.data.data;
  //         setToFirebase(res.data.data);
  //         setEmpty(false);
  //       }
  //     });
  // }, []);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Linking.openURL("app-settings:");
        return;
      }
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
        maximumAge: 10000,
      });
      setInitLoc((prevState) => ({
        ...prevState,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }));
    })();
  }, []);
  useEffect(() => {
    getData();
    let temp = [];
    db.ref("Dumpsters/").on("value", (snapshot) => {
      for (var x = 0; x < snapshot.val().length; x++) {
        if (snapshot.val()[x] != undefined) {
          temp.push(snapshot.val()[x]);
        }
      }
      setDumpsters(temp);
      setEmpty(false);
    });

    return () => {
      setDumpsters([]);
      db.ref("Dumpsters/").off("value");
    };
  }, []);
  const getData = async () => {
    try {
        const value = await AsyncStorage.getItem('@user');
        if(value!==null){
            setUser(JSON.parse(value));
        }else{
            setUser(null);
        }
    }catch (e){
        console.log(e);
    }
  }
  const handleModal = (id) => {
    dumpsters.map((dump) => {
      if (dump.dumpster_id === id) {
        setData(dump);
      }
    });
    setShowModal(true);
  };
  const setToFirebase = (data) => {
    for (var x = 0; x < data.length; x++) {
      db.ref("Dumpsters/" + data[x].dumpster_id).set({
        dumpster_id: data[x].dumpster_id,
        street: data[x].street,
        purok: data[x].purok,
        barangay: data[x].barangay,
        town: data[x].town,
        postal_code: data[x].postal_code,
        latitude: data[x].latitude,
        longitude: data[x].longitude,
        complete: data[x].complete,
      });
    }
  };
  const handleSubmit = async (data) => {
    setShowModal(false);
    setLoading(true);
    await axios
      .put(`${envs.BACKEND_URL}/mobile/dumpster/update-dumpster/${data}`)
      .then((res) => {
        if (res.data.success) {
          db.ref("Dumpsters/" + data).update({ driver_id: user.user_id, complete: res.data.data });
          setLoading(false);
          setAlert({
            visible: true,
            message: "Dumpster has been updated",
            colorScheme: "success",
            header: "Dumpster Update",
          });
        }
      });
  };
  const [alert, setAlert] = useState({
    visible: false,
    message: null,
    colorScheme: null,
    header: null,
  });
  return (
    <>
      <MessageAlert alert={alert} setAlert={setAlert} />
      <Center
        style={{
          alignSelf: "stretch",
        }}
      >
        <MapView
          region={initLoc}
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
          }}
        >
          {dumpsters.length > 0 && !empty ? (
            dumpsters.map((dump) => {
              return (
                <Marker
                  key={uuidGenerator()}
                  coordinate={{
                    latitude: parseFloat(dump.latitude),
                    longitude: parseFloat(dump.longitude),
                  }}
                  onPress={() => handleModal(dump.dumpster_id)}
                >
                  <Image
                    size={25}
                    resizeMode={"contain"}
                    source={dump.complete == 0 ? RedDump : GreenTrash}
                    alt="Concern Photo"
                    rounded={"full"}
                  />
                  <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                    <Modal.Content maxWidth="400px">
                      <Modal.CloseButton />
                      <Modal.Header>Dumpster</Modal.Header>
                      <Modal.Body>
                        {data.complete == 0 ? (
                          <Text bold>Mark this Dumpster as Collected?</Text>
                        ) : (
                          <Text bold>Mark this Dumpster as NOT Collected?</Text>
                        )}
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
                          {data.complete == 0 ? (
                            <Button
                              colorScheme="success"
                              onPress={() => handleSubmit(data.dumpster_id)}
                            >
                              Mark
                            </Button>
                          ) : (
                            <Button
                              colorScheme="danger"
                              onPress={() => handleSubmit(data.dumpster_id)}
                            >
                              Unmark
                            </Button>
                          )}
                        </Button.Group>
                      </Modal.Footer>
                    </Modal.Content>
                  </Modal>
                </Marker>
              );
            })
          ) : (
            <></>
          )}
        </MapView>
      </Center>

      {loading ? <ActivityIndicator /> : <></>}
    </>
  );
};
export default MarkDumpsterPage;
