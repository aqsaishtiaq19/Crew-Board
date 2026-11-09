const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 }, // store the bcrypt hash only
  role: { type: String, enum: ['admin', 'manager', 'employee'], default: 'employee' },
  position: String,
  salary: { type: Number, min: 0 },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })