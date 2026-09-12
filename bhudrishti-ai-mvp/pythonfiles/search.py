import requests
from pythonfiles.inputconverter import lat, lon

url = "https://nominatim.openstreetmap.org/reverse"

requesttoserver = {
    "lat": lat,
    "lon": lon,
    "format": "jsonv2",
    "addressdetails": 1
}

headers = {
    "User-Agent": "LandResearchAI/1.0 "
}

response = requests.get(url, params=requesttoserver, headers=headers)

data = response.json()
finaloutput={
    "addressname": data["display_name"],
     "keyaddress": data["address"],
     "placeid": data["place_id"]

}






#print("Location:")
#print(data["display_name"])

#print("\nAddress details:")
#print(data.get("address", {}))
#print(data.keys())
#print("address :" + str(data["address"]))
#print(data["place_id"])