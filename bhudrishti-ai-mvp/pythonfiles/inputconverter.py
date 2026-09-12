location = input("Paste coordinates: ")
# Find where N/S and E/W are
location = location.upper()

if "N" in location:
    firstpart, secondpart = location.split("N")
    lat = float(firstpart)
elif "S" in location:
    firstpart, secondpart = location.split("S")
    lat = -float(firstpart)
    if "E" in secondpart:
     lon = float(secondpart.replace("E", ""))
    elif "W" in secondpart:
     lon = -float(secondpart.replace("W", ""))
    
if ","in location:
    lat, lon = location.split(",")
    lat = float(lat)
    lon = float(lon)
    print()

#print("Latitude:", lat)
#print("Longitude:", lon)