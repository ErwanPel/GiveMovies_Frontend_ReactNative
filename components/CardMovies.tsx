import { View, Text, Image, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./Nav";
import { useNavigation } from "@react-navigation/native";
import { TMovie } from "../screens/Movie";
import { getReviewObject } from "../assets/zodSchema/reviewSchemaFile";
import { z } from "zod";

type TReviewObject = z.infer<typeof getReviewObject>;

type cardProps = {
  movie: TMovie | null;
};

export default function Card({ movie }: cardProps) {
  type MovieScreenProp = NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<MovieScreenProp>();
  return (
    movie && (
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
    )
  );
}
