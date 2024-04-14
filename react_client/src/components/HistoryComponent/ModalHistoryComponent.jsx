import React from 'react';
import calculateTotalCost from '../../utils/calculateTotalCost';

function ModalComponent({ modalRef, selectedOrder, isAdmin, finishOrder, closeModal }) {
    return (
    <div ref={modalRef} className="modal modal-fixed-footer">
        <div className="modal-content">
            <h4 className="mb1">Pedido №{selectedOrder?.order}</h4>
            <table className="highlight">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedOrder?.list.map((item, index) => (
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>${item.cost}</td>
                        </tr>))}
                </tbody>
            </table>
            <div className="order-summary">
                <p>Total: <strong>{selectedOrder ? calculateTotalCost(selectedOrder) : 0} $</strong></p>
            </div>
        </div>
        <div className="modal-footer">
            {isAdmin && selectedOrder?.status === 'Pending' && (
                <button
                    onClick={finishOrder}
                    className="btn waves-effect grey darken-1 btn-small"
                >
                    Finalizar
                </button>
            )}
            <button
                onClick={closeModal}
                className="modal-action waves-effect waves-black btn-flat"
            >
                Cerrar
            </button>
        </div>
    </div>
    )
}

export default ModalComponent;
