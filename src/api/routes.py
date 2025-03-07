from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, HotelTheme, Hotel, Theme
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# Ruta de prueba
@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200


# Ruta para crear una relación entre hotel y tema
@api.route('/hoteltheme', methods=['POST'])
def create_hoteltheme():
    body = request.get_json()

    # Validar los datos de entrada
    if not body or not body.get('id_hotel') or not body.get('id_theme'):
        return jsonify({"message": "id_hotel and id_theme are required"}), 400

    # Verificar si el hotel y tema existen
    hotel = Hotel.query.get(body.get('id_hotel'))
    theme = Theme.query.get(body.get('id_theme'))

    if not hotel or not theme:
        return jsonify({"message": "Hotel or Theme not found"}), 404

    # Crear un nuevo objeto HotelTheme
    new_hoteltheme = HotelTheme(
        id_hotel=body.get('id_hotel'),
        id_theme=body.get('id_theme')
    )

    # Agregar el nuevo HotelTheme a la base de datos
    db.session.add(new_hoteltheme)
    db.session.commit()

    return jsonify(new_hoteltheme.serialize()), 201  # Retornar el HotelTheme serializado y el estado 201

# Ruta para obtener todos los HotelThemes
@api.route('/hoteltheme', methods=['GET'])
def get_hotelthemes():
    hotelthemes = HotelTheme.query.all()
    return jsonify([hoteltheme.serialize() for hoteltheme in hotelthemes]), 200

# Ruta para obtener un HotelTheme específico por ID
@api.route('/hoteltheme/<int:id>', methods=['GET'])
def get_hoteltheme(id):
    hoteltheme = HotelTheme.query.get(id)
    if not hoteltheme:
        return jsonify({"message": "HotelTheme not found"}), 404
    return jsonify(hoteltheme.serialize()), 200

# Ruta para actualizar un HotelTheme por ID
@api.route('/hoteltheme/<int:id>', methods=['PUT'])
def update_hoteltheme(id):
    hoteltheme = HotelTheme.query.get(id)
    if not hoteltheme:
        return jsonify({"message": "HotelTheme not found"}), 404

    # Obtener los datos actualizados desde el cuerpo de la solicitud
    body = request.get_json()

    # Verificar si el hotel y tema existen
    hotel = Hotel.query.get(body.get('id_hotel', hoteltheme.id_hotel))
    theme = Theme.query.get(body.get('id_theme', hoteltheme.id_theme))

    if not hotel or not theme:
        return jsonify({"message": "Hotel or Theme not found"}), 404

    # Actualizar los campos de HotelTheme
    hoteltheme.id_hotel = body.get('id_hotel', hoteltheme.id_hotel)
    hoteltheme.id_theme = body.get('id_theme', hoteltheme.id_theme)

    db.session.commit()

    return jsonify(hoteltheme.serialize()), 200  # Retornar el HotelTheme actualizado

# Ruta para eliminar un HotelTheme por ID
@api.route('/hoteltheme/<int:id>', methods=['DELETE'])
def delete_hoteltheme(id):
    hoteltheme = HotelTheme.query.get(id)
    if not hoteltheme:
        return jsonify({"message": "HotelTheme not found"}), 404

    db.session.delete(hoteltheme)
    db.session.commit()

    return jsonify({"message": "HotelTheme deleted"}), 200


# Ruta para obtener todos los hoteles
@api.route('/hotel', methods=['GET'])
def get_hotels():
    hotels = Hotel.query.all()
    return jsonify([hotel.serialize() for hotel in hotels]), 200


# Ruta para obtener todos los temas
@api.route('/theme', methods=['GET'])
def get_themes():
    themes = Theme.query.all()
    return jsonify([theme.serialize() for theme in themes]), 200
