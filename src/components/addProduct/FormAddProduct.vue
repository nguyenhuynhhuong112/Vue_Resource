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

<script lang="ts">
import { reactive, ref } from "vue";
import {
  Form,
  Input,
  Button,
  Radio,
  RadioGroup,
  InputPassword,
  InputNumber,
} from "ant-design-vue";
export default {
  name: "FormAddProduct",
  components: {
    AForm: Form,
    AFormItem: Form.Item,
    AInput: Input,
    AButton: Button,
    ARadio: Radio,
    ARadioGroup: RadioGroup,
    AInputPassword: InputPassword,
    AInputNumber: InputNumber,
  },
  props: {
    onProductAdded: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    const validateMessages = {
      required: "${label} is required!",
      types: {
        name: "${label} is not a valid email!",
        number: "${label} is not a valid number!",
      },
    };

    const formState = reactive({
      product: {
        name: "",
        type: "",
        price: 0,
        website: "",
      },
    });

    const formRef = ref();

    const onFinish = (values: any) => {
      props.onProductAdded(values.product);
      formRef.value.resetFields();
    };
    const validatePrice = (rule: any, value: any, callback: any) => {
      if (value <= 0) {
        callback(new Error("Price must be greater than 0"));
      } else {
        callback();
      }
    };
    const validateWebsite = (rule: any, value: any, callback: any) => {
      if (!value.includes(".com")) {
        callback(new Error("Website must contain '.com'"));
      } else {
        callback();
      }
    };
    return {
      layout,
      validateMessages,
      formState,
      validateWebsite,
      formRef,
      onFinish,
      validatePrice,
    };
  },
};
</script>
