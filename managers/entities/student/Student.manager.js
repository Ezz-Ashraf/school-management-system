const mongoose = require('mongoose');

module.exports = class Student {
  constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
      this.config = config;
      this.validators = validators;
      this.utils = utils;
      this.httpExposed = [
        "get=find",
        "get=findOne",
        "post=create",
        "put=updateOne",
        "delete=deleteOne",
      ];
      this.tokenManager = managers.token;
      this.StudentModel = mongomodels.student;
      this.pagination = 50;
    }
  
    async create({ __longToken ,name , age , classId }) {
      if(__longToken.userRole !=='schoolAdmin')
        {
          return {msg:'unAuthorized'}
        }
        let student = {name , age , classId}
      let result =await this.validators.student.addStudent(student)  
      if(result)
      {
        return {msg:'validation err'}
      }
      let createStudent_Dto = { name , age  , classId: new mongoose.Types.ObjectId(classId), createdBy:new mongoose.Types.ObjectId(__longToken.userId) };
      
      const newStudent = new this.StudentModel({ ...createStudent_Dto });
  
        await newStudent.save();
        return { msg: "student created" };
    }
  
    async find({ __longToken ,  __query }) {
      if(__longToken.userRole !=='schoolAdmin')
        {
          return {msg:'unAuthorized'}
        }
      const { page = 1, limit = 10, search = "" } = __query;
      try {
        const query = {
          isDeleted: false,
        };
  
        if (search) {
          query.name = { $regex: search, $options: "i" };
          query.isDeleted=false
        }
  
        const totalCount = await this.StudentModel.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);
  
        const students = await this.StudentModel
          .find(query)
          .skip((page - 1) * limit)
          .limit(limit)
          .sort({ createdAt: -1 });
  
        return {
          students,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount,
          },
        };
      } catch (errors) {
        console.error("Error: ", errors);
        if (typeof errors === "string") return { errors: errors.toString() };
        return { errors: errors.toString() };
      }
    }
  
    async findOne({ __longToken,__query }) {
      const { id } = __query;
      if(__longToken.userRole !=='schoolAdmin')
      {
        return {msg:'unAuthorized'}
      }
      try {
        let searchId = new mongoose.Types.ObjectId(id);
        const student = await this.StudentModel.aggregate([
          {
            '$match': {
              '_id': searchId
            }
          }, {
            '$lookup': {
              'from': 'classes', 
              'localField': 'classId', 
              'foreignField': '_id', 
              'as': 'class'
            }
          }, {
            '$lookup': {
              'from': 'users', 
              'localField': 'createdBy', 
              'foreignField': '_id', 
              'as': 'userAdmin'
            }
          }, {
            '$unwind': {
              'path': '$class'
            }
          }, {
            '$lookup': {
              'from': 'schools', 
              'localField': 'class.schoolId', 
              'foreignField': '_id', 
              'as': 'school'
            }
          }, {
            '$unwind': {
              'path': '$school'
            }
          }, {
            '$unwind': {
              'path': '$userAdmin'
            }
          }, {
            '$project': {
              '_id': 1, 
              'name': 1, 
              'age': 1, 
              'class': 1, 
              'userAdminName': '$userAdmin.username', 
              'school': 1
            }
          }
        ])//findOne({_id:searchId  , isDeleted:false});
        if (!student) throw "No student was found";
  
        return student;
      } catch (errors) {
        console.error("Error: ", errors);
        return { errors: errors.toString() };
      }
    }
  
    async deleteOne({ __longToken, __query }) {
      if(__longToken.userRole !=='schoolAdmin')
        {
          return {msg:'unAuthorized'}
        }
  
      try {
        const student = await this.StudentModel.findById(__query.id);
        if (!student) throw "student not found";
  
        student.isDeleted = true;
        const deletedStudent = await student.save();
        return { msg: "student deleted", deletedStudent };
      } catch (errors) {
        console.error("Error: ", errors);
        if (typeof errors === "string") return { errors: errors.toString() };
        return { errors: "Delete student failed" };
      }
    }
  
  
  async updateOne({id , name , age ,classId , __longToken} ) {
    if(__longToken.userRole !=='schoolAdmin')
      {
        return {msg:'unAuthorized'}
      }
      let student = {name , age , classId , id}
      let result =await this.validators.student.updateStudent(student)  
      if(result)
      {
        return {msg:'validation err'}
      }
    try {
      let searchId = new mongoose.Types.ObjectId(id);
      const student = await this.StudentModel.findById(searchId);
      if (!student) throw "No class was found";
      const filter = { _id: searchId };
      const update = { name , age , classId };

      const newStudent = await this.StudentModel.findOneAndUpdate(filter, update , {new:true})
      return newStudent
  }
  catch (errors) {
    console.error("Error: ", errors);
    return { errors: errors.toString() };
  }
  }
}