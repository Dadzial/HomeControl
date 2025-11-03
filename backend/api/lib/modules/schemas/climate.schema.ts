import Joi from "joi";

// Na razie zapis robimy zawsze z odczytu ESP32, więc nie potrzebujemy body-schema.
// Zostawiamy tylko walidację query dla DELETE.

export const deleteClimateQuerySchema = Joi.object({
  olderThanHours: Joi.number().integer().positive().optional()
});
