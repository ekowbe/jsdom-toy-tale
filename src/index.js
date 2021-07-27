let addToy = false;

const URL_PREFIX = 'http://localhost:3000/';

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // load the page with all the toys
  fetch(URL_PREFIX + 'toys')
    .then(rsp => rsp.json())
    .then(toys => {
      console.log(toys);
      const toyCollection = document.querySelector('#toy-collection');
      toyCollection.innerHTML = '';

      // populate with all the toys
      for (let i = 0; i < toys.length; i++) {
        const toy = toys[i];
        createToyCard(toy);
      }

    });

  // handle new toy form submission
  const newToyForm = document.querySelector('form.add-toy-form')
  newToyForm.addEventListener('submit', event => {
    event.preventDefault()

    // get the user input
    const name = event.target[0].value
    const image = event.target[1].value

    // add toy to collection
    const toy = {
      name,
      image,
      likes: 0
    }
    console.log(toy)

    // persistence
    newToyForm.reset()
    fetch(URL_PREFIX + 'toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: "application/json"
      },
      body: JSON.stringify(toy)
    })
      .then(rsp => rsp.json())
      .then(createToyCard)

  })

  // increase toy's likes
  document.addEventListener('click', event => {
    if (event.target.matches('button.like-button')) {
      const likeBtn = event.target

      // get the toy
      let toyDiv = event.target.closest('div')
      let toyName = toyDiv.querySelector('h2').innerText

      fetch(URL_PREFIX + 'toys')
        .then(rsp => rsp.json())
        .then(toys => {
          let toy = findToy(toys, toyName)
          console.log(toy)

          //update the likes
          let newLikes = parseInt(toy.likes) + 1

          // optimistic rendering
          let toyLikes = toyDiv.querySelector('p')
          toyLikes.innerText = `${newLikes} likes`
          //console.log(toy)

          // patch
          fetch(URL_PREFIX + `toys/${toy.id}`, {
            method: 'PATCH',
            headers:
            {
              'Content-Type': 'application/json',
              Accept: "application/json"
            },
            body: JSON.stringify({
              "likes": `${newLikes}`
            })

          })
        })


    }
  })



});

function findToy(toys, toyName) {
  return toys.find(({ name }) => name === toyName)
}

function createToyCard(toy) {
  // create elements  
  let card = document.createElement('div')

  let nameTag = document.createElement('h2')
  nameTag.innerText = `${toy.name}`

  let toyImage = document.createElement('img')
  toyImage.src = toy.image
  toyImage.className = 'toy-avatar'

  let numLikesTag = document.createElement('p')
  numLikesTag.innerText = `${toy.likes} likes`

  let likeButton = document.createElement('button')
  likeButton.className = 'like-button'
  likeButton.innerText = 'Like <3'

  // add populated elements to DOM
  card.appendChild(nameTag)
  card.appendChild(toyImage)
  card.appendChild(numLikesTag)
  card.appendChild(likeButton)

  document.querySelector('#toy-collection').appendChild(card)

}
