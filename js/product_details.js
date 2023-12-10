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
const fixResponsiveArray = document.querySelectorAll(
	"form>div:not(:last-child)"
); // fixResponsiveArray non una soluzione adeguata ma avevo voglia di provare un po' di cose senza dover ripensare html e css

window.addEventListener("resize", () => {
	if (window.innerWidth >= 576) {
		for (const element of fixResponsiveArray) {
			element.className = "input-group mb-3";
		}
	} else {
		for (const element of fixResponsiveArray) {
			element.className = "input-group-sm mb-3";
		}
	}
});

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
			if (!response.ok) throw response.status;
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
		})
		.catch((error) => {
			showAlertError(error);
			// document.querySelector(".spinner-border").classList.add("d-none")
		});
}
//  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function showAlertError(errorCode) {
	switch (errorCode) {
		case 404:
			message = "Risorsa non trovata.";
			break;
		case 401:
			message = "Non sei autorizzato.";
			break;
		case 418:
			message = "I'm a teapot.";
			break;
		default:
			message = "Errore con codice non definito";
			break;
	}

	alertBox.innerHTML = `
	<div class="alert alert-danger p-5" role="alert">
	    <p class="fs-1"201>${message}</p>
		<p>Codice errore: ${errorCode}</p>
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
