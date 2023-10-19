import { View, Text, Image } from "react-native";
import { Entypo } from "@expo/vector-icons";

type ImageProfileProps = {
  sizeBorder: string;
  sizeImage: number;
  file: string | null;
};

export default function ImageProfile({
  sizeBorder,
  sizeImage,
  file,
}: ImageProfileProps) {
  return (
    <View
      className={`border-white justify-center items-center ${sizeBorder} border-2 p-2 rounded-full overflow-hidden`}
    >
      {file ? (
        <Image
          source={{ uri: file }}
          resizeMode="contain"
          className={`${sizeBorder} rounded-full`}
        />
      ) : (
        <Entypo name="user" size={sizeImage} color="white" />
      )}
    </View>
  );
}
