set token="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJST0xFX0FETUlOIiwiaWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJpYXQiOjE1ODUyOTgyMjcsImV4cCI6MTU4NTMwMTgyN30.PId2fYN7gM4u-6EtLefvhpn50WXid0FpsowgeguZn0Y"
set port="8078"
REM add bunkers
curl -H "Content-Type: application/json" -v -H "Authorization: Bearer %token%" -X "POST" -d "{\"name\":\"Garden\",\"positionX\":2,\"positionY\":5}" http://localhost:%port%/api/bunkers
  
curl -H "Content-Type: application/json" -v -H "Authorization: Bearer %token%" -X "POST" -d "{\"name\":\"Central\",\"positionX\":25,\"positionY\":25}" http://localhost:%port%/api/bunkers
  
curl -H "Content-Type: application/json" -v -H "Authorization: Bearer %token%" -X "POST" -d "{\"name\":\"Farpost\",\"positionX\":50,\"positionY\":48}" http://localhost:%port%/api/bunkers
  
curl -H "Content-Type: application/json" -v -H "Authorization: Bearer %token%" -X "POST" -d "{\"name\":\"Pot\",\"positionX\":30,\"positionY\":8}" http://localhost:%port%/api/bunkers
  
curl -H "Content-Type: application/json" -v -H "Authorization: Bearer %token%" -X "POST" -d "{\"name\":\"Music Hall\",\"positionX\":10,\"positionY\":41}" http://localhost:%port%/api/bunkers


REM add couriers
curl -H "Content-Type: application/json" -v -H "Authorization: Bearer %token%" -X "POST" -d "{\"comment\":\"ID123\", \"login\":\"hasky\", \"password\":\"Qswqre32erf34fg\", \"positionX\":10,\"positionY\":41}" http://localhost:%port%/api/couriers
  
curl -H "Content-Type: application/json" -v -H "Authorization: Bearer %token%" -X "POST" -d "{\"comment\":\"ID134\", \"login\":\"sbridges\", \"password\":\"Qswqre32erf34fg\", \"positionX\":30,\"positionY\":8}" http://localhost:%port%/api/couriers
  
curl -H "Content-Type: application/json" -v -H "Authorization: Bearer %token%" -X "POST" -d "{\"comment\":\"ID666\", \"login\":\"bbones\", \"password\":\"Qswqre32erf34fg\", \"positionX\":25,\"positionY\":25}" http://localhost:%port%/api/couriers


REM ask bunkers
curl -H "Authorization: Bearer %token%" -v -X "GET" http://localhost:%port%/api/bunkers

REM Add goods
curl -H "Content-Type: application/json" -v -H "Authorization: Bearer %token%" -X "POST" -d "{\"description\": \"Very taste beer\", \"image\": \"beer.png\", \"name\": \"Tempo Beer\", \"producingPlaceId\": \"Central\", \"requirements\": [\"don't shake\"],\"weight\": 3}" http://localhost:%port%/api/goods
curl -H "Content-Type: application/json" -v -H "Authorization: Bearer %token%" -X "POST" -d "{\"description\": \"Keep your time!\", \"image\": \"vodka.png\", \"name\": \"Head Shot\", \"producingPlaceId\": \"Central\", \"requirements\": [\"keep cool\", \"fragile\"],\"weight\": 0.5}" http://localhost:%port%/api/goods

curl -H "Content-Type: application/json" -v -H "Authorization: Bearer %token%" -X "POST" -d "{\"description\": \"Pods bread \", \"image\": \"bread.png\", \"name\": \"Bread\", \"producingPlaceId\": \"Pot\", \"requirements\": [\"don't wet\"],\"weight\": 1}" http://localhost:%port%/api/goods
curl -H "Content-Type: application/json" -v -H "Authorization: Bearer %token%" -X "POST" -d "{\"description\": \"Croissants with chocolate\", \"image\": \"croissants.png\", \"name\": \"Croissants\", \"producingPlaceId\": \"Pot\", \"requirements\": [\"don't wet\"],\"weight\": 0.5}" http://localhost:%port%/api/goods


curl -H "Content-Type: application/json" -v -H "Authorization: Bearer %token%" -X "POST" -d "{\"description\": \"The best potato \", \"image\": \"potato.png\", \"name\": \"Potato\", \"producingPlaceId\": \"Garden\", \"requirements\": [],\"weight\": 10}" http://localhost:%port%/api/goods
curl -H "Content-Type: application/json" -v -H "Authorization: Bearer %token%" -X "POST" -d "{\"description\": \"Present the happiness!\", \"image\": \"flowers.png\", \"name\": \"Roses\", \"producingPlaceId\": \"Garden\", \"requirements\": [\"don't drop\"],\"weight\": 1.5}" http://localhost:%port%/api/goods


