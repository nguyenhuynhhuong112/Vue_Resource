<template>
  <div
    class="flex flex-col justify-start min-h-screen w-full mx-2 overflow-y-auto"
  >
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
        <a-button class="ml-2" @click="editUser(record)" type="default"
          >Update</a-button
        >
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
import FormAddUserVue from "@/components/addUser/FormAddUser.vue";
import axios from "axios";
import { IUser } from "common/types";

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
  setup() {
    const open = ref<boolean>(false);
    const deleteUser = ref<boolean>(false);
    const edit = ref<boolean>(false);
    const dataSource = ref<IUser[]>();
    const tempEmail = ref<string>("");

    const showModal = () => {
      open.value = true;
    };

    const loadData = async () => {
      const response = await axios.get(
        "https://667054bc0900b5f8724a3ee9.mockapi.io/user/user"
      );
      dataSource.value = response.data;
    };

    onMounted(() => {
      loadData();
    });

    const handleUserAdded = async (newUser: any) => {
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
      const findUser = dataSource.value?.find(
        (user: IUser) => user.email === updateUser.email || user.username === updateUser.username
      );
      if (findUser) {
        alert("User already exists");
        return;
      }
      const response = await axios.post(
        "https://667054bc0900b5f8724a3ee9.mockapi.io/user/user",
        updateUser
      );
      open.value = false;
      if (response.status === 201) {
        await loadData();
      } else {
        alert("Add fail");
      }
    };

    const findUser = ref<IUser | null>(null);

    const showUserId = async (record: any) => {
      deleteUser.value = true;
      findUser.value = dataSource.value?.find(
        (user: IUser) => user.id === record.id
      ) || null;
    };

    const editUser = async (record: any) => {
      edit.value = true;
      findUser.value = dataSource.value?.find(
        (user: IUser) => user.id === record.id
      ) || null;
      if (findUser.value) {
        tempEmail.value = findUser.value.email;
      }
    };

    const handleOk = async () => {
      if (!findUser.value) return;
      const id = findUser.value.id;
      const response = await axios.delete(
        `https://667054bc0900b5f8724a3ee9.mockapi.io/user/user/${id}`
      );
      if (response.status === 200) {
        alert("Delete success");
        deleteUser.value = false;
        dataSource.value = dataSource.value?.filter(
          (user: IUser) => user.id !== findUser.value?.id
        );
      } else {
        alert("Delete fail");
      }
    };

    const handleEdit = async () => {
      if (!findUser.value) return;
      const updatedUser = {
        ...findUser.value,
        email: tempEmail.value,
      };
      const id = findUser.value.id;
      const response = await axios.put(
        `https://667054bc0900b5f8724a3ee9.mockapi.io/user/user/${id}`,
        updatedUser
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
    ];

    return {
      open,
      deleteUser,
      showModal,
      dataSource,
      handleUserAdded,
      showUserId,
      columns,
      findUser,
      handleOk,
      edit,
      editUser,
      handleEdit,
      tempEmail,
    };
  },
};
</script>
