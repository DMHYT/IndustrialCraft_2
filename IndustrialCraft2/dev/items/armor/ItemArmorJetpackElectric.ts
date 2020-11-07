/// <reference path="./ItemArmorElectric.ts" />

class ItemArmorJetpackElectric
extends ItemArmorElectric {
	constructor() {
		super("jetpack", "electric_jetpack", {type: "chestplate", defence: 3, texture: "electric_jetpack"}, 30000, 100, 1);
		UIbuttons.setArmorButton(this.id, "button_fly");
		UIbuttons.setArmorButton(this.id, "button_hover");
	}

	getIcon(armorName: string): string {
		return armorName;
	}

	onHurt(params: {attacker: number, damage: number, type: number}, item: ItemInstance, index: number, player: number): ItemInstance {
		if (params.type == 5) {
			Utils.fixFallDamage(params.damage);
		}
		return item;
	}

	onTick(item: ItemInstance, index: number, player: number): ItemInstance {
		let energyStored = ChargeItemRegistry.getEnergyStored(item);
		if (item.extra && item.extra.getBoolean("hover")) {
			Utils.resetFallHeight();
			let vel = Entity.getVelocity(player);
			if (Utils.isPlayerOnGround() || energyStored < 8) {
				item.extra.putBoolean("hover", false);
				Game.message("§4" + Translation.translate("Hover mode disabled"));
				return item;
			}
			else if (vel.y < -0.1) {
				Entity.addVelocity(player, 0, Math.min(0.25, -0.1 - vel.y), 0);
				if (World.getThreadTime()%5 == 0) {
					ChargeItemRegistry.setEnergyStored(item, Math.max(energyStored - 20, 0));
					return item
				}
			}
		}
		return null;
	}
}