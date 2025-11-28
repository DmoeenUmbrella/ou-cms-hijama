import { computed, ref, watch, h } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { format } from "date-fns";
import { usePatientStore } from "@/modules/patients/stores/usePatientStore";
import type { Patient } from "@/types/appointment";
import type { ColumnDef } from "@/types/table";
import {
  useVueTable,
  getCoreRowModel,
  createColumnHelper,
  getPaginationRowModel,
} from "@tanstack/vue-table";
import { Button } from "@/components/ui/button";
import { FlexRender } from "@tanstack/vue-table";
import {
  PlusCircle,
  CalendarClock,
  Eye,
  Pencil,
  Trash2,
} from "lucide-vue-next";
import { isoToReadableDate } from "@/utils/helpers/formatDateTime";

export function usePatientsTable(emit: any, t: any, router: any) {
  const store = usePatientStore();

  // --- Filters ---
  const searchQuery = ref(store.filters.keyword);
  const dateFilter = ref<Date | undefined>(
    store.filters.date ? new Date(store.filters.date) : undefined
  );

  // Debounced search
  const debouncedSearch = useDebounceFn((query: string) => {
    store.filters.keyword = query;
    store.filters.page = 1;
    store.fetchPatients();
  }, 500);

  watch(searchQuery, (newVal) => {
    debouncedSearch(newVal);
  });

  watch(dateFilter, (newDate) => {
    store.filters.date = newDate ? format(newDate, "yyyy-MM-dd") : null;
    store.filters.page = 1;
    store.fetchPatients();
  });

  const clearDateFilter = () => {
    dateFilter.value = undefined;
  };

  // --- Table Data ---
  const data = computed<Patient[]>(() =>
    Array.isArray(store.filteredPatients) ? store.filteredPatients : []
  );

  // --- Columns ---
  const columnHelper = createColumnHelper<Patient>();

  const columns = computed<ColumnDef<Patient>[]>(() => [
    columnHelper.accessor("name", {
      header: () =>
        h(
          "div",
          { class: "text-start font-semibold" },
          t("customers.table.columns.name")
        ),
      cell: ({ row }) =>
        h("div", { class: "font-medium text-primary" }, row.original.name),
      minSize: 180,
    }),
    columnHelper.accessor("phoneNumber", {
      header: () =>
        h("div", { class: "text-start" }, t("customers.table.columns.phone")),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("gender", {
      header: () =>
        h("div", { class: "text-center" }, t("customers.table.columns.gender")),
      cell: (info) => h("div", { class: "text-center" }, info.getValue()),
      size: 100,
    }),
    columnHelper.accessor("createdOn", {
      header: () =>
        h(
          "div",
          { class: "text-center" },
          t("customers.table.columns.created_on")
        ),
      cell: ({ row }) =>
        h(
          "div",
          { class: "text-center font-bold" },
          isoToReadableDate(row.original.createdOn)
        ),
      size: 100,
    }),
    columnHelper.accessor("lastSessionDate", {
      header: () =>
        h("div", { class: "text-end" }, t("customers.table.columns.status")),
      cell: ({ row }) =>
        h(
          "div",
          { class: "text-end" },
          row.original.isActive
            ? t("customers.table.columns.active")
            : t("customers.table.columns.in_active") || "-"
        ),
      size: 120,
    }),
    columnHelper.display({
      id: "actions",
      header: () => h("div", { class: "text-end" }, t("button.actions")),
      cell: ({ row }) =>
        h("div", { class: "flex justify-end items-center gap-1" }, [
          h(
            Button,
            {
              variant: "ghost",
              size: "icon",
              title: t("appointment.table.create_session"),
              onClick: () => emit("create-session", row.original),
            },
            () => h(PlusCircle, { class: "h-4 w-4 text-emerald-600" })
          ),
          h(
            Button,
            {
              variant: "ghost",
              size: "icon",
              title: t("appointment.table.create_follow_up"),
              onClick: () => emit("create-follow-up", row.original),
            },
            () => h(CalendarClock, { class: "h-4 w-4 text-blue-600" })
          ),
          h(
            Button,
            {
              variant: "ghost",
              size: "icon",
              title: t("appointment.table.view_details"),
              onClick: () =>
                router.push({
                  name: "customer-details",
                  params: { id: row.original.id },
                }),
            },
            () => h(Eye, { class: "h-4 w-4 text-gray-500" })
          ),
          h(
            Button,
            {
              variant: "ghost",
              size: "icon",
              title: t("appointment.table.edit_patient"),
              onClick: () => emit("edit-patient", row.original),
            },
            () => h(Pencil, { class: "h-4 w-4 text-amber-500" })
          ),
          h(
            Button,
            {
              variant: "ghost",
              size: "icon",
              title: t("button.delete"),
              onClick: () => emit("delete-patient", row.original),
            },
            () => h(Trash2, { class: "h-4 w-4 text-destructive" })
          ),
        ]),
      size: 180,
    }),
  ]);

  // --- Pagination ---
  const totalPages = computed(() =>
    Math.ceil(store.totalPatients / store.pageSize)
  );
  const currentPage = computed(() => table.getState().pagination.pageIndex + 1);

  const table = useVueTable({
    get data() {
      return data.value;
    },
    get columns() {
      return columns.value;
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualPageSize: true,
    get pageCount() {
      return totalPages.value;
    },
    initialState: {
      pagination: {
        pageSize: store.pageSize,
        pageIndex: store.filters.page - 1,
      },
    },
  });

  watch(
    () => table.getState().pagination.pageIndex,
    (newPageIndex) => {
      store.filters.page = newPageIndex + 1;
      store.fetchPatients();
    }
  );

  return {
    table,
    data,
    columns,
    searchQuery,
    dateFilter,
    clearDateFilter,
    currentPage,
    totalPages,
  };
}
