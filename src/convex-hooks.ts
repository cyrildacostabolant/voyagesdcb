import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

// We will use @ts-nocheck to bypass missing _generated types 
// if the user hasn't run `npx convex dev` yet.
