import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import OptionsService from '../../api/services/OptionsService';
import LoaderComponent from '../LoaderComponent.jsx';
import './options-styles.css';

function OptionsForm({ categoryId }) {
    const [options, setOptions] = useState([]);
    const [optionId, setOptionId] = useState(null);
    const [addOptionForm, setAddOptionForm] = useState({
        name: '',
        cost: '',
    });
    const [touched, setTouched] = useState({
        name: false,
        cost: false,
    });
    const [error, setError] = useState({
        name: false,
        cost: false,
    });
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchData();
    }, [categoryId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const optionsData = await OptionsService.getAllOptions(categoryId);
            setOptions(optionsData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field) => {
        setAddOptionForm(prev => {
            return {
                ...prev,
                [field.target.id]: field.target.value
            }
        });
        setTouched(prev => {
            return {
                ...prev,
                [field.target.id]: true
            }
        });
        setError(prev => {
            if (field.target.id === 'name') {
                return {
                    ...prev,
                    name: !field.target.value.length
                }
            } else if (field.target.id === 'cost') {
                return {
                    ...prev,
                    cost: field.target.value < 0 || isNaN(field.target.value) || field.target.value === ''
                }
            }
        })
    }


    const initializeForm = () => {
        setAddOptionForm({
            name: '',
            cost: '',
        });
        setTouched({
            name: false,
            cost: false,
        });
        setError({
            name: false,
            cost: false,
        });
    };

    const selectOption = (selectedOption) => {
        setOptionId(selectedOption._id);
        setAddOptionForm({
            name: selectedOption.name,
            cost: selectedOption.cost,
        });
        setModalVisible(true);
    };

    const hideModal = () => {
        setModalVisible(false);
        initializeForm();
    };

    const submitOption = async () => {
        setLoading(true);

        if (error.name || error.cost) {
            setLoading(false);
            return;
        }

        try {
            if (optionId) {
                OptionsService.updateOption({
                    category: categoryId,
                    _id: optionId,
                    ...addOptionForm
                }).then(response => {
                    initializeForm();
                    setModalVisible(false);
                    fetchData();
                });
            } else {
                OptionsService.createOption({
                    ...addOptionForm,
                    category: categoryId,
                }).then(response => {
                    initializeForm();
                    setModalVisible(false);
                    fetchData();
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const removeOption = async (optionId, event) => {
        event.stopPropagation();
        const decision = window.confirm('Realmente quieres remover la Opción?');
        if (decision) {
            OptionsService.removeOption(optionId)
                .then(response => {
                    fetchData();
                    initializeForm();
                }).catch(errors => {
                    console.error(errors);
                })
        }
    };

    return (
        <>
            <div className='row'>
                <div className="col s12">
                    <div className="page-subtitle">
                        <h4>Opciones:</h4>
                        <Button
                            className="waves-effect waves-light btn grey darken-1 btn-small"
                            onClick={() => setModalVisible(true)}
                            disabled={loading}
                        >
                            Agregar opción
                        </Button>
                    </div>
                    {loading ? (
                        <LoaderComponent />
                    ) : options.length ? (
                        <div className="collection">
                            {options.map((option) => (
                                <div
                                    key={option._id}
                                    onClick={() => selectOption(option)}
                                    className="collection-item collection-item-icon"
                                >
                                    <span>
                                        {option.name}
                                        <strong>{` ${option.cost} $`}</strong>
                                    </span>
                                    <span onClick={(event) => removeOption(option._id, event)}>
                                        <i className="material-icons">delete</i>
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <span className="valign-wrapper">
                            <i className="material-icons">move_to_inbox</i>
                            No hay opciones en la categoría.
                        </span>
                    )}
                </div>
            </div>
            <Form className='modal' onSubmit={(e) => { e.preventDefault(); submitOption(); }}>
                <Modal show={modalVisible} onHide={hideModal} style={{
                    zIndex: 1003,
                    display: !modalVisible ? 'none' : 'block',
                    opacity: 1,
                    top: '10%',
                    transform: 'scaleX(1) scaleY(1)',
                }}>
                    <Modal.Header>
                        <Modal.Title>
                            <h4 className="mb1">{optionId ? "Editar" : "Agregar"} opción</h4>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="name" className={error.name && touched.name ? 'input-field invalid' : 'input-field'}
                            style={{
                                color: error.name && touched.name ? 'red' : 'black',
                                isInvalid: error.name && touched.name,
                            }}>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                value={addOptionForm.name}
                                onChange={handleChange}
                                onBlur={handleChange}
                                isInvalid={error.name && touched.name}
                                className={error.name && touched.name ? 'invalid' : ''}
                            />
                            <Form.Control.Feedback type="invalid" className="helper-text red-text" style={{
                                color: 'red',
                                display: error.name && touched.name ? 'block' : 'none'
                            }}>
                                Campo requerido.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="cost" className={error.cost && touched.cost ? 'input-field invalid' : 'input-field'}
                            style={{
                                color: error.cost && touched.cost ? 'red' : 'black',
                                isInvalid: error.cost && touched.cost,
                            }}>
                            <Form.Label>Precio</Form.Label>
                            <Form.Control
                                type="number"
                                min="0"
                                onChange={handleChange}
                                onBlur={handleChange}
                                value={addOptionForm.cost}
                                isInvalid={error.cost && touched.cost}
                                className={error.cost && touched.cost ? 'invalid' : ''}
                            />
                            <Form.Control.Feedback type="invalid" className="helper-text red-text" style={{
                                color: 'red',
                                display: error.cost && touched.cost ? 'block' : 'none'
                            }}>
                                Campo requerido.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={hideModal} className="modal-action waves-effect waves-black btn-flat">
                            Cancelar
                        </button>
                        <button onClick={submitOption} className={(
                            'modal-action waves-effect btn' + (
                                (!addOptionForm.name || !addOptionForm.cost || error.name || error.cost)
                                    ? ' disabled'
                                    : ''
                            ))}>
                            Guardar
                        </button>
                    </Modal.Footer>
                </Modal>
            </Form>
            <div className='modal-overlay' style={{
                zIndex: 1002,
                display: !modalVisible ? 'none' : 'block',
                opacity: 0.5,
            }}
                onClick={hideModal}
            />
        </>
    );
}

export default OptionsForm;
