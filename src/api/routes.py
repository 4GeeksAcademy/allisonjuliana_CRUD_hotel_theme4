from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Hoteles, Theme, HotelTheme
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)
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
    if not body or not body.get('id_hoteles') or not body.get('id_theme'):
        return jsonify({"message": "id_hoteles and id_theme are required"}), 400
    hotel = Hoteles.query.get(body.get('id_hoteles'))
    theme = Theme.query.get(body.get('id_theme'))
    if not hotel or not theme:
        return jsonify({"message": "Hotel or Theme not found"}), 404
    new_hoteltheme = HotelTheme(
        id_hoteles=body.get('id_hoteles'),
        id_theme=body.get('id_theme')
    )
    db.session.add(new_hoteltheme)
    db.session.commit()
    return jsonify(new_hoteltheme.serialize()), 201

@api.route('/hoteltheme', methods=['GET'])
def get_hotelthemes():
    hotelthemes = HotelTheme.query.all()
    return jsonify([hoteltheme.serialize() for hoteltheme in hotelthemes]), 200

@api.route('/hoteltheme/<int:id>', methods=['GET'])
def get_hoteltheme(id):
    hoteltheme = HotelTheme.query.get(id)
    if not hoteltheme:
        return jsonify({"message": "HotelTheme not found"}), 404
    return jsonify(hoteltheme.serialize()), 200

@api.route('/hoteltheme/<int:id>', methods=['PUT'])
def update_hoteltheme(id):
    hoteltheme = HotelTheme.query.get(id)
    if not hoteltheme:
        return jsonify({"message": "HotelTheme not found"}), 404
    body = request.get_json()
    hotel = Hoteles.query.get(body.get('id_hoteles', hoteltheme.id_hoteles))
    theme = Theme.query.get(body.get('id_theme', hoteltheme.id_theme))
    if not hotel or not theme:
        return jsonify({"message": "Hotel or Theme not found"}), 404
    hoteltheme.id_hoteles = body.get('id_hoteles', hoteltheme.id_hoteles)
    hoteltheme.id_theme = body.get('id_theme', hoteltheme.id_theme)
    db.session.commit()
    return jsonify(hoteltheme.serialize()), 200

@api.route('/hoteltheme/<int:id>', methods=['DELETE'])
def delete_hoteltheme(id):
    hoteltheme = HotelTheme.query.get(id)
    if not hoteltheme:
        return jsonify({"message": "HotelTheme not found"}), 404
    db.session.delete(hoteltheme)
    db.session.commit()
    return jsonify({"message": "HotelTheme deleted"}), 200

@api.route('/hoteles', methods=['GET'])
def obtener_hoteles():
    hoteles = Hoteles.query.all()
    hoteles_serialize = [hotel.serialize() for hotel in hoteles]
    return jsonify(hoteles_serialize), 200

@api.route('/theme', methods=['GET'])
def get_themes():
    themes = Theme.query.all()
    if not themes:
        return jsonify(message="No themes found"), 404
    all_themes = list(map(lambda x: x.serialize(), themes))
    return jsonify(message="Themes", themes=all_themes), 200
