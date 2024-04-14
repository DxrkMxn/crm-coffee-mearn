import { Flip, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const showToast = ({msg, isErr = false}) => toast.success(msg, {
    position: "bottom-left",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "dark",
    type: isErr ? "error" : "success",
    icon: false,
    closeButton: false,
    transition: Flip,
});

export { showToast }