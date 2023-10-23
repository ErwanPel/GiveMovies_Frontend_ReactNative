import { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, FlatList } from "react-native";
import axios from "axios";
import { RootStackParamList } from "../components/Nav";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ZodError, z } from "zod";
import LottiesView from "../components/LottiesView";
import { MoviesSchema } from "../assets/zodSchema/moviesSchema";
import { TMovie } from "./Movie";
import { Picker } from "@react-native-picker/picker";
import CardMovies from "../components/CardMovies";
import { FontAwesome } from "@expo/vector-icons";
import { verifyParsedData } from "../assets/tools/verifyParsedData";
import { useAuthContext } from "../assets/context/AuthContext";

type Props = NativeStackScreenProps<RootStackParamList>;

export type TMovies = z.infer<typeof MoviesSchema>;

export default function MoviesScreen({ navigation }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<TMovies | null>(null);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [zodError, setZodError] = useState<ZodError | null>(null);

  let numberPage = Array.from(Array(473).keys());

  const { userToken } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `https://site--givemovies-backend--fwddjdqr85yq.code.run/movies?page=${selectedPage}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "Application/json",
            },
          }
        );

        const parsedData: TMovies | null = verifyParsedData<TMovie | null>(
          data,
          MoviesSchema,
          zodError,
          setZodError
        );
        setData(parsedData);

        setIsLoading(false);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchData();
  }, [selectedPage]);

  if (error)
    return <Text className="text-red-700 mt-4">Error: {error.message}</Text>;

  return isLoading ? (
    <LottiesView />
  ) : (
    <>
      <View>
        <Picker
          selectedValue={selectedPage}
          onValueChange={(page) => {
            setSelectedPage(page);
          }}
        >
          {numberPage.map((num, index) => {
            return (
              <Picker.Item
                key={index}
                label={`page ${num + 1}`}
                value={num + 1}
              />
            );
          })}
        </Picker>
      </View>
      <View className="flex-row justify-between  p-6 bg-black">
        <View
          className={
            selectedPage > 1
              ? "flex-row  justify-around w-[150] "
              : "opacity-0 flex-row justify-around "
          }
        >
          <TouchableOpacity onPress={() => setSelectedPage(1)}>
            <FontAwesome name="angle-double-left" size={32} color="purple" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setSelectedPage(selectedPage - 1)}>
            <FontAwesome name="angle-left" size={32} color="purple" />
          </TouchableOpacity>
        </View>

        <View
          className={
            selectedPage < 473
              ? "flex-row justify-around  w-[150] "
              : "opacity-0 flex-row justify-around "
          }
        >
          <TouchableOpacity onPress={() => setSelectedPage(selectedPage + 1)}>
            <FontAwesome name="angle-right" size={32} color="purple" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedPage(473)}>
            <FontAwesome name="angle-double-right" size={32} color="purple" />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        contentContainerStyle={{
          alignItems: "center",
          gap: 40,
        }}
        key="1"
        numColumns={2}
        columnWrapperStyle={{ gap: 40 }}
        className="bg-black pt-3"
        data={data && data.results}
        keyExtractor={(item: TMovie) => String(item.id)}
        renderItem={({ item }) => <CardMovies movie={item} />}
      />
    </>
  );
}
