const endPoint = "https://striveschool-api.herokuapp.com/api/product/";
const token =
	"Bearera eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTcyMGYxYzBkOGEyMDAwMThhNDhiNTIiLCJpYXQiOjE3MDE5NzM3ODgsImV4cCI6MTcwMzE4MzM4OH0.Kn9YzZA1fLPxw_xkhw9M8rPanpPw3O46igadjHIJorQ";

// get resourceId from URL --------------------------------------------------------------
const resourceId = new URLSearchParams(window.location.search).get(
	"resourceId"
);

// defining fields and target to modify --------------------------------------------------------------
const H1 = document.querySelector("h1");
const previewImage = document.getElementById("preview-image");
const nameField = document.getElementById("name");
const descriptionField = document.getElementById("description");
const brandField = document.getElementById("brand");
const imageUrlField = document.getElementById("imageUrl");
const priceField = document.getElementById("price");
const submitButton = document.getElementById("submitButton");
const deleteButton = document.getElementById("deleteButton");
const confirmModalButton = document.getElementById("confirmModalButton");
const resetFieldsButton = document.getElementById("resetFields");
const alertBox = document.getElementById("alert-box");
const modalTitle = document.querySelector(".modal-title");
const modalBody = document.querySelector(".modal-body");

// checking if I want create or edit by resourceId presence -------------------------------
if (resourceId) {
	method = "PUT";
	URL = endPoint + resourceId;
	fillFieldByResourceId(); // filling fields with data to modify
	submitButton.classList.add("btn-warning");
	submitButton.innerHTML = "Salva modifica";
	H1.innerHTML = "Modifica un articolo";
} else {
	method = "POST";
	URL = endPoint;
	submitButton.classList.add("btn-primary");
	submitButton.innerHTML = "Crea";
	H1.innerHTML = "Inserisci un nuovo articolo";
	deleteButton.classList.add("d-none");
	resetFieldsButton.classList.add("d-none");
}

// handling buttons behaviour --------------------------------------------------------------
submitButton.addEventListener("click", (event) => {
	event.preventDefault();
	handleRequest();
});

deleteButton.addEventListener("click", () => {
	handleModal(
		"Conferma delete",
		"Alla conferma l'oggetto verrà eliminato dal server",
		"Sì, cancellalo",
		"danger",
		handleDelete
	);
});

resetFieldsButton.addEventListener("click", () => {
	handleModal(
		"Conferma reset campi",
		"Alla conferma i campi verranno resettati",
		"Sì, resettali",
		"primary",
		emptyFields
	);
});

//------------- from here only functions declaration
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
			Authorization: "fgssr",
		},
	})
		.then((response) => {
			console.log(response);
			switch (true) {
				case response.status === 404:
					throw new Error(response.status, " risorsa non trovata");
					break;
				case response.status === 401:
					throw new Error("Non sei autorizzato. Errore: " + response.status);
					break;
				case response.status >= 400 && response.status < 500:
					throw new Error("Errore lato Client: " + response.status);
					break;
				case response.status >= 500 && response.status < 600:
					throw new Error("Errore lato Server: " + response.status);
					break;

				default:
					break;
			}
			if (!response.ok) showAlertError(response.status);

			// document.querySelector(".spinner-border").classList.add("d-none")
			return response.json();
		})
		.then((item) => showAlert(item._id, method, item.imageUrl))
		.catch((error) => {
			console.log(error);
			// document.querySelector(".spinner-border").classList.add("d-none")
		});
}

//  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function handleDelete() {
	fetch(URL, {
		method: "DELETE",
		headers: { Authorization: token },
	}) // here the items has already been deleted
		.then((response) => {
			console.log(response);
			switch (true) {
				case response.status === 404:
					throw new Error(response.status, " risorsa non trovata");
					break;
				case response.status === 401:
					throw new Error("Non sei autorizzato. Errore: " + response.status);
					break;
				case response.status >= 400 && response.status < 500:
					throw new Error("Errore lato Client: " + response.status);
					break;
				case response.status >= 500 && response.status < 600:
					throw new Error("Errore lato Server: " + response.status);
					break;
				default:
					break;
			}

			// document.querySelector(".spinner-border").classList.add("d-none")
			return response.json();
		})
		.then((deletedObj) => {
			showAlert(deletedObj._id, "DELETE", deletedObj.imageUrl);

			setTimeout(() => {
				window.location.assign("./index.html");
			}, 3000);
		})
		.catch((error) => {
			console.log(error);
			// document.querySelector(".spinner-border").classList.add("d-none")
		});
}

//  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function fillFieldByResourceId() {
	fetch(URL, {
		headers: {
			Authorization: token,
		},
	})
		.then((response) => {
			console.log(response);
			switch (true) {
				case response.status === 404:
					throw new Error(response.status);

				case response.status === 401:
					const customError = new Error("Questo è un errore personalizzato");
					customError.code = response.status;
				case response.status >= 400 && response.status < 500:
					throw new Error(response.status);

				case response.status >= 500 && response.status < 600:
					throw new Error(response.status);

				default:
					break;
			}

			// document.querySelector(".spinner-border").classList.add("d-none")
			return response.json();
		})
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
		})
		.catch((error) => {
			showAlertError(error);
		});
}
//  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function emptyFields() {
	// previewImage.innerHTML = "";
	nameField.value = "";
	descriptionField.value = "";
	brandField.value = "";
	imageUrlField.value = "";
	priceField.value = "";
}
//  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function handleModal(
	title = "Conferma azione",
	body = "Sei sicuro?",
	textButtonConfirm = "Conferma",
	colorButtonConfirm = "primary",
	functionToAdd
) {
	modalTitle.innerHTML = title;
	modalBody.innerHTML = body;
	confirmModalButton.innerHTML = textButtonConfirm;
	confirmModalButton.className = "btn btn-" + colorButtonConfirm;

	confirmModalButton.addEventListener("click", (event) => {
		functionToAdd();
	});
}

//  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function showAlert(id, methodType, urlImgObjCreatedOrEdited) {
	switch (methodType) {
		case "POST":
			colorCode = "success";
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

function showAlertError(errorCode) {
	console.log(errorCode);
	console.log(errorCode.code);

	switch (errorCode.code) {
		case "404":
			message = "Risorsa non trovata.";
			break;
		case "401":
			message = "Non sei autorizzato.";
			break;
		case "418":
			message = "I'm a teapot.";
			break;
		default:
			message = "Errore non personalizzato";
			break;
	}

	alertBox.innerHTML = `
	<div class="alert alert-danger p-5" role="alert">
	    <p class="fs-1"201>${message}</p>
		<p>${errorCode}</p>
	</div>`;

	previewImage.innerHTML = `
	<img
		src="https://a0.anyrgb.com/pngimg/900/1540/sad-meme-your-pepe-the-frog-feel-sad-sadness-crying-tree-frog-know-your-meme-humour.png"
		class="img-thumbnail mx-auto d-block my-4"
		alt="error image"
		style="max-height: 200px"
	/>`;

	// setTimeout(() => {
	// 	window.location.href = "./backoffice.html";
	// }, 3000);
}
