document.addEventListener('dragover', dragOverHandler, false)
document.addEventListener('drop', dropHandler, false)

function dropHandler(ev) {
    console.log('File(s) dropped');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (ev.dataTransfer.items[i].kind === 'file') {
                var file = ev.dataTransfer.items[i].getAsFile();
                console.log('... file[' + i + '].name = ' + file.name);
                createDOMElements(URL.createObjectURL(ev.dataTransfer.files[i]));
            }
        }
    } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.files.length; i++) {
            console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
            // Create a div element for the image
            // Create an image element and use the transfered file as source


        }
    }


}

function dragOverHandler(ev) {
    console.log('File(s) in drop zone');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}

function createDOMElements(imageURL) {
    var div = `
        <div class="card">
            <img src="${imageURL}" class="card-picture" />
            <img src="corners.png" class="card-corners" />
            <img src="Overpowered_Corner.png" class="card-corners" />
        </div>
    `;
    document.body.appendChild(htmlToElement(div));
}

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

var cardUnderCursor;
oncontextmenu = (e) => {
    e.preventDefault();
    let menu = document.createElement("div");
    menu.id = "ctxmenu";
    menu.classList.add("no-print");
    menu.style = `top:${e.pageY - 10}px;left:${e.pageX - 40}px`;
    menu.onmouseleave = deleteContextMenu;
    menu.innerHTML = `
        <p onclick="duplicateCard(1)">Duplicate once</p>
        <p onclick="duplicateCard(2)">Duplicate twice</p>
        <p onclick="duplicateCard(3)">Duplicate thrice</p>
        <p onclick="removeCard()">Delete</p>
        <p onclick="removeAllCopies()">Delete all copies</p>
    `;
    document.body.appendChild(menu);
    cardUnderCursor = e.target.closest(".card");
}

function duplicateCard(numberOfDuplicates) {
    let card = cardUnderCursor;
    for (let i = 0; i < numberOfDuplicates; i++) {
        let newCard = card.cloneNode(true);
        card.parentNode.insertBefore(newCard, card.nextSibling);
    }
    deleteContextMenu();
}

function removeCard() {
    cardUnderCursor.remove();
    deleteContextMenu();
}

function removeAllCopies() {
    let card = cardUnderCursor;
    // find all similar cards and remove them
    // a similar card has an image of class .card-picture as a first child that has the same src

    let similarCards = card.parentNode.querySelectorAll(".card-picture[src='" + card.querySelector(".card-picture").src + "']");
    for (let i = 0; i < similarCards.length; i++) {
        similarCards[i].parentNode.remove();
    }
}

function deleteContextMenu() {
    ctxmenu.remove();
}