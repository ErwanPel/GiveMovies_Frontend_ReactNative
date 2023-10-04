import { useEffect, useState } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import { RootStackParamList } from "./App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ZodError, z } from "zod";

type Props = NativeStackScreenProps<RootStackParamList, "Movies">;

const MoviesSchema = z.array(
  z.object({
    backdrop_path: z.string(),
    poster_path: z.string(),
    overview: z.string(),
    release_date: z.string(),
    title: z.string(),
    vote_average: z.number(),
    id: z.string(),
  })
);

type Movies = z.infer<typeof MoviesSchema>;

export default function MoviesScreen({ navigation }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [data, setData] = useState<Movies | null>(null);

  console.log(data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("http://10.0.2.2:3000/movies");
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

  if (error) return <Text>Error: {error.message}</Text>;

  return isLoading ? (
    <View className="flex items-center justify-center w-full h-screen">
      <Text>Loading</Text>
    </View>
  ) : (
    <View className="flex items-center justify-center w-screen h-screen  bg-black">
      {data !== null &&
        data.map((movie) => {
          return (
            <View className="mb-4" key={movie.id}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Movie", { id: movie.id })}
              >
                <Text className="bg-purple-700 p-5 rounded-xl text-white">
                  {movie.title}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
    </View>
  );
}
