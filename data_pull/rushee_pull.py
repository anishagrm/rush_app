import pandas as pd
import requests
import json
def main():

    auth_url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyANTyi2408ZpjjB2daFSck-Hwc0XhrXYmg"
    data = {
    "email": "mchanshetty3@gatech.edu",
    "password": "G@nesh@0816",
    "returnSecureToken": True
    }

    response = requests.post(auth_url, json=data)
    response_data = response.json()
    
    rushee_url = "https://us-central1-rush-app-46833.cloudfunctions.net/api/rushees"
    headers = {
        "Authorization": "Bearer " + response_data["idToken"]
    }

    response = requests.get(rushee_url, headers=headers)

    rushees = response.json()

    data = {
        "Name": [],
        "GTID #": [],
        "Email": [],
        "Phone": [],
        "Major": [],
        "Housing": []
    }

    for rushee in rushees:
        data["Name"].append(rushee["name"])
        data["GTID #"].append(rushee["gtid"])
        data["Email"].append(rushee["email"])
        data["Phone"].append(rushee["phoneNumber"])
        data["Major"].append(rushee["major"])
        data["Housing"].append(rushee["housing"])

    df = pd.DataFrame(data)
    df.to_csv("rushee_pull.csv", index=False)
main()
    