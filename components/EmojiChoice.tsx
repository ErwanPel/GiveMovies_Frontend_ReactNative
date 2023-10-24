import {
  View,
  TouchableOpacity,
  Text,
  GestureResponderEvent,
} from "react-native";
import { Entypo } from "@expo/vector-icons";

type emojiChoiceProps = {
  emoji: "Good" | "Neutral" | "Bad" | null;
  setEmoji: React.Dispatch<
    React.SetStateAction<"Good" | "Neutral" | "Bad" | null>
  >;
  setActivateUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  activateUpdate: boolean;
};

export default function EmojiChoice({
  emoji,
  setEmoji,
  setActivateUpdate,
  activateUpdate,
}: emojiChoiceProps) {
  const setFunctionEmoji = (emoji: "Good" | "Bad" | "Neutral") => {
    if (activateUpdate) setActivateUpdate(false);
    if (emoji === "Good") {
      setEmoji("Good");
    } else if (emoji === "Neutral") {
      setEmoji("Neutral");
    } else if (emoji === "Bad") {
      setEmoji("Bad");
    }
  };

  return (
    <View className="flex flex-row justify-around">
      <TouchableOpacity onPress={() => setFunctionEmoji("Good")}>
        <View
          className={
            emoji === "Good"
              ? "items-center p-1.5 rounded-lg bg-slate-700 w-[80]"
              : "items-center p-1.5 w-[80]"
          }
        >
          <Entypo name="emoji-happy" size={24} color="green" />
          <Text className="text-green-500 font-bold mt-2">GOOD</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setFunctionEmoji("Neutral")}>
        <View
          className={
            emoji === "Neutral"
              ? "items-center p-1.5 rounded-lg bg-slate-700 w-[80]"
              : "items-center p-1.5 w-[80]"
          }
        >
          <Entypo name="emoji-neutral" size={24} color="orange" />
          <Text className="text-yellow-500 font-bold mt-2">NEUTRAL</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setFunctionEmoji("Bad")}>
        <View
          className={
            emoji === "Bad"
              ? "items-center p-1.5 rounded-lg bg-slate-700 w-[80]"
              : "items-center p-1.5 w-[80]"
          }
        >
          <Entypo name="emoji-sad" size={24} color="red" />
          <Text className="text-red-500 font-bold mt-2">BAD</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
