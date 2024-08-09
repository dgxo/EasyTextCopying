const copiedNotification = document.querySelector('.copied');
const addButton = document.querySelector('button.add');
const scriptTemplate = document.querySelector('#scriptTemplate');
const separator = '||SEP||';

function saveData() {
	let scripts = [];

	document.querySelectorAll('li.script').forEach((script) => {
		scripts.push(script.querySelector('textarea').value);
	});

	localStorage.setItem('scripts', scripts.join(separator));
}

function registerScript(script) {
	const editButton = script.querySelector('button.edit');
	const copyButton = script.querySelector('button.copy');
	const doneButton = script.querySelector('button.done');
	const deleteButton = script.querySelector('button.delete');
	const textInput = script.querySelector('textarea');

	function toggleEditing() {
		console.log('toggling editing');
		doneButton.classList.toggle('hidden');
		editButton.classList.toggle('hidden');
		copyButton.classList.toggle('hidden');
	}

	editButton.addEventListener('click', () => {
		toggleEditing();
		textInput.focus();
	});

	doneButton.addEventListener('click', () => {
		toggleEditing();
		textInput.blur();
		saveData();
	});

	copyButton.addEventListener('click', () => {
		navigator.clipboard.writeText(textInput.value);
		copiedNotification.classList.remove('hidden');
		setTimeout(() => copiedNotification.classList.add('hidden'), 1000);
	});

	deleteButton.addEventListener('click', () => {
		script.remove();
	});
}

function createScript(content) {
	if (typeof content !== 'string') {
		content = '';
	}

	let script = scriptTemplate.content.querySelector('li.script').cloneNode(true);
	document.querySelector('main ul').append(script);
	script.querySelector('textarea').value = content;
	script.querySelector('textarea').focus();
	registerScript(script);
}

console.log(localStorage.getItem('scripts'));
for (const script of localStorage.getItem('scripts').split(separator)) {
	createScript(script);
}
addButton.addEventListener('click', createScript);
