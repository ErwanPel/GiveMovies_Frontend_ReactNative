import {
  Text,
  View,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FontAwesome5 } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { RootStackParamList } from "../components/Nav";
import { TMovie } from "./Movie";
import { ZodError } from "zod";
import axios from "axios";
import { MoviesSchema } from "../assets/zodSchema/moviesSchema";
import Card from "../components/Card";

type Props = NativeStackScreenProps<RootStackParamList>;

export default function RandomMoviesScreen(props: Props) {
  const [movie, setMovie] = useState<TMovie | null>(null);
  const [error, setError] = useState<ZodError | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(true);

  const handleRandom = async (event: GestureResponderEvent) => {
    event.preventDefault();
    try {
      const number = Math.ceil(Math.random() * 472);
      const { data } = await axios.get(
        `https://site--givemovies-backend--fwddjdqr85yq.code.run/movies?page=${number}`
      );
      const responseData = MoviesSchema.parse(data);
      console.log(JSON.stringify(responseData, null, 2));

      const movieNumber = Math.ceil(
        Math.random() * responseData.results.length
      );

      setMovie(responseData.results[movieNumber]);

      setIsLoading(false);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log("zod error");
        console.log(error);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <View className="flex items-center justify-start w-full h-screen bg-black pt-6">
      <Text className="text-white text-lg">No idea for watch a movie ?</Text>
      <TouchableOpacity onPress={(event) => handleRandom(event)}>
        <View className="bg-white p-4 rounded-lg mt-10 mb-20">
          <FontAwesome5 name="dice" size={38} color="black" />
        </View>
      </TouchableOpacity>
      {!isLoading && <Card movie={movie} />}
    </View>
  );
}
