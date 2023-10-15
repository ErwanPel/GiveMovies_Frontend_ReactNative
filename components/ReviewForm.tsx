import { Text, View, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Entypo } from "@expo/vector-icons";

type ReviewFormProps = {
  reviewRef: React.LegacyRef<TextInput> | null;
};

export default function ReviewForm({ reviewRef }: ReviewFormProps) {
  const [emoji, setEmoji] = useState<"Good" | "Neutral" | "Bad">();
  const [text, setText] = useState<string>("");

  return (
    <View className="bg-black px-4 pt-4 flex gap-4">
      <Text className="text-white text-lg">Your review</Text>
      <View className="flex flex-row justify-around">
        <TouchableOpacity onPress={() => setEmoji("Good")}>
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
        <TouchableOpacity onPress={() => setEmoji("Neutral")}>
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
        <TouchableOpacity onPress={() => setEmoji("Bad")}>
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
      <TextInput
        ref={reviewRef}
        onChangeText={(text) => setText((prev) => text)}
        multiline
        numberOfLines={4}
        placeholder="What do you think about this movie ?"
        placeholderTextColor={"grey"}
        style={{ textAlignVertical: "top" }}
        maxLength={170}
        className="bg-white my-2 p-1.5 text-lg"
      />
      <TouchableOpacity className="self-center">
        <Text className="text-white bg-purple-500 p-4 rounded-xl">
          SEND YOUR REVIEW
        </Text>
      </TouchableOpacity>
    </View>
  );
}
