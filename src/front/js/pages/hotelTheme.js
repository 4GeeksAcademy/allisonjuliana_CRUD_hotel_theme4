import React, { useState, useEffect } from 'react';
import "../../styles/hotelTheme.css";
import 'font-awesome/css/font-awesome.min.css';

const HotelTheme = () => {
  const [hoteles, setHoteles] = useState([]);
  const [themes, setThemes] = useState([]);
  const [hotelId, setHotelId] = useState('');
  const [themeId, setThemeId] = useState('');
  const [hotelThemes, setHotelThemes] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || process.env.BACKEND_URL;

  const loadHoteles = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/hoteles`);
      if (response.ok) {
        const data = await response.json();
        setHoteles(data);
      } else {
        console.error("Error al obtener los hoteles:", response.status);
      }
    } catch (error) {
      console.error('Error al obtener los hoteles:', error);
    }
  };

  const loadThemes = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/theme`);
      if (response.ok) {
        const data = await response.json();
        setThemes(data.themes);
      } else {
        console.error("Error al obtener los temas:", response.status);
      }
    } catch (error) {
      console.error('Error al obtener los temas:', error);
    }
  };

  const loadHotelThemes = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/hoteltheme`);
      if (response.ok) {
        const data = await response.json();
        setHotelThemes(data);
      } else {
        console.error("Error al obtener las relaciones hotel-tema:", response.status);
      }
    } catch (error) {
      console.error('Error al obtener las relaciones hotel-tema:', error);
    }
  };

  const createHotelTheme = async () => {
    if (!hotelId || !themeId) {
      alert('Por favor, selecciona tanto un hotel como un tema');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/hoteltheme`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_hoteles: hotelId,
          id_theme: themeId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setHotelThemes([...hotelThemes, data]);
        resetForm();
      } else {
        const errorData = await response.json();
        console.error("Error al crear la relación:", errorData.message);
      }
    } catch (error) {
      console.error('Error al crear la relación hotel-tema:', error);
    }
  };

  const updateHotelTheme = async () => {
    if (!hotelId || !themeId || !editingId) {
      alert('Por favor, selecciona tanto un hotel como un tema para editar');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/hoteltheme/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_hoteles: hotelId,
          id_theme: themeId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setHotelThemes(
          hotelThemes.map(item =>
            item.id === editingId ? data : item
          )
        );
        resetForm();
      } else {
        const errorData = await response.json();
        console.error("Error al editar la relación:", errorData.message);
      }
    } catch (error) {
      console.error('Error al editar la relación hotel-tema:', error);
    }
  };

  const deleteHotelTheme = async (id) => {
    const isConfirmed = window.confirm("¿Estás seguro de que quieres eliminar esta relación?");
  
    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/hoteltheme/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setHotelThemes(hotelThemes.filter(item => item.id !== id));
      } else {
        const errorData = await response.json();
        console.error("Error al eliminar la relación:", errorData.message);
      }
    } catch (error) {
      console.error('Error al eliminar la relación hotel-tema:', error);
    }
  };

  const resetForm = () => {
    setHotelId('');
    setThemeId('');
    setEditingId(null);
  };

  const editHotelTheme = (id) => {
    const hotelThemeToEdit = hotelThemes.find((ht) => ht.id === id);
    if (hotelThemeToEdit) {
      setHotelId(hotelThemeToEdit.id_hoteles);
      setThemeId(hotelThemeToEdit.id_theme);
      setEditingId(id);
    }
  };

  const cancelEdit = () => {
    resetForm();
  };

  useEffect(() => {
    loadHoteles();
    loadThemes();
    loadHotelThemes();
  }, []);

  return (
    <div className="container">
      <h1>Gestión de Relaciones entre Hotel y Tema</h1>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{editingId ? 'Editar' : 'Crear'} Relación Hotel-Tema</h5>

          <form>
            <div className="form-group">
              <label htmlFor="hotelSelect">Hotel</label>
              <select
                className="form-control"
                id="hotelSelect"
                value={hotelId}
                onChange={(e) => setHotelId(e.target.value)}
              >
                <option value="">Selecciona un hotel</option>
                {hoteles.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="themeSelect">Tema</label>
              <select
                className="form-control"
                id="themeSelect"
                value={themeId}
                onChange={(e) => setThemeId(e.target.value)}
              >
                <option value="">Selecciona un tema</option>
                {themes.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <button
                type="button"
                className="btn btn-primary"
                onClick={editingId ? updateHotelTheme : createHotelTheme}
              >
                {editingId ? 'Actualizar' : 'Crear'} Relación
              </button>

              {editingId && (
                <button
                  type="button"
                  className="btn btn-primary ml-2"
                  onClick={cancelEdit}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <h3 className="mt-4">Relaciones Actuales entre Hotel y Tema</h3>
      <div className="list-group mt-4">
        {hotelThemes.map((hotelTheme) => (
          <div className="list-group-item d-flex justify-content-between align-items-center" key={hotelTheme.id}>
            <div>
              <strong>Hotel ID:</strong> {hotelTheme.id_hoteles} - <strong>Tema ID:</strong> {hotelTheme.id_theme}
            </div>
            <div>
              <button
                className="btn btn-primary btn-sm mr-2"
                onClick={() => editHotelTheme(hotelTheme.id)}
              >
                Editar
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => deleteHotelTheme(hotelTheme.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelTheme;
