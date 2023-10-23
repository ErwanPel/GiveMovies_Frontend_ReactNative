import { GestureResponderEvent, Alert } from "react-native";

export const warnDelete = (
  event: GestureResponderEvent,
  title: string,
  message: string,

  stateUpload: React.Dispatch<React.SetStateAction<boolean>>,
  func: (event: GestureResponderEvent) => Promise<void>
) => {
  event.persist();
  stateUpload(true);
  Alert.alert(
    title,
    message,
    [
      { text: "Yes", onPress: () => func(event) },
      {
        text: "No",
        onPress: () => stateUpload(false),
        style: "cancel",
      },
    ],
    {
      cancelable: true,
    }
  );
};
