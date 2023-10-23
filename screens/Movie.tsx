import { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import axios from "axios";
import { RootStackParamList } from "../components/Nav";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ZodError, z } from "zod";
import LottiesView from "../components/LottiesView";
import { SoloMovieSchema } from "../assets/zodSchema/moviesSchema";
import Reviews from "../components/Reviews";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { verifyParsedData } from "../assets/tools/verifyParsedData";
import { useAuthContext } from "../assets/context/AuthContext";

type Props = NativeStackScreenProps<RootStackParamList, "Movie">;

export type TMovie = z.infer<typeof SoloMovieSchema>;

export default function MovieScreen(props: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<TMovie | null>(null);
  const [showOverView, setShowOverview] = useState<boolean>(false);
  const [zodError, setZodError] = useState<ZodError | null>(null);

  const reviewRef = useRef<TextInput | null>(null);

  const { userToken } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `https://site--givemovies-backend--fwddjdqr85yq.code.run/movies/${props.route.params.id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "Application/json",
            },
          }
        );
        const parsedData: TMovie | null = verifyParsedData<TMovie | null>(
          data,
          SoloMovieSchema,
          zodError,
          setZodError
        );
        setData(parsedData);

        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  console.log(JSON.stringify(data, null, 2));

  return isLoading ? (
    <LottiesView />
  ) : (
    <ScrollView>
      <View className="flex items-center justify-center w-full h-screen">
        {data !== null && (
          <>
            <Image
              source={{ uri: data.poster_path.original }}
              className="w-full h-full opacity-60"
            />

            <View className="absolute bg-black w-full flex items-center opacity-90 p-4">
              <View className="flex items-center gap-3">
                <Text className="text-white text-lg text-center">
                  {data.title}
                </Text>
                <View className="flex-row justify-around items-center gap-x-5">
                  <Text className="text-white bg-purple-500 w-[50] py-1 rounded-sm text-lg text-center">
                    {data.vote_average.toFixed(1)}
                  </Text>
                  <Text className="text-white text-lg text-center ">
                    {data.release_date}
                  </Text>
                </View>
              </View>
              <Text
                numberOfLines={showOverView ? undefined : 8}
                className="text-white text-base text-justify mt-4 "
              >
                {data.overview}
              </Text>
              <TouchableOpacity
                className="self-start"
                onPress={() => setShowOverview(!showOverView)}
              >
                <View className="mt-2 flex-row items-center ">
                  <Text className="text-white underline decoration-white ">
                    {showOverView ? "Show less" : "Show More"}
                  </Text>
                  <MaterialIcons
                    name={showOverView ? "arrow-drop-up" : "arrow-drop-down"}
                    size={24}
                    color="white"
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => reviewRef.current?.focus()}>
                <View className="items-center gap-2 mt-2">
                  <Entypo
                    name="arrow-with-circle-down"
                    size={40}
                    color="white"
                  />
                  <Text className="text-white">See the reviews</Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      <Reviews
        reviewRef={reviewRef}
        id={data && data.id}
        title={data && data.title}
        poster={data && data.poster_path.w154}
      />
    </ScrollView>
  );
}
