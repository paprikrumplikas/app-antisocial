//import jwt_decode from "jwt-decode";
import { clientWrite } from "../src/container_ie_pages/client";


export const createOrGetUser = async (response, navigate) => {
    const { access_token } = response;

    try {
        // @crucial uses the access token to fetch the user's information from Google's userinfo endpoint. This is done using the fetch API
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        const userData = await userInfoResponse.json();
        const { name, picture, sub } = userData;

        // we want to create a new Sanity doc for the user
        const doc = {
            _id: sub,   // used for sanity to know which doc we are creating
            _type: "user", // used for sanity to know which doc we are creating
            userName: name,
            image: picture
        }

        // using client.createIfNotExists requires use a token in the browser, which is generally a bad idea  https://www.sanity.io/help/js-client-browser-token
        // but it is ok
        // @crucial The direct method of using client.createIfNotExists in the browser is indeed problematic because:
        // It would require exposing a Sanity write token in your client-side code, which is a significant security risk.
        // Anyone could potentially extract this token from your JavaScript and use it to manipulate your Sanity dataset.
        // Instead, the recommended approach is to use a backend API endpoint. This method is safer because:

        clientWrite.createIfNotExists(doc)
            .then(() =>
                navigate("/",))




        // await axios.post("htttp://localhost:5173/api/auth", user)


        // If successful, navigate and store user data
        navigate("/");

        // Store user data in local storage or state management solution
        localStorage.setItem('user', JSON.stringify(userData));

        return userData;
    } catch (error) {
        console.error('Error in createOrGetUser:', error);
        throw error;
    }
};