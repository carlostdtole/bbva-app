const wrapper = document.querySelector(".wrapper"),
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
weatherPart = wrapper.querySelector(".weather-part"),
bottom=weatherPart.querySelector(".bottom-days"),
imagen1= bottom.querySelector(".day1 img"),
imagen2= bottom.querySelector(".day2 img"),
imagen3= bottom.querySelector(".day3 img"),
iconPrin = weatherPart.querySelector("img"),
arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", e =>{
    // Comprobar que se introduce texto en el campo de búsqueda, de lo contrario error.
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation){ // Comprobación navegador compatible con geolocalización.
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Su navegador no es compatible con geolocalización");
    }
});

function requestApi(city){
    //Llamada mediante ciudad introducida.
    api = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=1c837bea0af86e32c80da35bb13498fb&lang=es&cnt=16`;
    fetchData();
}

function onSuccess(position){
    //Llamada mediante geolocalización.
    const {latitude, longitude} = position.coords; // Obtenemos coordenadas latitud y longitud
    api = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=1c837bea0af86e32c80da35bb13498fb&lang=es&cnt=16`;
    fetchData();
}

function onError(error){
    // Se muestra un mensaje de error si no se obtiene las coordenadas.
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function fetchData(){
    infoTxt.innerText = "Obteniendo detalles del tiempo...";
    infoTxt.classList.add("pending");
   //Obtenemos respuesta de la api y la parseamos
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() =>{
        infoTxt.innerText = "Algo fué mal :(";
        infoTxt.classList.replace("pending", "error");
    });
    fetch(api).then(res => res.json()).then(function(data) {
        console.log(data);
    });

}

function weatherDetails(info){
    if(info.cod == "404"){ // if user entered city name isn't valid
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} no es un nombre de ciudad válido`;
    }else{
        //Obtenemos valores de los detalles del tiempo que deseamos.
        const city = info.city.name;
        const country = info.city.country;
        const {description} = info.list[0].weather[0];
        const {temp, feels_like, humidity} = info.list[0].main;
        const id=info.list[0].weather[0].id;
        const wind=info.list[0].wind.speed;

        //Declaramos arrays para los iconos y las imágenes.
        const icons=[];
        const imagenes=[];
        imagenes[0]=imagen1;
        imagenes[1]=imagen2;
        imagenes[2]=imagen3;

        //Obtenemos detalles del tiempo para los próximos 3 días.
        //Dia 1
        const dayname1 = new Date(info.list[0].dt * 1000).toLocaleDateString("es", {
            weekday: "long",
        });
       // const icon1=0;
        icons[0] = info.list[3].weather[0].id;
        const temp1 = info.list[3].main.temp;

        //Dia 2
        const dayname2 = new Date(info.list[3].dt * 1000).toLocaleDateString("es", {
            weekday: "long",
        });
        icons[1] = info.list[11].weather[0].id;
        const temp2 = info.list[11].main.temp;

        //Dia 3
        const dayname3 = new Date(info.list[11].dt * 1000).toLocaleDateString("es", {
            weekday: "long",
        });
        icons[2] = info.list[15].weather[0].id;
        const temp3 = info.list[15].main.temp;

        //Seleccionamos icono según el id obtenido anteriormente.
        if(id == 800){
            iconPrin.src = "icons/clear.svg";        
        }else if(id >= 200 && id <= 232){
            iconPrin.src = "icons/storm.svg";      
        }else if(id >= 600 && id <= 622){
            iconPrin.src = "icons/snow.svg";          
        }else if(id >= 701 && id <= 781){
            iconPrin.src = "icons/haze.svg";
        }else if(id >= 801 && id <= 804){
            iconPrin.src = "icons/cloud.svg";     
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            iconPrin.src = "icons/rain.svg";
        }
       
        //Seleccionamos icono según el id obtenido anteriormente para los próximos días.
        for (var i = 0; i <3; i++) {
            if(icons[i] == 800){
                imagenes[i].src = "icons/clear.svg";
            }else if(icons[i]  >= 200 && icons[i]  <= 232){
                imagenes[i].src = "icons/storm.svg";      
            }else if(icons[i]  >= 600 && icons[i]  <= 622){
                imagenes[i].src = "icons/snow.svg";          
            }else if(icons[i]  >= 701 && icons[i]  <= 781){
                imagenes[i].src = "icons/haze.svg";
            }else if(icons[i]  >= 801 && icons[i]  <= 804){
                imagenes[i].src = "icons/cloud.svg";     
            }else if((icons[i]  >= 500 && icons[i]  <= 531) || (icons[i]  >= 300 && icons[i]  <= 321)){
                imagenes[i].src = "icons/rain.svg";
            }

        }

        //Parseamos información obtenida a elementos específicos
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city},${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        weatherPart.querySelector(".wind span").innerText = `${wind}`;

        weatherPart.querySelector(".day1 span").innerText = dayname1;
        weatherPart.querySelector(".temp .numb1").innerText = Math.floor(temp1);

        weatherPart.querySelector(".day2 span").innerText = dayname2;
        weatherPart.querySelector(".temp .numb2").innerText = Math.floor(temp2);

        weatherPart.querySelector(".day3 span").innerText = dayname3;
        weatherPart.querySelector(".temp .numb3").innerText = Math.floor(temp3);

        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
});
