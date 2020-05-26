window.onload = ()=>{

    var campo = document.querySelector("#campoBusca");
    var btn = document.querySelector("#btnBusca");
    var usuarios = document.querySelector("#usuarios");
    var dadosGerais = document.querySelector("#dadosGerais");
    var dados = [];
    
    var pegardados = async () => {
        let a = await fetch("https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo");
        a = await a.json();
        a = a.results;
        dados = a.map((item)=>{return {
            "name":item.name.first+" "+item.name.last,
            "gender":item.gender,
            "picture":item.picture.thumbnail,
            "age":item.dob.age
        }});
    };
    pegardados();

    var ordenar = (lista) =>{
        return lista.sort((a,b)=>(a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
    }

    var converterNumeroIntl = (numero)=>new Intl.NumberFormat('pt-BR').format(numero);

    var filtrar = ()=>{
        let dadosAtuais = dados.filter((item)=>item.name.toLowerCase().includes(campo.value.toLowerCase()));
        
        if(dadosAtuais.length==0){
            usuarios.children[0].textContent = "Nenhum usuário filtrado";
            dadosGerais.children[0].textContent = "Nada a ser exibido";
            usuarios.children[1].innerHTML = "";
            dadosGerais.children[1].innerHTML = "";
        }else{
            dadosAtuais = ordenar(dadosAtuais);
            usuarios.children[0].textContent = `${dadosAtuais.length} usuário(s) encontrado(s)`;
            dadosGerais.children[0].textContent = "Estatísticas";
            usuarios.children[1].innerHTML = dadosAtuais.map((item)=>`
                <div class="divUsuario">
                    <img class="foto" src="${item.picture}" />
                    <span>${item.name}, ${item.age} anos</span>
                </div>
            `).join("");
            let somaidades = dadosAtuais.map((item)=>item.age).reduce((acc,val)=>acc+val);
            let quantMale = 0;
            let quantFemale = 0;
            dadosAtuais.forEach(item=>item.gender=="male"?quantMale++:quantFemale++);
            dadosGerais.children[1].innerHTML = `
                <span>Sexo masculino: <b>${quantMale}</b></span><br>
                <span>Sexo feminino: <b>${quantFemale}</b></span><br>
                <span>Soma das idades: <b>${somaidades}</b></span><br>
                <span>Média das idades: <b>${converterNumeroIntl((somaidades/dadosAtuais.length).toFixed(2))}</b></span><br><br>
            `;
        }
    }

    campo.addEventListener("keyup",(ev)=>{
        btn.disabled = campo.value.length==0;
        if(ev.keyCode==13){
            filtrar(); 
        }
    });

    btn.addEventListener("click",(ev)=>{
        filtrar();      
    });
};