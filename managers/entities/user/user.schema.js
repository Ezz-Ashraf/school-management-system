

module.exports = {
    createUser: [
        {
            model: 'username',
            required: true,
            type:"string"
        },
        {
            model: 'email',
            required: true,
            type:"string"
        },
        {
            model: 'mobileNumber',
            required: true,
            type:"string"
        },
        {
            model: 'password',
            required: true,
            type:"string"
        },
        {
            model: 'role',
            required: true,
            type:"string",
            enum:["superAdmin", "schoolAdmin"]
        }
    ],
   login:[
    {
        model:"email",
        type:"string",
        required:true
    },
    {
        model:"password",
        type:"string",
        required:true
    }
   ]
   
}

