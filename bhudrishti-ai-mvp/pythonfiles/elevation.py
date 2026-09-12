import json
import requests

url = "https://api.open-meteo.com/v1/elevation"
with open("input.json", "r") as file:
    elevationdata= json.load(file)
serverrequest = {
    "latitude": elevationdata["latitude"],
    "longitude": elevationdata["longitude"]
}

response = requests.get(url, params=serverrequest)

elevationdata = response.json()

#print(elevationdata.keys())
elevationoutput = {
    "elevation": elevationdata["elevation"]
}
var = elevationoutput["elevation"]
#for key, value in elevationoutput.items():
   # print(key, ":", value)
     #print(var)