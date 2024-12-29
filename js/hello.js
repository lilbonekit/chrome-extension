const onClick = async (e) => {
	let queryOptions = { active: true, lastFocusedWindow: true }
	// searching the current active tab
	const [tab] = await chrome.tabs.query(queryOptions)
	// close remove tab
	chrome.tabs.remove(tab.id)
}

const btn = document.querySelector('.ok-button')
if (btn) {
	btn.addEventListener('click', onClick)
}
