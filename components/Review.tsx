import ReviewForm from "./ReviewForm";
import { TextInput, View, ScrollView, Text } from "react-native";
import axios from "axios";
import { useState, useEffect } from "react";
import { z, ZodError } from "zod";
import { getReviewSchema } from "../assets/zodSchema/reviewSchemaFile";
import { useAuthContext } from "../assets/context/AuthContext";
import ImageProfile from "./ImageProfile";
import { Entypo } from "@expo/vector-icons";

type ReviewProps = {
  reviewRef: React.LegacyRef<TextInput> | null;
  id: number | null;
  title: string | null;
};

export type Review = z.infer<typeof getReviewSchema>;

export default function Review({ reviewRef, id, title }: ReviewProps) {
  const [data, setData] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState<Boolean>(false);

  const { userToken } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://10.0.2.2:3000/review?movieID=${id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "Application/json",
            },
          }
        );
        console.log("data", response.data);
        if (response.data.length === 0) {
          console.log("dans le data");
          setData(response.data);
        } else {
          console.log("dans le parse");
          const parsedData = getReviewSchema.parse(response.data);
          setData(parsedData);
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
    setReload(false);
    fetchData();
  }, [reload]);

  if (isLoading) {
  }

  return isLoading ? (
    <Text>Loading</Text>
  ) : (
    <View className="bg-black gap-y-12">
      <ReviewForm
        reviewRef={reviewRef}
        id={id}
        title={title}
        setReload={setReload}
        reload={reload}
      />
      <ScrollView horizontal>
        {data?.map((rev) => {
          return (
            <View
              className="border-white border-2 w-[290] p-3 rounded-3xl mx-4 mb-8"
              key={rev._id}
            >
              <View className="flex-row justify-between items-center ml-2">
                <View className="flex-row items-center">
                  <ImageProfile sizeBorder="w-[40] h-[40]" sizeImage={20} />
                  <Text className="text-white ml-4">{rev.user.username}</Text>
                </View>

                <View className="justify-center items-center pt-1 w-[80]">
                  {rev.feeling === "Bad" ? (
                    <>
                      <Entypo name="emoji-sad" size={24} color="red" />
                      <Text className="text-red-500 font-bold mt-2">BAD</Text>
                    </>
                  ) : rev.feeling === "Neutral" ? (
                    <>
                      <Entypo name="emoji-neutral" size={24} color="orange" />
                      <Text className="text-yellow-500 font-bold mt-2">
                        NEUTRAL
                      </Text>
                    </>
                  ) : (
                    <>
                      <Entypo name="emoji-happy" size={24} color="green" />
                      <Text className="text-green-500 font-bold mt-2">
                        GOOD
                      </Text>
                    </>
                  )}
                </View>
              </View>
              <View className="mt-4 ml-2 flex-row ">
                <Text className="text-white text-justify">{rev.opinion}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
