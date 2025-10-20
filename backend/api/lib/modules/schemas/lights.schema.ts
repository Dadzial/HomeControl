import Joi from "joi";

export const rooms = ["kitchen", "garage", "room", "bath"] as const;
export type RoomsUnion = typeof rooms[number];

export const toggleLightSchema = Joi.object({
  room: Joi.string().valid(...rooms, "all").required(),
  state: Joi.boolean().required(),
});

export const resetUsageSchema = Joi.object({
  room: Joi.string().valid(...rooms, "all").optional(),
});
