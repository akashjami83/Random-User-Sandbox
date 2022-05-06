const people_card_container = document.getElementById('cards')

/**
 * I am making 2 copies for the data to get back original data 
 * after filtering it below
 */
let data = []
let tmp_data = []

/**
 * This function will get the data from https://randomuser.me/api.
 * The parameter n will help me identify how much data is needed.
 * 
 */
async function get_data_from_api (n) {
  const d = await fetch('https://randomuser.me/api/?results=' + n)
  const data1 = await d.json()
  tmp_data = data1.results
  data = data1.results
}

/**
 * This function will create one card from the data it gets
 * in parameter data_item
 * 
 * I had already written html and css for it so I am just adding that to 
 * innerHTML property of a newly created div.
 * 
 * Then I will attach the newly created div to our parent cards container
 */
function create_people_card (data_item) {
  const main_container = document.createElement('div')

  main_container.innerHTML = `<div class="personCard">
          <img class="personImg" src="${data_item.picture.large}" alt="person" />
          <h3>${data_item.name.title + ' ' + data_item.name.first + ' ' + data_item.name.last}</h3>
          <p>${data_item.dob.age} years old</p>
          <p class="job">${data_item.email}</p>
          <p>${data_item.location.city + ', ' + data_item.location.country}</p>
          <div class="cardBottom">
            <div class="cost">${data_item.phone}</div>
            <div class="rating">
              <p>${data_item.gender}</p>
            </div>
          </div>`

  people_card_container.append(main_container)
}

/**
 * This function will get data for a single person from https://randomuser.me
 * I will use this person for personalized greetings.
 */
async function get_first_person () {
  const data = await fetch('https://randomuser.me/api/')
  const data1 = await data.json()

  const person = data1.results[0]

  const header = document.getElementById('header')
  header.innerHTML = `<h1>👋👋👋 Good Morning !!!</h1><p>${person.name.first + ' ' + person.name.last}</p>`
}

/**
 * This function will clear all old cards present in parent cards container
 * Then it will create new cards and attach them to the same.
 * 
 * It will iterate over all items in data and create cards for them.
 */
function render_cards () {
  people_card_container.innerHTML = ""

  for (const d of data) {
    create_people_card(d)
  }
}

/**
 * I will first the person for greetings
 */
get_first_person()

/**
 * Then I will get data for other people and render cards for them
 */
get_data_from_api(10).then(function () {
  render_cards()
})

/**
 * This is the "user count" part in sidebar
 */
const plus = document.getElementById('user_count_plus')
const minus = document.getElementById('user_count_minus')
const count = document.getElementById('user_count')

plus.addEventListener('click', on_count_change)
minus.addEventListener('click', on_count_change)

/**
 * I will check if the button clicked is plus or minus
 * then I will increment or decrement the user count respectively 
 */
function on_count_change (e) {
  const last_count = parseInt(count.innerText)
  if (e.target.id === 'user_count_plus') {
    // Since plus button was clicked, I will get the count from 
    // the count label and increment it by 1
    count.innerText = last_count + 1
    get_data_from_api(last_count + 1).then(render_cards)
  } else {
    // Since minus button was clicked, I will get the count from 
    // the count label and decrement it by 1
    count.innerText = last_count - 1
    get_data_from_api(last_count - 1).then(render_cards)
  }
}

/**
 * This is for the gender filter part in sidebar
 */
const male_filter = document.getElementById('male_filter')

// This will work when the male filter is clicked
male_filter.addEventListener('click', function () {
  // The filter function will show only some data depending on the
  // on the condition we put in its function.
  // I only want to show people with gender male here
  // So I will return true only for values with gender male
  data = tmp_data.filter(function (val) {
    return val.gender === 'male'
  })

  // This will update cards with new data
  render_cards()
})

// This will work when the female filter is clicked
const female_filter = document.getElementById('female_filter')
female_filter.addEventListener('click', function () {
  // I only want to show people with gender female here
  // So I will return true only for values with gender female
  data = tmp_data.filter(function (val) {
    return val.gender === 'female'
  })
  render_cards()
})

// This will work when the show all filter is clicked
const show_all_filter = document.getElementById('all_gender_filter')
show_all_filter.addEventListener('click', function () {
  // Here I dont want to filter anything, instead i want to show all original data
  // So I'll replace value of data with value of tmp_data which contains all the people
  data = tmp_data
  render_cards()
})

// This will work when the age slider is moved
const age_slider = document.getElementById('age_slider')
age_slider.addEventListener('change', function (e) {
  // When value of age slider changes, I want to show people who are smaller than given age
  // So I will return true only if the person's age is lesser than our slider value
  data = tmp_data.filter(function (val) {
    return val.dob.age <= e.target.value
  })
  render_cards()
})

// This will work when the name sorting option is clicked
const name_sort = document.getElementById('name_sort')
name_sort.addEventListener('click', function () {
  // To sort our data I am making use of the sort function.
  // The sort function will compare all elements in an array two at a time.
  // The function provided will execute for each comparison.
  // We have to return -1 if first element is smaller, 0 if both are equal otherwise 1
  //
  // The localeCompare function will compare 2 strings alphabetically and return 
  // -1, 0, 1 respectively.
  data = data.sort(function (a, b) {
    return a.name.first.localeCompare(b.name.first)
  })
  render_cards()
})

const age_sort = document.getElementById('age_sort')
age_sort.addEventListener('click', function () {
  data = data.sort(function (a, b) {
    // To sort be age, if I simply subtract the ages, it will return 
    // < 0 if first person is younger (which works instead of -1), 0 if both have same age
    // > 0 if the first person is older (which works instead of 1).
    return a.dob.age - b.dob.age
  })
  render_cards()
})

const location_sort = document.getElementById('location_sort')
location_sort.addEventListener('click', function () {
  // To sort by location I am again using the localeCompare function
  data = data.sort(function (a, b) {
    return a.location.city.localeCompare(b.location.city)
  })
  render_cards()
})


