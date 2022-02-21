import React, { useEffect, useState } from 'react'
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
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { MaterialIcons } from "@expo/vector-icons";
import envs from '../../config/env.js'
import axios from 'axios';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SchedulePage = () => {
    const [date,setDate]=useState(moment());
    const [schedule,setSchedule]=useState([]);
    const [details,setDetails]=useState([]);
    const [mark,setMark]=useState({});
    const [user,setUser]=useState(null);
    let markTemp={};
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
        <ScrollView>
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
