import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import App from "./App.vue";
import router from "./router";

import "./styles/tailwind.css";
import "@fortawesome/fontawesome-free/css/all.css";

app.use(createPinia());
app.use(router);

app.mount("#app");
