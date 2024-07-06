

module.exports = {
    addSchool: [
        {
            model: 'name',
            required: true,
            type:"string"
        }
    ],
   updateSchool:[
    {
        model: 'id',
        required: true,
        type:"string"
    },
    {
        model: 'name',
        required: true,
        type:"string"
    }
   ]
   
}

