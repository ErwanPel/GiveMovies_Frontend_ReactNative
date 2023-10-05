import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthContext } from "../assets/context/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Login from "../screens/Login";
import Home from "../screens/Home";
import Movies from "../screens/Movies";
import Movie from "../screens/Movie";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Movies: undefined;
  Movie: { id: string };
};

export default function Nav() {
  const [isLoading, setIsLoading] = useState(true);

  const { setUserToken, userToken, setToken } = useAuthContext();

  const Stack = createNativeStackNavigator<RootStackParamList>();

  useEffect(() => {
    const bootstrapAsync = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      setUserToken(userToken);
      setIsLoading(false);
    };
    bootstrapAsync();
  }, []);

  if (isLoading === true) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "black",
          },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
        }}
      >
        {!userToken ? (
          <Stack.Screen name="Login" component={Login} />
        ) : (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Movies" component={Movies} />
            <Stack.Screen name="Movie" component={Movie} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
