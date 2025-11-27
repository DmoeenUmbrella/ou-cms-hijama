import { ref, computed, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useAppointmentsStore } from "../stores/useAppointmentsStore";
import { useServicesStore } from "@/stores/useServicesStore";
import { validateForm } from "@/utils/helpers/validate";
import type { PatientFormState } from "@/types/appointment";

const validationSchema = {
  // Step 1 Validation
  name: { type: "string", validate: "> 2" },
  phone: { type: "strinag", validate: "> 5" },
  gender: { type: "string", validate: "required" },

  // Step 2 Validation (Session details)
  serviceId: { type: "number", validate: "> 0" },
  amount: { type: "number", validate: "> 0" },
  paymentMethod: { type: "string", validate: "required" },
  date: { type: "string", validate: "valid date" },
  time: { type: "string", validate: "valid time" },
  // Cups count is optional in the UI, we won't strictly validate it
} as const;

export function useAppointmentForm() {
  const { t } = useI18n();
  const appointmentsStore = useAppointmentsStore();
  const servicesStore = useServicesStore();

  // BIND TO PATIENT REGISTRATION FORM STATE
  const form = appointmentsStore.formPatient;
  const errors = ref<Record<string, string>>({});
  const activeStep = ref(1); // 1: Patient Details, 2: Session Details

  // Data source for dropdowns
  const serviceOptions = computed(() =>
    servicesStore.services.map((s) => ({ id: s.id as number, label: s.name }))
  );

  // Mock Cuppers, Gender, Payment, Reminders
  const cuppers = ref([
    { id: "Dr. Ali", label: "Dr. Ali" },
    { id: "Dr. Fatima", label: "Dr. Fatima" },
  ]);
  const genderOptions = ref([
    { id: "Male", label: t("common.gender.male") || "Male" },
    { id: "Female", label: t("common.gender.female") || "Female" },
  ]);
  const paymentOptions = ref([
    { id: "Cash", label: t("common.payment.cash") || "Cash" },
    { id: "Card", label: t("common.payment.card") || "Card" },
    { id: "Transfer", label: t("common.payment.transfer") || "Transfer" },
  ]);
  const reminderOptions = ref([
    { id: "SMS", label: "SMS" },
    { id: "Email", label: "Email" },
    { id: "Call", label: "Call" },
  ]);

  const isEditing = computed(() => false); // This form is CREATE only

  // Filter validation errors specific to the current step
  const stepErrors = computed(() => {
    const currentErrors: Record<string, string> = {};
    const step1Fields = ["name", "phone", "gender", "dob", "medicalNotes"];
    const step2Fields = [
      "serviceId",
      "cupsCount",
      "amount",
      "paymentMethod",
      "cupperName",
      "date",
      "time",
    ];

    const fields = activeStep.value === 1 ? step1Fields : step2Fields;

    for (const field of fields) {
      if (errors.value[field]) {
        currentErrors[field] = errors.value[field];
      }
    }
    return currentErrors;
  });

  const validateStep = (step: number): boolean => {
    const fieldsToValidate =
      step === 1
        ? ["name", "phone", "gender"]
        : ["serviceId", "amount", "paymentMethod", "date", "time"];

    // Temporarily create a schema only for the current step's required fields
    const currentStepSchema = Object.fromEntries(
      Object.entries(validationSchema).filter(([key]) =>
        fieldsToValidate.includes(key)
      )
    );

    const result = validateForm(
      form as unknown as Record<string, any>,
      currentStepSchema,
      t
    );

    // Update global error state to reflect all form errors
    errors.value = { ...errors.value, ...result.errors };

    return result.isValid;
  };

  const nextStep = () => {
    if (validateStep(activeStep.value)) {
      activeStep.value = 2;
      return true;
    }
    return false;
  };

  const handleSubmit = async (): Promise<boolean> => {
    // Step 1 is done, Step 2 validation check
    if (!validateStep(2)) {
      activeStep.value = 2; // Ensure we are on step 2 if validation fails here
      return false;
    }

    // Final action: Call Register Patient
    const success = await appointmentsStore.registerPatient();

    if (success) {
      // Success should lead to a confirmation step or immediate redirect
      activeStep.value = 3;
    }
    return success;
  };

  const handleSelectUpdate = (key: keyof PatientFormState, value: string) => {
    // Fields that require numeric conversion
    if (["serviceId", "cupsCount", "amount"].includes(key)) {
      // We use parseFloat here since 'amount' can be non-integer (e.g., 50.50 AED)
      (form[key] as number) = parseFloat(value);
    }
    // Fields that are simple strings (like gender, paymentMethod, cupperName)
    else {
      (form[key] as string) = value;
    }
  };

  // Lifecycle setup...
  onMounted(() => {
    servicesStore.fetchServices();
    appointmentsStore.resetPatientForm(); // Ensure clean form on mount
  });

  return {
    form,
    errors: stepErrors,
    activeStep,
    serviceOptions,
    cuppers,
    genderOptions,
    paymentOptions,
    reminderOptions,
    isEditing,
    handleSubmit,
    handleSelectUpdate,
    nextStep,
    previousStep: () => {
      activeStep.value = 1;
    },
  };
}
