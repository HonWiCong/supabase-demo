"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type Task = {
	title: string;
	status: boolean;
};

export default function ClientComponent() {
	const supabase = createClientComponentClient();
	const [task, setTask] = useState<Task>({} as Task);
	const [tasks, setTasks] = useState<Task[]>([] as Task[]);

	// fetch data from database
	useEffect(() => {
		const fetchTasks = async () => {
			const { data } = await supabase.from("todos").select("title, status");
			setTasks(data!);
		};
		fetchTasks();
	}, []);

	// create new task
	const add = async () => {
		const { data, error } = await supabase.from("todos").insert({
			title: task.title,
			status: false,
		});

		if (error) {
			console.error(error);
			return;
		}

		console.log(data);

		setTasks([...tasks, {
			title: task.title,
			status: false,
		}]);

		setTask({} as Task);
	};

	return (
		<>
			<h1 className="text-3xl">ClientComponent</h1>
			<div>
				<label htmlFor="title">Title: </label>
				<input
					id="title"
					type="text"
					onChange={event => setTask({ ...task, title: event.target.value })}
				/>
				<button type="submit" onClick={add} className="ml-3">
					Add
				</button>
			</div>

			<div className="flex flex-col gap-y-4 ml-4 mt-4">
				{tasks.map((task, index) => (
					<div key={index} className="flex gap-3">
						<h2>{task.title}</h2>
						<p>{task.status ? "Done" : "Not done"}</p>
					</div>
				))}
			</div>
		</>
	);
}
