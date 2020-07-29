IDRegistry.genItemID("drill");
IDRegistry.genItemID("diamondDrill");
IDRegistry.genItemID("iridiumDrill");
Item.createItem("drill", "Mining Drill", { name: "drill" }, { stack: 1, isTech: true });
Item.createItem("diamondDrill", "Diamond Drill", { name: "drill_diamond" }, { stack: 1, isTech: true });
Item.createItem("iridiumDrill", "Iridium Drill", { name: "drill_iridium" }, { stack: 1, isTech: true });
Item.setGlint(ItemID.iridiumDrill, true);
ItemName.setRarity(ItemID.iridiumDrill, 2);
Item.addCreativeGroup("ic2_drills", Translation.translate("Mining Drills"), [
    ItemID.drill,
    ItemID.diamondDrill,
    ItemID.iridiumDrill
]);
ChargeItemRegistry.registerExtraItem(ItemID.drill, "Eu", 30000, 100, 1, "tool", true, true);
ChargeItemRegistry.registerExtraItem(ItemID.diamondDrill, "Eu", 30000, 100, 1, "tool", true, true);
ChargeItemRegistry.registerExtraItem(ItemID.iridiumDrill, "Eu", 1000000, 2048, 3, "tool", true, true);
Item.registerNameOverrideFunction(ItemID.drill, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.diamondDrill, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.iridiumDrill, function (item, name) {
    name = ItemName.showItemStorage(item, name);
    var mode = item.extra ? item.extra.getInt("mode") : 0;
    switch (mode) {
        case 0:
            name += "\n" + Translation.translate("Mode: ") + Translation.translate("Fortune III");
            break;
        case 1:
            name += "\n" + Translation.translate("Mode: ") + Translation.translate("Silk Touch");
            break;
        case 2:
            name += "\n" + Translation.translate("Mode: ") + "3x3 " + Translation.translate("Fortune III");
            break;
        case 3:
            name += "\n" + Translation.translate("Mode: ") + "3x3 " + Translation.translate("Silk Touch");
            break;
    }
    return name;
});
Recipes.addShaped({ id: ItemID.drill, count: 1, data: 27 }, [
    " p ",
    "ppp",
    "pxp"
], ['x', ItemID.powerUnit, 0, 'p', ItemID.plateIron, 0]);
Recipes.addShaped({ id: ItemID.diamondDrill, count: 1, data: 27 }, [
    " a ",
    "ada"
], ['d', ItemID.drill, -1, 'a', 264, 0], ChargeItemRegistry.transferEnergy);
Recipes.addShaped({ id: ItemID.iridiumDrill, count: 1, data: 27 }, [
    " a ",
    "ada",
    " e "
], ['d', ItemID.diamondDrill, -1, 'e', ItemID.storageCrystal, -1, 'a', ItemID.plateReinforcedIridium, 0], ChargeItemRegistry.transferEnergy);
UIbuttons.setToolButton(ItemID.iridiumDrill, "button_switch");
UIbuttons.registerSwitchFunction(ItemID.iridiumDrill, function (item) {
    var extra = item.extra;
    if (!extra) {
        extra = new ItemExtraData();
    }
    var mode = (extra.getInt("mode") + 1) % 4;
    extra.putInt("mode", mode);
    switch (mode) {
        case 0:
            Game.message("§e" + Translation.translate("Mode: ") + Translation.translate("Fortune III"));
            break;
        case 1:
            Game.message("§9" + Translation.translate("Mode: ") + Translation.translate("Silk Touch"));
            break;
        case 2:
            Game.message("§c" + Translation.translate("Mode: ") + "3x3 " + Translation.translate("Fortune III"));
            break;
        case 3:
            Game.message("§2" + Translation.translate("Mode: ") + "3x3 " + Translation.translate("Silk Touch"));
            break;
    }
    Player.setCarriedItem(item.id, 1, item.data, extra);
});
ToolType.drill = {
    damage: 0,
    blockTypes: ["stone", "dirt"],
    onDestroy: function (item, coords, block) {
        if (Block.getDestroyTime(block.id) > 0) {
            ICTool.dischargeItem(item, this.toolMaterial.energyPerUse);
            this.playDestroySound(item, block);
        }
        return true;
    },
    onBroke: function (item) { return true; },
    onAttack: function (item, mob) {
        ICTool.dischargeItem(item, this.toolMaterial.energyPerUse);
        return true;
    },
    calcDestroyTime: function (item, coords, block, params, destroyTime, enchant) {
        if (ChargeItemRegistry.getEnergyStored(item) >= this.toolMaterial.energyPerUse) {
            return destroyTime;
        }
        return params.base;
    },
    useItem: function (coords, item, block) {
        var place = coords;
        if (!World.canTileBeReplaced(block.id, block.data)) {
            place = coords.relative;
            var tile = World.getBlock(place.x, place.y, place.z);
            if (!World.canTileBeReplaced(tile.id, tile.data)) {
                return;
            }
        }
        for (var i_1 = 9; i_1 < 45; i_1++) {
            var slot = Player.getInventorySlot(i_1);
            if (slot.id == 50) {
                if (Block.isSolid(block.id)) {
                    World.setBlock(place.x, place.y, place.z, 50, (6 - coords.side) % 6);
                }
                else {
                    block = World.getBlock(place.x, place.y - 1, place.z);
                    if (Block.isSolid(block.id)) {
                        World.setBlock(place.x, place.y, place.z, 50, 5);
                    }
                    else {
                        break;
                    }
                }
                slot.count--;
                if (slot.count == 0)
                    slot.id = 0;
                Player.setInventorySlot(i_1, slot.id, slot.count, 0);
                break;
            }
        }
    },
    continueDestroyBlock: function (item, coords, block, progress) {
        if (progress > 0) {
            this.playDestroySound(item, block);
        }
    },
    playDestroySound: function (item, block) {
        if (Config.soundEnabled && ChargeItemRegistry.getEnergyStored(item) >= this.toolMaterial.energyPerUse) {
            var hardness = Block.getDestroyTime(block.id);
            if (hardness > 1 || hardness < 0) {
                SoundManager.startPlaySound(AudioSource.PLAYER, "DrillHard.ogg");
            }
            else if (hardness > 0) {
                SoundManager.startPlaySound(AudioSource.PLAYER, "DrillSoft.ogg");
            }
        }
    }
};
ToolLib.setTool(ItemID.drill, { energyPerUse: 50, level: 3, efficiency: 8, damage: 3 }, ToolType.drill);
ToolLib.setTool(ItemID.diamondDrill, { energyPerUse: 80, level: 4, efficiency: 16, damage: 4 }, ToolType.drill);
ToolLib.setTool(ItemID.iridiumDrill, { energyPerUse: 800, level: 100, efficiency: 24, damage: 5 }, {
    damage: 0,
    blockTypes: ["stone", "dirt"],
    modifyEnchant: function (enchant, item) {
        var mode = item.extra ? item.extra.getInt("mode") : 0;
        if (mode % 2) {
            enchant.silk = true;
        }
        else {
            enchant.fortune = 3;
        }
    },
    onDestroy: ToolType.drill.onDestroy,
    onBroke: function (item) { return true; },
    onAttack: ToolType.drill.onAttack,
    calcDestroyTime: function (item, coords, block, params, destroyTime) {
        if (ChargeItemRegistry.getEnergyStored(item) >= 800) {
            var mode = item.extra ? item.extra.getInt("mode") : 0;
            var material = ToolAPI.getBlockMaterialName(block.id);
            if (mode >= 2 && (material == "dirt" || material == "stone")) {
                destroyTime = 0;
                var side = coords.side;
                var X = 1;
                var Y = 1;
                var Z = 1;
                if (side == BlockSide.EAST || side == BlockSide.WEST)
                    X = 0;
                if (side == BlockSide.UP || side == BlockSide.DOWN)
                    Y = 0;
                if (side == BlockSide.NORTH || side == BlockSide.SOUTH)
                    Z = 0;
                for (var xx = coords.x - X; xx <= coords.x + X; xx++) {
                    for (var yy = coords.y - Y; yy <= coords.y + Y; yy++) {
                        for (var zz = coords.z - Z; zz <= coords.z + Z; zz++) {
                            var blockID = World.getBlockID(xx, yy, zz);
                            material = ToolAPI.getBlockMaterialName(blockID);
                            if (material == "dirt" || material == "stone") {
                                destroyTime = Math.max(destroyTime, Block.getDestroyTime(blockID) / material.multiplier / 24);
                            }
                        }
                    }
                }
            }
            return destroyTime;
        }
        return params.base;
    },
    destroyBlock: function (coords, side, item, block) {
        this.playDestroySound(item, block);
        var mode = item.extra ? item.extra.getInt("mode") : 0;
        var material = ToolAPI.getBlockMaterialName(block.id);
        var energyStored = ChargeItemRegistry.getEnergyStored(item);
        if (mode >= 2 && (material == "dirt" || material == "stone") && energyStored >= 800) {
            var X = 1;
            var Y = 1;
            var Z = 1;
            if (side == BlockSide.EAST || side == BlockSide.WEST)
                X = 0;
            if (side == BlockSide.UP || side == BlockSide.DOWN)
                Y = 0;
            if (side == BlockSide.NORTH || side == BlockSide.SOUTH)
                Z = 0;
            for (var xx = coords.x - X; xx <= coords.x + X; xx++) {
                for (var yy = coords.y - Y; yy <= coords.y + Y; yy++) {
                    for (var zz = coords.z - Z; zz <= coords.z + Z; zz++) {
                        if (xx == coords.x && yy == coords.y && zz == coords.z) {
                            continue;
                        }
                        var blockID = World.getBlockID(xx, yy, zz);
                        material = ToolAPI.getBlockMaterialName(blockID);
                        if (material == "dirt" || material == "stone") {
                            energyStored -= 800;
                            World.destroyBlock(xx, yy, zz, true);
                            if (energyStored < 800) {
                                ChargeItemRegistry.setEnergyStored(item, energyStored);
                                Player.setCarriedItem(item.id, 1, item.data, item.extra);
                                return;
                            }
                        }
                    }
                }
            }
            ChargeItemRegistry.setEnergyStored(item, energyStored);
            Player.setCarriedItem(item.id, 1, item.data, item.extra);
        }
    },
    useItem: ToolType.drill.useItem,
    continueDestroyBlock: ToolType.drill.continueDestroyBlock,
    playDestroySound: ToolType.drill.playDestroySound,
});
