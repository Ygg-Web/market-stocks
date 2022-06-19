import Vue from "vue";
import Router from "vue-router";
import Login from "@/components/login/Login.vue";
import Admin from "@/components/admin/Admin.vue";
import User from "@/components/user/User.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "login",
      component: Login,
    },
    {
      path: "/admin",
      name: "admin",
      component: Admin,
    },
    {
      path: "/user/:id",
      name: "user",
      component: User,
    },
  ],
});
