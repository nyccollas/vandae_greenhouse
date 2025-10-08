from lib import FireKeeper

url : str = "https://greengarden-fd823-default-rtdb.firebaseio.com"
fireKeeper = FireKeeper(url, "Vandae/Sensores", "http://localhost:8080/sensors", 1)

fireKeeper.AddListener("umidade")
fireKeeper.AddListener("temperatura")
fireKeeper.AddListener("agua")

while True:
    fireKeeper.ListenAll()