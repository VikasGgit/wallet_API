// validations/walletValidation.js
import Joi from 'joi';

export const createWalletSchema = Joi.object({
  userId: Joi.string().required(),
  balance: Joi.number().min(0).default(0.0),
});

export const updateBalanceSchema = Joi.object({
  amount: Joi.number().positive().required(),
  operation: Joi.string().valid('add', 'subtract').required(),
  description: Joi.string().optional(),
});
