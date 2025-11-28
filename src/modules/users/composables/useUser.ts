import { computed } from 'vue';
import { useUserStore } from '../stores/userStore';
import { getUsers, getUserById, type GetUsersParams } from '@/api/endpoints/user/queries';
import { createUser, createAdmin, updateUser, deleteUser, type CreateUserPayload, type CreateAdminPayload, type UpdateUserPayload } from '@/api/endpoints/user/mutations';

export function useUser() {
  const userStore = useUserStore();

  // Computed properties
  const users = computed(() => userStore.getAllUsers);
  const totalCount = computed(() => userStore.totalCount);
  const currentPage = computed(() => userStore.currentPage);
  const itemsPerPage = computed(() => userStore.itemsPerPage);
  const searchKeyword = computed(() => userStore.searchKeyword);
  const isLoading = computed(() => userStore.loading);
  const error = computed(() => userStore.getError);
  const paginationInfo = computed(() => userStore.paginationInfo);

  // Fetch users with pagination and search
  const fetchUsers = async (params?: GetUsersParams) => {
    try {
      userStore.setLoading(true);
      userStore.setError(null);

      const requestParams: GetUsersParams = {
        page: params?.page || userStore.currentPage,
        count: params?.count || userStore.itemsPerPage,
        keyword: params?.keyword !== undefined ? params.keyword : userStore.searchKeyword,
      };

      const response = await getUsers(requestParams);

      if (response.isSuccess) {
        userStore.setUsers(response.data);
        userStore.setTotalCount(response.totalCount);
        
        // Update pagination state
        if (params?.page) {
          userStore.setCurrentPage(params.page);
        }
        if (params?.count) {
          userStore.setItemsPerPage(params.count);
        }
        if (params?.keyword !== undefined) {
          userStore.setSearchKeyword(params.keyword);
        }
      } else {
        userStore.setError(response.message || 'Failed to fetch users');
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch users';
      userStore.setError(errorMessage);
      throw err;
    } finally {
      userStore.setLoading(false);
    }
  };

  // Fetch single user by ID
  const fetchUserById = async (id: number) => {
    try {
      userStore.setLoading(true);
      userStore.setError(null);

      const response = await getUserById(id);

      if (response.isSuccess) {
        userStore.setCurrentUser(response.data);
      } else {
        userStore.setError(response.message || 'Failed to fetch user');
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch user';
      userStore.setError(errorMessage);
      throw err;
    } finally {
      userStore.setLoading(false);
    }
  };

  // Create new user
  const addUser = async (payload: CreateUserPayload) => {
    try {
      userStore.setLoading(true);
      userStore.setError(null);

      const response = await createUser(payload);

      if (response.isSuccess) {
        userStore.addUser(response.data);
        // Optionally refetch to get updated list
        await fetchUsers();
      } else {
        userStore.setError(response.message || 'Failed to create user');
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create user';
      userStore.setError(errorMessage);
      throw err;
    } finally {
      userStore.setLoading(false);
    }
  };

  // Create new admin
  const addAdmin = async (payload: CreateAdminPayload) => {
    try {
      userStore.setLoading(true);
      userStore.setError(null);

      const response = await createAdmin(payload);

      if (response.isSuccess) {
        userStore.addUser(response.data);
        // Optionally refetch to get updated list
        await fetchUsers();
      } else {
        userStore.setError(response.message || 'Failed to create admin');
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create admin';
      userStore.setError(errorMessage);
      throw err;
    } finally {
      userStore.setLoading(false);
    }
  };

  // Update existing user
  const editUser = async (payload: UpdateUserPayload) => {
    try {
      userStore.setLoading(true);
      userStore.setError(null);

      const response = await updateUser(payload);

      if (response.isSuccess) {
        userStore.updateUser(response.data);
      } else {
        userStore.setError(response.message || 'Failed to update user');
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update user';
      userStore.setError(errorMessage);
      throw err;
    } finally {
      userStore.setLoading(false);
    }
  };

  // Delete user
  const removeUser = async (id: number) => {
    try {
      userStore.setLoading(true);
      userStore.setError(null);

      const response = await deleteUser(id);

      if (response.isSuccess) {
        userStore.removeUser(id);
      } else {
        userStore.setError(response.message || 'Failed to delete user');
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete user';
      userStore.setError(errorMessage);
      throw err;
    } finally {
      userStore.setLoading(false);
    }
  };

  // Go to specific page
  const goToPage = async (page: number) => {
    await fetchUsers({ page });
  };

  // Change items per page
  const changeItemsPerPage = async (count: number) => {
    userStore.setCurrentPage(1); // Reset to first page
    await fetchUsers({ count, page: 1 });
  };

  // Search users
  const searchUsers = async (keyword: string) => {
    userStore.setCurrentPage(1); // Reset to first page
    await fetchUsers({ keyword, page: 1 });
  };

  // Reset pagination and search
  const resetFilters = async () => {
    userStore.resetPagination();
    await fetchUsers({ page: 1, keyword: '' });
  };

  // Clear all data
  const clearUserData = () => {
    userStore.clearAll();
  };

  return {
    // State
    users,
    totalCount,
    currentPage,
    itemsPerPage,
    searchKeyword,
    isLoading,
    error,
    paginationInfo,

    // Actions
    fetchUsers,
    fetchUserById,
    addUser,
    addAdmin,
    editUser,
    removeUser,
    goToPage,
    changeItemsPerPage,
    searchUsers,
    resetFilters,
    clearUserData,
  };
}
