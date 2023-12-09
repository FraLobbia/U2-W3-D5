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

URL = endPoint + resourceId;
fillFieldByResourceId(); // filling fields with data to modify

//------------- da qui in poi dichiaro tutte le funzioni
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
			if (!response.ok) throw new Error("Errore nel reperimento dei dati");

			// document.querySelector(".spinner-border").classList.add("d-none")
			return response.json();
		})
		.then((returnedObj) => {
			console.log(returnedObj);
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
							style="max-height: 400px"
						/>`;
			nameField.value = name;
			descriptionField.value = description;
			brandField.value = brand;
			imageUrlField.value = imageUrl;
			priceField.value = price;
		});
}
