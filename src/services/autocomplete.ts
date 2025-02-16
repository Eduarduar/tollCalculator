import { url } from "@/utils/BaseUrl";
import { inject } from "vue";

export const loadAutocompleteScript = async (): Promise<void> => {
  const showToast = inject("showToast") as (options: {
    message: string;
    tipo?: "info" | "error" | "warning" | "success";
    duration?: number;
    persistente?: boolean;
  }) => void;
  try {
    const response = await fetch(`${url}/api/autocomplete`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error al cargar el script: ${response.statusText}`);
    }

    const scriptContent = await response.text();

    const script = document.createElement("script");
    script.textContent = scriptContent;
    document.head.appendChild(script);

    showToast({
      message: "Welcome to the toll calculator!",
      tipo: "info",
      duration: 5000,
    });
  } catch (error) {
    console.error("Error al cargar el script:", error);
  }
};
