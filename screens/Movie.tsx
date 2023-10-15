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
import ReviewForm from "../components/ReviewForm";
import { Entypo } from "@expo/vector-icons";

type Props = NativeStackScreenProps<RootStackParamList, "Movie">;

type Movies = z.infer<typeof SoloMovieSchema>;

export default function MovieScreen(props: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Movies | null>(null);
  console.log(props.route.params.id);

  const reviewRef = useRef<TextInput | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `http://10.0.2.2:3000/movies/${props.route.params.id}`
        );
        const responseData = SoloMovieSchema.parse(data);
        console.log(responseData);
        setData(responseData);

        setIsLoading(false);
      } catch (error) {
        if (error instanceof ZodError) {
          setError(new Error("erreur Zod"));
        } else {
          setError(new Error("error occured"));
        }
        console.log(error);
      }
    };
    fetchData();
  }, []);

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
                <Text className="text-white bg-purple-500 w-[50] py-1 rounded-sm text-lg text-center">
                  {data.vote_average.toFixed(1)}
                </Text>
                <Text className="text-white text-lg text-center ">
                  {data.release_date}
                </Text>
              </View>
              <Text className="text-white text-base  mt-4 ">
                {data.overview}
              </Text>
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
      <ReviewForm reviewRef={reviewRef} />
    </ScrollView>
  );
}
