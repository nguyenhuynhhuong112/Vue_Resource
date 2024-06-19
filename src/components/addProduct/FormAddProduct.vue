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
      :name="['product', 'name']"
      label="Product Name"
      :rules="[{ required: true }]"
    >
      <a-input v-model:value="formState.product.name" />
    </a-form-item>
    <a-form-item
      :name="['product', 'type']"
      label="Type"
      :rules="[{ required: true }]"
    >
      <a-input v-model:value="formState.product.type" />
    </a-form-item>
    <a-form-item
      :name="['product', 'price']"
      label="Price"
      :rules="[
        { required: true, message: 'Please input your price!' },
        { type: 'number', message: 'Price must be a number' },
        { validator: validatePrice },
      ]"
    >
      <a-input-number v-model:value="formState.product.price" :min="0" />
    </a-form-item>
    <a-form-item
      :name="['product', 'website']"
      label="Product Website"
      :rules="[
        { required: true, message: 'Please input your website!' },
        { validator: validateWebsite },
      ]"
    >
      <a-input v-model:value="formState.product.website" />
    </a-form-item>
    <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 8 }">
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { Form, Input, Button, InputNumber } from "ant-design-vue";

export default {
  name: "FormAddProduct",
  components: {
    AForm: Form,
    AFormItem: Form.Item,
    AInput: Input,
    AButton: Button,
    AInputNumber: InputNumber,
  },
  props: {
    onProductAdded: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      layout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
      },
      validateMessages: {
        required: "${label} is required!",
        types: {
          name: "${label} is not a valid email!",
          number: "${label} is not a valid number!",
        },
      },
      formState: {
        product: {
          name: "",
          type: "",
          price: 0,
          website: "",
        },
      },
    };
  },
  methods: {
    onFinish(values) {
      this.onProductAdded(values.product);
      this.$refs.formRef.resetFields();
    },
    validatePrice(rule, value) {
      return new Promise((resolve, reject) => {
        if (value <= 0) {
          reject(new Error("Price must be greater than 0"));
        } else {
          resolve();
        }
      });
    },
    validateWebsite(rule, value) {
      return new Promise((resolve, reject) => {
        if (!value.includes(".com")) {
          reject(new Error("Website must contain '.com'"));
        } else {
          resolve();
        }
      });
    },
  },
};
</script>
