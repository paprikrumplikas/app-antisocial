BACKEND

1. Contains the entire Sanity config: schemas for comments, imgs. 
@note Sanity is a Content Operating System. It helps us to create seemingly a full-stack app but a lot simpler.
SETUP:
    1.1. Sign up at https://www.sanity.io/javascriptmastery (with github)
    1.2. Intall Sanity CLI globally, command at npm create sanity@latest -- --project asv5ajhw --dataset production --template clean --typescript --output-path studio-antisocial
cd studio-antisocial
    1.3 Create first schema (@note defines what doc types and what fields in those doc types are available in the sanity studio), user.js
    1.4 Import first schema in shcemaTypes/index.ts
    1.4 run npm run dev, and in the localhost create a user and our doc is published. We basically implemented a database (in a MERN app it would take hours to do the same).
    1.5 create all the other neccessary schemas
    1.6 @crucial create client.js to connect frontend application to Sanity backend. client.js file typically contains the configuration and setup for the Sanity client, allowing your application to interact with the Sanity Content Lake, fetch data, and perform other operations.
        1.6.1 @crucial Token security is crucial when working with Sanity in a client-side application. The key principle is to minimize the potential for misuse if the token were to be exposed. 
        I did not implement a solution for this

@note @learning to start up Sanity Studio, navigate to the backend folder and run `npm run dev`




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


2. @crucial misconception about environment variables in client-side applications:
    1. Client-side environment variables are not secure: When you use environment variables in a client-side application (like a React app built with Vite), these variables are embedded into your JavaScript bundle during the build process. They are not truly hidden or secure.
    2. .env files are for build-time, not runtime: In a client-side application, .env files are used by your build tool (like Vite) to replace variables in your code at build time. The actual .env file is not included in your deployed application.
    3. @crucial Exposed in the browser: Any environment variable that starts with VITE_ (for Vite) or REACT_APP_ (for Create React App) will be included in your built JavaScript and can be viewed by anyone who inspects your application in the browser.
    4. Visible in network tab: These "environment variables" are essentially hardcoded into your JavaScript bundle, which is sent to the user's browser. Anyone can view this in the browser's developer tools.


3. <Link> vs <NavLink>
    1. Use <Link> for general navigation where you don't need active state management.
    2. Use <NavLink> for navigation items that should be styled differently when active, typically in navigation menus, sidebars, or tabs.
    3. NavLink Allows you to style the link differently when it's active (i.e., when the current URL matches the link's "to" prop).
    Provides an isActive prop to its className or style prop functions, allowing for dynamic styling.




