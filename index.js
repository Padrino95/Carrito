const URL = "https://dummyjson.com/products";
let row = document.querySelector("section#productos .row");
let containerCarrito = document.querySelector("header div.compras");
let numProductoCarrito = document.querySelector(".carritoCompras span");
let carrito = [];

document.addEventListener("DOMContentLoaded", () => {
    async function cargarProductos() {
        let datos = await fetch(URL);
        let resultados = await datos.json();
        resultados.products.forEach(producto => {
            row.innerHTML += ` 
                <div class="col-md-4">
                    <div class="card border-primary mb-3">
                        <div class="card-header">
                            <img src="${producto.thumbnail}" alt="" class="img-fluid" />
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h4 class="card-title">${producto.title}</h4>
                            <p class="card-text">${producto.description}</p>
                            <p> <span>  ${producto.price} </span> €</p>
                            <button class="btn btn-danger mt-auto" onClick="agregarAlCarrito(this, ${producto.id})">Añadir al carrito</button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    cargarProductos();
});

function agregarAlCarrito(elemento, id) {
    let padre = elemento.parentElement.parentElement;
    numProductoCarrito.textContent = parseInt(numProductoCarrito.textContent) + 1;

    let productosAgregados = {
        id: id,
        img: padre.querySelector("img").src,
        titulo: padre.querySelector("h4").textContent,
        precio: padre.querySelector(".card-body span").textContent,
        cantidad: 1
    }

    let estoyEnCarrito = carrito.some(producto => producto.id === id);
    if (estoyEnCarrito) {
        carrito = carrito.map(producto => {
            if (producto.id == id) {
                producto.cantidad++;
            }
            return producto;
        });
    } else {
        carrito.push(productosAgregados);
    }

    rellenarCarrito();
}

function rellenarCarrito() {
    limpiar();
    containerCarrito.innerHTML += `<button class="borrarTodo" onClick='borrarTodo()'>Borrar Todo</button>`;
    carrito.forEach(producto => {
        containerCarrito.innerHTML += `
        <div class="row my-3 py-3 align-items-center border-bottom bg-dark text-center">
            <div class="col-md-3">
                <img src="${producto.img}" alt="" class="img-fluid" />
            </div>
            <div class="col-md-3">
                <p>${producto.titulo}</p>
            </div>
            <div class="col-md-3">
                <p>${producto.precio} X ${producto.cantidad}</p>
            </div>
            <div class="col-md-3 d-flex justify-content-center align-items-center">
                <button class="btn btn-danger me-2" onClick="borrarUnidadCarrito(${producto.id})">-</button>
                <button class="btn-close" onClick="borrarProductoCarrito(${producto.id})"></button>
            </div>
        </div>
        `;
    });
}

function borrarTodo() {
    limpiar();
    carrito = [];
    numProductoCarrito.textContent = 0;
}

function borrarProductoCarrito(id) {
    let producto = carrito.find(producto => producto.id === id);
    if (producto) {
        numProductoCarrito.textContent = parseInt(numProductoCarrito.textContent) - producto.cantidad;
        carrito = carrito.filter(producto => producto.id !== id);
        rellenarCarrito();
    }
}

function borrarUnidadCarrito(id) {
    let producto = carrito.find(producto => producto.id === id);
    if (producto) {
        producto.cantidad--;
        numProductoCarrito.textContent = parseInt(numProductoCarrito.textContent) - 1;
        if (producto.cantidad === 0) {
            carrito = carrito.filter(producto => producto.id !== id);
        }
        rellenarCarrito();
    }
}

function limpiar() {
    containerCarrito.innerHTML = "";
}
