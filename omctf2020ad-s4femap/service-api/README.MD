BUILD API ONLY IMAGE:
docker build -t s4femap .

create bridge network to host machine (or you can use omit it if will use underpostnet) :
docker network create --driver=bridge --subnet=192.168.0.0/24 s4femap

to run container with s4femapnet:
docker run --network=s4femapnet -d -i -p 3001:8079 --rm s4femap

to view active containers:
docker container ls

stop docker container: 
docker container stop <container-alias-name>

execute command in container:
docker exec <container-alias-name> <cmd>

Swagger available
http://localhost:3001/swagger-ui.html#

There is some init database already with 3 users, bunkers and some marks:
user1/password
user2/password
user3/password
