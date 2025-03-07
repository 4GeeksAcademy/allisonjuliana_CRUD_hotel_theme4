import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/hotelTheme.css";
import 'font-awesome/css/font-awesome.min.css';

const HotelTheme = () => {
  const [hotels, setHotels] = useState([]);
  const [themes, setThemes] = useState([]);
  const [hotelId, setHotelId] = useState('');
  const [themeId, setThemeId] = useState('');
  const [hotelThemes, setHotelThemes] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || process.env.BACKEND_URL;

  const loadHotels = async () => {
    try {
      const response = await fetch(`${backendUrl}api/hotel`);
      if (response.ok) {
        const data = await response.json();
        setHotels(data);
      } else {
        console.error("Error fetching hotels:", response.status);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const loadThemes = async () => {
    try {
      const response = await fetch(`${backendUrl}api/theme`);
      if (response.ok) {
        const data = await response.json();
        setThemes(data);
      } else {
        console.error("Error fetching themes:", response.status);
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
    }
  };

  const loadHotelThemes = async () => {
    try {
      const response = await fetch(`${backendUrl}api/hoteltheme`);
      if (response.ok) {
        const data = await response.json();
        setHotelThemes(data);
      } else {
        console.error("Error fetching hotelthemes:", response.status);
      }
    } catch (error) {
      console.error('Error fetching hotelthemes:', error);
    }
  };

  const createHotelTheme = async () => {
    if (!hotelId || !themeId) {
      alert('Please select both a hotel and a theme');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}api/hoteltheme`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_hotel: hotelId,
          id_theme: themeId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setHotelThemes([...hotelThemes, data]);
        resetForm();
      } else {
        const errorData = await response.json();
        console.error("Error creating relationship:", errorData.message);
      }
    } catch (error) {
      console.error('Error creating hotel-theme relationship:', error);
    }
  };

  const updateHotelTheme = async () => {
    if (!hotelId || !themeId || !editingId) {
      alert('Please select both a hotel and a theme to edit');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}api/hoteltheme/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_hotel: hotelId,
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
        console.error("Error editing relationship:", errorData.message);
      }
    } catch (error) {
      console.error('Error editing hotel-theme relationship:', error);
    }
  };

  const deleteHotelTheme = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this relationship?");
  
    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`${backendUrl}api/hoteltheme/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setHotelThemes(hotelThemes.filter(item => item.id !== id));
      } else {
        const errorData = await response.json();
        console.error("Error deleting relationship:", errorData.message);
      }
    } catch (error) {
      console.error('Error deleting hotel-theme relationship:', error);
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
      setHotelId(hotelThemeToEdit.id_hotel);
      setThemeId(hotelThemeToEdit.id_theme);
      setEditingId(id);
    }
  };

  const cancelEdit = () => {
    resetForm();
  };

  useEffect(() => {
    loadHotels();
    loadThemes();
    loadHotelThemes();
  }, []);

  return (
    <div className="container">
      <h1>Hotel and Theme Management</h1>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{editingId ? 'Edit' : 'Create'} Hotel-Theme Relationship</h5>

          <form>
            <div className="form-group">
              <label htmlFor="hotelSelect">Hotel</label>
              <select
                className="form-control"
                id="hotelSelect"
                value={hotelId}
                onChange={(e) => setHotelId(e.target.value)}
              >
                <option value="">Select a hotel</option>
                {hotels.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="themeSelect">Theme</label>
              <select
                className="form-control"
                id="themeSelect"
                value={themeId}
                onChange={(e) => setThemeId(e.target.value)}
              >
                <option value="">Select a theme</option>
                {themes.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
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
                {editingId ? 'Update' : 'Create'} Relationship
              </button>
              
              {editingId && (
                <button
                  type="button"
                  className="btn btn-danger ml-2"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <h3 className="mt-4">Current Hotel-Theme Relationships</h3>
      <div className="list-group mt-4">
        {hotelThemes.map((hotelTheme) => (
          <div className="list-group-item d-flex justify-content-between align-items-center" key={hotelTheme.id}>
            <div>
              <strong>Hotel:</strong> {hotels.find(h => h.id === hotelTheme.id_hotel)?.name} 
              - <strong>Theme:</strong> {themes.find(t => t.id === hotelTheme.id_theme)?.name}
            </div>
            <div>
              <button
                className="btn btn-warning btn-sm"
                onClick={() => editHotelTheme(hotelTheme.id)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm ml-2"
                onClick={() => deleteHotelTheme(hotelTheme.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelTheme;
