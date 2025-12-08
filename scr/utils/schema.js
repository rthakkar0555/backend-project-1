import { z } from "zod";

export const userLoginSchema = z.object({
  email: z.email("Invalid email"),
  
  username: z.string(),
    
  password: z.string(),
});
