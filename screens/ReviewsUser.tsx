import { Text, FlatList, View, TouchableOpacity, Image } from "react-native";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../components/Nav";
import { useAuthContext } from "../assets/context/AuthContext";
import { ZodError, z } from "zod";
import { getReviewSchema } from "../assets/zodSchema/reviewSchemaFile";
import { getReviewObject } from "../assets/zodSchema/reviewSchemaFile";
import { verifyParsedData } from "../assets/tools/verifyParsedData";
import ListForReviews from "../components/ListForReviews";
import LottiesView from "../components/LottiesView";

type Props = NativeStackScreenProps<RootStackParamList, "ReviewUser">;

type TReviewArray = z.infer<typeof getReviewSchema>;
type TReviewObject = z.infer<typeof getReviewObject>;

export default function ReviewsUser(props: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<TReviewArray | null>(null);
  const [zodError, setZodError] = useState<ZodError | null>(null);
  const [reload, setReload] = useState<boolean>(false);

  const { userToken } = useAuthContext();

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(
          `https://site--givemovies-backend--fwddjdqr85yq.code.run/review/${props.route.params.id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "Application/json",
            },
          }
        );

        const parsedData = verifyParsedData<TReviewArray>(
          data,
          getReviewSchema,
          zodError,
          setZodError
        );

        setIsLoading(false);
        setData(parsedData);
      } catch (error: any) {
        console.log(error);
      }
    };
    setReload(false);
    getData();
  }, [reload]);

  const renderItem = useCallback(
    ({ item }: any) => <ListForReviews item={item} setReload={setReload} />,
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
    <LottiesView />
  ) : (
    <FlatList
      contentContainerStyle={{
        alignItems: "center",
      }}
      className="bg-black pt-3"
      data={data && data}
      initialNumToRender={3}
      windowSize={3}
      maxToRenderPerBatch={3}
      ListEmptyComponent={emptyList}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
    />
  );
}
