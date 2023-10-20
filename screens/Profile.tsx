import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  GestureResponderEvent,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuthContext } from "../assets/context/AuthContext";
import { RootStackParamList } from "../components/Nav";
import { useState, useEffect } from "react";
import ImageAndSelectPicture from "../components/ImageAndSelectPicture";
import { verifyParsedData } from "../assets/tools/verifyParsedData";
import {
  getUserSchema,
  pictureSchema,
  emailSchema,
} from "../assets/zodSchema/userSchema";
import { z } from "zod";
import { setPictureToUpload } from "../assets/tools/setPictureToUpload";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

type TgetUser = z.infer<typeof getUserSchema>;

type TPicture = z.infer<typeof pictureSchema>;

type TEmail = z.infer<typeof emailSchema>;

export default function ProfileScreen(props: Props) {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | Error | null>(null);
  const [picture, setPicture] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [picturePresent, setPicturePresent] = useState<boolean>(false);
  const [enableUpdateButton, setEnableUpdateButton] = useState<boolean>(true);
  const [changeText, setChangeText] = useState<boolean>(false);
  const [changePicture, setChangePicture] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false);

  const { userToken, setToken } = useAuthContext();

  const handleUpdate = async (event: GestureResponderEvent) => {
    event.preventDefault();
    if (changePicture) {
      try {
        const parsedData: TPicture | null = verifyParsedData<TPicture | null>(
          picture,
          pictureSchema
        );

        const formData = new FormData();
        const pictureData = setPictureToUpload(parsedData);
        formData.append("picture", pictureData);

        if (picturePresent) {
          const { data } = await axios.put(
            "https://site--givemovies-backend--fwddjdqr85yq.code.run/profile/picture",
            formData,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
        } else {
          const { data } = await axios.post(
            "https://site--givemovies-backend--fwddjdqr85yq.code.run/profile/picture",
            formData,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
        }
        setEnableUpdateButton(true);
        setChangeText(false);
        setChangePicture(false);
        setPicturePresent(true);
      } catch (error: any) {
        console.log(error);
      }
    }

    if (changeText) {
      try {
        const parsedData: TEmail | null = verifyParsedData<TEmail | null>(
          { email },
          emailSchema
        );

        const { data } = await axios.put(
          "https://site--givemovies-backend--fwddjdqr85yq.code.run/profile/email",
          parsedData,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setEnableUpdateButton(true);
        setChangeText(false);
        setChangePicture(false);
      } catch (error: any) {
        console.log(error);
      }
    }
    setReload(true);
  };

  const handleDeletePicture = async (event: GestureResponderEvent) => {
    event.preventDefault();
    try {
      const { data } = await axios.delete(
        "https://site--givemovies-backend--fwddjdqr85yq.code.run/profile/picture",
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setPicture(null);
      setEnableUpdateButton(true);
      setPicturePresent(false);
      setChangeText(false);
      setChangePicture(false);
      setReload(true);
      console.log(data);
    } catch (error: any) {
      console.log(JSON.stringify(error.response, null, 2));
    }
  };

  const handleDeleteUser = async (event: GestureResponderEvent) => {
    event.preventDefault();
    console.log(userToken);
    try {
      const { data } = await axios.delete(
        "https://site--givemovies-backend--fwddjdqr85yq.code.run/profile/user",
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      setToken(null, null);
      setReload(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(
          "https://site--givemovies-backend--fwddjdqr85yq.code.run/profile/user",
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "Application/json",
            },
          }
        );

        const parsedData: TgetUser | null = verifyParsedData<TgetUser | null>(
          data,
          getUserSchema
        );
        console.log(JSON.stringify(parsedData, null, 2));
        if (parsedData) {
          setEmail(parsedData.email);
          if (parsedData.photo[0]?.secure_url) {
            console.log("parse get pic", parsedData.photo[0]);
            setPicture(parsedData.photo[0]?.secure_url);
            setPicturePresent(true);
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    setReload(false);
    setIsLoading(true);
    getData();
  }, [reload]);

  console.log(picturePresent, reload, userToken);

  return isLoading ? (
    <Text>Loading</Text>
  ) : (
    <KeyboardAwareScrollView>
      <View className="flex items-center  justify-start w-full h-screen bg-black pt-6">
        <ImageAndSelectPicture
          picture={picture}
          setPicture={setPicture}
          sizeBorder="w-[80] h-[80]"
          sizeImage={40}
          setChangePicture={setChangePicture}
          changePicture={changePicture}
          enableUpdateButton={enableUpdateButton}
          setEnableUpdateButton={setEnableUpdateButton}
        />

        <View className=" w-[80%] my-8">
          <Text className="text-slate-100 ml-3 text-base p-2">Email</Text>
          <TextInput
            className="bg-white px-6 py-1 rounded-3xl border-green-600 border-4"
            onChangeText={(text) => {
              setError("");
              setEmail((prev) => text);
              setChangeText(true);
              setEnableUpdateButton(false);
            }}
            placeholder="doe@gmail.com"
            placeholderTextColor={"grey"}
            inputMode="email"
            value={email}
          />
        </View>
        <TouchableOpacity
          onPress={(event) => handleUpdate(event)}
          disabled={
            typeof enableUpdateButton === "boolean" && enableUpdateButton
          }
        >
          <Text
            className={
              enableUpdateButton
                ? "bg-gray-600 p-5 rounded-xl w-[140] m-8 text-white text-center"
                : "bg-blue-600 p-5 rounded-xl w-[140] m-8 text-white text-center"
            }
          >
            UPDATE
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setToken(null, null)}>
          <Text className="bg-purple-700 p-5 rounded-xl w-[140] text-white text-center">
            DECONNEXION
          </Text>
        </TouchableOpacity>
        <View className="flex-row justify-around w-full mt-10">
          <TouchableOpacity
            onPress={(event) => handleDeletePicture(event)}
            disabled={typeof picturePresent === "boolean" && !picturePresent}
          >
            <Text
              className={
                !picturePresent
                  ? "bg-gray-600 p-5 rounded-xl w-[120]  text-white text-center"
                  : "bg-red-600 p-5 rounded-xl w-[120]  text-white text-center"
              }
            >
              DELETE PICTURE
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={(event) => handleDeleteUser(event)}>
            <Text className="bg-red-600 p-5 rounded-xl w-[120]  text-white text-center">
              DELETE ACCOUNT
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
