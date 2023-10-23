import {
  View,
  Text,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { useState } from "react";
import ImageProfile from "./ImageProfile";
import { Entypo } from "@expo/vector-icons";
import { useAuthContext } from "../assets/context/AuthContext";
import { getReviewObject } from "../assets/zodSchema/reviewSchemaFile";
import { ZodError, z } from "zod";
import { Fontisto } from "@expo/vector-icons";
import { postPreferenceReview } from "../assets/zodSchema/reviewSchemaFile";
import { verifyParsedData } from "../assets/tools/verifyParsedData";
import axios from "axios";

type TReviewObject = z.infer<typeof getReviewObject>;

type cardReviewProps = {
  reviewItem: TReviewObject | null;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
};

type TpostPreference = z.infer<typeof postPreferenceReview>;

export default function CardReview({ reviewItem, setReload }: cardReviewProps) {
  const [zodError, setZodError] = useState<ZodError | null>(null);

  const { userID, userToken } = useAuthContext();

  const handlePreference = async (
    event: GestureResponderEvent,
    preference: "like" | "dislike"
  ) => {
    event.preventDefault();
    console.log(preference);
    if (preference && userID) {
      try {
        const parsedData = verifyParsedData<TpostPreference>(
          { preference, userID },
          postPreferenceReview,
          zodError,
          setZodError
        );

        const { data } = await axios.post(
          `https://site--givemovies-backend--fwddjdqr85yq.code.run/review/preference/${reviewItem?._id}`,
          parsedData,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "Application/json",
            },
          }
        );
        console.log(JSON.stringify(data, null, 2));

        setReload(true);
      } catch (error: any) {
        console.log(error.response.data);
      }
    }
  };

  console.log(JSON.stringify(reviewItem, null, 2));

  return (
    reviewItem && (
      <>
        <View
          className={
            reviewItem.user._id === userID
              ? "border-purple-500  border-2 w-[290] p-3 rounded-3xl mx-4 my-8 relative"
              : "border-zinc-300  border-2 w-[290] p-3 rounded-3xl mx-4 my-8 relative"
          }
          key={reviewItem._id}
        >
          <View className="flex-row justify-between items-center ml-1">
            <View>
              <View className="flex-row items-center">
                <ImageProfile
                  file={
                    reviewItem.user.photo[0]?.secure_url
                      ? reviewItem.user.photo[0]?.secure_url
                      : null
                  }
                  sizeBorder="w-[40] h-[40]"
                  sizeImage={20}
                  id={reviewItem.user?._id}
                />
                <Text className="text-white text-base ml-4">
                  {reviewItem.user.username}
                </Text>
              </View>
              <Text className="text-white mt-2 italic">
                Post on {reviewItem.date}
              </Text>
            </View>

            <View className="justify-center items-center pt-1 w-[80]">
              {reviewItem.feeling === "Bad" ? (
                <>
                  <Entypo name="emoji-sad" size={24} color="red" />
                  <Text className="text-red-500 font-bold mt-2">BAD</Text>
                </>
              ) : reviewItem.feeling === "Neutral" ? (
                <>
                  <Entypo name="emoji-neutral" size={24} color="orange" />
                  <Text className="text-yellow-500 font-bold mt-2">
                    NEUTRAL
                  </Text>
                </>
              ) : (
                <>
                  <Entypo name="emoji-happy" size={24} color="green" />
                  <Text className="text-green-500 font-bold mt-2">GOOD</Text>
                </>
              )}
            </View>
          </View>
          <View className="my-4 ml-1">
            <Text className="text-white text-justify">
              {reviewItem.opinion}
            </Text>
          </View>
          {reviewItem.user._id === userID ? (
            <View className="border-2 border-zinc-100 p-2 w-[200] rounded-full absolute bottom-[-25] right-[20] bg-black flex-row items-center">
              <Text className="text-white mx-3">Stats : </Text>
              <Text className="text-white mr-2">
                {reviewItem.dislike.length}
              </Text>
              <Fontisto name="dislike" size={20} color="red" />
              <Text className="text-white ml-4 mr-2">
                {reviewItem.like.length}
              </Text>
              <Fontisto name="like" size={20} color="green" />
            </View>
          ) : (
            <>
              <TouchableOpacity
                className="absolute bottom-[-20] right-[100]"
                onPress={(event) => handlePreference(event, "dislike")}
              >
                <View
                  className={
                    reviewItem.dislike.find((find) => find === userID)
                      ? "border-2 border-zinc-100 p-2 w-[40] rounded-full bg-zinc-100"
                      : "border-2 border-zinc-100 p-2 w-[40] rounded-full bg-black"
                  }
                >
                  <Fontisto name="dislike" size={20} color="red" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={(event) => handlePreference(event, "like")}
                className="absolute bottom-[-20] right-[30]"
              >
                <View
                  className={
                    reviewItem.like.find((find) => find === userID)
                      ? "border-2 border-zinc-100 p-2 w-[40] rounded-full  bg-zinc-100"
                      : "border-2 border-zinc-100 p-2 w-[40] rounded-full  bg-black"
                  }
                >
                  <Fontisto name="like" size={20} color="green" />
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>
      </>
    )
  );
}
