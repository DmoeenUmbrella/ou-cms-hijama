import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { usePatientStore } from "../stores/usePatientStore";
import { useServicesStore } from "@/stores/useServicesStore";
import { validateForm } from "@/utils/helpers/validate";
import type { Session, DropdownOption } from "@/types/appointment";

const validationSchema = {
  serviceId: { type: "number", validate: "> 0" },
  amount: { type: "number", validate: "> 0" },
  paymentMethod: { type: "string", validate: "required" },
  date: { type: "string", validate: "valid date" },
  time: { type: "string", validate: "valid time" },
} as const;

export function useSessionForm(clientId: string | null) {
  const { t } = useI18n();
  const appointmentsStore = usePatientStore();
  const servicesStore = useServicesStore();

  // BIND to a local form state specific for Session creation
  const form = ref({
    clientId: clientId, // Required patient ID
    cupperName: null as string | null,
    serviceId: null as number | null,
    cupsCount: 0 as number,
    amount: 0 as number,
    paymentMethod: "Cash" as string,
    notes: "" as string,
    date: new Date().toISOString().slice(0, 10),
    time: new Date().toTimeString().slice(0, 5),
    followUpDate: null as string | null, // Mock field
    reminderType: null as string | null, // Mock field
  });

  const errors = ref<Record<string, string>>({});

  // Data source for dropdowns
  const serviceOptions = computed<DropdownOption[]>(() =>
    servicesStore.services.map((s) => ({ id: s.id as number, label: s.name }))
  );

  // Mock Data
  const cuppers = ref<DropdownOption[]>([
    { id: "Dr. Ali", label: "Dr. Ali" },
    { id: "Dr. Fatima", label: "Dr. Fatima" },
  ]);
  const paymentOptions = computed<DropdownOption[]>(() => [
    { id: "Cash", label: t("payment.cash") },
    { id: "Card", label: t("payment.card") },
    { id: "Transfer", label: t("payment.transfer") },
  ]);
  const reminderOptions = ref<DropdownOption[]>([
    { id: "SMS", label: "SMS" },
    { id: "Email", label: "Email" },
    { id: "Call", label: "Call" },
  ]);

  const handleSubmit = async (): Promise<boolean> => {
    // 1. Run Validation
    const result = validateForm(
      form.value as unknown as Record<string, any>,
      validationSchema,
    );

    if (!result.isValid) {
      errors.value = result.errors;
      return false;
    }

    errors.value = {};

    // 2. Call Store Action (Assuming store has createSession(payload) action)
    const success = await appointmentsStore.createSession(form.value);

    return success;
  };

  // Helper to handle select update and convert string back to number/string
  const handleSelectUpdate = (key: keyof typeof form.value, value: string) => {
    // Keys that should be numbers
    if (["serviceId", "cupsCount", "amount"].includes(key)) {
      (form.value[key] as number) = parseFloat(value);
    } else {
      (form.value[key] as string) = value;
    }
  };

  onMounted(() => {
    // Fetch necessary data for dropdowns
    // servicesStore.fetchServices();
  });

  return {
    form,
    errors,
    serviceOptions,
    cuppers,
    paymentOptions,
    reminderOptions,
    handleSubmit,
    handleSelectUpdate,
  };
}
