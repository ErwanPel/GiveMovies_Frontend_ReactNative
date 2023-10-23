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
import { verifyParsedData } from "../assets/tools/verifyParsedData";
import { userLoginSchema } from "../assets/zodSchema/userSchema";
import LottiesLoading from "../components/LottiesLoading";

type Props = NativeStackScreenProps<RootStackParamList>;

type loginData = z.infer<typeof userLoginSchema>;

export default function Login({ navigation }: Props) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // state Error
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [error, setError] = useState<string | null>("");
  const [zodError, setZodError] = useState<ZodError | null>(null);

  const { setToken } = useAuthContext();

  const reloadError = () => {
    setZodError(null);
    setPasswordError("");
    setEmailError("");
    setError("");
  };

  const handleSubmit = async (event: GestureResponderEvent) => {
    event.preventDefault();
    setIsLoading(true);
    reloadError();
    try {
      const parsedData: loginData | null = verifyParsedData<loginData | null>(
        { email, password },
        userLoginSchema,
        zodError,
        setZodError
      );

      const response = await axios.post(
        "https://site--givemovies-backend--fwddjdqr85yq.code.run/login",
        parsedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setIsLoading(false);
      setToken(response.data.token, response.data.id);
    } catch (error: any) {
      if (zodError) {
        zodError.issues.map((error) => {
          if (error.path[0] === "email") {
            setEmailError(error.message);
          } else if (error.path[0] === "password") {
            setPasswordError(error.message);
          }
        });
      }
      if (error.response?.data) setError(error.response.data.message);
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View className="flex items-center justify-center w-full h-screen bg-black">
        <View className=" w-[80%] mb-8">
          <Text className="text-slate-100 ml-3 text-base p-2">Email</Text>
          <TextInput
            className={
              emailError
                ? "bg-red-200 px-6 py-1 rounded-3xl"
                : "bg-slate-100 px-6 py-1 rounded-3xl"
            }
            onChangeText={(text) => {
              setEmail((prev) => text);
            }}
            placeholder="doe@gmail.com"
            placeholderTextColor={"grey"}
            inputMode="email"
          />
          {emailError && (
            <Text className="text-red-500 text-center mt-2">{emailError}</Text>
          )}
        </View>
        <View className=" w-[80%] mb-8">
          <Text className="text-slate-100 ml-3 text-base p-2 ">Password</Text>
          <TextInput
            className={
              passwordError
                ? "bg-red-200 px-6 py-1 rounded-3xl"
                : "bg-slate-100 px-6 py-1 rounded-3xl"
            }
            onChangeText={(text) => {
              setPassword((prev) => text);
            }}
            placeholder="test"
            placeholderTextColor={"grey"}
            secureTextEntry
          />
        </View>

        {isLoading ? (
          <LottiesLoading />
        ) : (
          <TouchableOpacity onPress={(event) => handleSubmit(event)}>
            <View className="mt-4 mb-8">
              <Text className="text-white rounded-xl text-center w-[150] p-4 bg-purple-800">
                LOG IN
              </Text>
            </View>
          </TouchableOpacity>
        )}
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
