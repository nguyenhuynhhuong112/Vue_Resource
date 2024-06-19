<template>
  <div class="flex flex-col justify-start min-h-screen w-full mx-2 overflow-y-auto">
    <div class="flex justify-between p-2">
      <h1 class="text-xl font-bold">Product Management Page</h1>
      <a-button @click="showModal" type="primary">Add Product</a-button>
      <a-modal v-model:open="open" title="Add Product" footer>
        <FormAddProduct @product-added="handleProductAdd" />
      </a-modal>
    </div>
    <a-table :dataSource="dataSource" :columns="columns">
      <template #action="{ record }">
        <a-button @click="showProductId(record)" type="primary">Delete</a-button>
        <a-button class="ml-2" @click="editProduct(record)" type="default">Update</a-button>
      </template>
    </a-table>
    <a-modal v-model:open="deleteProduct" title="Delete Product" @ok="handleOk">
      <p>Are you sure you want to delete this product?</p>
    </a-modal>
    <a-modal v-model:open="edit" title="Edit Product Name" @ok="handleEdit">
      <a-input v-model:value="tempName" />
    </a-modal>
  </div>
</template>

<script>
import { Table, Button, Modal, Form, Input } from "ant-design-vue";
import axios from "axios";
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
  },
  data() {
    return {
      open: false,
      deleteProduct: false,
      edit: false,
      dataSource: [],
      tempName: "",
      findProduct: null,
      columns: [
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
      ],
    };
  },
  methods: {
    showModal() {
      this.open = true;
    },
    async loadData() {
      try {
        const response = await axios.get("https://6671626fe083e62ee43b5f5b.mockapi.io/product/product");
        this.dataSource = response.data;
      } catch (error) {
        console.error("Error loading product data:", error);
      }
    },
    async handleProductAdd(newProduct) {
      try {
        const response = await axios.post("https://6671626fe083e62ee43b5f5b.mockapi.io/product/product", newProduct);
        if (response.status === 201) {
          await this.loadData();
          alert("Add success");
        } else {
          alert("Add fail");
        }
        this.open = false;
      } catch (error) {
        console.error("Error adding product:", error);
        alert("Add fail");
      }
    },
    showProductId(record) {
      this.deleteProduct = true;
      this.findProduct = this.dataSource.find(product => product.id === record.id) || null;
    },
    editProduct(record) {
      this.edit = true;
      this.findProduct = this.dataSource.find(product => product.id === record.id) || null;
      if (this.findProduct) {
        this.tempName = this.findProduct.name;
      }
    },
    async handleOk() {
      if (!this.findProduct) return;
      try {
        const id = this.findProduct.id;
        const response = await axios.delete(`https://6671626fe083e62ee43b5f5b.mockapi.io/product/product/${id}`);
        if (response.status === 200) {
          this.deleteProduct = false;
          this.dataSource = this.dataSource.filter(product => product.id !== this.findProduct.id);
          alert("Delete success");
        } else {
          alert("Delete fail");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Delete fail");
      }
    },
    async handleEdit() {
      if (!this.findProduct) return;
      try {
        const updatedProduct = {
          ...this.findProduct,
          name: this.tempName,
        };
        const id = this.findProduct.id;
        const response = await axios.put(`https://6671626fe083e62ee43b5f5b.mockapi.io/product/product/${id}`, updatedProduct);
        if (response.status === 200) {
          alert("Edit success");
          this.edit = false;
          await this.loadData();
        } else {
          alert("Edit fail");
        }
      } catch (error) {
        console.error("Error editing product:", error);
        alert("Edit fail");
      }
    },
  },
  created() {
    this.loadData();
  },
};
</script>
