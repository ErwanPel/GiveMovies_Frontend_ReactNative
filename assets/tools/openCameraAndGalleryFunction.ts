import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

export const getPermissionAndGetPicture = async (
  setPicture: React.Dispatch<React.SetStateAction<string | null>>,
  setChangePicture?: React.Dispatch<React.SetStateAction<boolean>>,
  setEnableUpdateButton?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status === "granted") {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (result.canceled) {
      alert("no picture is selected");
      if (setChangePicture && setEnableUpdateButton) {
        setChangePicture(false);
        setEnableUpdateButton(true);
      }
    } else {
      setPicture(result.assets[0].uri);
    }
  } else {
    if (setChangePicture && setEnableUpdateButton) {
      setChangePicture(false);
      setEnableUpdateButton(true);
    }
    if (Platform.OS === "android") {
      alert(
        "acces to librairy denied. If you want enable the librairy's access, you have to change change permission in your phone : Setting => Applications => AirBNB app => Authorizations => Photos & videos => authorize"
      );
    } else {
      alert(
        "Acces to librairy denied. If you want enable the librairy's access, you have to change change permission in your phone : Setting => AirBNB app => Photos => all photos or selected photos"
      );
    }
  }
};

export const getPermissionAndCamera = async (
  setPicture: React.Dispatch<React.SetStateAction<string | null>>,
  setChangePicture?: React.Dispatch<React.SetStateAction<boolean>>,
  setEnableUpdateButton?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status === "granted") {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (result.canceled === true) {
      if (setChangePicture && setEnableUpdateButton) {
        setChangePicture(false);
        setEnableUpdateButton(true);
      }
      alert("no picture is selected");
    } else {
      setPicture(result.assets[0].uri);
    }
  } else {
    if (setChangePicture && setEnableUpdateButton) {
      setChangePicture(false);
      setEnableUpdateButton(true);
    }
    if (Platform.OS === "android") {
      alert(
        "acces to camera denied. If you want enable the camera's access, you have to change change permission in your phone : Setting => Applications => AirBNB app => Authorizations => Camera => authorize"
      );
    } else {
      alert(
        "Acces to camera denied. If you want enable the camera's access, you have to change change permission in your phone : Setting => AirBNB app => change the toggle for camera"
      );
    }
  }
};
