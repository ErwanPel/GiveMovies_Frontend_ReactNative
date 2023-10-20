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

type Props = NativeStackScreenProps<RootStackParamList>;

type SignData = z.infer<typeof userSignInSchema>;

export default function Signin({ navigation }: Props) {
  const [picture, setPicture] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | ZodError | Error | null>(null);

  const { setToken } = useAuthContext();

  const handleSubmit = async (event: GestureResponderEvent) => {
    event.preventDefault();
    if (password === confirmPassword) {
      try {
        const parseData: SignData = verifyParsedData<SignData | null>(
          { username, email, password, picture },
          userSignInSchema
        );

        const formData = new FormData();
        if (parseData.picture) {
          const pictureData = setPictureToUpload(picture);
          formData.append("picture", pictureData);
        }

        formData.append("username", parseData.username);
        formData.append("email", parseData.email);
        formData.append("password", parseData.password);
        if (Platform.OS === "ios") {
          const response = await axios.post(
            "https://site--givemovies-backend--fwddjdqr85yq.code.run/signin",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setToken(response.data.token, response.data._id);
        } else {
          const response = await axios.post(
            "https://site--givemovies-backend--fwddjdqr85yq.code.run/signin",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setToken(response.data.token, response.data._id);
        }
      } catch (error: any) {
        console.log(error);
      }
    } else {
      setError("The password and confirm passwords are differents");
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
            inputMode="email"
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
