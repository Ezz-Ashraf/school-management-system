

module.exports = {
    addStudent: [
        {
            model: 'name',
            required: true,
            type:"string"
        },
        {
            model: 'classId',
            required: true,
            type:"string"
        },
        {
            model: 'age',
            required: true,
            type:"number"
        }
    ],
   updateStudent:[
    {
        model: 'id',
        required: true,
        type:"string"
    },
    {
        model: 'name',
        required: true,
        type:"string"
    },
    {
        model: 'classId',
        required: true,
        type:"string"
    },
    {
        model: 'age',
        required: true,
        type:"number"
    }
   ]
   
}

