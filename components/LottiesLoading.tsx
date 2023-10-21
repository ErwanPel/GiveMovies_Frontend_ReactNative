import LottieView from "lottie-react-native";

export default function LottiesLoading() {
  return (
    <LottieView
      autoPlay
      style={{
        width: 50,
        height: 50,
        backgroundColor: "black",
      }}
      // Find more Lottie files at https://lottiefiles.com/featured
      source={require("../assets/lotties/loadingButton.json")}
    />
  );
}
