import { StyleSheet } from "react-native";
import { useThemeStore } from "@/store/themeStore";

export const useThemeStyles = () => {
  const { colors } = useThemeStore();

  const createStyles = <T extends Record<string, any>>(
    styleFn: (colors: typeof colors) => T
  ): T => {
    return StyleSheet.create(styleFn(colors));
  };

  return { colors, createStyles };
};

