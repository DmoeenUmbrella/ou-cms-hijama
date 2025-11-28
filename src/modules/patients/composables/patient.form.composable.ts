import { reactive, watch, onMounted } from "vue";
import { validateForm } from "@/utils/helpers/validate";
import { useTechnician } from "@/modules/technician/composables/useTechnician";
import dateToISOStringFormat from "@/utils/helpers/formatDateTime";

export function usePatientForm(props: {
  patient: any;
  isEditing: boolean;
  currentAction:
    | "create-patient"
    | "edit-patient"
    | "create-session"
    | "create-followup"
    | null;
}) {
  const form = reactive({
    id: "",
    // Patient
    name: "",
    phoneNumber: "",
    gender: "",
    numberOfCups: "1",
    amount: 1,
    paymentMethod: "",
    technicianId: "",
    notes: "",
    date: null,
    reminder: null,

    // Session
    clientId: "",
    clinicId: null,
    time: null,
    price: 0,

    // Follow-up
    appointmentId: "",
  });

  const errors = reactive<Record<string, string>>({});

  
  const { fetchTechnicians, technicians, paginationInfo } = useTechnician();
  onMounted(() => {
    if (
      !technicians?.value?.length ||
      paginationInfo.value.totalCount > technicians?.value?.length
    )
      fetchTechnicians({ page: 1, count: 100 });
  })

  // Prefill form if patient exists
  watch(
    () => props.patient,
    (patient) => {
      if (!patient) return;
      form.id = patient.id || "";
      form.name = patient.name || "";
      form.phoneNumber = patient.phoneNumber || patient.phone || "";
      form.gender = patient.gender || "";
      form.clientId = patient.id || "";
    },
    { immediate: true }
  );

  // Validation Schema based on currentAction
  const getValidationSchema = () => {
    switch (props.currentAction) {
      case "create-patient":
        return {
          name: { validate: "required", type: "string" },
          phoneNumber: { validate: "required", type: "string" },
          gender: { validate: "required", type: "string" },
          technicianId: { validate: "required", type: "string" },
          numberOfCups: { validate: "required", type: "string" },
        };
      case "edit-patient":
        return {
          name: { validate: "required", type: "string" },
          phoneNumber: { validate: "required", type: "string" },
        };
      case "create-session":
        return {
          date: { validate: "valid date", type: "string" },
          time: { validate: "valid time", type: "string" },
          numberOfCups: { validate: "required", type: "string" },
          price: { validate: ">0", type: "number" },
          technicianId: { validate: "required", type: "string" },
        };
      case "create-followup":
        return {
          date: { validate: "valid date", type: "string" },
        };
      default:
        return {};
    }
  };

  // Handle Save
  const handleSave = () => {
    const schema = getValidationSchema();
    form.technicianId = form.technicianId ? form.technicianId.toString() : "";
    form.date = form.date ? dateToISOStringFormat(form.date) : null;
    const { isValid, errors: validationErrors } = validateForm(form, schema);

    // Bind validation errors to reactive errors object
    Object.keys(errors).forEach((k) => (errors[k] = "")); // reset
    Object.assign(errors, validationErrors);

    if (!isValid) return null;
    return getPayload();
  };

  // Generate payload based on currentAction
  const getPayload = () => {
    switch (props.currentAction) {
      case "create-patient":
      case "edit-patient":
        return {
          id: form.id,
          name: form.name,
          phoneNumber: form.phoneNumber,
          gender: form.gender,
          numberOfCups: form.numberOfCups,
          amount: form.amount,
          paymentMethod: form.paymentMethod,
          technicianId: form.technicianId.toString(),
          notes: form.notes,
          date: form.date,
          reminder: form.reminder,
        };
      case "create-session":
        return {
          clientId: form.id,
          clinicId: form.clinicId,
          technicianId: form.technicianId,
          date: form.date,
          time: form.time,
          notes: form.notes,
          numberOfCups: form.numberOfCups,
          reminder: form.reminder,
          price: form.price,
        };
      case "create-followup":
        return {
          clientId: form.id,
          appointmentId: form.appointmentId,
          date: form.date,
        };
      default:
        return {};
    }
  };

  const getInitials = (name: string) =>
    name ? name.substring(0, 2).toUpperCase() : "US";

  return {
    form,
    errors,
    handleSave,
    getInitials,
    technicians,
  };
}
