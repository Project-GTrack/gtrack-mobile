import React, { useEffect, useState } from "react";
import { Text, Image, Button, Center, Modal, View } from "native-base";
import GreenTrash from "../../../assets/dumpster_complete_icon.png";
import RedDump from "../../../assets/dumpster_marker_icon.png";
// import * as Location from "expo-location";
import envs from "../../../config/env";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
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
  const [data, setData] = useState({});
  const [marginBottom,setMarginBottom]=useState(1);
  const [alert, setAlert] = useState({
    visible: false,
    message: null,
    colorScheme: null,
    header: null,
  });
  useEffect(() => {
    axios
      .get(`${envs.BACKEND_URL}/mobile/dumpster/get-dumpsters`)
      .then((res) => {
        if (res.data.success) {
          setToFirebase(res.data.data);
        }
      });
  }, []);
  useEffect(() => {
    getData();
    getDumpsters();
  }, []);
  const getDumpsters = () =>{
    db.ref("Dumpsters/").on("value", (snapshot) => {
      let temp = [];
      for (var x = 0; x < snapshot.val().length; x++) {
        if (snapshot.val()[x] != undefined) {
          temp.push(snapshot.val()[x]);
        }
      }
      setDumpsters(temp);
    });
  }
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
    if(user.hasOwnProperty("userSchedule")){
      dumpsters.map((dump) => {
        if (dump.dumpster_id === id) {
          setData(dump);
        }
      });
    }
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
  return (
    <>
     <View>
      <MessageAlert alert={alert} setAlert={setAlert} />
        <MapView
          showsUserLocation={true}
          showsMyLocationButton={true}
          provider={PROVIDER_GOOGLE}
          onMapReady={()=>setMarginBottom(0)}
          style={{
            width: '100%',
            height: '100%',
            marginBottom:marginBottom
          }} 
        >
          {dumpsters && dumpsters.length > 0 ? (
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
                    alt="Dumpster Marker"
                    rounded={"full"}
                  />
                  <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                    <Modal.Content maxWidth="400px">
                      <Modal.CloseButton />
                      <Modal.Header>Dumpster</Modal.Header>
                      <Modal.Body>
                        {user && user.hasOwnProperty("userSchedule") ? (
                          data.complete == 0 ? (
                            <Text bold>Mark this Dumpster as Collected?</Text>
                          ) : (
                            <Text bold>Mark this Dumpster as NOT Collected?</Text>
                          )
                        ):(<Text bold>You have no scheduled collection today</Text>)}
                        
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
                          {user && user.hasOwnProperty("userSchedule") ? (
                            data.complete == 0 ? (
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
                            )
                          ):(<Button
                            colorScheme="primary"
                            onPress={() => setShowModal(false)}
                          >
                            Okay
                          </Button>)}
                          
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
      </View>
      {loading ? <ActivityIndicator /> : <></>}
    </>
  );
};
export default MarkDumpsterPage;
