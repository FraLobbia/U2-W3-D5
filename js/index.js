const endPoint = "https://striveschool-api.herokuapp.com/api/product/";
const token =
	"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTcyMGYxYzBkOGEyMDAwMThhNDhiNTIiLCJpYXQiOjE3MDE5NzM3ODgsImV4cCI6MTcwMzE4MzM4OH0.Kn9YzZA1fLPxw_xkhw9M8rPanpPw3O46igadjHIJorQ";

fetch("https://striveschool-api.herokuapp.com/api/product/", {
	headers: {
		Authorization: token,
	},
})
	.then((response) => response.json())
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
					<img src="${imageUrl}" class="card-img-top" alt="immagine ${name}" />
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
                                <a href="./product_details.html?resourceId=${id}" class="btn btn-primary mt-2">Details</a>
                                <a href="./backoffice.html?resourceId=${id}" class="btn btn-secondary px-4 mt-2">Edit</a>
                            </div>
                        </div>    
					</div>
				</div>`;

			catalogContainer.appendChild(cardItem);
		});
	});
