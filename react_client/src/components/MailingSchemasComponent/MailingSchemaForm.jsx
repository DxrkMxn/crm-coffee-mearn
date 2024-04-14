import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { RouterPathsEnum } from '../../api/enums/routerPaths.enum.tsx';
import EmailSchemasService from '../../api/services/EmailSchemasService.jsx';
import moment from 'moment';

function MailingSchemaForm() {
    const { id } = useParams();
    const isNew = id === 'new';
    const emailSchemaFormRef = useRef(null);
    const [emailSchema, setEmailSchema] = useState({
        _id: null,
        name: '',
        subject: '',
        sendDate: '',
        templateUrl: '',
    });
    const [emailSchemaCharged, setEmailSchemaCharged] = useState('');
    const [isFileSelected, setIsFileSelected] = useState(false);
    const [loading, setLoading] = useState(false);
    const routerPathsEnum = RouterPathsEnum;
    const fileInputRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!isNew) {
            return EmailSchemasService.getEmailSchemaById(id)
                .then(response => {
                    setEmailSchema(prev => prev = {
                        ...response,
                        sendDate: moment(response.sendDate).format('YYYY-MM-DD')
                    })
                    setEmailSchemaCharged(prev => prev = response.templateUrl);
                    return setIsFileSelected(true);
                }).catch(errors => console.error(errors))
        }
    }, [isNew, id]);

    const handleChange = ev => {
        if (['name', 'subject', 'sendDate'].includes(ev.target.id)) {
            setEmailSchema({
                ...emailSchema,
                [ev.target.id]:
                    ev.target.id === 'sendDate'
                        ? moment(ev.target.value).format('YYYY-MM-DD')
                        : ev.target.value
            })
        }
    }

    const isInvalidForm = ev => {
        return (
            emailSchema.name === ''
            || emailSchema.sendDate === ''
            || emailSchema.subject === ''
            || emailSchemaCharged === ''
        ) 
    }

    const removeEmailSchema = () => {
        const decision = window.confirm(`¿Estás seguro de que deseas eliminar el esquema de correo electrónico ${emailSchema.name}?`);

        if (decision && id) {
            EmailSchemasService.deleteEmailSchema(id)
                .then(() => {
                    navigate("/" + routerPathsEnum.MAILING)
                })
                .catch((error) => {
                    console.error('Error deleting email schema:', error);
                });
        }
    };

    const submitForm = async (event) => {
        event.preventDefault();
        setLoading(true);

        const sendForm = {
            name: emailSchema.name,
            sendDate: emailSchema.sendDate,
            subject: emailSchema.subject,
            templateUrl: emailSchemaCharged,
        };

        try {
            if (isNew) {
                EmailSchemasService.createEmailSchema(sendForm).then(response => {
                    navigate("/" + routerPathsEnum.MAILING + "/" + response._id);
                })
            } else {
                await EmailSchemasService.updateEmailSchema(id, sendForm);
                navigate("/" + routerPathsEnum.MAILING + "/" + id);
            }
            setEmailSchema((prev) => ({ ...prev, ...sendForm }));
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };


    const downloadFileInput = () => {
        if (isFileSelected && typeof emailSchemaCharged === 'string') {
            const content = emailSchemaCharged;
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = content;
            a.download = 'email-schema.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    const onFileUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                if (e.target && typeof e.target.result === 'string') {
                    setEmailSchemaCharged(e.target.result);
                    setIsFileSelected(true);
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const showFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <main className="content">
            <div className="page-title">
                <h4>
                    <Link to={`/${routerPathsEnum.MAILING}`}>Esquemas</Link>
                    <i className="material-icons">keyboard_arrow_right</i>
                    {isNew ? 'Agregar' : 'Actualizar'} Esquema
                </h4>
                <span>
                    <button className="btn btn-small red" disabled={isNew} onClick={removeEmailSchema}>
                        <i className="material-icons">delete</i>
                    </button>
                </span>
            </div>

            <div className="row">
                <form ref={emailSchemaFormRef} onChange={handleChange} className="col s12 l6">
                    <div className="input-field">
                        <input id="name" type="text" value={emailSchema.name} />
                        <label htmlFor="name">Nombre</label>
                    </div>

                    <div className="input-field">
                        <input id="subject" type="text" value={emailSchema.subject} />
                        <label htmlFor="subject">Asunto</label>
                    </div>

                    <div className="input-field">
                        <input id="sendDate" type="date" value={emailSchema.sendDate} />
                        <label htmlFor="sendDate">Fecha en que se enviará</label>
                    </div>

                    <div>
                        <input type="file" style={{ display: 'none' }} ref={fileInputRef} onChange={onFileUpload} />
                        <button type="button" className="waves-effect waves-light btn orange lighten-2 mb2" onClick={showFileInput}>
                            <i className="material-icons left">backup</i>
                            Cargar esquema HTML
                        </button>
                        <button type="button" disabled={!isFileSelected} className="waves-effect waves-light btn blue lighten-2 mb2" onClick={downloadFileInput}>
                            <i className="material-icons left">download</i>
                            Descargar esquema HTML
                        </button>
                    </div>
                    <div>
                        <button onClick={submitForm} className="waves-effect waves-light btn" disabled={isInvalidForm() || loading}>
                            Guardar cambios
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default MailingSchemaForm;
