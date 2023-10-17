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
import { postMovieAndReviewSchema } from "../assets/zodSchema/postReviewSchema";
import { z, ZodError } from "zod";
import { useAuthContext } from "../assets/context/AuthContext";
import { Review } from "./Review";

type ReviewFormProps = {
  reviewRef: React.LegacyRef<TextInput> | null;
  id: number | null;
  title: string | null;
  reload: Boolean;
  setReload: React.Dispatch<React.SetStateAction<Boolean>>;
  data: Review | null;
};

type postData = z.infer<typeof postMovieAndReviewSchema>;

export default function ReviewForm({
  reviewRef,
  id,
  title,
  reload,
  setReload,
  data,
}: ReviewFormProps) {
  const [emoji, setEmoji] = useState<"Good" | "Neutral" | "Bad" | null>(null);
  const [text, setText] = useState<string>("");
  const [error, setError] = useState<Error | string | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(true);

  const { userToken, userID } = useAuthContext();

  useEffect(() => {
    data?.forEach((rev) => {
      if (rev.user._id === userID) {
        setEmoji(rev.feeling);
        setText(rev.opinion);
      }
    });
    setIsLoading(false);
  }, []);

  const handlePost = async (event: GestureResponderEvent) => {
    event.preventDefault();
    console.log("post", title, id);
    if (emoji && text && title && id) {
      const postData: postData = {
        title,
        movieID: id,
        review: {
          feeling: emoji,
          opinion: text,
        },
      };
      try {
        const dataParsed = postMovieAndReviewSchema.parse(postData);
        console.log("post validé", dataParsed);
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
        console.log(response.data);
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

  return isLoading ? (
    <Text>Loading</Text>
  ) : (
    <View className="bg-black px-4 pt-4 flex gap-4">
      <Text className="text-white text-lg">Your review</Text>
      <View className="flex flex-row justify-around">
        <TouchableOpacity onPress={() => setEmoji("Good")}>
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
        <TouchableOpacity onPress={() => setEmoji("Neutral")}>
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
        <TouchableOpacity onPress={() => setEmoji("Bad")}>
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
        onChangeText={(text) => setText((prev) => text)}
        multiline
        numberOfLines={4}
        placeholder="What do you think about this movie ?"
        placeholderTextColor={"grey"}
        style={{ textAlignVertical: "top" }}
        maxLength={170}
        className="bg-white my-4 p-1.5 text-lg"
      />
      <TouchableOpacity
        className="self-center"
        onPress={(event) => handlePost(event)}
      >
        <Text className="text-white bg-purple-500 p-4 rounded-xl">
          SEND YOUR REVIEW
        </Text>
      </TouchableOpacity>
    </View>
  );
}
