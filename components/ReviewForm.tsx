import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { useState, useEffect } from "react";
import { Entypo } from "@expo/vector-icons";
import axios from "axios";
import {
  postReviewSchema,
  getReviewForm,
  putReviewSchema,
} from "../assets/zodSchema/reviewSchemaFile";
import { z, ZodError } from "zod";
import { useAuthContext } from "../assets/context/AuthContext";
import { Review } from "./Review";

type ReviewFormProps = {
  reviewRef: React.LegacyRef<TextInput> | null;
  id: number | null;
  title: string | null;
  reload: Boolean;
  setReload: React.Dispatch<React.SetStateAction<Boolean>>;
};

type postData = z.infer<typeof postReviewSchema>;

type getData = z.infer<typeof getReviewForm>;

type putData = z.infer<typeof putReviewSchema>;

export default function ReviewForm({
  reviewRef,
  id,
  title,
  reload,
  setReload,
}: ReviewFormProps) {
  const [emoji, setEmoji] = useState<"Good" | "Neutral" | "Bad" | null>(null);
  const [text, setText] = useState<string>("");
  const [idReview, setIdReview] = useState<string>("");
  const [error, setError] = useState<Error | string | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [activateUpdate, setActivateUpdate] = useState<Boolean>(true);
  const [disablePost, setDisablePost] = useState<Boolean>(false);

  const { userToken, userID } = useAuthContext();

  const execActivateUpdate = () => {
    if (activateUpdate) setActivateUpdate(false);
  };

  useEffect(() => {
    const fetchDataForm = async (): Promise<void> => {
      try {
        const response = await axios.get(
          `http://10.0.2.2:3000/review/form?movieID=${id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "Application/json",
            },
          }
        );
        if (response.data) {
          const parsedData = getReviewForm.parse(response.data);

          setEmoji(parsedData.feeling);
          setText(parsedData.opinion);
          setIdReview(parsedData._id);
          setDisablePost(true);
        }

        setIsLoading(false);
      } catch (error: any) {
        if (error instanceof ZodError) {
          console.log(error);
        } else {
          console.log(error);
        }
      }
    };
    fetchDataForm();
  }, [reload]);

  const handlePostReview = async (event: GestureResponderEvent) => {
    event.preventDefault();
    if (emoji && text && title && id) {
      const postData: postData = {
        title,
        movieID: id,
        feeling: emoji,
        opinion: text,
      };
      try {
        const dataParsed = postReviewSchema.parse(postData);
        const response = await axios.post(
          "http://10.0.2.2:3000/review",
          dataParsed,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "Application/json",
            },
          }
        );
        setReload(true);
      } catch (error: any) {
        if (error instanceof ZodError) {
          console.log(error);
        } else {
          console.log(error);
        }
      }
    } else {
      console.log("You have to complete your opinion and select an emoji");
    }
  };

  const handlePutReview = async (event: GestureResponderEvent) => {
    event.preventDefault();

    const putData: putData = { feeling: emoji, opinion: text };

    try {
      const parsedData = putReviewSchema.parse(putData);

      const response = await axios.put(
        `http://10.0.2.2:3000/review/${idReview}`,
        parsedData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "Application/json",
          },
        }
      );

      setReload(true);
    } catch (error: any) {
      if (error instanceof ZodError) {
        console.log(error);
      } else {
        console.log(error);
      }
    }
  };

  const handleDeleteReview = async (event: GestureResponderEvent) => {
    event.preventDefault();
    try {
      const response = await axios.delete(
        `http://10.0.2.2:3000/review/${idReview}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setEmoji(null);
      setText("");
      setReload(true);
    } catch (error) {
      console.log(error);
    }
  };

  return isLoading ? (
    <Text className="text-white">Loading</Text>
  ) : (
    <View className="bg-black px-4 pt-4 flex gap-4">
      <Text className="text-white text-lg">Your review</Text>
      <View className="flex flex-row justify-around">
        <TouchableOpacity
          onPress={() => {
            disablePost && execActivateUpdate();
            setEmoji("Good");
          }}
        >
          <View
            className={
              emoji === "Good"
                ? "items-center p-1.5 rounded-lg bg-slate-700 w-[80]"
                : "items-center p-1.5 w-[80]"
            }
          >
            <Entypo name="emoji-happy" size={24} color="green" />
            <Text className="text-green-500 font-bold mt-2">GOOD</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            disablePost && execActivateUpdate();
            setEmoji("Neutral");
          }}
        >
          <View
            className={
              emoji === "Neutral"
                ? "items-center p-1.5 rounded-lg bg-slate-700 w-[80]"
                : "items-center p-1.5 w-[80]"
            }
          >
            <Entypo name="emoji-neutral" size={24} color="orange" />
            <Text className="text-yellow-500 font-bold mt-2">NEUTRAL</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            disablePost && execActivateUpdate();
            setEmoji("Bad");
          }}
        >
          <View
            className={
              emoji === "Bad"
                ? "items-center p-1.5 rounded-lg bg-slate-700 w-[80]"
                : "items-center p-1.5 w-[80]"
            }
          >
            <Entypo name="emoji-sad" size={24} color="red" />
            <Text className="text-red-500 font-bold mt-2">BAD</Text>
          </View>
        </TouchableOpacity>
      </View>
      <TextInput
        ref={reviewRef}
        value={text}
        onChangeText={(text) => {
          disablePost && execActivateUpdate();
          setText((prev) => text);
        }}
        multiline
        numberOfLines={4}
        placeholder="What do you think about this movie ?"
        placeholderTextColor={"grey"}
        style={{ textAlignVertical: "top" }}
        maxLength={170}
        className="bg-white my-4 p-1.5 text-lg"
      />
      {!disablePost ? (
        <TouchableOpacity
          className="self-center"
          onPress={(event) => handlePostReview(event)}
        >
          <Text className="text-white bg-purple-500 p-4 rounded-xl">
            SEND YOUR REVIEW
          </Text>
        </TouchableOpacity>
      ) : (
        <View className="flex-row justify-between">
          <TouchableOpacity
            className="self-center"
            onPress={(event) => handlePutReview(event)}
            disabled={typeof activateUpdate === "boolean" && activateUpdate}
          >
            <Text
              className={
                activateUpdate
                  ? "text-white w-[130] text-center bg-gray-600 p-4 rounded-xl"
                  : "text-white w-[130] text-center bg-blue-600 p-4 rounded-xl"
              }
            >
              UPDATE YOUR REVIEW
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="self-center"
            onPress={(event) => handleDeleteReview(event)}
          >
            <Text className="text-white w-[130] text-center bg-red-600 p-4 rounded-xl">
              DELETE YOUR REVIEW
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
