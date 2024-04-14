import React, { useState, useEffect } from 'react';
import CategoriesService from '../../api/services/CategoriesService';
import { useNavigate } from 'react-router-dom';
import LoaderComponent from '../LoaderComponent';

const OrderCategories = ({ ...props }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            CategoriesService.getAllCategories()
                .then(response => {
                    setCategories(response);
                })
                .catch(errors => {
                    console.error(errors)
                })
                .finally(ev => {
                    setLoading(false);
                });
        };

        fetchData();
    }, []);

    return (
        loading
            ? (<LoaderComponent />)
            : (<div className="frow order-row">
                <div className="main">
                    {categories.length ? (
                        categories.map((category, index) => (
                            <div key={index} className="card waves-effect pointer" onClick={() => navigate('/order/' + category._id, { props: true })}>
                                <div className="center">
                                    <img src={category.image} alt="imageSrc" className="responsive-img order-img" />
                                </div>
                                <div className="card-content center p10">
                                    <h5 className="m0">{category.name}</h5>
                                </div>
                            </div>
                        ))
                    ) : (
                        <span className="center">No hay Categorías.</span>
                    )}
                </div>
            </div>)
    );
};

export default OrderCategories;
