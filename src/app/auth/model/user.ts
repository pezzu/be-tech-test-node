import { Schema, model, Document, Model } from "mongoose";
import { hashSync, compareSync } from "bcrypt";
import { IUser } from "../../../interfaces/user";

export interface UserDocument extends IUser, Document {
  passwordMatches(password: string): boolean;
}

export interface UserModel extends Model<UserDocument> {
  findOneAndValidate(user: IUser): Promise<UserDocument>;
}

declare module "mongoose" {
  interface Schema<DocType extends Document = Document, M extends Model<DocType, any> = Model<any, any>, SchemaDefinitionType = undefined> {
    pre<T extends Model<DocType> = M>(method: 'insertMany' | RegExp, fn: (this: T, next: (err: CallbackError) => void, docs:any[]) => void): this;
  }
}

const UserSchema: Schema = new Schema<UserDocument, UserModel>({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});


function hashPassword(password: string): string {
  return hashSync(password, 10);
}

UserSchema.pre<UserDocument>("save", function (next) {
  if (this.isModified("password")) {
    this.password = hashPassword(this.password);
  }
  next(null);
});


UserSchema.pre("insertMany", function (this, next, docs) {
  docs.forEach((user) => {
    user.password = hashPassword(user.password);
  });
  next(null);
});

UserSchema.methods.passwordMatches = function (this: UserDocument, password: string): boolean {
  return compareSync(password, this.password);
};

UserSchema.statics.findOneAndValidate = async function (this: UserModel, user: IUser) {
  const dbUser = await this.findOne({ name: user.name }).exec();
  if (!dbUser) return null;

  const isPasswordOk = await dbUser.passwordMatches(user.password);
  if (!isPasswordOk) return null;

  return dbUser;
};

export const User: UserModel = model<UserDocument, UserModel>("users", UserSchema);
