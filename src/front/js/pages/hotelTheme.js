import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/hotelTheme.css";
import 'font-awesome/css/font-awesome.min.css';

const HotelThemeForm = () => {
    const [nombre, setNombre] = useState('');
    const [message, setMessage] = useState('');
    const [hotelThemesList, setHotelThemesList] = useState([]);  // Cambié 'themesList' por 'hotelThemesList'
    const [editMode, setEditMode] = useState(false);
    const [selectedHotelThemeId, setSelectedHotelThemeId] = useState(null);  // Cambié 'selectedThemeId' por 'selectedHotelThemeId'

    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL || process.env.BACKEND_URL;

    useEffect(() => {
        fetchHotelThemes();
    }, []);

    const fetchHotelThemes = async () => {
        try {
            const response = await fetch(`${backendUrl}api/hoteltheme`);
            const data = await response.json();
            
            if (response.ok) {
                // Aquí, 'data' es una lista de asociaciones hotel-tema
                // Por ejemplo: [{ id: 1, id_hotel: 1, id_theme: 2 }, { id: 2, id_hotel: 1, id_theme: 3 }]
                // Ahora, necesitamos obtener los temas para cada 'id_theme'
    
                const themeIds = data.map(item => item.id_theme);
                
                // Hacer una nueva solicitud para obtener los temas basados en 'id_theme'
                const themesResponse = await fetch(`${backendUrl}api/theme?ids=${themeIds.join(',')}`); // Ajusta según tu API
                const themesData = await themesResponse.json();
    
                if (themesResponse.ok) {
                    setHotelThemesList(themesData.themes); // Aquí suponemos que la respuesta contiene 'themes'
                } else {
                    setMessage('Failed to load hotel themes.');
                }
            } else {
                setMessage('Failed to load hotel themes.');
            }
        } catch (error) {
            setMessage('Error fetching hotel themes.');
            console.error('Error fetching hotel themes:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nombre) {
            setMessage('Hotel theme name is required!');
            return;
        }

        const url = editMode
            ? `${backendUrl}/api/hoteltheme/${selectedHotelThemeId}`  // Cambié 'theme' por 'hoteltheme'
            : `${backendUrl}/api/hoteltheme`;  // Cambié 'theme' por 'hoteltheme'

        const method = editMode ? 'PUT' : 'POST';
        const body = JSON.stringify({
            nombre,
        });

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body,
            });

            const data = await response.json();

            if (response.ok) {
                setNombre('');
                setEditMode(false);
                setSelectedHotelThemeId(null);  // Cambié 'selectedThemeId' por 'selectedHotelThemeId'
                fetchHotelThemes();
                setMessage('Hotel theme updated successfully.');  // Cambié 'Theme' por 'Hotel theme'
            } else {
                setMessage('Error creating or updating hotel theme.');  // Cambié 'Theme' por 'Hotel theme'
            }
        } catch (error) {
            setMessage('Error creating or updating hotel theme.');  // Cambié 'Theme' por 'Hotel theme'
            console.error('Error making request:', error);
        }
    };

    const handleDelete = async (hotelThemeId) => {  // Cambié 'themeId' por 'hotelThemeId'
        const isConfirmed = window.confirm('Are you sure you want to delete this hotel theme?');  // Cambié 'theme' por 'hotel theme'

        if (!isConfirmed) {
            return;
        }

        const url = `${backendUrl}/api/hoteltheme/${hotelThemeId}`;  // Cambié 'theme' por 'hoteltheme'
        try {
            const response = await fetch(url, { method: 'DELETE' });
            const data = await response.json();

            if (response.ok) {
                setHotelThemesList((prevHotelThemesList) => {  // Cambié 'themesList' por 'hotelThemesList'
                    const newHotelThemesList = prevHotelThemesList.filter(hotelTheme => hotelTheme.id !== hotelThemeId);  // Cambié 'theme' por 'hotelTheme'
                    if (newHotelThemesList.length === 0) {
                        setMessage("No hotel themes available.");  // Cambié 'themes' por 'hotel themes'
                    }
                    return newHotelThemesList;
                });
                setMessage('Hotel theme deleted successfully.');  // Cambié 'Theme' por 'Hotel theme'
            } else {
                setMessage('Failed to delete hotel theme.');  // Cambié 'Theme' por 'Hotel theme'
            }
        } catch (error) {
            setMessage('Error deleting hotel theme.');  // Cambié 'Theme' por 'Hotel theme'
            console.error('Error deleting hotel theme:', error);  // Cambié 'Theme' por 'Hotel theme'
        }
    };

    const handleEdit = (hotelThemeId) => {  // Cambié 'themeId' por 'hotelThemeId'
        const hotelThemeToEdit = hotelThemesList.find((hotelTheme) => hotelTheme.id === hotelThemeId);  // Cambié 'theme' por 'hotelTheme'
        if (hotelThemeToEdit) {
            setNombre(hotelThemeToEdit.nombre);
            setSelectedHotelThemeId(hotelThemeId);  // Cambié 'selectedThemeId' por 'selectedHotelThemeId'
            setEditMode(true);
        }
    };

    const handleCancel = () => {
        setNombre('');
        setEditMode(false);
        setSelectedHotelThemeId(null);  // Cambié 'selectedThemeId' por 'selectedHotelThemeId'
    };

    const goToHome = () => {
        navigate('/');
    };

    return (
        <div className="container mt-5 mb-5 container-dark">
            <h2 className="text-center mb-4">{editMode ? 'Edit Hotel Theme' : 'Create Hotel Theme'}</h2>
            <div className="row justify-content-center">
                <div className="col-md-7">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="hotelTheme" className="form-label custom-label">Hotel Theme:</label>
                            <input
                                type="text"
                                id="hotelTheme"  // Cambié 'theme' por 'hotelTheme'
                                className="form-control custom-input"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                                style={{ fontSize: '24px' }}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-success w-100"
                        >
                            {editMode ? 'Save Changes' : 'Create Hotel Theme'}
                        </button>
                        {editMode && (
                            <button
                                type="button"
                                className="btn btn-danger w-100 mt-2"
                                onClick={handleCancel}
                            >
                                Cancel changes
                            </button>
                        )}
                    </form>
                </div>
            </div>

            {message && <p className="mt-3 text-center text-dark">{message}</p>}

            <h3 className="text-center mt-5">Hotel Themes List</h3>
            <div className="mt-4 col-md-7 mx-auto row">
                <ul className="list-group">
                    {hotelThemesList.length > 0 ? (  // Cambié 'themesList' por 'hotelThemesList'
                        hotelThemesList.map((hotelTheme) => (  // Cambié 'theme' por 'hotelTheme'
                            <li key={hotelTheme.id} className="list-group-item d-flex justify-content-between align-items-center  mb-2">
                                <span className="theme-text">{hotelTheme.nombre}</span>
                                <div className="col-2 d-flex justify-content-between">
                                    <i
                                        className="fa fa-pencil"
                                        style={{
                                            fontSize: '20px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => handleEdit(hotelTheme.id)}  // Cambié 'theme' por 'hotelTheme'
                                    ></i>
                                    <i
                                        className="fa fa-trash"
                                        style={{
                                            fontSize: '20px',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handleDelete(hotelTheme.id)}  // Cambié 'theme' por 'hotelTheme'
                                    ></i>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="mt-3 text-center text-dark">No hotel themes available.</p>  // Cambié 'themes' por 'hotel themes'
                    )}
                </ul>
                <button
                    type="button"
                    className="btn btn-primary w-100 mt-2"
                    onClick={goToHome}
                >
                    Go to Home
                </button>
            </div>
        </div>
    );
};

export default HotelThemeForm;  // Cambié 'ThemeForm' por 'HotelThemeForm'
