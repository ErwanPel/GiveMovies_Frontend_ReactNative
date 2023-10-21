import ReviewForm from "./ReviewForm";
import { TextInput, View, ScrollView, Text } from "react-native";
import axios from "axios";
import { useState, useEffect } from "react";
import { z, ZodError } from "zod";
import { getReviewSchema } from "../assets/zodSchema/reviewSchemaFile";
import { useAuthContext } from "../assets/context/AuthContext";
import ImageProfile from "./ImageProfile";
import { Entypo } from "@expo/vector-icons";
import { verifyParsedData } from "../assets/tools/verifyParsedData";

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
  const [zodError, setZodError] = useState<ZodError | null>(null);
  const [reload, setReload] = useState<Boolean>(false);

  const { userToken } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `https://site--givemovies-backend--fwddjdqr85yq.code.run/review?movieID=${id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "Application/json",
            },
          }
        );

        if (data.length === 0) {
          setData(data);
        } else {
          const parsedData: Review | null = verifyParsedData<Review | null>(
            data,
            getReviewSchema,
            zodError,
            setZodError
          );
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
      <ScrollView horizontal className="border-zinc-400 border-t-2 ">
        {data?.map((rev) => {
          return (
            <View
              className="border-zinc-300  border-2 w-[290] p-3 rounded-3xl mx-4 my-8"
              key={rev._id}
            >
              <View className="flex-row justify-between items-center ml-1">
                <View>
                  <View className="flex-row items-center">
                    <ImageProfile
                      file={
                        rev.user.photo[0]?.secure_url
                          ? rev.user.photo[0]?.secure_url
                          : null
                      }
                      sizeBorder="w-[40] h-[40]"
                      sizeImage={20}
                    />
                    <Text className="text-white text-base ml-4">
                      {rev.user.username}
                    </Text>
                  </View>
                  <Text className="text-white mt-2 italic">
                    Post on {rev.date}
                  </Text>
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
              <View className="mt-4 ml-1">
                <Text className="text-white text-justify">{rev.opinion}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
