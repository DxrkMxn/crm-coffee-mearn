import React, { useEffect, useState } from 'react';
import { RouterPathsEnum } from '../../api/enums/routerPaths.enum.tsx';
import { useNavigate, Link } from 'react-router-dom';
import LoaderComponent from '../LoaderComponent.jsx';
import CategoriesService from '../../api/services/CategoriesService.jsx';

function Categories() {
    const [categories, setCategories] = useState(null);
    const [loading, setLoading] = useState(false);
    const routerPathsEnum = RouterPathsEnum;

    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true);
        CategoriesService.getAllCategories()
            .then(response => {
                setCategories(prev => response)
            })
            .catch(errors => console.error(errors))
            .finally(ev => setLoading(false));
    }, []);

    return (
        <main className="content">
            <div className="page-title">
                <h4>Categorías</h4>
                <button className="waves-effect waves-light btn grey darken-1" onClick={() => navigate(routerPathsEnum.NEW)}>
                    Agregar categoría
                </button>
            </div>

            {
                loading
                    ? <LoaderComponent />
                    : <div className="row">
                        <div className="col s12">
                            {categories ? (
                                <>
                                    {categories.length ? (
                                        <div className="collection">
                                            {categories.map((category) => (
                                                <Link
                                                    key={category._id}
                                                    to={'/categories/'+category._id}
                                                    className="collection-item"
                                                >
                                                    {category.name}
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="valign-wrapper">
                                            No tienes categorías.
                                            <i className="material-icons">shopping_cart</i>
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

export default Categories;
