const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const date = new Date();
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
    const currentYear = document.querySelector('.currentDate');

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
    currentYear.textContent = date.getFullYear().toString();

    monthDays.childNodes.forEach((day) => {
        const event = getDayEvents(day.dataset.day);
        if (event) {
            day.insertAdjacentHTML('beforeend', `<div id='point'><i class="far fa-calendar"></i></div>`);
        }
        day.addEventListener("click", (e) => displayEvents(e));
    });
}    //end function renderCalendar

const getDayEvents = (day) => {
    return events[day];
}

const updateLocalEvents = () => {
    localStorage.setItem('events', JSON.stringify(events));
}

const displayEvents = (e) => {
    const container = document.querySelector(".cal-events");
    const formElem = document.createElement('form');
    const dayEvents = createElement('div', 'day-events');
    const day = e.currentTarget.dataset.day;
    const events = getDayEvents(day);

    formElem.innerHTML = `
        <h1>Events</h1>
        <div id='evt-date'>${day}</div>
    `;

    if (events) {
        events.forEach((event) => {
            dayEvents.insertAdjacentHTML('beforeend', renderEvent(event))
        });
    } else {
        formElem.insertAdjacentHTML('beforeend', '<div class="evt-empty">No Events</div>')
    }
    formElem.append(dayEvents);

    formElem.insertAdjacentHTML('beforeend', `
        <textarea id='evt-title' placeholder="Add Event" required></textarea>
        <input type='submit' id='save' value='Save'/>
        <input type='button' id="close" value='Close'/>
    `);

    container.innerHTML = '';
    container.appendChild(formElem);
}

const createElement = (tagName, className = '') => {
    const element = document.createElement(tagName);
    element.className = className;

    return element;
};

const renderEvent = (event) => {
    return `
            <div class="day-evt"">
                <div class="evt-title">${event.title}</div>
                <div class="evt-delete fas fa-times fa-2x" id="delete"></div>          
            </div>
        `;
}

const createEvent = (e) => {
    e.preventDefault();

    const day = document.getElementById('evt-date').textContent;
    const eventTitleElem = document.getElementById('evt-title');
    const eventTitle = eventTitleElem.value;
    const dayEventsElem = document.querySelector('.day-events');
    const noEventsElem = document.querySelector('.evt-empty');

    if (!eventTitle) {
        return;
    }

    const event = {
        title: eventTitle
    };

    (events[day] = getDayEvents(day) || []).push(event);
    updateLocalEvents();

    if (noEventsElem) {
        noEventsElem.remove();

    }
    dayEventsElem.insertAdjacentHTML('beforeend', renderEvent(event));
    eventTitleElem.value = '';

}

const deleteEvent = (e) => {
    const day = document.getElementById('evt-date').textContent;
    const selectedEventElem = e.target.parentElement;
    const eventIndex = Array.from(selectedEventElem.parentNode.children).indexOf(selectedEventElem);
    let dayEvents = getDayEvents(day);
    if (confirm("Are you sure you want to remove event?")) {
        selectedEventElem.remove();
        dayEvents.splice(eventIndex, 1)
        if (dayEvents.length === 0) {
            delete events[day];
            document.getElementById('point').remove();
        }
        updateLocalEvents();
    }
}

const closeEvent = () => {
    document.querySelector(".cal-events").innerHTML = "";
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

const getPreviousMonth = () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
}
const getNextMonth = () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
}

document.addEventListener('click', (e) => {
    const byId = e.target.id;

    switch (byId) {
        case 'prev':
            getPreviousMonth();
            break;
        case 'next':
            getNextMonth();
            break;
        case 'save':
            createEvent(e);
            break;
        case 'delete':
            deleteEvent(e);
            break;
        case 'close':
            closeEvent();
            break;
    }
})

renderCalendar();




















