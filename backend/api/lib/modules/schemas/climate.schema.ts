import Joi from "joi";

export const deleteClimateQuerySchema = Joi.object({
  olderThanHours: Joi.number().integer().positive().optional()
});
