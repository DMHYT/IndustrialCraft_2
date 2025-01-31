/// <reference path="ElectricTool.ts" />

class ElectricHoe extends ElectricTool {
	energyPerUse = 50;

	constructor() {
		super("electricHoe", "electric_hoe", 10000, 100, 1);
		this.setToolParams({energyPerUse: 50, level: 3, efficiency: 12, damage: 4, blockMaterials: ["plant"]});
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
		if ((block.id == 2 || block.id == 3 || block.id == 110 || block.id == 243) && coords.side != 0 && ICTool.useElectricItem(item, this.energyPerUse, player)) {
			let region = WorldRegion.getForActor(player);
			region.setBlock(coords, 60, 0);
			region.playSound(coords.x + .5, coords.y + 1, coords.z + .5, "step.gravel", 1, 0.8);
		}
	}
}
