import { ref } from "vue";
import { loadAutocompleteScript } from "@/services/autocomplete";

export const useAutocomplete = () => {
  const successAutocomplete = ref(false);
  const errorAutocomplete = ref(false);
  const loadingAutocomplete = ref(false);

  const loadAutoComplete = async () => {
    loadingAutocomplete.value = true;
    try {
      await loadAutocompleteScript();
      successAutocomplete.value = true;
    } catch (error) {
      console.error("Error al cargar el script:", error);
      errorAutocomplete.value = true;
    } finally {
      loadingAutocomplete.value = false;
    }
  };

  return {
    successAutocomplete,
    errorAutocomplete,
    loadingAutocomplete,
    loadAutoComplete,
  };
};
