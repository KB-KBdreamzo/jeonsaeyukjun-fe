// import "./assets/main.css";
import "aos/dist/aos.css";
import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import AOS from "aos";

import "./styles/tailwind.css";
import "@fortawesome/fontawesome-free/css/all.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

AOS.init();

app.mixin({
  mounted() {
    AOS.init({
      // AOS 옵션을 여기에 추가할 수 있습니다
      duration: 800,
      once: true,
    });
  },
  updated() {
    AOS.refresh();
  },
});

app.mount("#app");
