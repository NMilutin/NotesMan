<script>
	import Icon from '../../../lib/component/Icon.svelte';
	import '$lib/style.scss';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { sub } from 'date-fns';

	const { data: loadData } = $props();

	const download = async function () {
		const url = $page.url.origin + '/download';
		const res = await fetch(url);
		const data = await res.json();
		const blob = new Blob([JSON.stringify(data)], { type: 'text/plain' });
		const blobURL = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.setAttribute('href', blobURL);
		a.setAttribute('download', 'backup.json');
		a.click();
		URL.revokeObjectURL(blobURL);
	};
	const startFilePicker = function () {
		const fileInput = document.getElementById('upload');
		fileInput.click();
	};
	const upload = function (fileInput) {
		const submit = fileInput.closest('form').querySelector('input[type="submit"]');
		submit.click();
	};
</script>

<form
	style="display: none"
	method="POST"
	action="?/upload"
	enctype="multipart/form-data"
	use:enhance={({}) => {
		invalidateAll();
	}}
>
	<input
		onchange={(e) => {
			upload(e.target);
		}}
		name="upload"
		id="upload"
		type="file"
		accept="application/json"
	/>
	<input type="submit" />
</form>
<nav>
	<form
		action="?/none"
		method="POST"
		use:enhance={({ action: { search: formAction }, cancel }) => {
			formAction = formAction.slice(2);
			if (formAction === 'back') {
				return;
			}
		}}
	>
		<button formaction="?/back" class="back"
			><Icon name="btn-back" width="2em"></Icon><span>Back</span></button
		>
		<h2>{loadData.email}</h2>
		<button formaction="?/logout"
			><Icon name="btn-logout" width="2em"></Icon><span>Log Out</span></button
		>
	</form>
</nav>
<div class="settings">
	<form method="POST" action="?/new_email" use:enhance={({}) => {}} class="settings__email">
		<label
			>New Email:
			<input name="newEmail" type="email" />
		</label>
		<button>Send Verification</button>
	</form>
	<form
		method="POST"
		action="?/new_password"
		use:enhance={({}) => {
			invalidateAll();
		}}
		class="settings__password"
	>
		{#if ['BAD_PAS', 'WRONG_PAS', 'SHORT_PAS', 'LONG_PAS'].includes(loadData.code)}
			<div class="error"><Icon name="error"></Icon><span>{loadData?.message}</span></div>
		{/if}
		<label>
			Old Password:
			<input name="oldPassword" type="password" />
		</label>
		<label>
			New Password:
			<input name="newPassword" type="password" />
		</label>
		<button>Change Password</button>
	</form>
	<div class="settings__backup">
		<button onclick={download}
			><Icon name="btn-backup" width="1.5em"></Icon><span>Download Data</span></button
		>
		<button onclick={startFilePicker}
			><Icon name="upload" width="1.5em"></Icon><span>Restore Data</span></button
		>
	</div>
	<form method="POST" action="?/delete_account" use:enhance={({}) => {}} class="settings__delete">
		<button class="delete-account">
			<Icon name="note-del" width="1.5em"></Icon><span>Delete Account</span></button
		>
	</form>
</div>

<!-- TODO: login, signup, activate i confirm
 stranice koje nisu samo html form sa tekstom-->
<style lang="scss">
	nav {
		width: 100%;
		display: flex;
		justify-content: right;
		font-size: 2em;
		border-bottom: #343434 solid 3px;
		form {
			display: flex;
			flex-direction: row;
			gap: 2em;
			justify-content: right;
			padding: 1.5em;
			button.back {
				position: absolute;
				top: 1em;
				left: 1em;
				display: flex;
				align-items: center;
				gap: 0.5em;
			}
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
	button {
		border: none;
		background-color: inherit;
		font-family: sans-serif;
		font-size: 1em;
		cursor: pointer;
		outline: none;
	}
	.settings {
		font-family: sans;
		padding: 5em 30vw 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5em;
		form {
			display: flex;
			flex-direction: column;
			gap: 1em;
			width: 100%;
			border-top: 2px solid #343434;
			padding-top: 1.5em;
			input {
				padding: 0.2em;
				border: 2px solid #343434;
				border-radius: 999px;
				box-shadow: inset 0px 3px 2px 1px rgba(0, 0, 0, 0.15);
				outline: none;
			}
			button {
				display: flex;
				align-items: center;
				border: 2px solid #343434;
				border-radius: 999px;
				padding: 0.5em;
				gap: 0.5em;
				box-shadow: 0px 3px 3px 2px rgba(0, 0, 0, 0.15);
			}
		}
		form.settings__email {
			align-items: start;
			border-top: none;
		}
		&__password {
			padding-top: 1em;
			button {
				width: fit-content;
			}
		}
		.settings__backup {
			display: flex;
			flex-direction: column;
			gap: 1em;
			width: 100%;
			border-top: 2px solid #343434;
			padding-top: 1.5em;
			button {
				display: flex;
				align-items: center;
				border: 2px solid #343434;
				border-radius: 999px;
				padding: 0.5em;
				gap: 0.5em;
				box-shadow: 0px 3px 3px 2px rgba(0, 0, 0, 0.15);
				width: fit-content;
			}
		}

		.settings__delete {
			border-top: none;
			padding-top: 0;
			button {
				background-color: #bc4222;
				color: #f1f1f1;
				fill: #f1f1f1;
				width: fit-content;
			}
		}
	}
</style>
