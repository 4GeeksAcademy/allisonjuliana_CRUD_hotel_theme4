"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, HotelTheme, Hotel, Theme
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/hoteltheme', methods=['POST'])
def create_hoteltheme():
    body = request.get_json()

    # Validating incoming data
    if not body or not body.get('id_hotel') or not body.get('id_theme'):
        return jsonify({"message": "id_hotel and id_theme are required"}), 400

    # Check if the hotel and theme exist
    hotel = Hotel.query.get(body.get('id_hotel'))
    theme = Theme.query.get(body.get('id_theme'))

    if not hotel or not theme:
        return jsonify({"message": "Hotel or Theme not found"}), 404

    # Create a new HotelTheme object
    new_hoteltheme = HotelTheme(
        id_hotel=body.get('id_hotel'),
        id_theme=body.get('id_theme')
    )

    # Add the new HotelTheme to the database
    db.session.add(new_hoteltheme)
    db.session.commit()

    return jsonify(new_hoteltheme.serialize()), 201  # Return the serialized HotelTheme and status 201

# READ: Get a list of all HotelThemes
@api.route('/hoteltheme', methods=['GET'])
def get_hotelthemes():
    hotelthemes = HotelTheme.query.all()
    return jsonify([hoteltheme.serialize() for hoteltheme in hotelthemes]), 200

# READ: Get a specific HotelTheme by ID
@api.route('/hoteltheme/<int:id>', methods=['GET'])
def get_hoteltheme(id):
    hoteltheme = HotelTheme.query.get(id)
    if not hoteltheme:
        return jsonify({"message": "HotelTheme not found"}), 404
    return jsonify(hoteltheme.serialize()), 200

# UPDATE: Update an existing HotelTheme by ID
@api.route('/hoteltheme/<int:id>', methods=['PUT'])
def update_hoteltheme(id):
    hoteltheme = HotelTheme.query.get(id)
    if not hoteltheme:
        return jsonify({"message": "HotelTheme not found"}), 404

    # Get updated data from request body
    body = request.get_json()

    # Check if the hotel and theme exist
    hotel = Hotel.query.get(body.get('id_hotel', hoteltheme.id_hotel))
    theme = Theme.query.get(body.get('id_theme', hoteltheme.id_theme))

    if not hotel or not theme:
        return jsonify({"message": "Hotel or Theme not found"}), 404

    # Update the fields of HotelTheme
    hoteltheme.id_hotel = body.get('id_hotel', hoteltheme.id_hotel)
    hoteltheme.id_theme = body.get('id_theme', hoteltheme.id_theme)
    
    db.session.commit()

    return jsonify(hoteltheme.serialize()), 200  # Return the updated HotelTheme

# DELETE: Delete a HotelTheme by ID
@api.route('/hoteltheme/<int:id>', methods=['DELETE'])
def delete_hoteltheme(id):
    hoteltheme = HotelTheme.query.get(id)
    if not hoteltheme:
        return jsonify({"message": "HotelTheme not found"}), 404

    db.session.delete(hoteltheme)
    db.session.commit()

    return jsonify({"message": "HotelTheme deleted"}), 200