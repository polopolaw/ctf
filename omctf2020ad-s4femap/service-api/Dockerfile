FROM maven:3.6.0-jdk-11 as build
WORKDIR /opt/s4femap

ADD ./pom.xml .
RUN mvn dependency:go-offline -B

ADD ./src ./src 
RUN mvn package -DskipTests

FROM alpine:latest
RUN apk --no-cache add openjdk11
WORKDIR /opt/s4femap

COPY --from=build /opt/s4femap/target/s4femap-1.0.0-SNAPSHOT.jar ./s4femap.jar
COPY ./bin ./bin
COPY ./init/ ./init/

RUN chmod 555 ./bin/sensor.sh && chmod 555 ./init/start.sh

EXPOSE 8079


#VOLUME ./db/
#VOLUME ./data/
#INIT environment variable yes|no pre-populate db and data with start values

ENTRYPOINT ["/bin/sh", "-c", "./init/start.sh"]
