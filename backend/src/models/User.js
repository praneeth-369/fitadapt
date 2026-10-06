import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    height: {
      type: Number,
      required: [true, 'Height in cm is required'],
      min: 50,
      max: 300,
    },
    weight: {
      type: Number,
      required: [true, 'Weight in kg is required'],
      min: 20,
      max: 500,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: 10,
      max: 120,
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: ['male', 'female', 'non-binary', 'other', 'prefer_not_to_say'],
      default: 'prefer_not_to_say',
    },
    primaryGoal: {
      type: String,
      required: [true, 'Primary fitness goal is required'],
      enum: [
        'fat_loss',
        'muscle_gain',
        'endurance',
        'strength',
        'flexibility',
        'athletic_performance',
        'general_health',
      ],
      default: 'general_health',
    },
    fitnessLevel: {
      type: String,
      required: [true, 'Fitness level is required'],
      enum: ['beginner', 'intermediate', 'advanced', 'athlete'],
      default: 'beginner',
    },
    availableEquipment: {
      type: [String],
      required: [true, 'Available equipment is required'],
      default: ['bodyweight'],
    },
    pastInjuries: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Transform output to remove password
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = mongoose.model('User', userSchema);

// In-Memory Fallback Store (Used if MongoDB daemon is not running on localhost)
const inMemoryUsers = new Map();

// Pre-seed demo user with bcrypt hashed password
const seedDemoUser = async () => {
  const hashedPassword = await bcrypt.hash('cyberpass123', 10);
  const demoUser = {
    _id: '66fa89c0e2a34b001a123456',
    email: 'cyberathlete@fitadapt.ai',
    password: hashedPassword,
    height: 178,
    weight: 75,
    age: 26,
    gender: 'male',
    primaryGoal: 'muscle_gain',
    fitnessLevel: 'intermediate',
    availableEquipment: ['bodyweight', 'dumbbells', 'resistance_bands'],
    pastInjuries: ['sensitive_knees', 'lower_back_tightness'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comparePassword: async function (candidate) {
      return bcrypt.compare(candidate, this.password);
    },
    toJSON: function () {
      const copy = { ...this };
      delete copy.password;
      return copy;
    },
  };
  inMemoryUsers.set(demoUser.email, demoUser);
};
seedDemoUser();

export const UserService = {
  async findByEmail(email) {
    if (mongoose.connection.readyState === 1) {
      return User.findOne({ email });
    }
    return inMemoryUsers.get(email.toLowerCase()) || null;
  },

  async findById(id) {
    if (mongoose.connection.readyState === 1) {
      return User.findById(id).select('-password');
    }
    for (const u of inMemoryUsers.values()) {
      if (u._id.toString() === id.toString()) {
        const copy = { ...u };
        delete copy.password;
        return copy;
      }
    }
    return null;
  },

  async create(userData) {
    if (mongoose.connection.readyState === 1) {
      return User.create(userData);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const id = new mongoose.Types.ObjectId().toString();
    const newUser = {
      _id: id,
      ...userData,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comparePassword: async function (candidate) {
        return bcrypt.compare(candidate, this.password);
      },
      toJSON: function () {
        const copy = { ...this };
        delete copy.password;
        return copy;
      },
    };
    inMemoryUsers.set(newUser.email, newUser);
    return newUser;
  },

  async updateById(id, fields) {
    if (mongoose.connection.readyState === 1) {
      return User.findByIdAndUpdate(id, { $set: fields }, { new: true, runValidators: true }).select('-password');
    }
    for (const [key, user] of inMemoryUsers.entries()) {
      if (user._id.toString() === id.toString()) {
        const updated = {
          ...user,
          ...fields,
          updatedAt: new Date().toISOString(),
        };
        inMemoryUsers.set(key, updated);
        const copy = { ...updated };
        delete copy.password;
        return copy;
      }
    }
    return null;
  },
};
