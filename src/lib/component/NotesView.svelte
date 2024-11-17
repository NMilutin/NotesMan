<script>
	let { data = $bindable(), state } = $props();
</script>

<div class="notes__container">
	{#each data.notes as note}
		<div class="note-wrapper">
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="note"
				style={`--background-color:${note.backgroundColor};
        --text-color:${note.textColor};`}
				onclick={function (e) {
					state.showNote(note);
				}}
			>
				<h2>{note.name}</h2>
				<h3>{note.date.toDateString()}</h3>
				<p>{note.text}</p>
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
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
				background-color: var(--background-color);
				padding: 1rem;
				height: 20em;
				overflow: hidden;
				cursor: pointer;
				* {
					color: var(--text-color);
				}
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
</style>
