import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuthContext } from "../assets/context/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Login from "../screens/Login";
import RandomMovies from "../screens/randomMovies";
import Profile from "../screens/Profile";
import Movies from "../screens/Movies";
import Movie from "../screens/Movie";
import Signin from "../screens/Signin";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import ReviewsWall from "../screens/ReviewsWall";
import ReviewsUser from "../screens/ReviewsUser";

export type RootStackParamList = {
  Signin: undefined;
  Login: undefined;
  Movies: undefined;
  Movie: { id: number };
  Tab: undefined;
  Profile: undefined;
  RandomMovies: undefined;
  ReviewsWall: undefined;
  ReviewUser: { id: string };
};

export type RootTabParamList = {
  TabCinematec: undefined;
  TabProfile: undefined;
  TabRandomMovies: undefined;
};

export default function Nav() {
  const [isLoading, setIsLoading] = useState(true);

  const { setUserToken, userToken, setUserID } = useAuthContext();

  const Stack = createNativeStackNavigator<RootStackParamList>();
  const Tab = createBottomTabNavigator<RootTabParamList>();

  useEffect(() => {
    const bootstrapAsync = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      const userID = await AsyncStorage.getItem("userID");
      console.log("userID", userID);
      setUserToken(userToken);
      setUserID(userID);
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
          <>
            <Stack.Screen name="Signin" component={Signin} />
            <Stack.Screen name="Login" component={Login} />
          </>
        ) : (
          <Stack.Screen name="Tab" options={{ headerShown: false }}>
            {() => (
              <Tab.Navigator
                screenOptions={{
                  headerShown: false,
                  tabBarActiveTintColor: "#B17BE0",
                  tabBarInactiveTintColor: "gray",
                }}
              >
                <Tab.Screen
                  name="TabCinematec"
                  options={{
                    tabBarLabel: "Cinematec",
                    tabBarIcon: ({ color, size }) => (
                      <MaterialIcons
                        name="local-movies"
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator
                      screenOptions={{
                        headerStyle: {
                          backgroundColor: "black",
                        },
                        headerTintColor: "#fff",
                        headerTitleAlign: "center",
                      }}
                    >
                      <Stack.Screen
                        name="ReviewsWall"
                        component={ReviewsWall}
                        options={{
                          title: "Review's Wall",
                        }}
                      />
                      <Stack.Screen
                        name="ReviewUser"
                        component={ReviewsUser}
                        options={{
                          title: "Review's User",
                        }}
                      />
                      <Stack.Screen name="Movies" component={Movies} />
                      <Stack.Screen name="Movie" component={Movie} />
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
                <Tab.Screen
                  name="TabRandomMovies"
                  options={{
                    tabBarLabel: "Random Movie",
                    tabBarIcon: ({ color, size }) => (
                      <FontAwesome5 name="dice" size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator
                      screenOptions={{
                        headerStyle: {
                          backgroundColor: "black",
                        },
                        headerTintColor: "#fff",
                        headerTitleAlign: "center",
                      }}
                    >
                      <Stack.Screen
                        name="RandomMovies"
                        component={RandomMovies}
                      />
                      <Stack.Screen name="Movie" component={Movie} />
                      <Stack.Screen
                        name="ReviewUser"
                        component={ReviewsUser}
                        options={{
                          title: "Review's User",
                        }}
                      />
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
                <Tab.Screen
                  name="TabProfile"
                  options={{
                    tabBarLabel: "Profile",
                    tabBarIcon: ({ color, size }) => (
                      <AntDesign name="profile" size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator
                      screenOptions={{
                        headerStyle: {
                          backgroundColor: "black",
                        },
                        headerTintColor: "#fff",
                        headerTitleAlign: "center",
                      }}
                    >
                      <Stack.Screen name="Profile" component={Profile} />
                      <Stack.Screen
                        name="ReviewUser"
                        component={ReviewsUser}
                        options={{
                          title: "Review's User",
                        }}
                      />
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
