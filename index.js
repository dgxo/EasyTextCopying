const copiedNotification = document.querySelector('#copied');
const newSectionButton = document.querySelector('button#new-section');
const main = document.querySelector('main');
const snippetTemplate = document.querySelector('#snippetTemplate');
const sectionTemplate = document.querySelector('#sectionTemplate');
const separator = '||SEP||';

function saveData() {
	let snippets = {};

	main.querySelectorAll('section').forEach((section) => {
		const sectionName = section.querySelector('h1 span.section-title').textContent;
		let sectionSnippets = [];

		section.querySelectorAll('li.snippet').forEach((snippet) => {
			const value = snippet.querySelector('textarea').value;
			if (value == '') return;
			sectionSnippets.push(value);
		});

		snippets[sectionName] = sectionSnippets;
	});

	localStorage.setItem('snippets', JSON.stringify(snippets));
}

function createSection(name, focus = false) {
	const section = sectionTemplate.content.querySelector('section').cloneNode(true);
	const title = section.querySelector('h1 span.section-title');
	const icon = section.querySelector('h1 .material-symbols-outlined');
	const addButton = section.querySelector('button#add');

	icon.addEventListener('click', () => {
		title.focus();
		window.getSelection().selectAllChildren(title);
	});

	title.textContent = name;
	if (focus) title.focus();

	addButton.addEventListener('click', () => {
		createSnippet('', section, true);
		console.log(`Creating snippet in section ${title.textContent}`);
	});

	main.appendChild(section);

	return section;
}

function createSnippet(content, section, focus = false) {
	const snippet = snippetTemplate.content.querySelector('li.snippet').cloneNode(true);

	const editButton = snippet.querySelector('button#edit');
	const copyButton = snippet.querySelector('button#copy');
	const doneButton = snippet.querySelector('button#done');
	const deleteButton = snippet.querySelector('button#delete');
	const textInput = snippet.querySelector('textarea');

	if (typeof content !== 'string') {
		content = '';
	}

	textInput.value = content;

	function toggleEditing() {
		doneButton.classList.toggle('hidden');
		editButton.classList.toggle('hidden');
		copyButton.classList.toggle('hidden');
		textInput.disabled = !textInput.disabled;
	}

	// default is not editing
	if (focus) {
		toggleEditing();
		textInput.focus();
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
		snippet.remove();
		saveData();
	});

	section.querySelector('ul').append(snippet);
}

let snippets = localStorage.getItem('snippets');
let scripts = localStorage.getItem('scripts');

if (scripts) {
	const section = createSection('Old Scripts', true);

	for (const snippet of scripts.split(separator)) {
		createSnippet(snippet, section, false);
	}

	saveData();
	localStorage.removeItem('scripts');
} else if (snippets) {
	snippets = JSON.parse(snippets);
	for (const sectionName in snippets) {
		const section = createSection(sectionName);

		for (const snippet of snippets[sectionName]) {
			createSnippet(snippet, section, false);
		}
	}
}

newSectionButton.addEventListener('click', () => {
	const section = createSection('Section', true);
	createSnippet('', section, true);
});
