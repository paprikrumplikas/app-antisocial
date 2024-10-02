export default {
    name: "save",
    title: "Save",
    type: "document",
    fields: [
        {
            name: "postedBy",
            title: "PostedBy",
            type: "postedBy",   // @note sanity knows that this is a reference to another doc type
        },
        {
            name: "userId", // user who saved the pin
            title: "UserId",
            type: "string",
        }
    ]
}

