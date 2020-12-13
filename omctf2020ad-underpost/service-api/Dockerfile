FROM maven:3.6.0-jdk-11 as build
WORKDIR /opt/underpost

ADD ./pom.xml .
RUN mvn dependency:go-offline -B

ADD ./src ./src 
RUN mvn package -DskipTests

#FROM openjdk:11.0-jre-slim as run
FROM alpine:latest
RUN apk --no-cache add openjdk11
WORKDIR /opt/underpost

COPY --from=build /opt/underpost/target/underpost-1.0.0-SNAPSHOT.jar ./underpost.jar
COPY ./init/ ./init/
COPY ./bin ./bin
RUN chmod 555 ./init/start.sh && chmod 444 ./bin


#VOLUME ./db/
#VOLUME ./complaints/
#VOLUME ./images/
#INIT environment variable yes|no|cond pre-populate db and data with start values

EXPOSE 8078

ENTRYPOINT ["/bin/sh", "-c", "./init/start.sh"]