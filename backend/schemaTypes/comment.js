export default {
    name: "comment",
    title: "Comment",
    type: "document",
    fields: [
        {
            name: "postedBy",
            title: "PostedBy",
            type: "postedBy",   // @note sanity knows that this is a reference to another doc type
        },
        {
            name: "comment",
            title: "Comment",
            type: "string",
        }
    ]
}

