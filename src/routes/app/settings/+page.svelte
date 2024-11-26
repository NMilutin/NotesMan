<script>
	import Icon from '../../../lib/component/Icon.svelte';
	import '$lib/style.scss';
	import { enhance } from '$app/forms';
</script>

<form
	method="POST"
	use:enhance={({ formData, action: { search: formAction }, cancel }) => {
		formAction = formAction.slice(2);
		if (formAction === 'back') return;
	}}
>
	<button formaction="?/back" class="back"
		><Icon name="btn-back" width="2em"></Icon><span>Back</span></button
	>
	<div class="inner-form">
		<div class="inner-settings email-settings">
			<label
				>New Email:
				<input name="newEmail" type="email" />
			</label>
			<button formaction="?/new_email">Send Verification</button>
		</div>
		<div class="inner-settings password-settings">
			<label>
				Old Password:
				<input name="oldPassword" type="password" />
			</label>
			<label>
				New Password:
				<input name="newPassword" type="password" />
			</label>
			<button formaction="?/new_password">Change Password</button>
		</div>
		<div class="inner-settings other-settings">
			<button formaction="?/backup_data" class="download-data"
				><Icon name="btn-backup" width="1.5em"></Icon><span>Download Data</span></button
			>
			<button formaction="?/none" class="delete-account">
				<Icon name="note-del" width="1.5em"></Icon><span>Delete Account</span></button
			>
		</div>
	</div>
</form>

<style lang="scss">
	button {
		border: none;
		background-color: inherit;
		font-family: sans;
		font-size: 1em;
		cursor: pointer;
		outline: none;
	}
	form {
		font-family: sans;
		padding: 5em 10em 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		button.back {
			position: absolute;
			top: 1em;
			left: 1em;
			display: flex;
			align-items: center;
			gap: 0.5em;
		}
		.inner-form {
			display: flex;
			flex-direction: column;
			gap: 1.5em;
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
			.inner-settings {
				display: flex;
				gap: 1em;
				&.email-settings {
					align-items: center;
				}
				&.password-settings,
				&.other-settings {
					flex-direction: column;
					border-top: 2px solid #343434;
					padding-top: 1em;
					button {
						width: fit-content;
					}
				}
				&.other-settings {
					button {
						&.delete-account {
							background-color: #bc4222;
							color: #f1f1f1;
							border-color: #f1f1f1;
							fill: #f1f1f1;
						}
					}
				}
			}
		}
	}
</style>
