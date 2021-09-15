
// ##############################################################################
// # Original bot written by LoyLT, updated and expanded by tstaec              #
// # version 0.4, incomplete, no guarantee is given                             #
// #============================================================================#
// #              JavaScript add-on for bloodrizer's Kittens Game               #
// #                           https://kittensgame.com                          #
// ##############################################################################

// todo:
// -Do we really nned to switch active tab?
// - get rid of the resource variables
// - fix ui
// - fill ui from gamePage not list of names
// - Check ui when building shit

// Define global variables to satisfy ESLint
/* global gamePage */

// configurable variables
const kbCraftRatio = 2
const kbRunInterval = 5000
const kbTicksPerSecond = 5

// ########################################################################

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

// ########################################################################

let kittyBotInterval = 0
let kbUseArray = []

// eslint-disable-next-line no-unused-vars
function kittyBotToggle () {
  if (document.getElementById('kittyBotRunningCheckbox').checked) {
    kittyBotInterval = setInterval(kittyBotGo, kbRunInterval)
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
  if (activeTabName === 'Bonfire') {
    buttons = gamePage.tabs[tabIndex].children.filter(b => b.model.visible && b.model.enabled && typeof (b.model.metadata) !== 'undefined')
  }
  if (activeTabName === 'Religion') {
    buttons = gamePage.tabs[tabIndex].rUpgradeButtons.filter(b => b.model.visible && b.model.enabled && typeof (b.model.metadata) !== 'undefined')
  }
  buttons.forEach(btn => {
    try {
      if (kbCheckPrices(btn.model.prices)) {
        btn.controller.buyItem(btn.model, {}, function (result) { if (result) { console.log('built: ' + btn.model.name); btn.update() } })
      }
    } catch (err) { console.log('err:' + err) }
  })
  gamePage.ui.activeTabId = origTab
  gamePage.render()
}

// ########################################################################

function kbSendCaravans () {
  const origTab = gamePage.ui.activeTabId
  gamePage.ui.activeTabId = 'Trade'
  gamePage.render()
  const tradeTarget = document.getElementById('kb_trade_routes').value
  if (tradeTarget !== 'kb_trade_none') {
    const targetButton = gamePage.tabs[4].racePanels.find(rp => rp.race.name === tradeTarget.replace('kb_trade_', ''))
    if (kbCheckPrices(targetButton.race.buys)) {
      targetButton.tradeBtn.controller.buyItem(targetButton.tradeBtn.model, {}, function (result) { if (result) { targetButton.tradeBtn.update() } })
    }
  }
  gamePage.ui.activeTabId = origTab
  gamePage.render()
}

// ########################################################################

function kbPromoteKittens () {
  const origTab = gamePage.ui.activeTabId
  gamePage.ui.activeTabId = 'Village'
  gamePage.render()
  if (document.getElementById('kb_promote').checked && kbUse('gold')) {
    const btn = gamePage.tabs[1].promoteKittensBtn
    if (btn.model.visible && btn.model.enabled) {
      btn.controller.buyItem(btn.model, {}, function (result) { if (result) { btn.update(); kbManageKittens() } })
    }
  }
  gamePage.ui.activeTabId = origTab
  gamePage.render()
}

// ########################################################################

function kbPraiseTheSun () {
  const origTab = gamePage.ui.activeTabId
  gamePage.ui.activeTabId = 'Religion'
  gamePage.render()
  if (document.getElementById('kb_praise').checked && kbUse('faith')) {
    const btn = gamePage.tabs[5].praiseBtn
    if (btn.model.visible && btn.model.enabled) {
      btn.controller.buyItem(btn.model, {}, function (result) { if (result) { btn.update() } })
    }
  }
  gamePage.ui.activeTabId = origTab
  gamePage.render()
}

// ########################################################################

function kbManageKittens () {
  if (document.getElementById('kb_manage').checked) {
    const btn = gamePage.tabs[1].optimizeJobsBtn
    if (btn.model.visible && btn.model.enabled) {
      btn.controller.buyItem(btn.model, {}, function (result) { if (result) { btn.update() } })
    }
  }
}

// ########################################################################

function kbEnsureLeaderExists () {
  const origTab = gamePage.ui.activeTabId
  gamePage.ui.activeTabId = 'Settlement'
  gamePage.render()
  if (document.getElementById('kb_ensure_leader').checked) {
    const worker = gamePage.village.sim.kittens.sort(function (a, b) { return b.rank - a.rank })[0]
    if (typeof (worker) !== 'undefined' && gamePage.village.leader === null) {
      gamePage.village.leader = worker
      worker.isLeader = true
    }
  }
  gamePage.ui.activeTabId = origTab
  gamePage.render()
}

// ########################################################################

function kbBuildEmbassies () {
  const origTab = gamePage.ui.activeTabId
  gamePage.ui.activeTabId = 'Trade'
  gamePage.render()
  if (document.getElementById('kb_build_embassies').checked) {
    const race = gamePage.tabs[4].racePanels.find(rp => rp.embassyButton.model.enabled && rp.embassyButton.model.visible)
    if (typeof (race) !== 'undefined') {
      const embassyButton = race.embassyButton
      if (typeof (embassyButton) !== 'undefined' && kbUse('culture')) {
        try {
          embassyButton.controller.buyItem(embassyButton.model, {}, function (result) { if (result) { console.log('built embassy: ' + embassyButton.race.name); embassyButton.update() } })
        } catch (err) { console.log('err:' + err) }
      }
    }
  }
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
  // Ignore resources that have only a single purpose and thus can not be missused.
  if (resourceName === 'furs') return true
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

function kbCheckPrices (prices) {
  return prices.every(p => kbUse(p.name))
}

function kbCheckRatio (materials, targetResourceName, ratio) {
  return materials.every(function (material) {
    const resource = gamePage.resPool.get(material.name)
    const targetResource = gamePage.resPool.get(targetResourceName)
    const actualRatio = resource.value / targetResource.value
    // Only craft items if we would reach max storage in the next tick
    return resource.perTickCached > 0 &&
      actualRatio > ratio &&
      resource.maxValue - (resource.perTickCached * kbTicksPerSecond * (kbRunInterval / 1000)) <= resource.value
  })
}

function kbCalculateCraftAmount (materials) {
  return Math.min(materials.map(function (material) {
    const resource = gamePage.resPool.get(material.name)
    return Math.ceil(resource.perTickCached * kbTicksPerSecond * (kbRunInterval / 1000) / material.val)
  }))
}

// ########################################################################

function kbCraftWithRatio (resourceName, ratio) {
  const button = gamePage.tabs[3].craftBtns.find(btn => btn.craftName === resourceName && btn.model.enabled && btn.model.visible)
  if (typeof (button) !== 'undefined' && kbCheckPrices(button.model.prices) && kbCheckRatio(button.model.prices, button.craftName, ratio)) {
    gamePage.craft(button.craftName, kbCalculateCraftAmount(button.model.prices))
  }
}

function kbCraftAll (resourceName) {
  const button = gamePage.tabs[3].craftBtns.find(btn => btn.craftName === resourceName && btn.model.enabled && btn.model.visible)
  if (typeof (button) !== 'undefined') {
    gamePage.craftAll(button.craftName)
  }
}

function kbCraft (resourceName) {
  const origTab = gamePage.ui.activeTabId
  gamePage.ui.activeTabId = 'Workshop'
  gamePage.render()
  kbCraftWithRatio('beam', Number.MAX_VALUE)
  kbCraftWithRatio('scaffold', 0.2)
  kbCraftWithRatio('steel', Number.MAX_VALUE)
  kbCraftWithRatio('slab', Number.MAX_VALUE)
  kbCraftWithRatio('plate', Number.MAX_VALUE)
  kbCraftWithRatio('kerosene', Number.MAX_VALUE)
  kbCraftWithRatio('thorium', 10)
  kbCraftWithRatio('gear', 2)
  kbCraftAll('parchment')
  kbCraftWithRatio('manuscript', 2)
  kbCraftWithRatio('blueprint', 1)
  kbCraftWithRatio('compenmdium', 0.5)
  gamePage.ui.activeTabId = origTab
  gamePage.render()
}

// ########################################################################

function kittyBotGo () {
  kbBuildItems('Workshop', 3)
  kbBuildItems('Science', 2)
  kbBuildItems('Bonfire', 0)
  kbBuildItems('Religion', 5)
  kbSendCaravans()

  kbCraft()

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
  kbPromoteKittens()
  kbEnsureLeaderExists()
  kbBuildEmbassies()
  kbPraiseTheSun()
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
    // Check if the calculated smelter count is bigger than the possible smelter count.
    if (maxSmelterCount > smelter.model.metadata.val) maxSmelterCount = smelter.model.metadata.val

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
'<p>Actions:</p>' +
'<input id="kb_promote" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Promote<br />' +
'<input id="kb_manage" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Manage workers<br />' +
'<input id="kb_ensure_leader" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Ensure Leader<br />' +
'<input id="kb_build_embassies" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Build embassies<br />' +
'<input id="kb_praise" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Praise the sun!<br />' +
'<label for="kb_tradeRoutes">Send caravans to:</label>' +
'<select name="kb_tradeRoutes" id="kb_trade_routes">' +
'<option value="kb_trade_none">None</option>'

  const origTab = gamePage.ui.activeTabId
  gamePage.ui.activeTabId = 'Trade'
  gamePage.render()
  gamePage.tabs[4].racePanels.forEach(function (racePanel) {
    tempString += '<option value="kb_trade_' + racePanel.race.name + '">' + racePanel.race.title + '</option>'
  })
  gamePage.ui.activeTabId = origTab
  gamePage.render()

  tempString +=
'</select>' +
'</div>' +
'<div style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
'<p><u>Spend faith on:</u></p>' +
'<div id="kb_faith_research" style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
'<p>Religion research</p>' +
''
  gamePage.tabs[5].rUpgradeButtons.forEach(function (faithResearch) {
    tempString += '<div id="kb_faithDiv_' + faithResearch.id + '"><input id="kb_faithInput_' + faithResearch.id + '" type="checkbox" style="display: inline-block; vertical-align: sub;" checked />' + faithResearch.model.name + '</div>'
  })

  tempString +=
'</div>' +
'<div style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
'<p><u>Spend Resources on:</u></p>' +
'<div id="kb_buildings" style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
'<p>Buildings & Space:<br />(Space not added yet)</p>'

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
'<input id="kb_use_gold1" type="radio" name="kb_use_gold" value="1" style="vertical-align: sub;" />any' +
'<input id="kb_use_gold2" type="radio" name="kb_use_gold" value="2" style="vertical-align: sub;" checked />max | Gold<br />' +
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
'<input id="kb_use_faith1" type="radio" name="kb_use_faith" value="1" style="vertical-align: sub;" />any' +
'<input id="kb_use_faith2" type="radio" name="kb_use_faith" value="2" style="vertical-align: sub;" checked />max | Faith<br />' +
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
