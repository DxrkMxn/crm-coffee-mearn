import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CategoriesService from '../../api/services/CategoriesService';
import { showToast } from '../../utils/showToast.js';
import './styles.css'
import OptionsForm from './OptionForm.jsx';

function CategoryForm() {
    const [category, setCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', image: '' });
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const navigate = useNavigate();
    const { id } = useParams();
    const isNewCategory = id === 'new';

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (!isNewCategory) {
                    const categoryData = await CategoriesService.getCurrentCategory(id);
                    setCategory(categoryData);
                    setFormData({ ...formData, name: categoryData.name });
                    setImagePreview(categoryData.image || null);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isNewCategory]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isNewCategory) {
                CategoriesService.createCategory({
                    image: imagePreview,
                    name: formData.name,
                }).then(response => {
                    navigate('/categories/' + response._id);
                });
            } else {
                CategoriesService.updateCategory(id, {
                    image: '',
                    name: formData.name,
                }).then(response => {
                    navigate('/categories/' + id);
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const decision = window.confirm(`Realmente quieres eliminar la Categoría ${category?.name}?`);
        if (decision) {
            CategoriesService.removeCategory(id).then(response => {
                showToast({ msg: "La categoría ha sido eliminada." })
                navigate('/categories');
            }).catch(errors => console.error(errors))
        }
    };

    const showFileInput = () => {
        document.getElementById('fileInput').click();
    };

    const onFileUpload = (event) => {
        const file = event.target.files[0];
        setFormData({ ...formData, image: file });
        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <main className="content">
            <div className="page-title">
                <h4>
                    <Link to="/categories">Categorías</Link>
                    <i className="material-icons">keyboard_arrow_right</i>
                    {`${isNewCategory ? 'Agregar' : 'Actualizar'} categoría`}
                </h4>
                <span>
                    <button
                        className="btn btn-small red"
                        disabled={isNewCategory}
                        onClick={handleDelete}
                    >
                        <i className="material-icons">delete</i>
                    </button>
                </span>
            </div>

            <div className="row">
                <form className="col s12 l6" onSubmit={handleSubmit} noValidate>


                    <div className="input-field">
                        <input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            onBlur={() => {
                                setFormData({ ...formData, touched: true });
                            }}
                            className={formData.touched && formData.name.length < 2 ? 'invalid' : ''}
                            required
                        />
                        <label htmlFor="name">Nombre</label>
                        <span className="helper-text red-text">
                            {formData.touched && !formData.name ? 'Campo requerido.' : ''}
                            {formData.touched && formData.name && formData.name.length < 2 ? 'Nombre muy corto.' : ''}
                        </span>
                    </div>


                    <div>
                        <input
                            type="file"
                            className="dn"
                            id="fileInput"
                            onChange={onFileUpload}
                        />
                        <button
                            type="button"
                            disabled={loading || !formData.name}
                            className="waves-effect waves-light btn orange lighten-2 mb2"
                            onClick={showFileInput}
                        >
                            <i className="material-icons left">backup</i>
                            Cargar imagen
                        </button>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="waves-effect waves-light btn"
                            disabled={loading || !formData.name}
                        >
                            Guardar cambios
                        </button>
                    </div>

                </form>

                <div className="col s12 l4 center">
                    {imagePreview ? (
                        <img
                            className="responsive-img h200"
                            src={imagePreview}
                            alt={formData.name}
                        />
                    ) : (
                        <i className="large material-icons">
                            {isNewCategory ? 'add_a_photo' : 'broken_image'}
                        </i>
                    )}
                </div>
            </div>

            {!isNewCategory && <OptionsForm categoryId={id} />}
        </main>
    );
}

export default CategoryForm;
