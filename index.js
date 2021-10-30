
module.exports = function AutoLfgAccept(mod) {
	let enabled = false;

	mod.command.add("lfg", {
		"cs": () => {
			mod.settings.crossserver = !mod.settings.crossserver;
			mod.command.message(`Accept cross-server requests ${mod.settings.crossserver ? "enabled" : "disabled"}`);
		},
		"$none": () => {
			enabled = !enabled;
			mod.command.message(`Module ${enabled ? "enabled" : "disabled"}`);
		}
	});

	mod.hook("S_OTHER_USER_APPLY_PARTY", 2, event => {
		if (!enabled || (!mod.settings.crossserver && event.serverId !== mod.game.me.serverId)) return;
		const buffer = Buffer.alloc(1);
		buffer.writeInt8(0);
		mod.send("C_REQUEST_CONTRACT", 1, {
			"type": 4,
			"unk4": event.serverId,
			"name": event.name,
			"data": buffer
		});
	});
};