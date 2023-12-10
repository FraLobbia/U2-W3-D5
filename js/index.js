const endPoint = "https://striveschool-api.herokuapp.com/api/product/";
const token =
	"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTcyMGYxYzBkOGEyMDAwMThhNDhiNTIiLCJpYXQiOjE3MDE5NzM3ODgsImV4cCI6MTcwMzE4MzM4OH0.Kn9YzZA1fLPxw_xkhw9M8rPanpPw3O46igadjHIJorQ";

// defining fields and target to modify --------------------------------------------------------------
const alertBox = document.getElementById("alert-box");
const previewImage = document.getElementById("preview-image");

// fullfill the page --------------------------------------------------------------
fetch(endPoint, {
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
	.then((catalog) => {
		catalog.forEach((item) => {
			const name = item.name;
			const description = item.description;
			const brand = item.brand;
			const imageUrl = item.imageUrl;
			const price = item.price;
			const id = item._id;

			const catalogContainer = document.getElementById("catalog");
			const cardItem = document.createElement("div");
			cardItem.classList.add("col-6", "col-md-3", "card-group");

			cardItem.innerHTML = ` 
            <div class="card mt-4">
					<img src="${imageUrl}" class="card-img-top" alt="immagine ${name}" style="max-height: 200px ; object-fit:contain" />
					<div class="card-body d-flex flex-column justify-content-between">
                    <div>
                    <h5 class="card-title">${name}</h5>
                    <span class="badge bg-success mb-2 ">${price} €</span>
						<p class="card-text">
							${description}
						</p>
                    </div>
                        <div class="d-flex flex-column justify-content-between align-items-baseline">    
                            <div>
                                <a href="./product_details.html?resourceId=${id}" class="btn btn-primary mt-2">Scopri di più</a>
                                <a href="./backoffice.html?resourceId=${id}" class="btn btn-secondary px-4 mt-2">Edit</a>
                            </div>
                        </div>    
					</div>
				</div>`;

			catalogContainer.appendChild(cardItem);
		});
	})
	.catch((error) => {
		showAlertError(error);
		// document.querySelector(".spinner-border").classList.add("d-none")
	});

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
