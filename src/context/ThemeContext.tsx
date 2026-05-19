import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

interface ThemeContextType {
  darkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext =
  createContext<ThemeContextType>(
    {} as ThemeContextType
  );

export const ThemeProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [darkMode, setDarkMode] =
    useState(false);

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement
        .classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement
        .classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement
        .classList.remove("dark");

      localStorage.setItem(
        "theme",
        "light"
      );
    } else {
      document.documentElement
        .classList.add("dark");

      localStorage.setItem(
        "theme",
        "dark"
      );
    }

    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () =>
  useContext(ThemeContext);
