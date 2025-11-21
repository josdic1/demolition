import pandas as pd
import plotly.express as px
import streamlit as st
from sqlalchemy import create_engine

engine = create_engine('sqlite:///server/instance/app.db')

songs = pd.read_sql('SELECT * FROM song', engine)
links = pd.read_sql('SELECT * FROM link', engine)

st.title("Your Music Catalog Dashboard")
st.dataframe(songs)

st.bar_chart(songs['artist'].value_counts().head(10))
st.write("Most common keys")
st.bar_chart(songs['key'].value_counts())
st.write("Total songs:", len(songs))
