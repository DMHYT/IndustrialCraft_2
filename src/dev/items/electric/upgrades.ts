IDRegistry.genItemID("upgradeOverclocker");
Item.createItem("upgradeOverclocker", "Overclocker Upgrade", {name: "upgrade_overclocker", meta: 0});
Item.registerNameOverrideFunction(ItemID.upgradeOverclocker, function(item, name) {
	let percent = "%%%%"; // it's one % in name
	if (currentUIscreen == "in_game_play_screen" || currentUIscreen == "world_loading_progress_screen - local_world_load") {
		percent += "%%%%"; // this game is broken
	}
	let timeTooltip = Translation.translate("Decrease process time to ") + 70 + percent;
	let powerTooltip = Translation.translate("Increase power to ") + 160 + percent;
	return name + "§7\n" + timeTooltip + "\n" + powerTooltip;
});

IDRegistry.genItemID("upgradeTransformer");
Item.createItem("upgradeTransformer", "Transformer Upgrade", {name: "upgrade_transformer", meta: 0});
Item.registerNameOverrideFunction(ItemID.upgradeTransformer, function(item, name) {
	return name + "§7\n" + Translation.translate("Increase energy tier by 1");
});

IDRegistry.genItemID("upgradeEnergyStorage");
Item.createItem("upgradeEnergyStorage", "Energy Storage Upgrade", {name: "upgrade_energy_storage", meta: 0});
Item.registerNameOverrideFunction(ItemID.upgradeEnergyStorage, function(item, name) {
	return name + "§7\n" + Translation.translate("Increase energy storage by 10k EU");
});

IDRegistry.genItemID("upgradeRedstone");
Item.createItem("upgradeRedstone", "Redstone Signal Inverter Upgrade", {name: "upgrade_redstone_inv", meta: 0});

IDRegistry.genItemID("upgradeEjector");
Item.createItem("upgradeEjector", "Ejector Upgrade", {name: "upgrade_ejector", meta: 0});
Item.registerNameOverrideFunction(ItemID.upgradeEjector, function(item, name) {
	name += "§7\n" + Translation.translate("Automatically output to\nthe %s side").replace("%s", ItemName.getSideName(item.data-1));
	return name;
});
Item.registerIconOverrideFunction(ItemID.upgradeEjector, function(item, name) {
	return {name: "upgrade_ejector", meta: item.data}
});

IDRegistry.genItemID("upgradePulling");
Item.createItem("upgradePulling", "Pulling Upgrade", {name: "upgrade_pulling", meta: 0});
Item.registerNameOverrideFunction(ItemID.upgradePulling, function(item, name) {
	name += "§7\n" + Translation.translate("Automatically input from\nthe %s side").replace("%s", ItemName.getSideName(item.data-1));
	return name;
});
Item.registerIconOverrideFunction(ItemID.upgradePulling, function(item, name) {
	return {name: "upgrade_pulling", meta: item.data}
});

IDRegistry.genItemID("upgradeFluidEjector");
Item.createItem("upgradeFluidEjector", "Fluid Ejector Upgrade", {name: "upgrade_fluid_ejector", meta: 0});
Item.registerNameOverrideFunction(ItemID.upgradeFluidEjector, function(item, name) {
	name += "§7\n" + Translation.translate("Automatically output to\nthe %s side").replace("%s", ItemName.getSideName(item.data-1));
	return name;
});
Item.registerIconOverrideFunction(ItemID.upgradeFluidEjector, function(item, name) {
	return {name: "upgrade_fluid_ejector", meta: item.data}
});

IDRegistry.genItemID("upgradeFluidPulling");
Item.createItem("upgradeFluidPulling", "Fluid Pulling Upgrade", {name: "upgrade_fluid_pulling", meta: 0});
Item.registerNameOverrideFunction(ItemID.upgradeFluidPulling, function(item, name) {
	name += "§7\n" + Translation.translate("Automatically input from\nthe %s side").replace("%s", ItemName.getSideName(item.data-1));
	return name;
});
Item.registerIconOverrideFunction(ItemID.upgradeFluidPulling, function(item, name) {
	return {name: "upgrade_fluid_pulling", meta: item.data}
});

IDRegistry.genItemID("upgradeMFSU");
Item.createItem("upgradeMFSU", "MFSU Upgrade Kit", {name: "mfsu_upgrade", meta: 0});

Item.addCreativeGroup("ic2_upgrade", Translation.translate("Machine Upgrades"), [
	ItemID.upgradeOverclocker,
	ItemID.upgradeTransformer,
	ItemID.upgradeEnergyStorage,
	ItemID.upgradeRedstone,
	ItemID.upgradeEjector,
	ItemID.upgradePulling,
	ItemID.upgradeFluidEjector,
	ItemID.upgradeFluidPulling,
	ItemID.upgradeMFSU
]);


Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: ItemID.upgradeOverclocker, count: 2, data: 0}, [
		"aaa",
		"x#x",
	], ['#', ItemID.circuitBasic, -1, 'x', ItemID.cableCopper1, -1, 'a', ItemID.coolantCell, 1]);

	Recipes.addShaped({id: ItemID.upgradeOverclocker, count: 6, data: 0}, [
		"aaa",
		"x#x",
	], ['#', ItemID.circuitBasic, -1, 'x', ItemID.cableCopper1, -1, 'a', ItemID.coolantCell3, 1]);

	Recipes.addShaped({id: ItemID.upgradeOverclocker, count: 12, data: 0}, [
		"aaa",
		"x#x",
	], ['#', ItemID.circuitBasic, -1, 'x', ItemID.cableCopper1, -1, 'a', ItemID.coolantCell6, 1]);

	Recipes.addShaped({id: ItemID.upgradeTransformer, count: 1, data: 0}, [
		"aaa",
		"x#x",
		"aca"
	], ['#', BlockID.transformerMV, 0, 'x', ItemID.cableGold2, -1, 'a', 20, -1, 'c', ItemID.circuitBasic, -1]);

	Recipes.addShaped({id: ItemID.upgradeEnergyStorage, count: 1, data: 0}, [
		"aaa",
		"x#x",
		"aca"
	], ['#', ItemID.storageBattery, -1, 'x', ItemID.cableCopper1, -1, 'a', 5, -1, 'c', ItemID.circuitBasic, -1]);

	Recipes.addShaped({id: ItemID.upgradeRedstone, count: 1, data: 0}, [
		"x x",
		" # ",
		"x x",
	], ['x', ItemID.plateTin, -1, '#', 69, -1]);

	Recipes.addShaped({id: ItemID.upgradeEjector, count: 1, data: 0}, [
		"aba",
		"x#x",
	], ['#', ItemID.circuitBasic, -1, 'x', ItemID.cableCopper1, -1, 'a', 33, -1, 'b', 410, 0]);

	Recipes.addShaped({id: ItemID.upgradePulling, count: 1, data: 0}, [
		"aba",
		"x#x",
	], ['#', ItemID.circuitBasic, -1, 'x', ItemID.cableCopper1, -1, 'a', 29, -1, 'b', 410, 0]);

	Recipes.addShaped({id: ItemID.upgradeFluidEjector, count: 1, data: 0}, [
		"x x",
		" # ",
		"x x",
	], ['x', ItemID.plateTin, -1, '#', ItemID.electricMotor, -1]);

	Recipes.addShaped({id: ItemID.upgradeFluidPulling, count: 1, data: 0}, [
		"xcx",
		" # ",
		"x x",
	], ['x', ItemID.plateTin, -1, '#', ItemID.electricMotor, -1, 'c', ItemID.treetap, 0]);

	Recipes.addShaped({id: ItemID.upgradeMFSU, count: 1, data: 0}, [
		"aca",
		"axa",
		"aba"
	], ['b', ItemID.wrenchBronze, 0, 'a', ItemID.storageLapotronCrystal, -1, 'x', BlockID.machineBlockAdvanced, 0, 'c', ItemID.circuitAdvanced, -1]);
});


UpgradeAPI.registerUpgrade(ItemID.upgradeOverclocker, "overclocker", function(item, machine, data) {
	if (data.work_time) {
		data.energy_consume = Math.round(data.energy_consume * Math.pow(1.6, item.count));
		data.work_time = Math.round(data.work_time * Math.pow(0.7, item.count));
	}
});

UpgradeAPI.registerUpgrade(ItemID.upgradeTransformer, "transformer", function(item, machine, data) {
	let tier = data.tier + item.count;
	data.tier = Math.min(tier, 14);
});

UpgradeAPI.registerUpgrade(ItemID.upgradeEnergyStorage, "energyStorage", function(item, machine, data) {
	data.energy_storage += 10000 * item.count;
});

UpgradeAPI.registerUpgrade(ItemID.upgradeRedstone, "redstone", function(item, machine, data) {
	data.isHeating = !data.isHeating;
});

UpgradeAPI.registerUpgrade(ItemID.upgradeEjector, "itemEjector", function(item, machine, data) {
	let checkSide = item.data - 1;
	let machineStorage = StorageInterface.newStorage(machine);
	for (let side = 0; side < 6; side++) {
		if (checkSide > 0 && checkSide != side) continue;
		let storage = StorageInterface.getNeighbourStorage(machine.blockSource, machine, side);
		if (storage)
			StorageInterface.extractItemsFromStorage(storage, machineStorage, side);
	}
});

UpgradeAPI.registerUpgrade(ItemID.upgradePulling, "itemPulling", function(item, machine, data) {
	if (World.getThreadTime()%20 == 0) {
		let checkSide = item.data - 1;
		let machineStorage = StorageInterface.newStorage(machine);
		for (let side = 0; side < 6; side++) {
			if (checkSide > 0 && checkSide != side) continue;
			let storage = StorageInterface.getNeighbourStorage(machine.blockSource, machine, side);
			if (storage)
				StorageInterface.extractItemsFromStorage(machineStorage, storage, side);
		}
	}
});

UpgradeAPI.registerUpgrade(ItemID.upgradeFluidEjector, "fluidEjector", function(item, machine, data) {
	let machineStorage = StorageInterface.newStorage(machine);
	let liquid = machineStorage.getLiquidStored("output");
	if (!liquid) return;

	let checkSide = item.data - 1;
	for (let side = 0; side < 6; side++) {
		if (checkSide > 0 && checkSide != side) continue;
		let storage = StorageInterface.getNeighbourLiquidStorage(machine.blockSource, machine, side);
		if (storage)
			StorageInterface.transportLiquid(liquid, 0.25, machineStorage, storage, side);
	}
});

UpgradeAPI.registerUpgrade(ItemID.upgradeFluidPulling, "fluidPulling", function(item, machine, data) {
	let machineStorage = StorageInterface.newStorage(machine);
	let checkSide = item.data - 1;
	for (let side = 0; side < 6; side++) {
		if (checkSide > 0 && checkSide != side) continue;
		let liquid = machineStorage.getLiquidStored("input");
		let storage = StorageInterface.getNeighbourLiquidStorage(machine.blockSource, machine, side);
		if (storage)
			StorageInterface.extractLiquid(liquid, 0.25, machineStorage, storage, side);
	}
});


Item.registerUseFunction("upgradeMFSU", function(coords, item, block, player) {
	if (block.id == BlockID.storageMFE) {
		let tile = World.getTileEntity(coords.x ,coords.y, coords.z);
		tile.selfDestroy();
		World.setBlock(coords.x, coords.y, coords.z, BlockID.storageMFSU, tile.getFacing());
		let newTile = World.addTileEntity(coords.x, coords.y, coords.z);
		newTile.data = tile.data;
		Entity.setCarriedItem(player, item.id, item.count - 1, 0);
	}
});

Item.registerUseFunction("upgradePulling", function(coords, item, block, player) {
	if (item.data == 0) {
		Entity.setCarriedItem(player, ItemID.upgradePulling, item.count, coords.side+1);
	} else {
		Entity.setCarriedItem(player, ItemID.upgradePulling, item.count, 0);
	}
});

Item.registerUseFunction("upgradeEjector", function(coords, item, block, player) {
	if (item.data == 0) {
		Entity.setCarriedItem(player, ItemID.upgradeEjector, item.count, coords.side+1);
	} else {
		Entity.setCarriedItem(player, ItemID.upgradeEjector, item.count, 0);
	}
});

Item.registerUseFunction("upgradeFluidEjector", function(coords, item, block, player) {
	if (item.data == 0) {
		Entity.setCarriedItem(player, ItemID.upgradeFluidEjector, item.count, coords.side+1);
	} else {
		Entity.setCarriedItem(player, ItemID.upgradeFluidEjector, item.count, 0);
	}
});

Item.registerUseFunction("upgradeFluidPulling", function(coords, item, block, player) {
	if (item.data == 0) {
		Entity.setCarriedItem(player, ItemID.upgradeFluidPulling, item.count, coords.side+1);
	} else {
		Entity.setCarriedItem(player, ItemID.upgradeFluidPulling, item.count, 0);
	}
});
