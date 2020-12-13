### Using Docker compose

Run command: `docker-compose up` in project directory (not in `service-api` sub-directory).

This command will start Underpost API service container in configured network.

### Using pure Docker

BUILD API ONLY IMAGE:

`docker build -t underpost .`

Create bridge network to host machine:

```
docker network create --driver=bridge --subnet=192.168.1.0/24 underpostnet
```

To run container:

```
docker run --network=underpostnet -d -i -p 3000:8078 --rm underpost
```

To view active containers:

`docker container ls`

Stop docker container: 

`docker container stop <container-alias-name>`

Execute command in container:

`docker exec <container-alias-name> <cmd>`

### Swagger

Swagger available:

http://localhost:3000/swagger-ui.html#

### Credentials

Admin credentials to get admin token to create bunkers, goods, couriers : 

`admin/password`
