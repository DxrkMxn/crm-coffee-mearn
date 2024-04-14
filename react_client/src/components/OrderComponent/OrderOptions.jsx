import React, { useState, useEffect } from 'react';
import OrderService from '../../api/services/OrderService';
import OptionsService from '../../api/services/OptionsService';
import MaterialService from '../../api/services/MaterialService.jsx';
import { useParams } from 'react-router-dom';
import LoaderComponent from '../LoaderComponent.jsx';

const OrderOptions = ({ updateList, setListToOrder }) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    const { id } = { ...useParams() };

    const consultarApi = async () => {
        if (id === undefined) {
            return;
        }
        setLoading(true);
        try {
            const optionsData = await OptionsService.getAllOptions(id);
            const optionsWithQuantity = optionsData.map((p) => ({ ...p, quantity: 1 }));
            setOptions(optionsWithQuantity);
            setLoading(false);
        } catch (error) {
            MaterialService.toast('Could not retrieve options.');
            setLoading(false);
        }
    };

    useEffect(() => {
        consultarApi();
    }, [id]);

    const addToOrder = (option) => {
        MaterialService.toast(`Opción ${option.name} x${option.quantity} se agregó.`);
        OrderService.add(option);
        updateList([...OrderService.list]);
    };

    return (
        <>
            {
                loading
                    ? <LoaderComponent />
                    : (
                        <table className="highlight">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Cantidad</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {options.length ? (
                                    options.map((option) => (
                                        <tr key={option._id}>
                                            <td>{option.name}</td>
                                            <td>{option.cost} $</td>
                                            <td>
                                                <div className="input-field inline order-option-input">
                                                    <input value={option.quantity} onChange={(e) => setOptions(options.map((o) => (o._id === option._id ? { ...o, quantity: e.target.value } : o)))} type="number" min="0" />
                                                </div>
                                            </td>
                                            <td>
                                                <button disabled={!option.quantity} onClick={() => addToOrder(option)} className="btn waves-effect wavers-light btn-small">Agregar</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <span className="valign-wrapper">
                                        <i className="material-icons">do_not_disturb_alt</i>No hay opciones
                                    </span>
                                )}
                            </tbody>
                        </table>
                    )
            }
        </>
    );
};

export default OrderOptions;
