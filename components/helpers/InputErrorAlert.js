import React from 'react'
import { Alert, VStack, HStack, IconButton, CloseIcon, Box, Text, Center, NativeBaseProvider } from "native-base";

const InputErrorAlert = ({message,setOpen}) => {
  return (
    <Alert w="100%" status="danger">
        <VStack space={2} flexShrink={1} w="100%">
            <HStack flexShrink={1} space={2} justifyContent="space-between">
                <HStack space={2} flexShrink={1}>
                    <Alert.Icon mt="1" />
                    <Text fontSize="md" color="coolGray.800">
                        {message}
                    </Text>
                </HStack>
                <IconButton onPress={()=>setOpen(false)} variant="unstyled" icon={<CloseIcon size="3" color="coolGray.600" />} />
            </HStack>
        </VStack>
    </Alert>
  )
}

export default InputErrorAlert