import React, { useEffect, useState, useRef } from 'react';
import OrderService from '../../api/services/OrderService';
import MaterialService from '../../api/services/MaterialService';
import calculateTotalCost from '../../utils/calculateTotalCost';
import ModalComponent from './ModalHistoryComponent';
import LoaderComponent from '../LoaderComponent';

function HistoryListComponent({ historyList, orderFinished, openModal, modalRef, closeModal, selectedOrder, setSelectedOrder, isModalOpen, isAdmin, loadingFlag }) {
    const [] = useState(null);
    const destroy$ = useRef({ next: () => { }, complete: () => { } });

    useEffect(() => {
        return () => {
            destroy$.current.next();
            destroy$.current.complete();
        };
    }, []);

    const selectOrder = (item) => {
        setSelectedOrder(prev => prev = {...item});
        openModal();
    };

    const trackById = (index, item) => {
        return item._id;
    };

    const finishOrder = () => {
        if (selectedOrder && selectedOrder._id) {
            return OrderService.finishOrder(selectedOrder._id)
            .then(response => {
                    MaterialService.toast('Orden finalizada!');
                    closeModal();
                    orderFinished();
                }).catch(errors => {
                    console.error(errors);
                    MaterialService.toast('Error al finalizar la orden');
                })
        } else {
            MaterialService.toast('La orden seleccionada no tiene un ID válido.');
        }
    };

    return (
        <>

            <table className="highlight mb2">
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {historyList.map((historyItem) => (
                        <tr key={historyItem._id}>
                            <td>{historyItem.order}</td>
                            <td>{new Date(historyItem.date).toLocaleDateString()}</td>
                            <td>{new Date(historyItem.date).toLocaleTimeString()}</td>
                            <td>{calculateTotalCost(historyItem)} $</td>
                            <td>
                                {historyItem.status === 'Pending' ? 'Iniciada' : 'Finalizada'}
                            </td>
                            <td>
                                <button
                                    onClick={() => { selectOrder(historyItem) }}
                                    className="btn btn-small grey darken-1"
                                >
                                    <i className="material-icons">open_in_new</i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {
                loadingFlag && <LoaderComponent />
            }
            <ModalComponent
                modalRef={modalRef}
                selectedOrder={selectedOrder}
                isAdmin={isAdmin}
                finishOrder={finishOrder}
                closeModal={closeModal}
            />

        </>
    );
}

export default HistoryListComponent;
