import requests
import json 
from elevation import var
from inputconverter import lat,lon
from search import finaloutput
#latitude, longitude = convertcoordinates(latitude, longitude)
url = "https://api.open-meteo.com/v1/forecast"

with open("input.json", "r") as file:
    inputdata= json.load(file)

datatosend={ # i can define the name its same like structure in c++
    #it stores  
    #inputdata["latitude"],
    #inputdata["longitude"],
    "latitude": lat,
    "longitude": lon,
    "hourly": "temperature_2m,relative_humidity_2m,precipitation,weathercode,soil_moisture_0_to_10cm",
    "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode",
    "timezone": "Asia/Kolkata",
    "forecast_days": 1
}


response = requests.get(url, params=datatosend)
serverdata= response.json()
print(response.status_code)
outputbox={
  "maxtemperature":serverdata["daily"]["temperature_2m_max"],
  "mintemperature":serverdata["daily"]["temperature_2m_min"],
   "precipitation":serverdata["daily"]["precipitation_sum"],
    "humidity":serverdata["hourly"]["relative_humidity_2m"],
   "weathercode":serverdata["daily"]["weathercode"],
  "soilmoisture":serverdata["hourly"]["soil_moisture_0_to_10cm"],
   "firstaddress":finaloutput["addressname"],
   "secondaddress":finaloutput["keyaddress"],
   "placeid":finaloutput["placeid"],


}
#for key ,value in serverdata.items():
  # print(key,":",value);
for key ,value in outputbox.items():
    print(key,":",value)
#print(serverdata["hourly"])
#print("elevation:", var)
#print("Latitude:", lat)
#print("Longitude:", lon)
#print (latitude, longitude)
