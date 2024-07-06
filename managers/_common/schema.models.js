const emojis = require('../../public/emojis.data.json');

module.exports = {
    id: {
        path: "id",
        label:"id",
        type: "string",
        length: { min: 1, max: 50 },
    },
    username: {
        path: 'username',
        label:"username",
        type: 'string',
        length: {min: 3, max: 20},
        custom: 'username',
    },
    mobileNumber:{
        path:"mobileNumber",
        label:"mobileNumber",
        type:"string"
    },
    role:{
        path:"role",
        label:"role",
        type:"string"
    },
    password: {
        path: 'password',
        label:'password',
        type: 'string',
        length: {min: 3, max: 100},
    },
    email: {
        path: 'email',
        label: 'email',
        type: 'string',
    },
    schoolId: {
        path: 'schoolId',
        label: 'schoolId',
        type: 'string',
    },
    name: {
        path: 'name',
        label: 'name',
        type: 'string',
        length: {min: 3, max: 300}
    }
}