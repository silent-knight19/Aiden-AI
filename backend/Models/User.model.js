import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 5
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        select: false
    }
});


UserSchema.statics.hashPassword = async function(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};
UserSchema.statics.comparePassword = async function(password, hash) {
    return await bcrypt.compare(password, hash);
};
UserSchema.methods.generateJWToken = function() {
    return jwt.sign({ email: this.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export default User;

 const User = mongoose.model('User', UserSchema);