import { defineStore } from "pinia";
import { ref } from "vue";

export const useDarkModeStore = defineStore("darkMode", () => {
  const isEnabled = ref(localStorage.getItem("darkMode") || true);
  const isInProgress = ref(false);

  function set(payload = false) {
    isInProgress.value = true;
    isEnabled.value = payload || !isEnabled.value;

    if (typeof document !== "undefined") {
      document.body.classList[isEnabled.value ? "add" : "remove"](
        "dark-scrollbars"
      );

      document.documentElement.classList[isEnabled.value ? "add" : "remove"](
        "dark",
        "dark-scrollbars-compat"
      );
    }

    setTimeout(() => {
      isInProgress.value = false;
    }, 200);

    // You can persist dark mode setting
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("darkMode", isEnabled.value ? "1" : "0");
    }
  }

  return {
    isEnabled,
    isInProgress,
    set,
  };
});
