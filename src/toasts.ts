import Toastify from "toastify-js";

const toastDefaults = {
  duration: 5000,
  newWindow: true,
  close: true,
  gravity: "top", // `top` or `bottom`
  position: "right", // `left`, `center` or `right`
  stopOnFocus: true, // Prevents dismissing of toast on hover
};

export const showToast = {
  error: (errorText = "There was an error."): void =>
    Toastify({
      ...toastDefaults,
      text: errorText,
      backgroundColor: "#721c24",
    }).showToast(),
  success: (successText = "Action completed successfully."): void =>
    Toastify({
      ...toastDefaults,
      text: successText,
      backgroundColor: "#155724",
    }).showToast(),
};
