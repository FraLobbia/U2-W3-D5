const endPoint = "https://striveschool-api.herokuapp.com/api/product/";
const token =
	"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTcyMGYxYzBkOGEyMDAwMThhNDhiNTIiLCJpYXQiOjE3MDE5NzM3ODgsImV4cCI6MTcwMzE4MzM4OH0.Kn9YzZA1fLPxw_xkhw9M8rPanpPw3O46igadjHIJorQ";

// get resourceId from URL
const resourceId = new URLSearchParams(window.location.search).get(
	"resourceId"
);

// defining fields
const H1 = document.querySelector("h1");
const previewImage = document.getElementById("preview-image");
const nameField = document.getElementById("name");
const descriptionField = document.getElementById("description");
const brandField = document.getElementById("brand");
const imageUrlField = document.getElementById("imageUrl");
const priceField = document.getElementById("price");
const submitButton = document.getElementById("submitButton");
const deleteButton = document.getElementById("deleteButton");
const alertBox = document.getElementById("alert-box");

// checking if create|edit
if (resourceId) {
	method = "PUT";
	URL = endPoint + resourceId;
	fillFieldByResourceId(); // filling fields with data to modify
	submitButton.classList.add("btn-warning"); //
	submitButton.innerHTML = "Salva modifica";
	H1.innerHTML = "Modifica un articolo";
} else {
	method = "POST";
	URL = endPoint;
	submitButton.classList.add("btn-primary");
	submitButton.innerHTML = "Crea";
	H1.innerHTML = "Inserisci un nuovo articolo";
	deleteButton.classList.add("d-none");
}

submitButton.addEventListener("click", (event) => {
	event.preventDefault();
	handleRequest();
});

deleteButton.addEventListener("click", (event) => {
	event.preventDefault();
	handleDelete();
});

//------------- da qui in poi dichiaro tutte le funzioni
//  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function handleRequest() {
	//creating Obj to convert in JSON
	const newItem = {
		name: nameField.value,
		description: descriptionField.value,
		brand: brandField.value,
		imageUrl: imageUrlField.value,
		price: priceField.value,
	};

	fetch(URL, {
		method,
		// converting Obj to JSON and attaching to body
		body: JSON.stringify(newItem),
		headers: {
			"Content-Type": "application/json",
			Authorization: token,
		},
	})
		.then((response) => response.json())
		.then((item) => showAlert(item._id, method, item.imageUrl));
}

//  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function handleDelete() {
	const hasConfirmed = confirm("Sei sicuro di voler eliminare il prodotto?");

	if (hasConfirmed) {
		fetch(URL, {
			method: "DELETE",
			headers: { Authorization: token },
		}) // here the items has already been deleted
			.then((resp) => {
				if (resp.ok) {
					return resp.json();
				}
			})
			.then((deletedObj) => {
				showAlert(deletedObj._id, "DELETE", deletedObj.imageUrl);

				setTimeout(() => {
					window.location.assign("./index.html");
				}, 3000);
			});
	}
}
//  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function showAlert(id, methodType, urlImgObjCreatedOrEdited) {
	switch (methodType) {
		case "POST":
			colorCode = "primary";
			action = "creato";
			break;
		case "PUT":
			colorCode = "warning";
			action = "modificato";
			break;
		case "DELETE":
			colorCode = "danger";
			action = "eliminato";
			break;
		default:
			colorCode = "secondary";
			break;
	}

	alertBox.innerHTML = `<div class="alert alert-${colorCode} p-5" role="alert">
	L'item con ID ${id} è stato <span class="fs-3">${action}</span>
	</div>`;

	previewImage.innerHTML = `
	<img
		src="${urlImgObjCreatedOrEdited}"
		class="img-thumbnail mx-auto d-block my-4"
		alt="..."
		style="max-height: 200px"
	/>`;

	setTimeout(() => {
		window.location.href = "./backoffice.html";
	}, 3000);
}
//  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function fillFieldByResourceId() {
	fetch(URL, {
		headers: {
			Authorization: token,
		},
	})
		.then((response) => response.json())
		.then((returnedObj) => {
			const name = returnedObj.name;
			const description = returnedObj.description;
			const brand = returnedObj.brand;
			const imageUrl = returnedObj.imageUrl;
			const price = returnedObj.price;
			const id = returnedObj._id;

			previewImage.innerHTML = `
						<img
							src="${imageUrl}"
							class="img-thumbnail mx-auto d-block my-4"
							alt="..."
							style="max-height: 200px"
						/>`;
			nameField.value = name;
			descriptionField.value = description;
			brandField.value = brand;
			imageUrlField.value = imageUrl;
			priceField.value = price;
		});
}
//  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
