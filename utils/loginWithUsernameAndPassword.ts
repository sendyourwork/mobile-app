import { BACKEND_URL } from "../config";

export default function loginWithNameAndPassword(username: string, password: string) {
    return fetch(BACKEND_URL + "/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username, password}),
    })
    .then(response => response.json())
}