const bcrypt = require("bcrypt");

module.exports = class User { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.UserModel           = mongomodels.user;
        this.tokenManager        = managers.token;
        this.usersCollection     = "users";
        this.endpoint         = "user";
        this.httpExposed         = ['createUser' , 'login'];
    }

    async createUser({username, mobileNumber, email, password , role}){
        const user = {username, mobileNumber,  email, password , role};

        let result = await this.validators.user.createUser(user);
        if(!result){
          
        let existedUser =await this.UserModel.findOne({ email });
        if (existedUser)
        {
           throw "existed email";
        }
          const hashedPassword = bcrypt.hashSync(password, 10);
          user.password = hashedPassword;
              const gotUser = new this.UserModel({ ...user });
        
              await gotUser.save();
              let longToken       = this.tokenManager.genLongToken({
                userId: gotUser._id,
                userRole:gotUser.role
              });
              return { msg: "User created"  , longToken};
        } 
     
     
        return {
            err: 'user has not been created succeessfully'
        };
    }

    async login({
        email,
        password,
      }) {
        let user = { email , password}
        let result = await this.validators.user.login(user);
        if(result)
        {
          return 'validation err'
        }
              const gotUser = await this.UserModel.findOne({ email });
              if (!gotUser) throw "Incorrect email";
              if (!bcrypt.compareSync(password.toString(), gotUser.password))
                throw "Incorrect password";
              
              const token = this.tokenManager.genLongToken({
                userId: gotUser._id,
                userRole:gotUser.role
              });
        
              return {
                userToken: token,
                username : gotUser.userName
              }
        }

      

}
