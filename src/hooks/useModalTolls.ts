import { ref } from "vue";

export function useDialogTolls() {
  const modalTolls = ref(false);
  const tollsProvide = ref(null);
  const setModalTolls = ({
    open,
    tolls = null,
  }: {
    open: boolean;
    tolls?: any;
  }) => {
    if (open) {
      if (!tollsProvide) return;
      modalTolls.value = open;
      tollsProvide.value = tolls;
    } else {
      modalTolls.value = open;
    }
  };

  return { modalTolls, setModalTolls, tollsProvide };
}
