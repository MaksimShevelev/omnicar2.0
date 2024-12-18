<template>
    <BaseHeading1 class="flex flex-col justify-center text-3xl items-center text-center mt-4">Opciones del viaje
    </BaseHeading1>
    <div class="mb-40 p-4 flex flex-col">
    <form @submit.prevent="handleSubmit" class="flex flex-col lg:flex-row w-full gap-10">
        <section class="lg:w-1/2 p-4 lg:border-r">
            <div class="mb-4">
                <label for="tripDate" class="block mb-2 text-xl text-green-700">Descripción del viaje</label>
                <textarea
                    id="text"
                    class="w-full min-h-8 p-2 border rounded"
                    v-model="newViaje.text"
                ></textarea>
            </div>

            <div class="mb-4">
                <label for="tripDate" class="block mb-2">Fecha del viaje</label>
                <input
                    type="date"
                    id="tripDate"
                    v-model="tripDate"
                    :min="todayDate"
                    class="w-60 p-2 border rounded"
                    required
                />
            </div>

            <div class="mb-4">
                <label for="tripTime" class="block mb-2">Horario de la salida</label>
                <input
                    type="time"
                    id="tripTime"
                    v-model="tripTime"
                    :min="isToday ? currentTime : null"
                    class="w-60 p-2 border rounded"
                    required
                />
            </div>

            <div class="mb-4">
                <h3 class="block mb-2 text-xl text-green-700">¿Que tipo de la reserva prefieres agregar?</h3>
                <label class="inline-flex items-center">
                    
                    <input
                        type="radio"
                        value="revisar"
                        v-model="tripType"
                        class="p-2"
                    />
                    <span class="p-3" v-html="tripTypeIcons.revisar"></span>
                     Revisar cada solicitud
                </label>
                <label class="inline-flex items-center mt-5 lg:ml-3">
                    
                    <input
                        type="radio"
                        value="automaticomente"
                        v-model="tripType"
                        class="p-2"
                    />
                    <span class="p-1" v-html="tripTypeIcons.automaticomente"></span>
                     Confirmación automática
                </label>
            </div>
        </section>

        <section class="lg:w-1/2 p-4">
            <div class="mb-4">
                <label for="tripDate" class="block mb-2 text-xl text-green-700">Opciones</label>
                <div
                    v-for="option in availableOptions"
                    :key="option"
                    class="flex items-center mb-4"
                >
                    <input
                        type="checkbox"
                        :value="option"
                        v-model="options"
                        class="mr-2 bg-green-700"
                    />
                    <span class="ml-3" v-html="optionIcons[option]"></span>
                    <span class="ml-3">{{ option }}</span>
                </div>
            </div>
        </section>
    </form>

    <div class="flex justify-center border-t items-center pt-10 mt-10">
        <button
            type="button"
            @click="handleSubmit"
            class="transition-all w-80 py-2 px-4 rounded bg-green-700 text-white focus:bg-green-500 hover:bg-green-500 active:bg-green-900"
        >
            Publicar
        </button>
    </div>

    <BaseLoader v-if="isUpdating" class="mt-4" />
</div>




    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-6 rounded shadow-lg text-center">
            <p class="text-lg font-semibold">¡Viaje publicado con éxito!</p>
            <button @click="confirmModal" class="mt-4 py-2 px-6 rounded bg-green-700 text-white">
                OK
            </button>
        </div>
    </div>
    
</template>

<script>
import { ref, computed } from 'vue';
import mapboxgl from 'mapbox-gl';
import BaseLoader from '../components/BaseLoader.vue';
import BaseHeading1 from '../components/BaseHeading1.vue';
import { subscribeToAuthState } from '../services/auth.js';
import { saveViajes, subscribeToViajes, saveComment, subscribeToComments, updateTrip } from '../services/viajes.js';

let unsubscribeAuth = () => { };

mapboxgl.accessToken = 'pk.eyJ1IjoibWF4aWFzZGRzYWRzZGYiLCJhIjoiY20ydGM4MGFzMDFrZDJrb2gyMGV5ajFnMCJ9.l0ZQB85L5nD3LWTRYM0hlA';

export default {
    name: 'PublicarViaje',
    props: ['tripId'],
    components: { BaseHeading1, BaseLoader },
    data() {
        return {
            viajes: [],
            newViaje: { text: '' },
            comments: {},
            newComment: {},
            loggedUser: { id: null, email: null, displayName: null, rol: null },
            tripDate: '',
            tripTime: '',
            tripType: 'revisar',
            options: [],
            isUpdating: false,
            description: '',
            showModal: false, 
            availableOptions: [
                'Se permite fumar', 'Se permite comida y bebida', 'Se permiten mascotas', 'No me gusta hablar mucho',
                'El baúl está vacío', 'Viajo hasta el destino sin paradas', 'Hay puertos USB para cargar', 'Hay una sillita para niños'
            ],
            availableOptions: ['Se permite fumar', 'Se permite comida y bebida', 'Se permiten mascotas', 'No me gusta hablar mucho', 'El baúl está vacío', 'Viajo hasta el destino sin paradas', 'Hay puertos USB para cargar', 'Hay una sillita para niños'], 
            optionIcons: {
                'Se permite fumar': `<svg width="35" height="35" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="50" height="50" fill="url(#pattern0_286_9573)"/>
<defs>
<pattern id="pattern0_286_9573" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_286_9573" transform="scale(0.02)"/>
</pattern>
<image id="image0_286_9573" width="50" height="50" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACZUlEQVR4nO2YPWgUQRTHf4L4hZwRgqRQwQMRktiIHxCLa64SQdGIXGFzhW0aIRZBEPxArNIEgkZRCxEVRD0VLoWJKH6RBBVtklgYLfTAHCgaFVcG/gvrspHbI8fOxvnBwu7Mvtl5b96892bB4XDYwhLgITBEyjkNeMDziL4bwDjwBDgPFIBFWMgq4CvwG9gS0f9USnqB6x2QxzKOaHL3/vHOMmAtsAu4q/d/ATuxCN/iB2LIHJbMJ2AlFrBAbuXJ4nEoS+4Qliji+33cDbxXcsNYwgdNaGNMudWBvfICuADslnES4aImdKuOSdyPiGiPgSwJ0AZ81ySu1bF5FwIbgC7grcaZBDIkwH7ghybxBRgAOuuwbAYYSzoImGT4KMJVpoEHQB9wsIbo5geBZySMUegoUAI+RijmAYPAtlnks3rHyFqFiU47lATvBPbTT61QmPXqN9HQalpUPPqhd2uof4/6jDumgkua8M1Q+4DaT5ES1qli/gYsDbR/liKbSRFXgFfAYj2bhPpSB7TEMrwjCZqANUCr8oA55e0DiioxerRJ+4HLwG25yQgwAVSAmVlyS/h6D5wMV9XLlWg2ATmdzAqK493AMaAXOKd6qawD0xtgCqjW+PFGXCd8C15X8pmLQatS7LV+JhiFr8oAvTJItwxUkMFyMmAWaNbG9scLEm7rCKwMZ/Uwo6Ud1UGmpKXvlyv0yDWKcpW8XKdVrmQMMpd4NSjyV1tFN6bUtgkvriJRnTbg/beKVHTTTsoVOTNfNvsKhcc0ht/tejbfmxcJ8TgpL1GmpISVf+4dDofD4XA4HA4awh+NcGFA56kLEgAAAABJRU5ErkJggg=="/>
</defs>
</svg>

`,
                'Se permite comida y bebida': `<svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="35" height="35" fill="url(#pattern0_286_9574)"/>
<defs>
<pattern id="pattern0_286_9574" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_286_9574" transform="scale(0.02)"/>
</pattern>
<image id="image0_286_9574" width="50" height="50" xlink:href="data:image/png;base64,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"/>
</defs>
</svg>
`,
                'Se permiten mascotas': `<svg width="35" height="35" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="25" height="25" fill="url(#pattern0_40_3368)"/>
<defs>
<pattern id="pattern0_40_3368" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_40_3368" transform="scale(0.02)"/>
</pattern>
<image id="image0_40_3368" width="50" height="50" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACo0lEQVR4nO2ZTYhOURjHf8OQjyEpTT43xGIWksjCQsmUpKSsRAxKykemSExZjBIT3mJjg6yUha9SWGDGFBamyIakhoWvQaaUmfHq0VGn2z33nPve03mPur86m3ve57nP/73nPOd57oWSkpKSACwErgOfgCHgLXACmMR/wBrgCvBEBV9NGS+AyURMhyFwk5ijwGKggYhYBIzkEFLVRj/QBTQSATdqFFHVxqoYnsbvgiK+AlPqLeSch6fRQQS8LijicyxZ7EdBIe1Ewr4axXwHTgGjiYiTDoEPA9uBCURKs8o6NiFXiRhZFrccl9IOImUMcDnHnlhOhMwCHuTc3POICCnwNgNfashSzUTCAuB+gfNiagx74SDws+DB11RPEdIvvCwo4N8YVy8Ru4BfnkTIqMsJ3pUIYhuw1NB3SNG3B5gO3DSIkBImOMdSAtmtzR8AelXQPcBcba7HIORpaBHrDE1Sp6P9K4MQSRbBkJ7goyEQWVI2Jhr69v7Q/UZnxka95GA/HhhIsT1LQBqBDxlCtqrfPU5ZJvq12ym2sm+CsdqSOiUroQJekbDVrz1KsR0MmXqPW4TIvz7K4mO+ap7S7FsC6eCuw4F2OkOMFIR9GbZSaAbhjUXEgOrNpe5K45rFvuIz2CXAe+CdqqF0ssryZ8Bsi++KRYjXDX9Bc3wxMWd6cy6fAqY5+N5vEeJ1w5/XHN9LzJkCkGzmQpvDHmvxJeSQ5lTeeoy1CHmew/dGByGbfAlZlnC80yLkSA7f7Q5CKj777b7Eul2bIWRlDt9nHIR045HWlMLuoeHGc3L4dXmjMgisB2b6EnPY4abVnB8tbeeQPr4BM3yJ2aI6u6wbNtSYSFxGKx6RL0R7gTvqkEz253nY4ChgWL1i1TNmSUlJCX/5AysmYVtLwo7AAAAAAElFTkSuQmCC"/>
</defs>
</svg>
`,
                'No me gusta hablar mucho': `<svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="35" height="35" fill="url(#pattern0_286_9579)"/>
<defs>
<pattern id="pattern0_286_9579" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_286_9579" transform="scale(0.02)"/>
</pattern>
<image id="image0_286_9579" width="50" height="50" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADu0lEQVR4nNWaSWgUQRSGP0eNJLiiHgziweVgcF/iwQU8qLjk4EE9CO4XD0ERUU8i4hJFBXdQ0YOCG+ICCoqK68mDIm64BuO4x92oaBIp+BuK2D3Ty8x0+0MzVNV71e+fqlf13psBb4wHPgMTiR+TgC/6DIwdQCOwgPixULbsDKN8UcoVHuNFwDrgJZAGqtTnF0H0K2SLsSkQ+gFvpFzmIVOlcfsxfX4RRL9M48ambn4mHwjcsiZuAIo9ZNMuhpg+vwiiXyxbHLnLQC+vibsCtRJ8DZwGDuTIkFzoHwBOAR8la7ZkZzfBrRI4B7QOuTXWBiASVr8DcFXyxsf+wU0Nlvs0pEjGpCM4e1j94bL1ntvgJw22Ifkoka11boN1GjRCSUeHTETua3Aoyccg2frYbXC7BveSfKyWrfu9LsF64DcwhuSiDPggImO9hDZK4AewG5hFcjBTx+1b2Xgmk3BzYJt1iz4nOai27pvzQHs/SkO0zRoSchyXyJ4/wDigWRDlpwEvyHxioGx5EEb5uJTnED9my5YjYZQXZTrismACUAN8Uw4RKrOzcDhKkufkACZ0aRVQt8YlIFwVxgighRXx9gw5BzeyZIlecIwvBZYCv9QOszIV0r1LBFRqkmMhiThYpvaFEDacla7Z6qHRCfipo69PBCKlaptKSBD01hVgLuiORMRmGXEwAhGvvmw4IR1jQ2R01jdpVmVYAYmMkvx3oAs5wnLL4VoVgEixsr9GvTtnMBPfCZBXRyWyxfrigqTPvtBXTme22OQ8EpkqB/+pmC8vqLT27eA8ECm3Um7zrrxim170SquUKyL9gXeS2UUBkAIO6YW1HidZUCKmTvBe4ycVlhQExgGP6sVfgekRiEyzttPJfDi3n5XZYBm4B2jrg0im55aIxYI5WhWnZjwvApFGnVgzYuJCd+CKi1FB0FL5htF7RIxopvvltgeRlCqEXo8pnKesWoGJr9ZnOebzipQHEZug11Pt0mcKDvNj4uJK5LQKa16P42dOuL9EK1KviKI0KUT8bM1Z0nviEspP4T8hYpBSybZexUKDS5rL1LMSQ+S6h2+YCGGTjDXth5LvKcc3sV07EkTkWhZn/6LPFZJfqfY+YkLQrTWiyYXYQz7zTH2jiQlhfMTRMRerwQC1X8h3SKqP1Oj/Lk115qq9OAk/PPn1EftnC6fPCTyPqB1b3GUb5ecPA8Y/RlrbqGkkEFuI4pfIWpdTa4017iRakQtz+SZSJDJprYQhYSdVTr244ImWjbA3e+g5/gKMPsNeaaBMSAAAAABJRU5ErkJggg=="/>
</defs>
</svg>

`,
                'El baúl está vacío': `<svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="35" height="35" fill="url(#pattern0_286_9581)"/>
<defs>
<pattern id="pattern0_286_9581" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_286_9581" transform="scale(0.02)"/>
</pattern>
<image id="image0_286_9581" width="50" height="50" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACIklEQVR4nO2YQUgUURjHf0WpYGlhYHvJWxQePNSlOuYhPFkdI1kPHcSwizfpICRCVy91aj1FJ/HiSQ8ipqAFaVIdAgmNiFQKxSJkY+Q/8YpxkZ03uzPw/eCxs7Pf/P/ve9/Me/MWDMMwDMMwjDTRBrwAvgDFMtt3YBLoqFYSt4GfMRKIao8qncR5YEfmI8C5GFqngQfAL+nlfXTwMjAObGm0F4F7wFEn5ggwJdNR/JGX5jbQGlds44CSjwHHFdOlc1+BJvzyTNorQH0coR5gAGgBGoC7qk5RJk1KoKjffBN0/q30C77FL6ncgfhHfU7qFkuCVscv71s8mBp/Szx4di6QLN3y2tUUXzbBw30DGASeAwvOVPuQylCQ3w9gBngK9AHtQO4wAheB5QMe+iWghspQD7wpseZsKMEnwB2gzr24GfiswFXgsWapK8AZqkNOVehTVYLOb0YktqrlY58RnZwGTpBucsB1oN+p3LdwwD/pxN/MMkINMOG8abCnL+HilyXa1Pc1nPstixxT3/eynsg//bdEUkLRKpLWiqzr4CrZ45o7/Q5HLP1zhxCZ87x3j+M7FK6Qw05lwnayhFhjAkmU47umJCJfal8qqLOE4C3FzOIP7769Cn6nEfifU8AHxQTbZF949w3K9FoXvAduai/foBEJxRY971MS8c05olHtFXDWYxKJ+tYC94F5/TGwrRmjN+EdY22VfA3DMAzDIC38AQjRG/UiMyBfAAAAAElFTkSuQmCC"/>
</defs>
</svg>



`,
                'Viajo hasta el destino sin paradas': `<svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="35" height="35" fill="url(#pattern0_286_9582)"/>
<defs>
<pattern id="pattern0_286_9582" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_286_9582" transform="scale(0.02)"/>
</pattern>
<image id="image0_286_9582" width="50" height="50" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABu0lEQVR4nO3ZP07DMBiH4XdAcAKKKLC3R6FF3IEZ9s5UnAkWysIALCDBwCUYaGGA6UOWHClYbeI/af1Fyk+yqkq24idOHFuGLl26xOYEmAHfgGQuX7Yv41DElYLOy4oyDRmJotEnMCB/+sAE+LX9Gvk0urOV5/b3DeihIxPbp1ufygtbeWARmjD90k2uTfFYmewCr/b/O7BP/kipf0EVtWEkFqINIykQTRhJhWjBSBMQ7OzlzmahHzWzWngELoDtXJBlmJQv9QtwQCaIi0ktzwEjI01Dmsac54SswtTlELh22jzkhizD+CxnjhyIWRplh8ROze7jlR0yqpiaWwX5icC4j9aHBogEYgzixoHca4GI3cGdLnlnfMqZJkjVyFQVs1zZ0QYJxTwBexHX2gikDlMsGs3XfCvyWhuBrHMLILkhTWFEA6QJjGiBpGJEEyQFI9ogqQtNVZAYjGiFhGJknZAm4otRDzHxwbQC4oNpDaQO0ypIFca7f8VBjzlUyZ2es9Mchhz0zGxlc8yFMsw85OhtXNq2TpSMzLCEMOXYt+G0YkeXu1yG3oWRHcLinclZFrYv3iPRpUsX/uUPGV48DJpKg8AAAAAASUVORK5CYII="/>
</defs>
</svg>


`,
                'Hay puertos USB para cargar': `<svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="35" height="35" fill="url(#pattern0_286_9583)"/>
<defs>
<pattern id="pattern0_286_9583" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_286_9583" transform="scale(0.02)"/>
</pattern>
<image id="image0_286_9583" width="50" height="50" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACiklEQVR4nO2Yy2oUQRSGv+hkXGgQ3GnWLrws3Si4ENSNqAS8LLw8QTAmXhYuVBAyEcE30IWGgA8RfAcxKoqXhZOVIKiIukjLgb+haKbHnq7Tmc7YPxRUn646Vf+caw80GC0kzmNoGDkisWiIeKGxSAaNa3lhZF0r+Uc6zXvfEPHCyFqkLBoiXmgsUgfXagP3gdUKut8u0NEZlWOhAgLZMb8eRLo67GAFug8FlqkcVftzsl7x8t8RaQdJoavYam9EIgs9grjjqD8aRQ/qlZ5XHfVHo+hBaXYLx2dH/dEoelCnZH1I6kakLTJdWWJ+owZ7WSQNkRr9Yu1A/2vgu4bNF4EzwHjdiUwBHwo0lG+B03UkMgY8DPS+BK4C+4CtGjafBVa0Zk3JY1OdiKQkfgPTwOY+a+3dFeCPR7vvSWQqIHF0gH3HRMYsc2rYRLYAn6RreoA9ZzWfCWJmfJhEzgcx0c+dwlh6qj23gBbwSs+WzQbGN23eSRyeSY8FdhHc0fqvCn7DnGRGcGAsa/MN4vBRevYWWHtB8WCxdCSQ75eON2UucEKbfwE3gV1llAA/pWcikN0F9mTWHdZZRuRS5t2EdJiXlMI9x39MUiIWxPb8A7go2W7gi+S3e9wjmkhqmWW1EDFEUn+3wrcYyB8pI9n8sYI9iyjXislsoXxJc6vYIS4HbmfjeZ/2/7rWPHG+f88L58nT9LvSI/0eUDJ4AWzPOaOlZrJ0+vUiYkXsvZ6t7chiBzDZ54zZ2ILoRQR1sWtqN6ztKIrjHi2KJxHDA8nsYjNymTy0ZAmXptGbyFhAJlHMzCkjbdOw+bWgJXFp46vCyQE+rCp1Jw+Y65xTPXmn4mh1yixh/VTup+5fbyvElxOWwWsAAAAASUVORK5CYII="/>
</defs>
</svg>


`,
'Hay una sillita para niños': `<svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="35" height="35" fill="url(#pattern0_287_9588)"/>
<defs>
<pattern id="pattern0_287_9588" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_287_9588" transform="scale(0.02)"/>
</pattern>
<image id="image0_287_9588" width="50" height="50" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEnUlEQVR4nM2aW4hVVRjHf046pWli4gUyU8iwbKgXdUKjfCpqIBDFSaGXfBnEwqdezZTKLt5BI6TppSIisSv4oBZeErFsRlApgrlEUDaZiTOpTXzwX/Cx2HvP2WfOPmf/YTFn1vq+//rWWWt/l7UPFIMFwDagG/hHrVt9NlZ6NAO7gBvAcEqzsZ2SLSWagUMy9hqwHVgE3K62GNgBDErmUFkXs0sG9gAtGXIPAb2StZ0pFRboyFwbYRF+MYPSeYASYZu+YftbKXZK521KhHMyamEOncXS6aJEuCKjJubQmSidvykRLlexkDuk8xclQpeMMndbKVql8yMlwpsyyuJEXne9lZK53+tyqeZaR8LDwJB07qdkeEvfcO8Ii7FF9En2DUqIccBnMnBQcaJVDsDaIzpOQ5I5KJ1S4V7gfeC3jGQxbibbKd2GYwzwInA1xwLidlUcxtUQTAO+kDH/AXuBOTn0TXafdIfFNY06YxnQLwN+B9pGwdUmDuPqF3fhuAXY6Aqnw8BdNeCdAXztdndHkY7gbuAbV+Vt1MJq/bz9qzm+A+ZSYzwDXHKF06MUh0XAzy4PW1UL0lu1zeGB/BS4k+IxGfjQeTZz7ROqJTP//oOrwTtS5KYqHlRTtprOe+JIQofmHpYtuWPOTOAXEZzLKF+XuXTDdi0vwk73ZXirFle4/aTdqhidUvwqZUvHAluAm1Fwywuva1xbxB1jgmwxuXfzTDAgpXsSxsyTnHDea3MNFrLZufQTKd5qjsb/rKbimxX1t8uTBO/1WGRQtQtBXD3OW9lcsfvPXVF+IqXPtZjZ7rhZ+xiYItmmUeRZoRmHYYq4Q3+nFjDLpUM2XjHuA/5ImNDucNdGsu01WEgcK9ZqrljuUjWey1KPj3TMevUgxklhk/Mo1QSuVdLtdrsSYHO9ouN2WTtRWMrfnmFIJTCds+JYQYMwHrgoIzaMgmeDOC6Is+7Y6s7u9SqSyCYliaH0tfY6dcZC+f2bqr2DIaeBJyrQf1KyQe+guG7kvHYdFZrdhVy4tH7KxQBr3wLPRhWffV6tsSDXI11/Ed5Vr/cmm1LOtKURL7mAmdXMtb4GTHL6tzkP+HLRi2hR4WPHYEnCuD0j+13uNBAZH3Kz/SnP0xLJ2BwPFrmQcG+1O2HMduSAS/tXJsisdGn5gZSEdLd7bgpDiLaWNsQ19ykXfZdmcCx11eYp6SblVFcoEN2aZH3U/6X6rYaZXwHPfFfvWA7l8YL6LVAWhjZ3qeaLrVfV36uibCTMdC9ETTegxV32PU3BCA/zeed17OrmqHO9WVc545wLPupkjeu8cwaFY7yr5T9w/dNdLLF37GnY7mKI6QQY17C465aqzHPxoiN6wTmUkQSu0NiQZAM6XNE0jzpjuS4PBvX6IGC9jBpQQRYw28UV7yxaxWFcxtnQV259kRsN8WSP69vj4kfADHcLY1wNg914HJEhx3ShZ3hcfWec7PfqszEke0x9R1JuT+qK6S4mHNc7wXXu/4CT6lsnmeMu9viHvqGw35P8mpAcrnEyzyWM95fttyjoW31Hgc4ygOcTZKzPxkzGZGu2E/8DhxbaHBpvadQAAAAASUVORK5CYII="/>
</defs>
</svg>
`,


            },
            tripType: 'revisar', 
            tripTypeIcons: {
                revisar: `<svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="35" height="35" fill="url(#pattern0_286_9586)"/>
<defs>
<pattern id="pattern0_286_9586" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_286_9586" transform="scale(0.02)"/>
</pattern>
<image id="image0_286_9586" width="50" height="50" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACh0lEQVR4nO2ZS2sUQRSFv4BmESPqRtSMwfhK3OoiLmcTVzJm49ZXxEV+g/gW9U8kLicu9QeooEbGiYOvjUZ8bIwmEXVjDPig4DQUbXdNT0xPV7AOXBi6zq2+h5p761Y1BAQEBAQELD+2ABeAKnDDE6sqps1ZRWwH5oHfntoc0JdFyHU5TAKjwClPbFQxmdjGswhpiDyEfxhSbCbGpnguchn/UFZsJsamCEJi2AEMAyOyYT1bEStSAq4B7x1V5x1wFejxUchq4Czwwwr4O1ADbspqehaNLwBn5OuFkD3AlBXgfeAo0JXA7dLYA4tfBwaKFrIPmBX/I3CE7DgsH+P7GRgsSsh+4Ku4j4CNtI5N1mqaucycbRXSC8yIdxvodnC3ytKwFrijuWY0d1uEdAKPxXkCrEvhmXL72sqFaaCSwl0PPLNyprMdQi5r/IujeTMifiWU3p8OMTuBb+JdzFtIP7Co8WMp/h2xlYjbK8e7R8RZ1LtyE1LV2D0FnITeDK14Ws50qHwbzkSeQiaWSUipaCED1l/ruGOOaYeIlw6/k+36axlcsuq+OU0moaLETkr2gyk+u6xkN0fatpTfujhPHeW3osS2VyJNxAbghXg1R/+V+4ZoNrU0lBw5gXzvaq4PTbi5tyhTajeWclvTsPalwaKaxr3AJ6vxM5cErTSNke98kU1jhH41jVEuTKqireFvdGssug2JcmI3nhysVumQtBA7OJmicEtWjx28zPhp+Xp31O0BrgBvHfvIG/VrJj9WxC1KH3AIOCEzv7f945zlIoTkgfJ/KaTh8ZXpgVauTMc9vsR+qNjGsibpXIZWvCibbaVomI8p5z380HNuia1QQEBAQEAALvwBq3veJ+4ui0AAAAAASUVORK5CYII="/>
</defs>
</svg>
`, 
                automaticomente: `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
</svg>
` 
            },
        };
    },
    setup() {
        const tripDate = ref('');
        const tripTime = ref('');
        const todayDate = new Date().toISOString().split('T')[0];
        const isToday = computed(() => tripDate.value === todayDate);
        const currentTime = new Date().toTimeString().slice(0, 5);

        return { tripDate, tripTime, todayDate, isToday, currentTime };
    },
    methods: {
        async handleSubmit() {
            try {
                this.isUpdating = true; 

                const selectedIcon = this.tripTypeIcons[this.tripType];
                const additionalData = {
                    date: this.tripDate,
                    time: this.tripTime,
                    type: { name: this.tripType, icon: selectedIcon },
                    options: this.options.map(option => ({ name: option, icon: this.optionIcons[option] })),
                    description: this.newViaje.text
                };

                if (!selectedIcon) {
                    console.error("No hay ningún ícono para el tipo de viaje seleccionado");
                    return;
                }

                await updateTrip(this.tripId, additionalData);

                this.showModal = true;
            } catch (error) {
                console.error('Error al actualizar el viaje:', error);
            } finally {
                this.isUpdating = false; 
            }
        },
        confirmModal() {
            this.showModal = false;
            this.$router.push('/viajes'); 
        }



        ,
        async handleCommentSubmit(viajeId) {
            if (!this.newComment[viajeId]?.trim()) {
                console.error("El texto del comentario está vacío");
                return;
            }

            await saveComment({
                viajeId: viajeId,
                user_id: this.loggedUser.id,
                text: this.newComment[viajeId],
                displayName: this.loggedUser.displayName || 'Anónimo',
                rol: this.loggedUser.rol,
            });

            this.newComment[viajeId] = '';
            this.fetchComments(viajeId);
        },
        fetchComments(viajeId) {
            subscribeToComments(viajeId, (comments) => {
                if (!this.comments[viajeId]) {
                    this.comments[viajeId] = [];
                }
                this.comments[viajeId] = comments;
            });
        },
    },
    async mounted() {
        subscribeToViajes (newViajes => {
            this.viajes = newViajes;
            this.viajes.forEach(viaje => this.fetchComments(viaje.id));
        });
        unsubscribeAuth = subscribeToAuthState(newUserData => this.loggedUser = newUserData);
    },
    unmounted() {
        unsubscribeAuth();
    },
};
</script>

<style scoped>
.fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>