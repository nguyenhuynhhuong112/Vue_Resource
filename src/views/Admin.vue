<template>
  <div class="flex flex-col justify-start min-h-screen w-full mx-2 overflow-y-auto">
    <div class="flex justify-between p-2">
      <h1 class="text-xl font-bold">User Management Page</h1>
      <a-button @click="showModal" type="primary">Add User</a-button>
      <a-modal v-model:open="open" title="Add User" footer>
        <FormAddUserVue @user-added="handleUserAdded" />
      </a-modal>
    </div>
    <a-table :dataSource="dataSource" :columns="columns">
      <template #action="{ record }">
        <a-button @click="showUserId(record)" type="primary">Delete</a-button>
        <a-button class="ml-2" @click="editUser(record)" type="default">Update</a-button>
      </template>
    </a-table>
    <a-modal v-model:open="deleteUser" title="Delete User" @ok="handleOk">
      <p>Are you sure you want to delete this user?</p>
    </a-modal>
    <a-modal v-model:open="edit" title="Edit Email User" @ok="handleEdit">
      <a-input v-model:value="tempEmail" />
    </a-modal>
  </div>
</template>

<script lang="js">
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
import FormAddUserVue from "@/components/addUser/FormAddUser.vue";
import axios from "axios";

export default {
  name: "Admin",
  components: {
    ATable: Table,
    AButton: Button,
    AModal: Modal,
    FormAddUserVue,
    AForm: Form,
    AFormItem: Form.Item,
    AInput: Input,
    ARadio: Radio,
    ARadioGroup: RadioGroup,
    AInputPassword: InputPassword,
  },
  data() {
    return {
      open: false,
      deleteUser: false,
      edit: false,
      dataSource: [],
      tempEmail: "",
      findUser: null,
      columns: [
        {
          title: "Email",
          dataIndex: "email",
          key: "email",
        },
        {
          title: "First Name",
          dataIndex: "firstName",
          key: "firstName",
        },
        {
          title: "Last Name",
          dataIndex: "lastName",
          key: "lastName",
        },
        {
          title: "User Name",
          dataIndex: "username",
          key: "username",
        },
        {
          title: "Role",
          dataIndex: "role",
          key: "role",
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
      const response = await axios.get(
        "https://667054bc0900b5f8724a3ee9.mockapi.io/user/user"
      );
      this.dataSource = response.data;
    },
    async handleUserAdded(newUser) {
      const { resource, checkPass, ...restNewUser } = newUser;
      const updateUser = {
        ...restNewUser,
        role:
          newUser.resource === "1"
            ? "user"
            : newUser.resource === "2"
            ? "admin"
            : "product",
        firstName: newUser.name.substring(0, newUser.name.lastIndexOf(" ")),
        lastName: newUser.name.substring(newUser.name.lastIndexOf(" ") + 1),
      };
      const findUser = this.dataSource.find(
        (user) =>
          user.email === updateUser.email ||
          user.username === updateUser.username
      );
      if (findUser) {
        alert("User already exists");
        return;
      }
      const response = await axios.post(
        "https://667054bc0900b5f8724a3ee9.mockapi.io/user/user",
        updateUser
      );
      this.open = false;
      if (response.status === 201) {
        alert("Add success");
        await this.loadData();
      } else {
        alert("Add fail");
      }
    },
    async showUserId(record) {
      this.deleteUser = true;
      this.findUser =
        this.dataSource.find((user) => user.id === record.id) || null;
    },
    async editUser (record)  {
      this.edit = true;
      this.findUser = this.dataSource.find(
        (user) => user.id === record.id
      ) || null;
      if (this.findUser) {
        this.tempEmail = this.findUser.email;
      }
    },
    async handleOk  () {
      if (!this.findUser) return;
      const id = this.findUser.id;
      const response = await axios.delete(
        `https://667054bc0900b5f8724a3ee9.mockapi.io/user/user/${id}`
      );
      if (response.status === 200) {
        alert("Delete success");
        this.deleteUser = false;
        this.dataSource = this.dataSource.filter(
          (user) => user.id !== this.findUser.id
        );
      } else {
        alert("Delete fail");
      }
    },
    async handleEdit ()  {
      if (!this.findUser) return;
      const updatedUser = {
        ...this.findUser,
        email: this.tempEmail,
      };
      const id = this.findUser.id;
      const response = await axios.put(
        `https://667054bc0900b5f8724a3ee9.mockapi.io/user/user/${id}`,
        updatedUser
      );
      if (response.status === 200) {
        alert("Edit success");
        this.edit = false;
        await loadData();
      } else {
        alert("Edit fail");
      }
    }

  },
  created() {
    this.loadData();
  },
};
</script>
