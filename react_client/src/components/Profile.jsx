import React, { useRef, useState } from "react";
import AuthService from "../api/services/AuthService";
import { decodeToken } from "react-jwt";
import AuthForm from "./AuthForm";
import MaterialService from "../api/services/MaterialService";

function ProfileComponent() {
    const crmAuthForm = useRef();

    const [loader, setLoader] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        phone: "",
    });

    const isValidEmail = () => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(formData.email);
    }

    const isValidPassword = () => {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return passwordRegex.test(formData.password);
    }

    const handleSubmit = (formData) => {
        setLoader(true);
        const myDecodedToken = decodeToken(localStorage.getItem('authToken')?.slice(7));
        AuthService.updateProfile({ userId: myDecodedToken.userId, formData })
            .then(() => {
                MaterialService.toast('Información personal actualizada!');
            })
            .catch((err) => {
                if (!err?.response) {
                    MaterialService.toast("No hay respuesta del servidor");
                } else if (err.response?.status === 400) {
                    MaterialService.toast("Olvidó su usuario o contraseña");
                } else if (err.response?.status === 401) {
                    MaterialService.toast("No autorizado");
                } else {
                    MaterialService.toast("Error de Login");
                }
            })
            .finally(ev => {
                setLoader(false);
            });
    };


    return (
        <main className="content">
            <div className="page-title">
                <h4>Perfil</h4>
            </div>
            <AuthForm
                ref={crmAuthForm}
                title="Actualizar datos personales"
                buttonTitle="Actualizar"
                isUpdating={true}
                isRegistering={true}
                loading={loader}
                submitForm={handleSubmit}
                formData={formData}
                setFormData={setFormData}
                isValidEmail={isValidEmail}
                isValidPassword={isValidPassword}
            />
        </main>
    );
}

export default ProfileComponent;
