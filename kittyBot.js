
// ##############################################################################
// # Original bot written by LoyLT, updated and expanded by tstaec              #
// # version 0.4, incomplete, no guarantee is given                             #
// #============================================================================#
// #              JavaScript add-on for bloodrizer's Kittens Game               #
// #                           https://kittensgame.com                          #
// ##############################################################################

// Define global variables to satisfy ESLint
/* global gamePage */

const kbScienceNames = [
  'calendar', 'agriculture', 'archery', 'mining', 'metal',
  'animal', 'brewery', 'civil', 'math', 'construction',
  'engineering', 'currency', 'writing', 'philosophy', 'machinery',
  'steel', 'theology', 'astronomy', 'navigation', 'architecture',
  'physics', 'metaphysics', 'chemistry', 'acoustics', 'drama',
  'archeology', 'electricity', 'biology', 'biochemistry', 'genetics',
  'industrialization', 'mechanization', 'metalurgy', 'combustion', 'ecology',
  'electronics', 'robotics', 'ai', 'quantumCryptography', 'nuclearFission',
  'rocketry', 'oilProcessing', 'sattelites', 'orbitalEngineering', 'thorium',
  'exogeology', 'advExogeology', 'nanotechnology', 'superconductors', 'antimatter',
  'terraformation', 'hydroponics', 'particlePhysics', 'dimensionalPhysics', 'chronophysics',
  'tachyonTheory', 'cryptotheology', 'voidSpace', 'paradoxalKnowledge'
]

const kbScienceLabels = [
  'Calendar', 'Agriculture', 'Archery', 'Mining', 'Metal Working',
  'Animal Husbandry', 'Catnip Processing', 'Civil Service', 'Mathematics', 'Construction',
  'Engineering', 'Currency', 'Writing', 'Philosophy', 'Machinery',
  'Steel', 'Theology', 'Astronomy', 'Navigation', 'Architecture',
  'Physics', 'Metaphysics', 'Chemistry', 'Acoustics', 'Drama and Poetry',
  'Geology', 'Electricity', 'Biology', 'Biochemistry', 'Genetics',
  'Industrialization', 'Mechanization', 'Metallurgy', 'Combustion', 'Ecology',
  'Electronics', 'Robotics', 'Artificial Intelligence', 'Quantum Cryptography', 'Nuclear Fission',
  'Rocketry', 'Oil Processing', 'Satellites', 'Orbital Engineering', 'Thorium',
  'Exogeology', 'Advanced Exogeology', 'Nanotechnology', 'Superconductors', 'Antimatter',
  'Terraformation', 'Hydroponics', 'Particle Physics', 'Dimensional Physics', 'Chronophysics',
  'Tachyon Theory', 'Cryptotheology', 'Void Space', 'Paradoxal Knowledge'
]

const kbBuildingNames = [
  'field', 'pasture', 'aqueduct', 'hut', 'logHouse', 'mansion',
  'library', 'academy', 'observatory', 'biolab', 'barn', 'warehouse',
  'harbor', 'mine', 'quarry', 'lumberMill', 'oilWell', 'accelerator',
  'steamworks', 'magneto', 'smelter', 'calciner', 'factory', 'reactor',
  'amphitheatre', 'chapel', 'temple', 'workshop', 'tradepost', 'mint',
  'unicornPasture', 'ziggurat', 'chronosphere', 'aiCore'
]

const kbBuildingLabels = [
  'Catnip Field', 'Pasture', 'Aqueduct', 'Hut', 'Log House', 'Mansion',
  'Library', 'Academy', 'Observatory', 'Bio Lab', 'Barn', 'Warehouse',
  'Harbor', 'Mine', 'Quarry', 'Lumber Mill', 'Oil Well', 'Accelerator',
  'Steamworks', 'Magneto', 'Smelter', 'Calciner', 'Factory', 'Reactor',
  'Amphitheatre', 'Chapel', 'Temple', 'Workshop', 'Tradepost', 'Mint',
  'Unicorn Pasture', 'Ziggurat', 'Chronosphere', 'AI Core'
]

// const kbWorkshopNames = [
//   'mineralHoes', 'ironHoes', 'mineralAxes', 'ironAxes', 'steelAxe', 'reinforcedSaw',
//   'steelSaw', 'titaniumSaw', 'alloySaw', 'titaniumAxe', 'alloyAxe', 'unobtainiumAxe',
//   'unobtainiumSaw', 'stoneBarns', 'reinforcedBarns', 'reinforcedWarehouses', 'titaniumBarns',
//   'alloyBarns', 'concreteBarns', 'titaniumWarehouses', 'alloyWarehouses', 'concreteWarehouses',
//   'storageBunkers', 'energyRifts', 'stasisChambers', 'voidEnergy', 'darkEnergy',
//   'chronoforge', 'tachyonAccelerators', 'fluxCondensator', 'lhc', 'photovoltaic',
//   'thinFilm', 'qdot', 'solarSatellites', 'cargoShips', 'barges', 'reactorVessel',
//   'ironwood', 'concreteHuts', 'unobtainiumHuts', 'eludiumHuts', 'silos', 'refrigeration',
//   'compositeBow', 'crossbow', 'railgun', 'bolas', 'huntingArmor', 'steelArmor',
//   'alloyArmor', 'nanosuits', 'caravanserai', 'advancedRefinement', 'goldOre',
//   'geodesy', 'register', 'strenghtenBuild', 'miningDrill', 'unobtainiumDrill',
//   'coalFurnace', 'deepMining', 'pyrolysis', 'electrolyticSmelting', 'oxidation',
//   'steelPlants', 'automatedPlants', 'nuclearPlants', 'rotaryKiln', 'fluidizedReactors',
//   'nuclearSmelters', 'orbitalGeodesy', 'printingPress', 'offsetPress', 'photolithography',
//   'uplink', 'starlink', 'cryocomputing', 'machineLearning', 'factoryAutomation',
//   'advancedAutomation', 'pneumaticPress', 'combustionEngine', 'fuelInjectors', 'factoryLogistics',
//   'carbonSequestration', 'factoryOptimization', 'factoryRobotics', 'spaceEngineers',
//   'aiEngineers', 'chronoEngineers', 'spaceManufacturing', 'celestialMechanics', 'astrolabe',
//   'titaniumMirrors', 'unobtainiumReflectors', 'eludiumReflectors', 'hydroPlantTurbines',
//   'amBases', 'aiBases', 'amFission', 'amReactors', 'amReactorsMK2', 'voidReactors',
//   'relicStation', 'amDrive', 'pumpjack', 'biofuel', 'unicornSelection', 'gmo',
//   'cadSystems', 'seti', 'logistics', 'augumentation', 'internet', 'neuralNetworks',
//   'assistance', 'enrichedUranium', 'coldFusion', 'thoriumReactors', 'enrichedThorium',
//   'hubbleTelescope', 'satnav', 'satelliteRadio', 'astrophysicists', 'mWReactor',
//   'eludiumCracker', 'thoriumEngine', 'oilRefinery', 'oilDistillation', 'factoryProcessing',
//   'voidAspiration', 'distorsion', 'turnSmoothly', 'invisibleBlackHand',
// ]

const kbBuyBuildingsMethods = [
  kbBuyField, kbBuyPasture, kbBuyAqueduct, kbBuyHut, kbBuyLogHouse, kbBuyMansion,
  kbBuyLibrary, kbBuyAcademy, kbBuyObservatory, kbBuyBiolab, kbBuyBarn, kbBuyWarehouse,
  kbBuyHarbor, kbBuyMine, kbBuyQuarry, kbBuyLumberMill, kbBuyOilWell, kbBuyAccelerator,
  kbBuySteamworks, kbBuyMagneto, kbBuySmelter, kbBuyCalciner, kbBuyFactory, kbBuyReactor,
  kbBuyAmphitheatre, kbBuyChapel, kbBuyTemple, kbBuyWorkshop, kbBuyTradepost, kbBuyMint,
  kbBuyUnicornPasture, kbBuyZiggurat, kbBuychronosphere, kbBuyAiCore
]

const kbCatnipResource = gamePage.resPool.get('catnip')
const kbWoodResource = gamePage.resPool.get('wood')
const kbMineralsResource = gamePage.resPool.get('minerals')
const kbIronResource = gamePage.resPool.get('iron')
const kbTitaniumResource = gamePage.resPool.get('titanium')
const kbGoldResource = gamePage.resPool.get('gold')
const kbOilResource = gamePage.resPool.get('oil')
const kbUraniumResource = gamePage.resPool.get('uranium')
const kbUnobtainiumResource = gamePage.resPool.get('unobtainium')
const kbCatpowerResource = gamePage.resPool.get('manpower')
const kbScienceResource = gamePage.resPool.get('science')
const kbCultureResource = gamePage.resPool.get('culture')
const kbFaithResource = gamePage.resPool.get('faith')
const kbAntimatterResource = gamePage.resPool.get('antimatter')
const kbSorrowResource = gamePage.resPool.get('sorrow')

const kbCoalResource = gamePage.resPool.get('coal') // coal isn't used for buying so always turn it to steel

const kbBeamResource = gamePage.resPool.get('beam') // craft level 1
const kbSlabResource = gamePage.resPool.get('slab') // craft level 1
const kbPlateResource = gamePage.resPool.get('plate') // craft level 1
const kbSteelResource = gamePage.resPool.get('steel') // craft level 1

const kbConcreteResource = gamePage.resPool.get('concrate') // craft level 2
const kbGearResource = gamePage.resPool.get('gear') // craft level 2
const kbAlloyResource = gamePage.resPool.get('alloy') // craft level 2

const kbEludiumResource = gamePage.resPool.get('eludium') // craft level 3

const kbScaffoldResource = gamePage.resPool.get('scaffold') // craft level 2

const kbShipResource = gamePage.resPool.get('ship') // craft level 3

const kbTankerResource = gamePage.resPool.get('tanker') // craft level 4

const kbKeroseneResource = gamePage.resPool.get('kerosene') // craft level 1

const kbParchmentResource = gamePage.resPool.get('parchment') // craft level 1
const kbManuscriptResource = gamePage.resPool.get('manuscript') // craft level 2
const kbCompendiumResource = gamePage.resPool.get('compedium') // craft level 3
const kbBlueprintResource = gamePage.resPool.get('blueprint') // craft level 4

const kbThoriumResource = gamePage.resPool.get('thorium') // craft level 1

const kbMegalithResource = gamePage.resPool.get('megalith') // craft level 3

const kbStarchartResource = gamePage.resPool.get('starchart')
const kbUnicornsResource = gamePage.resPool.get('unicorns')
const kbAlicornResource = gamePage.resPool.get('alicorn')
const kbTearsResource = gamePage.resPool.get('tears')
const kbTimeCrystalResource = gamePage.resPool.get('timeCrystal')
const kbRelicResource = gamePage.resPool.get('relic')
const kbVoidResource = gamePage.resPool.get('void')

// ########################################################################

function kbBuyNonStageBuilding (bldg, rp) {
  let ratiomod = gamePage.globalEffectsCached.priceRatio
  if (bldg.name === 'hut') { ratiomod += gamePage.globalEffectsCached.hutPriceRatio }
  let nextPrice, priceBelowMax, enoughResources
  let purchasable = (true)
  if (bldg.prices === undefined) {
    console.log(bldg)
    return
  }
  for (let i = 0; i < bldg.prices.length; i++) {
    nextPrice = bldg.prices[i].val * Math.pow(bldg.priceRatio + ratiomod, bldg.val)
    if (rp[i].maxValue > 0) { priceBelowMax = (nextPrice <= rp[i].maxValue) } else { priceBelowMax = (true) }
    enoughResources = (nextPrice <= rp[i].value)
    purchasable = (purchasable && priceBelowMax && enoughResources)
  }
  if (purchasable) { kbBuild(bldg.name) }
}

function kbBuyYesStageBuilding (bldg, stg, rp) {
  let nextPrice, priceBelowMax, enoughResources
  let purchasable = (true)
  for (let i = 0; i < bldg.stages[stg].prices.length; i++) {
    nextPrice = bldg.stages[stg].prices[i].val * Math.pow(bldg.priceRatio + gamePage.globalEffectsCached.priceRatio, bldg.val)
    if (rp[i].maxValue > 0) { priceBelowMax = (nextPrice <= rp[i].maxValue) } else { priceBelowMax = (true) }
    enoughResources = (nextPrice <= rp[i].value)
    purchasable = (purchasable && priceBelowMax && enoughResources)
  }
  if (purchasable) { kbBuild(bldg.name) }
}

// ########################################################################

function kbBuyField () { if (kbUse('catnip')) { kbBuyNonStageBuilding(gamePage.bld.get('field'), [kbCatnipResource]) } }

function kbBuyPasture () { if (kbUse('catnip') && kbUse('wood')) { kbBuyYesStageBuilding(gamePage.bld.get('pasture'), 0, [kbCatnipResource, kbWoodResource]) } }

function kbBuyAqueduct () { if (kbUse('minerals')) { kbBuyYesStageBuilding(gamePage.bld.get('aqueduct'), 0, [kbMineralsResource]) } }

function kbBuyHut () { if (kbUse('wood')) { kbBuyNonStageBuilding(gamePage.bld.get('hut'), [kbWoodResource]) } }

function kbBuyLogHouse () { if (kbUse('wood') && kbUse('minerals')) { kbBuyNonStageBuilding(gamePage.bld.get('logHouse'), [kbWoodResource, kbMineralsResource]) } }

function kbBuyMansion () { if (kbUseUL('slab') && kbUseUL('steel') && kbUse('titanium')) { kbBuyNonStageBuilding(gamePage.bld.get('mansion'), [kbSlabResource, kbSteelResource, kbTitaniumResource]) } }

function kbBuyLibrary () { if (kbUse('wood')) { kbBuyYesStageBuilding(gamePage.bld.get('library'), 0, [kbWoodResource]) } }

function kbBuyAcademy () { if (kbUse('wood') && kbUse('minerals') && kbUse('science')) { kbBuyNonStageBuilding(gamePage.bld.get('academy'), [kbWoodResource, kbMineralsResource, kbScienceResource]) } }

function kbBuyObservatory () { if (kbUseUL('scaffold') && kbUseUL('slab') && kbUse('iron') && kbUse('science')) { kbBuyNonStageBuilding(gamePage.bld.get('observatory'), [kbScaffoldResource, kbSlabResource, kbIronResource, kbScienceResource]) } }

function kbBuyBiolab () { if (kbUseUL('slab') && kbUseUL('alloy') && kbUse('science')) { kbBuyNonStageBuilding(gamePage.bld.get('biolab'), [kbSlabResource, kbAlloyResource, kbScienceResource]) } }

function kbBuyBarn () { if (kbUse('wood')) { kbBuyNonStageBuilding(gamePage.bld.get('barn'), [kbWoodResource]) } }

function kbBuyWarehouse () { if (kbUseUL('beam') && kbUseUL('slab')) { kbBuyNonStageBuilding(gamePage.bld.get('warehouse'), [kbBeamResource, kbSlabResource]) } }

function kbBuyHarbor () { if (kbUseUL('scaffold') && kbUseUL('slab') && kbUseUL('plate')) { kbBuyNonStageBuilding(gamePage.bld.get('harbor'), [kbScaffoldResource, kbSlabResource, kbPlateResource]) } }

function kbBuyMine () { if (kbUse('wood')) { kbBuyNonStageBuilding(gamePage.bld.get('mine'), [kbWoodResource]) } }

function kbBuyQuarry () { if (kbUseUL('scaffold') && kbUseUL('steel') && kbUseUL('slab')) { kbBuyNonStageBuilding(gamePage.bld.get('quarry'), [kbScaffoldResource, kbSteelResource, kbSlabResource]) } }

function kbBuyLumberMill () { if (kbUse('wood') && kbUse('iron') && kbUse('minerals')) { kbBuyNonStageBuilding(gamePage.bld.get('lumberMill'), [kbWoodResource, kbIronResource, kbMineralsResource]) } }

function kbBuyOilWell () { if (kbUseUL('steel') && kbUseUL('gear') && kbUseUL('scaffold')) { kbBuyNonStageBuilding(gamePage.bld.get('oilWell'), [kbSteelResource, kbGearResource, kbScaffoldResource]) } }

function kbBuyAccelerator () { if (kbUse('titanium') && kbUseUL('concrete') && kbUse('uranium')) { kbBuyNonStageBuilding(gamePage.bld.get('accelerator'), [kbTitaniumResource, kbConcreteResource, kbUraniumResource]) } }

function kbBuySteamworks () { if (kbUseUL('steel') && kbUseUL('gear') && kbUseUL('blueprint')) { kbBuyNonStageBuilding(gamePage.bld.get('steamworks'), [kbSteelResource, kbGearResource, kbBlueprintResource]) } }

function kbBuyMagneto () { if (kbUseUL('alloy') && kbUseUL('gear') && kbUseUL('blueprint')) { kbBuyNonStageBuilding(gamePage.bld.get('magneto'), [kbAlloyResource, kbGearResource, kbBlueprintResource]) } }

function kbBuySmelter () { if (kbUse('minerals')) { kbBuyNonStageBuilding(gamePage.bld.get('smelter'), [kbMineralsResource]) } }

function kbBuyCalciner () { if (kbUseUL('steel') && kbUse('titanium') && kbUseUL('blueprint') && kbUse('oil')) { kbBuyNonStageBuilding(gamePage.bld.get('calciner'), [kbSteelResource, kbTitaniumResource, kbBlueprintResource, kbOilResource]) } }

function kbBuyFactory () { if (kbUse('titanium') && kbUseUL('plate') && kbUseUL('concrete')) { kbBuyNonStageBuilding(gamePage.bld.get('factory'), [kbTitaniumResource, kbPlateResource, kbConcreteResource]) } }

function kbBuyReactor () { if (kbUse('titanium') && kbUseUL('plate') && kbUseUL('concrete') && kbUseUL('blueprint')) { kbBuyNonStageBuilding(gamePage.bld.get('reactor'), [kbTitaniumResource, kbPlateResource, kbConcreteResource, kbBlueprintResource]) } }

function kbBuyAmphitheatre () { if (kbUse('wood') && kbUse('minerals') && kbUseUL('parchment')) { kbBuyYesStageBuilding(gamePage.bld.get('amphitheatre'), 0, [kbWoodResource, kbMineralsResource, kbParchmentResource]) } }

function kbBuyChapel () { if (kbUse('minerals') && kbUse('culture') && kbUseUL('parchment')) { kbBuyNonStageBuilding(gamePage.bld.get('chapel'), [kbMineralsResource, kbCultureResource, kbParchmentResource]) } }

function kbBuyTemple () { if (kbUseUL('slab') && kbUseUL('plate') && kbUse('gold') && kbUseUL('manuscript')) { kbBuyNonStageBuilding(gamePage.bld.get('temple'), [kbSlabResource, kbPlateResource, kbGoldResource, kbParchmentResource]) } }

function kbBuyWorkshop () { if (kbUse('wood') && kbUse('minerals')) { kbBuyNonStageBuilding(gamePage.bld.get('workshop'), [kbWoodResource, kbMineralsResource]) } }

function kbBuyTradepost () { if (kbUse('wood') && kbUse('minerals') && kbUse('gold')) { kbBuyNonStageBuilding(gamePage.bld.get('tradepost'), [kbWoodResource, kbMineralsResource, kbGoldResource]) } }

function kbBuyMint () { if (kbUse('minerals') && kbUseUL('plate') && kbUse('gold')) { kbBuyNonStageBuilding(gamePage.bld.get('mint'), [kbMineralsResource, kbPlateResource, kbGoldResource]) } }

function kbBuyUnicornPasture () { if (kbUseUL('unicorns')) { kbBuyNonStageBuilding(gamePage.bld.get('unicornPasture'), [kbUnicornsResource]) } }

function kbBuyZiggurat () { if (kbUseUL('megalith') && kbUseUL('scaffold') && kbUseUL('blueprint')) { kbBuyNonStageBuilding(gamePage.bld.get('ziggurat'), [kbMegalithResource, kbScaffoldResource, kbBlueprintResource]) } }

function kbBuychronosphere () { if (kbUse('unobtainium') && kbUseUL('timeCrystal') && kbUseUL('blueprint') && kbUse('science')) { kbBuyNonStageBuilding(gamePage.bld.get('chronosphere'), [kbUnobtainiumResource, kbTimeCrystalResource, kbBlueprintResource, kbScienceResource]) } }

function kbBuyAiCore () { if (kbUse('antimatter') && kbUse('science')) { kbBuyNonStageBuilding(gamePage.bld.get('aiCore'), [kbAntimatterResource, kbScienceResource]) } }

// ########################################################################

let kittyBotRunning = false
let kittyBotInterval = 0

function kittyBotToggle () {
  if (document.getElementById('kittyBotRunningCheckbox').checked) {
    kittyBotRunning = true
    kittyBotInterval = setInterval(kittyBotGo, 5000)
  } else {
    kittyBotRunning = false
    clearInterval(kittyBotInterval)
  }
}

// ########################################################################

function kbBuild (buildingName) {
  const origTab = gamePage.ui.activeTabId
  gamePage.ui.activeTabId = 'Bonfire'
  gamePage.render()
  const btn = gamePage.tabs[0].children
  if (gamePage.bld.getBuildingExt(buildingName).meta.unlocked) {
    for (let i = 2; i < gamePage.tabs[0].children.length; i++) {
      try {
        if (btn[i].model.metadata.name === buildingName) {
          console.log('building: ' + buildingName)
          btn[i].controller.buyItem(btn[i].model, {}, function (result) { if (result) { btn[i].update() } })
        }
      } catch (err) { console.log('err:' + err) }
    }
  }
  gamePage.ui.activeTabId = origTab
  gamePage.render()
}

// ########################################################################

function kbScience (scienceName) {
  const origTab = gamePage.ui.activeTabId
  gamePage.ui.activeTabId = 'Science'
  gamePage.render()
  const btn = gamePage.tabs[2].buttons
  if (btn[scienceName].model.metadata.unlocked && btn[scienceName].model.metadata.researched !== true) {
    try {
      btn[scienceName].controller.buyItem(btn[scienceName].model, {}, function (result) { if (result) { btn[scienceName].update() } })
    } catch (err) { console.log('err:' + err) }
  }
  gamePage.ui.activeTabId = origTab
  gamePage.render()
}

// ########################################################################

function kbBuildAllAvailableWorkshopItems () {
  const origTab = gamePage.ui.activeTabId
  gamePage.ui.activeTabId = 'Workshop'
  gamePage.render()
  const buttons = gamePage.tabs[3].buttons.filter(b => b.model.visible && b.model.enabled)
  buttons.forEach(btn => {
    try {
      console.log('crafting: ' + btn.model.name)
      btn.controller.buyItem(btn.model, {}, function (result) { if (result) { btn.update() } })
    } catch (err) { console.log('err:' + err) }
  })
  gamePage.ui.activeTabId = origTab
  gamePage.render()
}

// ########################################################################

function kbUse (resourceName) {
  if (document.getElementById('kb_use_' + resourceName + '2').checked) {
    const rp = gamePage.resPool.get(resourceName)
    if (rp.perTickCached >= 0) {
      if (rp.maxValue <= ((rp.perTickCached * 11) + rp.value)) {
        return (true)
      } else { return (false) }
    } else {
      return (false)
    }
  } else { return (document.getElementById('kb_use_' + resourceName + '1').checked) }
}

function kbUseUL (rs) { return (document.getElementById('kb_use_' + rs).checked) }

// ########################################################################

function kittyBotGo () {
  kbBuildAllAvailableWorkshopItems()

  for (let i = 0; i < kbBuildingNames.length; i++) {
    if (document.getElementById('kb_bldInput_' + kbBuildingNames[i]).checked) {
      kbBuyBuildingsMethods[i]()
    }
  }

  for (let i = 0; i < kbScienceNames.length; i++) {
    if (i === 6) { continue } // fix for inactive science "brewery"
    if (gamePage.science.get(kbScienceNames[i]).researched) {
      if (document.getElementById('kb_sciDiv_' + kbScienceNames[i]) != null) {
        document.getElementById('kb_sciDiv_' + kbScienceNames[i]).style.display = 'none'
      }
    } else {
      if (kbUse('science')) {
        console.log('science: ' + kbScienceNames[i])
        if (document.getElementById('kb_sciInput_' + kbScienceNames[i]).checked) {
          const sciInfo = gamePage.science.get(kbScienceNames[i])
          // console.log(sciInfo);
          if (sciInfo.unlocked && !(sciInfo.researched)) {
            const price = sciInfo.prices[0].val
            if ((price <= kbScienceResource.maxValue) && (price <= kbScienceResource.value)) { kbScience(i) }
          }
        }
      }
    }
  }

  // Craft Wood to Beams
  if (kbUse('wood') && ((kbWoodResource.maxValue - (kbWoodResource.perTickCached * 6)) <= kbWoodResource.value) && (kbWoodResource.perTickCached > 0)) {
    gamePage.craft('beam', Math.round(0.5 + kbWoodResource.perTickCached * 5 / 175))
  }

  // Craft Catnip To Wood (doing this after crafting wood to beams because reasons)
  if (kbUse('catnip') && ((kbCatnipResource.maxValue - (kbCatnipResource.perTickCached * 6)) <= kbCatnipResource.value) && (kbCatnipResource.perTickCached > 0) && (kbWoodResource.value < kbWoodResource.maxValue)) {
    gamePage.craft('wood', Math.round(0.5 + kbCatnipResource.perTickCached * 5 / 100))
  }

  // Craft Minerals to Slabs
  if (kbUse('minerals') && ((kbMineralsResource.maxValue - (kbMineralsResource.perTickCached * 6)) <= kbMineralsResource.value) && (kbMineralsResource.perTickCached > 0)) {
    gamePage.craft('slab', Math.round(0.5 + kbMineralsResource.perTickCached * 5 / 175))
  }

  // Craft Iron to Plates
  if (kbUse('iron') && ((kbIronResource.maxValue - (kbIronResource.perTickCached * 6)) <= kbIronResource.value) && (kbIronResource.perTickCached > 0)) {
    gamePage.craft('plate', Math.round(0.5 + kbIronResource.perTickCached * 5 / 125))
  }

  // Craft Oil to Kerosene
  if (kbUse('oil') && ((kbOilResource.maxValue - (kbOilResource.perTickCached * 6)) <= kbOilResource.value) && (kbOilResource.perTickCached > 0)) {
    gamePage.craft('kerosene', Math.round(0.5 + kbOilResource.perTickCached * 5 / 7500))
  }

  // Craft Uranium to Thorium
  if (kbUse('uranium') && ((kbUraniumResource.maxValue - (kbUraniumResource.perTickCached * 6)) <= kbUraniumResource.value) && (kbUraniumResource.perTickCached > 0)) {
    gamePage.craft('Thorium', Math.round(0.5 + kbUraniumResource.perTickCached * 5 / 125))
  }

  // Craft ALL Coal to Steel
  if (kbUseUL('coal') && (kbCoalResource.value >= 100)) { gamePage.craftAll('steel') }

  // Craft Steel to Gear (Oil Well needs smallest ratio, 2 steel to 1 gear, so let's maintain that ratio)
  if (kbUseUL('steel') && (kbGearResource.value < kbSteelResource.value / 2)) { gamePage.craft('gear', 1) }

  // Craft ALL furs to parchment
  if (gamePage.resPool.get('furs').value >= 175) { gamePage.craftAll('parchment') }

  // Craft parchment to manuscript, maintain 1 to 1 ratio
  if (kbUseUL('parchment') && kbUse('culture') && ((kbCultureResource.maxValue - (kbCultureResource.perTickCached * 6)) <= kbCultureResource.value) && (kbManuscriptResource.value < kbParchmentResource.value)) {
    gamePage.craft('manuscript', Math.round(0.5 + kbCultureResource.perTickCached * 5 / 400))
  }

  // Craft manuscript to compendium, maintain 1 to 1 ratio
  if (kbUseUL('manuscript') && kbUse('science') && ((kbScienceResource.maxValue - (kbScienceResource.perTickCached * 6)) <= kbScienceResource.value) && (kbCompendiumResource.value < kbManuscriptResource.value)) {
    gamePage.craft('compedium', Math.round(0.5 + kbScienceResource.perTickCached * 5 / 10000))
  }

  // Craft compendium to blueprint, maintain 1 to 1 ratio, unless Genetics hasn't been researched yet but is checked
  let kbGeneticsDiff = 0
  if (!(gamePage.science.metaCache.genetics.researched)) { kbGeneticsDiff = 1500 }
  if (kbUseUL('compendium') && kbUse('science') && ((kbScienceResource.maxValue - (kbScienceResource.perTickCached * 6)) <= kbScienceResource.value) && (kbBlueprintResource.value < (kbCompendiumResource.value - kbGeneticsDiff))) {
    gamePage.craft('blueprint', Math.round(0.5 + kbScienceResource.perTickCached * 5 / 25000))
  }

  // Use ALL Catpower for hunt
  if (kbUseUL('catpower') && ((kbCatpowerResource.maxValue - (kbCatpowerResource.perTickCached * 6)) <= kbCatpowerResource.value)) { console.log('hunting'); gamePage.resPool.village.huntAll() }

  // Auto Observe Astronomical Events
  if (document.getElementById('kb_observeEvents').checked) {
    const kbObserveButton = document.getElementById('observeBtn')
    if (typeof (kbObserveButton) !== 'undefined') {
      if (kbObserveButton != null) {
        kbObserveButton.click()
      }
    }
  }

  // CHEAT: Gather Enough
  if (document.getElementById('kb_gatherEnough').checked) {
    if (kbCatnipResource.value < ((gamePage.resPool.get('kittens').maxValue + 1) * 4.25)) { kbCatnipResource.value = ((gamePage.resPool.get('kittens').maxValue + 1) * 4.25) }
    if (kbCatnipResource.perTickCached < 0) { kbCatnipResource.value -= (kbCatnipResource.perTickCached * 5) }
  }

  // Gather 1 Catnip
  gamePage.bld.gatherCatnip()

  kbLimitConsumer()
}

// ########################################################################

function rgb2hex (rgb) {
  rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i)
  return (rgb && rgb.length === 4)
    ? '#' +
      ('0' + parseInt(rgb[1], 10).toString(16)).slice(-2) +
      ('0' + parseInt(rgb[2], 10).toString(16)).slice(-2) +
      ('0' + parseInt(rgb[3], 10).toString(16)).slice(-2)
    : ''
}

function kbToggleUI () {
  document.getElementById('kittyBotDiv').style.backgroundColor = rgb2hex(window.getComputedStyle(document.body, null).getPropertyValue('background-color'))
  $('#kittyBotDiv').toggle()
}

// ########################################################################

function kbBuildingUp (bldg) {
  const idx = kbBuildingNames.indexOf(bldg)
  if (idx !== 0) {
    document.getElementById('kb_buildings').insertBefore(document.getElementById('kb_bldDiv_' + kbBuildingNames[idx]), document.getElementById('kb_bldDiv_' + kbBuildingNames[idx - 1]))

    let temp

    temp = kbBuildingNames[idx]
    kbBuildingNames.splice(idx, 1)
    kbBuildingNames.splice(idx - 1, 0, temp)

    temp = kbBuildingLabels[idx]
    kbBuildingLabels.splice(idx, 1)
    kbBuildingLabels.splice(idx - 1, 0, temp)

    temp = kbBuyBuildingsMethods[idx]
    kbBuyBuildingsMethods.splice(idx, 1)
    kbBuyBuildingsMethods.splice(idx - 1, 0, temp)
  }
}

// ########################################################################

function kbBuildingdown (bldg) {
  const idx = kbBuildingNames.indexOf(bldg)
  if (idx !== kbBuildingNames.length - 1) {
    document.getElementById('kb_buildings').insertBefore(document.getElementById('kb_bldDiv_' + kbBuildingNames[idx + 1]), document.getElementById('kb_bldDiv_' + kbBuildingNames[idx]))

    let temp

    temp = kbBuildingNames[idx]
    kbBuildingNames.splice(idx, 1)
    kbBuildingNames.splice(idx + 1, 0, temp)

    temp = kbBuildingLabels[idx]
    kbBuildingLabels.splice(idx, 1)
    kbBuildingLabels.splice(idx + 1, 0, temp)

    temp = kbBuyBuildingsMethods[idx]
    kbBuyBuildingsMethods.splice(idx, 1)
    kbBuyBuildingsMethods.splice(idx + 1, 0, temp)
  }
}

// ########################################################################

function kbLimitConsumer () {
  const origTab = gamePage.ui.activeTabId
  gamePage.ui.activeTabId = 'Bonfire'
  gamePage.render()
  const limit = 0.5 // Only this percentage of the base recources are permitted to be consumed by the consumer.
  const woodPerTick = gamePage.resPool.resources[1].perTickCached
  const mineralsPerTick = gamePage.resPool.resources[2].perTickCached
  const smelter = gamePage.tabs[0].children.find(c => typeof (c.model.metadata) !== 'undefined' && c.model.metadata.name === 'smelter')
  if (typeof (smelter) !== 'undefined') {
    const smelterWoodPerTickCon = smelter.model.metadata.effects.woodPerTickCon
    const smelterMineralsPerTickCon = smelter.model.metadata.effects.mineralsPerTickCon
    let maxSmelterCount = Math.min(Math.floor((woodPerTick * limit) / Math.abs(smelterWoodPerTickCon)), Math.floor((mineralsPerTick * 0.5) / Math.abs(smelterMineralsPerTickCon)))

    if (maxSmelterCount < 0) maxSmelterCount = 0

    smelter.model.on = maxSmelterCount
    smelter.model.metadata.on = maxSmelterCount
    smelter.update()
  }
  gamePage.ui.activeTabId = origTab
  gamePage.render()
}

// ########################################################################

function kbUIAccess () {
  let tempString = ''
  const dPanel = document.getElementById('devPanel').parentNode
  const kittyBotUIaccess = document.createElement('span')
  const kittyBotUI = document.createElement('div')

  dPanel.insertBefore(kittyBotUIaccess, document.getElementById('devPanel'))
  tempString +=
   ' & ' +
   '<a onclick="kbToggleUI();" href="#">kittyBot</a>' +
   '<span style="font-size: small;"> ver 0.3 by LoyLT</span>'
  kittyBotUIaccess.innerHTML = tempString

  //    kittyBotUI.className = 'dialog help';

  kittyBotUI.id = 'kittyBotDiv'
  kittyBotUI.style.cssText = 'display: none; overflow: scroll; position: absolute; left: 400px; top: 75px; width: 850px; height: 90%; border-style: solid; background-color: #000000;'
  document.getElementById('gamePageContainer').appendChild(kittyBotUI)

  tempString = ''
  tempString +=
'<input type="checkbox" id="kittyBotRunningCheckbox" style="display: inline-block;" onClick="kittyBotToggle();" />kittyBot is running if this is checked.<br />' +
'<div style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
'<p><u>Spend Resources on:</u></p>' +
'<div id="kb_buildings" style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
'<p>Buildings & Space:<br />(Space not added yet)</p>' +
''

  for (let i = 0; i < kbBuildingNames.length; i++) {
    tempString += '<div id="kb_bldDiv_' + kbBuildingNames[i] + '">' +
             '<span style="border-style: solid; border-width: 1px;" onClick="kb_bldUp(\'' + kbBuildingNames[i] + '\');">up</span> | ' +
             '<span style="border-style: solid; border-width: 1px;" onClick="kb_bldDn(\'' + kbBuildingNames[i] + '\');">dn</span> &nbsp; ' +
             '<input id="kb_bldInput_' + kbBuildingNames[i] + '" type="checkbox" style="display: inline-block; vertical-align: sub;" checked />Building: ' + kbBuildingLabels[i] + '</div>'
  }

  tempString +=
'</div>' +
'<div style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
'<p>Science:</p>' +
''

  for (let i = 0; i < kbScienceNames.length; i++) {
    if ((!gamePage.science.get(kbScienceNames[i]).researched) && (i !== 6)) {
      tempString += '<div id="kb_sciDiv_' + kbScienceNames[i] + '"><input id="kb_sciInput_' + kbScienceNames[i] + '" type="checkbox" style="display: inline-block; vertical-align: sub;" checked />' + kbScienceLabels[i] + '</div>'
    }
  }

  tempString +=
'</div>' +
'</div>' +
'<div style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
'<p><u>Use Resources to build or craft</u></p>' +
'<div style="border-style: solid; border-width: 1px; padding: 5px;">' +
'<input id="kb_use_catnip0" type="radio" name="kb_use_catnip" value="0" style="vertical-align: sub;" />never' +
'<input id="kb_use_catnip1" type="radio" name="kb_use_catnip" value="1" style="vertical-align: sub;" />any' +
'<input id="kb_use_catnip2" type="radio" name="kb_use_catnip" value="2" style="vertical-align: sub;" checked />max | Catnip<br />' +
'<input id="kb_use_wood0" type="radio" name="kb_use_wood" value="0" style="vertical-align: sub;" />never' +
'<input id="kb_use_wood1" type="radio" name="kb_use_wood" value="1" style="vertical-align: sub;" checked />any' +
'<input id="kb_use_wood2" type="radio" name="kb_use_wood" value="2" style="vertical-align: sub;" />max | Wood<br />' +
'<input id="kb_use_minerals0" type="radio" name="kb_use_minerals" value="0" style="vertical-align: sub;" />never' +
'<input id="kb_use_minerals1" type="radio" name="kb_use_minerals" value="1" style="vertical-align: sub;" checked />any' +
'<input id="kb_use_minerals2" type="radio" name="kb_use_minerals" value="2" style="vertical-align: sub;" />max | Minerals<br />' +
'<input id="kb_use_iron0" type="radio" name="kb_use_iron" value="0" style="vertical-align: sub;" />never' +
'<input id="kb_use_iron1" type="radio" name="kb_use_iron" value="1" style="vertical-align: sub;" checked />any' +
'<input id="kb_use_iron2" type="radio" name="kb_use_iron" value="2" style="vertical-align: sub;" />max | Iron<br />' +
'<input id="kb_use_titanium0" type="radio" name="kb_use_titanium" value="0" style="vertical-align: sub;" />never' +
'<input id="kb_use_titanium1" type="radio" name="kb_use_titanium" value="1" style="vertical-align: sub;" checked />any' +
'<input id="kb_use_titanium2" type="radio" name="kb_use_titanium" value="2" style="vertical-align: sub;" />max | Titanium<br />' +
'<input id="kb_use_gold0" type="radio" name="kb_use_gold" value="0" style="vertical-align: sub;" />never' +
'<input id="kb_use_gold1" type="radio" name="kb_use_gold" value="1" style="vertical-align: sub;" checked />any' +
'<input id="kb_use_gold2" type="radio" name="kb_use_gold" value="2" style="vertical-align: sub;" />max | Gold<br />' +
'<input id="kb_use_oil0" type="radio" name="kb_use_oil" value="0" style="vertical-align: sub;" />never' +
'<input id="kb_use_oil1" type="radio" name="kb_use_oil" value="1" style="vertical-align: sub;" checked />any' +
'<input id="kb_use_oil2" type="radio" name="kb_use_oil" value="2" style="vertical-align: sub;" />max | Oil<br />' +
'<input id="kb_use_uranium0" type="radio" name="kb_use_uranium" value="0" style="vertical-align: sub;" />never' +
'<input id="kb_use_uranium1" type="radio" name="kb_use_uranium" value="1" style="vertical-align: sub;" checked />any' +
'<input id="kb_use_uranium2" type="radio" name="kb_use_uranium" value="2" style="vertical-align: sub;" />max | Uranium<br />' +
'<input id="kb_use_unobtainium0" type="radio" name="kb_use_unobtainium" value="0" style="vertical-align: sub;" />never' +
'<input id="kb_use_unobtainium1" type="radio" name="kb_use_unobtainium" value="1" style="vertical-align: sub;" checked />any' +
'<input id="kb_use_unobtainium2" type="radio" name="kb_use_unobtainium" value="2" style="vertical-align: sub;" />max | Unobtainium<br />' +
'<input id="kb_use_science0" type="radio" name="kb_use_science" value="0" style="vertical-align: sub;" />never' +
'<input id="kb_use_science1" type="radio" name="kb_use_science" value="1" style="vertical-align: sub;" />any' +
'<input id="kb_use_science2" type="radio" name="kb_use_science" value="2" style="vertical-align: sub;" checked />max | Science<br />' +
'<input id="kb_use_culture0" type="radio" name="kb_use_culture" value="0" style="vertical-align: sub;" />never' +
'<input id="kb_use_culture1" type="radio" name="kb_use_culture" value="1" style="vertical-align: sub;" />any' +
'<input id="kb_use_culture2" type="radio" name="kb_use_culture" value="2" style="vertical-align: sub;" checked />max | Culture<br />' +
'<input id="kb_use_faith0" type="radio" name="kb_use_faith" value="0" style="vertical-align: sub;" />never' +
'<input id="kb_use_faith1" type="radio" name="kb_use_faith" value="1" style="vertical-align: sub;" checked />any' +
'<input id="kb_use_faith2" type="radio" name="kb_use_faith" value="2" style="vertical-align: sub;" />max | Faith<br />' +
// kittens
'<input id="kb_use_antimatter0" type="radio" name="kb_use_antimatter" value="0" style="vertical-align: sub;" />never' +
'<input id="kb_use_antimatter1" type="radio" name="kb_use_antimatter" value="1" style="vertical-align: sub;" checked />any' +
'<input id="kb_use_antimatter2" type="radio" name="kb_use_antimatter" value="2" style="vertical-align: sub;" />max | Antimatter<br />' +
// temporalFlux
'<input id="kb_use_sorrow0" type="radio" name="kb_use_sorrow" value="0" style="vertical-align: sub;" />never' +
'<input id="kb_use_sorrow1" type="radio" name="kb_use_sorrow" value="1" style="vertical-align: sub;" checked />any' +
'<input id="kb_use_sorrow2" type="radio" name="kb_use_sorrow" value="2" style="vertical-align: sub;" />max | Sorrow<br />' +
'<br />' +
'<input id="kb_use_coal" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Coal<br />' +
'<input id="kb_use_catpower" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Catpower<br />' +
'<input id="kb_use_beam" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Beam<br />' +
'<input id="kb_use_slab" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Slab<br />' +
'<input id="kb_use_plate" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Plate<br />' +
'<input id="kb_use_steel" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Steel<br />' +
'<input id="kb_use_concrete" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Concrete<br />' +
'<input id="kb_use_gear" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Gear<br />' +
'<input id="kb_use_alloy" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Alloy<br />' +
'<input id="kb_use_eludium" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Eludium<br />' +
'<input id="kb_use_scaffold" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Scaffold<br />' +
'<input id="kb_use_ship" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Ship<br />' +
'<input id="kb_use_tanker" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Tanker<br />' +
'<input id="kb_use_kerosene" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Kerosene<br />' +
'<input id="kb_use_parchment" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Parchment<br />' +
'<input id="kb_use_manuscript" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Manuscript<br />' +
'<input id="kb_use_compendium" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Compendium<br />' +
'<input id="kb_use_blueprint" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Blueprint<br />' +
'<input id="kb_use_thorium" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Thorium<br />' +
'<input id="kb_use_megalith" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Megalith<br />' +
'<input id="kb_use_starchart" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Starchart<br />' +
'<input id="kb_use_unicorns" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Unicorns<br />' +
'<input id="kb_use_alicorn" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Alicorn<br />' +
'<input id="kb_use_tears" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Tears<br />' +
'<input id="kb_use_timeCrystal" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Time Crystal<br />' +
'<input id="kb_use_relic" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Relic<br />' +
'<input id="kb_use_void" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Void<br />' +
'</div>' +
'<p style="text-align: center;"><u>Cheats and Other Stuff</u></p>' +
'<div style="border-style: solid; border-width: 1px; padding: 5px;">' +
'<input id="kb_observeEvents" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Observe astronomical events<br />' +
'<input id="kb_gatherCatnip" type="radio" name="kb_gather" style="vertical-align: sub;" />Gather catnip (1/s)<br />' +
'<input id="kb_gatherEnough" type="radio" name="kb_gather" style="vertical-align: sub;" checked/>Gather enough to survive (cheat)<br />' +
'</div>' +
'</div>' +
''

  kittyBotUI.innerHTML = tempString
}

kbUIAccess()
