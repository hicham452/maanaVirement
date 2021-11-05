const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true,
    minlength:3,
    maxlength: 255
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024
  },
  
  email: {
    type: String,
    unique: true,
  }
 

});


// fire a function before doc saved to db
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async function (username, password) {
  const user = await this.findOne({
    username
  });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('utilisateur ou mot de pass incorrect');
  }
  throw Error('utilisateur ou mot de pass incorrect');
};

const User = mongoose.model("User", userSchema);


module.exports = {

  User: User
}