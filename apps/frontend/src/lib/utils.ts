import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const logTimestamp = (timestamp?: number) =>
	new Date(timestamp ?? Date.now()).toLocaleString("en", {
		dateStyle: "medium",
		timeStyle: "short",
	});
