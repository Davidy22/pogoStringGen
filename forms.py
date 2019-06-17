from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired

class ContactForm(FlaskForm):
	name = StringField('Name', validators=[DataRequired()])
	email = StringField('Email', validators=[DataRequired()])
	message = StringField('Message', validators=[DataRequired()])