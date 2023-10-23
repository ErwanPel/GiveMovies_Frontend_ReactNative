import { View, Text, Image, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./Nav";

type ImageProfileProps = {
  sizeBorder: string;
  sizeImage: number;
  file: string | null;
  id?: string;
};

type userScreenProp = NativeStackNavigationProp<RootStackParamList>;

export default function ImageProfile({
  sizeBorder,
  sizeImage,
  file,
  id,
}: ImageProfileProps) {
  const navigation = useNavigation<userScreenProp>();

  const goToReviewUser = () => {
    if (id) {
      navigation.navigate("ReviewUser", { id: id });
    }
  };

  return (
    <View
      className={`border-white justify-center items-center ${sizeBorder} border-2 p-2 rounded-full overflow-hidden`}
    >
      {file ? (
        <TouchableOpacity onPress={() => goToReviewUser()}>
          <Image
            source={{ uri: file }}
            resizeMode="contain"
            className={`${sizeBorder} rounded-full`}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => goToReviewUser()}>
          <Entypo name="user" size={sizeImage} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}
