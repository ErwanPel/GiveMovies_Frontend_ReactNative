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
import { verifyParsedData } from "../assets/tools/verifyParsedData";
import LottiesLoading from "./LottiesLoading";
import { warnDelete } from "../assets/tools/warnDelete";

type ReviewFormProps = {
  reviewRef: React.LegacyRef<TextInput> | null;
  id: number | null;
  title: string | null;
  reload: Boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  poster: string | null;
};

type postData = z.infer<typeof postReviewSchema>;

type getData = z.infer<typeof getReviewForm>;

type putData = z.infer<typeof putReviewSchema>;

export default function ReviewForm({
  reviewRef,
  id,
  title,
  poster,
  reload,
  setReload,
}: ReviewFormProps) {
  const [emoji, setEmoji] = useState<"Good" | "Neutral" | "Bad" | null>(null);
  const [text, setText] = useState<string>("");
  const [idReview, setIdReview] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activateUpdate, setActivateUpdate] = useState<boolean>(true);
  const [disablePost, setDisablePost] = useState<Boolean>(false);
  const [zodError, setZodError] = useState<ZodError | null>(null);
  const [isUploadedPost, setIsUploadedPost] = useState<boolean>(false);
  const [isUploadedPut, setIsUploadedPut] = useState<boolean>(false);
  const [isUploadedDelete, setIsUploadedDelete] = useState<boolean>(false);

  const { userToken, userID } = useAuthContext();

  const execActivateUpdate = () => {
    if (activateUpdate) setActivateUpdate(false);
  };

  useEffect(() => {
    const fetchDataForm = async (): Promise<void> => {
      try {
        const { data } = await axios.get(
          `https://site--givemovies-backend--fwddjdqr85yq.code.run/review/form?movieID=${id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "Application/json",
            },
          }
        );

        if (data) {
          const parsedData: getData | null = verifyParsedData<getData | null>(
            data,
            getReviewForm,
            zodError,
            setZodError
          );

          if (parsedData) {
            setEmoji(parsedData.feeling);
            setText(parsedData.opinion);
            setIdReview(parsedData._id);
            setDisablePost(true);
          }
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
    if (emoji && text && title && poster && id) {
      try {
        setIsUploadedPost(true);
        const parsedData = verifyParsedData<postData | null>(
          {
            title,
            movieID: id,
            feeling: emoji,
            opinion: text,
            poster,
          },
          postReviewSchema,
          zodError,
          setZodError
        );

        const { data } = await axios.post(
          "https://site--givemovies-backend--fwddjdqr85yq.code.run/review",
          parsedData,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "Application/json",
            },
          }
        );

        setError("");
        setIsUploadedPost(false);
        setReload(true);
      } catch (error: any) {
        console.log(error);
      }
    } else {
      setError("You have to complete your opinion and select an emoji");
    }
  };

  const handlePutReview = async (event: GestureResponderEvent) => {
    event.preventDefault();
    if (emoji && text) {
      setIsUploadedPut(true);
      try {
        const parsedData = verifyParsedData<putData | null>(
          { feeling: emoji, opinion: text },
          putReviewSchema,
          zodError,
          setZodError
        );

        const { data } = await axios.put(
          `https://site--givemovies-backend--fwddjdqr85yq.code.run/review/${idReview}`,
          parsedData,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "Application/json",
            },
          }
        );
        setIsUploadedPut(false);
        setActivateUpdate(true);
        setError("");
        setReload(true);
      } catch (error: any) {
        if (error instanceof ZodError) {
          console.log(error);
        } else {
          console.log(error);
        }
      }
    } else {
      setError("You have to complete your opinion and select an emoji");
    }
  };

  const handleDeleteReview = async (event: GestureResponderEvent) => {
    event.preventDefault();
    try {
      setIsUploadedDelete(true);
      const { data } = await axios.delete(
        `https://site--givemovies-backend--fwddjdqr85yq.code.run/review/${idReview}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (data) {
        setIsUploadedDelete(false);
        setDisablePost(false);
        setEmoji(null);
        setText("");
        setReload(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return isLoading ? (
    <Text className="text-white">Loading</Text>
  ) : (
    <View className="bg-black px-4 pt-4 flex gap-4">
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
        <View className="self-center">
          {isUploadedPost ? (
            <LottiesLoading />
          ) : (
            <TouchableOpacity onPress={(event) => handlePostReview(event)}>
              <Text className="text-white bg-purple-500 p-4 rounded-xl">
                SEND YOUR REVIEW
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View className="flex-row justify-between">
          {isUploadedPut ? (
            <LottiesLoading />
          ) : (
            <TouchableOpacity
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
          )}
          {isUploadedDelete ? (
            <LottiesLoading />
          ) : (
            <TouchableOpacity
              onPress={(event) =>
                warnDelete(
                  event,
                  "Delete review",
                  "Do you want delete your review ?",
                  setIsUploadedDelete,
                  handleDeleteReview
                )
              }
            >
              <Text className="text-white w-[130] text-center bg-red-600 p-4 rounded-xl">
                DELETE YOUR REVIEW
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {error && <Text className="text-red-500 text-center">{error}</Text>}
    </View>
  );
}
