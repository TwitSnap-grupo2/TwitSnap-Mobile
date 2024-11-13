import auth from "@react-native-firebase/auth";


export async function fetch_to(endpoint: string, method: string, body: any = null) {
    const token = await auth().currentUser?.getIdToken();
    const response = await fetch(endpoint, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        body: body ? JSON.stringify(body) : null,
    }
    );
    return response;
}

