import { Text, View, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuthContext } from "../assets/context/AuthContext";

import { RootStackParamList } from "../components/Nav";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const { setToken } = useAuthContext();

  return (
    <View className="flex items-center justify-center w-full h-screen bg-black">
      <View>
        <TouchableOpacity onPress={() => navigation.navigate("Movies")}>
          <Text className="bg-purple-700 p-5 rounded-xl text-white mb-6">
            ACCEDER A MES FILMS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setToken(null)}>
          <Text className="bg-purple-700 p-5 rounded-xl text-white text-center">
            DECONNEXION
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
