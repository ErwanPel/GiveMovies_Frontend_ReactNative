import { Text, View, TouchableOpacity, TextInput } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuthContext } from "../assets/context/AuthContext";
import { RootStackParamList } from "../components/Nav";
import ImageProfile from "../components/ImageProfile";
import { useState } from "react";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

export default function ProfileScreen(props: Props) {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | Error | null>(null);

  const { setToken } = useAuthContext();

  return (
    <View className="flex items-center justify-start w-full h-screen bg-black pt-6">
      <ImageProfile sizeBorder="w-[80] h-[80]" sizeImage={40} />
      <View className=" w-[80%] mb-8 mt-8">
        <Text className="text-slate-100 ml-3 text-base p-2">Pseudo</Text>
        <TextInput
          className="bg-white px-6 py-1 rounded-3xl  border-green-600 border-4"
          onChangeText={(text) => {
            setError("");
            setUsername((prev) => text);
          }}
          placeholder="John Doe"
          placeholderTextColor={"grey"}
        />
      </View>
      <View className=" w-[80%] mb-8">
        <Text className="text-slate-100 ml-3 text-base p-2">Email</Text>
        <TextInput
          className="bg-white px-6 py-1 rounded-3xl border-green-600 border-4"
          onChangeText={(text) => {
            setError("");
            setEmail((prev) => text);
          }}
          placeholder="doe@gmail.com"
          placeholderTextColor={"grey"}
        />
      </View>
      <TouchableOpacity onPress={() => console.log("update")}>
        <Text className="bg-purple-700 p-5 rounded-xl w-[140] mb-5 text-white text-center">
          UPDATE
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setToken(null, null)}>
        <Text className="bg-purple-700 p-5 rounded-xl w-[140] text-white text-center">
          DECONNEXION
        </Text>
      </TouchableOpacity>
    </View>
  );
}
