import {
  createContext,
  useContext,
  useState,
} from "react";

interface AuthContextType {
  token: string | null;
  name: string | null;
  email: string | null;
  login: (token: string, name: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  children,
}: any) => {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );
  const [name, setName] = useState(
    localStorage.getItem("userName")
  );
  const [email, setEmail] = useState(
    localStorage.getItem("userEmail")
  );

  const login = (jwt: string, userName: string, userEmail: string) => {
    localStorage.setItem("token", jwt);
    localStorage.setItem("userName", userName);
    localStorage.setItem("userEmail", userEmail);
    setToken(jwt);
    setName(userName);
    setEmail(userEmail);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setToken(null);
    setName(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        name,
        email,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext)!;
};
