document.addEventListener("DOMContentLoaded", () => {
    const monsterContainer = document.getElementById("monster-container");
    const monsterForm = document.getElementById("monster-form");
    const backButton = document.getElementById("back");
    const forwardButton = document.getElementById("forward");

    let page = 1; // Track current page

    // Fetch and display monsters
    function fetchMonsters(page) {
        fetch(`http://localhost:3000/monsters?_limit=50&_page=${page}`)
            .then(response => response.json())
            .then(monsters => {
                monsterContainer.innerHTML = ""; 
                monsters.forEach(monster => renderMonster(monster));
            })
            .catch(error => console.error("Error fetching monsters:", error));
    }

    // Render a single monster
    function renderMonster(monster) {
        const monsterDiv = document.createElement("div");
        monsterDiv.innerHTML = `
            <h2>${monster.name}</h2>
            <p>Age: ${monster.age}</p>
            <p>Description: ${monster.description}</p>
        `;
        monsterContainer.appendChild(monsterDiv);
    }

    // Handle form submission to create a new monster
    function createMonster(event) {
        event.preventDefault(); 

        const name = document.getElementById("name").value;
        const age = document.getElementById("age").value;
        const description = document.getElementById("description").value;

        if (!name || !age || !description) {
            alert("Please fill in all fields.");
            return;
        }

        const newMonster = {
            name: name,
            age: parseFloat(age),
            description: description
        };

        fetch("http://localhost:3000/monsters", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(newMonster)
        })
        .then(response => response.json())
        .then(monster => {
            renderMonster(monster); 
            monsterForm.reset(); 
        })
        .catch(error => console.error("Error creating monster:", error));
    }

    // Pagination: Go to previous page
    function goBack() {
        if (page > 1) {
            page--;
            fetchMonsters(page);
        }
    }

    // Pagination: Go to next page
    function goForward() {
        page++;
        fetchMonsters(page);
    }

    // Attach event listeners
    monsterForm.addEventListener("submit", createMonster);
    backButton.addEventListener("click", goBack);
    forwardButton.addEventListener("click", goForward);

    // Fetch first 50 monsters on page load
    fetchMonsters(page);
});
