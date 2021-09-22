
// ##############################################################################
// # Original bot written by LoyLT, updated and expanded by tstaec              #
// # version 0.4, incomplete, no guarantee is given                             #
// #============================================================================#
// #              JavaScript add-on for bloodrizer's Kittens Game               #
// #                           https://kittensgame.com                          #
// ##############################################################################

// todo:
// - Do we really need to switch active tab?
// - fix ui
// - fill ui from gamePage not list of names
// - consider craft bonus while crafting
// - add all the craftable resources

// Define global variables to satisfy ESLint
/* global gamePage */

// configurable variables
const kbRunInterval = 5000
const kbTicksPerSecond = 5

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
    // Get faith upgrades
    buttons = gamePage.tabs[tabIndex].rUpgradeButtons.filter(b => b.model.visible && b.model.enabled && typeof (b.model.metadata) !== 'undefined')
    // Get unicorn upgrades
    buttons = buttons.concat(gamePage.tabs[tabIndex].zgUpgradeButtons.filter(b => b.model.visible && b.model.enabled && typeof (b.model.metadata) !== 'undefined'))
  }
  buttons.forEach(btn => {
    try {
      if (
        document.getElementById('kb_input_' + btn.model.metadata.name).checked && kbCheckPrices(btn.model.prices)) {
        btn.controller.buyItem(btn.model, {}, function (result) { if (result) { console.log('built: ' + btn.model.name); btn.update() } })
      }
    } catch (err) { console.log('err(' + btn.model.name + '):' + err) }
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
  // Only spend faith if there are no active religion research options
  const activeResearch = gamePage.tabs[5].zgUpgradeButtons.some(b => b.model.enabled)
  if (!activeResearch && document.getElementById('kb_praise').checked && kbUse('faith')) {
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

function kbHandleAutomations () {
  const origTab = gamePage.ui.activeTabId
  gamePage.ui.activeTabId = 'Settlement'
  gamePage.render()
  const steamworks = gamePage.tabs[0].children.find(b => typeof (b.model.metadata) !== 'undefined' && b.model.metadata.name === 'steamworks')
  if (typeof (steamworks) !== 'undefined' && steamworks.model.visible) {
    steamworks.controller.onAll(steamworks.model)
    if (steamworks.model.metadata.isAutomationEnabled) {
      steamworks.controller.handleToggleAutomationLinkClick(steamworks.model)
    }
  }
  gamePage.ui.activeTabId = origTab
  gamePage.render()
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
        } catch (err) { console.log('err(' + embassyButton.model.name + '):' + err) }
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
    // Check if only maxed resources should be used and resources are at max level
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
    return (!isFinite(actualRatio) || actualRatio > ratio) &&
      (resource.craftable || (resource.maxValue - (resource.perTickCached * kbTicksPerSecond * (kbRunInterval / 1000)) <= resource.value))
  })
}

function kbCalculateCraftAmount (materials, ratio, targetResourceName) {
  // console.log(targetResourceName)
  return Math.min(...materials.map(function (material) {
    const resource = gamePage.resPool.get(material.name)
    // wood is craftable because it can be transformed from catnip but should not betreated as such
    // starcharts are not craftables but are not generated most ofthe time either
    if (resource.name === 'starchart' || (resource.craftable && resource.name !== 'wood')) {
      return kbCalculateCraftAmountForCraftable(resource, material, ratio, targetResourceName)
    }
    return Math.ceil(resource.perTickCached * kbTicksPerSecond * (kbRunInterval / 1000) / material.val)
  }))
}

function kbCalculateCraftAmountForCraftable (resource, material, ratio, targetResourceName) {
  const targetResource = gamePage.resPool.get(targetResourceName)
  // This is the magic. The formula calculates the resources needed to be used to achieve the desired ratio.
  // Base formula: (1/r)*(y-x)=v+(x/c). r = ratio, y = current amount of base resources, x = base resources needed to be crafted to achieve ratio,
  // v = existing target resources, c = cost to craft resources. Solved by wolfram alpha to: x = (c*y - c*r*v)/(c+r)
  const resourcesNeeded = Math.floor((material.val * resource.value - material.val * ratio * targetResource.value) / (material.val + ratio))
  // console.log('magic ' + material.name + ' ' + resourcesNeeded + ':' + Math.floor(resourcesNeeded / material.val))
  // console.log(material.val + ' : ' + ratio + ' + ' + resource.value + ' : ' + targetResource.value)
  return Math.floor(resourcesNeeded / material.val)
}

// ########################################################################

function kbCraftWithRatio (resourceName, ratio) {
  const button = gamePage.tabs[3].craftBtns.find(btn => btn.craftName === resourceName && btn.model.enabled && btn.model.visible)
  if (typeof (button) !== 'undefined' && kbCheckPrices(button.model.prices) && kbCheckRatio(button.model.prices, button.craftName, ratio)) {
    try {
      gamePage.craft(button.craftName, kbCalculateCraftAmount(button.model.prices, ratio, resourceName))
    } catch (err) { console.log('err(' + button.model.name + '):' + err) }
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
  kbCraftWithRatio('beam', Number.MIN_VALUE)
  kbCraftWithRatio('scaffold', 2)
  kbCraftWithRatio('steel', Number.MIN_VALUE)
  kbCraftWithRatio('slab', Number.MIN_VALUE)
  kbCraftWithRatio('plate', Number.MIN_VALUE)
  kbCraftWithRatio('kerosene', Number.MIN_VALUE)
  kbCraftWithRatio('thorium', 10)
  kbCraftWithRatio('gear', 15)
  kbCraftAll('parchment')
  kbCraftWithRatio('manuscript', 2)
  kbCraftWithRatio('compedium', 1)// [sic]
  kbCraftWithRatio('blueprint', 1)
  kbCraftWithRatio('megalith', 10)
  kbCraftWithRatio('ship', Number.MIN_VALUE)
  kbCraftWithRatio('alloy', 100)
  // kbCraftWithRatio('tanker', 100) // not worth it currently
  gamePage.ui.activeTabId = origTab
  gamePage.render()
}

function kbSacrificeUnicorns () {
  const origTab = gamePage.ui.activeTabId
  gamePage.ui.activeTabId = 'Religion'
  gamePage.render()
  if (document.getElementById('kb_sacrifice_unicorns').checked && kbUse('unicorns')) {
    const btn = gamePage.tabs[5].sacrificeBtn
    if (btn.model.visible && btn.model.enabled) {
      btn.controller.buyItem(btn.model, {}, function (result) { if (result) { btn.update() } })
    }
  }
  gamePage.ui.activeTabId = origTab
  gamePage.render()
}
// ########################################################################

function kittyBotGo () {
  kbBuildItems('Workshop', 3)
  kbBuildItems('Science', 2)
  kbBuildItems('Religion', 5)
  kbBuildItems('Bonfire', 0)
  kbSendCaravans()
  // Use ALL Catpower for hunt
  const kbCatpowerResource = gamePage.resPool.get('manpower')
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
    const kbCatnipResource = gamePage.resPool.get('catnip')
    if (kbCatnipResource.value < ((gamePage.resPool.get('kittens').maxValue + 1) * 4.25)) { kbCatnipResource.value = ((gamePage.resPool.get('kittens').maxValue + 1) * 4.25) }
    if (kbCatnipResource.perTickCached < 0) { kbCatnipResource.value -= (kbCatnipResource.perTickCached * kbTicksPerSecond * (kbRunInterval / 1000)) }
  }

  // Gather 1 Catnip
  gamePage.bld.gatherCatnip()

  kbCraft()
  kbSacrificeUnicorns()
  kbPromoteKittens()
  kbEnsureLeaderExists()
  kbBuildEmbassies()
  kbPraiseTheSun()
  kbLimitConsumer()
  kbHandleAutomations()
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
  const woodPerTick = gamePage.resPool.get('wood').perTickCached
  const mineralsPerTick = gamePage.resPool.get('minerals').perTickCached
  const smelter = gamePage.tabs[0].children.find(c => typeof (c.model.metadata) !== 'undefined' && c.model.metadata.name === 'smelter')
  if (typeof (smelter) !== 'undefined') {
    const smelterWoodPerTickCon = smelter.model.metadata.effects.woodPerTickCon
    const smelterMineralsPerTickCon = smelter.model.metadata.effects.mineralsPerTickCon
    const maxSmelterCount = Math.min(Math.floor((woodPerTick * limit) / Math.abs(smelterWoodPerTickCon)), Math.floor((mineralsPerTick * limit) / Math.abs(smelterMineralsPerTickCon)))
    kbSetConsumer(smelter, maxSmelterCount)
  }

  const goldPerTick = gamePage.resPool.get('gold').perTickCached
  const catpowerPerTick = gamePage.resPool.get('manpower').perTickCached
  const mint = gamePage.tabs[0].children.find(c => typeof (c.model.metadata) !== 'undefined' && c.model.metadata.name === 'mint')
  if (typeof (mint) !== 'undefined') {
    const mintGoldPerTickCon = mint.model.metadata.effects.goldPerTickCon
    const mintCatpowerPerTickCon = mint.model.metadata.effects.manpowerPerTickCon
    const maxMintCount = Math.min(Math.floor((goldPerTick * limit) / Math.abs(mintGoldPerTickCon)), Math.floor((catpowerPerTick * limit) / Math.abs(mintCatpowerPerTickCon)))
    kbSetConsumer(mint, maxMintCount)
  }

  gamePage.ui.activeTabId = origTab
  gamePage.render()
}

function kbSetConsumer (building, maxConsumerCount) {
  if (maxConsumerCount < 0) maxConsumerCount = 0
  // Check if the calculated smelter count is bigger than the possible smelter count.
  if (maxConsumerCount > building.model.metadata.val) maxConsumerCount = building.model.metadata.val
  if (maxConsumerCount !== building.model.on) {
    building.model.on = maxConsumerCount
    building.model.metadata.on = maxConsumerCount
    building.update()
  }
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
'<input id="kb_sacrifice_unicorns" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Sacrifice unicorns<br />' +
'<label for="kb_tradeRoutes">Send caravans to:</label>' +
'<select name="kb_tradeRoutes" id="kb_trade_routes">' +
'<option value="kb_trade_none">None</option>'

  let origTab = gamePage.ui.activeTabId
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
  origTab = gamePage.ui.activeTabId
  gamePage.ui.activeTabId = 'Religion'
  gamePage.render()
  gamePage.tabs[5].rUpgradeButtons.forEach(function (faithResearch) {
    tempString += '<div id="kb_faithDiv_' + faithResearch.id + '"><input id="kb_input_' + faithResearch.id + '" type="checkbox" style="display: inline-block; vertical-align: sub;" checked />' + faithResearch.model.name + '</div>'
  })
  gamePage.ui.activeTabId = origTab
  gamePage.render()

  tempString +=
'</div>' +
'<div style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
'<p><u>Spend tears on:</u></p>' +
'<div id="kb_unicorn_upgrades" style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
'<p>Unicorn upgrades</p>' +
''
  origTab = gamePage.ui.activeTabId
  gamePage.ui.activeTabId = 'Religion'
  gamePage.render()
  gamePage.tabs[5].zgUpgradeButtons.forEach(function (unicornUpgrades) {
    tempString += '<div id="kb_unicornDiv_' + unicornUpgrades.id + '"><input id="kb_input_' + unicornUpgrades.id + '" type="checkbox" style="display: inline-block; vertical-align: sub;" checked />' + unicornUpgrades.model.name + '</div>'
  })
  gamePage.ui.activeTabId = origTab
  gamePage.render()

  tempString +=
'</div>' +
'<div style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
'<p><u>Spend Resources on:</u></p>' +
'<div id="kb_buildings" style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
'<p>Buildings & Space:<br />(Space not added yet)</p>'

  origTab = gamePage.ui.activeTabId
  gamePage.ui.activeTabId = 'Bonfire'
  gamePage.render()
  gamePage.tabs[0].children.filter(b => typeof (b.model.metadata) !== 'undefined').forEach(function (buildingButton) {
    tempString += '<div id="kb_bldDiv_' + buildingButton.model.metadata.name + '"><input id="kb_input_' + buildingButton.model.metadata.name + '" type="checkbox" style="display: inline-block; vertical-align: sub;" checked />Building: ' + buildingButton.opts.name + '</div>'
  })
  gamePage.ui.activeTabId = origTab
  gamePage.render()
  tempString +=
'</div>' +
'<div style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
'<p>Science:</p>' +
''
  origTab = gamePage.ui.activeTabId
  gamePage.ui.activeTabId = 'Science'
  gamePage.render()
  gamePage.tabs[2].buttons.forEach(function (scienceButton) {
    if ((!scienceButton.model.metadata.researched) && scienceButton.id !== 'brewery') {
      tempString += '<div id="kb_sciDiv_' + scienceButton.id + '"><input id="kb_input_' + scienceButton.id + '" type="checkbox" style="display: inline-block; vertical-align: sub;" checked />' + scienceButton.model.name + '</div>'
    }
  })
  gamePage.ui.activeTabId = origTab
  gamePage.render()

  tempString +=
'</div>' +
'</div>' +
'<div id="kb_faith_research" style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
'<p>Workshop upgrades</p>' +
''
  origTab = gamePage.ui.activeTabId
  gamePage.ui.activeTabId = 'Workshop'
  gamePage.render()
  gamePage.tabs[3].buttons.forEach(function (upgrade) {
    if (!upgrade.model.metadata.researched) {
      tempString += '<div id="kb_workshopDiv_' + upgrade.model.metadata.name + '"><input id="kb_input_' + upgrade.model.metadata.name + '" type="checkbox" style="display: inline-block; vertical-align: sub;" checked />' + upgrade.model.name + '</div>'
    }
  })
  gamePage.ui.activeTabId = origTab
  gamePage.render()

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
'<input id="kb_use_compedium1" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Compendium<br />' +
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
'<input id="kb_use_ivory1" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Ivory<br />' +
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
