import React, { useEffect, useState } from 'react';
import EmailSchemasService from '../../api/services/EmailSchemasService';
import { RouterPathsEnum } from '../../api/enums/routerPaths.enum.tsx';
import { environment } from '../../enviroments/environment.js';
import { useNavigate, Link } from 'react-router-dom';
import LoaderComponent from '../LoaderComponent.jsx';

function MailingSchemas() {
    const [emailSchemasList, setEmailSchemasList] = useState(null);
    const [loading, setLoading] = useState(false);
    const [params, setParams] = useState({
        page: 0,
        pageSize: environment.STEP,
    })
    const routerPathsEnum = RouterPathsEnum;

    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true);
        EmailSchemasService.getEmailSchemas({ ...params })
            .then(response => {
                setEmailSchemasList(prev => response)
            })
            .catch(errors => console.error(errors))
            .finally(ev => setLoading(false));
    }, []);

    return (
        <main className="content">
            <div className="page-title">
                <h4>Esquemas</h4>
                <button className="waves-effect waves-light btn grey darken-1" onClick={() => navigate(routerPathsEnum.NEW)}>
                    Agregar esquema
                </button>
            </div>

            {
                loading
                    ? <LoaderComponent />
                    : <div className="row">
                        <div className="col s12">
                            {emailSchemasList ? (
                                <>
                                    {emailSchemasList.length ? (
                                        <div className="collection">
                                            {emailSchemasList.map((emailSchema) => (
                                                <Link
                                                    key={emailSchema._id}
                                                    to={emailSchema._id}
                                                    className="collection-item"
                                                >
                                                    {emailSchema.name}
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="valign-wrapper">
                                            No tienes esquemas de correo.
                                            <i className="material-icons">email</i>
                                        </span>
                                    )}
                                </>
                            ) : (
                                <LoaderComponent />
                            )}
                        </div>
                    </div>
            }
        </main>
    );
}

export default MailingSchemas;
