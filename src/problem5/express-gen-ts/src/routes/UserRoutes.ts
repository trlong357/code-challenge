import { isEmail, isNumber, isOptionalString, isString } from "jet-validators";
import { transform } from "jet-validators/utils";

import HttpStatusCodes from "@src/common/HttpStatusCodes";
import UserService from "@src/services/UserService";

import { parseReq, IReq, IRes } from "./common";

/******************************************************************************
                                Variables
******************************************************************************/

// Defining the validation schema for User model
const userValidationSchema = {
  email: transform(String, isEmail),
  name: transform(String, isOptionalString),
};

const Validators = {
  add: parseReq({ user: userValidationSchema }),
  update: parseReq({ user: userValidationSchema }),
  delete: parseReq({ id: transform(String, isString) }),
  getOne: parseReq({ text: transform(String, isString) }),
} as const;

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Get all users.
 */
async function getAll(_: IReq, res: IRes) {
  const users = await UserService.getAll();
  res.status(HttpStatusCodes.OK).json({ users });
}

/**
 * Add one user.
 */
async function add(req: IReq, res: IRes) {
  console.log(req.body);
  const { user } = Validators.add(req.body);
  await UserService.addOne(user);
  res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Update one user.
 */
async function update(req: IReq, res: IRes) {
  const { user } = Validators.update(req.body);
  await UserService.updateOne(user);
  res.status(HttpStatusCodes.OK).end();
}

/**
 * Delete one user.
 */
async function delete_(req: IReq, res: IRes) {
  const { id } = Validators.delete(req.params);
  await UserService.delete(id);
  res.status(HttpStatusCodes.OK).end();
}

async function getOne(req: IReq, res: IRes) {
  const { text } = Validators.getOne(req.params);
  const users = await UserService.getOne(text);
  res.status(HttpStatusCodes.OK).json({ users });
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  getAll,
  add,
  update,
  delete: delete_,
  getOne,
} as const;
