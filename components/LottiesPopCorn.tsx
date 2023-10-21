import LottieView from "lottie-react-native";

export default function LottiesPopCorn() {
  return (
    <LottieView
      autoPlay
      style={{
        width: 250,
        height: 250,
        backgroundColor: "black",
      }}
      // Find more Lottie files at https://lottiefiles.com/featured
      source={require("../assets/lotties/popcorn.json")}
    />
  );
}
