
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

let kittyBotInterval = 0
let kbUseArray = []

// eslint-disable-next-line no-unused-vars
function kittyBotToggle () {
  if (document.getElementById('kittyBotRunningCheckbox').checked) {
    kittyBotInterval = setInterval(kittyBotGo, 5000)
  } else {
    clearInterval(kittyBotInterval)
  }
}

// ########################################################################

function kbBuildItems (activeTabName, tabIndex) {
  const origTab = gamePage.ui.activeTabId
  gamePage.ui.activeTabId = activeTabName
  gamePage.render()
  let buttons = gamePage.tabs[tabIndex].buttons.filter(b => b.model.visible && b.model.enabled && typeof (b.model.metadata) !== 'undefined')
  // Bonfire tab contains the buttons as children not buttons.
  if (buttons.length === 0) {
    buttons = gamePage.tabs[tabIndex].children.filter(b => b.model.visible && b.model.enabled && typeof (b.model.metadata) !== 'undefined')
  }
  buttons.forEach(btn => {
    try {
      const requiredResources = btn.model.prices.map(p => p.name)
      if (requiredResources.every(r => kbUse(r))) {
        btn.controller.buyItem(btn.model, {}, function (result) { if (result) { console.log('built: ' + btn.model.name); btn.update() } })
      }
    } catch (err) { console.log('err:' + err) }
  })
  gamePage.ui.activeTabId = origTab
  gamePage.render()
}

// ########################################################################

function kbReloadUseConfiguration () {
  kbUseArray = Array.from(document.querySelectorAll('*[id^="kb_use_"]')).map(element => {
    const obj = {}
    obj.id = element.id
    obj.checked = element.checked
    return obj
  })
}

// ########################################################################

function kbUse (resourceName) {
  // Check if any value of resource should be used
  if (kbUseArray.find(c => c.id === 'kb_use_' + resourceName + '1').checked) {
    return true
  } else {
    const rp = gamePage.resPool.get(resourceName)
    const useMaxBox = kbUseArray.find(e => e.id === 'kb_use_' + resourceName + '2')
    // Check if only maxed resources should be used and resources are atmax level
    // Crafted resources dont have a max level and as such are missing the checkbox with '2' suffix
    if (typeof (useMaxBox) !== 'undefined' && useMaxBox.checked && rp.perTickCached >= 0) {
      return (rp.maxValue <= ((rp.perTickCached * 11) + rp.value))
    }
  }
  // Either 'none' checkbox is selected or not enough resources are available
  return false
}

// ########################################################################

function kittyBotGo () {
  kbBuildItems('Workshop', 3)
  kbBuildItems('Science', 2)
  kbBuildItems('Bonfire', 0)

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
  if (kbUse('coal') && (kbCoalResource.value >= 100)) { gamePage.craftAll('steel') }

  // Craft Steel to Gear (Oil Well needs smallest ratio, 2 steel to 1 gear, so let's maintain that ratio)
  if (kbUse('steel') && (kbGearResource.value < kbSteelResource.value / 2)) { gamePage.craft('gear', 1) }

  // Craft ALL furs to parchment
  if (gamePage.resPool.get('furs').value >= 175) { gamePage.craftAll('parchment') }

  // Craft parchment to manuscript, maintain 1 to 1 ratio
  if (kbUse('parchment') && kbUse('culture') && ((kbCultureResource.maxValue - (kbCultureResource.perTickCached * 6)) <= kbCultureResource.value) && (kbManuscriptResource.value < kbParchmentResource.value)) {
    gamePage.craft('manuscript', Math.round(0.5 + kbCultureResource.perTickCached * 5 / 400))
  }

  // Craft manuscript to compendium, maintain 1 to 1 ratio
  if (kbUse('manuscript') && kbUse('science') && ((kbScienceResource.maxValue - (kbScienceResource.perTickCached * 6)) <= kbScienceResource.value) && (kbCompendiumResource.value < kbManuscriptResource.value)) {
    gamePage.craft('compedium', Math.round(0.5 + kbScienceResource.perTickCached * 5 / 10000))
  }

  // Craft compendium to blueprint, maintain 1 to 1 ratio, unless Genetics hasn't been researched yet but is checked
  let kbGeneticsDiff = 0
  if (!(gamePage.science.metaCache.genetics.researched)) { kbGeneticsDiff = 1500 }
  if (kbUse('compendium') && kbUse('science') && ((kbScienceResource.maxValue - (kbScienceResource.perTickCached * 6)) <= kbScienceResource.value) && (kbBlueprintResource.value < (kbCompendiumResource.value - kbGeneticsDiff))) {
    gamePage.craft('blueprint', Math.round(0.5 + kbScienceResource.perTickCached * 5 / 25000))
  }

  // Use ALL Catpower for hunt
  if (kbUse('catpower') && ((kbCatpowerResource.maxValue - (kbCatpowerResource.perTickCached * 6)) <= kbCatpowerResource.value)) { console.log('hunting'); gamePage.resPool.village.huntAll() }

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

// eslint-disable-next-line no-unused-vars
function kbToggleUI () {
  const botDiv = document.getElementById('kittyBotDiv')
  botDiv.style.backgroundColor = rgb2hex(window.getComputedStyle(document.body, null).getPropertyValue('background-color'))
  if (botDiv.style.display === 'none') {
    botDiv.style.display = 'inline'
  } else {
    botDiv.style.display = 'none'
  }
  kbReloadUseConfiguration()
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
   '<span style="font-size: small;"> ver 0.4 by LoyLT & tstaec</span>'
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
'<input id="kb_use_coal1" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Coal<br />' +
'<input id="kb_use_catpower1" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Catpower<br />' +
'<input id="kb_use_beam1" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Beam<br />' +
'<input id="kb_use_slab1" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Slab<br />' +
'<input id="kb_use_plate1" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Plate<br />' +
'<input id="kb_use_steel1" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Steel<br />' +
'<input id="kb_use_concrete1" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Concrete<br />' +
'<input id="kb_use_gear1" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Gear<br />' +
'<input id="kb_use_alloy1" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Alloy<br />' +
'<input id="kb_use_eludium1" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Eludium<br />' +
'<input id="kb_use_scaffold1" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Scaffold<br />' +
'<input id="kb_use_ship1" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Ship<br />' +
'<input id="kb_use_tanker1" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Tanker<br />' +
'<input id="kb_use_kerosene1" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Kerosene<br />' +
'<input id="kb_use_parchment1" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Parchment<br />' +
'<input id="kb_use_manuscript1" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Manuscript<br />' +
'<input id="kb_use_compendium1" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Compendium<br />' +
'<input id="kb_use_blueprint1" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Blueprint<br />' +
'<input id="kb_use_thorium1" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Thorium<br />' +
'<input id="kb_use_megalith1" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Megalith<br />' +
'<input id="kb_use_starchart1" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Starchart<br />' +
'<input id="kb_use_unicorns1" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Unicorns<br />' +
'<input id="kb_use_alicorn1" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Alicorn<br />' +
'<input id="kb_use_tears1" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Tears<br />' +
'<input id="kb_use_timeCrystal1" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Time Crystal<br />' +
'<input id="kb_use_relic1" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Relic<br />' +
'<input id="kb_use_void1" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Void<br />' +
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
