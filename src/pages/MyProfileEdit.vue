<template>
  <div class="content mb-20 ml-10">
    <BaseHeading1 class="text-3xl text-gray-900 mt-4">Editar mi perfil</BaseHeading1>

    <form @submit.prevent="handleSubmit" class="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <section class="space-y-4">
        <h2 class="inline-block bg-gray-100 text-xl p-2 border rounded-xl shadow text-gray-700 font-semibold">Información personal</h2>

        <div class="mb-4">
          <label for="displayName" class="block mb-2 text-sm font-medium text-gray-900"><strong class="text-gray-900 text-xl">Nombre de usuario</strong></label>
          <input type="text" id="displayName" class="w-full p-2 border rounded" v-model="editData.displayName" />
        </div>

        <div class="mb-4">
          <label for="rol" class="block mb-2 text-sm font-medium text-gray-900"><strong class="text-gray-900 text-xl">Tipo de usuario</strong></label>
          <select id="rol" class="w-full p-2 border rounded" v-model="editData.rol">
            <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
          </select>
        </div>

        <div class="mb-4">
          <label for="email" class="block mb-2 text-sm font-medium text-gray-900"><strong class="text-gray-900 text-xl">Email</strong></label>
          <input type="email" id="email" class="w-full p-2 border rounded" v-model="editData.email" />
        </div>

        <!-- Аккордеон для выбора телефона с кодом страны -->
        <div class="mb-4">
          <label for="telefono" class="block mb-2 text-sm font-medium text-gray-900"><strong class="text-gray-900 text-xl">Número de teléfono</strong></label>
          
          <!-- Селектор стран с кодами -->
          <div class="flex gap-2">
            <select v-model="selectedCountry" class="w-1/4 p-2 border rounded">
              <option v-for="(country, index) in countries" :key="index" :value="country.code">
                {{ country.name }} {{ country.code }}
              </option>
            </select>

            <!-- Поле ввода номера телефона без кода страны -->
            <input
              type="text"
              id="telefono"
              class="w-full p-2 border rounded"
              v-model="maskedTelefono"
              placeholder="Ejemplo: 123 456 789"
            />
          </div>
        </div>

        <div class="mb-4">
          <label for="metodosDePago" class="block mb-2 text-sm font-medium text-gray-900"><strong class="text-gray-900 text-xl">Métodos de pago</strong></label>
          <input type="text" id="metodosDePago" class="w-full p-2 border rounded" v-model="editData.metodosDePago" />
        </div>

        <div class="mb-4">
          <label for="bio" class="block mb-2 text-sm font-medium text-gray-900"><strong class="text-gray-900 text-xl">Sobre mí</strong></label>
          <textarea id="bio" class="w-full p-2 border rounded" v-model="editData.bio"></textarea>
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="inline-block bg-gray-100 text-xl p-2 border rounded-xl shadow text-gray-700 font-semibold">Información sobre tu auto</h2>

  <!-- Марка автомобиля -->
<div class="mb-4">
  <label for="marca" class="block mb-2 text-sm font-medium text-gray-900">
    <strong class="text-gray-900 text-xl">Marca</strong>
  </label>
  <select id="marca" class="w-full p-2 border rounded" v-model="editData.marca" @change="updateModels">
  <option v-for="mark in marks" :key="mark.id" :value="mark.name">{{ mark.name }}</option>
</select>

</div>

<!-- Модель автомобиля -->
<div class="mb-4">
  <label for="modelo" class="block mb-2 text-sm font-medium text-gray-900">
    <strong class="text-gray-900 text-xl">Modelo</strong>
  </label>
  <select id="modelo" class="w-full p-2 border rounded" v-model="editData.modelo">
  <option v-for="model in filteredModels" :key="model.id" :value="model.name">{{ model.name }}</option>
</select>
</div>


        <div class="mb-4">
          <label for="año" class="block mb-2 text-sm font-medium text-gray-900"><strong class="text-gray-900 text-xl">Año</strong></label>
          <input type="number" id="año" class="w-full p-2 border rounded" v-model="editData.año" />
        </div>

        <div class="mb-4">
          <label for="color" class="block mb-2 text-sm font-medium text-gray-900"><strong class="text-gray-900 text-xl">Color</strong></label>
          <input type="text" id="color" class="w-full p-2 border rounded" v-model="editData.color" />
        </div>

        <div class="mb-4">
          <label for="tipoCombustible" class="block mb-2 text-sm font-medium text-gray-900"><strong class="text-gray-900 text-xl">Tipo de combustible</strong></label>
          <input type="text" id="tipoCombustible" class="w-full p-2 border rounded" v-model="editData.tipoCombustible" />
        </div>

        <div class="mb-4">
          <label for="consumoPromedio" class="block mb-2 text-sm font-medium text-gray-900"><strong class="text-gray-900 text-xl">Consumo promedio</strong></label>
          <input type="text" id="consumoPromedio" class="w-full p-2 border rounded" v-model="editData.consumoPromedio" />
        </div>
      </section>

      <div>
        <button type="submit" class="transition-all py-2 px-4 rounded bg-green-700 text-white focus:bg-green-500 hover:bg-green-500 active:bg-green-900">
          Actualizar
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import BaseHeading1 from "../components/BaseHeading1.vue";
import { editMyProfile, subscribeToAuthState } from "../services/auth";

let unsubscribeAuth = () => {};

export default {
  name: "MyProfileEdit",
  components: { BaseHeading1 },
  data() {
    return {
      editData: {
        displayName: "",
        rol: "",
        bio: "",
        email: "",
        telefono: "",
        marca: "",
        modelo: "",
        año: "",
        color: "",
        tipoCombustible: "",
        consumoPromedio: "",
        metodosDePago: "",
      },
      marks: [], // Список марок
      filteredModels: [],
      selectedCountry: "", // Дефолтный код страны
      maskedTelefono: "", // Маскированный номер телефона (без кода страны)
      countries: [
        { name: "AR", code: "+54" },  // Argentina
        { name: "BR", code: "+55" },  // Brasil
        { name: "PY", code: "+595" }, // Paraguay
        { name: "UY", code: "+598" }, // Uruguay
        { name: "CL", code: "+56" },  // Chile
      ],
      editing: false,
      roles: ["Pasajero", "Conductor"],
    };
  },
  methods: {
    
    async loadCarData() {
  try {
    const response = await fetch("/cars.json");
    if (!response.ok) {
      throw new Error(`Ошибка загрузки: ${response.statusText}`);
    }
    const carsData = await response.json();
    this.marks = carsData;

    // Логируем марку и модель для отладки
    console.log("Marks loaded:", this.marks);

    // После загрузки данных устанавливаем марку по умолчанию
    if (this.marks.length > 0) {
      // Устанавливаем марку из данных профиля, если она есть
      this.editData.marca = this.editData.marca || this.marks[0].name; // Если марка пуста, выбираем первую
      this.updateModels(); // Обновляем список моделей для выбранной марки
    }
  } catch (error) {
    console.error("Ошибка при загрузке данных", error);
  }
}

,

updateModels() {
  // Находим выбранную марку
  const selectedMark = this.marks.find(mark => mark.name === this.editData.marca);
  
  // Если марка найдена, фильтруем модели для этой марки
  if (selectedMark) {
    this.filteredModels = selectedMark.models;
    
    // Если модель больше не существует, сбрасываем её
    if (!this.filteredModels.find(model => model.name === this.editData.modelo)) {
      this.editData.modelo = ""; // Сбросить выбранную модель, если она больше не доступна
    }
  } else {
    // Если марка не найдена, очищаем список моделей
    this.filteredModels = [];
  }
}


,
async handleSubmit() {
  // Собираем полный номер с кодом страны
  this.editData.telefono = this.selectedCountry + this.maskedTelefono;

  // Убедитесь, что данные о марке и модели отправляются правильно
  console.log("Submitting data:", this.editData);
  
  this.editing = true;
  try {
    await editMyProfile({ ...this.editData });
    this.$router.push("/mi-perfil");
  } catch (error) {
    console.error(error);
  }
  this.editing = false;
},
  },
  mounted() {

    // Загружаем данные при монтировании компонента

    unsubscribeAuth = subscribeToAuthState((userData) => {
    this.editData = {
      displayName: userData.displayName || "",
      rol: userData.rol || "",
      bio: userData.bio || "",
      email: userData.email || "",
      telefono: userData.telefono || "",
      marca: userData.marca || "",  // Убедитесь, что марка загружается
      modelo: userData.modelo || "",  // Убедитесь, что модель загружается
      año: userData.año || "",
      color: userData.color || "",
      tipoCombustible: userData.tipoCombustible || "",
      consumoPromedio: userData.consumoPromedio || "",
      metodosDePago: userData.metodosDePago || "",
    };

    // После того как данные загрузились, обновляем список моделей
    this.updateModels();

    // Запоминаем начальный номер телефона
    this.telefonoOriginal = userData.telefono || "";
    
    // Определяем код страны на основе текущего номера телефона
    const countryCode = this.editData.telefono ? this.editData.telefono.slice(0, 3) : "";
    const country = this.countries.find(c => c.code === countryCode);
    if (country) {
      this.selectedCountry = country.code;
      this.maskedTelefono = this.editData.telefono.slice(countryCode.length);
    }
  });
  this.loadCarData();
},
  unmounted() {
    unsubscribeAuth();
  },
};
</script>
