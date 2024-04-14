import React, { useState, useEffect, useRef } from 'react';
import OrderCategories from './OrderCategories';
import OrderOptions from './OrderOptions';
import OrderService from '../../api/services/OrderService';
import AuthService from '../../api/services/AuthService';
import MaterialService from '../../api/services/MaterialService';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Order = ({ ...props }) => {
    const [isRoot, setIsRoot] = useState(false);
    const [pending, setPending] = useState(false);
    const [listToOrder, setListToOrder] = useState(OrderService.list);
    const [categorySelected, setCategorySelected] = useState(undefined);
    const modalRef = useRef(null);

    const { id } = useParams();

    useEffect(() => {
        setIsRoot(id === undefined)
        setCategorySelected(id);
        setListToOrder(prev => prev = [...OrderService.list])
        const handleNavigation = (event) => {
            if (event.pathname === '/order') {
                setIsRoot(true);
            } else {
                setIsRoot(false);
            }
        };

        const events = ['hashchange', 'load'];
        events.forEach((event) => {
            window.addEventListener(event, handleNavigation);
        });

        return () => {
            events.forEach((event) => {
                window.removeEventListener(event, handleNavigation);
            });
        };
    }, [id]);

    useEffect(() => {
        setListToOrder(prev => prev = [...OrderService.list])
    }, [isRoot, id])


    const updateList = (newList) => {
        setListToOrder(prev => prev = [...newList]);
    }

    const showModal = () => {
        const modalInstance = MaterialService.M.Modal.init(modalRef.current);
        modalInstance.open();
    };

    const closeModal = () => {
        const modalInstance = MaterialService.M.Modal.init(modalRef.current);
        modalInstance.close();
    };

    const submit = async () => {
        setPending(true);

        try {
            const currentUser = await AuthService.getCurrentUser();

            if (!currentUser || !currentUser._id) {
                MaterialService.M.toast({ html: 'No ha iniciado sesión!' });
                setPending(false);
                return;
            }

            const userDetails = currentUser;

            const newOrder = {
                client: {
                    name: userDetails.name,
                    surname: userDetails.surname,
                    phone: userDetails.phone,
                    email: userDetails.email,
                },
                list: OrderService.list.map((item) => {
                    const { _id, ...itemWithoutId } = item;
                    return itemWithoutId;
                }),
                status: 'Pending',
            };
            const createdOrder = await OrderService.createOrder(newOrder);
            MaterialService.M.toast({ html: `Orden № ${createdOrder.order.order} fue creada!` });
            OrderService.clear();
            setListToOrder(OrderService.list);
            setPending(false);
            closeModal();
        } catch (error) {
            MaterialService.M.toast({ html: error.message });
            setPending(false);
        }
    };

    const allPrice = () => {
        return OrderService.price;
    };

    const removePosFromOrder = (_id) => {
        setPending(true);
        OrderService.remove(_id);
        setListToOrder(prev => prev = [...OrderService.list]);
        setPending(false);
    };

    return (
        <main className="content">
            <div className="page-title">
                <h4>{isRoot ? 'Pedido' : <><Link to="/order">Pedido</Link><i className="material-icons">keyboard_arrow_right</i>Agregar productos</>}</h4>
                <button disabled={!listToOrder.length} className="waves-effect btn grey darken-1" onClick={showModal}>
                    Completar
                </button>
            </div>
            {
                categorySelected === undefined
                    ? <OrderCategories />
                    : <OrderOptions updateList={updateList} setListToOrder={setListToOrder} />
            }
            <div ref={modalRef} className="modal modal-fixed-footer">
                <div className="modal-content">
                    <h4 className="mb1">Tu pedido</h4>
                    <table className="highlight">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {listToOrder.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>${(item.cost || 0) * (item.quantity || 0)}</td>
                                    <td onClick={() => removePosFromOrder(item._id)}><i className="material-icons pointer">delete</i></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="order-summary">
                        <p>costo total <strong>{allPrice()} $</strong></p>
                    </div>
                </div>
                <div className="modal-footer">
                    <button disabled={pending} onClick={closeModal} className="modal-action waves-effect waves-black btn-flat">Cancelas</button>
                    <button disabled={!listToOrder.length || pending} onClick={submit} className="modal-action btn waves-effect">Confirmar</button>
                </div>
            </div>
        </main>
    );
};

export default Order;
