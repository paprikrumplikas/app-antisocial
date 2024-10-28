export default {
    name: "pin",
    title: "Pin",
    type: "document",
    fields: [
        {
            name: "title",
            title: "Title",
            type: "string",
        },
        {
            name: "about",
            title: "About",
            type: "string",
        },
        {
            name: "destination",
            title: "Destination",
            type: "url",
        },
        {
            name: "category",
            title: "Category",
            type: "string",
        },
        {
            name: "image",
            title: "Image",
            type: "image",
            options: {
                hotspot: true, // @note prop for options object, which allows to responsively adjust the image ratios at display time
            },
        },
        {
            name: "userId",
            title: "UserID",
            type: "string",
        },
        {
            name: "postedBy",
            title: "PostedBy",
            type: "postedBy",   // @note sanity knows that this is a reference to another doc type
        },
        {
            name: "save",   // array of ppl who saved the post
            title: "Save",
            type: "array",
            of: [{ type: "save" }], // array of type save
        },
        {
            name: "comments",
            title: "Comments",
            type: "array",
            of: [{ type: "comment" }], // array of type comment
        },
    ]
}