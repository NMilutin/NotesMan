<script>
	import { browser } from '$app/environment';

	import Icon from '$lib/component/Icon.svelte';
	import '$lib/style.scss';
	import { Color } from '$lib/class/Color.js';
	import { Note } from '$lib/class/Note.js';
	import { Task } from '$lib/class/Task.js';
	import { Goal } from '$lib/class/Goal.js';
	import * as state from '$lib/state.js';
	let data;

	data = {
		notes: [],
		tasks: [
			new Task('1', '2', new Date(), new Color('#c4f')),
			new Task('2', '2', new Date(), new Color('#c4f')),
			new Task('3', '2', new Date(), new Color('#c4f')),
			new Task('4', '2', new Date(), new Color('#c4f')),
			new Task('5', '2', new Date(), new Color('#c4f')),
			new Task('6', '2', new Date(), new Color('#c4f'))
		]
	};
	data.goals = [
		new Goal('goal 1', 'desc', new Date('2024/03/15'), new Color('#fbb'), data.tasks.at(1)),
		new Goal('goal 1', 'desc', new Date('2024/10/09'), new Color('#fbb'), data.tasks.at(2))
	];
	let types = [
		{ name: 'All', active: true },
		{ name: 'Notes', active: false },
		{ name: 'Tasks', active: false },
		{ name: 'Goals', active: false }
	];
	let input = {
		noteName: '',
		noteDate: new Date().toISOString().slice(0, 10),
		noteText: '',
		goalTasks: []
	};
	const clearInput = function () {
		input.noteName = '';
		if (types.find((type) => type.active).name !== 'Tasks')
			input.noteDate = new Date().toISOString().slice(0, 10);
		input.noteText = '';
		input.goalTasks = [];
	};
	const hideOverlay = function () {
		overlayOn = false;
		noteCreateMenuOn = false;
		taskCreateMenuOn = false;
		goalCreateMenuOn = false;
		editModeOn = false;
		noteMenuOn = false;
		toggleScroll();
	};
	const addNote = function () {
		if (!input.noteName || !input.noteText || !input.noteDate) return;
		data.notes.push(new Note(input.noteName, input.noteText, new Date(input.noteDate)));
		data = data;
		hideOverlay();
		clearInput();
	};
	const delNote = function (note) {
		const i = data.notes.findIndex((n) => {
			return n === note;
		});
		data.notes.splice(i, 1);
		data = data;
		clearInput();
		hideOverlay();
	};

	const addTask = function () {
		if (!input.noteName || !input.noteText || !input.noteDate) return;
		data.tasks.push(new Task(input.noteName, input.noteText, new Date(input.noteDate)));
		data = data;
		clearInput();
		hideOverlay();
	};
	const delTask = function (i) {
		data.tasks.splice(i, 1);
		data = data;
		activeTask = data.tasks.at(i);
	};
	const changeTaskDay = function (previous = false) {
		if (!previous) taskDate.setDate(taskDate.getDate() + 1);
		else taskDate.setDate(taskDate.getDate() - 1);
		taskDate = taskDate;
		taskDateString = taskDate.toISOString().slice(0, 10);
		input.noteDate = taskDate.toISOString().slice(0, 10);
		taskDatePickerOn = false;
	};

	const addGoal = function () {
		if (!input.noteName || !input.noteText || !input.noteDate) return;
		data.goals.push(
			new Goal(input.noteName, input.noteText, new Date(input.noteDate), ...input.goalTasks)
		);
		data = data;
		clearInput();
		hideOverlay();
	};

	let overlayOn = false;
	let noteCreateMenuOn = false;
	let taskCreateMenuOn = false;
	let goalCreateMenuOn = false;
	let noteMenuOn = false;
	let editModeOn = false;
	const showCreateMenu = function () {
		const activeType = types.find((type) => type.active).name;
		if (activeType === 'All') return;
		if (activeType !== 'Tasks') input.noteDate = new Date().toISOString().slice(0, 10);
		overlayOn = true;
		noteCreateMenuOn = activeType === 'Notes';
		taskCreateMenuOn = activeType === 'Tasks';
		goalCreateMenuOn = activeType === 'Goals';
		toggleScroll();
	};
	let activeNote;
	let activeTask;
	let taskDate = new Date();
	let taskDateString;
	taskDateString = taskDate.toISOString().slice(0, 10);
	const showNote = function (note) {
		overlayOn = true;
		activeNote = note;
		noteMenuOn = true;
		toggleScroll();
	};
	const toggleScroll = function () {
		if (browser) {
			document.body.classList.toggle('noscroll');
		}
	};
	let taskDatePickerOn = false;
	const toggleTaskDatePicker = function (e) {
		if (e.target !== this) return;
		taskDatePickerOn = !taskDatePickerOn;
	};
</script>

<header>
	<div class="note__types">
		{#each types as type}
			<button
				data-type={type.name}
				class="note-type"
				class:note-type__active={type.active}
				on:click={function (e) {
					types.forEach((type) => (type.active = type.name === e.target.dataset.type));
					types = types;
					if (types.find((type) => type.active).name === 'Tasks')
						input.noteDate = taskDate.toISOString().slice(0, 10);
				}}
			>
				{type.name}
			</button>
		{/each}
	</div>
	<button
		class={`note-add ${types.find((type) => type.name === 'All').active ? 'effect__disabled' : ''}`}
		on:click={showCreateMenu}
		><Icon name="note-add" class="note-add__icon" height="100%" width="3em"></Icon></button
	>
</header>
<main>
	{#if types.find((type) => type.name === 'Notes').active}
		<div class="notes__container">
			{#each data.notes as note, i}
				<div class="note-wrapper">
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						data-note-index={i}
						class="note"
						style={`--note-color:${note.color.hex || '#DFDFCF'}; transform:translate(${(Math.random() - 0.5) * 4}em,${(Math.random() - 0.5) * 4}em)`}
						on:click={function (e) {
							showNote(data.notes.at(+e.target.closest('.note').dataset.noteIndex));
						}}
					>
						<h2>{note.name}</h2>
						<h3>{note.date.toDateString()}</h3>
						<p>{note.text}</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
	{#if types.find((type) => type.name === 'Tasks').active}
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<h1 on:click={toggleTaskDatePicker}>
			{#if taskDatePickerOn}<input
					type="date"
					bind:value={taskDateString}
					on:change={function () {
						taskDate = new Date(taskDateString);
						input.noteDate = taskDateString;
					}}
				/>{/if}
			{#if !taskDatePickerOn}{taskDate.toDateString()}{/if}
		</h1>
		<div class="tasks__container">
			{#each data.tasks as task, i}
				{#if taskDate.getDate() === task.date.getDate() && taskDate.getMonth() === task.date.getMonth() && taskDate.getFullYear() === task.date.getFullYear()}
					<div class="task" style={`--task-color:${task.color.hex || '#DFDFCF'};`} data-i={i}>
						<div class="task-title">
							<button
								class="task-do"
								on:click={function () {
									task.done = !task.done;
								}}
								>{#if task.done}<Icon name="checkmark" width="1.5em"></Icon>{/if}</button
							>
							<h2>{task.name}</h2>
							<button class="task-del" on:click={delTask.bind(this, i)}
								><Icon name="note-del" width="1.5em"></Icon></button
							>
						</div>
						<p>{task.text}</p>
					</div>
				{/if}
			{/each}
		</div>
		<button
			class="task-prev"
			on:click={function () {
				changeTaskDay(true);
			}}><Icon name="btn-prev" width="1.5em"></Icon></button
		>
		<button
			class="task-next"
			on:click={function () {
				changeTaskDay();
			}}><Icon name="btn-next" width="1.5em"></Icon></button
		>
	{/if}
	{#if types.find((type) => type.name === 'Goals').active}
		<div class="goals__container">
			{#each data.goals as goal, i}
				{@const datediff = (goal.date - new Date()) / (1000 * 3600 * 24)}
				<div class="goal" data-i={i}>
					<h2>{goal.name}</h2>
					<h3>
						{Math.round(Math.abs(datediff)) || ''}
						{new Date().getDate() === goal.date.getDate() &&
						new Date().getMonth() === goal.date.getMonth() &&
						new Date().getFullYear() === goal.date.getFullYear()
							? 'Today'
							: Math.floor(datediff) > 0
								? `day${datediff > 1 ? 's' : ''} left`
								: `day${datediff > 1 ? 's' : ''} past`}
					</h3>
					<p>{goal.text}</p>
					<div class="goal__tasks">
						{#each goal.tasks as task}
							<div class="task">
								<h4>{task.name}</h4>
								<p>{task.text}</p>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</main>
{#if overlayOn}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="overlay"
		on:click={function (e) {
			if (e.target.classList.contains('overlay')) {
				hideOverlay();
				clearInput();
			}
		}}
	>
		{#if noteCreateMenuOn}
			<div class="create-menu">
				<h1>New Note</h1>
				<div class="input-container">
					<input type="text" placeholder="Name your note..." bind:value={input.noteName} />
					<input type="date" bind:value={input.noteDate} />
					<textarea placeholder="Your note content..." bind:value={input.noteText}></textarea>
				</div>
				<button class="btn__create-note" on:click={addNote}>Create Note</button>
			</div>
		{/if}
		{#if taskCreateMenuOn}
			<div class="create-menu">
				<h1>New Task</h1>
				<div class="input-container">
					<input type="text" placeholder="Name your task..." bind:value={input.noteName} />
					<input type="date" bind:value={input.noteDate} />
					<textarea placeholder="Your task description..." bind:value={input.noteText}></textarea>
				</div>
				<button class="btn__create-note" on:click={addTask}>Create Task</button>
			</div>
		{/if}
		{#if goalCreateMenuOn}
			<div class="create-menu">
				<h1>New Goal</h1>
				<div class="input-container">
					<input type="text" placeholder="Name your goal..." bind:value={input.noteName} />
					<input type="date" bind:value={input.noteDate} />
					<textarea placeholder="Your goal description..." bind:value={input.noteText}></textarea>
				</div>
				<div class="task-select__container">
					<div class="tasks__available">
						{#each data.tasks.filter((task) => !input.goalTasks.includes(task)) as task}
							<div class="goal-create__task">
								<span>{task.name}</span><button
									on:click={function () {
										input.goalTasks.push(task);
										input = input;
									}}><Icon name="btn-move" width="1.5em"></Icon></button
								>
							</div>
						{/each}
					</div>
					<div class="tasks__selected">
						{#each input.goalTasks as task, i}<div class="goal-create__task">
								<span>{task.name}</span><button
									on:click={function () {
										input.goalTasks.splice(i, 1);
										input = input;
									}}><Icon name="btn-move" width="1.5em"></Icon></button
								>
							</div>{/each}
					</div>
				</div>
				<button class="btn__create-note" on:click={addGoal}>Create Goal</button>
			</div>
		{/if}
		{#if noteMenuOn}
			<div class="note-menu" style={`--note-color:${activeNote.color.hex || '#DFDFCF'};`}>
				{#if !editModeOn}
					<h2>{activeNote.name}</h2>
					<h3>{activeNote.date.toDateString()}</h3>
					<p>{activeNote.text}</p>
					<button
						class="note-edit"
						on:click={function () {
							editModeOn = !editModeOn;
							input.noteName = activeNote.name;
							input.noteText = activeNote.text;
							input.noteDate = `${activeNote.date.getFullYear()}-${(activeNote.date.getMonth() + 1).toString().padStart(2, '0')}-${activeNote.date.getDate().toString().padStart(2, '0')}`;
						}}><Icon name="note-edit" width="1.5em"></Icon></button
					>
					<button
						class="note-del"
						on:click={function () {
							delNote(activeNote);
						}}><Icon name="note-del" width="1.5em"></Icon></button
					>
				{/if}
				{#if editModeOn}
					<h2><input bind:value={input.noteName} /></h2>
					<h3><input type="date" bind:value={input.noteDate} /></h3>
					<p><textarea resize="false" bind:value={input.noteText}></textarea></p>
					<button
						class="note-edit"
						on:click={function () {
							editModeOn = !editModeOn;
						}}><Icon name="xmark" width="1.5em"></Icon></button
					>
					<button
						class="note-del"
						on:click={function () {
							delNote(activeNote);
						}}><Icon name="note-del" width="1.5em"></Icon></button
					>
					<button
						class="note-accept"
						on:click={function () {
							activeNote.name = input.noteName;
							activeNote.text = input.noteText;
							activeNote.date = new Date(input.noteDate);
							editModeOn = false;
							noteMenuOn = false;
							overlayOn = false;
							data = data;
							clearInput();
						}}><Icon name="checkmark" width="1.5em"></Icon></button
					>
				{/if}
			</div>
		{/if}
	</div>
{/if}

<!-- TODO: meni za goal,
 PRIORITY: odmrsi sve u odvojene komponente jer je trenutno sve veliki dzumbus
 picker za boju, vise boja (pozadina, pozadina 2, tekst), odabir fonta
 baza podataka, login i signup, backup podataka-->
<style lang="scss">
	header {
		display: flex;
		width: 100%;
		.note__types {
			display: flex;
			flex: 9;
			.note-type {
				flex: 1;
				text-align: center;
				padding: 20px;
				border-bottom: #fff solid 5px;
				transition: border-color 0.3s ease-in-out;
				user-select: none;
				background-color: inherit;
				&:hover:not(&__active) {
					border-color: #ababab;
				}
				&__active {
					border-color: #343434;
				}
			}
		}
		.note-add {
			flex: 1;
			background-color: inherit;
			&.effect__disabled {
				filter: opacity(0.3);
			}
		}
	}
	main {
		position: relative;
		.notes__container {
			display: flex;
			flex-wrap: wrap;
			.note-wrapper {
				width: 25%;
				padding: 5em;
				height: 30em;
				.note {
					text-align: center;
					border-radius: 1rem;
					border-bottom-left-radius: 0.5rem;
					border-bottom-right-radius: 0.5rem;
					background-color: var(--note-color);
					padding: 1rem;
					height: 20em;
					overflow: hidden;
					cursor: pointer;
					h2 {
						background-color: rgba(0, 0, 0, 0.1);
						margin: -1rem -1rem 0;
						padding: 1rem;
						border-top-left-radius: 1rem;
						border-top-right-radius: 1rem;
						font-size: 1.5em;
					}
					h3 {
						padding: 0.5em;
					}
					p {
						width: 100%;
						word-break: break-all;
					}
				}
			}
		}
		.tasks__container {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 3em;
			padding: 5em;
			.task {
				width: 50%;
				text-align: center;
				border-radius: 1em;
				background-color: var(--task-color);
				.task-title {
					display: flex;
					position: relative;
					background-color: rgba(0, 0, 0, 0.1);
					border-top-left-radius: 1em;
					border-top-right-radius: 1em;
					h2 {
						width: 100%;
						font-size: 1.5em;
						padding: 0.75em;
					}
					button {
						position: absolute;
						top: 0.75em;
						right: 0.75em;
						background-color: rgba(255, 255, 255, 0.25);
						border-radius: 50%;
						width: 2.5em;
						height: 2.5em;
						padding: 0.3em;
						border: #343434 solid 2px;
						cursor: pointer;
					}
					.task-do {
						left: 0.75em;
					}
				}
				p {
					padding: 1em;
				}
			}
		}
		.task-prev,
		.task-next {
			position: absolute;
			top: 2.5em;
			background-color: rgba(0, 0, 0, 0.15);
			width: 2.5em;
			height: 2.5em;
			padding: 0.3em;
			border: #343434 solid 2px;
			border-radius: 50%;
		}
		.task-prev {
			left: 35%;
		}
		.task-next {
			right: 35%;
		}
		h1 {
			font-size: 2em;
			text-align: center;
			padding: 1em;
			cursor: pointer;
			user-select: none;
		}
	}
	.overlay {
		position: absolute;
		width: 100vw;
		height: 100vh;
		top: 0;
		left: 0;
		backdrop-filter: blur(2px);
		animation: fadein 0.3s ease-in-out;
		display: flex;
		justify-content: center;
		.create-menu {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin: 5vh 30em 10em;
			border-radius: 3em;
			box-shadow: rgba(0, 0, 0, 0.3) 0 0.2em 1em;
			border: 3px solid #ababab;
			background-color: #fff;
			max-height: 95vh;
			& > * {
				min-height: 0;
			}
			h1 {
				flex: 1;
				text-align: center;
				padding: 1em;
				font-size: 1.5em;
			}
			.input-container {
				flex: 3;
				padding: 0 10%;
				text-align: center;
				input {
					outline: none;
				}
				textarea {
					outline: none;
					resize: none;
					width: 100%;
					margin: 2em 0;
					max-width: 20em;
					text-align: center;
					min-height: 10em;
				}
			}
			.btn__create-note {
				flex: 1;
				padding: 2em;
				background-color: inherit;
			}
			.task-select__container {
				display: flex;
				flex: 3;
				width: 90%;
				.tasks__available,
				.tasks__selected {
					flex: 1;
					padding: 1em;
					overflow-y: auto;
					scrollbar-gutter: stable;
					margin: 0.5em;
					.goal-create__task {
						height: 3.5em;
						padding: 0.5em;
						display: flex;
						align-items: center;
						span {
							flex: 1;
							display: block;
						}
						button {
							flex: 0;
							background-color: rgba(0, 0, 0, 0.15);
							border-radius: 50%;
							width: 2.5em;
							height: 2.5em;
							padding: 0.3em;
							border: #343434 solid 2px;
							cursor: pointer;
						}
					}
				}
				.tasks__selected {
					direction: rtl;
					.goal-create__task {
						& > * {
							direction: ltr;
						}
					}
				}
			}
		}
		.note-menu {
			margin: 10em 0;
			text-align: center;
			border-radius: 1rem;
			border-bottom-left-radius: 0.5rem;
			border-bottom-right-radius: 0.5rem;
			background-color: var(--note-color);
			padding: 1rem;
			height: 60vh;
			width: 30vw;
			box-shadow: rgba(0, 0, 0, 0.3) 0 0.2em 1em;
			position: relative;
			display: flex;
			flex-direction: column;
			h2 {
				background-color: rgba(0, 0, 0, 0.1);
				margin: -1rem -1rem 0;
				padding: 1rem;
				border-top-left-radius: 1rem;
				border-top-right-radius: 1rem;
				font-size: 1.5em;
				padding-left: 25%;
				padding-right: 25%;
				input {
					outline: none;
					background: none;
					font: inherit;
					width: 100%;
					text-align: center;
				}
			}
			h3 {
				padding: 0.5em;
				input {
					outline: none;
					background: none;
				}
			}
			p {
				word-break: break-all;
				flex: 1;
				textarea {
					outline: none;
					background: none;
					resize: none;
					width: 100%;
					height: 100%;
					text-align: center;
				}
			}
			.note-del,
			.note-edit,
			.note-accept {
				position: absolute;
				top: 0.75em;
				right: 0.75em;
				background-color: rgba(255, 255, 255, 0.25);
				border-radius: 50%;
				width: 2.5em;
				height: 2.5em;
				padding: 0.3em;
				border: #343434 solid 2px;
				cursor: pointer;
			}
			.note-edit {
				right: 3.75em;
			}
			.note-accept {
				left: 0.75em;
			}
		}
	}

	@keyframes fadein {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
