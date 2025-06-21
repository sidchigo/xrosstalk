import { useState } from "react";
import { ShieldUser, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [name, nameSet] = useState("");

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<form>
				<div className="flex flex-col gap-6">
					<div className="flex flex-col items-center gap-2">
						<h1 className="text-xl font-bold">
							Welcome to Xrosstalk
						</h1>
						<div className="text-center text-sm">
							Choose your role
						</div>
					</div>
					<div className="flex flex-col gap-6">
						<div className="grid gap-3">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								type="text"
								placeholder="Chanandler Bong"
								required
								value={name}
								onChange={(e) => nameSet(e.target.value)}
							/>
						</div>
						<a
							href={`/${name}`}
							target="_blank"
							rel="noopener noreferrer"
							style={{ width: "100%", display: "block" }}
						>
							<Button
								type="button"
								className="w-full"
								disabled={name === ""}
							>
								<User />
								Continue as client
							</Button>
						</a>
					</div>
					<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
						<span className="bg-background text-muted-foreground relative z-10 px-2">
							Or
						</span>
					</div>
					<div className="flex justify-center">
						<a
							href={`/admin`}
							target="_blank"
							rel="noopener noreferrer"
							style={{ width: "100%", display: "block" }}
						>
							<Button
								variant="outline"
								type="button"
								className="w-full"
							>
								<ShieldUser />
								Continue as admin
							</Button>
						</a>
					</div>
				</div>
			</form>
		</div>
	);
}
