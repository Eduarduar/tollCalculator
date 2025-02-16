import { Ref } from "vue";

export function handleNumberInput(ref: Ref<string>) {
  let value = ref.value;

  value = value.replace(/[^0-9.,]/g, "");

  const parts = value.split(".");
  if (parts.length > 2) {
    value = parts[0] + "." + parts.slice(1).join("");
  }

  ref.value = value;
}

export function handleNumberBlur(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = input.value;

  value = value.replace(/,/g, "");

  if (!value) {
    input.value = "0.00";
    return;
  }

  const numericValue = parseFloat(value) || 0;
  input.value = numericValue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export const formatNumber = (num: number) =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const unformatNumber = (num: string) => num.replace(/,/g, "");
