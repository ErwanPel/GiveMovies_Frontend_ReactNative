import {
  Text,
  View,
  Image,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FontAwesome5 } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { RootStackParamList } from "../components/Nav";
import { TMovie } from "./Movie";
import { TMovies } from "./Movies";
import { ZodError } from "zod";
import axios from "axios";
import { MoviesSchema } from "../assets/zodSchema/moviesSchema";
import Card from "../components/Card";
import { verifyParsedData } from "../assets/tools/verifyParsedData";
import { useAuthContext } from "../assets/context/AuthContext";
import LottiesPopCorn from "../components/LottiesPopCorn";

type Props = NativeStackScreenProps<RootStackParamList>;

export default function RandomMoviesScreen(props: Props) {
  const [movie, setMovie] = useState<TMovie | null>(null);
  const [error, setError] = useState<ZodError | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [zodError, setZodError] = useState<ZodError | null>(null);

  const { userToken } = useAuthContext();

  const handleRandom = async (event: GestureResponderEvent) => {
    event.preventDefault();
    try {
      const number = Math.ceil(Math.random() * 472);
      setIsLoading(true);
      const { data } = await axios.get(
        `https://site--givemovies-backend--fwddjdqr85yq.code.run/movies?page=${number}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "Application/json",
          },
        }
      );

      const parsedData: TMovies | null = verifyParsedData<TMovies | null>(
        data,
        MoviesSchema,
        zodError,
        setZodError
      );

      if (parsedData) {
        const movieNumber = Math.ceil(
          Math.random() * parsedData.results.length
        );

        setMovie(parsedData.results[movieNumber]);

        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="absolute flex items-center justify-start w-full h-screen bg-black pt-6">
      <Text className="text-white text-lg">No idea for watch a movie ?</Text>
      <TouchableOpacity onPress={(event) => handleRandom(event)}>
        <View className="bg-white p-4 rounded-lg mt-10 mb-20">
          <FontAwesome5 name="dice" size={38} color="black" />
        </View>
      </TouchableOpacity>
      {isLoading ? (
        <View>
          <LottiesPopCorn />
        </View>
      ) : (
        <Card movie={movie} />
      )}
    </View>
  );
}
