import { View, Text } from "react-native";
import { Entypo } from "@expo/vector-icons";

type ImageProfileProps = {
  sizeBorder: string;
  sizeImage: number;
};

export default function ImageProfile({
  sizeBorder,
  sizeImage,
}: ImageProfileProps) {
  return (
    <View
      className={`border-white justify-center items-center ${sizeBorder} border-2 p-2 rounded-full`}
    >
      <Entypo name="user" size={sizeImage} color="white" />
    </View>
  );
}
