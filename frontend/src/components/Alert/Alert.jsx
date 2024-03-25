import swal from "sweetalert2";
import Swal from "sweetalert2";

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

export const showJobCreatedSuccess = () => {
  Swal.fire(
    "Job Created",
    "Your job has been created successfully!",
    "success"
  );
};

export const showJobCreatedError = () => {
  Swal.fire("Error", "There was an error creating the job.", "error");
};
