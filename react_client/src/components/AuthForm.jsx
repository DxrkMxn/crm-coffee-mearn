import React, { useEffect, useState, forwardRef } from 'react';

const AuthForm = forwardRef(({
    title,
    buttonTitle,
    isRegistering,
    submitForm,
    formData,
    setFormData,
    loading,
    isUpdating,
}, ref) => {
    useEffect(() => {
        !formData && setFormData(prev => prev = {
            ...formData
        });
    }, [formData])

    const [touched, setTouched] = useState({})

    const handleTouch = (e) => {
        const { name } = e.target;
        setTouched(prev => prev = {
            ...touched,
            [name]: true,
        });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => prev = {
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitForm(formData);
    };

    const isValidform = () => {
        if (isUpdating) {
            return (
                formData.name !== ''
                && formData.surname !== ''
                && /^3\d{9}$/.test(formData.phone)
                )
            } else if (isRegistering) {
            return (
                formData.name !== ''
                && formData.surname !== ''
                && /^3\d{9}$/.test(formData.phone)
                && /^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
                && /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}/.test(formData.password)
                )
            } else {
            return (
                /^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
                && /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}/.test(formData.password)
            )
        }
    }

    return (
        <form className="card" onSubmit={handleSubmit}>
            <div className="card-content">
                <span className="card-title">{title}</span>
                {isRegistering && (
                    <>
                        <div className="input-field">
                            <input
                                type="text"
                                id="name"
                                autoComplete="off"
                                onChange={handleChange}
                                value={formData.name}
                                onBlur={handleTouch}
                                name="name"
                                required
                                className={(formData.name === '' && touched.name ? 'error-input error-text' : '')}
                            />
                            <label htmlFor="name" className={(formData.name === '' && touched.name ? 'error-text' : '')}>{isUpdating ? 'Actualizar Nombre:' : 'Nombre:'}</label>
                            {
                                (
                                    formData.name === '' && touched.name
                                ) ? (<span className="helper-text red-text">
                                    <span>El nombre es requerido</span>
                                </span>)
                                : <></>
                            }
                        </div>
                        <div className="input-field">
                            <input
                                type="text"
                                id="surname"
                                autoComplete="off"
                                onChange={handleChange}
                                value={formData.surname}
                                onBlur={handleTouch}
                                name="surname"
                                required
                                className={(formData.surname === '' && touched.surname ? 'error-input error-text' : '')}
                            />
                            <label htmlFor="surname" className={(formData.surname === '' && touched.surname ? 'error-text' : '')}>{isUpdating ? 'Actualizar Apellido:' : 'Apellido:'}</label>
                            {
                                (
                                    formData.surname === '' && touched.surname
                                ) ? (<span className="helper-text red-text">
                                    <span>El apellido es requerido</span>
                                </span>)
                                : <></>
                            }
                        </div>
                        <div className="input-field">
                            <input
                                type="tel"
                                id="phone"
                                autoComplete="off"
                                onChange={handleChange}
                                value={formData.phone}
                                onBlur={handleTouch}
                                name="phone"
                                maxLength="10"
                                required
                                className={(!/^3\d{9}$/.test(formData.phone) && touched.phone ? 'error-input error-text' : '')}
                            />
                            <label htmlFor="phone" className={(!/^3\d{9}$/.test(formData.phone) && touched.phone ? 'error-text' : '')}>{isUpdating ? 'Actualizar Teléfono:' : 'Teléfono:'}</label>
                            {
                                (
                                    !/^3\d{9}$/.test(formData.phone) && touched.phone
                                ) ? (<span className="helper-text red-text">
                                    {
                                        (
                                            formData.phone === ''
                                        ) ? (<span>El teléfono es requerido</span>)
                                        : (<span>El formato del teléfono es incorrecto</span>)
                                    }
                                </span>)
                                : <></>
                            }
                        </div>
                    </>
                )}
                {
                    isUpdating
                    ?? <><div className="input-field">
                        <input
                            type="email"
                            id="email"
                            autoComplete="off"
                            onChange={handleChange}
                            value={formData.email}
                                onBlur={handleTouch}
                            name="email"
                            required
                                className={(!/^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email) && touched.email ? 'error-input error-text' : '')}
                        />
                        <label htmlFor="email" className={(!/^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email) && touched.email ? 'error-text' : '')}>Email:</label>
                            {
                                (
                                    !/^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email) && touched.email
                                ) ? (<span className="helper-text red-text">
                                    {
                                        (
                                            formData.email === ''
                                        ) ? (<span>El email es requerido</span>)
                                        : (<span>El formato del email es incorrecto</span>)
                                    }
                                </span>)
                                : <></>
                            }
                    </div>
                        <div className="input-field">
                            <input
                                type="password"
                                id="password"
                                autoComplete="off"
                                onChange={handleChange}
                                value={formData.password}
                                onBlur={handleTouch}
                                name="password"
                                required
                                className={(!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}/.test(formData.password) && touched.password ? 'error-input error-text' : '')}
                            />
                            <label htmlFor="password" className={(!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}/.test(formData.password) && touched.password ? 'error-text' : '')}>Contraseña:</label>
                            {
                                (
                                    !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}/.test(formData.password) && touched.password
                                ) ? (<span className="helper-text red-text">
                                    {
                                        (
                                            formData.password === ''
                                        ) ? (<span>La contraseña es requerido</span>)
                                        : (<span>El formato de la contraseña es incorrecto</span>)
                                    }
                                </span>)
                                : <></>
                            }
                        </div></>
                }
            </div>
            <div className="card-action">
                <button className="modal-action btn waves-effect" type="submit" disabled={!isValidform() || loading}>
                    {buttonTitle}
                </button>
            </div>
        </form>
    );
});

export default AuthForm;
