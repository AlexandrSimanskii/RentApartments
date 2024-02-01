import bcrypt from "bcrypt";
import User from "../models/user.models.js";
import { errorHandler } from "../utils/error.js";
export const test = (req, res) => {
  res.send("Hello of API");
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(403, "Вы можете обновить только свой аккаунт!"));

  try {
    if (req.body.password) {
      req.body.password === (await bcrypt.hashSync(req.body.password, 10));
    }
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updateUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
