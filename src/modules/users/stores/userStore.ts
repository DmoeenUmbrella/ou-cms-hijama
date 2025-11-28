import { defineStore } from 'pinia';
import type { User } from '@/api/endpoints/user/queries';

interface UserState {
  users: User[];
  currentUser: User | null;
  totalCount: number;
  currentPage: number;
  itemsPerPage: number;
  searchKeyword: string;
  isLoading: boolean;
  error: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [],
    currentUser: null,
    totalCount: 0,
    currentPage: 1,
    itemsPerPage: 10,
    searchKeyword: '',
    isLoading: false,
    error: null,
  }),

  getters: {
    // Get all users
    getAllUsers: (state) => state.users,

    // Get user by ID
    getUserById: (state) => (id: number) => {
      return state.users.find((user) => user.id === id);
    },

    // Get total pages
    totalPages: (state) => {
      return Math.ceil(state.totalCount / state.itemsPerPage);
    },

    // Check if loading
    loading: (state) => state.isLoading,

    // Get error
    getError: (state) => state.error,

    // Get pagination info
    paginationInfo: (state) => ({
      currentPage: state.currentPage,
      itemsPerPage: state.itemsPerPage,
      totalCount: state.totalCount,
      totalPages: Math.ceil(state.totalCount / state.itemsPerPage),
    }),
  },

  actions: {
    // Set users
    setUsers(users: User[]) {
      this.users = users;
    },

    // Set current user
    setCurrentUser(user: User | null) {
      this.currentUser = user;
    },

    // Set total count
    setTotalCount(count: number) {
      this.totalCount = count;
    },

    // Set current page
    setCurrentPage(page: number) {
      this.currentPage = page;
    },

    // Set items per page
    setItemsPerPage(count: number) {
      this.itemsPerPage = count;
    },

    // Set search keyword
    setSearchKeyword(keyword: string) {
      this.searchKeyword = keyword;
    },

    // Set loading state
    setLoading(loading: boolean) {
      this.isLoading = loading;
    },

    // Set error
    setError(error: string | null) {
      this.error = error;
    },

    // Add user to list
    addUser(user: User) {
      this.users.unshift(user);
      this.totalCount += 1;
    },

    // Update user in list
    updateUser(updatedUser: User) {
      const index = this.users.findIndex((user) => user.id === updatedUser.id);
      if (index !== -1) {
        this.users[index] = updatedUser;
      }
    },

    // Remove user from list
    removeUser(userId: number) {
      this.users = this.users.filter((user) => user.id !== userId);
      this.totalCount -= 1;
    },

    // Reset pagination
    resetPagination() {
      this.currentPage = 1;
      this.searchKeyword = '';
    },

    // Clear all data
    clearAll() {
      this.users = [];
      this.currentUser = null;
      this.totalCount = 0;
      this.currentPage = 1;
      this.itemsPerPage = 10;
      this.searchKeyword = '';
      this.isLoading = false;
      this.error = null;
    },
  },
});
