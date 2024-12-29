const settingsButton = document.querySelector('.settings-page')
if (settingsButton) {
	settingsButton.addEventListener('click', () => {
		const url = chrome.runtime.getURL('/html/settings.html')
		chrome.tabs.create({ url })
		window.close()
	})
}

const helpButton = document.querySelector('.help-page')
if (helpButton) {
	helpButton.addEventListener('click', () => {
		const url = chrome.runtime.getURL('/html/hello.html')
		chrome.tabs.create({ url })
		window.close()
	})
}

const clockCheckbox = document.querySelector('.clock-checkbox')
chrome.storage.sync.get(['showClock'], (result) => {
	clockCheckbox.checked = result.showClock || false
	if (result.showClock) {
		chrome.action.setBadgeText({ text: 'ON' })
	}
})

if (clockCheckbox) {
	clockCheckbox.addEventListener('click', (e) => {
		const checked = e.target.checked
		chrome.action.setBadgeText({ text: checked ? 'ON' : '' })
		chrome.storage.sync.set({ showClock: checked })
	})
}

const inputColor = document.querySelector('.input-color')
const buttonColor = document.querySelector('.color-button')
const selectorInput = document.querySelector('.bg-selector')

if (buttonColor) {
	buttonColor.addEventListener('click', async () => {
		const background = inputColor.value.trim()
		const selector = selectorInput.value.trim() || 'body'

		console.log(`Color: ${background}, Selector: ${selector}`)

		chrome.tabs.update({}, async (tab) => {
			chrome.scripting.executeScript({
				target: { tabId: tab.id },
				function: (color, selector) => {
					const elements = document.querySelectorAll(selector)
					if (elements.length === 0) {
						console.error(`No elements found for selector: ${selector}`)
						return
					}

					elements.forEach((element) => {
						if (!element.hasAttribute('backup-style')) {
							element.setAttribute(
								'backup-style',
								element.getAttribute('style') || ''
							)
						}

						if (color.trim() === '') {
							const backupStyle = element.getAttribute('backup-style')
							if (backupStyle) {
								element.setAttribute('style', backupStyle)
							} else {
								element.removeAttribute('style')
							}
						} else {
							element.style.backgroundColor = color
						}
					})
				},
				args: [background, selector],
			})
		})
	})
}

const inputAlert = document.querySelector('.input-alert')
const buttonAlert = document.querySelector('.alert-button')

if (buttonAlert) {
	buttonAlert.addEventListener('click', async () => {
		const minutes = parseFloat(inputAlert.value)
		if (isNaN(minutes) || minutes <= 0) {
			alert('Please enter a positive number for minutes.')
			return
		}

		chrome.storage.sync.set({ timer: minutes })
		chrome.alarms.create({ delayInMinutes: minutes })
		window.close()
	})

	chrome.storage.sync.get(['timer'], (result) => {
		inputAlert.value = result.timer || 1
	})
}
