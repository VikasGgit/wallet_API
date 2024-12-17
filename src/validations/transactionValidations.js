// validations/transactionValidation.js
import Joi from 'joi';

export const createTransactionSchema = Joi.object({
  walletId: Joi.string().required(),
  type: Joi.string().valid('CREDIT', 'DEBIT').required(),
  amount: Joi.number().positive().required(),
  category: Joi.string().optional(),
  recurring: Joi.boolean().optional(),
});

export const updateTransactionSchema = Joi.object({
  type: Joi.string().valid('CREDIT', 'DEBIT').optional(),
  amount: Joi.number().positive().optional(),
  category: Joi.string().optional(),
  recurring: Joi.boolean().optional(),
});
