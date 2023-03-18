FROM python:3.9.6
ENV PYTHONUNBUFFERED 1
WORKDIR /api
EXPOSE 80
COPY requirements.txt ./
RUN pip install -r requirements.txt
ADD abi ./abi
ADD api ./api
ADD purchase_indexer ./purchase_indexer
ADD scaley_valley ./scaley_valley
ADD entrypoint_api.sh ./entrypoint_api.sh
ADD entrypoint_purchase_indexer.sh ./entrypoint_purchase_indexer.sh
ADD manage.py ./manage.py
