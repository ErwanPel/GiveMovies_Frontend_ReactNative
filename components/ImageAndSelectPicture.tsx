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
  sizeBorder: string;
  sizeImage: number;
  changePicture?: boolean;
  setChangePicture?: React.Dispatch<React.SetStateAction<boolean>>;
  enableUpdateButton?: boolean;
  setEnableUpdateButton?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ImageAndSelectPicture({
  picture,
  setPicture,
  sizeBorder,
  sizeImage,
  changePicture,
  setChangePicture,
  enableUpdateButton,
  setEnableUpdateButton,
}: ImageAndSelectPictureProps) {
  const enableModifyProfil = () => {
    if (setChangePicture && setEnableUpdateButton) {
      setChangePicture(true);
      setEnableUpdateButton(false);
    }
  };

  return (
    <View className="flex-row items-center mb-6">
      <ImageProfile
        file={picture}
        sizeBorder={sizeBorder}
        sizeImage={sizeImage}
      />
      <View className="ml-12  gap-y-7 items-center">
        <TouchableOpacity
          onPress={() => {
            !changePicture && enableModifyProfil();
            getPermissionAndGetPicture(
              setPicture,
              setChangePicture,
              setEnableUpdateButton
            );
          }}
        >
          <FontAwesome name="file-photo-o" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            !changePicture && enableModifyProfil();
            getPermissionAndCamera(
              setPicture,
              setChangePicture,
              setEnableUpdateButton
            );
          }}
        >
          <FontAwesome name="camera" size={26} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
