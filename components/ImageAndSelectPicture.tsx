import { View, TouchableOpacity } from "react-native";
import ImageProfile from "../components/ImageProfile";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import {
  getPermissionAndGetPicture,
  getPermissionAndCamera,
} from "../assets/tools/openCameraAndGalleryFunction";

type ImageAndSelectPictureProps = {
  picture: string | null;
  setPicture: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function ImageAndSelectPicture({
  picture,
  setPicture,
}: ImageAndSelectPictureProps) {
  console.log(picture);
  return (
    <View className="flex-row items-center mb-6">
      <ImageProfile file={picture} sizeBorder="w-[80] h-[80]" sizeImage={28} />
      <View className="ml-12  gap-y-7 items-center">
        <TouchableOpacity
          onPress={() => getPermissionAndGetPicture(setPicture)}
        >
          <FontAwesome name="file-photo-o" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => getPermissionAndCamera(setPicture)}>
          <FontAwesome name="camera" size={26} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
