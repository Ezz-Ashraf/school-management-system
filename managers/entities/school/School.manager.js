const mongoose = require('mongoose');

module.exports = class School {
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
      this.SchoolModel = mongomodels.school;
      this.pagination = 50;
    }
  
    async create({ __longToken ,name }) {
      if(__longToken.userRole !=='superAdmin')
        {
          return {msg:'unAuthorized'}
        }
        let school = { name }
        let result = await this.validators.school.addSchool(school);
        if(result)
        {
          return 'validation err'
        }
      let createSchool_Dto = { name , createdBy:new mongoose.Types.ObjectId(__longToken.userId) };
        const newSchool = new this.SchoolModel({ ...createSchool_Dto  });
  
        await newSchool.save();
        return { msg: "school created" };
    }
  
    async find({ __longToken ,  __query }) {
      if(__longToken.userRole !=='superAdmin')
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
  
        const totalCount = await this.SchoolModel.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);
  
        const schools = await this.SchoolModel
          .find(query)
          .skip((page - 1) * limit)
          .limit(limit)
          .sort({ createdAt: -1 });
  
        return {
          schools,
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
      if(__longToken.userRole !=='superAdmin')
      {
        return {msg:'unAuthorized'}
      }
      try {
        let searchId = new mongoose.Types.ObjectId(id);
        const school = await this.SchoolModel.findOne({_id:searchId  , isDeleted:false});
        if (!school) throw "No school was found";
  
        return school;
      } catch (errors) {
        console.error("Error: ", errors);
        return { errors: errors.toString() };
      }
    }
  
    async deleteOne({ __longToken, __query }) {
      if(__longToken.userRole !=='superAdmin')
        {
          return {msg:'unAuthorized'}
        }
  
      try {
        const school = await this.SchoolModel.findById(__query.id);
        if (!school) throw "school not found";
  
        school.isDeleted = true;
        const deletedSchool = await school.save();
        return { msg: "school deleted", deletedSchool };
      } catch (errors) {
        console.error("Error: ", errors);
        if (typeof errors === "string") return { errors: errors.toString() };
        return { errors: "Delete school failed" };
      }
    }
  
  
  async updateOne({id , name , __longToken} ) {
    if(__longToken.userRole !=='superAdmin')
      {
        return {msg:'unAuthorized'}
      }
      let school = { name , id }
      let result = await this.validators.school.updateSchool(school);
      if(result)
      {
        return 'validation err'
      }
    try {
      let searchId = new mongoose.Types.ObjectId(id);
      const school = await this.SchoolModel.findById(searchId);
      if (!school) throw "No class was found";
      const filter = { _id: searchId };
      const update = { name };

      const newSchool = await this.SchoolModel.findOneAndUpdate(filter, update , {new:true})
      return newSchool
  }
  catch (errors) {
    console.error("Error: ", errors);
    return { errors: errors.toString() };
  }
  }
}