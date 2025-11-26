import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";

// Styles (Tailwind 4 & Shadcn)
import "./assets/styles/index.css";

// App Components
import App from "./App.vue";
import router from "./router";
import { i18n } from "./i18n";

const app = createApp(App);

// 1. State Management (Pinia)
const pinia = createPinia();
app.use(pinia);

// 2. Data Fetching (TanStack Query)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
app.use(VueQueryPlugin, { queryClient });

// 3. UI Plugins
app.use(router);
app.use(i18n);

app.mount("#app");
