import ReviewForm from "./ReviewForm";
import { TextInput, View, ScrollView, FlatList, Text } from "react-native";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { z, ZodError } from "zod";
import { getReviewSchema } from "../assets/zodSchema/reviewSchemaFile";
import { useAuthContext } from "../assets/context/AuthContext";
import ImageProfile from "./ImageProfile";
import { Entypo } from "@expo/vector-icons";
import CardReview from "./CardReview";
import { verifyParsedData } from "../assets/tools/verifyParsedData";
import { TReviewObject } from "../screens/ReviewsWall";

type ReviewProps = {
  reviewRef: React.LegacyRef<TextInput> | null;
  id: number | null;
  title: string | null;
  poster: string | null;
};

export type TReview = z.infer<typeof getReviewSchema>;

export default function Review({ reviewRef, id, title, poster }: ReviewProps) {
  const [data, setData] = useState<TReview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState(null);
  const [zodError, setZodError] = useState<ZodError | null>(null);
  const [reload, setReload] = useState<boolean>(false);

  const { userToken, userID } = useAuthContext();

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
          const parsedData: TReview | null = verifyParsedData<TReview | null>(
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

  const renderItem = useCallback(
    ({ item }: any) => <CardReview reviewItem={item} setReload={setReload} />,
    []
  );

  const keyExtractor = useCallback(
    (item: TReviewObject) => String(item._id),
    []
  );

  const emptyList = useCallback(
    () => (
      <View>
        <Text className="text-white">You have no review</Text>
      </View>
    ),
    []
  );

  return isLoading ? (
    <Text>Loading</Text>
  ) : (
    <View className="bg-black gap-y-12">
      <ReviewForm
        reviewRef={reviewRef}
        id={id}
        title={title}
        poster={poster}
        setReload={setReload}
        reload={reload}
      />

      <FlatList
        contentContainerStyle={{
          alignItems: "center",
        }}
        horizontal
        className="bg-black pt-3"
        data={data && data}
        initialNumToRender={4}
        windowSize={4}
        maxToRenderPerBatch={4}
        ListEmptyComponent={emptyList}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </View>
  );
}
