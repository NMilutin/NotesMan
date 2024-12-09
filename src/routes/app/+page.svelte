<script>
	import Icon from '$lib/component/Icon.svelte';
	import { Note } from '$lib/class/Note.svelte.js';
	import { Task } from '$lib/class/Task.svelte.js';
	import { Goal } from '$lib/class/Goal.svelte.js';
	import NotesView from '$lib/component/NotesView.svelte';
	import TasksView from '$lib/component/TasksView.svelte';
	import GoalsView from '$lib/component/GoalsView.svelte';
	import NoteCreateMenu from '$lib/component/NoteCreateMenu.svelte';
	import TaskCreateMenu from '$lib/component/TaskCreateMenu.svelte';
	import GoalCreateMenu from '$lib/component/GoalCreateMenu.svelte';
	import NoteMenu from '$lib/component/NoteMenu.svelte';
	import TaskEditMenu from '$lib/component/TaskEditMenu.svelte';
	import GoalEditMenu from '$lib/component/GoalEditMenu.svelte';
	import '$lib/style.scss';
	import * as stateJs from '$lib/state.svelte.js';
	import { enhance } from '$app/forms';
	const { data: loadData } = $props();
	let data = stateJs.data;
	loadData.notes = loadData.notes.map((note) => JSON.parse(note));
	loadData.tasks = loadData.tasks.map((tasks) => JSON.parse(tasks));
	loadData.goals = loadData.goals.map((goal) => JSON.parse(goal));
	data.notes = loadData.notes.map(({ id, name, text, date, backgroundColor, textColor }) => {
		return new Note(id, name, text, date, backgroundColor, textColor);
	});
	data.tasks = loadData.tasks.map(({ id, name, text, date, backgroundColor, textColor, done }) => {
		return new Task(id, name, text, date, backgroundColor, textColor, done);
	});
	data.goals = loadData.goals.map(
		({ id, name, text, date, backgroundColor, textColor, tasks: tasksJSON }) => {
			const tasks = tasksJSON
				.map((task) => JSON.parse(task))
				.map(({ id: taskId }) => data.tasks.find((task) => task.id === taskId));
			return new Goal(id, name, text, date, backgroundColor, textColor, ...tasks);
		}
	);
</script>

<header>
	<nav>
		<div class="logo">
			<Icon name="notepad" width="4em"></Icon>
			<h1>NotesMan</h1>
		</div>
		<form action="?/none" method="POST">
			<h2>{loadData.email}</h2>
			<button formaction="?/settings"
				><Icon name="btn-settings" width="2em"></Icon><span>Settings</span></button
			>
			<button formaction="?/logout"
				><Icon name="btn-logout" width="2em"></Icon><span>Log Out</span></button
			>
		</form>
	</nav>
	<div class="note__types">
		{#each data.types as type}
			<button
				data-type={type.name}
				class="note-type"
				class:note-type__active={type.active}
				onclick={function (e) {
					stateJs.changeType(e);
				}}
			>
				{type.name}
			</button>
		{/each}
	</div>
	<button
		class={`note-add ${data.types.find((type) => type.name === 'All')?.active ? 'effect__disabled' : ''}`}
		onclick={stateJs.showCreateMenu}
		><Icon name="note-add" class="note-add__icon" height="100%" width="3em"></Icon></button
	>
</header>
<main>
	{#if data.types.find((type) => type.name === 'Notes').active}<NotesView {data} state={stateJs}
		></NotesView>{/if}
	{#if data.types.find((type) => type.name === 'Tasks').active}<TasksView {data} state={stateJs}
		></TasksView>{/if}
	{#if data.types.find((type) => type.name === 'Goals').active}<GoalsView {data} state={stateJs}
		></GoalsView>{/if}
</main>
{#if data.overlayOn}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore event_directive_deprecated -->
	<div
		class="overlay"
		onclick={function (e) {
			if (e.target.classList.contains('overlay')) {
				stateJs.hideOverlay();
				stateJs.clearInput();
			}
		}}
	>
		{#if data.noteCreateMenuOn}<NoteCreateMenu {data} state={stateJs}></NoteCreateMenu>{/if}
		{#if data.taskCreateMenuOn}<TaskCreateMenu {data} state={stateJs}></TaskCreateMenu>{/if}
		{#if data.goalCreateMenuOn}<GoalCreateMenu {data} state={stateJs}></GoalCreateMenu>{/if}
		{#if data.noteMenuOn}<NoteMenu {data} state={stateJs}></NoteMenu>{/if}
		{#if data.taskEditMenuOn}<TaskEditMenu {data} state={stateJs}></TaskEditMenu>{/if}
		{#if data.goalEditMenuOn}<GoalEditMenu {data} state={stateJs}></GoalEditMenu>{/if}
	</div>
{/if}

<!-- TODO: dark mode, preferences local storage-->
<style lang="scss">
	header {
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		nav {
			width: 100%;
			display: flex;
			justify-content: space-between;
			font-size: 2em;
			border-bottom: #343434 solid 3px;
			.logo {
				display: flex;
				align-items: center;
				& > * {
					font-size: 1.5em;
				}
			}
			form {
				display: flex;
				gap: 2em;
				justify-content: right;
				padding: 1.5em;
				h2 {
					font-size: 1.3em;
				}
				button {
					font-size: 1em;
					background-color: inherit;
					display: flex;
					align-items: center;
					cursor: pointer;
				}
			}
		}
		.note__types {
			display: flex;
			flex: 9;
			.note-type {
				font-size: 1em;
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
	}

	.overlay {
		position: fixed;
		width: 100vw;
		height: 100vh;
		top: 0;
		left: 0;
		backdrop-filter: blur(2px);
		animation: fadein 0.3s ease-in-out;
		display: flex;
		justify-content: center;
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
