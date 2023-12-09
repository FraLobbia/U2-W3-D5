const endPoint = "https://striveschool-api.herokuapp.com/api/product/";
const token =
	"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTcyMGYxYzBkOGEyMDAwMThhNDhiNTIiLCJpYXQiOjE3MDE5NzM3ODgsImV4cCI6MTcwMzE4MzM4OH0.Kn9YzZA1fLPxw_xkhw9M8rPanpPw3O46igadjHIJorQ";

fetch(endPoint, {
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
		console.log(error);
		// document.querySelector(".spinner-border").classList.add("d-none")
	});
