import React, { useEffect, useRef, useState } from 'react';
import HistoryList from './HistoryList';
import { environment } from '../../enviroments/environment';
import OrderService from '../../api/services/OrderService';
import AuthService from '../../api/services/AuthService';
import './styles.css'
import MaterialService from '../../api/services/MaterialService';
import LoaderComponent from '../LoaderComponent';

function HistoryComponent() {
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(environment.STEP);
    const [historyList, setHistoryList] = useState([]);
    const [noMoreFlag, setNoMoreFlag] = useState(false);
    const [loadingFlag, setLoadingFlag] = useState(false);
    const [reloadingFlag, setReloadingFlag] = useState(false);
    const modalRef = useRef(null);

    const [selectedOrder, setSelectedOrder] = useState(null);

    const currentUser = AuthService.getCurrentUser();

    useEffect(() => {
        setReloadingFlag(true);
    }, [])


    useEffect(() => {
        fetchHistory();
    }, [limit]);

    const reloadContent = () => {
        setReloadingFlag(true);
        setHistoryList([]);
        fetchHistory();
    };

    const onOrderFinished = () => {
        return reloadContent();
    };

    const loadMore = () => {
        setLoadingFlag(true)
        setLimit(prev => prev = prev + environment.STEP)
    };

    const fetchHistory = () => {
        const params = { offset, limit };
        if (currentUser.admin) {
            OrderService.getAllOrders({ ...params })
                .then((response) => {
                    setNoMoreFlag(response.length < limit);
                    setReloadingFlag(false);
                    setLoadingFlag(false);
                    setHistoryList([...response]);
                })
                .catch((error) => {
                    setReloadingFlag(false);
                    setLoadingFlag(false);
                    console.error('Error obteniendo Órdenes:', error);
                });
        } else {
            OrderService.getOrdersByUser({ userId: currentUser._id, ...params })
                .then((response) => {
                    setNoMoreFlag(response.length < limit);
                    setReloadingFlag(false);
                    setLoadingFlag(false);
                    setHistoryList([...response]);
                })
                .catch((error) => {
                    setReloadingFlag(false);
                    setLoadingFlag(false);
                    console.error('Error obteniendo Órdenes:', error);
                });
        }
    };

    const openModal = () => {
        const modalInstance = MaterialService.M.Modal.init(modalRef.current);
        modalInstance.open();
    };

    const closeModal = () => {
        const modalInstance = MaterialService.M.Modal.init(modalRef.current);
        modalInstance.close();
    };


    return (
        <>
            <main className="content">
                <div className="page-title">
                    <h4>Historial de Pedidos</h4>
                    <button
                        onClick={reloadContent}
                        className="btn btn-small"
                        disabled={reloadingFlag || loadingFlag}
                        data-tooltip="Recargar"
                    >
                        <i className="material-icons">refresh</i>
                    </button>
                </div>
                <div className="card">
                    <div className="card-content">
                        {
                            reloadingFlag
                                ? <LoaderComponent />
                                : <>
                                    {historyList.length ? (
                                        <HistoryList
                                            historyList={historyList}
                                            modalRef={modalRef}
                                            orderFinished={onOrderFinished}
                                            openModal={openModal}
                                            closeModal={closeModal}
                                            selectedOrder={selectedOrder}
                                            setSelectedOrder={setSelectedOrder}
                                            isAdmin={currentUser.admin}
                                            loadingFlag={loadingFlag}
                                        />
                                    ) : (
                                        <div className="center">No hay pedidos</div>
                                    )}
                                    <div className="center mb2" style={{ display: noMoreFlag || loadingFlag || reloadingFlag ? 'none' : 'block' }}>
                                        <button
                                            disabled={noMoreFlag || loadingFlag || reloadingFlag}
                                            onClick={loadMore}
                                            className="btn waves-effect grey darken-1 btn-small"
                                        >
                                            Cargar más
                                        </button>
                                    </div>
                                </>
                        }
                    </div>
                </div>
            </main>
        </>
    );
}

export default HistoryComponent;
