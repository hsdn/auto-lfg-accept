
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

	mod.hook("S_OTHER_USER_APPLY_PARTY", mod.majorPatchVersion >= 108 ? 2 : 1, event => {
		if (!enabled) return;
		const buffer = Buffer.alloc(1);
		buffer.writeInt8(0);
		if (mod.majorPatchVersion >= 108) {
			if (!mod.settings.crossserver && event.serverId !== mod.game.me.serverId) return;
			mod.send("C_REQUEST_CONTRACT", 1, {
				"type": 4,
				"unk4": event.serverId,
				"name": event.name,
				"data": buffer
			});
		} else {
			mod.send("C_REQUEST_CONTRACT", 1, {
				"type": 4,
				"name": event.name,
				"data": buffer
			});
		}
	});
};