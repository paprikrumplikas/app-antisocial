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


4.   @learning @crucial StrictMode is a tool provided by React for highlighting potential problems in an application. It's a wrapper component that doesn't render any visible UI but activates additional checks and warnings for its descendants

5.  // @learning The scrollRef allows you to manipulate the scroll position of this main content area programmatically. 
    // For example, you could use it to scroll to specific elements,

6. /** @syntax @learning user={user && user} syntax:
        common JavaScript pattern used for conditional rendering. It's a shorthand way of saying "if user exists and is truthy, pass user as the prop value; otherwise, pass false"*/

7.  const alreadySaved = !!(save?.filter((item) => item.postedBy._id === user.googleId)).length;
    /**
     * @learning @syntax
     * e.g. 
     * user id 1, array of ppl who saved -> returns [1]. But this is not a bool as the name suggest ->
     * [1].length -> 1. But it is not really a bool yet. !1 = false -> !false = true. So !!1 = true
     * e.g. 
     * user id 4, array of ppl who saved -> returns []. Then [].length = 0. Then !!0 = false.
     */

8.      {/** @learning catch-all route to handle nested routes within a layout component. I.e. more routes in Home */}
        {/** The * is a wildcard character that matches any path that hasn't been matched by other routes */}
        {/** Each /* passes unmatched routes down to the next level of routing. */}

9.  // @crucial @learning NavLink automatically provides the isActive bool

10. most popular lib for creating unique ids
import { v4 as uuidv4 } from "uuid";

11.             {/** @learning sets behavior on hover, remove hover, click */}
            <div
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => setPostHovered(false)}
                onClick={() => navigate(`/pin-details/${_id}`)}
                className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
            >



12. @bug fix:
Issue:
Very weird architectural choice that at one place the user object is from loaclStorage, in the other it is from Sanity and, hence, they look different. Is there any benefit of getting the user from Sanity instead of localstorag? At one place, i wrote the following benefits, are they true at all?
If they are true, should not we be getting the user from sanity in all places, making user from localstorgae irrelevant? Or do we need the user from localStorage to know which user is logged in? What is the best solution to deal with this deiscrapncy

Proposed fix (not implemented with merge)
Excellent analysis! Let's break this down:
Current Architecture
localStorage user:
Contains Google OAuth data (sub, etc.)
Used for authentication/identification
Immediately available
Could be manipulated client-side
Sanity user:
Contains profile data (_id, etc.)
Used for displaying user info and relationships
Requires API call
More secure/reliable data
The Benefits Are Real
The benefits you listed are valid:
Up-to-date data: Sanity data is always current
Data consistency: All users see the same data
3. Security: Can't be manipulated client-side
Best Solution
Here's how to resolve this architectural discrepancy:
Home.jsx
Then update PinDetails.jsx to work with either _id or sub:
PinDetails.jsx
Why Keep Both?
1. localStorage user:
Required for authentication
Immediate access without API calls
Contains OAuth-specific data
Sanity user:
Required for social features
Contains additional profile data
Ensures data consistency
The best approach is to:
Use localStorage for authentication
Use Sanity for user data/relationships
Merge them when needed (as shown above)
Be consistent about which ID you use where
This gives you both security and performance while maintaining data consistency.


13. @crucial @bug fix:
Bug: 404 error on deployed app when reloading pages except for home.
Reason: The problem occurs because your server is not configured to handle client-side routes properly when users directly access URLs or refresh the page.
Fix (for Vite, Hostinger (apache))

For a Vite app deployed on Hostinger, you'll need to add a rewrite rule in your .htaccess file since Hostinger uses Apache. Here's how to fix it:
First, create a .htaccess file in your project's public directory (create the directory if it doesn't exist):
.htaccess
Update your vite.config.js to ensure the .htaccess file gets copied to your build directory:
vite.config.js
Apply to vite.config.js
After making these changes:
Rebuild your project (npm run build)
Upload the entire contents of your dist directory to Hostinger

