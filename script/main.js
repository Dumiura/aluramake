import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore, collection, getDocs, setDoc, doc, onSnapshot, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyCWxthy-mD9zb3ttdrMyTKu7QlYLiRaZuE",
authDomain: "miura-d598f.firebaseapp.com",
projectId: "miura-d598f",
storageBucket: "miura-d598f.appspot.com",
messagingSenderId: "1044743287046",
appId: "1:1044743287046:web:c163615f51fa0de2f12e87",
measurementId: "G-PF02GDSE8V"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const produtosRef = collection(db, 'produtos')

const produtosDiv = document.getElementById('produtos');

function createElement(e, classes){
    const element = document.createElement(e);
    element.classList = classes;
    return element;
}

const alertaExclusao = document.getElementById('alertaExclusao');
const excluir = document.getElementById('excluir');
const salvar = document.getElementById('salvar');
const cancelar = document.getElementById('cancelar');
const cancelarSalvamento = document.getElementById('cancelarSalvamento');
const edicao = document.getElementById('edicao')
const nameEdit = document.getElementById('nameEdit')
const priceEdit = document.getElementById('priceEdit')
const linkEdit = document.getElementById('linkEdit')
const excluido = document.getElementById('excluido')
const salvo = document.getElementById('salvo')



function createProduto(background, nome, preco){
    const produto = createElement('div', 'produto');
    const image = createElement('div', 'image');
    image.style.background = `url(${background})`;
    image.style.backgroundSize = '100% 100%';
    image.style.backgroundRepeat = 'no-repeat';
    image.style.backgroundPosition = 'center';
    const produtoText = createElement('p', 'produtoText');
    produtoText.innerText = nome;
    const price = createElement('div', 'price');
    const priceText = createElement('p')
    priceText.innerText = `R$ ${preco.replaceAll('.', ',')}`;
    const icons = createElement('div', 'icon')
    const pencil = createElement('img', 'pencil')
    pencil.src = 'images/pencil.png'
    pencil.width = 20;
    pencil.addEventListener('click', ()=>{
        edicao.style.display = 'flex'
        nameEdit.value = nome
        priceEdit.value = preco
        linkEdit.value = background
        salvar.addEventListener('click', ()=>{
            if(nameEdit.value == nome && priceEdit.value == preco && linkEdit.value == background){
                edicao.style.display = 'none'
            }else{

                deleteDoc(doc(db, 'produtos', `${nome}`))
                produto.remove()
                setDoc(doc(produtosRef, `${nameEdit.value}`), {
                    background: `${linkEdit.value}`,
                    nome: `${nameEdit.value}`,
                    price: `${priceEdit.value}`
                });
                edicao.style.display = 'none'
            }
            salvo.style.scale = 1
            setTimeout(()=>{
                salvo.style.scale = 0
            }, 3000)
        })
        cancelarSalvamento.addEventListener('click', ()=>{
            edicao.style.display = 'none'
        })
    })
    const crash = createElement('img', 'crash')
    crash.src = `images/trash.png`;
    crash.width = 20;
    crash.addEventListener('click', ()=>{
        alertaExclusao.style.display = 'flex';
        excluir.addEventListener('click', ()=>{
            deleteDoc(doc(db, 'produtos', `${nome}`))
            produto.remove()
            excluido.style.scale = 1
            setTimeout(()=>{
                excluido.style.scale = 0
            }, 3000)
        })
        cancelar.addEventListener('click', ()=>{
            alertaExclusao.style.display = 'none'
        })
        
    })

    price.appendChild(priceText);
    icons.appendChild(pencil);
    icons.appendChild(crash);
    price.appendChild(icons);
    produto.appendChild(image);
    produto.appendChild(produtoText);
    produto.appendChild(price);
    produtosDiv.appendChild(produto);
}


const nome = document.getElementById('name');
const preco = document.getElementById('price');
const link = document.getElementById('link');
const alerta = document.getElementById('alert');

function setProduto(){
    if(nome.value == '' || preco.value == '' || link.value == ''){
        alerta.style.display = 'block'
    }else{
        alerta.style.display = 'none'
        setDoc(doc(produtosRef, `${nome.value}`), {
            background: `${link.value}`,
            nome: `${nome.value}`,
            price: `${preco.value}`
        });
        
        nome.value = '';
        preco.value = '';
        link.value = '';
    }
};

document.getElementById('limpar').addEventListener('click', ()=>{
    nome.value = '';
    preco.value = '';
    link.value = '';
    alerta.style.display = 'none'
})



document.getElementById('guardar').addEventListener('click', setProduto);

onSnapshot(collection(db, 'produtos'), (snapshot) => {
    snapshot.docChanges().forEach((change)=>{
        if(change.type === 'added'){
            const dados = change.doc.data();
            createProduto(dados.background, dados.nome, dados.price)
        }
    })
})