<script>
  export let data;
  export let state;

  import Icon from "$lib/component/Icon.svelte";
</script>
<div class="note-menu" style={`--note-color:${data.activeObject.color.hex || '#DFDFCF'};`}>
	{#if !data.editModeOn}
		<h2>{data.activeObject.name}</h2>
		<h3>{data.activeObject.date.toDateString()}</h3>
		<p>{data.activeObject.text}</p>
		<button class="note-edit" on:click={state.toggleNoteEdit}
			><Icon name="note-edit" width="1.5em"></Icon></button
		>
		<button
			class="note-del"
			on:click={function () {
				state.delNote(data.activeObject);
				state.hideOverlay();
			}}><Icon name="note-del" width="1.5em"></Icon></button
		>
	{/if}
	{#if data.editModeOn}
		<h2><input bind:value={data.input.name} /></h2>
		<h3><input type="date" bind:value={data.input.date} /></h3>
		<p><textarea resize="false" bind:value={data.input.text}></textarea></p>
		<button class="note-edit" on:click={state.toggleNoteEdit}
			><Icon name="xmark" width="1.5em"></Icon></button
		>
		<button
			class="note-del"
			on:click={function () {
				state.delNote(data.activeObject);
				state.hideOverlay();
			}}><Icon name="note-del" width="1.5em"></Icon></button
		>
		<button class="note-accept" on:click={state.confirmNoteEdit}
			><Icon name="checkmark" width="1.5em"></Icon></button
		>
	{/if}
</div>

<style lang="scss">
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
</style>
