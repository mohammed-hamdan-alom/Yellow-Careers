import swal from "sweetalert2";

/**
 * Displays an error message using a toast notification.
 */
export const showError = (message) => {
  swal.fire({
    title: message,
    icon: "error",
    toast: true,
    timer: 3000,
    position: "top-right",
    timerProgressBar: true,
    showConfirmButton: false,
  });
};

/**
 * Displays a success message using a toast notification.
 */
export const showSuccess = (message) => {
  swal.fire({
    title: message,
    icon: "success",
    toast: true,
    timer: 3000,
    position: "top-right",
    timerProgressBar: true,
    showConfirmButton: false,
  });
};
