IDRegistry.genItemID("storageBattery");
Item.createItem("storageBattery", "RE-Battery", { name: "re_battery", meta: 0 }, { stack: 1, isTech: true });
Item.addToCreative(ItemID.storageBattery, 1, 27);
ChargeItemRegistry.registerExtraItem(ItemID.storageBattery, "Eu", 10000, 100, 1, "storage", true, true);
IDRegistry.genItemID("storageAdvBattery");
Item.createItem("storageAdvBattery", "Advanced RE-Battery", { name: "adv_re_battery", meta: 0 }, { stack: 1, isTech: true });
Item.addToCreative(ItemID.storageAdvBattery, 1, 27);
ChargeItemRegistry.registerExtraItem(ItemID.storageAdvBattery, "Eu", 100000, 256, 2, "storage", true, true);
IDRegistry.genItemID("storageCrystal");
Item.createItem("storageCrystal", "Energy Crystal", { name: "energy_crystal", meta: 0 }, { stack: 1, isTech: true });
Item.addToCreative(ItemID.storageCrystal, 1, 27);
ChargeItemRegistry.registerExtraItem(ItemID.storageCrystal, "Eu", 1000000, 2048, 3, "storage", true, true);
IDRegistry.genItemID("storageLapotronCrystal");
Item.createItem("storageLapotronCrystal", "Lapotron Crystal", { name: "lapotron_crystal", meta: 0 }, { stack: 1, isTech: true });
Item.addToCreative(ItemID.storageLapotronCrystal, 1, 27);
ChargeItemRegistry.registerExtraItem(ItemID.storageLapotronCrystal, "Eu", 10000000, 8192, 4, "storage", true, true);
ItemName.setRarity(ItemID.storageLapotronCrystal, 1);
IDRegistry.genItemID("debugItem");
Item.createItem("debugItem", "Debug Item", { name: "debug_item", meta: 0 }, { isTech: !Config.debugMode });
ChargeItemRegistry.registerItem(ItemID.debugItem, "Eu", -1, -1, 0, "storage");
Item.addCreativeGroup("batteryEU", Translation.translate("Batteries"), [
    ItemID.storageBattery,
    ItemID.storageAdvBattery,
    ItemID.storageCrystal,
    ItemID.storageLapotronCrystal,
    ItemID.debugItem
]);
Item.registerNameOverrideFunction(ItemID.storageBattery, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.storageAdvBattery, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.storageCrystal, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.storageLapotronCrystal, ItemName.showItemStorage);
Item.registerIconOverrideFunction(ItemID.storageBattery, function (item) {
    return { name: "re_battery", meta: Math.round((27 - item.data) / 26 * 4) };
});
Item.registerIconOverrideFunction(ItemID.storageAdvBattery, function (item) {
    return { name: "adv_re_battery", meta: Math.round((27 - item.data) / 26 * 4) };
});
Item.registerIconOverrideFunction(ItemID.storageCrystal, function (item) {
    return { name: "energy_crystal", meta: Math.round((27 - item.data) / 26 * 4) };
});
Item.registerIconOverrideFunction(ItemID.storageLapotronCrystal, function (item) {
    return { name: "lapotron_crystal", meta: Math.round((27 - item.data) / 26 * 4) };
});
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: ItemID.storageBattery, count: 1, data: Item.getMaxDamage(ItemID.storageBattery) }, [
        " x ",
        "c#c",
        "c#c"
    ], ['x', ItemID.cableTin1, 0, 'c', ItemID.casingTin, 0, '#', 331, 0]);
    Recipes.addShaped({ id: ItemID.storageAdvBattery, count: 1, data: Item.getMaxDamage(ItemID.storageAdvBattery) }, [
        "xbx",
        "bab",
        "bcb"
    ], ['x', ItemID.cableCopper1, 0, 'a', ItemID.dustSulfur, 0, 'b', ItemID.casingBronze, 0, 'c', ItemID.dustLead, 0]);
    Recipes.addShaped({ id: ItemID.storageLapotronCrystal, count: 1, data: Item.getMaxDamage(ItemID.storageLapotronCrystal) }, [
        "x#x",
        "xax",
        "x#x"
    ], ['a', ItemID.storageCrystal, -1, 'x', ItemID.dustLapis, 0, '#', ItemID.circuitAdvanced, 0], ChargeItemRegistry.transferEnergy);
});
ChargeItemRegistry.registerChargeFunction(ItemID.debugItem, function (item, amount, transf, level) {
    return amount;
});
ChargeItemRegistry.registerDischargeFunction(ItemID.debugItem, function (item, amount, transf, level) {
    return amount;
});
Item.registerUseFunction("debugItem", function (coords, item, block) {
    Game.message(block.id + ":" + block.data);
    var tile = World.getTileEntity(coords.x, coords.y, coords.z);
    if (tile) {
        var liquid = tile.liquidStorage.getLiquidStored();
        if (liquid) {
            Game.message(liquid + " - " + tile.liquidStorage.getAmount(liquid) * 1000 + "mB");
        }
        for (var i in tile.data) {
            if (i != "energy_storage") {
                if (i == "__liquid_tanks") {
                    var tanks = tile.data[i];
                    Game.message(tanks.input.liquid + ": " + tanks.input.amount * 1000 + "mB");
                    Game.message(tanks.output.liquid + ": " + tanks.output.amount * 1000 + "mB");
                }
                else if (i == "energy") {
                    Game.message("energy: " + tile.data[i] + "/" + tile.getEnergyStorage());
                }
                else
                    try {
                        Game.message(i + ": " + tile.data[i]);
                    }
                    catch (e) {
                        Game.message(i);
                    }
            }
        }
    }
    tile = EnergyTileRegistry.accessMachineAtCoords(coords.x, coords.y, coords.z);
    if (tile) {
        for (var i in tile.__energyNets) {
            var net = tile.__energyNets[i];
            if (net)
                Game.message(net.toString());
        }
    }
    else {
        var net = EnergyNetBuilder.getNetOnCoords(coords.x, coords.y, coords.z);
        if (net)
            Game.message(net.toString());
    }
});
