import { reactive, watch } from "vue";
import { validateForm } from "@/utils/helpers/validate";

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
    // Patient
    name: "",
    phoneNumber: "",
    gender: "",
    numberOfCups: "",
    amount: 0,
    paymentMethod: "",
    technicianId: "",
    notes: "",
    date: "",
    reminder: "",

    // Session
    clientId: "",
    clinicId: "",
    time: "",
    price: 0,

    // Follow-up
    appointmentId: "",
  });

  const errors = reactive<Record<string, string>>({});

  // Prefill form if patient exists
  watch(
    () => props.patient,
    (patient) => {
      if (!patient) return;
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
      case "edit-patient":
        return {
          name: { validate: "required", type: "string" },
          phoneNumber: { validate: "required", type: "string" },
          gender: { validate: "required", type: "string" },
          // technicianId: { validate: "required", type: "string" },
          paymentMethod: { validate: "required", type: "string" },
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
          name: form.name,
          phoneNumber: form.phoneNumber,
          gender: form.gender,
          numberOfCups: form.numberOfCups,
          amount: form.amount,
          paymentMethod: form.paymentMethod,
          technicianId: form.technicianId,
          notes: form.notes,
          date: form.date,
          reminder: form.reminder,
        };
      case "create-session":
        return {
          clientId: form.clientId,
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
          clientId: form.clientId,
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
  };
}
