
// ##############################################################################
// # Original bot written by LoyLT, updated and expanded by tstaec              #
// # version 0.4, incomplete, no guarantee is given                             #
// #============================================================================#
// #              JavaScript add-on for bloodrizer's Kittens Game               #
// #                           https://kittensgame.com                          #
// ##############################################################################

// todo:
// - Do we really need to switch active tab? -> Yes otherwise the other buttons on the page do not get updated.
// - fix ui
// - make function for getConfig with return type bool
// - do not build last house
// - smarter trading so more stuff gets traded
// - bls generation

// Define global variables to satisfy ESLint
/* global gamePage */

// configurable variables
const kbRunInterval = 5000
const kbTicksPerSecond = 5

// ########################################################################

let kittyBotInterval = 0
let kbConfig = []
let kbRaces = {}
let kbBuildings = {}
let kbUnicornUpgrades = {}
let kbFaithUpgrades = {}
let kbSpaceBuildings = {}
let kbScienceUpgrades = {}
let kbSpaceTravel = {}
let kbWorkshopUpgrades = {}
let kbJobs = {}
let kbBuildingUpgrades = {}

// eslint-disable-next-line no-unused-vars
function kittyBotToggle () {
  clearInterval(kittyBotInterval)
  if (document.getElementById('kb_use_bot').checked) {
    kittyBotInterval = setInterval(kittyBotGo, kbRunInterval)
  }
}

// ########################################################################

function kbBuildItems (activeTabName, tabIndex) {
  let didStuff = false
  do {
    if (kbGetConfig('kb_use_' + activeTabName.toLowerCase(), false) !== 'checked' && activeTabName !== 'Space') {
      return
    }
    gamePage.ui.activeTabId = activeTabName
    gamePage.render()
    didStuff = false
    let buttons = gamePage.tabs[tabIndex].buttons.filter(b => b.model.visible && b.model.enabled && typeof (b.model.metadata) !== 'undefined')
    // Bonfire tab contains the buttons as children not buttons.
    if (activeTabName === 'Bonfire') {
      buttons = gamePage.tabs[tabIndex].children.filter(b => b.model.visible && b.model.enabled && typeof (b.model.metadata) !== 'undefined')
    }
    if (activeTabName === 'Religion') {
      // Get faith upgrades
      buttons = gamePage.tabs[tabIndex].rUpgradeButtons.filter(b => b.model.visible && b.model.enabled && typeof (b.model.metadata) !== 'undefined')
    }
    if (activeTabName === 'Space') {
      // Get launch buttons
      if (kbGetConfig('kb_use_planet_missions', false) === 'checked') {
        buttons = gamePage.tabs[tabIndex].GCPanel.children.filter(b => b.model.visible && b.model.enabled && typeof (b.model.metadata) !== 'undefined')
      }
      // Get planet buildings
      buttons = buttons.concat(gamePage.tabs[tabIndex].planetPanels.map(pp => pp.children.filter(b => b.model.visible && b.model.enabled && typeof (b.model.metadata) !== 'undefined')).flat())
    }
    buttons.forEach(btn => {
      try {
        if (kbGetConfig('kb_input_' + btn.model.metadata.name, true) === 'checked' && kbCheckPrices(btn.model.prices)) {
          btn.controller.buyItem(btn.model, {}, function (result) {
            if (result) {
              console.log('built: ' + btn.model.name)
              btn.update()
              didStuff = true
            }
          })
        }
      } catch (err) { console.log('err(' + btn.model.name + '):' + err) }
    })
  }
  while (didStuff)
}

function kbBuildUnicornBuildings () {
  if (kbGetConfig('kb_use_unicorn_upgrades', false) === 'checked') {
    // Get unicorn upgrades
    const buttons = gamePage.tabs[5].zgUpgradeButtons.filter(b =>
      b.model.visible &&
      typeof (b.model.metadata) !== 'undefined' &&
      kbGetConfig('kb_input_' + b.model.metadata.name, true) === 'checked' &&
      typeof (b.model.metadata.effects.unicornsRatioReligion) !== 'undefined')
    let currentBestRatio = Number.MAX_VALUE
    let currentBestButton = null
    buttons.forEach(button => {
      const extTearPrice = button.model.prices.find(p => p.name === 'tears').val
      const ratio = extTearPrice / button.model.metadata.effects.unicornsRatioReligion
      if (ratio < currentBestRatio) {
        currentBestRatio = ratio
        currentBestButton = button
      }
    })
    if (currentBestButton !== null && currentBestButton.model.enabled) {
      try {
        currentBestButton.controller.buyItem(currentBestButton.model, {}, function (result) { if (result) { console.log('built: ' + currentBestButton.model.name); currentBestButton.update() } })
      } catch (err) { console.log('err(' + currentBestButton.model.name + '):' + err) }
    }
  }
}

// ########################################################################

function kbSendCaravans () {
  gamePage.ui.activeTabId = 'Trade'
  gamePage.render()
  const tradeTarget = document.getElementById('kb_trade_routes').value
  if (tradeTarget !== 'kb_trade_none') {
    const racePanel = gamePage.tabs[4].racePanels.find(rp => rp.race.name === tradeTarget.replace('kb_trade_', ''))
    if (typeof (racePanel) !== 'undefined' && kbCheckPrices(racePanel.race.buys)) {
      if (kbGetConfig('kb_input_trade_amount_0', true) === 'checked') {
        racePanel.tradeBtn.controller.buyItem(racePanel.tradeBtn.model, {}, function (result) { if (result) { racePanel.tradeBtn.update() } })
      } else if (kbGetConfig('kb_input_trade_amount_1', false) === 'checked') {
        racePanel.tradeBtn.tradeFifthHref.link.click()
      } else if (kbGetConfig('kb_input_trade_amount_2', false) === 'checked') {
        racePanel.tradeBtn.tradeHalfHref.link.click()
      } else if (kbGetConfig('kb_input_trade_amount_3', false) === 'checked') {
        racePanel.tradeBtn.tradeAllHref.link.click()
      }
    }
  }
}

function kbTradeWithLeviathans () {
  gamePage.ui.activeTabId = 'Trade'
  gamePage.render()
  if (kbGetConfig('kb_trade_leviathans', false) === 'checked' && kbUse('gold')) {
    const targetButton = gamePage.tabs[4].racePanels.find(rp => rp.race.name === 'leviathans')
    if (typeof (targetButton) !== 'undefined' && kbCheckPrices(targetButton.race.buys)) {
      targetButton.tradeBtn.controller.buyItem(targetButton.tradeBtn.model, {}, function (result) {
        if (result) {
          targetButton.tradeBtn.update()
          console.log('traded with leviathans')
        }
      })
    }
  }
}

function kbFeedLeviathans () {
  gamePage.ui.activeTabId = 'Trade'
  gamePage.render()
  if (kbGetConfig('kb_feed_leviathans', false) === 'checked') {
    const targetButton = gamePage.tabs[4].racePanels.find(rp => rp.race.name === 'leviathans')
    if (typeof (targetButton) !== 'undefined' && targetButton.feedBtn.model.enabled && gamePage.resPool.get('necrocorn').value >= 1) {
      targetButton.feedBtn.controller.buyItem(targetButton.feedBtn.model, {}, function (result) { if (result) { targetButton.feedBtn.update() } })
    }
  }
}

// ########################################################################

function kbPromoteKittens () {
  gamePage.ui.activeTabId = 'Village'
  gamePage.render()
  if (kbGetConfig('kb_promote', false) === 'checked' && kbUse('gold')) {
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
  const activeResearch = gamePage.tabs[5].rUpgradeButtons.some(b => b.model.enabled && kbGetConfig('kb_input_' + b.model.metadata.name, false) === 'checked')
  if (!activeResearch && kbGetConfig('kb_praise', false) === 'checked' && kbUse('faith')) {
    const btn = gamePage.tabs[5].praiseBtn
    if (btn.model.visible && btn.model.enabled) {
      btn.controller.buyItem(btn.model, {}, function (result) { if (result) { btn.update() } })
    }
  }
}

// ########################################################################

function kbManageKittens () {
  if (kbGetConfig('kb_manage', false) === 'checked') {
    const btn = gamePage.tabs[1].optimizeJobsBtn
    if (btn.model.visible && btn.model.enabled) {
      btn.controller.buyItem(btn.model, {}, function (result) { if (result) { btn.update() } })
    }
  }
}

// ########################################################################

function kbHandleAutomations () {
  if (kbGetConfig('kb_deactivate_automations', false) === 'checked') {
    gamePage.ui.activeTabId = 'Bonfire'
    gamePage.render()
    const steamworks = gamePage.tabs[0].children.find(b => typeof (b.model.metadata) !== 'undefined' && b.model.metadata.name === 'steamworks')
    if (typeof (steamworks) !== 'undefined' && steamworks.model.visible) {
      steamworks.controller.onAll(steamworks.model)
      if (steamworks.model.metadata.isAutomationEnabled) {
        steamworks.controller.handleToggleAutomationLinkClick(steamworks.model)
      }
    }

    const factory = gamePage.tabs[0].children.find(b => typeof (b.model.metadata) !== 'undefined' && b.model.metadata.name === 'factory')
    if (typeof (factory) !== 'undefined' && factory.model.visible) {
      factory.controller.onAll(factory.model)
      if (factory.model.metadata.isAutomationEnabled) {
        factory.controller.handleToggleAutomationLinkClick(factory.model)
      }
    }

    const calciner = gamePage.tabs[0].children.find(b => typeof (b.model.metadata) !== 'undefined' && b.model.metadata.name === 'calciner')
    if (typeof (calciner) !== 'undefined' && calciner.model.visible) {
      // calciner.controller.onAll(calciner.model)
      if (calciner.model.metadata.isAutomationEnabled) {
        calciner.controller.handleToggleAutomationLinkClick(calciner.model)
      }
    }
  }
}

// ########################################################################

function kbEnsureLeaderExists () {
  gamePage.ui.activeTabId = 'Settlement'
  gamePage.render()
  if (kbGetConfig('kb_ensure_leader', false) === 'checked') {
    // switch this up to a worker type that you prefer.
    const bestWorker = gamePage.village.sim.kittens.filter(a => a.trait.name === 'chemist' && a.job === 'priest').sort(function (a, b) { return b.rank - a.rank })[0]
    const worker = gamePage.village.sim.kittens.sort(function (a, b) { return b.rank - a.rank })[0]
    if (typeof (bestWorker) !== 'undefined' && gamePage.village.leader !== bestWorker) {
      gamePage.village.leader = bestWorker
      bestWorker.isLeader = true
    } else if (typeof (worker) !== 'undefined' && gamePage.village.leader === null) {
      gamePage.village.leader = worker
      worker.isLeader = true
    }
  }
}

// ########################################################################

function kbBuildEmbassies () {
  gamePage.ui.activeTabId = 'Trade'
  gamePage.render()
  if (kbGetConfig('kb_build_embassies', false) === 'checked') {
    const race = gamePage.tabs[4].racePanels.find(rp => typeof (rp.embassyButton) !== 'undefined' && rp.embassyButton !== null && rp.embassyButton.model.enabled && rp.embassyButton.model.visible)
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
    obj.value = element.value
    return obj
  })
  const selectedRaceId = document.getElementById('kb_trade_routes').selectedOptions[0].value
  kbConfig.push({ id: 'kb_trade_selected', value: selectedRaceId })
  localStorage.setItem('kittenBotConfig', JSON.stringify(kbConfig))
  localStorage.setItem('kittenBotRaces', JSON.stringify(kbRaces))
  localStorage.setItem('kittenBotBuildings', JSON.stringify(kbBuildings))
  localStorage.setItem('kittenBotBuildingUpgrades', JSON.stringify(kbBuildingUpgrades))
  localStorage.setItem('kittenBotUnicornUpgrades', JSON.stringify(kbUnicornUpgrades))
  localStorage.setItem('kittenBotFaithUpgrades', JSON.stringify(kbFaithUpgrades))
  localStorage.setItem('kittenBotSpaceBuildings', JSON.stringify(kbSpaceBuildings))
  localStorage.setItem('kittenBotScienceUpgrades', JSON.stringify(kbScienceUpgrades))
  localStorage.setItem('kittenBotSpaceTravel', JSON.stringify(kbSpaceTravel))
  localStorage.setItem('kittenBotworkshopUpgrades', JSON.stringify(kbWorkshopUpgrades))
  localStorage.setItem('kittenBotJobs', JSON.stringify(kbJobs))
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
      return kbIsMaxed(resourceName)
    }
  }
  // Either 'none' checkbox is selected or not enough resources are available
  return false
}

// ########################################################################

function kbCheckPrices (prices) {
  return prices.every(p => kbUse(p.name))
}

function kbIsMaxed (materialName) {
  const resource = gamePage.resPool.get(materialName)
  // Only craft items if we would reach max storage in the next tick
  return ((resource.craftable && materialName !== 'wood') || (resource.maxValue - (resource.perTickCached * kbTicksPerSecond * (kbRunInterval / 1000)) <= resource.value))
}

function kbCheckRatio (materials, targetResourceName, ratio) {
  return materials.every(function (material) {
    const resource = gamePage.resPool.get(material.name)
    const targetResource = gamePage.resPool.get(targetResourceName)
    const actualRatio = resource.value / targetResource.value
    return (!isFinite(actualRatio) || actualRatio > ratio || (!resource.craftable && kbIsMaxed(material.name))) && kbIsMaxed(material.name)
  })
}

function kbCalculateCraftAmount (materials, ratio, targetResourceName) {
  // console.log(targetResourceName)
  return Math.min(...materials.map(function (material) {
    const resource = gamePage.resPool.get(material.name)
    // wood is craftable because it can be transformed from catnip but should not be treated as such
    // starcharts are not craftables but are not generated most of the time either
    if (resource.name === 'starchart' || (resource.craftable && resource.name !== 'wood')) {
      return kbCalculateCraftAmountForCraftable(resource, material, ratio, targetResourceName)
    }
    const magicNumber = 1 // Yes this is magic, change it if the calculated amount is not exactly enough to max it our till the next run.
    let baseResourceNeeded = resource.perTickCached * kbTicksPerSecond * (magicNumber + (kbRunInterval / 1000))
    if (baseResourceNeeded > resource.maxValue) {
      baseResourceNeeded = resource.maxValue
    }
    const calculatedAmount = baseResourceNeeded / material.val
    // Always craft at least one thing(needed for eludium)
    if (calculatedAmount < 1) {
      return 1
    }
    return Math.floor(calculatedAmount)
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
  if (resourceName === 'concrete') {
    resourceName = 'concrate'
  }
  const button = gamePage.tabs[3].craftBtns.find(btn => btn.craftName === resourceName && btn.model.enabled && btn.model.visible)
  if (typeof (button) !== 'undefined' && kbGetConfig('kb_input_craft_' + resourceName, false) === 'checked' && kbCheckPrices(button.model.prices) && kbCheckRatio(button.model.prices, button.craftName, ratio)) {
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
  kbCraftWithRatio('blueprint', 100)
  kbCraftWithRatio('megalith', 10)
  kbCraftWithRatio('ship', 1)
  kbCraftWithRatio('alloy', 10)
  kbCraftWithRatio('eludium', 1)
  kbCraftWithRatio('thorium', Number.MIN_VALUE)
  kbCraftWithRatio('concrete', 100)
  // kbCraftWithRatio('tanker', 100) // not worth it currently
}

function kbSacrificeUnicorns () {
  gamePage.ui.activeTabId = 'Religion'
  gamePage.render()
  if (kbGetConfig('kb_sacrifice_unicorns', false) === 'checked' && kbUse('unicorns')) {
    const btn = gamePage.tabs[5].sacrificeBtn
    if (typeof (btn) !== 'undefined' && btn !== null && btn.model.visible && btn.model.enabled) {
      gamePage.tabs[5].sacrificeBtn.all.link.click()
    }
  }
}

function kbSacrificeAlicorns () {
  gamePage.ui.activeTabId = 'Religion'
  gamePage.render()
  if (kbGetConfig('kb_sacrifice_alicorns', false) === 'checked' && kbUse('alicorn')) {
    const btn = gamePage.tabs[5].sacrificeAlicornsBtn
    if (typeof (btn) !== 'undefined' && btn !== null && btn.model.visible && btn.model.enabled) {
      gamePage.tabs[5].sacrificeAlicornsBtn.all.link.click()
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

function kbExecutePolicies () {
  if (kbGetConfig('kb_automate_policies', true) !== 'checked') {
    return
  }
  gamePage.ui.activeTabId = 'Science'
  gamePage.render()
  gamePage.opts.noConfirm = true
  const buttons = gamePage.tabs[2].policyPanel.children.filter(c => c.model.enabled && c.model.visible)
  buttons.forEach(btn => {
    try {
      if (kbGetConfig('kb_input_' + btn.model.metadata.name, false) === 'checked' && kbCheckPrices(btn.model.prices)) {
        btn.controller.buyItem(btn.model, {}, function (result) { if (result) { console.log('built: ' + btn.model.name); btn.update() } })
      }
    } catch (err) { console.log('err(' + btn.model.name + '):' + err) }
  })
  gamePage.opts.noConfirm = false
}

function kbFillJobs () {
  if (kbGetConfig('kb_use_jobs_autofill', true) !== 'checked') {
    return
  }

  let didStuff = false
  do {
    didStuff = false
    gamePage.ui.activeTabId = 'Village'
    gamePage.render()
    const buttons = gamePage.tabs[1].buttons
      .filter(c => c.model.enabled && c.model.visible && typeof (c.model.job) !== 'undefined')
      .sort(function (a, b) {
        return a.model.job.value - b.model.job.value
      })
    buttons.forEach(btn => {
      try {
        const config = kbGetConfigValue('kb_input_' + btn.model.job.name, 0)
        // add worker to job if the configured value is higher or all remaining worker should be added to this job("*")
        if (typeof (config) !== 'undefined' && (config > btn.model.job.value || config === '*')) {
          btn.controller.assignJobs(btn.model, 1)
          didStuff = true
          console.log('added worker to job: ' + btn.model.job.title)
        }
      } catch (err) { console.log('err(' + btn.model.name + '):' + err) }
    })
  }
  while (didStuff)
}

function kbFindRaces () {
  if (kbGetConfig('kb_find_races', false) !== 'checked') {
    return
  }
  gamePage.ui.activeTabId = 'Trade'
  gamePage.render()

  let shouldExplore = false
  // check for base races. Conditions taken from http://bloodrizer.ru/games/kittens/wiki/index.php?page=Trade
  const baseRaceCount = gamePage.tabs[4].racePanels.filter(r => r.race.name === 'griffins' || r.race.name === 'sharks' || r.race.name === 'lizards').length
  if (baseRaceCount !== 3 && (gamePage.calendar.year > 20 || (gamePage.calendar.year >= 5 && gamePage.karmaKittens > 0) || gamePage.tabs[2].metaphysicsPanel.children.some(c => c.id === 'diplomacy' && c.model.metadata.researched))) {
    shouldExplore = true
  } else if (!gamePage.tabs[4].racePanels.some(r => r.race.name === 'nagas') && gamePage.resPool.resources.some(r => r.name === 'culture' && r.value >= 1500)) {
    shouldExplore = true
  } else if (!gamePage.tabs[4].racePanels.some(r => r.race.name === 'zebras') && gamePage.resPool.resources.some(r => r.name === 'ship' && r.value >= 1)) {
    shouldExplore = true
  } else if (!gamePage.tabs[4].racePanels.some(r => r.race.name === 'spiders') && gamePage.resPool.resources.some(r => r.name === 'ship' && r.value >= 100) && gamePage.resPool.resources.some(r => r.name === 'science' && r.maxValue >= 125000)) {
    shouldExplore = true
  } else if (!gamePage.tabs[4].racePanels.some(r => r.race.name === 'dragons') && gamePage.tabs[2].buttons.some(b => b.id === 'nuclearFission' && b.model.metadata.researched)) {
    shouldExplore = true
  }

  if (shouldExplore) {
    const btn = gamePage.tabs[4].exploreBtn
    try {
      if (kbCheckPrices(btn.model.prices)) {
        btn.controller.buyItem(btn.model, {}, function (result) { if (result) { console.log('send explorers'); btn.update() } })
      }
    } catch (err) { console.log('err(' + btn.model.name + '):' + err) }
  }
}

function kbUpgradeBuildings () {
  if (kbGetConfig('kb_use_building_upgrades', false) !== 'checked') {
    return
  }

  gamePage.opts.noConfirm = true
  gamePage.tabs[0].children.filter(c => typeof (c.model.metadata) !== 'undefined' && typeof (c.model.metadata.stages) !== 'undefined' && (c.model.metadata.stages.length > 1)).forEach(function (buildingButton) {
    if (kbGetConfig('kb_input_upgrade_' + buildingButton.model.metadata.stages[1].label) === 'checked' && buildingButton.opts.name !== buildingButton.model.metadata.stages[1].label) {
      buildingButton.controller.upgrade(buildingButton.model)
      console.log('Upgraded to ' + buildingButton.model.metadata.stages[1].label)
    }
  })
  gamePage.opts.noConfirm = true
}

function kbTimeCrystalFarm () {
  if (kbGetConfig('kb_farm_timecrystals', false) !== 'checked') {
    return
  }

  let currentHeat = gamePage.time.heat

  if (currentHeat > 0) {
    return
  }

  gamePage.ui.activeTabId = 'Time'
  gamePage.render()

  const blastfurnace = gamePage.tabs[7].children[2].children[0].children[2]
  // Yeah no idea, sometimes it doesn't really load correctly
  blastfurnace.render()

  let maxHeat = blastfurnace.model.on * 100 + 100

  const shatterButtton = gamePage.tabs[7].children[2].children[0].children[0]
  const leviathans = gamePage.tabs[4].racePanels.find(rp => rp.race.name === 'leviathans')
  if (typeof (leviathans) === 'undefined') {
    return
  }

  // Run while we still have timeCrystals and heat still has room
  while (gamePage.resPool.get('timeCrystal').value > 1 && currentHeat < maxHeat && leviathans.tradeBtn.model.visible) {
    maxHeat = blastfurnace.model.on * 100 + 100
    currentHeat = gamePage.time.heat
    shatterButtton.controller.doShatterAmt(shatterButtton.model, 20)
    leviathans.tradeBtn.tradeAllHref.link.click()
    gamePage.craftAll('eludium')
  }
}

function kbCraftWood () {
  if (kbGetConfig('kb_craft_wood', false) !== 'checked') {
    return
  }

  const button = gamePage.tabs[0].children.find(btn => btn.model.name === 'Refine catnip' && btn.model.enabled && btn.model.visible)
  if (typeof (button) !== 'undefined' && kbCheckPrices(button.model.prices) && kbCheckRatio(button.model.prices, 'wood', 1)) {
    try {
      gamePage.craft('wood', kbCalculateCraftAmount(button.model.prices, 1, 'wood'))
    } catch (err) { console.log('err(' + button.model.name + '):' + err) }
  }
}

function kbAutoReset () {
  if (kbGetConfig('kb_auto_reset', false) !== 'checked') {
    return
  }

  const chronospheres = gamePage.tabs[0].children.find(b => b.model.name === 'Chronosphere')
  const threshold = kbGetConfigValue('kb_input_reset_threshold', 0)
  if (typeof (chronospheres) !== 'undefined' && chronospheres.model.on >= threshold) {
    console.log('reset opportunity detected')
  }
}
// ########################################################################

function kittyBotGo () {
  const origTab = gamePage.ui.activeTabId
  kbBuildItems('Workshop', 3)
  kbBuildItems('Science', 2)
  kbBuildItems('Religion', 5)
  kbBuildUnicornBuildings()
  kbBuildItems('Space', 6)
  kbUpgradeBuildings()
  kbBuildItems('Bonfire', 0)
  kbAutoReset()
  kbFindRaces()
  kbSendCaravans()
  kbTradeWithLeviathans()
  kbFeedLeviathans()
  kbTimeCrystalFarm()
  kbHandleAutomations()

  // Use ALL Catpower for hunt
  const kbCatpowerResource = gamePage.resPool.get('manpower')
  if (kbUse('manpower') && (gamePage.tabs[1].huntBtn.model.enabled && gamePage.tabs[1].huntBtn.model.visible &&
     (kbCatpowerResource.maxValue - (kbCatpowerResource.perTickCached * 6)) <= kbCatpowerResource.value)) { gamePage.resPool.village.huntAll() }

  // Auto Observe Astronomical Events
  if (kbGetConfig('kb_observeEvents', false) === 'checked') {
    const kbObserveButton = document.getElementById('observeBtn')
    if (typeof (kbObserveButton) !== 'undefined') {
      if (kbObserveButton != null) {
        kbObserveButton.click()
      }
    }
  }

  // Gather 1 Catnip
  if (kbGetConfig('kb_gatherCatnip', true) === 'checked') {
    gamePage.bld.gatherCatnip()
  }

  kbCraftWood()
  kbCraft()
  kbSacrificeUnicorns()
  kbSacrificeAlicorns()
  kbPromoteKittens()
  kbEnsureLeaderExists()
  kbBuildEmbassies()
  kbPraiseTheSun()
  kbLimitConsumer()
  kbPartyAllTheTime()
  kbExecutePolicies()
  kbFillJobs()

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
    kbLoadElements()
    kbCreatUI()
  } else {
    botDiv.style.display = 'none'
    kbSaveConfiguration()
  }
}

function kbLoadElements () {
  // Races
  gamePage.ui.activeTabId = 'Trade'
  gamePage.render()
  kbRaces = JSON.parse(localStorage.getItem('kittenBotRaces'))
  const raceObj = {}
  gamePage.tabs[4].racePanels.forEach(r => {
    raceObj[r.race.name] = r.race.title
  })
  kbRaces = Object.assign({}, kbRaces, raceObj)

  // Buildings
  gamePage.ui.activeTabId = 'Bonfire'
  gamePage.render()
  kbBuildings = JSON.parse(localStorage.getItem('kittenBotBuildings'))
  const buildingsObj = {}
  gamePage.tabs[0].children.filter(b => typeof (b.model.metadata) !== 'undefined').forEach(function (buildingButton) {
    buildingsObj[buildingButton.model.metadata.name] = buildingButton.opts.name
  })
  kbBuildings = Object.assign({}, kbBuildings, buildingsObj)

  kbBuildingUpgrades = JSON.parse(localStorage.getItem('kittenBotBuildingUpgrades'))
  const buildingUpgradesObj = {}
  gamePage.tabs[0].children.filter(c => typeof (c.model.metadata) !== 'undefined' && typeof (c.model.metadata.stages) !== 'undefined' && (c.model.metadata.stages.length > 1)).forEach(function (buildingButton) {
    buildingUpgradesObj[buildingButton.model.metadata.stages[1].label] = buildingButton.model.metadata.stages[1].label
  })
  kbBuildingUpgrades = Object.assign({}, kbBuildingUpgrades, buildingUpgradesObj)

  // Religion
  gamePage.ui.activeTabId = 'Religion'
  gamePage.render()
  kbFaithUpgrades = JSON.parse(localStorage.getItem('kittenBotFaithUpgrades'))
  const faithObj = {}
  gamePage.tabs[5].rUpgradeButtons.forEach(function (faithResearch) {
    faithObj[faithResearch.id] = faithResearch.model.name
  })
  kbFaithUpgrades = Object.assign({}, kbFaithUpgrades, faithObj)

  kbUnicornUpgrades = JSON.parse(localStorage.getItem('kittenBotUnicornUpgrades'))
  const unicornObj = {}
  gamePage.tabs[5].zgUpgradeButtons.forEach(function (unicornUpgrades) {
    unicornObj[unicornUpgrades.id] = unicornUpgrades.model.name
  })
  kbUnicornUpgrades = Object.assign({}, kbUnicornUpgrades, unicornObj)

  // Space
  gamePage.ui.activeTabId = 'Space'
  gamePage.render()
  kbSpaceBuildings = JSON.parse(localStorage.getItem('kittenBotSpaceBuildings'))
  const spaceObj = {}
  gamePage.tabs[6].planetPanels.map(pp => pp.children).flat().forEach(function (buildingButton) {
    spaceObj[buildingButton.id] = buildingButton.model.name
  })
  kbSpaceBuildings = Object.assign({}, kbSpaceBuildings, spaceObj)

  kbSpaceTravel = JSON.parse(localStorage.getItem('kittenBotSpaceTravel'))
  const spaceTravelObj = {}
  gamePage.tabs[6].GCPanel.children.forEach(function (spaceTravelButton) {
    spaceTravelObj[spaceTravelButton.id] = spaceTravelButton.model.name
  })
  kbSpaceTravel = Object.assign({}, kbSpaceTravel, spaceTravelObj)

  // Science
  gamePage.ui.activeTabId = 'Science'
  gamePage.render()
  kbScienceUpgrades = JSON.parse(localStorage.getItem('kittenBotScienceUpgrades'))
  const scienceObj = {}
  gamePage.tabs[2].buttons.filter(s => s.id !== 'brewery').forEach(function (scienceButton) {
    scienceObj[scienceButton.id] = scienceButton.model.name
  })
  kbScienceUpgrades = Object.assign({}, kbScienceUpgrades, scienceObj)

  // Workshop
  gamePage.ui.activeTabId = 'Workshop'
  gamePage.render()
  kbWorkshopUpgrades = JSON.parse(localStorage.getItem('kittenBotWorkshopUpgrades'))
  const workshopObj = {}
  gamePage.tabs[3].buttons.forEach(function (upgrade) {
    workshopObj[upgrade.id] = upgrade.model.name
  })
  kbWorkshopUpgrades = Object.assign({}, kbWorkshopUpgrades, workshopObj)

  // Settlement
  gamePage.ui.activeTabId = 'Village'
  gamePage.render()
  kbJobs = JSON.parse(localStorage.getItem('kittenBotJobs'))
  const jobsObj = {}
  gamePage.tabs[1].buttons.filter(b => typeof (b.model.job) !== 'undefined').forEach(function (upgrade) {
    jobsObj[upgrade.model.job.name] = upgrade.model.job.title
  })
  kbJobs = Object.assign({}, kbJobs, jobsObj)
}

// ########################################################################

function kbLimitConsumer () {
  if (kbGetConfig('kb_limit_consumer') === 'checked') {
    gamePage.ui.activeTabId = 'Bonfire'
    gamePage.render()
    const limit = 0.5 // Only this percentage of the base recources are permitted to be consumed by the consumer.

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
    '<span style="font-size: small;"> ver 0.4 by tstaec & LoyLT</span>'
  kittyBotUIaccess.innerHTML = tempString

  kbLoadElements()
  kbCreatUI()
  kittyBotToggle()
}

function kbGetConfig (key, defaultValue) {
  if (typeof (kbConfig) === 'undefined' || kbConfig === null) {
    kbConfig = []
  }
  const value = kbConfig.find(k => k.id === key)
  let checked = false
  if (typeof (value) === 'undefined' || typeof (value.checked) === 'undefined') {
    checked = defaultValue
  } else {
    checked = value.checked
  }

  if (checked) {
    return 'checked'
  }
  return ''
}

function kbGetConfigValue (key, defaultValue) {
  if (typeof (kbConfig) === 'undefined' || kbConfig === null) {
    kbConfig = []
  }
  const value = kbConfig.find(k => k.id === key)
  if (typeof (value) === 'undefined' || typeof (value.value) === 'undefined' || value.value === '') {
    return defaultValue
  } else {
    return value.value
  }
}

function kbCreatUI () {
  let tempString = ''
  const origTab = gamePage.ui.activeTabId
  const kittyBotUI = document.createElement('div')
  const existingUI = document.getElementById('kittyBotDiv')
  kbConfig = JSON.parse(localStorage.getItem('kittenBotConfig'))
  kittyBotUI.id = 'kittyBotDiv'
  if (typeof (existingUI) !== 'undefined' && existingUI !== null) {
    existingUI.remove()
  }
  kittyBotUI.style.cssText = 'display: inline; overflow: scroll; position: absolute; left: 400px; top: 75px; width: 850px; height: 90%; border-style: solid; background-color: #000000;'
  document.getElementById('gamePageContainer').appendChild(kittyBotUI)

  tempString = ''
  tempString +=
    '<p><input type="checkbox" margin: 5px id="kb_use_bot" style="display: inline-block;" onClick="kittyBotToggle();" ' + kbGetConfig('kb_use_bot', false) + '/>kittyBot is running if this is checked.<br /></p>' +
    '<div style="vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
    '<p>Actions:</p>' +
    '<input id="kb_promote" type="checkbox" style="vertical-align: sub; display: inline-block;"  ' + kbGetConfig('kb_promote', true) + ' />Promote<br />' +
    '<input id="kb_manage" type="checkbox" style="vertical-align: sub; display: inline-block;" ' + kbGetConfig('kb_manage', true) + ' />Manage workers<br />' +
    '<input id="kb_ensure_leader" type="checkbox" style="vertical-align: sub; display: inline-block;" ' + kbGetConfig('kb_ensure_leader', true) + ' />Ensure Leader<br />' +
    '<input id="kb_build_embassies" type="checkbox" style="vertical-align: sub; display: inline-block;"  ' + kbGetConfig('kb_build_embassies', true) + ' />Build embassies<br />' +
    '<input id="kb_deactivate_automations" type="checkbox" style="vertical-align: sub; display: inline-block;"  ' + kbGetConfig('kb_deactivate_automations', true) + ' />Deactivate unwanted automations<br />' +
    '<input id="kb_praise" type="checkbox" style="vertical-align: sub; display: inline-block;" ' + kbGetConfig('kb_praise', true) + ' />Praise the sun!<br />' +
    '<input id="kb_sacrifice_unicorns" type="checkbox" style="vertical-align: sub; display: inline-block;" ' + kbGetConfig('kb_sacrifice_unicorns', true) + ' />Sacrifice unicorns<br />' +
    '<input id="kb_sacrifice_alicorns" type="checkbox" style="vertical-align: sub; display: inline-block;" ' + kbGetConfig('kb_sacrifice_alicorns', true) + ' />Sacrifice alicorns<br />' +
    '<input id="kb_limit_consumer" type="checkbox" style="vertical-align: sub; display: inline-block;" ' + kbGetConfig('kb_limit_consumer', true) + ' />Limit consumer<br />' +
    '<input id="kb_start_festival" type="checkbox" style="vertical-align: sub; display: inline-block;" ' + kbGetConfig('kb_start_festival', true) + ' />Start festivals<br />' +
    '<input id="kb_find_races" type="checkbox" style="vertical-align: sub; display: inline-block;" ' + kbGetConfig('kb_find_races', false) + ' />Explore for new races<br />' +
    '<input id="kb_observeEvents" type="checkbox" style="vertical-align: sub; display: inline-block;" ' + kbGetConfig('kb_observeEvents', true) + ' />Observe astronomical events<br />' +
    '<input id="kb_gatherCatnip" type="checkbox" style="vertical-align: sub;" ' + kbGetConfig('kb_gatherCatnip', false) + '/>Gather catnip automatically<br />' +
    '<input id="kb_craft_wood" type="checkbox" style="vertical-align: sub;" ' + kbGetConfig('kb_craft_wood', false) + '/>Refine catnip to wood<br />' +
    '<input id="kb_trade_leviathans" type="checkbox" style="vertical-align: sub;" ' + kbGetConfig('kb_trade_leviathans', false) + '/>Trade with leviathans if possible<br />' +
    '<input id="kb_feed_leviathans" type="checkbox" style="vertical-align: sub;" ' + kbGetConfig('kb_feed_leviathans', false) + '/>Feed leviathans if possible<br />' +
    '<input id="kb_farm_timecrystals" type="checkbox" style="vertical-align: sub;" ' + kbGetConfig('kb_farm_timecrystals', false) + '/>shatter time crystals while heat is not at max<br />' +

    '<input id="kb_auto_reset" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig('kb_auto_reset', false) + ' />Automatically when reached: ' +
    '<input id="kb_input_reset_threshold" type="text" style="display: inline-block; vertical-align: sub;" value="' + kbGetConfigValue('kb_input_reset_threshold', 0) + '" /> chronospheres<br />' +

    '<label for="kb_tradeRoutes">Send caravans to:</label>' +
    '<select name="kb_tradeRoutes" id="kb_trade_routes">' +
    '<option value="kb_trade_none">None</option>'

  const selectedRace = kbConfig.find(c => c.id === 'kb_trade_selected')
  let raceId = 'kb_trade_none'
  if (typeof (selectedRace) !== 'undefined') {
    raceId = selectedRace.value
  }
  for (const key in kbRaces) {
    const id = 'kb_trade_' + key
    let selectedValue = ''
    if (raceId === id) {
      selectedValue = 'selected="true"'
    }

    tempString += '<option value="' + id + '" ' + selectedValue + '>' + kbRaces[key] + '</option>'
  }

  tempString +=
    '</select>' +
    '<blockquote> Trade amount:</br>' +
    '<input id="kb_input_trade_amount_0" type="radio" name="trade_amount" value="0" style="vertical-align: sub;" ' + kbGetConfig('kb_input_trade_amount_0', true) + '/>One </br>' +
    '<input id="kb_input_trade_amount_1" type="radio" name="trade_amount" value="1" style="vertical-align: sub;" ' + kbGetConfig('kb_input_trade_amount_1', false) + '/>fifth </br>' +
    '<input id="kb_input_trade_amount_2" type="radio" name="trade_amount" value="2" style="vertical-align: sub;" ' + kbGetConfig('kb_input_trade_amount_2', false) + ' />half </br>' +
    '<input id="kb_input_trade_amount_3" type="radio" name="trade_amount" value="2" style="vertical-align: sub;" ' + kbGetConfig('kb_input_trade_amount_3', false) + ' />all </br>' +
    '</blockquote>' +
    '</div>' +
    '<div style="vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
    '<p><input id="kb_use_religion" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig('kb_use_religion', true) + ' /><u>Spend faith on:</u></p>'

  for (const key in kbFaithUpgrades) {
    const id = 'kb_input_' + key
    tempString += '<div id="kb_faithDiv_' + key + '"><input id="' + id + '" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig(id, true) + ' />' + kbFaithUpgrades[key] + '</div>'
  }

  tempString +=
    '</div>' +
    '<div style="vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
    '<p><input id="kb_use_unicorn_upgrades" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig('kb_use_unicorn_upgrades', true) + ' /><u>Spend tears on:</u></p>'

  for (const key in kbUnicornUpgrades) {
    const id = 'kb_input_' + key
    tempString += '<div id="kb_unicornDiv_' + key + '"><input id="' + id + '" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig(id, true) + ' />' + kbUnicornUpgrades[key] + '</div>'
  }

  // Automate jobs assignement
  tempString +=
    '</div>' +
    '<div style="vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
    '<p><input id="kb_use_jobs_autofill" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig('kb_use_jobs_autofill', false) + ' /><u>Automatically fill jobs:</u></p>' +
    '<span>Use "*" as an indicator to use all remaining workers.<span>'

  for (const key in kbJobs) {
    const id = 'kb_input_' + key
    tempString += '<div id="kb_jobsDiv_' + key + '"><input id="' + id + '" type="text" style="display: inline-block; vertical-align: sub;" value="' + kbGetConfigValue(id, 0) + '" />' + kbJobs[key] + '</div>'
  }

  tempString +=
    '</div>' +
    '<div style="vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
    '<p><input id="kb_use_bonfire" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig('kb_use_bonfire', true) + ' /><u>Build Buildings:</u></p>'

  for (const key in kbBuildings) {
    const id = 'kb_input_' + key
    tempString += '<div id="kb_bldDiv_' + key + '"><input id="' + id + '" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig(id, true) + ' />Building: ' + kbBuildings[key] + '</div>'
  }

  tempString +=
  '</div>' +
  '<div style="vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
    '<p><input id="kb_use_building_upgrades" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig('kb_use_building_upgrades', false) + ' /><u>Upgrade Buildings:</u></p>'

  for (const key in kbBuildingUpgrades) {
    const id = 'kb_input_upgrade_' + key
    tempString += '<div id="kb_bldUpgrade_' + key + '"><input id="' + id + '" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig(id, true) + ' />Upgrade: ' + kbBuildingUpgrades[key] + '</div>'
  }

  tempString +=
    '</div>' +
    '<div id="kb_space" style="vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
    '<p><input id="kb_use_space" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig('kb_use_space', true) + ' /><u>Build Space Buildings</u></p>'

  for (const key in kbSpaceBuildings) {
    const id = 'kb_input_' + key
    tempString += '<div id="kb_bldDiv_' + key + '"><input id="' + id + '" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig(id, true) + ' />Building: ' + kbSpaceBuildings[key] + '</div>'
  }

  tempString +=
    '</div>' +
    '<div style="vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
    '<p><input id="kb_use_science" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig('kb_use_science', true) + ' /><u>Research Science:</u></p>'

  for (const key in kbScienceUpgrades) {
    const id = 'kb_input_' + key
    tempString += '<div id="kb_sciDiv_' + key + '"><input id="' + id + '" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig(id, true) + ' />' + kbScienceUpgrades[key] + '</div>'
  }

  tempString +=
    '</div>' +
    '<div style="vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
    '<p><input id="kb_use_planet_missions" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig('kb_use_planet_missions', true) + ' /><u>Execute Planet missions:</u></p>'

  for (const key in kbSpaceTravel) {
    const id = 'kb_input_' + key
    tempString += '<div id="kb_sciDiv_' + key + '"><input id="' + id + '" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig(id, true) + ' />' + kbSpaceTravel[key] + '</div>'
  }

  tempString +=
    '</div>' +

    '<div id="kb_workshop_research" style="vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
    '<p><input id="kb_use_workshop" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig('kb_use_workshop', true) + ' /><u>Buy Workshop upgrades:</u></p>'

  for (const key in kbWorkshopUpgrades) {
    const id = 'kb_input_' + key
    tempString += '<div id="kb_workshopDiv_' + key + '"><input id="' + id + '" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig(id, true) + ' />' + kbWorkshopUpgrades[key] + '</div>'
  }

  tempString +=
    '</div>' +
    '<div id="kb_workshop_crafts" style="vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
    '<p><input id="kb_use_workshop_crafting" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig('kb_use_workshop_crafting', true) + ' /><u>Craft Resources:</u></p>'

  gamePage.tabs[3].craftBtns.forEach(function (craftButton) {
    const id = 'kb_input_craft_' + craftButton.craftName
    tempString += '<div id="kb_workshopDiv_' + craftButton.craftName + '"><input id="' + id + '" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig(id, true) + ' />' + craftButton.model.name + '</div>'
  })

  tempString +=
    '</div>' +
    '<div style="vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
    '<p><u>Allow resources to be used to build or craft</u></p>'

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
  tempString += '</div>' +

    '<div style="vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">' +
    '<p><input id="kb_automate_policies" type="checkbox" style="display: inline-block; vertical-align: sub;" ' + kbGetConfig('kb_automate_policies', false) + ' /><u>Select which policies should be used</u></p>'

  // Group all policies by price value
  gamePage.ui.activeTabId = 'Science'
  gamePage.render()
  const objArray = []
  gamePage.tabs[2].policyPanel.children.forEach(p => {
    if (objArray.length === 0 || !objArray.some(a => a.some(b => b.id === p.id))) {
      const arr = [{ name: p.model.name, id: p.id }]
      objArray.push(arr)
      p.model.metadata.blocks.forEach(b => {
        const blockedPolicy = gamePage.tabs[2].policyPanel.children.find(c => c.id === b)
        arr.push({ name: blockedPolicy.model.name, id: blockedPolicy.id })
      })
    }
  })
  objArray.forEach(group => {
    tempString += '<div style="vertical-align: top; display: inline-block; border-style: solid; border-width: 1px; padding: 5px;">'
    const groupName = group[0].name
    group.forEach(policy => {
      const id = 'kb_input_' + policy.id
      tempString += '<input id="' + id + '" type="radio" name="' + groupName + '" value="' + id + '" style="vertical-align: sub;" ' + kbGetConfig(id, false) + '/>' + policy.name
    })
    tempString += '</div></br>'
  })

  kittyBotUI.innerHTML = tempString

  gamePage.ui.activeTabId = origTab
  gamePage.render()
}

kbUIAccess()
