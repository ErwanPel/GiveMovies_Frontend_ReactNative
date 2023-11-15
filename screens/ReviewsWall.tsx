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
import LottiesView from "../components/LottiesView";
import ListForReviews from "../components/ListForReviews";

type Props = NativeStackScreenProps<RootStackParamList>;

type TReviewArray = z.infer<typeof getReviewSchema>;
export type TReviewObject = z.infer<typeof getReviewObject>;

export default function ReviewsWall({ navigation }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<TReviewArray | null>(null);
  const [zodError, setZodError] = useState<ZodError | null>(null);
  const [reload, setReload] = useState<boolean>(false);

  const { userToken, userID } = useAuthContext();

  useEffect(() => {
    const getData = async () => {
      try {
        let query = "";
        const { data } = await axios.get(
          `https://site--givemovies-backend--fwddjdqr85yq.code.run/review/all`,
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

  const goToReviewUser = () => {
    if (userID) {
      navigation.navigate("ReviewUser", { id: userID });
    }
  };

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
    <>
      <View className="items-center flex-row justify-around bg-black border-b-2 border-zinc-100">
        <TouchableOpacity onPress={() => goToReviewUser()}>
          <View className=" p-5">
            <Text className="bg-purple-700 text-white p-3 rounded-3xl w-32 text-center">
              MY REVIEWS
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Movies")}>
          <View className=" p-5 ">
            <Text className="bg-purple-700 text-white p-3 rounded-3xl w-32 text-center">
              GO TO MOVIES
            </Text>
          </View>
        </TouchableOpacity>
      </View>

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
    </>
  );
}
