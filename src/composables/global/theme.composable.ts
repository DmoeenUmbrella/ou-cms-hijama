import { onMounted } from "vue";
import { useColorMode } from "@vueuse/core";

export const useTheme = () => {
  const colorMode = useColorMode({
    initialValue: "light",
    emitAuto: false, // disable system detection // will be changed for prod in future
    storageKey: "theme",
    modes: {
      light: "light",
      dark: "dark", // optional if you plan to toggle later
    },
  });

  onMounted(() => {
    colorMode.value = "light"; // force initial light mode
  });

  const setLight = () => (colorMode.value = "light");
  const setDark = () => (colorMode.value = "dark");
  const toggle = () =>
    (colorMode.value = colorMode.value === "dark" ? "light" : "dark");

  return {
    colorMode,
    setLight,
    setDark,
    toggle,
  };
}
