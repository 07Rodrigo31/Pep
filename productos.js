class Producto {
    #name; #price; #stock;
    constructor(nombre, precio, stock) {
        this.#name = nombre;
        this.#price = precio;
        this.#stock = stock;
    }

    //Getter
    get nombre() {
        return this.#name;
    }

    get price() {
        return `$${this.#price.toFixed(2)}`
    }

    get disponible() {
        return this.#stock > 0;
    }

    get stock() {
        return this.#stock
    }

    //setter
    set stock(nuevoStock) {
        if (nuevoStock >= 0 && typeof nuevoStock === 'number') {
           this.#stock = nuevoStock 
        
        } else {
            console.error('Valor de stock incorrecto')
        }
        
    }
}

const CocaCola = new Producto('Supermini',2,12)
CocaCola.stock = 25;
console.log(CocaCola.stock)

