

module.exports = {
    createClass: [
        {
            model: 'name',
            required: true,
            type:"string"
        },
        {
            model:"schoolId",
            required:true,
            type:"string"
        }
    ],
    updateClass :[
        {
            model: 'name',
            required: true,
            type:"string"
        },
        {
            model:"schoolId",
            required:true,
            type:"string"
        },
        {
            model:'id',
            required:true,
            type:"string"
        }  
    ]
   
   
}

