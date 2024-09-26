import { createApp } from "vue";
import { createPinia } from "pinia";
import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

import "./styles/tailwind.css";
import "@fortawesome/fontawesome-free/css/all.css";

app.use(createPinia());
app.use(router);
app.use(createPinia());
app.use(router);

app.mount("#app");
app.mount("#app");
