import datetime as dt
import numpy as np
import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify, render_template, redirect


#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///Data/full_set.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save references to each table
full_dataset = Base.classes.full_dataset
# us_crime = Base.classes.US_crime
# cost_living = Base.classes.cost_living
# quality_life = Base.classes.quality_life
# income = Base.classes.income
# rent_index = Base.classes.rent_data
# news_data = Base.classes.US_News_Data

# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    return render_template("index.html")


@app.route("/map")
def map():
    return render_template("new.html")


@app.route("/chart")
def chart():
    return render_template("index2.html")


@app.route("/data")
def data():
    # talking to the database
    costs = session.query(
        # full_dataset.State_Abbreviation,
        full_dataset.State,
        full_dataset.Cost_of_Living,
        # full_dataset.Healthcare,
        full_dataset.Opportunity,
        full_dataset.Workforce,
        full_dataset.Economy,
        full_dataset.Quality_of_Life,
        full_dataset.Education,
        full_dataset.Crime_Rate,
        full_dataset.Estimated_Income
    ).all()
    # living = session.query(cost_living.StateAbbreviations).all
    session.close()
    return jsonify(pd.DataFrame(costs).to_dict('records'))
    # return jsonify(pd.DataFrame(living).to_dict('records'))


if __name__ == '__main__':
    app.run(debug=True)
