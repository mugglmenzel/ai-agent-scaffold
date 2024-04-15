FROM python:3.9-slim

# set work directory
ENV APP_HOME /app
WORKDIR $APP_HOME

# install python dependencies
COPY requirements.txt ./
RUN pip install -r requirements.txt

# copy the app code
COPY . .

# launch the webserver
CMD exec gunicorn --log-level=debug --bind :$PORT --workers 1 --threads 1 main:app 