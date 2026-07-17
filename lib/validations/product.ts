import * as z from "zod";

export const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long").max(100, "Title cannot exceed 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters long").max(2000, "Description cannot exceed 2000 characters"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  condition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"], {
    required_error: "Please select a condition",
  }),
  category_id: z.string().min(1, "Please select a category"),
  location_id: z.string().min(1, "Please select a location"),
  is_available: z.boolean().default(true),
});

export type ProductFormValues = z.infer<typeof productSchema>;
