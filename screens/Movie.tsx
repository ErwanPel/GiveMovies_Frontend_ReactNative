import { useEffect, useState } from "react";
import { Text, View, Image } from "react-native";
import axios from "axios";
import { RootStackParamList } from "../components/Nav";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ZodError, z } from "zod";
import LottiesView from "../components/LottiesView";

type Props = NativeStackScreenProps<RootStackParamList, "Movie">;

const MoviesSchema = z.object({
  backdrop_path: z.object({
    w300: z.string(),
    w780: z.string(),
    w1280: z.string(),
    original: z.string(),
  }),
  poster_path: z.object({
    w92: z.string(),
    w154: z.string(),
    w185: z.string(),
    w342: z.string(),
    w500: z.string(),
    w780: z.string(),
    original: z.string(),
  }),
  overview: z.string(),
  release_date: z.string(),
  title: z.string(),
  vote_average: z.number(),
  id: z.number(),
});
type Movies = z.infer<typeof MoviesSchema>;

export default function MovieScreen(props: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Movies | null>(null);
  console.log(props.route.params.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `http://10.0.2.2:3000/movies/${props.route.params.id}`
        );
        const responseData = MoviesSchema.parse(data);
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
    <View className="flex items-center justify-center w-full h-screen">
      {data !== null && (
        <>
          <Image
            source={{ uri: data.poster_path.original }}
            className="w-full h-full opacity-60"
          />
          <View className="absolute bg-black w-full flex flex-col items-center opacity-90 p-4">
            <View className="flex flex-row gap-1">
              <Text className="text-white text-lg">{data.title} /</Text>
              <Text className="text-white text-lg">
                {data.vote_average.toFixed(1)} /
              </Text>
              <Text className="text-white text-lg">{data.release_date}</Text>
            </View>
            <Text className="text-white ">{data.overview}</Text>
          </View>
        </>
      )}
    </View>
  );
}
