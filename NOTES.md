BACKEND

1. Containts the entire Sanity config: schemas for comments, imgs. 
@note Sanity is a Content Operating System. It helps us to create seemingly a full-stack app but a lot simpler.
SETUP:
    1.1. Sing up at https://www.sanity.io/javascriptmastery (with github)
    1.2. Intall Sanity CLI globally, command at npm create sanity@latest -- --project asv5ajhw --dataset production --template clean --typescript --output-path studio-antisocial
cd studio-antisocial
    1.3 Create first schema (@note defines what doc types and what fields in those doc types are available in the sanity studio), user.js
    1.4 Import first schema in shcemaTypes/index.ts
    1.4 run npm run dev, and in the localhost create a user and our doc is published. We basically implemented a database (in a MERN app it would take hours to do the same).
    1.5 create all the other neccessary schemas





FRONTEND

1. Follow https://tailwindcss.com/docs/guides/vite to init react app and setup tailwind
2. Install all other dependencies
    ` npm install @sanity/client @sanity/image-url react-icons react-loader-spinner react-masonry-css react-router-dom uuid --legacy-peer-deps `
            @sanity/client: JavaScript client for querying Sanity's headless CMS API.
            @sanity/image-url: Utility for building responsive image URLs from Sanity's image assets.
            react-icons: Collection of popular icons as React components.
            react-loader-spinner: React component to display customizable loading spinners.
            react-masonry-css: Lightweight, responsive grid layout library similar to Masonry.js, but for React.
            react-router-dom: Essential library for managing navigation and routes in React apps.
            uuid: Library for generating universally unique identifiers (UUIDs).
3. Install further deps
    `npm install @react-oauth/google jwt-decode`
            @react-oauth/google: the package replacing the deprecated react-google-login
            jwt-decode: google identity servs allow you to log in, but not to get the pforfile pic or username, now we have to decode the json web token that we can get back from the login


LEARNINGS: 

1. Google identity services / autehentication: https://youtu.be/XxXyfkrP298?t=3046
    1. Install @react-oauth/google
    2. Import `{ GoogleOAuthProvider } from "@react-oath/google";` in App.jsx
    3. Wrap the app with it
    4. Specify the clientId that we got from Google Cloud
    5. `import { GoogleLogin, googleLogout } from '@react-oauth/google';` to Login.jsx


2. 