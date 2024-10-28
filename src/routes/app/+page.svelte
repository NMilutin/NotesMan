<script>
	import { browser } from '$app/environment';

	import Icon from '$lib/component/Icon.svelte';
	import NotesView from '$lib/component/NotesView.svelte';
	import TasksView from '$lib/component/TasksView.svelte';
	import GoalsView from '$lib/component/GoalsView.svelte';
	import CreateMenu from '$lib/component/CreateMenu.svelte';
	import NoteMenu from '$lib/component/NoteMenu.svelte';
	import GoalEditMenu from '$lib/component/GoalEditMenu.svelte';
	import '$lib/style.scss';
	import * as state from '$lib/state.js';

	let data;
	state.datastore.subscribe((value) => {
		data = value;
	});
</script>

<header>
	<div class="note__types">
		{#each data.types as type}
			<button
				data-type={type.name}
				class="note-type"
				class:note-type__active={type.active}
				on:click={function (e) {
					state.changeType(e);
				}}
			>
				{type.name}
			</button>
		{/each}
	</div>
	<button
		class={`note-add ${data.types.find((type) => type.name === 'All').active ? 'effect__disabled' : ''}`}
		on:click={state.showCreateMenu}
		><Icon name="note-add" class="note-add__icon" height="100%" width="3em"></Icon></button
	>
</header>
<main>
	{#if data.types.find((type) => type.name === 'Notes').active}<NotesView {data} {state}
		></NotesView>{/if}
	{#if data.types.find((type) => type.name === 'Tasks').active}<TasksView {data} {state}
		></TasksView>{/if}
	{#if data.types.find((type) => type.name === 'Goals').active}<GoalsView {data} {state}
		></GoalsView>{/if}
</main>
{#if data.overlayOn}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="overlay"
		on:click={function (e) {
			if (e.target.classList.contains('overlay')) {
				state.hideOverlay();
				state.clearInput();
			}
		}}
	>
		<CreateMenu {data} {state}></CreateMenu>
		{#if data.noteMenuOn}<NoteMenu {data} {state}></NoteMenu>{/if}
		{#if data.goalEditMenuOn}<GoalEditMenu {data} {state}></GoalEditMenu>{/if}
	</div>
{/if}

<!-- TODO: meni za goal,
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
