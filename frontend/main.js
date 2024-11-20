
const baseUrl = "http://localhost:3002/"
const signUpPage = "http://localhost:3002/sign-up"


function adminA(){
    document.getElementById("admin").addEventListener("submit", function (event) {
        event.preventDefault(); // למנוע את שליחת הטופס המיידית

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        fetch("http://localhost:3002/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // אם ההתחברות הצליחה, כוון את המשתמש לדף ההזמנות
                window.location.href = "./all.html"; // דף כל ההזמנות
            } else {
                alert(data.message); // הצגת שגיאה אם ההתחברות נכשלה
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
}



async function signIn(){
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const creadentials = {email , password}
    const result = await fetch(baseUrl, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creadentials)
    })
    const user = await result.json();
    if (user._id) {
        localStorage.setItem("user", user.name)
        localStorage.setItem("prodc", "")
        alert("התחברות הצליחה!");
        window.location.href = "/frontend/products.html";
    } else {
        alert("התחברות נכשלה: משתמש לא נמצא");
    }
    console.log(await result.json())
} 

function name(){
    const greet = "Hello "+ localStorage.getItem("user")+" welcome to the shop"
    const data = document.getElementById("hello")
    data.innerText = greet
}




async function signUp(){
    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const creadentials = {email , password, name}

    const result = await fetch(signUpPage, {
        method: "post",
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(creadentials)
    })
    const res = await result.json()
    alert (res.info)
    if (res.created)
        window.location.href = "/frontend/home.html";

}

async function products() {
    const result = await fetch(baseUrl + "products", {
        method: "post",
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({})
        
})
    const res = await result.json()
    console.log(res)
    return res 
}


async function ListbyName(){
    const data = await products()
    let list = document.getElementById("list")
    list.innerHTML=""
    data.sort((a, b) => 
        {
            const nameA = a.name.toUpperCase(); // ignore upper and lowercase
            const nameB = b.name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) 
                return -1;
            if (nameA > nameB) 
                return 1;
            return 0;})
    for(const product of data){
        let div = document.createElement("div")
        const item = product.name+ " " + product.price
        div.innerText = item
        div.setAttribute("onclick","GetPending(`"+product._id+"`)")
        list.appendChild(div)
    }
}

async function ListbyPrice(){
    const data = await products()
    let list = document.getElementById("list")
    list.innerHTML=""
    data.sort((a, b) => a.price - b.price)
    for(const product of data){
        let div = document.createElement("div")
        div.setAttribute("onclick","GetPending(`"+product._id+"`)")
        const item = product.name+ " " + product.price
        div.innerText = item
        list.appendChild(div)
    }
}


async function productsList(){
    const data = await products()
    let list = document.getElementById("list")
    for(const product of data){
        let div = document.createElement("div")
        const item = product.name+ " " + product.price
        div.innerText = item
        div.id = product._id
       div.setAttribute("onclick","addToCart('"+product.name+"')"
)
        list.appendChild(div)
    }
}

function addToCart(object_info = null){

    if (localStorage.getItem("prodc")==="")
        localStorage.setItem("prodc",JSON.stringify([object_info]))
    else{
        const arr = JSON.parse(localStorage.getItem("prodc"))
        const index = arr.indexOf(object_info)
        if (index === -1)
        {
            arr.push(object_info)
            const string = JSON.stringify(arr)
            localStorage.setItem("prodc",string)
            console.log(string, index)
        }
        else
        {
            arr.splice(index,1)
            const string = JSON.stringify(arr)
            localStorage.setItem("prodc", string)
            console.log(string, index)
        }

    }
}

    async function shoping(){
    const data = await products()
    let list = document.getElementById("shopingcart")
    let sum = 0 
    const arr = JSON.parse(localStorage.getItem("prodc"))
    list.innerHTML=""
    data.sort((a, b) => 
        {
            const nameA = a.name.toUpperCase(); 
            const nameB = b.name.toUpperCase(); 
            if (nameA < nameB) 
                return -1;
            if (nameA > nameB) 
                return 1;
            return 0;})
        for(const product of data){
            if(arr.includes(product.name)){
                let div = document.createElement("div")
                const item = product.name+ " " + product.price
                div.innerText = item
                div.setAttribute("onclick","GetPending(`"+product._id+"`)")
                list.appendChild(div)   
                sum += product.price
            }
    }
    let div = document.createElement("div")
    localStorage.setItem("sum", sum)
    div.innerHTML="total price is: "+sum
    list.appendChild(div)
}

async function buyMe(){
 const arr = JSON.parse(localStorage.getItem("prodc"))
 const user_id = localStorage.getItem("user")
 const sum = localStorage.getItem("sum")
 const info = {product: arr, userId: user_id, sum: sum}
 const req = await fetch(baseUrl + "pending", {
    method: "post",
    headers: {'Content-type': 'application/json'},
    body: JSON.stringify(info)

 })
 const res = await req.json()
 if(res.created){
    localStorage.clear()
    alert("הקנייה הושלמה בהצלחה")
    window.location.href = "./home.html"
 }
}

 async function all(){
    const qStrin = window.location.search
    try{
        const req = await fetch(baseUrl + "all" + qStrin)
        if(!req.ok)
        {
            let main = document.getElementById("main")
            main.innerHTML = "404 not found"
            return
        }
        const res = await req.json()
        console.log(res)
        const orders = document.getElementById("orders")
        for(const list of res){
            const div = document.createElement("div")
            orders.appendChild(div)
            div.innerText = "user_name: " + list.userId
            div.innerHTML += "<br/>"
            div.innerText += "products: "
            div.innerHTML += "<br/>"
            for(const products of list.product){
                div.innerText += products
                div.innerHTML += "<br/>"
            }
            div.innerText += "the sum to pay is: " + list.sum
            div.innerHTML += "<br/>"
                        div.innerHTML += "<br/>"
                                    div.innerHTML += "<br/>"
                                                div.innerHTML += "<br/>"
                                                            div.innerHTML += "<br/>"
                                                                        div.innerHTML += "<br/>"
                                                                        
        }
    }catch{

    }
 }