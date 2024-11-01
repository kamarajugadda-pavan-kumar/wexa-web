// write functions for success and failure toast
import { toast } from "react-toastify";

const showSuccessToast = (message) => toast.success(message);

const showFailureToast = (message) => toast.error(message);

export { showSuccessToast, showFailureToast };
