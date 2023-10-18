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
import Card from "../components/card";
import { FontAwesome } from "@expo/vector-icons";

type Props = NativeStackScreenProps<RootStackParamList>;

export type Movies = z.infer<typeof MoviesSchema>;

export default function MoviesScreen({ navigation }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Movies | null>(null);
  const [selectedPage, setSelectedPage] = useState<number>(1);

  let numberPage = Array.from(Array(473).keys());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `http://10.0.2.2:3000/movies?page=${selectedPage}`
        );
        const responseData = MoviesSchema.parse(data);

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
  }, [selectedPage]);

  if (error) return <Text>Error: {error.message}</Text>;

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
        renderItem={({ item }) => <Card movie={item} />}
      />
    </>
  );
}
{
  /* {data !== null &&
          data.results.map((movie) => {
            return <Card movie={movie} />;
          })} */
}
