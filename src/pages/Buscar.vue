<template>
    <BaseHeading1 class="text-center text-3xl text-gray-900 mt-4">Buscar viaje o solicitud</BaseHeading1>
    <div id="map" class="h-96 mb-4"></div> <!-- Контейнер карты с меньшим отступом -->
    <div class="flex justify-center items-start mt-4 mb-40">
        <div class="w-1/2 p-4 border rounded flex justify-center">
            <!-- Секция ввода данных -->
            <section class="w-full p-2 shadow-md bg-white">
                <h2 class="text-xl text-green-700 mb-4">Construir ruta</h2>
                <div class="mb-4 suggestions-container">
                    <label class="block mb-2"><strong>Origen:</strong></label>
                    <input v-model="origin.city" @input="getSuggestionsDebounced(origin.city, 'origin')" placeholder="Nombre de la ciudad" class="p-2 border rounded mb-2"/>
                    <ul v-if="originSuggestions.length" class="suggestions-list">
                        <li v-for="(suggestion, index) in originSuggestions" :key="index" @click="origin.city = suggestion; originSuggestions = []" class="suggestion-item">{{ suggestion }}</li>
                    </ul>
                </div>
                <div class="mb-4 suggestions-container">
                    <label class="block mb-2"><strong>Destino:</strong></label>
                    <input v-model="destination.city" @input="getSuggestionsDebounced(destination.city, 'destination')" placeholder="Nombre de la ciudad" class="p-2 border rounded"/>
                    <ul v-if="destinationSuggestions.length" class="suggestions-list">
                        <li v-for="(suggestion, index) in destinationSuggestions" :key="index" @click="destination.city = suggestion; destinationSuggestions = []" class="suggestion-item">{{ suggestion }}</li>
                    </ul>
                </div>
                <button @click="getRoute" class="transition-all py-2 px-4 rounded bg-green-700 text-white focus:bg-green-500 hover:bg-green-500 active:bg-green-900">
                    Buscar
                </button>
            </section>
        </div>
    </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import BaseHeading1 from '../components/BaseHeading1.vue';
import { subscribeToAuthState } from '../services/auth.js';
import { saveTrip } from '../services/viajes.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

let unsubscribeAuth = () => {};

mapboxgl.accessToken = 'pk.eyJ1IjoibWF4aWFzZGRzYWRzZGYiLCJhIjoiY20ydGM4MGFzMDFrZDJrb2gyMGV5ajFnMCJ9.l0ZQB85L5nD3LWTRYM0hlA';

export default {
    name: 'ConstruirRuta',
    components: { BaseHeading1 },
    data() {
        return {
            loggedUser: {
                id: null,
                email: null,
                displayName: null,
                rol: null,
            },
            origin: { city: '' },
            destination: { city: '' },
            originSuggestions: [],
            destinationSuggestions: [],
            routeLayer: null,
            numSeats: 1,
            routeInfo: {
                distance: null,
                duration: {
                    hours: 0,
                    minutes: 0,
                },
                recommendedPrice: null,
            },
            customPrice: '', 
            map: null,
        };
    },
    methods: {
        async getCoordinates(city) {
            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${mapboxgl.accessToken}`;
            const response = await fetch(url);
            const data = await response.json();
            return data.features[0]?.geometry.coordinates;
        },
        async getRoute() {
            if (!this.origin.city || !this.destination.city) {
                alert("Por favor, introduce ciudades válidas para los puntos de inicio y destino.");
                return;
            }

            const originCoordinates = await this.getCoordinates(this.origin.city);
            const destinationCoordinates = await this.getCoordinates(this.destination.city);

            if (!originCoordinates || !destinationCoordinates) {
                alert("No se pudieron encontrar las coordenadas de las ciudades.");
                return;
            }

            const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoordinates[0]},${originCoordinates[1]};${destinationCoordinates[0]},${destinationCoordinates[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

            const response = await fetch(url);
            const data = await response.json();
            const route = data.routes[0].geometry;

            this.routeInfo.distance = (data.routes[0].distance / 1000).toFixed(2); // Переводим в километры
            const totalMinutes = Math.round(data.routes[0].duration / 60);
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;

            this.routeInfo.duration = {
                hours,
                minutes,
            };

            // Расчет рекомендованной цены
            const fuelConsumptionPer100km = 7;
            const fuelPricePerLiter = 1000;
            const distanceInKm = parseFloat(this.routeInfo.distance);
            const basePrice = (distanceInKm / 100) * fuelConsumptionPer100km * fuelPricePerLiter;

            this.routeInfo.recommendedPrice = this.numSeats > 0 ? (basePrice / this.numSeats).toFixed(2) : basePrice.toFixed(2);

            if (this.routeLayer) {
                this.map.removeLayer('route');
                this.map.removeSource('route');
            }

            this.map.addSource('route', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {},
                    geometry: route,
                },
            });

            this.map.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#3887be',
                    'line-width': 5,
                    'line-opacity': 0.75
                }
            });

            this.routeLayer = 'route'; 

            this.map.fitBounds([
                [Math.min(originCoordinates[0], destinationCoordinates[0]), Math.min(originCoordinates[1], destinationCoordinates[1])],
                [Math.max(originCoordinates[0], destinationCoordinates[0]), Math.max(originCoordinates[1], destinationCoordinates[1])]
            ], { padding: 20 });
        },
        async saveTrip() {
    const tripData = {
        origin: this.origin.city,
        destination: this.destination.city,
        numSeats: this.numSeats,
        price: this.customPrice || this.routeInfo.recommendedPrice,
        user_id: this.loggedUser.id,
    };

    try {
        const originCoordinates = await this.getCoordinates(this.origin.city);
        const destinationCoordinates = await this.getCoordinates(this.destination.city);

        if (!originCoordinates || !destinationCoordinates) {
            alert("Не удалось получить координаты для карты.");
            return;
        }

        // Создаем URL для статического снимка карты от Mapbox
        const imageUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-o+000(${originCoordinates[0]},${originCoordinates[1]}),pin-s-d+f00(${destinationCoordinates[0]},${destinationCoordinates[1]})/${originCoordinates[0]},${originCoordinates[1]},6,0/600x400?access_token=${mapboxgl.accessToken}`;

        // Загружаем изображение карты как Blob и проверяем его формат и размер
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        // Проверка: загружен ли действительно файл PNG
        if (blob.type !== 'image/png') {
            console.error("Файл не является изображением PNG.");
            return;
        }

        // Проверка: минимальный размер файла (если он слишком мал, это, скорее всего, ошибка)
        if (blob.size < 1000) { // Пример: минимум 1 КБ
            console.error("Файл слишком мал для изображения карты.");
            return;
        }

        // Сохраняем изображение в Firebase Storage с уникальным путем
        const storage = getStorage();
        const uniqueFilePath = `mapSnapshots/${Date.now()}_map.png`;
        const storageRef = ref(storage, uniqueFilePath);
        await uploadBytes(storageRef, blob);

        // Получаем URL для загруженного изображения
        const downloadURL = await getDownloadURL(storageRef);
        tripData.mapSnapshot = downloadURL; // Сохраняем URL в базе данных

        // Сохраняем поездку в базе данных
        const tripRef = await saveTrip(tripData);
        alert('Поездка успешно сохранена!');
        
        // Переход на страницу публикации поездки
        this.$router.push({ name: 'PublicarViaje', params: { tripId: tripRef.id } });
    } catch (error) {
        console.error('Ошибка при сохранении поездки:', error);
        alert('Ошибка при сохранении поездки.');
    }
},


        async getSuggestions(city, field) {
            if (!city) {
                if (field === 'origin') {
                    this.originSuggestions = [];
                } else {
                    this.destinationSuggestions = [];
                }
                return;
            }

            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${mapboxgl.accessToken}`;
            const response = await fetch(url);
            const data = await response.json();
            const suggestions = data.features.map(feature => feature.place_name);

            if (field === 'origin') {
                this.originSuggestions = suggestions;
            } else {
                this.destinationSuggestions = suggestions;
            }
        },

        debounce(func, delay) {
            let timeout;
            return function (...args) {
                const context = this;
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(context, args), delay);
            };
        },
    },
    async mounted() {
        this.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-58.3816, -34.6037],
            zoom: 6,
        });

        unsubscribeAuth = subscribeToAuthState(newUserData => this.loggedUser = newUserData);

        this.getSuggestionsDebounced = this.debounce(this.getSuggestions, 300);
    },
    unmounted() {
        unsubscribeAuth();
    }
}
</script>




<style>
.suggestions-list {
    border: 1px solid #ccc;
    background-color: white;
    position: absolute;
    z-index: 1000;
    width: calc(100% - 16px);
}

.suggestion-item {
    padding: 8px;
    cursor: pointer;
}

.suggestion-item:hover {
    background-color: #f0f0f0;
}

#map {
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.67);
    overflow: hidden;
}

.suggestions-container {
    position: relative; /* Чтобы список предложений появился под полем */
}

.suggestions-list {
    position: absolute;
    top: 100%; /* Позиционирует список сразу под полем */
    left: 0;
    border: 1px solid #ccc;
    background-color: white;
    z-index: 1000;
    width: calc(100% - 16px); /* Отступ, если нужно */
    max-height: 150px; /* Ограничивает высоту */
    overflow-y: auto; /* Добавляет прокрутку */
}

.suggestion-item {
    padding: 8px;
    cursor: pointer;
}

.suggestion-item:hover {
    background-color: #f0f0f0;
}

</style>
