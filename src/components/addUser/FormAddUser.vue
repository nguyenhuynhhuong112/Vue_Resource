<template>
  <a-form
    ref="formRef"
    :model="formState"
    v-bind="layout"
    name="nest-messages"
    :validate-messages="validateMessages"
    @finish="onFinish"
  >
    <a-form-item
      :name="['user', 'email']"
      label="Email"
      :rules="[{ type: 'email' }, { required: true }]"
    >
      <a-input v-model:value="formState.user.email" />
    </a-form-item>
    <a-form-item
      :name="['user', 'name']"
      label="Name"
      :rules="[{ required: true }]"
    >
      <a-input v-model:value="formState.user.name" />
    </a-form-item>
    <a-form-item
      :name="['user', 'username']"
      label="User Name"
      :rules="[{ required: true }]"
    >
      <a-input v-model:value="formState.user.username" />
    </a-form-item>
    <a-form-item
      :name="['user', 'password']"
      label="Password"
      :rules="[
        { required: true, message: 'Please input your password!' },
        { min: 8, message: 'Password must be at least 8 characters long' },
      ]"
    >
      <a-input-password
        v-model:value="formState.user.password"
        placeholder="Password"
      />
    </a-form-item>
    <a-form-item
      :name="['user', 'checkPass']"
      label="Confirm"
      :rules="[
        { required: true, message: 'Please confirm your password!' },
        { validator: checkPasswordConfirm, message: 'Passwords do not match' },
      ]"
    >
      <a-input-password
        v-model:value="formState.user.checkPass"
        placeholder="Password"
      />
    </a-form-item>
    <a-form-item
      label="Role"
      :name="['user', 'resource']"
      :rules="[{ required: true, message: 'Please selected role user ' }]"
    >
      <a-radio-group v-model:value="formState.user.resource">
        <a-radio value="1">User</a-radio>
        <a-radio value="2">Admin</a-radio>
        <a-radio value="3">Product</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 8 }">
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>

<script >
import {
  Form,
  Input,
  Button,
  Radio,
  RadioGroup,
  InputPassword,
} from "ant-design-vue";
export default {
  name: "FormAddUser",
  components: {
    AForm: Form,
    AFormItem: Form.Item,
    AInput: Input,
    AButton: Button,
    ARadio: Radio,
    ARadioGroup: RadioGroup,
    AInputPassword: InputPassword,
  },
  props: {
    onUserAdded: {
      type: Function,
      required: true,
    },
  },
  data(){
    return{
       layout : {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    },
     validateMessages : {
      required: "${label} is required!",
      types: {
        email: "${label} is not a valid email!",
        number: "${label} is not a valid number!",
      },
    },
     formState : {
      user: {
        name: "",
        email: "",
        username: "",
        password: "",
        checkPass: "",
        resource: "",
      },
    },
    }
  },
  methods:{
     onFinish(values)  {
      this.onUserAdded(values.user);
      this.$refs.formRef.resetFields();
    },

    async checkPasswordConfirm(rule, value) {
      if (value !== this.formState.user.password) {
        throw new Error("Passwords do not match");
      }
    },
  }
};
</script>
