import React from 'react'
import {
    Text,
    Center,
    VStack,
    HStack,
    Container,
    Divider,
    Icon,
    Box
  } from "native-base";
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { MaterialIcons } from "@expo/vector-icons";


const SchedulePage = () => {
    return (
        <Center
        >
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
                            Tuesday, January 4, 2022
                        </Text>
                        <Divider
                            style={{
                                alignSelf:'stretch',
                            }}
                            bg={'gray.500'}
                        />
                        <HStack space={3}>
                            <Icon
                                as={<MaterialIcons name="info" />}
                                size={25}
                                color={'#10b981'}
                            />
                            <Text>
                                [Poblacion] Garbage Collection Day
                            </Text>
                        </HStack>
                        <HStack space={3}>
                            <Icon
                                as={<MaterialIcons name="schedule" />}
                                size={25}
                                color={'#10b981'}
                            />
                            <Text>
                                All day
                            </Text>
                        </HStack>
                        <HStack space={3}>
                            <Icon
                                as={<MaterialIcons name="notes" />}
                                size={25}
                                color={'#10b981'}
                            />
                            <Text>
                                Biodegradable waste only
                            </Text>
                        </HStack>
                    </VStack>
                </Box>
            </Box>
        </Center>
    )
}

export default SchedulePage
