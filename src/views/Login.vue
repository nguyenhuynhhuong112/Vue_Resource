<template>
  <div class="min-h-screen flex items-center justify-center">
    <div
      class="w-96 p-4 bg-gray-100 rounded-xl justify-center flex items-center flex-col"
    >
      <img src="../assets/login.png" width="50px" class="" />
      <h1 class="text-2xl text-center p-2">Please sign in</h1>
      <a-form
        :model="formState"
        name="basic"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          name="email"
          :rules="[
            {
              required: true,
              message: 'Please input your email!',
              type: 'email',
            },
          ]"
        >
          <a-input v-model:value="formState.email" placeholder="Email address">
            <template #prefix
              ><MailOutlined style="color: rgba(0, 0, 0, 0.25)"
            /></template>
          </a-input>
        </a-form-item>

        <a-form-item
          class="w-72"
          name="password"
          :rules="[
            { required: true, message: 'Please input your password!' },
            { min: 8, message: 'Password must be at least 8 characters long' },
          ]"
        >
          <a-input-password
            v-model:value="formState.password"
            placeholder="Password"
          >
            <template #prefix
              ><LockOutlined style="color: rgba(0, 0, 0, 0.25)"
            /></template>
          </a-input-password>
        </a-form-item>

        <a-form-item name="remember">
          <a-checkbox v-model:checked="formState.remember"
            >Remember me</a-checkbox
          >
        </a-form-item>

        <a-form-item>
          <a-button type="primary" class="w-full" html-type="submit"
            >Sign in</a-button
          >
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script lang="js" >
import { reactive } from "vue";
import { Form, Button, Input, Checkbox } from "ant-design-vue";
import { LockOutlined, MailOutlined } from "@ant-design/icons-vue";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import axios from "axios";
export default {
  name: "Login",
  components: {
    AForm: Form,
    AFormItem: Form.Item,
    AInput: Input,
    AInputPassword: Input.Password,
    AButton: Button,
    ACheckbox: Checkbox,
    MailOutlined,
    LockOutlined,
  },
  data(){
    return{
      formState: {
        email: "",
        password: "",
        remember: true,
      },
      dataUser: []
    }
  },
  methods:{
    async loadDataUser (){
      const response = await axios.get("https://667054bc0900b5f8724a3ee9.mockapi.io/user/user");
      this.dataUser = response.data;
    },
     onFinish  (values)  {
      const findEmail = this.dataUser.find(
        (user) => user.email === values.email
      );
      if (findEmail) {
        if (findEmail.password === values.password) {
          localStorage.setItem("email", values.email);
          localStorage.setItem("role", String(findEmail.role));
          this.$router.push("/");
        } else {
          alert("Password is incorrect");
        }
      } else {
        alert("Email is incorrect");
      }
    },
    onFinishFailed  (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  },
  created(){
    this.loadDataUser(),
    localStorage.clear()
  },
 
};
</script>
