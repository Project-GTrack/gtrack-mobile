import React from "react";
import { Text, Center, VStack, HStack } from "native-base";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const Shimmer = (props) => {
  return (
    <>
      {props.type === "announcements" ? (
        <VStack
          marginLeft={3}
          marginRight={3}
          marginTop={2}
          marginBottom={2}
          shadow={2}
          borderRadius="sm"
          backgroundColor="white"
        >
          <HStack alignItems="center" px={4} pt={4}>
            <ShimmerPlaceholder
              width={50}
              height={50}
              shimmerStyle={{ borderRadius: 100 }}
            />
            <VStack ml={2} space={2}>
              <Text>
                <ShimmerPlaceholder
                  shimmerStyle={{ borderRadius: 10, marginTop: 2 }}
                  width={150}
                />{" "}
                {"\n"}
                <ShimmerPlaceholder
                  shimmerStyle={{ borderRadius: 10, marginTop: 2 }}
                  width={50}
                />
              </Text>
            </VStack>
          </HStack>

          <VStack px={4} pt={5} pb={5}>
            <ShimmerPlaceholder
              shimmerStyle={{ borderRadius: 10, marginTop: 2 }}
              width={300}
            />
            <ShimmerPlaceholder
              shimmerStyle={{ borderRadius: 10, marginTop: 16 }}
              width={150}
            />
            <ShimmerPlaceholder
              shimmerStyle={{ borderRadius: 10, marginTop: 8 }}
              width={50}
            />
          </VStack>
          <Center height={200}>
            <ShimmerPlaceholder width={336} height={200} />
          </Center>
        </VStack>
      ) : (
        <VStack
          marginLeft={3}
          marginRight={3}
          marginTop={2}
          marginBottom={2}
          shadow={2}
          borderRadius="sm"
          backgroundColor="white"
        >
          <ShimmerPlaceholder width={336} height={200} />
          <VStack px={4} pb={4}>
            <ShimmerPlaceholder
              shimmerStyle={{ borderRadius: 10, marginTop: 40 }}
              width={260}
            />
            <ShimmerPlaceholder
              shimmerStyle={{ borderRadius: 10, marginTop: 10 }}
              width={150}
            />
            <ShimmerPlaceholder
              shimmerStyle={{ borderRadius: 10, marginTop: 10 }}
              width={300}
            />
            <ShimmerPlaceholder
              shimmerStyle={{ borderRadius: 10, marginTop: 10 }}
              width={50}
            />
          </VStack>
          <VStack px={4} pb={4} marginTop={3}>
            <ShimmerPlaceholder
              shimmerStyle={{ borderRadius: 10, marginTop: 2 }}
              width={80}
            />
            <ShimmerPlaceholder
              shimmerStyle={{ borderRadius: 10, marginTop: 16 }}
              width={150}
            />
            <ShimmerPlaceholder
              shimmerStyle={{ borderRadius: 10, marginTop: 8 }}
              width={120}
            />
          </VStack>
        </VStack>
      )}
    </>
  );
};

export default Shimmer;
