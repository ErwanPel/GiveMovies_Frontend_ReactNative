import { Text, View, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "./App";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View className="flex items-center justify-center w-full h-screen bg-black">
      <View>
        <TouchableOpacity onPress={() => navigation.navigate("Movies")}>
          <Text className="bg-purple-700 p-5 rounded-xl text-white">
            Acceder à mes films
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
