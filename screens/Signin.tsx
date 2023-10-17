import axios from "axios";
import { z, ZodError } from "zod";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { useState } from "react";
import { RootStackParamList } from "../components/Nav";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuthContext } from "../assets/context/AuthContext";

type Props = NativeStackScreenProps<RootStackParamList>;

const signinSchema = z.object({
  username: z.string().min(3, {
    message: "the username needs at least 3 characters",
  }),
  email: z.string().email(),
  password: z.string().min(8, {
    message: "the password needs at least 8 characters",
  }),
});

type SignData = z.infer<typeof signinSchema>;

export default function Signin({ navigation }: Props) {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | ZodError | Error | null>(null);

  const { setToken } = useAuthContext();

  const handleSubmit = async (event: GestureResponderEvent) => {
    event.preventDefault();

    if (password === confirmPassword) {
      const dataToVerify: SignData = { username, email, password };
      try {
        const parseData = signinSchema.parse(dataToVerify);

        const formData = new FormData();
        formData.append("username", dataToVerify.username);
        formData.append("email", dataToVerify.email);
        formData.append("password", dataToVerify.password);

        const response = await axios.post(
          "http://10.0.2.2:3000/signin",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setToken(response.data.token, response.data._id);
      } catch (error) {
        if (error instanceof ZodError) {
          console.log(error.issues);
        } else {
          console.log(error);
        }
      }
    } else {
      setError("The password and confirm passwords are differents");
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View className="flex items-center w-full h-screen bg-black pt-6">
        <View className=" w-[80%] mb-8">
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
        <View className=" w-[80%] mb-8">
          <Text className="text-slate-100 ml-3 text-base p-2 ">
            Confirm your password
          </Text>
          <TextInput
            className="bg-white px-6 py-1 rounded-3xl border-green-600 border-4"
            onChangeText={(text) => {
              setError("");
              setConfirmPassword((prev) => text);
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
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <View>
            <Text className="text-white rounded-xl text-center underline  decoration-white p-4 ">
              Already have an account ?
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}
