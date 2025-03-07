from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }

class Hotel(db.Model):
    __tablename__ = 'hotel'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f'<Hotel {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
        }
    
class Theme(db.Model):
    __tablename__ = 'theme'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f'<Theme {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
        }
    
class HotelTheme(db.Model):
    __tablename__ = 'hoteltheme'
    id = db.Column(db.Integer, primary_key=True)
    id_hotel = db.Column(db.Integer, db.ForeignKey('hotel.id'), nullable=True)
    id_theme = db.Column(db.Integer, db.ForeignKey('theme.id'), nullable=True)

    hotel = db.relationship('Hotel', backref='hoteltheme')
    theme = db.relationship('Theme', backref='hoteltheme')

    def __repr__(self):
        return f'<HotelTheme {self.id}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "id_hotel": self.id_hotel,
            "id_theme": self.id_theme
        }
