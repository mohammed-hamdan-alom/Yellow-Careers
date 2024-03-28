import { showError } from "@/components/Alert/alert";

/**
 * Formats the error message based on the error response.
 */
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

/**
 * Handles the error and shows the error message.
 */
export function handleErrorAndShowMessage(consoleMessage, error) {
  console.error(consoleMessage, error);
  const errorMessage = formatErrorMessage(error);
  if (errorMessage) {
    showError(errorMessage);
  }
}
