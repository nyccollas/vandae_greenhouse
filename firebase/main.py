from lib import FireKeeper

url : str = "https://greengarden-fd823-default-rtdb.firebaseio.com"
fireKeeper = FireKeeper(url, "Vandae/Sensores", "http://localhost:8080/ENDPOINT")

fireKeeper.AddListener("umidade")
fireKeeper.AddListener("temperatura")

while True:
    fireKeeper.ListenOnChange()