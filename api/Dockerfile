FROM python:3.9.6
ENV PYTHONUNBUFFERED 1
WORKDIR /api
EXPOSE 80
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . ./
CMD /bin/sh ./entry_point.sh