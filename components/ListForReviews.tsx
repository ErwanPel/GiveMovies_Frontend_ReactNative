import { Text, FlatList, View, TouchableOpacity, Image } from "react-native";
import CardReview from "./CardReview";
import { TReviewObject } from "../screens/ReviewsWall";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./Nav";

type listForReviewsProps = {
  item: TReviewObject;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
};

type ReviewScreenProp = NativeStackNavigationProp<RootStackParamList>;

export default function ListForReviews({
  item,
  setReload,
}: listForReviewsProps) {
  const navigation = useNavigation<ReviewScreenProp>();

  return (
    <View
      className=" mb-[50]
   border-b-2 border-zinc-100 items-center "
    >
      <CardReview reviewItem={item} setReload={setReload} />
      <View
        className=" h-[210] w-[154]  flex items-center justify-center mt-4 "
        key={item._id}
      >
        <TouchableOpacity
          className="items-center"
          onPress={() => navigation.navigate("Movie", { id: item.movieID })}
        >
          <Image source={{ uri: item.poster }} className="w-[100] h-[140]" />

          <Text className="text-white text-center h-[40] mt-2">
            {item.title.toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
