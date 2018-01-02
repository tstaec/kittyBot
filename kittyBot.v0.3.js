//##############################################################################
//# kittyBot, by LoyLT, version 0.3, very incomplete, not ready for public use #
//#============================================================================#
//#              JavaScript add-on for bloodrizer's Kittens Game               #
//##############################################################################

var kb_sciNames = [
         'calendar',    'agriculture',         'archery',              'mining',          'metal',
           'animal',        'brewery',           'civil',                'math',   'construction',
      'engineering',       'currency',         'writing',          'philosophy',      'machinery',
            'steel',       'theology',       'astronomy',          'navigation',   'architecture',
          'physics',    'metaphysics',       'chemistry',           'acoustics',          'drama',
       'archeology',    'electricity',         'biology',        'biochemistry',       'genetics',
'industrialization',  'mechanization',       'metalurgy',          'combustion',        'ecology',
      'electronics',       'robotics',              'ai', 'quantumCryptography', 'nuclearFission',
         'rocketry',  'oilProcessing',      'sattelites',  'orbitalEngineering',        'thorium',
       'exogeology',  'advExogeology',  'nanotechnology',     'superconductors',     'antimatter',
   'terraformation',    'hydroponics', 'particlePhysics',  'dimensionalPhysics',  'chronophysics',
    'tachyonTheory', 'cryptotheology',       'voidSpace',  'paradoxalKnowledge'
];

var kb_sciLabels = [
         'Calendar',         'Agriculture',                 'Archery',               'Mining',    'Metal Working',
 'Animal Husbandry',   'Catnip Processing',           'Civil Service',          'Mathematics',     'Construction',
      'Engineering',            'Currency',                 'Writing',           'Philosophy',        'Machinery',
            'Steel',            'Theology',               'Astronomy',           'Navigation',     'Architecture',
          'Physics',         'Metaphysics',               'Chemistry',            'Acoustics', 'Drama and Poetry',
          'Geology',         'Electricity',                 'Biology',         'Biochemistry',         'Genetics',
'Industrialization',       'Mechanization',              'Metallurgy',           'Combustion',          'Ecology',
      'Electronics',            'Robotics', 'Artificial Intelligence', 'Quantum Cryptography',  'Nuclear Fission',
         'Rocketry',      'Oil Processing',              'Satellites',  'Orbital Engineering',          'Thorium',
       'Exogeology', 'Advanced Exogeology',          'Nanotechnology',      'Superconductors',       'Antimatter',
   'Terraformation',         'Hydroponics',        'Particle Physics',  'Dimensional Physics',    'Chronophysics',
   'Tachyon Theory',      'Cryptotheology',              'Void Space',  'Paradoxal Knowledge'
];

var kb_bldNames = [
         'field',  'pasture',     'aqueduct',        'hut',  'logHouse',     'mansion',
       'library',  'academy',  'observatory',     'biolab',      'barn',   'warehouse',
        'harbor',     'mine',       'quarry', 'lumberMill',   'oilWell', 'accelerator',     
    'steamworks',  'magneto',      'smelter',   'calciner',   'factory',     'reactor',
  'amphitheatre',   'chapel',       'temple',   'workshop', 'tradepost',        'mint',
'unicornPasture', 'ziggurat', 'chronosphere',     'aiCore'
];

var kb_bldLabels = [
   'Catnip Field',  'Pasture',     'Aqueduct',         'Hut', 'Log House',     'Mansion',
        'Library',  'Academy',  'Observatory',     'Bio Lab',      'Barn',   'Warehouse',
         'Harbor',     'Mine',       'Quarry', 'Lumber Mill',  'Oil Well', 'Accelerator',
     'Steamworks',  'Magneto',      'Smelter',    'Calciner',   'Factory',     'Reactor',
   'Amphitheatre',   'Chapel',       'Temple',    'Workshop', 'Tradepost',        'Mint', 
'Unicorn Pasture', 'Ziggurat', 'Chronosphere',     'AI Core'
]

var kb_buyBlds = [
         kb_buy_field,  kb_buy_pasture,     kb_buy_aqueduct,        kb_buy_hut,  kb_buy_logHouse,     kb_buy_mansion,
       kb_buy_library,  kb_buy_academy,  kb_buy_observatory,     kb_buy_biolab,      kb_buy_barn,   kb_buy_warehouse,
        kb_buy_harbor,     kb_buy_mine,       kb_buy_quarry, kb_buy_lumberMill,   kb_buy_oilWell, kb_buy_accelerator,
    kb_buy_steamworks,  kb_buy_magneto,      kb_buy_smelter,   kb_buy_calciner,   kb_buy_factory,     kb_buy_reactor,
  kb_buy_amphitheatre,   kb_buy_chapel,       kb_buy_temple,   kb_buy_workshop, kb_buy_tradepost,        kb_buy_mint,
kb_buy_unicornPasture, kb_buy_ziggurat, kb_buy_chronosphere,     kb_buy_aiCore
]

var kb_rCatnip      = gamePage.resPool.get('catnip');
var kb_rWood        = gamePage.resPool.get('wood');
var kb_rMinerals    = gamePage.resPool.get('minerals');
var kb_rIron        = gamePage.resPool.get('iron');
var kb_rTitanium    = gamePage.resPool.get('titanium');
var kb_rGold        = gamePage.resPool.get('gold');
var kb_rOil         = gamePage.resPool.get('oil');
var kb_rUranium     = gamePage.resPool.get('uranium');
var kb_rUnobtainium = gamePage.resPool.get('unobtainium');
var kb_rCatpower    = gamePage.resPool.get('manpower');
var kb_rScience     = gamePage.resPool.get('science');
var kb_rCulture     = gamePage.resPool.get('culture');
var kb_rFaith       = gamePage.resPool.get('faith');
var kb_rAntimatter  = gamePage.resPool.get('antimatter');
var kb_rSorrow      = gamePage.resPool.get('sorrow');

var kb_rCoal        = gamePage.resPool.get('coal');       // coal isn't used for buying so always turn it to steel

var kb_rBeam        = gamePage.resPool.get('beam');       // craft level 1
var kb_rSlab        = gamePage.resPool.get('slab');       // craft level 1
var kb_rPlate       = gamePage.resPool.get('plate');      // craft level 1
var kb_rSteel       = gamePage.resPool.get('steel');      // craft level 1

var kb_rConcrete    = gamePage.resPool.get('concrate');   // craft level 2
var kb_rGear        = gamePage.resPool.get('gear');       // craft level 2
var kb_rAlloy       = gamePage.resPool.get('alloy');      // craft level 2

var kb_rEludium     = gamePage.resPool.get('eludium');    // craft level 3

var kb_rScaffold    = gamePage.resPool.get('scaffold');   // craft level 2

var kb_rShip        = gamePage.resPool.get('ship');       // craft level 3

var kb_rTanker      = gamePage.resPool.get('tanker');     // craft level 4

var kb_rKerosene    = gamePage.resPool.get('kerosene');   // craft level 1

var kb_rParchment   = gamePage.resPool.get('parchment');  // craft level 1
var kb_rManuscript  = gamePage.resPool.get('manuscript'); // craft level 2
var kb_rCompendium  = gamePage.resPool.get('compedium');  // craft level 3
var kb_rBlueprint   = gamePage.resPool.get('blueprint');  // craft level 4

var kb_rThorium     = gamePage.resPool.get('thorium');    // craft level 1

var kb_rMegalith    = gamePage.resPool.get('megalith');   // craft level 3

var kb_rStarchart   = gamePage.resPool.get('starchart');
var kb_rUnicorns    = gamePage.resPool.get('unicorns');
var kb_rAlicorn     = gamePage.resPool.get('alicorn');
var kb_rTears       = gamePage.resPool.get('tears');
var kb_rTimeCrystal = gamePage.resPool.get('timeCrystal');
var kb_rRelic       = gamePage.resPool.get('relic');
var kb_rVoid        = gamePage.resPool.get('void');

//########################################################################

function kb_buyNonStageBld(bldg, rp) {
    var ratiomod = gamePage.globalEffectsCached.priceRatio;
    if (bldg.name == 'hut') { ratiomod += gamePage.globalEffectsCached.hutPriceRatio; }
    var nextPrice, priceBelowMax, enoughResources;
    var purchasable = (true);
    for (var i=0;i<bldg.prices.length;i++) {
        nextPrice = bldg.prices[i].val * Math.pow(bldg.priceRatio + ratiomod, bldg.val);
        if (0 < rp[i].maxValue) { priceBelowMax = (nextPrice <= rp[i].maxValue); } else { priceBelowMax = (true); }
        enoughResources = (nextPrice <= rp[i].value);
        purchasable = (purchasable && priceBelowMax && enoughResources);     
    }
    if (purchasable) { kb_build(bldg.name); }
}

function kb_buyYesStageBld(bldg, stg, rp) {
    var nextPrice, priceBelowMax, enoughResources;
    var purchasable = (true);
    for (var i=0;i<bldg.stages[stg].prices.length;i++) {
        nextPrice = bldg.stages[stg].prices[i].val * Math.pow(bldg.stages[stg].priceRatio + gamePage.globalEffectsCached.priceRatio, bldg.val);
        if (0 < rp[i].maxValue) { priceBelowMax = (nextPrice <= rp[i].maxValue); } else { priceBelowMax = (true); }
        enoughResources = (nextPrice <= rp[i].value);
        purchasable = (purchasable && priceBelowMax && enoughResources);     
    }
    if (purchasable) { kb_build(bldg.name); }
}

//########################################################################

function kb_buy_field() { if (kb_use('catnip')) { kb_buyNonStageBld(gamePage.bld.get('field'), [ kb_rCatnip ]); } }

function kb_buy_pasture() { if (kb_use('catnip') && kb_use('wood')) { kb_buyYesStageBld(gamePage.bld.get('pasture'), 0, [ kb_rCatnip, kb_rWood ]); } }

function kb_buy_aqueduct() { if (kb_use('minerals')) { kb_buyYesStageBld(gamePage.bld.get('aqueduct'), 0, [ kb_rMinerals ]); } }

function kb_buy_hut() { if (kb_use('wood')) { kb_buyNonStageBld(gamePage.bld.get('hut'), [ kb_rWood ]); } }

function kb_buy_logHouse() { if (kb_use('wood') && kb_use('minerals')) { kb_buyNonStageBld(gamePage.bld.get('logHouse'), [ kb_rWood, kb_rMinerals ]); } }

function kb_buy_mansion () { if (kb_useUL('slab') && kb_useUL('steel') && kb_use('titanium')) { kb_buyNonStageBld(gamePage.bld.get('mansion'), [ kb_rSlab, kb_rSteel, kb_rTitanium ]); } }

function kb_buy_library() { if (kb_use('wood')) { kb_buyNonStageBld(gamePage.bld.get('library'), [ kb_rWood ]); } }

function kb_buy_academy() { if (kb_use('wood') && kb_use('minerals') && kb_use('science')) { kb_buyNonStageBld(gamePage.bld.get('academy'), [ kb_rWood, kb_rMinerals, kb_rScience ]); } }

function kb_buy_observatory() { if (kb_useUL('scaffold') && kb_useUL('slab') && kb_use('iron') && kb_use('science')) { kb_buyNonStageBld(gamePage.bld.get('observatory'), [ kb_rScaffold, kb_rSlab, kb_rIron, kb_rScience ]); } }

function kb_buy_biolab() { if (kb_useUL('slab') && kb_useUL('alloy') && kb_use('science')) { kb_buyNonStageBld(gamePage.bld.get('biolab'), [ kb_rSlab, kb_rAlloy, kb_rScience ]); } }

function kb_buy_barn() { if (kb_use('wood')) { kb_buyNonStageBld(gamePage.bld.get('barn'), [ kb_rWood ]); } }

function kb_buy_warehouse() { if (kb_useUL('beam') && kb_useUL('slab')) { kb_buyNonStageBld(gamePage.bld.get('warehouse'), [ kb_rBeam, kb_rSlab ]); } }

function kb_buy_harbor() { if (kb_useUL('scaffold') && kb_useUL('slab') && kb_useUL('plate')) { kb_buyNonStageBld(gamePage.bld.get('harbor'), [ kb_rScaffold, kb_rSlab, kb_rPlate ]); } }

function kb_buy_mine() { if (kb_use('wood')) { kb_buyNonStageBld(gamePage.bld.get('mine'), [ kb_rWood ]); } }

function kb_buy_quarry() { if (kb_useUL('scaffold') && kb_useUL('steel') && kb_useUL('slab')) { kb_buyNonStageBld(gamePage.bld.get('quarry'), [ kb_rScaffold, kb_rSteel, kb_rSlab ]); } }

function kb_buy_lumberMill() { if (kb_use('wood') && kb_use('iron') && kb_use('minerals')) { kb_buyNonStageBld(gamePage.bld.get('lumberMill'), [ kb_rWood, kb_rIron, kb_rMinerals ]); } }

function kb_buy_oilWell() { if (kb_useUL('steel') && kb_useUL('gear') && kb_useUL('scaffold')) { kb_buyNonStageBld(gamePage.bld.get('oilWell'), [ kb_rSteel, kb_rGear, kb_rScaffold ]); } }

function kb_buy_accelerator() { if (kb_use('titanium') && kb_useUL('concrete') && kb_use('uranium')) { kb_buyNonStageBld(gamePage.bld.get('accelerator'), [ kb_rTitanium, kb_rConcrete, kb_rUranium ]); } }

function kb_buy_steamworks() { if (kb_useUL('steel') && kb_useUL('gear') && kb_useUL('blueprint')) { kb_buyNonStageBld(gamePage.bld.get('steamworks'), [ kb_rSteel, kb_rGear, kb_rBlueprint ]); } }

function kb_buy_magneto() { if (kb_useUL('alloy') && kb_useUL('gear') && kb_useUL('blueprint')) { kb_buyNonStageBld(gamePage.bld.get('magneto'), [ kb_rAlloy, kb_rGear, kb_rBlueprint ]); } }

function kb_buy_smelter() { if (kb_use('minerals')) { kb_buyNonStageBld(gamePage.bld.get('smelter'), [ kb_rMinerals ]); } }

function kb_buy_calciner() { if (kb_useUL('steel') && kb_use('titanium') && kb_useUL('blueprint') && kb_use('oil')) { kb_buyNonStageBld(gamePage.bld.get('calciner'), [ kb_rSteel, kb_rTitanium, kb_rBlueprint, kb_rOil ]); } }

function kb_buy_factory() { if (kb_use('titanium') && kb_useUL('plate') && kb_useUL('concrete')) { kb_buyNonStageBld(gamePage.bld.get('factory'), [ kb_rTitanium, kb_rPlate, kb_rConcrete ]); } }

function kb_buy_reactor() { if (kb_use('titanium') && kb_useUL('plate') && kb_useUL('concrete') && kb_useUL('blueprint')) { kb_buyNonStageBld(gamePage.bld.get('reactor'), [ kb_rTitanium, kb_rPlate, kb_rConcrete, kb_rBlueprint ]); } }

function kb_buy_amphitheatre() { if (kb_use('wood') && kb_use('minerals') && kb_useUL('parchment')) { kb_buyYesStageBld(gamePage.bld.get('amphitheatre'), 0, [ kb_rWood, kb_rMinerals, kb_rParchment ]); } }

function kb_buy_chapel() { if (kb_use('minerals') && kb_use('culture') && kb_useUL('parchment')) { kb_buyNonStageBld(gamePage.bld.get('chapel'), [ kb_rMinerals, kb_rCulture, kb_rParchment ]); } }

function kb_buy_temple() { if (kb_useUL('slab') && kb_useUL('plate') && kb_use('gold') && kb_useUL('manuscript')) { kb_buyNonStageBld(gamePage.bld.get('temple'), [ kb_rSlab, kb_rPlate, kb_rGold, kb_rParchment ]); } }

function kb_buy_workshop() { if (kb_use('wood') && kb_use('minerals')) { kb_buyNonStageBld(gamePage.bld.get('workshop'), [ kb_rWood, kb_rMinerals ]); } }

function kb_buy_tradepost() { if (kb_use('wood') && kb_use('minerals') && kb_use('gold')) { kb_buyNonStageBld(gamePage.bld.get('tradepost'), [ kb_rWood, kb_rMinerals, kb_rGold ]); } }

function kb_buy_mint() { if (kb_use('minerals') && kb_useUL('plate') && kb_use('gold')) { kb_buyNonStageBld(gamePage.bld.get('mint'), [ kb_rMinerals, kb_rPlate, kb_rGold ]); } }

function kb_buy_unicornPasture() { if (kb_useUL('unicorns')) { kb_buyNonStageBld(gamePage.bld.get('unicornPasture'), [ kb_rUnicorns ]); } }

function kb_buy_ziggurat() { if (kb_useUL('megalith') && kb_useUL('scaffold') && kb_useUL('blueprint')) { kb_buyNonStageBld(gamePage.bld.get('ziggurat'), [ kb_rMegalith, kb_rScaffold, kb_rBlueprint ]); } }

function kb_buy_chronosphere() { if (kb_use('unobtainium') && kb_useUL('timeCrystal') && kb_useUL('blueprint') && kb_use('science')) { kb_buyNonStageBld(gamePage.bld.get('chronosphere'), [ kb_rUnobtainium, kb_rTimeCrystal, kb_rBlueprint, kb_rScience ]); } }

function kb_buy_aiCore() { if (kb_use('antimatter') && kb_use('science')) { kb_buyNonStageBld(gamePage.bld.get('aiCore'), [ kb_rAntimatter, kb_rScience ]); } }



//########################################################################

var kittyBotRunning = false;
var kittyBotInterval = 0;

function kittyBotToggle() {
    if (document.getElementById('kittyBotRunningCheckbox').checked) {
        kittyBotRunning = true;
        kittyBotInterval = setInterval(kittyBotGo, 1000);
    } else {
        kittyBotRunning = false;
        clearInterval(kittyBotInterval);
    }    
}

//########################################################################

function kb_build(bldg) {
    var origTab = gamePage.ui.activeTabId;
    gamePage.ui.activeTabId = 'Bonfire';
    gamePage.render();
    var btn = gamePage.tabs[0].buttons;
    if (gamePage.bld.getBuildingExt(bldg).meta.unlocked) {
        for (var i = 2 ;i < gamePage.tabs[0].buttons.length; i++) {
            try {
                if (btn[i].model.metadata.name == bldg) {
                    btn[i].controller.buyItem(btn[i].model, {}, function(result) { if (result) { btn[i].update(); } });
                } 
            } catch(err) { console.log('err:'+err); }
        }
    }
    gamePage.ui.activeTabId = origTab;
    gamePage.render();
}

//########################################################################

function kb_science(sci) {
    var origTab = gamePage.ui.activeTabId;
    gamePage.ui.activeTabId = 'Science';
    gamePage.render();
    var btn = gamePage.tabs[2].buttons;
    if (btn[sci].model.metadata.unlocked && btn[sci].model.metadata.researched != true) {
        try {
            btn[sci].controller.buyItem(btn[sci].model, {}, function(result) { if (result) { btn[sci].update(); } });
        } catch(err) { console.log('err:'+err); }
    }
    gamePage.ui.activeTabId = origTab;
    gamePage.render();
}

//########################################################################

function kb_use(rs) {
    if (document.getElementById('kb_use_'+rs+'2').checked) {
        var rp = gamePage.resPool.get(rs)
        if (0 <= rp.perTickCached) {
            if (rp.maxValue <= ((rp.perTickCached * 11) + rp.value)) {
                return (true);
            } else { return (false); }
        } else {
            return (false);
        }
    } else { return (document.getElementById('kb_use_'+rs+'1').checked); }
}

function kb_useUL(rs) { return (document.getElementById('kb_use_'+rs).checked); }

//########################################################################

function kittyBotGo() {

    for (var i=0;i<kb_bldNames.length;i++) { if (document.getElementById('kb_bldInput_'+kb_bldNames[i]).checked) { kb_buyBlds[i](); } }

    for (var i=0;i<kb_sciNames.length;i++) {
        if (i == 6) { i++; } // fix for inactive science "brewery"
        if (gamePage.science.get(kb_sciNames[i]).researched) {
            if (document.getElementById('kb_sciDiv_'+kb_sciNames[i]) != null) {
                document.getElementById('kb_sciDiv_'+kb_sciNames[i]).style.display = "none";
            }
        } else {
            if (kb_use('science')) {
                if (document.getElementById('kb_sciInput_'+kb_sciNames[i]).checked) {
                    var sciInfo = gamePage.science.get(kb_sciNames[i]);
                    if (sciInfo.unlocked && !(sciInfo.researched)) {
                        var price = sciInfo.prices[0].val;
                        if ((price <= kb_rScience.maxValue) && (price <= kb_rScience.value)) { kb_science(i); }
                    }
                }
            }
        }
    }

    // Craft Wood to Beams
    if (kb_use('wood') && ((kb_rWood.maxValue - (kb_rWood.perTickCached*6)) <= kb_rWood.value) && (0 < kb_rWood.perTickCached)) {
        gamePage.craft('beam',Math.round(0.5+kb_rWood.perTickCached*5/175));
    }

    // Craft Catnip To Wood (doing this after crafting wood to beams because reasons)
    if (kb_use('catnip') && ((kb_rCatnip.maxValue - (kb_rCatnip.perTickCached*6)) <= kb_rCatnip.value) && (0 < kb_rCatnip.perTickCached) && (kb_rWood.value < kb_rWood.maxValue)) {
        gamePage.craft('wood',Math.round(0.5+kb_rCatnip.perTickCached*5/100));
    }

    // Craft Minerals to Slabs
    if (kb_use('minerals') && ((kb_rMinerals.maxValue - (kb_rMinerals.perTickCached*6)) <= kb_rMinerals.value) && (0 < kb_rMinerals.perTickCached)) {
        gamePage.craft('slab',Math.round(0.5+kb_rMinerals.perTickCached*5/175));
    }

    // Craft Iron to Plates
    if (kb_use('iron') && ((kb_rIron.maxValue - (kb_rIron.perTickCached*6)) <= kb_rIron.value) && (0 < kb_rIron.perTickCached)) {
        gamePage.craft('plate',Math.round(0.5+kb_rIron.perTickCached*5/125));
    }

    // Craft Oil to Kerosene
    if (kb_use('oil') && ((kb_rOil.maxValue - (kb_rOil.perTickCached*6)) <= kb_rOil.value) && (0 < kb_rOil.perTickCached)) {
        gamePage.craft('kerosene',Math.round(0.5+kb_rOil.perTickCached*5/7500));
    }

    // Craft Uranium to Thorium
    if (kb_use('uranium') && ((kb_rUranium.maxValue - (kb_rUranium.perTickCached*6)) <= kb_rUranium.value) && (0 < kb_rUranium.perTickCached)) {
        gamePage.craft('Thorium',Math.round(0.5+kb_rUranium.perTickCached*5/125));
    }

    // Craft ALL Coal to Steel
    if (kb_useUL('coal') && (100 <= kb_rCoal.value)) { gamePage.craftAll('steel'); }

    // Craft Steel to Gear (Oil Well needs smallest ratio, 2 steel to 1 gear, so let's maintain that ratio)
    if (kb_useUL('steel') && (kb_rGear.value < kb_rSteel.value/2)) { gamePage.craft('gear',1); }

    // Craft ALL furs to parchment
    if (175 <= gamePage.resPool.get('furs').value) { gamePage.craftAll('parchment'); }

    // Craft parchment to manuscript, maintain 1 to 1 ratio
    if (kb_useUL('parchment') && kb_use('culture') && ((kb_rCulture.maxValue - (kb_rCulture.perTickCached*6)) <= kb_rCulture.value) && (kb_rManuscript.value < kb_rParchment.value)) {
        gamePage.craft('manuscript',Math.round(0.5+kb_rCulture.perTickCached*5/400));
    }

    // Craft manuscript to compendium, maintain 1 to 1 ratio
    if (kb_useUL('manuscript') && kb_use('science') && ((kb_rScience.maxValue - (kb_rScience.perTickCached*6)) <= kb_rScience.value) && (kb_rCompendium.value < kb_rManuscript.value)) {
        gamePage.craft('compedium',Math.round(0.5+kb_rScience.perTickCached*5/10000));
    }

    // Craft compendium to blueprint, maintain 1 to 1 ratio, unless Genetics hasn't been researched yet but is checked
    var kb_geneticsDiff = 0;
    if (!(gamePage.science.metaCache.genetics.researched)) { kb_geneticsDiff = 1500; }
    if (kb_useUL('compendium') && kb_use('science') && ((kb_rScience.maxValue - (kb_rScience.perTickCached*6)) <= kb_rScience.value) && (kb_rBlueprint.value < (kb_rCompendium.value-kb_geneticsDiff))) {
        gamePage.craft('blueprint',Math.round(0.5+kb_rScience.perTickCached*5/25000));
    }

    // Use ALL Catpower for hunt
    if (kb_useUL('catpower') && ((kb_rCatpower.maxValue-(kb_rCatpower.perTickCached*6))<= kb_rCatpower.value)) { $("a:contains('Send hunters')").click(); }

    // Auto Observe Astronomical Events
    if (document.getElementById('kb_observeEvents').checked) {
        var kb_observe = document.getElementById("observeBtn");
        if (typeof(kb_observe) != 'undefined') {
            if (kb_observe != null) {
                kb_observe.click();
            }
        }
    }

    // CHEAT: Gather Enough
    if (document.getElementById('kb_gatherEnough').checked) {
        if (kb_rCatnip.value < ((gamePage.resPool.get('kittens').maxValue+1)*4.25)) { kb_rCatnip.value = ((gamePage.resPool.get('kittens').maxValue+1)*4.25); }
        if (kb_rCatnip.perTickCached < 0) { kb_rCatnip.value -= (kb_rCatnip.perTickCached*5); }
    }

    // Gather 1 Catnip
    gamePage.bld.gatherCatnip();

}




//########################################################################

function rgb2hex(rgb){
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
           ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
           ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
           ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

function kbToggleUI() {
    document.getElementById('kittyBotDiv').style.backgroundColor = rgb2hex( window.getComputedStyle(document.body, null).getPropertyValue("background-color") );
    $('#kittyBotDiv').toggle();
}

//########################################################################

function kb_bldUp(bldg) {
    var idx = kb_bldNames.indexOf(bldg);
    if (idx != 0) {

        document.getElementById('kb_buildings').insertBefore(document.getElementById('kb_bldDiv_'+kb_bldNames[idx]),document.getElementById('kb_bldDiv_'+kb_bldNames[idx-1]));

        var temp;

        temp = kb_bldNames[idx];
        kb_bldNames.splice(idx,1);
        kb_bldNames.splice(idx-1,0,temp);

        temp = kb_bldLabels[idx];
        kb_bldLabels.splice(idx,1);
        kb_bldLabels.splice(idx-1,0,temp);

        temp = kb_buyBlds[idx];
        kb_buyBlds.splice(idx,1);
        kb_buyBlds.splice(idx-1,0,temp);

    }
}

//########################################################################

function kb_bldDn(bldg) {
    var idx = kb_bldNames.indexOf(bldg);
    if (idx != kb_bldNames.length-1) {
        document.getElementById('kb_buildings').insertBefore(document.getElementById('kb_bldDiv_'+kb_bldNames[idx+1]),document.getElementById('kb_bldDiv_'+kb_bldNames[idx]));

        var temp;

        temp = kb_bldNames[idx];
        kb_bldNames.splice(idx,1);
        kb_bldNames.splice(idx+1,0,temp);

        temp = kb_bldLabels[idx];
        kb_bldLabels.splice(idx,1);
        kb_bldLabels.splice(idx+1,0,temp);

        temp = kb_buyBlds[idx];
        kb_buyBlds.splice(idx,1);
        kb_buyBlds.splice(idx+1,0,temp);
    }
}

//########################################################################

function kbUIAccess() {
    var tempString = '';
    var dPanel = document.getElementById('devPanel').parentNode;
    var kittyBotUIaccess = document.createElement('span');
    var kittyBotUI = document.createElement('div');

    dPanel.insertBefore(kittyBotUIaccess, document.getElementById('devPanel'));
    tempString +=
        ' & ' +
        '<a onclick="kbToggleUI();" href="#">kittyBot</a>' +
        '<span style="font-size: small;"> ver 0.3 by LoyLT</span>';
    kittyBotUIaccess.innerHTML = tempString;

//    kittyBotUI.className = 'dialog help';

    kittyBotUI.id = 'kittyBotDiv';
    kittyBotUI.style.cssText = "display: none; overflow: scroll; position: absolute; left: 400px; top: 75px; width: 850px; height: 90%; border-style: solid; background-color: #000000;";
    document.getElementById('gamePageContainer').appendChild(kittyBotUI);

    tempString = '';
    tempString +=
'<input type="checkbox" id="kittyBotRunningCheckbox" style="display: inline-block;" onClick="kittyBotToggle();" />kittyBot is running if this is checked.<br />'+
'<div style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">'+
'<p><u>Spend Resources on:</u></p>'+
'<div id="kb_buildings" style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">'+
'<p>Buildings & Space:<br />(Space not added yet)</p>'+
'';

for (var i=0;i<kb_bldNames.length;i++) {
    tempString += '<div id="kb_bldDiv_'+kb_bldNames[i]+'">'+
                  '<span style="border-style: solid; border-width: 1px;" onClick="kb_bldUp(\''+kb_bldNames[i]+'\');">up</span> | '+
                  '<span style="border-style: solid; border-width: 1px;" onClick="kb_bldDn(\''+kb_bldNames[i]+'\');">dn</span> &nbsp; '+
                  '<input id="kb_bldInput_'+kb_bldNames[i]+'" type="checkbox" style="display: inline-block; vertical-align: sub;" checked />Building: '+kb_bldLabels[i]+'</div>';
}

    tempString +=
'</div>'+
'<div style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">'+
'<p>Science:</p>'+
'';

for (var i=0;i<kb_sciNames.length;i++) {
    if ((!gamePage.science.get(kb_sciNames[i]).researched) && (i != 6)) {
        tempString += '<div id="kb_sciDiv_'+kb_sciNames[i]+'"><input id="kb_sciInput_'+kb_sciNames[i]+'" type="checkbox" style="display: inline-block; vertical-align: sub;" checked />'+kb_sciLabels[i]+'</div>';
    }
}

    tempString +=
'</div>'+
'</div>'+
'<div style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">'+
'<p><u>Use Resources to build or craft</u></p>'+
'<div style="border-style: solid; border-width: 1px; padding: 5px;">'+
'<input id="kb_use_catnip0" type="radio" name="kb_use_catnip" value="0" style="vertical-align: sub;" />never'+
'<input id="kb_use_catnip1" type="radio" name="kb_use_catnip" value="1" style="vertical-align: sub;" checked />any'+
'<input id="kb_use_catnip2" type="radio" name="kb_use_catnip" value="2" style="vertical-align: sub;" />max | Catnip<br />'+
'<input id="kb_use_wood0" type="radio" name="kb_use_wood" value="0" style="vertical-align: sub;" />never'+
'<input id="kb_use_wood1" type="radio" name="kb_use_wood" value="1" style="vertical-align: sub;" checked />any'+
'<input id="kb_use_wood2" type="radio" name="kb_use_wood" value="2" style="vertical-align: sub;" />max | Wood<br />'+
'<input id="kb_use_minerals0" type="radio" name="kb_use_minerals" value="0" style="vertical-align: sub;" />never'+
'<input id="kb_use_minerals1" type="radio" name="kb_use_minerals" value="1" style="vertical-align: sub;" checked />any'+
'<input id="kb_use_minerals2" type="radio" name="kb_use_minerals" value="2" style="vertical-align: sub;" />max | Minerals<br />'+
'<input id="kb_use_iron0" type="radio" name="kb_use_iron" value="0" style="vertical-align: sub;" />never'+
'<input id="kb_use_iron1" type="radio" name="kb_use_iron" value="1" style="vertical-align: sub;" checked />any'+
'<input id="kb_use_iron2" type="radio" name="kb_use_iron" value="2" style="vertical-align: sub;" />max | Iron<br />'+
'<input id="kb_use_titanium0" type="radio" name="kb_use_titanium" value="0" style="vertical-align: sub;" />never'+
'<input id="kb_use_titanium1" type="radio" name="kb_use_titanium" value="1" style="vertical-align: sub;" checked />any'+
'<input id="kb_use_titanium2" type="radio" name="kb_use_titanium" value="2" style="vertical-align: sub;" />max | Titanium<br />'+
'<input id="kb_use_gold0" type="radio" name="kb_use_gold" value="0" style="vertical-align: sub;" />never'+
'<input id="kb_use_gold1" type="radio" name="kb_use_gold" value="1" style="vertical-align: sub;" checked />any'+
'<input id="kb_use_gold2" type="radio" name="kb_use_gold" value="2" style="vertical-align: sub;" />max | Gold<br />'+
'<input id="kb_use_oil0" type="radio" name="kb_use_oil" value="0" style="vertical-align: sub;" />never'+
'<input id="kb_use_oil1" type="radio" name="kb_use_oil" value="1" style="vertical-align: sub;" checked />any'+
'<input id="kb_use_oil2" type="radio" name="kb_use_oil" value="2" style="vertical-align: sub;" />max | Oil<br />'+
'<input id="kb_use_uranium0" type="radio" name="kb_use_uranium" value="0" style="vertical-align: sub;" />never'+
'<input id="kb_use_uranium1" type="radio" name="kb_use_uranium" value="1" style="vertical-align: sub;" checked />any'+
'<input id="kb_use_uranium2" type="radio" name="kb_use_uranium" value="2" style="vertical-align: sub;" />max | Uranium<br />'+
'<input id="kb_use_unobtainium0" type="radio" name="kb_use_unobtainium" value="0" style="vertical-align: sub;" />never'+
'<input id="kb_use_unobtainium1" type="radio" name="kb_use_unobtainium" value="1" style="vertical-align: sub;" checked />any'+
'<input id="kb_use_unobtainium2" type="radio" name="kb_use_unobtainium" value="2" style="vertical-align: sub;" />max | Unobtainium<br />'+
'<input id="kb_use_science0" type="radio" name="kb_use_science" value="0" style="vertical-align: sub;" />never'+
'<input id="kb_use_science1" type="radio" name="kb_use_science" value="1" style="vertical-align: sub;" />any'+
'<input id="kb_use_science2" type="radio" name="kb_use_science" value="2" style="vertical-align: sub;" checked />max | Science<br />'+
'<input id="kb_use_culture0" type="radio" name="kb_use_culture" value="0" style="vertical-align: sub;" />never'+
'<input id="kb_use_culture1" type="radio" name="kb_use_culture" value="1" style="vertical-align: sub;" />any'+
'<input id="kb_use_culture2" type="radio" name="kb_use_culture" value="2" style="vertical-align: sub;" checked />max | Culture<br />'+
'<input id="kb_use_faith0" type="radio" name="kb_use_faith" value="0" style="vertical-align: sub;" />never'+
'<input id="kb_use_faith1" type="radio" name="kb_use_faith" value="1" style="vertical-align: sub;" checked />any'+
'<input id="kb_use_faith2" type="radio" name="kb_use_faith" value="2" style="vertical-align: sub;" />max | Faith<br />'+
//kittens
'<input id="kb_use_antimatter0" type="radio" name="kb_use_antimatter" value="0" style="vertical-align: sub;" />never'+
'<input id="kb_use_antimatter1" type="radio" name="kb_use_antimatter" value="1" style="vertical-align: sub;" checked />any'+
'<input id="kb_use_antimatter2" type="radio" name="kb_use_antimatter" value="2" style="vertical-align: sub;" />max | Antimatter<br />'+
//temporalFlux
'<input id="kb_use_sorrow0" type="radio" name="kb_use_sorrow" value="0" style="vertical-align: sub;" />never'+
'<input id="kb_use_sorrow1" type="radio" name="kb_use_sorrow" value="1" style="vertical-align: sub;" checked />any'+
'<input id="kb_use_sorrow2" type="radio" name="kb_use_sorrow" value="2" style="vertical-align: sub;" />max | Sorrow<br />'+
'<br />'+
'<input id="kb_use_coal" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Coal<br />'+
'<input id="kb_use_catpower" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Catpower<br />'+
'<input id="kb_use_beam" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Beam<br />'+
'<input id="kb_use_slab" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Slab<br />'+
'<input id="kb_use_plate" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Plate<br />'+
'<input id="kb_use_steel" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Steel<br />'+
'<input id="kb_use_concrete" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Concrete<br />'+
'<input id="kb_use_gear" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Gear<br />'+
'<input id="kb_use_alloy" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Alloy<br />'+
'<input id="kb_use_eludium" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Eludium<br />'+
'<input id="kb_use_scaffold" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Scaffold<br />'+
'<input id="kb_use_ship" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Ship<br />'+
'<input id="kb_use_tanker" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Tanker<br />'+
'<input id="kb_use_kerosene" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Kerosene<br />'+
'<input id="kb_use_parchment" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Parchment<br />'+
'<input id="kb_use_manuscript" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Manuscript<br />'+
'<input id="kb_use_compendium" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Compendium<br />'+
'<input id="kb_use_blueprint" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Blueprint<br />'+
'<input id="kb_use_thorium" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Thorium<br />'+
'<input id="kb_use_megalith" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Megalith<br />'+
'<input id="kb_use_starchart" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Starchart<br />'+
'<input id="kb_use_unicorns" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Unicorns<br />'+
'<input id="kb_use_alicorn" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Alicorn<br />'+
'<input id="kb_use_tears" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Tears<br />'+
'<input id="kb_use_timeCrystal" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Time Crystal<br />'+
'<input id="kb_use_relic" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Relic<br />'+
'<input id="kb_use_void" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Void<br />'+
'</div>'+
'<p style="text-align: center;"><u>Cheats and Other Stuff</u></p>'+
'<div style="border-style: solid; border-width: 1px; padding: 5px;">'+
'<input id="kb_observeEvents" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Observe astronomical events<br />'+
'<input id="kb_gatherCatnip" type="radio" name="kb_gather" style="vertical-align: sub;" />Gather catnip (1/s)<br />'+
'<input id="kb_gatherEnough" type="radio" name="kb_gather" style="vertical-align: sub;" checked />Gather enough to survive (cheat)<br />'+
'</div>'+
'</div>'+
'';

    kittyBotUI.innerHTML = tempString;
}

//########################################################################

kbUIAccess();
