import { Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new Schema(
    {
        name: { type: String, required: [true, 'A User must have a Name'], trim: true },
        image: {
            type: String
        },
        email: {
            type: String,
            required: [true, 'A User must have a Profile Image'],
            trim: true,
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please Provide a valid email']
        },
        password: {
            type: String,
            required: [true, 'Please Provide a password'],
            minlength: 8,
            maxLength: 16,
            select: false
        },
        role: {
            type: String,
            enum: ['Super-Admin', 'User'],
            default: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updatedAt: {
            type: Date,
            default: Date.now()
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date
    },
    { versionKey: false }
);

userSchema.pre('save', async function (next) {
    // It will run only if the password was changed
    if (!this.isModified('password')) return next();

    //Hashing the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    this.updatedAt = Date.now();
    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = new model('User', userSchema);

export default User;
