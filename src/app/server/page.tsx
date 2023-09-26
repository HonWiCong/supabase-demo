import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic'

export default async function ServerComponent() {
	const supabase = createServerActionClient({ cookies });
	const { data } = await supabase.from("todos").select("title, status");

	const add = async(formData: FormData) => {
		"use server"

		const supabase = createServerActionClient({ cookies });
		const title = formData.get("title") as string;
		const { error } = await supabase.from("todos").insert({ title, status: false });
		
		if (error) {
			console.error(error);
			return;
		}
		
		revalidatePath("/");
	}

	return (
		<>
			<h1>ServerComponent</h1>
			<form action={add}>
				<input name="title" />
				<button type="submit">Add</button>
			</form>
			<div>
				{data!.map((task, index) => (
					<div key={`${task.title} ${index}`} className="flex gap-2">
						<h2>{task.title}</h2>
						<p>{task.status ? "Done" : "Not done"}</p>
					</div>
				))}
			</div>
		</>
	);
}
