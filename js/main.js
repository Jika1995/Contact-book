let nameInp = document.querySelector('#name-inp');
let phoneInp = document.querySelector('#phone-inp');
let emailInp = document.querySelector('#email-inp');
let imgInp = document.querySelector('#photo-inp');

//инициировать ключ с пустым значением в local storage
function initStorage () {
    if(!localStorage.getItem('contact-data')) {
        localStorage.setItem('contact-data', '[]');
    };
};
initStorage()

//отправка данных
function setContactsToStorage (contactData) {
    localStorage.setItem('contact-data', JSON.stringify(contactData))
};

//получение данных
function getContactsFromStorage () {
    let contacts = JSON.parse(localStorage.getItem('contact-data'));
    return contacts
}

//чтение всех контактов
function renderList (contacts = getContactsFromStorage()) {

    let container = document.querySelector('.container');
    container.innerHTML = '';

    let contactCard = document.querySelector('.contact-card');
    contactCard.innerHTML = '';

    //сортировка по имени в алфавитном порядке
    contacts.sort(function(a, b){
        let nameA=a.name.toLowerCase();
        let nameB=b.name.toLowerCase();

        if (nameA < nameB) //сортируем строки по возрастанию
          return -1
        if (nameA > nameB)
          return 1
        return 0 // Никакой сортировки
    });

    contacts.forEach(item => {
        container.innerHTML += `
        <div class="card w-25 m-2" style="width: 18rem;" title="${item.name}"> 
            <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
            </div>
        </div>
        `;
    });

    if (contacts.length == 0) return;
    addRenderCartEvent()

};

renderList()

//чтение одной определенной карточки по клику на имя
function addRenderCartEvent () {
    let cardTitles = document.querySelectorAll('.card-title');
    cardTitles.forEach(item => {
        item.addEventListener('click', renderContactCard)
    });
};

function renderContactCard (e) {
        
    let container = document.querySelector('.container');
    container.innerHTML = '';

    let contactCard = document.querySelector('.contact-card');
    contactCard.innerHTML = '';
    // contactCard.setAttribute('title', )

    let contactTitle = e.target.innerText
    // console.log(contactTitle); //вывел Эрлан

    let contacts = getContactsFromStorage()
    // console.log(contacts);

    let contactObj = contacts.find(item => item.name.toLowerCase() == contactTitle.toLowerCase())
    contactCard.innerHTML = `
    <div class="card w-25 m-2" style="width: 18rem;" title="${contactObj.name}"> 
        <div class="card-body">
            <h5 class="card-title">${contactObj.name}</h5>
            <img src="${contactObj.url}" width="100" height="100"></img>
            <p class="card-text"><b>Phone number</b> ${contactObj.phone}</p>
            <p class="card-text"><b>Email</b> ${contactObj.email}</p>
            <a href="#" class="btn btn-danger delete-contact-btn" title="${contactObj.name}">Delete contact</a>
            <a href="#" class="btn btn-secondary update-contact-btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop" title="${contactObj.name}">Update contact</a> 
        </div>
    </div>
    `;

    addDeleteEvent();
    addUpdateEvent();

}

//добавление нового контакта
function createContact () {

    let contacts = getContactsFromStorage();

    let contactObj = {
        name: nameInp.value,
        phone: phoneInp.value,
        email: emailInp.value,
        url: imgInp.value
    }

    contacts.push(contactObj);
    setContactsToStorage(contacts);

    nameInp.value = '';
    phoneInp.value = '';
    emailInp.value = '';
    imgInp.value = '';

    let btnClose = document.querySelector('.btn-close');
    btnClose.click()

    renderList()

};

addContactBtn = document.querySelector('.add-contact-btn');
addContactBtn.addEventListener('click', createContact)

//удаление контакта
function deleteContact (e) {

    let contactTitle = e.target.title
    // console.log(contactTitle); //вывел Эрлан

    let contacts = getContactsFromStorage()
    // console.log(contacts);

    contacts = contacts.filter(item => item.name != contactTitle);

    let contactCard = document.querySelector('.contact-card');
    contactCard.innerHTML = '';

    setContactsToStorage(contacts);
    renderList()

};

function addDeleteEvent () {
    let deleteBtn = document.querySelector('.delete-contact-btn');
    deleteBtn.addEventListener('click', deleteContact)
}

//изменение данных контакта
function updateContact (e) {

    // e.target.setAttribute('data-bs-toggle', "modal");
    // e.target.setAttribute('data-bs-target', "#staticBackdrop");

    let contactTitle = e.target.title;
    let contacts = getContactsFromStorage();
    let contactObj = contacts.find(item => item.name == contactTitle);
    // console.log(contactObj);

    let modalTitle = document.querySelector('.modal-title');
    modalTitle.innerText = 'Save changes of the contact';

    let modalFooter = document.querySelector('.modal-footer');
    modalFooter.innerHTML = `<button type="button" class="btn btn-secondary save-changes-btn" title="${contactObj.name}">Save changes</button>`

    nameInp.value = contactObj.name;
    phoneInp.value = contactObj.phone;
    emailInp.value = contactObj.email;
    imgInp.value = contactObj.url;

    addSaveEvent()

    // console.log('Hello')
}

function addUpdateEvent () {
    let updateBtn = document.querySelector('.update-contact-btn');
    updateBtn.addEventListener('click', updateContact)
}

function addSaveEvent () {
    let saveBtn = document.querySelector('.save-changes-btn');
    saveBtn.addEventListener('click', saveChanges)
}

function saveChanges (e) {

    console.log(e.target);
    if (!e.target.title) return;

    let contacts = getContactsFromStorage();
    let contactObj = contacts.find(item => item.name == e.target.title)
    console.log(contactObj)

    contactObj.name = nameInp.value;
    contactObj.phone = phoneInp.value;
    contactObj.email = emailInp.value;
    contactObj.url = imgInp.value;

    setContactsToStorage(contacts);
    e.target.removeAttribute('title');

    nameInp.value = '';
    phoneInp.value = '';
    emailInp.value = '';
    imgInp.value = ''

    let btnClose = document.querySelector('.btn-close');
    btnClose.click(); //нажмется за пользователя

    renderList()

}

//живой поиск

let searchInp = document.querySelector('#search-inp');

searchInp.addEventListener('input', e => {
    let contacts = getContactsFromStorage();

    // console.log(e.target.value);
    // console.log(contacts);

    contacts = contacts.filter(item => {
        return item.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1;
    })

    renderList(contacts);
});
