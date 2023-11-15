import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  GestureResponderEvent,
  Alert,
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
import { z, ZodError } from "zod";
import { setPictureToUpload } from "../assets/tools/setPictureToUpload";
import LottiesLoading from "../components/LottiesLoading";
import { warnDelete } from "../assets/tools/warnDelete";
import LottiesView from "../components/LottiesView";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

type TgetUser = z.infer<typeof getUserSchema>;

type TPicture = z.infer<typeof pictureSchema>;

type TEmail = z.infer<typeof emailSchema>;

export default function ProfileScreen(props: Props) {
  const [email, setEmail] = useState<string>("");
  const [picture, setPicture] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [picturePresent, setPicturePresent] = useState<boolean>(false);
  const [enableUpdateButton, setEnableUpdateButton] = useState<boolean>(true);
  const [changeText, setChangeText] = useState<boolean>(false);
  const [changePicture, setChangePicture] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isUploadDeletePicture, setIsUploadDeletePicture] =
    useState<boolean>(false);
  const [isUploadDeleteUser, setIsUploadDeleteUser] = useState<boolean>(false);

  // error State
  const [zodError, setZodError] = useState<ZodError | null>(null);
  const [emailError, setEmailError] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { userToken, setToken, userID } = useAuthContext();

  const reloadProfileScreen = () => {
    setEnableUpdateButton(true);
    setChangeText(false);
    setChangePicture(false);
    setReload(false);
  };

  const reloadError = () => {
    setZodError(null);
    setEmailError("");
    setError("");
  };

  const handleUpdate = async (event: GestureResponderEvent) => {
    event.preventDefault();
    setIsUpdate(true);
    if (changePicture) {
      try {
        const parsedData: TPicture | null = verifyParsedData<TPicture | null>(
          picture,
          pictureSchema,
          zodError,
          setZodError
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
          alert(data.message);
          setPicturePresent(true);
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
          alert(data.message);
          setPicturePresent(true);
        }
      } catch (error: any) {
        console.log(error);
      }
    }

    if (changeText) {
      try {
        const parsedData: TEmail | null = verifyParsedData<TEmail | null>(
          { email },
          emailSchema,
          zodError,
          setZodError
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
        alert(data.message);
      } catch (error: any) {
        if (zodError) {
          zodError.issues.map((error) => {
            if (error.path[0] === "email") {
              setEmailError(error.message);
            }
          });
        }
        if (error.response?.data) setError(error.response.data.message);
      }
    }
    setIsUpdate(false);
    reloadError();
    reloadProfileScreen();
  };

  const handleDeletePicture = async (event: GestureResponderEvent) => {
    event.preventDefault();
    reloadError();
    try {
      setIsUploadDeletePicture(true);
      const { data } = await axios.delete(
        "https://site--givemovies-backend--fwddjdqr85yq.code.run/profile/picture",
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      alert(data.message);
      setIsUploadDeletePicture(false);
      setPicture(null);
      setPicturePresent(false);
      reloadProfileScreen();
      reloadError();
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleDeleteUser = async (event: GestureResponderEvent) => {
    event.preventDefault();
    reloadError();
    try {
      const { data } = await axios.delete(
        "https://site--givemovies-backend--fwddjdqr85yq.code.run/profile/user",
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      alert(data.message);
      setIsUploadDeleteUser(false);
      setToken(null, null);
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
          getUserSchema,
          zodError,
          setZodError
        );

        if (parsedData) {
          setEmail(parsedData.email);
          if (parsedData.photo[0]?.secure_url) {
            setPicture(parsedData.photo[0]?.secure_url);
            setPicturePresent(true);
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    reloadProfileScreen();
    setIsLoading(true);
    getData();
  }, [reload]);

  return isLoading ? (
    <LottiesView />
  ) : (
    <>
      <View className="justify-around items-center p-6 bg-black border-b-2 border-zinc-100">
        <TouchableOpacity
          onPress={() => {
            setToken(null, null);
            alert("You have been disconnected");
          }}
        >
          <Text className="bg-purple-700 p-3 rounded-3xl  text-white text-center  w-32">
            LOG OUT
          </Text>
        </TouchableOpacity>
      </View>
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

          <View className=" w-[80%] mb-8">
            <Text className="text-slate-100 ml-3 text-base p-2">Email</Text>
            <TextInput
              className={
                emailError
                  ? "bg-red-200 px-6 py-1 rounded-3xl"
                  : "bg-slate-100 px-6 py-1 rounded-3xl"
              }
              onChangeText={(text) => {
                setChangeText(true);
                setEnableUpdateButton(false);
                setEmail((prev) => text);
              }}
              placeholder="doe@gmail.com"
              placeholderTextColor={"grey"}
              inputMode="email"
              value={email}
            />
            {emailError && (
              <Text className="text-red-500 text-center mt-2">
                {emailError}
              </Text>
            )}
          </View>
          {isUpdate ? (
            <LottiesLoading />
          ) : (
            <TouchableOpacity
              onPress={(event) => handleUpdate(event)}
              disabled={
                typeof enableUpdateButton === "boolean" && enableUpdateButton
              }
              className="mb-4"
            >
              <Text
                className={
                  enableUpdateButton
                    ? "bg-gray-600 p-5 rounded-xl w-[140] m-4 text-white text-center"
                    : "bg-blue-600 p-5 rounded-xl w-[140] m-4 text-white text-center"
                }
              >
                UPDATE
              </Text>
            </TouchableOpacity>
          )}
          {error && (
            <Text className="text-red-500 text-center mb-4">{error}</Text>
          )}

          <View className="flex-row justify-around w-full mt-20">
            {isUploadDeletePicture ? (
              <LottiesLoading />
            ) : (
              <TouchableOpacity
                onPress={(event) =>
                  warnDelete(
                    event,
                    "delete picture",
                    "Do you want delete your profil's picture ?",
                    setIsUploadDeletePicture,
                    handleDeletePicture
                  )
                }
                disabled={
                  typeof picturePresent === "boolean" && !picturePresent
                }
              >
                <Text
                  className={
                    !picturePresent
                      ? "bg-gray-600 p-3 rounded-xl w-[120]  text-white text-center"
                      : "bg-red-600 p-3 rounded-xl w-[120]  text-white text-center"
                  }
                >
                  DELETE PICTURE
                </Text>
              </TouchableOpacity>
            )}
            {isUploadDeleteUser ? (
              <LottiesLoading />
            ) : (
              <TouchableOpacity
                onPress={(event) =>
                  warnDelete(
                    event,
                    "Delete User",
                    "Do you want delete your user account ?",
                    setIsUploadDeleteUser,
                    handleDeleteUser
                  )
                }
              >
                <Text className="bg-red-600 p-3 rounded-xl w-[120]  text-white text-center">
                  DELETE ACCOUNT
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
}
