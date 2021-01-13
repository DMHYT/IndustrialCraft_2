ItemRegistry.createItem("toolbox", {name: "tool_box", icon: "tool_box", stack: 1, category: CreativeCategory.EQUIPMENT});

Recipes.addShaped({id: ItemID.toolbox, count: 1, data: 0}, [
	"axa",
	"aaa",
], ['x', 54, -1, 'a', ItemID.casingBronze, 0]);

let toolbox_items = [
	ItemID.treetap, ItemID.craftingHammer, ItemID.cutter, ItemID.electricHoe, ItemID.electricTreetap, ItemID.EUMeter,
	ItemID.cableTin0, ItemID.cableTin1, ItemID.cableCopper0, ItemID.cableCopper1,
	ItemID.cableGold0, ItemID.cableGold1, ItemID.cableGold2,
	ItemID.cableIron0, ItemID.cableIron1, ItemID.cableIron2, ItemID.cableIron3, ItemID.cableOptic
];

BackpackRegistry.register(ItemID.toolbox, {
	title: "Tool Box",
	slots: 10,
	inRow: 5,
	slotsCenter: true,
	isValidItem: function(id, count, data) {
		if (toolbox_items.indexOf(id) != -1) return true;
		if (ToolAPI.getToolData(id) || ICTool.getWrenchData(id)) return true;
		return false;
	}
});