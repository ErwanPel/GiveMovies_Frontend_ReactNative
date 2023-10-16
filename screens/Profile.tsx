import { Text, View, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuthContext } from "../assets/context/AuthContext";
import { RootStackParamList } from "../components/Nav";
import { RootTabParamList } from "../components/Nav";
import { CompositeScreenProps } from "@react-navigation/native";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

export default function ProfileScreen(props: Props) {
  const { setToken } = useAuthContext();

  return (
    <View className="flex items-center justify-center w-full h-screen bg-black">
      <TouchableOpacity onPress={() => setToken(null)}>
        <Text className="bg-purple-700 p-5 rounded-xl text-white text-center">
          DECONNEXION
        </Text>
      </TouchableOpacity>
    </View>
  );
}
