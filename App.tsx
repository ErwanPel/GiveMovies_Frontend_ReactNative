import Nav from "./components/Nav";
import AuthProvider from "./assets/context/AuthContext";

export default function App(): JSX.Element | null {
  return (
    <AuthProvider>
      <Nav />
    </AuthProvider>
  );
}
