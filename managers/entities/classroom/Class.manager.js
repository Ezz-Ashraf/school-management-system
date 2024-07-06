const mongoose = require('mongoose');

module.exports = class Class {
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
      this.ClassModel = mongomodels.class;
      this.pagination = 50;
    }
  
    async create({ __longToken ,name , schoolId }) {
      if(__longToken.userRole !=='schoolAdmin')
        {
          return {msg:'unAuthorized'}
        }
        let classRoom = {name , schoolId}
        let result =await this.validators.class.createClass(classRoom)  
        if(result)
        {
          return {msg:'validation err'}
        }
      let createClass_Dto = { name , schoolId : new mongoose.Types.ObjectId(schoolId) , createdBy:new mongoose.Types.ObjectId(__longToken.userId) };
        const newClass = new this.ClassModel({ ...createClass_Dto });
  
        await newClass.save();
        return { msg: "class created" };
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
  
        const totalCount = await this.ClassModel.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);
  
        const classroom = await this.ClassModel
          .find(query)
          .skip((page - 1) * limit)
          .limit(limit)
          .sort({ createdAt: -1 });
  
        return {
          classroom,
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
        const classroom = await this.ClassModel.findOne({_id:searchId  , isDeleted:false});
        if (!classroom) throw "No class was found";
  
        return classroom;
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
        const classroom = await this.ClassModel.findById(__query.id);
        if (!classroom) throw "class not found";
  
        classroom.isDeleted = true;
        const deletedClass = await classroom.save();
        return { msg: "class deleted", deletedClass };
      } catch (errors) {
        console.error("Error: ", errors);
        if (typeof errors === "string") return { errors: errors.toString() };
        return { errors: "Delete class failed" };
      }
    }
  
  
  async updateOne({id , schoolId, name , __longToken} ) {
    if(__longToken.userRole !=='schoolAdmin')
      {
        return {msg:'unAuthorized'}
      }
      let classRoom = {name  , id, schoolId}
      let result =await this.validators.class.updateClass(classRoom)  
      if(result)
      {
        return {msg:'validation err'}
      }

    try {
      let searchId = new mongoose.Types.ObjectId(id);
      const classroom = await this.ClassModel.findById(searchId);
      if (!classroom) throw "No class was found";
      const filter = { _id: searchId };
      const update = { name };

      const newClass = await this.ClassModel.findOneAndUpdate(filter, update , {new:true})
      return newClass
  }
  catch (errors) {
    console.error("Error: ", errors);
    return { errors: errors.toString() };
  }
  }
}