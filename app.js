const userId = localStorage.getItem('user_id');
let btn = document.getElementById('toggleBtn');
let navbar = document.getElementById('navToggle');
btn.addEventListener('click', () => {
  navbar.classList.toggle('hidden');
});

var loader = document.getElementById('preloader');

window.addEventListener('load', function () {
  loader.style.display = 'none';
  var mainContent = document.getElementById('main-content');
  mainContent.classList.remove('hidden');
});

document.addEventListener('DOMContentLoaded', () => {
  fetchAllCakeItems();
});

document.addEventListener('DOMContentLoaded', function () {
  const authLinks = document.getElementById('authLinks');
  const token = localStorage.getItem('token');

  if (token) {
    authLinks.innerHTML = `
            <ul class="lg:flex items-center justify-center font-semibold xl:text-2xl lg:p-4">
                <li class="mx-2 py-2 lg:mt-6 xl:mt-4">
                    <a
                        href="profile.html"
                        class="p-2 transition ease-in-out delay-300 duration-300 hover:bg-yellow-300 hover:bg-yellow-300 rounded-lg"
                    >Profile</a>
                </li>
                
                <li class="mx-2 py-2 lg:mt-6 xl:mt-4">
                    <a
                        href="#"
                        id="logout"
                        class="p-2 transition ease-in-out delay-300 duration-300 hover:bg-yellow-300 hover:bg-yellow-300 rounded-lg"
                    >Logout</a>
                </li>
            </ul>
        `;

    document.getElementById('logout').addEventListener('click', function () {
      handleLogout();
      window.location.href = 'index.html';
    });
  }
});

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const getValue = (id) => {
  const value = document.getElementById(id).value;
  return value;
};

const handleRegistration = (event) => {
  event.preventDefault();
  const username = getValue('username');
  const first_name = getValue('firstname');
  const last_name = getValue('lastname');
  const email = getValue('email');
  const password = getValue('password');
  const confirm_password = getValue('confirm_password');

  const info = {
    username: username,
    first_name: first_name,
    last_name: last_name,
    password: password,
    confirm_password: confirm_password,
    role: 'user',
    email: email,
  };

  fetch('http://127.0.0.1:8000/user/signup/', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    'X-CSRFToken': getCookie('csrftoken'),
    body: JSON.stringify(info),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return res.json();
      }
    })
    .then((data) => {
      if (
        data.username ||
        data.first_name ||
        data.last_name ||
        data.email ||
        data.password ||
        data.confirm_password
      ) {
        displayErrors(data);
      } else {
        var element = document.getElementById('registrationForm');
        element.reset();

        const msgField = document.getElementById(`registration_msg`);
        if (msgField) {
          msgField.textContent = data;
        }
      }
    })
    .catch((err) => console.log(err));
};

const handleLogin = (event) => {
  event.preventDefault();
  const username = getValue('login-username');
  const password = getValue('login-password');
  const info = {
    username: username,
    password: password,
  };

  if ((username, password)) {
    fetch('http://127.0.0.1:8000/user/login/', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(info),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (data.token && data.user_id) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user_id', data.user_id);
          localStorage.setItem('role', data.role);
          alert('User Logged In');
          var element = document.getElementById('loginForm');
          element.reset();
          window.location.href = 'profile.html';
        }

        if (data.error) {
          const msgField = document.getElementById(`login-error`);
          if (msgField) {
            msgField.textContent = data.error;
          }
        } else {
          displayErrors(data);
        }
      });
  } else {
    alert('You must provide username and password fields.');
  }
};

const handleLogout = () => {
  var token = localStorage.getItem('token');

  fetch('http://127.0.0.1:8000/user/logout/', {
    method: 'POST',
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
  })
    .then((response) => {
      if (response.ok) {
        alert('User Logged Out');
        localStorage.clear();
      } else {
        console.error('Logout failed');
      }
    })
    .catch((error) => console.error('Error:', error));
};

function showCards(data) {
  const container = document.getElementById('cake-container');
  container.innerHTML = '';
  data.forEach((ele) => {
    const delivery_txt =
      ele.delivery_type == 1 ? 'Same Day Delivery' : 'Next Day Delivery';
    const delivery_txt_clr =
      ele.delivery_type == 1 ? 'bg-amber-300' : 'bg-amber-500';
    const card = `
      
      <div
          class="my-4 rounded-xl bg-stone-100 border-1 transition ease-in-out duration-300 delay-300 hover:border-black hover:drop-shadow-2xl"
          id = 'cardEle-${ele.id}'
          data-id= "${ele.id}"
          data-price = "${ele.price}"
        >
          <img
            class="h-64 md:h-80 w-full rounded-t-xl"
            src="${ele.image}"
            alt=""
          />
          <div
            class="w-full p-1 ${delivery_txt_clr} rounded-b-xl text-center font-bold"
          >
              ${delivery_txt}
          </div>
          <div class="p-4">
            <div class="py-3 text-center">
              <p>
               ${ele.cake_description}
              </p>
              <h1 class="text-xl font-semibold p-3">Price: ${ele.price}</h1>
              <hr />
            </div>
            <div>
              <label
                for="cake-size"
                class="block text-sm font-medium p-1 text-gray-800"
                >Select Cake Size</label
              >
              <select
                id="cake-size-${ele.id}"
                name="cake-size"
                class="mt-1 block w-full bg-stone-100 border-2 pl-3 pr-10 py-2 text-base border-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value='1'>Small (1kg)</option>
                <option value='2'>Medium (1.5kg)</option>
                <option value='3'>Large (2kg)</option>
              </select>
            </div>
            <button
              class="btn border border-black rounded my-3 px-4 py-2 font-bold transition ease-in-out duration-300 hover:scale-x-90"
              onclick="PurchaseCake(event, ${ele.id})"
            >
              <a href="">
              
              Purchase Now</a>
            </button>
          </div>
        </div>`;

    container.innerHTML += card;
  });
}

function fetchAllCakeItems() {
  fetch('http://127.0.0.1:8000/cake/list/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
  })
    .then((res) => {
      // console.log(res);
      return res.json();
    })
    .then((data) => {
      showCards(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

function PurchaseCake(event, cardId) {
  event.preventDefault();

  if (userId) {
    const card = document.getElementById(`cardEle-${cardId}`);
    const cake = card.getAttribute('data-id');
    const size = document.getElementById(`cake-size-${cardId}`).value;

    const info = {
      user: userId,
      cake: cake,
      cake_size: size,
    };

    fetch('http://127.0.0.1:8000/purchase/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify(info),
    })
      .then((response) => {
        if (response.ok) {
          alert('Item Purchased successfully!');
        } else {
          alert('Something went wrong');
        }
      })
      .catch((error) => console.error('Error:', error));
  } else {
    alert('Please Login To purchase the item!');
  }
}
