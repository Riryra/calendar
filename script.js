const date = new Date();
let day = "";
const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];

const currentMonth = document.querySelector('.nameOfTheMonth').innerHTML = months[date.getMonth()];
const currentDay = document.querySelector('.currentDate').innerHTML = new Date().toDateString();

const events = JSON.parse(localStorage.getItem('events')) || {};

const createPreviousMonthDays = (firstDayIndex, prevLastDay) => {
    let days = '';
    for (let x = firstDayIndex; x > 0; x--) {
        const day = prevLastDay - x + 1;
        const yearMonthDay = formatDate(new Date(date.getFullYear(), date.getMonth() - 1, day));
        days += `<div class="day prev-date" data-day="${yearMonthDay}">${day}</div>`;
    }
    return days;
}

const createCurrentMonthDays = (lastDay) => {
    let days = '';
    for (let i = 1; i <= lastDay; i++) {
        const yearMonthDay = formatDate(new Date(date.getFullYear(), date.getMonth(), i));
        if (i === new Date().getDate() && date.getMonth() === new Date().getMonth()) {
            days += `<div class="day today" data-day="${yearMonthDay}">${i}</div>`;
        } else {
            days += `<div class="day" data-day="${yearMonthDay}">${i}</div>`;
        }
    }
    return days;
}

const createNextMonthDays = (nextDays) => {
    let days = '';
    for (let j = 1; j <= nextDays; j++) {
        const yearMonthDay = formatDate(new Date(date.getFullYear(), date.getMonth() + 1, j));
        days += `<div class="day next-date" data-day="${yearMonthDay}">${j}</div>`;
    }
    return days;
}

const renderCalendar = () => {
    date.setDate(1);

    const monthDays = document.querySelector('.days');
    const monthName = document.querySelector('.nameOfTheMonth');

    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
    const firstDayIndex = date.getDay();
    const lastDayIndex = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
    const nextDays = 7 - lastDayIndex - 1;

    let days = "";
    days += createPreviousMonthDays(firstDayIndex, prevLastDay);
    days += createCurrentMonthDays(lastDay);
    days += createNextMonthDays(nextDays);

    monthDays.innerHTML = days;
    monthName.textContent = months[date.getMonth()];

    monthDays.childNodes.forEach((day) => {
        const event = getEvent(day.dataset.day);
        if (event) {
            day.insertAdjacentHTML('beforeend', `<div id='evt'>${event.details}</div>`);
        }
        day.addEventListener("click", (e) => displayEvent(e));
    });
}    //end function renderCalendar


const getEvent = (day) => { return events[day]; }

const displayEvent = (e) => {
    const container = document.getElementById("cal-event");
    const formElem = document.createElement('form');
    const day = e.currentTarget.dataset.day;
    const event = getEvent(day);

    formElem.innerHTML = `
        <h1>${event ? 'EDIT' : 'ADD'}</h1>
        <div id='evt-date'>${day}</div>
        <textarea id='evt-details' required>${event ? event.details : ''}</textarea>
        <input type='submit' id='save' value='Save'/>
        <input type='button' id="close" value='Close'/>
        ${ event ? `<input type='button' id='delete' data-delete=${day} value='Delete'/>` : '' }
    `;

    container.innerHTML = '';
    container.appendChild(formElem);
}

const saveEvent = () => {
    const eventDate = document.getElementById('evt-date').textContent;
    const eventDetails = document.getElementById('evt-details').value;

    events[eventDate] = {
        details: eventDetails
    };
    localStorage.setItem('events', JSON.stringify(events));
}

const deleteEvent = (e) => {
    const day = e.target.dataset.delete;
    if (confirm("Are you sure you want to remove event?")) {
        const dayElem = document.querySelectorAll(`[data-day='${day}']`)[0];

        dayElem.removeChild(dayElem.lastChild);
        delete events[day];
        localStorage.setItem('events', JSON.stringify(events));
        closeEvent();
    }
}

const closeEvent = () => {
    document.getElementById("cal-event").innerHTML = "";
}

const formatDate = (date) => {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

document.addEventListener('click', (e) => {
    const byId = e.target.id;

    switch (byId) {
        case 'prev':
            date.setMonth(date.getMonth() - 1);
            break;
        case 'next':
            date.setMonth(date.getMonth() + 1);
            break;
        case 'save':
            saveEvent();
            break;
        case 'delete':
            deleteEvent(e);
            break;
        case 'close':
            closeEvent();
            break;
    }
    renderCalendar();
})

renderCalendar();




















