var AgricultureAPI = {
    cropCards:[],
    abstractFunctions:{/* file: baseCropClasses.js */},
    nutrientBiomeBonusValue:{/* file: biome_bonuses.js */},
    registerCropCard: function(card) {
        if (!card.texture) card.texture = card.id;
        if (card.base) {
            var funcs = AgricultureAPI.abstractFunctions[card.base];
            if (funcs) this.addMissingFuncsToCard(card, funcs);
        }

        this.addMissingFuncsToCard(card, AgricultureAPI.abstractFunctions["IC2CropCard"]);
        this.cropCards.push(card);

        if (card.baseSeed.addToCreative != false) {
            let extra = this.getDefaultExtra(this.cropCards.length - 1);
            Item.addToCreative(ItemID.cropSeedBag, 1, this.cropCards.length - 1, extra);
		}
    },
    addMissingFuncsToCard: function(card, functions) {
        for (var funcName in functions) {
            if (!card[funcName]) {
                card[funcName] = functions[funcName];
            }
        }
    },
    getCropCard: function(id) {
        for (var i in this.cropCards) {
            if (this.cropCards[i].id == id)
				return this.cropCards[i];
        }
		return null;
    },
    getCardIndexFromID: function(id) {
        for (var i in this.cropCards) {
            if (this.cropCards[i].id == id) return i;
        }
		return null;
    },
    getHumidityBiomeBonus: function(x, z) {
        return 0;
    },
    getNutrientBiomeBonus: function(x, z) {
        var biomeID = World.getBiome(x, z);
        var bonus = AgricultureAPI.nutrientBiomeBonusValue[biomeID];
        return bonus || 0;
    },
    getCardFromSeed: function(item) {
        for (var i in this.cropCards) {
            var seed = this.cropCards[i].baseSeed;
            if (seed && eval(seed.id) == item.id && (!seed.data || seed.data == item.data)) {
				return this.cropCards[i];
            }
        }
        return null;
    },
    generateExtraFromValues: function(data) {
        var extra = new ItemExtraData();
        extra.putInt("growth", data.statGrowth);
        extra.putInt("gain", data.statGain);
        extra.putInt("resistance", data.statResistance);
        extra.putInt("scan", data.scanLevel);
        return extra;
    },
    getDefaultExtra: function(cardIndex) {
        var extra = new ItemExtraData();
        var card = AgricultureAPI.cropCards[cardIndex];
        extra.putInt("growth", card.baseSeed.growth);
        extra.putInt("gain", card.baseSeed.gain);
        extra.putInt("resistance", card.baseSeed.resistance);
        extra.putInt("scan", 4);
        return extra;
    }
};