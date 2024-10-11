// to fetch sanity data

export const userQuery = (userId) => {
    // try to get me a doc of type == user and id == userId
    const query = `*[_type == "user" && _id== "${userId}"]`;

    return query;
}