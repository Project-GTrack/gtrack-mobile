import React, { useCallback, useEffect, useState } from 'react'
import {
    Text,
    Center,
    VStack,
    HStack,
    Container,
    Divider,
    Icon,
    Box,
    ScrollView
  } from "native-base";
import {Calendar} from 'react-native-calendars';
import { MaterialIcons } from "@expo/vector-icons";
import envs from '../../config/env.js'
import axios from 'axios';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { RefreshControl } from "react-native";

const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};
  
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const SchedulePage = () => {
    const [refreshing, setRefreshing] = useState(true);
    const [date,setDate]=useState(moment());
    const [schedule,setSchedule]=useState([]);
    const [details,setDetails]=useState([]);
    const [mark,setMark]=useState({});
    const [user,setUser]=useState(null);
    let markTemp={};
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        axios.get(`${envs.BACKEND_URL}/mobile/schedule/display`)
        .then(res => {
            if(res.data.success){
                setSchedule(res.data.data.schedule);
                markTemp={};
                res.data.data.markedDate.map((date)=>{
                    markTemp[date]={
                        selected: true,
                        marked: true,
                        selectedColor: "#10b981",
                    };
                })
                setMark(markTemp);
                setRefreshing(false);
            }
        })
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
    useEffect(() => {
        getData();
        axios.get(`${envs.BACKEND_URL}/mobile/schedule/display`)
        .then(res => {
            if(res.data.success){
                setSchedule(res.data.data.schedule);
                res.data.data.markedDate.map((date)=>{
                    markTemp[date]={
                        selected: true,
                        marked: true,
                        selectedColor: "#10b981",
                    };
                })
                setMark(markTemp);
            }
        })
    }, []);
    useEffect(() => {
        handleOnDayPress({dateString:moment().format('YYYY-MM-DD')});
        if (schedule) {
            setRefreshing(false);
        } else {
        wait(2000).then(() => setRefreshing(false));
        }
    }, [schedule]);
    
    const handleOnDayPress=(day)=>{
        let temp=[];
        setDate(day.dateString);
        schedule.map((sched)=>{
            if(sched.date===day.dateString){
                temp.push(sched);
            }
        })
        if(temp.length>0){
            setDetails([...temp]);
        }else{
            setDetails([]);
        }
    }
    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#10b981"]}
                />
            }
        >
            <Center>
                <Box
                    style={{
                        alignSelf:'stretch',
                        height:'100%'
                    }}
                >
                    <Calendar 
                        style={{
                            alignSelf:'stretch',
                        }}
                        markedDates={mark}
                        enableSwipeMonths={false}
                        disableArrowLeft={true}
                        disableArrowRight={true}
                        onDayPress={handleOnDayPress}
                        disableMonthChange={true}
                        hideExtraDays={true}
                    />
                    <Box 
                        bg={'gray.100'}
                        style={{
                            alignSelf:'stretch',
                            height:'100%'
                        }}
                    >
                        <VStack p={4} space={3}>
                            <Text
                                style={{
                                    fontSize:17
                                }}
                            >
                                {moment(date).format("dddd, MMMM Do YYYY")}
                            </Text>
                            <Divider
                                style={{
                                    alignSelf:'stretch',
                                }}
                                bg={'gray.500'}
                            />
                            {details.length !==0 || <Text>No collection schedule</Text>}
                            {
                                details.map((item,i)=>{
                                    return (
                                        <VStack space={3} p={3} shadow={"3"} rounded={"md"} key={i} bg={'white'}>
                                            <HStack space={3}>
                                                <Icon
                                                    as={<MaterialIcons name="info" />}
                                                    size={25}
                                                    color={'#10b981'}
                                                />
                                                <VStack>
                                                <Text>
                                                    [{item.details.barangay}] Garbage Collection Day
                                                </Text>
                                                <Text>
                                                    {item.details.landmark}
                                                </Text>
                                                </VStack>
                                            </HStack>
                                            {user&&user.user_type==="Driver" && 
                                                <HStack space={3}>
                                                    <Icon
                                                        as={<MaterialIcons name="local-shipping" />}
                                                        size={25}
                                                        color={'#10b981'}
                                                    />
                                                    <Text>
                                                        {item.details.scheduleDriver.fname+" "+item.details.scheduleDriver.lname}
                                                    </Text>
                                                </HStack>
                                            }
                                            <HStack space={3}>
                                                <Icon
                                                    as={<MaterialIcons name="schedule" />}
                                                    size={25}
                                                    color={'#10b981'}
                                                />
                                                <Text>
                                                    {moment(item.start_time).format("hh:mm A")+"-"+moment(item.end_time).format("hh:mm A")}
                                                </Text>
                                            </HStack>
                                            <HStack space={3}>
                                                <Icon
                                                    as={<MaterialIcons name="notes" />}
                                                    size={25}
                                                    color={'#10b981'}
                                                />
                                                <Text style={{textTransform: 'uppercase'}}>
                                                    {item.details.garbage_type}
                                                </Text>
                                            </HStack>
                                        </VStack>
                                    );
                                })
                            }
                        </VStack>
                    </Box>
                </Box>
            </Center>
        </ScrollView>
    )
}

export default SchedulePage
