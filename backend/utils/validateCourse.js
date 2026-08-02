import Joi from "joi";

export const courseValidationSchema = Joi.object({
  title: Joi.string().trim().max(200).required(),
  description: Joi.string().trim().required(),
  aboutCourse: Joi.array().items(Joi.string().trim()).optional(),
  isFree: Joi.boolean().optional(),
  price: Joi.number().min(0).optional(),
  visibility: Joi.string().valid("public", "private").optional(),
  publishedAt: Joi.date().optional(),
  isFeatured: Joi.boolean().optional(),
  category: Joi.string().trim().optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  seo: Joi.object({
    metaTitle: Joi.string().max(60).trim().optional(),
    metaDescription: Joi.string().max(160).trim().optional(),
    ogImage: Joi.string().trim().optional(),
  }).optional(),
});
