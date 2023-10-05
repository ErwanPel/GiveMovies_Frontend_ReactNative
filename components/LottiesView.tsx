import { View } from "react-native";
import LottieView from "lottie-react-native";

export default function LottiesView() {
  return (
    <View
      style={{
        backgroundColor: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <LottieView
        autoPlay
        style={{
          width: 200,
          height: 200,
        }}
        source={require("../assets/lotties/movie.json")}
      />
    </View>
  );
}
