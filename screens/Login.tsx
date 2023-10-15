import { Text, View, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuthContext } from "../assets/context/AuthContext";
import { RootStackParamList } from "../components/Nav";
import { z, ZodError } from "zod";
import axios from "axios";
import { useState } from "react";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const passSchema = z.object({
  password: z.string().min(10, {
    message: "le mot de passe est trop petit",
  }),
});

const tokenSchema = z.object({
  token: z.string(),
});

export default function Login(props: Props) {
  const [error, setError] = useState<string | null>(null);

  const connect = async (): Promise<null | string> => {
    const pass = { password: "cameleon78" };
    try {
      const validPass = passSchema.parse(pass);

      try {
        const { data } = await axios.post("http://10.0.2.2:3000/login", pass);
        const responseZod = tokenSchema.parse(data);

        return responseZod.token;
      } catch (error) {
        if (error instanceof ZodError) {
          console.log("ZodError");
        } else {
          console.log("error");
        }
        return null;
      }
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.issues[0].message);
        setError(error.issues[0].message);
      } else {
        console.log(error);
      }
      return null;
    }
  };

  const { setToken } = useAuthContext();
  return (
    <View className="flex items-center justify-center w-full h-screen bg-black">
      <View>
        <TouchableOpacity
          onPress={async () => {
            const response = await connect();
            if (typeof response === "string") {
              await setToken(response);
            }
          }}
        >
          <Text className="bg-purple-700 p-5 rounded-xl text-white">LOGIN</Text>
        </TouchableOpacity>
      </View>
      {error && <Text className="text-red-700 mt-4">{error}</Text>}
    </View>
  );
}
