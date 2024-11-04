// @crucial @learning file for our Sanity client side

// @note used to be SanityClient instead of createClient, but the latter is more modern and flexible, the recommended way
import { createClient } from "@sanity/client";
import createImageUrlBuilder from '@sanity/image-url';

// @note client for write operations
export const clientWrite = createClient({
    projectId: import.meta.env.VITE_APP_SANITY_PROJECT_ID,  // @note run 'npx sanity manage' to get this
    dataset: "production",
    apiVersion: "2024-10-07",
    useCdn: false,   // to show imgs more quickly to ppl around the world
    /** @crucial using tokens in a browser is a bad idea https://www.sanity.io/help/js-client-browser-token
    This exposing write tokens in frontend code is still a security risk. For a production environment, consider implementing a backend service or serverless functions to handle write operations securely.     */
    token: import.meta.env.VITE_APP_SANITY_API_TOKEN, // @note run 'npx sanity manage', then go to APIs->tokens to create one
    withCredentials: true  // @custom to avoid CORS error when saving a pin. Only needed for write ops
});

// @note client for read ops
export const clientRead = createClient({
    projectId: import.meta.env.VITE_APP_SANITY_PROJECT_ID,  // @note run 'npx sanity manage' to get this
    dataset: "production",
    apiVersion: "2024-10-07",
    useCdn: false   // @custom Disable CDN caching: otherwise after pinning a pin of Feed, Pin button stay active
});

// clientRead, as img ops are typically read-only
const builder = createImageUrlBuilder(clientRead);

// more info on this in Sanity docs
export const urlFor = (source) => builder.image(source);