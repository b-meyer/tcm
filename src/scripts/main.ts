import { createApp } from 'vue';
import App from '@/components/App.vue';
import PageLayout from '@/components/PageLayout.vue';
import { router } from '@/scripts/router';
import '@/styles/main.css';

const app = createApp(App);
app.component('PageLayout', PageLayout);
app.use(router);
await router.isReady();
app.mount('#app');
