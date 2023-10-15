import { useEffect, useState } from "react";
import { Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import axios from "axios";
import { RootStackParamList } from "../components/Nav";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ZodError, z } from "zod";
import LottiesView from "../components/LottiesView";
import { MoviesSchema } from "../assets/zodSchema/moviesSchema";

type Props = NativeStackScreenProps<RootStackParamList, "Movies">;

type Movies = z.infer<typeof MoviesSchema>;

export default function MoviesScreen({ navigation }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Movies | null>(null);

  console.log(data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`http://10.0.2.2:3000/movies?page=1`);
        const responseData = MoviesSchema.parse(data);

        console.log(responseData);

        setData(responseData);

        setIsLoading(false);
      } catch (error) {
        if (error instanceof ZodError) {
          setError(new Error("erreur Zod"));
          console.log(error);
        } else {
          console.log(error);
        }
      }
    };
    fetchData();
  }, []);

  if (error) return <Text>Error: {error.message}</Text>;

  console.log(data);

  return isLoading ? (
    <LottiesView />
  ) : (
    <>
      <View>
        <Text>473 films</Text>
      </View>
      <ScrollView
        contentContainerStyle={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: 40,
        }}
        className="bg-black"
      >
        {data !== null &&
          data.results.map((movie) => {
            return (
              <View
                className="mb-5 h-[270] w-[154] flex items-center justify-center "
                key={movie.id}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate("Movie", { id: movie.id })}
                >
                  <Image
                    source={{ uri: movie.poster_path.w154 }}
                    className="w-[154] h-[220]"
                  />
                  <Text className="   text-white text-center h-[40] mt-2">
                    {movie.title.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
      </ScrollView>
    </>
  );
}
