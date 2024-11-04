import { clientWrite } from "../client";

export const savePin = (id, alreadySaved, user) => {
    if (!user) return; // Add early return if no user

    if (!alreadySaved) {
        // update doc on sanity db
        clientWrite
            .patch(id)  // patch the post with an id
            .setIfMissing({ save: [] }) // init save to be an empty array
            .insert('after', 'save[-1]', [{ // insert a doc at the end of the array
                _key: uuidv4(),
                userId: user.sub,   // in instructors version, .googleId
                postedBy: {
                    _type: 'postedBy',
                    _ref: user.sub // in instructors version, .googleId
                }
            }])
            .commit();   // commit, returns a promise that we can use then on with whatever
    }
    return Promise.resolve(); // Return resolved promise if already saved

}


export const deletePin = (id) => {
    return clientWrite.delete(id);  // returns a promise
}