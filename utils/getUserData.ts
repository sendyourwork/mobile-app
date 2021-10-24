import { BACKEND_URL } from "../config";

export default function getUserData(token: string) {
    return fetch(BACKEND_URL + "/user", {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    })
    .then(response => response.json())
}