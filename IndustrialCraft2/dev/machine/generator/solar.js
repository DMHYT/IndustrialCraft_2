IDRegistry.genBlockID("solarPanel");
Block.createBlock("solarPanel", [
	{name: "Solar Panel", texture: [["machine_bottom", 0], ["solar_panel", 0], ["machine", 0], ["machine", 0], ["machine", 0], ["machine", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.solarPanel, "stone", 1, true);

MachineRegistry.setMachineDrop("solarPanel", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.solarPanel, count: 1, data: 0}, [
		"aaa",
		"xxx",
		"b#b"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.dustCoal, 0, 'b', ItemID.circuitBasic, 0, 'a', 20, -1]);
});


var guiSolarPanel = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Solar Panel")}},
		inventory: {standart: true},
		background: {standart: true}
	},

	elements: {
		"slotEnergy": {type: "slot", x: 600, y: 130, isValid: function(id) {return ChargeItemRegistry.isValidItem(id, "Eu", 1);}},
		"sun": {type: "image", x: 608, y: 194, bitmap: "sun_off", scale: GUI_SCALE}
	}
});

Callback.addCallback("LevelLoaded", function() {
	MachineRegistry.updateGuiHeader(guiSolarPanel, "Solar Panel");
});


MachineRegistry.registerGenerator(BlockID.solarPanel, {
	defaultValues: {
		canSeeSky: false
	},
	
	getGuiScreen: function() {
		return guiSolarPanel;
	},
	
	init: function() {
		this.data.canSeeSky = this.blockSource.canSeeSky(this.x, this.y + 1, this.z);
	},
	
	tick: function() {
		var content = this.container.getGuiContent();
		if (World.getThreadTime()%100 == 0) {
			this.data.canSeeSky = this.blockSource.canSeeSky(this.x, this.y + 1, this.z);
		}
		if (this.data.canSeeSky && this.blockSource.getLightLevel(this.x, this.y + 1, this.z) == 15) {
			this.data.energy = 1;
			this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotEnergy"), "Eu", 1, 1);
			if (content) { 
				content.elements["sun"].bitmap = "sun_on";
			}
		}
		else if (content) { 
			content.elements["sun"].bitmap = "sun_off";
		}
	},
	
	getEnergyStorage: function() {
		return 1;
	},
	
	energyTick: function(type, src) {
		if (this.data.energy) {
			src.addAll(1);
			this.data.energy = 0;
		}
	}
});
