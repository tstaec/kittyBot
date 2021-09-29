
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
// - add festival automation
// - add time speed automation
// - Fix space missions being on same checkbox as space buildings

// Define global variables to satisfy ESLint
/* global gamePage */

// configurable variables
const kbRunInterval = 5000
const kbTicksPerSecond = 5

// ########################################################################

let kittyBotInterval = 0
let kbConfig = []

// eslint-disable-next-line no-unused-vars
function kittyBotToggle () {
  clearInterval(kittyBotInterval)
  if (document.getElementById('kb_use_bot').checked) {
    kittyBotInterval = setInterval(kittyBotGo, kbRunInterval)
  }
}

// ########################################################################

function kbBuildItems (activeTabName, tabIndex) {
  if (kbGetConfig('kb_use_' + activeTabName.toLowerCase()) !== 'checked') {
    return
  }
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
  if (activeTabName === 'Space') {
    // Get launch buttons
    buttons = gamePage.tabs[tabIndex].GCPanel.children.filter(b => b.model.visible && b.model.enabled && typeof (b.model.metadata) !== 'undefined')
    // Get planet buildings
    buttons = buttons.concat(gamePage.tabs[tabIndex].planetPanels.map(pp => pp.children.filter(b => b.model.visible && b.model.enabled && typeof (b.model.metadata) !== 'undefined')).flat())
  }
  buttons.forEach(btn => {
    try {
      if (
        document.getElementById('kb_input_' + btn.model.metadata.name).checked && kbCheckPrices(btn.model.prices)) {
        btn.controller.buyItem(btn.model, {}, function (result) { if (result) { console.log('built: ' + btn.model.name); btn.update() } })
      }
    } catch (err) { console.log('err(' + btn.model.name + '):' + err) }
  })
}

// ########################################################################

function kbSendCaravans () {
  gamePage.ui.activeTabId = 'Trade'
  gamePage.render()
  const tradeTarget = document.getElementById('kb_trade_routes').value
  if (tradeTarget !== 'kb_trade_none') {
    const targetButton = gamePage.tabs[4].racePanels.find(rp => rp.race.name === tradeTarget.replace('kb_trade_', ''))
    if (kbCheckPrices(targetButton.race.buys)) {
      targetButton.tradeBtn.controller.buyItem(targetButton.tradeBtn.model, {}, function (result) { if (result) { targetButton.tradeBtn.update() } })
    }
  }
}

// ########################################################################

function kbPromoteKittens () {
  gamePage.ui.activeTabId = 'Village'
  gamePage.render()
  if (document.getElementById('kb_promote').checked && kbUse('gold')) {
    const btn = gamePage.tabs[1].promoteKittensBtn
    if (btn.model.visible && btn.model.enabled) {
      btn.controller.buyItem(btn.model, {}, function (result) { if (result) { btn.update(); kbManageKittens() } })
    }
  }
}

// ########################################################################

function kbPraiseTheSun () {
  gamePage.ui.activeTabId = 'Religion'
  gamePage.render()
  // Only spend faith if there are no active religion research options
  const activeResearch = gamePage.tabs[5].zgUpgradeButtons.some(b => b.model.enabled && document.getElementById('kb_input_' + b.model.metadata.name).checked)
  if (!activeResearch && document.getElementById('kb_praise').checked && kbUse('faith')) {
    const btn = gamePage.tabs[5].praiseBtn
    if (btn.model.visible && btn.model.enabled) {
      btn.controller.buyItem(btn.model, {}, function (result) { if (result) { btn.update() } })
    }
  }
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
  gamePage.ui.activeTabId = 'Settlement'
  gamePage.render()
  const steamworks = gamePage.tabs[0].children.find(b => typeof (b.model.metadata) !== 'undefined' && b.model.metadata.name === 'steamworks')
  if (typeof (steamworks) !== 'undefined' && steamworks.model.visible) {
    steamworks.controller.onAll(steamworks.model)
    if (steamworks.model.metadata.isAutomationEnabled) {
      steamworks.controller.handleToggleAutomationLinkClick(steamworks.model)
    }
  }
}

// ########################################################################

function kbEnsureLeaderExists () {
  gamePage.ui.activeTabId = 'Settlement'
  gamePage.render()
  if (document.getElementById('kb_ensure_leader').checked) {
    const worker = gamePage.village.sim.kittens.sort(function (a, b) { return b.rank - a.rank })[0]
    if (typeof (worker) !== 'undefined' && gamePage.village.leader === null) {
      gamePage.village.leader = worker
      worker.isLeader = true
    }
  }
}

// ########################################################################

function kbBuildEmbassies () {
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
}

// ########################################################################

function kbSaveConfiguration () {
  kbConfig = Array.from(document.querySelectorAll('*[id^="kb_"]')).map(element => {
    const obj = {}
    obj.id = element.id
    obj.checked = element.checked
    return obj
  })
  const selectedRaceId = document.getElementById('kb_trade_routes').selectedOptions[0].value
  kbConfig.push({ id: 'kb_trade_selected', value: selectedRaceId })
  localStorage.setItem('kittenBot', JSON.stringify(kbConfig))
}

// ########################################################################

function kbUse (resourceName) {
  // Ignore resources that have only a single purpose and thus can not be missused.
  if (resourceName === 'furs') return true
  // Check if any value of resource should be used
  if (kbConfig.find(c => c.id === 'kb_use_' + resourceName + '1').checked) {
    return true
  } else {
    const rp = gamePage.resPool.get(resourceName)
    const useMaxBox = kbConfig.find(e => e.id === 'kb_use_' + resourceName + '2')
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
    const magicNumber = 1 // Yes this is magic, change it if the calculated amount is not exactly enough to max it our till the next run.
    return Math.ceil(resource.perTickCached * kbTicksPerSecond * (magicNumber + (kbRunInterval / 1000)) / material.val)
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
  if (kbGetConfig('kb_use_workshop_crafting', false) !== 'checked') {
    return
  }
  const button = gamePage.tabs[3].craftBtns.find(btn => btn.craftName === resourceName && btn.model.enabled && btn.model.visible)
  if (typeof (button) !== 'undefined') {
    gamePage.craftAll(button.craftName)
  }
}

function kbCraft () {
  if (kbGetConfig('kb_use_workshop_crafting', false) !== 'checked') {
    return
  }
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
  kbCraftWithRatio('alloy', 10)
  kbCraftWithRatio('eludium', 1)
  kbCraftWithRatio('thorium', Number.MIN_VALUE)
  kbCraftWithRatio('concrete', 100)
  // kbCraftWithRatio('tanker', 100) // not worth it currently
}

function kbSacrificeUnicorns () {
  gamePage.ui.activeTabId = 'Religion'
  gamePage.render()
  if (document.getElementById('kb_sacrifice_unicorns').checked && kbUse('unicorns')) {
    const btn = gamePage.tabs[5].sacrificeBtn
    if (typeof (btn) !== 'undefined' && btn !== null && btn.model.visible && btn.model.enabled) {
      btn.controller.buyItem(btn.model, {}, function (result) { if (result) { btn.update() } })
    }
  }
}

function kbPartyAllTheTime () {
  if (kbGetConfig('kb_start_festival', true) !== 'checked' || gamePage.calendar.festivalDays > 10) {
    return
  }
  gamePage.ui.activeTabId = 'Village'
  gamePage.render()
  const festivalButton = gamePage.tabs[1].festivalBtn
  if (typeof (festivalButton) !== 'undefined' && festivalButton.model.enabled && festivalButton.model.visible) {
    festivalButton.controller.buyItem(festivalButton.model, {}, function (result) { if (result) { festivalButton.update() } })
  }
}

// ########################################################################

function kittyBotGo () {
  const origTab = gamePage.ui.activeTabId
  kbBuildItems('Workshop', 3)
  kbBuildItems('Science', 2)
  kbBuildItems('Religion', 5)
  kbBuildItems('Space', 6)
  kbBuildItems('Bonfire', 0)
  kbSendCaravans()

  // Use ALL Catpower for hunt
  const kbCatpowerResource = gamePage.resPool.get('manpower')
  if (kbUse('manpower') && ((kbCatpowerResource.maxValue - (kbCatpowerResource.perTickCached * 6)) <= kbCatpowerResource.value)) { gamePage.resPool.village.huntAll() }

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
  kbPartyAllTheTime()
  // kbHandleAutomations()

  gamePage.ui.activeTabId = origTab
  gamePage.render()
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
    kbCreatUI()
  } else {
    botDiv.style.display = 'none'
    kbSaveConfiguration()
  }
}

// ########################################################################

function kbLimitConsumer () {
  gamePage.ui.activeTabId = 'Bonfire'
  gamePage.render()
  const limit = 0.5 // Only this percentage of the base recources are permitted to be consumed by the consumer.

  if (kbGetConfig('kb_limit_consumer') === 'checked') {
    const smelter = gamePage.tabs[0].children.find(c => typeof (c.model.metadata) !== 'undefined' && c.model.metadata.name === 'smelter')
    if (typeof (smelter) !== 'undefined') {
      const woodPerTick = gamePage.resPool.get('wood').perTickCached
      const mineralsPerTick = gamePage.resPool.get('minerals').perTickCached
      const smelterWoodPerTickCon = smelter.model.metadata.effects.woodPerTickCon
      const smelterMineralsPerTickCon = smelter.model.metadata.effects.mineralsPerTickCon
      const maxSmelterCount = Math.min(Math.floor((woodPerTick * limit) / Math.abs(smelterWoodPerTickCon)), Math.floor((mineralsPerTick * limit) / Math.abs(smelterMineralsPerTickCon)))
      kbSetConsumer(smelter, maxSmelterCount)
    }

    const mint = gamePage.tabs[0].children.find(c => typeof (c.model.metadata) !== 'undefined' && c.model.metadata.name === 'mint')
    if (typeof (mint) !== 'undefined') {
      const goldPerTick = gamePage.resPool.get('gold').perTickCached
      const catpowerPerTick = gamePage.resPool.get('manpower').perTickCached
      const mintGoldPerTickCon = mint.model.metadata.effects.goldPerTickCon
      const mintCatpowerPerTickCon = mint.model.metadata.effects.manpowerPerTickCon
      const maxMintCount = Math.min(Math.floor((goldPerTick * limit) / Math.abs(mintGoldPerTickCon)), Math.floor((catpowerPerTick * limit) / Math.abs(mintCatpowerPerTickCon)))
      kbSetConsumer(mint, maxMintCount)
    }

    const calciner = gamePage.tabs[0].children.find(c => typeof (c.model.metadata) !== 'undefined' && c.model.metadata.name === 'calciner')
    if (typeof (calciner) !== 'undefined') {
      const mineralsPerTick = gamePage.resPool.get('minerals').perTickCached
      const oilPerTick = gamePage.resPool.get('oil').perTickCached
      const calcinerOilPerTickCon = calciner.model.metadata.effects.oilPerTickCon
      const calcinerMineralsPerTickCon = calciner.model.metadata.effects.mineralsPerTickCon
      const maxCalcinerCount = Math.min(Math.floor((mineralsPerTick * limit) / Math.abs(calcinerMineralsPerTickCon)), Math.floor((oilPerTick * limit) / Math.abs(calcinerOilPerTickCon)))
      kbSetConsumer(calciner, maxCalcinerCount)
    }
  }
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

  dPanel.insertBefore(kittyBotUIaccess, document.getElementById('devPanel'))
  tempString +=
    ' & ' +
    '<a onclick="kbToggleUI();" href="#">kittyBot</a>' +
    '<span style="font-size: small;"> ver 0.4 by LoyLT & tstaec</span>'
  kittyBotUIaccess.innerHTML = tempString

  kbCreatUI()
  kittyBotToggle()
}

function kbGetConfig (key, defaultValue) {
  if (typeof (kbConfig) === 'undefined' || kbConfig === null) {
    kbConfig = []
  }
  const value = kbConfig.find(k => k.id === key)
  let checked = false
  if (typeof (value) === 'undefined') {
    checked = defaultValue
  } else {
    checked = value.checked
  }

  if (checked) {
    return 'checked'
  }
  return ''
}

function kbCreatUI () {
  let tempString = ''
  const origTab = gamePage.ui.activeTabId
  const kittyBotUI = document.createElement('div')
  const existingUI = document.getElementById('kittyBotDiv')
  kbConfig = JSON.parse(localStorage.getItem('kittenBot'))
  kittyBotUI.id = 'kittyBotDiv'
  if (typeof (existingUI) !== 'undefined' && existingUI !== null) {
    existingUI.remove()
  }
  kittyBotUI.style.cssText = 'display: inline; overflow: scroll; position: absolute; left: 400px; top: 75px; width: 850px; height: 90%; border-style: solid; background-color: #000000;'
  document.getElementById('gamePageContainer').appendChild(kittyBotUI)

  tempString = ''
  tempString +=
    '<input type="checkbox" id="kb_use_bot" style="display: inline-block;" onClick="kittyBotToggle();" ' + kbGetConfig('kb_use_bot', false) + '/>kittyBot is running if this is checked.<br />' +
    '<div style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
    '<p>Actions:</p>' +
    '<input id="kb_promote" type="checkbox" style="vertical-align: sub; display: inline-block;"  ' + kbGetConfig('kb_promote', true) + ' />Promote<br />' +
    '<input id="kb_manage" type="checkbox" style="vertical-align: sub; display: inline-block;" ' + kbGetConfig('kb_manage', true) + ' />Manage workers<br />' +
    '<input id="kb_ensure_leader" type="checkbox" style="vertical-align: sub; display: inline-block;" ' + kbGetConfig('kb_ensure_leader', true) + ' />Ensure Leader<br />' +
    '<input id="kb_build_embassies" type="checkbox" style="vertical-align: sub; display: inline-block;"  ' + kbGetConfig('kb_build_embassies', true) + ' />Build embassies<br />' +
    '<input id="kb_praise" type="checkbox" style="vertical-align: sub; display: inline-block;" ' + kbGetConfig('kb_praise', true) + ' />Praise the sun!<br />' +
    '<input id="kb_sacrifice_unicorns" type="checkbox" style="vertical-align: sub; display: inline-block;" ' + kbGetConfig('kb_sacrifice_unicorns', true) + ' />Sacrifice unicorns<br />' +
    '<input id="kb_limit_consumer" type="checkbox" style="vertical-align: sub; display: inline-block;" ' + kbGetConfig('kb_limit_consumer', true) + ' />Limit consumer<br />' +
    '<input id="kb_start_festival" type="checkbox" style="vertical-align: sub; display: inline-block;" ' + kbGetConfig('kb_start_festival', true) + ' />Start festivals<br />' +
    '<label for="kb_tradeRoutes">Send caravans to:</label>' +
    '<select name="kb_tradeRoutes" id="kb_trade_routes">' +
    '<option value="kb_trade_none">None</option>'

  gamePage.ui.activeTabId = 'Trade'
  gamePage.render()
  const selectedRace = kbConfig.find(c => c.id === 'kb_trade_selected')
  let raceId = 'kb_trade_none'
  if (typeof (selectedRace) !== 'undefined') {
    raceId = selectedRace.value
  }
  gamePage.tabs[4].racePanels.forEach(function (racePanel) {
    const id = 'kb_trade_' + racePanel.race.name
    let selectedValue = ''
    if (raceId === id) {
      selectedValue = 'selected="true"'
    }

    tempString += '<option value="' + id + '" ' + selectedValue + '>' + racePanel.race.title + '</option>'
  })

  tempString +=
    '</select>' +
    '</div>' +
    '<div style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
    '<p><u>Spend faith on:</u></p>' +
    '<div id="kb_faith_research" style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
    '<p><input id="kb_use_religion" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig('kb_use_religion', true) + ' />Religion</p>'

  gamePage.ui.activeTabId = 'Religion'
  gamePage.render()
  gamePage.tabs[5].rUpgradeButtons.forEach(function (faithResearch) {
    const id = 'kb_input_' + faithResearch.id
    tempString += '<div id="kb_faithDiv_' + faithResearch.id + '"><input id="' + id + '" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig(id, true) + ' />' + faithResearch.model.name + '</div>'
  })

  tempString +=
    '</div>' +
    '<div style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
    '<p><u>Spend tears on:</u></p>' +
    '<div id="kb_unicorn_upgrades" style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
    '<p><input id="kb_use_unicorn_upgrades" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig('kb_use_unicorn_upgrades', true) + ' />Unicorn upgrades</p>'

  gamePage.tabs[5].zgUpgradeButtons.forEach(function (unicornUpgrades) {
    const id = 'kb_input_' + unicornUpgrades.id
    tempString += '<div id="kb_unicornDiv_' + unicornUpgrades.id + '"><input id="' + id + '" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig(id, true) + ' />' + unicornUpgrades.model.name + '</div>'
  })

  tempString +=
    '</div>' +
    '<div style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
    '<p><u>Spend Resources on:</u></p>' +
    '<div id="kb_buildings" style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
    '<p><input id="kb_use_bonfire" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig('kb_use_bonfire', true) + ' />Buildings</p>'

  gamePage.ui.activeTabId = 'Bonfire'
  gamePage.render()
  gamePage.tabs[0].children.filter(b => typeof (b.model.metadata) !== 'undefined').forEach(function (buildingButton) {
    const id = 'kb_input_' + buildingButton.model.metadata.name
    tempString += '<div id="kb_bldDiv_' + buildingButton.model.metadata.name + '"><input id="' + id + '" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig(id, true) + ' />Building: ' + buildingButton.opts.name + '</div>'
  })

  tempString +=
    '</div>' +
    '<div id="kb_space" style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
    '<p><input id="kb_use_space" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig('kb_use_space', true) + ' />Space Buildings</p>'

  gamePage.ui.activeTabId = 'Space'
  gamePage.render()
  gamePage.tabs[6].planetPanels.map(pp => pp.children).flat().forEach(function (buildingButton) {
    const id = 'kb_input_' + buildingButton.id
    tempString += '<div id="kb_bldDiv_' + buildingButton.id + '"><input id="' + id + '" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig(id, true) + ' />Building: ' + buildingButton.model.name + '</div>'
  })

  tempString +=
    '</div>' +
    '<div style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
    '<p><input id="kb_use_science" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig('kb_use_science', true) + ' />Science</p>'

  gamePage.ui.activeTabId = 'Science'
  gamePage.render()
  gamePage.tabs[2].buttons.forEach(function (scienceButton) {
    if ((!scienceButton.model.metadata.researched) && scienceButton.id !== 'brewery') {
      const id = 'kb_input_' + scienceButton.id
      tempString += '<div id="kb_sciDiv_' + scienceButton.id + '"><input id="' + id + '" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig(id, true) + ' />' + scienceButton.model.name + '</div>'
    }
  })

  tempString +=
    '</div>' +
    '</div>' +
    '<div style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
    '<p><input id="kb_use_planet_missions" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig('kb_use_planet_missions', true) + ' />Planet missions</p>'

  gamePage.ui.activeTabId = 'Space'
  gamePage.render()
  gamePage.tabs[6].GCPanel.children.forEach(function (spaceBuildingButton) {
    if ((!spaceBuildingButton.model.on)) {
      const id = 'kb_input_' + spaceBuildingButton.id
      tempString += '<div id="kb_sciDiv_' + spaceBuildingButton.id + '"><input id="' + id + '" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig(id, true) + ' />' + spaceBuildingButton.model.name + '</div>'
    }
  })

  tempString +=
    '</div>' +

    '<div id="kb_workshop_research" style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
    '<p><input id="kb_use_workshop_upgrades" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig('kb_use_workshop_upgrades', true) + ' />Workshop upgrades</p>'

  gamePage.ui.activeTabId = 'Workshop'
  gamePage.render()
  gamePage.tabs[3].buttons.forEach(function (upgrade) {
    if (!upgrade.model.metadata.researched) {
      const id = 'kb_input_' + upgrade.model.metadata.name
      tempString += '<div id="kb_workshopDiv_' + upgrade.model.metadata.name + '"><input id="' + id + '" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig(id, true) + ' />' + upgrade.model.name + '</div>'
    }
  })

  tempString +=
    '</div>' +
    '<div id="kb_workshop_crafts" style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
    '<p><input id="kb_use_workshop_crafting" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig('kb_use_workshop_crafting', true) + ' />Workshop crafting</p>'

  gamePage.tabs[3].craftBtns.forEach(function (craftButton) {
    const id = 'kb_input_craft_' + craftButton.craftName
    tempString += '<div id="kb_workshopDiv_' + craftButton.craftName + '"><input id="' + id + '" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig(id, true) + ' />' + craftButton.model.name + '</div>'
  })

  tempString +=
    '</div>' +
    '</div>' +
    '<div style="align: center; vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
    '<p><u>Use Resources to build or craft</u></p>' +
    '<div style="border-style: solid; border-width: 1px; padding: 5px;">'

  gamePage.ui.activeTabId = 'Bonfire'
  gamePage.render()
  gamePage.resPool.resources.sort(r => r.maxValue === 0).forEach(function (resource) {
    if (resource.maxValue === 0) {
      const id = 'kb_use_' + resource.name + '1'
      tempString += '<input id="' + id + '" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig(id, true) + ' />' + resource.name + '<br />'
    } else {
      const id = 'kb_use_' + resource.name
      tempString += '<input id="' + id + '0" type="radio" name="' + id + '" value="0" style="vertical-align: sub;" ' + kbGetConfig(id + '0', false) + '/>never' +
        '<input id="' + id + '1" type="radio" name="' + id + '" value="1" style="vertical-align: sub;" ' + kbGetConfig(id + '1', false) + '/>any' +
        '<input id="' + id + '2" type="radio" name="' + id + '" value="2" style="vertical-align: sub;" ' + kbGetConfig(id + '2', true) + ' />max | ' + resource.name + '<br />'
    }
  })

  tempString +=
    '<p style="text-align: center;"><u>Cheats and Other Stuff</u></p>' +
    '<div style="border-style: solid; border-width: 1px; padding: 5px;">' +
    '<input id="kb_observeEvents" type="checkbox" style="vertical-align: sub; display: inline-block;" checked />Observe astronomical events<br />' +
    '<input id="kb_gatherCatnip" type="radio" name="kb_gather" style="vertical-align: sub;" />Gather catnip (1/s)<br />' +
    '<input id="kb_gatherEnough" type="radio" name="kb_gather" style="vertical-align: sub;" checked/>Gather enough to survive (cheat)<br />' +
    '</div>' +
    '</div>' +
    ''

  kittyBotUI.innerHTML = tempString

  gamePage.ui.activeTabId = origTab
  gamePage.render()
}

kbUIAccess()
