import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  GestureResponderEvent,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuthContext } from "../assets/context/AuthContext";
import { RootStackParamList } from "../components/Nav";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { z, ZodError } from "zod";
import axios from "axios";
import { useState } from "react";

type Props = NativeStackScreenProps<RootStackParamList>;

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type loginData = z.infer<typeof loginSchema>;

export default function Login({ navigation }: Props) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const { setToken } = useAuthContext();

  const handleSubmit = async (event: GestureResponderEvent) => {
    event.preventDefault();
    const sendLoginData: loginData = { email, password };
    try {
      const loginParsed = loginSchema.parse(sendLoginData);

      const response = await axios.post(
        "https://site--givemovies-backend--fwddjdqr85yq.code.run/login",
        loginParsed,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setToken(response.data.token, response.data._id);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View className="flex items-center justify-center w-full h-screen bg-black">
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
        <View className=" w-[80%] mb-8">
          <Text className="text-slate-100 ml-3 text-base p-2 ">Password</Text>
          <TextInput
            className="bg-white px-6 py-1 rounded-3xl border-green-600 border-4"
            onChangeText={(text) => {
              setError("");
              setPassword((prev) => text);
            }}
            placeholder="test"
            placeholderTextColor={"grey"}
            secureTextEntry
          />
        </View>

        <TouchableOpacity onPress={(event) => handleSubmit(event)}>
          <View className="mt-4 mb-8">
            <Text className="text-white rounded-xl text-center w-[150] p-4 bg-purple-800">
              SIGN IN
            </Text>
          </View>
        </TouchableOpacity>
        {error && <Text className="text-red-700 mt-4">{error}</Text>}
        <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
          <View>
            <Text className="text-white rounded-xl text-center underline  decoration-white p-4 ">
              Don't have an account ?
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}
