import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";
import { toast } from "vue-sonner";
import { validateForm } from "@/utils/formValidator.js";
import { i18n } from "@/i18n"; // Importing the i18n instance directly

export const useUsersStore = defineStore("users", () => {
  // --- State ---
  const users = ref([]);

  const formUser = ref({
    id: null,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: 2, // Default to Admin (2)
    password: "", // Only sent on create
    isActive: true,
  });

  // --- Getters ---
  const isUserFormEditing = computed(() => !!formUser.value.id);

  // --- Actions ---
  function fetchUsers() {
    axios
      .get(`/data-sources/users.json`)
      .then((result) => {
        users.value = result?.data?.data;
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
      });
  }

  function resetUserForm() {
    formUser.value = {
      id: null,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: 2,
      password: "",
      isActive: true,
    };
  }

  function loadUserForEdit(user) {
    formUser.value = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      password: "", // Leave blank on edit
    };
  }

  function saveUser() {
    const data = formUser.value;

    // Basic Schema for validation
    const validationSchema = {
      firstName: { type: "string", validate: "> 2" },
      lastName: { type: "string", validate: "> 2" },
      email: { type: "string", validate: "> 5" }, // Simple length check
      role: { type: "number", validate: "> 0" },
    };

    const validate = validateForm(data, validationSchema, i18n.global.t);

    if (!validate.isValid) {
      Object.keys(validate.errors).forEach((field) => {
        const errorMessage = validate.errors[field];
        const t = i18n.global.t;
        const fieldLabel = t(`users.table.${field}`) || field;

        toast.error(`${fieldLabel}: ${errorMessage}`);
      });
      return false;
    }

    if (data.id) {
      // Update Logic
      const index = users.value.findIndex((u) => u.id === data.id);
      if (index !== -1) {
        // Update properties directly for reactivity
        const target = users.value[index];
        target.firstName = data.firstName;
        target.lastName = data.lastName;
        target.email = data.email;
        target.phone = data.phone;
        target.role = data.role;
        target.isActive = data.isActive;
        // Password update logic would go here (omitted for mock)

        toast.success(
          i18n.global.t("users.updated_successfully") ||
            "User updated successfully"
        );
      }
    } else {
      // Create Logic
      const id =
        users.value.length > 0
          ? Math.max(...users.value.map((u) => u.id)) + 1
          : 1;
      users.value.push({ ...data, id });
      toast.success(
        i18n.global.t("users.created_successfully") ||
          "User created successfully"
      );
    }

    resetUserForm();
    return true;
  }

  function deleteUser(userId) {
    users.value = users.value.filter((u) => u.id !== userId);
    toast.success(
      i18n.global.t("users.deleted_successfully") || "User deleted successfully"
    );
  }

  return {
    users,
    formUser,
    isUserFormEditing,
    fetchUsers,
    resetUserForm,
    loadUserForEdit,
    saveUser,
    deleteUser,
  };
});
