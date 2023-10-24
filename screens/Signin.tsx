import axios from "axios";
import { z, ZodError } from "zod";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  GestureResponderEvent,
  Platform,
} from "react-native";
import { useState } from "react";
import { RootStackParamList } from "../components/Nav";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuthContext } from "../assets/context/AuthContext";
import ImageAndSelectPicture from "../components/ImageAndSelectPicture";
import { userSignInSchema } from "../assets/zodSchema/userSchema";
import { setPictureToUpload } from "../assets/tools/setPictureToUpload";
import { verifyParsedData } from "../assets/tools/verifyParsedData";
import LottiesLoading from "../components/LottiesLoading";

type Props = NativeStackScreenProps<RootStackParamList>;

type SignData = z.infer<typeof userSignInSchema>;

export default function Signin({ navigation }: Props) {
  const [picture, setPicture] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // State Error :
  const [error, setError] = useState<string>("");
  const [zodError, setZodError] = useState<ZodError | null>(null);
  const [passwordError, setPasswordError] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  const { setToken } = useAuthContext();

  const reloadError = () => {
    setZodError(null);
    setPasswordError("");
    setUsernameError("");
    setEmailError("");
    setError("");
  };

  const handleSubmit = async (event: GestureResponderEvent) => {
    event.preventDefault();

    reloadError();
    if (password === confirmPassword) {
      try {
        setIsLoading(true);
        const parseData: SignData = verifyParsedData<SignData | null>(
          { username, email, password, picture },
          userSignInSchema,
          zodError,
          setZodError
        );

        const formData = new FormData();
        if (parseData.picture) {
          const pictureData = setPictureToUpload(picture);
          formData.append("picture", pictureData);
        }

        formData.append("username", parseData.username);
        formData.append("email", parseData.email);
        formData.append("password", parseData.password);

        const response = await axios.post(
          "https://site--givemovies-backend--fwddjdqr85yq.code.run/signin",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        alert("Your account has been created");
        setIsLoading(false);
        setToken(response.data.token, response.data.id);
      } catch (error: any) {
        if (zodError) {
          zodError.issues.map((error) => {
            if (error.path[0] === "username") {
              setUsernameError(error.message);
            } else if (error.path[0] === "email") {
              setEmailError(error.message);
            } else if (error.path[0] === "password") {
              setPasswordError(error.message);
            }
          });
        }
        if (error.response?.data) setError(error.response.data.message);
        setIsLoading(false);
      }
    } else {
      setPasswordError("The password and confirm password are differents");
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View className="flex items-center w-full h-screen bg-black pt-6">
        <ImageAndSelectPicture
          picture={picture}
          setPicture={setPicture}
          sizeBorder="w-[80] h-[80]"
          sizeImage={28}
        />

        <View className=" w-[80%] mb-8">
          <Text className="text-slate-100 ml-3 text-base p-2">Pseudo</Text>
          <TextInput
            className={
              usernameError
                ? "bg-red-200 px-6 py-1 rounded-3xl"
                : "bg-slate-100 px-6 py-1 rounded-3xl"
            }
            onChangeText={(text) => {
              setUsername((prev) => text);
            }}
            placeholder="John Doe"
            placeholderTextColor={"grey"}
          />
          {usernameError && (
            <Text className="text-red-500 text-center mt-2">
              {usernameError}
            </Text>
          )}
        </View>

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
        <View className=" w-[80%] mb-8">
          <Text className="text-slate-100 ml-3 text-base p-2 ">
            Confirm your password
          </Text>
          <TextInput
            className={
              passwordError
                ? "bg-red-200 px-6 py-1 rounded-3xl"
                : "bg-slate-100 px-6 py-1 rounded-3xl"
            }
            onChangeText={(text) => {
              setConfirmPassword((prev) => text);
            }}
            placeholder="test"
            placeholderTextColor={"grey"}
            secureTextEntry
          />
          {passwordError && (
            <Text className="text-red-500 text-center mt-2">
              {passwordError}
            </Text>
          )}
        </View>

        {isLoading ? (
          <LottiesLoading />
        ) : (
          <TouchableOpacity onPress={(event) => handleSubmit(event)}>
            <View className="mt-4 mb-8">
              <Text className="text-white rounded-xl text-center w-[150] p-4 bg-purple-800">
                SIGN IN
              </Text>
            </View>
          </TouchableOpacity>
        )}
        {error && <Text className="text-red-500 text-center">{error}</Text>}
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
