import { showError } from "@/components/Alert/alert";

export function formatErrorMessage(error) {
  if (error.response) {
    const data = error.response.data;
    let errorMessage = "";
    for (let key in data) {
      if (data.hasOwnProperty(key) && Array.isArray(data[key])) {
        errorMessage += `${key}:\n${data[key].join("\n")}\n`;
      }
    }
    return errorMessage;
  }
  return null;
}

export function handleErrorAndShowMessage(consoleMessage, error) {
  console.error(consoleMessage, error);
  const errorMessage = formatErrorMessage(error);
  if (errorMessage) {
    showError(errorMessage);
  }
}