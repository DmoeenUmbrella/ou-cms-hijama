import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { usePatientStore } from "../stores/usePatientStore";
import { useServicesStore } from "@/stores/useServicesStore";
import { validateForm } from "@/utils/helpers/validate";
import type {
  CreateFollowUpPayload,
  DropdownOption,
} from "@/types/appointment";

// Validation Schema for Follow-up (scheduling)
const validationSchema = {
  serviceId: { type: "number", validate: "> 0" },
  date: { type: "string", validate: "valid date" },
  time: { type: "string", validate: "valid time" },
  priorityLevel: { type: "string", validate: "required" },
} as const;

export function useFollowUpForm(clientId: string | null) {
  const { t } = useI18n();
  const appointmentsStore = usePatientStore();
  const servicesStore = useServicesStore();

  // BIND to a local form state specific for Follow-up creation
  const form = ref({
    clientId: clientId, // Required patient ID
    serviceId: null as string | null,
    date: new Date().toISOString().slice(0, 10),
    time: new Date().toTimeString().slice(0, 5),
    notes: "" as string,
    priorityLevel: "Medium" as "High" | "Medium" | "Low",
    followUpType: "SMS" as string,
  });

  const errors = ref<Record<string, string>>({});

  // Data source for dropdowns
  const serviceOptions = computed<DropdownOption[]>(() =>
    servicesStore.services.map((s) => ({ id: s.id as number, label: s.name }))
  );

  const followUpTypeOptions = ref<DropdownOption[]>([
    { id: "SMS", label: "SMS" },
    { id: "Email", label: "Email" },
    { id: "Call", label: "Call" },
  ]);

  const priorityOptions = ref([
    { id: "High", label: t("session.priority_high") || "High Priority" },
    { id: "Medium", label: t("session.priority_medium") || "Medium Priority" },
    { id: "Low", label: t("session.priority_low") || "Low Priority" },
  ]);

  const handleSubmit = async (): Promise<boolean> => {
    // 1. Run Validation
    const result = validateForm(
      form.value as unknown as Record<string, any>,
      validationSchema,
      t
    );

    if (!result.isValid) {
      errors.value = result.errors;
      return false;
    }

    errors.value = {};

    // 2. Prepare Payload
    const followUpPayload: CreateFollowUpPayload = {
      clientId: form.value.clientId!,
      serviceId: form.value.serviceId!,
      date: new Date(`${form.value.date}T${form.value.time}:00`).toISOString(),
      time: new Date(`${form.value.date}T${form.value.time}:00`).toISOString(),
      notes: form.value.notes,
      status: "scheduled",
    };

    // 3. Call Store Action
    const success = await appointmentsStore.createFollowUp(followUpPayload);

    return success;
  };

  // Helper to handle select update and convert string back to number/string
  const handleSelectUpdate = (key: keyof typeof form.value, value: string) => {
    if (key === "serviceId") {
      (form.value[key] as number) = parseInt(value);
    } else {
      (form.value[key] as string) = value;
    }
  };

  onMounted(() => {
    servicesStore.fetchServices();
  });

  return {
    form,
    errors,
    serviceOptions,
    followUpTypeOptions,
    priorityOptions,
    handleSubmit,
    handleSelectUpdate,
  };
}
