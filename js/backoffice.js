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
});

//------------- da qui in poi dichiaro tutte le funzioni
const handleDelete = () => {
	// chiediamo conferma all'utente di voler eliminare
	const hasConfirmed = confirm("sei sicuro di voler eliminare l'appuntamento?");

	if (hasConfirmed) {
		// se accetta procediamo all'effettiva rimozione

		// isLoading(true); // avvio lo spinner di caricamento

		fetch(URL, {
			method: "DELETE",
		}) // già a questo punto la risorsa è stata eliminata
			.then((resp) => {
				// aspettare con un then ci può essere utile solo per sapere esattamente quando il server ci ha risposto per avere ulteriore conferma
				if (resp.ok) {
					return resp.json();
				}
			})
			.then((deletedObj) => {
				showAlert(
					"hai eliminato la risorsa " +
						deletedObj.name +
						" che aveva id: " +
						deletedObj._id,
					"danger"
				);
				// un alert custom non fa attendere prima del cambio pagina con window.location assign,
				// abbiamo quindi bisogno di un setTimeout per forzare l'attesa per il tempo desiderato
				setTimeout(() => {
					window.location.assign("./index.html");
				}, 3000);
			})
			.finally(() => {
				isLoading(false); // spengo lo spinner di caricamento
			});
	}
};
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

	// isLoading(true); //avvio lo spinner di caricamento

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
		.then((createdObj) => showAlert(createdObj._id, method, newItem.imageUrl));
}

//  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function showAlert(id, methodType, urlImgObjCreatedOrEdited) {
	console.log(methodType);
	const colorCode = methodType === "POST" ? "primary" : "warning";
	const action = methodType === "POST" ? "creato" : "modificato";

	alertBox.innerHTML = `<div class="alert alert-${colorCode} p-5" role="alert">
	L'item con ID ${id} è stato ${action}
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
// function emptyFields() {
// 	previewImage.innerHTML = "";
// 	nameField.value = "";
// 	descriptionField.value = "";
// 	brandField.value = "";
// 	imageUrlField.value = "";
// 	priceField.value = "";
// 	submitButton.classList.remove("btn-warning");
// 	submitButton.classList.add("btn-primary");
// 	submitButton.innerHTML = "Crea";
// 	alertBox.innerHTML = "";
// }
