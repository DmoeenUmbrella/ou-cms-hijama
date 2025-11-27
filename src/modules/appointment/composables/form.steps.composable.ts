// /src/composables/useStepForm.ts
import { ref, computed } from "vue";

export function useStepForm(totalSteps = 3) {
  const step = ref(1);

  const isFirst = computed(() => step.value === 1);
  const isLast = computed(() => step.value === totalSteps);

  const next = () => {
    if (step.value < totalSteps) step.value++;
  };

  const back = () => {
    if (step.value > 1) step.value--;
  };

  const goTo = (n: number) => {
    if (n >= 1 && n <= totalSteps) step.value = n;
  };

  return { step, isFirst, isLast, next, back, goTo };
}
