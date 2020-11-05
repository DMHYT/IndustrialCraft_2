var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
  ___               _                 _            _           _      ____                    __   _
 ║_ _║  _ __     __║ ║  _   _   ___  ║ ║_   _ __  ║_║   __ _  ║ ║    / ___║  _ __    __ _   _/ _║ ║ ║_
  ║ ║  ║ '_ \   / _` ║ ║ ║ ║ ║ / __║ ║ __║ ║ '__║ ,─╗  / _` ║ ║ ║   ║ ║     ║ '__║  / _` ║ [  _]  ║ __║
  ║ ║  ║ ║ ║ ║ ║ (_║ ║ ║ ║_║ ║ \__ \ ║ ║_  ║ ║    ║ ║ ║ (_║ ║ ║ ║   ║ ║___  ║ ║    ║ (_║ ║  ║ ║   ║ ║_
 ║___║ ║_║ ║_║  \__,_║  \__,_║ |___/  \__║ ║_║    ║_║  \__,_║ ║_║    \____║ ║_║     \__,_║  ║_║    \__║
 
 by MineExplorer (vk.com/vlad.gr2027) and NikolaySavenko (vk.com/savenkons)
 based on Industrial Core by zheka_smirnov (vk.com/zheka_smirnov)

 This code is a copyright, do not distribute.
*/
// libraries
IMPORT("TypeEngine");
IMPORT("flags");
IMPORT("Vector");
IMPORT("ToolLib");
IMPORT("EnergyNet");
IMPORT("ChargeItem");
IMPORT("TileRender");
IMPORT("StorageInterface");
IMPORT("LiquidLib");
IMPORT("SoundLib");
IMPORT("BackpackAPI");
// constants
var GUI_SCALE = 3.2;
var GUI_SCALE_NEW = 3;
var fallVelocity = -0.0784;
var ELECTRIC_ITEM_MAX_DAMAGE = 27;
// import values
var nativeDropItem = ModAPI.requireGlobal("Level.dropItem");
var Color = android.graphics.Color;
var PotionEffect = Native.PotionEffect;
var ParticleType = Native.ParticleType;
var BlockSide = Native.BlockSide;
var EntityType = Native.EntityType;
// energy (Eu)
var EU = EnergyTypeRegistry.assureEnergyType("Eu", 1);
// API
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function addShapelessRecipe(result, source) {
    var ingredients = [];
    for (var i in source) {
        var item = source[i];
        for (var n = 0; n < item.count; n++) {
            ingredients.push(item);
        }
    }
    Recipes.addShapeless(result, ingredients);
}
// vanilla items
Recipes.addFurnaceFuel(325, 10, 2000); // lava bucket
ChargeItemRegistry.registerFlashItem(331, "Eu", 800, 0); // redstone
// Recipe debug
/*
var workbenchAddShaped = Recipes.addShaped;
Recipes.addShaped = function(result, scheme, keys) {
    Logger.Log("Shaped recipe: "+result.id+", "+result.count+", "+result.data, "DEBUG");
    workbenchAddShaped(result, scheme, keys);
}

var workbenchAddShapeless = Recipes.addShapeless;
Recipes.addShapeless = function(result, input) {
    Logger.Log("Shapeless recipe: "+result.id+", "+result.count+", "+result.data, "DEBUG");
    workbenchAddShapeless(result, input);
}
*/
// delete temporary files
var File = java.io.File;
var FileWriter = java.io.FileWriter;
var target_path = __packdir__ + "assets/definitions/recipe";
var source_path = __dir__ + "assets/res/definitions/recipe";
var files = new File(source_path).list();
for (var i_1 in files) {
    try {
        var fileName = files[i_1];
        new File(target_path, fileName).delete();
    }
    catch (e) {
        Logger.Log(e, "ERROR");
    }
}
// BLOCKS
Translation.addTranslation("Rubber Tree Log", { ru: "Древесина гевеи", es: "Madera de Árbol de Caucho", pt: "Madeira de Seringueira", zh: "橡胶树原木" });
Translation.addTranslation("Rubber Tree Leaves", { ru: "Листва гевеи", es: "Hojas de Arbol de Cáucho", pt: "Folhas de Seringueira", zh: "橡胶树树叶" });
Translation.addTranslation("Rubber Tree Sapling", { ru: "Саженец гевеи", es: "Pimpollo de Árbol de Caucho", pt: "Muda de Seringueira", zh: "橡胶树树苗" });
Translation.addTranslation("Copper Ore", { ru: "Медная руда", es: "Mineral de Cobre", pt: "Minério de Cobre", zh: "铜矿石" });
Translation.addTranslation("Tin Ore", { ru: "Оловянная руда", es: "Mineral de Estaño", pt: "Minério de Estanho", zh: "锡矿石" });
Translation.addTranslation("Lead Ore", { ru: "Свинцовая руда", es: "Mineral de Plomo", pt: "Minério de Chumbo", zh: "铅矿石" });
Translation.addTranslation("Uranium Ore", { ru: "Урановая руда", es: "Mineral de Uranium", pt: "Minério de Urânio", zh: "铀矿石" });
Translation.addTranslation("Iridium Ore", { ru: "Иридиевая руда", es: "Mineral de Iridio", pt: "Minério de Irídio", zh: "铱矿石" });
Translation.addTranslation("Copper Block", { ru: "Медный блок", es: "Bloque de Cobre", pt: "Bloco de Cobre", zh: "铜块" });
Translation.addTranslation("Tin Block", { ru: "Оловянный блок", es: "Bloque de Estaño", pt: "Bloco de Estanho", zh: "锡块" });
Translation.addTranslation("Bronze Block", { ru: "Бронзовый блок", es: "Bloque de Bronce", pt: "Bloco de Bronze", zh: "青铜块" });
Translation.addTranslation("Lead Block", { ru: "Свинцовый блок", es: "Bloque de Plomo", pt: "Bloco de Chumbo", zh: "铅块" });
Translation.addTranslation("Steel Block", { ru: "Стальной блок", es: "Bloque de Hierro Refinado", pt: "Bloco de Aço", zh: "钢块" });
Translation.addTranslation("Silver Block", { ru: "Серебряный блок", es: "Bloque de Plata", pt: "Bloco de Prata", zh: "银块" });
Translation.addTranslation("Uranium Block", { ru: "Урановый блок", es: "Bloque de Uranio", pt: "Bloco de Urânio", zh: "铀块" });
Translation.addTranslation("Mining Pipe", { ru: "Буровая труба", es: "Tubo Minero", pt: "Tubo de Mineração", zh: "采矿管道" });
Translation.addTranslation("Reinforced Stone", { ru: "Укреплённый камень", es: "Piedra Reforzada", pt: "Pedra Reforçada", zh: "防爆石" });
Translation.addTranslation("Reinforced Glass", { ru: "Укреплённое стекло", es: "Cristal Reforzado", pt: "Vidro Reforçado", zh: "防爆玻璃" });
Translation.addTranslation("Machine Block", { ru: "Машинный блок", es: "Máquina", pt: "Estrutura de Máquina Básica", zh: "基础机械外壳" });
Translation.addTranslation("Advanced Machine Block", { ru: "Улучшенный машинный блок", es: "Máquina Avanzada", pt: "Estrutura de Máquina Avançada", zh: "高级机械外壳" });
// Generators
Translation.addTranslation("Generator", { ru: "Генератор", es: "Generador", pt: "Gerador", zh: "火力发电机" });
Translation.addTranslation("Geothermal Generator", { ru: "Геотермальный генератор", es: "Generador Geotérmico", pt: "Gerador Geotérmico", zh: "地热发电机" });
Translation.addTranslation("Solar Panel", { ru: "Солнечная панель", es: "Panel Solar", pt: "Painel Solar", zh: "太阳能发电机" });
Translation.addTranslation("Water Mill", { ru: "Гидрогенератор", es: "Molino de Agua", pt: "Gerador Aquático", zh: "水力发电机" });
Translation.addTranslation("Wind Mill", { ru: "Ветрогенератор", es: "Molino de Viento", pt: "Cata-vento", zh: "风力发电机" });
Translation.addTranslation("Radioisotope Thermoelectric Generator", { ru: "Радиоизотопный термоэлектрический генератор", es: "Generador Radioisotopos Termoeléctrico", pt: "Gerador Termoelétrico de Radioisótopos", zh: "放射性同位素温差发电机" });
Translation.addTranslation("Semifluid Generator", { ru: "Полужидкостный генератор", es: "Generador a Semifluidos", pt: "Gerador à Semi-Fluidos", zh: "半流质发电机" });
Translation.addTranslation("Stirling Generator", { ru: "Генератор Стирлинга", es: "Generador Stirling", pt: "Gerador à Calor", zh: "斯特林发电机" });
Translation.addTranslation("Nuclear Reactor", { ru: "Ядерный реактор", es: "Reactor Nuclear", pt: "Reator Nuclear", zh: "核反应堆" });
Translation.addTranslation("Reactor Chamber", { ru: "Реакторная камера", es: "Cámara del Reactor", pt: "Câmara de Reator", zh: "核反应仓" });
// Heat Generators
Translation.addTranslation("Liquid Fuel Firebox", { ru: "Жидкостный теплогенератор", es: "Generador de Calor Líquido", pt: "Aquecedor à Combustível Líquido", zh: "流体加热机" });
Translation.addTranslation("Solid Fuel Firebox", { ru: "Твердотопливный теплогенератор", es: "Generador de calor sólido", pt: "Aquecedor à Combustível Sólido", zh: "固体加热机" });
Translation.addTranslation("Electric Heater", { ru: "Электрический теплогенератор", es: "Generador Eléctrico De Calor", pt: "Aquecedor Elétrico", zh: "电力加热机" });
Translation.addTranslation("Radioisotope Heat Generator", { ru: "Радиоизотопный теплогенератор", es: "Generador de Calor de Radioisótopos", pt: "Aquecedor à Radioisótopos", zh: "放射性同位素温差加热机" });
// Energy storage
Translation.addTranslation("BatBox", { ru: "Энергохранилище", es: "Caja de Baterías", pt: "Caixa de Baterias (CB)", zh: "储电箱" });
Translation.addTranslation("CESU", { ru: "МЭСН", es: "Unidad CESU", pt: "Unidade de Armazenamento de Energia (UAE)", zh: "CESU储电箱" });
Translation.addTranslation("MFE", { ru: "МФЭ", es: "Unidad MFE", pt: "Transmissor de Energia Multi-funcional (TEMF)", zh: "MFE储电箱" });
Translation.addTranslation("MFSU", { ru: "МФСУ", es: "Unidad MFSU", pt: "Unidade de Armazenamento Multi-funcional (UAMF)", zh: "MFSU储电箱" });
// Transformer
Translation.addTranslation("LV Transformer", { ru: "Трансформатор НН", pt: "Transformador de Baixa Voltagem", zh: "低压变压器" });
Translation.addTranslation("MV Transformer", { ru: "Трансформатор СН", pt: "Transformador de Média Voltagem", zh: "中压变压器" });
Translation.addTranslation("HV Transformer", { ru: "Трансформатор ВН", pt: "Transformador de Alta Voltagem", zh: "高压变压器" });
Translation.addTranslation("EV Transformer", { ru: "Трансформатор СВН", pt: "Transformador de Voltagem Extrema", zh: "超高压变压器" });
// Machines
Translation.addTranslation("Luminator", { ru: "Электролампа", es: "Lámpara", pt: "Iluminador", zh: "日光灯" });
Translation.addTranslation("Iron Furnace", { ru: "Железная печь", es: "Horno de Hierro", pt: "Fornalha de Ferro", zh: "铁炉" });
Translation.addTranslation("Electric Furnace", { ru: "Электрическая печь", es: "Horno Eléctrico", pt: "Fornalha Elétrica", zh: "电炉" });
Translation.addTranslation("Induction Furnace", { ru: "Индукционная печь", es: "Horno de Induccion", pt: "Fornalha de Indução", zh: "感应炉" });
Translation.addTranslation("Macerator", { ru: "Дробитель", es: "Trituradora", pt: "Macerador", zh: "打粉机" });
Translation.addTranslation("Compressor", { ru: "Компрессор", es: "Compresor", pt: "Compactador", zh: "压缩机" });
Translation.addTranslation("Extractor", { ru: "Экстрактор", es: "Extractor", pt: "Extrator", zh: "提取机" });
Translation.addTranslation("Recycler", { ru: "Утилизатор", es: "Reciclador", pt: "Recicladora", zh: "回收机" });
Translation.addTranslation("Metal Former", { ru: "Металлоформовщик", es: "Arqueador de Metal", pt: "Moldelador de Metais", zh: "金属成型机" });
Translation.addTranslation("Ore Washing Plant", { ru: "Рудопромывочная машина", es: "Planta de Lavado de Minerales", pt: "Estação de Lavagem de Minérios", zh: "洗矿机" });
Translation.addTranslation("Thermal Centrifuge", { ru: "Термальная центрифуга", es: "Centrífuga Térmica", pt: "Centrífuga Térmica", zh: "热能离心机" });
Translation.addTranslation("Blast Furnace", { ru: "Доменная печь", es: "Alto Horno", pt: "Fornalha de Aquecimento", zh: "高炉" });
Translation.addTranslation("Miner", { ru: "Буровая установка", es: "Perforadora", pt: "Minerador", zh: "采矿机" });
Translation.addTranslation("Advanced Miner", { ru: "Продвинутый автошахтёр", es: "Minero Avanzado", pt: "Minerador Avançado", zh: "高级采矿机" });
Translation.addTranslation("Tesla Coil", { ru: "Катушка теслы", es: "Bobina de Tesla", pt: "Bobina Tesla", zh: "特斯拉线圈" });
Translation.addTranslation("Teleporter", { ru: "Телепортер", es: "Teletransportador", pt: "Teletransportador", zh: "传送机" });
Translation.addTranslation("Mass Fabricator", { ru: "Производитель материи", es: "Materializador", pt: "Fabricador de Massa", zh: "物质生成机" });
Translation.addTranslation("Fermenter", { ru: "Ферментер", es: "Fermentadora", pt: "Fermentador", zh: "发酵机" });
Translation.addTranslation("Solid Canning Machine", { ru: "Консервирующий механизм", es: "Máquina de Enlatado", pt: "Enlatadora de Sólidos", zh: "固体装罐机" });
Translation.addTranslation("Fluid/Solid Canning Machine", { ru: "Универсальный наполняющий механизм", es: "Enlatadora de Líquidos/Sólidos", pt: "Enlatadora de Fluidos/Sólidos", zh: "流体/固体装罐机" });
Translation.addTranslation("Crop Matron", { ru: "Автосадовник", es: "Máquina Cosechadora", pt: "Fazendeiro", zh: "作物监管机" });
Translation.addTranslation("Crop Harvester", { ru: "Сборщик урожая", es: "Cocechador de Cultivo", pt: "Colheitadeira", zh: "作物收割机" });
// Explosive
Translation.addTranslation("Nuke", { ru: "Ядерная бомба", pt: "Bomba Nuke", zh: "核弹" });
// Fluid
Translation.addTranslation("Pump", { ru: "Помпа", es: "Bomba Extractora", pt: "Bomba", zh: "泵" });
Translation.addTranslation("Fluid Distributor", { ru: "Жидкостный распределитель", es: "Distribuidor de Líquido", pt: "Distribuidor de Fluidos", zh: "流体分配机" });
Translation.addTranslation("Tank", { ru: "Бак", es: "Tanque", pt: "Tanque", zh: "流体储存器" });
// ITEMS
Translation.addTranslation("Iridium", { ru: "Иридий", es: "Mineral de Iridio", pt: "Minério de Irídio", zh: "铱碎片" });
Translation.addTranslation("Latex", { ru: "Латекс", es: "Caucho", pt: "Resina Pegajosa", zh: "粘性树脂" });
Translation.addTranslation("Rubber", { ru: "Резина", es: "Rubber", pt: "Borracha", zh: "橡胶" });
Translation.addTranslation("Ashes", { ru: "Пепел", es: "Ceniza", pt: "Cinzas", zh: "灰烬" });
Translation.addTranslation("Slag", { ru: "Шлак", es: "Escoria", pt: "Sucata", zh: "渣渣" });
Translation.addTranslation("Bio Chaff", { ru: "Отходы", pt: "Bio-Produto", zh: "糠" });
Translation.addTranslation("Scrap", { ru: "Утильсырьё", es: "Chatarra", pt: "Sucata", zh: "废料" });
Translation.addTranslation("Scrap Box", { ru: "Коробка утильсырья", es: "Caja de Chatarra", pt: "Caixa de Sucata", zh: "废料盒" });
Translation.addTranslation("UU-Matter", { ru: "Материя", es: "Materia", pt: "Metéria UU", zh: "UU物质" });
Translation.addTranslation("Heat Conductor", { ru: "Теплопроводник ", es: "Conductor de calor", pt: "Condutor de Calor", zh: "热传导器" });
Translation.addTranslation("Coal Ball", { ru: "Угольный шарик", es: "Bola de Carbón", pt: "Bola de Carvão", zh: "煤球" });
Translation.addTranslation("Coal Block", { ru: "Сжатый угольный шарик", es: "Bola de Carbón Compactada", pt: "Bola de Carvão Comprimido", zh: "压缩煤球" });
Translation.addTranslation("Coal Chunk", { ru: "Угольная глыба", es: "Carbono Bruto", zh: "煤块", pt: "Pedaço de Carvão" });
Translation.addTranslation("Carbon Fibre", { ru: "Углеволокно", es: "Fibra de Carbono Básica", pt: "Fibra de Carbono Bruto", zh: "粗制碳网" });
Translation.addTranslation("Carbon Mesh", { ru: "Углеткань", es: "Malla de Carbono Básica", pt: "Malha de Carbono", zh: "粗制碳板" });
Translation.addTranslation("Carbon Plate", { ru: "Углепластик", es: "Placa de Carbono", pt: "Placa de Carbono", zh: "碳板" });
Translation.addTranslation("Alloy Plate", { ru: "Композит", es: "Compuesto Avanzado", pt: "Liga Avançada", zh: "高级合金" });
Translation.addTranslation("Iridium Reinforced Plate", { ru: "Иридиевый композит", es: "Placa de Iridio", pt: "Placa Reforçada com Irídio", zh: "强化铱板" });
// Nuclear
Translation.addTranslation("Enriched Uranium", { ru: "Обогащённый уран", es: "Uranio Enriquecido", pt: "Urânio Enriquecido", zh: "浓缩铀核燃料" });
Translation.addTranslation("Uranium 235", { ru: "Уран-235", es: "Uranio 235", pt: "Urânio 235", zh: "铀-235" });
Translation.addTranslation("Piece of Uranium 235", { ru: "Кусочек урана-235", es: "Diminuta Pila de Uranio 235", pt: "Pequena Pilha de Urânio 235", zh: "小撮铀-235" });
Translation.addTranslation("Uranium 238", { ru: "Уран-238", es: "Uranio 238", pt: "Urânio 238", zh: "铀-238" });
Translation.addTranslation("Piece of Uranium 238", { ru: "Кусочек урана-238", es: "Diminuta Pila de Uranio 238", pt: "Pequena Pilha de Urânio 238", zh: "小撮铀-238" });
Translation.addTranslation("Plutonium", { ru: "Плутоний", es: "Plutonio", pt: "Plutônio", zh: "钚" });
Translation.addTranslation("Piece of Plutonium", { ru: "Кусочек плутония", es: "Diminuta Pila de Plutonio", pt: "Pequena Pilha de Plutônio", zh: "小撮钚" });
Translation.addTranslation("MOX Nuclear Fuel", { ru: "Ядерное топливо MOX", es: "MOX Combustible Nuclear", pt: "Combustível Nuclear de MOX", zh: "钚铀混合氧化物核燃料(MOX)" });
Translation.addTranslation("Pellets of RTG Fuel", { ru: "Пеллета РИТЭГ-топлива", es: "Perdigones de Combustible RTG", pt: "Pastilhas de Combustível de GTR", zh: "放射性同位素燃料靶丸" });
// Reactor Stuff - Radioactive Items
Translation.addTranslation("Fuel Rod (Empty)", { ru: "Топливный стержень (Пустой)", es: "Vara Combustible (Vacía)", pt: "Haste de Combustível (Vazia)", zh: "燃料棒(空)" });
Translation.addTranslation("Fuel Rod (Uranium)", { ru: "Топливный стержень (Уран)", es: "Vara Combustible (Uranio)", pt: "Haste de Combustível (Urânio)", zh: "燃料棒(铀)" });
Translation.addTranslation("Dual Fuel Rod (Uranium)", { ru: "Спаренный топливный стержень (Уран)", es: "Vara Combustible Doble (Uranio)", pt: "Haste de Combustível Dupla (Urânio)", zh: "双联燃料棒(铀)" });
Translation.addTranslation("Quad Fuel Rod (Uranium)", { ru: "Счетверённый топливный стержень (Уран)", es: "Vara Combustible Cuádruple (Uranio)", pt: "Haste de Combustível Quádrupla (Urânio)", zh: "四联燃料棒(铀)" });
Translation.addTranslation("Fuel Rod (MOX)", { ru: "Топливный стержень (MOX)", es: "Vara Combustible (MOX)", pt: "Haste de Combustível (MOX)", zh: "燃料棒(MOX)" });
Translation.addTranslation("Dual Fuel Rod (MOX)", { ru: "Спаренный топливный стержень (MOX)", es: "Vara Combustible Doble (MOX)", pt: "Haste de Combustível Dupla (MOX)", zh: "双联燃料棒(MOX)" });
Translation.addTranslation("Quad Fuel Rod (MOX)", { ru: "Счетверённый топливный стержень (MOX)", es: "Vara Combustible Cuádruple (MOX)", pt: "Haste de Combustível Quádrupla (MOX)", zh: "四联燃料棒(MOX)" });
Translation.addTranslation("Fuel Rod (Depleted Uranium)", { ru: "Топливный стержень (Обеднённый Уран)", es: "Vara Combustible (Uranio Empobrecido)", pt: "Haste de Combustível (Urânio Esgotado)", zh: "燃料棒(枯竭铀)" });
Translation.addTranslation("Dual Fuel Rod (Depleted Uranium)", { ru: "Спаренный топливный стержень (Обеднённый Уран)", es: "Vara Combustible Doble (Uranio Empobrecido)", pt: "Haste de Combustível Dupla (Urânio Esgotado)", zh: "双联燃料棒(枯竭铀)" });
Translation.addTranslation("Quad Fuel Rod (Depleted Uranium)", { ru: "Счетверённый топливный стержень (Обеднённый Уран)", es: "Vara Combustible Cuádruple (Uranio Empobrecido)", pt: "Haste de Combustível Quádrupla (Urânio Esgotado)", zh: "四联燃料棒(枯竭铀)" });
Translation.addTranslation("Fuel Rod (Depleted MOX)", { ru: "Топливный стержень (Обеднённый MOX)", es: "Vara Combustible (MOX Empobrecido)", pt: "Haste de Combustível (MOX Esgotado)", zh: "燃料棒(枯竭MOX)" });
Translation.addTranslation("Dual Fuel Rod (Depleted MOX)", { ru: "Спаренный топливный стержень (Обеднённый MOX)", es: "Vara Combustible Doble (MOX Empobrecido)", pt: "Haste de Combustível Dupla (MOX Esgotado)", zh: "双联燃料棒(枯竭MOX)" });
Translation.addTranslation("Quad Fuel Rod (Depleted MOX)", { ru: "Счетверённый топливный стержень (Обеднённый MOX)", es: "Vara Combustible Cuádruple (MOX Empobrecido)", pt: "Haste de Combustível Quádrupla (MOX Esgotado)", zh: "四联燃料棒(枯竭MOX)" });
// Reactor Stuff - Cooling/Heat Management
Translation.addTranslation("Reactor Plating", { ru: "Обшивка реактора", es: "Revestimiento para Reactor", pt: "Placa de Reator", zh: "反应堆隔板" });
Translation.addTranslation("Containment Reactor Plating", { ru: "Сдерживающая реакторная обшивка", es: "Revestimiento de Reactor con Capacidad de Calor", pt: "Placa de Contenção de Reator", zh: "高热容反应堆隔板" });
Translation.addTranslation("Heat-Capacity Reactor Plating", { ru: "Теплоёмкая реакторная обшивка", es: "Revestimiento de Contención para Reactor", pt: "Placa de Reator com Capacidade de Calor", zh: "密封反应堆隔热板" });
Translation.addTranslation("Neutron Reflector", { ru: "Отражатель нейтронов", es: "Reflector de Neutrones", pt: "Refletor de Neutrons", zh: "中子反射板" });
Translation.addTranslation("Thick Neutron Reflector", { ru: "Утолщённый отражатель нейтронов", es: "Reflector de Neutrones Grueso", pt: "Refletor de Neutrons Grosso", zh: "加厚中子反射板" });
Translation.addTranslation("Iridium Neutron Reflector", { ru: "Иридиевый отражатель нейтронов", es: "Reflector de Neutrones de Iridio", pt: "Refletor de Neutrons de Irídio", zh: "铱中子反射板" });
Translation.addTranslation("10k Coolant Cell", { ru: "Охлаждающая капсула 10к", es: "Celda Refrigerante 10k", pt: "Célula Refrigerante de 10k", zh: "10k冷却单元" });
Translation.addTranslation("30k Coolant Cell", { ru: "Охлаждающая капсула 30к", es: "Celda Refrigerante 30k", pt: "Célula Refrigerante de 30k", zh: "30k冷却单元" });
Translation.addTranslation("60k Coolant Cell", { ru: "Охлаждающая капсула 60к", es: "Celda Refrigerante 60k", pt: "Célula Refrigerante de 60k", zh: "60k冷却单元" });
Translation.addTranslation("Heat Exchanger", { ru: "Теплообменник", es: "Intercambiador de Calor", pt: "Trocador de Calor", zh: "热交换器" });
Translation.addTranslation("Advanced Heat Exchanger", { ru: "Улучшенный теплообменник", es: "Intercambiador de Calor para Reactor", pt: "Trocador de Calor Avançado", zh: "高级热交换器" });
Translation.addTranslation("Component Heat Exchanger", { ru: "Компонентный теплообменник", es: "Intercambiador de Calor para Componentes", pt: "Trocador de Calor Componente", zh: "元件热交换器" });
Translation.addTranslation("Reactor Heat Exchanger", { ru: "Реакторный теплообменник", es: "Intercambiador de Calor para Reactor", pt: "Trocador de Calor do Reator", zh: "反应堆热交换器" });
Translation.addTranslation("Heat Vent", { ru: "Теплоотвод", es: "Ventilación de Calor", pt: "Ventilação de Calor", zh: "散热片" });
Translation.addTranslation("Advanced Heat Vent", { ru: "Улучшенный теплоотвод", es: "Ventilación de Calor Avanzada", pt: "Ventilação de Calor Avançada", zh: "高级散热片" });
Translation.addTranslation("Component Heat Vent", { ru: "Компонентный теплоотвод", es: "Componente para Ventilación de Calor", pt: "Ventilação de Calor Componente", zh: "元件散热片" });
Translation.addTranslation("Reactor Heat Vent", { ru: "Реакторный теплоотвод", es: "Ventilación de Calor para Reactor", pt: "Ventilação de Calor para Reator", zh: "反应堆散热片" });
Translation.addTranslation("Overclocked Heat Vent", { ru: "Разогнанный теплоотвод", es: "Ventilación de Calor con Sobreproducción", pt: "Ventilação de Calor com Overclock", zh: "超频散热片" });
Translation.addTranslation("RSH-Condensator", { ru: "Красный конденсатор", es: "RSH-Condensador", pt: "Condensador de Calor de Redstone (CCR)", zh: "红石冷凝模块" });
Translation.addTranslation("LZH-Condensator", { ru: "Лазуритовый конденсатор", es: "LZH-Condensador", pt: "Condensador de Calor de Lápis-Lazúli (CCL)", zh: "青金石冷凝模块" });
// Electric Components
Translation.addTranslation("Electronic Circuit", { ru: "Электросхема", es: "Circuito Electrónico", pt: "Circuito Eletrônico", zh: "电路板" });
Translation.addTranslation("Advanced Circuit", { ru: "Улучшенная электросхема", es: "Circuito Avanzado", pt: "Circuito Avançado", zh: "高级电路板" });
Translation.addTranslation("Coil", { ru: "Катушка", es: "Bobina", pt: "Bobina", zh: "线圈" });
Translation.addTranslation("Electric Motor", { ru: "Электромотор", es: "Motor Eléctrico", pt: "Motor Elétrico", zh: "电动马达" });
Translation.addTranslation("Power Unit", { ru: "Силовой агрегат", es: "Unidad de Potencia", pt: "Motor", zh: "驱动把手" });
Translation.addTranslation("Small Power Unit", { ru: "Малый силовой агрегат", es: "Pequeña Unidad de Potencia", pt: "Motor Pequeno", zh: "小型驱动把手" });
// Energy Storage
Translation.addTranslation("RE-Battery", { ru: "Аккумулятор", es: "Batería Recargable", pt: "Bateria Reutilizável", zh: "充电电池" });
Translation.addTranslation("Advanced RE-Battery", { ru: "Продвинутый аккумулятор", es: "Bateria-RE Avanzada", pt: "Bateria Reutilizável Avançada", zh: "高级充电电池" });
Translation.addTranslation("Energy Crystal", { ru: "Энергетический кристалл", es: "Cristal de Energía", pt: "Cristal de Energia", zh: "能量水晶" });
Translation.addTranslation("Lapotron Crystal", { ru: "Лазуротроновый кристалл", es: "Cristal Lapotron", pt: "Cristal Lapotrônico", zh: "兰波顿水晶" });
Translation.addTranslation("Charging RE-Battery", { ru: "Заряжающий аккумулятор", es: "Batería Cargadora", pt: "Bateria Reutilizável Carregadora", zh: "RE充电电池" });
Translation.addTranslation("Advanced Charging Battery", { ru: "Продвинутый заряжающий аккумулятор", es: "Bateria Cargadora Avanzada", pt: "Bateria Carregadora Avançada", zh: "高级充电电池" });
Translation.addTranslation("Charging Energy Crystal", { ru: "Заряжающий энергетический кристалл", es: "Cargador de Cristales de Energía", pt: "Carregador de Cristais de Energia", zh: "能量水晶充电电池" });
Translation.addTranslation("Charging Lapotron Crystal", { ru: "Заряжающий лазуротроновый кристалл", es: "Cargador de Cristales Lapotron", pt: "Carregador de Cristais Lapotrônicos", zh: "兰波顿充电电池" });
// Upgrades
Translation.addTranslation("MFSU Upgrade Kit", { ru: "Набор улучшения МФСУ", es: "Kit de Actualización MFSU", pt: "Kit de Melhoria UAMF", zh: "MFSU升级组件" });
Translation.addTranslation("Overclocker Upgrade", { ru: "Улучшение «Ускоритель»", es: "Mejora de Sobreproducción", pt: "Melhoria: Overclock", zh: "超频升级" });
Translation.addTranslation("Transformer Upgrade", { ru: "Улучшение «Трансформатор»", es: "Mejora de Transformador", pt: " Melhoria: Transformador Interno", zh: "高压升级" });
Translation.addTranslation("Energy Storage Upgrade", { ru: "Улучшение «Энергохранитель»", es: "Mejora de Almacenador de Energía", pt: "Melhoria: Armazenamento de Energia", zh: "储能升级" });
Translation.addTranslation("Redstone Signal Inverter Upgrade", { ru: "Улучшение «Инвертор сигнала редстоуна»", es: "Majora de Invesor de señal Redstone", pt: "Melhoria: Inversor de Sinal de Redstone", zh: "红石信号反转升级" });
Translation.addTranslation("Ejector Upgrade", { ru: "Улучшение «Выталкиватель»", es: "Mejora Expulsora", pt: "Melhoria: Ejetor", zh: "弹出升级" });
Translation.addTranslation("Pulling Upgrade", { ru: "Улучшение «Загрузчик»", es: "Mejora de Traccion", pt: "Melhoria: Sucção", zh: "抽入升级" });
Translation.addTranslation("Fluid Ejector Upgrade", { ru: "Улучшение «Выталкиватель жидкости»", es: "Mejora Expulsora de Líquidos", pt: "Melhoria: Ejetor de Fluidos", zh: "流体弹出升级" });
Translation.addTranslation("Fluid Pulling Upgrade", { ru: "Улучшение «Загрузчик жидкости»", es: "Mejora Traccion de Líquidos", pt: "Melhoria: Injeção de Fluidos Avançada", zh: "流体抽入升级" });
// Crushed Ore
Translation.addTranslation("Crushed Copper Ore", { ru: "Измельчённая медная руда", es: "Mineral de Cobre Triturado", pt: "Minério de Cobre Triturado", zh: "粉碎铜矿石" });
Translation.addTranslation("Crushed Tin Ore", { ru: "Измельчённая оловянная руда", es: "Mineral de Estaño Triturado", pt: "Minério de Estanho Triturado", zh: "粉碎锡矿石" });
Translation.addTranslation("Crushed Iron Ore", { ru: "Измельчённая железная руда", es: "Mineral de Hierro Triturado", pt: "Minério de Ferro Triturado", zh: "粉碎铁矿石" });
Translation.addTranslation("Crushed Lead Ore", { ru: "Измельчённая свинцовая руда", es: "Mineral de Plomo Triturado", pt: "Minério de Chumbo Triturado", zh: "粉碎铅矿石" });
Translation.addTranslation("Crushed Gold Ore", { ru: "Измельчённая золотая руда", es: "Mineral de Oro Triturado", pt: "Minério de Ouro Triturado", zh: "粉碎金矿石" });
Translation.addTranslation("Crushed Silver Ore", { ru: "Измельчённая серебряная руда", es: "Mineral de Plata Triturado", pt: "Minério de Prata Triturado", zh: "粉碎银矿石" });
Translation.addTranslation("Crushed Uranium Ore", { ru: "Измельчённая урановая руда", es: "Mineral de Uranio Triturado", pt: "Minério de Urânio Triturado", zh: "粉碎铀矿石" });
// Purified Ore
Translation.addTranslation("Purified Crushed Copper Ore", { ru: "Очищенная измельчённая медная руда", es: "Mineral de Cobre Triturado y Purificado", pt: "Minério Purificado de Cobre Triturado", zh: "纯净的粉碎铜矿石" });
Translation.addTranslation("Purified Crushed Tin Ore", { ru: "Очищенная измельчённая оловянная руда", es: "Mineral de Estaño Triturado y Purificado", pt: "Minério Purificado de Estanho Triturado", zh: "纯净的粉碎锡矿石" });
Translation.addTranslation("Purified Crushed Iron Ore", { ru: "Очищенная измельчённая железная руда", es: "Mineral de Hierro Triturado y Purificado", pt: "Minério Purificado de Ferro Triturado", zh: "纯净的粉碎铁矿石" });
Translation.addTranslation("Purified Crushed Lead Ore", { ru: "Очищенная измельчённая свинцовая руда", es: "Mineral de Plomo Triturado y Purificado", pt: "Minério Purificado de Chumbo Triturado", zh: "纯净的粉碎铅矿石" });
Translation.addTranslation("Purified Crushed Gold Ore", { ru: "Очищенная измельчённая золотая руда", es: "Mineral de Oro Triturado y Purificado", pt: "Minério Purificado de Ouro Triturado", zh: "纯净的粉碎金矿石" });
Translation.addTranslation("Purified Crushed Silver Ore", { ru: "Очищенная измельчённая серебряная руда", es: "Mineral de Plata Triturado y Purificado", pt: "Minério Purificado de Prata Triturada", zh: "纯净的粉碎银矿石" });
Translation.addTranslation("Purified Crushed Uranium Ore", { ru: "Очищенная измельчённая урановая руда", es: "Mineral de Uranio Triturado y Purificado", pt: "Minério Purificado de Urânio Triturado", zh: "纯净的粉碎铀矿石" });
// Dusts
Translation.addTranslation("Copper Dust", { ru: "Медная пыль", es: "Polvo de Cobre", pt: "Pó de Cobre", zh: "铜粉" });
Translation.addTranslation("Tin Dust", { ru: "Оловянная пыль", es: "Polvo de Estaño", pt: "Pó de Estanho", zh: "锡粉" });
Translation.addTranslation("Bronze Dust", { ru: "Бронзовая пыль", es: "Polvo de Bronce", pt: "Pó de Bronze", zh: "青铜粉" });
Translation.addTranslation("Iron Dust", { ru: "Железная пыль", es: "Polvo de Hierro", pt: "Pó de Ferro", zh: "铁粉" });
Translation.addTranslation("Steel Dust", { ru: "Стальная пыль", es: "Polvo de Acero", pt: "Pó de Aço", zh: "钢粉" });
Translation.addTranslation("Lead Dust", { ru: "Свинцовая пыль", es: "Polvo de Plomo", pt: "Pó de Chumbo", zh: "铅粉" });
Translation.addTranslation("Gold Dust", { ru: "Золотая пыль", es: "Polvo de Oro", pt: "Pó de Ouro", zh: "金粉" });
Translation.addTranslation("Silver Dust", { ru: "Серебряная пыль", es: "Polvo de Plata", pt: "Pó de Prata", zh: "银粉" });
Translation.addTranslation("Stone Dust", { ru: "Каменная пыль", es: "Polvo de Piedra", pt: "Pó de Pedra", zh: "石粉" });
Translation.addTranslation("Coal Dust", { ru: "Угольная пыль", es: "Polvo de Carbón", pt: "Pó de Carvão", zh: "煤粉" });
Translation.addTranslation("Sulfur Dust", { ru: "Серная пыль", es: "Polvo de Sulfuro", pt: "Pó de Enxofre", zh: "硫粉" });
Translation.addTranslation("Lapis Dust", { ru: "Лазуритовая пыль", es: "Polvo de Lapislázuli", pt: "Pó de Lápis-Lazúli", zh: "青金石粉" });
Translation.addTranslation("Diamond Dust", { ru: "Алмазная пыль", es: "Polvo de Diamante", pt: "Pó de Diamante", zh: "钻石粉" });
Translation.addTranslation("Energium Dust", { ru: "Энергетическая пыль", es: "Polvo de Energium", pt: "Pó de Enérgio", zh: "能量水晶粉" });
// Small Dusts
Translation.addTranslation("Tiny Pile of Copper Dust", { ru: "Небольшая кучка медной пыли", es: "Diminuta Pila de Polvo de Cobre", pt: "Pequena Pilha de Pó de Cobre", zh: "小撮铜粉" });
Translation.addTranslation("Tiny Pile of Tin Dust", { ru: "Небольшая кучка оловянной пыли", es: "Diminuta Pila de Polvo de Estaño", pt: "Pequena Pilha de Pó de Estanho", zh: "小撮锡粉" });
Translation.addTranslation("Tiny Pile of Iron Dust", { ru: "Небольшая кучка железной пыли", es: "Diminuta Pila de Polvo de Hierro", pt: "Pequena Pilha de Pó de Ferro", zh: "小撮铁粉" });
Translation.addTranslation("Tiny Pile of Gold Dust", { ru: "Небольшая кучка золотой пыли", es: "Diminuta Pila de Polvo de Oro", pt: "Pequena Pilha de Pó de Ouro", zh: "小撮金粉" });
Translation.addTranslation("Tiny Pile of Lead Dust", { ru: "Небольшая кучка свинцовой пыли", es: "Diminuta Pila de Polvo de Plomo", pt: "Pequena Pilha de Pó de Chumbo", zh: "小撮铅粉" });
Translation.addTranslation("Tiny Pile of Silver Dust", { ru: "Небольшая кучка серебряной пыли", es: "Diminuta Pila de Polvo de Plata", pt: "Pequena Pilha de Pó de Prata", zh: "小撮银粉" });
Translation.addTranslation("Tiny Pile of Sulfur Dust", { ru: "Небольшая кучка серной пыли", es: "Diminuta Pila de Polvo de Sulfuro", pt: "Pequena Pilha de Pó de Enxofre", zh: "小撮硫粉" });
// Ingots
Translation.addTranslation("Copper Ingot", { ru: "Медный слиток", es: "Lingote de Cobre", pt: "Lingote de Cobre", zh: "铜锭" });
Translation.addTranslation("Tin Ingot", { ru: "Оловянный слиток", es: "Lingote de Estaño", pt: "Lingote de Estanho", zh: "锡锭" });
Translation.addTranslation("Bronze Ingot", { ru: "Бронзовый слиток", es: "Lingote de Bronce", pt: "Lingote de Bronze", zh: "青铜锭" });
Translation.addTranslation("Steel Ingot", { ru: "Стальной слиток", es: "Lingote de Acero", pt: "Lingote de Aço", zh: "钢锭" });
Translation.addTranslation("Lead Ingot", { ru: "Свинцовый слиток", es: "Lingote de Plomo", pt: "Lingote de Chumbo", zh: "铅锭" });
Translation.addTranslation("Silver Ingot", { ru: "Серебрянный слиток", es: "Lingote de Plata", pt: "Lingote de Prata", zh: "银锭" });
Translation.addTranslation("Alloy Ingot", { ru: "Композитный слиток", es: "Lingote de Metal Compuesto", pt: "Lingote de Liga Metálica", zh: "合金锭" });
// Plates
Translation.addTranslation("Copper Plate", { ru: "Медная пластина", es: "Placa de Cobre", pt: "Placa de Cobre", zh: "铜板" });
Translation.addTranslation("Tin Plate", { ru: "Оловянная пластина", es: "Placa de Estaño", pt: "Placa de Estanho", zh: "锡板" });
Translation.addTranslation("Iron Plate", { ru: "Железная пластина", es: "Placa de Hierro", pt: "Placa de Ferro", zh: "铁板" });
Translation.addTranslation("Bronze Plate", { ru: "Бронзовая пластина", es: "Placa de Bronce", pt: "Placa de Bronze", zh: "青铜板" });
Translation.addTranslation("Steel Plate", { ru: "Стальная пластина", es: "Placa de Hierro Refinado", pt: "Placa de Aço", zh: "钢板" });
Translation.addTranslation("Gold Plate", { ru: "Золотая пластина", es: "Placa de Oro", pt: "Placa de Ouro", zh: "金板" });
Translation.addTranslation("Lapis Plate", { ru: "Лазуритовая пластина", es: "Placa de Lapislázuli", pt: "Placa de Lápis-Lazúli", zh: "青金石板" });
Translation.addTranslation("Lead Plate", { ru: "Свинцовая пластина", es: "Placa de Plomo", pt: "Placa de Chumbo", zh: "铅板" });
// Dense Plates
Translation.addTranslation("Dense Copper Plate", { ru: "Плотная медная пластина", es: "Placa de Cobre Denso", pt: "Placa Densa de Cobre", zh: "致密铜板" });
Translation.addTranslation("Dense Tin Plate", { ru: "Плотная оловянная пластина", es: "Placa Densa de Estaño", pt: "Placa Densa de Estanho", zh: "致密锡板" });
Translation.addTranslation("Dense Iron Plate", { ru: "Плотная железная пластина", es: "Placa Densa de Hierro", pt: "Placa Densa de Ferro", zh: "致密铁板" });
Translation.addTranslation("Dense Bronze Plate", { ru: "Плотная бронзовая пластина", es: "Placa de Bronce Densa", pt: "Placa Densa de Bronze", zh: "致密青铜板" });
Translation.addTranslation("Dense Steel Plate", { ru: "Плотная стальная пластина", es: "Placa de Hierro Refinado Denso", pt: "Placa Densa de Aço", zh: "致密钢板" });
Translation.addTranslation("Dense Gold Plate", { ru: "Плотная золотая пластина", es: "Placa Densa de Oro", pt: "Placa Densa de Ouro", zh: "致密金板" });
Translation.addTranslation("Dense Lead Plate", { ru: "Плотная свинцовая пластина", es: "Placa Densa de Plomo", pt: "Placa Densa de Chumbo", zh: "致密铅板" });
// Casings
Translation.addTranslation("Copper Casing", { ru: "Медная оболочка", es: "Carcasa para Objetos de Cobre", pt: "Invólucro de Cobre", zh: "铜质外壳" });
Translation.addTranslation("Tin Casing", { ru: "Оловянная оболочка", es: "Carcasa para Objetos de Estaño", pt: "Invólucro de Estanho", zh: "锡质外壳" });
Translation.addTranslation("Iron Casing", { ru: "Железная оболочка", es: "Carcasa para Objetos de Hierro", pt: "Invólucro de Ferro", zh: "铁质外壳" });
Translation.addTranslation("Bronze Casing", { ru: "Бронзовая оболочка", es: "Carcasa para Objetos de Bronce", pt: "Invólucro de Bronze", zh: "青铜外壳" });
Translation.addTranslation("Steel Casing", { ru: "Стальная оболочка", es: "Carcasa para Objetos de Hierro", pt: "Invólucro de Aço", zh: "钢质外壳" });
Translation.addTranslation("Gold Casing", { ru: "Золотая оболочка", es: "Carcasa para Objetos de Oro", pt: "Invólucro de Ouro", zh: "黄金外壳" });
Translation.addTranslation("Lead Casing", { ru: "Свинцовая оболочка", es: "Carcasa para Objetos de Plomo", pt: "Invólucro de Chumbo", zh: "铅质外壳" });
// Cans
Translation.addTranslation("Tin Can", { ru: "Консервная банка", es: "Lata de Estaño", pt: "Lata de Estanho", zh: "锡罐(空)" });
Translation.addTranslation("Filled Tin Can", { ru: "Заполненная консервная банка", es: "Lata de Estaño (llena)", pt: "Lata de Estanho (Cheia)", zh: "锡罐(满)" });
Translation.addTranslation("This looks bad...", { ru: "Это выглядит несъедобно…", pt: "Isso parece ruim ...", zh: "这看起来很糟糕..." });
// Cells
Translation.addTranslation("Cell", { ru: "Капсула", es: "Celda Vacía", pt: "Célula Universal de Fluidos", zh: "空单元" });
Translation.addTranslation("Water Cell", { ru: "Капсула с водой", es: "Celda de Agua", pt: "Célula com Água", zh: "水单元" });
Translation.addTranslation("Lava Cell", { ru: "Капсула с лавой", es: "Celda de Lava", pt: "Célula com Lava", zh: "岩浆单元" });
Translation.addTranslation("Biomass Cell", { ru: "Капсула биомассы", es: "Celda de Biomasa", pt: "Célula com Biomassa", zh: "生物质单元" });
Translation.addTranslation("Biogas Cell", { ru: "Капсула биогаза", pt: "Célula com Biogás", zh: "沼气单元" });
Translation.addTranslation("Coolant Cell", { ru: "Капсула хладагента", es: "Celda de Refrigerante", pt: "Célula com Líquido Refrigerante", zh: "冷却液单元" });
Translation.addTranslation("UU-Matter Cell", { ru: "Капсула жидкой материи", es: "Celda de Materia UU", pt: "Célula com Matéria UU", zh: "UU物质单元" });
Translation.addTranslation("Compressed Air Cell", { ru: "Капсула со сжатым воздухом", es: "Celda de Aire Comprimida", pt: "Célula com Ar Comprimido", zh: "压缩空气单元" });
// Cables
Translation.addTranslation("Tin Cable", { ru: "Оловянный провод", es: "Cable de Ultra-Baja Tensión", pt: "Cabo de Estanho", zh: "锡质导线" });
Translation.addTranslation("Insulated Tin Cable", { ru: "Оловянный провод с изоляцией", es: "Cable de Estaño Aislado", pt: "Cabo de Estanho Isolado", zh: "绝缘锡质导线" });
Translation.addTranslation("Copper Cable", { ru: "Медный провод", es: "Cable de Cobre", pt: "Cabo de Cobre", zh: "铜质导线" });
Translation.addTranslation("Insulated Copper Cable", { ru: "Медный провод с изоляцией", es: "Cable de Cobre Aislado", pt: "Cabo de Cobre Isolado", zh: "绝缘质铜导线" });
Translation.addTranslation("Gold Cable", { ru: "Золотой провод", es: "Cable de Oro", pt: "Cabo de Ouro", zh: "金质导线" });
Translation.addTranslation("Insulated Gold Cable", { ru: "Золотой провод с изоляцией", es: "Cable de Oro Aislado", pt: "Cabo de Ouro Isolado", zh: "绝缘金质导线" });
Translation.addTranslation("2x Ins. Gold Cable", { ru: "Золотой провод с 2x изоляцией", es: "Cable de Oro Aislado x2", pt: "Cabo de Ouro Isolado x2", zh: "2x绝缘金质导线" });
Translation.addTranslation("HV Cable", { ru: "Высоковольтный провод", es: "Cable de Alta Tensión", pt: "Cabo de Alta Tensão", zh: "高压导线" });
Translation.addTranslation("Insulated HV Cable", { ru: "Высоковольтный провод с изоляцией", es: "Cable de Alta Tensión Aislado", pt: "Cabo de Alta Tensão Isolado", zh: "绝缘高压导线" });
Translation.addTranslation("2x Ins. HV Cable", { ru: "Высоковольтный провод с 2x изоляцией", es: "Cable de Alta Tensión Aislado x2", pt: "Cabo de Alta Tensão Isolado x2", zh: "2x绝缘高压导线" });
Translation.addTranslation("3x Ins. HV Cable", { ru: "Высоковольтный провод с 3x изоляцией", es: "Cable de Alta Tensión Aislado x3", pt: "Cabo de Alta Tensão Isolado x3", zh: "3x绝缘高压导线" });
Translation.addTranslation("Glass Fibre Cable", { ru: "Стекловолоконный провод", es: "Cable de Alta Tensión", pt: "Cabo de Fibra de Vidro", zh: "玻璃纤维导线" });
// Armor
Translation.addTranslation("bronze_helmet", { en: "Bronze Helmet", ru: "Бронзовый шлем", es: "Casco de Bronce", pt: "Elmo de Bronze", zh: "青铜头盔" });
Translation.addTranslation("bronze_chestplate", { en: "Bronze Chestplate", ru: "Бронзовый нагрудник", es: "Chaleco de Bronce", pt: "Peitoral de Bronze", zh: "青铜胸甲" });
Translation.addTranslation("bronze_leggings", { en: "Bronze Leggings", ru: "Бронзовые поножи", es: "Pantalones de Bronce", pt: "Calças de Bronze", zh: "青铜护腿" });
Translation.addTranslation("bronze_boots", { en: "Bronze Boots", ru: "Бронзовые ботинки", es: "Botas de Bronce", pt: "Botas de Bronze", zh: "青铜靴子" });
Translation.addTranslation("composite_helmet", { en: "Composite Helmet", ru: "Композитный шлем", es: "Casco de Compuesto", pt: "Capacete Composto", zh: "复合头盔" });
Translation.addTranslation("composite_chestplate", { en: "Composite Chestplate", ru: "Композитный нагрудник", es: "Chaleco de Compuesto", pt: "Colete Composto", zh: "复合胸甲" });
Translation.addTranslation("composite_leggings", { en: "Composite Leggings", ru: "Композитные поножи", es: "Pantalones de Compuesto", pt: "Calças compostas", zh: "复合护腿" });
Translation.addTranslation("composite_boots", { en: "Composite Boots", ru: "Композитные ботинки", es: "Botas de Compuesto", pt: "Botas compostas", zh: "复合靴子" });
Translation.addTranslation("nightvision_goggles", { en: "Nightvision Goggles", ru: "Прибор ночного зрения", es: "Gafas de Vision Nocturna", pt: "Óculos de Visão Noturna", zh: "夜视镜" });
Translation.addTranslation("nano_helmet", { en: "Nano Helmet", ru: "Нано-шлем", es: "Casco de Nanotraje", pt: "Elmo de Nanotecnologia", zh: "纳米头盔" });
Translation.addTranslation("nano_chestplate", { en: "Nano Bodyarmor", ru: "Нано-жилет", es: "Chaleco de Nanotraje", pt: "Peitoral de Nanotecnologia", zh: "纳米胸甲" });
Translation.addTranslation("nano_leggings", { en: "Nano Leggings", ru: "Нано-штаны", es: "Pantalones de Nanotraje", pt: "Calças de Nanotecnologia", zh: "纳米护腿" });
Translation.addTranslation("nano_boots", { en: "Nano Boots", ru: "Нано-ботинки", es: "Botas de Nanotraje", pt: "Botas de Nanotecnologia", zh: "纳米靴子" });
Translation.addTranslation("quantum_helmet", { en: "Quantum Helmet", ru: "Квантовый шлем", es: "Casco de Traje Cuántico", pt: "Elmo Quântico", zh: "量子头盔" });
Translation.addTranslation("quantum_chestplate", { en: "Quantum Bodyarmor", ru: "Квантовый жилет", es: "Chaleco de Traje Cuántico", pt: "Peitoral Quântico", zh: "量子护甲" });
Translation.addTranslation("quantum_leggings", { en: "Quantum Leggings", ru: "Квантовые штаны", es: "Pantalones de Traje Cuántico", pt: "Calças Quânticas", zh: "量子护腿" });
Translation.addTranslation("quantum_boots", { en: "Quantum Boots", ru: "Квантовые ботинки", es: "Botas de Traje Cuántico", pt: "Botas Quânticas", zh: "量子靴子" });
Translation.addTranslation("hazmat_helmet", { en: "Scuba Helmet", ru: "Шлем-акваланг", es: "Casco de Buceo", pt: "Máscara de Mergulho", zh: "防化头盔" });
Translation.addTranslation("hazmat_chestplate", { en: "Hazmat Suit", ru: "Защитная куртка", es: "Traje para Materiales Peligrosos", pt: "Roupa Anti-Radiação", zh: "防化服" });
Translation.addTranslation("hazmat_leggings", { en: "Hazmat Suit Leggings", ru: "Защитные штаны", es: "Pantalones para Materiales Peligrosos", pt: "Calças Anti-Radiação", zh: "防化裤" });
Translation.addTranslation("rubber_boots", { en: "Rubber Boots", ru: "Резиновые ботинки", es: "Botas de Goma", pt: "Botas de Borracha", zh: "橡胶靴" });
Translation.addTranslation("jetpack", { en: "Jetpack", ru: "Реактивный ранец", es: "Jetpack Eléctrico", pt: "Mochila à Jato Elétrica", zh: "电力喷气背包" });
Translation.addTranslation("batpack", { en: "Batpack", ru: "Аккумуляторный ранец", es: "Mochila de Baterías", pt: "Mochila de Baterias", zh: "电池背包" });
Translation.addTranslation("advanced_batpack", { en: "Advanced Batpack", ru: "Продвинутый аккумуляторный ранец", es: "Mochila de Baterías Avanzada", pt: "Mochila de Baterias Avançada", zh: "高级电池背包" });
Translation.addTranslation("energypack", { en: "Energy Pack", ru: "Энергетический ранец", es: "Pack de Energía", pt: "Mochila de Energia", zh: "能量水晶储电背包" });
Translation.addTranslation("lappack", { en: "Lappack", ru: "Лазуротроновый ранец", es: "Mochila de Baterías Avanzada", pt: "Mochila Lapotrônica", zh: "兰波顿储电背包" });
Translation.addTranslation("solar_helmet", { en: "Solar Helmet", ru: "Шлем с солнечной панелью", es: "Casco Solar", pt: "Elmo Solar", zh: "太阳能头盔" });
// Tools
Translation.addTranslation("Tool Box", { ru: "Ящик для инструментов", es: "Caja de Herramientas", pt: "Caixa de Ferramentas", zh: "工具盒" });
Translation.addTranslation("Containment Box", { ru: "Защитный контейнер", es: "Caja de Contención", pt: "Caixa de Contenção", zh: "防辐射容纳盒" });
Translation.addTranslation("Frequency Transmitter", { ru: "Частотный связыватель", es: "Transmisor de Frecuencias", pt: "Transmissor de Frequência", zh: "遥控器" });
Translation.addTranslation("OD Scanner", { ru: "Сканер КР", es: "Escaner de Densidad", zh: "OD扫描器" });
Translation.addTranslation("OV Scanner", { ru: "Сканер ЦР", es: "Escaner de Riqueza", zh: "OV扫描器" });
Translation.addTranslation("Treetap", { ru: "Краник", es: "Grifo para Resina", pt: "Drenador", zh: "木龙头" });
Translation.addTranslation("Forge Hammer", { ru: "Кузнечный молот", es: "Martillo para Forja", pt: "Martelo de Forja", zh: "锻造锤" });
Translation.addTranslation("Cutter", { ru: "Кусачки", es: "Pelacables Universal", pt: "Alicate", zh: "板材切割剪刀" });
Translation.addTranslation("Bronze Sword", { ru: "Бронзовый меч", es: "Espada de Bronce", pt: "Espada de Bronze", zh: "青铜剑" });
Translation.addTranslation("Bronze Shovel", { ru: "Бронзовая лопата", es: "Pala de Bronce", pt: "Pá de Bronze", zh: "青铜铲" });
Translation.addTranslation("Bronze Pickaxe", { ru: "Бронзовая кирка", es: "Pico de Bronce", pt: "Picareta de Bronze", zh: "青铜镐" });
Translation.addTranslation("Bronze Axe", { ru: "Бронзовый топор", es: "Hacha de Bronce", pt: "Machado de Bronze", zh: "青铜斧" });
Translation.addTranslation("Bronze Hoe", { ru: "Бронзовая мотыга", es: "Azada de Bronce", pt: "Enxada de Bronze", zh: "青铜锄" });
Translation.addTranslation("Wrench", { ru: "Гаечный ключ", es: "Llave Inglesa", pt: "Chave de Grifo", zh: "扳手" });
Translation.addTranslation("Electric Wrench", { ru: "Электроключ", es: "Llave Inglesa Eléctrica", pt: "Chave de Grifo Elétrica", zh: "电动扳手" });
Translation.addTranslation("Electric Hoe", { ru: "Электромотыга", es: "Azada Eléctrica", pt: "Enxada Elétrica", zh: "电动锄" });
Translation.addTranslation("Electric Treetap", { ru: "Электрокраник", es: "Grifo para Resina Eléctrico", pt: "Drenador Elétrico", zh: "电动树脂提取器" });
Translation.addTranslation("Chainsaw", { ru: "Электропила", es: "Motosierra", pt: "Serra Elétrica", zh: "链锯" });
Translation.addTranslation("Mining Drill", { ru: "Шахтёрский бур", es: "Taladro", pt: "Broca de Mineração", zh: "采矿钻头" });
Translation.addTranslation("Diamond Drill", { ru: "Алмазный бур", es: "Taladro de Diamante", pt: "Broca de Diamante", zh: "钻石钻头" });
Translation.addTranslation("Iridium Drill", { ru: "Иридиевый бур", es: "Taladro de Iridio", pt: "Broca de Irídio", zh: "铱钻头" });
Translation.addTranslation("Nano Saber", { ru: "Нано-сабля", es: "Nano-Sable", pt: "Sabre Nano", zh: "纳米剑" });
Translation.addTranslation("Mining Laser", { ru: "Шахтёрский лазер", es: "Láser Minero", pt: "Laser de Mineração", zh: "采矿镭射枪" });
Translation.addTranslation("EU Meter", { ru: "Мультиметр", pt: "Leitor de EU", zh: "EU电表" });
Translation.addTranslation("Debug Item", { ru: "Предмет отладки", pt: "Item de Depuração", zh: "测试工具" });
Translation.addTranslation("Crop Analyzer", { ru: "Агроанализатор", es: "Semillalizador", pt: "Plantanalizador", zh: "作物分析器" });
Translation.addTranslation("Weeding Trowel", { ru: "Пропалыватель", pt: "Espátula Transplantadora", zh: "除草铲" });
// Coffee
Translation.addTranslation("Coffee Powder", { ru: "Молотый кофе", es: "Polvo de Café", pt: "Pó de Café", zh: "咖啡粉" });
Translation.addTranslation("Stone Mug", { ru: "Каменная кружка", es: "Jarra de Piedra", pt: "Caneca de Pedra", zh: "石杯" });
Translation.addTranslation("Cold Coffee", { ru: "Холодный кофе", es: "Café Frío", pt: "Café Frio", zh: "冷咖啡" });
Translation.addTranslation("Dark Coffee", { ru: "Тёмный кофе", es: "Café Oscuro", pt: "Café Forte", zh: "黑咖啡" });
Translation.addTranslation("Coffee", { ru: "Кофе", es: "Café", pt: "Café", zh: "咖啡" });
// Crop Items
Translation.addTranslation("Seed Bag (%s)", { ru: "Мешок с семенами (%s)", es: "Semillas Desconocidas (%s)", pt: "Saco de sementes (%s)", zh: "种子袋 (%s)" });
Translation.addTranslation("Crop", { ru: "Жёрдочки", pt: "Muda", zh: "作物架" });
Translation.addTranslation("Grin Powder", { ru: "Токсичная пыль", es: "Polvo Horrible", zh: "蛤蛤粉", pt: "Pó do Riso" });
Translation.addTranslation("Weed EX", { ru: "Средство от сорняков", es: "Veneno para Hierbas", pt: "Erbicida", zh: "除草剂" });
Translation.addTranslation("Fertilizer", { ru: "Удобрение", es: "Fertilizante", pt: "Fertilizante", zh: "肥料" });
Translation.addTranslation("Hydration Cell", { ru: "Увлажняющая капсула", pt: "Líquido de Refrigeração", zh: "水化单元" });
Translation.addTranslation("Terra Wart", { ru: "Земляной нарост", es: "Verruga de Tierra", pt: "Fungo da Terra", zh: "大地疣" });
Translation.addTranslation("Coffee Beans", { ru: "Кофейные зёрна", es: "Granos de Café", pt: "Grãos de Café", zh: "咖啡豆" });
Translation.addTranslation("Weed", { ru: "Сорняк", pt: "Erva Daninha", zh: "杂草" });
Translation.addTranslation("Hops", { ru: "Хмель", es: "Lúpulo", pt: "Lúpulo", zh: "啤酒花" });
// Crops
Translation.addTranslation("wheat", { ru: "Пшеница", en: "Wheat", pt: "Trigo", zh: "小麦" });
Translation.addTranslation("weed", { ru: "Сорняк", en: "Weed", pt: "Erva Daninha", zh: "杂草" });
Translation.addTranslation("pumpkin", { ru: "Тыква", en: "Pumpkin", pt: "Abóbora", zh: "南瓜" });
Translation.addTranslation("melon", { ru: "Арбуз", en: "Melon", pt: "Melancia", zh: "西瓜" });
Translation.addTranslation("dandelion", { ru: "Одуванчик", en: "Dandelion", pt: "Dente-de-Leão", zh: "蒲公英" });
Translation.addTranslation("rose", { ru: "Роза", en: "Rose", pt: "Rosa", zh: "玫瑰" });
Translation.addTranslation("blackthorn", { ru: "Терновник", en: "Blackthorn", pt: "Espinheiro-negro", zh: "黑刺李" });
Translation.addTranslation("tulip", { ru: "Тюльпан", en: "Tulip", pt: "Tulipa", zh: "郁金香" });
Translation.addTranslation("cyazint", { ru: "Гиацинт", en: "Cyazint", pt: "Cyazint", zh: "缤纷花" });
Translation.addTranslation("venomilia", { ru: "Веномилия", en: "Venomilia", pt: "Venomilia", zh: "奇妙花" });
Translation.addTranslation("reed", { ru: "Сахарный тростник", en: "Reed", pt: "Cana-de-açúcar", zh: "甘蔗" });
Translation.addTranslation("stickreed", { ru: "Резиновый тростник", en: "Stickreed", zh: "粘性甘蔗", pt: "Cana-de-borracha" });
Translation.addTranslation("cocoa", { ru: "Какао", en: "Cocoa", pt: "Cacau", zh: "可可" });
Translation.addTranslation("red_mushroom", { ru: "Красный гриб", en: "Red Mushroom", pt: "Cogumelo Vermelho", zh: "红色蘑菇" });
Translation.addTranslation("brown_mushroom", { ru: "Коричневый гриб", en: "Brown Mushroom", pt: "Cogumelo marrom", zh: "棕色蘑菇" });
Translation.addTranslation("nether_wart", { ru: "Адский нарост", en: "Nether Wart", pt: "Fungo do Nether", zh: "地狱疣" });
Translation.addTranslation("terra_wart", { ru: "Земляной нарост", en: "Terra Wart", pt: "Fungo da Terra", zh: "大地疣" });
Translation.addTranslation("ferru", { ru: "Феррий", en: "Ferru", pt: "Ferru", zh: "铁叶草" });
Translation.addTranslation("cyprium", { ru: "Куприй", en: "Cyprium", pt: "Chipre", zh: "铜叶草" });
Translation.addTranslation("stagnium", { ru: "Стагний", en: "Stagnium", pt: "Stagnium", zh: "银矿草" });
Translation.addTranslation("plumbiscus", { ru: "Плюмбий", en: "Plumbiscus", pt: "Biscoito de canela", zh: "铅叶草" });
Translation.addTranslation("aurelia", { ru: "Аурелия", en: "Aurelia", pt: "Aurélia", zh: "金叶草" });
Translation.addTranslation("shining", { ru: "Аргентий", en: "Shining", pt: "Brilhante", zh: "闪光" });
Translation.addTranslation("redwheat", { ru: "Красная пшеница", en: "Red Wheat", pt: "Trigo Vermelho", zh: "红麦" });
Translation.addTranslation("coffee", { ru: "Кофе", en: "Coffee", pt: "Café", zh: "咖啡" });
Translation.addTranslation("hops", { ru: "Хмель", en: "Hops", pt: "Lúpulo", zh: "啤酒花" });
Translation.addTranslation("carrots", { ru: "Морковь", en: "Carrots", pt: "Cenouras", zh: "胡萝卜" });
Translation.addTranslation("potato", { ru: "Картофель", en: "Potato", pt: "Batata", zh: "马铃薯" });
Translation.addTranslation("eatingplant", { ru: "Плотоядное растение", en: "Eating Plant", pt: "Planta Carnívora", zh: "食人花" });
Translation.addTranslation("beetroots", { ru: "Свёкла", en: "Beetroots", pt: "Beterrabas", zh: "甜菜根" });
// TEXT
Translation.addTranslation("Mode: ", { ru: "Режим: ", es: "Modo: ", pt: "Modo: ", zh: "模式: " });
// Induction Furnace
Translation.addTranslation("Heat:", { ru: "Нагрев:", es: "Calor:", pt: "Calor:", zh: "热量:" });
// Charging Batteries
Translation.addTranslation("Mode: Disabled", { ru: "Режим: Выключен", pt: "Modo: Desabilitado", zh: "模式: 禁用" });
Translation.addTranslation("Mode: Charge items not in hand", { ru: "Режим: Заряжать предметы, которые не в руке", pt: "Modo: Carregar itens que não estão nas mãos", zh: "模式: 手里没有要充电的东西" });
Translation.addTranslation("Mode: Enabled", { ru: "Режим: Включён", pt: "Modo: Habilitado", zh: "模式: 启用" });
// Fluid Distributor
Translation.addTranslation("Mode:", { ru: "Режим:", es: "Modo:", pt: "Modo:", zh: "模式:" });
Translation.addTranslation("Distribute", { ru: "распростр.", es: "distribuir", pt: "Distribuir", zh: "分配模式" });
Translation.addTranslation("Concentrate", { ru: "концентрац.", es: "concentrado", pt: "Concentrar", zh: "混合模式" });
// Advanced Miner
Translation.addTranslation("Mode: Blacklist", { ru: "Чёрный список", es: "Modo: lista negra", pt: "Modo: Lst Negra", zh: "模式:黑名单" });
Translation.addTranslation("Mode: Whitelist", { ru: "Белый список", es: "Modo: lista blanca", pt: "Modo: Lst Branca", zh: "模式:白名单" });
// EU Meter
Translation.addTranslation("EnergyIn", { ru: "Вход энергии", pt: "EnergiaEntr", zh: "能量流入" });
Translation.addTranslation("EnergyOut", { ru: "Выход энергии", pt: "EnergiaSaid", zh: "能量流出" });
Translation.addTranslation("EnergyGain", { ru: "Энергии получено", es: "EnergíaGana", pt: "GanhoEnerg", zh: "获得能量" });
Translation.addTranslation("Voltage", { ru: "Напряжение", es: "Voltaje", pt: "Voltagem", zh: "电压" });
Translation.addTranslation("Avg:", { ru: "Средн.:", es: "Promedio:", pt: "Méd:", zh: "平均:" });
Translation.addTranslation("Max/Min", { ru: "Макс./Мин.", pt: "Máx/Min", zh: "最大/最小" });
Translation.addTranslation("Cycle: ", { ru: "Цикл: ", es: "Ciclo: ", pt: "Cíclo: ", zh: "周期: " });
Translation.addTranslation("Reset", { ru: "Сброс", pt: "Resetar", zh: "重置" });
Translation.addTranslation("sec", { ru: "сек", es: "sec", pt: "seg", zh: "秒" });
// Mining Laser
Translation.addTranslation("Mining", { ru: "Добыча", es: "Taladrando", pt: "Mineração", zh: "挖矿模式" });
Translation.addTranslation("Low-Focus", { ru: "Короткого фокуса", es: "Baja Potencia", pt: "Baixo-Foco", zh: "低聚焦模式" });
Translation.addTranslation("Long-Range", { ru: "Дальнего действия", es: "Largo Alcance", pt: "Longo Alcance", zh: "远距模式" });
Translation.addTranslation("Horizontal", { ru: "Горизонтальный", zh: "水平模式" });
Translation.addTranslation("Super-Heat", { ru: "Перегревающий", es: "Super-Calor", pt: "Super Quente", zh: "超级热线模式" });
Translation.addTranslation("Scatter", { ru: "Разброс", es: "Esparcido", pt: "Dispersão", zh: "散射模式" });
// Iridium Drill
Translation.addTranslation("Fortune III", { ru: "Удача III", pt: "Fortuna III", zh: "时运 III" });
Translation.addTranslation("Silk Touch", { ru: "Шёлковое касание", pt: "Toque suave", zh: "精准采集" });
// Painter
Translation.addTranslation("Painter", { ru: "Валик", pt: "Rolo de Pintura", zh: "刷子" });
Translation.addTranslation("Black Painter", { ru: "Чёрный валик", pt: "Rolo de Pintura Preto", zh: "黑色刷子" });
Translation.addTranslation("Blue Painter", { ru: "Синий валик", pt: "Rolo de Pintura Azul", zh: "蓝色刷子" });
Translation.addTranslation("Brown Painter", { ru: "Коричневый валик", pt: "Rolo de Pintura Marrom", zh: "棕色刷子" });
Translation.addTranslation("Light Blue Painter", { ru: "Светло-голубой валик", pt: "Rolo de Pintura Azul Claro", zh: "淡蓝色刷子" });
Translation.addTranslation("Cyan Painter", { ru: "Бирюзовый валик", pt: "Rolo de Pintura Ciano", zh: "青色刷子" });
Translation.addTranslation("Dark Grey Painter", { ru: "Тёмно-серый валик", pt: "Rolo de Pintura Cinza", zh: "灰色刷子" });
Translation.addTranslation("Green Painter", { ru: "Зелёный валик", pt: "Rolo de Pintura Verde", zh: "绿色刷子" });
Translation.addTranslation("Light Grey Painter", { ru: "Светло-серый валик", pt: "Rolo de Pintura Cinza Claro", zh: "淡灰色刷子" });
Translation.addTranslation("Lime Painter", { ru: "Лаймовый валик", pt: "Rolo de Pintura Verde-Limão", zh: "柠檬色刷子" });
Translation.addTranslation("Magenta Painter", { ru: "Сиреневый валик", pt: "Rolo de Pintura Lilás", zh: "品红色刷子" });
Translation.addTranslation("Orange Painter", { ru: "Оранжевый валик", pt: "Rolo de Pintura Laranjado", zh: "橙色刷子" });
Translation.addTranslation("Pink Painter", { ru: "Розовый валик", pt: "Rolo de Pintura Rosa", zh: "粉色刷子" });
Translation.addTranslation("Purple Painter", { ru: "Фиолетовый валик", pt: "Rolo de Pintura Roxo", zh: "紫色刷子" });
Translation.addTranslation("Red Painter", { ru: "Красный валик", pt: "Rolo de Pintura Vermelho", zh: "红色刷子" });
Translation.addTranslation("White Painter", { ru: "Белый валик", pt: "Rolo de Pintura Branco", zh: "白色刷子" });
Translation.addTranslation("Yellow Painter", { ru: "Жёлтый валик", pt: "Rolo de Pintura Amarelo", zh: "黄色刷子" });
// Messages
Translation.addTranslation("Nightvision mode enabled", { ru: "Режим ночного зрения включен", zh: "已启用夜视模式" });
Translation.addTranslation("Nightvision mode disabled", { ru: "Режим ночного зрения выключен", zh: "已禁用夜视模式" });
Translation.addTranslation("Hover mode disabled", { ru: "Режим парения выключен", zh: "已禁用悬浮模式" });
Translation.addTranslation("Hover mode enabled", { ru: "Режим парения включен", zh: "已启用悬浮模式" });
Translation.addTranslation("Scan Result: ", { ru: "Результат сканирования: ", es: "Resultado de la exploración: ", pt: "Resultado do Escaneamento: ", zh: "扫描结果: " });
// Tooltips
Translation.addTranslation("Power Tier: ", { ru: "Энергоуровень: ", zh: "能量等级: " });
Translation.addTranslation("Max voltage: ", { ru: "Макс. напряжение: ", zh: "最大电压: " });
Translation.addTranslation("Decrease process time to ", { ru: "Уменьшает время работы до ", pt: "Diminui o tempo de processo para ", zh: "加工用时缩短为" });
Translation.addTranslation("Increase power to ", { ru: "Увеличивает энергопотребление до ", pt: "Aumenta o Uso de Energia em ", zh: "能量增加到" });
Translation.addTranslation("Increase energy tier by 1", { ru: "Увеличивает энергоуровень на 1 ", pt: "Aumenta o nível da máquina em 1", zh: "增加一级输出电压" });
Translation.addTranslation("Increase energy storage by 10k EU", { ru: "Увеличивает энергоёмкость на 10k EU", pt: "Aumenta o armazenamento de energia em 10k EU", zh: "增加10k EU储能" });
Translation.addTranslation("Automatically output to\nthe %s side", { ru: "Автоматическое извлечение с %s стороны", zh: "自动输出到%s方向" });
Translation.addTranslation("Automatically input from\nthe %s side", { ru: "Автоматический ввод с %s стороны", zh: "自动从%s抽入物品" });
// side names are translated in core/item_name.js
// Recipe Viewer
Translation.addTranslation("Heat: ", { ru: "Нагрев: ", es: "Calor: ", pt: "Calor: ", zh: "热量: " });
// Creative Groups
Translation.addTranslation("Ores", { ru: "Руды", pt: "Minérios", zh: "矿石" });
Translation.addTranslation("Metal Blocks", { ru: "Блоки металлов", pt: "Blocos de metal", zh: "金属块" });
Translation.addTranslation("Transformers", { ru: "Трансформаторы", pt: "Transformadores", zh: "变压器" });
Translation.addTranslation("Cables", { ru: "Провода", pt: "Cabos", zh: "导线" });
Translation.addTranslation("Battery Packs", { ru: "Аккумуляторные ранцы", pt: "Mochilas de Baterias", zh: "电池背包" });
Translation.addTranslation("Charging Batteries", { ru: "Заряжающие аккумуляторы", pt: "Carregadores", zh: "充电电池" });
Translation.addTranslation("Crafting Components", { ru: "Компоненты крафта", pt: "Componentes Elétricos", zh: "电子元部件" });
Translation.addTranslation("Materials", { ru: "Материалы", pt: "Materiais", zh: "材料" });
Translation.addTranslation("Batteries", { ru: "Аккумуляторы", pt: "Baterias", zh: "电池" });
Translation.addTranslation("Machine Upgrades", { ru: "Улучшения", pt: "Melhorias", zh: "机器升级组件" });
Translation.addTranslation("Coffee", { ru: "Кофе", pt: "Café", zh: "咖啡" });
Translation.addTranslation("Crushed Ores", { ru: "Измельчённые руды", pt: "Minérios Triturados", zh: "粉碎矿石" });
Translation.addTranslation("Purified Crushed Ores", { ru: "Очищенные измельчённые руды", pt: "Minérios Triturados Purificados", zh: "纯净的粉碎矿石" });
Translation.addTranslation("Dusts", { ru: "Пыль", pt: "Pós", zh: "矿粉" });
Translation.addTranslation("Small Dusts", { ru: "Небольшие кучки пыли", pt: "Pequenas Pilhas de Pó", zh: "小撮矿粉" });
Translation.addTranslation("Ingots", { ru: "Слитки", pt: "Lingotes", zh: "锭" });
Translation.addTranslation("Plates", { ru: "Пластины", pt: "Placas", zh: "金属板" });
Translation.addTranslation("Desne Plates", { ru: "Плотные пластины", pt: "Placas Densas", zh: "致密金属板" });
Translation.addTranslation("Metal Casings", { ru: "Металлические оболочки", pt: "Invólucros", zh: "金属外壳" });
Translation.addTranslation("Nuclear", { ru: "Радиоактивные", pt: "Nuclear", zh: "核原料" });
Translation.addTranslation("Mining Drills", { ru: "Шахтёрские буры", pt: "Brocas de Mineração", zh: "采矿钻头" });
Translation.addTranslation("Cells", { ru: "Капсулы", pt: "Células", zh: "单元" });
Translation.addTranslation("Nuclear Fuel Rods", { ru: "Топливные стержни", pt: "Hastes de Combustível", zh: "核燃料棒" });
Translation.addTranslation("Neutron Reflectors", { ru: "Отражатели нейтронов", pt: "Refletores de Neutrons", zh: "中子反射板" });
Translation.addTranslation("Reactor Platings", { ru: "Обшивки реактора", pt: "Placas de Reator", zh: "反应堆隔板" });
Translation.addTranslation("Reactor Heat Vents", { ru: "Теплоотводы", pt: "Ventilações de Calor", zh: "反应堆散热片" });
Translation.addTranslation("Reactor Heat Exchangers", { ru: "Теплообменники", pt: "Trocadores de Calor", zh: "反应堆热交换器" });
Translation.addTranslation("Reactor Coolants", { ru: "Охлаждающие капсулы", pt: "Células Refrigerantes", zh: "反应堆冷却单元" });
Translation.addTranslation("Seed Bags", { ru: "Мешки с семенами", pt: "Sacos De Sementes", zh: "种子包" });
Translation.addTranslation("Painters", { ru: "Валики", pt: "Rolos de Pintura", zh: "刷子" });
var ConfigIC = {
    debugMode: __config__.getBool("debug_mode"),
    soundEnabled: __config__.getBool("sound_enabled"),
    machineSoundEnabled: __config__.getBool("machine_sounds"),
    voltageEnabled: __config__.getBool("voltage_enabled"),
    wireDamageEnabled: __config__.getBool("wire_damage_enabled"),
    reload: function () {
        var lang = FileTools.ReadKeyValueFile("games/com.mojang/minecraftpe/options.txt").game_language;
        this.gameLanguage = (lang || "en_US").substring(0, 2);
    }
};
ConfigIC.reload();
var player;
Callback.addCallback("LevelLoaded", function () {
    ConfigIC.reload();
    player = Player.get();
});
var isLevelDisplayed = false;
Callback.addCallback("LevelDisplayed", function () {
    isLevelDisplayed = true;
});
Callback.addCallback("LevelLeft", function () {
    isLevelDisplayed = false;
});
// debug
var lasttime = -1;
var frame = 0;
if (ConfigIC.debugMode) {
    Callback.addCallback("tick", function () {
        var t = Debug.sysTime();
        if (frame++ % 20 == 0) {
            if (lasttime != -1) {
                var tps = 1000 / (t - lasttime) * 20;
                Game.tipMessage(Math.round(tps * 10) / 10 + "tps");
            }
            lasttime = t;
        }
    });
}
var AgricultureAPI = {
    cropCards: [],
    abstractFunctions: { /* file: baseCropClasses.js */},
    nutrientBiomeBonusValue: { /* file: biome_bonuses.js */},
    registerCropCard: function (card) {
        if (!card.texture)
            card.texture = card.id;
        if (card.base) {
            var funcs = AgricultureAPI.abstractFunctions[card.base];
            if (funcs)
                this.addMissingFuncsToCard(card, funcs);
        }
        this.addMissingFuncsToCard(card, AgricultureAPI.abstractFunctions["IC2CropCard"]);
        this.cropCards.push(card);
        if (card.baseSeed.addToCreative != false) {
            var extra = this.getDefaultExtra(this.cropCards.length - 1);
            Item.addToCreative(ItemID.cropSeedBag, 1, this.cropCards.length - 1, extra);
        }
    },
    addMissingFuncsToCard: function (card, functions) {
        for (var funcName in functions) {
            if (!card[funcName]) {
                card[funcName] = functions[funcName];
            }
        }
    },
    getCropCard: function (id) {
        for (var i in this.cropCards) {
            if (this.cropCards[i].id == id)
                return this.cropCards[i];
        }
        return null;
    },
    getCardIndexFromID: function (id) {
        for (var i in this.cropCards) {
            if (this.cropCards[i].id == id)
                return i;
        }
        return null;
    },
    getHumidityBiomeBonus: function (x, z) {
        return 0;
    },
    getNutrientBiomeBonus: function (x, z) {
        var biomeID = World.getBiome(x, z);
        var bonus = AgricultureAPI.nutrientBiomeBonusValue[biomeID];
        return bonus || 0;
    },
    getCardFromSeed: function (item) {
        for (var i in this.cropCards) {
            var seed = this.cropCards[i].baseSeed;
            if (seed && eval(seed.id) == item.id && (!seed.data || seed.data == item.data)) {
                return this.cropCards[i];
            }
        }
        return null;
    },
    generateExtraFromValues: function (data) {
        var extra = new ItemExtraData();
        extra.putInt("growth", data.statGrowth);
        extra.putInt("gain", data.statGain);
        extra.putInt("resistance", data.statResistance);
        extra.putInt("scan", data.scanLevel);
        return extra;
    },
    getDefaultExtra: function (cardIndex) {
        var extra = new ItemExtraData();
        var card = AgricultureAPI.cropCards[cardIndex];
        extra.putInt("growth", card.baseSeed.growth);
        extra.putInt("gain", card.baseSeed.gain);
        extra.putInt("resistance", card.baseSeed.resistance);
        extra.putInt("scan", 4);
        return extra;
    }
};
var IntegrationAPI;
(function (IntegrationAPI) {
    function addToRecyclerBlacklist(id) {
        recyclerBlacklist.push(id);
    }
    IntegrationAPI.addToRecyclerBlacklist = addToRecyclerBlacklist;
    function addToolBooxValidItem(id) {
        toolbox_items.push(id);
    }
    IntegrationAPI.addToolBooxValidItem = addToolBooxValidItem;
})(IntegrationAPI || (IntegrationAPI = {}));
var ItemName;
(function (ItemName) {
    var itemRarity = {};
    function setRarity(id, lvl, regFunc) {
        itemRarity[id] = lvl;
        if (regFunc) {
            Item.registerNameOverrideFunction(id, function (item, name) {
                return ItemName.getRarityCode(lvl) + name;
            });
        }
    }
    ItemName.setRarity = setRarity;
    function getRarity(id) {
        return itemRarity[id] || 0;
    }
    ItemName.getRarity = getRarity;
    function getRarityCode(lvl) {
        if (lvl == 1)
            return "§e";
        if (lvl == 2)
            return "§b";
        if (lvl == 3)
            return "§d";
        return "";
    }
    ItemName.getRarityCode = getRarityCode;
    function addTooltip(id, tooltip) {
        Item.registerNameOverrideFunction(id, function (item, name) {
            var rarity = getRarity(item.id);
            return getRarityCode(rarity) + name + "\n§7" + tooltip;
        });
    }
    ItemName.addTooltip = addTooltip;
    function addTierTooltip(stringID, tier) {
        addTooltip(Block.getNumericId(stringID), Translation.translate("Power Tier: ") + tier);
    }
    ItemName.addTierTooltip = addTierTooltip;
    function addStorageBlockTooltip(stringID, tier, capacity) {
        Item.registerNameOverrideFunction(Block.getNumericId(stringID), function (item, name) {
            var rarity = getRarity(item.id);
            return getRarityCode(rarity) + ItemName.showBlockStorage(item, name, tier, capacity);
        });
    }
    ItemName.addStorageBlockTooltip = addStorageBlockTooltip;
    function addStoredLiquidTooltip(id) {
        Item.registerNameOverrideFunction(id, function (item, name) {
            return name += "\n§7" + (1000 - item.data) + " mB";
        });
    }
    ItemName.addStoredLiquidTooltip = addStoredLiquidTooltip;
    function showBlockStorage(item, name, tier, capacity) {
        var tierText = "§7" + Translation.translate("Power Tier: ") + tier;
        var energy = 0;
        if (item.extra) {
            energy = item.extra.getInt("energy");
        }
        var energyText = displayEnergy(energy) + "/" + capacity + " EU";
        return name + "\n" + tierText + "\n" + energyText;
    }
    ItemName.showBlockStorage = showBlockStorage;
    function getItemStorageText(item) {
        var capacity = ChargeItemRegistry.getMaxCharge(item.id);
        var energy = ChargeItemRegistry.getEnergyStored(item);
        return "§7" + displayEnergy(energy) + "/" + displayEnergy(capacity) + " EU";
    }
    ItemName.getItemStorageText = getItemStorageText;
    function showItemStorage(item, name) {
        var rarity = ItemName.getRarity(item.id);
        if (rarity > 0) {
            name = ItemName.getRarityCode(rarity) + name;
        }
        return name + '\n' + ItemName.getItemStorageText(item);
    }
    ItemName.showItemStorage = showItemStorage;
    function displayEnergy(energy) {
        if (!ConfigIC.debugMode) {
            if (energy >= 1e6) {
                return Math.floor(energy / 1e5) / 10 + "M";
            }
            if (energy >= 1000) {
                return Math.floor(energy / 100) / 10 + "K";
            }
        }
        return energy;
    }
    ItemName.displayEnergy = displayEnergy;
    function getSideName(side) {
        var sideNames = {
            en: [
                "first valid",
                "bottom",
                "top",
                "north",
                "south",
                "east",
                "west"
            ],
            ru: [
                "первой подходящей",
                "нижней",
                "верхней",
                "северной",
                "южной",
                "восточной",
                "западной"
            ],
            zh: [
                "初次生效",
                "底部",
                "顶部",
                "北边",
                "南边",
                "东边",
                "西边"
            ],
            es: [
                "Primera vez efectivo",
                "abajo",
                "arriba",
                "norte",
                "sur",
                "este",
                "oeste"
            ],
            pt: [
                "Primeira vez eficaz",
                "o lado de baixo",
                "o lado de cima",
                "o norte",
                "o sul",
                "o leste",
                "o oeste"
            ]
        };
        if (sideNames[ConfigIC.gameLanguage]) {
            return sideNames[ConfigIC.gameLanguage][side + 1];
        }
        else {
            return sideNames["en"][side + 1];
        }
    }
    ItemName.getSideName = getSideName;
})(ItemName || (ItemName = {}));
var RadiationAPI = {
    items: {},
    playerRad: 0,
    sources: {},
    hazmatArmor: [],
    regRadioactiveItem: function (id, duration, stack) {
        this.items[id] = [duration, stack || false];
    },
    getItemRadiation: function (id) {
        return this.items[id];
    },
    isRadioactiveItem: function (id) {
        return this.items[id] ? true : false;
    },
    emitItemRadiation: function (id) {
        var radiation = this.getItemRadiation(id);
        if (radiation) {
            if (radiation[1]) {
                this.addRadiation(radiation[0]);
            }
            else {
                this.setRadiation(radiation[0]);
            }
            return true;
        }
        return false;
    },
    setRadiation: function (duration) {
        this.playerRad = Math.max(this.playerRad, duration);
    },
    addRadiation: function (duration) {
        this.playerRad = Math.max(this.playerRad + duration, 0);
    },
    registerHazmatArmor: function (id) {
        this.hazmatArmor.push(id);
    },
    checkPlayerArmor: function () {
        for (var i_2 = 0; i_2 < 4; i_2++) {
            var armorID = Player.getArmorSlot(i_2).id;
            if (this.hazmatArmor.indexOf(armorID) == -1)
                return true;
        }
        return false;
    },
    addEffect: function (ent, duration) {
        if (ent == player) {
            if (this.checkPlayerArmor()) {
                Entity.addEffect(player, PotionEffect.poison, 1, duration * 20);
                this.setRadiation(duration);
            }
        }
        else {
            Entity.addEffect(ent, PotionEffect.poison, 1, duration * 20);
            if (Entity.getHealth(ent) == 1) {
                Entity.damageEntity(ent, 1);
            }
        }
    },
    addEffectInRange: function (x, y, z, radius, duration) {
        var entities = Entity.getAll();
        for (var i_3 in entities) {
            var ent = entities[i_3];
            if (canTakeDamage(ent, "radiation") && Entity.getHealth(ent) > 0) {
                var c = Entity.getPosition(ent);
                var xx = Math.abs(x - c.x), yy = Math.abs(y - c.y), zz = Math.abs(z - c.z);
                if (Math.sqrt(xx * xx + yy * yy + zz * zz) <= radius) {
                    this.addEffect(ent, duration);
                }
            }
        }
    },
    addRadiationSource: function (x, y, z, radius, duration) {
        this.sources[x + ':' + y + ':' + z] = {
            x: x,
            y: y,
            z: z,
            radius: radius,
            timer: duration
        };
    },
    tick: function () {
        if (World.getThreadTime() % 20 == 0) {
            var radiation = false;
            if (this.checkPlayerArmor()) {
                for (var i_4 = 9; i_4 < 45; i_4++) {
                    var slot = Player.getInventorySlot(i_4);
                    if (this.emitItemRadiation(slot.id)) {
                        radiation = true;
                    }
                }
            }
            if (!radiation) {
                this.addRadiation(-1);
            }
            var armor = Player.getArmorSlot(0);
            if (this.playerRad > 0 && !(armor.id == ItemID.quantumHelmet && ChargeItemRegistry.getEnergyStored(armor) >= 100000)) {
                Entity.addEffect(player, PotionEffect.poison, 1, this.playerRad * 20);
                if (Entity.getHealth(player) == 1) {
                    Entity.damageEntity(player, 1);
                }
            }
            for (var i_5 in this.sources) {
                var source = this.sources[i_5];
                this.addEffectInRange(source.x, source.y, source.z, source.radius, 10);
                source.timer--;
                if (source.timer <= 0) {
                    delete this.sources[i_5];
                }
            }
        }
    }
};
Saver.addSavesScope("radiation", function read(scope) {
    RadiationAPI.playerRad = scope.duration || 0;
    RadiationAPI.sources = scope.sources || {};
}, function save() {
    return {
        duration: RadiationAPI.playerRad,
        sources: RadiationAPI.sources
    };
});
Callback.addCallback("tick", function () {
    RadiationAPI.tick();
});
Callback.addCallback("EntityDeath", function (entity) {
    if (entity == player) {
        RadiationAPI.playerRad = 0;
    }
});
SoundManager.init(16);
SoundManager.setResourcePath(__dir__ + "assets/sounds/");
SoundManager.registerSound("GeneratorLoop.ogg", "Generators/GeneratorLoop.ogg", true);
SoundManager.registerSound("GeothermalLoop.ogg", "Generators/GeothermalLoop.ogg", true);
SoundManager.registerSound("WatermillLoop.ogg", "Generators/WatermillLoop.ogg", true);
SoundManager.registerSound("WindGenLoop.ogg", "Generators/WindGenLoop.ogg", true);
SoundManager.registerSound("MassFabLoop.ogg", "Generators/MassFabricator/MassFabLoop.ogg", true);
SoundManager.registerSound("MassFabScrapSolo.ogg", "Generators/MassFabricator/MassFabScrapSolo.ogg");
SoundManager.registerSound("GeigerHighEU.ogg", "Generators/NuclearReactor/GeigerHighEU.ogg", true);
SoundManager.registerSound("GeigerLowEU.ogg", "Generators/NuclearReactor/GeigerLowEU.ogg", true);
SoundManager.registerSound("GeigerMedEU.ogg", "Generators/NuclearReactor/GeigerMedEU.ogg", true);
SoundManager.registerSound("NuclearReactorLoop.ogg", "Generators/NuclearReactor/NuclearReactorLoop.ogg", true);
SoundManager.registerSound("CompressorOp.ogg", "Machines/CompressorOp.ogg", true);
SoundManager.registerSound("ElectrolyzerLoop.ogg", "Machines/ElectrolyzerLoop.ogg", true);
SoundManager.registerSound("ExtractorOp.ogg", "Machines/ExtractorOp.ogg", true);
SoundManager.registerSound("InterruptOne.ogg", "Machines/InterruptOne.ogg");
SoundManager.registerSound("IronFurnaceOp.ogg", "Machines/IronFurnaceOp.ogg", true);
SoundManager.registerSound("MaceratorOp.ogg", "Machines/MaceratorOp.ogg", true);
SoundManager.registerSound("MachineOverload.ogg", "Machines/MachineOverload.ogg");
SoundManager.registerSound("MagnetizerLoop.ogg", "Machines/MagnetizerLoop.ogg", true);
SoundManager.registerSound("MinerOp.ogg", "Machines/MinerOp.ogg", true);
SoundManager.registerSound("PumpOp.ogg", "Machines/PumpOp.ogg", true);
SoundManager.registerSound("RecyclerOp.ogg", "Machines/RecyclerOp.ogg", true);
SoundManager.registerSound("TerraformerGenericloop.ogg", "Machines/TerraformerGenericloop.ogg", true);
SoundManager.registerSound("ElectroFurnaceLoop.ogg", "Machines/Electro Furnace/ElectroFurnaceLoop.ogg", true);
SoundManager.registerSound("ElectroFurnaceStart.ogg", "Machines/Electro Furnace/ElectroFurnaceStart.ogg");
SoundManager.registerSound("ElectroFurnaceStop.ogg", "Machines/Electro Furnace/ElectroFurnaceStop.ogg");
SoundManager.registerSound("InductionLoop.ogg", "Machines/Induction Furnace/InductionLoop.ogg", true);
SoundManager.registerSound("InductionStart.ogg", "Machines/Induction Furnace/InductionStart.ogg");
SoundManager.registerSound("InductionStop.ogg", "Machines/Induction Furnace/InductionStop.ogg");
SoundManager.registerSound("TeleChargedLoop.ogg", "Machines/Teleporter/TeleChargedLoop.ogg", true);
SoundManager.registerSound("TeleUse.ogg", "Machines/Teleporter/TeleUse.ogg");
SoundManager.registerSound("BatteryUse.ogg", "Tools/BatteryUse.ogg");
SoundManager.registerSound("dynamiteomote.ogg", "Tools/dynamiteomote.ogg");
SoundManager.registerSound("eat.ogg", "Tools/eat.ogg");
SoundManager.registerSound("InsulationCutters.ogg", "Tools/InsulationCutters.ogg");
SoundManager.registerSound("JetpackLoop.ogg", "Tools/JetpackLoop.ogg", true);
SoundManager.registerSound("NukeExplosion.ogg", "Tools/NukeExplosion.ogg");
SoundManager.registerSound("ODScanner.ogg", "Tools/ODScanner.ogg");
SoundManager.registerSound("Painter.ogg", "Tools/Painter.ogg");
SoundManager.registerSound("RubberTrampoline.ogg", "Tools/RubberTrampoline.ogg");
SoundManager.registerSound("Treetap.ogg", "Tools/Treetap.ogg");
SoundManager.registerSound("Wrench.ogg", "Tools/Wrench.ogg");
SoundManager.registerSound("ChainsawIdle.ogg", "Tools/Chainsaw/ChainsawIdle.ogg", true);
SoundManager.registerSound("ChainsawStop.ogg", "Tools/Chainsaw/ChainsawStop.ogg");
SoundManager.registerSound("ChainsawUseOne.ogg", "Tools/Chainsaw/ChainsawUseOne.ogg");
SoundManager.registerSound("ChainsawUseTwo.ogg", "Tools/Chainsaw/ChainsawUseTwo.ogg");
SoundManager.registerSound("DrillHard.ogg", "Tools/Drill/DrillHard.ogg");
SoundManager.registerSound("DrillSoft.ogg", "Tools/Drill/DrillSoft.ogg");
SoundManager.registerSound("DrillUseLoop.ogg", "Tools/Drill/DrillUseLoop.ogg", true);
SoundManager.registerSound("MiningLaser.ogg", "Tools/MiningLaser/MiningLaser.ogg");
SoundManager.registerSound("MiningLaserExplosive.ogg", "Tools/MiningLaser/MiningLaserExplosive.ogg");
SoundManager.registerSound("MiningLaserLongRange.ogg", "Tools/MiningLaser/MiningLaserLongRange.ogg");
SoundManager.registerSound("MiningLaserLowFocus.ogg", "Tools/MiningLaser/MiningLaserLowFocus.ogg");
SoundManager.registerSound("MiningLaserScatter.ogg", "Tools/MiningLaser/MiningLaserScatter.ogg");
SoundManager.registerSound("NanosaberIdle.ogg", "Tools/Nanosaber/NanosaberIdle.ogg", true);
SoundManager.registerSound("NanosaberPowerup.ogg", "Tools/Nanosaber/NanosaberPowerup.ogg");
SoundManager.registerSound("NanosaberSwing.ogg", ["Tools/Nanosaber/NanosaberSwing1.ogg", "Tools/Nanosaber/NanosaberSwing2.ogg", "Tools/Nanosaber/NanosaberSwing3.ogg"]);
SoundManager.registerSound("QuantumsuitBoots.ogg", "Tools/QuantumSuit/QuantumsuitBoots.ogg");
var ICTool = {
    wrenchData: {},
    registerWrench: function (id, chance, energyPerUse) {
        this.wrenchData[id] = { chance: chance, energy: energyPerUse };
    },
    getWrenchData: function (id) {
        return this.wrenchData[id];
    },
    isValidWrench: function (item, damage) {
        var wrench = this.getWrenchData(item.id);
        if (wrench) {
            var energyStored = ChargeItemRegistry.getEnergyStored(item);
            if (!wrench.energy || energyStored >= wrench.energy * damage) {
                return true;
            }
        }
        return false;
    },
    useWrench: function (coords, item, damage) {
        var wrench = this.getWrenchData(item.id);
        if (!wrench.energy) {
            ToolAPI.breakCarriedTool(damage);
        }
        else {
            this.useElectricItem(item, wrench.energy * damage);
        }
        SoundManager.playSoundAtBlock(coords, "Wrench.ogg");
    },
    addRecipe: function (result, data, tool) {
        data.push({ id: tool, data: -1 });
        Recipes.addShapeless(result, data, function (api, field, result) {
            for (var i_6 in field) {
                if (field[i_6].id == tool) {
                    field[i_6].data++;
                    if (field[i_6].data >= Item.getMaxDamage(tool)) {
                        field[i_6].id = field[i_6].count = field[i_6].data = 0;
                    }
                }
                else {
                    api.decreaseFieldSlot(i_6);
                }
            }
        });
    },
    dischargeItem: function (item, consume) {
        var energy = 0;
        var armor = Player.getArmorSlot(1);
        var itemChargeLevel = ChargeItemRegistry.getItemData(item.id).level;
        var armorChargeData = ChargeItemRegistry.getItemData(armor.id);
        if (armorChargeData && armorChargeData.level >= itemChargeLevel) {
            energy = ChargeItemRegistry.getEnergyFrom(armor, "Eu", consume, consume, 100);
            consume -= energy;
        }
        var energyStored = ChargeItemRegistry.getEnergyStored(item);
        if (energyStored >= consume) {
            if (energy > 0) {
                Player.setArmorSlot(1, armor.id, 1, armor.data, armor.extra);
            }
            ChargeItemRegistry.setEnergyStored(item, energyStored - consume);
            return true;
        }
        return false;
    },
    useElectricItem: function (item, consume) {
        if (this.dischargeItem(item, consume)) {
            Player.setCarriedItem(item.id, 1, item.data, item.extra);
            return true;
        }
        return false;
    },
    registerElectricHoe: function (nameID) {
        Item.registerUseFunction(nameID, function (coords, item, block) {
            if ((block.id == 2 || block.id == 3 || block.id == 110 || block.id == 243) && coords.side == 1 && ICTool.useElectricItem(item, 50)) {
                World.setBlock(coords.x, coords.y, coords.z, 60);
                World.playSoundAt(coords.x + .5, coords.y + 1, coords.z + .5, "step.gravel", 1, 0.8);
            }
        });
    },
    registerElectricTreetap: function (nameID) {
        Item.registerUseFunction(nameID, function (coords, item, block) {
            if (block.id == BlockID.rubberTreeLogLatex && block.data >= 4 && block.data == coords.side + 2 && ICTool.useElectricItem(item, 50)) {
                SoundManager.playSoundAt(coords.vec.x, coords.vec.y, coords.vec.z, "Treetap.ogg");
                World.setBlock(coords.x, coords.y, coords.z, BlockID.rubberTreeLogLatex, block.data - 4);
                Entity.setVelocity(World.drop(coords.relative.x + 0.5, coords.relative.y + 0.5, coords.relative.z + 0.5, ItemID.latex, randomInt(1, 3), 0), (coords.relative.x - coords.x) * 0.25, (coords.relative.y - coords.y) * 0.25, (coords.relative.z - coords.z) * 0.25);
            }
        });
    },
    setOnHandSound: function (itemID, idleSound, stopSound) {
        Callback.addCallback("LocalTick", function () {
            if (!ConfigIC.soundEnabled) {
                return;
            }
            var item = Player.getCarriedItem();
            var tool = ToolAPI.getToolData(item.id);
            if (item.id == itemID && (!tool || !tool.toolMaterial.energyPerUse || ChargeItemRegistry.getEnergyStored(item) >= tool.toolMaterial.energyPerUse)) {
                SoundManager.startPlaySound(AudioSource.PLAYER, item.id, idleSound);
            }
            else if (SoundManager.stopPlaySound(itemID) && stopSound) {
                SoundManager.playSound(stopSound);
            }
        });
    }
};
// temporary for reverse compatibility
// it's very fun misspelling
ICTool.registerElectricTreerap = ICTool.registerElectricTreetap;
Callback.addCallback("DestroyBlockStart", function (coords, block) {
    if (MachineRegistry.isMachine(block.id)) {
        var item = Player.getCarriedItem();
        if (ICTool.isValidWrench(item, 10)) {
            Block.setTempDestroyTime(block.id, 0);
        }
    }
});
var currentUIscreen;
Callback.addCallback("NativeGuiChanged", function (screenName) {
    currentUIscreen = screenName;
    if (screenName != "in_game_play_screen" && UIbuttons.container) {
        UIbuttons.container.close();
    }
});
var button_scale = __config__.getNumber("button_scale");
var UIbuttons = {
    data: {},
    onSwitch: {},
    onUpdate: {},
    isEnabled: false,
    container: null,
    Window: new UI.Window({
        location: {
            x: 1000 - button_scale,
            y: UI.getScreenHeight() / 2 - button_scale * 2,
            width: button_scale,
            height: button_scale * 5
        },
        drawing: [{ type: "background", color: 0 }],
        elements: {}
    }),
    setArmorButton: function (id, name) {
        var data = { type: 0, name: name };
        if (!this.data[id]) {
            this.data[id] = [data];
        }
        else {
            this.data[id].push(data);
        }
    },
    setToolButton: function (id, name, notHidden) {
        var data = { type: 1, name: name, hidden: !notHidden };
        if (!this.data[id]) {
            this.data[id] = [data];
        }
        else {
            this.data[id].push(data);
        }
    },
    getButtons: function (id) {
        return this.data[id];
    },
    registerButton: function (name, properties) {
        buttonContent[name] = properties;
        buttonMap[name] = false;
    },
    registerSwitchFunction: function (id, func) {
        this.onSwitch[id] = func;
    },
    onButtonUpdate: function (name, func) {
        this.onUpdate[name] = func;
    }
};
var buttonMap = {
    button_nightvision: false,
    button_fly: false,
    button_hover: false,
    button_jump: false,
};
var buttonContent = {
    button_nightvision: {
        y: 0,
        type: "button",
        bitmap: "button_nightvision_on",
        bitmap2: "button_nightvision_off",
        scale: 50,
        clicker: {
            onClick: function () {
                var armor = Player.getArmorSlot(0);
                var extra = armor.extra;
                if (extra) {
                    var nightvision = extra.getBoolean("nv");
                }
                else {
                    var nightvision = false;
                    extra = new ItemExtraData();
                }
                if (nightvision) {
                    extra.putBoolean("nv", false);
                    Game.message("§4" + Translation.translate("Nightvision mode disabled"));
                }
                else {
                    extra.putBoolean("nv", true);
                    Game.message("§2" + Translation.translate("Nightvision mode enabled"));
                }
                Player.setArmorSlot(0, armor.id, 1, armor.data, extra);
            }
        }
    },
    button_fly: {
        y: 1000,
        type: "button",
        bitmap: "button_fly_on",
        bitmap2: "button_fly_off",
        scale: 50
    },
    button_hover: {
        y: 2000,
        type: "button",
        bitmap: "button_hover_off",
        scale: 50,
        clicker: {
            onClick: function () {
                var vel = Player.getVelocity();
                var armor = Player.getArmorSlot(1);
                if (vel.y.toFixed(4) != fallVelocity && ChargeItemRegistry.getEnergyStored(armor) >= 8) {
                    var extra = armor.extra || new ItemExtraData();
                    var hover = extra.getBoolean("hover");
                    if (hover) {
                        extra.putBoolean("hover", false);
                        Game.message("§4" + Translation.translate("Hover mode disabled"));
                    }
                    else {
                        extra.putBoolean("hover", true);
                        Game.message("§2" + Translation.translate("Hover mode enabled"));
                    }
                    Player.setArmorSlot(1, armor.id, 1, armor.data, extra);
                }
            }
        }
    },
    button_jump: {
        y: 3000,
        type: "button",
        bitmap: "button_jump_on",
        bitmap2: "button_jump_off",
        scale: 50,
        clicker: {
            onClick: function () {
                var armor = Player.getArmorSlot(3);
                var energyStored = ChargeItemRegistry.getEnergyStored(armor);
                var vel = Player.getVelocity();
                if (energyStored >= 4000 && vel.y.toFixed(4) == fallVelocity) {
                    Player.setVelocity(vel.x * 3.5, 1.3, vel.z * 3.5);
                    ChargeItemRegistry.setEnergyStored(armor, energyStored - 4000);
                    Player.setArmorSlot(3, armor.id, 1, armor.data, armor.extra);
                }
            }
        }
    },
    button_switch: {
        y: 4000,
        type: "button",
        bitmap: "button_switch",
        bitmap2: "button_switch_touched",
        scale: 25,
        clicker: {
            onClick: function () {
                var item = Player.getCarriedItem();
                if (UIbuttons.onSwitch[item.id]) {
                    UIbuttons.onSwitch[item.id](item);
                }
            }
        }
    }
};
UIbuttons.Window.setAsGameOverlay(true);
UIbuttons.onButtonUpdate("button_hover", function (element) {
    var armor = Player.getArmorSlot(1);
    var extra = armor.extra;
    if (extra && extra.getBoolean("hover")) {
        element.bitmap = "button_hover_on";
    }
    else {
        element.bitmap = "button_hover_off";
    }
});
function updateUIbuttons() {
    var elements = UIbuttons.Window.content.elements;
    for (var name in buttonMap) {
        if (buttonMap[name]) {
            if (!elements[name]) {
                elements[name] = buttonContent[name];
            }
            var element = elements[name];
            var func = UIbuttons.onUpdate[name];
            if (func)
                func(element);
            element.x = 0;
            buttonMap[name] = false;
        }
        else {
            elements[name] = null;
        }
    }
}
Callback.addCallback("LocalTick", function () {
    var armor = [Player.getArmorSlot(0), Player.getArmorSlot(1), Player.getArmorSlot(2), Player.getArmorSlot(3)];
    for (var i in armor) {
        var buttons = UIbuttons.getButtons(armor[i].id);
        for (var i in buttons) {
            var button = buttons[i];
            if (button.type == 0) {
                buttonMap[button.name] = true;
                UIbuttons.isEnabled = true;
            }
        }
    }
    var item = Player.getCarriedItem();
    var buttons = UIbuttons.getButtons(item.id);
    for (var i in buttons) {
        var button = buttons[i];
        if (button.type == 1 && (!button.hidden || Entity.getSneaking(Player.get()))) {
            buttonMap[button.name] = true;
            UIbuttons.isEnabled = true;
        }
    }
    if (UIbuttons.isEnabled && currentUIscreen == "in_game_play_screen") {
        updateUIbuttons();
        if (!UIbuttons.container || !UIbuttons.container.isOpened()) {
            UIbuttons.container = new UI.Container();
            UIbuttons.container.openAs(UIbuttons.Window);
        }
        var armor = armor[1];
        var hoverMode = armor.extra ? armor.extra.getBoolean("hover") : false;
        var playSound = hoverMode;
        var energyStored = ChargeItemRegistry.getEnergyStored(armor);
        if (energyStored >= 8 && UIbuttons.container.isElementTouched("button_fly")) {
            var vel = Player.getVelocity();
            if (vel.y > -1.2) {
                Utils.resetFallHeight();
            }
            var y = Player.getPosition().y;
            if (y < 256) {
                var vy = Math.min(32, 265 - y) / 160; // max 0.2
                if (hoverMode) {
                    ChargeItemRegistry.setEnergyStored(armor, energyStored - 2);
                    Player.setArmorSlot(1, armor.id, 1, armor.data, armor.extra);
                    if (vel.y < 0.2) {
                        Player.addVelocity(0, Math.min(vy, 0.2 - vel.y), 0);
                    }
                }
                else {
                    ChargeItemRegistry.setEnergyStored(armor, energyStored - 8);
                    Player.setArmorSlot(1, armor.id, 1, armor.data, armor.extra);
                    if (vel.y < 0.67) {
                        Player.addVelocity(0, Math.min(vy, 0.67 - vel.y), 0);
                    }
                }
            }
            playSound = true;
        }
        if (playSound && ConfigIC.soundEnabled) {
            if (hoverMode) {
                SoundManager.startPlaySound(AudioSource.PLAYER, "JetpackLoop.ogg", 0.8);
            }
            else {
                SoundManager.startPlaySound(AudioSource.PLAYER, "JetpackLoop.ogg", 1);
            }
        }
        if (!playSound) {
            SoundManager.stopPlaySound(Player.get(), "JetpackLoop.ogg");
        }
    }
    else if (UIbuttons.container) {
        UIbuttons.container.close();
        UIbuttons.container = null;
    }
    UIbuttons.isEnabled = false;
});
var Utils;
(function (Utils) {
    var fallStartHeight = 0;
    var isEnderPearlDamage = false;
    Callback.addCallback("LocalTick", function () {
        isEnderPearlDamage = false;
        if (Utils.isPlayerOnGround()) {
            Utils.resetFallHeight();
        }
    });
    Callback.addCallback("ProjectileHit", function (projectile) {
        if (Entity.getType(projectile) == 87) {
            isEnderPearlDamage = true;
        }
    });
    function getFallDamage(damage) {
        if (damage === void 0) { damage = 0; }
        if (isEnderPearlDamage)
            return damage;
        var pos = Player.getPosition().y;
        var height = fallStartHeight - pos;
        if (height > 7) {
            height = Math.round(height);
        }
        else if (height > 6) {
            height = Math.round(height - 0.125);
        }
        else if (height > 5) {
            height = Math.round(height - 0.25);
        }
        else {
            height = Math.round(height + 3 / 8);
        }
        var damage = height - 3;
        return (damage > 0) ? damage : 0;
    }
    Utils.getFallDamage = getFallDamage;
    function resetFallHeight() {
        fallStartHeight = Player.getPosition().y;
    }
    Utils.resetFallHeight = resetFallHeight;
    function getFallDamageModifier() {
        var slot = Player.getArmorSlot(3);
        if (slot.id != 0 && slot.extra) {
            var enchants = slot.extra.getEnchants();
            var enchantLvl = enchants[Native.Enchantment.FEATHER_FALLING];
            if (enchantLvl) {
                return 1 - 0.12 * enchantLvl;
            }
        }
        return 1;
    }
    Utils.getFallDamageModifier = getFallDamageModifier;
    function fixFallDamage(damage) {
        var newDamage = Utils.getFallDamage(damage);
        if (newDamage < damage) {
            var armor = Player.getArmorSlot(3);
            if (newDamage == 0) {
                Game.prevent();
            }
            else if (armor.id != ItemID.quantumBoots && armor.id != ItemID.nanoBoots) {
                var damageModifier = Utils.getFallDamageModifier();
                var damageReduce = Math.floor((damage - newDamage) * damageModifier);
                Entity.setHealth(player, Entity.getHealth(player) + damageReduce);
            }
        }
    }
    Utils.fixFallDamage = fixFallDamage;
    function isPlayerOnGround() {
        var vel = Player.getVelocity();
        return Math.abs(vel.y - fallVelocity) < 0.0001;
    }
    Utils.isPlayerOnGround = isPlayerOnGround;
})(Utils || (Utils = {}));
var TileEntityMachine = /** @class */ (function (_super) {
    __extends(TileEntityMachine, _super);
    function TileEntityMachine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TileEntityMachine.prototype.onItemUse = function (coords, item, player) {
        if (item.id == ItemID.debugItem || item.id == ItemID.EUMeter)
            return true;
        return false;
    };
    TileEntityMachine.prototype.destroy = function () {
        BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
        return false;
    };
    return TileEntityMachine;
}(TileEntityBase));
/// <reference path="./TileEntityMachine.ts" />
var TileEntityElectricMachine = /** @class */ (function (_super) {
    __extends(TileEntityElectricMachine, _super);
    function TileEntityElectricMachine(tier) {
        var _this = _super.call(this) || this;
        _this.energy_receive = 0;
        _this.last_energy_receive = 0;
        _this.voltage = 0;
        _this.last_voltage = 0;
        _this.defaultValues = {
            energy: 0
        };
        _this.tier = tier;
        return _this;
    }
    TileEntityElectricMachine.prototype.getTier = function () {
        return this.tier;
    };
    TileEntityElectricMachine.prototype.getEnergyStorage = function () {
        return 0;
    };
    TileEntityElectricMachine.prototype.energyTick = function (type, src) {
        this.last_energy_receive = this.energy_receive;
        this.energy_receive = 0;
        this.last_voltage = this.voltage;
        this.voltage = 0;
    };
    TileEntityElectricMachine.prototype.getMaxPacketSize = function () {
        return 8 << this.getTier() * 2;
    };
    TileEntityElectricMachine.prototype.energyReceive = function (type, amount, voltage) {
        var maxVoltage = this.getMaxPacketSize();
        if (voltage > maxVoltage) {
            if (ConfigIC.voltageEnabled) {
                World.setBlock(this.x, this.y, this.z, 0, 0);
                World.explode(this.x + 0.5, this.y + 0.5, this.z + 0.5, this.getExplosionPower(), true);
                SoundManager.playSoundAtBlock(this, "MachineOverload.ogg", 1, 32);
                this.selfDestroy();
                return 1;
            }
            var add = Math.min(maxVoltage, this.getEnergyStorage() - this.data.energy);
        }
        else {
            var add = Math.min(amount, this.getEnergyStorage() - this.data.energy);
        }
        this.data.energy += add;
        this.energy_receive += add;
        this.voltage = Math.max(this.voltage, voltage);
        return add;
    };
    TileEntityElectricMachine.prototype.getExplosionPower = function () {
        return 1.2;
    };
    return TileEntityElectricMachine;
}(TileEntityMachine));
/// <reference path="./TileEntityElectricMachine.ts" />
var TileEntityGenerator = /** @class */ (function (_super) {
    __extends(TileEntityGenerator, _super);
    function TileEntityGenerator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TileEntityGenerator.prototype.canReceiveEnergy = function () {
        return false;
    };
    TileEntityGenerator.prototype.isEnergySource = function () {
        return true;
    };
    TileEntityGenerator.prototype.energyTick = function (type, src) {
        _super.prototype.energyTick.call(this, type, src);
        var output = this.getMaxPacketSize();
        if (this.data.energy >= output) {
            this.data.energy += src.add(output) - output;
        }
    };
    return TileEntityGenerator;
}(TileEntityElectricMachine));
/// <reference path="../../machine/TileEntityMachine.ts" />
/// <reference path="../../machine/TileEntityElectricMachine.ts" />
/// <reference path="../../machine/TileEntityGenerator.ts" />
var MachineRegistry;
(function (MachineRegistry) {
    var machineIDs = {};
    function isMachine(id) {
        return machineIDs[id];
    }
    MachineRegistry.isMachine = isMachine;
    // register IC2 Machine
    function registerPrototype(id, Prototype) {
        // register ID
        machineIDs[id] = true;
        ToolAPI.registerBlockMaterial(id, "stone", 1, true);
        Block.setDestroyTime(id, 3);
        TileEntity.registerPrototype(id, Prototype);
        // audio
        if (Prototype.getOperationSound) {
            Prototype.audioSource = null;
            Prototype.finishingSound = 0;
            if (!Prototype.getStartingSound) {
                Prototype.getStartingSound = function () { return null; };
            }
            if (!Prototype.getInterruptSound) {
                Prototype.getInterruptSound = function () { return null; };
            }
            Prototype.startPlaySound = Prototype.startPlaySound || function () {
                if (!ConfigIC.machineSoundEnabled)
                    return;
                if (!this.audioSource && !this.remove) {
                    if (this.finishingSound != 0) {
                        SoundManager.stop(this.finishingSound);
                    }
                    if (this.getStartingSound()) {
                        this.audioSource = SoundManager.createSource(AudioSource.TILEENTITY, this, this.getStartingSound());
                        this.audioSource.setNextSound(this.getOperationSound(), true);
                    }
                    else {
                        this.audioSource = SoundManager.createSource(AudioSource.TILEENTITY, this, this.getOperationSound());
                    }
                }
            };
            Prototype.stopPlaySound = Prototype.stopPlaySound || function () {
                if (this.audioSource) {
                    SoundManager.removeSource(this.audioSource);
                    this.audioSource = null;
                    if (this.getInterruptSound()) {
                        this.finishingSound = SoundManager.playSoundAtBlock(this, this.getInterruptSound());
                    }
                }
            };
        }
        // machine activation
        if (Prototype.defaultValues && Prototype.defaultValues.isActive !== undefined) {
            if (!Prototype.renderModel) {
                Prototype.renderModel = Prototype.renderModelWithRotation;
            }
            Prototype.setActive = Prototype.setActive || Prototype.setActive;
            Prototype.activate = Prototype.activate || function () {
                this.setActive(true);
            };
            Prototype.deactivate = Prototype.deactivate || function () {
                this.setActive(false);
            };
        }
        if (!Prototype.init && Prototype.renderModel) {
            Prototype.init = Prototype.renderModel;
        }
        if (Prototype instanceof TileEntityElectricMachine) {
            // wire connection
            ICRender.getGroup("ic-wire").add(id, -1);
            // register for energy net
            EnergyTileRegistry.addEnergyTypeForId(id, EU);
        }
    }
    MachineRegistry.registerPrototype = registerPrototype;
    // for reverse compatibility
    function registerElectricMachine(id, Prototype) {
        // wire connection
        ICRender.getGroup("ic-wire").add(id, -1);
        // setup energy values
        if (Prototype.defaultValues) {
            Prototype.defaultValues.energy = 0;
            Prototype.defaultValues.energy_receive = 0;
            Prototype.defaultValues.last_energy_receive = 0;
            Prototype.defaultValues.voltage = 0;
            Prototype.defaultValues.last_voltage = 0;
        }
        else {
            Prototype.defaultValues = {
                energy: 0,
                energy_receive: 0,
                last_energy_receive: 0,
                voltage: 0,
                last_voltage: 0
            };
        }
        for (var key in TileEntityElectricMachine.prototype) {
            if (!Prototype.hasOwnProperty(key)) {
                Prototype[key] = TileEntityElectricMachine.prototype[key];
            }
        }
        this.registerPrototype(id, Prototype);
        // register for energy net
        EnergyTileRegistry.addEnergyTypeForId(id, EU);
    }
    MachineRegistry.registerElectricMachine = registerElectricMachine;
    function registerGenerator(id, Prototype) {
        for (var key in TileEntityGenerator.prototype) {
            if (!Prototype.hasOwnProperty(key)) {
                Prototype[key] = TileEntityGenerator.prototype[key];
            }
        }
        this.registerPrototype(id, Prototype);
    }
    MachineRegistry.registerGenerator = registerGenerator;
    function registerEUStorage(id, Prototype) {
        Prototype.isEnergySource = function () {
            return true;
        };
        Prototype.energyReceive = Prototype.energyReceive || this.basicEnergyReceiveFunc;
        Prototype.energyTick = Prototype.energyTick || this.basicEnergyOutFunc;
        Prototype.isTeleporterCompatible = true;
        this.registerElectricMachine(id, Prototype);
    }
    MachineRegistry.registerEUStorage = registerEUStorage;
    // standard functions
    function setStoragePlaceFunction(id, fullRotation) {
        Block.registerPlaceFunction(BlockID[id], function (coords, item, block) {
            var place = World.canTileBeReplaced(block.id, block.data) ? coords : coords.relative;
            World.setBlock(place.x, place.y, place.z, item.id, 0);
            World.playSound(place.x, place.y, place.z, "dig.stone", 1, 0.8);
            var rotation = TileRenderer.getBlockRotation(fullRotation);
            var tile = World.addTileEntity(place.x, place.y, place.z);
            tile.data.meta = rotation;
            TileRenderer.mapAtCoords(place.x, place.y, place.z, item.id, rotation);
            if (item.extra) {
                tile.data.energy = item.extra.getInt("energy");
            }
        });
    }
    MachineRegistry.setStoragePlaceFunction = setStoragePlaceFunction;
    function getMachineDrop(coords, blockID, level, basicDrop, saveEnergyAmount) {
        var item = Player.getCarriedItem();
        var dropID = 0;
        if (ICTool.isValidWrench(item, 10)) {
            ICTool.useWrench(coords, item, 10);
            World.setBlock(coords.x, coords.y, coords.z, 0, 0);
            var chance = ICTool.getWrenchData(item.id).chance;
            if (Math.random() < chance) {
                dropID = blockID;
            }
            else {
                dropID = basicDrop || blockID;
            }
        }
        else if (level >= ToolAPI.getBlockDestroyLevel(blockID)) {
            dropID = basicDrop || blockID;
        }
        if (dropID == blockID && saveEnergyAmount) {
            var extra = new ItemExtraData();
            extra.putInt("energy", saveEnergyAmount);
            World.drop(coords.x + .5, coords.y + .5, coords.z + .5, dropID, 1, 0, extra);
            return [];
        }
        if (dropID)
            return [[dropID, 1, 0]];
        return [];
    }
    MachineRegistry.getMachineDrop = getMachineDrop;
    function setMachineDrop(nameID, basicDrop) {
        Block.registerDropFunction(nameID, function (coords, blockID, blockData, level) {
            return MachineRegistry.getMachineDrop(coords, blockID, level, basicDrop);
        });
        Block.registerPopResourcesFunction(nameID, function (coords, block) {
            if (Math.random() < 0.25) {
                World.drop(coords.x + .5, coords.y + .5, coords.z + .5, basicDrop || block.id, 1, 0);
            }
        });
    }
    MachineRegistry.setMachineDrop = setMachineDrop;
    function renderModel() {
        if (this.data.isActive) {
            TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, 0);
        }
        else {
            BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
        }
    }
    MachineRegistry.renderModel = renderModel;
    function renderModelWithRotation() {
        TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, this.data.meta + (this.data.isActive ? 4 : 0));
    }
    MachineRegistry.renderModelWithRotation = renderModelWithRotation;
    function renderModelWith6Variations() {
        TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, this.data.meta + (this.data.isActive ? 6 : 0));
    }
    MachineRegistry.renderModelWith6Variations = renderModelWith6Variations;
    function setActive(isActive) {
        if (this.data.isActive != isActive) {
            this.data.isActive = isActive;
            this.renderModel();
        }
    }
    MachineRegistry.setActive = setActive;
    MachineRegistry.basicEnergyOutFunc = TileEntityGenerator.prototype.energyTick;
    MachineRegistry.basicEnergyReceiveFunc = TileEntityElectricMachine.prototype.energyTick;
    function getLiquidFromItem(liquid, inputItem, outputItem, byHand) {
        if (byHand)
            outputItem = { id: 0, count: 0, data: 0 };
        var empty = LiquidLib.getEmptyItem(inputItem.id, inputItem.data);
        if (empty && (!liquid && this.interface.canReceiveLiquid(empty.liquid) || empty.liquid == liquid) && !this.liquidStorage.isFull(empty.liquid)) {
            if (outputItem.id == empty.id && outputItem.data == empty.data && outputItem.count < Item.getMaxStack(empty.id) || outputItem.id == 0) {
                var liquidLimit = this.liquidStorage.getLimit(empty.liquid);
                var storedAmount = this.liquidStorage.getAmount(liquid).toFixed(3);
                var count = Math.min(byHand ? inputItem.count : 1, Math.floor((liquidLimit - storedAmount) / empty.amount));
                if (count > 0) {
                    this.liquidStorage.addLiquid(empty.liquid, empty.amount * count);
                    inputItem.count -= count;
                    outputItem.id = empty.id;
                    outputItem.data = empty.data;
                    outputItem.count += count;
                    if (!byHand)
                        this.container.validateAll();
                }
                else if (inputItem.count == 1 && empty.storage) {
                    var amount = Math.min(liquidLimit - storedAmount, empty.amount);
                    this.liquidStorage.addLiquid(empty.liquid, amount);
                    inputItem.data += amount * 1000;
                }
                if (byHand) {
                    if (outputItem.id) {
                        Player.addItemToInventory(outputItem.id, outputItem.count, outputItem.data);
                    }
                    if (inputItem.count == 0)
                        inputItem.id = inputItem.data = 0;
                    Player.setCarriedItem(inputItem.id, inputItem.count, inputItem.data);
                    return true;
                }
            }
        }
    }
    MachineRegistry.getLiquidFromItem = getLiquidFromItem;
    function addLiquidToItem(liquid, inputItem, outputItem) {
        var amount = this.liquidStorage.getAmount(liquid).toFixed(3);
        if (amount > 0) {
            var full = LiquidLib.getFullItem(inputItem.id, inputItem.data, liquid);
            if (full && (outputItem.id == full.id && outputItem.data == full.data && outputItem.count < Item.getMaxStack(full.id) || outputItem.id == 0)) {
                if (amount >= full.amount) {
                    this.liquidStorage.getLiquid(liquid, full.amount);
                    inputItem.count--;
                    outputItem.id = full.id;
                    outputItem.data = full.data;
                    outputItem.count++;
                    this.container.validateAll();
                }
                else if (inputItem.count == 1 && full.storage) {
                    if (inputItem.id == full.id) {
                        amount = this.liquidStorage.getLiquid(liquid, full.amount);
                        inputItem.data -= amount * 1000;
                    }
                    else {
                        amount = this.liquidStorage.getLiquid(liquid, full.storage);
                        inputItem.id = full.id;
                        inputItem.data = (full.storage - amount) * 1000;
                    }
                }
            }
        }
    }
    MachineRegistry.addLiquidToItem = addLiquidToItem;
    function isValidEUItem(id, count, data, container) {
        var level = container.tileEntity.getTier();
        return ChargeItemRegistry.isValidItem(id, "Eu", level);
    }
    MachineRegistry.isValidEUItem = isValidEUItem;
    function isValidEUStorage(id, count, data, container) {
        var level = container.tileEntity.getTier();
        return ChargeItemRegistry.isValidStorage(id, "Eu", level);
    }
    MachineRegistry.isValidEUStorage = isValidEUStorage;
    function updateGuiHeader(gui, text) {
        var header = gui.getWindow("header");
        header.contentProvider.drawing[2].text = Translation.translate(text);
    }
    MachineRegistry.updateGuiHeader = updateGuiHeader;
})(MachineRegistry || (MachineRegistry = {}));
var transferByTier = {
    1: 32,
    2: 256,
    3: 2048,
    4: 8192
};
var MachineRecipeRegistry;
(function (MachineRecipeRegistry) {
    MachineRecipeRegistry.recipeData = {};
    function registerRecipesFor(name, data, validateKeys) {
        if (validateKeys) {
            var newData = {};
            for (var key in data) {
                if (key.indexOf(":") != -1) {
                    var keyArray = key.split(":");
                    var newKey = eval(keyArray[0]) + ":" + keyArray[1];
                }
                else {
                    var newKey = eval(key);
                }
                newData[newKey] = data[key];
            }
            data = newData;
        }
        this.recipeData[name] = data;
    }
    MachineRecipeRegistry.registerRecipesFor = registerRecipesFor;
    function addRecipeFor(name, input, result) {
        var recipes = this.requireRecipesFor(name, true);
        if (Array.isArray(recipes)) {
            recipes.push({ input: input, result: result });
        }
        else {
            recipes[input] = result;
        }
    }
    MachineRecipeRegistry.addRecipeFor = addRecipeFor;
    function requireRecipesFor(name, createIfNotFound) {
        if (!this.recipeData[name] && createIfNotFound) {
            this.recipeData[name] = {};
        }
        return this.recipeData[name];
    }
    MachineRecipeRegistry.requireRecipesFor = requireRecipesFor;
    function getRecipeResult(name, key1, key2) {
        var data = this.requireRecipesFor(name);
        if (data) {
            return data[key1] || data[key1 + ":" + key2];
        }
        return null;
    }
    MachineRecipeRegistry.getRecipeResult = getRecipeResult;
    function hasRecipeFor(name, key1, key2) {
        return this.getRecipeResult(name, key1, key2) ? true : false;
    }
    MachineRecipeRegistry.hasRecipeFor = hasRecipeFor;
})(MachineRecipeRegistry || (MachineRecipeRegistry = {}));
var UpgradeAPI = {
    data: {},
    getUpgradeData: function (id) {
        return this.data[id];
    },
    isUpgrade: function (id) {
        return UpgradeAPI.data[id] ? true : false;
    },
    isValidUpgrade: function (id, count, data, container) {
        var upgrades = container.tileEntity.upgrades;
        var upgradeData = UpgradeAPI.getUpgradeData(id);
        if (upgradeData && (!upgrades || upgrades.indexOf(upgradeData.type) != -1)) {
            return true;
        }
        return false;
    },
    registerUpgrade: function (id, type, func) {
        this.data[id] = { type: type, func: func };
    },
    callUpgrade: function (item, machine, container, data) {
        var upgrades = machine.upgrades;
        var upgrade = this.getUpgradeData(item.id);
        if (upgrade && (!upgrades || upgrades.indexOf(upgrade.type) != -1)) {
            upgrade.func(item, machine, container, data);
        }
    },
    getUpgrades: function (machine, container) {
        var upgrades = [];
        for (var slotName in container.slots) {
            if (slotName.match(/Upgrade/)) {
                var slot = container.getSlot(slotName);
                if (slot.id > 0) {
                    var find = false;
                    for (var i in upgrades) {
                        var item = upgrades[i];
                        if (item.id == slot.id && item.data == slot.data) {
                            item.count += slot.count;
                            find = true;
                            break;
                        }
                    }
                    if (!find) {
                        item = { id: slot.id, count: slot.count, data: slot.data };
                        upgrades.push(item);
                    }
                }
            }
        }
        return upgrades;
    },
    executeUpgrades: function (machine) {
        var container = machine.container;
        var data = machine.data;
        var upgrades = this.getUpgrades(machine, container);
        for (var i in upgrades) {
            this.callUpgrade(upgrades[i], machine, container, data);
        }
        StorageInterface.checkHoppers(machine);
    },
};
var CableRegistry = {
    insulation_data: {},
    paint_data: [],
    getCableData: function (id) {
        return this.insulation_data[id];
    },
    canBePainted: function (id) {
        return this.paint_data.indexOf(id) != -1;
    },
    createBlock: function (nameID, properties, blockType) {
        var variations = [];
        for (var i_7 = 0; i_7 < 16; i_7++) {
            variations.push({ name: properties.name, texture: [[properties.texture, i_7]] });
        }
        Block.createBlock(nameID, variations, blockType);
        this.paint_data.push(BlockID[nameID]);
    },
    registerCable: function (nameID, maxVoltage, maxInsulationLevel) {
        if (maxInsulationLevel) {
            var _loop_1 = function (index) {
                var blockID = BlockID[nameID + index];
                this_1.insulation_data[blockID] = { name: nameID, insulation: index, maxInsulation: maxInsulationLevel };
                EU.registerWire(blockID, maxVoltage, this_1.cableBurnoutFunc, this_1.cableConnectFunc);
                var itemID = ItemID[nameID + index];
                Block.registerDropFunction(nameID + index, function (coords, id, data) {
                    return [[itemID, 1, 0]];
                });
                Block.registerPopResourcesFunction(nameID + index, function (coords, block) {
                    if (Math.random() < 0.25) {
                        World.drop(coords.x + .5, coords.y + .5, coords.z + .5, itemID, 1, 0);
                    }
                    EnergyTypeRegistry.onWireDestroyed(coords.x, coords.y, coords.z, block.id);
                });
            };
            var this_1 = this;
            for (var index = 0; index <= maxInsulationLevel; index++) {
                _loop_1(index);
            }
        }
        else {
            EU.registerWire(BlockID[nameID], maxVoltage, this.cableBurnoutFunc, this.cableConnectFunc);
            Block.registerDropFunction(nameID, function (coords, id, data) {
                return [[ItemID[nameID], 1, 0]];
            });
            Block.registerPopResourcesFunction(nameID, function (coords, block) {
                if (Math.random() < 0.25) {
                    World.drop(coords.x + .5, coords.y + .5, coords.z + .5, ItemID[nameID], 1, 0);
                }
                EnergyTypeRegistry.onWireDestroyed(coords.x, coords.y, coords.z, block.id);
            });
        }
    },
    setupModel: function (id, width) {
        TileRenderer.setupWireModel(id, 0, width, "ic-wire");
        var group = ICRender.getGroup("ic-wire");
        var groupPainted = ICRender.getGroup("ic-wire-painted");
        group.add(id, -1);
        // painted cables
        width /= 2;
        var boxes = [
            { side: [1, 0, 0], box: [0.5 + width, 0.5 - width, 0.5 - width, 1, 0.5 + width, 0.5 + width] },
            { side: [-1, 0, 0], box: [0, 0.5 - width, 0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width] },
            { side: [0, 1, 0], box: [0.5 - width, 0.5 + width, 0.5 - width, 0.5 + width, 1, 0.5 + width] },
            { side: [0, -1, 0], box: [0.5 - width, 0, 0.5 - width, 0.5 + width, 0.5 - width, 0.5 + width] },
            { side: [0, 0, 1], box: [0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width, 0.5 + width, 1] },
            { side: [0, 0, -1], box: [0.5 - width, 0.5 - width, 0, 0.5 + width, 0.5 + width, 0.5 - width] },
        ];
        for (var data = 1; data < 16; data++) {
            var groupColor = ICRender.getGroup("ic-wire" + data);
            groupColor.add(id, data);
            groupPainted.add(id, data);
            var render = new ICRender.Model();
            var shape = new ICRender.CollisionShape();
            for (var i in boxes) {
                var box = boxes[i];
                // render
                var model = BlockRenderer.createModel();
                model.addBox(box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5], id, data);
                var condition1 = ICRender.BLOCK(box.side[0], box.side[1], box.side[2], group, false);
                var condition2 = ICRender.BLOCK(box.side[0], box.side[1], box.side[2], groupPainted, true);
                var condition3 = ICRender.BLOCK(box.side[0], box.side[1], box.side[2], groupColor, false);
                var condition = ICRender.AND(condition1, ICRender.OR(condition2, condition3));
                render.addEntry(model).setCondition(condition);
                // collision shape
                var entry = shape.addEntry();
                entry.addBox(box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5]);
                entry.setCondition(condition);
            }
            // central box
            var model = BlockRenderer.createModel();
            model.addBox(0.5 - width, 0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width, 0.5 + width, id, data);
            render.addEntry(model);
            var entry = shape.addEntry();
            entry.addBox(0.5 - width, 0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width, 0.5 + width);
            var swidth = Math.max(width, 0.25);
            Block.setShape(id, 0.5 - swidth, 0.5 - swidth, 0.5 - swidth, 0.5 + swidth, 0.5 + swidth, 0.5 + swidth, data);
            BlockRenderer.setStaticICRender(id, data, render);
            BlockRenderer.setCustomCollisionShape(id, data, shape);
        }
    },
    cableBurnoutFunc: function (voltage) {
        if (ConfigIC.voltageEnabled) {
            for (var key in this.wireMap) {
                var coords = key.split(':');
                var x = Math.floor(coords[0]), y = Math.floor(coords[1]), z = Math.floor(coords[2]);
                World.setBlock(x, y, z, 0);
                CableRegistry.addBurnParticles(x, y, z);
            }
            EnergyNetBuilder.removeNet(this);
        }
    },
    addBurnParticles: function (x, y, z) {
        for (var i = 0; i < 32; i++) {
            var px = x + Math.random();
            var pz = z + Math.random();
            var py = y + Math.random();
            Particles.addParticle(ParticleType.smoke, px, py, pz, 0, 0.01, 0);
        }
    },
    cableConnectFunc: function (block, coord1, coord2, side) {
        var block2 = World.getBlock(coord2.x, coord2.y, coord2.z);
        if (!CableRegistry.canBePainted(block2.id) || block2.data == 0 || block2.data == block.data) {
            return true;
        }
        return false;
    }
};
function isFriendlyMob(type) {
    if (type >= 10 && type <= 31)
        return true;
    if (type == 74 || type == 75)
        return true;
    if (type == 108 || type == 109 || type >= 111 && type <= 113 || type == 115 || type == 118) {
        return true;
    }
    return false;
}
function isHostileMob(type) {
    if (type >= 32 && type <= 59)
        return true;
    if (type == 104 || type == 105 || type == 110 || type == 114 || type == 116) {
        return true;
    }
    return false;
}
function canTakeDamage(entity, damageSource) {
    var type = Entity.getType(entity);
    if (entity == player) {
        if (Game.getGameMode() == 1)
            return false;
        switch (damageSource) {
            case "electricity":
                if (Player.getArmorSlot(0).id == ItemID.hazmatHelmet && Player.getArmorSlot(1).id == ItemID.hazmatChestplate &&
                    Player.getArmorSlot(2).id == ItemID.hazmatLeggings && Player.getArmorSlot(3).id == ItemID.rubberBoots) {
                    return false;
                }
                break;
            case "radiation":
                return RadiationAPI.checkPlayerArmor();
        }
        return true;
    }
    return isFriendlyMob(type) || isHostileMob(type);
}
function damageEntityInR(entity, x, y, z) {
    for (var yy = y - 2; yy <= y + 1; yy++)
        for (var xx = x - 1; xx <= x + 1; xx++)
            for (var zz = z - 1; zz <= z + 1; zz++) {
                var blockID = World.getBlockID(xx, yy, zz);
                var cableData = CableRegistry.getCableData(blockID);
                if (cableData && cableData.insulation < cableData.maxInsulation) {
                    var net = EnergyNetBuilder.getNetOnCoords(xx, yy, zz);
                    if (net && net.energyName == "Eu" && net.lastVoltage > insulationMaxVolt[cableData.insulation]) {
                        var damage = Math.ceil(net.lastVoltage / 32);
                        Entity.damageEntity(entity, damage);
                        return;
                    }
                }
            }
}
var insulationMaxVolt = {
    0: 5,
    1: 128,
    2: 512
};
Callback.addCallback("tick", function () {
    if (World.getThreadTime() % 20 == 0) {
        if (ConfigIC.wireDamageEnabled) {
            var entities = Entity.getAll();
        }
        else {
            var entities = [player];
        }
        for (var i in entities) {
            var ent = entities[i];
            if (canTakeDamage(ent, "electricity") && Entity.getHealth(ent) > 0) {
                var coords = Entity.getPosition(ent);
                damageEntityInR(ent, Math.floor(coords.x), Math.floor(coords.y), Math.floor(coords.z));
            }
        }
    }
});
var DIRT_TILES = {
    2: true,
    3: true,
    60: true
};
function placeRubberSapling(coords, item) {
    var place = coords.relative;
    var tile1 = World.getBlock(place.x, place.y, place.z);
    var tile2 = World.getBlock(place.x, place.y - 1, place.z);
    if (World.canTileBeReplaced(tile1.id, tile1.data) && DIRT_TILES[tile2.id]) {
        World.setBlock(place.x, place.y, place.z, BlockID.rubberTreeSapling);
        if (Game.isItemSpendingAllowed()) {
            Player.setCarriedItem(BlockID.rubberTreeSapling, item.count - 1, 0);
        }
        World.playSound(place.x, place.y, place.z, "dig.grass", 1, 0.8);
    }
}
// legacy
IDRegistry.genItemID("rubberSapling");
Item.createItem("rubberSapling", "Rubber Tree Sapling", { name: "rubber_tree_sapling", data: 0 }, { isTech: true });
Item.registerUseFunction("rubberSapling", function (coords, item, block) {
    placeRubberSapling(coords, item);
});
IDRegistry.genBlockID("rubberTreeSapling");
Block.createBlock("rubberTreeSapling", [
    { name: "Rubber Tree Sapling", texture: [["rubber_tree_sapling", 0]], inCreative: true }
], { rendertype: 1, sound: "grass" });
Block.setDestroyTime(BlockID.rubberTreeSapling, 0);
ToolAPI.registerBlockMaterial(BlockID.rubberTreeSapling, "plant");
Block.setShape(BlockID.rubberTreeSapling, 1 / 8, 0, 1 / 8, 7 / 8, 1, 7 / 8);
TileRenderer.setEmptyCollisionShape(BlockID.rubberTreeSapling);
Recipes.addFurnaceFuel(BlockID.rubberTreeSapling, -1, 100);
Block.registerDropFunction("rubberTreeSapling", function () {
    return [[BlockID.rubberTreeSapling, 1, 0]];
});
Item.registerUseFunctionForID(BlockID.rubberTreeSapling, function (coords, item, block) {
    placeRubberSapling(coords, item);
});
Block.setRandomTickCallback(BlockID.rubberTreeSapling, function (x, y, z) {
    if (!DIRT_TILES[World.getBlockID(x, y - 1, z)]) {
        World.destroyBlock(x, y, z, true);
    }
    else if (Math.random() < 0.05 && World.getLightLevel(x, y, z) >= 9) {
        RubberTreeGenerator.generateRubberTree(x, y, z);
    }
});
// bone use
Callback.addCallback("ItemUse", function (coords, item, block) {
    if (item.id == 351 && item.data == 15 && block.id == BlockID.rubberTreeSapling) {
        Player.setCarriedItem(item.id, item.count - 1, item.data);
        for (var i = 0; i < 16; i++) {
            var px = coords.x + Math.random();
            var pz = coords.z + Math.random();
            var py = coords.y + Math.random();
            Particles.addParticle(ParticleType.happyVillager, px, py, pz, 0, 0, 0);
        }
        if (Math.random() < 0.25 || !Game.isItemSpendingAllowed()) {
            RubberTreeGenerator.generateRubberTree(coords.x, coords.y, coords.z);
        }
    }
});
Callback.addCallback("DestroyBlock", function (coords, block, player) {
    if (World.getBlockID(coords.x, coords.y + 1, coords.z) == BlockID.rubberTreeSapling) {
        World.destroyBlock(coords.x, coords.y + 1, coords.z, true);
    }
});
Block.createSpecialType({
    base: 17,
    solid: true,
    destroytime: 2,
    explosionres: 10,
    lightopacity: 15,
    renderlayer: 2,
    translucency: 0,
    sound: "wood"
}, "wood");
IDRegistry.genBlockID("rubberTreeLog");
Block.createBlock("rubberTreeLog", [
    { name: "Rubber Tree Log", texture: [["rubber_wood", 1], ["rubber_wood", 1], ["rubber_wood", 0], ["rubber_wood", 0], ["rubber_wood", 0], ["rubber_wood", 0]], inCreative: true },
    { name: "Rubber Tree Log", texture: [["rubber_wood", 0], ["rubber_wood", 0], ["rubber_wood", 1], ["rubber_wood", 1], ["rubber_wood", 2], ["rubber_wood", 2]], inCreative: false },
    { name: "Rubber Tree Log", texture: [["rubber_wood", 2], ["rubber_wood", 2], ["rubber_wood", 2], ["rubber_wood", 2], ["rubber_wood", 1], ["rubber_wood", 1]], inCreative: false }
], "wood");
Block.registerDropFunction("rubberTreeLogLatex", function (coords, blockID) {
    return [[blockID, 1, 0]];
});
ToolLib.addBlockDropOnExplosion("rubberTreeLog");
ToolAPI.registerBlockMaterial(BlockID.rubberTreeLog, "wood");
Block.registerPlaceFunction("rubberTreeLog", function (coords, item, block) {
    if (World.canTileBeReplaced(block.id, block.data)) {
        var place = coords;
        var rotation = 0;
    }
    else {
        var place = coords.relative;
        var rotation = parseInt(coords.side / 2);
    }
    World.setBlock(place.x, place.y, place.z, item.id, rotation);
    World.playSound(place.x + .5, place.y + .5, place.z + .5, "dig.wood", 1, 0.8);
});
IDRegistry.genBlockID("rubberTreeLogLatex");
Block.createBlockWithRotation("rubberTreeLogLatex", [
    { name: "tile.rubberTreeLogLatex.name", texture: [["rubber_wood", 1], ["rubber_wood", 1], ["rubber_wood_latex", 0], ["rubber_wood", 0], ["rubber_wood", 0], ["rubber_wood", 0]], inCreative: false },
    { name: "tile.rubberTreeLogLatex.name", texture: [["rubber_wood", 1], ["rubber_wood", 1], ["rubber_wood_latex", 1], ["rubber_wood", 0], ["rubber_wood", 0], ["rubber_wood", 0]], inCreative: false },
], "wood");
Block.registerDropFunction("rubberTreeLogLatex", function (coords, blockID) {
    return [[BlockID.rubberTreeLog, 1, 0], [ItemID.latex, 1, 0]];
});
ToolLib.addBlockDropOnExplosion("rubberTreeLogLatex");
ToolAPI.registerBlockMaterial(BlockID.rubberTreeLogLatex, "wood");
Block.setRandomTickCallback(BlockID.rubberTreeLogLatex, function (x, y, z, id, data) {
    if (data < 4 && Math.random() < 1 / 7) {
        World.setBlock(x, y, z, id, data + 4);
    }
});
Recipes.addFurnace(BlockID.rubberTreeLog, 17, 3);
Recipes.addShapeless({ id: 5, count: 3, data: 3 }, [{ id: BlockID.rubberTreeLog, data: -1 }]);
IDRegistry.genBlockID("rubberTreeLeaves");
Block.createBlock("rubberTreeLeaves", [
    { name: "Rubber Tree Leaves", texture: [["rubber_tree_leaves", 0]], inCreative: false },
    { name: "Rubber Tree Leaves", texture: [["rubber_tree_leaves", 0]], inCreative: false },
    { name: "Rubber Tree Leaves", texture: [["rubber_tree_leaves", 0]], inCreative: true }
], {
    destroytime: 0.2,
    explosionres: 1,
    renderallfaces: true,
    renderlayer: 1,
    lightopacity: 1,
    translucency: 0.5,
    sound: "grass"
});
Block.registerDropFunction("rubberTreeLeaves", function (coords, blockID, blockData, level, enchant) {
    if (level > 0 || Player.getCarriedItem().id == 359) {
        return [[blockID, 1, 2]];
    }
    if (Math.random() < .04) {
        return [[BlockID.rubberTreeSapling, 1, 0]];
    }
    return [];
});
ToolAPI.registerBlockMaterial(BlockID.rubberTreeLeaves, "plant");
function checkLeaves(x, y, z, explored) {
    var blockID = World.getBlockID(x, y, z);
    if (blockID == BlockID.rubberTreeLog || blockID == BlockID.rubberTreeLogLatex) {
        return true;
    }
    if (blockID == BlockID.rubberTreeLeaves) {
        explored[x + ':' + y + ':' + z] = true;
    }
    return false;
}
function checkLeavesFor6Sides(x, y, z, explored) {
    return checkLeaves(x - 1, y, z, explored) ||
        checkLeaves(x + 1, y, z, explored) ||
        checkLeaves(x, y, z - 1, explored) ||
        checkLeaves(x, y, z + 1, explored) ||
        checkLeaves(x, y - 1, z, explored) ||
        checkLeaves(x, y + 1, z, explored);
}
function updateLeaves(x, y, z) {
    for (var xx = x - 1; xx <= x + 1; xx++) {
        for (var yy = y - 1; yy <= y + 1; yy++) {
            for (var zz = z - 1; zz <= z + 1; zz++) {
                var block = World.getBlock(xx, yy, zz);
                if (block.id == BlockID.rubberTreeLeaves && block.data == 0) {
                    World.setBlock(xx, yy, zz, BlockID.rubberTreeLeaves, 1);
                }
            }
        }
    }
}
Block.setRandomTickCallback(BlockID.rubberTreeLeaves, function (x, y, z, id, data) {
    if (data == 1) {
        var explored = {};
        explored[x + ':' + y + ':' + z] = true;
        for (var i_8 = 0; i_8 < 4; i_8++) {
            var checkingLeaves = explored;
            explored = {};
            for (var coords in checkingLeaves) {
                var c = coords.split(':');
                if (checkLeavesFor6Sides(parseInt(c[0]), parseInt(c[1]), parseInt(c[2]), explored)) {
                    World.setBlock(x, y, z, BlockID.rubberTreeLeaves, 0);
                    return;
                }
            }
        }
        World.setBlock(x, y, z, 0);
        updateLeaves(x, y, z);
        var dropFunc = Block.dropFunctions[id];
        var drop = dropFunc(null, id, data, 0, {});
        for (var i_9 in drop) {
            World.drop(x, y, z, drop[i_9][0], drop[i_9][1], drop[i_9][2]);
        }
    }
});
Callback.addCallback("DestroyBlock", function (coords, block, player) {
    updateLeaves(coords.x, coords.y, coords.z);
});
var RubberTreeGenerator = {
    biomeData: {},
    getBiomeChance: function (biomeID) {
        var chance = this.biomeData[biomeID] || 0;
        return chance / 100;
    },
    generateRubberTree: function (x, y, z, random) {
        if (!random)
            random = new java.util.Random(Debug.sysTime());
        var minHeight = 3, maxHeight = 8;
        var height = this.getGrowHeight(x, y, z, random.nextInt(maxHeight - minHeight + 1) + minHeight);
        if (height >= minHeight) {
            var treeholechance = 0.25;
            for (var ys = 0; ys < height; ys++) {
                if (random.nextDouble() < treeholechance) {
                    treeholechance -= 0.1;
                    World.setBlock(x, y + ys, z, BlockID.rubberTreeLogLatex, 4 + random.nextInt(4));
                }
                else {
                    World.setBlock(x, y + ys, z, BlockID.rubberTreeLog, 0);
                }
            }
            var leavesStart = parseInt(height / 2);
            var leavesEnd = height;
            for (var ys = leavesStart; ys <= leavesEnd; ys++) {
                for (var xs = -2; xs <= 2; xs++) {
                    for (var zs = -2; zs <= 2; zs++) {
                        var radius = 2.5 + random.nextDouble() * 0.5;
                        if (ys == leavesEnd)
                            radius /= 2;
                        if (Math.sqrt(xs * xs + zs * zs) <= radius) {
                            this.setLeaves(x + xs, y + ys, z + zs);
                        }
                    }
                }
            }
            var pikeHeight = 2 + parseInt(random.nextDouble() * 2);
            for (var ys = 1; ys <= pikeHeight; ys++) {
                this.setLeaves(x, y + ys + height, z);
            }
        }
    },
    getGrowHeight: function (x, y, z, max) {
        var height = 0;
        while (height < max + 2) {
            var blockID = World.getBlockID(x, y + height, z);
            if (blockID != 0)
                break;
            height++;
        }
        return height > 2 ? height - 2 : 0;
    },
    setLeaves: function (x, y, z, leaves) {
        var blockID = World.getBlockID(x, y, z);
        if (blockID == 0 || blockID == 106) {
            World.setBlock(x, y, z, BlockID.rubberTreeLeaves, 0);
        }
    }
};
var ForestBiomeIDs = [4, 18, 27, 28, 132, 155, 156];
var JungleBiomeIDs = [21, 22, 23, 149, 151];
var SwampBiomeIDs = [6, 134];
var chance = __config__.getNumber("rubber_tree_gen.plains");
RubberTreeGenerator.biomeData[1] = chance;
chance = __config__.getNumber("rubber_tree_gen.forest");
ForestBiomeIDs.forEach(function (id) {
    RubberTreeGenerator.biomeData[id] = chance;
});
chance = __config__.getNumber("rubber_tree_gen.jungle");
JungleBiomeIDs.forEach(function (id) {
    RubberTreeGenerator.biomeData[id] = chance;
});
chance = __config__.getNumber("rubber_tree_gen.swamp");
SwampBiomeIDs.forEach(function (id) {
    RubberTreeGenerator.biomeData[id] = chance;
});
World.addGenerationCallback("GenerateChunk", function (chunkX, chunkZ, random) {
    var biome = World.getBiome((chunkX + 0.5) * 16, (chunkZ + 0.5) * 16);
    if (random.nextDouble() < RubberTreeGenerator.getBiomeChance(biome)) {
        var treeCount = 1 + random.nextInt(6);
        for (var i = 0; i < treeCount; i++) {
            var coords = GenerationUtils.findSurface(chunkX * 16 + random.nextInt(16), 96, chunkZ * 16 + random.nextInt(16));
            if (World.getBlockID(coords.x, coords.y, coords.z) == 2) {
                RubberTreeGenerator.generateRubberTree(coords.x, coords.y + 1, coords.z, random);
            }
        }
    }
}, "rubber_tree");
Block.createSpecialType({
    base: 1,
    solid: true,
    destroytime: 3,
    explosionres: 15,
    lightopacity: 15,
    renderlayer: 2,
    translucency: 0,
    sound: "stone"
}, "ore");
IDRegistry.genBlockID("oreCopper");
Block.createBlock("oreCopper", [
    { name: "Copper Ore", texture: [["ore_copper", 0]], inCreative: true }
], "ore");
ToolAPI.registerBlockMaterial(BlockID.oreCopper, "stone", 2, true);
Block.setDestroyLevel("oreCopper", 2);
ToolLib.addBlockDropOnExplosion("oreCopper");
IDRegistry.genBlockID("oreTin");
Block.createBlock("oreTin", [
    { name: "Tin Ore", texture: [["ore_tin", 0]], inCreative: true }
], "ore");
ToolAPI.registerBlockMaterial(BlockID.oreTin, "stone", 2, true);
Block.setDestroyLevel("oreTin", 2);
ToolLib.addBlockDropOnExplosion("oreTin");
IDRegistry.genBlockID("oreLead");
Block.createBlock("oreLead", [
    { name: "Lead Ore", texture: [["ore_lead", 0]], inCreative: true }
], "ore");
ToolAPI.registerBlockMaterial(BlockID.oreLead, "stone", 2, true);
Block.setDestroyLevel("oreLead", 2);
ToolLib.addBlockDropOnExplosion("oreLead");
IDRegistry.genBlockID("oreUranium");
Block.createBlock("oreUranium", [
    { name: "Uranium Ore", texture: [["ore_uranium", 0]], inCreative: true }
], "ore");
ToolAPI.registerBlockMaterial(BlockID.oreUranium, "stone", 3, true);
Block.setDestroyLevel("oreUranium", 3);
ToolLib.addBlockDropOnExplosion("oreUranium");
IDRegistry.genBlockID("oreIridium");
Block.createBlock("oreIridium", [
    { name: "Iridium Ore", texture: [["ore_iridium", 0]], inCreative: true }
], "ore");
ToolAPI.registerBlockMaterial(BlockID.oreIridium, "stone", 4, true);
Block.registerDropFunction("oreIridium", function (coords, blockID, blockData, level, enchant) {
    if (level > 3) {
        if (enchant.silk) {
            return [[blockID, 1, 0]];
        }
        var drop = [[ItemID.iridiumChunk, 1, 0]];
        if (Math.random() < enchant.fortune / 6)
            drop.push(drop[0]);
        ToolAPI.dropOreExp(coords, 12, 28, enchant.experience);
        return drop;
    }
    return [];
});
ToolLib.addBlockDropOnExplosion("oreIridium");
Item.addCreativeGroup("ores", Translation.translate("Ores"), [
    BlockID.oreCopper,
    BlockID.oreTin,
    BlockID.oreLead,
    BlockID.oreUranium,
    BlockID.oreIridium
]);
var OreGenerator = {
    copper: {
        enabled: __config__.getBool("copper_ore.enabled"),
        count: __config__.getNumber("copper_ore.count"),
        size: __config__.getNumber("copper_ore.size"),
        minHeight: __config__.getNumber("copper_ore.minHeight"),
        maxHeight: __config__.getNumber("copper_ore.maxHeight")
    },
    tin: {
        enabled: __config__.getBool("tin_ore.enabled"),
        count: __config__.getNumber("tin_ore.count"),
        size: __config__.getNumber("tin_ore.size"),
        minHeight: __config__.getNumber("tin_ore.minHeight"),
        maxHeight: __config__.getNumber("tin_ore.maxHeight")
    },
    lead: {
        enabled: __config__.getBool("lead_ore.enabled"),
        count: __config__.getNumber("lead_ore.count"),
        size: __config__.getNumber("lead_ore.size"),
        minHeight: __config__.getNumber("lead_ore.minHeight"),
        maxHeight: __config__.getNumber("lead_ore.maxHeight")
    },
    uranium: {
        enabled: __config__.getBool("uranium_ore.enabled"),
        count: __config__.getNumber("uranium_ore.count"),
        size: __config__.getNumber("uranium_ore.size"),
        minHeight: __config__.getNumber("uranium_ore.minHeight"),
        maxHeight: __config__.getNumber("uranium_ore.maxHeight")
    },
    iridium: {
        chance: __config__.getNumber("iridium_ore.chance"),
        minHeight: __config__.getNumber("iridium_ore.minHeight"),
        maxHeight: __config__.getNumber("iridium_ore.maxHeight")
    },
    addFlag: function (name, flag, disableOre) {
        if (this[name].enabled) {
            var flag = !Flags.addFlag(flag);
            if (disableOre)
                this[name].enabled = flag;
        }
    },
    randomCoords: function (random, chunkX, chunkZ, minHeight, maxHeight) {
        minHeight = minHeight || 0;
        maxHeight = maxHeight || 128;
        var x = chunkX * 16 + random.nextInt(16);
        var z = chunkZ * 16 + random.nextInt(16);
        var y = random.nextInt(maxHeight - minHeight + 1) - minHeight;
        return { x: x, y: y, z: z };
    }
};
OreGenerator.addFlag("copper", "oreGenCopper");
OreGenerator.addFlag("tin", "oreGenTin");
OreGenerator.addFlag("lead", "oreGenLead", true);
OreGenerator.addFlag("uranium", "oreGenUranium", true);
Callback.addCallback("GenerateChunkUnderground", function (chunkX, chunkZ, random) {
    if (OreGenerator.copper.enabled) {
        for (var i = 0; i < OreGenerator.copper.count; i++) {
            var coords = OreGenerator.randomCoords(random, chunkX, chunkZ, OreGenerator.copper.minHeight, OreGenerator.copper.maxHeight);
            GenerationUtils.generateOre(coords.x, coords.y, coords.z, BlockID.oreCopper, 0, OreGenerator.copper.size, false, random.nextInt());
        }
    }
    if (OreGenerator.tin.enabled) {
        for (var i = 0; i < OreGenerator.tin.count; i++) {
            var coords = OreGenerator.randomCoords(random, chunkX, chunkZ, OreGenerator.tin.minHeight, OreGenerator.tin.maxHeight);
            GenerationUtils.generateOre(coords.x, coords.y, coords.z, BlockID.oreTin, 0, OreGenerator.tin.size, false, random.nextInt());
        }
    }
    if (OreGenerator.lead.enabled) {
        for (var i = 0; i < OreGenerator.lead.count; i++) {
            var coords = OreGenerator.randomCoords(random, chunkX, chunkZ, OreGenerator.lead.minHeight, OreGenerator.lead.maxHeight);
            GenerationUtils.generateOre(coords.x, coords.y, coords.z, BlockID.oreLead, 0, OreGenerator.lead.size, false, random.nextInt());
        }
    }
    if (OreGenerator.uranium.enabled) {
        for (var i = 0; i < OreGenerator.uranium.count; i++) {
            var coords = OreGenerator.randomCoords(random, chunkX, chunkZ, OreGenerator.uranium.minHeight, OreGenerator.uranium.maxHeight);
            GenerationUtils.generateOre(coords.x, coords.y, coords.z, BlockID.oreUranium, 0, OreGenerator.uranium.size, false, random.nextInt());
        }
    }
    if (random.nextDouble() < OreGenerator.iridium.chance) {
        var coords = OreGenerator.randomCoords(random, chunkX, chunkZ, OreGenerator.iridium.minHeight, OreGenerator.iridium.maxHeight);
        if (World.getBlockID(coords.x, coords.y, coords.z) == 1)
            World.setBlock(coords.x, coords.y, coords.z, BlockID.oreIridium);
    }
});
Block.createSpecialType({
    base: 1,
    solid: true,
    destroytime: 5,
    explosionres: 30,
    lightopacity: 15,
    renderlayer: 2,
    sound: "stone"
}, "stone");
IDRegistry.genBlockID("blockCopper");
Block.createBlock("blockCopper", [
    { name: "Copper Block", texture: [["block_copper", 0]], inCreative: true }
], "stone");
ToolAPI.registerBlockMaterial(BlockID.blockCopper, "stone", 2, true);
Block.setDestroyLevel("blockCopper", 2);
ToolLib.addBlockDropOnExplosion("blockCopper");
IDRegistry.genBlockID("blockTin");
Block.createBlock("blockTin", [
    { name: "Tin Block", texture: [["block_tin", 0]], inCreative: true }
], "stone");
ToolAPI.registerBlockMaterial(BlockID.blockTin, "stone", 2, true);
Block.setDestroyLevel("blockTin", 2);
ToolLib.addBlockDropOnExplosion("blockTin");
IDRegistry.genBlockID("blockBronze");
Block.createBlock("blockBronze", [
    { name: "Bronze Block", texture: [["block_bronze", 0]], inCreative: true }
], "stone");
ToolAPI.registerBlockMaterial(BlockID.blockBronze, "stone", 2, true);
Block.setDestroyLevel("blockBronze", 2);
ToolLib.addBlockDropOnExplosion("blockBronze");
IDRegistry.genBlockID("blockLead");
Block.createBlock("blockLead", [
    { name: "Lead Block", texture: [["block_lead", 0]], inCreative: true }
], "stone");
ToolAPI.registerBlockMaterial(BlockID.blockLead, "stone", 2, true);
Block.setDestroyLevel("blockLead", 2);
ToolLib.addBlockDropOnExplosion("blockLead");
IDRegistry.genBlockID("blockSteel");
Block.createBlock("blockSteel", [
    { name: "Steel Block", texture: [["block_steel", 0]], inCreative: true }
], "stone");
ToolAPI.registerBlockMaterial(BlockID.blockSteel, "stone", 2, true);
Block.setDestroyLevel("blockSteel", 2);
ToolLib.addBlockDropOnExplosion("blockSteel");
IDRegistry.genBlockID("blockSilver");
Block.createBlock("blockSilver", [
    { name: "Silver Block", texture: [["block_silver", 0]], inCreative: true }
], "stone");
ToolAPI.registerBlockMaterial(BlockID.blockSilver, "stone", 3, true);
Block.setDestroyLevel("blockSilver", 3);
ToolLib.addBlockDropOnExplosion("blockSilver");
IDRegistry.genBlockID("blockUranium");
Block.createBlock("blockUranium", [
    { name: "Uranium Block", texture: [["block_uranium", 0], ["block_uranium", 0], ["block_uranium", 1]], inCreative: true }
], "stone");
ToolAPI.registerBlockMaterial(BlockID.blockUranium, "stone", 3, true);
Block.setDestroyLevel("blockUranium", 3);
ToolLib.addBlockDropOnExplosion("blockUranium");
Item.addCreativeGroup("blockMetal", Translation.translate("Metal Blocks"), [
    BlockID.blockCopper,
    BlockID.blockTin,
    BlockID.blockBronze,
    BlockID.blockLead,
    BlockID.blockSteel,
    BlockID.blockSilver,
    BlockID.blockUranium
]);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.blockCopper, count: 1, data: 0 }, [
        "xxx",
        "xxx",
        "xxx"
    ], ['x', ItemID.ingotCopper, 0]);
    Recipes.addShaped({ id: BlockID.blockTin, count: 1, data: 0 }, [
        "xxx",
        "xxx",
        "xxx"
    ], ['x', ItemID.ingotTin, 0]);
    Recipes.addShaped({ id: BlockID.blockBronze, count: 1, data: 0 }, [
        "xxx",
        "xxx",
        "xxx"
    ], ['x', ItemID.ingotBronze, 0]);
    Recipes.addShaped({ id: BlockID.blockLead, count: 1, data: 0 }, [
        "xxx",
        "xxx",
        "xxx"
    ], ['x', ItemID.ingotLead, 0]);
    Recipes.addShaped({ id: BlockID.blockSteel, count: 1, data: 0 }, [
        "xxx",
        "xxx",
        "xxx"
    ], ['x', ItemID.ingotSteel, 0]);
    Recipes.addShaped({ id: BlockID.blockSilver, count: 1, data: 0 }, [
        "xxx",
        "xxx",
        "xxx"
    ], ['x', ItemID.ingotSilver, 0]);
    Recipes.addShaped({ id: BlockID.blockUranium, count: 1, data: 0 }, [
        "xxx",
        "xxx",
        "xxx"
    ], ['x', ItemID.uranium238, 0]);
    Recipes.addShapeless({ id: ItemID.ingotCopper, count: 9, data: 0 }, [{ id: BlockID.blockCopper, data: 0 }]);
    Recipes.addShapeless({ id: ItemID.ingotTin, count: 9, data: 0 }, [{ id: BlockID.blockTin, data: 0 }]);
    Recipes.addShapeless({ id: ItemID.ingotBronze, count: 9, data: 0 }, [{ id: BlockID.blockBronze, data: 0 }]);
    Recipes.addShapeless({ id: ItemID.ingotLead, count: 9, data: 0 }, [{ id: BlockID.blockLead, data: 0 }]);
    Recipes.addShapeless({ id: ItemID.ingotSteel, count: 9, data: 0 }, [{ id: BlockID.blockSteel, data: 0 }]);
    Recipes.addShapeless({ id: ItemID.ingotSilver, count: 9, data: 0 }, [{ id: BlockID.blockSilver, data: 0 }]);
    Recipes.addShapeless({ id: ItemID.uranium238, count: 9, data: 0 }, [{ id: BlockID.blockUranium, data: 0 }]);
});
Block.createSpecialType({
    base: 1,
    solid: true,
    destroytime: 5,
    explosionres: 30,
    lightopacity: 15,
    renderlayer: 2,
    sound: "stone"
}, "machine");
IDRegistry.genBlockID("machineBlockBasic");
Block.createBlock("machineBlockBasic", [
    { name: "Machine Block", texture: [["machine_top", 0]], inCreative: true }
], "machine");
ToolAPI.registerBlockMaterial(BlockID.machineBlockBasic, "stone", 1, true);
Block.setDestroyLevel("machineBlockBasic", 1);
ToolLib.addBlockDropOnExplosion("machineBlockBasic");
IDRegistry.genBlockID("machineBlockAdvanced");
Block.createBlock("machineBlockAdvanced", [
    { name: "Advanced Machine Block", texture: [["machine_advanced", 0]], inCreative: true }
], "machine");
ToolAPI.registerBlockMaterial(BlockID.machineBlockAdvanced, "stone", 1, true);
Block.setDestroyLevel("machineBlockAdvanced", 1);
ToolLib.addBlockDropOnExplosion("machineBlockAdvanced");
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.machineBlockBasic, count: 1, data: 0 }, [
        "xxx",
        "x x",
        "xxx"
    ], ['x', ItemID.plateIron, -1]);
    Recipes.addShaped({ id: BlockID.machineBlockAdvanced, count: 1, data: 0 }, [
        " x ",
        "a#a",
        " x "
    ], ['x', ItemID.carbonPlate, -1, 'a', ItemID.plateAlloy, -1, '#', BlockID.machineBlockBasic, 0]);
    Recipes.addShaped({ id: BlockID.machineBlockAdvanced, count: 1, data: 0 }, [
        " a ",
        "x#x",
        " a "
    ], ['x', ItemID.carbonPlate, -1, 'a', ItemID.plateAlloy, -1, '#', BlockID.machineBlockBasic, 0]);
    Recipes.addShapeless({ id: ItemID.plateIron, count: 8, data: 0 }, [{ id: BlockID.machineBlockBasic, data: 0 }]);
});
IDRegistry.genBlockID("reinforcedStone");
Block.createBlock("reinforcedStone", [
    { name: "Reinforced Stone", texture: [["reinforced_block", 0]], inCreative: true }
], {
    base: 1,
    solid: true,
    destroytime: 25,
    explosionres: 150,
    lightopacity: 15,
    renderlayer: 2,
    translucency: 0,
    sound: "stone"
});
ToolAPI.registerBlockMaterial(BlockID.reinforcedStone, "stone", 2, true);
Block.setDestroyLevel("reinforcedStone", 2);
ToolLib.addBlockDropOnExplosion("reinforcedStone");
IDRegistry.genBlockID("reinforcedGlass");
Block.createBlock("reinforcedGlass", [
    { name: "Reinforced Glass", texture: [["reinforced_glass", 0]], inCreative: true }
], {
    base: 1,
    destroytime: 25,
    explosionres: 150,
    renderlayer: 1,
    sound: "stone"
});
ToolAPI.registerBlockMaterial(BlockID.reinforcedGlass, "stone", 2, true);
Block.setDestroyLevel("reinforcedGlass", 2);
ToolLib.addBlockDropOnExplosion("reinforcedGlass");
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.reinforcedStone, count: 8, data: 0 }, [
        "aaa",
        "axa",
        "aaa"
    ], ['x', ItemID.plateAlloy, 0, 'a', 1, 0]);
    Recipes.addShaped({ id: BlockID.reinforcedGlass, count: 7, data: 0 }, [
        "axa",
        "aaa",
        "axa"
    ], ['x', ItemID.plateAlloy, 0, 'a', 20, 0]);
    Recipes.addShaped({ id: BlockID.reinforcedGlass, count: 7, data: 0 }, [
        "aaa",
        "xax",
        "aaa"
    ], ['x', ItemID.plateAlloy, 0, 'a', 20, 0]);
});
Block.createSpecialType({
    destroytime: 0.05,
    explosionres: 0.5,
    renderlayer: 1,
}, "cable");
IDRegistry.genBlockID("cableTin0");
IDRegistry.genBlockID("cableTin1");
Block.createBlock("cableTin0", [
    { name: "tile.cableTin.name", texture: [["cable_tin", 0]], inCreative: false }
], "cable");
CableRegistry.createBlock("cableTin1", { name: "tile.cableTin.name", texture: "cable_tin1" }, "cable");
ToolAPI.registerBlockMaterial(BlockID.cableTin0, "stone");
ToolAPI.registerBlockMaterial(BlockID.cableTin1, "stone");
IDRegistry.genBlockID("cableCopper0");
IDRegistry.genBlockID("cableCopper1");
Block.createBlock("cableCopper0", [
    { name: "tile.cableCopper.name", texture: [["cable_copper", 0]], inCreative: false },
], "cable");
CableRegistry.createBlock("cableCopper1", { name: "tile.cableCopper.name", texture: "cable_copper1" }, "cable");
ToolAPI.registerBlockMaterial(BlockID.cableCopper0, "stone");
ToolAPI.registerBlockMaterial(BlockID.cableCopper1, "stone");
IDRegistry.genBlockID("cableGold0");
IDRegistry.genBlockID("cableGold1");
IDRegistry.genBlockID("cableGold2");
Block.createBlock("cableGold0", [
    { name: "tile.cableGold.name", texture: [["cable_gold", 0]], inCreative: false },
], "cable");
CableRegistry.createBlock("cableGold1", { name: "tile.cableGold.name", texture: "cable_gold1" }, "cable");
CableRegistry.createBlock("cableGold2", { name: "tile.cableGold.name", texture: "cable_gold2" }, "cable");
ToolAPI.registerBlockMaterial(BlockID.cableGold0, "stone");
ToolAPI.registerBlockMaterial(BlockID.cableGold1, "stone");
ToolAPI.registerBlockMaterial(BlockID.cableGold2, "stone");
IDRegistry.genBlockID("cableIron0");
IDRegistry.genBlockID("cableIron1");
IDRegistry.genBlockID("cableIron2");
IDRegistry.genBlockID("cableIron3");
Block.createBlock("cableIron0", [
    { name: "tile.cableIron.name", texture: [["cable_iron", 0]], inCreative: false },
], "cable");
CableRegistry.createBlock("cableIron1", { name: "tile.cableIron.name", texture: "cable_iron1" }, "cable");
CableRegistry.createBlock("cableIron2", { name: "tile.cableIron.name", texture: "cable_iron2" }, "cable");
CableRegistry.createBlock("cableIron3", { name: "tile.cableIron.name", texture: "cable_iron3" }, "cable");
ToolAPI.registerBlockMaterial(BlockID.cableIron0, "stone");
ToolAPI.registerBlockMaterial(BlockID.cableIron1, "stone");
ToolAPI.registerBlockMaterial(BlockID.cableIron2, "stone");
ToolAPI.registerBlockMaterial(BlockID.cableIron3, "stone");
IDRegistry.genBlockID("cableOptic");
CableRegistry.createBlock("cableOptic", { name: "tile.cableOptic.name", texture: "cable_glass" }, "cable");
ToolAPI.registerBlockMaterial(BlockID.cableOptic, "stone");
// energy net
CableRegistry.registerCable("cableTin", 32, 1);
CableRegistry.registerCable("cableCopper", 128, 1);
CableRegistry.registerCable("cableGold", 512, 2);
CableRegistry.registerCable("cableIron", 2048, 3);
CableRegistry.registerCable("cableOptic", 8192);
// block model
TileRenderer.setupWireModel(BlockID.cableTin0, -1, 4 / 16, "ic-wire");
CableRegistry.setupModel(BlockID.cableTin1, 6 / 16);
TileRenderer.setupWireModel(BlockID.cableCopper0, -1, 4 / 16, "ic-wire");
CableRegistry.setupModel(BlockID.cableCopper1, 6 / 16);
TileRenderer.setupWireModel(BlockID.cableGold0, -1, 3 / 16, "ic-wire");
CableRegistry.setupModel(BlockID.cableGold1, 5 / 16);
CableRegistry.setupModel(BlockID.cableGold2, 7 / 16);
TileRenderer.setupWireModel(BlockID.cableIron0, -1, 6 / 16, "ic-wire");
CableRegistry.setupModel(BlockID.cableIron1, 8 / 16);
CableRegistry.setupModel(BlockID.cableIron2, 10 / 16);
CableRegistry.setupModel(BlockID.cableIron3, 12 / 16);
CableRegistry.setupModel(BlockID.cableOptic, 1 / 4);
IDRegistry.genBlockID("miningPipe");
Block.createBlock("miningPipe", [
    { name: "Mining Pipe", texture: [["mining_pipe", 0]], inCreative: true },
    { name: "tile.mining_pipe.name", texture: [["mining_pipe", 1]], inCreative: false }
], { base: 1, destroytime: 2, renderlayer: 2, sound: "stone" });
Block.setBlockShape(BlockID.miningPipe, { x: 5 / 16, y: 0, z: 5 / 16 }, { x: 11 / 16, y: 1, z: 11 / 16 }, 0);
ToolAPI.registerBlockMaterial(BlockID.miningPipe, "stone", 1, true);
Block.setDestroyLevel("miningPipe", 1);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.miningPipe, count: 8, data: 0 }, [
        "p p",
        "p p",
        "pxp",
    ], ['x', ItemID.treetap, 0, 'p', ItemID.plateIron, 0]);
});
AgricultureAPI.nutrientBiomeBonusValue = {
    21: 10,
    22: 10,
    23: 10,
    149: 10,
    151: 10,
    6: 10,
    134: 10,
    14: 5,
    15: 5,
    4: 5,
    132: 5,
    18: 5,
    27: 5,
    155: 5,
    157: 5,
    29: 5,
    28: 5,
    7: 2,
    11: 2,
    1: 0,
    128: 0,
    129: 0,
    12: 0,
    35: -2,
    163: -2,
    36: -2,
    3: -5,
    13: -5,
    162: -5,
    165: -5,
    166: -5,
    34: -5,
    158: -5,
    131: -5,
    37: -5,
    38: -5,
    39: -5,
    17: -5,
    18: -5,
    19: -5,
    20: -5,
    23: -5,
    161: -5,
    156: -5,
    33: -5,
    31: -5
};
AgricultureAPI.abstractFunctions["IC2CropCard"] = {
    baseSeed: {
        size: 1,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    maxSize: 1,
    getOptimalHarvestSize: function (te) {
        return te.crop.maxSize;
    },
    getDiscoveredBy: function () {
        return "IC2 Team";
    },
    isWeed: function (te) { return false; },
    tick: function (te) { },
    dropGainChance: function (te) {
        return Math.pow(0.95, te.crop.properties.tier);
    },
    canGrow: function (te) {
        return te.data.currentSize < te.crop.maxSize;
    },
    canCross: function (te) {
        return te.data.currentSize >= 3;
    },
    canBeHarvested: function (te) {
        return te.data.currentSize == te.crop.maxSize;
    },
    getGrowthDuration: function (te) {
        return te.crop.properties.tier * 200;
    },
    getSeeds: function (te) {
        return te.generateSeeds(te.data);
    },
    getSeedDropChance: function (te) {
        if (te.data.currentSize == 1)
            return 0;
        var base = .5;
        if (te.data.currentSize == 2)
            base /= 2;
        base *= Math.pow(0.8, te.crop.properties.tier);
        return base;
    },
    onLeftClick: function (te) { return te.pick(); },
    onRightClick: function (te) { return te.performManualHarvest(); },
    onEntityCollision: function (te) { return true; },
    getSizeAfterHarvest: function (te) { return 1; },
    getRootsLength: function (te) { return 1; }
};
AgricultureAPI.abstractFunctions["CropVanilla"] = {
    getDiscoveredBy: function () {
        return "Notch";
    },
    getProduct: function () { return { id: 0, count: 1, data: 0 }; },
    canGrow: function (tileentity) {
        var light = World.getLightLevel(tileentity.x, tileentity.y, tileentity.z);
        return tileentity.data.currentSize < tileentity.crop.maxSize && light >= 9;
    },
    getGain: function (te) {
        return te.crop.getProduct();
    },
    getSeeds: function (te) {
        if (te.data.statGain <= 1 && te.data.statGrowth <= 1 && te.data.statResistance <= 1) {
            return AgricultureAPI.abstractFunctions["CropVanilla"].getSeed();
        }
        return AgricultureAPI.abstractFunctions["IC2CropCard"].getSeeds(te);
    },
    getSeed: function () { return { id: 0, count: 0, data: 0 }; }
};
AgricultureAPI.abstractFunctions["CropColorFlower"] = {
    getDiscoveredBy: function () {
        if (this.name == "dandelion" || this.name == "rose") {
            return "Notch";
        }
        return "Alblaka";
    },
    properties: {
        tier: 2,
        chemistry: 1,
        consumable: 1,
        defensive: 0,
        colorful: 5,
        weed: 1
    },
    maxSize: 4,
    color: 0,
    getOptimalHarvestSize: function (crop) { return 4; },
    canGrow: function (tileentity) {
        var light = World.getLightLevel(tileentity.x, tileentity.y, tileentity.z);
        return tileentity.data.currentSize < tileentity.crop.maxSize && light >= 12;
    },
    getGain: function (te) { return { id: 351, count: 1, data: this.color }; },
    getSizeAfterHarvest: function (te) { return 3; },
    getGrowthDuration: function (crop) {
        if (crop.data.currentSize == 3) {
            return 600;
        }
        return 400;
    }
};
AgricultureAPI.abstractFunctions["CropBaseMushroom"] = {
    properties: {
        tier: 2,
        chemistry: 0,
        consumable: 4,
        defensive: 0,
        colorful: 0,
        weed: 4
    },
    maxSize: 3,
    canGrow: function (crop) {
        return crop.data.currentSize < this.maxSize && crop.data.storageWater > 0;
    },
    getGrowthDuration: function (crop) { return 200; }
};
AgricultureAPI.abstractFunctions["CropBaseMetalCommon"] = {
    properties: {
        tier: 6,
        chemistry: 2,
        consumable: 0,
        defensive: 0,
        colorful: 1,
        weed: 0
    },
    maxSize: 4,
    cropRootsRequirement: [],
    getOptimalHarvestSize: function (crop) { return 4; },
    getRootsLength: function (crop) { return 5; },
    canGrow: function (crop) {
        if (crop.data.currentSize < 3)
            return true;
        if (crop.data.currentSize == 3) {
            if (!this.cropRootsRequirement || !this.cropRootsRequirement.length)
                return true;
            for (var ind in this.cropRootsRequirement) {
                var id = this.cropRootsRequirement[ind];
                if (crop.isBlockBelow(eval(id)))
                    return true;
            }
        }
        return false;
    },
    canBeHarvested: function (crop) {
        return crop.data.currentSize == 4;
    },
    dropGainChance: function () {
        return AgricultureAPI.abstractFunctions["IC2CropCard"] / 2;
    },
    getGrowthDuration: function (crop) {
        if (crop.data.currentSize == 3) {
            return 2000;
        }
        return 800;
    },
    getSizeAfterHarvest: function (crop) {
        return 2;
    }
};
AgricultureAPI.abstractFunctions["CropBaseMetalUncommon"] = {
    properties: {
        tier: 6,
        chemistry: 2,
        consumable: 0,
        defensive: 0,
        colorful: 2,
        weed: 0
    },
    maxSize: 5,
    cropRootsRequirement: [],
    getOptimalHarvestSize: function (crop) { return 5; },
    getRootsLength: function (crop) { return 5; },
    canGrow: function (crop) {
        if (crop.data.currentSize < 4)
            return true;
        if (crop.data.currentSize == 4) {
            if (!this.cropRootsRequirement || !this.cropRootsRequirement.length)
                return true;
            for (var ind in this.cropRootsRequirement) {
                var id = this.cropRootsRequirement[ind];
                if (crop.isBlockBelow(eval(id)))
                    return true;
            }
        }
        return false;
    },
    canBeHarvested: function (crop) {
        return crop.data.currentSize == 5;
    },
    dropGainChance: function () {
        return Math.pow(0.95, this.properties.tier);
    },
    getGrowthDuration: function (crop) {
        if (crop.data.currentSize == 4) {
            return 2200;
        }
        return 750;
    },
    getSizeAfterHarvest: function (crop) {
        return 2;
    }
};
IDRegistry.genBlockID("crop");
Block.createBlock("crop", [
    { name: "crop", texture: [["stick", 0]], inCreative: false }
], { base: 59, rendertype: 6, explosionres: 0 });
ToolAPI.registerBlockMaterial(BlockID.crop, "wood");
TileRenderer.setEmptyCollisionShape(BlockID.crop);
BlockRenderer.enableCoordMapping(BlockID.crop, 0, TileRenderer.getCropModel(["stick", 0]));
Block.registerDropFunctionForID(BlockID.crop, function (coords, id, data, diggingLevel, toolLevel) {
    return [];
});
TileEntity.registerPrototype(BlockID.crop, {
    defaultValues: {
        crop: null,
        dirty: true,
        statGrowth: 0,
        statGain: 0,
        statResistance: 0,
        storageNutrients: 0,
        storageWater: 0,
        storageWeedEX: 0,
        terrainAirQuality: -1,
        terrainHumidity: -1,
        terrainNutrients: -1,
        currentSize: 1,
        growthPoints: 0,
        scanLevel: 0,
        crossingBase: false
    },
    init: function () {
        if (this.data.crop)
            this.crop = AgricultureAPI.cropCards[this.data.crop];
        this.updateRender();
    },
    tick: function () {
        this.checkGround();
        this.checkPlayerRunning();
        if (World.getThreadTime() % 192 == 0)
            this.performTick();
    },
    click: function (id, count, data, coords) {
        if (id) {
            var card = AgricultureAPI.getCardFromSeed({ id: id, data: data });
            if (id == ItemID.agriculturalAnalyzer)
                return;
            if (id == ItemID.debugItem && this.crop) {
                this.data.currentSize = this.crop.maxSize;
                this.updateRender();
                return;
            }
            if (ConfigIC.debugMode && id == 351 && this.data.crossingBase) {
                this.attemptCrossing();
                return;
            }
            if (!this.crop && !this.data.crossingBase && id == ItemID.cropStick) {
                this.data.crossingBase = true;
                this.data.dirty = true;
                Player.decreaseCarriedItem(1);
                this.updateRender();
                return;
            }
            if (this.crop && id == ItemID.fertilizer) {
                if (this.applyFertilizer(true))
                    this.data.dirty = true;
                Player.decreaseCarriedItem(1);
                return;
            }
            if (id == ItemID.cellWater && count == 1) {
                var amount = this.applyHydration(1000 - data);
                if (amount > 0) {
                    if (data + amount >= 1000) {
                        Player.setCarriedItem(ItemID.cellEmpty, 1, 0);
                    }
                    else {
                        Player.setCarriedItem(id, 1, data + amount);
                    }
                }
                return;
            }
            if (this.applyWeedEx(id, true)) {
                this.data.dirty = true;
                return;
            }
            if (!this.crop && !this.data.crossingBase && card) {
                this.reset();
                this.data.crop = AgricultureAPI.getCardIndexFromID(card.id);
                this.crop = AgricultureAPI.cropCards[this.data.crop];
                this.data.currentSize = card.baseSeed.size;
                this.data.statGain = card.baseSeed.gain;
                this.data.statGrowth = card.baseSeed.growth;
                this.data.statResistance = card.baseSeed.resistance;
                Player.decreaseCarriedItem(1);
                this.updateRender();
                return;
            }
        }
        if (this.crop && this.crop.canBeHarvested(this))
            this.crop.onRightClick(this);
    },
    onLongClick: function () {
        if (this.data.crossingBase) {
            World.drop(this.x, this.y, this.z, ItemID.cropStick, 1, 0);
            this.data.crossingBase = false;
            this.data.dirty = true;
            this.updateRender();
            return true;
        }
        else if (this.crop) {
            return this.crop.onLeftClick(this);
            ;
        }
        return false;
    },
    destroyBlock: function (coords, player) {
        World.drop(this.x, this.y, this.z, ItemID.cropStick, 1, 0);
        if (this.data.crossingBase)
            World.drop(this.x, this.y, this.z, ItemID.cropStick, 1, 0);
        if (this.crop)
            this.crop.onLeftClick(this);
        BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
    },
    updateRender: function () {
        var texture = ["stick", 0];
        if (this.crop) {
            texture[0] = this.crop.texture;
            texture[1] = this.data.currentSize;
        }
        else if (this.data.crossingBase)
            texture[1] = 1;
        var render = TileRenderer.getCropModel(texture);
        BlockRenderer.mapAtCoords(this.x, this.y, this.z, render);
    },
    checkPlayerRunning: function () {
        if (!this.crop)
            return;
        var coords = Entity.getPosition(Player.get());
        var playerX = Math.floor(coords.x);
        var playerY = Math.floor(coords.y);
        var playerZ = Math.floor(coords.z);
        if (playerX == this.x && playerY - 1 == this.y && playerZ == this.z) {
            var vel = Player.getVelocity();
            var horizontalVel = Math.sqrt(vel.x * vel.x + vel.z * vel.z);
            if (horizontalVel > 0.15 && this.crop.onEntityCollision(this)) {
                World.destroyBlock(this.x, this.y, this.z);
            }
        }
    },
    checkGround: function () {
        if (World.getBlockID(this.x, this.y - 1, this.z) != 60) {
            World.destroyBlock(this.x, this.y, this.z);
        }
    },
    performTick: function () {
        if (World.getThreadTime() % 768 == 0) {
            this.updateTerrainHumidity();
            this.updateTerrainNutrients();
            this.updateTerrainAirQuality();
        }
        if (!this.crop && (!this.data.crossingBase || !this.attemptCrossing())) {
            if (randomInt(0, 100) != 0 || this.data.storageWeedEX > 0) {
                if (this.data.storageWeedEX > 0 && randomInt(0, 10) == 0) {
                    this.data.storageWeedEX--;
                }
                return;
            }
            this.reset();
            this.data.crop = AgricultureAPI.getCardIndexFromID("weed");
            this.crop = AgricultureAPI.cropCards[this.data.crop];
            this.data.currentSize = 1;
            this.updateRender();
        }
        if (this.crop) {
            this.crop.tick(this);
            if (this.crop.canGrow(this)) {
                this.performGrowthTick();
                var growDuration = this.crop.getGrowthDuration(this);
                if (this.data.growthPoints >= growDuration) {
                    this.data.growthPoints = 0;
                    this.data.currentSize = this.data.currentSize + 1;
                    this.data.dirty = true;
                    this.updateRender();
                }
            }
        }
        if (this.data.storageNutrients > 0)
            this.data.storageNutrients--;
        if (this.data.storageWater > 0)
            this.data.storageWater--;
        if (this.crop.isWeed(this) && randomInt(0, 50) - this.data.statGrowth <= 2) {
            this.performWeedWork();
        }
    },
    updateTerrainHumidity: function () {
        var humidity = AgricultureAPI.getHumidityBiomeBonus(this.x, this.z);
        if (World.getBlockData(this.x, this.y - 1, this.z) == 7)
            humidity += 2;
        if (this.data.storageWater >= 5)
            humidity += 2;
        humidity += (this.data.storageWater + 24) / 25;
        this.data.terrainHumidity = humidity;
    },
    updateTerrainNutrients: function () {
        var nutrients = AgricultureAPI.getNutrientBiomeBonus(this.x, this.z);
        nutrients += (this.data.terrainNutrients + 19) / 20;
        for (var i = 2; i < 5; ++i) {
            if (World.getBlockID(this.x, this.y - i, this.z) == 3)
                nutrients++;
        }
        this.data.terrainNutrients = nutrients;
    },
    updateTerrainAirQuality: function () {
        var value = 0;
        var height = Math.floor((this.y - 64) / 15);
        if (height > 4)
            height = 4;
        if (height < 0)
            height = 0;
        var fresh = 9;
        for (var x = this.x - 1; x < this.x + 2; x++) {
            for (var z = this.z - 1; z < this.z + 2; z++) {
                if (World.getBlockID(x, this.y, z))
                    fresh--;
            }
        }
        if (GenerationUtils.canSeeSky(this.x, this.y + 1, this.z))
            value += 2;
        value += Math.floor(fresh / 2);
        value += height;
        this.data.terrainAirQuality = value;
    },
    performGrowthTick: function () {
        if (!this.crop)
            return;
        var totalGrowth = 0;
        var baseGrowth = 3 + randomInt(0, 7) + this.data.statGrowth;
        var properties = this.crop.properties;
        var sumOfStats = this.data.statGrowth + this.data.statGain + this.data.statResistance;
        var minimumQuality = (properties.tier - 1) * 4 + sumOfStats;
        minimumQuality = Math.max(minimumQuality, 0);
        var providedQuality = 75;
        if (providedQuality >= minimumQuality) {
            totalGrowth = baseGrowth * (100 + (providedQuality - minimumQuality)) / 100;
        }
        else {
            var aux = (minimumQuality - providedQuality) * 4;
            if (aux > 100 && randomInt(0, 32) > this.data.statResistance) {
                totalGrowth = 0;
                this.reset();
                this.updateRender();
            }
            else {
                totalGrowth = baseGrowth * (100 - aux) / 100;
                totalGrowth = Math.max(totalGrowth, 0);
            }
        }
        this.data.growthPoints += Math.round(totalGrowth);
    },
    performWeedWork: function () {
        var coords = this.relativeCropCoords[randomInt(0, 3)];
        var preCoords = [this.x + coords[0], this.y + coords[0], this.z + coords[0]];
        if (World.getBlockID(preCoords[0], preCoords[1], preCoords[2]) == BlockID.crop) {
            var TE = World.getTileEntity(preCoords[0], preCoords[1], preCoords[2]);
            if (!TE.crop || (!TE.crop.isWeed(this) && !TE.hasWeedEX() && randomInt(0, 32) >= TE.data.statResistance)) {
                var newGrowth = Math.max(this.data.statGrowth, TE.data.statGrowth);
                if (newGrowth < 31 && randomInt(0, 1))
                    newGrowth++;
                TE.reset();
                TE.data.crop = AgricultureAPI.getCardIndexFromID("weed");
                TE.crop = AgricultureAPI.cropCards[TE.data.crop];
                TE.data.currentSize = 1;
                TE.data.statGrowth = newGrowth;
                TE.updateRender();
            }
        }
        else if (World.getBlockID(preCoords[0], preCoords[1] - 1, preCoords[2]) == 60) {
            World.setBlock(preCoords[0], preCoords[1] - 1, preCoords[2], 2, 0);
        }
    },
    reset: function () {
        this.data.crop = null;
        this.crop = undefined;
        this.data.statGain = 0;
        this.data.statResistance = 0;
        this.data.statGrowth = 0;
        this.data.terrainAirQuality = -1;
        this.data.terrainHumidity = -1;
        this.data.terrainNutrients = -1;
        this.data.growthPoints = 0;
        this.data.scanLevel = 0;
        this.data.currentSize = 1;
        this.data.dirty = true;
    },
    hasWeedEX: function () {
        if (this.data.storageWeedEX > 0) {
            this.data.storageWeedEX -= 5;
            return true;
        }
        return false;
    },
    attemptCrossing: function () {
        if (randomInt(0, 3) != 0)
            return false;
        var cropCoords = this.askCropJoinCross(this.relativeCropCoords);
        if (cropCoords.length < 2)
            return false;
        var cropCards = AgricultureAPI.cropCards;
        var ratios = [];
        var total = 0;
        for (var j in cropCards) {
            var crop = cropCards[j];
            for (var crd in cropCoords) {
                var coords = cropCoords[crd];
                var tileEnt = World.getTileEntity(coords.x, coords.y, coords.z);
                total += this.calculateRatioFor(crop, tileEnt.crop);
            }
            ratios[j] = total;
        }
        var search = randomInt(0, total);
        var min = 0;
        var max = ratios.length - 1;
        while (min < max) {
            var cur = Math.floor((min + max) / 2);
            var value = ratios[cur];
            if (search < value) {
                max = cur;
            }
            else {
                min = cur + 1;
            }
        }
        this.data.crossingBase = false;
        this.crop = cropCards[min];
        this.data.crop = min;
        this.data.dirty = true;
        this.data.currentSize = 1;
        this.data.statGrowth = 0;
        this.data.statResistance = 0;
        this.data.statGain = 0;
        for (var i in cropCoords) {
            var te2 = World.getTileEntity(cropCoords[i].x, cropCoords[i].y, cropCoords[i].z);
            this.data.statGrowth += te2.data.statGrowth;
            this.data.statResistance += te2.data.statResistance;
            this.data.statGain += te2.data.statGain;
        }
        var count = cropCoords.length;
        this.data.statGrowth = Math.floor(this.data.statGrowth / count);
        this.data.statResistance = Math.floor(this.data.statResistance / count);
        this.data.statGain = Math.floor(this.data.statGain / count);
        this.data.statGrowth += Math.round(randomInt(0, 1 + 2 * count) - count);
        this.data.statGain += Math.round(randomInt(0, 1 + 2 * count) - count);
        this.data.statResistance += Math.round(randomInt(0, 1 + 2 * count) - count);
        this.data.statGrowth = this.lim(this.data.statGrowth, 0, 31);
        this.data.statGain = this.lim(this.data.statGain, 0, 31);
        this.data.statResistance = this.lim(this.data.statResistance, 0, 31);
        this.updateRender();
        return true;
    },
    lim: function (value, min, max) {
        if (value <= min)
            return min;
        if (value >= max)
            return max;
        return value;
    },
    relativeCropCoords: [[1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]],
    askCropJoinCross: function (coordsArray) {
        var cropsCoords = [];
        for (var r in coordsArray) {
            var pos = coordsArray[r];
            var coords = { x: this.x + pos[0], y: this.y + pos[1], z: this.z + pos[2] };
            var sideTileEntity = World.getTileEntity(coords.x, coords.y, coords.z);
            var blockId = World.getBlockID(coords.x, coords.y, coords.z);
            if (!sideTileEntity || !sideTileEntity.crop || blockId != BlockID.crop)
                continue;
            if (sideTileEntity.crop.canGrow(sideTileEntity) || !sideTileEntity.crop.canCross(sideTileEntity))
                continue;
            var base = 4;
            if (sideTileEntity.data.statGrowth >= 16)
                base++;
            if (sideTileEntity.data.statGrowth >= 30)
                base++;
            if (sideTileEntity.data.statResistance >= 28) {
                base += 27 - sideTileEntity.data.statResistance;
            }
            if (base >= randomInt(0, 20))
                cropsCoords.push(coords);
        }
        return cropsCoords;
    },
    calculateRatioFor: function (newCrop, oldCrop) {
        if (newCrop.id == oldCrop.id)
            return 500;
        var value = 0;
        var propOld = oldCrop.properties;
        var propNew = newCrop.properties;
        for (var i in propOld) {
            var delta = Math.abs(propOld[i] - propNew[i]);
            value += 2 - delta;
        }
        var attributesOld = oldCrop.attributes;
        var attributesNew = newCrop.attributes;
        for (var iO in attributesOld) {
            for (var iN in attributesNew) {
                var attO = attributesOld[iO];
                var attN = attributesNew[iN];
                if (attO == attN)
                    value += 5;
            }
        }
        var diff = newCrop.properties.tier - oldCrop.properties.tier;
        if (diff > 1)
            value -= 2 * diff;
        if (diff < -3)
            value += diff;
        return Math.max(value, 0);
    },
    applyFertilizer: function (manual) {
        if (this.data.storageNutrients >= 100)
            return false;
        this.data.storageNutrients += manual ? 100 : 90;
        return true;
    },
    applyWeedEx: function (id, manual) {
        if (id == ItemID.weedEx) {
            var limit = manual ? 100 : 150;
            if (this.data.storageWeedEX >= limit)
                return false;
            var amount = manual ? 50 : 100;
            this.data.storageWeedEX += amount;
            if (manual)
                ToolAPI.breakCarriedTool(1);
            return true;
        }
        return false;
    },
    applyHydration: function (amount) {
        var limit = 200;
        if (this.data.storageWater >= limit)
            return 0;
        var relativeAmount = limit - this.data.storageWater;
        amount = Math.min(relativeAmount, amount);
        this.data.storageWater += amount;
        return amount;
    },
    tryPlantIn: function (cropCardID, size, statGr, statGa, statRe, scan) {
        var cropCard = AgricultureAPI.cropCards[cropCardID];
        if (!cropCard || cropCard.id == "weed" || this.data.crossingBase)
            return false;
        this.reset();
        this.data.crop = cropCardID;
        this.crop = cropCard;
        this.data.currentSize = size;
        this.data.statGain = statGa;
        this.data.statGrowth = statGr;
        this.data.statResistance = statRe;
        this.data.scanLevel = scan;
        this.updateRender();
        return true;
    },
    performHarvest: function () {
        if (!this.crop || !this.crop.canBeHarvested(this))
            return null;
        var chance = this.crop.dropGainChance(this);
        chance *= Math.pow(1.03, this.data.statGain);
        var dropCount2 = Math.max(0, Math.round(this.nextGaussian() * chance * 0.6827 + chance));
        var ret = [];
        for (var i = 0; i < dropCount2; i++) {
            ret[i] = this.crop.getGain(this);
            if (ret[i] && randomInt(0, 100) <= this.data.statGain) {
                ret[i] = ret[i].count++;
            }
        }
        this.data.currentSize = this.crop.getSizeAfterHarvest(this);
        this.data.dirty = true;
        this.updateRender();
        return ret;
    },
    performManualHarvest: function () {
        var dropItems = this.performHarvest();
        if (!dropItems || !dropItems.length)
            return;
        for (var ind in dropItems) {
            var item = dropItems[ind];
            nativeDropItem(this.x, this.y, this.z, 0, item.id, item.count, item.data, null);
        }
    },
    nextGaussian: function () {
        var v1, v2, s;
        do {
            v1 = 2 * Math.random() - 1; // Between -1.0 and 1.0.
            v2 = 2 * Math.random() - 1; // Between -1.0 and 1.0.
            s = v1 * v1 + v2 * v2;
        } while (s >= 1);
        var norm = Math.sqrt(-2 * Math.log(s) / s);
        return v1 * norm;
    },
    pick: function () {
        if (!this.crop)
            return false;
        var bonus = this.crop.canBeHarvested(this);
        var firstchance = this.crop.getSeedDropChance(this);
        firstchance *= Math.pow(1.1, this.data.statResistance);
        var dropCount = 0;
        if (bonus) {
            if (Math.random() <= (firstchance + 1) * .8)
                dropCount++;
            var chance = this.crop.getSeedDropChance(this) + this.data.statGrowth / 100;
            chance *= Math.pow(.95, this.statGain - 23);
            if (Math.random() <= chance)
                dropCount++;
        }
        else if (Math.random() <= firstchance * 1.5)
            dropCount++;
        var item = this.crop.getSeeds(this);
        nativeDropItem(this.x, this.y, this.z, 0, item.id, dropCount, item.data, item.extra);
        this.reset();
        this.updateRender();
        return true;
    },
    generateSeeds: function (data) {
        var extra = AgricultureAPI.generateExtraFromValues(data);
        return { id: ItemID.cropSeedBag, data: this.data.crop, extra: extra };
    },
    isBlockBelow: function (reqBlockID) {
        if (!this.crop)
            return false;
        var rootsLength = this.crop.getRootsLength(this);
        for (var i = 1; i < rootsLength; i++) {
            var blockID = World.getBlockID(this.x, this.y - i, this.z);
            if (!blockID)
                return false;
            if (reqBlockID == blockID)
                return true;
        }
        return false;
    }
});
Callback.addCallback("DestroyBlockStart", function (coords, block) {
    if (block.id == BlockID.crop) {
        var tileEntity = World.getTileEntity(coords.x, coords.y, coords.z);
        if (tileEntity && tileEntity.onLongClick()) {
            Game.prevent();
        }
    }
});
IDRegistry.genBlockID("primalGenerator");
Block.createBlock("primalGenerator", [
    { name: "Generator", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["generator", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true }
], "machine");
TileRenderer.setStandartModel(BlockID.primalGenerator, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["generator", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.primalGenerator, 0, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["generator", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.primalGenerator, 4, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["generator", 1], ["machine_side", 0], ["machine_side", 0]]);
MachineRegistry.setMachineDrop("primalGenerator");
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.primalGenerator, count: 1, data: 0 }, [
        "x",
        "#",
        "a"
    ], ['#', BlockID.machineBlockBasic, 0, 'a', 61, 0, 'x', ItemID.storageBattery, -1]);
    Recipes.addShaped({ id: BlockID.primalGenerator, count: 1, data: 0 }, [
        " x ",
        "###",
        " a "
    ], ['#', ItemID.plateIron, 0, 'a', BlockID.ironFurnace, -1, 'x', ItemID.storageBattery, -1]);
});
var guiGenerator = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Generator") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_SCALE },
        { type: "bitmap", x: 450, y: 150, bitmap: "fire_background", scale: GUI_SCALE },
    ],
    elements: {
        "energyScale": { type: "scale", x: 530 + GUI_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE },
        "burningScale": { type: "scale", x: 450, y: 150, direction: 1, value: 0.5, bitmap: "fire_scale", scale: GUI_SCALE },
        "slotEnergy": { type: "slot", x: 441, y: 75,
            isValid: function (id) {
                return ChargeItemRegistry.isValidItem(id, "Eu", 1);
            }
        },
        "slotFuel": { type: "slot", x: 441, y: 212,
            isValid: function (id, count, data) {
                return Recipes.getFuelBurnDuration(id, data) > 0;
            }
        },
        "textInfo1": { type: "text", x: 642, y: 142, width: 300, height: 30, text: "0/" },
        "textInfo2": { type: "text", x: 642, y: 172, width: 300, height: 30, text: "10000" }
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiGenerator, "Generator");
});
MachineRegistry.registerGenerator(BlockID.primalGenerator, {
    defaultValues: {
        meta: 0,
        burn: 0,
        burnMax: 0,
        isActive: false
    },
    getGuiScreen: function () {
        return guiGenerator;
    },
    consumeFuel: function (slotName) {
        var fuelSlot = this.container.getSlot(slotName);
        if (fuelSlot.id > 0) {
            var burn = Recipes.getFuelBurnDuration(fuelSlot.id, fuelSlot.data);
            if (burn && !LiquidRegistry.getItemLiquid(fuelSlot.id, fuelSlot.data)) {
                fuelSlot.count--;
                this.container.validateSlot(slotName);
                return burn;
            }
        }
        return 0;
    },
    tick: function () {
        StorageInterface.checkHoppers(this);
        var energyStorage = this.getEnergyStorage();
        if (this.data.burn <= 0 && this.data.energy + 10 <= energyStorage) {
            this.data.burn = this.data.burnMax = this.consumeFuel("slotFuel") / 4;
        }
        if (this.data.burn > 0) {
            this.data.energy = Math.min(this.data.energy + 10, energyStorage);
            this.data.burn--;
            this.activate();
            this.startPlaySound();
        }
        else {
            this.deactivate();
            this.stopPlaySound();
        }
        this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotEnergy"), "Eu", this.data.energy, 1);
        this.container.setScale("burningScale", this.data.burn / this.data.burnMax || 0);
        this.container.setScale("energyScale", this.data.energy / energyStorage);
        this.container.setText("textInfo1", this.data.energy + "/");
    },
    getOperationSound: function () {
        return "GeneratorLoop.ogg";
    },
    getEnergyStorage: function () {
        return 10000;
    },
    energyTick: function (type, src) {
        var output = Math.min(32, this.data.energy);
        this.data.energy += src.add(output) - output;
    },
    renderModel: MachineRegistry.renderModelWithRotation,
});
TileRenderer.setRotationPlaceFunction(BlockID.primalGenerator);
StorageInterface.createInterface(BlockID.primalGenerator, {
    slots: {
        "slotFuel": { input: true }
    },
    isValidInput: function (item) {
        return Recipes.getFuelBurnDuration(item.id, item.data) > 0;
    }
});
IDRegistry.genBlockID("geothermalGenerator");
Block.createBlock("geothermalGenerator", [
    { name: "Geothermal Generator", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["geothermal_generator", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true }
], "machine");
TileRenderer.setStandartModel(BlockID.geothermalGenerator, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["geothermal_generator", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.geothermalGenerator, 0, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["geothermal_generator", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.geothermalGenerator, 4, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["geothermal_generator", 1], ["machine_side", 0], ["machine_side", 0]]);
MachineRegistry.setMachineDrop("geothermalGenerator", BlockID.primalGenerator);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.geothermalGenerator, count: 1, data: 0 }, [
        "xax",
        "xax",
        "b#b"
    ], ['#', BlockID.primalGenerator, -1, 'a', ItemID.cellEmpty, 0, 'b', ItemID.casingIron, 0, 'x', 20, -1]);
});
var guiGeothermalGenerator = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Geothermal Generator") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 702, y: 91, bitmap: "energy_bar_background", scale: GUI_SCALE },
        { type: "bitmap", x: 581, y: 75, bitmap: "liquid_bar", scale: GUI_SCALE },
        { type: "bitmap", x: 459, y: 139, bitmap: "liquid_bar_arrow", scale: GUI_SCALE }
    ],
    elements: {
        "energyScale": { type: "scale", x: 702 + 4 * GUI_SCALE, y: 91, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE },
        "liquidScale": { type: "scale", x: 581 + 4 * GUI_SCALE, y: 75 + 4 * GUI_SCALE, direction: 1, value: 0.5, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE },
        "slot1": { type: "slot", x: 440, y: 75,
            isValid: function (id, count, data) {
                return LiquidLib.getItemLiquid(id, data) == "lava";
            }
        },
        "slot2": { type: "slot", x: 440, y: 183, isValid: function () { return false; } },
        "slotEnergy": { type: "slot", x: 725, y: 165, isValid: function (id) { return ChargeItemRegistry.isValidItem(id, "Eu", 1); } }
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiGeothermalGenerator, "Geothermal Generator");
});
MachineRegistry.registerGenerator(BlockID.geothermalGenerator, {
    defaultValues: {
        meta: 0,
        isActive: false,
    },
    getGuiScreen: function () {
        return guiGeothermalGenerator;
    },
    init: function () {
        this.liquidStorage.setLimit("lava", 8);
        this.renderModel();
    },
    getLiquidFromItem: MachineRegistry.getLiquidFromItem,
    click: function (id, count, data, coords) {
        if (Entity.getSneaking(player)) {
            return this.getLiquidFromItem("lava", { id: id, count: count, data: data }, null, true);
        }
    },
    tick: function () {
        StorageInterface.checkHoppers(this);
        var slot1 = this.container.getSlot("slot1");
        var slot2 = this.container.getSlot("slot2");
        this.getLiquidFromItem("lava", slot1, slot2);
        var energyStorage = this.getEnergyStorage();
        if (this.liquidStorage.getAmount("lava").toFixed(3) >= 0.001 && this.data.energy + 20 <= energyStorage) {
            this.data.energy += 20;
            this.liquidStorage.getLiquid("lava", 0.001);
            this.activate();
            this.startPlaySound();
        }
        else {
            this.stopPlaySound();
            this.deactivate();
        }
        this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotEnergy"), "Eu", this.data.energy, 1);
        this.liquidStorage.updateUiScale("liquidScale", "lava");
        this.container.setScale("energyScale", this.data.energy / energyStorage);
    },
    getOperationSound: function () {
        return "GeothermalLoop.ogg";
    },
    getEnergyStorage: function () {
        return 10000;
    },
    energyTick: function (type, src) {
        var output = Math.min(32, this.data.energy);
        this.data.energy += src.add(output) - output;
    },
    renderModel: MachineRegistry.renderModelWithRotation
});
TileRenderer.setRotationPlaceFunction(BlockID.geothermalGenerator);
StorageInterface.createInterface(BlockID.geothermalGenerator, {
    slots: {
        "slot1": { input: true },
        "slot2": { output: true }
    },
    isValidInput: function (item) {
        return LiquidLib.getItemLiquid(item.id, item.data) == "lava";
    },
    canReceiveLiquid: function (liquid, side) { return liquid == "lava"; },
    canTransportLiquid: function (liquid, side) { return false; }
});
IDRegistry.genBlockID("semifluidGenerator");
Block.createBlock("semifluidGenerator", [
    { name: "Semifluid Generator", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["semifluid_generator_front", 0], ["semifluid_generator_side", 0], ["semifluid_generator_side", 0]], inCreative: true }
], "machine");
TileRenderer.setStandartModel(BlockID.semifluidGenerator, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["semifluid_generator_front", 0], ["semifluid_generator_side", 0], ["semifluid_generator_side", 0]]);
TileRenderer.registerRotationModel(BlockID.semifluidGenerator, 0, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["semifluid_generator_front", 0], ["semifluid_generator_side", 0], ["semifluid_generator_side", 0]]);
TileRenderer.registerRotationModel(BlockID.semifluidGenerator, 4, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["semifluid_generator_front", 1], ["semifluid_generator_side", 1], ["semifluid_generator_side", 1]]);
MachineRegistry.setMachineDrop("semifluidGenerator", BlockID.primalGenerator);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.semifluidGenerator, count: 1, data: 0 }, [
        "pcp",
        "cxc",
        "pcp"
    ], ['x', BlockID.machineBlockBasic, 0, 'c', ItemID.cellEmpty, 0, 'p', ItemID.casingIron, 0]);
});
MachineRecipeRegistry.registerRecipesFor("fluidFuel", {
    "biomass": { power: 8, amount: 20 },
    "oil": { power: 8, amount: 10 },
    "biogas": { power: 16, amount: 10 },
    "ethanol": { power: 16, amount: 10 },
});
var guiSemifluidGenerator = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Semifluid Generator") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 702, y: 91, bitmap: "energy_bar_background", scale: GUI_SCALE },
        { type: "bitmap", x: 581, y: 75, bitmap: "liquid_bar", scale: GUI_SCALE },
        { type: "bitmap", x: 459, y: 139, bitmap: "liquid_bar_arrow", scale: GUI_SCALE }
    ],
    elements: {
        "energyScale": { type: "scale", x: 702 + 4 * GUI_SCALE, y: 91, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE },
        "liquidScale": { type: "scale", x: 581 + 4 * GUI_SCALE, y: 75 + 4 * GUI_SCALE, direction: 1, value: 0.5, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE },
        "slot1": { type: "slot", x: 440, y: 75, isValid: function (id, count, data) {
                var empty = LiquidLib.getEmptyItem(id, data);
                if (!empty)
                    return false;
                return MachineRecipeRegistry.hasRecipeFor("fluidFuel", empty.liquid);
            }
        },
        "slot2": { type: "slot", x: 440, y: 183, isValid: function () { return false; } },
        "slotEnergy": { type: "slot", x: 725, y: 165, isValid: function (id) { return ChargeItemRegistry.isValidItem(id, "Eu", 1); } }
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiSemifluidGenerator, "Semifluid Generator");
});
MachineRegistry.registerGenerator(BlockID.semifluidGenerator, {
    defaultValues: {
        meta: 0,
        fuel: 0,
        liquid: null,
        isActive: false,
    },
    getGuiScreen: function () {
        return guiSemifluidGenerator;
    },
    init: function () {
        this.liquidStorage.setLimit(null, 10);
        this.renderModel();
    },
    getLiquidFromItem: MachineRegistry.getLiquidFromItem,
    click: function (id, count, data, coords) {
        if (Entity.getSneaking(player)) {
            var liquid = this.liquidStorage.getLiquidStored();
            return this.getLiquidFromItem(liquid, { id: id, count: count, data: data }, null, true);
        }
    },
    tick: function () {
        StorageInterface.checkHoppers(this);
        var energyStorage = this.getEnergyStorage();
        var liquid = this.liquidStorage.getLiquidStored();
        var slot1 = this.container.getSlot("slot1");
        var slot2 = this.container.getSlot("slot2");
        this.getLiquidFromItem(liquid, slot1, slot2);
        if (this.data.fuel <= 0) {
            var fuel = MachineRecipeRegistry.getRecipeResult("fluidFuel", liquid);
            if (fuel && this.liquidStorage.getAmount(liquid).toFixed(3) >= fuel.amount / 1000 && this.data.energy + fuel.power * fuel.amount <= energyStorage) {
                this.liquidStorage.getLiquid(liquid, fuel.amount / 1000);
                this.data.fuel = fuel.amount;
                this.data.liquid = liquid;
            }
        }
        if (this.data.fuel > 0) {
            var fuel = MachineRecipeRegistry.getRecipeResult("fluidFuel", this.data.liquid);
            this.data.energy += fuel.power;
            this.data.fuel -= fuel.amount / 20;
            this.activate();
            this.startPlaySound();
        }
        else {
            this.data.liquid = null;
            this.stopPlaySound();
            this.deactivate();
        }
        this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotEnergy"), "Eu", this.data.energy, 1);
        this.liquidStorage.updateUiScale("liquidScale", liquid);
        this.container.setScale("energyScale", this.data.energy / energyStorage);
    },
    getOperationSound: function () {
        return "GeothermalLoop.ogg";
    },
    getEnergyStorage: function () {
        return 10000;
    },
    energyTick: function (type, src) {
        var output = Math.min(32, this.data.energy);
        this.data.energy += src.add(output) - output;
    },
    renderModel: MachineRegistry.renderModelWithRotation
});
TileRenderer.setRotationPlaceFunction(BlockID.semifluidGenerator);
StorageInterface.createInterface(BlockID.semifluidGenerator, {
    slots: {
        "slot1": { input: true },
        "slot2": { output: true }
    },
    isValidInput: function (item) {
        var empty = LiquidLib.getEmptyItem(item.id, item.data);
        if (!empty)
            return false;
        return MachineRecipeRegistry.hasRecipeFor("fluidFuel", empty.liquid);
    },
    canReceiveLiquid: function (liquid, side) {
        return MachineRecipeRegistry.hasRecipeFor("fluidFuel", liquid);
    },
    canTransportLiquid: function (liquid, side) { return false; }
});
IDRegistry.genBlockID("solarPanel");
Block.createBlock("solarPanel", [
    { name: "Solar Panel", texture: [["machine_bottom", 0], ["solar_panel", 0], ["machine", 0], ["machine", 0], ["machine", 0], ["machine", 0]], inCreative: true }
], "machine");
MachineRegistry.setMachineDrop("solarPanel", BlockID.machineBlockBasic);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.solarPanel, count: 1, data: 0 }, [
        "aaa",
        "xxx",
        "b#b"
    ], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.dustCoal, 0, 'b', ItemID.circuitBasic, 0, 'a', 20, -1]);
});
var guiSolarPanel = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Solar Panel") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    elements: {
        "slotEnergy": { type: "slot", x: 600, y: 130, isValid: function (id) { return ChargeItemRegistry.isValidItem(id, "Eu", 1); } },
        "sun": { type: "image", x: 608, y: 194, bitmap: "sun_off", scale: GUI_SCALE }
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiSolarPanel, "Solar Panel");
});
MachineRegistry.registerGenerator(BlockID.solarPanel, {
    defaultValues: {
        canSeeSky: false
    },
    getGuiScreen: function () {
        return guiSolarPanel;
    },
    init: function () {
        this.data.canSeeSky = GenerationUtils.canSeeSky(this.x, this.y + 1, this.z);
    },
    tick: function () {
        var content = this.container.getGuiContent();
        if (World.getThreadTime() % 100 == 0) {
            this.data.canSeeSky = GenerationUtils.canSeeSky(this.x, this.y + 1, this.z);
        }
        if (this.data.canSeeSky && World.getLightLevel(this.x, this.y + 1, this.z) == 15) {
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
    getEnergyStorage: function () {
        return 1;
    },
    energyTick: function (type, src) {
        if (this.data.energy) {
            src.addAll(1);
            this.data.energy = 0;
        }
    }
});
IDRegistry.genBlockID("genWindmill");
Block.createBlock("genWindmill", [
    { name: "Wind Mill", texture: [["machine_bottom", 0], ["machine_top", 0], ["windmill", 0], ["windmill", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true }
], "machine");
TileRenderer.setStandartModel(BlockID.genWindmill, [["machine_bottom", 0], ["machine_top", 0], ["windmill", 0], ["windmill", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.genWindmill, 0, [["machine_bottom", 0], ["machine_top", 0], ["windmill", 0], ["windmill", 0], ["machine_side", 0], ["machine_side", 0]]);
MachineRegistry.setMachineDrop("genWindmill", BlockID.primalGenerator);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.genWindmill, count: 1, data: 0 }, [
        "x x",
        " # ",
        "xcx"
    ], ['#', BlockID.primalGenerator, -1, 'x', ItemID.plateSteel, 0, 'c', ItemID.coil, 0]);
});
MachineRegistry.registerGenerator(BlockID.genWindmill, {
    defaultValues: {
        meta: 0,
        output: 0,
        ticker: -1,
        blockCount: 0
    },
    updateBlockCount: function () {
        var blockCount = -1;
        for (var x = -4; x <= 4; x++) {
            for (var y = -2; y <= 2; y++) {
                for (var z = -4; z <= 4; z++) {
                    if (World.getBlockID(this.x + x, this.y + y, this.z + z) != 0)
                        blockCount++;
                }
            }
        }
        this.data.blockCount = blockCount;
    },
    init: function () {
        if (this.data.ticker == undefined)
            this.data.ticker = -1;
        this.renderModel();
        if (this.dimension != 0)
            this.selfDestroy();
    },
    energyTick: function (type, src) {
        if (++this.data.ticker % 128 == 0) {
            if (this.data.ticker % 1024 == 0) {
                this.updateBlockCount();
            }
            var height = (this.y < 160) ? Math.max(this.y - 64, 0) : 256 - this.y;
            var wind = windStrength;
            var wether = World.getWeather();
            if (wether.thunder)
                wind *= 1.25;
            else if (wether.rain)
                wind *= 1.5;
            var output = wind * height * (1 - this.data.blockCount / 405) / 288;
            this.data.output = Math.round(output * 10) / 10;
        }
        src.addAll(this.data.output);
    },
    renderModel: function () {
        TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, this.data.meta);
    },
    destroy: function () {
        BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
    },
});
TileRenderer.setRotationPlaceFunction(BlockID.genWindmill);
var windStrength = 0;
Callback.addCallback("tick", function () {
    if (World.getThreadTime() % 128 != 0) {
        return;
    }
    var upChance = 10;
    var downChance = 10;
    if (windStrength > 20) {
        upChance -= windStrength - 20;
    }
    else if (windStrength < 10) {
        downChance -= 10 - windStrength;
    }
    if (Math.random() * 100 < upChance) {
        windStrength++;
    }
    else if (Math.random() * 100 < downChance) {
        windStrength--;
    }
});
Saver.addSavesScope("windSim", function read(scope) {
    windStrength = scope.strength || randomInt(5, 25);
}, function save() {
    return { strength: windStrength };
});
IDRegistry.genBlockID("genWatermill");
Block.createBlock("genWatermill", [
    { name: "Water Mill", texture: [["machine_bottom", 0], ["machine_top", 0], ["watermill_back", 0], ["watermill_front", 0], ["watermill_left", 0], ["watermill_right", 0]], inCreative: true }
], "machine");
TileRenderer.setStandartModel(BlockID.genWatermill, [["machine_bottom", 0], ["machine_top", 0], ["watermill_back", 0], ["watermill_front", 0], ["watermill_left", 0], ["watermill_right", 0]]);
TileRenderer.registerRotationModel(BlockID.genWatermill, 0, [["machine_bottom", 0], ["machine_top", 0], ["watermill_back", 0], ["watermill_front", 0], ["watermill_left", 0], ["watermill_right", 0]]);
MachineRegistry.setMachineDrop("genWatermill", BlockID.primalGenerator);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.genWatermill, count: 1, data: 0 }, [
        "x x",
        "a#a",
        "xcx"
    ], ['#', BlockID.primalGenerator, -1, 'x', ItemID.plateSteel, 0, 'a', ItemID.casingSteel, 0, 'c', ItemID.coil, 0]);
});
MachineRegistry.registerGenerator(BlockID.genWatermill, {
    defaultValues: {
        meta: 0,
        output: 0
    },
    biomeCheck: function (x, z) {
        var coords = [[x, z], [x - 7, z], [x + 7, z], [x, z - 7], [x, z + 7]];
        for (var c in coords) {
            var biome = World.getBiome(c[0], c[1]);
            if (biome == 0 || biome == 24) {
                return "ocean";
            }
            if (biome == 7) {
                return "river";
            }
        }
        return 0;
    },
    energyTick: function (type, src) {
        if (World.getThreadTime() % 20 == 0) {
            this.data.output = 0;
            var biome = this.biomeCheck(this.x, this.z);
            if (biome && this.y >= 32 && this.y < 64) {
                var output = 50;
                var radius = 1;
                var wether = World.getWeather();
                if (wether.thunder && wether.rain) {
                    if (wether.thunder) {
                        output *= 2;
                    }
                    else {
                        output *= 1.5;
                    }
                }
                else if (biome == "ocean") {
                    output *= 1.5 * Math.sin(World.getWorldTime() % 6000 / (6000 / Math.PI));
                }
                var tile = World.getBlockID(this.x - randomInt(-radius, radius), this.y - randomInt(-radius, radius), this.z - randomInt(-radius, radius));
                if (tile == 8 || tile == 9) {
                    this.data.output = Math.round(output) / 20;
                }
                else {
                    this.data.output = 0;
                }
            }
        }
        src.addAll(this.data.output);
    },
    renderModel: function () {
        TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, this.data.meta);
    },
    destroy: function () {
        BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
    },
});
TileRenderer.setRotationPlaceFunction(BlockID.genWatermill);
IDRegistry.genBlockID("rtGenerator");
Block.createBlock("rtGenerator", [
    { name: "Radioisotope Thermoelectric Generator", texture: [["machine_bottom", 0], ["rt_generator_top", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]], inCreative: true },
], "machine");
TileRenderer.setStandartModel(BlockID.rtGenerator, [["machine_bottom", 0], ["rt_generator_top", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]]);
TileRenderer.registerRenderModel(BlockID.rtGenerator, 0, [["machine_bottom", 0], ["rt_generator_top", 1], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]]);
MachineRegistry.setMachineDrop("rtGenerator", BlockID.primalGenerator);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.rtGenerator, count: 1, data: 0 }, [
        "ccc",
        "c#c",
        "cxc"
    ], ['#', BlockID.reactorChamber, 0, 'x', BlockID.primalGenerator, 0, 'c', ItemID.casingIron, 0]);
});
var guiRTGenerator = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Radioisotope Thermoelectric Generator") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 630, y: 150, bitmap: "energy_bar_background", scale: GUI_SCALE },
    ],
    elements: {
        "slot0": { type: "slot", x: 420, y: 120, isValid: function (id) { return id == ItemID.rtgPellet; } },
        "slot1": { type: "slot", x: 480, y: 120, isValid: function (id) { return id == ItemID.rtgPellet; } },
        "slot2": { type: "slot", x: 540, y: 120, isValid: function (id) { return id == ItemID.rtgPellet; } },
        "slot3": { type: "slot", x: 420, y: 180, isValid: function (id) { return id == ItemID.rtgPellet; } },
        "slot4": { type: "slot", x: 480, y: 180, isValid: function (id) { return id == ItemID.rtgPellet; } },
        "slot5": { type: "slot", x: 540, y: 180, isValid: function (id) { return id == ItemID.rtgPellet; } },
        "energyScale": { type: "scale", x: 630 + GUI_SCALE * 4, y: 150, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE },
        "textInfo1": { type: "text", x: 742, y: 148, width: 300, height: 30, text: "0/" },
        "textInfo2": { type: "text", x: 742, y: 178, width: 300, height: 30, text: "10000" }
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiRTGenerator, "Radioisotope Thermoelectric Generator");
});
MachineRegistry.registerGenerator(BlockID.rtGenerator, {
    defaultValues: {
        meta: 0,
        isActive: false
    },
    getGuiScreen: function () {
        return guiRTGenerator;
    },
    tick: function () {
        var energyStorage = this.getEnergyStorage();
        var output = 0.5;
        for (var i = 0; i < 6; i++) {
            var slot = this.container.getSlot("slot" + i);
            if (slot.id == ItemID.rtgPellet) {
                output *= 2;
            }
        }
        output = parseInt(output);
        this.setActive(output > 0);
        this.data.energy = Math.min(this.data.energy + output, energyStorage);
        this.container.setScale("energyScale", this.data.energy / energyStorage);
        this.container.setText("textInfo1", this.data.energy + "/");
    },
    getEnergyStorage: function () {
        return 10000;
    },
    energyTick: function (type, src) {
        var output = Math.min(32, this.data.energy);
        this.data.energy += src.add(output) - output;
    },
    renderModel: MachineRegistry.renderModel
});
IDRegistry.genBlockID("stirlingGenerator");
Block.createBlock("stirlingGenerator", [
    { name: "Stirling Generator", texture: [["machine_bottom", 0], ["machine_top", 0], ["stirling_generator", 0], ["heat_pipe", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true }
], "machine");
TileRenderer.setStandartModel(BlockID.stirlingGenerator, [["machine_bottom", 0], ["machine_top", 0], ["stirling_generator", 0], ["heat_pipe", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.stirlingGenerator, 0, [["machine_bottom", 0], ["machine_top", 0], ["stirling_generator", 0], ["heat_pipe", 0], ["machine_side", 0], ["machine_side", 0]]);
MachineRegistry.setMachineDrop("stirlingGenerator", BlockID.primalGenerator);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.stirlingGenerator, count: 1, data: 0 }, [
        "cxc",
        "c#c",
        "ccc"
    ], ['#', BlockID.primalGenerator, 0, 'c', ItemID.casingIron, 0, 'x', ItemID.heatConductor, 0]);
});
MachineRegistry.registerGenerator(BlockID.stirlingGenerator, {
    defaultValues: {
        meta: 0,
        heat: 0
    },
    wrenchClick: function (id, count, data, coords) {
        this.setFacing(coords.side);
    },
    setFacing: MachineRegistry.setFacing,
    canReceiveHeat: function (side) {
        return this.data.meta == side;
    },
    heatReceive: function (amount) {
        if (this.data.energy == 0) {
            this.data.energy = Math.round(amount / 2);
            return amount;
        }
        return 0;
    },
    energyTick: function (type, src) {
        if (src.add(this.data.energy) < this.data.energy) {
            this.data.energy = 0;
        }
    },
    renderModel: function () {
        TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, this.data.meta);
    }
});
TileRenderer.setRotationPlaceFunction(BlockID.stirlingGenerator, true);
IDRegistry.genBlockID("solidHeatGenerator");
Block.createBlock("solidHeatGenerator", [
    { name: "Solid Fuel Firebox", texture: [["machine_bottom", 0], ["machine_top", 0], ["generator", 0], ["heat_pipe", 0], ["heat_generator_side", 0], ["heat_generator_side", 0]], inCreative: true },
], "machine");
TileRenderer.setStandartModel(BlockID.solidHeatGenerator, [["machine_bottom", 0], ["machine_top", 0], ["generator", 0], ["heat_pipe", 0], ["heat_generator_side", 0], ["heat_generator_side", 0]]);
TileRenderer.registerRenderModel(BlockID.solidHeatGenerator, 0, [["heat_pipe", 0], ["generator", 0], ["machine_bottom", 0], ["machine_top", 0], ["heat_generator_side", 2], ["heat_generator_side", 2]]);
TileRenderer.registerRenderModel(BlockID.solidHeatGenerator, 1, [["generator", 0], ["heat_pipe", 0], ["machine_top", 0], ["machine_bottom", 0], ["heat_generator_side", 2], ["heat_generator_side", 2]]);
TileRenderer.registerRotationModel(BlockID.solidHeatGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["generator", 0], ["heat_pipe", 0], ["heat_generator_side", 0], ["heat_generator_side", 0]]);
TileRenderer.registerRenderModel(BlockID.solidHeatGenerator, 6, [["heat_pipe", 1], ["generator", 0], ["machine_bottom", 0], ["machine_top", 0], ["heat_generator_side", 3], ["heat_generator_side", 3]]);
TileRenderer.registerRenderModel(BlockID.solidHeatGenerator, 7, [["generator", 0], ["heat_pipe", 1], ["machine_top", 0], ["machine_bottom", 0], ["heat_generator_side", 3], ["heat_generator_side", 3]]);
TileRenderer.registerRotationModel(BlockID.solidHeatGenerator, 8, [["machine_bottom", 0], ["machine_top", 0], ["generator", 1], ["heat_pipe", 1], ["heat_generator_side", 1], ["heat_generator_side", 1]]);
MachineRegistry.setMachineDrop("solidHeatGenerator");
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.solidHeatGenerator, count: 1, data: 0 }, [
        "a",
        "x",
        "f"
    ], ['a', ItemID.heatConductor, 0, 'x', BlockID.machineBlockBasic, 0, 'f', 61, -1]);
    Recipes.addShaped({ id: BlockID.solidHeatGenerator, count: 1, data: 0 }, [
        " a ",
        "ppp",
        " f "
    ], ['a', ItemID.heatConductor, 0, 'p', ItemID.plateIron, 0, 'f', BlockID.ironFurnace, 0]);
});
var guiSolidHeatGenerator = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Solid Fuel Firebox") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 450, y: 160, bitmap: "fire_background", scale: GUI_SCALE },
        { type: "bitmap", x: 521, y: 212, bitmap: "shovel_image", scale: GUI_SCALE + 1 },
        { type: "bitmap", x: 441, y: 330, bitmap: "heat_generator_info", scale: GUI_SCALE }
    ],
    elements: {
        "slotFuel": { type: "slot", x: 441, y: 212, isValid: function (id, count, data) {
                return Recipes.getFuelBurnDuration(id, data) > 0;
            } },
        "slotAshes": { type: "slot", x: 591, y: 212, isValid: function () { return false; } },
        "burningScale": { type: "scale", x: 450, y: 160, direction: 1, value: 0.5, bitmap: "fire_scale", scale: GUI_SCALE },
        "textInfo1": { type: "text", font: { size: 24, color: Color.parseColor("#57c4da") }, x: 500, y: 344, width: 300, height: 30, text: "0    /" },
        "textInfo2": { type: "text", font: { size: 24, color: Color.parseColor("#57c4da") }, x: 600, y: 344, width: 300, height: 30, text: "20" }
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiSolidHeatGenerator, "Solid Fuel Firebox");
});
MachineRegistry.registerPrototype(BlockID.solidHeatGenerator, {
    defaultValues: {
        meta: 0,
        burn: 0,
        burnMax: 0,
        output: 0,
        isActive: false
    },
    getGuiScreen: function () {
        return guiSolidHeatGenerator;
    },
    wrenchClick: function (id, count, data, coords) {
        this.setFacing(coords.side);
    },
    setFacing: MachineRegistry.setFacing,
    getFuel: function (fuelSlot) {
        if (fuelSlot.id > 0) {
            var burn = Recipes.getFuelBurnDuration(fuelSlot.id, fuelSlot.data);
            if (burn && !LiquidRegistry.getItemLiquid(fuelSlot.id, fuelSlot.data)) {
                return burn;
            }
        }
        return 0;
    },
    spreadHeat: function () {
        var side = this.data.meta;
        var coords = StorageInterface.getRelativeCoords(this, side);
        var TE = World.getTileEntity(coords.x, coords.y, coords.z);
        if (TE && TE.canReceiveHeat && TE.canReceiveHeat(side ^ 1)) {
            return this.data.output = TE.heatReceive(20);
        }
        return false;
    },
    tick: function () {
        StorageInterface.checkHoppers(this);
        this.data.output = 0;
        var slot = this.container.getSlot("slotAshes");
        if (this.data.burn <= 0) {
            var fuelSlot = this.container.getSlot("slotFuel");
            var burn = this.getFuel(fuelSlot) / 4;
            if (burn && ((slot.id == ItemID.ashes && slot.count < 64) || slot.id == 0) && this.spreadHeat()) {
                this.activate();
                this.data.burnMax = burn;
                this.data.burn = burn - 1;
                fuelSlot.count--;
                this.container.validateSlot("slotFuel");
            }
            else {
                this.deactivate();
            }
        }
        else {
            this.data.burn--;
            if (this.data.burn == 0 && Math.random() < 0.5) {
                slot.id = ItemID.ashes;
                slot.count++;
            }
            this.spreadHeat();
        }
        var outputText = this.data.output.toString();
        for (var i = outputText.length; i < 6; i++) {
            outputText += " ";
        }
        this.container.setText("textInfo1", outputText + "/");
        this.container.setScale("burningScale", this.data.burn / this.data.burnMax || 0);
    },
    renderModel: MachineRegistry.renderModelWith6Variations,
});
TileRenderer.setRotationPlaceFunction(BlockID.solidHeatGenerator, true);
StorageInterface.createInterface(BlockID.solidHeatGenerator, {
    slots: {
        "slotFuel": { input: true },
        "slotAshes": { output: true }
    },
    isValidInput: function (item) {
        return Recipes.getFuelBurnDuration(item.id, item.data) > 0;
    }
});
IDRegistry.genBlockID("fluidHeatGenerator");
Block.createBlock("fluidHeatGenerator", [
    { name: "Liquid Fuel Firebox", texture: [["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_back", 0], ["heat_pipe", 0], ["fluid_heat_generator_side", 0], ["fluid_heat_generator_side", 0]], inCreative: true },
], "machine");
TileRenderer.setStandartModel(BlockID.fluidHeatGenerator, [["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_back", 0], ["heat_pipe", 0], ["fluid_heat_generator_side", 0], ["fluid_heat_generator_side", 0]]);
TileRenderer.registerRenderModel(BlockID.fluidHeatGenerator, 0, [["heat_pipe", 0], ["fluid_heat_generator_back", 0], ["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_side", 2], ["fluid_heat_generator_side", 2]]);
TileRenderer.registerRenderModel(BlockID.fluidHeatGenerator, 1, [["fluid_heat_generator_back", 0], ["heat_pipe", 0], ["machine_top", 0], ["machine_bottom", 0], ["fluid_heat_generator_side", 2], ["fluid_heat_generator_side", 2]]);
TileRenderer.registerRotationModel(BlockID.fluidHeatGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_back", 0], ["heat_pipe", 0], ["fluid_heat_generator_side", 0], ["fluid_heat_generator_side", 0]]);
TileRenderer.registerRenderModel(BlockID.fluidHeatGenerator, 6, [["heat_pipe", 1], ["fluid_heat_generator_back", 0], ["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_side", 3], ["fluid_heat_generator_side", 3]]);
TileRenderer.registerRenderModel(BlockID.fluidHeatGenerator, 7, [["fluid_heat_generator_back", 0], ["heat_pipe", 1], ["machine_top", 0], ["machine_bottom", 0], ["fluid_heat_generator_side", 3], ["fluid_heat_generator_side", 3]]);
TileRenderer.registerRotationModel(BlockID.fluidHeatGenerator, 8, [["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_back", 1], ["heat_pipe", 1], ["fluid_heat_generator_side", 1], ["fluid_heat_generator_side", 1]]);
MachineRegistry.setMachineDrop("fluidHeatGenerator");
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.fluidHeatGenerator, count: 1, data: 0 }, [
        "pcp",
        "cxc",
        "pcp"
    ], ['x', ItemID.heatConductor, 0, 'c', ItemID.cellEmpty, 0, 'p', ItemID.casingIron, 0]);
});
var guiFluidHeatGenerator = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Liquid Fuel Firebox") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 581, y: 75, bitmap: "liquid_bar", scale: GUI_SCALE },
        { type: "bitmap", x: 459, y: 139, bitmap: "liquid_bar_arrow", scale: GUI_SCALE },
        { type: "bitmap", x: 660, y: 102, bitmap: "fluid_heat_generator_info", scale: GUI_SCALE },
        { type: "bitmap", x: 660, y: 176, bitmap: "fluid_heat_generator_info", scale: GUI_SCALE }
    ],
    elements: {
        "liquidScale": { type: "scale", x: 581 + 4 * GUI_SCALE, y: 75 + 4 * GUI_SCALE, direction: 1, value: 0.5, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE },
        "slot1": { type: "slot", x: 440, y: 75, isValid: function (id, count, data) {
                var empty = LiquidLib.getEmptyItem(id, data);
                if (!empty)
                    return false;
                return MachineRecipeRegistry.hasRecipeFor("fluidFuel", empty.liquid);
            }
        },
        "slot2": { type: "slot", x: 440, y: 183, isValid: function () { return false; } },
        "textInfo1": { type: "text", font: { size: 24, color: Color.parseColor("#57c4da") }, x: 670, y: 112, width: 300, height: 30, text: "Emit: 0" },
        "textInfo2": { type: "text", font: { size: 24, color: Color.parseColor("#57c4da") }, x: 670, y: 186, width: 300, height: 30, text: "Max Emit: 0" }
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiFluidHeatGenerator, "Liquid Fuel Firebox");
});
MachineRegistry.registerPrototype(BlockID.fluidHeatGenerator, {
    defaultValues: {
        meta: 0,
        output: 0,
        fuel: 0,
        liquid: null,
        isActive: false
    },
    getGuiScreen: function () {
        return guiFluidHeatGenerator;
    },
    setFacing: MachineRegistry.setFacing,
    init: function () {
        this.liquidStorage.setLimit(null, 10);
        this.renderModel();
    },
    getLiquidFromItem: MachineRegistry.getLiquidFromItem,
    click: function (id, count, data, coords) {
        var liquid = this.liquidStorage.getLiquidStored();
        if (Entity.getSneaking(player) && this.getLiquidFromItem(liquid, { id: id, count: count, data: data }, null, true)) {
            return true;
        }
        if (ICTool.isValidWrench(id, data, 10)) {
            if (this.setFacing(coords.side))
                ICTool.useWrench(id, data, 10);
            return true;
        }
        return false;
    },
    tick: function () {
        StorageInterface.checkHoppers(this);
        var liquid = this.liquidStorage.getLiquidStored();
        var slot1 = this.container.getSlot("slot1");
        var slot2 = this.container.getSlot("slot2");
        this.getLiquidFromItem(liquid, slot1, slot2);
        var fuel = MachineRecipeRegistry.getRecipeResult("fluidFuel", this.data.liquid || liquid);
        if (fuel && this.data.fuel <= 0 && this.liquidStorage.getAmount(liquid).toFixed(3) >= fuel.amount / 1000 && this.spreadHeat(fuel.power * 2)) {
            this.liquidStorage.getLiquid(liquid, fuel.amount / 1000);
            this.data.fuel = fuel.amount;
            this.data.liquid = liquid;
        }
        if (fuel && this.data.fuel > 0) {
            if (this.data.fuel < fuel.amount) {
                this.spreadHeat(fuel.power * 2);
            }
            this.data.fuel -= fuel.amount / 20;
            this.activate();
            this.container.setText("textInfo2", "Max Emit: " + fuel.power * 2);
            this.startPlaySound();
        }
        else {
            this.data.liquid = null;
            this.stopPlaySound();
            this.deactivate();
            this.container.setText("textInfo1", "Emit: 0");
            this.container.setText("textInfo2", "Max Emit: 0");
        }
        this.liquidStorage.updateUiScale("liquidScale", liquid);
    },
    getOperationSound: function () {
        return "GeothermalLoop.ogg";
    },
    getEnergyStorage: function () {
        return 10000;
    },
    spreadHeat: function (heat) {
        var side = this.data.meta;
        var coords = StorageInterface.getRelativeCoords(this, side);
        var TE = World.getTileEntity(coords.x, coords.y, coords.z);
        if (TE && TE.canReceiveHeat && TE.canReceiveHeat(side ^ 1)) {
            var output = TE.heatReceive(heat);
            this.container.setText("textInfo1", "Emit: " + output);
            return output;
        }
        return false;
    },
    renderModel: MachineRegistry.renderModelWith6Variations
});
TileRenderer.setRotationPlaceFunction(BlockID.fluidHeatGenerator, true);
StorageInterface.createInterface(BlockID.fluidHeatGenerator, {
    slots: {
        "slot1": { input: true },
        "slot2": { output: true }
    },
    isValidInput: function (item) {
        var empty = LiquidLib.getEmptyItem(item.id, item.data);
        if (!empty)
            return false;
        return MachineRecipeRegistry.hasRecipeFor("fluidFuel", empty.liquid);
    },
    canReceiveLiquid: function (liquid, side) {
        return MachineRecipeRegistry.hasRecipeFor("fluidFuel", liquid);
    },
    canTransportLiquid: function (liquid, side) { return false; }
});
IDRegistry.genBlockID("electricHeatGenerator");
Block.createBlock("electricHeatGenerator", [
    { name: "Electric Heater", texture: [["machine_bottom", 0], ["ind_furnace_side", 0], ["heat_generator_side", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], inCreative: true },
], "machine");
TileRenderer.setStandartModel(BlockID.electricHeatGenerator, [["machine_bottom", 0], ["ind_furnace_side", 0], ["heat_generator_side", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.electricHeatGenerator, 0, [["machine_bottom", 0], ["ind_furnace_side", 0], ["heat_generator_side", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.electricHeatGenerator, 6, [["machine_bottom", 0], ["ind_furnace_side", 1], ["heat_generator_side", 1], ["heat_pipe", 1], ["ind_furnace_side", 1], ["ind_furnace_side", 1]]);
ItemName.addTierTooltip("electricHeatGenerator", 4);
MachineRegistry.setMachineDrop("electricHeatGenerator");
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.electricHeatGenerator, count: 1, data: 0 }, [
        "xbx",
        "x#x",
        "xax"
    ], ['#', ItemID.circuitBasic, 0, 'x', ItemID.casingIron, 0, 'a', ItemID.heatConductor, 0, 'b', ItemID.storageBattery, -1]);
});
var guiElectricHeatGenerator = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Electric Heater") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 342, y: 110, bitmap: "energy_small_background", scale: GUI_SCALE },
        { type: "bitmap", x: 461, y: 250, bitmap: "heat_generator_info", scale: GUI_SCALE }
    ],
    elements: {
        "slot0": { type: "slot", x: 440, y: 120, maxStackSize: 1, isValid: function (id) { return id == ItemID.coil; } },
        "slot1": { type: "slot", x: 500, y: 120, maxStackSize: 1, isValid: function (id) { return id == ItemID.coil; } },
        "slot2": { type: "slot", x: 560, y: 120, maxStackSize: 1, isValid: function (id) { return id == ItemID.coil; } },
        "slot3": { type: "slot", x: 620, y: 120, maxStackSize: 1, isValid: function (id) { return id == ItemID.coil; } },
        "slot4": { type: "slot", x: 680, y: 120, maxStackSize: 1, isValid: function (id) { return id == ItemID.coil; } },
        "slot5": { type: "slot", x: 440, y: 180, maxStackSize: 1, isValid: function (id) { return id == ItemID.coil; } },
        "slot6": { type: "slot", x: 500, y: 180, maxStackSize: 1, isValid: function (id) { return id == ItemID.coil; } },
        "slot7": { type: "slot", x: 560, y: 180, maxStackSize: 1, isValid: function (id) { return id == ItemID.coil; } },
        "slot8": { type: "slot", x: 620, y: 180, maxStackSize: 1, isValid: function (id) { return id == ItemID.coil; } },
        "slot9": { type: "slot", x: 680, y: 180, maxStackSize: 1, isValid: function (id) { return id == ItemID.coil; } },
        "slotEnergy": { type: "slot", x: 340, y: 180, isValid: MachineRegistry.isValidEUStorage },
        "energyScale": { type: "scale", x: 342, y: 110, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE },
        "textInfo1": { type: "text", font: { size: 24, color: Color.parseColor("#57c4da") }, x: 530, y: 264, width: 300, height: 30, text: "0    /" },
        "textInfo2": { type: "text", font: { size: 24, color: Color.parseColor("#57c4da") }, x: 630, y: 264, width: 300, height: 30, text: "0" }
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiElectricHeatGenerator, "Electric Heater");
});
MachineRegistry.registerElectricMachine(BlockID.electricHeatGenerator, {
    defaultValues: {
        meta: 0,
        isActive: false
    },
    getGuiScreen: function () {
        return guiElectricHeatGenerator;
    },
    getTier: function () {
        return 4;
    },
    wrenchClick: function (id, count, data, coords) {
        this.setFacing(coords.side);
    },
    setFacing: MachineRegistry.setFacing,
    calcOutput: function () {
        var maxOutput = 0;
        for (var i = 0; i < 10; i++) {
            var slot = this.container.getSlot("slot" + i);
            if (slot.id == ItemID.coil) {
                maxOutput += 10;
            }
        }
        return maxOutput;
    },
    tick: function () {
        var maxOutput = this.calcOutput();
        var output = 0;
        if (this.data.energy >= 1) {
            var side = this.data.meta;
            var coords = StorageInterface.getRelativeCoords(this, side);
            var TE = World.getTileEntity(coords.x, coords.y, coords.z);
            if (TE && TE.canReceiveHeat && TE.canReceiveHeat(side ^ 1)) {
                output = TE.heatReceive(Math.min(maxOutput, this.data.energy));
                if (output > 0) {
                    this.activate();
                    this.data.energy -= output;
                    var outputText = output.toString();
                    for (var i = outputText.length; i < 6; i++) {
                        outputText += " ";
                    }
                    this.container.setText("textInfo1", outputText + "/");
                }
            }
        }
        if (output == 0) {
            this.deactivate();
            this.container.setText("textInfo1", "0     /");
        }
        var energyStorage = this.getEnergyStorage();
        this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, 4);
        this.container.setScale("energyScale", this.data.energy / energyStorage);
        this.container.setText("textInfo2", maxOutput);
    },
    getEnergyStorage: function () {
        return 2000;
    },
    renderModel: MachineRegistry.renderModelWith6Variations
});
TileRenderer.setRotationPlaceFunction(BlockID.electricHeatGenerator, true);
IDRegistry.genBlockID("rtHeatGenerator");
Block.createBlock("rtHeatGenerator", [
    { name: "Radioisotope Heat Generator", texture: [["machine_bottom", 0], ["rt_heat_generator_top", 0], ["rt_generator_side", 0], ["heat_pipe", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]], inCreative: true },
], "machine");
TileRenderer.setStandartModel(BlockID.rtHeatGenerator, [["machine_bottom", 0], ["rt_heat_generator_top", 0], ["rt_generator_side", 0], ["heat_pipe", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.rtHeatGenerator, 0, [["machine_bottom", 0], ["rt_heat_generator_top", 0], ["rt_generator_side", 0], ["heat_pipe", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.rtHeatGenerator, 6, [["machine_bottom", 0], ["rt_heat_generator_top", 1], ["rt_generator_side", 0], ["heat_pipe", 1], ["rt_generator_side", 0], ["rt_generator_side", 0]]);
MachineRegistry.setMachineDrop("rtHeatGenerator");
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.rtHeatGenerator, count: 1, data: 0 }, [
        "ccc",
        "c#c",
        "cxc"
    ], ['#', BlockID.reactorChamber, 0, 'x', ItemID.heatConductor, 0, 'c', ItemID.casingIron, 0]);
});
var guiRTHeatGenerator = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Radioisotope Heat Generator") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 380, y: 250, bitmap: "heat_generator_info", scale: GUI_SCALE }
    ],
    elements: {
        "slot0": { type: "slot", x: 420, y: 100, isValid: function (id) { return id == ItemID.rtgPellet; } },
        "slot1": { type: "slot", x: 480, y: 100, isValid: function (id) { return id == ItemID.rtgPellet; } },
        "slot2": { type: "slot", x: 540, y: 100, isValid: function (id) { return id == ItemID.rtgPellet; } },
        "slot3": { type: "slot", x: 420, y: 160, isValid: function (id) { return id == ItemID.rtgPellet; } },
        "slot4": { type: "slot", x: 480, y: 160, isValid: function (id) { return id == ItemID.rtgPellet; } },
        "slot5": { type: "slot", x: 540, y: 160, isValid: function (id) { return id == ItemID.rtgPellet; } },
        "textInfo1": { type: "text", font: { size: 24, color: Color.parseColor("#57c4da") }, x: 450, y: 264, width: 300, height: 30, text: "0     /" },
        "textInfo2": { type: "text", font: { size: 24, color: Color.parseColor("#57c4da") }, x: 550, y: 264, width: 300, height: 30, text: "0" }
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiRTHeatGenerator, "Radioisotope Heat Generator");
});
MachineRegistry.registerGenerator(BlockID.rtHeatGenerator, {
    defaultValues: {
        meta: 0,
        isActive: false
    },
    getGuiScreen: function () {
        return guiRTHeatGenerator;
    },
    wrenchClick: function (id, count, data, coords) {
        this.setFacing(coords.side);
    },
    setFacing: MachineRegistry.setFacing,
    tick: function () {
        var output = 1;
        for (var i = 0; i < 6; i++) {
            var slot = this.container.getSlot("slot" + i);
            if (slot.id == ItemID.rtgPellet) {
                output *= 2;
            }
        }
        if (output < 2)
            output = 0;
        var maxOutput = output;
        if (output > 0) {
            var side = this.data.meta;
            var coords = StorageInterface.getRelativeCoords(this, side);
            var TE = World.getTileEntity(coords.x, coords.y, coords.z);
            if (TE && TE.canReceiveHeat && TE.canReceiveHeat(side ^ 1)) {
                output = TE.heatReceive(output);
            }
        }
        this.setActive(output > 0);
        var outputText = output.toString();
        for (var i = outputText.length; i < 6; i++) {
            outputText += " ";
        }
        this.container.setText("textInfo1", outputText + "/");
        this.container.setText("textInfo2", maxOutput);
    },
    renderModel: MachineRegistry.renderModelWith6Variations
});
TileRenderer.setRotationPlaceFunction(BlockID.rtHeatGenerator, true);
var ReactorAPI = {
    reactor_components: {},
    registerComponent: function (id, component) {
        if (component.maxDamage) {
            Item.setMaxDamage(id, 27);
        }
        if (component.getMaxHeat() > 0) {
            Item.addToCreative(id, 1, 1);
        }
        this.reactor_components[id] = component;
    },
    getComponent: function (id) {
        return this.reactor_components[id];
    },
    isReactorItem: function (id) {
        return this.getComponent(id) ? true : false;
    },
    reactorComponent: function () {
        this.processChamber = function (item, reactor, x, y, heatRun) { },
            this.acceptUraniumPulse = function (item, reactor, pulsingItem, youX, youY, pulseX, pulseY, heatrun) {
                return false;
            },
            this.canStoreHeat = function (item) {
                return false;
            },
            this.getMaxHeat = function (item) {
                return 0;
            },
            this.getCurrentHeat = function (item) {
                return 0;
            },
            this.alterHeat = function (item, reactor, x, y, heat) {
                return heat;
            },
            this.influenceExplosion = function (item, reactor) {
                return 0;
            };
    },
    damageableReactorComponent: function (durability) {
        this.parent = ReactorAPI.reactorComponent;
        this.parent();
        this.maxDamage = durability;
        this.getCustomDamage = function (item) {
            return item.extra ? item.extra.getInt("damage") : 0;
        };
        this.setCustomDamage = function (item, damage) {
            if (!item.extra)
                item.extra = new ItemExtraData();
            item.extra.putInt("damage", damage);
            item.data = 1 + Math.ceil(damage / this.maxDamage * 26);
        };
        this.applyCustomDamage = function (item, damage) {
            this.setCustomDamage(item, this.getCustomDamage(item) + damage);
        };
    },
    fuelRod: function (cells, durability, depleted) {
        this.parent = ReactorAPI.damageableReactorComponent;
        this.parent(durability);
        this.numberOfCells = cells;
        this.depletedItem = depleted;
        this.processChamber = function (item, reactor, x, y, heatRun) {
            var basePulses = parseInt(1 + this.numberOfCells / 2);
            for (var i_10 = 0; i_10 < this.numberOfCells; i_10++) {
                var dheat = 0;
                var pulses = basePulses;
                if (!heatRun) {
                    for (var i_11 = 0; i_11 < pulses; i_11++) {
                        this.acceptUraniumPulse(item, reactor, item, x, y, x, y, heatRun);
                    }
                    pulses += this.checkPulseable(reactor, x - 1, y, item, x, y, heatRun) + this.checkPulseable(reactor, x + 1, y, item, x, y, heatRun) + this.checkPulseable(reactor, x, y - 1, item, x, y, heatRun) + this.checkPulseable(reactor, x, y + 1, item, x, y, heatRun);
                    continue;
                }
                pulses += this.checkPulseable(reactor, x - 1, y, item, x, y, heatRun) + this.checkPulseable(reactor, x + 1, y, item, x, y, heatRun) + this.checkPulseable(reactor, x, y - 1, item, x, y, heatRun) + this.checkPulseable(reactor, x, y + 1, item, x, y, heatRun);
                var heat = this.triangularNumber(pulses) * 4;
                var heatAcceptors = [];
                this.checkHeatAcceptor(reactor, x - 1, y, heatAcceptors);
                this.checkHeatAcceptor(reactor, x + 1, y, heatAcceptors);
                this.checkHeatAcceptor(reactor, x, y - 1, heatAcceptors);
                this.checkHeatAcceptor(reactor, x, y + 1, heatAcceptors);
                heat = this.getFinalHeat(item, reactor, x, y, heat);
                for (var j = 0; j < heatAcceptors.length; j++) {
                    heat += dheat;
                    if (heat <= 0)
                        break;
                    dheat = heat / (heatAcceptors.length - j);
                    heat -= dheat;
                    var acceptor = heatAcceptors[j];
                    dheat = acceptor.comp.alterHeat(acceptor.item, reactor, acceptor.x, acceptor.y, dheat);
                }
                if (heat <= 0)
                    continue;
                reactor.addHeat(heat);
            }
            if (!heatRun && this.getCustomDamage(item) + 1 >= this.maxDamage) {
                reactor.setItemAt(x, y, this.depletedItem, 1);
            }
            else if (!heatRun) {
                this.applyCustomDamage(item, 1);
            }
        };
        this.checkPulseable = function (reactor, x, y, slot, mex, mey, heatrun) {
            var item = reactor.getItemAt(x, y);
            if (item) {
                var component = ReactorAPI.getComponent(item.id);
                if (component && component.acceptUraniumPulse(item, reactor, slot, x, y, mex, mey, heatrun)) {
                    return 1;
                }
            }
            return 0;
        };
        this.triangularNumber = function (x) {
            return (x * x + x) / 2;
        };
        this.checkHeatAcceptor = function (reactor, x, y, heatAcceptors) {
            var item = reactor.getItemAt(x, y);
            if (item) {
                var component = ReactorAPI.getComponent(item.id);
                if (component && component.canStoreHeat(item)) {
                    var acceptor = { comp: component, item: item, x: x, y: y };
                    heatAcceptors.push(acceptor);
                }
            }
        };
        this.acceptUraniumPulse = function (item, reactor, pulsingItem, youX, youY, pulseX, pulseY, heatrun) {
            if (!heatrun) {
                reactor.addOutput(1);
            }
            return true;
        };
        this.getFinalHeat = function (item, reactor, x, y, heat) {
            return heat;
        };
        this.influenceExplosion = function (item, reactor) {
            return 2 * this.numberOfCells;
        };
    },
    fuelRodMOX: function (cells, durability, depleted) {
        this.parent = ReactorAPI.fuelRod;
        this.parent(cells, durability, depleted);
        this.acceptUraniumPulse = function (item, reactor, pulsingItem, youX, youY, pulseX, pulseY, heatrun) {
            if (!heatrun) {
                var breedereffectiveness = reactor.getHeat() / reactor.getMaxHeat();
                var output = 4 * breedereffectiveness + 1;
                reactor.addOutput(output);
            }
            return true;
        };
        /*
        this.getFinalHeat = function(item, reactor, x, y, heat) {
            let breedereffectiveness;
            if (reactor.isFluidCooled() && (breedereffectiveness = reactor.getHeat() / reactor.getMaxHeat()) > 0.5) {
                heat *= 2;
            }
            return heat;
        }
        */
    },
    plating: function (maxHeatAdd, effectModifier) {
        this.parent = ReactorAPI.reactorComponent;
        this.parent();
        this.maxHeatAdd = maxHeatAdd;
        this.effectModifier = effectModifier;
        this.processChamber = function (item, reactor, x, y, heatrun) {
            if (heatrun) {
                reactor.setMaxHeat(reactor.getMaxHeat() + this.maxHeatAdd);
                reactor.setHeatEffectModifier(reactor.getHeatEffectModifier() * this.effectModifier);
            }
        };
        this.influenceExplosion = function (item, reactor) {
            if (this.effectModifier >= 1) {
                return 0;
            }
            return this.effectModifier;
        };
    },
    reflector: function (maxDamage) {
        this.parent = ReactorAPI.damageableReactorComponent;
        this.parent(maxDamage);
        this.acceptUraniumPulse = function (item, reactor, pulsingItem, youX, youY, pulseX, pulseY, heatrun) {
            if (!heatrun) {
                var source = ReactorAPI.getComponent(pulsingItem.id);
                source.acceptUraniumPulse(pulsingItem, reactor, item, pulseX, pulseY, youX, youY, heatrun);
            }
            else if (this.getCustomDamage + 1 >= this.maxDamage) {
                reactor.setItemAt(youX, youY, 0);
            }
            else {
                this.applyCustomDamage(item, 1);
            }
            return true;
        };
        this.influenceExplosion = function (item, reactor) {
            return -1;
        };
    },
    reflectorIridium: function () {
        this.parent = ReactorAPI.reactorComponent;
        this.parent();
        this.acceptUraniumPulse = function (item, reactor, pulsingItem, youX, youY, pulseX, pulseY, heatrun) {
            if (!heatrun) {
                var source = ReactorAPI.getComponent(pulsingItem.id);
                source.acceptUraniumPulse(pulsingItem, reactor, item, pulseX, pulseY, youX, youY, heatrun);
            }
            return true;
        };
        this.influenceExplosion = function (item, reactor) {
            return -1;
        };
    },
    heatStorage: function (heatStorage) {
        this.parent = ReactorAPI.damageableReactorComponent;
        this.parent(heatStorage);
        this.canStoreHeat = function (item) {
            return true;
        };
        this.getMaxHeat = function (item) {
            return this.maxDamage;
        };
        this.getCurrentHeat = function (item) {
            return this.getCustomDamage(item);
        };
        this.alterHeat = function (item, reactor, x, y, heat) {
            var myHeat = this.getCurrentHeat(item);
            var max = this.getMaxHeat(item);
            if ((myHeat += heat) > max) {
                reactor.setItemAt(x, y, 0);
                heat = max - myHeat + 1;
            }
            else {
                if (myHeat < 0) {
                    heat = myHeat;
                    myHeat = 0;
                }
                else {
                    heat = 0;
                }
                this.setCustomDamage(item, myHeat);
            }
            return heat;
        };
    },
    heatExchanger: function (heatStorage, switchSide, switchReactor) {
        this.parent = ReactorAPI.heatStorage;
        this.parent(heatStorage);
        this.switchSide = switchSide;
        this.switchReactor = switchReactor;
        this.processChamber = function (item, reactor, x, y, heatrun) {
            if (!heatrun) {
                return;
            }
            var myHeat = 0;
            var heatAcceptors = [];
            if (this.switchSide > 0) {
                this.checkHeatAcceptor(reactor, x - 1, y, heatAcceptors);
                this.checkHeatAcceptor(reactor, x + 1, y, heatAcceptors);
                this.checkHeatAcceptor(reactor, x, y - 1, heatAcceptors);
                this.checkHeatAcceptor(reactor, x, y + 1, heatAcceptors);
                for (var i_12 in heatAcceptors) {
                    var acceptor = heatAcceptors[i_12];
                    var heatable = acceptor.comp;
                    var mymed = this.getCurrentHeat(item) * 100 / this.getMaxHeat(item);
                    var heatablemed = heatable.getCurrentHeat(acceptor.item) * 100 / heatable.getMaxHeat(acceptor.item);
                    var add = parseInt(heatable.getMaxHeat(acceptor.item) / 100 * (heatablemed + mymed / 2));
                    if (add > this.switchSide) {
                        add = this.switchSide;
                    }
                    if (heatablemed + mymed / 2 < 1) {
                        add = this.switchSide / 2;
                    }
                    if (heatablemed + mymed / 2 < 0.75) {
                        add = this.switchSide / 4;
                    }
                    if (heatablemed + mymed / 2 < 0.5) {
                        add = this.switchSide / 8;
                    }
                    if (heatablemed + mymed / 2 < 0.25) {
                        add = 1;
                    }
                    if (Math.round(heatablemed * 10) / 10 > Math.round(mymed * 10) / 10) {
                        add -= 2 * add;
                    }
                    else if (Math.round(heatablemed * 10) / 10 == Math.round(mymed * 10) / 10) {
                        add = 0;
                    }
                    myHeat -= add;
                    add = heatable.alterHeat(acceptor.item, reactor, acceptor.x, acceptor.y, add);
                    myHeat += add;
                }
            }
            if (this.switchReactor > 0) {
                var mymed = this.getCurrentHeat(item, reactor, x, y) * 100 / this.getMaxHeat(item);
                var Reactormed = reactor.getHeat() * 100 / reactor.getMaxHeat();
                var add = Math.round(reactor.getMaxHeat() / 100 * (Reactormed + mymed / 2));
                if (add > this.switchReactor) {
                    add = this.switchReactor;
                }
                if (Reactormed + mymed / 2 < 1) {
                    add = this.switchSide / 2;
                }
                if (Reactormed + mymed / 2 < 0.75) {
                    add = this.switchSide / 4;
                }
                if (Reactormed + mymed / 2 < 0.5) {
                    add = this.switchSide / 8;
                }
                if (Reactormed + mymed / 2 < 0.25) {
                    add = 1;
                }
                if (Math.round(Reactormed * 10) / 10 > Math.round(mymed * 10) / 10) {
                    add -= 2 * add;
                }
                else if (Math.round(Reactormed * 10) / 10 == Math.round(mymed * 10) / 10) {
                    add = 0;
                }
                myHeat -= add;
                reactor.setHeat(reactor.getHeat() + add);
            }
            this.alterHeat(item, reactor, x, y, myHeat);
        };
        this.checkHeatAcceptor = function (reactor, x, y, heatAcceptors) {
            var item = reactor.getItemAt(x, y);
            if (item) {
                var component = ReactorAPI.getComponent(item.id);
                if (component && component.canStoreHeat(item)) {
                    var acceptor = { comp: component, item: item, x: x, y: y };
                    heatAcceptors.push(acceptor);
                }
            }
        };
    },
    heatVent: function (heatStorage, selfVent, reactorVent) {
        this.parent = ReactorAPI.heatStorage;
        this.parent(heatStorage);
        this.selfVent = selfVent;
        this.reactorVent = reactorVent;
        this.processChamber = function (item, reactor, x, y, heatrun) {
            if (heatrun) {
                if (this.reactorVent > 0) {
                    var rheat = reactor.getHeat();
                    var reactorDrain = rheat;
                    if (reactorDrain > this.reactorVent) {
                        reactorDrain = this.reactorVent;
                    }
                    rheat -= reactorDrain;
                    if ((reactorDrain = this.alterHeat(item, reactor, x, y, reactorDrain)) > 0) {
                        return;
                    }
                    reactor.setHeat(rheat);
                }
                var self = this.alterHeat(item, reactor, x, y, -this.selfVent);
                /* if (self <= 0) {
                    reactor.addEmitHeat(self + this.selfVent);
                } */
            }
        };
    },
    heatVentSpread: function (sideVent) {
        this.parent = ReactorAPI.reactorComponent;
        this.parent();
        this.sideVent = sideVent;
        this.processChamber = function (item, reactor, x, y, heatrun) {
            if (heatrun) {
                this.cool(reactor, x - 1, y);
                this.cool(reactor, x + 1, y);
                this.cool(reactor, x, y - 1);
                this.cool(reactor, x, y + 1);
            }
        };
        this.cool = function (reactor, x, y) {
            var item = reactor.getItemAt(x, y);
            if (item) {
                var comp = ReactorAPI.getComponent(item.id);
                if (comp && comp.canStoreHeat(item)) {
                    comp.alterHeat(item, reactor, x, y, -this.sideVent);
                    //reactor.addEmitHeat(self + this.sideVent);
                }
            }
        };
    },
    condensator: function (maxDmg) {
        this.parent = ReactorAPI.damageableReactorComponent;
        this.parent(maxDmg);
        this.canStoreHeat = function (item) {
            return this.getCurrentHeat(item) < this.maxDamage;
        };
        this.getMaxHeat = function (item) {
            return this.maxDamage;
        };
        this.getCurrentHeat = function (item) {
            return this.getCustomDamage(item);
        };
        this.alterHeat = function (item, reactor, x, y, heat) {
            if (heat < 0) {
                return heat;
            }
            var currentHeat = this.getCurrentHeat(item);
            var amount = Math.min(heat, this.getMaxHeat(item) - currentHeat);
            this.setCustomDamage(item, currentHeat + amount);
            return heat - amount;
        };
    },
};
IDRegistry.genBlockID("nuclearReactor");
Block.createBlock("nuclearReactor", [
    { name: "Nuclear Reactor", texture: [["machine_bottom", 0], ["nuclear_reactor_top", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0]], inCreative: true },
], "machine");
ItemName.setRarity(BlockID.nuclearReactor, 1, true);
TileRenderer.setStandartModel(BlockID.nuclearReactor, [["machine_bottom", 0], ["nuclear_reactor_top", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0]]);
TileRenderer.registerRenderModel(BlockID.nuclearReactor, 0, [["machine_bottom", 0], ["nuclear_reactor_top", 0], ["nuclear_reactor_side", 1], ["nuclear_reactor_side", 1], ["nuclear_reactor_side", 1], ["nuclear_reactor_side", 1]]);
IDRegistry.genBlockID("reactorChamber");
Block.createBlock("reactorChamber", [
    { name: "Reactor Chamber", texture: [["machine_bottom", 0], ["machine_top", 0], ["reactor_chamber", 0], ["reactor_chamber", 0], ["reactor_chamber", 0], ["reactor_chamber", 0]], inCreative: true },
], "machine");
ItemName.setRarity(BlockID.reactorChamber, 1, true);
MachineRegistry.setMachineDrop("nuclearReactor", BlockID.primalGenerator);
MachineRegistry.setMachineDrop("reactorChamber");
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.nuclearReactor, count: 1, data: 0 }, [
        "xcx",
        "aaa",
        "x#x"
    ], ['#', BlockID.primalGenerator, 0, 'a', BlockID.reactorChamber, 0, 'x', ItemID.densePlateLead, 0, 'c', ItemID.circuitAdvanced, 0]);
    Recipes.addShaped({ id: BlockID.reactorChamber, count: 1, data: 0 }, [
        " x ",
        "x#x",
        " x "
    ], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.plateLead, 0]);
});
var reactorElements = {
    "heatScale": { type: "scale", x: 346, y: 376, direction: 0, value: 0.5, bitmap: "reactor_heat_scale", scale: 3 },
    "textInfo": { type: "text", font: { size: 24, color: Color.GREEN }, x: 655, y: 382, width: 256, height: 42, text: Translation.translate("Generating: ") },
};
for (var y = 0; y < 6; y++) {
    for (var x = 0; x < 9; x++) {
        var i_13 = y * 9 + x;
        reactorElements["slot" + i_13] = { type: "slot", x: 400 + 54 * x, y: 40 + 54 * y, size: 54, maxStackSize: 1, isValid: function (id, count, data) {
                return ReactorAPI.isReactorItem(id);
            } };
    }
}
var guiNuclearReactor = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Nuclear Reactor") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 340, y: 370, bitmap: "reactor_info", scale: GUI_SCALE },
    ],
    elements: reactorElements
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiNuclearReactor, "Nuclear Reactor");
});
var EUReactorModifier = 5;
MachineRegistry.registerGenerator(BlockID.nuclearReactor, {
    defaultValues: {
        isEnabled: false,
        isActive: false,
        heat: 0,
        maxHeat: 10000,
        hem: 1,
        output: 0,
        boomPower: 0
    },
    chambers: [],
    getGuiScreen: function () {
        return guiNuclearReactor;
    },
    init: function () {
        this.chambers = [];
        this.renderModel();
        this.__initialized = true;
        this.rebuildEnergyNet();
    },
    rebuildEnergyNet: function () {
        var net = this.__energyNets.Eu;
        if (net) {
            EnergyNetBuilder.removeNet(net);
        }
        net = EnergyNetBuilder.buildForTile(this, EU);
        this.__energyNets.Eu = net;
        for (var i_14 = 0; i_14 < 6; i_14++) {
            var c = StorageInterface.getRelativeCoords(this, i_14);
            if (World.getBlockID(c.x, c.y, c.z) == BlockID.reactorChamber) {
                var tileEnt = World.getTileEntity(c.x, c.y, c.z);
                if (tileEnt) {
                    this.addChamber(tileEnt);
                }
            }
        }
    },
    addChamber: function (chamber) {
        if (!this.__initialized || chamber.remove || (chamber.core && chamber.core != this)) {
            return;
        }
        if (this.chambers.indexOf(chamber) == -1) {
            this.chambers.push(chamber);
            chamber.core = this;
            chamber.data.x = this.x;
            chamber.data.y = this.y;
            chamber.data.z = this.z;
        }
        var net = this.__energyNets.Eu;
        var chamberNets = chamber.__energyNets;
        if (chamberNets.Eu) {
            if (chamberNets.Eu != net) {
                EnergyNetBuilder.mergeNets(net, chamberNets.Eu);
            }
        }
        else {
            for (var side = 0; side < 6; side++) {
                var c = StorageInterface.getRelativeCoords(chamber, side);
                EnergyNetBuilder.buildTileNet(net, c.x, c.y, c.z, side ^ 1);
            }
        }
        chamberNets.Eu = net;
    },
    removeChamber: function (chamber) {
        this.chambers.splice(this.chambers.indexOf(chamber), 1);
        this.rebuildEnergyNet();
        var x = this.getReactorSize();
        for (var y = 0; y < 6; y++) {
            var slot = this.container.getSlot("slot" + (y * 9 + x));
            if (slot.id > 0) {
                World.drop(chamber.x + .5, chamber.y + .5, chamber.z + .5, slot.id, slot.count, slot.data);
                slot.id = slot.count = slot.data = 0;
            }
        }
    },
    getReactorSize: function () {
        return 3 + this.chambers.length;
    },
    processChambers: function () {
        var size = this.getReactorSize();
        for (var pass = 0; pass < 2; pass++) {
            for (var y = 0; y < 6; y++) {
                for (var x = 0; x < size; x++) {
                    var slot = this.container.getSlot("slot" + (y * 9 + x));
                    var component = ReactorAPI.getComponent(slot.id);
                    if (component) {
                        component.processChamber(slot, this, x, y, pass == 0);
                    }
                }
            }
        }
    },
    tick: function () {
        var content = this.container.getGuiContent();
        var reactorSize = this.getReactorSize();
        if (content) {
            for (var y = 0; y < 6; y++) {
                for (var x = 0; x < 9; x++) {
                    var newX = (x < reactorSize) ? 400 + 54 * x : 1400;
                    content.elements["slot" + (y * 9 + x)].x = newX;
                }
            }
        }
        if (this.data.isEnabled) {
            if (World.getThreadTime() % 20 == 0) {
                this.data.maxHeat = 10000;
                this.data.hem = 1;
                this.data.output = 0;
                this.processChambers();
                this.calculateHeatEffects();
            }
        }
        else {
            this.data.output = 0;
        }
        this.setActive(this.data.heat >= 1000 || this.data.output > 0);
        if (this.data.output > 0) {
            this.startPlaySound();
        }
        else {
            this.stopPlaySound();
        }
        this.container.setScale("heatScale", this.data.heat / this.data.maxHeat);
        this.container.setText("textInfo", "Generating: " + this.getEnergyOutput() + " EU/t");
    },
    energyTick: function (type, src) {
        var output = this.getEnergyOutput();
        src.add(output, Math.min(output, 8192));
    },
    redstone: function (signal) {
        this.data.isEnabled = signal.power > 0;
    },
    getEnergyOutput: function () {
        return parseInt(this.data.output * EUReactorModifier);
    },
    startPlaySound: function () {
        if (!ConfigIC.machineSoundEnabled || this.remove)
            return;
        if (!this.audioSource) {
            this.audioSource = SoundManager.createSource(AudioSource.TILEENTITY, this, "NuclearReactorLoop.ogg");
            ;
        }
        if (this.data.output < 40) {
            var geigerSound = "GeigerLowEU.ogg";
        }
        else if (this.data.output < 80) {
            var geigerSound = "GeigerMedEU.ogg";
        }
        else {
            var geigerSound = "GeigerHighEU.ogg";
        }
        if (!this.audioSourceGeiger) {
            this.audioSourceGeiger = SoundManager.createSource(AudioSource.TILEENTITY, this, geigerSound);
        }
        else if (this.audioSourceGeiger.soundName != geigerSound) {
            this.audioSourceGeiger.setSound(geigerSound, true);
        }
    },
    stopPlaySound: function () {
        if (this.audioSource) {
            SoundManager.removeSource(this.audioSource);
            this.audioSource = null;
        }
        if (this.audioSourceGeiger) {
            SoundManager.removeSource(this.audioSourceGeiger);
            this.audioSourceGeiger = null;
        }
    },
    getHeat: function () {
        return this.data.heat;
    },
    setHeat: function (heat) {
        this.data.heat = heat;
    },
    addHeat: function (amount) {
        this.data.heat += amount;
    },
    getMaxHeat: function () {
        return this.data.maxHeat;
    },
    setMaxHeat: function (newMaxHeat) {
        this.data.maxHeat = newMaxHeat;
    },
    getHeatEffectModifier: function () {
        return this.data.hem;
    },
    setHeatEffectModifier: function (newHEM) {
        this.data.hem = newHEM;
    },
    getItemAt: function (x, y) {
        if (x < 0 || x >= this.getReactorSize() || y < 0 || y >= 6) {
            return null;
        }
        return this.container.getSlot("slot" + (y * 9 + x));
    },
    setItemAt: function (x, y, id, count, data) {
        if (x < 0 || x >= this.getReactorSize() || y < 0 || y >= 6) {
            return null;
        }
        this.container.setSlot("slot" + (y * 9 + x), id, count || 0, data || 0);
    },
    addOutput: function (energy) {
        this.data.output += energy;
    },
    destroyBlock: function (coords, player) {
        for (var i_15 in this.chambers) {
            var c = this.chambers[i_15];
            World.destroyBlock(c.x, c.y, c.z, true);
        }
    },
    renderModel: MachineRegistry.renderModel,
    explode: function () {
        var explode = false;
        var boomPower = 10;
        var boomMod = 1;
        for (var i_16 = 0; i_16 < this.getReactorSize() * 6; i_16++) {
            var slot = this.container.getSlot("slot" + i_16);
            var component = ReactorAPI.getComponent(slot.id);
            if (component) {
                var f = component.influenceExplosion(slot, this);
                if (f > 0 && f < 1) {
                    boomMod *= f;
                }
                else {
                    if (f >= 1)
                        explode = true;
                    boomPower += f;
                }
            }
            this.container.setSlot("slot" + i_16, 0, 0, 0);
        }
        if (explode) {
            this.data.boomPower = Math.min(boomPower * this.data.hem * boomMod, __config__.access("reactor_explosion_max_power"));
            RadiationAPI.addRadiationSource(this.x + 0.5, this.y + 0.5, this.z + 0.5, this.data.boomPower, 600);
            World.explode(this.x + 0.5, this.y + 0.5, this.z + 0.5, this.data.boomPower);
            this.selfDestroy();
        }
    },
    calculateHeatEffects: function () {
        var power = this.data.heat / this.data.maxHeat;
        if (power >= 1) {
            this.explode();
        }
        if (power >= 0.85 && Math.random() <= 0.2 * this.data.hem) {
            var coord = this.getRandCoord(2);
            var block = World.getBlockID(coord.x, coord.y, coord.z);
            var material = ToolAPI.getBlockMaterialName(block);
            if (block == BlockID.nuclearReactor) {
                var tileEntity = World.getTileEntity(coord.x, coord.y, coord.z);
                if (tileEntity) {
                    tileEntity.explode();
                }
            }
            else if (material == "stone" || material == "dirt") {
                World.setBlock(coord.x, coord.y, coord.z, 11, 1);
            }
        }
        if (power >= 0.7 && World.getThreadTime() % 20 == 0) {
            var entities = Entity.getAll();
            for (var i_17 in entities) {
                var ent = entities[i_17];
                if (canTakeDamage(ent, "radiation")) {
                    var c = Entity.getPosition(ent);
                    if (Math.abs(this.x + 0.5 - c.x) <= 3 && Math.abs(this.y + 0.5 - c.y) <= 3 && Math.abs(this.z + 0.5 - c.z) <= 3) {
                        RadiationAPI.addEffect(ent, parseInt(4 * this.data.hem));
                    }
                }
            }
        }
        if (power >= 0.5 && Math.random() <= this.data.hem) {
            var coord = this.getRandCoord(2);
            var block = World.getBlockID(coord.x, coord.y, coord.z);
            if (block == 8 || block == 9) {
                World.setBlock(coord.x, coord.y, coord.z, 0);
            }
        }
        if (power >= 0.4 && Math.random() <= this.data.hem) {
            var coord = this.getRandCoord(2);
            var block = World.getBlockID(coord.x, coord.y, coord.z);
            var material = ToolAPI.getBlockMaterialName(block);
            if (block != 49 && (material == "wood" || material == "wool" || material == "fibre" || material == "plant")) {
                for (var i_18 = 0; i_18 < 6; i_18++) {
                    var c = World.getRelativeCoords(coord.x, coord.y, coord.z, i_18);
                    if (World.getBlockID(c.x, c.y, c.z) == 0) {
                        World.setBlock(c.x, c.y, c.z, 51);
                        break;
                    }
                }
            }
        }
    },
    getRandCoord: function (r) {
        return { x: this.x + randomInt(-r, r), y: this.y + randomInt(-r, r), z: this.z + randomInt(-r, r) };
    }
});
MachineRegistry.registerGenerator(BlockID.reactorChamber, {
    defaultValues: {
        x: -1,
        y: -1,
        z: -1
    },
    core: null,
    getGuiScreen: function () {
        if (this.core) {
            return guiNuclearReactor;
        }
        return null;
    },
    onItemClick: function (id, count, data, coords) {
        if (id == ItemID.debugItem || id == ItemID.EUMeter)
            return false;
        if (this.click(id, count, data, coords))
            return true;
        if (Entity.getSneaking(player))
            return false;
        var gui = this.getGuiScreen();
        if (gui) {
            this.core.container.openAs(gui);
            return true;
        }
    },
    init: function () {
        if (this.data.y >= 0 && World.getBlockID(this.data.x, this.data.y, this.data.z) == BlockID.nuclearReactor) {
            var tileEnt = World.getTileEntity(this.data.x, this.data.y, this.data.z);
            if (tileEnt) {
                tileEnt.addChamber(this);
            }
        }
        else
            for (var i_19 = 0; i_19 < 6; i_19++) {
                var c = StorageInterface.getRelativeCoords(this, i_19);
                if (World.getBlockID(c.x, c.y, c.z) == BlockID.nuclearReactor) {
                    var tileEnt = World.getTileEntity(c.x, c.y, c.z);
                    if (tileEnt) {
                        tileEnt.addChamber(this);
                        break;
                    }
                }
            }
    }
});
Block.registerPlaceFunction(BlockID.nuclearReactor, function (coords, item, block) {
    var x = coords.relative.x;
    var y = coords.relative.y;
    var z = coords.relative.z;
    for (var i_20 = 0; i_20 < 6; i_20++) {
        var c = World.getRelativeCoords(x, y, z, i_20);
        if (World.getBlockID(c.x, c.y, c.z) == BlockID.reactorChamber) {
            var tileEnt = World.getTileEntity(c.x, c.y, c.z);
            if (tileEnt.core) {
                item.count++;
                return;
            }
        }
    }
    World.setBlock(x, y, z, item.id, 0);
    World.playSound(x, y, z, "dig.stone", 1, 0.8);
    World.addTileEntity(x, y, z);
});
Block.registerPlaceFunction(BlockID.reactorChamber, function (coords, item, block) {
    var x = coords.relative.x;
    var y = coords.relative.y;
    var z = coords.relative.z;
    var reactorConnect = 0;
    for (var i_21 = 0; i_21 < 6; i_21++) {
        var c = World.getRelativeCoords(x, y, z, i_21);
        if (World.getBlockID(c.x, c.y, c.z) == BlockID.nuclearReactor) {
            reactorConnect++;
            if (reactorConnect > 1)
                break;
        }
    }
    if (reactorConnect == 1) {
        World.setBlock(x, y, z, item.id, 0);
        World.playSound(x, y, z, "dig.stone", 1, 0.8);
        World.addTileEntity(x, y, z);
    }
    else {
        item.count++;
    }
});
/// <reference path="../TileEntityElectricMachine.ts" />
var TileEntityBatteryBlock = /** @class */ (function (_super) {
    __extends(TileEntityBatteryBlock, _super);
    function TileEntityBatteryBlock(tier, capacity, defaultDrop, guiScreen) {
        var _this = _super.call(this, tier) || this;
        _this.capacity = capacity;
        _this.defaultDrop = defaultDrop;
        _this.guiScreen = guiScreen;
        return _this;
    }
    TileEntityBatteryBlock.prototype.getScreenByName = function (screenName) {
        return screenName == "main" ? this.guiScreen : null;
    };
    TileEntityBatteryBlock.prototype.init = function () {
        if (this.data.meta != undefined) {
            this.blockSource.setBlock(this.x, this.y, this.z, this.blockID, this.data.meta + 2);
            delete this.data.meta;
        }
    };
    TileEntityBatteryBlock.prototype.onItemUse = function (coords, item, player) {
        if (ICTool.isValidWrench(item, 1)) {
            if (this.onWrenchUse(coords, item, player))
                ICTool.useWrench(coords, item, 1);
            return true;
        }
        return false;
    };
    TileEntityBatteryBlock.prototype.onWrenchUse = function (coords, item, player) {
        var newFacing = coords.side;
        if (Entity.getSneaking(player)) {
            newFacing ^= 1;
        }
        if (this.setFacing(newFacing)) {
            EnergyNetBuilder.rebuildTileNet(this);
            return true;
        }
        return false;
    };
    TileEntityBatteryBlock.prototype.getFacing = function () {
        return this.blockSource.getBlockData(this.x, this.y, this.z);
    };
    TileEntityBatteryBlock.prototype.setFacing = function (side) {
        if (this.getFacing() != side) {
            this.blockSource.setBlock(this.x, this.y, this.z, this.blockID, side);
            return true;
        }
        return false;
    };
    TileEntityBatteryBlock.prototype.tick = function () {
        StorageInterface.checkHoppers(this);
        var tier = this.getTier();
        var energyStorage = this.getEnergyStorage();
        this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slot2"), "Eu", energyStorage - this.data.energy, tier);
        this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slot1"), "Eu", this.data.energy, tier);
        this.container.setScale("energyScale", this.data.energy / energyStorage);
        this.container.setText("textInfo1", parseInt(this.data.energy) + "/");
        this.container.setText("textInfo2", energyStorage);
    };
    TileEntityBatteryBlock.prototype.getEnergyStorage = function () {
        return this.capacity;
    };
    TileEntityBatteryBlock.prototype.canReceiveEnergy = function (side) {
        return side != this.data.meta;
    };
    TileEntityBatteryBlock.prototype.canExtractEnergy = function (side) {
        return side == this.data.meta;
    };
    TileEntityBatteryBlock.prototype.destroyBlock = function (coords, player) {
        var itemID = Entity.getCarriedItem(player).id;
        var level = ToolAPI.getToolLevelViaBlock(itemID, this.blockID);
        var drop = MachineRegistry.getMachineDrop(coords, this.blockID, level, this.defaultDrop, this.data.energy);
        if (drop.length > 0) {
            this.blockSource.spawnDroppedItem(coords.x + .5, coords.y + .5, coords.z + .5, drop[0][0], drop[0][1], drop[0][2]);
        }
    };
    return TileEntityBatteryBlock;
}(TileEntityElectricMachine));
var BatteryBlockInterface = {
    slots: {
        "slot1": { input: true, output: true, isValid: function (item, side, tileEntity) {
                return side == 1 && ChargeItemRegistry.isValidItem(item.id, "Eu", tileEntity.getTier());
            },
            canOutput: function (item) {
                return ChargeItemRegistry.getEnergyStored(item) >= ChargeItemRegistry.getMaxCharge(item.id);
            }
        },
        "slot2": { input: true, output: true, isValid: function (item, side, tileEntity) {
                return side > 1 && ChargeItemRegistry.isValidStorage(item.id, "Eu", tileEntity.getTier());
            },
            canOutput: function (item) {
                return ChargeItemRegistry.getEnergyStored(item) <= 0;
            }
        }
    }
};
/// <reference path="./TileEntityBatteryBlock.ts" />
IDRegistry.genBlockID("storageBatBox");
Block.createBlock("storageBatBox", [
    { name: "BatBox", texture: [["batbox_bottom", 0], ["batbox_top", 0], ["batbox_back", 0], ["batbox_front", 0], ["batbox_side", 0], ["batbox_side", 0]], inCreative: true }
], "machine");
ToolAPI.registerBlockMaterial(BlockID.storageBatBox, "wood");
TileRenderer.setStandardModel(BlockID.storageBatBox, 0, [["batbox_front", 0], ["batbox_back", 0], ["batbox_top", 0], ["batbox_bottom", 0], ["batbox_side", 1], ["batbox_side", 2]]);
TileRenderer.setStandardModel(BlockID.storageBatBox, 1, [["batbox_back", 0], ["batbox_front", 0], ["batbox_top", 0], ["batbox_bottom", 0], ["batbox_side", 1], ["batbox_side", 2]]);
TileRenderer.setStandardModel(BlockID.storageBatBox, 2, [["batbox_bottom", 0], ["batbox_top", 0], ["batbox_front", 0], ["batbox_back", 0], ["batbox_side", 0], ["batbox_side", 0]]);
TileRenderer.setStandardModel(BlockID.storageBatBox, 3, [["batbox_bottom", 0], ["batbox_top", 0], ["batbox_back", 0], ["batbox_front", 0], ["batbox_side", 0], ["batbox_side", 0]]);
TileRenderer.setStandardModel(BlockID.storageBatBox, 4, [["batbox_bottom", 0], ["batbox_top", 1], ["batbox_side", 0], ["batbox_side", 0], ["batbox_front", 0], ["batbox_back", 0]]);
TileRenderer.setStandardModel(BlockID.storageBatBox, 5, [["batbox_bottom", 0], ["batbox_top", 1], ["batbox_side", 0], ["batbox_side", 0], ["batbox_back", 0], ["batbox_front", 0]]);
Block.registerDropFunction("storageBatBox", function (coords, blockID, blockData, level) {
    return [];
});
ItemName.addStorageBlockTooltip("storageBatBox", 1, "40K");
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.storageBatBox, count: 1, data: 0 }, [
        "xax",
        "bbb",
        "xxx"
    ], ['a', ItemID.cableTin1, 0, 'x', 5, -1, 'b', ItemID.storageBattery, -1]);
});
var guiBatBox = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("BatBox") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_SCALE },
    ],
    elements: {
        "energyScale": { type: "scale", x: 530 + GUI_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE },
        "slot1": { type: "slot", x: 441, y: 75, isValid: MachineRegistry.isValidEUItem },
        "slot2": { type: "slot", x: 441, y: 212, isValid: MachineRegistry.isValidEUStorage },
        "textInfo1": { type: "text", x: 642, y: 142, width: 300, height: 30, text: "0/" },
        "textInfo2": { type: "text", x: 642, y: 172, width: 350, height: 30, text: "40000" }
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiBatBox, "BatBox");
});
var TileEntityBatBox = /** @class */ (function (_super) {
    __extends(TileEntityBatBox, _super);
    function TileEntityBatBox() {
        return _super.call(this, 1, 40000, BlockID.storageBatBox, guiBatBox) || this;
    }
    return TileEntityBatBox;
}(TileEntityBatteryBlock));
MachineRegistry.registerPrototype(BlockID.storageBatBox, new TileEntityBatBox());
MachineRegistry.setStoragePlaceFunction("storageBatBox", true);
StorageInterface.createInterface(BlockID.storageBatBox, BatteryBlockInterface);
/// <reference path="./TileEntityBatteryBlock.ts" />
IDRegistry.genBlockID("storageCESU");
Block.createBlock("storageCESU", [
    { name: "CESU", texture: [["cesu_top", 0], ["cesu_top", 0], ["cesu_back", 0], ["cesu_front", 0], ["cesu_side", 0], ["cesu_side", 0]], inCreative: true }
], "machine");
ToolAPI.registerBlockMaterial(BlockID.storageCESU, "stone", 1, true);
TileRenderer.setStandardModel(BlockID.storageCESU, 0, [["cesu_front", 0], ["cesu_back", 0], ["cesu_top", 0], ["cesu_top", 0], ["cesu_side", 1], ["cesu_side", 1]]);
TileRenderer.setStandardModel(BlockID.storageCESU, 1, [["cesu_back", 0], ["cesu_front", 0], ["cesu_top", 0], ["cesu_top", 0], ["cesu_side", 1], ["cesu_side", 1]]);
TileRenderer.setStandardModelWithRotation(BlockID.storageCESU, 2, [["cesu_top", 0], ["cesu_top", 0], ["cesu_back", 0], ["cesu_front", 0], ["cesu_side", 0], ["cesu_side", 0]]);
Block.registerDropFunction("storageCESU", function (coords, blockID, blockData, level) {
    return [];
});
ItemName.addStorageBlockTooltip("storageCESU", 2, "300K");
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.storageCESU, count: 1, data: 0 }, [
        "bxb",
        "aaa",
        "bbb"
    ], ['x', ItemID.cableCopper1, 0, 'a', ItemID.storageAdvBattery, -1, 'b', ItemID.plateBronze, 0]);
});
var guiCESU = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("CESU") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_SCALE },
    ],
    elements: {
        "energyScale": { type: "scale", x: 530 + GUI_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE },
        "slot1": { type: "slot", x: 441, y: 75, isValid: MachineRegistry.isValidEUItem },
        "slot2": { type: "slot", x: 441, y: 212, isValid: MachineRegistry.isValidEUStorage },
        "textInfo1": { type: "text", x: 642, y: 142, width: 300, height: 30, text: "0/" },
        "textInfo2": { type: "text", x: 642, y: 172, width: 300, height: 30, text: "300000" }
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiCESU, "CESU");
});
var TileEntityCESU = /** @class */ (function (_super) {
    __extends(TileEntityCESU, _super);
    function TileEntityCESU() {
        return _super.call(this, 2, 300000, BlockID.storageCESU, guiCESU) || this;
    }
    return TileEntityCESU;
}(TileEntityBatteryBlock));
MachineRegistry.registerPrototype(BlockID.storageCESU, new TileEntityCESU());
MachineRegistry.setStoragePlaceFunction("storageCESU", true);
StorageInterface.createInterface(BlockID.storageCESU, BatteryBlockInterface);
/// <reference path="./TileEntityBatteryBlock.ts" />
IDRegistry.genBlockID("storageMFE");
Block.createBlock("storageMFE", [
    { name: "MFE", texture: [["machine_top", 0], ["machine_top", 0], ["mfe_back", 0], ["mfe_front", 0], ["mfe_side", 0], ["mfe_side", 0]], inCreative: true }
], "machine");
ToolAPI.registerBlockMaterial(BlockID.storageMFE, "stone", 1, true);
TileRenderer.setStandardModel(BlockID.storageMFE, 0, [["mfe_front", 0], ["mfe_back", 0], ["machine_top", 0], ["machine_top", 0], ["mfe_side", 1], ["mfe_side", 1]]);
TileRenderer.setStandardModel(BlockID.storageMFE, 1, [["mfe_back", 0], ["mfe_front", 0], ["machine_top", 0], ["machine_top", 0], ["mfe_side", 1], ["mfe_side", 1]]);
TileRenderer.setStandardModelWithRotation(BlockID.storageMFE, 2, [["machine_top", 0], ["machine_top", 0], ["mfe_back", 0], ["mfe_front", 0], ["mfe_side", 0], ["mfe_side", 0]]);
Block.registerDropFunction("storageMFE", function (coords, blockID, blockData, level) {
    return [];
});
ItemName.addStorageBlockTooltip("storageMFE", 3, "4M");
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.storageMFE, count: 1, data: 0 }, [
        "bab",
        "axa",
        "bab"
    ], ['x', BlockID.machineBlockBasic, 0, 'a', ItemID.storageCrystal, -1, 'b', ItemID.cableGold2, -1]);
});
var guiMFE = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("MFE") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_SCALE },
    ],
    elements: {
        "energyScale": { type: "scale", x: 530 + GUI_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE },
        "slot1": { type: "slot", x: 441, y: 75, isValid: MachineRegistry.isValidEUItem },
        "slot2": { type: "slot", x: 441, y: 212, isValid: MachineRegistry.isValidEUStorage },
        "textInfo1": { type: "text", x: 642, y: 142, width: 300, height: 30, text: "0/" },
        "textInfo2": { type: "text", x: 642, y: 172, width: 300, height: 30, text: "4000000" }
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiMFE, "MFE");
});
var TileEntityMFE = /** @class */ (function (_super) {
    __extends(TileEntityMFE, _super);
    function TileEntityMFE() {
        return _super.call(this, 3, 4000000, BlockID.machineBlockBasic, guiMFE) || this;
    }
    return TileEntityMFE;
}(TileEntityBatteryBlock));
MachineRegistry.registerPrototype(BlockID.storageMFE, new TileEntityMFE());
MachineRegistry.setStoragePlaceFunction("storageMFE", true);
StorageInterface.createInterface(BlockID.storageMFE, BatteryBlockInterface);
/// <reference path="./TileEntityBatteryBlock.ts" />
IDRegistry.genBlockID("storageMFSU");
Block.createBlock("storageMFSU", [
    { name: "MFSU", texture: [["mfsu_top", 0], ["mfsu_top", 0], ["mfsu_side", 0], ["mfsu_front", 0], ["mfsu_side", 0], ["mfsu_side", 0]], inCreative: true }
], "machine");
ToolAPI.registerBlockMaterial(BlockID.storageMFSU, "stone", 1, true);
TileRenderer.setStandardModel(BlockID.storageMFSU, 0, [["mfsu_front", 0], ["mfsu_side", 0], ["mfsu_top", 0], ["mfsu_top", 0], ["mfsu_side", 1], ["mfsu_side", 1]]);
TileRenderer.setStandardModel(BlockID.storageMFSU, 1, [["mfsu_side", 0], ["mfsu_front", 0], ["mfsu_top", 0], ["mfsu_top", 0], ["mfsu_side", 1], ["mfsu_side", 1]]);
TileRenderer.setStandardModelWithRotation(BlockID.storageMFSU, 2, [["mfsu_top", 0], ["mfsu_top", 0], ["mfsu_side", 0], ["mfsu_front", 0], ["mfsu_side", 0], ["mfsu_side", 0]]);
Block.registerDropFunction("storageMFSU", function (coords, blockID, blockData, level) {
    return [];
});
ItemName.setRarity(BlockID.storageMFSU, 1);
ItemName.addStorageBlockTooltip("storageMFSU", 4, "60M");
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.storageMFSU, count: 1, data: 0 }, [
        "aca",
        "axa",
        "aba"
    ], ['b', BlockID.storageMFE, -1, 'a', ItemID.storageLapotronCrystal, -1, 'x', BlockID.machineBlockAdvanced, 0, 'c', ItemID.circuitAdvanced, 0]);
});
var guiMFSU = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("MFSU") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_SCALE },
    ],
    elements: {
        "energyScale": { type: "scale", x: 530 + GUI_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE },
        "slot1": { type: "slot", x: 441, y: 75, isValid: MachineRegistry.isValidEUItem },
        "slot2": { type: "slot", x: 441, y: 212, isValid: MachineRegistry.isValidEUStorage },
        "textInfo1": { type: "text", x: 642, y: 142, width: 350, height: 30, text: "0/" },
        "textInfo2": { type: "text", x: 642, y: 172, width: 350, height: 30, text: "60000000" }
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiMFSU, "MFSU");
});
var TileEntityMFSU = /** @class */ (function (_super) {
    __extends(TileEntityMFSU, _super);
    function TileEntityMFSU() {
        return _super.call(this, 4, 6e7, BlockID.machineBlockAdvanced, guiMFSU) || this;
    }
    return TileEntityMFSU;
}(TileEntityBatteryBlock));
MachineRegistry.registerPrototype(BlockID.storageMFSU, new TileEntityMFSU());
MachineRegistry.setStoragePlaceFunction("storageMFSU", true);
StorageInterface.createInterface(BlockID.storageMFSU, BatteryBlockInterface);
/// <reference path="../TileEntityElectricMachine.ts" />
var TileEntityTransformer = /** @class */ (function (_super) {
    __extends(TileEntityTransformer, _super);
    function TileEntityTransformer(tier) {
        var _this = _super.call(this, tier) || this;
        _this.defaultValues = {
            energy: 0,
            increaseMode: false
        };
        return _this;
    }
    TileEntityTransformer.prototype.getEnergyStorage = function () {
        return this.getMaxPacketSize();
    };
    TileEntityTransformer.prototype.init = function () {
        if (this.data.meta != undefined) {
            this.blockSource.setBlock(this.x, this.y, this.z, this.blockID, this.data.meta + 2);
            delete this.data.meta;
        }
    };
    TileEntityTransformer.prototype.energyTick = function (type, src) {
        this.data.last_energy_receive = this.data.energy_receive;
        this.data.energy_receive = 0;
        this.data.last_voltage = this.data.voltage;
        this.data.voltage = 0;
        var maxVoltage = this.getMaxPacketSize();
        if (this.data.increaseMode) {
            if (this.data.energy >= maxVoltage) {
                this.data.energy += src.add(maxVoltage, maxVoltage) - maxVoltage;
            }
        }
        else {
            if (this.data.energy >= maxVoltage / 4) {
                var output = this.data.energy;
                this.data.energy += src.add(output, maxVoltage / 4) - output;
            }
        }
    };
    TileEntityTransformer.prototype.redstone = function (signal) {
        var newMode = signal.power > 0;
        if (newMode != this.data.increaseMode) {
            this.data.increaseMode = newMode;
            EnergyNetBuilder.rebuildTileNet(this);
        }
    };
    TileEntityTransformer.prototype.isEnergySource = function () {
        return true;
    };
    TileEntityTransformer.prototype.canReceiveEnergy = function (side) {
        if (side == this.data.meta) {
            return !this.data.increaseMode;
        }
        return this.data.increaseMode;
    };
    TileEntityTransformer.prototype.canExtractEnergy = function (side) {
        if (side == this.data.meta) {
            return this.data.increaseMode;
        }
        return !this.data.increaseMode;
    };
    TileEntityTransformer.prototype.onItemUse = function (coords, item, player) {
        if (ICTool.isValidWrench(item, 1)) {
            if (this.onWrenchUse(coords, item, player))
                ICTool.useWrench(coords, item, 1);
            return true;
        }
        return false;
    };
    TileEntityTransformer.prototype.onWrenchUse = function (coords, item, player) {
        var newFacing = coords.side;
        if (Entity.getSneaking(player)) {
            newFacing ^= 1;
        }
        if (this.setFacing(newFacing)) {
            EnergyNetBuilder.rebuildTileNet(this);
            return true;
        }
        return false;
    };
    TileEntityTransformer.prototype.getFacing = function () {
        return this.blockSource.getBlockData(this.x, this.y, this.z);
    };
    TileEntityTransformer.prototype.setFacing = function (side) {
        if (this.getFacing() != side) {
            this.blockSource.setBlock(this.x, this.y, this.z, this.blockID, side);
            return true;
        }
        return false;
    };
    return TileEntityTransformer;
}(TileEntityElectricMachine));
/// <reference path="./TileEntityTransformer.ts" />
IDRegistry.genBlockID("transformerLV");
Block.createBlock("transformerLV", [
    { name: "LV Transformer", texture: [["lv_transformer_side", 0], ["lv_transformer_side", 0], ["lv_transformer_side", 0], ["lv_transformer_front", 0], ["lv_transformer_side", 0], ["lv_transformer_side", 0]], inCreative: true }
], "machine");
ToolAPI.registerBlockMaterial(BlockID.transformerLV, "stone", 1, true);
TileRenderer.setStandardModelWithRotation(BlockID.transformerLV, 0, [["lv_transformer_side", 0], ["lv_transformer_side", 0], ["lv_transformer_side", 0], ["lv_transformer_front", 0], ["lv_transformer_side", 0], ["lv_transformer_side", 0]], true);
TileRenderer.setRotationFunction(BlockID.transformerLV, true);
MachineRegistry.setMachineDrop("transformerLV");
ItemName.addTooltip(BlockID.transformerLV, "Low: 32 EU/t High: 128 EU/t");
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.transformerLV, count: 1, data: 0 }, [
        "aba",
        "aoa",
        "aba"
    ], ['o', ItemID.coil, 0, 'a', 5, -1, 'b', ItemID.cableTin1, 0]);
});
MachineRegistry.registerPrototype(BlockID.transformerEV, new TileEntityTransformer(2));
/// <reference path="./TileEntityTransformer.ts" />
IDRegistry.genBlockID("transformerMV");
Block.createBlock("transformerMV", [
    { name: "MV Transformer", texture: [["mv_transformer_side", 0], ["mv_transformer_side", 0], ["mv_transformer_side", 0], ["mv_transformer_front", 0], ["mv_transformer_side", 0], ["mv_transformer_side", 0]], inCreative: true }
], "machine");
ToolAPI.registerBlockMaterial(BlockID.transformerMV, "stone", 1, true);
TileRenderer.setStandardModelWithRotation(BlockID.transformerMV, 0, [["mv_transformer_side", 0], ["mv_transformer_side", 0], ["mv_transformer_side", 0], ["mv_transformer_front", 0], ["mv_transformer_side", 0], ["mv_transformer_side", 0]], true);
TileRenderer.setRotationFunction(BlockID.transformerMV, true);
MachineRegistry.setMachineDrop("transformerMV", BlockID.machineBlockBasic);
ItemName.addTooltip(BlockID.transformerMV, "Low: 128 EU/t High: 512 EU/t");
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.transformerMV, count: 1, data: 0 }, [
        "b",
        "x",
        "b"
    ], ['x', BlockID.machineBlockBasic, 0, 'b', ItemID.cableCopper1, 0]);
});
MachineRegistry.registerPrototype(BlockID.transformerEV, new TileEntityTransformer(3));
/// <reference path="./TileEntityTransformer.ts" />
IDRegistry.genBlockID("transformerHV");
Block.createBlock("transformerHV", [
    { name: "HV Transformer", texture: [["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_front", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0]], inCreative: true }
], "machine");
ToolAPI.registerBlockMaterial(BlockID.transformerHV, "stone", 1, true);
TileRenderer.setStandardModel(BlockID.transformerHV, 0, [["hv_transformer_front", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 1], ["hv_transformer_side", 1]]);
TileRenderer.setStandardModel(BlockID.transformerHV, 1, [["hv_transformer_side", 0], ["hv_transformer_front", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 1], ["hv_transformer_side", 1]]);
TileRenderer.setStandardModelWithRotation(BlockID.transformerHV, 2, [["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_front", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0]]);
MachineRegistry.setMachineDrop("transformerHV", BlockID.machineBlockBasic);
ItemName.setRarity(BlockID.transformerHV, 1);
ItemName.addTooltip(BlockID.transformerHV, "Low: 512 EU/t High: 2048 EU/t");
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.transformerHV, count: 1, data: 0 }, [
        " b ",
        "cxa",
        " b "
    ], ['x', BlockID.transformerMV, 0, 'a', ItemID.storageAdvBattery, -1, 'b', ItemID.cableGold2, -1, 'c', ItemID.circuitBasic, -1]);
});
MachineRegistry.registerPrototype(BlockID.transformerEV, new TileEntityTransformer(4));
/// <reference path="./TileEntityTransformer.ts" />
IDRegistry.genBlockID("transformerEV");
Block.createBlock("transformerEV", [
    { name: "EV Transformer", texture: [["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_front", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0]], inCreative: true }
], "machine");
ToolAPI.registerBlockMaterial(BlockID.transformerEV, "stone", 1, true);
TileRenderer.setStandardModel(BlockID.transformerEV, 0, [["ev_transformer_front", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 1], ["ev_transformer_side", 1]]);
TileRenderer.setStandardModel(BlockID.transformerEV, 1, [["ev_transformer_side", 0], ["ev_transformer_front", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 1], ["ev_transformer_side", 1]]);
TileRenderer.setStandardModelWithRotation(BlockID.transformerEV, 2, [["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_front", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0]]);
MachineRegistry.setMachineDrop("transformerEV", BlockID.machineBlockBasic);
ItemName.setRarity(BlockID.transformerEV, 1);
ItemName.addTooltip(BlockID.transformerEV, "Low: 2048 EU/t High: 8192 EU/t");
Item.addCreativeGroup("EUTransformers", Translation.translate("Transformers"), [
    BlockID.transformerLV,
    BlockID.transformerMV,
    BlockID.transformerHV,
    BlockID.transformerEV
]);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.transformerEV, count: 1, data: 0 }, [
        " b ",
        "cxa",
        " b "
    ], ['x', BlockID.transformerHV, 0, 'a', ItemID.storageLapotronCrystal, -1, 'b', ItemID.cableIron3, 0, 'c', ItemID.circuitAdvanced, 0]);
});
MachineRegistry.registerPrototype(BlockID.transformerEV, new TileEntityTransformer(5));
IDRegistry.genBlockID("ironFurnace");
Block.createBlock("ironFurnace", [
    { name: "Iron Furnace", texture: [["iron_furnace_bottom", 0], ["iron_furnace_top", 0], ["iron_furnace_side", 0], ["iron_furnace_front", 0], ["iron_furnace_side", 0], ["iron_furnace_side", 0]], inCreative: true }
], "machine");
TileRenderer.setStandartModel(BlockID.ironFurnace, [["iron_furnace_bottom", 0], ["iron_furnace_top", 0], ["iron_furnace_side", 0], ["iron_furnace_front", 0], ["iron_furnace_side", 0], ["iron_furnace_side", 0]]);
TileRenderer.registerRotationModel(BlockID.ironFurnace, 0, [["iron_furnace_bottom", 0], ["iron_furnace_top", 0], ["iron_furnace_side", 0], ["iron_furnace_front", 0], ["iron_furnace_side", 0], ["iron_furnace_side", 0]]);
TileRenderer.registerRotationModel(BlockID.ironFurnace, 4, [["iron_furnace_bottom", 0], ["iron_furnace_top", 0], ["iron_furnace_side", 0], ["iron_furnace_front", 1], ["iron_furnace_side", 0], ["iron_furnace_side", 0]]);
MachineRegistry.setMachineDrop("ironFurnace");
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.ironFurnace, count: 1, data: 0 }, [
        " x ",
        "x x",
        "x#x"
    ], ['#', 61, -1, 'x', ItemID.plateIron, 0]);
});
var guiIronFurnace = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Iron Furnace") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 530, y: 155, bitmap: "arrow_bar_background", scale: GUI_SCALE },
        { type: "bitmap", x: 450, y: 155, bitmap: "fire_background", scale: GUI_SCALE }
    ],
    elements: {
        "progressScale": { type: "scale", x: 530, y: 155, direction: 0, value: 0.5, bitmap: "arrow_bar_scale", scale: GUI_SCALE },
        "burningScale": { type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "fire_scale", scale: GUI_SCALE },
        "slotSource": { type: "slot", x: 441, y: 79, isValid: function (id, count, data) {
                return Recipes.getFurnaceRecipeResult(id, "iron") ? true : false;
            } },
        "slotFuel": { type: "slot", x: 441, y: 218, isValid: function (id, count, data) {
                return Recipes.getFuelBurnDuration(id, data) > 0;
            } },
        "slotResult": { type: "slot", x: 625, y: 148, isValid: function () { return false; } },
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiIronFurnace, "Iron Furnace");
});
MachineRegistry.registerPrototype(BlockID.ironFurnace, {
    defaultValues: {
        meta: 0,
        progress: 0,
        burn: 0,
        burnMax: 0,
        isActive: false
    },
    getGuiScreen: function () {
        return guiIronFurnace;
    },
    consumeFuel: function (slotName) {
        var fuelSlot = this.container.getSlot(slotName);
        if (fuelSlot.id > 0) {
            var burn = Recipes.getFuelBurnDuration(fuelSlot.id, fuelSlot.data);
            if (burn) {
                if (LiquidRegistry.getItemLiquid(fuelSlot.id, fuelSlot.data)) {
                    var empty = LiquidRegistry.getEmptyItem(fuelSlot.id, fuelSlot.data);
                    fuelSlot.id = empty.id;
                    fuelSlot.data = empty.data;
                    return burn;
                }
                fuelSlot.count--;
                this.container.validateSlot(slotName);
                return burn;
            }
        }
        return 0;
    },
    tick: function () {
        StorageInterface.checkHoppers(this);
        var sourceSlot = this.container.getSlot("slotSource");
        var result = Recipes.getFurnaceRecipeResult(sourceSlot.id, "iron");
        if (this.data.burn == 0 && result) {
            this.data.burn = this.data.burnMax = this.consumeFuel("slotFuel");
        }
        if (this.data.burn > 0 && result) {
            var resultSlot = this.container.getSlot("slotResult");
            if ((resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count < 64 || resultSlot.id == 0) && this.data.progress++ >= 160) {
                sourceSlot.count--;
                resultSlot.id = result.id;
                resultSlot.data = result.data;
                resultSlot.count++;
                this.container.validateAll();
                this.data.progress = 0;
            }
        }
        else {
            this.data.progress = 0;
        }
        if (this.data.burn > 0) {
            this.data.burn--;
            this.activate();
            this.startPlaySound();
        }
        else {
            this.stopPlaySound();
            this.deactivate();
        }
        this.container.setScale("burningScale", this.data.burn / this.data.burnMax || 0);
        this.container.setScale("progressScale", this.data.progress / 160);
    },
    getOperationSound: function () {
        return "IronFurnaceOp.ogg";
    },
    renderModel: MachineRegistry.renderModelWithRotation,
});
TileRenderer.setRotationPlaceFunction(BlockID.ironFurnace);
StorageInterface.createInterface(BlockID.ironFurnace, {
    slots: {
        "slotSource": { input: true, side: "up",
            isValid: function (item) {
                return Recipes.getFurnaceRecipeResult(item.id, "iron");
            }
        },
        "slotFuel": { input: true, side: "horizontal",
            isValid: function (item) {
                return Recipes.getFuelBurnDuration(item.id, item.data) > 0;
            }
        },
        "slotResult": { output: true }
    }
});
IDRegistry.genBlockID("electricFurnace");
Block.createBlock("electricFurnace", [
    { name: "Electric Furnace", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["electric_furnace", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true }
], "machine");
TileRenderer.setStandartModel(BlockID.electricFurnace, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["electric_furnace", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.electricFurnace, 0, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["electric_furnace", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.electricFurnace, 4, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["electric_furnace", 1], ["machine_side", 0], ["machine_side", 0]]);
ItemName.addTierTooltip("electricFurnace", 1);
MachineRegistry.setMachineDrop("electricFurnace", BlockID.ironFurnace);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.electricFurnace, count: 1, data: 0 }, [
        " a ",
        "x#x"
    ], ['#', BlockID.ironFurnace, -1, 'x', 331, 0, 'a', ItemID.circuitBasic, 0]);
});
var guiElectricFurnace = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Electric Furnace") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 530, y: 155, bitmap: "arrow_bar_background", scale: GUI_SCALE },
        { type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE }
    ],
    elements: {
        "progressScale": { type: "scale", x: 530, y: 155, direction: 0, value: 0.5, bitmap: "arrow_bar_scale", scale: GUI_SCALE },
        "energyScale": { type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE },
        "slotSource": { type: "slot", x: 441, y: 79, isValid: function (id, count, data) {
                return Recipes.getFurnaceRecipeResult(id, "iron") ? true : false;
            } },
        "slotEnergy": { type: "slot", x: 441, y: 218, isValid: MachineRegistry.isValidEUStorage },
        "slotResult": { type: "slot", x: 625, y: 148, isValid: function () { return false; } },
        "slotUpgrade1": { type: "slot", x: 820, y: 60, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade2": { type: "slot", x: 820, y: 119, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade3": { type: "slot", x: 820, y: 178, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade4": { type: "slot", x: 820, y: 237, isValid: UpgradeAPI.isValidUpgrade },
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiElectricFurnace, "Electric Furnace");
});
MachineRegistry.registerElectricMachine(BlockID.electricFurnace, {
    defaultValues: {
        power_tier: 1,
        energy_storage: 1200,
        energy_consumption: 3,
        work_time: 130,
        meta: 0,
        progress: 0,
        isActive: false
    },
    upgrades: ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"],
    getGuiScreen: function () {
        return guiElectricFurnace;
    },
    getTier: function () {
        return this.data.power_tier;
    },
    resetValues: function () {
        this.data.power_tier = this.defaultValues.power_tier;
        this.data.energy_storage = this.defaultValues.energy_storage;
        this.data.energy_consumption = this.defaultValues.energy_consumption;
        this.data.work_time = this.defaultValues.work_time;
    },
    tick: function () {
        this.resetValues();
        UpgradeAPI.executeUpgrades(this);
        var newActive = false;
        var sourceSlot = this.container.getSlot("slotSource");
        var resultSlot = this.container.getSlot("slotResult");
        var result = Recipes.getFurnaceRecipeResult(sourceSlot.id, "iron");
        if (result && (resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count < 64 || resultSlot.id == 0)) {
            if (this.data.energy >= this.data.energy_consumption) {
                this.data.energy -= this.data.energy_consumption;
                this.data.progress += 1 / this.data.work_time;
                newActive = true;
                this.startPlaySound();
            }
            if (this.data.progress.toFixed(3) >= 1) {
                sourceSlot.count--;
                resultSlot.id = result.id;
                resultSlot.data = result.data;
                resultSlot.count++;
                this.container.validateAll();
                this.data.progress = 0;
            }
        }
        else {
            this.data.progress = 0;
        }
        if (!newActive)
            this.stopPlaySound();
        this.setActive(newActive);
        var energyStorage = this.getEnergyStorage();
        this.data.energy = Math.min(this.data.energy, energyStorage);
        this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
        this.container.setScale("progressScale", this.data.progress);
        this.container.setScale("energyScale", this.data.energy / energyStorage);
    },
    getEnergyStorage: function () {
        return this.data.energy_storage;
    },
    getStartingSound: function () {
        return "ElectroFurnaceStart.ogg";
    },
    getOperationSound: function () {
        return "ElectroFurnaceLoop.ogg";
    },
    getInterruptSound: function () {
        return "ElectroFurnaceStop.ogg";
    },
    renderModel: MachineRegistry.renderModelWithRotation
});
TileRenderer.setRotationPlaceFunction(BlockID.electricFurnace);
StorageInterface.createInterface(BlockID.electricFurnace, {
    slots: {
        "slotSource": { input: true },
        "slotResult": { output: true }
    },
    isValidInput: function (item) {
        return Recipes.getFurnaceRecipeResult(item.id, "iron") ? true : false;
    }
});
IDRegistry.genBlockID("inductionFurnace");
Block.createBlock("inductionFurnace", [
    { name: "Induction Furnace", texture: [["machine_advanced", 0], ["machine_advanced", 0], ["machine_back", 0], ["ind_furnace_front", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], inCreative: true }
], "machine");
TileRenderer.setStandartModel(BlockID.inductionFurnace, [["machine_advanced", 0], ["machine_advanced", 0], ["machine_back", 0], ["ind_furnace_front", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]]);
TileRenderer.registerRotationModel(BlockID.inductionFurnace, 0, [["machine_advanced", 0], ["machine_advanced", 0], ["machine_back", 0], ["ind_furnace_front", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]]);
TileRenderer.registerRotationModel(BlockID.inductionFurnace, 4, [["machine_advanced", 0], ["machine_advanced", 0], ["machine_back", 0], ["ind_furnace_front", 1], ["ind_furnace_side", 1], ["ind_furnace_side", 1]]);
ItemName.setRarity(BlockID.inductionFurnace, 1, true);
ItemName.addTierTooltip("inductionFurnace", 2);
MachineRegistry.setMachineDrop("inductionFurnace", BlockID.machineBlockAdvanced);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.inductionFurnace, count: 1, data: 0 }, [
        "xxx",
        "x#x",
        "xax"
    ], ['#', BlockID.electricFurnace, -1, 'x', ItemID.ingotCopper, 0, 'a', BlockID.machineBlockAdvanced, 0]);
});
var guiInductionFurnace = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Induction Furnace") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 630, y: 146, bitmap: "arrow_bar_background", scale: GUI_SCALE },
        { type: "bitmap", x: 550, y: 150, bitmap: "energy_small_background", scale: GUI_SCALE }
    ],
    elements: {
        "progressScale": { type: "scale", x: 630, y: 146, direction: 0, value: 0.5, bitmap: "arrow_bar_scale", scale: GUI_SCALE },
        "energyScale": { type: "scale", x: 550, y: 150, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE },
        "slotSource1": { type: "slot", x: 511, y: 75, isValid: function (id, count, data) {
                return Recipes.getFurnaceRecipeResult(id, "iron") ? true : false;
            } },
        "slotSource2": { type: "slot", x: 571, y: 75, isValid: function (id, count, data) {
                return Recipes.getFurnaceRecipeResult(id, "iron") ? true : false;
            } },
        "slotEnergy": { type: "slot", x: 541, y: 212, isValid: MachineRegistry.isValidEUStorage },
        "slotResult1": { type: "slot", x: 725, y: 142, isValid: function () { return false; } },
        "slotResult2": { type: "slot", x: 785, y: 142, isValid: function () { return false; } },
        "slotUpgrade1": { type: "slot", x: 900, y: 80, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade2": { type: "slot", x: 900, y: 144, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade3": { type: "slot", x: 900, y: 208, isValid: UpgradeAPI.isValidUpgrade },
        "textInfo1": { type: "text", x: 402, y: 143, width: 100, height: 30, text: Translation.translate("Heat:") },
        "textInfo2": { type: "text", x: 402, y: 173, width: 100, height: 30, text: "0%" },
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiInductionFurnace, "Induction Furnace");
});
MachineRegistry.registerElectricMachine(BlockID.inductionFurnace, {
    defaultValues: {
        power_tier: 2,
        energy_storage: 10000,
        meta: 0,
        progress: 0,
        isActive: false,
        isHeating: false,
        heat: 0,
        signal: 0
    },
    upgrades: ["transformer", "energyStorage", "redstone", "itemEjector", "itemPulling"],
    getGuiScreen: function () {
        return guiInductionFurnace;
    },
    getResult: function () {
        var sourceSlot1 = this.container.getSlot("slotSource1");
        var sourceSlot2 = this.container.getSlot("slotSource2");
        var result1 = Recipes.getFurnaceRecipeResult(sourceSlot1.id, "iron");
        var result2 = Recipes.getFurnaceRecipeResult(sourceSlot2.id, "iron");
        if (result1 || result2) {
            return [result1, result2];
        }
    },
    putResult: function (result, sourceSlot, resultSlot) {
        if (result) {
            if (resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count < 64 || resultSlot.id == 0) {
                sourceSlot.count--;
                resultSlot.id = result.id;
                resultSlot.data = result.data;
                resultSlot.count++;
                return true;
            }
        }
    },
    getTier: function () {
        return this.data.power_tier;
    },
    resetValues: function () {
        this.data.power_tier = this.defaultValues.power_tier;
        this.data.energy_storage = this.defaultValues.energy_storage;
        this.data.isHeating = this.data.signal > 0;
    },
    tick: function () {
        this.resetValues();
        UpgradeAPI.executeUpgrades(this);
        var newActive = false;
        var result = this.getResult();
        if (result) {
            if (this.data.energy > 15 && this.data.progress < 100) {
                this.data.energy -= 16;
                if (this.data.heat < 10000) {
                    this.data.heat++;
                }
                this.data.progress += this.data.heat / 1200;
                newActive = true;
                this.startPlaySound();
            }
            if (this.data.progress >= 100) {
                var put1 = this.putResult(result[0], this.container.getSlot("slotSource1"), this.container.getSlot("slotResult1"));
                var put2 = this.putResult(result[1], this.container.getSlot("slotSource2"), this.container.getSlot("slotResult2"));
                if (put1 || put2) {
                    this.container.validateAll();
                    this.data.progress = 0;
                }
            }
        }
        else {
            this.data.progress = 0;
            if (this.data.isHeating && this.data.energy > 0) {
                if (this.data.heat < 10000) {
                    this.data.heat++;
                }
                this.data.energy--;
            }
            else if (this.data.heat > 0) {
                this.data.heat -= 4;
            }
        }
        if (!newActive)
            this.stopPlaySound();
        this.setActive(newActive);
        var energyStorage = this.getEnergyStorage();
        this.data.energy = Math.min(this.data.energy, energyStorage);
        this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
        this.container.setScale("progressScale", this.data.progress / 100);
        this.container.setScale("energyScale", this.data.energy / energyStorage);
        this.container.setText("textInfo2", parseInt(this.data.heat / 100) + "%");
    },
    redstone: function (signal) {
        this.data.signal = signal.power;
    },
    getEnergyStorage: function () {
        return this.data.energy_storage;
    },
    getStartingSound: function () {
        return "InductionStart.ogg";
    },
    getOperationSound: function () {
        return "InductionLoop.ogg";
    },
    getInterruptSound: function () {
        return "InductionStop.ogg";
    },
    renderModel: MachineRegistry.renderModelWithRotation
});
TileRenderer.setRotationPlaceFunction(BlockID.inductionFurnace);
StorageInterface.createInterface(BlockID.inductionFurnace, {
    slots: {
        "slotSource1": { input: true },
        "slotSource2": { input: true },
        "slotResult1": { output: true },
        "slotResult2": { output: true }
    },
    isValidInput: function (item) {
        return Recipes.getFurnaceRecipeResult(item.id, "iron") ? true : false;
    }
});
IDRegistry.genBlockID("macerator");
Block.createBlock("macerator", [
    { name: "Macerator", texture: [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["macerator_front", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true }
], "machine");
TileRenderer.setStandartModel(BlockID.macerator, [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["macerator_front", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.macerator, 0, [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["macerator_front", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.macerator, 4, [["machine_bottom", 0], ["macerator_top", 1], ["machine_side", 0], ["macerator_front", 1], ["machine_side", 0], ["machine_side", 0]]);
ItemName.addTierTooltip("macerator", 1);
MachineRegistry.setMachineDrop("macerator", BlockID.machineBlockBasic);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.macerator, count: 1, data: 0 }, [
        "xxx",
        "b#b",
        " a "
    ], ['#', BlockID.machineBlockBasic, 0, 'x', 318, 0, 'b', 4, -1, 'a', ItemID.circuitBasic, 0]);
    MachineRecipeRegistry.registerRecipesFor("macerator", {
        // ores
        14: { id: ItemID.crushedGold, count: 2, data: 0 },
        15: { id: ItemID.crushedIron, count: 2, data: 0 },
        "BlockID.oreCopper": { id: ItemID.crushedCopper, count: 2, data: 0 },
        "BlockID.oreTin": { id: ItemID.crushedTin, count: 2, data: 0 },
        "BlockID.oreLead": { id: ItemID.crushedLead, count: 2, data: 0 },
        "BlockID.oreSilver": { id: ItemID.crushedSilver, count: 2, data: 0 },
        "BlockID.oreUranium": { id: ItemID.crushedUranium, count: 2, data: 0 },
        // ingots
        265: { id: ItemID.dustIron, count: 1, data: 0 },
        266: { id: ItemID.dustGold, count: 1, data: 0 },
        "ItemID.ingotCopper": { id: ItemID.dustCopper, count: 1, data: 0 },
        "ItemID.ingotTin": { id: ItemID.dustTin, count: 1, data: 0 },
        "ItemID.ingotBronze": { id: ItemID.dustBronze, count: 1, data: 0 },
        "ItemID.ingotSteel": { id: ItemID.dustSteel, count: 1, data: 0 },
        "ItemID.ingotLead": { id: ItemID.dustLead, count: 1, data: 0 },
        "ItemID.ingotSilver": { id: ItemID.dustSilver, count: 1, data: 0 },
        // plates
        "ItemID.plateIron": { id: ItemID.dustIron, count: 1, data: 0 },
        "ItemID.plateGold": { id: ItemID.dustGold, count: 1, data: 0 },
        "ItemID.plateCopper": { id: ItemID.dustCopper, count: 1, data: 0 },
        "ItemID.plateTin": { id: ItemID.dustTin, count: 1, data: 0 },
        "ItemID.plateBronze": { id: ItemID.dustBronze, count: 1, data: 0 },
        "ItemID.plateSteel": { id: ItemID.dustSteel, count: 1, data: 0 },
        "ItemID.plateLead": { id: ItemID.dustLead, count: 1, data: 0 },
        "ItemID.plateLapis": { id: ItemID.dustLapis, count: 1, data: 0 },
        // dense plates
        "ItemID.densePlateIron": { id: ItemID.dustIron, count: 9, data: 0 },
        "ItemID.densePlateGold": { id: ItemID.dustGold, count: 9, data: 0 },
        "ItemID.densePlateCopper": { id: ItemID.dustCopper, count: 9, data: 0 },
        "ItemID.densePlateTin": { id: ItemID.dustTin, count: 9, data: 0 },
        "ItemID.densePlateBronze": { id: ItemID.dustBronze, count: 9, data: 0 },
        "ItemID.densePlateSteel": { id: ItemID.dustSteel, count: 9, data: 0 },
        "ItemID.densePlateLead": { id: ItemID.dustLead, count: 9, data: 0 },
        // other resources
        22: { id: ItemID.dustLapis, count: 9, data: 0 },
        173: { id: ItemID.dustCoal, count: 9, data: 0 },
        "263:0": { id: ItemID.dustCoal, count: 1, data: 0 },
        264: { id: ItemID.dustDiamond, count: 1, data: 0 },
        "351:4": { id: ItemID.dustLapis, count: 1, data: 0 },
        375: { id: ItemID.grinPowder, count: 2, data: 0 },
        394: { id: ItemID.grinPowder, count: 1, data: 0 },
        // other materials
        1: { id: 4, count: 1, data: 0 },
        4: { id: 12, count: 1, data: 0 },
        13: { id: 318, count: 1, data: 0 },
        24: { id: 12, count: 2, data: 0 },
        35: { id: 287, count: 2, data: 0 },
        79: { id: 332, count: 4, data: 0 },
        89: { id: 348, count: 4, data: 0 },
        128: { id: 12, count: 3, data: 0 },
        152: { id: 331, count: 9, data: 0 },
        155: { id: 406, count: 4, data: 0 },
        156: { id: 406, count: 6, data: 0 },
        179: { id: 12, count: 2, data: 1 },
        180: { id: 12, count: 3, data: 1 },
        352: { id: 351, count: 5, data: 15 },
        369: { id: 377, count: 5, data: 0 },
        // plants
        5: { id: ItemID.bioChaff, count: 1, sourceCount: 4 },
        "BlockID.rubberTreeSapling": { id: ItemID.bioChaff, count: 1, sourceCount: 4 },
        "BlockID.rubberTreeLeaves": { id: ItemID.bioChaff, count: 1, sourceCount: 8 },
        18: { id: ItemID.bioChaff, count: 1, sourceCount: 8 },
        161: { id: ItemID.bioChaff, count: 1, sourceCount: 8 },
        32: { id: ItemID.bioChaff, count: 1, sourceCount: 8 },
        81: { id: ItemID.bioChaff, count: 1, sourceCount: 8 },
        86: { id: ItemID.bioChaff, count: 1, sourceCount: 8 },
        296: { id: ItemID.bioChaff, count: 1, sourceCount: 8 },
        338: { id: ItemID.bioChaff, count: 1, sourceCount: 8 },
        360: { id: ItemID.bioChaff, count: 1, sourceCount: 8 },
        391: { id: ItemID.bioChaff, count: 1, sourceCount: 8 },
        392: { id: ItemID.bioChaff, count: 1, sourceCount: 8 },
        361: { id: ItemID.bioChaff, count: 1, sourceCount: 16 },
        362: { id: ItemID.bioChaff, count: 1, sourceCount: 16 },
        "ItemID.weed": { id: ItemID.bioChaff, count: 1, sourceCount: 32 },
        "ItemID.bioChaff": { id: 3, count: 1, data: 0 },
        "ItemID.coffeeBeans": { id: ItemID.coffeePowder, count: 3, data: 0 },
    }, true);
});
var guiMacerator = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Macerator") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 530, y: 155, bitmap: "macerator_bar_background", scale: GUI_SCALE },
        { type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE }
    ],
    elements: {
        "progressScale": { type: "scale", x: 530, y: 155, direction: 0, value: 0.5, bitmap: "macerator_bar_scale", scale: GUI_SCALE },
        "energyScale": { type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE },
        "slotSource": { type: "slot", x: 441, y: 79, isValid: function (id, count, data) {
                return MachineRecipeRegistry.hasRecipeFor("macerator", id, data);
            } },
        "slotEnergy": { type: "slot", x: 441, y: 218, isValid: MachineRegistry.isValidEUStorage },
        "slotResult": { type: "slot", x: 625, y: 148, isValid: function () { return false; } },
        "slotUpgrade1": { type: "slot", x: 820, y: 60, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade2": { type: "slot", x: 820, y: 119, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade3": { type: "slot", x: 820, y: 178, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade4": { type: "slot", x: 820, y: 237, isValid: UpgradeAPI.isValidUpgrade },
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiMacerator, "Macerator");
});
MachineRegistry.registerElectricMachine(BlockID.macerator, {
    defaultValues: {
        power_tier: 1,
        energy_storage: 1200,
        energy_consumption: 2,
        work_time: 300,
        meta: 0,
        progress: 0,
        isActive: false
    },
    upgrades: ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"],
    getGuiScreen: function () {
        return guiMacerator;
    },
    getTier: function () {
        return this.data.power_tier;
    },
    resetValues: function () {
        this.data.power_tier = this.defaultValues.power_tier;
        this.data.energy_storage = this.defaultValues.energy_storage;
        this.data.energy_consumption = this.defaultValues.energy_consumption;
        this.data.work_time = this.defaultValues.work_time;
    },
    tick: function () {
        this.resetValues();
        UpgradeAPI.executeUpgrades(this);
        var newActive = false;
        var sourceSlot = this.container.getSlot("slotSource");
        var resultSlot = this.container.getSlot("slotResult");
        var result = MachineRecipeRegistry.getRecipeResult("macerator", sourceSlot.id, sourceSlot.data);
        if (result && (sourceSlot.count >= result.sourceCount || !result.sourceCount)) {
            var resultSlot = this.container.getSlot("slotResult");
            if (resultSlot.id == result.id && (!result.data || resultSlot.data == result.data) && resultSlot.count <= 64 - result.count || resultSlot.id == 0) {
                if (this.data.energy >= this.data.energy_consumption) {
                    this.data.energy -= this.data.energy_consumption;
                    this.data.progress += 1 / this.data.work_time;
                    newActive = true;
                    this.startPlaySound();
                }
                if (this.data.progress.toFixed(3) >= 1) {
                    sourceSlot.count -= result.sourceCount || 1;
                    resultSlot.id = result.id;
                    resultSlot.data = result.data || 0;
                    resultSlot.count += result.count;
                    this.container.validateAll();
                    this.data.progress = 0;
                }
            }
        }
        else {
            this.data.progress = 0;
        }
        if (!newActive)
            this.stopPlaySound();
        this.setActive(newActive);
        var energyStorage = this.getEnergyStorage();
        this.data.energy = Math.min(this.data.energy, energyStorage);
        this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
        this.container.setScale("progressScale", this.data.progress);
        this.container.setScale("energyScale", this.data.energy / energyStorage);
    },
    getEnergyStorage: function () {
        return this.data.energy_storage;
    },
    getOperationSound: function () {
        return "MaceratorOp.ogg";
    },
    getInterruptSound: function () {
        return "InterruptOne.ogg";
    },
    renderModel: MachineRegistry.renderModelWithRotation
});
TileRenderer.setRotationPlaceFunction(BlockID.macerator);
StorageInterface.createInterface(BlockID.macerator, {
    slots: {
        "slotSource": { input: true },
        "slotResult": { output: true }
    },
    isValidInput: function (item) {
        return MachineRecipeRegistry.hasRecipeFor("macerator", item.id, item.data);
    }
});
IDRegistry.genBlockID("compressor");
Block.createBlock("compressor", [
    { name: "Compressor", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["compressor", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true }
], "machine");
TileRenderer.setStandartModel(BlockID.compressor, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["compressor", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.compressor, 0, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["compressor", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.compressor, 4, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["compressor", 1], ["machine_side", 0], ["machine_side", 0]]);
ItemName.addTierTooltip("compressor", 1);
MachineRegistry.setMachineDrop("compressor", BlockID.machineBlockBasic);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.compressor, count: 1, data: 0 }, [
        "x x",
        "x#x",
        "xax"
    ], ['#', BlockID.machineBlockBasic, 0, 'x', 1, -1, 'a', ItemID.circuitBasic, 0]);
    MachineRecipeRegistry.registerRecipesFor("compressor", {
        // Blocks
        80: { id: 79, count: 1, data: 0 },
        12: { id: 24, count: 1, data: 0, sourceCount: 4 },
        336: { id: 45, count: 1, data: 0, sourceCount: 4 },
        405: { id: 112, count: 1, data: 0, sourceCount: 4 },
        348: { id: 89, count: 1, data: 0, sourceCount: 4 },
        406: { id: 155, count: 1, data: 0, sourceCount: 4 },
        // Items
        "ItemID.dustEnergium": { id: ItemID.storageCrystal, count: 1, data: Item.getMaxDamage(ItemID.storageCrystal), sourceCount: 9 },
        "ItemID.ingotAlloy": { id: ItemID.plateAlloy, count: 1, data: 0 },
        "ItemID.carbonMesh": { id: ItemID.carbonPlate, count: 1, data: 0 },
        "ItemID.coalBall": { id: ItemID.coalBlock, count: 1, data: 0 },
        "ItemID.coalChunk": { id: 264, count: 1, data: 0 },
        "ItemID.cellEmpty": { id: ItemID.cellAir, count: 1, data: 0 },
        "ItemID.dustLapis": { id: ItemID.plateLapis, count: 1, data: 0 },
        // Dense Plates
        "ItemID.plateIron": { id: ItemID.densePlateIron, count: 1, data: 0, sourceCount: 9 },
        "ItemID.plateGold": { id: ItemID.densePlateGold, count: 1, data: 0, sourceCount: 9 },
        "ItemID.plateTin": { id: ItemID.densePlateTin, count: 1, data: 0, sourceCount: 9 },
        "ItemID.plateCopper": { id: ItemID.densePlateCopper, count: 1, data: 0, sourceCount: 9 },
        "ItemID.plateBronze": { id: ItemID.densePlateBronze, count: 1, data: 0, sourceCount: 9 },
        "ItemID.plateSteel": { id: ItemID.densePlateSteel, count: 1, data: 0, sourceCount: 9 },
        "ItemID.plateLead": { id: ItemID.densePlateLead, count: 1, data: 0, sourceCount: 9 },
        // Compact
        331: { id: 152, count: 1, data: 0, sourceCount: 9 },
        "351:4": { id: 22, count: 1, data: 0, sourceCount: 9 },
        264: { id: 57, count: 1, data: 0, sourceCount: 9 },
        388: { id: 133, count: 1, data: 0, sourceCount: 9 },
        265: { id: 42, count: 1, data: 0, sourceCount: 9 },
        266: { id: 41, count: 1, data: 0, sourceCount: 9 },
        "ItemID.ingotCopper": { id: BlockID.blockCopper, count: 1, data: 0, sourceCount: 9 },
        "ItemID.ingotTin": { id: BlockID.blockTin, count: 1, data: 0, sourceCount: 9 },
        "ItemID.ingotLead": { id: BlockID.blockLead, count: 1, data: 0, sourceCount: 9 },
        "ItemID.ingotSteel": { id: BlockID.blockSteel, count: 1, data: 0, sourceCount: 9 },
        "ItemID.ingotBronze": { id: BlockID.blockBronze, count: 1, data: 0, sourceCount: 9 },
        "ItemID.dustSmallIron": { id: ItemID.dustIron, count: 1, data: 0, sourceCount: 9 },
        "ItemID.dustSmallGold": { id: ItemID.dustGold, count: 1, data: 0, sourceCount: 9 },
        "ItemID.dustSmallCopper": { id: ItemID.dustCopper, count: 1, data: 0, sourceCount: 9 },
        "ItemID.dustSmallTin": { id: ItemID.dustTin, count: 1, data: 0, sourceCount: 9 },
        "ItemID.dustSmallLead": { id: ItemID.dustLead, count: 1, data: 0, sourceCount: 9 },
        "ItemID.smallUranium235": { id: ItemID.uranium235, count: 1, data: 0, sourceCount: 9 },
        "ItemID.smallPlutonium": { id: ItemID.plutonium, count: 1, data: 0, sourceCount: 9 }
    }, true);
});
var guiCompressor = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Compressor") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 530, y: 155, bitmap: "compressor_bar_background", scale: GUI_SCALE },
        { type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE },
    ],
    elements: {
        "progressScale": { type: "scale", x: 530, y: 155, direction: 0, value: 0.5, bitmap: "compressor_bar_scale", scale: GUI_SCALE },
        "energyScale": { type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE },
        "slotSource": { type: "slot", x: 441, y: 79, isValid: function (id, count, data) {
                return MachineRecipeRegistry.hasRecipeFor("compressor", id, data);
            } },
        "slotEnergy": { type: "slot", x: 441, y: 218, isValid: MachineRegistry.isValidEUStorage },
        "slotResult": { type: "slot", x: 625, y: 148, isValid: function () { return false; } },
        "slotUpgrade1": { type: "slot", x: 820, y: 60, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade2": { type: "slot", x: 820, y: 119, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade3": { type: "slot", x: 820, y: 178, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade4": { type: "slot", x: 820, y: 237, isValid: UpgradeAPI.isValidUpgrade },
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiCompressor, "Compressor");
});
MachineRegistry.registerElectricMachine(BlockID.compressor, {
    defaultValues: {
        power_tier: 1,
        energy_storage: 1200,
        energy_consumption: 2,
        work_time: 400,
        meta: 0,
        progress: 0,
        isActive: false
    },
    upgrades: ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"],
    getGuiScreen: function () {
        return guiCompressor;
    },
    getTier: function () {
        return this.data.power_tier;
    },
    resetValues: function () {
        this.data.power_tier = this.defaultValues.power_tier;
        this.data.energy_storage = this.defaultValues.energy_storage;
        this.data.energy_consumption = this.defaultValues.energy_consumption;
        this.data.work_time = this.defaultValues.work_time;
    },
    tick: function () {
        this.resetValues();
        UpgradeAPI.executeUpgrades(this);
        var newActive = false;
        var sourceSlot = this.container.getSlot("slotSource");
        var result = MachineRecipeRegistry.getRecipeResult("compressor", sourceSlot.id, sourceSlot.data);
        if (result && (sourceSlot.count >= result.sourceCount || !result.sourceCount)) {
            var resultSlot = this.container.getSlot("slotResult");
            if (resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count <= 64 - result.count || resultSlot.id == 0) {
                if (this.data.energy >= this.data.energy_consumption) {
                    this.data.energy -= this.data.energy_consumption;
                    this.data.progress += 1 / this.data.work_time;
                    newActive = true;
                    this.startPlaySound();
                }
                if (this.data.progress.toFixed(3) >= 1) {
                    sourceSlot.count -= result.sourceCount || 1;
                    resultSlot.id = result.id;
                    resultSlot.data = result.data;
                    resultSlot.count += result.count;
                    this.container.validateAll();
                    this.data.progress = 0;
                }
            }
        }
        else {
            this.data.progress = 0;
        }
        if (!newActive)
            this.stopPlaySound();
        this.setActive(newActive);
        var energyStorage = this.getEnergyStorage();
        this.data.energy = Math.min(this.data.energy, energyStorage);
        this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
        this.container.setScale("progressScale", this.data.progress);
        this.container.setScale("energyScale", this.data.energy / energyStorage);
    },
    getEnergyStorage: function () {
        return this.data.energy_storage;
    },
    getOperationSound: function () {
        return "CompressorOp.ogg";
    },
    getInterruptSound: function () {
        return "InterruptOne.ogg";
    },
    renderModel: MachineRegistry.renderModelWithRotation
});
TileRenderer.setRotationPlaceFunction(BlockID.compressor);
StorageInterface.createInterface(BlockID.compressor, {
    slots: {
        "slotSource": { input: true },
        "slotResult": { output: true }
    },
    isValidInput: function (item) {
        return MachineRecipeRegistry.hasRecipeFor("compressor", item.id, item.data);
    }
});
IDRegistry.genBlockID("extractor");
Block.createBlock("extractor", [
    { name: "Extractor", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["extractor_front", 0], ["extractor_side", 0], ["extractor_side", 0]], inCreative: true }
], "machine");
TileRenderer.setStandartModel(BlockID.extractor, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["extractor_front", 0], ["extractor_side", 0], ["extractor_side", 0]], true);
TileRenderer.registerRotationModel(BlockID.extractor, 0, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["extractor_front", 0], ["extractor_side", 0], ["extractor_side", 0]]);
TileRenderer.registerRotationModel(BlockID.extractor, 4, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["extractor_front", 1], ["extractor_side", 1], ["extractor_side", 1]]);
ItemName.addTierTooltip("extractor", 1);
MachineRegistry.setMachineDrop("extractor", BlockID.machineBlockBasic);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.extractor, count: 1, data: 0 }, [
        "x#x",
        "xax"
    ], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.treetap, 0, 'a', ItemID.circuitBasic, 0]);
    MachineRecipeRegistry.registerRecipesFor("extractor", {
        "ItemID.latex": { id: ItemID.rubber, count: 3 },
        "BlockID.rubberTreeSapling": { id: ItemID.rubber, count: 1 },
        "BlockID.rubberTreeLog": { id: ItemID.rubber, count: 1 },
        35: { id: 35, count: 1 },
        289: { id: ItemID.dustSulfur, count: 1 },
        "ItemID.tinCanFull": { id: ItemID.tinCanEmpty, count: 1 },
    }, true);
});
var guiExtractor = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Extractor") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 530, y: 155, bitmap: "extractor_bar_background", scale: GUI_SCALE },
        { type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE }
    ],
    elements: {
        "progressScale": { type: "scale", x: 530, y: 155, direction: 0, value: 0.5, bitmap: "extractor_bar_scale", scale: GUI_SCALE },
        "energyScale": { type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE },
        "slotSource": { type: "slot", x: 441, y: 79, isValid: function (id, count, data) {
                return MachineRecipeRegistry.hasRecipeFor("extractor", id);
            } },
        "slotEnergy": { type: "slot", x: 441, y: 218, isValid: MachineRegistry.isValidEUStorage },
        "slotResult": { type: "slot", x: 625, y: 148, isValid: function () { return false; } },
        "slotUpgrade1": { type: "slot", x: 820, y: 60, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade2": { type: "slot", x: 820, y: 119, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade3": { type: "slot", x: 820, y: 178, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade4": { type: "slot", x: 820, y: 237, isValid: UpgradeAPI.isValidUpgrade },
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiExtractor, "Extractor");
});
MachineRegistry.registerElectricMachine(BlockID.extractor, {
    defaultValues: {
        power_tier: 1,
        energy_storage: 1200,
        energy_consumption: 2,
        work_time: 400,
        meta: 0,
        progress: 0,
        isActive: false
    },
    upgrades: ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"],
    getGuiScreen: function () {
        return guiExtractor;
    },
    getTier: function () {
        return this.data.power_tier;
    },
    resetValues: function () {
        this.data.power_tier = this.defaultValues.power_tier;
        this.data.energy_storage = this.defaultValues.energy_storage;
        this.data.energy_consumption = this.defaultValues.energy_consumption;
        this.data.work_time = this.defaultValues.work_time;
    },
    tick: function () {
        this.resetValues();
        UpgradeAPI.executeUpgrades(this);
        var newActive = false;
        var sourceSlot = this.container.getSlot("slotSource");
        var resultSlot = this.container.getSlot("slotResult");
        var result = MachineRecipeRegistry.getRecipeResult("extractor", sourceSlot.id);
        if (result && (resultSlot.id == result.id && resultSlot.count <= 64 - result.count || resultSlot.id == 0)) {
            if (this.data.energy >= this.data.energy_consumption) {
                this.data.energy -= this.data.energy_consumption;
                this.data.progress += 1 / this.data.work_time;
                newActive = true;
                this.startPlaySound();
            }
            if (this.data.progress.toFixed(3) >= 1) {
                sourceSlot.count--;
                resultSlot.id = result.id;
                resultSlot.count += result.count;
                this.container.validateAll();
                this.data.progress = 0;
            }
        }
        else {
            this.data.progress = 0;
        }
        if (!newActive)
            this.stopPlaySound();
        this.setActive(newActive);
        var energyStorage = this.getEnergyStorage();
        this.data.energy = Math.min(this.data.energy, energyStorage);
        this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
        this.container.setScale("progressScale", this.data.progress);
        this.container.setScale("energyScale", this.data.energy / energyStorage);
    },
    getEnergyStorage: function () {
        return this.data.energy_storage;
    },
    getOperationSound: function () {
        return "ExtractorOp.ogg";
    },
    getInterruptSound: function () {
        return "InterruptOne.ogg";
    },
    renderModel: MachineRegistry.renderModelWithRotation
});
TileRenderer.setRotationPlaceFunction(BlockID.extractor);
StorageInterface.createInterface(BlockID.extractor, {
    slots: {
        "slotSource": { input: true },
        "slotResult": { output: true }
    },
    isValidInput: function (item) {
        return MachineRecipeRegistry.hasRecipeFor("extractor", item.id);
    }
});
IDRegistry.genBlockID("solidCanner");
Block.createBlock("solidCanner", [
    { name: "Solid Canning Machine", texture: [["machine_bottom", 0], ["machine_bottom", 0], ["machine_side", 0], ["solid_canner", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true }
], "machine");
TileRenderer.setStandartModel(BlockID.solidCanner, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["solid_canner", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.solidCanner, 0, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["solid_canner", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.solidCanner, 4, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["solid_canner", 1], ["machine_side", 0], ["machine_side", 0]]);
ItemName.addTierTooltip("solidCanner", 1);
MachineRegistry.setMachineDrop("solidCanner", BlockID.machineBlockBasic);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.solidCanner, count: 1, data: 0 }, [
        "c#c",
        "cxc",
        "ccc"
    ], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'c', ItemID.casingTin, 0]);
    MachineRecipeRegistry.registerRecipesFor("solidCanner", {
        "ItemID.uranium": { storage: [ItemID.fuelRod, 1], result: [ItemID.fuelRodUranium, 1, 0] },
        "ItemID.mox": { storage: [ItemID.fuelRod, 1], result: [ItemID.fuelRodMOX, 1, 0] },
        354: { storage: [ItemID.tinCanEmpty, 14], result: [ItemID.tinCanFull, 14, 0] },
        413: { storage: [ItemID.tinCanEmpty, 10], result: [ItemID.tinCanFull, 10, 0] },
        320: { storage: [ItemID.tinCanEmpty, 8], result: [ItemID.tinCanFull, 8, 0] },
        364: { storage: [ItemID.tinCanEmpty, 8], result: [ItemID.tinCanFull, 8, 0] },
        400: { storage: [ItemID.tinCanEmpty, 8], result: [ItemID.tinCanFull, 8, 0] },
        282: { storage: [ItemID.tinCanEmpty, 6], result: [ItemID.tinCanFull, 6, 0] },
        366: { storage: [ItemID.tinCanEmpty, 6], result: [ItemID.tinCanFull, 6, 0] },
        396: { storage: [ItemID.tinCanEmpty, 6], result: [ItemID.tinCanFull, 6, 0] },
        424: { storage: [ItemID.tinCanEmpty, 6], result: [ItemID.tinCanFull, 6, 0] },
        459: { storage: [ItemID.tinCanEmpty, 6], result: [ItemID.tinCanFull, 6, 0] },
        463: { storage: [ItemID.tinCanEmpty, 6], result: [ItemID.tinCanFull, 6, 0] },
        297: { storage: [ItemID.tinCanEmpty, 5], result: [ItemID.tinCanFull, 5, 0] },
        350: { storage: [ItemID.tinCanEmpty, 5], result: [ItemID.tinCanFull, 5, 0] },
        393: { storage: [ItemID.tinCanEmpty, 5], result: [ItemID.tinCanFull, 5, 0] },
        412: { storage: [ItemID.tinCanEmpty, 5], result: [ItemID.tinCanFull, 5, 0] },
        367: { storage: [ItemID.tinCanEmpty, 4], result: [ItemID.tinCanFull, 4, 1] },
        260: { storage: [ItemID.tinCanEmpty, 4], result: [ItemID.tinCanFull, 4, 0] },
        319: { storage: [ItemID.tinCanEmpty, 3], result: [ItemID.tinCanFull, 3, 0] },
        363: { storage: [ItemID.tinCanEmpty, 3], result: [ItemID.tinCanFull, 3, 0] },
        391: { storage: [ItemID.tinCanEmpty, 3], result: [ItemID.tinCanFull, 3, 0] },
        411: { storage: [ItemID.tinCanEmpty, 3], result: [ItemID.tinCanFull, 3, 0] },
        357: { storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 0] },
        360: { storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 0] },
        365: { storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 1] },
        375: { storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 2] },
        349: { storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 0] },
        394: { storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 2] },
        423: { storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 0] },
        460: { storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 0] },
        392: { storage: [ItemID.tinCanEmpty, 1], result: [ItemID.tinCanFull, 1, 0] },
        457: { storage: [ItemID.tinCanEmpty, 1], result: [ItemID.tinCanFull, 1, 0] },
        461: { storage: [ItemID.tinCanEmpty, 1], result: [ItemID.tinCanFull, 1, 0] },
    }, true);
});
var guiSolidCanner = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Solid Canning Machine") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 400 + 52 * GUI_SCALE, y: 50 + 33 * GUI_SCALE, bitmap: "solid_canner_arrow", scale: GUI_SCALE },
        { type: "bitmap", x: 400 + 86 * GUI_SCALE, y: 50 + 34 * GUI_SCALE, bitmap: "arrow_bar_background", scale: GUI_SCALE },
        { type: "bitmap", x: 416, y: 178, bitmap: "energy_small_background", scale: GUI_SCALE }
    ],
    elements: {
        "progressScale": { type: "scale", x: 400 + 86 * GUI_SCALE, y: 50 + 34 * GUI_SCALE, direction: 0, value: 0.5, bitmap: "arrow_bar_scale", scale: GUI_SCALE },
        "energyScale": { type: "scale", x: 416, y: 178, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE },
        "slotEnergy": { type: "slot", x: 400 + 3 * GUI_SCALE, y: 50 + 58 * GUI_SCALE, isValid: MachineRegistry.isValidEUStorage },
        "slotSource": { type: "slot", x: 400 + 32 * GUI_SCALE, y: 50 + 32 * GUI_SCALE,
            isValid: function (id) {
                return MachineRecipeRegistry.hasRecipeFor("solidCanner", id);
            }
        },
        "slotCan": { type: "slot", x: 400 + 63 * GUI_SCALE, y: 50 + 32 * GUI_SCALE, isValid: function (id) {
                var recipes = MachineRecipeRegistry.requireRecipesFor("solidCanner");
                for (var i in recipes) {
                    if (recipes[i].storage[0] == id)
                        return true;
                }
                return false;
            }
        },
        "slotResult": { type: "slot", x: 400 + 111 * GUI_SCALE, y: 50 + 32 * GUI_SCALE, isValid: function () { return false; } },
        "slotUpgrade1": { type: "slot", x: 870, y: 50 + 4 * GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade2": { type: "slot", x: 870, y: 50 + 22 * GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade3": { type: "slot", x: 870, y: 50 + 40 * GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade4": { type: "slot", x: 870, y: 50 + 58 * GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade },
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiSolidCanner, "Solid Canning Machine");
});
MachineRegistry.registerElectricMachine(BlockID.solidCanner, {
    defaultValues: {
        power_tier: 1,
        energy_storage: 800,
        energy_consumption: 1,
        work_time: 200,
        meta: 0,
        progress: 0,
        isActive: false
    },
    upgrades: ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"],
    getGuiScreen: function () {
        return guiSolidCanner;
    },
    getTier: function () {
        return this.data.power_tier;
    },
    resetValues: function () {
        this.data.power_tier = this.defaultValues.power_tier;
        this.data.energy_storage = this.defaultValues.energy_storage;
        this.data.energy_consumption = this.defaultValues.energy_consumption;
        this.data.work_time = this.defaultValues.work_time;
    },
    tick: function () {
        this.resetValues();
        UpgradeAPI.executeUpgrades(this);
        var sourceSlot = this.container.getSlot("slotSource");
        var resultSlot = this.container.getSlot("slotResult");
        var canSlot = this.container.getSlot("slotCan");
        var newActive = false;
        var recipe = MachineRecipeRegistry.getRecipeResult("solidCanner", sourceSlot.id);
        if (recipe && canSlot.id == recipe.storage[0] && canSlot.count >= recipe.storage[1] && (resultSlot.id == recipe.result[0] && resultSlot.data == recipe.result[2] && resultSlot.count <= 64 - recipe.result[1] || resultSlot.id == 0)) {
            if (this.data.energy >= this.data.energy_consumption) {
                this.data.energy -= this.data.energy_consumption;
                this.data.progress += 1 / this.data.work_time;
                newActive = true;
            }
            if (this.data.progress.toFixed(3) >= 1) {
                sourceSlot.count--;
                canSlot.count -= recipe.storage[1];
                resultSlot.id = recipe.result[0];
                resultSlot.data = recipe.result[2];
                resultSlot.count += recipe.result[1];
                this.container.validateAll();
                this.data.progress = 0;
            }
        }
        else {
            this.data.progress = 0;
        }
        this.setActive(newActive);
        var energyStorage = this.getEnergyStorage();
        this.data.energy = Math.min(this.data.energy, energyStorage);
        this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
        this.container.setScale("progressScale", this.data.progress);
        this.container.setScale("energyScale", this.data.energy / energyStorage);
    },
    getEnergyStorage: function () {
        return this.data.energy_storage;
    },
    renderModel: MachineRegistry.renderModelWithRotation
});
TileRenderer.setRotationPlaceFunction(BlockID.solidCanner);
StorageInterface.createInterface(BlockID.solidCanner, {
    slots: {
        "slotSource": { input: true,
            isValid: function (item) {
                return MachineRecipeRegistry.hasRecipeFor("solidCanner", item.id);
            }
        },
        "slotCan": { input: true, isValid: function (item) {
                var recipes = MachineRecipeRegistry.requireRecipesFor("solidCanner");
                for (var i in recipes) {
                    if (recipes[i].storage[0] == item.id)
                        return true;
                }
                return false;
            }
        },
        "slotResult": { output: true }
    }
});
IDRegistry.genBlockID("canner");
Block.createBlock("canner", [
    { name: "Fluid/Solid Canning Machine", texture: [["machine_bottom", 0], ["machine_bottom", 0], ["machine_side", 0], ["canner_front", 0], ["canner_side", 0], ["canner_side", 0]], inCreative: true }
], "machine");
TileRenderer.setStandartModel(BlockID.canner, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["canner_front", 0], ["canner_side", 0], ["canner_side", 0]]);
TileRenderer.registerRotationModel(BlockID.canner, 0, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["canner_front", 0], ["canner_side", 0], ["canner_side", 0]]);
TileRenderer.registerRotationModel(BlockID.canner, 4, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["canner_front", 1], ["canner_side", 1], ["canner_side", 0]]);
ItemName.addTierTooltip("canner", 1);
MachineRegistry.setMachineDrop("canner", BlockID.machineBlockBasic);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.canner, count: 1, data: 0 }, [
        "c#c",
        "cxc",
    ], ['#', BlockID.solidCanner, 0, 'x', ItemID.circuitBasic, 0, 'c', ItemID.cellEmpty, 0]);
    MachineRecipeRegistry.registerRecipesFor("fluidCanner", [
        { input: ["water", { id: ItemID.bioChaff, count: 1 }], output: "biomass" },
        { input: ["water", { id: ItemID.dustLapis, count: 1 }], output: "coolant" }
    ]);
});
var guiCanner = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Fluid/Solid Canning Machine") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 406, y: 50 + 58 * GUI_SCALE_NEW, bitmap: "energy_small_background", scale: GUI_SCALE_NEW },
        { type: "bitmap", x: 400 + 67 * GUI_SCALE_NEW, y: 50 + 18 * GUI_SCALE_NEW, bitmap: "extractor_bar_background", scale: GUI_SCALE_NEW },
        { type: "bitmap", x: 496, y: 50 + 38 * GUI_SCALE_NEW, bitmap: "liquid_bar", scale: GUI_SCALE_NEW },
        { type: "bitmap", x: 730, y: 50 + 38 * GUI_SCALE_NEW, bitmap: "liquid_bar", scale: GUI_SCALE_NEW }
    ],
    elements: {
        "background": { type: "image", x: 400 + 51 * GUI_SCALE_NEW, y: 50 + 12 * GUI_SCALE_NEW, bitmap: "canner_background_0", scale: GUI_SCALE_NEW },
        "liquidInputScale": { type: "scale", x: 496 + 4 * GUI_SCALE_NEW, y: 50 + 42 * GUI_SCALE_NEW, direction: 1, value: 0.5, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE_NEW },
        "liquidOutputScale": { type: "scale", x: 730 + 4 * GUI_SCALE_NEW, y: 50 + 42 * GUI_SCALE_NEW, direction: 1, value: 0.5, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE_NEW },
        "progressScale": { type: "scale", x: 400 + 67 * GUI_SCALE_NEW, y: 50 + 18 * GUI_SCALE_NEW, direction: 0, value: 0.5, bitmap: "extractor_bar_scale", scale: GUI_SCALE_NEW },
        "energyScale": { type: "scale", x: 406, y: 50 + 58 * GUI_SCALE_NEW, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE_NEW },
        "slotEnergy": { type: "slot", x: 400, y: 50 + 75 * GUI_SCALE_NEW, size: 54, isValid: MachineRegistry.isValidEUStorage },
        "slotSource": { type: "slot", x: 400 + 72 * GUI_SCALE_NEW, y: 50 + 39 * GUI_SCALE_NEW, size: 54, visual: false, bitmap: "canner_slot_source_0",
            isValid: function (id, count, data, container) {
                return isValidCannerSource(id, data, container.tileEntity);
            }
        },
        "slotCan": { type: "slot", x: 400 + 33 * GUI_SCALE_NEW, y: 50 + 12 * GUI_SCALE_NEW, size: 54,
            isValid: function (id, count, data, container) {
                return isValidCannerCan(id, data, container.tileEntity);
            }
        },
        "slotResult": { type: "slot", x: 400 + 111 * GUI_SCALE_NEW, y: 50 + 12 * GUI_SCALE_NEW, size: 54, isValid: function () { return false; } },
        "slotUpgrade1": { type: "slot", x: 850, y: 113, size: 54, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade2": { type: "slot", x: 850, y: 167, size: 54, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade3": { type: "slot", x: 850, y: 221, size: 54, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade4": { type: "slot", x: 850, y: 275, size: 54, isValid: UpgradeAPI.isValidUpgrade },
        "buttonSwitch": { type: "button", x: 400 + 70 * GUI_SCALE_NEW, y: 50 + 60 * GUI_SCALE_NEW, bitmap: "canner_switch_button", scale: GUI_SCALE_NEW, clicker: {
                onClick: function (container, tile) {
                    if (tile.data.progress == 0) {
                        var liquidData = tile.inputTank.data;
                        tile.inputTank.data = tile.outputTank.data;
                        tile.outputTank.data = liquidData;
                    }
                }
            } },
        "buttonMode": { type: "button", x: 400 + 54 * GUI_SCALE_NEW, y: 50 + 75 * GUI_SCALE_NEW, bitmap: "canner_mode_0", scale: GUI_SCALE_NEW, clicker: {
                onClick: function (container, tile) {
                    if (tile.data.progress == 0) {
                        tile.data.mode = (tile.data.mode + 1) % 4;
                        tile.updateUI();
                    }
                }
            } }
    }
});
function isValidCannerSource(id, data, tile) {
    if (tile.data.mode == 0 && MachineRecipeRegistry.hasRecipeFor("solidCanner", id)) {
        return true;
    }
    if (tile.data.mode == 3) {
        var recipes = MachineRecipeRegistry.requireRecipesFor("fluidCanner");
        for (var i in recipes) {
            if (recipes[i].input[1].id == id)
                return true;
        }
    }
    return false;
}
function isValidCannerCan(id, data, tile) {
    if (tile.data.mode == 0) {
        var recipes = MachineRecipeRegistry.requireRecipesFor("solidCanner");
        for (var i in recipes) {
            if (recipes[i].storage[0] == id)
                return true;
        }
    }
    if (tile.data.mode == 1 || tile.data.mode == 3) {
        return LiquidLib.getEmptyItem(id, data) ? true : false;
    }
    if (tile.data.mode == 2) {
        return LiquidRegistry.getFullItem(id, data, "water") ? true : false;
    }
    return false;
}
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiCanner, "Fluid/Solid Canning Machine");
});
MachineRegistry.registerElectricMachine(BlockID.canner, {
    defaultValues: {
        power_tier: 1,
        energy_storage: 1600,
        energy_consumption: 1,
        work_time: 200,
        meta: 0,
        progress: 0,
        mode: 0,
        isActive: false
    },
    upgrades: ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling", "fluidEjector", "fluidPulling"],
    getGuiScreen: function () {
        return guiCanner;
    },
    getTier: function () {
        return this.data.power_tier;
    },
    resetValues: function () {
        this.data.power_tier = this.defaultValues.power_tier;
        this.data.energy_storage = this.defaultValues.energy_storage;
        this.data.energy_consumption = this.defaultValues.energy_consumption;
        this.data.work_time = this.defaultValues.work_time;
        if (this.data.mode % 3 > 0)
            this.data.work_time /= 5;
    },
    updateUI: function () {
        var content = this.container.getGuiContent();
        if (content) {
            this.updateElement(content.elements.buttonMode, "canner_mode_" + this.data.mode);
            this.updateElement(content.elements.background, "canner_background_" + this.data.mode);
            var element = content.elements.slotSource;
            var texture = "canner_slot_source_" + this.data.mode;
            if (element.bitmap != texture) {
                element.bitmap = texture;
                element.visual = this.data.mode % 3 > 0;
            }
        }
    },
    updateElement: function (element, bitmap) {
        if (element.bitmap != bitmap) {
            element.bitmap = bitmap;
        }
    },
    init: function () {
        this.inputTank = new LiquidTank(this, "input", 8);
        this.outputTank = new LiquidTank(this, "output", 8);
        this.renderModel();
    },
    tick: function () {
        this.updateUI();
        this.resetValues();
        UpgradeAPI.executeUpgrades(this);
        var sourceSlot = this.container.getSlot("slotSource");
        var resultSlot = this.container.getSlot("slotResult");
        var canSlot = this.container.getSlot("slotCan");
        var newActive = false;
        switch (this.data.mode) {
            case 0:
                var recipe = MachineRecipeRegistry.getRecipeResult("solidCanner", sourceSlot.id);
                if (recipe && canSlot.id == recipe.storage[0] && canSlot.count >= recipe.storage[1] && (resultSlot.id == recipe.result[0] && resultSlot.data == recipe.result[2] && resultSlot.count <= 64 - recipe.result[1] || resultSlot.id == 0)) {
                    if (this.data.energy >= this.data.energy_consumption) {
                        this.data.energy -= this.data.energy_consumption;
                        this.data.progress += 1 / this.data.work_time;
                        newActive = true;
                    }
                    if (this.data.progress.toFixed(3) >= 1) {
                        canSlot.count -= recipe.storage[1];
                        sourceSlot.count--;
                        resultSlot.id = recipe.result[0];
                        resultSlot.data = recipe.result[2];
                        resultSlot.count += recipe.result[1];
                        this.container.validateAll();
                        this.data.progress = 0;
                    }
                }
                else {
                    this.data.progress = 0;
                }
                break;
            case 1:
                var liquid = this.outputTank.getLiquidStored();
                var empty = LiquidLib.getEmptyItem(canSlot.id, canSlot.data);
                if (empty && (!liquid || empty.liquid == liquid) && this.outputTank.getAmount() <= 8 - empty.amount) {
                    if (this.data.energy >= this.data.energy_consumption && (resultSlot.id == empty.id && resultSlot.data == empty.data && resultSlot.count < Item.getMaxStack(empty.id) || resultSlot.id == 0)) {
                        this.data.energy -= this.data.energy_consumption;
                        this.data.progress += 1 / this.data.work_time;
                        newActive = true;
                    }
                    if (this.data.progress.toFixed(3) >= 1) {
                        this.outputTank.addLiquid(empty.liquid, empty.amount);
                        canSlot.count--;
                        resultSlot.id = empty.id;
                        resultSlot.data = empty.data;
                        resultSlot.count++;
                        this.container.validateAll();
                        this.data.progress = 0;
                    }
                }
                else {
                    this.data.progress = 0;
                }
                break;
            case 2:
                var resetProgress = true;
                var liquid = this.inputTank.getLiquidStored();
                if (liquid) {
                    var full = LiquidLib.getFullItem(canSlot.id, canSlot.data, liquid);
                    if (full && this.inputTank.getAmount() >= full.storage) {
                        resetProgress = false;
                        if (this.data.energy >= this.data.energy_consumption && (resultSlot.id == full.id && resultSlot.data == full.data && resultSlot.count < Item.getMaxStack(full.id) || resultSlot.id == 0)) {
                            this.data.energy -= this.data.energy_consumption;
                            this.data.progress += 1 / this.data.work_time;
                            newActive = true;
                        }
                        if (this.data.progress.toFixed(3) >= 1) {
                            this.inputTank.getLiquid(liquid, full.storage);
                            canSlot.count--;
                            resultSlot.id = full.id;
                            resultSlot.data = full.data;
                            resultSlot.count++;
                            this.container.validateAll();
                            this.data.progress = 0;
                        }
                    }
                }
                if (resetProgress) {
                    this.data.progress = 0;
                }
                break;
            case 3:
                var recipes = MachineRecipeRegistry.requireRecipesFor("fluidCanner");
                var resetProgress = true;
                for (var i in recipes) {
                    var recipe = recipes[i];
                    var liquid = recipe.input[0];
                    var source = recipe.input[1];
                    if (this.inputTank.getAmount(liquid) >= 1 && source.id == sourceSlot.id && source.count <= sourceSlot.count) {
                        resetProgress = false;
                        var outputLiquid = this.outputTank.getLiquidStored();
                        if ((!outputLiquid || recipe.output == outputLiquid && this.outputTank.getAmount() <= 7) && this.data.energy >= this.data.energy_consumption) {
                            this.data.energy -= this.data.energy_consumption;
                            this.data.progress += 1 / this.data.work_time;
                            newActive = true;
                        }
                        if (this.data.progress.toFixed(3) >= 1) {
                            this.inputTank.getLiquid(1);
                            sourceSlot.count -= source.count;
                            this.outputTank.addLiquid(recipe.output, 1);
                            this.container.validateAll();
                            this.data.progress = 0;
                        }
                        break;
                    }
                }
                if (resetProgress) {
                    this.data.progress = 0;
                }
                break;
        }
        this.setActive(newActive);
        var energyStorage = this.getEnergyStorage();
        this.data.energy = Math.min(this.data.energy, energyStorage);
        this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
        this.inputTank.updateUiScale("liquidInputScale");
        this.outputTank.updateUiScale("liquidOutputScale");
        this.container.setScale("progressScale", this.data.progress);
        this.container.setScale("energyScale", this.data.energy / energyStorage);
    },
    getEnergyStorage: function () {
        return this.data.energy_storage;
    },
    renderModel: MachineRegistry.renderModelWithRotation
});
TileRenderer.setRotationPlaceFunction(BlockID.canner);
StorageInterface.createInterface(BlockID.canner, {
    slots: {
        "slotSource": { input: true,
            isValid: function (item, side, tileEntity) {
                return isValidCannerSource(item.id, item.data, tileEntity);
            }
        },
        "slotCan": { input: true,
            isValid: function (item, side, tileEntity) {
                return isValidCannerCan(item.id, item.data, tileEntity);
            }
        },
        "slotResult": { output: true }
    },
    canReceiveLiquid: function (liquid, side) { return true; },
    canTransportLiquid: function (liquid, side) { return true; },
    addLiquid: function (liquid, amount) {
        return this.tileEntity.inputTank.addLiquid(liquid, amount);
    },
    getLiquid: function (liquid, amount) {
        return this.tileEntity.outputTank.getLiquid(liquid, amount);
    },
    getLiquidStored: function (mode) {
        if (mode == "input")
            return this.tileEntity.inputTank.getLiquidStored();
        return this.tileEntity.outputTank.getLiquidStored();
    }
});
IDRegistry.genBlockID("recycler");
Block.createBlock("recycler", [
    { name: "Recycler", texture: [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["recycler_front", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true }
], "machine");
TileRenderer.setStandartModel(BlockID.recycler, [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["recycler_front", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.recycler, 0, [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["recycler_front", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.recycler, 4, [["machine_bottom", 0], ["macerator_top", 1], ["machine_side", 0], ["recycler_front", 1], ["machine_side", 0], ["machine_side", 0]]);
ItemName.addTierTooltip("recycler", 1);
MachineRegistry.setMachineDrop("recycler", BlockID.machineBlockBasic);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.recycler, count: 1, data: 0 }, [
        " a ",
        "x#x",
        "bxb"
    ], ['#', BlockID.compressor, -1, 'x', 3, -1, 'a', 348, 0, 'b', ItemID.ingotSteel, 0]);
});
var recyclerBlacklist = [102, 280, 78, 80, 332];
var guiRecycler = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Recycler") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 530, y: 155, bitmap: "recycler_bar_background", scale: GUI_SCALE },
        { type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE }
    ],
    elements: {
        "progressScale": { type: "scale", x: 530, y: 155, direction: 0, value: 0.5, bitmap: "recycler_bar_scale", scale: GUI_SCALE },
        "energyScale": { type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE },
        "slotSource": { type: "slot", x: 441, y: 79 },
        "slotEnergy": { type: "slot", x: 441, y: 218, isValid: MachineRegistry.isValidEUStorage },
        "slotResult": { type: "slot", x: 625, y: 148, isValid: function () { return false; } },
        "slotUpgrade1": { type: "slot", x: 820, y: 60, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade2": { type: "slot", x: 820, y: 119, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade3": { type: "slot", x: 820, y: 178, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade4": { type: "slot", x: 820, y: 237, isValid: UpgradeAPI.isValidUpgrade },
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiRecycler, "Recycler");
});
MachineRegistry.registerElectricMachine(BlockID.recycler, {
    defaultValues: {
        power_tier: 1,
        energy_storage: 800,
        energy_consumption: 1,
        work_time: 45,
        meta: 0,
        progress: 0,
        isActive: false
    },
    upgrades: ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"],
    getGuiScreen: function () {
        return guiRecycler;
    },
    getTier: function () {
        return this.data.power_tier;
    },
    resetValues: function () {
        this.data.power_tier = this.defaultValues.power_tier;
        this.data.energy_storage = this.defaultValues.energy_storage;
        this.data.energy_consumption = this.defaultValues.energy_consumption;
        this.data.work_time = this.defaultValues.work_time;
    },
    tick: function () {
        this.resetValues();
        UpgradeAPI.executeUpgrades(this);
        var newActive = false;
        var sourceSlot = this.container.getSlot("slotSource");
        var resultSlot = this.container.getSlot("slotResult");
        if (sourceSlot.id > 0 && (resultSlot.id == ItemID.scrap && resultSlot.count < 64 || resultSlot.id == 0)) {
            if (this.data.energy >= this.data.energy_consumption) {
                this.data.energy -= this.data.energy_consumption;
                this.data.progress += 1 / this.data.work_time;
                newActive = true;
                this.startPlaySound();
            }
            if (this.data.progress.toFixed(3) >= 1) {
                sourceSlot.count--;
                if (Math.random() < 0.125 && recyclerBlacklist.indexOf(sourceSlot.id) == -1) {
                    resultSlot.id = ItemID.scrap;
                    resultSlot.count++;
                }
                this.container.validateAll();
                this.data.progress = 0;
            }
        }
        else {
            this.data.progress = 0;
        }
        if (!newActive)
            this.stopPlaySound();
        this.setActive(newActive);
        var energyStorage = this.getEnergyStorage();
        this.data.energy = Math.min(this.data.energy, energyStorage);
        this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
        this.container.setScale("progressScale", this.data.progress);
        this.container.setScale("energyScale", this.data.energy / energyStorage);
    },
    getEnergyStorage: function () {
        return this.data.energy_storage;
    },
    getOperationSound: function () {
        return "RecyclerOp.ogg";
    },
    getInterruptSound: function () {
        return "InterruptOne.ogg";
    },
    renderModel: MachineRegistry.renderModelWithRotation
});
TileRenderer.setRotationPlaceFunction(BlockID.recycler);
StorageInterface.createInterface(BlockID.recycler, {
    slots: {
        "slotSource": { input: true },
        "slotResult": { output: true }
    }
});
IDRegistry.genBlockID("metalFormer");
Block.createBlock("metalFormer", [
    { name: "Metal Former", texture: [["machine_bottom", 0], ["metal_former_top", 0], ["machine_side", 0], ["metal_former_front", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true }
], "machine");
TileRenderer.setStandartModel(BlockID.metalFormer, [["machine_bottom", 0], ["metal_former_top", 0], ["machine_side", 0], ["metal_former_front", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.metalFormer, 0, [["machine_bottom", 0], ["metal_former_top", 0], ["machine_side", 0], ["metal_former_front", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.metalFormer, 4, [["machine_bottom", 0], ["metal_former_top", 1], ["machine_side", 0], ["metal_former_front", 1], ["machine_side", 0], ["machine_side", 0]]);
ItemName.addTierTooltip("metalFormer", 1);
MachineRegistry.setMachineDrop("metalFormer", BlockID.machineBlockBasic);
Callback.addCallback("PreLoaded", function () {
    function isToolboxEmpty(slot) {
        var container = BackpackRegistry.containers["d" + slot.data];
        if (container) {
            for (var i_22 = 1; i_22 <= 10; i_22++) {
                if (container.getSlot("slot" + i_22).id != 0) {
                    return false;
                }
            }
        }
        return true;
    }
    Recipes.addShaped({ id: BlockID.metalFormer, count: 1, data: 0 }, [
        " x ",
        "b#b",
        "ccc"
    ], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'b', ItemID.toolbox, -1, 'c', ItemID.coil, 0], function (api, field, result) {
        if (isToolboxEmpty(field[3]) && isToolboxEmpty(field[5])) {
            for (var i in field) {
                api.decreaseFieldSlot(i);
            }
        }
        else {
            result.id = result.count = 0;
        }
    });
    // rolling
    MachineRecipeRegistry.registerRecipesFor("metalFormer0", {
        // ingots
        265: { id: ItemID.plateIron, count: 1 },
        266: { id: ItemID.plateGold, count: 1 },
        "ItemID.ingotCopper": { id: ItemID.plateCopper, count: 1 },
        "ItemID.ingotTin": { id: ItemID.plateTin, count: 1 },
        "ItemID.ingotBronze": { id: ItemID.plateBronze, count: 1 },
        "ItemID.ingotSteel": { id: ItemID.plateSteel, count: 1 },
        "ItemID.ingotLead": { id: ItemID.plateLead, count: 1 },
        // plates
        "ItemID.plateIron": { id: ItemID.casingIron, count: 2 },
        "ItemID.plateGold": { id: ItemID.casingGold, count: 2 },
        "ItemID.plateTin": { id: ItemID.casingTin, count: 2 },
        "ItemID.plateCopper": { id: ItemID.casingCopper, count: 2 },
        "ItemID.plateBronze": { id: ItemID.casingBronze, count: 2 },
        "ItemID.plateSteel": { id: ItemID.casingSteel, count: 2 },
        "ItemID.plateLead": { id: ItemID.casingLead, count: 2 }
    }, true);
    // cutting
    MachineRecipeRegistry.registerRecipesFor("metalFormer1", {
        "ItemID.plateTin": { id: ItemID.cableTin0, count: 3 },
        "ItemID.plateCopper": { id: ItemID.cableCopper0, count: 3 },
        "ItemID.plateGold": { id: ItemID.cableGold0, count: 4 },
        "ItemID.plateIron": { id: ItemID.cableIron0, count: 4 },
    }, true);
    // extruding
    MachineRecipeRegistry.registerRecipesFor("metalFormer2", {
        "ItemID.ingotTin": { id: ItemID.cableTin0, count: 3 },
        "ItemID.ingotCopper": { id: ItemID.cableCopper0, count: 3 },
        "ItemID.ingotGold": { id: ItemID.cableGold0, count: 4 },
        265: { id: ItemID.cableIron0, count: 4 },
        266: { id: ItemID.cableGold0, count: 4 },
        "ItemID.casingTin": { id: ItemID.tinCanEmpty, count: 1 },
        "ItemID.plateIron": { id: ItemID.fuelRod, count: 1 },
    }, true);
});
var guiMetalFormer = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Metal Former") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 530, y: 164, bitmap: "metalformer_bar_background", scale: GUI_SCALE },
        { type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE },
    ],
    elements: {
        "progressScale": { type: "scale", x: 530, y: 164, direction: 0, value: 0.5, bitmap: "metalformer_bar_scale", scale: GUI_SCALE },
        "energyScale": { type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE },
        "slotSource": { type: "slot", x: 441, y: 79,
            isValid: function (id, count, data) {
                return MachineRecipeRegistry.hasRecipeFor("metalFormer0", id) ||
                    MachineRecipeRegistry.hasRecipeFor("metalFormer1", id) ||
                    MachineRecipeRegistry.hasRecipeFor("metalFormer2", id);
            }
        },
        "slotEnergy": { type: "slot", x: 441, y: 218, isValid: MachineRegistry.isValidEUStorage },
        "slotResult": { type: "slot", x: 717, y: 148, isValid: function () { return false; } },
        "slotUpgrade1": { type: "slot", x: 870, y: 60, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade2": { type: "slot", x: 870, y: 119, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade3": { type: "slot", x: 870, y: 178, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade4": { type: "slot", x: 870, y: 237, isValid: UpgradeAPI.isValidUpgrade },
        "button": { type: "button", x: 572, y: 210, bitmap: "metal_former_button_0", scale: GUI_SCALE, clicker: {
                onClick: function (container, tile) {
                    tile.data.mode = (tile.data.mode + 1) % 3;
                }
            } }
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiMetalFormer, "Metal Former");
});
MachineRegistry.registerElectricMachine(BlockID.metalFormer, {
    defaultValues: {
        power_tier: 1,
        energy_storage: 4000,
        energy_consumption: 10,
        work_time: 200,
        meta: 0,
        progress: 0,
        mode: 0,
        isActive: false
    },
    upgrades: ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"],
    getGuiScreen: function () {
        return guiMetalFormer;
    },
    getTier: function () {
        return this.data.power_tier;
    },
    resetValues: function () {
        this.data.power_tier = this.defaultValues.power_tier;
        this.data.energy_storage = this.defaultValues.energy_storage;
        this.data.energy_consumption = this.defaultValues.energy_consumption;
        this.data.work_time = this.defaultValues.work_time;
    },
    tick: function () {
        var content = this.container.getGuiContent();
        if (content) {
            content.elements.button.bitmap = "metal_former_button_" + this.data.mode;
        }
        this.resetValues();
        UpgradeAPI.executeUpgrades(this);
        var newActive = false;
        var sourceSlot = this.container.getSlot("slotSource");
        var resultSlot = this.container.getSlot("slotResult");
        var result = MachineRecipeRegistry.getRecipeResult("metalFormer" + this.data.mode, sourceSlot.id);
        if (result && (resultSlot.id == result.id && resultSlot.count <= 64 - result.count || resultSlot.id == 0)) {
            if (this.data.energy >= this.data.energy_consumption) {
                this.data.energy -= this.data.energy_consumption;
                this.data.progress += 1 / this.data.work_time;
                newActive = true;
            }
            if (this.data.progress.toFixed(3) >= 1) {
                sourceSlot.count -= 1;
                resultSlot.id = result.id;
                resultSlot.count += result.count;
                this.container.validateAll();
                this.data.progress = 0;
            }
        }
        else {
            this.data.progress = 0;
        }
        this.setActive(newActive);
        var energyStorage = this.getEnergyStorage();
        this.data.energy = Math.min(this.data.energy, energyStorage);
        this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
        this.container.setScale("progressScale", this.data.progress);
        this.container.setScale("energyScale", this.data.energy / energyStorage);
    },
    getEnergyStorage: function () {
        return this.data.energy_storage;
    },
    renderModel: MachineRegistry.renderModelWithRotation
});
TileRenderer.setRotationPlaceFunction(BlockID.metalFormer);
StorageInterface.createInterface(BlockID.metalFormer, {
    slots: {
        "slotSource": { input: true },
        "slotResult": { output: true }
    },
    isValidInput: function (item) {
        return MachineRecipeRegistry.hasRecipeFor("metalFormer0", item.id) ||
            MachineRecipeRegistry.hasRecipeFor("metalFormer1", item.id) ||
            MachineRecipeRegistry.hasRecipeFor("metalFormer2", item.id);
    }
});
IDRegistry.genBlockID("oreWasher");
Block.createBlock("oreWasher", [
    { name: "Ore Washing Plant", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["ore_washer_front", 0], ["ore_washer_side", 0], ["ore_washer_side", 0]], inCreative: true }
], "machine");
TileRenderer.setStandartModel(BlockID.oreWasher, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["ore_washer_front", 0], ["ore_washer_side", 0], ["ore_washer_side", 0]]);
TileRenderer.registerRotationModel(BlockID.oreWasher, 0, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["ore_washer_front", 0], ["ore_washer_side", 0], ["ore_washer_side", 0]]);
TileRenderer.registerRotationModel(BlockID.oreWasher, 4, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["ore_washer_front", 1], ["ore_washer_side", 1], ["ore_washer_side", 1]]);
ItemName.addTierTooltip("oreWasher", 1);
MachineRegistry.setMachineDrop("oreWasher", BlockID.machineBlockBasic);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.oreWasher, count: 1, data: 0 }, [
        "aaa",
        "b#b",
        "xcx"
    ], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.electricMotor, 0, 'a', ItemID.plateIron, 0, 'b', 325, 0, 'c', ItemID.circuitBasic, 0]);
    MachineRecipeRegistry.registerRecipesFor("oreWasher", {
        "ItemID.crushedCopper": [ItemID.crushedPurifiedCopper, 1, ItemID.dustSmallCopper, 2, ItemID.dustStone, 1],
        "ItemID.crushedTin": [ItemID.crushedPurifiedTin, 1, ItemID.dustSmallTin, 2, ItemID.dustStone, 1],
        "ItemID.crushedIron": [ItemID.crushedPurifiedIron, 1, ItemID.dustSmallIron, 2, ItemID.dustStone, 1],
        "ItemID.crushedGold": [ItemID.crushedPurifiedGold, 1, ItemID.dustSmallGold, 2, ItemID.dustStone, 1],
        "ItemID.crushedSilver": [ItemID.crushedPurifiedSilver, 1, ItemID.dustSmallSilver, 2, ItemID.dustStone, 1],
        "ItemID.crushedLead": [ItemID.crushedPurifiedLead, 1, ItemID.dustSmallSulfur, 3, ItemID.dustStone, 1],
        "ItemID.crushedUranium": [ItemID.crushedPurifiedUranium, 1, ItemID.dustSmallLead, 2, ItemID.dustStone, 1],
    }, true);
});
var guiOreWasher = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Ore Washing Plant") } },
        inventory: { standart: true },
        background: { standart: true },
    },
    drawing: [
        { type: "bitmap", x: 400, y: 50, bitmap: "ore_washer_background", scale: GUI_SCALE_NEW },
        { type: "bitmap", x: 415, y: 170, bitmap: "energy_small_background", scale: GUI_SCALE_NEW }
    ],
    elements: {
        "progressScale": { type: "scale", x: 400 + 98 * GUI_SCALE_NEW, y: 50 + 35 * GUI_SCALE_NEW, direction: 0, value: 0.5, bitmap: "ore_washer_bar_scale", scale: GUI_SCALE_NEW },
        "energyScale": { type: "scale", x: 415, y: 170, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE_NEW },
        "liquidScale": { type: "scale", x: 400 + 60 * GUI_SCALE_NEW, y: 50 + 21 * GUI_SCALE_NEW, direction: 1, value: 0.5, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE_NEW },
        "slotEnergy": { type: "slot", x: 400 + 3 * GUI_SCALE_NEW, y: 50 + 58 * GUI_SCALE_NEW, size: 54, isValid: MachineRegistry.isValidEUStorage },
        "slotLiquid1": { type: "slot", x: 400 + 33 * GUI_SCALE_NEW, y: 50 + 13 * GUI_SCALE_NEW, size: 54,
            isValid: function (id, count, data) {
                return LiquidLib.getItemLiquid(id, data) == "water";
            }
        },
        "slotLiquid2": { type: "slot", x: 400 + 33 * GUI_SCALE_NEW, y: 50 + 58 * GUI_SCALE_NEW, size: 54, isValid: function () { return false; } },
        "slotSource": { type: "slot", x: 400 + 99 * GUI_SCALE_NEW, y: 50 + 13 * GUI_SCALE_NEW, size: 54,
            isValid: function (id, count, data) {
                return MachineRecipeRegistry.hasRecipeFor("oreWasher", id, data);
            }
        },
        "slotResult1": { type: "slot", x: 400 + 81 * GUI_SCALE_NEW, y: 50 + 58 * GUI_SCALE_NEW, size: 54, isValid: function () { return false; } },
        "slotResult2": { type: "slot", x: 400 + 99 * GUI_SCALE_NEW, y: 50 + 58 * GUI_SCALE_NEW, size: 54, isValid: function () { return false; } },
        "slotResult3": { type: "slot", x: 400 + 117 * GUI_SCALE_NEW, y: 50 + 58 * GUI_SCALE_NEW, size: 54, isValid: function () { return false; } },
        "slotUpgrade1": { type: "slot", x: 860, y: 50 + 3 * GUI_SCALE_NEW, size: 54, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade2": { type: "slot", x: 860, y: 50 + 21 * GUI_SCALE_NEW, size: 54, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade3": { type: "slot", x: 860, y: 50 + 39 * GUI_SCALE_NEW, size: 54, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade4": { type: "slot", x: 860, y: 50 + 57 * GUI_SCALE_NEW, size: 54, isValid: UpgradeAPI.isValidUpgrade },
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiOreWasher, "Ore Washing Plant");
});
MachineRegistry.registerElectricMachine(BlockID.oreWasher, {
    defaultValues: {
        power_tier: 1,
        energy_storage: 10000,
        energy_consumption: 16,
        work_time: 500,
        meta: 0,
        progress: 0,
        isActive: false
    },
    upgrades: ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling", "fluidPulling"],
    getGuiScreen: function () {
        return guiOreWasher;
    },
    getTier: function () {
        return this.data.power_tier;
    },
    resetValues: function () {
        this.data.power_tier = this.defaultValues.power_tier;
        this.data.energy_storage = this.defaultValues.energy_storage;
        this.data.energy_consumption = this.defaultValues.energy_consumption;
        this.data.work_time = this.defaultValues.work_time;
    },
    init: function () {
        this.liquidStorage.setLimit("water", 8);
        this.renderModel();
    },
    checkResult: function (result) {
        for (var i = 1; i < 4; i++) {
            var id = result[(i - 1) * 2];
            var count = result[(i - 1) * 2 + 1];
            var resultSlot = this.container.getSlot("slotResult" + i);
            if ((resultSlot.id != id || resultSlot.count + count > 64) && resultSlot.id != 0) {
                return false;
            }
        }
        return true;
    },
    putResult: function (result) {
        this.liquidStorage.getLiquid("water", 1);
        for (var i = 1; i < 4; i++) {
            var id = result[(i - 1) * 2];
            var count = result[(i - 1) * 2 + 1];
            var resultSlot = this.container.getSlot("slotResult" + i);
            if (id) {
                resultSlot.id = id;
                resultSlot.count += count;
            }
        }
    },
    getLiquidFromItem: MachineRegistry.getLiquidFromItem,
    click: function (id, count, data, coords) {
        if (Entity.getSneaking(player)) {
            return this.getLiquidFromItem("water", { id: id, count: count, data: data }, null, true);
        }
    },
    tick: function () {
        this.resetValues();
        UpgradeAPI.executeUpgrades(this);
        var slot1 = this.container.getSlot("slotLiquid1");
        var slot2 = this.container.getSlot("slotLiquid2");
        this.getLiquidFromItem("water", slot1, slot2);
        var newActive = false;
        var sourceSlot = this.container.getSlot("slotSource");
        var result = MachineRecipeRegistry.getRecipeResult("oreWasher", sourceSlot.id);
        if (result && this.checkResult(result) && this.liquidStorage.getAmount("water") >= 1) {
            if (this.data.energy >= this.data.energy_consumption) {
                this.data.energy -= this.data.energy_consumption;
                this.data.progress += 1 / this.data.work_time;
                newActive = true;
            }
            if (this.data.progress.toFixed(3) >= 1) {
                sourceSlot.count--;
                this.putResult(result);
                this.container.validateAll();
                this.data.progress = 0;
            }
        }
        else {
            this.data.progress = 0;
        }
        this.setActive(newActive);
        var energyStorage = this.getEnergyStorage();
        this.data.energy = Math.min(this.data.energy, energyStorage);
        this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
        this.container.setScale("progressScale", this.data.progress);
        this.liquidStorage.updateUiScale("liquidScale", "water");
        this.container.setScale("energyScale", this.data.energy / energyStorage);
    },
    getEnergyStorage: function () {
        return this.data.energy_storage;
    },
    renderModel: MachineRegistry.renderModelWithRotation
});
TileRenderer.setRotationPlaceFunction(BlockID.oreWasher);
StorageInterface.createInterface(BlockID.oreWasher, {
    slots: {
        "slotSource": { input: true,
            isValid: function (item) {
                return MachineRecipeRegistry.hasRecipeFor("oreWasher", item.id, item.data);
            }
        },
        "slotLiquid1": { input: true,
            isValid: function (item) {
                return LiquidLib.getItemLiquid(item.id, item.data) == "water";
            }
        },
        "slotLiquid2": { output: true },
        "slotResult1": { output: true },
        "slotResult2": { output: true },
        "slotResult3": { output: true }
    },
    canReceiveLiquid: function (liquid, side) { return liquid == "water"; },
    canTransportLiquid: function (liquid, side) { return false; }
});
IDRegistry.genBlockID("thermalCentrifuge");
Block.createBlock("thermalCentrifuge", [
    { name: "Thermal Centrifuge", texture: [["machine_advanced", 0], ["thermal_centrifuge_top", 0], ["machine_back", 0], ["thermal_centrifuge_front", 0], ["thermal_centrifuge_side", 0], ["thermal_centrifuge_side", 0]], inCreative: true }
], "machine");
TileRenderer.setStandartModel(BlockID.thermalCentrifuge, [["machine_advanced", 0], ["thermal_centrifuge_top", 0], ["machine_side", 0], ["thermal_centrifuge_front", 0], ["thermal_centrifuge_side", 0], ["thermal_centrifuge_side", 0]]);
TileRenderer.registerRotationModel(BlockID.thermalCentrifuge, 0, [["machine_advanced", 0], ["thermal_centrifuge_top", 0], ["machine_side", 0], ["thermal_centrifuge_front", 0], ["thermal_centrifuge_side", 0], ["thermal_centrifuge_side", 0]]);
TileRenderer.registerRotationModel(BlockID.thermalCentrifuge, 4, [["machine_advanced", 0], ["thermal_centrifuge_top", 1], ["machine_side", 0], ["thermal_centrifuge_front", 1], ["thermal_centrifuge_side", 1], ["thermal_centrifuge_side", 1]]);
ItemName.addTierTooltip("thermalCentrifuge", 2);
MachineRegistry.setMachineDrop("thermalCentrifuge", BlockID.machineBlockAdvanced);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.thermalCentrifuge, count: 1, data: 0 }, [
        "cmc",
        "a#a",
        "axa"
    ], ['#', BlockID.machineBlockAdvanced, 0, 'x', ItemID.electricMotor, 0, 'a', 265, 0, 'm', ItemID.miningLaser, -1, 'c', ItemID.coil, 0]);
    MachineRecipeRegistry.registerRecipesFor("thermalCentrifuge", {
        //4: {result: [ItemID.dustStone, 1], heat: 100},
        "ItemID.crushedCopper": { result: [ItemID.dustSmallTin, 1, ItemID.dustCopper, 1, ItemID.dustStone, 1], heat: 500 },
        "ItemID.crushedTin": { result: [ItemID.dustSmallIron, 1, ItemID.dustTin, 1, ItemID.dustStone, 1], heat: 1000 },
        "ItemID.crushedIron": { result: [ItemID.dustSmallGold, 1, ItemID.dustIron, 1, ItemID.dustStone, 1], heat: 1500 },
        "ItemID.crushedSilver": { result: [ItemID.dustSmallLead, 1, ItemID.dustSilver, 1, ItemID.dustStone, 1], heat: 2000 },
        "ItemID.crushedGold": { result: [ItemID.dustSmallSilver, 1, ItemID.dustGold, 1, ItemID.dustStone, 1], heat: 2000 },
        "ItemID.crushedLead": { result: [ItemID.dustSmallSilver, 1, ItemID.dustLead, 1, ItemID.dustStone, 1], heat: 2000 },
        "ItemID.crushedUranium": { result: [ItemID.smallUranium235, 1, ItemID.uranium238, 4, ItemID.dustStone, 1], heat: 3000 },
        "ItemID.crushedPurifiedCopper": { result: [ItemID.dustSmallTin, 1, ItemID.dustCopper, 1], heat: 500 },
        "ItemID.crushedPurifiedTin": { result: [ItemID.dustSmallIron, 1, ItemID.dustTin, 1], heat: 1000 },
        "ItemID.crushedPurifiedIron": { result: [ItemID.dustSmallGold, 1, ItemID.dustIron, 1], heat: 1500 },
        "ItemID.crushedPurifiedSilver": { result: [ItemID.dustSmallLead, 1, ItemID.dustSilver, 1], heat: 2000 },
        "ItemID.crushedPurifiedGold": { result: [ItemID.dustSmallSilver, 1, ItemID.dustGold, 1], heat: 2000 },
        "ItemID.crushedPurifiedLead": { result: [ItemID.dustSmallSilver, 1, ItemID.dustLead, 1], heat: 2000 },
        "ItemID.crushedPurifiedUranium": { result: [ItemID.smallUranium235, 2, ItemID.uranium238, 5], heat: 3000 },
        "ItemID.slag": { result: [ItemID.dustSmallGold, 1, ItemID.dustCoal, 1], heat: 1500 },
        "ItemID.fuelRodDepletedUranium": { result: [ItemID.smallPlutonium, 1, ItemID.uranium238, 4, ItemID.dustIron, 1], heat: 4000 },
        "ItemID.fuelRodDepletedUranium2": { result: [ItemID.smallPlutonium, 2, ItemID.uranium238, 8, ItemID.dustIron, 3], heat: 4000 },
        "ItemID.fuelRodDepletedUranium4": { result: [ItemID.smallPlutonium, 4, ItemID.uranium238, 16, ItemID.dustIron, 6], heat: 4000 },
        "ItemID.fuelRodDepletedMOX": { result: [ItemID.smallPlutonium, 1, ItemID.plutonium, 3, ItemID.dustIron, 1], heat: 5000 },
        "ItemID.fuelRodDepletedMOX2": { result: [ItemID.smallPlutonium, 2, ItemID.plutonium, 6, ItemID.dustIron, 3], heat: 5000 },
        "ItemID.fuelRodDepletedMOX4": { result: [ItemID.smallPlutonium, 4, ItemID.plutonium, 12, ItemID.dustIron, 6], heat: 5000 },
        "ItemID.rtgPellet": { result: [ItemID.plutonium, 3, ItemID.dustIron, 54], heat: 5000 },
    }, true);
});
var guiCentrifuge = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Thermal Centrifuge") } },
        inventory: { standart: true },
        background: { standart: true },
    },
    drawing: [
        { type: "bitmap", x: 400 + 36 * GUI_SCALE_NEW, y: 50 + 15 * GUI_SCALE_NEW, bitmap: "thermal_centrifuge_background", scale: GUI_SCALE_NEW },
        { type: "bitmap", x: 400 + 8 * GUI_SCALE_NEW, y: 50 + 38 * GUI_SCALE_NEW, bitmap: "energy_small_background", scale: GUI_SCALE_NEW }
    ],
    elements: {
        "progressScale": { type: "scale", x: 400 + 80 * GUI_SCALE_NEW, y: 50 + 22 * GUI_SCALE_NEW, direction: 1, value: 0.5, bitmap: "thermal_centrifuge_scale", scale: GUI_SCALE_NEW },
        "heatScale": { type: "scale", x: 400 + 64 * GUI_SCALE_NEW, y: 50 + 63 * GUI_SCALE_NEW, direction: 0, value: 0.5, bitmap: "heat_scale", scale: GUI_SCALE_NEW },
        "energyScale": { type: "scale", x: 400 + 8 * GUI_SCALE_NEW, y: 50 + 38 * GUI_SCALE_NEW, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE_NEW },
        "slotEnergy": { type: "slot", x: 400 + 6 * GUI_SCALE_NEW, y: 50 + 56 * GUI_SCALE_NEW, size: 54, isValid: MachineRegistry.isValidEUStorage },
        "slotSource": { type: "slot", x: 400 + 6 * GUI_SCALE_NEW, y: 50 + 16 * GUI_SCALE_NEW, size: 54, isValid: function (id, count, data) {
                return MachineRecipeRegistry.hasRecipeFor("thermalCentrifuge", id);
            } },
        "slotResult1": { type: "slot", x: 400 + 119 * GUI_SCALE_NEW, y: 50 + 13 * GUI_SCALE_NEW, size: 54, isValid: function () { return false; } },
        "slotResult2": { type: "slot", x: 400 + 119 * GUI_SCALE_NEW, y: 50 + 31 * GUI_SCALE_NEW, size: 54, isValid: function () { return false; } },
        "slotResult3": { type: "slot", x: 400 + 119 * GUI_SCALE_NEW, y: 50 + 49 * GUI_SCALE_NEW, size: 54, isValid: function () { return false; } },
        "slotUpgrade1": { type: "slot", x: 860, y: 50 + 3 * GUI_SCALE_NEW, size: 54, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade2": { type: "slot", x: 860, y: 50 + 21 * GUI_SCALE_NEW, size: 54, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade3": { type: "slot", x: 860, y: 50 + 39 * GUI_SCALE_NEW, size: 54, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade4": { type: "slot", x: 860, y: 50 + 57 * GUI_SCALE_NEW, size: 54, isValid: UpgradeAPI.isValidUpgrade },
        "indicator": { type: "image", x: 400 + 88 * GUI_SCALE_NEW, y: 50 + 59 * GUI_SCALE_NEW, bitmap: "indicator_red", scale: GUI_SCALE_NEW }
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiCentrifuge, "Thermal Centrifuge");
});
MachineRegistry.registerElectricMachine(BlockID.thermalCentrifuge, {
    defaultValues: {
        power_tier: 2,
        energy_storage: 30000,
        energy_consumption: 48,
        work_time: 500,
        meta: 0,
        progress: 0,
        isActive: false,
        isHeating: false,
        heat: 0,
        maxHeat: 5000,
        signal: 0
    },
    upgrades: ["overclocker", "transformer", "energyStorage", "redstone", "itemEjector", "itemPulling"],
    getGuiScreen: function () {
        return guiCentrifuge;
    },
    getTier: function () {
        return this.data.power_tier;
    },
    resetValues: function () {
        this.data.power_tier = this.defaultValues.power_tier;
        this.data.energy_storage = this.defaultValues.energy_storage;
        this.data.energy_consumption = this.defaultValues.energy_consumption;
        this.data.work_time = this.defaultValues.work_time;
        this.data.isHeating = this.data.signal > 0;
    },
    checkResult: function (result) {
        for (var i = 1; i < 4; i++) {
            var id = result[(i - 1) * 2];
            var count = result[(i - 1) * 2 + 1];
            var resultSlot = this.container.getSlot("slotResult" + i);
            if ((resultSlot.id != id || resultSlot.count + count > 64) && resultSlot.id != 0) {
                return false;
            }
        }
        return true;
    },
    putResult: function (result) {
        for (var i = 1; i < 4; i++) {
            var id = result[(i - 1) * 2];
            var count = result[(i - 1) * 2 + 1];
            var resultSlot = this.container.getSlot("slotResult" + i);
            if (id) {
                resultSlot.id = id;
                resultSlot.count += count;
            }
        }
    },
    tick: function () {
        this.resetValues();
        UpgradeAPI.executeUpgrades(this);
        if (this.data.isHeating) {
            this.data.maxHeat = 5000;
        }
        var newActive = false;
        var sourceSlot = this.container.getSlot("slotSource");
        var result = MachineRecipeRegistry.getRecipeResult("thermalCentrifuge", sourceSlot.id);
        if (result && this.checkResult(result.result) && this.data.energy > 0) {
            this.data.maxHeat = result.heat;
            if (this.data.heat < result.heat) {
                this.data.energy--;
                this.data.heat++;
            }
            else if (this.data.energy >= this.data.energy_consumption) {
                this.data.energy -= this.data.energy_consumption;
                this.data.progress += 1 / this.data.work_time;
                newActive = true;
            }
            if (this.data.progress.toFixed(3) >= 1) {
                sourceSlot.count--;
                this.putResult(result.result);
                this.container.validateAll();
                this.data.progress = 0;
            }
        }
        else {
            this.data.maxHeat = 5000;
            this.data.progress = 0;
            if (this.data.isHeating && this.data.energy > 1) {
                if (this.data.heat < 5000) {
                    this.data.heat++;
                }
                this.data.energy -= 2;
            }
            else if (this.data.heat > 0) {
                this.data.heat--;
            }
        }
        this.setActive(newActive);
        var energyStorage = this.getEnergyStorage();
        this.data.energy = Math.min(this.data.energy, energyStorage);
        this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
        var content = this.container.getGuiContent();
        if (content) {
            if (this.data.heat >= this.data.maxHeat) {
                content.elements["indicator"].bitmap = "indicator_green";
            }
            else {
                content.elements["indicator"].bitmap = "indicator_red";
            }
        }
        this.container.setScale("progressScale", this.data.progress);
        this.container.setScale("heatScale", this.data.heat / this.data.maxHeat);
        this.container.setScale("energyScale", this.data.energy / energyStorage);
    },
    redstone: function (signal) {
        this.data.signal = signal.power > 0;
    },
    getEnergyStorage: function () {
        return this.data.energy_storage;
    },
    renderModel: MachineRegistry.renderModelWithRotation
});
TileRenderer.setRotationPlaceFunction(BlockID.thermalCentrifuge);
StorageInterface.createInterface(BlockID.thermalCentrifuge, {
    slots: {
        "slotSource": { input: true },
        "slotResult1": { output: true },
        "slotResult2": { output: true },
        "slotResult3": { output: true }
    },
    isValidInput: function (item) {
        return MachineRecipeRegistry.hasRecipeFor("thermalCentrifuge", item.id);
    }
});
IDRegistry.genBlockID("blastFurnace");
Block.createBlock("blastFurnace", [
    { name: "Blast Furnace", texture: [["machine_advanced", 0], ["ind_furnace_side", 0], ["machine_back", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], inCreative: true },
], "machine");
TileRenderer.setStandartModel(BlockID.blastFurnace, [["machine_advanced", 0], ["ind_furnace_side", 0], ["machine_back", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.blastFurnace, 0, [["machine_advanced", 0], ["ind_furnace_side", 0], ["machine_back", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.blastFurnace, 6, [["machine_advanced", 0], ["ind_furnace_side", 1], ["machine_back", 0], ["heat_pipe", 1], ["ind_furnace_side", 1], ["ind_furnace_side", 1]]);
MachineRegistry.setMachineDrop("blastFurnace", BlockID.machineBlockBasic);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.blastFurnace, count: 1, data: 0 }, [
        "aaa",
        "asa",
        "axa"
    ], ['s', BlockID.machineBlockBasic, 0, 'a', ItemID.casingIron, 0, 'x', ItemID.heatConductor, 0]);
    MachineRecipeRegistry.registerRecipesFor("blastFurnace", {
        15: { result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000 },
        265: { result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000 },
        "ItemID.dustIron": { result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000 },
        "ItemID.crushedPurifiedIron": { result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000 },
        "ItemID.crushedIron": { result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000 }
    }, true);
});
var guiBlastFurnace = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Blast Furnace") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 450, y: 50, bitmap: "blast_furnace_background", scale: GUI_SCALE_NEW }
    ],
    elements: {
        "progressScale": { type: "scale", x: 450 + 50 * GUI_SCALE_NEW, y: 50 + 27 * GUI_SCALE_NEW, direction: 1, value: 0.5, bitmap: "blast_furnace_scale", scale: GUI_SCALE_NEW },
        "heatScale": { type: "scale", x: 450 + 46 * GUI_SCALE_NEW, y: 50 + 63 * GUI_SCALE_NEW, direction: 0, value: 0.5, bitmap: "heat_scale", scale: GUI_SCALE_NEW },
        "slotSource": { type: "slot", x: 450 + 9 * GUI_SCALE_NEW, y: 50 + 25 * GUI_SCALE_NEW, isValid: function (id) {
                return MachineRecipeRegistry.hasRecipeFor("blastFurnace", id);
            } },
        "slotResult1": { type: "slot", x: 450 + 108 * GUI_SCALE_NEW, y: 50 + 48 * GUI_SCALE_NEW, size: 54, isValid: function () { return false; } },
        "slotResult2": { type: "slot", x: 450 + 126 * GUI_SCALE_NEW, y: 50 + 48 * GUI_SCALE_NEW, size: 54, isValid: function () { return false; } },
        "slotAir1": { type: "slot", x: 450, y: 50 + 48 * GUI_SCALE_NEW, bitmap: "slot_black", size: 54, isValid: function (id) { return id == ItemID.cellAir; } },
        "slotAir2": { type: "slot", x: 450 + 18 * GUI_SCALE_NEW, y: 50 + 48 * GUI_SCALE_NEW, bitmap: "slot_black", size: 54, isValid: function () { return false; } },
        "slotUpgrade1": { type: "slot", x: 450 + 126 * GUI_SCALE_NEW, y: 50, size: 54, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade2": { type: "slot", x: 450 + 126 * GUI_SCALE_NEW, y: 50 + 18 * GUI_SCALE_NEW, size: 54, isValid: UpgradeAPI.isValidUpgrade },
        "indicator": { type: "image", x: 450 + 71 * GUI_SCALE_NEW, y: 50 + 59 * GUI_SCALE_NEW, bitmap: "indicator_red", scale: GUI_SCALE_NEW }
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiBlastFurnace, "Blast Furnace");
});
MachineRegistry.registerPrototype(BlockID.blastFurnace, {
    defaultValues: {
        meta: 0,
        progress: 0,
        air: 0,
        sourceID: 0,
        isActive: false,
        isHeating: false,
        heat: 0,
        signal: 0
    },
    upgrades: ["redstone", "itemEjector", "itemPulling"],
    getGuiScreen: function () {
        return guiBlastFurnace;
    },
    wrenchClick: function (id, count, data, coords) {
        this.setFacing(coords.side);
    },
    setFacing: MachineRegistry.setFacing,
    checkResult: function (result) {
        for (var i = 1; i < 3; i++) {
            var id = result[(i - 1) * 2];
            var count = result[(i - 1) * 2 + 1];
            var resultSlot = this.container.getSlot("slotResult" + i);
            if ((resultSlot.id != id || resultSlot.count + count > 64) && resultSlot.id != 0) {
                return false;
            }
        }
        return true;
    },
    putResult: function (result) {
        for (var i = 1; i < 3; i++) {
            var id = result[(i - 1) * 2];
            var count = result[(i - 1) * 2 + 1];
            var resultSlot = this.container.getSlot("slotResult" + i);
            if (id) {
                resultSlot.id = id;
                resultSlot.count += count;
            }
        }
    },
    controlAir: function () {
        var slot1 = this.container.getSlot("slotAir1");
        var slot2 = this.container.getSlot("slotAir2");
        if (this.data.air == 0) {
            if (slot1.id == ItemID.cellAir && (slot2.id == 0 || slot2.id == ItemID.cellEmpty && slot2.count < 64)) {
                slot1.count--;
                slot2.id = ItemID.cellEmpty;
                slot2.count++;
                this.data.air = 1000;
            }
        }
        if (this.data.air > 0) {
            this.data.air--;
            return true;
        }
        return false;
    },
    controlAirImage: function (content, set) {
        if (content) {
            if (set)
                content.elements["indicatorAir"] = null;
            else
                content.elements["indicatorAir"] = { type: "image", x: 344 + 110 * GUI_SCALE_NEW, y: 53 + 20 * GUI_SCALE_NEW, bitmap: "no_air_image", scale: GUI_SCALE_NEW };
        }
    },
    setIndicator: function (content, set) {
        if (content) {
            if (set)
                content.elements["indicator"].bitmap = "indicator_green";
            else
                content.elements["indicator"].bitmap = "indicator_red";
        }
    },
    tick: function () {
        this.data.isHeating = this.data.signal > 0;
        UpgradeAPI.executeUpgrades(this);
        var maxHeat = this.getMaxHeat();
        this.data.heat = Math.min(this.data.heat, maxHeat);
        this.container.setScale("heatScale", this.data.heat / maxHeat);
        var content = this.container.getGuiContent();
        if (this.data.heat >= maxHeat) {
            this.setIndicator(content, true);
            var sourceSlot = this.container.getSlot("slotSource");
            var source = this.data.sourceID || sourceSlot.id;
            var result = MachineRecipeRegistry.getRecipeResult("blastFurnace", source);
            if (result && this.checkResult(result.result)) {
                if (this.controlAir()) {
                    this.controlAirImage(content, true);
                    this.data.progress++;
                    this.container.setScale("progressScale", this.data.progress / result.duration);
                    this.activate();
                    if (!this.data.sourceID) {
                        this.data.sourceID = source;
                        sourceSlot.count--;
                    }
                    if (this.data.progress >= result.duration) {
                        this.putResult(result.result);
                        this.data.progress = 0;
                        this.data.sourceID = 0;
                    }
                    this.container.validateAll();
                }
                else
                    this.controlAirImage(content, false);
            }
        }
        else {
            this.setIndicator(content, false);
            this.deactivate();
        }
        if (this.data.heat > 0)
            this.data.heat--;
        if (this.data.sourceID == 0) {
            this.container.setScale("progressScale", 0);
        }
    },
    getMaxHeat: function () {
        return 50000;
    },
    redstone: function (signal) {
        this.data.signal = signal.power > 0;
    },
    canReceiveHeat: function (side) {
        return this.data.meta == side;
    },
    heatReceive: function (amount) {
        var slot = this.container.getSlot("slotSource");
        if (this.data.isHeating || this.data.sourceID > 0 || MachineRecipeRegistry.getRecipeResult("blastFurnace", slot.id)) {
            amount = Math.min(this.getMaxHeat() - this.data.heat, amount);
            this.data.heat += amount + 1;
            return amount;
        }
        return 0;
    },
    renderModel: MachineRegistry.renderModelWith6Variations,
});
TileRenderer.setRotationPlaceFunction(BlockID.blastFurnace, true);
StorageInterface.createInterface(BlockID.blastFurnace, {
    slots: {
        "slotSource": { input: true,
            isValid: function (item) {
                return MachineRecipeRegistry.hasRecipeFor("blastFurnace", item.id);
            }
        },
        "slotAir1": { input: true,
            isValid: function (item) {
                return item.id == ItemID.cellAir;
            }
        },
        "slotAir2": { output: true },
        "slotResult1": { output: true },
        "slotResult2": { output: true }
    }
});
IDRegistry.genBlockID("icFermenter");
Block.createBlock("icFermenter", [
    { name: "Fermenter", texture: [["machine_bottom", 0], ["machine_top", 0], ["ic_fermenter_back", 0], ["heat_pipe", 0], ["ic_fermenter_side", 0], ["ic_fermenter_side", 0]], inCreative: true },
], "machine");
TileRenderer.setStandartModel(BlockID.icFermenter, [["machine_bottom", 0], ["machine_top", 0], ["ic_fermenter_back", 0], ["heat_pipe", 0], ["ic_fermenter_side", 0], ["ic_fermenter_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.icFermenter, 0, [["machine_bottom", 0], ["machine_top", 0], ["ic_fermenter_back", 0], ["heat_pipe", 0], ["ic_fermenter_side", 0], ["ic_fermenter_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.icFermenter, 6, [["machine_bottom", 0], ["machine_top", 0], ["ic_fermenter_back", 1], ["heat_pipe", 1], ["ic_fermenter_side", 1], ["ic_fermenter_side", 1]]);
MachineRegistry.setMachineDrop("icFermenter");
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.icFermenter, count: 1, data: 0 }, [
        "aaa",
        "ccc",
        "axa"
    ], ['c', ItemID.cellEmpty, 0, 'a', ItemID.casingIron, 0, 'x', ItemID.heatConductor, 0]);
});
var guiFermenter = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Fermenter") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 390, y: 80, bitmap: "fermenter_background", scale: GUI_SCALE },
        { type: "bitmap", x: 758, y: 95, bitmap: "liquid_bar", scale: GUI_SCALE }
    ],
    elements: {
        "progressScale": { type: "scale", x: 492, y: 150, direction: 0, value: .5, bitmap: "fermenter_progress_scale", scale: GUI_SCALE },
        "fertilizerScale": { type: "scale", x: 480, y: 301, direction: 0, value: .5, bitmap: "fertilizer_progress_scale", scale: GUI_SCALE },
        "biogasScale": { type: "scale", x: 771, y: 108, direction: 1, value: .5, bitmap: "liquid_biogas", scale: GUI_SCALE },
        "biomassScale": { type: "scale", x: 483, y: 179, direction: 1, value: .5, bitmap: "biomass_scale", scale: GUI_SCALE },
        "slotBiomass0": { type: "slot", x: 400, y: 162, isValid: function (id, count, data) {
                return LiquidLib.getItemLiquid(id, data) == "biomass";
            } },
        "slotBiomass1": { type: "slot", x: 400, y: 222, isValid: function () { return false; } },
        "slotFertilizer": { type: "slot", x: 634, y: 282, bitmap: "slot_black", isValid: function () { return false; } },
        "slotBiogas0": { type: "slot", x: 832, y: 155, isValid: function (id, count, data) {
                return LiquidLib.getFullItem(id, data, "biogas") ? true : false;
            } },
        "slotBiogas1": { type: "slot", x: 832, y: 215, isValid: function () { return false; } },
        "slotUpgrade1": { type: "slot", x: 765, y: 290, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade2": { type: "slot", x: 825, y: 290, isValid: UpgradeAPI.isValidUpgrade }
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiFermenter, "Fermenter");
});
MachineRegistry.registerPrototype(BlockID.icFermenter, {
    defaultValues: {
        meta: 0,
        heat: 0,
        progress: 0,
        fertilizer: 0,
        isActive: false,
    },
    upgrades: ["itemEjector", "itemPulling", "fluidEjector", "fluidPulling"],
    getGuiScreen: function () {
        return guiFermenter;
    },
    setFacing: MachineRegistry.setFacing,
    init: function () {
        this.liquidStorage.setLimit("biomass", 10);
        this.liquidStorage.setLimit("biogas", 2);
        this.renderModel();
    },
    getLiquidFromItem: MachineRegistry.getLiquidFromItem,
    addLiquidToItem: MachineRegistry.addLiquidToItem,
    click: function (id, count, data, coords) {
        var liquid = this.liquidStorage.getLiquidStored();
        if (Entity.getSneaking(player) && this.getLiquidFromItem("biogas", { id: id, count: count, data: data }, null, true)) {
            return true;
        }
        if (ICTool.isValidWrench(id, data, 10)) {
            if (this.setFacing(coords.side))
                ICTool.useWrench(id, data, 10);
            return true;
        }
        return false;
    },
    tick: function () {
        StorageInterface.checkHoppers(this);
        UpgradeAPI.executeUpgrades(this);
        this.setActive(this.data.heat > 0);
        if (this.data.heat > 0) {
            this.data.progress += this.data.heat;
            this.data.heat = 0;
            if (this.data.progress >= 4000) {
                this.liquidStorage.getLiquid("biomass", 0.02);
                this.liquidStorage.addLiquid("biogas", 0.4);
                this.data.fertilizer++;
                this.data.progress = 0;
            }
            var outputSlot = this.container.getSlot("slotFertilizer");
            if (this.data.fertilizer >= 25) {
                this.data.fertilizer = 0;
                outputSlot.id = ItemID.fertilizer;
                outputSlot.count++;
            }
        }
        var slot1 = this.container.getSlot("slotBiomass0");
        var slot2 = this.container.getSlot("slotBiomass1");
        this.getLiquidFromItem("biomass", slot1, slot2);
        var slot1 = this.container.getSlot("slotBiogas0");
        var slot2 = this.container.getSlot("slotBiogas1");
        this.addLiquidToItem("biogas", slot1, slot2);
        this.container.setScale("progressScale", this.data.progress / 4000);
        this.container.setScale("fertilizerScale", this.data.fertilizer / 25);
        this.liquidStorage.updateUiScale("biomassScale", "biomass");
        this.liquidStorage.updateUiScale("biogasScale", "biogas");
    },
    canReceiveHeat: function (side) {
        return this.data.meta == side;
    },
    heatReceive: function (amount) {
        var outputSlot = this.container.getSlot("slotFertilizer");
        if (this.liquidStorage.getAmount("biomass").toFixed(3) >= 0.02 && this.liquidStorage.getAmount("biogas") <= 1.6 && outputSlot.count < 64) {
            this.data.heat = amount;
            return amount;
        }
        return 0;
    },
    renderModel: MachineRegistry.renderModelWith6Variations
});
TileRenderer.setRotationPlaceFunction(BlockID.icFermenter, true);
StorageInterface.createInterface(BlockID.icFermenter, {
    slots: {
        "slotBiomass0": { input: true },
        "slotBiomass1": { output: true },
        "slotBiogas0": { input: true },
        "slotBiogas1": { output: true },
        "slotFertilizer": { output: true }
    },
    canReceiveLiquid: function (liquid, side) {
        return liquid == "biomass";
    },
    canTransportLiquid: function (liquid, side) { return true; },
    getLiquidStored: function (storage) {
        return storage == "input" ? "biomass" : "biogas";
    }
});
IDRegistry.genBlockID("massFabricator");
Block.createBlock("massFabricator", [
    { name: "Mass Fabricator", texture: [["machine_advanced_bottom", 0], ["machine_advanced", 0], ["machine_advanced_side", 0], ["mass_fab_front", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0]], inCreative: true }
], "machine");
TileRenderer.setStandartModel(BlockID.massFabricator, [["machine_advanced_bottom", 0], ["machine_advanced", 0], ["machine_advanced_side", 0], ["mass_fab_front", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0]]);
TileRenderer.registerRotationModel(BlockID.massFabricator, 0, [["machine_advanced_bottom", 0], ["machine_advanced", 0], ["machine_advanced_side", 0], ["mass_fab_front", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0]]);
TileRenderer.registerRotationModel(BlockID.massFabricator, 4, [["machine_advanced_bottom", 0], ["machine_advanced", 0], ["machine_advanced_side", 0], ["mass_fab_front", 1], ["machine_advanced_side", 0], ["machine_advanced_side", 0]]);
ItemName.setRarity(BlockID.massFabricator, 2, true);
ItemName.addTierTooltip("massFabricator", 4);
MachineRegistry.setMachineDrop("massFabricator", BlockID.machineBlockAdvanced);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.massFabricator, count: 1, data: 0 }, [
        "xax",
        "b#b",
        "xax"
    ], ['b', BlockID.machineBlockAdvanced, 0, 'x', 348, 0, 'a', ItemID.circuitAdvanced, 0, '#', ItemID.storageLapotronCrystal, -1]);
});
var ENERGY_PER_MATTER = 1000000;
var guiMassFabricator = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Mass Fabricator") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 850, y: 190, bitmap: "energy_small_background", scale: GUI_SCALE }
    ],
    elements: {
        "energyScale": { type: "scale", x: 850, y: 190, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE },
        "matterSlot": { type: "slot", x: 821, y: 75, size: 100, isValid: function () { return false; } },
        "catalyserSlot": { type: "slot", x: 841, y: 252, isValid: function (id) {
                return MachineRecipeRegistry.hasRecipeFor("catalyser", id);
            } },
        "textInfo1": { type: "text", x: 542, y: 142, width: 200, height: 30, text: "Progress:" },
        "textInfo2": { type: "text", x: 542, y: 177, width: 200, height: 30, text: "0%" },
        "textInfo3": { type: "text", x: 542, y: 212, width: 200, height: 30, text: " " },
        "textInfo4": { type: "text", x: 542, y: 239, width: 200, height: 30, text: " " },
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiMassFabricator, "Mass Fabricator");
});
MachineRegistry.registerElectricMachine(BlockID.massFabricator, {
    defaultValues: {
        meta: 0,
        progress: 0,
        catalyser: 0,
        isEnabled: true,
        isActive: false
    },
    getGuiScreen: function () {
        return guiMassFabricator;
    },
    getTier: function () {
        return 4;
    },
    tick: function () {
        StorageInterface.checkHoppers(this);
        this.container.setScale("energyScale", this.data.progress / ENERGY_PER_MATTER);
        this.container.setText("textInfo2", parseInt(100 * this.data.progress / ENERGY_PER_MATTER) + "%");
        if (this.data.isEnabled && this.data.energy > 0) {
            this.activate();
            this.startPlaySound();
            if (this.data.catalyser < Math.max(1000, this.data.energy)) {
                var catalyserSlot = this.container.getSlot("catalyserSlot");
                var catalyserData = MachineRecipeRegistry.getRecipeResult("catalyser", catalyserSlot.id);
                if (catalyserData) {
                    this.data.catalyser += catalyserData.input;
                    catalyserSlot.count--;
                    this.container.validateAll();
                }
            }
            if (this.data.catalyser > 0) {
                this.container.setText("textInfo3", "Catalyser:");
                this.container.setText("textInfo4", parseInt(this.data.catalyser));
                var transfer = Math.min((ENERGY_PER_MATTER - this.data.progress) / 6, Math.min(this.data.catalyser, this.data.energy));
                this.data.progress += transfer * 6;
                this.data.energy -= transfer;
                this.data.catalyser -= transfer;
                if (World.getThreadTime() % 40 == 0 && transfer > 0) {
                    SoundManager.playSoundAtBlock(this, "MassFabScrapSolo.ogg", 1);
                }
            }
            else {
                this.container.setText("textInfo3", "");
                this.container.setText("textInfo4", "");
            }
            var transfer = Math.min(ENERGY_PER_MATTER - this.data.progress, this.data.energy);
            this.data.progress += transfer;
            this.data.energy -= transfer;
        }
        else {
            this.stopPlaySound();
            this.deactivate();
        }
        if (this.data.progress >= ENERGY_PER_MATTER) {
            var matterSlot = this.container.getSlot("matterSlot");
            if (matterSlot.id == ItemID.matter && matterSlot.count < 64 || matterSlot.id == 0) {
                matterSlot.id = ItemID.matter;
                matterSlot.count++;
                this.data.progress = 0;
            }
        }
    },
    redstone: function (signal) {
        this.data.isEnabled = (signal.power == 0);
    },
    getOperationSound: function () {
        return "MassFabLoop.ogg";
    },
    getEnergyStorage: function () {
        return ENERGY_PER_MATTER - this.data.progress;
    },
    getExplosionPower: function () {
        return 15;
    },
    renderModel: MachineRegistry.renderModelWithRotation
});
TileRenderer.setRotationPlaceFunction(BlockID.massFabricator);
StorageInterface.createInterface(BlockID.massFabricator, {
    slots: {
        "catalyserSlot": { input: true },
        "matterSlot": { output: true }
    },
    isValidInput: function (item) {
        return MachineRecipeRegistry.hasRecipeFor("catalyser", item.id);
    }
});
IDRegistry.genBlockID("pump");
Block.createBlock("pump", [
    { name: "Pump", texture: [["pump_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["pump_front", 0], ["pump_side", 0], ["pump_side", 0]], inCreative: true }
], "machine");
TileRenderer.setStandartModel(BlockID.pump, [["pump_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["pump_front", 0], ["pump_side", 0], ["pump_side", 0]]);
TileRenderer.registerRotationModel(BlockID.pump, 0, [["pump_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["pump_front", 0], ["pump_side", 0], ["pump_side", 0]]);
TileRenderer.registerRotationModel(BlockID.pump, 4, [["pump_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["pump_front", 1], ["pump_side", 1], ["pump_side", 1]]);
ItemName.addTierTooltip("pump", 1);
MachineRegistry.setMachineDrop("pump", BlockID.machineBlockBasic);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.pump, count: 1, data: 0 }, [
        "cxc",
        "c#c",
        "bab"
    ], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'a', ItemID.treetap, 0, 'b', BlockID.miningPipe, 0, 'c', ItemID.cellEmpty, 0]);
});
var guiPump = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Pump") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 493, y: 149, bitmap: "extractor_bar_background", scale: GUI_SCALE },
        { type: "bitmap", x: 407, y: 127, bitmap: "energy_small_background", scale: GUI_SCALE },
        { type: "bitmap", x: 602, y: 88, bitmap: "liquid_bar", scale: GUI_SCALE },
        { type: "bitmap", x: 675, y: 152, bitmap: "pump_arrow", scale: GUI_SCALE },
    ],
    elements: {
        "progressScale": { type: "scale", x: 493, y: 149, direction: 0, value: 0.5, bitmap: "extractor_bar_scale", scale: GUI_SCALE },
        "energyScale": { type: "scale", x: 407, y: 127, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE },
        "liquidScale": { type: "scale", x: 400 + 67 * GUI_SCALE, y: 50 + 16 * GUI_SCALE, direction: 1, value: 0.5, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE },
        "slotEnergy": { type: "slot", x: 400, y: 50 + 39 * GUI_SCALE, isValid: MachineRegistry.isValidEUStorage },
        "slotLiquid1": { type: "slot", x: 400 + 91 * GUI_SCALE, y: 50 + 12 * GUI_SCALE,
            isValid: function (id, count, data) {
                return LiquidLib.getFullItem(id, data, "water") ? true : false;
            }
        },
        "slotLiquid2": { type: "slot", x: 400 + 125 * GUI_SCALE, y: 50 + 29 * GUI_SCALE, isValid: function () { return false; } },
        "slotUpgrade1": { type: "slot", x: 880, y: 50 + 2 * GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade2": { type: "slot", x: 880, y: 50 + 21 * GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade3": { type: "slot", x: 880, y: 50 + 40 * GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade4": { type: "slot", x: 880, y: 50 + 59 * GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade },
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiPump, "Pump");
});
MachineRegistry.registerElectricMachine(BlockID.pump, {
    defaultValues: {
        power_tier: 1,
        energy_storage: 800,
        energy_consumption: 1,
        work_time: 20,
        progress: 0,
        isActive: false,
        coords: null
    },
    upgrades: ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling", "fluidEjector"],
    getGuiScreen: function () {
        return guiPump;
    },
    getTier: function () {
        return this.data.power_tier;
    },
    resetValues: function () {
        this.data.power_tier = this.defaultValues.power_tier;
        this.data.energy_storage = this.defaultValues.energy_storage;
        this.data.energy_consumption = this.defaultValues.energy_consumption;
        this.data.work_time = this.defaultValues.work_time;
    },
    renderModel: MachineRegistry.renderModelWithRotation,
    addLiquidToItem: MachineRegistry.addLiquidToItem,
    init: function () {
        this.liquidStorage.setLimit("water", 8);
        this.liquidStorage.setLimit("lava", 8);
        this.renderModel();
    },
    getLiquidType: function (liquid, block) {
        if ((!liquid || liquid == "water") && (block.id == 8 || block.id == 9)) {
            return "water";
        }
        if ((!liquid || liquid == "lava") && (block.id == 10 || block.id == 11)) {
            return "lava";
        }
        return null;
    },
    recursiveSearch: function (liquid, x, y, z, map) {
        var block = World.getBlock(x, y, z);
        var scoords = x + ':' + y + ':' + z;
        if (!map[scoords] && Math.abs(this.x - x) <= 64 && Math.abs(this.z - z) <= 64 && this.getLiquidType(liquid, block)) {
            if (block.data == 0)
                return { x: x, y: y, z: z };
            map[scoords] = true;
            return this.recursiveSearch(liquid, x, y + 1, z, map) ||
                this.recursiveSearch(liquid, x + 1, y, z, map) ||
                this.recursiveSearch(liquid, x - 1, y, z, map) ||
                this.recursiveSearch(liquid, x, y, z + 1, map) ||
                this.recursiveSearch(liquid, x, y, z - 1, map);
        }
        return null;
    },
    tick: function () {
        this.resetValues();
        UpgradeAPI.executeUpgrades(this);
        var newActive = false;
        var liquid = this.liquidStorage.getLiquidStored();
        if (this.y > 0 && this.liquidStorage.getAmount(liquid) <= 7 && this.data.energy >= this.data.energy_consumption) {
            if (this.data.progress == 0) {
                this.data.coords = this.recursiveSearch(liquid, this.x, this.y - 1, this.z, {});
            }
            if (this.data.coords) {
                newActive = true;
                this.data.energy -= this.data.energy_consumption;
                this.data.progress += 1 / this.data.work_time;
                this.startPlaySound();
                if (this.data.progress.toFixed(3) >= 1) {
                    var coords = this.data.coords;
                    var block = World.getBlock(coords.x, coords.y, coords.z);
                    liquid = this.getLiquidType(liquid, block);
                    if (liquid && block.data == 0) {
                        World.setBlock(coords.x, coords.y, coords.z, 0);
                        this.liquidStorage.addLiquid(liquid, 1);
                    }
                    this.data.progress = 0;
                }
            }
        }
        else {
            this.data.progress = 0;
        }
        if (!newActive)
            this.stopPlaySound();
        this.setActive(newActive);
        var slot1 = this.container.getSlot("slotLiquid1");
        var slot2 = this.container.getSlot("slotLiquid2");
        this.addLiquidToItem(liquid, slot1, slot2);
        var energyStorage = this.getEnergyStorage();
        this.data.energy = Math.min(this.data.energy, energyStorage);
        this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
        this.container.setScale("progressScale", this.data.progress);
        this.liquidStorage.updateUiScale("liquidScale", liquid);
        this.container.setScale("energyScale", this.data.energy / energyStorage);
    },
    getOperationSound: function () {
        return "PumpOp.ogg";
    },
    getEnergyStorage: function () {
        return this.data.energy_storage;
    }
});
TileRenderer.setRotationPlaceFunction(BlockID.pump);
StorageInterface.createInterface(BlockID.pump, {
    slots: {
        "slotLiquid1": { input: true },
        "slotLiquid2": { output: true }
    },
    isValidInput: function (item) {
        return LiquidLib.getFullItem(item.id, item.data, "water") ? true : false;
    },
    canReceiveLiquid: function (liquid, side) { return false; },
    canTransportLiquid: function (liquid, side) { return true; }
});
IDRegistry.genBlockID("fluidDistributor");
Block.createBlock("fluidDistributor", [
    { name: "Fluid Distributor", texture: [["fluid_distributor", 1], ["fluid_distributor", 1], ["fluid_distributor", 1], ["fluid_distributor", 0], ["fluid_distributor", 1], ["fluid_distributor", 1]], inCreative: true }
], "machine");
TileRenderer.setStandartModel(BlockID.fluidDistributor, [["fluid_distributor", 0], ["fluid_distributor", 1], ["fluid_distributor", 1], ["fluid_distributor", 1], ["fluid_distributor", 1], ["fluid_distributor", 1]]);
TileRenderer.registerFullRotationModel(BlockID.fluidDistributor, 0, [["fluid_distributor", 1], ["fluid_distributor", 0]]);
TileRenderer.registerFullRotationModel(BlockID.fluidDistributor, 6, [["fluid_distributor", 0], ["fluid_distributor", 1]]);
MachineRegistry.setMachineDrop("fluidDistributor", BlockID.machineBlockBasic);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.fluidDistributor, count: 1, data: 0 }, [
        "a",
        "#",
        "c"
    ], ['#', BlockID.machineBlockBasic, 0, 'a', ItemID.upgradeFluidPulling, 0, 'c', ItemID.cellEmpty, 0]);
});
var guiFluidDistributor = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Fluid Distributor") } },
        inventory: { standart: true },
        background: { standart: true },
    },
    drawing: [
        { type: "bitmap", x: 400 + 3 * GUI_SCALE, y: 146, bitmap: "fluid_distributor_background", scale: GUI_SCALE }
    ],
    elements: {
        "liquidScale": { type: "scale", x: 480, y: 50 + 34 * GUI_SCALE, direction: 1, value: 0, bitmap: "fluid_dustributor_bar", scale: GUI_SCALE },
        "slot1": { type: "slot", x: 400 + 3 * GUI_SCALE, y: 50 + 47 * GUI_SCALE, isValid: function (id, count, data) {
                return LiquidLib.getFullItem(id, data, "water") ? true : false;
            } },
        "slot2": { type: "slot", x: 400 + 3 * GUI_SCALE, y: 50 + 66 * GUI_SCALE, isValid: function () { return false; } },
        "button_switch": { type: "button", x: 400 + 112 * GUI_SCALE, y: 50 + 53 * GUI_SCALE, bitmap: "fluid_distributor_button", scale: GUI_SCALE, clicker: {
                onClick: function (container, tile) {
                    tile.data.inverted = !tile.data.inverted;
                    TileRenderer.mapAtCoords(tile.x, tile.y, tile.z, BlockID.fluidDistributor, tile.data.meta + 6 * tile.data.inverted);
                }
            } },
        "text1": { type: "text", font: { size: 24, color: Color.parseColor("#57c4da") }, x: 400 + 107 * GUI_SCALE, y: 50 + 42 * GUI_SCALE, width: 128, height: 48, text: Translation.translate("Mode:") },
        "text2": { type: "text", font: { size: 24, color: Color.parseColor("#57c4da") }, x: 400 + 92 * GUI_SCALE, y: 50 + 66 * GUI_SCALE, width: 256, height: 48, text: Translation.translate("Distribute") },
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiFluidDistributor, "Fluid Distributor");
});
MachineRegistry.registerPrototype(BlockID.fluidDistributor, {
    defaultValues: {
        meta: 0,
        inverted: false
    },
    getGuiScreen: function () {
        return guiFluidDistributor;
    },
    init: function () {
        this.liquidStorage.setLimit(null, 1);
        this.renderModel();
    },
    addLiquidToItem: MachineRegistry.addLiquidToItem,
    tick: function () {
        if (this.data.inverted) {
            this.container.setText("text2", Translation.translate("Concentrate"));
        }
        else {
            this.container.setText("text2", Translation.translate("Distribute"));
        }
        var storage = this.liquidStorage;
        var liquid = storage.getLiquidStored();
        var slot1 = this.container.getSlot("slot1");
        var slot2 = this.container.getSlot("slot2");
        this.addLiquidToItem(liquid, slot1, slot2);
        liquid = storage.getLiquidStored();
        if (liquid) {
            var input = StorageInterface.getNearestLiquidStorages(this, this.data.meta, !this.data.inverted);
            for (var side in input) {
                StorageInterface.transportLiquid(liquid, 0.25, this, input[side], parseInt(side));
            }
        }
        storage.updateUiScale("liquidScale", liquid);
    },
    wrenchClick: function (id, count, data, coords) {
        this.setFacing(coords.side);
    },
    renderModel: function () {
        TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, this.data.meta + 6 * this.data.inverted);
    },
    destroy: function () {
        BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
    },
});
TileRenderer.setRotationPlaceFunction("fluidDistributor", true);
StorageInterface.createInterface(BlockID.fluidDistributor, {
    slots: {
        "slot1": { input: true },
        "slot2": { output: true }
    },
    isValidInput: function (item) {
        return LiquidLib.getFullItem(item.id, item.data, "water") ? true : false;
    },
    canReceiveLiquid: function (liquid, side) {
        var data = this.tileEntity.data;
        return (side == data.meta) ^ data.inverted;
    },
    canTransportLiquid: function (liquid, side) {
        return true;
    }
});
IDRegistry.genBlockID("tank");
Block.createBlock("tank", [
    { name: "Tank", texture: [["machine_bottom", 0], ["machine_top", 0], ["tank_side", 0], ["tank_side", 0], ["tank_side", 0], ["tank_side", 0]], inCreative: true }
], "machine");
MachineRegistry.setMachineDrop("tank");
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.tank, count: 1, data: 0 }, [
        " c ",
        "c#c",
        " c "
    ], ['#', BlockID.machineBlockBasic, 0, 'c', ItemID.cellEmpty, 0]);
});
var guiTank = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Tank") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 611, y: 88, bitmap: "liquid_bar", scale: GUI_SCALE },
    ],
    elements: {
        "liquidScale": { type: "scale", x: 400 + 70 * GUI_SCALE, y: 50 + 16 * GUI_SCALE, direction: 1, value: 0.5, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE },
        "slotLiquid1": { type: "slot", x: 400 + 94 * GUI_SCALE, y: 50 + 16 * GUI_SCALE, isValid: function (id, count, data) {
                return (LiquidRegistry.getFullItem(id, data, "water") || LiquidLib.getEmptyItem(id, data)) ? true : false;
            } },
        "slotLiquid2": { type: "slot", x: 400 + 94 * GUI_SCALE, y: 50 + 40 * GUI_SCALE, isValid: function () { return false; } },
        "slotUpgrade1": { type: "slot", x: 870, y: 50 + 4 * GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade2": { type: "slot", x: 870, y: 50 + 22 * GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade3": { type: "slot", x: 870, y: 50 + 40 * GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade4": { type: "slot", x: 870, y: 50 + 58 * GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade },
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiTank, "Tank");
});
MachineRegistry.registerPrototype(BlockID.tank, {
    upgrades: ["fluidEjector", "fluidPulling"],
    getGuiScreen: function () {
        return guiTank;
    },
    init: function () {
        this.liquidStorage.setLimit(null, 16);
    },
    getLiquidFromItem: MachineRegistry.getLiquidFromItem,
    click: function (id, count, data, coords) {
        if (Entity.getSneaking(player)) {
            var liquid = this.liquidStorage.getLiquidStored();
            return this.getLiquidFromItem(liquid, { id: id, count: count, data: data }, null, true);
        }
    },
    tick: function () {
        UpgradeAPI.executeUpgrades(this);
        var storage = this.liquidStorage;
        var liquid = storage.getLiquidStored();
        var slot1 = this.container.getSlot("slotLiquid1");
        var slot2 = this.container.getSlot("slotLiquid2");
        this.getLiquidFromItem(liquid, slot1, slot2);
        if (liquid) {
            var full = LiquidLib.getFullItem(slot1.id, slot1.data, liquid);
            if (full && storage.getAmount(liquid) >= full.storage && (slot2.id == full.id && slot2.data == full.data && slot2.count < Item.getMaxStack(full.id) || slot2.id == 0)) {
                storage.getLiquid(liquid, full.storage);
                slot1.count--;
                slot2.id = full.id;
                slot2.data = full.data;
                slot2.count++;
                this.container.validateAll();
            }
        }
        storage.updateUiScale("liquidScale", storage.getLiquidStored());
    }
});
StorageInterface.createInterface(BlockID.tank, {
    slots: {
        "slotLiquid1": { input: true },
        "slotLiquid2": { output: true }
    },
    isValidInput: function (item) {
        return LiquidRegistry.getFullItem(item.id, item.data, "water") || LiquidLib.getEmptyItem(item.id, item.data);
    },
    canReceiveLiquid: function (liquid, side) { return true; },
    canTransportLiquid: function (liquid, side) { return true; }
});
IDRegistry.genBlockID("miner");
Block.createBlock("miner", [
    { name: "Miner", texture: [["miner_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["miner_front", 0], ["miner_side", 0], ["miner_side", 0]], inCreative: true }
], "machine");
TileRenderer.setStandartModel(BlockID.miner, [["miner_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["miner_front", 0], ["miner_side", 0], ["miner_side", 0]]);
TileRenderer.registerRotationModel(BlockID.miner, 0, [["miner_bottom", 1], ["machine_top", 0], ["machine_side", 0], ["miner_front", 0], ["miner_side", 0], ["miner_side", 0]]);
TileRenderer.registerRotationModel(BlockID.miner, 4, [["miner_bottom", 1], ["machine_top", 0], ["machine_side", 0], ["miner_front", 1], ["miner_side", 1], ["miner_side", 1]]);
ItemName.addTierTooltip("miner", 2);
MachineRegistry.setMachineDrop("miner", BlockID.machineBlockBasic);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.miner, count: 1, data: 0 }, [
        "x#x",
        " b ",
        " b "
    ], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'b', BlockID.miningPipe, 0]);
});
var guiMiner = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Miner") } },
        inventory: { standart: true },
        background: { standart: true },
    },
    drawing: [
        { type: "bitmap", x: 550, y: 150, bitmap: "energy_small_background", scale: GUI_SCALE }
    ],
    elements: {
        "energyScale": { type: "scale", x: 550, y: 150, direction: 1, value: 1, bitmap: "energy_small_scale", scale: GUI_SCALE },
        "slotDrill": { type: "slot", x: 441, y: 75, bitmap: "slot_drill",
            isValid: function (id) {
                if (id == ItemID.drill || id == ItemID.diamondDrill)
                    return true;
                return false;
            }
        },
        "slotPipe": { type: "slot", x: 541, y: 75,
            isValid: function (id) {
                if (ToolLib.isBlock(id) && !TileEntity.isTileEntityBlock(id))
                    return true;
                return false;
            }
        },
        "slotScanner": { type: "slot", x: 641, y: 75, bitmap: "slot_scanner",
            isValid: function (id) {
                if (id == ItemID.scanner || id == ItemID.scannerAdvanced)
                    return true;
                return false;
            }
        },
        "slotEnergy": { type: "slot", x: 541, y: 212, isValid: MachineRegistry.isValidEUStorage },
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiMiner, "Miner");
});
MachineRegistry.registerElectricMachine(BlockID.miner, {
    defaultValues: {
        meta: 0,
        x: 0,
        y: 0,
        z: 0,
        scanY: 0,
        scanR: 0,
        progress: 0,
        isActive: false
    },
    getGuiScreen: function () {
        return guiMiner;
    },
    getTier: function () {
        return 2;
    },
    getMiningValues: function (slot) {
        if (slot.id == ItemID.drill)
            return { energy: 6, time: 100 };
        return { energy: 20, time: 50 };
    },
    findOre: function (level) {
        var r = this.data.scanR;
        while (r) {
            if (this.data.x > this.x + r) {
                this.data.x = this.x - r;
                this.data.z++;
            }
            if (this.data.z > this.z + r)
                break;
            var blockID = World.getBlockID(this.data.x, this.data.scanY, this.data.z);
            if (ore_blocks.indexOf(blockID) != -1 && level >= ToolAPI.getBlockDestroyLevel(blockID)) {
                return true;
            }
            this.data.x++;
        }
        return false;
    },
    isEmptyBlock: function (block) {
        return block.id == 0 || block.id == 51 || block.id >= 8 && block.id <= 11 && block.data > 0;
    },
    canBeDestroyed: function (blockID, level) {
        if (ToolAPI.getBlockMaterialName(blockID) != "unbreaking" && level >= ToolAPI.getBlockDestroyLevel(blockID)) {
            return true;
        }
        return false;
    },
    findPath: function (x, y, z, sprc, level) {
        var block = World.getBlock(x, y, z);
        if (block.id == BlockID.miningPipe || this.isEmptyBlock(block)) {
            var dx = this.data.x - x;
            var dz = this.data.z - z;
            if (Math.abs(dx) == Math.abs(dz)) {
                var prc = sprc;
            }
            else if (Math.abs(dx) > Math.abs(dz)) {
                var prc = 0;
            }
            else {
                var prc = 1;
            }
            if (prc == 0) {
                if (dx > 0)
                    x++;
                else
                    x--;
            }
            else {
                if (dz > 0)
                    z++;
                else
                    z--;
            }
            return this.findPath(x, y, z, sprc, level);
        }
        else if (this.canBeDestroyed(block.id, level)) {
            return { x: x, y: y, z: z };
        }
        this.data.x++;
        return;
    },
    mineBlock: function (x, y, z, block, level) {
        var drop = ToolLib.getBlockDrop({ x: x, y: y, z: z }, block.id, block.data, level);
        var items = [];
        for (var i in drop) {
            items.push({ id: drop[i][0], count: drop[i][1], data: drop[i][2] });
        }
        var container = World.getContainer(x, y, z);
        if (container) {
            slots = StorageInterface.getContainerSlots(container);
            for (var i in slots) {
                var slot = container.getSlot(slots[i]);
                if (slot.id > 0) {
                    items.push({ id: slot.id, count: slot.count, data: slot.data, extra: slot.extra });
                    if (container.slots) {
                        slot.id = slot.count = slot.data = 0;
                    }
                    else {
                        container.setSlot(i, 0, 0, 0);
                    }
                }
            }
        }
        if (block.id == 79) {
            World.setBlock(x, y, z, 8);
        }
        else {
            World.setBlock(x, y, z, 0);
        }
        this.drop(items);
        this.data.progress = 0;
    },
    setPipe: function (y, slot) {
        if (y < this.y)
            World.setBlock(this.x, y, this.z, BlockID.miningPipe, 0);
        World.setBlock(this.x, y - 1, this.z, BlockID.miningPipe, 1);
        slot.count--;
        if (!slot.count)
            slot.id = 0;
        this.data.progress = 0;
    },
    drop: function (items) {
        var containers = StorageInterface.getNearestContainers(this, 0, true);
        StorageInterface.putItems(items, containers);
        for (var i in items) {
            var item = items[i];
            if (item.count > 0) {
                nativeDropItem(this.x + 0.5, this.y + 1, this.z + 0.5, 2, item.id, item.count, item.data, item.extra);
            }
        }
    },
    tick: function () {
        if (this.data.progress == 0) {
            var y = this.y;
            while (World.getBlockID(this.x, y - 1, this.z) == BlockID.miningPipe) {
                y--;
            }
            this.data.y = y;
        }
        var newActive = false;
        var drillSlot = this.container.getSlot("slotDrill");
        var pipeSlot = this.container.getSlot("slotPipe");
        if (drillSlot.id == ItemID.drill || drillSlot.id == ItemID.diamondDrill) {
            if (this.data.y < this.y && this.data.scanY != this.data.y) {
                var r = 0;
                var scanner = this.container.getSlot("slotScanner");
                var energyStored = ChargeItemRegistry.getEnergyStored(scanner);
                if (scanner.id == ItemID.scanner && energyStored >= 50) {
                    ChargeItemRegistry.setEnergyStored(scanner, energyStored - 50);
                    r = scan_radius;
                }
                else if (scanner.id == ItemID.scannerAdvanced && energyStored >= 250) {
                    ChargeItemRegistry.setEnergyStored(scanner, energyStored - 250);
                    r = adv_scan_radius;
                }
                this.data.x = this.x - r;
                this.data.z = this.z - r;
                this.data.scanY = this.data.y;
                this.data.scanR = r;
            }
            var level = ToolAPI.getToolLevel(drillSlot.id);
            if (this.data.y < this.y && this.findOre(level)) {
                var dx = this.data.x - this.x;
                var dz = this.data.z - this.z;
                var prc = 0;
                if (Math.abs(dx) > Math.abs(dz)) {
                    prc = 1;
                }
                var coords = this.findPath(this.x, this.data.y, this.z, prc, level);
                if (coords) {
                    var block = World.getBlock(coords.x, coords.y, coords.z);
                    var params = this.getMiningValues(drillSlot);
                    if (this.data.energy >= params.energy) {
                        this.data.energy -= params.energy;
                        this.data.progress++;
                        newActive = true;
                    }
                    if (this.data.progress >= params.time) {
                        level = ToolAPI.getToolLevelViaBlock(drillSlot.id, block.id);
                        this.mineBlock(coords.x, coords.y, coords.z, block, level);
                    }
                }
            }
            else if (this.data.y > 0 && pipeSlot.id == BlockID.miningPipe) {
                var block = World.getBlock(this.x, this.data.y - 1, this.z);
                if (this.isEmptyBlock(block)) {
                    if (this.data.energy >= 3) {
                        this.data.energy -= 3;
                        this.data.progress++;
                        newActive = true;
                    }
                    if (this.data.progress >= 20) {
                        this.setPipe(this.data.y, pipeSlot);
                    }
                }
                else if (this.canBeDestroyed(block.id, level)) {
                    var block = World.getBlock(this.x, this.data.y - 1, this.z);
                    var params = this.getMiningValues(drillSlot);
                    if (this.data.energy >= params.energy) {
                        this.data.energy -= params.energy;
                        this.data.progress++;
                        newActive = true;
                    }
                    if (this.data.progress >= params.time) {
                        level = ToolAPI.getToolLevelViaBlock(drillSlot.id, block.id);
                        this.mineBlock(this.x, this.data.y - 1, this.z, block, level);
                        this.setPipe(this.data.y, pipeSlot);
                    }
                }
            }
        }
        else {
            if (World.getBlockID(this.x, this.data.y, this.z) == BlockID.miningPipe) {
                if (this.data.energy >= 3) {
                    this.data.energy -= 3;
                    this.data.progress++;
                    newActive = true;
                }
                if (this.data.progress >= 20) {
                    this.drop([{ id: BlockID.miningPipe, count: 1, data: 0 }]);
                    var pipeSlot = this.container.getSlot("slotPipe");
                    if (pipeSlot.id != 0 && pipeSlot.id != BlockID.miningPipe && ToolLib.isBlock(pipeSlot.id) && !TileEntity.isTileEntityBlock(id)) {
                        var blockId = Block.convertItemToBlockId(pipeSlot.id);
                        World.setBlock(this.x, this.data.y, this.z, blockId, pipeSlot.data);
                        pipeSlot.count--;
                        if (pipeSlot.count == 0)
                            pipeSlot.id = 0;
                    }
                    else {
                        World.setBlock(this.x, this.data.y, this.z, 0);
                    }
                    this.data.scanY = 0;
                    this.data.progress = 0;
                }
            }
        }
        if (newActive) {
            this.startPlaySound();
        }
        else {
            this.stopPlaySound();
        }
        this.setActive(newActive);
        var energyStorage = this.getEnergyStorage();
        this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotDrill"), "Eu", this.data.energy, 2);
        this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotScanner"), "Eu", this.data.energy, 2);
        this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, 2);
        this.container.setScale("energyScale", this.data.energy / energyStorage);
    },
    getOperationSound: function () {
        return "MinerOp.ogg";
    },
    getEnergyStorage: function () {
        return 10000;
    },
    renderModel: MachineRegistry.renderModelWithRotation
});
TileRenderer.setRotationPlaceFunction(BlockID.miner);
IDRegistry.genBlockID("advancedMiner");
Block.createBlock("advancedMiner", [
    { name: "Advanced Miner", texture: [["teleporter_top", 0], ["machine_advanced_top", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0], ["miner_side", 0], ["miner_side", 0]], inCreative: true }
], "machine");
TileRenderer.setStandartModel(BlockID.advancedMiner, [["teleporter_top", 0], ["machine_advanced_top", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0], ["miner_side", 0], ["miner_side", 0]], true);
TileRenderer.registerRotationModel(BlockID.advancedMiner, 0, [["teleporter_top", 0], ["machine_advanced_top", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0], ["miner_side", 0], ["miner_side", 0]]);
TileRenderer.registerRotationModel(BlockID.advancedMiner, 4, [["teleporter_top", 1], ["machine_advanced_top", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0], ["miner_side", 1], ["miner_side", 1]]);
ItemName.setRarity(BlockID.advancedMiner, 2);
ItemName.addStorageBlockTooltip("advancedMiner", 3, "4M");
Block.registerDropFunction("advancedMiner", function (coords, blockID, blockData, level) {
    return [];
});
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.advancedMiner, count: 1, data: 0 }, [
        "pmp",
        "e#a",
        "pmp"
    ], ['#', BlockID.machineBlockAdvanced, 0, 'a', BlockID.teleporter, 0, 'e', BlockID.storageMFE, -1, 'm', BlockID.miner, -1, 'p', ItemID.plateAlloy, 0]);
});
var guiAdvancedMiner = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Advanced Miner") } },
        inventory: { standart: true },
        background: { standart: true },
    },
    drawing: [
        { type: "bitmap", x: 400 + 2 * GUI_SCALE, y: 50 + 49 * GUI_SCALE, bitmap: "energy_small_background", scale: GUI_SCALE },
        { type: "bitmap", x: 400 + 28 * GUI_SCALE, y: 50 + 21 * GUI_SCALE, bitmap: "miner_mode", scale: GUI_SCALE },
        { type: "bitmap", x: 400, y: 50 + 98 * GUI_SCALE, bitmap: "miner_info", scale: GUI_SCALE },
    ],
    elements: {
        "energyScale": { type: "scale", x: 400 + 2 * GUI_SCALE, y: 50 + 49 * GUI_SCALE, direction: 1, value: 1, bitmap: "energy_small_scale", scale: GUI_SCALE },
        "slotScanner": { type: "slot", x: 400, y: 50 + 19 * GUI_SCALE, bitmap: "slot_scanner",
            isValid: function (id) {
                if (id == ItemID.scanner || id == ItemID.scannerAdvanced)
                    return true;
                return false;
            }
        },
        "slotEnergy": { type: "slot", x: 400, y: 290, isValid: MachineRegistry.isValidEUStorage },
        "slot1": { type: "slot", x: 400 + 28 * GUI_SCALE, y: 50 + 37 * GUI_SCALE },
        "slot2": { type: "slot", x: 400 + 47 * GUI_SCALE, y: 50 + 37 * GUI_SCALE },
        "slot3": { type: "slot", x: 400 + 66 * GUI_SCALE, y: 50 + 37 * GUI_SCALE },
        "slot4": { type: "slot", x: 400 + 85 * GUI_SCALE, y: 50 + 37 * GUI_SCALE },
        "slot5": { type: "slot", x: 400 + 104 * GUI_SCALE, y: 50 + 37 * GUI_SCALE },
        "slot6": { type: "slot", x: 400 + 28 * GUI_SCALE, y: 50 + 56 * GUI_SCALE },
        "slot7": { type: "slot", x: 400 + 47 * GUI_SCALE, y: 50 + 56 * GUI_SCALE },
        "slot8": { type: "slot", x: 400 + 66 * GUI_SCALE, y: 50 + 56 * GUI_SCALE },
        "slot9": { type: "slot", x: 400 + 85 * GUI_SCALE, y: 50 + 56 * GUI_SCALE },
        "slot10": { type: "slot", x: 400 + 104 * GUI_SCALE, y: 50 + 56 * GUI_SCALE },
        "slot11": { type: "slot", x: 400 + 28 * GUI_SCALE, y: 290 },
        "slot12": { type: "slot", x: 400 + 47 * GUI_SCALE, y: 290 },
        "slot13": { type: "slot", x: 400 + 66 * GUI_SCALE, y: 290 },
        "slot14": { type: "slot", x: 400 + 85 * GUI_SCALE, y: 290 },
        "slot15": { type: "slot", x: 400 + 104 * GUI_SCALE, y: 290 },
        "slotUpgrade1": { type: "slot", x: 871, y: 50 + 37 * GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade2": { type: "slot", x: 871, y: 50 + 56 * GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade },
        "button_switch": { type: "button", x: 400 + 116 * GUI_SCALE, y: 50 + 21 * GUI_SCALE, bitmap: "miner_button_switch", scale: GUI_SCALE, clicker: {
                onClick: function (container, tile) {
                    tile.data.whitelist = !tile.data.whitelist;
                }
            } },
        "button_restart": { type: "button", x: 400 + 125 * GUI_SCALE, y: 50 + 98 * GUI_SCALE, bitmap: "miner_button_restart", scale: GUI_SCALE, clicker: {
                onClick: function (container, tile) {
                    tile.data.x = tile.data.y = tile.data.z = 0;
                }
            } },
        "button_silk": { type: "button", x: 400 + 126 * GUI_SCALE, y: 50 + 41 * GUI_SCALE, bitmap: "miner_button_silk_0", scale: GUI_SCALE, clicker: {
                onClick: function (container, tile) {
                    tile.data.silk_touch = (tile.data.silk_touch + 1) % 2;
                }
            } },
        "textInfoMode": { type: "text", font: { size: 24, color: Color.GREEN }, x: 400 + 32 * GUI_SCALE, y: 50 + 24 * GUI_SCALE, width: 256, height: 42, text: Translation.translate("Mode: Blacklist") },
        "textInfoXYZ": { type: "text", font: { size: 24, color: Color.GREEN }, x: 400 + 4 * GUI_SCALE, y: 50 + 101 * GUI_SCALE, width: 100, height: 42, text: "" },
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiAdvancedMiner, "Advanced Miner");
});
MachineRegistry.registerElectricMachine(BlockID.advancedMiner, {
    defaultValues: {
        power_tier: 3,
        meta: 0,
        x: 0,
        y: 0,
        z: 0,
        whitelist: false,
        silk_touch: 0,
        isEnabled: true,
        isActive: false
    },
    upgrades: ["overclocker", "transformer"],
    getTransportSlots: function () {
        return { input: [] };
    },
    getGuiScreen: function () {
        return guiAdvancedMiner;
    },
    isValidBlock: function (id, data) {
        var material = ToolAPI.getBlockMaterial(id);
        if (id > 0 && (!material || material.name != "unbreaking")) {
            return true;
        }
        return false;
    },
    checkDrop: function (drop) {
        if (drop.length == 0)
            return true;
        for (var i in drop) {
            for (var j = 0; j < 16; j++) {
                var slot = this.container.getSlot("slot" + j);
                if (slot.id == drop[i][0] && slot.data == drop[i][2]) {
                    return !this.data.whitelist;
                }
            }
        }
        return this.data.whitelist;
    },
    harvestBlock: function (x, y, z, block) {
        var drop = ToolLib.getBlockDrop({ x: x, y: y, z: z }, block.id, block.data, 100, { silk: this.data.silk_touch });
        if (this.checkDrop(drop))
            return false;
        World.setBlock(x, y, z, 0);
        var items = [];
        for (var i in drop) {
            items.push({ id: drop[i][0], count: drop[i][1], data: drop[i][2] });
        }
        this.drop(items);
        this.data.energy -= 512;
        return true;
    },
    drop: function (items) {
        var containers = StorageInterface.getNearestContainers(this, 0, true);
        if (containers) {
            StorageInterface.putItems(items, containers, this);
        }
        for (var i in items) {
            var item = items[i];
            if (item.count > 0) {
                nativeDropItem(this.x + 0.5, this.y + 1, this.z + 0.5, 1, item.id, item.count, item.data);
            }
        }
    },
    getScanRadius: function (itemID) {
        if (itemID == ItemID.scanner)
            return 16;
        if (itemID == ItemID.scannerAdvanced)
            return 32;
        return 0;
    },
    tick: function () {
        var content = this.container.getGuiContent();
        if (content) {
            content.elements.button_silk.bitmap = "miner_button_silk_" + this.data.silk_touch;
        }
        if (this.data.whitelist)
            this.container.setText("textInfoMode", Translation.translate("Mode: Whitelist"));
        else
            this.container.setText("textInfoMode", Translation.translate("Mode: Blacklist"));
        this.data.power_tier = this.defaultValues.power_tier;
        var max_scan_count = 5;
        var upgrades = UpgradeAPI.getUpgrades(this, this.container);
        for (var i in upgrades) {
            var item = upgrades[i];
            if (item.id == ItemID.upgradeOverclocker) {
                max_scan_count *= item.count + 1;
            }
            if (item.id == ItemID.upgradeTransformer) {
                this.data.power_tier += item.count;
            }
        }
        var newActive = false;
        if (this.data.isEnabled && this.y + this.data.y >= 0 && this.data.energy >= 512) {
            var scanner = this.container.getSlot("slotScanner");
            var scanR = this.getScanRadius(scanner.id);
            var energyStored = ChargeItemRegistry.getEnergyStored(scanner);
            if (scanR > 0 && energyStored >= 64) {
                newActive = true;
                if (World.getThreadTime() % 20 == 0) {
                    if (this.data.y == 0) {
                        this.data.x = -scanR;
                        this.data.y = -1;
                        this.data.z = -scanR;
                    }
                    for (var i = 0; i < max_scan_count; i++) {
                        if (this.data.x > scanR) {
                            this.data.x = -scanR;
                            this.data.z++;
                        }
                        if (this.data.z > scanR) {
                            this.data.z = -scanR;
                            this.data.y--;
                        }
                        energyStored -= 64;
                        var x = this.x + this.data.x, y = this.y + this.data.y, z = this.z + this.data.z;
                        this.data.x++;
                        var block = World.getBlock(x, y, z);
                        if (this.isValidBlock(block.id, block.data)) {
                            if (this.harvestBlock(x, y, z, block))
                                break;
                        }
                        if (energyStored < 64)
                            break;
                    }
                    ChargeItemRegistry.setEnergyStored(scanner, energyStored);
                }
            }
        }
        this.setActive(newActive);
        if (this.data.y < 0)
            this.container.setText("textInfoXYZ", "X: " + this.data.x + ", Y: " + Math.min(this.data.y, -1) + ", Z: " + this.data.z);
        else
            this.container.setText("textInfoXYZ", "");
        var tier = this.getTier();
        var energyStorage = this.getEnergyStorage();
        this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotScanner"), "Eu", this.data.energy, tier);
        this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, tier);
        this.container.setScale("energyScale", this.data.energy / energyStorage);
    },
    destroyBlock: function (coords, player) {
        var itemID = Player.getCarriedItem().id;
        var level = ToolAPI.getToolLevelViaBlock(itemID, this.blockID);
        var drop = MachineRegistry.getMachineDrop(coords, this.blockID, level, BlockID.machineBlockAdvanced, this.data.energy);
        if (drop.length > 0) {
            World.drop(coords.x + .5, coords.y + .5, coords.z + .5, drop[0][0], drop[0][1], drop[0][2]);
        }
    },
    redstone: function (signal) {
        this.data.isEnabled = (signal.power == 0);
    },
    getTier: function () {
        return this.data.power_tier;
    },
    getEnergyStorage: function () {
        return 4000000;
    },
    renderModel: MachineRegistry.renderModelWithRotation
});
MachineRegistry.setStoragePlaceFunction("advancedMiner");
IDRegistry.genBlockID("cropHarvester");
Block.createBlock("cropHarvester", [
    { name: "Crop Harvester", texture: [["machine_bottom", 0], ["crop_harvester", 0]], inCreative: true }
], "machine");
ItemName.addTierTooltip("cropHarvester", 1);
MachineRegistry.setMachineDrop("cropHarvester", BlockID.machineBlockBasic);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.cropHarvester, count: 1, data: 0 }, [
        "zcz",
        "s#s",
        "pap"
    ], ['#', BlockID.machineBlockBasic, 0, 'z', ItemID.circuitBasic, 0, 'c', 54, -1, 'a', ItemID.agriculturalAnalyzer, 0, 'p', ItemID.plateIron, 0, 's', 359, 0]);
});
var cropHarvesterGuiObject = {
    standart: {
        header: { text: { text: Translation.translate("Crop Harvester") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 409, y: 167, bitmap: "energy_small_background", scale: GUI_SCALE }
    ],
    elements: {
        "energyScale": { type: "scale", x: 409, y: 167, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE },
        "slotEnergy": { type: "slot", x: 400, y: 230, isValid: MachineRegistry.isValidEUStorage },
        "slotUpgrade0": { type: "slot", x: 880, y: 110, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade1": { type: "slot", x: 880, y: 170, isValid: UpgradeAPI.isValidUpgrade },
        "slotUpgrade2": { type: "slot", x: 880, y: 230, isValid: UpgradeAPI.isValidUpgrade }
    }
};
for (var i_23 = 0; i_23 < 15; i_23++) {
    var x = i_23 % 5;
    var y = Math.floor(i_23 / 5) + 1;
    cropHarvesterGuiObject.elements["outSlot" + i_23] = { type: "slot", x: 520 + x * 60, y: 50 + y * 60 };
}
;
var guiCropHarvester = new UI.StandartWindow(cropHarvesterGuiObject);
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiCropHarvester, "Crop Harvester");
});
MachineRegistry.registerElectricMachine(BlockID.cropHarvester, {
    defaultValues: {
        power_tier: 1,
        energy_storage: 10000,
        scanX: -5,
        scanY: -1,
        scanZ: -5
    },
    upgrades: ["transformer", "energyStorage", "itemEjector"],
    getGuiScreen: function () {
        return guiCropHarvester;
    },
    getTier: function () {
        return this.data.power_tier;
    },
    resetValues: function () {
        this.data.power_tier = this.defaultValues.power_tier;
        this.data.energy_storage = this.defaultValues.energy_storage;
    },
    tick: function () {
        this.resetValues();
        UpgradeAPI.executeUpgrades(this);
        StorageInterface.checkHoppers(this);
        if (this.data.energy > 100)
            this.scan();
        var energyStorage = this.getEnergyStorage();
        this.data.energy = Math.min(this.data.energy, energyStorage);
        this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
        this.container.setScale("energyScale", this.data.energy / energyStorage);
        this.container.validateAll();
    },
    scan: function () {
        this.data.scanX++;
        if (this.data.scanX > 5) {
            this.data.scanX = -5;
            this.data.scanZ++;
            if (this.data.scanZ > 5) {
                this.data.scanZ = -5;
                this.data.scanY++;
                if (this.data.scanY > 1) {
                    this.data.scanY = -1;
                }
            }
        }
        this.data.energy -= 1;
        var cropTile = World.getTileEntity(this.x + this.data.scanX, this.y + this.data.scanY, this.z + this.data.scanZ);
        if (cropTile && cropTile.crop && !this.isInvFull()) {
            var drops = null;
            if (cropTile.data.currentSize == cropTile.crop.getOptimalHarvestSize(cropTile)) {
                drops = cropTile.performHarvest();
            }
            else if (cropTile.data.currentSize == cropTile.crop.maxSize) {
                drops = cropTile.performHarvest();
            }
            if (drops && drops.length) {
                for (var i_24 in drops) {
                    var item = drops[i_24];
                    this.putItem(item);
                    this.data.energy -= 100;
                    if (item.count > 0) {
                        World.drop(this.x, this.y + 1, this.z, item.id, item.count, item.data);
                    }
                }
            }
        }
    },
    putItem: function (item) {
        for (var i = 0; i < 15; i++) {
            var slot = this.container.getSlot("outSlot" + i);
            if (!slot.id || slot.id == item.id && slot.count < Item.getMaxStack(item.id)) {
                var add = Math.min(Item.getMaxStack(item.id) - slot.count, item.count);
                slot.id = item.id;
                slot.count += add;
                slot.data = item.data;
                item.count -= add;
            }
        }
    },
    isInvFull: function () {
        for (var i = 0; i < 15; i++) {
            var slot = this.container.getSlot("outSlot" + i);
            var maxStack = Item.getMaxStack(slot.id);
            if (!slot.id || slot.count < maxStack)
                return false;
        }
        return true;
    },
    getEnergyStorage: function () {
        return this.data.energy_storage;
    }
});
StorageInterface.createInterface(BlockID.cropHarvester, {
    slots: {
        "outSlot^0-14": { output: true }
    }
});
IDRegistry.genBlockID("cropMatron");
Block.createBlock("cropMatron", [
    { name: "Crop Matron", texture: [["machine_bottom", 0], ["cropmatron_top", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0]], inCreative: true }
], "machine");
TileRenderer.setStandartModel(BlockID.cropMatron, [["machine_bottom", 0], ["cropmatron_top", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0]], true);
TileRenderer.registerRotationModel(BlockID.cropMatron, 0, [["machine_bottom", 0], ["cropmatron_top", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0]]);
TileRenderer.registerRotationModel(BlockID.cropMatron, 4, [["machine_bottom", 0], ["cropmatron_top", 0], ["cropmatron_side", 3], ["cropmatron_side", 1], ["cropmatron_side", 2], ["cropmatron_side", 2]]);
ItemName.addTierTooltip("cropMatron", 1);
MachineRegistry.setMachineDrop("cropMatron", BlockID.machineBlockBasic);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.cropMatron, count: 1, data: 0 }, [
        "cxc",
        "a#a",
        "nnn"
    ], ['#', BlockID.machineBlockBasic, 0, 'x', 54, -1, 'c', ItemID.circuitBasic, 0, 'a', ItemID.cellEmpty, 0, 'n', ItemID.cropStick, 0]);
});
function isFertilizer(id) {
    return id == ItemID.fertilizer;
}
function isWeedEx(id) {
    return id == ItemID.weedEx;
}
var newGuiMatronObject = {
    standart: {
        header: { text: { text: Translation.translate("Crop Matron") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 870, y: 270, bitmap: "energy_small_background", scale: GUI_SCALE },
        { type: "bitmap", x: 511, y: 243, bitmap: "water_storage_background", scale: GUI_SCALE }
    ],
    elements: {
        "energyScale": { type: "scale", x: 870, y: 270, direction: 1, value: .5, bitmap: "energy_small_scale", scale: GUI_SCALE },
        "liquidScale": { type: "scale", x: 572, y: 256, direction: 1, value: 1, bitmap: "water_storage_scale", scale: GUI_SCALE },
        "slotEnergy": { type: "slot", x: 804, y: 265, isValid: MachineRegistry.isValidEUStorage },
        "slotFertilizer0": { type: "slot", x: 441, y: 75, bitmap: "slot_dust", isValid: isFertilizer },
        "slotWeedEx0": { type: "slot", x: 441, y: 155, bitmap: "slot_weedEx", isValid: isWeedEx },
        "slotWaterIn": { type: "slot", x: 441, y: 235, bitmap: "slot_cell", isValid: function (id, count, data) {
                return LiquidLib.getItemLiquid(id, data) == "water";
            } },
        "slotWaterOut": { type: "slot", x: 441, y: 295, isValid: function () {
                return false;
            } }
    }
};
for (var i_25 = 1; i_25 < 7; i_25++) {
    newGuiMatronObject.elements["slotWeedEx" + i_25] = { type: "slot", x: 441 + 60 * i_25, y: 155, isValid: isWeedEx };
}
for (var i_26 = 1; i_26 < 7; i_26++) {
    newGuiMatronObject.elements["slotFertilizer" + i_26] = { type: "slot", x: 441 + 60 * i_26, y: 75, isValid: isFertilizer };
}
var guiCropMatron = new UI.StandartWindow(newGuiMatronObject);
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiCropMatron, "Crop Matron");
});
MachineRegistry.registerElectricMachine(BlockID.cropMatron, {
    defaultValues: {
        power_tier: 1,
        energy_storage: 10000,
        meta: 0,
        isActive: false,
        scanX: -5,
        scanY: -1,
        scanZ: -5
    },
    getGuiScreen: function () {
        return guiCropMatron;
    },
    init: function () {
        this.liquidStorage.setLimit("water", 2);
        this.renderModel();
    },
    getLiquidFromItem: MachineRegistry.getLiquidFromItem,
    click: function (id, count, data, coords) {
        if (Entity.getSneaking(player)) {
            return this.getLiquidFromItem("water", { id: id, count: count, data: data }, null, true);
        }
    },
    tick: function () {
        StorageInterface.checkHoppers(this);
        var slot1 = this.container.getSlot("slotWaterIn");
        var slot2 = this.container.getSlot("slotWaterOut");
        this.getLiquidFromItem("water", slot1, slot2);
        if (this.data.energy >= 31) {
            this.scan();
            this.setActive(true);
        }
        else {
            this.setActive(false);
        }
        var energyStorage = this.getEnergyStorage();
        this.data.energy = Math.min(this.data.energy, energyStorage);
        this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
        this.container.setScale("energyScale", this.data.energy / energyStorage);
        this.liquidStorage.updateUiScale("liquidScale", "water");
    },
    scan: function () {
        this.data.scanX++;
        if (this.data.scanX > 5) {
            this.data.scanX = -5;
            this.data.scanZ++;
            if (this.data.scanZ > 5) {
                this.data.scanZ = -5;
                this.data.scanY++;
                if (this.data.scanY > 1) {
                    this.data.scanY = -1;
                }
            }
        }
        this.data.energy -= 1;
        var tileentity = World.getTileEntity(this.x + this.data.scanX, this.y + this.data.scanY, this.z + this.data.scanZ);
        if (tileentity && tileentity.crop) {
            var slotFertilizer = this.getSlot("slotFertilizer");
            var weedExSlot = this.getSlot("slotWeedEx");
            if (slotFertilizer && tileentity.applyFertilizer(false)) {
                slotFertilizer.count--;
                this.data.energy -= 10;
            }
            var liquidAmount = this.liquidStorage.getAmount("water");
            if (liquidAmount > 0) {
                amount = tileentity.applyHydration(liquidAmount);
                if (amount > 0) {
                    this.liquidStorage.getLiquid("water", amount / 1000);
                }
            }
            if (weedExSlot && tileentity.applyWeedEx(weedExSlot.id, false)) {
                this.data.energy -= 10;
                if (++weedExSlot.data >= Item.getMaxDamage(weedExSlot.id))
                    weedExSlot.id = 0;
            }
            this.container.validateAll();
        }
    },
    getSlot: function (type) {
        for (var i_27 = 0; i_27 < 7; i_27++) {
            var slot = this.container.getSlot(type + i_27);
            if (slot.id)
                return slot;
        }
        return null;
    },
    getTier: function () {
        return this.data.power_tier;
    },
    getEnergyStorage: function () {
        return this.data.energy_storage;
    },
    renderModel: MachineRegistry.renderModelWithRotation
});
TileRenderer.setRotationPlaceFunction(BlockID.cropMatron, true);
StorageInterface.createInterface(BlockID.cropMatron, {
    slots: {
        "slotFertilizer^0-6": { input: true, isValid: function (item) {
                return item.id == ItemID.fertilizer;
            } },
        "slotWeedEx^0-6": { input: true, isValid: function (item) {
                return item.id == ItemID.weedEx;
            } },
        "slotWaterIn": { input: true, isValid: function (item) {
                return LiquidLib.getItemLiquid(item.id, item.data) == "water";
            } },
        "slotWaterOut": { output: true }
    },
    canReceiveLiquid: function (liquid, side) { return liquid == "water"; }
});
IDRegistry.genBlockID("teleporter");
Block.createBlock("teleporter", [
    { name: "Teleporter", texture: [["machine_advanced_bottom", 0], ["teleporter_top", 0], ["teleporter_side", 0], ["teleporter_side", 0], ["teleporter_side", 0], ["teleporter_side", 0]], inCreative: true },
], "machine");
ItemName.setRarity(BlockID.teleporter, 2, true);
TileRenderer.setStandartModel(BlockID.teleporter, [["machine_advanced_bottom", 0], ["teleporter_top", 0], ["teleporter_side", 0], ["teleporter_side", 0], ["teleporter_side", 0], ["teleporter_side", 0]]);
TileRenderer.registerRenderModel(BlockID.teleporter, 0, [["machine_advanced_bottom", 0], ["teleporter_top", 1], ["teleporter_side", 1], ["teleporter_side", 1], ["teleporter_side", 1], ["teleporter_side", 1]]);
MachineRegistry.setMachineDrop("teleporter", BlockID.machineBlockAdvanced);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.teleporter, count: 1, data: 0 }, [
        "xax",
        "c#c",
        "xdx"
    ], ['#', BlockID.machineBlockAdvanced, 0, 'x', ItemID.circuitAdvanced, 0, 'a', ItemID.freqTransmitter, 0, 'c', ItemID.cableOptic, 0, 'd', 264, 0]);
});
MachineRegistry.registerPrototype(BlockID.teleporter, {
    defaultValues: {
        isActive: false,
        frequency: null
    },
    getNearestStorages: function (x, y, z) {
        var directions = StorageInterface.directionsBySide;
        var storages = [];
        for (var i in directions) {
            dir = directions[i];
            var machine = EnergyTileRegistry.accessMachineAtCoords(x + dir.x, y + dir.y, z + dir.z);
            if (machine && machine.isTeleporterCompatible) {
                storages.push(machine);
            }
        }
        return storages;
    },
    getWeight: function (ent) {
        var type = Entity.getType(ent);
        if (type == 1 || type == EntityType.MINECART)
            return 1000;
        if (type == EntityType.ITEM)
            return 100;
        if (isFriendlyMob(type))
            return 200;
        if (isHostileMob(type))
            return 500;
        return 0;
    },
    tick: function () {
        if (World.getThreadTime() % 11 == 0 && this.data.isActive && this.data.frequency) {
            var entities = Entity.getAll();
            var storages = this.getNearestStorages(this.x, this.y, this.z);
            var energyAvailable = 0;
            for (var i in storages) {
                energyAvailable += storages[i].data.energy;
            }
            receive = this.data.frequency;
            if (energyAvailable > receive.energy * 100) {
                for (var i in entities) {
                    var ent = entities[i];
                    var c = Entity.getPosition(ent);
                    var dx = Math.abs(this.x + 0.5 - c.x);
                    var y = c.y - this.y;
                    var dz = Math.abs(this.z + 0.5 - c.z);
                    if (dx < 1.5 && dz < 1.5 && y >= 0 && y < 3) {
                        var weight = this.getWeight(ent);
                        if (weight) {
                            var energyNeed = weight * receive.energy;
                            if (ConfigIC.debugMode) {
                                Debug.m(energyNeed);
                            }
                            if (energyNeed < energyAvailable) {
                                for (var i in storages) {
                                    var data = storages[i].data;
                                    var energyChange = Math.min(energyNeed, data.energy);
                                    data.energy -= energyChange;
                                    energyNeed -= energyChange;
                                    if (energyNeed <= 0) {
                                        break;
                                    }
                                }
                                SoundManager.playSoundAt(this.x + .5, this.y + 1, this.z + .5, "TeleUse.ogg");
                                SoundManager.playSoundAt(receive.x + .5, receive.y + 1, receive.z + .5, "TeleUse.ogg");
                                Entity.setPosition(ent, receive.x + .5, receive.y + 3, receive.z + .5);
                            }
                        }
                    }
                }
            }
        }
    },
    redstone: function (signal) {
        this.data.isActive = signal.power > 0;
        this.renderModel();
    },
    renderModel: MachineRegistry.renderModel
});
IDRegistry.genBlockID("luminator");
Block.createBlock("luminator", [
    { name: "tile.luminator.name", texture: [["luminator", 0]], inCreative: false },
    { name: "Luminator", texture: [["luminator", 0]], inCreative: true },
    { name: "tile.luminator.name", texture: [["luminator", 0]], inCreative: false },
    { name: "tile.luminator.name", texture: [["luminator", 0]], inCreative: false },
    { name: "tile.luminator.name", texture: [["luminator", 0]], inCreative: false },
    { name: "tile.luminator.name", texture: [["luminator", 0]], inCreative: false }
], { renderlayer: 7 });
Block.setBlockShape(BlockID.luminator, { x: 0, y: 15 / 16, z: 0 }, { x: 1, y: 1, z: 1 }, 0);
Block.setBlockShape(BlockID.luminator, { x: 0, y: 0, z: 0 }, { x: 1, y: 1 / 16, z: 1 }, 1);
Block.setBlockShape(BlockID.luminator, { x: 0, y: 0, z: 15 / 16 }, { x: 1, y: 1, z: 1 }, 2);
Block.setBlockShape(BlockID.luminator, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 / 16 }, 3);
Block.setBlockShape(BlockID.luminator, { x: 15 / 16, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, 4);
Block.setBlockShape(BlockID.luminator, { x: 0, y: 0, z: 0 }, { x: 1 / 16, y: 1, z: 1 }, 5);
Block.registerDropFunction("luminator", function (coords, blockID, blockData, level, enchant) {
    return [[blockID, 1, 1]];
});
IDRegistry.genBlockID("luminator_on");
Block.createBlock("luminator_on", [
    { name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false },
    { name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false },
    { name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false },
    { name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false },
    { name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false },
    { name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false }
], {
    destroytime: 2,
    explosionres: 0.5,
    lightlevel: 15,
    renderlayer: 7
});
Block.setBlockShape(BlockID.luminator_on, { x: 0, y: 15 / 16, z: 0 }, { x: 1, y: 1, z: 1 }, 0);
Block.setBlockShape(BlockID.luminator_on, { x: 0, y: 0, z: 0 }, { x: 1, y: 1 / 16, z: 1 }, 1);
Block.setBlockShape(BlockID.luminator_on, { x: 0, y: 0, z: 15 / 16 }, { x: 1, y: 1, z: 1 }, 2);
Block.setBlockShape(BlockID.luminator_on, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 / 16 }, 3);
Block.setBlockShape(BlockID.luminator_on, { x: 15 / 16, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, 4);
Block.setBlockShape(BlockID.luminator_on, { x: 0, y: 0, z: 0 }, { x: 1 / 16, y: 1, z: 1 }, 5);
Block.registerDropFunction("luminator_on", function (coords, blockID, blockData, level, enchant) {
    return [[BlockID.luminator, 1, 1]];
});
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.luminator, count: 8, data: 1 }, [
        "cxc",
        "aba",
        "aaa",
    ], ['a', 20, 0, 'x', ItemID.cableCopper1, 0, 'b', ItemID.cableTin0, 0, 'c', ItemID.casingIron, 0]);
});
MachineRegistry.registerElectricMachine(BlockID.luminator, {
    defaultValues: {
        isActive: false
    },
    getEnergyStorage: function () {
        return 100;
    },
    click: function (id, count, data, coords) {
        this.data.isActive = true;
        return true;
    },
    tick: function (type, src) {
        if (this.data.isActive && this.data.energy >= 0.25) {
            var x = this.x, y = this.y, z = this.z;
            var blockData = World.getBlock(x, y, z).data;
            var data = this.data;
            this.selfDestroy();
            World.setBlock(x, y, z, BlockID.luminator_on, blockData);
            var tile = World.addTileEntity(x, y, z);
            tile.data = data;
        }
    }
});
MachineRegistry.registerElectricMachine(BlockID.luminator_on, {
    defaultValues: {
        isActive: true
    },
    getEnergyStorage: function () {
        return 100;
    },
    disable: function () {
        var x = this.x, y = this.y, z = this.z;
        var blockData = World.getBlock(x, y, z).data;
        var data = this.data;
        this.selfDestroy();
        World.setBlock(x, y, z, BlockID.luminator, blockData);
        tile = World.addTileEntity(x, y, z);
        tile.data = data;
    },
    click: function (id, count, data, coords) {
        this.data.isActive = false;
        this.disable();
        return true;
    },
    tick: function (type, src) {
        if (this.data.energy < 0.25) {
            this.disable();
        }
        else {
            this.data.energy -= 0.25;
        }
    }
});
Block.registerPlaceFunction("luminator", function (coords, item, block) {
    var x = coords.relative.x;
    var y = coords.relative.y;
    var z = coords.relative.z;
    block = World.getBlockID(x, y, z);
    if (GenerationUtils.isTransparentBlock(block)) {
        World.setBlock(x, y, z, item.id, coords.side);
        World.playSound(x, y, z, "dig.stone", 1, 0.8);
        World.addTileEntity(x, y, z);
    }
});
IDRegistry.genBlockID("teslaCoil");
Block.createBlock("teslaCoil", [
    { name: "Tesla Coil", texture: [["tesla_coil", 0], ["tesla_coil", 0], ["tesla_coil", 1], ["tesla_coil", 1], ["tesla_coil", 1], ["tesla_coil", 1]], inCreative: true },
], "machine");
ItemName.addTierTooltip("teslaCoil", 3);
MachineRegistry.setMachineDrop("teslaCoil", BlockID.machineBlockBasic);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.teslaCoil, count: 1, data: 0 }, [
        "ror",
        "r#r",
        "cxc"
    ], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'c', ItemID.casingIron, 0, 'o', ItemID.coil, 0, 'r', 331, 0]);
});
MachineRegistry.registerElectricMachine(BlockID.teslaCoil, {
    getTier: function () {
        return 3;
    },
    tick: function () {
        if (this.data.energy >= 400 && this.data.isActive) {
            if (World.getThreadTime() % 32 == 0) {
                var entities = Entity.getAll();
                var discharge = false;
                var damage = Math.floor(this.data.energy / 400);
                for (var i in entities) {
                    var ent = entities[i];
                    var coords = Entity.getPosition(ent);
                    var dx = this.x + 0.5 - coords.x;
                    var dy = this.y + 0.5 - coords.y;
                    var dz = this.z + 0.5 - coords.z;
                    if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 4.5 && canTakeDamage(ent, "electricity") && Entity.getHealth(ent) > 0) {
                        discharge = true;
                        if (damage >= 24) {
                            Entity.setFire(ent, 1, true);
                            Entity.damageEntity(ent, damage, 6);
                        }
                        else
                            Entity.damageEntity(ent, damage);
                    }
                }
                if (discharge)
                    this.data.energy = 1;
            }
            this.data.energy--;
        }
    },
    redstone: function (signal) {
        this.data.isActive = signal.power > 0;
    },
    getEnergyStorage: function () {
        return 10000;
    }
});
IDRegistry.genBlockID("nuke");
Block.createBlock("nuke", [
    { name: "Nuke", texture: [["nuke_bottom", 0], ["nuke_top", 0], ["nuke_sides", 0], ["nuke_sides", 0], ["nuke_sides", 0], ["nuke_sides", 0]], inCreative: true }
], "machine");
ItemName.setRarity(BlockID.nuke, 1, true);
TileRenderer.setStandartModel(BlockID.nuke, [["nuke_bottom", 0], ["nuke_top", 0], ["nuke_sides", 0], ["nuke_sides", 0], ["nuke_sides", 0], ["nuke_sides", 0]]);
TileRenderer.registerRenderModel(BlockID.nuke, 0, [["tnt_active", 0]]);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.nuke, count: 1, data: 0 }, [
        "ncn",
        "x#x",
        "ncn"
    ], ['#', 46, -1, 'x', ItemID.uranium235, 0, 'c', ItemID.circuitAdvanced, 0, 'n', ItemID.neutronReflectorThick, 0]);
    Recipes.addShaped({ id: BlockID.nuke, count: 1, data: 0 }, [
        "ncn",
        "x#x",
        "ncn"
    ], ['#', 46, -1, 'x', ItemID.plutonium, 0, 'c', ItemID.circuitAdvanced, 0, 'n', ItemID.neutronReflectorThick, 0]);
});
MachineRegistry.registerPrototype(BlockID.nuke, {
    defaultValues: {
        activated: false,
        timer: 300
    },
    explode: function (radius) {
        SoundManager.playSound("NukeExplosion.ogg");
        var entities = Entity.getAll();
        var rad = radius * 1.5;
        for (var i_28 in entities) {
            var ent = entities[i_28];
            var dist = Entity.getDistanceBetweenCoords(this, Entity.getPosition(ent));
            if (dist <= rad) {
                var damage = Math.ceil(rad * rad * 25 / (dist * dist));
                if (damage >= 100) {
                    Entity.damageEntity(ent, damage);
                }
                else {
                    Entity.damageEntity(ent, damage, 11);
                }
            }
        }
        var height = radius / 2;
        for (var dx = -radius; dx <= radius; dx++)
            for (var dy = -height; dy <= height; dy++)
                for (var dz = -radius; dz <= radius; dz++) {
                    if (Math.sqrt(dx * dx + dy * dy * 4 + dz * dz) <= radius) {
                        var xx = this.x + dx, yy = this.y + dy, zz = this.z + dz;
                        var block = World.getBlock(xx, yy, zz);
                        if (block.id > 0 && Block.getExplosionResistance(block.id) < 10000) {
                            World.setBlock(xx, yy, zz, 0);
                            if (Math.random() < 0.01) {
                                var drop = ToolLib.getBlockDrop({ x: xx, y: yy, z: zz }, block.id, block.data, 100);
                                if (drop)
                                    for (var i_29 in drop) {
                                        var item = drop[i_29];
                                        World.drop(xx, yy, zz, item[0], item[1], item[2]);
                                    }
                            }
                        }
                        if (Math.random() < 0.001) {
                            Particles.addParticle(ParticleType.hugeexplosionSeed, xx, yy, zz, 0, 0, 0);
                        }
                    }
                }
        RadiationAPI.addRadiationSource(this.x + .5, this.y + .5, this.z + .5, radius * 2, 600);
    },
    tick: function () {
        if (this.data.activated) {
            if (this.data.timer <= 0) {
                this.explode(20);
                this.selfDestroy();
                return;
            }
            if (this.data.timer % 10 < 5) {
                TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, 0);
            }
            else {
                BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
            }
            this.data.timer--;
        }
    },
    redstone: function (signal) {
        if (signal.power > 0) {
            this.data.activated = true;
        }
    },
    destroy: function () {
        BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
    }
});
IDRegistry.genItemID("latex");
Item.createItem("latex", "Latex", { name: "latex", data: 0 });
IDRegistry.genItemID("rubber");
Item.createItem("rubber", "Rubber", { name: "rubber", data: 0 });
Recipes.addFurnace(ItemID.latex, ItemID.rubber, 0);
Recipes.addShaped({ id: 50, count: 4, data: 0 }, [
    "x",
    "#"
], ['x', ItemID.latex, 0, '#', 280, 0]);
Recipes.addShaped({ id: 29, count: 1, data: 0 }, [
    "x",
    "p"
], ['x', ItemID.latex, 0, 'p', 33, 0]);
// Crushed Ore
IDRegistry.genItemID("crushedCopper");
Item.createItem("crushedCopper", "Crushed Copper Ore", { name: "crushed_copper_ore" });
IDRegistry.genItemID("crushedTin");
Item.createItem("crushedTin", "Crushed Tin Ore", { name: "crushed_tin_ore" });
IDRegistry.genItemID("crushedIron");
Item.createItem("crushedIron", "Crushed Iron Ore", { name: "crushed_iron_ore" });
IDRegistry.genItemID("crushedLead");
Item.createItem("crushedLead", "Crushed Lead Ore", { name: "crushed_lead_ore" });
IDRegistry.genItemID("crushedGold");
Item.createItem("crushedGold", "Crushed Gold Ore", { name: "crushed_gold_ore" });
IDRegistry.genItemID("crushedSilver");
Item.createItem("crushedSilver", "Crushed Silver Ore", { name: "crushed_silver_ore" });
IDRegistry.genItemID("crushedUranium");
Item.createItem("crushedUranium", "Crushed Uranium Ore", { name: "crushed_uranium_ore" });
Item.addCreativeGroup("oreCrushed", Translation.translate("Crushed Ores"), [
    ItemID.crushedCopper,
    ItemID.crushedTin,
    ItemID.crushedIron,
    ItemID.crushedLead,
    ItemID.crushedGold,
    ItemID.crushedSilver,
    ItemID.crushedUranium
]);
// Purified Crushed Ore
IDRegistry.genItemID("crushedPurifiedCopper");
Item.createItem("crushedPurifiedCopper", "Purified Crushed Copper Ore", { name: "purified_copper_ore" });
IDRegistry.genItemID("crushedPurifiedTin");
Item.createItem("crushedPurifiedTin", "Purified Crushed Tin Ore", { name: "purified_tin_ore" });
IDRegistry.genItemID("crushedPurifiedIron");
Item.createItem("crushedPurifiedIron", "Purified Crushed Iron Ore", { name: "purified_iron_ore" });
IDRegistry.genItemID("crushedPurifiedLead");
Item.createItem("crushedPurifiedLead", "Purified Crushed Lead Ore", { name: "purified_lead_ore" });
IDRegistry.genItemID("crushedPurifiedGold");
Item.createItem("crushedPurifiedGold", "Purified Crushed Gold Ore", { name: "purified_gold_ore" });
IDRegistry.genItemID("crushedPurifiedSilver");
Item.createItem("crushedPurifiedSilver", "Purified Crushed Silver Ore", { name: "purified_silver_ore" });
IDRegistry.genItemID("crushedPurifiedUranium");
Item.createItem("crushedPurifiedUranium", "Purified Crushed Uranium Ore", { name: "purified_uranium_ore" });
Item.addCreativeGroup("oreCrushedPurified", Translation.translate("Purified Crushed Ores"), [
    ItemID.crushedPurifiedCopper,
    ItemID.crushedPurifiedTin,
    ItemID.crushedPurifiedIron,
    ItemID.crushedPurifiedLead,
    ItemID.crushedPurifiedGold,
    ItemID.crushedPurifiedSilver,
    ItemID.crushedPurifiedUranium
]);
//Dust
IDRegistry.genItemID("dustCopper");
Item.createItem("dustCopper", "Copper Dust", { name: "dust_copper" });
IDRegistry.genItemID("dustTin");
Item.createItem("dustTin", "Tin Dust", { name: "dust_tin" });
IDRegistry.genItemID("dustBronze");
Item.createItem("dustBronze", "Bronze Dust", { name: "dust_bronze" });
IDRegistry.genItemID("dustIron");
Item.createItem("dustIron", "Iron Dust", { name: "dust_iron" });
IDRegistry.genItemID("dustSteel");
Item.createItem("dustSteel", "Steel Dust", { name: "dust_steel" });
IDRegistry.genItemID("dustLead");
Item.createItem("dustLead", "Lead Dust", { name: "dust_lead" });
IDRegistry.genItemID("dustGold");
Item.createItem("dustGold", "Gold Dust", { name: "dust_gold" });
IDRegistry.genItemID("dustSilver");
Item.createItem("dustSilver", "Silver Dust", { name: "dust_silver" });
IDRegistry.genItemID("dustStone");
Item.createItem("dustStone", "Stone Dust", { name: "dust_stone" });
IDRegistry.genItemID("dustCoal");
Item.createItem("dustCoal", "Coal Dust", { name: "dust_coal" });
IDRegistry.genItemID("dustSulfur");
Item.createItem("dustSulfur", "Sulfur Dust", { name: "dust_sulfur" });
IDRegistry.genItemID("dustLapis");
Item.createItem("dustLapis", "Lapis Dust", { name: "dust_lapis" });
IDRegistry.genItemID("dustDiamond");
Item.createItem("dustDiamond", "Diamond Dust", { name: "dust_diamond" });
IDRegistry.genItemID("dustEnergium");
Item.createItem("dustEnergium", "Energium Dust", { name: "dust_energium" });
Item.addCreativeGroup("dust", Translation.translate("Dusts"), [
    ItemID.dustCopper,
    ItemID.dustTin,
    ItemID.dustBronze,
    ItemID.dustIron,
    ItemID.dustSteel,
    ItemID.dustLead,
    ItemID.dustGold,
    ItemID.dustSilver,
    ItemID.dustStone,
    ItemID.dustCoal,
    ItemID.dustSulfur,
    ItemID.dustLapis,
    ItemID.dustDiamond,
    ItemID.dustEnergium
]);
// Small Dust
IDRegistry.genItemID("dustSmallCopper");
Item.createItem("dustSmallCopper", "Tiny Pile of Copper Dust", { name: "dust_copper_small" });
IDRegistry.genItemID("dustSmallTin");
Item.createItem("dustSmallTin", "Tiny Pile of Tin Dust", { name: "dust_tin_small" });
IDRegistry.genItemID("dustSmallIron");
Item.createItem("dustSmallIron", "Tiny Pile of Iron Dust", { name: "dust_iron_small" });
IDRegistry.genItemID("dustSmallLead");
Item.createItem("dustSmallLead", "Tiny Pile of Lead Dust", { name: "dust_lead_small" });
IDRegistry.genItemID("dustSmallGold");
Item.createItem("dustSmallGold", "Tiny Pile of Gold Dust", { name: "dust_gold_small" });
IDRegistry.genItemID("dustSmallSilver");
Item.createItem("dustSmallSilver", "Tiny Pile of Silver Dust", { name: "dust_silver_small" });
IDRegistry.genItemID("dustSmallSulfur");
Item.createItem("dustSmallSulfur", "Tiny Pile of Sulfur Dust", { name: "dust_sulfur_small" });
Item.addCreativeGroup("dustSmall", Translation.translate("Small Dusts"), [
    ItemID.dustSmallCopper,
    ItemID.dustSmallTin,
    ItemID.dustSmallIron,
    ItemID.dustSmallLead,
    ItemID.dustSmallGold,
    ItemID.dustSmallSilver,
    ItemID.dustSmallSulfur
]);
// Recipe
Recipes.addShaped({ id: ItemID.dustEnergium, count: 9, data: 0 }, [
    "xax",
    "axa",
    "xax",
], ['x', 331, 0, 'a', ItemID.dustDiamond, 0]);
addShapelessRecipe({ id: ItemID.dustBronze, count: 4, data: 0 }, [{ id: ItemID.crushedCopper, count: 3, data: 0 }, { id: ItemID.crushedTin, count: 1, data: 0 }]);
addShapelessRecipe({ id: ItemID.dustBronze, count: 4, data: 0 }, [{ id: ItemID.crushedPurifiedCopper, count: 3, data: 0 }, { id: ItemID.crushedPurifiedTin, count: 1, data: 0 }]);
addShapelessRecipe({ id: ItemID.dustBronze, count: 4, data: 0 }, [{ id: ItemID.dustCopper, count: 3, data: 0 }, { id: ItemID.dustTin, count: 1, data: 0 }]);
Recipes.addShaped({ id: ItemID.dustCopper, count: 1, data: 0 }, [
    "xxx",
    "xxx",
    "xxx",
], ['x', ItemID.dustSmallCopper, 0]);
Recipes.addShaped({ id: ItemID.dustTin, count: 1, data: 0 }, [
    "xxx",
    "xxx",
    "xxx",
], ['x', ItemID.dustSmallTin, 0]);
Recipes.addShaped({ id: ItemID.dustIron, count: 1, data: 0 }, [
    "xxx",
    "xxx",
    "xxx",
], ['x', ItemID.dustSmallIron, 0]);
Recipes.addShaped({ id: ItemID.dustLead, count: 1, data: 0 }, [
    "xxx",
    "xxx",
    "xxx",
], ['x', ItemID.dustSmallLead, 0]);
Recipes.addShaped({ id: ItemID.dustGold, count: 1, data: 0 }, [
    "xxx",
    "xxx",
    "xxx",
], ['x', ItemID.dustSmallGold, 0]);
Recipes.addShaped({ id: ItemID.dustSilver, count: 1, data: 0 }, [
    "xxx",
    "xxx",
    "xxx",
], ['x', ItemID.dustSmallSilver, 0]);
Recipes.addShaped({ id: ItemID.dustSulfur, count: 1, data: 0 }, [
    "xxx",
    "xxx",
    "xxx",
], ['x', ItemID.dustSmallSulfur, 0]);
// alternative
Recipes.addShaped({ id: 348, count: 1, data: 0 }, [
    "xax",
    "axa",
    "xax",
], ['x', 331, 0, 'a', ItemID.dustGold, 0]);
Recipes.addShaped({ id: 289, count: 3, data: 0 }, [
    "xax",
    "axa",
    "xax",
], ['x', 331, 0, 'a', ItemID.dustCoal, 0]);
IDRegistry.genItemID("ingotCopper");
Item.createItem("ingotCopper", "Copper Ingot", { name: "ingot_copper" });
IDRegistry.genItemID("ingotTin");
Item.createItem("ingotTin", "Tin Ingot", { name: "ingot_tin" });
IDRegistry.genItemID("ingotBronze");
Item.createItem("ingotBronze", "Bronze Ingot", { name: "ingot_bronze" });
IDRegistry.genItemID("ingotSteel");
Item.createItem("ingotSteel", "Steel Ingot", { name: "ingot_steel" });
IDRegistry.genItemID("ingotLead");
Item.createItem("ingotLead", "Lead Ingot", { name: "ingot_lead" });
IDRegistry.genItemID("ingotSilver");
Item.createItem("ingotSilver", "Silver Ingot", { name: "ingot_silver" });
IDRegistry.genItemID("ingotAlloy");
Item.createItem("ingotAlloy", "Alloy Ingot", { name: "ingot_alloy" });
Item.addCreativeGroup("ingot", Translation.translate("Ingots"), [
    ItemID.ingotCopper,
    ItemID.ingotTin,
    ItemID.ingotBronze,
    ItemID.ingotSteel,
    ItemID.ingotLead,
    ItemID.ingotSilver,
    ItemID.ingotAlloy
]);
Callback.addCallback("PreLoaded", function () {
    // from ore
    Recipes.addFurnace(BlockID.oreCopper, ItemID.ingotCopper, 0);
    Recipes.addFurnace(BlockID.oreTin, ItemID.ingotTin, 0);
    Recipes.addFurnace(BlockID.oreLead, ItemID.ingotLead, 0);
    // from crushed ore
    Recipes.addFurnace(ItemID.crushedIron, 265, 0);
    Recipes.addFurnace(ItemID.crushedGold, 266, 0);
    Recipes.addFurnace(ItemID.crushedCopper, ItemID.ingotCopper, 0);
    Recipes.addFurnace(ItemID.crushedTin, ItemID.ingotTin, 0);
    Recipes.addFurnace(ItemID.crushedLead, ItemID.ingotLead, 0);
    Recipes.addFurnace(ItemID.crushedSilver, ItemID.ingotSilver, 0);
    // from purified ore
    Recipes.addFurnace(ItemID.crushedPurifiedIron, 265, 0);
    Recipes.addFurnace(ItemID.crushedPurifiedGold, 266, 0);
    Recipes.addFurnace(ItemID.crushedPurifiedCopper, ItemID.ingotCopper, 0);
    Recipes.addFurnace(ItemID.crushedPurifiedTin, ItemID.ingotTin, 0);
    Recipes.addFurnace(ItemID.crushedPurifiedLead, ItemID.ingotLead, 0);
    Recipes.addFurnace(ItemID.crushedPurifiedSilver, ItemID.ingotSilver, 0);
    // from dust
    Recipes.addFurnace(ItemID.dustCopper, ItemID.ingotCopper, 0);
    Recipes.addFurnace(ItemID.dustTin, ItemID.ingotTin, 0);
    Recipes.addFurnace(ItemID.dustLead, ItemID.ingotLead, 0);
    Recipes.addFurnace(ItemID.dustBronze, ItemID.ingotBronze, 0);
    Recipes.addFurnace(ItemID.dustSteel, ItemID.ingotSteel, 0);
    Recipes.addFurnace(ItemID.dustIron, 265, 0);
    Recipes.addFurnace(ItemID.dustGold, 266, 0);
    Recipes.addFurnace(ItemID.dustSilver, ItemID.ingotSilver, 0);
    // from plates
    Recipes.addFurnace(ItemID.plateCopper, ItemID.ingotCopper, 0);
    Recipes.addFurnace(ItemID.plateTin, ItemID.ingotTin, 0);
    Recipes.addFurnace(ItemID.plateBronze, ItemID.ingotBronze, 0);
    Recipes.addFurnace(ItemID.plateSteel, ItemID.ingotSteel, 0);
    Recipes.addFurnace(ItemID.plateIron, 265, 0);
    Recipes.addFurnace(ItemID.plateGold, 266, 0);
    Recipes.addFurnace(ItemID.plateLead, ItemID.ingotLead, 0);
    Recipes.addShaped({ id: ItemID.ingotAlloy, count: 2, data: 0 }, [
        "aaa",
        "bbb",
        "ccc"
    ], ['a', ItemID.plateSteel, 0, 'b', ItemID.plateBronze, 0, 'c', ItemID.plateTin, 0]);
    // alternative
    Recipes.addShaped({ id: 66, count: 12, data: 0 }, [
        "a a",
        "axa",
        "a a"
    ], ['x', 280, 0, 'a', ItemID.ingotBronze, 0]);
    Recipes.addShaped({ id: 33, count: 1, data: 0 }, [
        "ppp",
        "cbc",
        "cxc"
    ], ['x', 331, 0, 'b', ItemID.ingotBronze, 0, 'c', 4, -1, 'p', 5, -1]);
});
IDRegistry.genItemID("plateCopper");
Item.createItem("plateCopper", "Copper Plate", { name: "plate_copper" });
IDRegistry.genItemID("plateTin");
Item.createItem("plateTin", "Tin Plate", { name: "plate_tin" });
IDRegistry.genItemID("plateBronze");
Item.createItem("plateBronze", "Bronze Plate", { name: "plate_bronze" });
IDRegistry.genItemID("plateIron");
Item.createItem("plateIron", "Iron Plate", { name: "plate_iron" });
IDRegistry.genItemID("plateSteel");
Item.createItem("plateSteel", "Steel Plate", { name: "plate_steel" });
IDRegistry.genItemID("plateGold");
Item.createItem("plateGold", "Gold Plate", { name: "plate_gold" });
IDRegistry.genItemID("plateLead");
Item.createItem("plateLead", "Lead Plate", { name: "plate_lead" });
IDRegistry.genItemID("plateLapis");
Item.createItem("plateLapis", "Lapis Plate", { name: "plate_lapis" });
Item.addCreativeGroup("plate", Translation.translate("Plates"), [
    ItemID.plateCopper,
    ItemID.plateTin,
    ItemID.plateBronze,
    ItemID.plateIron,
    ItemID.plateSteel,
    ItemID.plateGold,
    ItemID.plateLead,
    ItemID.plateLapis
]);
// recipes
Callback.addCallback("PreLoaded", function () {
    ICTool.addRecipe({ id: ItemID.plateCopper, count: 1, data: 0 }, [{ id: ItemID.ingotCopper, data: 0 }], ItemID.craftingHammer);
    ICTool.addRecipe({ id: ItemID.plateTin, count: 1, data: 0 }, [{ id: ItemID.ingotTin, data: 0 }], ItemID.craftingHammer);
    ICTool.addRecipe({ id: ItemID.plateBronze, count: 1, data: 0 }, [{ id: ItemID.ingotBronze, data: 0 }], ItemID.craftingHammer);
    ICTool.addRecipe({ id: ItemID.plateIron, count: 1, data: 0 }, [{ id: 265, data: 0 }], ItemID.craftingHammer);
    ICTool.addRecipe({ id: ItemID.plateGold, count: 1, data: 0 }, [{ id: 266, data: 0 }], ItemID.craftingHammer);
    ICTool.addRecipe({ id: ItemID.plateLead, count: 1, data: 0 }, [{ id: ItemID.ingotLead, data: 0 }], ItemID.craftingHammer);
});
IDRegistry.genItemID("densePlateCopper");
Item.createItem("densePlateCopper", "Dense Copper Plate", { name: "dense_plate_copper" });
IDRegistry.genItemID("densePlateTin");
Item.createItem("densePlateTin", "Dense Tin Plate", { name: "dense_plate_tin" });
IDRegistry.genItemID("densePlateBronze");
Item.createItem("densePlateBronze", "Dense Bronze Plate", { name: "dense_plate_bronze" });
IDRegistry.genItemID("densePlateIron");
Item.createItem("densePlateIron", "Dense Iron Plate", { name: "dense_plate_iron" });
IDRegistry.genItemID("densePlateSteel");
Item.createItem("densePlateSteel", "Dense Steel Plate", { name: "dense_plate_steel" });
IDRegistry.genItemID("densePlateGold");
Item.createItem("densePlateGold", "Dense Gold Plate", { name: "dense_plate_gold" });
IDRegistry.genItemID("densePlateLead");
Item.createItem("densePlateLead", "Dense Lead Plate", { name: "dense_plate_lead" });
Item.addCreativeGroup("plateDense", Translation.translate("Desne Plates"), [
    ItemID.densePlateCopper,
    ItemID.densePlateTin,
    ItemID.densePlateBronze,
    ItemID.densePlateIron,
    ItemID.densePlateSteel,
    ItemID.densePlateGold,
    ItemID.densePlateLead
]);
IDRegistry.genItemID("casingCopper");
Item.createItem("casingCopper", "Copper Casing", { name: "casing_copper" });
IDRegistry.genItemID("casingTin");
Item.createItem("casingTin", "Tin Casing", { name: "casing_tin" });
IDRegistry.genItemID("casingBronze");
Item.createItem("casingBronze", "Bronze Casing", { name: "casing_bronze" });
IDRegistry.genItemID("casingIron");
Item.createItem("casingIron", "Iron Casing", { name: "casing_iron" });
IDRegistry.genItemID("casingSteel");
Item.createItem("casingSteel", "Steel Casing", { name: "casing_steel" });
IDRegistry.genItemID("casingGold");
Item.createItem("casingGold", "Gold Casing", { name: "casing_gold" });
IDRegistry.genItemID("casingLead");
Item.createItem("casingLead", "Lead Casing", { name: "casing_lead" });
// creative group
Item.addCreativeGroup("casingMetal", Translation.translate("Metal Casings"), [
    ItemID.casingCopper,
    ItemID.casingLead,
    ItemID.casingGold,
    ItemID.casingSteel,
    ItemID.casingIron,
    ItemID.casingBronze,
    ItemID.casingTin
]);
// recipes
Callback.addCallback("PreLoaded", function () {
    ICTool.addRecipe({ id: ItemID.casingCopper, count: 2, data: 0 }, [{ id: ItemID.plateCopper, data: 0 }], ItemID.craftingHammer);
    ICTool.addRecipe({ id: ItemID.casingTin, count: 2, data: 0 }, [{ id: ItemID.plateTin, data: 0 }], ItemID.craftingHammer);
    ICTool.addRecipe({ id: ItemID.casingBronze, count: 2, data: 0 }, [{ id: ItemID.plateBronze, data: 0 }], ItemID.craftingHammer);
    ICTool.addRecipe({ id: ItemID.casingIron, count: 2, data: 0 }, [{ id: ItemID.plateIron, data: 0 }], ItemID.craftingHammer);
    ICTool.addRecipe({ id: ItemID.casingGold, count: 2, data: 0 }, [{ id: ItemID.plateGold, data: 0 }], ItemID.craftingHammer);
    ICTool.addRecipe({ id: ItemID.casingLead, count: 2, data: 0 }, [{ id: ItemID.plateLead, data: 0 }], ItemID.craftingHammer);
});
IDRegistry.genItemID("uranium");
Item.createItem("uranium", "Enriched Uranium", { name: "uranium" });
RadiationAPI.regRadioactiveItem(ItemID.uranium, 60);
IDRegistry.genItemID("uranium235");
Item.createItem("uranium235", "Uranium 235", { name: "uranium235" });
RadiationAPI.regRadioactiveItem(ItemID.uranium235, 150);
IDRegistry.genItemID("smallUranium235");
Item.createItem("smallUranium235", "Piece of Uranium 235", { name: "small_uranium235" });
RadiationAPI.regRadioactiveItem(ItemID.smallUranium235, 150);
IDRegistry.genItemID("uranium238");
Item.createItem("uranium238", "Uranium 238", { name: "uranium238" });
RadiationAPI.regRadioactiveItem(ItemID.uranium238, 10, true);
IDRegistry.genItemID("smallUranium238");
Item.createItem("smallUranium238", "Piece of Uranium 238", { name: "small_uranium238" });
RadiationAPI.regRadioactiveItem(ItemID.smallUranium238, 10, true);
IDRegistry.genItemID("plutonium");
Item.createItem("plutonium", "Plutonium", { name: "plutonium" });
RadiationAPI.regRadioactiveItem(ItemID.plutonium, 150);
IDRegistry.genItemID("smallPlutonium");
Item.createItem("smallPlutonium", "Piece of Plutonium", { name: "small_plutonium" });
RadiationAPI.regRadioactiveItem(ItemID.smallPlutonium, 150);
IDRegistry.genItemID("mox");
Item.createItem("mox", "MOX Nuclear Fuel", { name: "mox" });
RadiationAPI.regRadioactiveItem(ItemID.mox, 300);
IDRegistry.genItemID("rtgPellet");
Item.createItem("rtgPellet", "Pellets of RTG Fuel", { name: "rtg_pellet" }, { stack: 1 });
RadiationAPI.regRadioactiveItem(ItemID.rtgPellet, 1, true);
Item.addCreativeGroup("nuclear", Translation.translate("Nuclear"), [
    ItemID.uranium,
    ItemID.uranium235,
    ItemID.smallUranium235,
    ItemID.uranium238,
    ItemID.smallUranium238,
    ItemID.plutonium,
    ItemID.smallPlutonium,
    ItemID.mox,
    ItemID.rtgPellet
]);
Recipes.addShaped({ id: ItemID.uranium, count: 1, data: 0 }, [
    "xxx",
    "aaa",
    "xxx"
], ['x', ItemID.uranium238, 0, 'a', ItemID.smallUranium235, 0]);
Recipes.addShaped({ id: ItemID.uranium235, count: 1, data: 0 }, [
    "xxx",
    "xxx",
    "xxx"
], ['x', ItemID.smallUranium235, 0]);
Recipes.addShaped({ id: ItemID.plutonium, count: 1, data: 0 }, [
    "xxx",
    "xxx",
    "xxx"
], ['x', ItemID.smallPlutonium, 0]);
Recipes.addShaped({ id: ItemID.mox, count: 1, data: 0 }, [
    "xxx",
    "aaa",
    "xxx"
], ['x', ItemID.smallPlutonium, 0, 'a', ItemID.uranium238, 0]);
Recipes.addShaped({ id: ItemID.rtgPellet, count: 1, data: 0 }, [
    "xxx",
    "aaa",
    "xxx"
], ['x', ItemID.densePlateIron, 0, 'a', ItemID.plutonium, 0]);
Recipes.addShapeless({ id: ItemID.smallUranium235, count: 9, data: 0 }, [{ id: ItemID.uranium235, data: 0 }]);
Recipes.addShapeless({ id: ItemID.smallPlutonium, count: 9, data: 0 }, [{ id: ItemID.plutonium, data: 0 }]);
IDRegistry.genItemID("scrap");
Item.createItem("scrap", "Scrap", { name: "scrap" });
Recipes.addFurnaceFuel(ItemID.scrap, 0, 350);
IDRegistry.genItemID("scrapBox");
Item.createItem("scrapBox", "Scrap Box", { name: "scrap_box" });
Recipes.addFurnaceFuel(ItemID.scrapBox, 0, 3150);
Recipes.addShaped({ id: ItemID.scrapBox, count: 1, data: 0 }, [
    "xxx",
    "xxx",
    "xxx"
], ['x', ItemID.scrap, 0]);
MachineRecipeRegistry.addRecipeFor("catalyser", ItemID.scrap, { input: 5000, output: 30000 });
MachineRecipeRegistry.addRecipeFor("catalyser", ItemID.scrapBox, { input: 45000, output: 270000 });
var SCRAP_BOX_RANDOM_DROP = [
    { chance: 0.1, id: 264, data: 0 },
    { chance: 1.8, id: 15, data: 0 },
    { chance: 1, id: 14, data: 0 },
    { chance: 3, id: 331, data: 0 },
    { chance: 0.8, id: 348, data: 0 },
    { chance: 5, id: 351, data: 15 },
    { chance: 2, id: 17, data: 0 },
    { chance: 2, id: 6, data: 0 },
    { chance: 2, id: 263, data: 0 },
    { chance: 3, id: 260, data: 0 },
    { chance: 2.1, id: 262, data: 0 },
    { chance: 1, id: 354, data: 0 },
    { chance: 3, id: 296, data: 0 },
    { chance: 5, id: 280, data: 0 },
    { chance: 3.5, id: 287, data: 0 },
    { chance: 10, id: 3, data: 0 },
    { chance: 3, id: 12, data: 0 },
    { chance: 3, id: 13, data: 0 },
    { chance: 4, id: 2, data: 0 },
    { chance: 1.2, id: ItemID.dustCoal, data: 0 },
    { chance: 1.2, id: ItemID.dustCopper, data: 0 },
    { chance: 1.2, id: ItemID.dustTin, data: 0 },
    { chance: 1.2, id: ItemID.dustIron, data: 0 },
    { chance: 0.8, id: ItemID.dustGold, data: 0 },
    { chance: 0.8, id: ItemID.dustLead, data: 0 },
    { chance: 0.6, id: ItemID.dustSilver, data: 0 },
    { chance: 0.4, id: ItemID.dustDiamond, data: 0 },
    { chance: 0.4, id: BlockID.oreUranium, data: 0 },
    { chance: 2, id: BlockID.oreCopper, data: 0 },
    { chance: 1.5, id: BlockID.oreTin, data: 0 },
    { chance: 1, id: BlockID.oreLead, data: 0 },
    { chance: 2, id: ItemID.rubber, data: 0 },
    { chance: 2, id: ItemID.latex, data: 0 },
    { chance: 2.5, id: ItemID.tinCanFull, data: 0 },
];
function getScrapDropItem() {
    var total = 0;
    for (var i in SCRAP_BOX_RANDOM_DROP) {
        total += SCRAP_BOX_RANDOM_DROP[i].chance;
    }
    var random = Math.random() * total * 1.35;
    var current = 0;
    for (var i in SCRAP_BOX_RANDOM_DROP) {
        var drop = SCRAP_BOX_RANDOM_DROP[i];
        if (current < random && current + drop.chance > random) {
            return drop;
        }
        current += drop.chance;
    }
    return { id: ItemID.scrap, data: 0 };
}
Item.registerUseFunction("scrapBox", function (coords, item, block) {
    var drop = getScrapDropItem();
    World.drop(coords.relative.x + 0.5, coords.relative.y + 0.1, coords.relative.z + 0.5, drop.id, 1, drop.data);
    Player.decreaseCarriedItem(1);
});
IDRegistry.genItemID("matter");
Item.createItem("matter", "UU-Matter", { name: "uu_matter" });
ItemName.setRarity(ItemID.matter, 2, true);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: ItemID.iridiumChunk, count: 1, data: 0 }, [
        "xxx",
        " x ",
        "xxx"
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 264, count: 1, data: 0 }, [
        "xxx",
        "xxx",
        "xxx"
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 17, count: 8, data: 0 }, [
        " x ",
        "   ",
        "   "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 1, count: 16, data: 0 }, [
        "   ",
        " x ",
        "   "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 2, count: 16, data: 0 }, [
        "   ",
        "x  ",
        "x  "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 80, count: 4, data: 0 }, [
        "x x",
        "   ",
        "   "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 8, count: 1, data: 0 }, [
        "   ",
        " x ",
        " x "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 10, count: 1, data: 0 }, [
        " x ",
        " x ",
        " x "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 35, count: 12, data: 0 }, [
        "x x",
        "   ",
        " x "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 106, count: 24, data: 0 }, [
        "x  ",
        "x  ",
        "x  "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 332, count: 24, data: 0 }, [
        "   ",
        "   ",
        "xxx"
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 20, count: 32, data: 0 }, [
        " x ",
        "x x",
        " x "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 49, count: 12, data: 0 }, [
        "x x",
        "x x",
        "   "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 288, count: 32, data: 0 }, [
        " x ",
        " x ",
        "x x"
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 351, count: 48, data: 0 }, [
        " xx",
        " xx",
        " x "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 351, count: 32, data: 3 }, [
        "xx ",
        "  x",
        "xx "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 351, count: 9, data: 4 }, [
        " x ",
        " x ",
        " xx"
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 337, count: 48, data: 0 }, [
        "xx ",
        "x  ",
        "xx "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 110, count: 24, data: 0 }, [
        "   ",
        "x x",
        "xxx"
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 318, count: 32, data: 0 }, [
        " x ",
        "xx ",
        "xx "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 98, count: 48, data: 0 }, [
        "xx ",
        "xx ",
        "x  "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 89, count: 8, data: 0 }, [
        " x ",
        "x x",
        "xxx"
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 81, count: 48, data: 0 }, [
        " x ",
        "xxx",
        "x x"
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 338, count: 48, data: 0 }, [
        "x x",
        "x x",
        "x x"
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 289, count: 16, data: 0 }, [
        "xxx",
        "x  ",
        "xxx"
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 263, count: 20, data: 0 }, [
        "  x",
        "x  ",
        "  x"
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 331, count: 24, data: 0 }, [
        "   ",
        " x ",
        "xxx"
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 388, count: 2, data: 0 }, [
        "xxx",
        "xxx",
        " x "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: ItemID.latex, count: 21, data: 0 }, [
        "x x",
        "   ",
        "x x"
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 14, count: 2, data: 0 }, [
        " x ",
        "xxx",
        " x "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 15, count: 2, data: 0 }, [
        "x x",
        " x ",
        "x x"
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: BlockID.oreCopper, count: 5, data: 0 }, [
        "  x",
        "x x",
        "   "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: BlockID.oreTin, count: 5, data: 0 }, [
        "   ",
        "x x",
        "  x"
    ], ['x', ItemID.matter, -1]);
});
IDRegistry.genItemID("iridiumChunk");
Item.createItem("iridiumChunk", "Iridium", { name: "iridium" });
ItemName.setRarity(ItemID.iridiumChunk, 2, true);
IDRegistry.genItemID("plateReinforcedIridium");
Item.createItem("plateReinforcedIridium", "Iridium Reinforced Plate", { name: "plate_reinforced_iridium" });
ItemName.setRarity(ItemID.plateReinforcedIridium, 2, true);
IDRegistry.genItemID("plateAlloy");
Item.createItem("plateAlloy", "Alloy Plate", { name: "plate_alloy" });
IDRegistry.genItemID("carbonFibre");
Item.createItem("carbonFibre", "Carbon Fibre", { name: "carbon_fibre" });
IDRegistry.genItemID("carbonMesh");
Item.createItem("carbonMesh", "Carbon Mesh", { name: "carbon_mesh" });
IDRegistry.genItemID("carbonPlate");
Item.createItem("carbonPlate", "Carbon Plate", { name: "carbon_plate" });
IDRegistry.genItemID("coalBall");
Item.createItem("coalBall", "Coal Ball", { name: "coal_ball" });
IDRegistry.genItemID("coalBlock");
Item.createItem("coalBlock", "Coal Block", { name: "coal_block" });
IDRegistry.genItemID("coalChunk");
Item.createItem("coalChunk", "Coal Chunk", { name: "coal_chunk" });
Item.addCreativeGroup("ic2_material", Translation.translate("Materials"), [
    ItemID.iridiumChunk,
    ItemID.plateReinforcedIridium,
    ItemID.plateAlloy,
    ItemID.carbonFibre,
    ItemID.carbonMesh,
    ItemID.carbonPlate,
    ItemID.coalBall,
    ItemID.coalBlock,
    ItemID.coalChunk
]);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: ItemID.carbonFibre, count: 1, data: 0 }, [
        "xx",
        "xx"
    ], ['x', ItemID.dustCoal, 0]);
    Recipes.addShaped({ id: ItemID.carbonMesh, count: 1, data: 0 }, [
        "x",
        "x"
    ], ['x', ItemID.carbonFibre, 0]);
    Recipes.addShaped({ id: ItemID.coalBall, count: 1, data: 0 }, [
        "xxx",
        "x#x",
        "xxx"
    ], ['x', ItemID.dustCoal, 0, '#', 318, 0]);
    Recipes.addShaped({ id: ItemID.coalChunk, count: 1, data: 0 }, [
        "xxx",
        "x#x",
        "xxx"
    ], ['x', ItemID.coalBlock, -1, '#', 49, -1]);
    Recipes.addShaped({ id: ItemID.plateReinforcedIridium, count: 1, data: 0 }, [
        "xax",
        "a#a",
        "xax"
    ], ['x', ItemID.iridiumChunk, 0, '#', 264, 0, 'a', ItemID.plateAlloy, 0]);
});
LiquidRegistry.registerLiquid("biomass", "Biomass", ["liquid_biomass", "liquid_biomass_48x30", "liquid_biomass_55x47"]);
LiquidRegistry.registerLiquid("biogas", "Biogas", ["liquid_biogas", "liquid_biogas_55x47"]);
LiquidRegistry.registerLiquid("coolant", "Coolant", ["liquid_coolant", "liquid_coolant_110x94"]);
LiquidRegistry.getLiquidData("lava").uiTextures.push("gui_lava_texture_55x47");
LiquidRegistry.getLiquidData("water").uiTextures.push("gui_water_texture_47x24");
LiquidRegistry.getLiquidData("water").uiTextures.push("gui_water_texture_55x47");
IDRegistry.genItemID("cellEmpty");
Item.createItem("cellEmpty", "Cell", { name: "cell_empty" });
Item.setLiquidClip(ItemID.cellEmpty, true);
IDRegistry.genItemID("cellWater");
IDRegistry.genItemID("cellLava");
IDRegistry.genItemID("cellBiomass");
IDRegistry.genItemID("cellBiogas");
IDRegistry.genItemID("cellCoolant");
IDRegistry.genItemID("cellMatter");
IDRegistry.genItemID("cellAir");
Item.createItem("cellWater", "Water Cell", { name: "cell_water" });
Item.createItem("cellLava", "Lava Cell", { name: "cell_lava" });
Item.createItem("cellBiomass", "Biomass Cell", { name: "cell_biomass" });
Item.createItem("cellBiogas", "Biogas Cell", { name: "cell_biogas" });
Item.createItem("cellCoolant", "Coolant Cell", { name: "cell_coolant" });
//Item.createItem("cellMatter", "UU-Matter Cell", {name: "cell_uu_matter"});
Item.createItem("cellAir", "Compressed Air Cell", { name: "cell_air" });
LiquidLib.registerItem("water", ItemID.cellEmpty, ItemID.cellWater, 1000);
LiquidLib.registerItem("lava", ItemID.cellEmpty, ItemID.cellLava, 1000);
LiquidLib.registerItem("biomass", ItemID.cellEmpty, ItemID.cellBiomass, 1000);
LiquidLib.registerItem("biogas", ItemID.cellEmpty, ItemID.cellBiogas, 1000);
LiquidLib.registerItem("coolant", ItemID.cellEmpty, ItemID.cellCoolant, 1000);
ItemName.addStoredLiquidTooltip(ItemID.cellWater);
ItemName.addStoredLiquidTooltip(ItemID.cellLava);
ItemName.addStoredLiquidTooltip(ItemID.cellBiomass);
ItemName.addStoredLiquidTooltip(ItemID.cellBiogas);
ItemName.addStoredLiquidTooltip(ItemID.cellCoolant);
Item.addCreativeGroup("cells", Translation.translate("Cells"), [
    ItemID.cellEmpty,
    ItemID.cellWater,
    ItemID.cellLava,
    ItemID.cellBiomass,
    ItemID.cellBiogas,
    ItemID.cellCoolant,
    ItemID.cellMatter,
    ItemID.cellAir
]);
Recipes.addShaped({ id: ItemID.cellEmpty, count: 1, data: 0 }, [
    " x ",
    "xgx",
    " x "
], ['x', ItemID.casingTin, 0, 'g', 102, 0]);
Recipes.addShaped({ id: 49, count: 1, data: 0 }, [
    "aa",
    "bb"
], ['a', ItemID.cellLava, 0, 'b', ItemID.cellWater, 0]);
Item.registerUseFunction("cellEmpty", function (coords, item, block) {
    if (block.id > 7 && block.id < 12 && block.data == 0) {
        World.setBlock(coords.x, coords.y, coords.z, 0);
        if (block.id == 8 || block.id == 9) {
            Player.addItemToInventory(ItemID.cellWater, 1);
        }
        else {
            Player.addItemToInventory(ItemID.cellLava, 1);
        }
        Player.decreaseCarriedItem(1);
    }
});
Item.registerUseFunction("cellWater", function (coords, item, block) {
    if (item.data > 0 || block.id == BlockID.crop)
        return;
    var x = coords.relative.x;
    var y = coords.relative.y;
    var z = coords.relative.z;
    var block = World.getBlockID(x, y, z);
    if (block == 0 || block > 7 && block < 12) {
        World.setBlock(x, y, z, 8);
        Player.addItemToInventory(ItemID.cellEmpty, 1);
        Player.decreaseCarriedItem(1);
    }
});
Item.registerUseFunction("cellLava", function (coords, item, block) {
    if (item.data > 0)
        return;
    var x = coords.relative.x;
    var y = coords.relative.y;
    var z = coords.relative.z;
    var block = World.getBlockID(x, y, z);
    if (block == 0 || block > 7 && block < 12) {
        World.setBlock(x, y, z, 10);
        Player.addItemToInventory(ItemID.cellEmpty, 1);
        Player.decreaseCarriedItem(1);
    }
});
IDRegistry.genItemID("ashes");
Item.createItem("ashes", "Ashes", { name: "ashes" });
IDRegistry.genItemID("slag");
Item.createItem("slag", "Slag", { name: "slag" });
IDRegistry.genItemID("bioChaff");
Item.createItem("bioChaff", "Bio Chaff", { name: "bio_chaff" });
IDRegistry.genItemID("cropSeedBag");
Item.createItem("cropSeedBag", "Seed Bag (%s)", { name: "crop_seed_bag" }, { stack: 1, isTech: true });
Item.registerUseFunction("cropSeedBag", function (coords, item, block) {
    if (block.id == BlockID.crop) {
        var te = World.getTileEntity(coords.x, coords.y, coords.z);
        if (!te.data.crop) {
            var data = {
                statGrowth: item.extra.getInt("growth"),
                statGain: item.extra.getInt("gain"),
                statResistance: item.extra.getInt("resistance"),
                scanLevel: item.extra.getInt("scan")
            };
            var isCropPlanted = te.tryPlantIn(item.data, 1, data.statGrowth, data.statGain, data.statResistance, data.scanLevel);
            if (isCropPlanted && Game.getGameMode() != 1) {
                Player.decreaseCarriedItem(1);
            }
        }
    }
});
Item.addCreativeGroup("cropSeedBag", Translation.translate("Seed Bags"), [ItemID.cropSeedBag]);
Item.registerNameOverrideFunction(ItemID.cropSeedBag, function (item, name) {
    var extra = item.extra || new ItemExtraData();
    var scanLvl = extra.getInt("scan");
    var cropClassName = scanLvl > 0 ? AgricultureAPI.cropCards[item.data].id : "Unknown";
    var translatedCropName = Translation.translate(cropClassName);
    var newName = name.replace("%s", translatedCropName) + '\n';
    if (scanLvl >= 4) {
        newName += "§2Gr: " + extra.getInt("growth") + '\n';
        newName += "§6Ga: " + extra.getInt("gain") + '\n';
        newName += "§bRe: " + extra.getInt("resistance");
    }
    if (ConfigIC.debugMode) {
        newName += "[DEBUG]scanLevel: " + scanLvl;
    }
    return newName;
});
AgricultureAPI.registerCropCard({
    id: "weed",
    attributes: ["Weed", "Bad"],
    properties: {
        tier: 0,
        chemistry: 0,
        consumable: 0,
        defensive: 1,
        colorful: 0,
        weed: 5
    },
    baseSeed: {
        addToCreative: false,
        size: 1,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    maxSize: 5,
    getOptimalHarvestSize: function (crop) { return 1; },
    canBeHarvested: function (tileentity) { return false; },
    getGrowthDuration: function () { return 300; },
    getGain: function (tileentity) { return null; },
    onLeftClick: function (te) { return false; }
});
AgricultureAPI.registerCropCard({
    id: "wheat",
    texture: "ic2_wheat",
    attributes: ["Yellow", "Food", "Wheat"],
    base: "CropVanilla",
    properties: {
        tier: 1,
        chemistry: 0,
        consumable: 4,
        defensive: 0,
        colorful: 0,
        weed: 2
    },
    baseSeed: {
        id: 295,
        size: 1,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    maxSize: 7,
    sizeAfterHarvest: 2,
    getProduct: function () {
        return { id: 296, count: 1, data: 0 };
    },
    getSeed: function () {
        return { id: 295, count: 1, data: 0 };
    }
});
AgricultureAPI.registerCropCard({
    id: "pumpkin",
    attributes: ["Orange", "Decoration", "Stem"],
    base: "CropVanilla",
    properties: {
        tier: 1,
        chemistry: 0,
        consumable: 1,
        defensive: 0,
        colorful: 3,
        weed: 1
    },
    baseSeed: {
        id: 361,
        size: 1,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    maxSize: 4,
    getProduct: function () {
        return { id: 86, count: 1, data: 0 };
    },
    getGrowthDuration: function (te) {
        if (te.data.currentSize == 3)
            return 600;
        return 200;
    },
    getSeed: function () {
        return { id: 361, count: randomInt(1, 4), data: 0 };
    },
    getSizeAfterHarvest: function (te) {
        return this.maxSize - 1;
    }
});
AgricultureAPI.registerCropCard({
    id: "melon",
    attributes: ["Green", "Food", "Stem"],
    base: "CropVanilla",
    properties: {
        tier: 2,
        chemistry: 0,
        consumable: 4,
        defensive: 0,
        colorful: 2,
        weed: 0
    },
    baseSeed: {
        id: 362,
        size: 1,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    maxSize: 4,
    getProduct: function () {
        if (Math.random() < 0.5) {
            return { id: 103, count: 1, data: 0 };
        }
        return { id: 360, count: randomInt(2, 6), data: 0 };
    },
    getGrowthDuration: function (te) {
        if (te.currentSize == 3) {
            return 700;
        }
        return 250;
    },
    getSizeAfterHarvest: function (te) {
        return this.maxSize - 1;
    },
    getSeed: function () {
        return { id: 362, count: randomInt(1, 3), data: 0 };
    }
});
AgricultureAPI.registerCropCard({
    id: "dandelion",
    attributes: ["Yellow", "Flower"],
    base: "CropColorFlower",
    baseSeed: {
        id: 37,
        size: 4,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    color: 0
});
AgricultureAPI.registerCropCard({
    id: "rose",
    attributes: ["Red", "Flower", "Rose"],
    base: "CropColorFlower",
    baseSeed: {
        id: 38,
        size: 4,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    color: 1
});
AgricultureAPI.registerCropCard({
    id: "blackthorn",
    attributes: ["Black", "Flower", "Rose"],
    base: "CropColorFlower",
    color: 0
});
AgricultureAPI.registerCropCard({
    id: "tulip",
    attributes: ["Purple", "Flower", "Tulip"],
    base: "CropColorFlower",
    color: 5
});
AgricultureAPI.registerCropCard({
    id: "cyazint",
    attributes: ["Blue", "Flower"],
    base: "CropColorFlower",
    color: 6
});
AgricultureAPI.registerCropCard({
    id: "venomilia",
    attributes: ["Purple", "Flower", "Tulip", "Poison"],
    properties: {
        tier: 3,
        chemistry: 3,
        consumable: 1,
        defensive: 3,
        colorful: 3,
        weed: 3
    },
    maxSize: 6,
    getOptimalHarvestSize: function (crop) { return 4; },
    getDiscoveredBy: function () {
        return "raGan";
    },
    canGrow: function (tileentity) {
        var light = World.getLightLevel(tileentity.x, tileentity.y, tileentity.z);
        return (tileentity.data.currentSize <= 4 && light >= 12) || tileentity.data.currentSize == 5;
    },
    canBeHarvested: function (crop) {
        return crop.data.currentSize >= 4;
    },
    getGain: function (crop) {
        if (crop.data.currentSize == 5) {
            return { id: ItemID.grinPowder, count: 1, data: 0 };
        }
        if (crop.data.currentSize >= 4) {
            return { id: 351, count: 1, data: 5 };
        }
        return null;
    },
    getSizeAfterHarvest: function (crop) { return 3; },
    getGrowthDuration: function (crop) {
        if (crop.data.currentSize >= 3) {
            return 600;
        }
        return 400;
    },
    onRightClick: function (crop) {
        if (Player.getCarriedItem().id)
            this.onEntityCollision(crop);
        return crop.performManualHarvest();
    },
    onLeftClick: function (crop) {
        if (Player.getCarriedItem().id)
            this.onEntityCollision(crop);
        return crop.pick();
    },
    onEntityCollision: function (crop) {
        if (crop.data.currentSize == 5) {
            var armorSlot = Player.getArmorSlot(3);
            if (randomInt(0, 50) && armorSlot.id) {
                return AgricultureAPI.abstractFunctions["IC2CropCard"].onEntityCollision(crop);
            }
            Entity.addEffect(Player.get(), PotionEffect.poison, 1, (randomInt(0, 10) + 5) * 20);
            crop.data.currentSize = 4;
            crop.updateRender();
        }
        return AgricultureAPI.abstractFunctions["IC2CropCard"].onEntityCollision(crop);
    },
    isWeed: function (crop) {
        return crop.data.currentSize == 5 && crop.data.statGrowth >= 8;
    }
});
AgricultureAPI.registerCropCard({
    id: "reed",
    attributes: ["Reed"],
    properties: {
        tier: 2,
        chemistry: 0,
        consumable: 0,
        defensive: 2,
        colorful: 0,
        weed: 2
    },
    baseSeed: {
        id: 338,
        size: 1,
        growth: 3,
        gain: 0,
        resistance: 2
    },
    maxSize: 3,
    getDiscoveredBy: AgricultureAPI.abstractFunctions["CropVanilla"].getDiscoveredBy,
    canBeHarvested: function (te) {
        return te.data.currentSize > 1;
    },
    getGain: function (tileentity) {
        return { id: 338, count: tileentity.data.currentSize - 1, data: 0 };
    },
    onEntityCollision: function (te) { return false; },
    getGrowthDuration: function (te) {
        return 200;
    }
});
AgricultureAPI.registerCropCard({
    id: "stickreed",
    attributes: ["Reed", "Resin"],
    properties: {
        tier: 2,
        chemistry: 0,
        consumable: 0,
        defensive: 2,
        colorful: 0,
        weed: 2
    },
    maxSize: 4,
    getOptimalHarvestSize: function (crop) { return 4; },
    getDiscoveredBy: function () {
        return "raa1337";
    },
    canGrow: function (crop) {
        return crop.data.currentSize < 4;
    },
    canBeHarvested: function (te) {
        return te.data.currentSize > 1;
    },
    getGain: function (crop) {
        if (crop.data.currentSize <= 3) {
            return { id: 338, count: crop.data.currentSize - 1, data: 0 };
        }
        return { id: ItemID.latex, count: 1, data: 0 };
    },
    getSizeAfterHarvest: function (crop) {
        if (crop.data.currentSize == 4) {
            return randomInt(0, 3);
        }
        return 1;
    },
    onEntityCollision: function (crop) { return false; },
    getGrowthDuration: function (crop) {
        if (crop.data.currentSize == 4) {
            return 400;
        }
        return 100;
    }
});
AgricultureAPI.registerCropCard({
    id: "cocoa",
    texture: "ic2_cocoa",
    attributes: ["Brown", "Food", "Stem"],
    properties: {
        tier: 3,
        chemistry: 1,
        consumable: 3,
        defensive: 0,
        colorful: 4,
        weed: 0
    },
    baseSeed: {
        id: 351,
        data: 3,
        size: 1,
        growth: 0,
        gain: 0,
        resistance: 0
    },
    maxSize: 4,
    getDiscoveredBy: AgricultureAPI.abstractFunctions["IC2CropCard"].getDiscoveredBy,
    getOptimalHarvestSize: function (crop) { return 4; },
    canGrow: function (crop) {
        return crop.data.currentSize <= 3 && crop.data.storageNutrients >= 3;
    },
    canBeHarvested: function (crop) {
        return crop.data.currentSize == 4;
    },
    getGain: function (tileentity) {
        return { id: 351, count: 1, data: 3 };
    },
    getGrowthDuration: function (crop) {
        if (crop.data.currentSize == 3) {
            return 900;
        }
        return 400;
    },
    getSizeAfterHarvest: function (crop) {
        return 3;
    }
});
AgricultureAPI.registerCropCard({
    id: "red_mushroom",
    attributes: ["Red", "Food", "Mushroom"],
    base: "CropBaseMushroom",
    baseSeed: {
        id: 40,
        size: 1,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    getGain: function (te) {
        return { id: 40, count: 1, data: 0 };
    }
});
AgricultureAPI.registerCropCard({
    id: "brown_mushroom",
    attributes: ["Brown", "Food", "Mushroom"],
    base: "CropBaseMushroom",
    baseSeed: {
        id: 39,
        size: 1,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    getGain: function (te) {
        return { id: 39, count: 1, data: 0 };
    }
});
AgricultureAPI.registerCropCard({
    id: "nether_wart",
    texture: "ic2_nether_wart",
    attributes: ["Red", "Nether", "Ingredient", "Soulsand"],
    properties: {
        tier: 5,
        chemistry: 4,
        consumable: 2,
        defensive: 0,
        colorful: 2,
        weed: 1
    },
    baseSeed: {
        id: 372,
        size: 1,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    maxSize: 3,
    getDiscoveredBy: AgricultureAPI.abstractFunctions["CropVanilla"].getDiscoveredBy,
    dropGainChance: function (te) { return 2; },
    getGain: function (te) {
        return { id: 372, count: 1, data: 0 };
    },
    tick: function (te) {
        if (te.isBlockBelow(88)) {
            if (te.crop.canGrow(te)) {
                te.data.growthPoints += 100;
            }
        }
        else if (te.isBlockBelow(80) && Math.random() < 1 / 300) {
            te.data.crop = AgricultureAPI.getCardIndexFromid("terra_wart");
            te.crop = AgricultureAPI.cropCards[te.data.crop];
        }
    }
});
AgricultureAPI.registerCropCard({
    id: "terra_wart",
    attributes: ["Blue", "Aether", "Consumable", "Snow"],
    properties: {
        tier: 5,
        chemistry: 2,
        consumable: 4,
        defensive: 0,
        colorful: 3,
        weed: 0
    },
    baseSeed: {
        id: "ItemID.terraWart",
        size: 1,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    maxSize: 3,
    dropGainChance: function (te) { return .8; },
    getGain: function (te) {
        return { id: ItemID.terraWart, count: 1, data: 0 };
    },
    tick: function (te) {
        if (te.isBlockBelow(80)) {
            if (te.crop.canGrow(te)) {
                te.data.growthPoints += 100;
            }
        }
        else if (te.isBlockBelow(88) && Math.random() < 1 / 300) {
            te.data.crop = AgricultureAPI.getCardIndexFromid("nether_wart");
            te.crop = AgricultureAPI.cropCards[te.data.crop];
        }
    }
});
AgricultureAPI.registerCropCard({
    id: "ferru",
    attributes: ["Gray", "Leaves", "Metal"],
    base: "CropBaseMetalCommon",
    cropRootsRequirement: [15, 42],
    getGain: function (crop) {
        return { id: ItemID.dustSmallIron, count: 1, data: 0 };
    }
});
AgricultureAPI.registerCropCard({
    id: "cyprium",
    attributes: ["Orange", "Leaves", "Metal"],
    base: "CropBaseMetalCommon",
    cropRootsRequirement: ["BlockID.blockCopper", "BlockID.oreCopper"],
    getGain: function (crop) {
        return { id: ItemID.dustSmallCopper, count: 1, data: 0 };
    }
});
AgricultureAPI.registerCropCard({
    id: "stagnium",
    attributes: ["Shiny", "Leaves", "Metal"],
    base: "CropBaseMetalCommon",
    cropRootsRequirement: ["BlockID.blockTin", "BlockID.oreTin"],
    getGain: function (crop) {
        return { id: ItemID.dustSmallTin, count: 1, data: 0 };
    }
});
AgricultureAPI.registerCropCard({
    id: "plumbiscus",
    attributes: ["Dense", "Leaves", "Metal"],
    base: "CropBaseMetalCommon",
    cropRootsRequirement: ["BlockID.blockLead", "BlockID.oreLead"],
    getGain: function (crop) {
        return { id: ItemID.dustSmallLead, count: 1, data: 0 };
    }
});
AgricultureAPI.registerCropCard({
    id: "aurelia",
    attributes: ["Gold", "Leaves", "Metal"],
    base: "CropBaseMetalUncommon",
    cropRootsRequirement: [14, 41],
    getGain: function (crop) {
        return { id: 371, count: 1, data: 0 };
    }
});
AgricultureAPI.registerCropCard({
    id: "shining",
    attributes: ["Silver", "Leaves", "Metal"],
    base: "CropBaseMetalUncommon",
    cropRootsRequirement: ["BlockID.blockSilver", "BlockID.oreSilver"],
    getGain: function (crop) {
        return { id: ItemID.dustSmallSilver, count: 1, data: 0 };
    }
});
AgricultureAPI.registerCropCard({
    id: "redwheat",
    attributes: ["Red", "Redstone", "Wheat"],
    properties: {
        tier: 6,
        chemistry: 3,
        consumable: 0,
        defensive: 0,
        colorful: 2,
        weed: 0
    },
    maxSize: 7,
    getOptimalHarvestSize: function (crop) { return 7; },
    getDiscoveredBy: function () {
        return "raa1337";
    },
    canGrow: function (crop) {
        var light = World.getLightLevel(crop.x, crop.y, crop.z);
        return crop.data.currentSize < 7 && light <= 10 && light >= 5;
    },
    dropGainChance: function () { return 0.5; },
    getGain: function (crop) {
        if (Math.random() < 0.5)
            return { id: 331, count: 1, data: 0 };
        return { id: 295, count: 1, data: 0 };
    },
    getGrowthDuration: function (crop) { return 600; },
    getSizeAfterHarvest: function (crop) { return 2; }
});
AgricultureAPI.registerCropCard({
    id: "coffee",
    attributes: ["Leaves", "Ingredient", "Beans"],
    properties: {
        tier: 7,
        chemistry: 1,
        consumable: 4,
        defensive: 1,
        colorful: 2,
        weed: 0
    },
    baseSeed: {
        id: "ItemID.coffeeBeans",
        size: 1,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    maxSize: 5,
    getDiscoveredBy: function () {
        return "Snoochy";
    },
    canGrow: function (crop) {
        var light = World.getLightLevel(crop.x, crop.y, crop.z);
        return crop.data.currentSize < 5 && light >= 9;
    },
    getGrowthDuration: function (crop) {
        var base = AgricultureAPI.abstractFunctions["IC2CropCard"];
        if (crop.data.currentSize == 3) {
            return Math.round(base.getGrowthDuration(crop) * .5);
        }
        if (crop.data.currentSize == 4) {
            return Math.round(base.getGrowthDuration(crop) * 1.5);
        }
        return base.getGrowthDuration(crop);
    },
    canBeHarvested: function (crop) {
        return crop.data.currentSize >= 4;
    },
    getGain: function (crop) {
        if (crop.data.currentSize == 4)
            return null;
        return { id: ItemID.coffeeBeans, count: 1, data: 0 };
    },
    getSizeAfterHarvest: function (crop) { return 3; }
});
AgricultureAPI.registerCropCard({
    id: "hops",
    attributes: ["Green", "Ingredient", "Wheat"],
    properties: {
        tier: 5,
        chemistry: 2,
        consumable: 2,
        defensive: 0,
        colorful: 1,
        weed: 1
    },
    maxSize: 7,
    canGrow: function (crop) {
        var light = World.getLightLevel(crop.x, crop.y, crop.z);
        return crop.data.currentSize < 7 && light >= 9;
    },
    getGrowthDuration: function (crop) {
        return 600;
    },
    canBeHarvested: function (crop) {
        return crop.data.currentSize >= 4;
    },
    getGain: function (crop) {
        return { id: ItemID.hops, count: 1, data: 0 };
    },
    getSizeAfterHarvest: function (crop) { return 3; }
});
AgricultureAPI.registerCropCard({
    id: "carrots",
    texture: "ic2_carrots",
    attributes: ["Orange", "Food", "Carrots"],
    base: "CropVanilla",
    properties: {
        tier: 2,
        chemistry: 0,
        consumable: 4,
        defensive: 0,
        colorful: 0,
        weed: 2
    },
    baseSeed: {
        id: 391,
        size: 1,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    maxSize: 3,
    getProduct: function () {
        return { id: 391, count: 1, data: 0 };
    },
    getSeed: this.getProduct
});
AgricultureAPI.registerCropCard({
    id: "potato",
    attributes: ["Yellow", "Food", "Potato"],
    properties: {
        tier: 2,
        chemistry: 0,
        consumable: 4,
        defensive: 0,
        colorful: 0,
        weed: 2
    },
    baseSeed: {
        id: 392,
        size: 1,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    maxSize: 4,
    canGrow: AgricultureAPI.abstractFunctions["IC2CropCard"].canGrow,
    getOptimalHarvestSize: function (crop) { return 3; },
    canBeHarvested: function (crop) {
        return crop.data.currentSize >= 3;
    },
    getGain: function (crop) {
        if (crop.data.currentSize >= 4 && Math.random() < 0.05) {
            return { id: 394, count: 1, data: 0 };
        }
        if (crop.data.currentSize >= 3) {
            return { id: 392, count: 1, data: 0 };
        }
        return null;
    },
    getSizeAfterHarvest: function (te) { return 1; }
});
AgricultureAPI.registerCropCard({
    id: "eatingplant",
    attributes: ["Bad", "Food"],
    properties: {
        tier: 6,
        chemistry: 1,
        consumable: 1,
        defensive: 3,
        colorful: 1,
        weed: 4
    },
    baseSeed: {
        id: 81,
        size: 1,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    maxSize: 6,
    getOptimalHarvestSize: function (crop) { return 4; },
    getDiscoveredBy: function () {
        return "Hasudako";
    },
    canGrow: function (crop) {
        var light = World.getLightLevel(crop.x, crop.y, crop.z);
        if (crop.data.currentSize < 3) {
            return light > 10;
        }
        return crop.isBlockBelow(10) && crop.data.currentSize < this.maxSize() && light > 10;
    },
    canBeHarvested: function (crop) {
        return crop.data.currentSize >= 4 && crop.data.currentSize < 6;
    },
    getGain: function (crop) {
        if (crop.data.currentSize >= 4 && crop.data.currentSize < 6) {
            return { id: 81, count: 1, data: 0 };
        }
        return null;
    },
    tick: function (te) {
        if (te.data.currentSize == 1)
            return;
        var entity = Entity.findNearest({ x: this.x + .5, y: this.y + .5, z: this.z + .5 }, null, 2);
        if (!entity)
            return;
        Entity.damageEntity(entity, te.data.currentSize * 2);
        if (entity == player && !this.hasMetalArmor()) {
            Entity.addEffect(player, PotionEffect.poison, 1, 50);
        }
        if (te.crop.canGrow(te))
            te.data.growthPoints += 100;
        nativeDropItem(this.x, this.y, this.z, 0, 367, 1, 0, null);
    },
    nonMetalCheck: {
        298: true,
        299: true,
        300: true,
        301: true
    },
    hasMetalArmor: function () {
        for (var i = 0; i < 4; i++) {
            var armorSlot = Player.getArmorSlot(i);
            if (!armorSlot.id || this.nonMetalCheck[armorSlot.id])
                return false;
        }
        return true;
    },
    getGrowthDuration: function (crop) {
        var multiplier = 1;
        var base = AgricultureAPI.abstractFunctions["IC2CropCard"];
        //todo: compare with PC version when BiomeDictionary will be available
        return Math.round(base.getGrowthDuration(crop) * multiplier);
    },
    getSizeAfterHarvest: function (te) { return 1; },
    getRootsLength: function (crop) { return 5; }
});
AgricultureAPI.registerCropCard({
    id: "beetroots",
    attributes: ["Red", "Food", "Beetroot"],
    base: "CropVanilla",
    properties: {
        tier: 1,
        chemistry: 0,
        consumable: 4,
        defensive: 0,
        colorful: 1,
        weed: 2
    },
    baseSeed: {
        id: 458,
        size: 1,
        growth: 1,
        gain: 1,
        resistance: 1
    },
    maxSize: 4,
    getProduct: function () {
        return { id: 457, count: 1, data: 0 };
    },
    getSeed: function () {
        return { id: 458, count: 1, data: 0 };
    }
});
IDRegistry.genItemID("cropStick");
Item.createItem("cropStick", "Crop", { name: "crop_stick" });
Recipes.addShaped({ id: ItemID.cropStick, count: 2, data: 0 }, [
    "x x",
    "x x"
], ['x', 280, 0]);
Item.registerUseFunction("cropStick", function (coords, item, block) {
    if (block.id == 60 && coords.side == 1) {
        var place = coords.relative;
        var tile = World.getBlock(place.x, place.y, place.z);
        if (World.canTileBeReplaced(tile.id, tile.data)) {
            World.setBlock(place.x, place.y, place.z, BlockID.crop, 0);
            World.addTileEntity(place.x, place.y, place.z);
            Player.decreaseCarriedItem(1);
        }
    }
});
IDRegistry.genItemID("fertilizer");
Item.createItem("fertilizer", "Fertilizer", { name: "fertilizer" });
IDRegistry.genItemID("weedEx");
Item.createItem("weedEx", "Weed EX", { name: "weed_ex" }, { stack: 1 });
Item.setMaxDamage(ItemID.weedEx, 64);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShapeless({ id: ItemID.fertilizer, count: 2, data: 0 }, [{ id: ItemID.scrap, data: 0 }, { id: 351, data: 15 }]);
    Recipes.addShapeless({ id: ItemID.fertilizer, count: 2, data: 0 }, [{ id: ItemID.scrap, data: 0 }, { id: ItemID.ashes, data: 0 }]);
    Recipes.addShapeless({ id: ItemID.fertilizer, count: 2, data: 0 }, [{ id: ItemID.scrap, data: 0 }, { id: ItemID.scrap, data: 0 }, { id: ItemID.fertilizer, data: 0 }]);
    Recipes.addShaped({ id: ItemID.weedEx, count: 1, data: 0 }, [
        "z",
        "x",
        "c"
    ], ['z', 331, 0, 'x', ItemID.grinPowder, 0, 'c', ItemID.cellEmpty, 0]);
});
IDRegistry.genItemID("grinPowder");
Item.createItem("grinPowder", "Grin Powder", { name: "grin_powder" });
IDRegistry.genItemID("hops");
Item.createItem("hops", "Hops", { name: "hops" });
IDRegistry.genItemID("weed");
Item.createItem("weed", "Weed", { name: "weed" });
IDRegistry.genItemID("coffeeBeans");
Item.createItem("coffeeBeans", "Coffee Beans", { name: "coffee_beans" });
IDRegistry.genItemID("coffeePowder");
Item.createItem("coffeePowder", "Coffee Powder", { name: "coffee_powder" });
Recipes.addShapeless({ id: ItemID.coffeePowder, count: 1, data: 0 }, [{ id: ItemID.coffeeBeans, data: 0 }]);
var negativePotions = [
    PotionEffect.movementSlowdown,
    PotionEffect.digSlowdown,
    PotionEffect.confusion,
    PotionEffect.blindness,
    PotionEffect.hunger,
    PotionEffect.weakness,
    PotionEffect.poison,
    PotionEffect.wither
];
IDRegistry.genItemID("terraWart");
Item.createFoodItem("terraWart", "Terra Wart", { name: "terra_wart" }, { food: 1 });
ItemName.setRarity(ItemID.terraWart, 2, true);
Callback.addCallback("FoodEaten", function (heal, satRatio) {
    if (Player.getCarriedItem().id == ItemID.terraWart) {
        RadiationAPI.addRadiation(-600);
        for (var i in negativePotions) {
            var potionID = negativePotions[i];
            Entity.clearEffect(Player.get(), potionID);
        }
    }
});
IDRegistry.genItemID("mugEmpty");
Item.createItem("mugEmpty", "Stone Mug", { name: "mug_empty" }, { stack: 1 });
Callback.addCallback("PostLoaded", function () {
    Recipes.addShaped({ id: ItemID.mugEmpty, count: 1, data: 0 }, [
        "xx ",
        "xxx",
        "xx ",
    ], ['x', 1, -1]);
});
var CoffeeMug = {
    effectTimer: 0,
    amplifier: 0,
    amplifyEffect: function (potionId, maxAmplifier, extraDuration) {
        if (this.effectTimer > 0) {
            this.effectTimer += extraDuration;
            if (this.amplifier < maxAmplifier)
                this.amplifier++;
            Entity.addEffect(Player.get(), potionId, this.amplifier, this.effectTimer);
            return this.amplifier;
        }
        Entity.addEffect(Player.get(), potionId, 1, 300);
        this.effectTimer = 300;
        return 1;
    },
    tick: function () {
        if (this.effectTimer > 1) {
            this.effectTimer--;
            return;
        }
        if (this.effectTimer == 1) {
            this.effectTimer--;
            this.amplifier = 0;
        }
    },
    onDeath: function (entity) {
        if (entity != Player.get())
            return;
        this.effectTimer = 0;
        this.amplifier = 0;
    },
    onFoodEaten: function (heal, satRatio) {
        var maxAmplifier = 0;
        var extraDuration = 0;
        var itemId = Player.getCarriedItem().id;
        switch (itemId) {
            case ItemID.mugCoffee:
                maxAmplifier = 6;
                extraDuration = 1200;
                break;
            case ItemID.mugColdCoffee:
                maxAmplifier = 1;
                extraDuration = 600;
                break;
            case ItemID.mugDarkCoffee:
                maxAmplifier = 5;
                extraDuration = 1200;
                break;
            case ItemID.terraWart:
                if (this.amplifier < 3)
                    return;
                this.amplifier = 2;
                return;
            case VanillaItemID.bucket:
                this.amplifier = 0;
                this.effectTimer = 0;
                break;
            default: return;
        }
        var highest = 0;
        var x = CoffeeMug.amplifyEffect(PotionEffect.movementSpeed, maxAmplifier, extraDuration);
        if (x > highest)
            highest = x;
        x = CoffeeMug.amplifyEffect(PotionEffect.digSpeed, maxAmplifier, extraDuration);
        if (x > highest)
            highest = x;
        if (itemId == ItemID.mugCoffee)
            highest -= 2;
        if (highest >= 3) {
            var badEffectTime = (highest - 2) * 200;
            Entity.addEffect(Player.get(), PotionEffect.confusion, 1, badEffectTime);
            this.effectTimer = badEffectTime;
            if (highest >= 4) {
                Entity.addEffect(Player.get(), PotionEffect.harm, highest - 3, 1);
            }
        }
        Player.addItemToInventory(ItemID.mugEmpty, 1, 0);
    },
    craftFunction: function (api, field, result) {
        for (var i_30 in field) {
            if (field[i_30].id == VanillaItemID.bucket) {
                if (field[i_30].count == 1) {
                    field[i_30].data = 0;
                }
                else {
                    api.decreaseFieldSlot(i_30);
                    Player.addItemToInventory(VanillaItemID.bucket, 1, 0);
                }
            }
            else {
                api.decreaseFieldSlot(i_30);
            }
        }
    }
};
IDRegistry.genItemID("mugColdCoffee");
Item.createFoodItem("mugColdCoffee", "Cold Coffee", { name: "mug_cold_coffee" }, { stack: 1 });
IDRegistry.genItemID("mugDarkCoffee");
Item.createFoodItem("mugDarkCoffee", "Dark Coffee", { name: "mug_dark_coffee" }, { stack: 1 });
IDRegistry.genItemID("mugCoffee");
Item.createFoodItem("mugCoffee", "Coffee", { name: "mug_coffee" }, { stack: 1 });
Item.addCreativeGroup("mug_coffee", Translation.translate("Coffee"), [
    ItemID.mugEmpty,
    ItemID.mugColdCoffee,
    ItemID.mugDarkCoffee,
    ItemID.mugCoffee
]);
Callback.addCallback("FoodEaten", CoffeeMug.onFoodEaten);
Callback.addCallback("tick", CoffeeMug.tick);
Callback.addCallback("EntityDeath", CoffeeMug.onDeath);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: ItemID.mugColdCoffee, count: 1, data: 0 }, [
        "x",
        "y",
        "z",
    ], ['x', ItemID.coffeePowder, 0, 'y', 325, 8, 'z', ItemID.mugEmpty, 0], CoffeeMug.craftFunction);
    Recipes.addShaped({ id: ItemID.mugCoffee, count: 1, data: 0 }, [
        "x",
        "y",
        "z",
    ], ['x', 353, 0, 'y', 325, 1, 'z', ItemID.mugDarkCoffee, 0], CoffeeMug.craftFunction);
    Recipes.addFurnace(ItemID.mugColdCoffee, ItemID.mugDarkCoffee, 0);
});
IDRegistry.genItemID("tinCanEmpty");
Item.createItem("tinCanEmpty", "Tin Can", { name: "tin_can", meta: 0 });
IDRegistry.genItemID("tinCanFull");
Item.createItem("tinCanFull", "Filled Tin Can", { name: "tin_can", meta: 1 });
Item.registerNameOverrideFunction(ItemID.tinCanFull, function (item, name) {
    if (item.data > 0) {
        return name + "\n§7" + Translation.translate("This looks bad...");
    }
    return name;
});
var getMaxHunger = function () { return 20; };
ModAPI.addAPICallback("ThirstAPI", function (api) {
    getMaxHunger = api.getMaxHunger;
});
Item.registerNoTargetUseFunction("tinCanFull", function () {
    var item = Player.getCarriedItem();
    var hunger = Player.getHunger();
    var saturation = Player.getSaturation();
    var count = Math.min(getMaxHunger() - hunger, item.count);
    if (count > 0) {
        Player.setHunger(hunger + count);
        Player.setSaturation(Math.min(20, saturation + count * 0.6));
        if (item.data == 1 && Math.random() < 0.2 * count) {
            Entity.addEffect(Player.get(), PotionEffect.hunger, 1, 600);
        }
        if (item.data == 2) {
            Entity.addEffect(Player.get(), PotionEffect.poison, 1, 80);
        }
        if (item.count == count) {
            Player.setCarriedItem(ItemID.tinCanEmpty, count, 0);
        }
        else {
            Player.setCarriedItem(item.id, item.count - count, item.data);
            Player.addItemToInventory(ItemID.tinCanEmpty, count, 0);
        }
        SoundManager.playSound("eat.ogg");
    }
});
IDRegistry.genItemID("cableTin0");
IDRegistry.genItemID("cableTin1");
Item.createItem("cableTin0", "Tin Cable", { name: "cable_tin", meta: 0 });
Item.createItem("cableTin1", "Insulated Tin Cable", { name: "cable_tin", meta: 1 });
IDRegistry.genItemID("cableCopper0");
IDRegistry.genItemID("cableCopper1");
Item.createItem("cableCopper0", "Copper Cable", { name: "cable_copper", meta: 0 });
Item.createItem("cableCopper1", "Insulated Copper Cable", { name: "cable_copper", meta: 1 });
IDRegistry.genItemID("cableGold0");
IDRegistry.genItemID("cableGold1");
IDRegistry.genItemID("cableGold2");
Item.createItem("cableGold0", "Gold Cable", { name: "cable_gold", meta: 0 });
Item.createItem("cableGold1", "Insulated Gold Cable", { name: "cable_gold", meta: 1 });
Item.createItem("cableGold2", "2x Ins. Gold Cable", { name: "cable_gold", meta: 2 });
IDRegistry.genItemID("cableIron0");
IDRegistry.genItemID("cableIron1");
IDRegistry.genItemID("cableIron2");
IDRegistry.genItemID("cableIron3");
Item.createItem("cableIron0", "HV Cable", { name: "cable_iron", meta: 0 });
Item.createItem("cableIron1", "Insulated HV Cable", { name: "cable_iron", meta: 1 });
Item.createItem("cableIron2", "2x Ins. HV Cable", { name: "cable_iron", meta: 2 });
Item.createItem("cableIron3", "3x Ins. HV Cable", { name: "cable_iron", meta: 3 });
IDRegistry.genItemID("cableOptic");
Item.createItem("cableOptic", "Glass Fibre Cable", { name: "cable_optic", meta: 0 });
Item.addCreativeGroup("cableEU", Translation.translate("Cables"), [
    ItemID.cableTin0,
    ItemID.cableTin1,
    ItemID.cableCopper0,
    ItemID.cableCopper1,
    ItemID.cableGold0,
    ItemID.cableGold1,
    ItemID.cableGold2,
    ItemID.cableIron0,
    ItemID.cableIron1,
    ItemID.cableIron2,
    ItemID.cableIron3,
    ItemID.cableOptic
]);
Recipes.addShaped({ id: ItemID.cableOptic, count: 6, data: 0 }, [
    "aaa",
    "x#x",
    "aaa"
], ['#', ItemID.dustSilver, 0, 'x', ItemID.dustEnergium, 0, 'a', 20, -1]);
Callback.addCallback("PreLoaded", function () {
    // cutting recipes
    ICTool.addRecipe({ id: ItemID.cableTin0, count: 2, data: 0 }, [{ id: ItemID.plateTin, data: 0 }], ItemID.cutter);
    ICTool.addRecipe({ id: ItemID.cableCopper0, count: 2, data: 0 }, [{ id: ItemID.plateCopper, data: 0 }], ItemID.cutter);
    ICTool.addRecipe({ id: ItemID.cableGold0, count: 3, data: 0 }, [{ id: ItemID.plateGold, data: 0 }], ItemID.cutter);
    // isolation recipes
    Recipes.addShapeless({ id: ItemID.cableTin1, count: 1, data: 0 }, [{ id: ItemID.cableTin0, data: 0 }, { id: ItemID.rubber, data: 0 }]);
    Recipes.addShapeless({ id: ItemID.cableCopper1, count: 1, data: 0 }, [{ id: ItemID.cableCopper0, data: 0 }, { id: ItemID.rubber, data: 0 }]);
    Recipes.addShapeless({ id: ItemID.cableGold1, count: 1, data: 0 }, [{ id: ItemID.cableGold0, data: 0 }, { id: ItemID.rubber, data: 0 }]);
    Recipes.addShapeless({ id: ItemID.cableGold2, count: 1, data: 0 }, [{ id: ItemID.cableGold1, data: 0 }, { id: ItemID.rubber, data: 0 }]);
    addShapelessRecipe({ id: ItemID.cableGold2, count: 1, data: 0 }, [{ id: ItemID.cableGold0, count: 1, data: 0 }, { id: ItemID.rubber, count: 2, data: 0 }]);
    Recipes.addShapeless({ id: ItemID.cableIron1, count: 1, data: 0 }, [{ id: ItemID.cableIron0, data: 0 }, { id: ItemID.rubber, data: 0 }]);
    Recipes.addShapeless({ id: ItemID.cableIron2, count: 1, data: 0 }, [{ id: ItemID.cableIron1, data: 0 }, { id: ItemID.rubber, data: 0 }]);
    Recipes.addShapeless({ id: ItemID.cableIron3, count: 1, data: 0 }, [{ id: ItemID.cableIron2, data: 0 }, { id: ItemID.rubber, data: 0 }]);
    addShapelessRecipe({ id: ItemID.cableIron3, count: 1, data: 0 }, [{ id: ItemID.cableIron1, count: 1, data: 0 }, { id: ItemID.rubber, count: 2, data: 0 }]);
    addShapelessRecipe({ id: ItemID.cableIron3, count: 1, data: 0 }, [{ id: ItemID.cableIron0, count: 1, data: 0 }, { id: ItemID.rubber, count: 3, data: 0 }]);
});
function registerCablePlaceFunc(nameID, blockID, blockData) {
    Item.registerUseFunction(nameID, function (coords, item, block) {
        var place = coords;
        if (!World.canTileBeReplaced(block.id, block.data)) {
            place = coords.relative;
            block = World.getBlock(place.x, place.y, place.z);
            if (!World.canTileBeReplaced(block.id, block.data)) {
                return;
            }
        }
        World.setBlock(place.x, place.y, place.z, blockID, blockData);
        if (Game.isItemSpendingAllowed()) {
            Player.setCarriedItem(item.id, item.count - 1, item.data);
        }
        EnergyTypeRegistry.onWirePlaced(place.x, place.y, place.z);
    });
}
for (var i = 0; i < 2; i++) {
    registerCablePlaceFunc("cableTin" + i, BlockID["cableTin" + i], 0);
    Item.registerNameOverrideFunction(ItemID["cableTin" + i], function (item, name) {
        return name + "\n§7" + Translation.translate("Max voltage: ") + "32 EU/t";
    });
}
for (var i = 0; i < 2; i++) {
    registerCablePlaceFunc("cableCopper" + i, BlockID["cableCopper" + i], 0);
    Item.registerNameOverrideFunction(ItemID["cableCopper" + i], function (item, name) {
        return name + "\n§7" + Translation.translate("Max voltage: ") + "128 EU/t";
    });
}
for (var i = 0; i < 3; i++) {
    registerCablePlaceFunc("cableGold" + i, BlockID["cableGold" + i], 0);
    Item.registerNameOverrideFunction(ItemID["cableGold" + i], function (item, name) {
        return name + "\n§7" + Translation.translate("Max voltage: ") + "512 EU/t";
    });
}
for (var i = 0; i < 4; i++) {
    registerCablePlaceFunc("cableIron" + i, BlockID["cableIron" + i], 0);
    Item.registerNameOverrideFunction(ItemID["cableIron" + i], function (item, name) {
        return name + "\n§7" + Translation.translate("Max voltage: ") + "2048 EU/t";
    });
}
registerCablePlaceFunc("cableOptic", BlockID.cableOptic, 0);
Item.registerNameOverrideFunction(ItemID.cableOptic, function (item, name) {
    return name + "\n§7" + Translation.translate("Max voltage: ") + "8192 EU/t";
});
IDRegistry.genItemID("circuitBasic");
IDRegistry.genItemID("circuitAdvanced");
Item.createItem("circuitBasic", "Electronic Circuit", { name: "circuit_basic", meta: 0 });
Item.createItem("circuitAdvanced", "Advanced Circuit", { name: "circuit_advanced", meta: 0 });
ItemName.setRarity(ItemID.circuitAdvanced, 1, true);
IDRegistry.genItemID("coil");
IDRegistry.genItemID("electricMotor");
IDRegistry.genItemID("powerUnit");
IDRegistry.genItemID("powerUnitSmall");
Item.createItem("coil", "Coil", { name: "coil", meta: 0 });
Item.createItem("electricMotor", "Electric Motor", { name: "electric_motor", meta: 0 });
Item.createItem("powerUnit", "Power Unit", { name: "power_unit", meta: 0 });
Item.createItem("powerUnitSmall", "Small Power Unit", { name: "power_unit_small", meta: 0 });
IDRegistry.genItemID("heatConductor");
Item.createItem("heatConductor", "Heat Conductor", { name: "heat_conductor", meta: 0 });
Item.addCreativeGroup("ic2_component", Translation.translate("Crafting Components"), [
    ItemID.circuitBasic,
    ItemID.circuitAdvanced,
    ItemID.coil,
    ItemID.electricMotor,
    ItemID.powerUnit,
    ItemID.powerUnitSmall,
    ItemID.heatConductor
]);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: ItemID.circuitBasic, count: 1, data: 0 }, [
        "xxx",
        "a#a",
        "xxx"
    ], ['x', ItemID.cableCopper1, 0, 'a', 331, 0, '#', ItemID.plateIron, 0]);
    Recipes.addShaped({ id: ItemID.circuitBasic, count: 1, data: 0 }, [
        "xax",
        "x#x",
        "xax"
    ], ['x', ItemID.cableCopper1, 0, 'a', 331, 0, '#', ItemID.plateIron, 0]);
    Recipes.addShaped({ id: ItemID.circuitAdvanced, count: 1, data: 0 }, [
        "xbx",
        "a#a",
        "xbx"
    ], ['x', 331, 0, 'a', 348, 0, 'b', ItemID.dustLapis, 0, '#', ItemID.circuitBasic, 0]);
    Recipes.addShaped({ id: ItemID.circuitAdvanced, count: 1, data: 0 }, [
        "xax",
        "b#b",
        "xax"
    ], ['x', 331, 0, 'a', 348, 0, 'b', ItemID.dustLapis, 0, '#', ItemID.circuitBasic, 0]);
    Recipes.addShaped({ id: ItemID.coil, count: 1, data: 0 }, [
        "aaa",
        "axa",
        "aaa"
    ], ['x', 265, 0, 'a', ItemID.cableCopper0, 0]);
    Recipes.addShaped({ id: ItemID.electricMotor, count: 1, data: 0 }, [
        " b ",
        "axa",
        " b "
    ], ['x', 265, 0, 'a', ItemID.coil, 0, 'b', ItemID.casingTin, 0]);
    Recipes.addShaped({ id: ItemID.powerUnit, count: 1, data: 0 }, [
        "acs",
        "axe",
        "acs"
    ], ['x', ItemID.circuitBasic, 0, 'e', ItemID.electricMotor, 0, 'a', ItemID.storageBattery, -1, 's', ItemID.casingIron, 0, 'c', ItemID.cableCopper0, 0]);
    Recipes.addShaped({ id: ItemID.powerUnitSmall, count: 1, data: 0 }, [
        " cs",
        "axe",
        " cs"
    ], ['x', ItemID.circuitBasic, 0, 'e', ItemID.electricMotor, 0, 'a', ItemID.storageBattery, -1, 's', ItemID.casingIron, 0, 'c', ItemID.cableCopper0, 0]);
    Recipes.addShaped({ id: ItemID.heatConductor, count: 1, data: 0 }, [
        "aсa",
        "aсa",
        "aсa"
    ], ['с', ItemID.plateCopper, 0, 'a', ItemID.rubber, 0]);
});
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
Item.createItem("debugItem", "Debug Item", { name: "debug_item", meta: 0 }, { isTech: !ConfigIC.debugMode });
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
IDRegistry.genItemID("chargingBattery");
Item.createItem("chargingBattery", "Charging RE-Battery", { name: "charging_re_battery", meta: 0 }, { stack: 1, isTech: true });
Item.addToCreative(ItemID.chargingBattery, 1, 27);
ChargeItemRegistry.registerExtraItem(ItemID.chargingBattery, "Eu", 40000, 128, 1, "storage", true, true);
IDRegistry.genItemID("chargingAdvBattery");
Item.createItem("chargingAdvBattery", "Advanced Charging Battery", { name: "adv_charging_battery", meta: 0 }, { stack: 1, isTech: true });
Item.addToCreative(ItemID.chargingAdvBattery, 1, 27);
ChargeItemRegistry.registerExtraItem(ItemID.chargingAdvBattery, "Eu", 400000, 1024, 2, "storage", true, true);
IDRegistry.genItemID("chargingCrystal");
Item.createItem("chargingCrystal", "Charging Energy Crystal", { name: "charging_energy_crystal", meta: 0 }, { stack: 1, isTech: true });
Item.addToCreative(ItemID.chargingCrystal, 1, 27);
ChargeItemRegistry.registerExtraItem(ItemID.chargingCrystal, "Eu", 4000000, 8192, 3, "storage", true, true);
IDRegistry.genItemID("chargingLapotronCrystal");
Item.createItem("chargingLapotronCrystal", "Charging Lapotron Crystal", { name: "charging_lapotron_crystal", meta: 0 }, { stack: 1, isTech: true });
Item.addToCreative(ItemID.chargingLapotronCrystal, 1, 27);
ChargeItemRegistry.registerExtraItem(ItemID.chargingLapotronCrystal, "Eu", 4e7, 32768, 4, "storage", true, true);
ItemName.setRarity(ItemID.chargingLapotronCrystal, 1);
Item.addCreativeGroup("chargingBatteryEU", Translation.translate("Charging Batteries"), [
    ItemID.chargingBattery,
    ItemID.chargingAdvBattery,
    ItemID.chargingCrystal,
    ItemID.chargingLapotronCrystal
]);
Item.registerIconOverrideFunction(ItemID.chargingBattery, function (item) {
    return { name: "charging_re_battery", meta: Math.round((27 - item.data) / 26 * 4) };
});
Item.registerIconOverrideFunction(ItemID.chargingAdvBattery, function (item) {
    return { name: "adv_charging_battery", meta: Math.round((27 - item.data) / 26 * 4) };
});
Item.registerIconOverrideFunction(ItemID.chargingCrystal, function (item) {
    return { name: "charging_energy_crystal", meta: Math.round((27 - item.data) / 26 * 4) };
});
Item.registerIconOverrideFunction(ItemID.chargingLapotronCrystal, function (item) {
    return { name: "charging_lapotron_crystal", meta: Math.round((27 - item.data) / 26 * 4) };
});
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: ItemID.chargingBattery, count: 1, data: Item.getMaxDamage(ItemID.chargingBattery) }, [
        "xbx",
        "b b",
        "xbx"
    ], ['x', ItemID.circuitBasic, 0, 'b', ItemID.storageBattery, -1], ChargeItemRegistry.transferEnergy);
    Recipes.addShaped({ id: ItemID.chargingAdvBattery, count: 1, data: Item.getMaxDamage(ItemID.chargingAdvBattery) }, [
        "xbx",
        "b#b",
        "xbx"
    ], ['#', ItemID.chargingBattery, -1, 'x', ItemID.heatExchanger, 1, 'b', ItemID.storageAdvBattery, -1], ChargeItemRegistry.transferEnergy);
    Recipes.addShaped({ id: ItemID.chargingCrystal, count: 1, data: Item.getMaxDamage(ItemID.chargingCrystal) }, [
        "xbx",
        "b#b",
        "xbx"
    ], ['#', ItemID.chargingAdvBattery, -1, 'x', ItemID.heatExchangerComponent, 1, 'b', ItemID.storageCrystal, -1], ChargeItemRegistry.transferEnergy);
    Recipes.addShaped({ id: ItemID.chargingLapotronCrystal, count: 1, data: Item.getMaxDamage(ItemID.chargingLapotronCrystal) }, [
        "xbx",
        "b#b",
        "xbx"
    ], ['#', ItemID.chargingCrystal, -1, 'x', ItemID.heatExchangerAdv, 1, 'b', ItemID.storageLapotronCrystal, -1], ChargeItemRegistry.transferEnergy);
});
var ChargingBattery = {
    itemIDs: {},
    registerItem: function (nameID) {
        var id = ItemID[nameID];
        this.itemIDs[id] = true;
        Item.registerNoTargetUseFunction(nameID, this.switchFunction);
        Item.registerNameOverrideFunction(id, this.getName);
    },
    switchFunction: function (item) {
        var extra = item.extra;
        if (!extra) {
            extra = new ItemExtraData();
        }
        var mode = (extra.getInt("mode") + 1) % 3;
        extra.putInt("mode", mode);
        if (mode == 0) {
            Game.message(Translation.translate("Mode: Enabled"));
        }
        if (mode == 1) {
            Game.message(Translation.translate("Mode: Charge items not in hand"));
        }
        if (mode == 2) {
            Game.message(Translation.translate("Mode: Disabled"));
        }
        Player.setCarriedItem(item.id, 1, item.data, extra);
    },
    getName: function (item, name) {
        var mode = item.extra ? item.extra.getInt("mode") : 0;
        if (mode == 0) {
            var tooltip = Translation.translate("Mode: Enabled");
        }
        if (mode == 1) {
            var tooltip = Translation.translate("Mode: Charge items not in hand");
        }
        if (mode == 2) {
            var tooltip = Translation.translate("Mode: Disabled");
        }
        name = ItemName.showItemStorage(item, name);
        return name + '\n' + tooltip;
    }
};
ChargingBattery.registerItem("chargingBattery");
ChargingBattery.registerItem("chargingAdvBattery");
ChargingBattery.registerItem("chargingCrystal");
ChargingBattery.registerItem("chargingLapotronCrystal");
function checkCharging() {
    for (var i = 0; i < 36; i++) {
        var slot = Player.getInventorySlot(i);
        if (ChargingBattery.itemIDs[slot.id]) {
            var mode = slot.extra ? slot.extra.getInt("mode") : 0;
            var energyStored = ChargeItemRegistry.getEnergyStored(slot);
            if (mode == 2 || energyStored <= 0)
                continue;
            var chargeData = ChargeItemRegistry.getItemData(slot.id);
            for (var index = 0; index < 9; index++) {
                if (mode == 1 && Player.getSelectedSlotId() == index)
                    continue;
                var item = Player.getInventorySlot(index);
                if (!ChargeItemRegistry.isValidStorage(item.id, "Eu", 5)) {
                    var energyAdd = ChargeItemRegistry.addEnergyTo(item, "Eu", energyStored, chargeData.transferLimit * 20, chargeData.level);
                    if (energyAdd > 0) {
                        energyStored -= energyAdd;
                        Player.setInventorySlot(index, item.id, 1, item.data, item.extra);
                    }
                }
            }
            ChargeItemRegistry.setEnergyStored(slot, energyStored);
            Player.setInventorySlot(i, slot.id, 1, slot.data, slot.extra);
        }
    }
}
Callback.addCallback("tick", function () {
    if (World.getThreadTime() % 20 == 0) {
        checkCharging();
    }
});
IDRegistry.genItemID("upgradeOverclocker");
Item.createItem("upgradeOverclocker", "Overclocker Upgrade", { name: "upgrade_overclocker", meta: 0 });
Item.registerNameOverrideFunction(ItemID.upgradeOverclocker, function (item, name) {
    var percent = "%%%%"; // it's one % in name
    if (currentUIscreen == "in_game_play_screen" || currentUIscreen == "world_loading_progress_screen - local_world_load") {
        percent += "%%%%"; // this game is broken
    }
    var timeTooltip = Translation.translate("Decrease process time to ") + 70 + percent;
    var powerTooltip = Translation.translate("Increase power to ") + 160 + percent;
    return name + "§7\n" + timeTooltip + "\n" + powerTooltip;
});
IDRegistry.genItemID("upgradeTransformer");
Item.createItem("upgradeTransformer", "Transformer Upgrade", { name: "upgrade_transformer", meta: 0 });
Item.registerNameOverrideFunction(ItemID.upgradeTransformer, function (item, name) {
    return name + "§7\n" + Translation.translate("Increase energy tier by 1");
});
IDRegistry.genItemID("upgradeEnergyStorage");
Item.createItem("upgradeEnergyStorage", "Energy Storage Upgrade", { name: "upgrade_energy_storage", meta: 0 });
Item.registerNameOverrideFunction(ItemID.upgradeEnergyStorage, function (item, name) {
    return name + "§7\n" + Translation.translate("Increase energy storage by 10k EU");
});
IDRegistry.genItemID("upgradeRedstone");
Item.createItem("upgradeRedstone", "Redstone Signal Inverter Upgrade", { name: "upgrade_redstone_inv", meta: 0 });
IDRegistry.genItemID("upgradeEjector");
Item.createItem("upgradeEjector", "Ejector Upgrade", { name: "upgrade_ejector", meta: 0 });
Item.registerNameOverrideFunction(ItemID.upgradeEjector, function (item, name) {
    name += "§7\n" + Translation.translate("Automatically output to\nthe %s side").replace("%s", ItemName.getSideName(item.data - 1));
    return name;
});
Item.registerIconOverrideFunction(ItemID.upgradeEjector, function (item, name) {
    return { name: "upgrade_ejector", meta: item.data };
});
IDRegistry.genItemID("upgradePulling");
Item.createItem("upgradePulling", "Pulling Upgrade", { name: "upgrade_pulling", meta: 0 });
Item.registerNameOverrideFunction(ItemID.upgradePulling, function (item, name) {
    name += "§7\n" + Translation.translate("Automatically input from\nthe %s side").replace("%s", ItemName.getSideName(item.data - 1));
    return name;
});
Item.registerIconOverrideFunction(ItemID.upgradePulling, function (item, name) {
    return { name: "upgrade_pulling", meta: item.data };
});
IDRegistry.genItemID("upgradeFluidEjector");
Item.createItem("upgradeFluidEjector", "Fluid Ejector Upgrade", { name: "upgrade_fluid_ejector", meta: 0 });
Item.registerNameOverrideFunction(ItemID.upgradeFluidEjector, function (item, name) {
    name += "§7\n" + Translation.translate("Automatically output to\nthe %s side").replace("%s", ItemName.getSideName(item.data - 1));
    return name;
});
Item.registerIconOverrideFunction(ItemID.upgradeFluidEjector, function (item, name) {
    return { name: "upgrade_fluid_ejector", meta: item.data };
});
IDRegistry.genItemID("upgradeFluidPulling");
Item.createItem("upgradeFluidPulling", "Fluid Pulling Upgrade", { name: "upgrade_fluid_pulling", meta: 0 });
Item.registerNameOverrideFunction(ItemID.upgradeFluidPulling, function (item, name) {
    name += "§7\n" + Translation.translate("Automatically input from\nthe %s side").replace("%s", ItemName.getSideName(item.data - 1));
    return name;
});
Item.registerIconOverrideFunction(ItemID.upgradeFluidPulling, function (item, name) {
    return { name: "upgrade_fluid_pulling", meta: item.data };
});
IDRegistry.genItemID("upgradeMFSU");
Item.createItem("upgradeMFSU", "MFSU Upgrade Kit", { name: "mfsu_upgrade", meta: 0 });
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
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: ItemID.upgradeOverclocker, count: 2, data: 0 }, [
        "aaa",
        "x#x",
    ], ['#', ItemID.circuitBasic, -1, 'x', ItemID.cableCopper1, -1, 'a', ItemID.coolantCell, 1]);
    Recipes.addShaped({ id: ItemID.upgradeOverclocker, count: 6, data: 0 }, [
        "aaa",
        "x#x",
    ], ['#', ItemID.circuitBasic, -1, 'x', ItemID.cableCopper1, -1, 'a', ItemID.coolantCell3, 1]);
    Recipes.addShaped({ id: ItemID.upgradeOverclocker, count: 12, data: 0 }, [
        "aaa",
        "x#x",
    ], ['#', ItemID.circuitBasic, -1, 'x', ItemID.cableCopper1, -1, 'a', ItemID.coolantCell6, 1]);
    Recipes.addShaped({ id: ItemID.upgradeTransformer, count: 1, data: 0 }, [
        "aaa",
        "x#x",
        "aca"
    ], ['#', BlockID.transformerMV, 0, 'x', ItemID.cableGold2, -1, 'a', 20, -1, 'c', ItemID.circuitBasic, -1]);
    Recipes.addShaped({ id: ItemID.upgradeEnergyStorage, count: 1, data: 0 }, [
        "aaa",
        "x#x",
        "aca"
    ], ['#', ItemID.storageBattery, -1, 'x', ItemID.cableCopper1, -1, 'a', 5, -1, 'c', ItemID.circuitBasic, -1]);
    Recipes.addShaped({ id: ItemID.upgradeRedstone, count: 1, data: 0 }, [
        "x x",
        " # ",
        "x x",
    ], ['x', ItemID.plateTin, -1, '#', 69, -1]);
    Recipes.addShaped({ id: ItemID.upgradeEjector, count: 1, data: 0 }, [
        "aba",
        "x#x",
    ], ['#', ItemID.circuitBasic, -1, 'x', ItemID.cableCopper1, -1, 'a', 33, -1, 'b', 410, 0]);
    Recipes.addShaped({ id: ItemID.upgradePulling, count: 1, data: 0 }, [
        "aba",
        "x#x",
    ], ['#', ItemID.circuitBasic, -1, 'x', ItemID.cableCopper1, -1, 'a', 29, -1, 'b', 410, 0]);
    Recipes.addShaped({ id: ItemID.upgradeFluidEjector, count: 1, data: 0 }, [
        "x x",
        " # ",
        "x x",
    ], ['x', ItemID.plateTin, -1, '#', ItemID.electricMotor, -1]);
    Recipes.addShaped({ id: ItemID.upgradeFluidPulling, count: 1, data: 0 }, [
        "xcx",
        " # ",
        "x x",
    ], ['x', ItemID.plateTin, -1, '#', ItemID.electricMotor, -1, 'c', ItemID.treetap, 0]);
    Recipes.addShaped({ id: ItemID.upgradeMFSU, count: 1, data: 0 }, [
        "aca",
        "axa",
        "aba"
    ], ['b', ItemID.wrenchBronze, 0, 'a', ItemID.storageLapotronCrystal, -1, 'x', BlockID.machineBlockAdvanced, 0, 'c', ItemID.circuitAdvanced, -1]);
});
UpgradeAPI.registerUpgrade(ItemID.upgradeOverclocker, "overclocker", function (item, machine, container, data) {
    if (data.work_time) {
        data.energy_consumption = Math.round(data.energy_consumption * Math.pow(1.6, item.count));
        data.work_time = Math.round(data.work_time * Math.pow(0.7, item.count));
    }
});
UpgradeAPI.registerUpgrade(ItemID.upgradeTransformer, "transformer", function (item, machine, container, data) {
    var tier = data.power_tier + item.count;
    if (tier > 14)
        tier = 14;
    data.power_tier = tier;
});
UpgradeAPI.registerUpgrade(ItemID.upgradeEnergyStorage, "energyStorage", function (item, machine, container, data) {
    data.energy_storage += 10000 * item.count;
});
UpgradeAPI.registerUpgrade(ItemID.upgradeRedstone, "redstone", function (item, machine, container, data) {
    data.isHeating = !data.isHeating;
});
UpgradeAPI.registerUpgrade(ItemID.upgradeEjector, "itemEjector", function (item, machine, container, data) {
    var items = [];
    var slots = machine.getTransportSlots().output;
    for (var i in slots) {
        var slot = container.getSlot(slots[i]);
        if (slot.id)
            items.push(slot);
    }
    if (items.length) {
        var containers = StorageInterface.getNearestContainers(machine, item.data - 1);
        StorageInterface.putItems(items, containers);
    }
});
UpgradeAPI.registerUpgrade(ItemID.upgradePulling, "itemPulling", function (item, machine, container, data) {
    if (World.getThreadTime() % 20 == 0) {
        var containers = StorageInterface.getNearestContainers(machine, item.data - 1);
        for (var side in containers) {
            StorageInterface.extractItemsFromContainer(machine, containers[side], parseInt(side));
        }
    }
});
UpgradeAPI.registerUpgrade(ItemID.upgradeFluidEjector, "fluidEjector", function (item, machine, container, data) {
    var input = StorageInterface.getNearestLiquidStorages(machine, item.data - 1);
    for (var side in input) {
        var liquid = machine.interface.getLiquidStored("output", side);
        if (liquid) {
            StorageInterface.transportLiquid(liquid, 0.25, machine, input[side], parseInt(side));
        }
    }
});
UpgradeAPI.registerUpgrade(ItemID.upgradeFluidPulling, "fluidPulling", function (item, machine, container, data) {
    var output = StorageInterface.getNearestLiquidStorages(machine, item.data - 1);
    for (var side in output) {
        var liquid = machine.interface.getLiquidStored("input", side);
        StorageInterface.extractLiquid(liquid, 0.25, machine, output[side], parseInt(side));
    }
});
Item.registerUseFunction("upgradeMFSU", function (coords, item, block) {
    if (block.id == BlockID.storageMFE) {
        var tile = World.getTileEntity(coords.x, coords.y, coords.z);
        var data = tile.data;
        tile.selfDestroy();
        World.setBlock(coords.x, coords.y, coords.z, BlockID.storageMFSU, 0);
        block = World.addTileEntity(coords.x, coords.y, coords.z);
        block.data = data;
        TileRenderer.mapAtCoords(coords.x, coords.y, coords.z, BlockID.storageMFSU, data.meta);
        Player.decreaseCarriedItem(1);
    }
});
Item.registerUseFunction("upgradePulling", function (coords, item, block) {
    if (item.data == 0) {
        Player.setCarriedItem(ItemID.upgradePulling, item.count, coords.side + 1);
    }
    else {
        Player.setCarriedItem(ItemID.upgradePulling, item.count);
    }
});
Item.registerUseFunction("upgradeEjector", function (coords, item, block) {
    if (item.data == 0) {
        Player.setCarriedItem(ItemID.upgradeEjector, item.count, coords.side + 1);
    }
    else {
        Player.setCarriedItem(ItemID.upgradeEjector, item.count);
    }
});
Item.registerUseFunction("upgradeFluidEjector", function (coords, item, block) {
    if (item.data == 0) {
        Player.setCarriedItem(ItemID.upgradeFluidEjector, item.count, coords.side + 1);
    }
    else {
        Player.setCarriedItem(ItemID.upgradeFluidEjector, item.count);
    }
});
Item.registerUseFunction("upgradeFluidPulling", function (coords, item, block) {
    if (item.data == 0) {
        Player.setCarriedItem(ItemID.upgradeFluidPulling, item.count, coords.side + 1);
    }
    else {
        Player.setCarriedItem(ItemID.upgradeFluidPulling, item.count, 0);
    }
});
IDRegistry.genItemID("fuelRod");
Item.createItem("fuelRod", "Fuel Rod (Empty)", { name: "fuel_rod", meta: 0 });
IDRegistry.genItemID("fuelRodUranium");
IDRegistry.genItemID("fuelRodUranium2");
IDRegistry.genItemID("fuelRodUranium4");
Item.createItem("fuelRodUranium", "Fuel Rod (Uranium)", { name: "fuel_rod_uranium", meta: 0 });
Item.createItem("fuelRodUranium2", "Dual Fuel Rod (Uranium)", { name: "fuel_rod_uranium", meta: 1 }, { stack: 32 });
Item.createItem("fuelRodUranium4", "Quad Fuel Rod (Uranium)", { name: "fuel_rod_uranium", meta: 2 }, { stack: 16 });
ReactorAPI.registerComponent(ItemID.fuelRodUranium, new ReactorAPI.fuelRod(1, 20000, ItemID.fuelRodDepletedUranium));
ReactorAPI.registerComponent(ItemID.fuelRodUranium2, new ReactorAPI.fuelRod(2, 20000, ItemID.fuelRodDepletedUranium2));
ReactorAPI.registerComponent(ItemID.fuelRodUranium4, new ReactorAPI.fuelRod(4, 20000, ItemID.fuelRodDepletedUranium4));
RadiationAPI.regRadioactiveItem(ItemID.fuelRodUranium, 10);
RadiationAPI.regRadioactiveItem(ItemID.fuelRodUranium2, 10);
RadiationAPI.regRadioactiveItem(ItemID.fuelRodUranium4, 10);
IDRegistry.genItemID("fuelRodMOX");
IDRegistry.genItemID("fuelRodMOX2");
IDRegistry.genItemID("fuelRodMOX4");
Item.createItem("fuelRodMOX", "Fuel Rod (MOX)", { name: "fuel_rod_mox", meta: 0 });
Item.createItem("fuelRodMOX2", "Dual Fuel Rod (MOX)", { name: "fuel_rod_mox", meta: 1 }, { stack: 32 });
Item.createItem("fuelRodMOX4", "Quad Fuel Rod (MOX)", { name: "fuel_rod_mox", meta: 2 }, { stack: 16 });
ReactorAPI.registerComponent(ItemID.fuelRodMOX, new ReactorAPI.fuelRodMOX(1, 10000, ItemID.fuelRodDepletedMOX));
ReactorAPI.registerComponent(ItemID.fuelRodMOX2, new ReactorAPI.fuelRodMOX(2, 10000, ItemID.fuelRodDepletedMOX2));
ReactorAPI.registerComponent(ItemID.fuelRodMOX4, new ReactorAPI.fuelRodMOX(4, 10000, ItemID.fuelRodDepletedMOX4));
RadiationAPI.regRadioactiveItem(ItemID.fuelRodMOX, 10);
RadiationAPI.regRadioactiveItem(ItemID.fuelRodMOX2, 10);
RadiationAPI.regRadioactiveItem(ItemID.fuelRodMOX4, 10);
IDRegistry.genItemID("fuelRodDepletedUranium");
IDRegistry.genItemID("fuelRodDepletedUranium2");
IDRegistry.genItemID("fuelRodDepletedUranium4");
Item.createItem("fuelRodDepletedUranium", "Fuel Rod (Depleted Uranium)", { name: "fuel_rod_depleted_uranium", meta: 0 });
Item.createItem("fuelRodDepletedUranium2", "Dual Fuel Rod (Depleted Uranium)", { name: "fuel_rod_depleted_uranium", meta: 1 }, { stack: 32 });
Item.createItem("fuelRodDepletedUranium4", "Quad Fuel Rod (Depleted Uranium)", { name: "fuel_rod_depleted_uranium", meta: 2 }, { stack: 16 });
RadiationAPI.regRadioactiveItem(ItemID.fuelRodDepletedUranium, 10);
RadiationAPI.regRadioactiveItem(ItemID.fuelRodDepletedUranium2, 10);
RadiationAPI.regRadioactiveItem(ItemID.fuelRodDepletedUranium4, 10);
IDRegistry.genItemID("fuelRodDepletedMOX");
IDRegistry.genItemID("fuelRodDepletedMOX2");
IDRegistry.genItemID("fuelRodDepletedMOX4");
Item.createItem("fuelRodDepletedMOX", "Fuel Rod (Depleted MOX)", { name: "fuel_rod_depleted_mox", meta: 0 });
Item.createItem("fuelRodDepletedMOX2", "Dual Fuel Rod (Depleted MOX)", { name: "fuel_rod_depleted_mox", meta: 1 }, { stack: 32 });
Item.createItem("fuelRodDepletedMOX4", "Quad Fuel Rod (Depleted MOX)", { name: "fuel_rod_depleted_mox", meta: 2 }, { stack: 16 });
RadiationAPI.regRadioactiveItem(ItemID.fuelRodDepletedMOX, 10);
RadiationAPI.regRadioactiveItem(ItemID.fuelRodDepletedMOX2, 10);
RadiationAPI.regRadioactiveItem(ItemID.fuelRodDepletedMOX4, 10);
Item.addCreativeGroup("ic2_fuelRod", Translation.translate("Nuclear Fuel Rods"), [
    ItemID.fuelRod,
    ItemID.fuelRodUranium,
    ItemID.fuelRodUranium2,
    ItemID.fuelRodUranium4,
    ItemID.fuelRodMOX,
    ItemID.fuelRodMOX2,
    ItemID.fuelRodMOX4,
    ItemID.fuelRodDepletedUranium,
    ItemID.fuelRodDepletedUranium2,
    ItemID.fuelRodDepletedUranium4,
    ItemID.fuelRodDepletedMOX,
    ItemID.fuelRodDepletedMOX2,
    ItemID.fuelRodDepletedMOX4
]);
Recipes.addShaped({ id: ItemID.fuelRodUranium2, count: 1, data: 0 }, [
    "fxf"
], ['x', ItemID.plateIron, 0, 'f', ItemID.fuelRodUranium, 0]);
Recipes.addShaped({ id: ItemID.fuelRodUranium4, count: 1, data: 0 }, [
    " f ",
    "bab",
    " f "
], ['a', ItemID.plateIron, 0, 'b', ItemID.plateCopper, 0, 'f', ItemID.fuelRodUranium2, 0]);
Recipes.addShaped({ id: ItemID.fuelRodUranium4, count: 1, data: 0 }, [
    "faf",
    "bab",
    "faf"
], ['a', ItemID.plateIron, 0, 'b', ItemID.plateCopper, 0, 'f', ItemID.fuelRodUranium, 0]);
Recipes.addShaped({ id: ItemID.fuelRodMOX2, count: 1, data: 0 }, [
    "fxf"
], ['x', ItemID.plateIron, 0, 'f', ItemID.fuelRodMOX, 0]);
Recipes.addShaped({ id: ItemID.fuelRodMOX4, count: 1, data: 0 }, [
    " f ",
    "bab",
    " f "
], ['a', ItemID.plateIron, 0, 'b', ItemID.plateCopper, 0, 'f', ItemID.fuelRodMOX2, 0]);
Recipes.addShaped({ id: ItemID.fuelRodMOX4, count: 1, data: 0 }, [
    "faf",
    "bab",
    "faf"
], ['a', ItemID.plateIron, 0, 'b', ItemID.plateCopper, 0, 'f', ItemID.fuelRodMOX, 0]);
IDRegistry.genItemID("reactorPlating");
IDRegistry.genItemID("reactorPlatingContainment");
IDRegistry.genItemID("reactorPlatingHeat");
Item.createItem("reactorPlating", "Reactor Plating", { name: "reactor_plating", meta: 0 });
Item.createItem("reactorPlatingContainment", "Containment Reactor Plating", { name: "reactor_plating", meta: 1 });
Item.createItem("reactorPlatingHeat", "Heat-Capacity Reactor Plating", { name: "reactor_plating", meta: 2 });
ReactorAPI.registerComponent(ItemID.reactorPlating, new ReactorAPI.plating(1000, 0.95));
ReactorAPI.registerComponent(ItemID.reactorPlatingContainment, new ReactorAPI.plating(500, 0.9));
ReactorAPI.registerComponent(ItemID.reactorPlatingHeat, new ReactorAPI.plating(2000, 0.99));
Item.addCreativeGroup("ic2_reactorPlating", Translation.translate("Reactor Platings"), [
    ItemID.reactorPlating,
    ItemID.reactorPlatingContainment,
    ItemID.reactorPlatingHeat
]);
Recipes.addShapeless({ id: ItemID.reactorPlating, count: 1, data: 0 }, [{ id: ItemID.plateAlloy, data: 0 }, { id: ItemID.plateLead, data: 0 }]);
Recipes.addShapeless({ id: ItemID.reactorPlatingContainment, count: 1, data: 0 }, [{ id: ItemID.reactorPlating, data: 0 }, { id: ItemID.plateAlloy, data: 0 }, { id: ItemID.plateAlloy, data: 0 }]);
Recipes.addShaped({ id: ItemID.reactorPlatingHeat, count: 1, data: 0 }, [
    "aaa",
    "axa",
    "aaa"
], ['x', ItemID.reactorPlating, 0, 'a', ItemID.plateCopper, 0]);
IDRegistry.genItemID("neutronReflector");
IDRegistry.genItemID("neutronReflectorThick");
IDRegistry.genItemID("neutronReflectorIridium");
Item.createItem("neutronReflector", "Neutron Reflector", { name: "neutron_reflector", meta: 0 });
Item.createItem("neutronReflectorThick", "Thick Neutron Reflector", { name: "neutron_reflector", meta: 1 });
Item.createItem("neutronReflectorIridium", "Iridium Neutron Reflector", { name: "neutron_reflector", meta: 2 });
ReactorAPI.registerComponent(ItemID.neutronReflector, new ReactorAPI.reflector(30000));
ReactorAPI.registerComponent(ItemID.neutronReflectorThick, new ReactorAPI.reflector(120000));
ReactorAPI.registerComponent(ItemID.neutronReflectorIridium, new ReactorAPI.reflectorIridium());
Item.addCreativeGroup("ic2_reactorNeutronReflector", Translation.translate("Neutron Reflectors"), [
    ItemID.neutronReflector,
    ItemID.neutronReflectorThick,
    ItemID.neutronReflectorIridium
]);
Recipes.addShaped({ id: ItemID.neutronReflector, count: 1, data: 0 }, [
    "bab",
    "axa",
    "bab"
], ["x", ItemID.plateCopper, 0, 'a', ItemID.dustCoal, 0, 'b', ItemID.dustTin, 0]);
Recipes.addShaped({ id: ItemID.neutronReflectorThick, count: 1, data: 0 }, [
    "axa",
    "xax",
    "axa"
], ["x", ItemID.neutronReflector, 0, 'a', ItemID.plateCopper, 0]);
Recipes.addShaped({ id: ItemID.neutronReflectorIridium, count: 1, data: 0 }, [
    "aaa",
    "bxb",
    "aaa"
], ["x", ItemID.plateReinforcedIridium, 0, 'a', ItemID.neutronReflectorThick, 0, 'b', ItemID.densePlateCopper, 0]);
Recipes.addShaped({ id: ItemID.neutronReflectorIridium, count: 1, data: 0 }, [
    "aba",
    "axa",
    "aba"
], ["x", ItemID.plateReinforcedIridium, 0, 'a', ItemID.neutronReflectorThick, 0, 'b', ItemID.plateCopper, 0]);
IDRegistry.genItemID("coolantCell");
IDRegistry.genItemID("coolantCell3");
IDRegistry.genItemID("coolantCell6");
Item.createItem("coolantCell", "10k Coolant Cell", { name: "coolant_cell", meta: 0 }, { isTech: true });
Item.createItem("coolantCell3", "30k Coolant Cell", { name: "coolant_cell", meta: 1 }, { isTech: true });
Item.createItem("coolantCell6", "60k Coolant Cell", { name: "coolant_cell", meta: 2 }, { isTech: true });
ReactorAPI.registerComponent(ItemID.coolantCell, new ReactorAPI.heatStorage(10000));
ReactorAPI.registerComponent(ItemID.coolantCell3, new ReactorAPI.heatStorage(30000));
ReactorAPI.registerComponent(ItemID.coolantCell6, new ReactorAPI.heatStorage(60000));
Item.addCreativeGroup("ic2_reactorCoolant", Translation.translate("Reactor Coolants"), [
    ItemID.coolantCell,
    ItemID.coolantCell3,
    ItemID.coolantCell6
]);
Recipes.addShaped({ id: ItemID.coolantCell, count: 1, data: 1 }, [
    " a ",
    "axa",
    " a ",
], ['x', ItemID.cellCoolant, 0, 'a', ItemID.plateTin, 0]);
Recipes.addShaped({ id: ItemID.coolantCell3, count: 1, data: 1 }, [
    "aaa",
    "xxx",
    "aaa",
], ['x', ItemID.coolantCell, 1, 'a', ItemID.plateTin, 0]);
Recipes.addShaped({ id: ItemID.coolantCell3, count: 1, data: 1 }, [
    "axa",
    "axa",
    "axa",
], ['x', ItemID.coolantCell, 1, 'a', ItemID.plateTin, 0]);
Recipes.addShaped({ id: ItemID.coolantCell6, count: 1, data: 1 }, [
    "aaa",
    "xbx",
    "aaa",
], ['x', ItemID.coolantCell3, 1, 'a', ItemID.plateTin, 0, 'b', ItemID.plateIron, 0]);
Recipes.addShaped({ id: ItemID.coolantCell6, count: 1, data: 1 }, [
    "axa",
    "aba",
    "axa",
], ['x', ItemID.coolantCell3, 1, 'a', ItemID.plateTin, 0, 'b', ItemID.plateIron, 0]);
IDRegistry.genItemID("heatExchanger");
Item.createItem("heatExchanger", "Heat Exchanger", { name: "heat_exchanger", meta: 0 }, { isTech: true });
IDRegistry.genItemID("heatExchangerReactor");
Item.createItem("heatExchangerReactor", "Reactor Heat Exchanger", { name: "heat_exchanger", meta: 1 }, { isTech: true });
IDRegistry.genItemID("heatExchangerComponent");
Item.createItem("heatExchangerComponent", "Component Heat Exchanger", { name: "heat_exchanger", meta: 2 }, { isTech: true });
IDRegistry.genItemID("heatExchangerAdv");
Item.createItem("heatExchangerAdv", "Advanced Heat Exchanger", { name: "heat_exchanger", meta: 3 }, { isTech: true });
ReactorAPI.registerComponent(ItemID.heatExchanger, new ReactorAPI.heatExchanger(2500, 12, 4));
ReactorAPI.registerComponent(ItemID.heatExchangerReactor, new ReactorAPI.heatExchanger(5000, 0, 72));
ReactorAPI.registerComponent(ItemID.heatExchangerComponent, new ReactorAPI.heatExchanger(5000, 36, 0));
ReactorAPI.registerComponent(ItemID.heatExchangerAdv, new ReactorAPI.heatExchanger(10000, 24, 8));
Item.addCreativeGroup("ic2_reactorHeatExchanger", Translation.translate("Reactor Heat Exchangers"), [
    ItemID.heatExchanger,
    ItemID.heatExchangerReactor,
    ItemID.heatExchangerComponent,
    ItemID.heatExchangerAdv
]);
Recipes.addShaped({ id: ItemID.heatExchanger, count: 1, data: 1 }, [
    "aca",
    "bab",
    "aba"
], ['c', ItemID.circuitBasic, 0, 'a', ItemID.plateCopper, 0, 'b', ItemID.plateTin, 0]);
Recipes.addShaped({ id: ItemID.heatExchangerReactor, count: 1, data: 1 }, [
    "aaa",
    "axa",
    "aaa"
], ['x', ItemID.heatExchanger, 1, 'a', ItemID.plateCopper, 0]);
Recipes.addShaped({ id: ItemID.heatExchangerComponent, count: 1, data: 1 }, [
    " a ",
    "axa",
    " a "
], ['x', ItemID.heatExchanger, 1, 'a', ItemID.plateGold, 0]);
Recipes.addShaped({ id: ItemID.heatExchangerAdv, count: 1, data: 1 }, [
    "pcp",
    "xdx",
    "pcp"
], ['x', ItemID.heatExchanger, 1, 'c', ItemID.circuitBasic, 0, 'd', ItemID.densePlateCopper, 0, 'p', ItemID.plateLapis, 0]);
IDRegistry.genItemID("heatVent");
Item.createItem("heatVent", "Heat Vent", { name: "heat_vent", meta: 0 }, { isTech: true });
IDRegistry.genItemID("heatVentReactor");
Item.createItem("heatVentReactor", "Reactor Heat Vent", { name: "heat_vent", meta: 1 }, { isTech: true });
IDRegistry.genItemID("heatVentComponent");
Item.createItem("heatVentComponent", "Component Heat Vent", { name: "heat_vent", meta: 2 });
IDRegistry.genItemID("heatVentAdv");
Item.createItem("heatVentAdv", "Advanced Heat Vent", { name: "heat_vent", meta: 3 }, { isTech: true });
IDRegistry.genItemID("heatVentOverclocked");
Item.createItem("heatVentOverclocked", "Overclocked Heat Vent", { name: "heat_vent", meta: 4 }, { isTech: true });
ReactorAPI.registerComponent(ItemID.heatVent, new ReactorAPI.heatVent(1000, 6, 0));
ReactorAPI.registerComponent(ItemID.heatVentReactor, new ReactorAPI.heatVent(1000, 5, 5));
ReactorAPI.registerComponent(ItemID.heatVentComponent, new ReactorAPI.heatVentSpread(4));
ReactorAPI.registerComponent(ItemID.heatVentAdv, new ReactorAPI.heatVent(1000, 12, 0));
ReactorAPI.registerComponent(ItemID.heatVentOverclocked, new ReactorAPI.heatVent(1000, 20, 36));
Item.addCreativeGroup("ic2_reactorHeatVent", Translation.translate("Reactor Heat Vents"), [
    ItemID.heatVent,
    ItemID.heatVentReactor,
    ItemID.heatVentComponent,
    ItemID.heatVentAdv,
    ItemID.heatVentOverclocked
]);
Recipes.addShaped({ id: ItemID.heatVent, count: 1, data: 1 }, [
    "bab",
    "axa",
    "bab"
], ['x', ItemID.electricMotor, 0, 'a', ItemID.plateIron, 0, 'b', 101, -1]);
Recipes.addShaped({ id: ItemID.heatVentReactor, count: 1, data: 1 }, [
    "a",
    "x",
    "a"
], ['x', ItemID.heatVent, 1, 'a', ItemID.densePlateCopper, 0]);
Recipes.addShaped({ id: ItemID.heatVentComponent, count: 1, data: 0 }, [
    "bab",
    "axa",
    "bab"
], ['x', ItemID.heatVent, 1, 'a', ItemID.plateTin, 0, 'b', 101, -1]);
Recipes.addShaped({ id: ItemID.heatVentAdv, count: 1, data: 1 }, [
    "bxb",
    "bdb",
    "bxb"
], ['x', ItemID.heatVent, 1, 'd', 264, 0, 'b', 101, -1]);
Recipes.addShaped({ id: ItemID.heatVentOverclocked, count: 1, data: 1 }, [
    "a",
    'x',
    "a"
], ['x', ItemID.heatVentReactor, 1, 'a', ItemID.plateGold, 0]);
IDRegistry.genItemID("rshCondensator");
IDRegistry.genItemID("lzhCondensator");
Item.createItem("rshCondensator", "RSH-Condensator", { name: "rsh_condensator" }, { isTech: true });
Item.createItem("lzhCondensator", "LZH-Condensator", { name: "lzh_condensator" }, { isTech: true });
ReactorAPI.registerComponent(ItemID.rshCondensator, new ReactorAPI.condensator(20000));
ReactorAPI.registerComponent(ItemID.lzhCondensator, new ReactorAPI.condensator(100000));
Recipes.addShaped({ id: ItemID.rshCondensator, count: 1, data: 1 }, [
    "rrr",
    "rar",
    "rxr"
], ['a', ItemID.heatVent, 1, 'x', ItemID.heatExchanger, 1, 'r', 331, 0]);
Recipes.addShaped({ id: ItemID.lzhCondensator, count: 1, data: 1 }, [
    "rar",
    "cbc",
    "rxr"
], ['a', ItemID.heatVentReactor, 1, 'b', 22, -1, 'c', ItemID.rshCondensator, -1, 'x', ItemID.heatExchangerReactor, 1, 'r', 331, 0]);
Recipes.addShapeless({ id: ItemID.rshCondensator, count: 1, data: 1 }, [{ id: ItemID.rshCondensator, data: -1 }, { id: 331, data: 0 }], function (api, field, result) {
    var index = 0;
    var canBeRepaired = false;
    for (var i in field) {
        var slot = field[i];
        if (slot.id == ItemID.rshCondensator) {
            if (slot.data <= 1)
                break;
            canBeRepaired = true;
            slot.data = Math.max(parseInt(slot.data - 10000 / slot.count), 1);
        }
        else if (slot.id != 0) {
            index = i;
        }
    }
    if (canBeRepaired) {
        api.decreaseFieldSlot(index);
    }
    result.id = result.count = 0;
});
Recipes.addShapeless({ id: ItemID.lzhCondensator, count: 1, data: 1 }, [{ id: ItemID.lzhCondensator, data: -1 }, { id: 331, data: 0 }], function (api, field, result) {
    var index = 0;
    var canBeRepaired = false;
    for (var i in field) {
        var slot = field[i];
        if (slot.id == ItemID.lzhCondensator) {
            if (slot.data <= 1)
                break;
            canBeRepaired = true;
            slot.data = Math.max(parseInt(slot.data - 10000 / slot.count), 1);
        }
        else if (slot.id != 0) {
            index = i;
        }
    }
    if (canBeRepaired) {
        api.decreaseFieldSlot(index);
    }
    result.id = result.count = 0;
});
Recipes.addShapeless({ id: ItemID.lzhCondensator, count: 1, data: 1 }, [{ id: ItemID.lzhCondensator, data: -1 }, { id: 351, data: 4 }], function (api, field, result) {
    var index = 0;
    var canBeRepaired = false;
    for (var i in field) {
        var slot = field[i];
        if (slot.id == ItemID.lzhCondensator) {
            if (slot.data <= 1)
                break;
            canBeRepaired = true;
            slot.data = Math.max(parseInt(slot.data - 40000 / slot.count), 1);
        }
        else if (slot.id != 0) {
            index = i;
        }
    }
    if (canBeRepaired) {
        api.decreaseFieldSlot(index);
    }
    result.id = result.count = 0;
});
var ItemArmorIC2 = /** @class */ (function (_super) {
    __extends(ItemArmorIC2, _super);
    function ItemArmorIC2(nameID, name, params, inCreative) {
        var _this = _super.call(this, nameID, name, name, params) || this;
        _this.createItem(inCreative);
        return _this;
    }
    ItemArmorIC2.prototype.setArmorTexture = function (name) {
        var index = (this.armorType == "leggings") ? 2 : 1;
        this.texture = 'armor/' + name + '_' + index + '.png';
        return this;
    };
    return ItemArmorIC2;
}(ItemArmor));
/// <reference path="./ItemArmorIC2.ts" />
var ItemArmorElectric = /** @class */ (function (_super) {
    __extends(ItemArmorElectric, _super);
    function ItemArmorElectric(nameID, name, params, maxCharge, transferLimit, tier, inCreative) {
        var _this = _super.call(this, nameID, name, params, false) || this;
        _this.maxCharge = maxCharge;
        _this.transferLimit = transferLimit;
        _this.tier = tier;
        var chargeType = _this.canProvideEnergy() ? "storage" : "armor";
        ChargeItemRegistry.registerExtraItem(_this.id, "Eu", maxCharge, transferLimit, tier, chargeType, true, inCreative);
        return _this;
    }
    ItemArmorElectric.prototype.canProvideEnergy = function () {
        return false;
    };
    ItemArmorElectric.prototype.overrideName = function (item, name) {
        name = this.getRarityCode(this.rarity) + name + '\n' + ItemName.getItemStorageText(item);
        return name;
    };
    ItemArmorElectric.prototype.onHurt = function (params, slot, index, player) {
        return false;
    };
    ItemArmorElectric.prototype.onTick = function (slot, index, player) {
        return false;
    };
    return ItemArmorElectric;
}(ItemArmorIC2));
/// <reference path="./ItemArmorElectric.ts" />
var ItemArmorBatpack = /** @class */ (function (_super) {
    __extends(ItemArmorBatpack, _super);
    function ItemArmorBatpack(nameID, name, maxCharge, transferLimit, tier) {
        return _super.call(this, nameID, name, { type: "chestplate", defence: 3, texture: name }, maxCharge, transferLimit, tier) || this;
    }
    ItemArmorBatpack.prototype.getIcon = function (armorName) {
        return armorName;
    };
    ItemArmorBatpack.prototype.canProvideEnergy = function () {
        return true;
    };
    ItemArmorBatpack.prototype.onTick = function (item, index, player) {
        if (World.getThreadTime() % 20 == 0) {
            var carried = Entity.getCarriedItem(player);
            if (ChargeItemRegistry.isValidItem(carried.id, "Eu", this.tier, "tool")) {
                var energyStored = ChargeItemRegistry.getEnergyStored(item);
                var energyAdd = ChargeItemRegistry.addEnergyTo(carried, "Eu", energyStored, this.transferLimit * 20, this.tier);
                if (energyAdd > 0) {
                    ChargeItemRegistry.setEnergyStored(item, energyStored - energyAdd);
                    Entity.setCarriedItem(player, carried.id, 1, carried.data, carried.extra);
                    Entity.setArmorSlot(player, 1, item.id, 1, item.data, item.extra);
                }
            }
        }
        return false;
    };
    return ItemArmorBatpack;
}(ItemArmorElectric));
/// <reference path="./ItemArmorIC2.ts" />
var ItemArmorHazmat = /** @class */ (function (_super) {
    __extends(ItemArmorHazmat, _super);
    function ItemArmorHazmat(nameID, name, params) {
        var _this = _super.call(this, nameID, name, params) || this;
        _this.setMaxDamage(64);
        RadiationAPI.registerHazmatArmor(_this.id);
        return _this;
    }
    ItemArmorHazmat.prototype.onHurt = function (params, item, index, player) {
        var type = params.type;
        if (type == 2 || type == 3 || type == 11) {
            item.data += Math.ceil(params.damage / 4);
            if (item.data >= Item.getMaxDamage(this.id)) {
                item.id = item.count = 0;
            }
            return true;
        }
        if (type == 9 && index == 0) {
            for (var i = 0; i < 36; i++) {
                var slot = Player.getInventorySlot(i);
                if (slot.id == ItemID.cellAir) {
                    Game.prevent();
                    Entity.addEffect(player, PotionEffect.waterBreathing, 1, 60);
                    Player.setInventorySlot(i, slot.count > 1 ? slot.id : 0, slot.count - 1, 0);
                    Player.addItemToInventory(ItemID.cellEmpty, 1, 0);
                    break;
                }
            }
        }
        if (type == 5 && index == 3) {
            var Dp = Math.floor(params.damage / 8);
            var Db = Math.floor(params.damage * 7 / 16);
            if (Dp < 1) {
                Game.prevent();
            }
            else {
                Entity.setHealth(player, Entity.getHealth(player) + params.damage - Dp);
            }
            item.data += Db;
            if (item.data >= Item.getMaxDamage(this.id)) {
                item.id = item.count = 0;
            }
            return true;
        }
        return false;
    };
    ItemArmorHazmat.prototype.onTick = function (item, index, player) {
        if (index == 0
            && Entity.getArmorSlot(player, 1).id == ItemID.hazmatChestplate
            && Entity.getArmorSlot(player, 2).id == ItemID.hazmatLeggings
            && Entity.getArmorSlot(player, 3).id == ItemID.rubberBoots) {
            if (RadiationAPI.playerRad <= 0) {
                Entity.clearEffect(player, PotionEffect.poison);
            }
            Entity.clearEffect(player, PotionEffect.wither);
        }
        return false;
    };
    return ItemArmorHazmat;
}(ItemArmorIC2));
/// <reference path="./ItemArmorElectric.ts" />
var ItemArmorJetpackElectric = /** @class */ (function (_super) {
    __extends(ItemArmorJetpackElectric, _super);
    function ItemArmorJetpackElectric() {
        var _this = _super.call(this, "jetpack", "electric_jetpack", { type: "chestplate", defence: 3, texture: "electric_jetpack" }, 30000, 100, 1) || this;
        UIbuttons.setArmorButton(_this.id, "button_fly");
        UIbuttons.setArmorButton(_this.id, "button_hover");
        return _this;
    }
    ItemArmorJetpackElectric.prototype.getIcon = function (armorName) {
        return armorName;
    };
    ItemArmorJetpackElectric.prototype.onHurt = function (params, item, index, player) {
        if (params.type == 5) {
            Utils.fixFallDamage(params.damage);
        }
        return false;
    };
    ItemArmorJetpackElectric.prototype.onTick = function (item, index, player) {
        var energyStored = ChargeItemRegistry.getEnergyStored(item);
        if (item.extra && item.extra.getBoolean("hover")) {
            Utils.resetFallHeight();
            var vel = Entity.getVelocity(player);
            if (Utils.isPlayerOnGround() || energyStored < 8) {
                item.extra.putBoolean("hover", false);
                Game.message("§4" + Translation.translate("Hover mode disabled"));
                return true;
            }
            else if (vel.y < -0.1) {
                Entity.addVelocity(player, 0, Math.min(0.25, -0.1 - vel.y), 0);
                if (World.getThreadTime() % 5 == 0) {
                    ChargeItemRegistry.setEnergyStored(item, Math.max(energyStored - 20, 0));
                    return true;
                }
            }
        }
        return false;
    };
    return ItemArmorJetpackElectric;
}(ItemArmorElectric));
/// <reference path="./ItemArmorElectric.ts" />
var ItemArmorNanoSuit = /** @class */ (function (_super) {
    __extends(ItemArmorNanoSuit, _super);
    function ItemArmorNanoSuit(nameID, name, params, isDischarged) {
        if (isDischarged === void 0) { isDischarged = false; }
        var _this = this;
        if (!params.texture)
            params.texture = "nano";
        _this = _super.call(this, nameID, name, params, 1000000, 2048, 3, !isDischarged) || this;
        _this.setRarity(1);
        _this.isCharged = !isDischarged;
        if (!isDischarged) {
            _this.createDischarged(params.defence - 1, params.texture);
            if (params.type == "helmet")
                UIbuttons.setArmorButton(_this.id, "button_nightvision");
        }
        return _this;
    }
    ItemArmorNanoSuit.prototype.getChargedID = function () {
        return this.chargedID;
    };
    ItemArmorNanoSuit.prototype.getDischargedID = function () {
        return this.dischargedID;
    };
    ItemArmorNanoSuit.prototype.createDischarged = function (defence, texture) {
        var nameID = this.nameID + "Discharged";
        var instance = new ItemArmorNanoSuit(nameID, this.name, { type: this.armorType, defence: defence, texture: texture }, true);
        instance.chargedID = this.id;
        this.dischargedID = instance.id;
    };
    ItemArmorNanoSuit.prototype.getEnergyPerDamage = function () {
        return 2000;
    };
    ItemArmorNanoSuit.prototype.onHurt = function (params, item, index, player) {
        var energyStored = ChargeItemRegistry.getEnergyStored(item);
        var type = params.type;
        var energyPerDamage = this.getEnergyPerDamage();
        if (energyStored >= energyPerDamage) {
            if (type == 2 || type == 3 || type == 11) {
                var energy = params.damage * energyPerDamage;
                ChargeItemRegistry.setEnergyStored(item, Math.max(energyStored - energy, 0));
                return true;
            }
            if (index == 3 && type == 5) {
                var damage = Utils.getFallDamage();
                if (damage > 0) {
                    damage = Math.min(damage, params.damage);
                    var damageReduce = Math.min(Math.min(9, damage), Math.floor(energyStored / energyPerDamage));
                    var damageTaken = damage - damageReduce;
                    if (damageTaken > 0) {
                        Entity.setHealth(player, Entity.getHealth(player) + params.damage - damageTaken);
                    }
                    else {
                        Game.prevent();
                    }
                    ChargeItemRegistry.setEnergyStored(item, energyStored - damageReduce * energyPerDamage);
                    return true;
                }
            }
        }
        return false;
    };
    ItemArmorNanoSuit.prototype.onTick = function (item, index, player) {
        var energyStored = ChargeItemRegistry.getEnergyStored(item);
        var wasChanged = false;
        if (this.isCharged && energyStored < this.getEnergyPerDamage()) {
            item.id = this.getDischargedID();
            wasChanged = true;
        }
        if (!this.isCharged && energyStored >= this.getEnergyPerDamage()) {
            item.id = this.getChargedID();
            wasChanged = true;
        }
        // night vision
        if (index == 0 && energyStored > 0 && item.extra && item.extra.getBoolean("nv")) {
            var coords = Entity.getPosition(player);
            var time = World.getWorldTime() % 24000;
            // let region = BlockSource.getDefaultForActor(player);
            // TODO: change to block source after Inner Core update
            if (World.getLightLevel(coords.x, coords.y, coords.z) > 13 && time <= 12000) {
                Entity.addEffect(player, PotionEffect.blindness, 1, 25);
                Entity.clearEffect(player, PotionEffect.nightVision);
            }
            else {
                Entity.addEffect(player, PotionEffect.nightVision, 1, 225);
            }
            Entity.addEffect(player, PotionEffect.nightVision, 1, 225);
            if (World.getThreadTime() % 20 == 0) {
                ChargeItemRegistry.setEnergyStored(item, Math.max(energyStored - 20, 0));
                return true;
            }
        }
        return wasChanged;
    };
    return ItemArmorNanoSuit;
}(ItemArmorElectric));
/** @deprecated */
var NANO_ARMOR_FUNCS = {
    hurt: function (params, item, index) {
        return ItemArmorNanoSuit.prototype.onHurt(params, item, index, Player.get());
    },
    tick: function (item, index) {
        return ItemArmorNanoSuit.prototype.onTick(item, index, Player.get());
    }
};
/// <reference path="./ItemArmorElectric.ts" />
var ItemArmorNightvisionGoggles = /** @class */ (function (_super) {
    __extends(ItemArmorNightvisionGoggles, _super);
    function ItemArmorNightvisionGoggles() {
        var _this = _super.call(this, "nightvisionGoggles", "nightvision", { type: "helmet", defence: 1, texture: "nightvision" }, 100000, 256, 2) || this;
        UIbuttons.setArmorButton(_this.id, "button_nightvision");
        return _this;
    }
    ItemArmorNightvisionGoggles.prototype.onTick = function (item, index, player) {
        var energyStored = ChargeItemRegistry.getEnergyStored(item);
        if (energyStored > 0 && item.extra && item.extra.getBoolean("nv")) {
            var coords = Entity.getPosition(player);
            var time = World.getWorldTime() % 24000;
            // let region = BlockSource.getDefaultForActor(player);
            // TODO: change to block source after Inner Core update
            if (World.getLightLevel(coords.x, coords.y, coords.z) > 13 && time <= 12000) {
                Entity.clearEffect(player, PotionEffect.nightVision);
                Entity.addEffect(player, PotionEffect.blindness, 1, 25);
            }
            else {
                Entity.addEffect(player, PotionEffect.nightVision, 1, 225);
            }
            if (World.getThreadTime() % 20 == 0) {
                ChargeItemRegistry.setEnergyStored(item, Math.max(energyStored - 20, 0));
                return true;
            }
        }
        return false;
    };
    return ItemArmorNightvisionGoggles;
}(ItemArmorElectric));
/// <reference path="./ItemArmorElectric.ts" />
var ItemArmorQuantumSuit = /** @class */ (function (_super) {
    __extends(ItemArmorQuantumSuit, _super);
    function ItemArmorQuantumSuit(nameID, name, params, isDischarged) {
        if (isDischarged === void 0) { isDischarged = false; }
        var _this = this;
        if (!params.texture)
            params.texture = "quantum";
        _this = _super.call(this, nameID, name, params, 1e7, 12000, 4, !isDischarged) || this;
        _this.setRarity(2);
        _this.isCharged = !isDischarged;
        RadiationAPI.registerHazmatArmor(_this.id);
        if (!isDischarged) {
            _this.createDischarged(params.defence - 1, params.texture);
        }
        return _this;
    }
    ItemArmorQuantumSuit.prototype.getCharged = function () {
        return this.chargedID;
    };
    ItemArmorQuantumSuit.prototype.getDischarged = function () {
        return this.dischargedID;
    };
    ItemArmorQuantumSuit.prototype.createDischarged = function (defence, texture) {
        var nameID = this.nameID + "Discharged";
        var instance = new ItemArmorQuantumSuit(nameID, this.name, { type: this.armorType, defence: defence, texture: texture }, true);
        instance.chargedID = this.id;
        this.dischargedID = instance.id;
    };
    ItemArmorQuantumSuit.prototype.getEnergyPerDamage = function () {
        return 5000;
    };
    ItemArmorQuantumSuit.prototype.canAbsorbDamage = function (item, damage) {
        if (this.isCharged || ChargeItemRegistry.getEnergyStored(item) >= this.getEnergyPerDamage() * damage) {
            return true;
        }
        return false;
    };
    ItemArmorQuantumSuit.prototype.onHurt = function (params, slot, index, player) {
        var type = params.type;
        var energyStored = ChargeItemRegistry.getEnergyStored(slot);
        var energyPerDamage = this.getEnergyPerDamage();
        if (energyStored >= energyPerDamage) {
            if ((type == 2 || type == 3 || type == 11) && params.damage > 0) {
                var energy = params.damage * energyPerDamage;
                ChargeItemRegistry.setEnergyStored(slot, Math.max(energyStored - energy, 0));
                return true;
            }
            if (index == 3 && type == 5) {
                var damage = Math.min(Utils.getFallDamage(), params.damage);
                if (damage > 0) {
                    var damageReduce = Math.min(damage, Math.floor(energyStored / energyPerDamage));
                    var damageTaken = damage - damageReduce;
                    if (damageTaken > 0) {
                        Entity.setHealth(player, Entity.getHealth(player) + params.damage - damageTaken);
                    }
                    else {
                        Game.prevent();
                    }
                    ChargeItemRegistry.setEnergyStored(slot, energyStored - damageReduce * energyPerDamage);
                    return true;
                }
            }
            if (index == 3 && type == 22) {
                Game.prevent();
                ChargeItemRegistry.setEnergyStored(slot, energyStored - energyPerDamage);
                return true;
            }
        }
        if (index == 0 && type == 9 && energyStored >= 500) {
            Game.prevent();
            Entity.addEffect(player, PotionEffect.waterBreathing, 1, 60);
            ChargeItemRegistry.setEnergyStored(slot, energyStored - 500);
            return true;
        }
        if (index == 1 && type == 5) {
            Utils.fixFallDamage(params.damage);
        }
        return false;
    };
    ItemArmorQuantumSuit.prototype.onTick = function (slot, index, player) {
        var energyStored = ChargeItemRegistry.getEnergyStored(slot);
        if (this.isCharged && energyStored < this.getEnergyPerDamage()) {
            slot.id = this.getDischarged();
            Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
        }
        if (!this.isCharged && energyStored >= this.getEnergyPerDamage()) {
            slot.id = this.getCharged();
            Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
        }
        if (energyStored > 0) {
            switch (index) {
                case 0:
                    var newEnergyStored = energyStored;
                    if (RadiationAPI.playerRad > 0) {
                        if (energyStored >= 100000) {
                            RadiationAPI.playerRad = 0;
                            Entity.clearEffect(player, PotionEffect.poison);
                            newEnergyStored -= 100000;
                        }
                    }
                    else {
                        Entity.clearEffect(player, PotionEffect.poison);
                    }
                    Entity.clearEffect(player, PotionEffect.wither);
                    var hunger = Player.getHunger();
                    if (hunger < 20 && newEnergyStored >= 500) {
                        var i = World.getThreadTime() % 36;
                        var item = Player.getInventorySlot(i);
                        if (item.id == ItemID.tinCanFull) {
                            var count = Math.min(20 - hunger, item.count);
                            Player.setHunger(hunger + count);
                            item.count -= count;
                            Player.setInventorySlot(i, item.count ? item.id : 0, item.count, item.data);
                            Player.addItemToInventory(ItemID.tinCanEmpty, count, 0);
                            newEnergyStored -= 500;
                            break;
                        }
                    }
                    // night vision
                    if (newEnergyStored > 0 && slot.extra && slot.extra.getBoolean("nv")) {
                        var coords = Entity.getPosition(player);
                        var time = World.getWorldTime() % 24000;
                        // let region = BlockSource.getDefaultForActor(player);
                        // TODO: change to block source after Inner Core update
                        if (World.getLightLevel(coords.x, coords.y, coords.z) > 13 && time <= 12000) {
                            Entity.addEffect(player, PotionEffect.blindness, 1, 25);
                            Entity.clearEffect(player, PotionEffect.nightVision);
                        }
                        else {
                            Entity.addEffect(player, PotionEffect.nightVision, 1, 225);
                        }
                        if (World.getThreadTime() % 20 == 0) {
                            newEnergyStored = Math.max(newEnergyStored - 20, 0);
                        }
                    }
                    if (energyStored != newEnergyStored) {
                        ChargeItemRegistry.setEnergyStored(slot, newEnergyStored);
                        Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
                    }
                    break;
                case 1:
                    if (slot.extra && slot.extra.getBoolean("hover")) {
                        Utils.resetFallHeight();
                        var vel = Entity.getVelocity(player);
                        if (Utils.isPlayerOnGround() || energyStored < 8) {
                            slot.extra.putBoolean("hover", false);
                            Game.message("§4" + Translation.translate("Hover mode disabled"));
                            return true;
                        }
                        else if (vel.y < -0.1) {
                            Entity.addVelocity(player, 0, Math.min(0.25, -0.1 - vel.y), 0);
                            if (World.getThreadTime() % 5 == 0) {
                                ChargeItemRegistry.setEnergyStored(slot, Math.max(energyStored - 20, 0));
                                return true;
                            }
                        }
                    }
                    Entity.setFire(player, 0, true);
                    break;
                case 2:
                    var vel = Entity.getVelocity(player);
                    var horizontalVel = Math.sqrt(vel.x * vel.x + vel.z * vel.z);
                    // Game.tipMessage(horizontalVel);
                    if (horizontalVel <= 0.15) {
                        ItemArmorQuantumSuit.runTime = 0;
                    }
                    else if (Utils.isPlayerOnGround()) {
                        ItemArmorQuantumSuit.runTime++;
                    }
                    if (ItemArmorQuantumSuit.runTime > 2 && !Player.getFlying()) {
                        Entity.addEffect(player, PotionEffect.movementSpeed, 6, 5);
                        if (World.getThreadTime() % 5 == 0) {
                            ChargeItemRegistry.setEnergyStored(slot, Math.max(energyStored - Math.floor(horizontalVel * 600)));
                            Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
                        }
                    }
                    break;
            }
        }
        return false;
    };
    ItemArmorQuantumSuit.runTime = 0;
    return ItemArmorQuantumSuit;
}(ItemArmorElectric));
function canAbsorbDamage(damage) {
    for (var i = 0; i < 4; i++) {
        var slot = Player.getArmorSlot(i);
        var armor = ItemRegistry.getInstanceOf(slot.id);
        if (!(armor instanceof ItemArmorQuantumSuit && armor.canAbsorbDamage(slot, damage)))
            return false;
    }
    return true;
}
Callback.addCallback("EntityHurt", function (attacker, victim, damage, type) {
    if (victim == player && Game.getGameMode() != 1 && damage > 0 && (type == 2 || type == 3 || type == 11) && canAbsorbDamage(damage)) {
        Game.prevent();
        if (type == 2) {
            runOnMainThread(function () {
                Entity.damageEntity(player, 0, type, { attacker: attacker, bool1: true });
            });
        }
        if (type == 3) {
            runOnMainThread(function () {
                Entity.damageEntity(player, 0, type, { attacker: -1, bool1: true });
            });
            var vel = Entity.getVelocity(attacker);
            var hs = Math.sqrt(vel.x * vel.x + vel.z * vel.z);
            Player.addVelocity(vel.x * 0.3 / hs, 0.25, vel.z * 0.3 / hs);
            Entity.remove(attacker);
        }
    }
});
Callback.addCallback("Explosion", function (coords, params) {
    var pos = Player.getPosition();
    var distance = Entity.getDistanceBetweenCoords(coords, pos);
    if (distance <= params.power && canAbsorbDamage(1)) {
        Entity.damageEntity(Player.get(), 0, 11, { attacker: params.entity, bool1: true });
    }
});
/** @deprecated */
var QUANTUM_ARMOR_FUNCS = {
    hurt: function (params, item, index) {
        return ItemArmorQuantumSuit.prototype.onHurt(params, item, index, Player.get());
    },
    tick: function (item, index) {
        return ItemArmorQuantumSuit.prototype.onTick(item, index, Player.get());
    }
};
/// <reference path="./ItemArmorIC2.ts" />
var ItemArmorSolarHelmet = /** @class */ (function (_super) {
    __extends(ItemArmorSolarHelmet, _super);
    function ItemArmorSolarHelmet(nameID, name, params) {
        var _this = _super.call(this, nameID, name, params) || this;
        _this.canSeeSky = false;
        return _this;
    }
    ItemArmorSolarHelmet.prototype.onTick = function (item, index, player) {
        var time = World.getWorldTime() % 24000;
        var p = Entity.getPosition(player);
        var region = BlockSource.getDefaultForActor(player);
        if (World.getThreadTime() % 20 == 0 && region.canSeeSky(p.x, p.y + 1, p.z) &&
            (time >= 23500 || time < 12550) && (!World.getWeather().rain || World.getLightLevel(p.x, p.y + 1, p.z) > 14)) {
            for (var i_31 = 1; i_31 < 4; i_31++) {
                var energy = 20;
                var armor = Entity.getArmorSlot(player, i_31);
                var energyAdd = ChargeItemRegistry.addEnergyTo(armor, "Eu", energy, 4);
                if (energyAdd > 0) {
                    energy -= energyAdd;
                    Entity.setArmorSlot(player, i_31, armor.id, 1, armor.data, armor.extra);
                    if (energy <= 0)
                        break;
                }
            }
        }
        return false;
    };
    return ItemArmorSolarHelmet;
}(ItemArmorIC2));
/// <reference path="./ItemArmorIC2.ts" />
/// <reference path="./ItemArmorHazmat.ts" />
/// <reference path="./ItemArmorJetpackElectric.ts" />
/// <reference path="./ItemArmorBatpack.ts" />
/// <reference path="./ItemArmorNightvisionGoggles.ts" />
/// <reference path="./ItemArmorNanoSuit.ts" />
/// <reference path="./ItemArmorQuantumSuit.ts" />
/// <reference path="./ItemArmorSolarHelmet.ts" />
ItemRegistry.addArmorMaterial("bronze", { durabilityFactor: 14, enchantability: 10, repairItem: ItemID.ingotBronze });
new ItemArmorIC2("bronzeHelmet", "bronze_helmet", { type: "helmet", defence: 2, texture: "bronze", material: "bronze" });
new ItemArmorIC2("bronzeChestplate", "bronze_chestplate", { type: "chestplate", defence: 6, texture: "bronze", material: "bronze" });
new ItemArmorIC2("bronzeLeggings", "bronze_leggings", { type: "leggings", defence: 6, texture: "bronze", material: "bronze" });
new ItemArmorIC2("bronzeBoots", "bronze_boots", { type: "boots", defence: 6, texture: "bronze", material: "bronze" });
ItemRegistry.addArmorMaterial("composite", { durabilityFactor: 50, enchantability: 8, repairItem: ItemID.plateAlloy });
new ItemArmorIC2("compositeHelmet", "composite_helmet", { type: "helmet", defence: 3, texture: "composite", material: "composite" });
new ItemArmorIC2("compositeChestplate", "composite_chestplate", { type: "chestplate", defence: 8, texture: "composite", material: "composite" });
new ItemArmorIC2("compositeLeggings", "composite_leggings", { type: "leggings", defence: 6, texture: "composite", material: "composite" });
new ItemArmorIC2("compositeBoots", "composite_boots", { type: "boots", defence: 3, texture: "composite", material: "composite" });
new ItemArmorHazmat("hazmatHelmet", "hazmat_helmet", { type: "helmet", defence: 1, texture: "hazmat" });
new ItemArmorHazmat("hazmatChestplate", "hazmat_chestplate", { type: "chestplate", defence: 1, texture: "hazmat" });
new ItemArmorHazmat("hazmatLeggings", "hazmat_leggings", { type: "leggings", defence: 1, texture: "hazmat" });
new ItemArmorHazmat("rubberBoots", "rubber_boots", { type: "boots", defence: 1, texture: "rubber" });
new ItemArmorJetpackElectric();
new ItemArmorBatpack("batpack", "batpack", 60000, 100, 1);
new ItemArmorBatpack("advBatpack", "advanced_batpack", 600000, 512, 2);
new ItemArmorBatpack("energypack", "energypack", 2000000, 2048, 3);
new ItemArmorBatpack("lappack", "lappack", 10000000, 8192, 4).setRarity(1);
Item.addCreativeGroup("batteryPack", Translation.translate("Battery Packs"), [
    ItemID.batpack,
    ItemID.advBatpack,
    ItemID.energypack,
    ItemID.lappack
]);
new ItemArmorNightvisionGoggles();
new ItemArmorNanoSuit("nanoHelmet", "nano_helmet", { type: "helmet", defence: 4 });
new ItemArmorNanoSuit("nanoChestplate", "nano_chestplate", { type: "chestplate", defence: 9 });
new ItemArmorNanoSuit("nanoLeggings", "nano_leggings", { type: "leggings", defence: 7 });
new ItemArmorNanoSuit("nanoBoots", "nano_boots", { type: "boots", defence: 4 });
new ItemArmorQuantumSuit("quantumHelmet", "quantum_helmet", { type: "helmet", defence: 4 });
new ItemArmorQuantumSuit("quantumChestplate", "quantum_chestplate", { type: "chestplate", defence: 9 });
new ItemArmorQuantumSuit("quantumLeggings", "quantum_leggings", { type: "leggings", defence: 7 });
new ItemArmorQuantumSuit("quantumBoots", "quantum_boots", { type: "boots", defence: 4 });
UIbuttons.setArmorButton(ItemID.quantumHelmet, "button_nightvision");
UIbuttons.setArmorButton(ItemID.quantumChestplate, "button_fly");
UIbuttons.setArmorButton(ItemID.quantumChestplate, "button_hover");
UIbuttons.setArmorButton(ItemID.quantumBoots, "button_jump");
new ItemArmorSolarHelmet("solarHelmet", "solar_helmet", { type: "helmet", defence: 2, texture: "solar" });
/// <reference path="./init.ts" />
// Bronze
Recipes.addShaped({ id: ItemID.bronzeHelmet, count: 1, data: 0 }, [
    "xxx",
    "x x"
], ['x', ItemID.ingotBronze, 0]);
Recipes.addShaped({ id: ItemID.bronzeChestplate, count: 1, data: 0 }, [
    "x x",
    "xxx",
    "xxx"
], ['x', ItemID.ingotBronze, 0]);
Recipes.addShaped({ id: ItemID.bronzeLeggings, count: 1, data: 0 }, [
    "xxx",
    "x x",
    "x x"
], ['x', ItemID.ingotBronze, 0]);
Recipes.addShaped({ id: ItemID.bronzeBoots, count: 1, data: 0 }, [
    "x x",
    "x x"
], ['x', ItemID.ingotBronze, 0]);
// Composite
Recipes.addShaped({ id: ItemID.compositeHelmet, count: 1, data: 0 }, [
    "xax",
    "x x"
], ['x', ItemID.plateAlloy, 0, 'a', VanillaItemID.iron_helmet, 0]);
Recipes.addShaped({ id: ItemID.compositeChestplate, count: 1, data: 0 }, [
    "x x",
    "xax",
    "xxx"
], ['x', ItemID.plateAlloy, 0, 'a', VanillaItemID.iron_chestplate, 0]);
Recipes.addShaped({ id: ItemID.compositeLeggings, count: 1, data: 0 }, [
    "xax",
    "x x",
    "x x"
], ['x', ItemID.plateAlloy, 0, 'a', VanillaItemID.iron_leggings, 0]);
Recipes.addShaped({ id: ItemID.compositeBoots, count: 1, data: 0 }, [
    "x x",
    "xax"
], ['x', ItemID.plateAlloy, 0, 'a', VanillaItemID.iron_boots, 0]);
// Hazmat
Recipes.addShaped({ id: ItemID.hazmatHelmet, count: 1, data: 0 }, [
    " d ",
    "xax",
    "x#x"
], ['x', ItemID.rubber, 0, 'a', 20, -1, 'd', 351, 14, '#', 101, -1]);
Recipes.addShaped({ id: ItemID.hazmatChestplate, count: 1, data: 0 }, [
    "x x",
    "xdx",
    "xdx"
], ['x', ItemID.rubber, 0, 'd', 351, 14]);
Recipes.addShaped({ id: ItemID.hazmatLeggings, count: 1, data: 0 }, [
    "xdx",
    "x x",
    "x x"
], ['x', ItemID.rubber, 0, 'd', 351, 14]);
Recipes.addShaped({ id: ItemID.rubberBoots, count: 1, data: 0 }, [
    "x x",
    "x x",
    "xwx"
], ['x', ItemID.rubber, 0, 'w', 35, -1]);
// Jetpack
Recipes.addShaped({ id: ItemID.jetpack, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE }, [
    "bcb",
    "bab",
    "d d"
], ['a', BlockID.storageBatBox, -1, 'b', ItemID.casingIron, 0, 'c', ItemID.circuitAdvanced, 0, 'd', 348, 0]);
// Batpacks
Recipes.addShaped({ id: ItemID.batpack, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE }, [
    "bcb",
    "bab",
    "b b"
], ['a', 5, -1, 'b', ItemID.storageBattery, -1, 'c', ItemID.circuitBasic, 0], ChargeItemRegistry.transferEnergy);
Recipes.addShaped({ id: ItemID.advBatpack, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE }, [
    "bcb",
    "bab",
    "b b"
], ['a', ItemID.plateBronze, 0, 'b', ItemID.storageAdvBattery, -1, 'c', ItemID.circuitBasic, 0], ChargeItemRegistry.transferEnergy);
Recipes.addShaped({ id: ItemID.energypack, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE }, [
    "cbc",
    "aba",
    "b b"
], ['a', ItemID.storageCrystal, -1, 'b', ItemID.casingIron, 0, 'c', ItemID.circuitAdvanced, 0], ChargeItemRegistry.transferEnergy);
Recipes.addShaped({ id: ItemID.lappack, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE }, [
    "e",
    "c",
    "a"
], ['e', ItemID.energypack, -1, 'a', ItemID.storageLapotronCrystal, -1, 'c', ItemID.circuitAdvanced, 0], ChargeItemRegistry.transferEnergy);
// Nightvision Goggles
Recipes.addShaped({ id: ItemID.nightvisionGoggles, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE }, [
    "xbx",
    "aga",
    "rcr"
], ['a', BlockID.luminator, -1, 'b', ItemID.storageAdvBattery, -1, 'c', ItemID.circuitAdvanced, 0, 'x', ItemID.heatExchangerAdv, 1, 'g', 20, 0, 'r', ItemID.rubber, 0], ChargeItemRegistry.transferEnergy);
// Nano Suit
Recipes.addShaped({ id: ItemID.nanoHelmet, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE }, [
    "x#x",
    "xax"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0, 'a', ItemID.nightvisionGoggles, -1], ChargeItemRegistry.transferEnergy);
Recipes.addShaped({ id: ItemID.nanoChestplate, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE }, [
    "x x",
    "x#x",
    "xxx"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0], ChargeItemRegistry.transferEnergy);
Recipes.addShaped({ id: ItemID.nanoLeggings, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE }, [
    "x#x",
    "x x",
    "x x"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0], ChargeItemRegistry.transferEnergy);
Recipes.addShaped({ id: ItemID.nanoBoots, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE }, [
    "x x",
    "x#x"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0], ChargeItemRegistry.transferEnergy);
// Quantum Suit
Recipes.addShaped({ id: ItemID.quantumHelmet, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE }, [
    "a#a",
    "bxb",
    "cqc"
], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoHelmet, -1, 'q', ItemID.hazmatHelmet, 0, 'a', ItemID.plateReinforcedIridium, 0, 'b', BlockID.reinforcedGlass, 0, 'c', ItemID.circuitAdvanced, 0], ChargeItemRegistry.transferEnergy);
Recipes.addShaped({ id: ItemID.quantumChestplate, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE }, [
    "bxb",
    "a#a",
    "aca"
], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoChestplate, -1, 'a', ItemID.plateReinforcedIridium, 0, 'b', ItemID.plateAlloy, 0, 'c', ItemID.jetpack, -1], ChargeItemRegistry.transferEnergy);
Recipes.addShaped({ id: ItemID.quantumLeggings, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE }, [
    "m#m",
    "axa",
    "c c"
], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoLeggings, -1, 'a', ItemID.plateReinforcedIridium, 0, 'm', BlockID.machineBlockBasic, 0, 'c', 348, 0], ChargeItemRegistry.transferEnergy);
Recipes.addShaped({ id: ItemID.quantumBoots, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE }, [
    "axa",
    "b#b"
], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoBoots, -1, 'a', ItemID.plateReinforcedIridium, 0, 'b', ItemID.rubberBoots, 0], ChargeItemRegistry.transferEnergy);
// Solar Helmet
Recipes.addShaped({ id: ItemID.solarHelmet, count: 1, data: 0 }, [
    "aaa",
    "axa",
    "ccc"
], ['x', BlockID.solarPanel, -1, 'a', VanillaItemID.iron_ingot, 0, 'c', ItemID.cableCopper1, 0]);
Recipes.addShaped({ id: ItemID.solarHelmet, count: 1, data: 0 }, [
    " a ",
    " x ",
    "ccc"
], ['x', BlockID.solarPanel, -1, 'a', VanillaItemID.iron_helmet, 0, 'c', ItemID.cableCopper1, 0]);
IDRegistry.genItemID("EUMeter");
Item.createItem("EUMeter", "EU Meter", { name: "eu_meter", meta: 0 }, { stack: 1 });
Recipes.addShaped({ id: ItemID.EUMeter, count: 1, data: 0 }, [
    " g ",
    "xcx",
    "x x"
], ['c', ItemID.circuitBasic, 0, 'x', ItemID.cableCopper1, 0, 'g', 348, -1]);
var guiEUReader = new UI.Window({
    location: {
        x: 0,
        y: 0,
        width: 1000,
        height: 750
    },
    drawing: [
        { type: "background", color: 0 },
        { type: "bitmap", x: 218, y: 30, bitmap: "eu_meter_background", scale: GUI_SCALE },
    ],
    elements: {
        "arrow": { type: "image", x: 576, y: 206, bitmap: "eu_meter_arrow_0", scale: GUI_SCALE },
        "textName": { type: "text", font: { size: 36 }, x: 378, y: 46, width: 256, height: 42, text: Translation.translate("EU Meter") },
        "textAvg": { type: "text", font: { size: 22, color: Color.GREEN }, x: 266, y: 164, width: 256, height: 42, text: Translation.translate("Avg:") },
        "textAvgValue": { type: "text", font: { size: 22, color: Color.GREEN }, x: 266, y: 194, width: 256, height: 42, text: "0 EU/t" },
        "textMaxMin": { type: "text", font: { size: 22, color: Color.GREEN }, x: 266, y: 240, width: 256, height: 42, text: Translation.translate("Max/Min") },
        "textMax": { type: "text", font: { size: 22, color: Color.GREEN }, x: 266, y: 270, width: 256, height: 42, text: "0 EU/t" },
        "textMin": { type: "text", font: { size: 22, color: Color.GREEN }, x: 266, y: 300, width: 256, height: 42, text: "0 EU/t" },
        "textMode1": { type: "text", font: { size: 22, color: Color.GREEN }, x: 554, y: 164, width: 100, height: 42, text: Translation.translate("Mode:") },
        "textMode2": { type: "text", font: { size: 22, color: Color.GREEN }, x: 554, y: 348, width: 256, height: 42, text: Translation.translate("EnergyIn") },
        "textTime": { type: "text", font: { size: 22, color: Color.GREEN }, x: 266, y: 348, width: 256, height: 42, text: "Cycle: 0 sec" },
        "textReset": { type: "text", font: { size: 22, color: Color.GREEN }, x: 330, y: 392, width: 256, height: 42, text: Translation.translate("Reset") },
        "closeButton": { type: "button", x: 727, y: 40, bitmap: "close_button_small", scale: GUI_SCALE, clicker: {
                onClick: function (container) {
                    container.close();
                    EUReader.container = null;
                    EUReader.net = null;
                    EUReader.tile = null;
                }
            } },
        "resetButton": { type: "button", x: 298, y: 385, bitmap: "eu_meter_reset_button", scale: GUI_SCALE, clicker: {
                onClick: function (container) {
                    EUReader.resetValues();
                }
            } },
        "arrowButton0": { type: "button", x: 576, y: 206, bitmap: "eu_meter_switch_button", scale: GUI_SCALE, clicker: {
                onClick: function (container) {
                    EUReader.mode = 0;
                    EUReader.resetValues();
                    var elements = container.getGuiContent().elements;
                    elements.arrow.bitmap = "eu_meter_arrow_0";
                    elements.textMode2.text = Translation.translate("EnergyIn");
                }
            } },
        "arrowButton1": { type: "button", x: 640, y: 206, bitmap: "eu_meter_switch_button", scale: GUI_SCALE, clicker: {
                onClick: function (container) {
                    EUReader.mode = 1;
                    EUReader.resetValues();
                    var elements = container.getGuiContent().elements;
                    elements.arrow.bitmap = "eu_meter_arrow_1";
                    elements.textMode2.text = Translation.translate("EnergyOut");
                }
            } },
        "arrowButton2": { type: "button", x: 576, y: 270, bitmap: "eu_meter_switch_button", scale: GUI_SCALE, clicker: {
                onClick: function (container) {
                    EUReader.mode = 2;
                    EUReader.resetValues();
                    var elements = container.getGuiContent().elements;
                    elements.arrow.bitmap = "eu_meter_arrow_2";
                    elements.textMode2.text = Translation.translate("EnergyGain");
                }
            } },
        "arrowButton3": { type: "button", x: 640, y: 270, bitmap: "eu_meter_switch_button", scale: GUI_SCALE, clicker: {
                onClick: function (container) {
                    EUReader.mode = 3;
                    EUReader.resetValues();
                    var elements = container.getGuiContent().elements;
                    elements.arrow.bitmap = "eu_meter_arrow_3";
                    elements.textMode2.text = Translation.translate("Voltage");
                }
            } },
    }
});
Callback.addCallback("LevelLoaded", function () {
    var content = guiEUReader.getContent();
    content.elements.textName.text = Translation.translate("EU Meter");
});
Callback.addCallback("MinecraftActivityStopped", function () {
    if (EUReader.container && EUReader.container.isOpened()) {
        EUReader.container.close();
        EUReader.container = null;
    }
});
var EUReader = {
    container: null,
    mode: 0,
    time: 0,
    sum: 0,
    minValue: 0,
    maxValue: 0,
    net: null,
    tile: null,
    resetValues: function () {
        this.time = 0;
        this.sum = 0;
        this.minValue = 2e9;
        this.maxValue = -2e9;
    }
};
Item.registerUseFunction("EUMeter", function (coords, item, block) {
    var tile = EnergyTileRegistry.accessMachineAtCoords(coords.x, coords.y, coords.z);
    if (tile) {
        var net = tile.__energyNets.Eu;
    }
    else {
        var net = EnergyNetBuilder.getNetOnCoords(coords.x, coords.y, coords.z);
    }
    if (!EUReader.container && (net || tile)) {
        EUReader.net = net;
        EUReader.tile = tile;
        EUReader.resetValues();
        EUReader.container = new UI.Container();
        EUReader.container.openAs(guiEUReader);
    }
});
Callback.addCallback("tick", function () {
    var item = Player.getCarriedItem();
    if (item.id == ItemID.EUMeter) {
        if (EUReader.container) {
            var r = function (x) { return Math.round(x * 100) / 100 || 0; };
            var currentValue = 0;
            var elements = guiEUReader.content.elements;
            if (EUReader.mode < 3) {
                var unit = " EU/t";
                var energyIn = energyOut = 0;
                if (EUReader.tile) {
                    energyIn = r(EUReader.tile.last_energy_receive);
                    if (EUReader.net) {
                        energyOut = r(EUReader.net.lastTransfered);
                    }
                }
                else if (EUReader.net) {
                    energyIn = energyOut = r(EUReader.net.lastTransfered);
                }
                switch (EUReader.mode) {
                    case 0:
                        currentValue = energyIn;
                        break;
                    case 1:
                        currentValue = energyOut;
                        break;
                    case 2:
                        currentValue = energyIn - energyOut;
                        break;
                }
            }
            else {
                var unit = " V";
                if (EUReader.tile) {
                    currentValue = r(EUReader.tile.last_voltage);
                }
                else if (EUReader.net) {
                    currentValue = r(EUReader.net.lastVoltage);
                }
            }
            EUReader.time++;
            EUReader.sum += currentValue;
            EUReader.maxValue = Math.max(currentValue, EUReader.maxValue);
            EUReader.minValue = Math.min(currentValue, EUReader.minValue);
            elements.textAvgValue.text = r(EUReader.sum / EUReader.time) + unit;
            elements.textMax.text = EUReader.maxValue + unit;
            elements.textMin.text = EUReader.minValue + unit;
            elements.textTime.text = Translation.translate("Cycle: ") + Math.floor(EUReader.time / 20) + " " + Translation.translate("sec");
        }
    }
});
IDRegistry.genItemID("freqTransmitter");
Item.createItem("freqTransmitter", "Frequency Transmitter", { name: "frequency_transmitter" }, { stack: 1 });
Recipes.addShaped({ id: ItemID.freqTransmitter, count: 1, data: 0 }, [
    "x",
    "#",
    "b"
], ['#', ItemID.circuitBasic, 0, 'x', ItemID.cableCopper1, 0, 'b', ItemID.casingIron, 0]);
Item.registerNameOverrideFunction(ItemID.freqTransmitter, function (item, name) {
    var carried = Player.getCarriedItem();
    if (carried.id == item.id) {
        var extra = carried.extra;
        if (extra) {
            var x = extra.getInt("x");
            var y = extra.getInt("y");
            var z = extra.getInt("z");
            name += "\n§7x: " + x + ", y: " + y + ", z: " + z;
        }
    }
    return name;
});
Item.registerUseFunction("freqTransmitter", function (coords, item, block) {
    var receiveCoords;
    var extra = item.extra;
    if (!extra) {
        extra = new ItemExtraData();
        item.extra = extra;
    }
    else {
        var x = extra.getInt("x");
        var y = extra.getInt("y");
        var z = extra.getInt("z");
        receiveCoords = { x: x, z: z, y: y };
    }
    if (block.id == BlockID.teleporter) {
        if (!receiveCoords) {
            extra.putInt("x", coords.x);
            extra.putInt("y", coords.y);
            extra.putInt("z", coords.z);
            Player.setCarriedItem(item.id, 1, item.data, extra);
            Game.message("Frequency Transmitter linked to Teleporter");
        }
        else {
            if (x == coords.x && y == coords.y && z == coords.z) {
                Game.message("Can`t link Teleporter to itself");
            }
            else {
                var data = World.getTileEntity(coords.x, coords.y, coords.z).data;
                var distance = Entity.getDistanceBetweenCoords(coords, receiveCoords);
                var basicTeleportCost = Math.floor(5 * Math.pow((distance + 10), 0.7));
                receiver = World.getTileEntity(x, y, z);
                if (receiver) {
                    data.frequency = receiveCoords;
                    data.frequency.energy = basicTeleportCost;
                    data = receiver.data;
                    data.frequency = coords;
                    data.frequency.energy = basicTeleportCost;
                    Game.message("Teleportation link established");
                }
            }
        }
    }
    else if (receiveCoords) {
        Player.setCarriedItem(item.id, 1, item.data);
        Game.message("Frequency Transmitter unlinked");
    }
});
IDRegistry.genItemID("scanner");
IDRegistry.genItemID("scannerAdvanced");
Item.createItem("scanner", "OD Scanner", { name: "scanner", meta: 0 }, { stack: 1, isTech: true });
Item.createItem("scannerAdvanced", "OV Scanner", { name: "scanner", meta: 1 }, { stack: 1, isTech: true });
ChargeItemRegistry.registerExtraItem(ItemID.scanner, "Eu", 10000, 100, 1, "tool", true, true);
ChargeItemRegistry.registerExtraItem(ItemID.scannerAdvanced, "Eu", 100000, 256, 2, "tool", true, true);
Item.registerNameOverrideFunction(ItemID.scanner, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.scannerAdvanced, ItemName.showItemStorage);
Recipes.addShaped({ id: ItemID.scanner, count: 1, data: 27 }, [
    "gdg",
    "cbc",
    "xxx"
], ['x', ItemID.cableCopper1, -1, 'b', ItemID.storageBattery, -1, 'c', ItemID.circuitBasic, -1, 'd', 348, 0, 'g', ItemID.casingGold, -1], ChargeItemRegistry.transferEnergy);
Recipes.addShaped({ id: ItemID.scannerAdvanced, count: 1, data: 27 }, [
    "gbg",
    "dcd",
    "xsx"
], ['x', ItemID.cableGold2, -1, 's', ItemID.scanner, -1, 'b', ItemID.storageAdvBattery, -1, 'c', ItemID.circuitAdvanced, -1, 'd', 348, 0, 'g', ItemID.casingGold, -1], ChargeItemRegistry.transferEnergy);
var scan_radius = 3;
var adv_scan_radius = 6;
var ore_blocks = [14, 15, 16, 21, 73, 74, 56, 129, 153];
Callback.addCallback("PreLoaded", function (coords, item, block) {
    for (var id in BlockID) {
        if (id.startsWith("ore") && !TileEntity.isTileEntityBlock(BlockID[id])) {
            ore_blocks.push(BlockID[id]);
        }
    }
});
function scanOres(coords, item, energy, radius) {
    if (ICTool.useElectricItem(item, energy)) {
        SoundManager.playSound("ODScanner.ogg");
        Game.message(Translation.translate("Scan Result: ") + coords.x + ", " + coords.y + ", " + coords.z);
        var ores = {};
        for (var x = coords.x - radius; x <= coords.x + radius; x++) {
            for (var y = coords.y - radius; y <= coords.y + radius; y++) {
                for (var z = coords.z - radius; z <= coords.z + radius; z++) {
                    var blockID = World.getBlockID(x, y, z);
                    if (ore_blocks.indexOf(blockID) != -1) {
                        ores[blockID] = ores[blockID] || 0;
                        ores[blockID]++;
                    }
                }
            }
        }
        for (var id in ores) {
            Game.message(Item.getName(id) + " - " + ores[id]);
        }
    }
}
Item.registerUseFunction("scanner", function (coords, item, block) {
    scanOres(coords, item, 50, scan_radius);
});
Item.registerUseFunction("scannerAdvanced", function (coords, item, block) {
    scanOres(coords, item, 200, adv_scan_radius);
});
IDRegistry.genItemID("treetap");
Item.createItem("treetap", "Treetap", { name: "treetap", data: 0 }, { stack: 1 });
Item.setMaxDamage(ItemID.treetap, 17);
Item.registerUseFunction("treetap", function (coords, item, block) {
    if (block.id == BlockID.rubberTreeLogLatex && block.data >= 4 && block.data == coords.side + 2) {
        SoundManager.playSoundAt(coords.vec.x, coords.vec.y, coords.vec.z, "Treetap.ogg");
        World.setBlock(coords.x, coords.y, coords.z, BlockID.rubberTreeLogLatex, block.data - 4);
        Player.setCarriedItem(item.id, ++item.data < 17 ? item.count : 0, item.data);
        Entity.setVelocity(World.drop(coords.relative.x + 0.5, coords.relative.y + 0.5, coords.relative.z + 0.5, ItemID.latex, randomInt(1, 3), 0), (coords.relative.x - coords.x) * 0.25, (coords.relative.y - coords.y) * 0.25, (coords.relative.z - coords.z) * 0.25);
    }
});
Recipes.addShaped({ id: ItemID.treetap, count: 1, data: 0 }, [
    " x ",
    "xxx",
    "x  "
], ['x', 5, -1]);
IDRegistry.genItemID("craftingHammer");
Item.createItem("craftingHammer", "Forge Hammer", { name: "crafting_hammer" }, { stack: 1 });
Item.setMaxDamage(ItemID.craftingHammer, 80);
IDRegistry.genItemID("cutter");
Item.createItem("cutter", "Cutter", { name: "cutter" }, { stack: 1 });
Item.setMaxDamage(ItemID.cutter, 60);
Recipes.addShaped({ id: ItemID.craftingHammer, count: 1, data: 0 }, [
    "xx ",
    "x##",
    "xx "
], ['x', 265, 0, '#', 280, 0]);
Recipes.addShaped({ id: ItemID.cutter, count: 1, data: 0 }, [
    "x x",
    " x ",
    "a a"
], ['a', 265, 0, 'x', ItemID.plateIron, 0]);
Callback.addCallback("DestroyBlockStart", function (coords, block) {
    var item = Player.getCarriedItem();
    var cableData = CableRegistry.getCableData(block.id);
    if (item.id == ItemID.cutter && cableData && cableData.insulation > 0) {
        Game.prevent();
        ToolAPI.breakCarriedTool(1);
        SoundManager.playSoundAtBlock(coords, "InsulationCutters.ogg");
        var blockID = BlockID[cableData.name + (cableData.insulation - 1)];
        World.setBlock(coords.x, coords.y, coords.z, blockID, 0);
        World.drop(coords.x + 0.5, coords.y + 1, coords.z + 0.5, ItemID.rubber, 1);
    }
});
Item.registerUseFunction("cutter", function (coords, item, block) {
    var cableData = CableRegistry.getCableData(block.id);
    if (cableData && cableData.insulation < cableData.maxInsulation) {
        for (var i = 9; i < 45; i++) {
            var slot = Player.getInventorySlot(i);
            if (slot.id == ItemID.rubber) {
                var blockID = BlockID[cableData.name + (cableData.insulation + 1)];
                World.setBlock(coords.x, coords.y, coords.z, blockID, 0);
                slot.count--;
                Player.setInventorySlot(i, slot.count ? slot.id : 0, slot.count, slot.data);
                break;
            }
        }
    }
});
IDRegistry.genItemID("toolbox");
Item.createItem("toolbox", "Tool Box", { name: "tool_box", meta: 0 }, { stack: 1 });
Recipes.addShaped({ id: ItemID.toolbox, count: 1, data: 0 }, [
    "axa",
    "aaa",
], ['x', 54, -1, 'a', ItemID.casingBronze, 0]);
var toolbox_items = [
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
    isValidItem: function (id, count, data) {
        if (toolbox_items.indexOf(id) != -1)
            return true;
        if (ToolAPI.getToolData(id) || ICTool.getWrenchData(id))
            return true;
        return false;
    }
});
IDRegistry.genItemID("containmentBox");
Item.createItem("containmentBox", "Containment Box", { name: "containment_box", meta: 0 }, { stack: 1 });
Recipes.addShaped({ id: ItemID.containmentBox, count: 1, data: 0 }, [
    "aaa",
    "axa",
    "aaa",
], ['x', 54, -1, 'a', ItemID.casingLead, 0]);
var guiContainmentBox = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("Containment Box") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "background", color: Color.parseColor("#d5d9b9") },
        { type: "bitmap", x: 415, y: 112, bitmap: "containment_box_image", scale: GUI_SCALE },
        { type: "bitmap", x: 805, y: 112, bitmap: "containment_box_image", scale: GUI_SCALE },
        { type: "bitmap", x: 415, y: 232, bitmap: "containment_box_image", scale: GUI_SCALE },
        { type: "bitmap", x: 805, y: 232, bitmap: "containment_box_image", scale: GUI_SCALE },
    ],
    elements: {
        "slot0": { type: "slot", x: 530, y: 120, isValid: function (id) { return RadiationAPI.isRadioactiveItem(id); } },
        "slot1": { type: "slot", x: 590, y: 120, isValid: function (id) { return RadiationAPI.isRadioactiveItem(id); } },
        "slot2": { type: "slot", x: 650, y: 120, isValid: function (id) { return RadiationAPI.isRadioactiveItem(id); } },
        "slot3": { type: "slot", x: 710, y: 120, isValid: function (id) { return RadiationAPI.isRadioactiveItem(id); } },
        "slot4": { type: "slot", x: 530, y: 180, isValid: function (id) { return RadiationAPI.isRadioactiveItem(id); } },
        "slot5": { type: "slot", x: 590, y: 180, isValid: function (id) { return RadiationAPI.isRadioactiveItem(id); } },
        "slot6": { type: "slot", x: 650, y: 180, isValid: function (id) { return RadiationAPI.isRadioactiveItem(id); } },
        "slot7": { type: "slot", x: 710, y: 180, isValid: function (id) { return RadiationAPI.isRadioactiveItem(id); } },
        "slot8": { type: "slot", x: 530, y: 240, isValid: function (id) { return RadiationAPI.isRadioactiveItem(id); } },
        "slot9": { type: "slot", x: 590, y: 240, isValid: function (id) { return RadiationAPI.isRadioactiveItem(id); } },
        "slot10": { type: "slot", x: 650, y: 240, isValid: function (id) { return RadiationAPI.isRadioactiveItem(id); } },
        "slot11": { type: "slot", x: 710, y: 240, isValid: function (id) { return RadiationAPI.isRadioactiveItem(id); } },
    }
});
BackpackRegistry.register(ItemID.containmentBox, {
    title: "Containment Box",
    gui: guiContainmentBox
});
IDRegistry.genItemID("bronzeSword");
IDRegistry.genItemID("bronzeShovel");
IDRegistry.genItemID("bronzePickaxe");
IDRegistry.genItemID("bronzeAxe");
IDRegistry.genItemID("bronzeHoe");
Item.createItem("bronzeSword", "Bronze Sword", { name: "bronze_sword", meta: 0 }, { stack: 1 });
Item.createItem("bronzeShovel", "Bronze Shovel", { name: "bronze_shovel", meta: 0 }, { stack: 1 });
Item.createItem("bronzePickaxe", "Bronze Pickaxe", { name: "bronze_pickaxe", meta: 0 }, { stack: 1 });
Item.createItem("bronzeAxe", "Bronze Axe", { name: "bronze_axe", meta: 0 }, { stack: 1 });
Item.createItem("bronzeHoe", "Bronze Hoe", { name: "bronze_hoe", meta: 0 }, { stack: 1 });
ToolAPI.addToolMaterial("bronze", { durability: 225, level: 3, efficiency: 6, damage: 2, enchantability: 15 });
ToolLib.setTool(ItemID.bronzeSword, "bronze", ToolType.sword);
ToolLib.setTool(ItemID.bronzeShovel, "bronze", ToolType.shovel);
ToolLib.setTool(ItemID.bronzePickaxe, "bronze", ToolType.pickaxe);
ToolLib.setTool(ItemID.bronzeAxe, "bronze", ToolType.axe);
ToolLib.setTool(ItemID.bronzeHoe, "bronze", ToolType.hoe);
Item.addRepairItemIds(ItemID.bronzeSword, [ItemID.ingotBronze]);
Item.addRepairItemIds(ItemID.bronzeShovel, [ItemID.ingotBronze]);
Item.addRepairItemIds(ItemID.bronzePickaxe, [ItemID.ingotBronze]);
Item.addRepairItemIds(ItemID.bronzeAxe, [ItemID.ingotBronze]);
Item.addRepairItemIds(ItemID.bronzeHoe, [ItemID.ingotBronze]);
Recipes.addShaped({ id: ItemID.bronzeSword, count: 1, data: 0 }, [
    "a",
    "a",
    "b"
], ['a', ItemID.ingotBronze, 0, 'b', 280, 0]);
Recipes.addShaped({ id: ItemID.bronzeShovel, count: 1, data: 0 }, [
    "a",
    "b",
    "b"
], ['a', ItemID.ingotBronze, 0, 'b', 280, 0]);
Recipes.addShaped({ id: ItemID.bronzePickaxe, count: 1, data: 0 }, [
    "aaa",
    " b ",
    " b "
], ['a', ItemID.ingotBronze, 0, 'b', 280, 0]);
Recipes.addShaped({ id: ItemID.bronzeAxe, count: 1, data: 0 }, [
    "aa",
    "ab",
    " b"
], ['a', ItemID.ingotBronze, 0, 'b', 280, 0]);
Recipes.addShaped({ id: ItemID.bronzeHoe, count: 1, data: 0 }, [
    "aa",
    " b",
    " b"
], ['a', ItemID.ingotBronze, 0, 'b', 280, 0]);
IDRegistry.genItemID("wrenchBronze");
Item.createItem("wrenchBronze", "Wrench", { name: "bronze_wrench", meta: 0 }, { stack: 1 });
Item.setMaxDamage(ItemID.wrenchBronze, 161);
IDRegistry.genItemID("electricWrench");
Item.createItem("electricWrench", "Electric Wrench", { name: "electric_wrench", meta: 0 }, { stack: 1, isTech: true });
ChargeItemRegistry.registerExtraItem(ItemID.electricWrench, "Eu", 10000, 100, 1, "tool", true, true);
Item.registerNameOverrideFunction(ItemID.electricWrench, ItemName.showItemStorage);
Recipes.addShaped({ id: ItemID.wrenchBronze, count: 1, data: 0 }, [
    "a a",
    "aaa",
    " a "
], ['a', ItemID.ingotBronze, 0]);
Recipes.addShapeless({ id: ItemID.electricWrench, count: 1, data: 27 }, [
    { id: ItemID.wrenchBronze, data: 0 }, { id: ItemID.powerUnitSmall, data: 0 }
]);
ICTool.registerWrench(ItemID.wrenchBronze, 0.8);
ICTool.registerWrench(ItemID.electricWrench, 1, 100);
IDRegistry.genItemID("electricHoe");
Item.createItem("electricHoe", "Electric Hoe", { name: "electric_hoe", meta: 0 }, { stack: 1, isTech: true });
ChargeItemRegistry.registerExtraItem(ItemID.electricHoe, "Eu", 10000, 100, 1, "tool", true, true);
Item.setToolRender(ItemID.electricHoe, true);
Item.registerNameOverrideFunction(ItemID.electricHoe, ItemName.showItemStorage);
IDRegistry.genItemID("electricTreetap");
Item.createItem("electricTreetap", "Electric Treetap", { name: "electric_treetap", meta: 0 }, { stack: 1, isTech: true });
ChargeItemRegistry.registerExtraItem(ItemID.electricTreetap, "Eu", 10000, 100, 1, "tool", true, true);
Item.registerNameOverrideFunction(ItemID.electricTreetap, ItemName.showItemStorage);
Recipes.addShaped({ id: ItemID.electricHoe, count: 1, data: 27 }, [
    "pp",
    " p",
    " x"
], ['x', ItemID.powerUnitSmall, 0, 'p', ItemID.plateIron, 0]);
Recipes.addShapeless({ id: ItemID.electricTreetap, count: 1, data: 27 }, [
    { id: ItemID.powerUnitSmall, data: 0 }, { id: ItemID.treetap, data: 0 }
]);
ICTool.registerElectricHoe("electricHoe");
ICTool.registerElectricTreetap("electricTreetap");
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
        for (var i_32 = 9; i_32 < 45; i_32++) {
            var slot = Player.getInventorySlot(i_32);
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
                Player.setInventorySlot(i_32, slot.id, slot.count, 0);
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
        if (ConfigIC.soundEnabled && ChargeItemRegistry.getEnergyStored(item) >= this.toolMaterial.energyPerUse) {
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
IDRegistry.genItemID("chainsaw");
Item.createItem("chainsaw", "Chainsaw", { name: "chainsaw", meta: 0 }, { stack: 1, isTech: true });
ChargeItemRegistry.registerExtraItem(ItemID.chainsaw, "Eu", 30000, 100, 1, "tool", true, true);
Item.registerNameOverrideFunction(ItemID.chainsaw, ItemName.showItemStorage);
Recipes.addShaped({ id: ItemID.chainsaw, count: 1, data: 27 }, [
    " pp",
    "ppp",
    "xp "
], ['x', ItemID.powerUnit, 0, 'p', ItemID.plateIron, 0]);
ToolAPI.addBlockMaterial("wool", 1.5);
ToolAPI.registerBlockMaterial(35, "wool");
ToolType.chainsaw = {
    damage: 4,
    toolDamage: 0,
    blockTypes: ["wood", "wool", "fibre", "plant"],
    onDestroy: function (item, coords, block) {
        if (Block.getDestroyTime(block.id) > 0) {
            if (ICTool.dischargeItem(item, this.toolMaterial.energyPerUse) && (block.id == 18 || block.id == 161)) {
                World.destroyBlock(coords.x, coords.y, coords.z);
                World.drop(coords.x + .5, coords.y + .5, coords.z + .5, block.id, 1, block.data % 4);
            }
        }
        return true;
    },
    onBroke: function (item) { return true; },
    onAttack: function (item, mob) {
        var material = this.toolMaterial;
        if (!this.toolDamage)
            this.toolDamage = material.damage;
        if (ICTool.dischargeItem(item, this.toolMaterial.energyPerUse)) {
            material.damage = this.toolDamage;
        }
        else {
            material.damage = 0;
        }
        return true;
    },
    calcDestroyTime: function (item, coords, block, params, destroyTime, enchant) {
        if (ChargeItemRegistry.getEnergyStored(item) >= this.toolMaterial.energyPerUse) {
            return destroyTime;
        }
        else {
            return params.base;
        }
    },
};
ToolLib.setTool(ItemID.chainsaw, { energyPerUse: 100, level: 3, efficiency: 12, damage: 6 }, ToolType.chainsaw);
ICTool.setOnHandSound(ItemID.chainsaw, "ChainsawIdle.ogg", "ChainsawStop.ogg");
IDRegistry.genItemID("nanoSaber");
Item.createItem("nanoSaber", "Nano Saber", { name: "nano_saber", meta: 0 }, { stack: 1, isTech: true });
Item.setToolRender(ItemID.nanoSaber, true);
ChargeItemRegistry.registerExtraItem(ItemID.nanoSaber, "Eu", 1000000, 2048, 3, "tool", true, true);
ItemName.setRarity(ItemID.nanoSaber, 1);
Item.registerNameOverrideFunction(ItemID.nanoSaber, ItemName.showItemStorage);
IDRegistry.genItemID("nanoSaberActive");
Item.createItem("nanoSaberActive", "Nano Saber", { name: "nano_saber_active", meta: 0 }, { stack: 1, isTech: true });
Item.setToolRender(ItemID.nanoSaberActive, true);
ChargeItemRegistry.registerExtraItem(ItemID.nanoSaberActive, "Eu", 1000000, 2048, 3, "tool", true);
ItemName.setRarity(ItemID.nanoSaberActive, 1);
Item.registerNameOverrideFunction(ItemID.nanoSaberActive, ItemName.showItemStorage);
Item.registerIconOverrideFunction(ItemID.nanoSaberActive, function (item, name) {
    return { name: "nano_saber_active", meta: World.getThreadTime() % 2 };
});
Recipes.addShaped({ id: ItemID.nanoSaber, count: 1, data: 27 }, [
    "ca ",
    "ca ",
    "bxb"
], ['x', ItemID.storageCrystal, -1, 'a', ItemID.plateAlloy, 0, 'b', ItemID.carbonPlate, 0, "c", 348, 0], ChargeItemRegistry.transferEnergy);
ToolAPI.registerSword(ItemID.nanoSaber, { level: 0, durability: 27, damage: 4 }, {
    damage: 0,
    onBroke: function (item) {
        return true;
    },
    onAttack: function (item, mob) {
        return true;
    }
});
ToolAPI.registerSword(ItemID.nanoSaberActive, { level: 0, durability: 27, damage: 20 }, {
    damage: 0,
    onBroke: function (item) {
        return true;
    },
    onAttack: function (item, mob) {
        SoundManager.playSound("NanosaberSwing.ogg");
        return true;
    }
});
var NanoSaber = {
    activationTime: 0,
    noTargetUse: function (item) {
        if (ChargeItemRegistry.getEnergyStored(item) >= 64) {
            Player.setCarriedItem(ItemID.nanoSaberActive, 1, item.data, item.extra);
            SoundManager.playSound("NanosaberPowerup.ogg");
            this.activationTime = World.getThreadTime();
        }
    },
    noTargetUseActive: function (item) {
        if (this.activationTime > 0) {
            var energyStored = ChargeItemRegistry.getEnergyStored(item);
            var discharge = World.getThreadTime() - this.activationTime;
            ChargeItemRegistry.setEnergyStored(Math.max(energyStored - discharge * 64, 0));
            this.activationTime = 0;
        }
        Player.setCarriedItem(ItemID.nanoSaber, 1, item.data, item.extra);
    },
    tick: function () {
        if (World.getThreadTime() % 20 == 0) {
            for (var i_33 = 0; i_33 < 36; i_33++) {
                var item = Player.getInventorySlot(i_33);
                if (item.id == ItemID.nanoSaberActive) {
                    var energyStored = ChargeItemRegistry.getEnergyStored(item);
                    if (this.activationTime > 0) {
                        var discharge = World.getThreadTime() - this.activationTime;
                        energyStored = Math.max(energyStored - discharge * 64, 0);
                        this.activationTime = 0;
                    }
                    else {
                        energyStored = Math.max(energyStored - 1280, 0);
                    }
                    if (energyStored < 64) {
                        item.id = ItemID.nanoSaber;
                    }
                    ChargeItemRegistry.setEnergyStored(item, energyStored);
                    Player.setInventorySlot(i_33, item.id, 1, item.data, item.extra);
                }
            }
        }
    }
};
Item.registerNoTargetUseFunction("nanoSaber", function (item) {
    NanoSaber.noTargetUse(item);
});
Item.registerNoTargetUseFunction("nanoSaberActive", function (item) {
    NanoSaber.noTargetUseActive(item);
});
Callback.addCallback("tick", function () {
    NanoSaber.tick();
});
ICTool.setOnHandSound(ItemID.nanoSaberActive, "NanosaberIdle.ogg");
IDRegistry.genItemID("miningLaser");
Item.createItem("miningLaser", "Mining Laser", { name: "mining_laser", meta: 0 }, { stack: 1, isTech: true });
Item.setToolRender(ItemID.miningLaser, true);
ChargeItemRegistry.registerExtraItem(ItemID.miningLaser, "Eu", 1000000, 2048, 3, "tool", true, true);
ItemName.setRarity(ItemID.miningLaser, 1);
Item.registerNameOverrideFunction(ItemID.miningLaser, function (item, name) {
    name = ItemName.showItemStorage(item, name);
    var mode = item.extra ? item.extra.getInt("mode") : 0;
    name += "\n" + MiningLaser.getModeInfo(mode);
    return name;
});
Recipes.addShaped({ id: ItemID.miningLaser, count: 1, data: 27 }, [
    "ccx",
    "aa#",
    " aa"
], ['#', ItemID.circuitAdvanced, 0, 'x', ItemID.storageCrystal, -1, 'a', ItemID.plateAlloy, 0, "c", 331, 0], ChargeItemRegistry.transferEnergy);
UIbuttons.setToolButton(ItemID.miningLaser, "button_switch", true);
UIbuttons.registerSwitchFunction(ItemID.miningLaser, function (item) {
    var extra = item.extra;
    if (!extra) {
        extra = new ItemExtraData();
    }
    var mode = (extra.getInt("mode") + 1) % 7;
    extra.putInt("mode", mode);
    Game.message(MiningLaser.getModeInfo(mode));
    Player.setCarriedItem(item.id, 1, item.data, extra);
});
var MiningLaser = {
    modes: {
        0: { name: "Mining", energy: 1250, power: 6 },
        1: { name: "Low-Focus", energy: 100, range: 4, power: 6, blockBreaks: 1, dropChance: 1, sound: "MiningLaserLowFocus.ogg" },
        2: { name: "Long-Range", energy: 5000, power: 20, sound: "MiningLaserLongRange.ogg" },
        3: { name: "Horizontal", energy: 1250, power: 6 },
        4: { name: "Super-Heat", energy: 2500, power: 8, smelt: true },
        5: { name: "Scatter", energy: 10000, power: 12, blockBreaks: 16, sound: "MiningLaserScatter.ogg" },
        6: { name: "3x3", energy: 10000, power: 6 }
    },
    lasers: [],
    getModeData: function (mode) {
        return this.modes[mode];
    },
    getModeInfo: function (mode) {
        var modeName = this.getModeData(mode).name;
        return Translation.translate("Mode: ") + Translation.translate(modeName);
    },
    shootLaser: function (pos, vel, mode) {
        var ent = Entity.spawn(pos.x + vel.x, pos.y + vel.y, pos.z + vel.z, EntityType.ARROW);
        Entity.setSkin(ent, "models/laser.png");
        Entity.setVelocity(ent, vel.x, vel.y, vel.z);
        //var angle = Entity.getLookAngle(Player.get());
        //Entity.setLookAngle(ent, angle.yaw, angle.pitch);
        this.lasers.push({ ent: ent, start: pos, vel: vel, range: mode.range || 64, power: mode.power, blockBreaks: mode.blockBreaks || 128, smelt: mode.smelt || false, dropChance: mode.dropChance || 0.9, hitblock: false });
    },
    useItem: function (item) {
        var laserSetting = item.extra ? item.extra.getInt("mode") : 0;
        if (laserSetting == 3 || laserSetting == 6)
            return;
        var mode = this.getModeData(laserSetting);
        if (ICTool.useElectricItem(item, mode.energy)) {
            SoundManager.playSound(mode.sound || "MiningLaser.ogg");
            var pos = Player.getPosition();
            var angle = Entity.getLookAngle(Player.get());
            var dir = new Vector3(Entity.getLookVectorByAngle(angle));
            if (laserSetting == 5) {
                var look = dir;
                right = look.copy().cross(Vector3.UP);
                if (right.lengthSquared() < 1e-4) {
                    right.set(Math.sin(angle.yaw), 0.0, -Math.cos(angle.yaw));
                }
                else {
                    right.normalize();
                }
                var up = right.copy().cross(look);
                look.scale(8.0);
                for (var r = -2; r <= 2; r++) {
                    for (var u = -2; u <= 2; u++) {
                        dir = look.copy().addScaled(right, r).addScaled(up, u).normalize();
                        this.shootLaser(pos, dir, mode);
                    }
                }
            }
            else {
                this.shootLaser(pos, dir, mode);
            }
        }
    },
    useItemOnBlock: function (item, coords) {
        var laserSetting = item.extra ? item.extra.getInt("mode") : 0;
        if (laserSetting != 3 && laserSetting != 6) {
            this.useItem(item);
            return;
        }
        var mode = this.getModeData(laserSetting);
        if (ICTool.useElectricItem(item, mode.energy)) {
            SoundManager.playSound(mode.sound || "MiningLaser.ogg");
            var pos = Player.getPosition();
            var angle = Entity.getLookAngle(Player.get());
            var dir = new Vector3(Entity.getLookVectorByAngle(angle));
            if (Math.abs(angle.pitch) < 1 / Math.sqrt(2)) {
                dir.y = 0;
                dir.normalize();
                var start = { x: pos.x, y: coords.y + 0.5, z: pos.z };
                if (laserSetting == 6) {
                    var playerRotation = TileRenderer.getBlockRotation();
                    if (playerRotation <= 1) {
                        for (var y = start.y - 1; y <= start.y + 1; y++) {
                            for (var x = start.x - 1; x <= start.x + 1; x++) {
                                this.shootLaser({ x: x, y: y, z: start.z }, dir, mode);
                            }
                        }
                    }
                    else {
                        for (var y = start.y - 1; y <= start.y + 1; y++) {
                            for (var z = start.z - 1; z <= start.z + 1; z++) {
                                this.shootLaser({ x: start.x, y: y, z: z }, dir, mode);
                            }
                        }
                    }
                }
                else {
                    this.shootLaser(start, dir, mode);
                }
            }
            else if (laserSetting == 6) {
                dir.x = 0.0;
                dir.z = 0.0;
                dir.normalize();
                var start = { x: coords.x + 0.5, y: pos.y, z: coords.z + 0.5 };
                for (var x = start.x - 1; x <= start.x + 1; x++) {
                    for (var z = start.z - 1; z <= start.z + 1; z++) {
                        this.shootLaser({ x: x, y: start.y, z: z }, dir, mode);
                    }
                }
            }
            else {
                Game.message("Mining laser aiming angle too steep");
            }
        }
    },
    destroyBlock: function (laser, x, y, z, block) {
        var hardness = Block.getDestroyTime(block.id);
        laser.power -= hardness / 1.5;
        if (laser.power < 0)
            return;
        if (hardness > 0) {
            laser.blockBreaks--;
        }
        var material = ToolAPI.getBlockMaterialName(block.id);
        if (Math.random() < 0.5 && (material == "wood" || material == "plant" || material == "fibre" || material == "wool")) {
            World.setBlock(x, y, z, 51);
        }
        else {
            World.setBlock(x, y, z, 0);
        }
        var drop = ToolLib.getBlockDrop({ x: x, y: y, z: z }, block.id, block.data, 100);
        if (drop)
            for (var i in drop) {
                var item = drop[i];
                if (laser.smelt && material == "stone") {
                    laser.power = 0;
                    var result = Recipes.getFurnaceRecipeResult(item[0]);
                    if (result) {
                        item[0] = result.id;
                        item[2] = result.data;
                    }
                    World.drop(x + 0.5, y + 0.5, z + 0.5, item[0], item[1], item[2]);
                }
                else if (Math.random() < laser.dropChance) {
                    World.drop(x + 0.5, y + 0.5, z + 0.5, item[0], item[1], item[2]);
                }
            }
    },
    update: function () {
        for (var i in this.lasers) {
            laser = this.lasers[i];
            var distance = Entity.getDistanceBetweenCoords(Entity.getPosition(laser.ent), laser.start);
            if (laser.power <= 0 || laser.blockBreaks <= 0 || distance > laser.range) {
                Entity.remove(laser.ent);
                this.lasers.splice(i, 1);
                i--;
            }
            else {
                if (laser.hitblock) {
                    laser.hitblock = false;
                }
                else {
                    laser.power -= 0.25;
                }
                var vel = laser.vel;
                Entity.setVelocity(laser.ent, vel.x, vel.y, vel.z);
                var c = Entity.getPosition(laser.ent);
                this.checkBlock(laser, Math.floor(c.x), Math.floor(c.y), Math.floor(c.z));
            }
        }
    },
    checkBlock: function (laser, x, y, z) {
        var block = World.getBlock(x, y, z);
        if (ToolAPI.getBlockMaterialName(block.id) == "unbreaking") {
            laser.power = 0;
        }
        else if (block.id > 0 && block.id != 50 && block.id != 51) {
            this.destroyBlock(laser, x, y, z, block);
        }
    },
    projectileHit: function (projectile, target) {
        for (var i in this.lasers) {
            var laser = this.lasers[i];
            if (laser.ent == projectile) {
                if (laser.power <= 0 || laser.blockBreaks <= 0) {
                    Entity.remove(laser.ent);
                    this.lasers.splice(i, 1);
                    break;
                }
                if (target.coords) {
                    Game.prevent();
                    var c = target.coords;
                    var block = World.getBlock(c.x, c.y, c.z);
                    if (block.id != 7 && block.id != 120) {
                        this.destroyBlock(laser, c.x, c.y, c.z, block);
                        laser.hitblock = true;
                        var vel = laser.vel;
                        Entity.setVelocity(laser.ent, vel.x, vel.y, vel.z);
                    }
                    else {
                        Entity.remove(laser.ent);
                        this.lasers.splice(i, 1);
                    }
                }
                else {
                    var damage = laser.power;
                    if (damage > 0) {
                        if (laser.smelt)
                            damage *= 2;
                        Entity.setFire(target.entity, 100, true);
                        Entity.damageEntity(target.entity, damage, 3, { attacker: Player.get() });
                    }
                    Entity.remove(laser.ent);
                    this.lasers.splice(i, 1);
                }
                break;
            }
        }
    }
};
Callback.addCallback("tick", function () {
    MiningLaser.update();
});
Callback.addCallback("ProjectileHit", function (projectile, item, target) {
    MiningLaser.projectileHit(projectile, target);
});
Item.registerUseFunction("miningLaser", function (coords, item, block) {
    MiningLaser.useItemOnBlock(item, coords);
});
Item.registerNoTargetUseFunction("miningLaser", function (item) {
    MiningLaser.useItem(item);
});
IDRegistry.genItemID("agriculturalAnalyzer");
Item.createItem("agriculturalAnalyzer", "Crop Analyzer", { name: "cropnalyzer" }, { stack: 1 });
Recipes.addShaped({ id: ItemID.agriculturalAnalyzer, count: 1, data: 0 }, [
    "xx ",
    "rgr",
    "rcr"
], ['x', ItemID.cableCopper1, 0, 'r', 331, 0, 'g', 20, 0, "c", ItemID.circuitBasic, 0]);
var guiAddConst = 14;
var guiAnalyserObject = {
    location: {
        x: 0,
        y: 0,
        width: 1000,
        height: 1000
    },
    drawing: [
        { type: "background", color: 0 },
        { type: "bitmap", x: 250, y: UI.getScreenHeight() / 10, bitmap: "agricultural_analyser", scale: GUI_SCALE / 2.3 },
    ],
    elements: {
        "closeButton": { type: "button", x: 672, y: 77, bitmap: "close_button_small", scale: GUI_SCALE, clicker: { onClick: function (container) {
                    AgriculturalAnalyser.dropItems(container);
                    AgriculturalAnalyser.hideAllValues(container);
                    container.close();
                } } },
        "textName": { type: "text", font: { size: 18 }, x: 432, y: 86, width: 256, height: 42, text: Translation.translate("Crop Analyzer") },
        "slotSeedIn": { type: "slot", x: 265, y: 75, size: GUI_SCALE * 16, isValid: function (id, count, data) {
                return id == ItemID.cropSeedBag;
            } },
        "slotSeedOut": { type: "slot", x: 360, y: 75, size: GUI_SCALE * 16, isValid: function () { return false; } },
        "slotEnergy": { type: "slot", x: 615, y: 75, size: GUI_SCALE * 16, isValid: MachineRegistry.isValidEUStorage }
    }
};
for (var i = 0; i < 10; i++) {
    guiAnalyserObject.elements["slot" + i] = { type: "invSlot", x: 270 + i * 45, y: 455, size: GUI_SCALE * guiAddConst, index: i };
}
var guiAgriculturalAnalyzer = new UI.Window(guiAnalyserObject);
guiAgriculturalAnalyzer.setInventoryNeeded(true);
var AgriculturalAnalyser = {
    container: null,
    tick: function () {
        var container = AgriculturalAnalyser.container;
        if (!container)
            return;
        var slotIn = container.getSlot("slotSeedIn");
        var slotOut = container.getSlot("slotSeedOut");
        var slotEnergy = container.getSlot("slotEnergy");
        var currentEnergy = ChargeItemRegistry.getEnergyStored(slotEnergy, "Eu");
        if (slotIn.id && !slotOut.id && currentEnergy) {
            var level = slotIn.extra.getInt("scan");
            if (level < 4) {
                var ned = AgriculturalAnalyser.energyForLevel(level);
                if (currentEnergy > ned) {
                    ICTool.dischargeItem(slotEnergy, ned);
                    slotIn.extra.putInt("scan", level + 1);
                }
            }
            slotOut.id = slotIn.id;
            slotOut.count = slotIn.count;
            slotOut.data = slotIn.data;
            slotOut.extra = slotIn.extra;
            slotIn.id = 0;
            AgriculturalAnalyser.showAllValues(container, slotOut);
            container.validateAll();
        }
        else if (!slotOut.id) {
            AgriculturalAnalyser.hideAllValues(container);
        }
    },
    hideAllValues: function (container) {
        var content = container.getGuiContent();
        if (!content)
            return;
        var elements = content.elements;
        elements["cropName"] = null;
        elements["textTier"] = null;
        elements["discoveredBy"] = null;
        elements["discoveredByText"] = null;
        elements["attributes0"] = null;
        elements["attributes1"] = null;
        elements["attributes2"] = null;
        elements["growth"] = null;
        elements["gain"] = null;
        elements["resist"] = null;
        elements["growthText"] = null;
        elements["gainText"] = null;
        elements["resistText"] = null;
    },
    showAllValues: function (container, seedBagSlot) {
        var elements = container.getGuiContent().elements;
        var font = { size: 18, color: Color.WHITE };
        var level = seedBagSlot.extra.getInt("scan");
        var crop = AgricultureAPI.cropCards[seedBagSlot.data];
        switch (level) {
            case 4:
                this.showStats(seedBagSlot, elements);
            case 3:
                this.showAttributes(crop, font, elements);
            case 2:
                this.showTier(crop, font, elements);
                this.showDiscoveredBy(crop, font, elements);
            case 1:
                this.showName(crop, font, elements);
        }
    },
    showStats: function (slot, elements) {
        var growth = slot.extra.getInt("growth");
        var gain = slot.extra.getInt("gain");
        var resist = slot.extra.getInt("resistance");
        var statsXpos = 560;
        elements["growthText"] = { type: "text", font: { size: 18, color: Color.rgb(0, 128, 0) }, x: statsXpos, y: 160, width: 256, height: 42, text: "Growth: " };
        elements["growth"] = { type: "text", font: { size: 18, color: Color.rgb(0, 128, 0) }, x: statsXpos, y: 200, width: 256, height: 42, text: growth.toString() };
        elements["gainText"] = { type: "text", font: { size: 18, color: Color.rgb(255, 255, 0) }, x: statsXpos, y: 240, width: 256, height: 42, text: "Gain: " };
        elements["gain"] = { type: "text", font: { size: 18, color: Color.rgb(255, 255, 0) }, x: statsXpos, y: 280, width: 256, height: 42, text: gain.toString() };
        elements["resistText"] = { type: "text", font: { size: 18, color: Color.rgb(0, 255, 255) }, x: statsXpos, y: 320, width: 256, height: 42, text: "Resistance: " };
        elements["resist"] = { type: "text", font: { size: 18, color: Color.rgb(0, 255, 255) }, x: statsXpos, y: 360, width: 256, height: 42, text: resist.toString() };
    },
    showDiscoveredBy: function (crop, font, elements) {
        var discBy = crop.getDiscoveredBy();
        elements["discoveredByText"] = { type: "text", font: font, x: 270, y: 240, width: 256, height: 42, text: "Discovered by: " };
        elements["discoveredBy"] = { type: "text", font: font, x: 270, y: 280, width: 256, height: 42, text: discBy };
    },
    showTier: function (crop, font, elements) {
        var tier = "Tier: " + AgriculturalAnalyser.getStringTier(crop.properties.tier);
        elements["textTier"] = { type: "text", font: font, x: 270, y: 200, width: 256, height: 42, text: tier };
    },
    showAttributes: function (crop, font, elements) {
        var arr = AgriculturalAnalyser.getAttributesText(crop.attributes);
        for (var i in arr) {
            elements["attributes" + i] = { type: "text", font: font, x: 270, y: 320 + 40 * i, width: 256, height: 42, text: arr[i] };
        }
    },
    showName: function (crop, font, elements) {
        var name = AgriculturalAnalyser.getSeedName(crop.id);
        elements["cropName"] = { type: "text", font: font, x: 270, y: 160, width: 256, height: 42, text: name };
    },
    getStringTier: function (tier) {
        switch (tier) {
            default: {
                return "0";
            }
            case 1: {
                return "I";
            }
            case 2: {
                return "II";
            }
            case 3: {
                return "III";
            }
            case 4: {
                return "IV";
            }
            case 5: {
                return "V";
            }
            case 6: {
                return "VI";
            }
            case 7: {
                return "VII";
            }
            case 8: {
                return "VIII";
            }
            case 9: {
                return "IX";
            }
            case 10: {
                return "X";
            }
            case 11: {
                return "XI";
            }
            case 12: {
                return "XII";
            }
            case 13: {
                return "XIII";
            }
            case 14: {
                return "XIV";
            }
            case 15: {
                return "XV";
            }
            case 16: {
                return "XVI";
            }
        }
    },
    energyForLevel: function (level) {
        switch (level) {
            default: {
                return 10;
            }
            case 1: {
                return 90;
            }
            case 2: {
                return 900;
            }
            case 3: {
                return 9000;
            }
        }
    },
    getSeedName: function (name) {
        return Translation.translate(name);
    },
    getAttributesText: function (attributes) {
        var arr = ["", "", ""];
        for (var i in attributes) {
            var indForPush = Math.floor((i) / 3);
            arr[indForPush] += attributes[i] + ' ';
        }
        return arr;
    },
    dropItems: function (container) {
        var coords = Player.getPosition();
        var slots = ["slotSeedIn", "slotSeedOut", "slotEnergy"];
        for (var i in slots) {
            var slot = container.getSlot(slots[i]);
            nativeDropItem(coords.x, coords.y, coords.z, 0, slot.id, slot.count, slot.data, slot.extra);
            slot.id = 0;
        }
        container.validateAll();
    },
    showCropValues: function (te) {
        switch (te.data.scanLevel) {
            case 4:
                Game.message("Growth: " + te.data.statGrowth);
                Game.message("Gain: " + te.data.statGain);
                Game.message("Resistance: " + te.data.statResistance);
            case 2:
                Game.message("Tier: " + te.crop.properties.tier);
                Game.message("Discovered by: " + te.crop.getDiscoveredBy());
            case 1:
                Game.message(Translation.translate(te.crop.id));
        }
    },
    useFunction: function (coords, item, block) {
        if (block.id == BlockID.crop) {
            var tileEntity = World.getTileEntity(coords.x, coords.y, coords.z);
            if (!tileEntity.crop)
                return;
            AgriculturalAnalyser.showCropValues(tileEntity);
        }
        else {
            AgriculturalAnalyser.noTargetUseFunction(item);
        }
    },
    noTargetUseFunction: function (item) {
        if (!AgriculturalAnalyser.container)
            AgriculturalAnalyser.container = new UI.Container();
        AgriculturalAnalyser.container.openAs(guiAgriculturalAnalyzer);
    }
};
Callback.addCallback("LevelLoaded", function () {
    var content = guiAgriculturalAnalyzer.getContent();
    content.elements.textName.text = Translation.translate("Crop Analyzer");
});
Callback.addCallback("MinecraftActivityStopped", function () {
    if (AgriculturalAnalyser.container && AgriculturalAnalyser.container.isOpened()) {
        AgriculturalAnalyser.container.close();
        AgriculturalAnalyser.container = null;
    }
});
Item.registerUseFunction("agriculturalAnalyzer", AgriculturalAnalyser.useFunction);
Item.registerNoTargetUseFunction("agriculturalAnalyzer", AgriculturalAnalyser.noTargetUseFunction);
Callback.addCallback("tick", AgriculturalAnalyser.tick);
IDRegistry.genItemID("weeding_trowel");
Item.createItem("weeding_trowel", "Weeding Trowel", { name: "weeding_trowel" }, { stack: 1 });
Callback.addCallback("PostLoaded", function () {
    Recipes.addShaped({ id: ItemID.weeding_trowel, count: 1, data: 0 }, [
        "c c",
        " c ",
        "zcz"
    ], ['c', 265, 0, 'z', ItemID.rubber, 0]);
});
Item.registerUseFunction("weeding_trowel", function (coords, item, block) {
    var te = World.getTileEntity(coords.x, coords.y, coords.z);
    if (block.id == BlockID.crop && te.crop && te.crop.id == "weed") {
        World.drop(coords.x, coords.y, coords.z, ItemID.weed, te.data.currentSize, 0);
        te.reset();
        te.updateRender();
    }
});
IDRegistry.genItemID("icPainter");
Item.createItem("icPainter", "Painter", { name: "ic_painter", meta: 0 }, { stack: 1 });
var painterCreativeGroup = [ItemID.icPainter];
var colorNames = ["Black", "Red", "Green", "Brown", "Blue", "Purple", "Cyan", "Light Grey", "Dark Grey", "Pink", "Lime", "Yellow", "Light Blue", "Magenta", "Orange", "White"];
for (var i_34 = 1; i_34 <= 16; i_34++) {
    IDRegistry.genItemID("icPainter" + i_34);
    Item.createItem("icPainter" + i_34, colorNames[i_34 - 1] + " Painter", { name: "ic_painter", meta: i_34 }, { stack: 1 });
    Item.setMaxDamage(ItemID["icPainter" + i_34], 16);
    painterCreativeGroup.push(ItemID["icPainter" + i_34]);
}
Item.addCreativeGroup("ic2_painter", Translation.translate("Painters"), painterCreativeGroup);
Recipes.addShaped({ id: ItemID.icPainter, count: 1, data: 0 }, [
    " aa",
    " xa",
    "x  "
], ['x', 265, -1, 'a', 35, 0]);
Recipes.addShapeless({ id: ItemID.icPainter1, count: 1, data: 0 }, [{ id: ItemID.icPainter, data: 0 }, { id: 351, data: 16 }]);
Recipes.addShapeless({ id: ItemID.icPainter2, count: 1, data: 0 }, [{ id: ItemID.icPainter, data: 0 }, { id: 351, data: 1 }]);
Recipes.addShapeless({ id: ItemID.icPainter3, count: 1, data: 0 }, [{ id: ItemID.icPainter, data: 0 }, { id: 351, data: 2 }]);
Recipes.addShapeless({ id: ItemID.icPainter4, count: 1, data: 0 }, [{ id: ItemID.icPainter, data: 0 }, { id: 351, data: 17 }]);
Recipes.addShapeless({ id: ItemID.icPainter5, count: 1, data: 0 }, [{ id: ItemID.icPainter, data: 0 }, { id: 351, data: 18 }]);
for (var i_35 = 6; i_35 <= 15; i_35++) {
    Recipes.addShapeless({ id: ItemID["icPainter" + i_35], count: 1, data: 0 }, [{ id: ItemID.icPainter, data: 0 }, { id: 351, data: i_35 - 1 }]);
}
Recipes.addShapeless({ id: ItemID.icPainter16, count: 1, data: 0 }, [{ id: ItemID.icPainter, data: 0 }, { id: 351, data: 19 }]);
var _loop_2 = function (i_36) {
    var index = i_36 - 1;
    Item.registerUseFunction("icPainter" + i_36, function (pos, item, block) {
        if (CableRegistry.canBePainted(block.id) && block.data != index) {
            World.setBlock(pos.x, pos.y, pos.z, 0, 0);
            World.setBlock(pos.x, pos.y, pos.z, block.id, index);
            var net = EnergyNetBuilder.getNetOnCoords(pos.x, pos.y, pos.z);
            if (net) {
                EnergyNetBuilder.removeNet(net);
                EnergyNetBuilder.rebuildForWire(pos.x, pos.y, pos.z, block.id);
            }
            if (Game.isItemSpendingAllowed()) {
                item.data++;
                if (item.data >= Item.getMaxDamage(item.id))
                    item.id = ItemID.icPainter;
                Player.setCarriedItem(item.id, 1, item.data);
            }
            SoundManager.playSoundAt(coords.x + .5, coords.y + .5, coords.z + .5, "Painters.ogg");
        }
    });
};
for (var i_36 = 1; i_36 <= 16; i_36++) {
    _loop_2(i_36);
}
ModAPI.addAPICallback("RecipeViewer", function (api) {
    var RecipeViewer = api.Core;
    var Bitmap = android.graphics.Bitmap;
    var Canvas = android.graphics.Canvas;
    var Rect = android.graphics.Rect;
    var bmp, cvs, source;
    var x = y = 0;
    RecipeViewer.registerRecipeType("icpe_macerator", {
        contents: {
            icon: BlockID.macerator,
            drawing: [
                { type: "bitmap", x: 430, y: 200, scale: 6, bitmap: "macerator_bar_scale" }
            ],
            elements: {
                input0: { type: "slot", x: 280, y: 190, size: 120 },
                output0: { type: "slot", x: 600, y: 190, size: 120 }
            }
        },
        getList: function (id, data, isUsage) {
            var result;
            if (isUsage) {
                result = MachineRecipeRegistry.getRecipeResult("macerator", id, data);
                return result ? [{
                        input: [{ id: id, count: 1, data: data }],
                        output: [result]
                    }] : [];
            }
            var list = [];
            var recipe = MachineRecipeRegistry.requireRecipesFor("macerator");
            var item;
            for (var key in recipe) {
                result = recipe[key];
                if (result.id == id && (result.data == data || data == -1)) {
                    item = key.split(":");
                    list.push({
                        input: [{ id: parseInt(item[0]), count: result.sourceCount || 1, data: parseInt(item[1] || 0) }],
                        output: [result]
                    });
                }
            }
            return list;
        }
    });
    RecipeViewer.registerRecipeType("icpe_compressor", {
        contents: {
            icon: BlockID.compressor,
            drawing: [
                { type: "bitmap", x: 430, y: 200, scale: 6, bitmap: "compressor_bar_scale" }
            ],
            elements: {
                input0: { type: "slot", x: 280, y: 190, size: 120 },
                output0: { type: "slot", x: 600, y: 190, size: 120 }
            }
        },
        getList: function (id, data, isUsage) {
            var result;
            if (isUsage) {
                result = MachineRecipeRegistry.getRecipeResult("compressor", id, data);
                return result ? [{
                        input: [{ id: id, count: result.sourceCount || 1, data: data }],
                        output: [{ id: result.id, count: result.count, data: result.data }]
                    }] : [];
            }
            var list = [];
            var recipe = MachineRecipeRegistry.requireRecipesFor("compressor");
            var item;
            for (var key in recipe) {
                result = recipe[key];
                if (result.id == id && (result.data == data || data == -1)) {
                    item = key.split(":");
                    list.push({
                        input: [{ id: parseInt(item[0]), count: result.sourceCount || 1, data: parseInt(item[1] || 0) }],
                        output: [{ id: result.id, count: result.count, data: result.data }]
                    });
                }
            }
            return list;
        }
    });
    RecipeViewer.registerRecipeType("icpe_extractor", {
        contents: {
            icon: BlockID.extractor,
            drawing: [
                { type: "bitmap", x: 430, y: 200, scale: 6, bitmap: "extractor_bar_scale" }
            ],
            elements: {
                input0: { type: "slot", x: 280, y: 190, size: 120 },
                output0: { type: "slot", x: 600, y: 190, size: 120 }
            }
        },
        getList: function (id, data, isUsage) {
            var result;
            if (isUsage) {
                result = MachineRecipeRegistry.getRecipeResult("extractor", id);
                return result ? [{
                        input: [{ id: id, count: 1, data: data }],
                        output: [{ id: result.id, count: result.count, data: 0 }]
                    }] : [];
            }
            var list = [];
            var recipe = MachineRecipeRegistry.requireRecipesFor("extractor");
            for (var key in recipe) {
                result = recipe[key];
                if (result.id == id) {
                    list.push({
                        input: [{ id: parseInt(key), count: 1, data: 0 }],
                        output: [{ id: result.id, count: result.count, data: 0 }]
                    });
                }
            }
            return list;
        }
    });
    RecipeViewer.registerRecipeType("icpe_solid_canner", {
        contents: {
            icon: BlockID.solidCanner,
            drawing: [
                { type: "bitmap", x: 325, y: 205, scale: 6, bitmap: "solid_canner_arrow" },
                { type: "bitmap", x: 520, y: 205, scale: 6, bitmap: "arrow_bar_scale" }
            ],
            elements: {
                input0: { type: "slot", x: 200, y: 190, size: 120 },
                input1: { type: "slot", x: 390, y: 190, size: 120 },
                output0: { type: "slot", x: 660, y: 190, size: 120 }
            }
        },
        getList: function (id, data, isUsage) {
            var list = [];
            var recipe = MachineRecipeRegistry.requireRecipesFor("solidCanner");
            var result;
            if (isUsage) {
                result = MachineRecipeRegistry.getRecipeResult("solidCanner", id);
                if (result) {
                    return [{
                            input: [{ id: id, count: 1, data: 0 }, { id: result.storage[0], count: result.storage[1], data: 0 }],
                            output: [{ id: result.result[0], count: result.result[1], data: result.result[2] }]
                        }];
                }
                for (var key in recipe) {
                    result = recipe[key];
                    if (result.storage[0] == id) {
                        list.push({
                            input: [{ id: parseInt(key), count: 1, data: 0 }, { id: result.storage[0], count: result.storage[1], data: 0 }],
                            output: [{ id: result.result[0], count: result.result[1], data: result.result[2] }]
                        });
                    }
                }
                return list;
            }
            for (var key in recipe) {
                result = recipe[key];
                if (result.result[0] == id) {
                    list.push({
                        input: [{ id: parseInt(key), count: 1, data: 0 }, { id: result.storage[0], count: result.storage[1], data: 0 }],
                        output: [{ id: result.result[0], count: result.result[1], data: result.result[2] }]
                    });
                }
            }
            return list;
        }
    });
    RecipeViewer.registerRecipeType("icpe_canner", {
        contents: {
            icon: BlockID.canner,
            drawing: [
                { type: "bitmap", x: 200, y: 50, bitmap: "canner_background_recipe", scale: 6 },
                { type: "bitmap", x: 194, y: 216, bitmap: "liquid_bar", scale: 6 },
                { type: "bitmap", x: 662, y: 216, bitmap: "liquid_bar", scale: 6 }
            ],
            elements: {
                input0: { type: "slot", x: 200, y: 50, size: 108, bitmap: "default_slot" },
                input1: { type: "slot", x: 434, y: 212, size: 108, bitmap: "canner_slot_source_0" },
                output0: { type: "slot", x: 668, y: 50, size: 108, bitmap: "default_slot" }
            }
        },
        getList: function (id, data, isUsage) {
            var list = [];
            var recipe = MachineRecipeRegistry.requireRecipesFor("solidCanner");
            var result;
            if (isUsage) {
                result = MachineRecipeRegistry.getRecipeResult("solidCanner", id);
                if (result) {
                    return [{
                            input: [{ id: id, count: 1, data: 0 }, { id: result.storage[0], count: result.storage[1], data: 0 }],
                            output: [{ id: result.result[0], count: result.result[1], data: result.result[2] }]
                        }];
                }
                for (var key in recipe) {
                    result = recipe[key];
                    if (result.storage[0] == id) {
                        list.push({
                            input: [{ id: parseInt(key), count: 1, data: 0 }, { id: result.storage[0], count: result.storage[1], data: 0 }],
                            output: [{ id: result.result[0], count: result.result[1], data: result.result[2] }]
                        });
                    }
                }
                return list;
            }
            for (var key in recipe) {
                result = recipe[key];
                if (result.result[0] == id) {
                    list.push({
                        input: [{ id: parseInt(key), count: 1, data: 0 }, { id: result.storage[0], count: result.storage[1], data: 0 }],
                        output: [{ id: result.result[0], count: result.result[1], data: result.result[2] }]
                    });
                }
            }
            return list;
        }
    });
    var iconMetalFormer = [ItemID.craftingHammer, ItemID.cutter, ItemID.cableCopper0];
    RecipeViewer.registerRecipeType("icpe_metal_former", {
        contents: {
            icon: BlockID.metalFormer,
            drawing: [
                { type: "bitmap", x: 360, y: 220, scale: 6, bitmap: "metalformer_bar_scale" },
                { type: "bitmap", x: 450, y: 320, scale: 6, bitmap: "empty_button_up" }
            ],
            elements: {
                slotMode: { type: "slot", x: 445, y: 320, z: 1, size: 112, visual: true, needClean: true, bitmap: "_default_slot_empty", source: { id: 0, count: 0, data: 0 } },
                input0: { type: "slot", x: 220, y: 190, size: 120 },
                output0: { type: "slot", x: 660, y: 190, size: 120 }
            }
        },
        getList: function (id, data, isUsage) {
            var list = [];
            var result;
            if (isUsage) {
                for (var mode = 0; mode < 3; mode++) {
                    result = MachineRecipeRegistry.getRecipeResult("metalFormer" + mode, id);
                    if (result) {
                        list.push({
                            input: [{ id: id, count: 1, data: data }],
                            output: [{ id: result.id, count: result.count, data: 0 }],
                            mode: mode
                        });
                    }
                }
                return list;
            }
            for (var mode = 0; mode < 3; mode++) {
                var recipe = MachineRecipeRegistry.requireRecipesFor("metalFormer" + mode);
                for (var key in recipe) {
                    result = recipe[key];
                    if (result.id == id) {
                        list.push({
                            input: [{ id: parseInt(key), count: 1, data: 0 }],
                            output: [{ id: result.id, count: result.count, data: 0 }],
                            mode: mode
                        });
                    }
                }
            }
            return list;
        },
        onOpen: function (elements, data) {
            if (!data) {
                return;
            }
            var elem = elements.get("slotMode");
            elem.onBindingUpdated("source", { id: iconMetalFormer[data.mode], count: 1, data: 0 });
        }
    });
    bmp = new Bitmap.createBitmap(63, 55, Bitmap.Config.ARGB_8888);
    cvs = new Canvas(bmp);
    source = UI.TextureSource.get("ore_washer_background");
    cvs.drawBitmap(source, new Rect(56, 17, 80, 72), new Rect(0, 0, 24, 55), null);
    cvs.drawBitmap(source, new Rect(80, 34, 119, 55), new Rect(24, 17, 63, 38), null);
    cvs.drawBitmap(UI.TextureSource.get("gui_water_scale"), 4, 4, null);
    cvs.drawBitmap(UI.TextureSource.get("ore_washer_bar_scale"), 42, 18, null);
    UI.TextureSource.put("ore_washer_background_edit", bmp);
    RecipeViewer.registerRecipeType("icpe_ore_washer", {
        contents: {
            icon: BlockID.oreWasher,
            drawing: [
                { type: "bitmap", x: 300, y: 110, scale: 5, bitmap: "ore_washer_background_edit" }
            ],
            elements: {
                input0: { type: "slot", x: 515, y: 90, size: 90 },
                output0: { type: "slot", x: 425, y: 315, size: 90 },
                output1: { type: "slot", x: 515, y: 315, size: 90 },
                output2: { type: "slot", x: 605, y: 315, size: 90 }
            }
        },
        getList: function (id, data, isUsage) {
            var result;
            if (isUsage) {
                result = MachineRecipeRegistry.getRecipeResult("oreWasher", id);
                return result ? [{
                        input: [{ id: id, count: 1, data: data }],
                        output: [
                            { id: result[0] || 0, count: result[1] || 0, data: 0 },
                            { id: result[2] || 0, count: result[3] || 0, data: 0 },
                            { id: result[4] || 0, count: result[5] || 0, data: 0 }
                        ]
                    }] : [];
            }
            var list = [];
            var recipe = MachineRecipeRegistry.requireRecipesFor("oreWasher");
            for (var key in recipe) {
                result = recipe[key];
                if (result[0] == id || result[2] == id || result[4] == id) {
                    list.push({
                        input: [{ id: parseInt(key), count: 1, data: 0 }],
                        output: [
                            { id: result[0] || 0, count: result[1] || 0, data: 0 },
                            { id: result[2] || 0, count: result[3] || 0, data: 0 },
                            { id: result[4] || 0, count: result[5] || 0, data: 0 }
                        ]
                    });
                }
            }
            return list;
        }
    });
    bmp = Bitmap.createBitmap(80, 60, Bitmap.Config.ARGB_8888);
    cvs = new Canvas(bmp);
    cvs.drawBitmap(UI.TextureSource.get("thermal_centrifuge_background"), 0, 0, null);
    cvs.drawBitmap(UI.TextureSource.get("thermal_centrifuge_scale"), 44, 7, null);
    cvs.drawBitmap(UI.TextureSource.get("heat_scale"), 28, 48, null);
    cvs.drawBitmap(UI.TextureSource.get("indicator_green"), 52, 44, null);
    UI.TextureSource.put("thermal_centrifuge_background_edit", bmp);
    RecipeViewer.registerRecipeType("icpe_thermal_centrifuge", {
        contents: {
            icon: BlockID.thermalCentrifuge,
            drawing: [
                { type: "bitmap", x: 300, y: 100, scale: 5, bitmap: "thermal_centrifuge_background_edit" }
            ],
            elements: {
                input0: { type: "slot", x: 200, y: 110, size: 90 },
                output0: { type: "slot", x: 710, y: 110, size: 90 },
                output1: { type: "slot", x: 710, y: 200, size: 90 },
                output2: { type: "slot", x: 710, y: 290, size: 90 },
                textHeat: { type: "text", x: 430, y: 410 }
            }
        },
        getList: function (id, data, isUsage) {
            var result;
            if (isUsage) {
                result = MachineRecipeRegistry.getRecipeResult("thermalCentrifuge", id);
                return result ? [{
                        input: [{ id: id, count: 1, data: data }],
                        output: [
                            { id: result.result[0] || 0, count: result.result[1] || 0, data: 0 },
                            { id: result.result[2] || 0, count: result.result[3] || 0, data: 0 },
                            { id: result.result[4] || 0, count: result.result[5] || 0, data: 0 }
                        ],
                        heat: result.heat
                    }] : [];
            }
            var list = [];
            var recipe = MachineRecipeRegistry.requireRecipesFor("thermalCentrifuge");
            for (var key in recipe) {
                result = recipe[key];
                if (result.result[0] == id || result.result[2] == id || result.result[4] == id) {
                    list.push({
                        input: [{ id: parseInt(key), count: 1, data: 0 }],
                        output: [
                            { id: result.result[0] || 0, count: result.result[1] || 0, data: 0 },
                            { id: result.result[2] || 0, count: result.result[3] || 0, data: 0 },
                            { id: result.result[4] || 0, count: result.result[5] || 0, data: 0 }
                        ],
                        heat: result.heat
                    });
                }
            }
            return list;
        },
        onOpen: function (elements, data) {
            var elem = elements.get("textHeat");
            elem.onBindingUpdated("text", data ? Translation.translate("Heat: ") + data.heat : "");
        }
    });
    bmp = Bitmap.createBitmap(104, 64, Bitmap.Config.ARGB_8888);
    cvs = new Canvas(bmp);
    cvs.drawBitmap(UI.TextureSource.get("blast_furnace_background"), 0, -11, null);
    cvs.drawBitmap(UI.TextureSource.get("blast_furnace_scale"), 50, 16, null);
    cvs.drawBitmap(UI.TextureSource.get("heat_scale"), 46, 52, null);
    cvs.drawBitmap(UI.TextureSource.get("indicator_green"), 70, 48, null);
    UI.TextureSource.put("blast_furnace_background_edit", bmp);
    RecipeViewer.registerRecipeType("icpe_blast_furnace", {
        contents: {
            icon: BlockID.blastFurnace,
            drawing: [
                { type: "bitmap", x: 200, y: 100, scale: 5, bitmap: "blast_furnace_background_edit" }
            ],
            elements: {
                input0: { type: "slot", x: 240, y: 160, size: 90 },
                input1: { type: "slot", x: 200, y: 284, size: 90, bitmap: "_default_slot_empty" },
                output0: { type: "slot", x: 730, y: 284, size: 90 },
                output1: { type: "slot", x: 820, y: 284, size: 90 }
            }
        },
        getList: function (id, data, isUsage) {
            var list = [];
            var result, recipe;
            if (isUsage) {
                result = MachineRecipeRegistry.getRecipeResult("blastFurnace", id);
                if (result) {
                    return [{
                            input: [
                                { id: id, count: 1, data: 0 },
                                { id: ItemID.cellAir, count: 1, data: 0 },
                            ],
                            output: [
                                { id: result.result[0], count: result.result[1], data: 0 },
                                { id: result.result[2] || 0, count: result.result[3] || 0, data: 0 }
                            ]
                        }];
                }
                if (id == ItemID.cellAir) {
                    recipe = MachineRecipeRegistry.requireRecipesFor("blastFurnace");
                    for (var key in recipe) {
                        result = recipe[key];
                        list.push({
                            input: [
                                { id: parseInt(key), count: 1, data: 0 },
                                { id: ItemID.cellAir, count: 1, data: 0 },
                            ],
                            output: [
                                { id: result.result[0], count: result.result[1], data: 0 },
                                { id: result.result[2] || 0, count: result.result[3] || 0, data: 0 }
                            ]
                        });
                    }
                    return list;
                }
                return [];
            }
            recipe = MachineRecipeRegistry.requireRecipesFor("blastFurnace");
            for (var key in recipe) {
                result = recipe[key];
                if (result.result[0] == id || result.result[2] == id) {
                    list.push({
                        input: [
                            { id: parseInt(key), count: 1, data: 0 },
                            { id: ItemID.cellAir, count: 1, data: 0 },
                        ],
                        output: [
                            { id: result.result[0], count: result.result[1], data: 0 },
                            { id: result.result[2] || 0, count: result.result[3] || 0, data: 0 }
                        ]
                    });
                }
            }
            return list;
        }
    });
});
ModAPI.addAPICallback("TreeCapitator", function (api) {
    api.registerTree([[BlockID.rubberTreeLog, -1], [BlockID.rubberTreeLogLatex, -1]], [BlockID.rubberTreeLeaves, -1]);
});
ModAPI.registerAPI("ICore", {
    Machine: MachineRegistry,
    Recipe: MachineRecipeRegistry,
    ChargeRegistry: ChargeItemRegistry,
    Cable: CableRegistry,
    Upgrade: UpgradeAPI,
    Reactor: ReactorAPI,
    Radiation: RadiationAPI,
    Tool: ICTool,
    Sound: SoundManager,
    Agriculture: AgricultureAPI,
    ItemName: ItemName,
    UI: UIbuttons,
    Utils: Utils,
    ConfigIC: ConfigIC,
    Ore: OreGenerator,
    Integration: IntegrationAPI,
    registerEnergyPack: function () { },
    requireGlobal: function (command) {
        return eval(command);
    }
});
Logger.Log("Industrial Core API shared with name ICore.", "API");
