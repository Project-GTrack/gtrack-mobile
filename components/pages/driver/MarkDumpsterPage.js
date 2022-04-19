import React, { useEffect, useState } from "react";
import { Text, Image, Button, Modal, View } from "native-base";
import GreenTrash from "../../../assets/dumpster_complete_icon.png";
import RedDump from "../../../assets/dumpster_marker_icon.png";
import envs from "../../../config/env";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Firebase from "../../helpers/Firebase";
import { uuidGenerator } from "../../helpers/uuidGenerator.js";
import axios from "axios";
import { Dimensions } from "react-native";
import MessageAlert from "../../helpers/MessageAlert";
import ActivityIndicator from "../../helpers/ActivityIndicator";
import AsyncStorage from '@react-native-async-storage/async-storage';

const db = Firebase.app().database();
const MarkDumpsterPage = () => {
  const { height, width } = Dimensions.get( 'window' );
  const LATITUDE_DELTA=0.23;
  const [loading, setLoading] = useState(false);
  const [user,setUser]=useState({});
  const [dumpsters, setDumpsters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState({});
  const [marginBottom,setMarginBottom]=useState(1);
  const [initLoc, setInitLoc] = useState({
    latitude: 10.4659,
    longitude: 123.9806,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LATITUDE_DELTA * (width / height),
  });
  const [alert, setAlert] = useState({
    visible: false,
    message: null,
    colorScheme: null,
    header: null,
  });
  useEffect(() => {
    getData();
    getDumpsters();
  }, []);
  const getDumpsters = async () =>{
    await db.ref("Dumpsters/").on("value", (snapshot) => {
      if(snapshot.val()){
        let temp=Object.keys(snapshot.val()).map(key => snapshot.val()[key]);
        setDumpsters(temp);
      }else{
        setDumpsters([]);
      }
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
          initialRegion={initLoc}
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
