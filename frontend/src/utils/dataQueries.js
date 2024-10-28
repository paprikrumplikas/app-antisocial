// to fetch sanity data

export const userQuery = (userId) => {
    // try to get me a doc of type == user and id == userId
    const query = `*[_type == "user" && _id== "${userId}"]`;

    return query;
}

// @note @learning @crucial Sanity uses GROQ language for querying. Similar to grafGQ
/**
 * 1. starting "*" represents every doc in the dataset
 * 2. we need only pins back
 * 3. we want to search in the Category, the Title, and About
 * 4. '${searchTerm}*' this * ensures we start searching before user finishes typing the term @learning
 * 5. then in {} we specify what data we want to get back
 */
export const searchQuery = (searchTerm) => {
    const query = `*[_type == "pin && title match '${searchTerm}*' || category match '${searchTerm}*' || about match '${searchTerm}*'] { 
        image {
            asset -> {
                url
            }
        },
        _id,
        destination,
        postedBy -> {
            _id,
            userName,
            image
        },
        save[] {    
            _key, 
            postedBy -> {
                _id,
                userName,
                image
            },
        },
    }`;

    return query;
}



export const feedQuery = `*[_type == "pin"] | order(_createdAt desc) {
  image {
            asset -> {
                url
            }
        },
        _id,
        destination,
        postedBy -> {
            _id,
            userName,
            image
        },
        save[] {    
            _key, 
            postedBy -> {
                _id,
                userName,
                image
            },
        },
}`