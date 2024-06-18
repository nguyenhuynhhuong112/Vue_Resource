<template>
  <div
    class="flex flex-col justify-start min-h-screen w-full mx-2 overflow-y-auto"
  >
    <div class="flex justify-between p-2">
      <h1 class="text-xl font-bold">Product Management Page</h1>
      <a-button @click="showModal" type="primary">Add Product</a-button>
      <a-modal v-model:open="open" title="Add User" footer>
        <FormAddProduct @product-added="handleProductAdd" />
      </a-modal>
    </div>
    <a-table :dataSource="dataSource" :columns="columns">
      <template #action="{ record }">
        <a-button @click="showProductId(record)" type="primary"
          >Delete</a-button
        >
        <a-button class="ml-2" @click="editProduct(record)" type="default"
          >Update</a-button
        >
      </template>
    </a-table>
    <a-modal v-model:open="deleteProduct" title="Delete Product" @ok="handleOk">
      <p>Are you sure you want to delete this product?</p>
    </a-modal>
    <a-modal v-model:open="edit" title="Edit Product Name" @ok="handleEdit">
      <a-input v-model:value="tempEmail" />
    </a-modal>
  </div>
</template>
<script lang="ts">
import { onMounted, ref } from "vue";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Radio,
  RadioGroup,
  InputPassword,
} from "ant-design-vue";
import axios from "axios";
import { IProduct } from "common/types";
import FormAddProduct from "../components/addProduct/FormAddProduct.vue";
export default {
  name: "Product",
  components: {
    ATable: Table,
    AButton: Button,
    AModal: Modal,
    FormAddProduct,
    AForm: Form,
    AFormItem: Form.Item,
    AInput: Input,
    ARadio: Radio,
    ARadioGroup: RadioGroup,
    AInputPassword: InputPassword,
  },
  setup() {
    const open = ref<boolean>(false);
    const deleteProduct = ref<boolean>(false);
    const edit = ref<boolean>(false);
    const dataSource = ref<IProduct[]>();
    const tempEmail = ref<string>("");

    const showModal = () => {
      open.value = true;
    };

    const loadData = async () => {
      const response = await axios.get(
        "https://6671626fe083e62ee43b5f5b.mockapi.io/product/product"
      );
      dataSource.value = response.data;
    };

    onMounted(() => {
      loadData();
    });

    const handleProductAdd = async (newProduct: any) => {
      const response = await axios.post(
        "https://6671626fe083e62ee43b5f5b.mockapi.io/product/product",
        newProduct
      );
      if (response.status === 201) {
        await loadData();
        alert("Add success");
      } else {
        alert("Add fail");
      }
        open.value = false;
    };

    const findProduct = ref<IProduct | null>(null);

    const showProductId = async (record: any) => {
      deleteProduct.value = true;
      findProduct.value =
        dataSource.value?.find(
          (product: IProduct) => product.id === record.id
        ) || null;
    };

    const editProduct = async (record: any) => {
      edit.value = true;
      findProduct.value =
        dataSource.value?.find(
          (product: IProduct) => product.id === record.id
        ) || null;
      if (findProduct.value) {
        tempEmail.value = findProduct.value.name;
      }
    };

    const handleOk = async () => {
      if (!findProduct.value) return;
      const id = findProduct.value.id;
      const response = await axios.delete(
        `https://6671626fe083e62ee43b5f5b.mockapi.io/product/product/${id}`
      );
      if (response.status === 200) {
        deleteProduct.value = false;
        dataSource.value = dataSource.value?.filter(
          (product: IProduct) => product.id !== findProduct.value?.id
        );
        alert("Delete success");
      } else {
        alert("Delete fail");
      }
    };

    const handleEdit = async () => {
      if (!findProduct.value) return;
      const updateProduct = {
        ...findProduct.value,
        name: tempEmail.value,
      };
      const id = findProduct.value.id;
      const response = await axios.put(
        `https://6671626fe083e62ee43b5f5b.mockapi.io/product/product/${id}`,
        updateProduct
      );
      if (response.status === 200) {
        alert("Edit success");
        edit.value = false;
        await loadData();
      } else {
        alert("Edit fail");
      }
    };

    const columns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "Product Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
      },
      {
        title: "Price",
        dataIndex: "price",
        key: "price",
      },
      {
        title: "Website",
        dataIndex: "website",
        key: "website",
      },
      {
        title: "Action",
        key: "action",
        slots: { customRender: "action" },
      },
    ];

    return {
      open,
      deleteProduct,
      showModal,
      dataSource,
      handleProductAdd,
      showProductId,
      columns,
      findProduct,
      handleOk,
      edit,
      editProduct,
      handleEdit,
      tempEmail,
    };
  },
};
</script>
