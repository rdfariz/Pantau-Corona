<template>
  <div class="container" :class="[darkMode ? 'dark' : '']">

    
    <transition name="slide-fade">
    <div id="header" class="margin-b-2">
      
      <div class="text margin-b-1">
        <h1>Pantau Corona</h1>
        <p>Di Indonesia</p>
      </div>
      
      <div class="panelAction" v-if="provinsi != null">
        <vs-select
          :state="darkMode ? `` : `dark`"
          placeholder="Pilih Provinsi"
          auto
          v-model="FID"
          v-on:change="getDataProvinsi()"
          :loading="isLoading"
        >
          <vs-option v-for="p, index in provinsi" :label="p.attributes.Provinsi" :value="p.attributes.FID" :key="p.attributes.FID">
            {{p.attributes.Provinsi}}
          </vs-option>
        </vs-select>
      </div>

    </div>
    </transition>

    <div id="content">
      <div class="content-left">
        <transition name="slide-fade">
          <div class="text margin-b-2" v-if="indonesia != null">
            <vs-avatar style="margin-bottom: 8px" size="45" primary badge badge-color="danger">
              <template #text>
                {{indonesia[0].name}}
              </template>
            </vs-avatar>
            <h1>{{indonesia[0].name}}</h1>
            <p>Positif: <b>{{indonesia[0].positif}}</b></p>
            <p>Sembuh: <b>{{indonesia[0].sembuh}}</b></p>
            <p>Meninggal: <b>{{indonesia[0].meninggal}}</b></p>
          </div>
        </transition>

        <transition name="slide-fade">
        <div class="text margin-b-2" v-if="selectedProvinsi != null && isLoading != true">
          <vs-avatar style="margin-bottom: 8px" size="45" :danger="selectedProvinsi.Kasus_Meni > 5" primary :success="selectedProvinsi.Kasus_Meni == 0" badge badge-color="danger">
            <template #text>
              {{selectedProvinsi.Provinsi}}
            </template>
          </vs-avatar>
          <h1>{{selectedProvinsi.Provinsi}}</h1>
          <p>Positif: <b>{{selectedProvinsi.Kasus_Posi}}</b></p>
          <p>Sembuh: <b>{{selectedProvinsi.Kasus_Semb}}</b></p>
          <p>Meninggal: <b>{{selectedProvinsi.Kasus_Meni}}</b></p>
        </div>
        </transition>
      </div>

      <div class="content-right">
        <div class="log">
          <ul>
            <li v-for="dc in dailyCases">{{dc.time}} = {{dc.cases}}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="text footer">
      <p>Apps by <a href="https://instagram.com/rd_fariz" target="_blank">rd_fariz</a></p>
      <p>API: https://api.kawalcorona.com/indonesia/</p>
    </div>
    
  </div>
</template>

<script>
import moment from 'moment'

export default {
  async asyncData({$axios, isDev, route, store, env, params, query, req, res, redirect, error}) {
      const indonesia = await $axios.get('/indonesia')
      const provinsi = await $axios.get('/provinsi/')
      const daily = await $axios.get('/historical/indonesia')
      const provinsiSort = provinsi.data.sort((a,b)=>{
        const bandA = a.attributes.Provinsi.toUpperCase();
        const bandB = b.attributes.Provinsi.toUpperCase();

        let comparison = 0;
        if (bandA > bandB) {
          comparison = 1;
        } else if (bandA < bandB) {
          comparison = -1;
        }
        return comparison;
      })

      let dailyCases = []
      Object.keys(daily.data.timeline.cases).forEach(function(key) {
        dailyCases.push({
          time: key,
          cases: daily.data.timeline.cases[key]
        })
      });

      dailyCases.push({
        time: moment("6/12/15", "M/D/YY").format("M/D/YYYY"),
        cases: indonesia.data[0].positif
      })
      
      return {indonesia: indonesia.data, provinsi: provinsiSort, dailyCases: dailyCases.reverse()}
  },
  data: ()=>({
    FID: ''
  }),
  computed: {
    darkMode() {
      return false
    },
    selectedProvinsi() {
      return this.$store.getters.selectedProvinsi
    },
    isLoading() {
      return this.$store.getters.isLoading
    }
  },
  methods: {
    setDarkMode() {
      this.darkMode = !this.darkMode
      localStorage.setItem('darkMode', this.darkMode)
    },
    getDataProvinsi() {
      if (this.FID != '') {
        this.$store.dispatch('getProvinsi', this.FID)
      }else {
        return false
      }
    }
  }
}
</script>

<style lang="less">
@width: 100%;
@background: #ffffff;
@halfComponent: 50%;

  * {
    font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
  }

  .panelAction {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .margin-b-1 {
    margin-bottom: 16px;
  }
  .margin-b-2 {
    margin-bottom: 32px;
  }
  .margin-b-3 {
    margin-bottom: 48px;
  }

  .container {
    transition: .3s ease !important;
    position: relative;
    min-height: 100vh;
    color: #333333;
    background: @background;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    flex-wrap: wrap;
    padding: 64px;

    @media only screen and (max-width: 1080px) {
      margin-bottom: 80px;
    }

    #header {
      width: 100%;
    }

    #content {
      width: 100%;
      display: flex;
      justify-self: flex-start;
      align-items: flex-start;
      flex-wrap: wrap;
      flex-direction: row;

      .content-left {
        width: @halfComponent;
        height: 100%;
        min-height: 200px;
      }
      .content-right {
        width: @halfComponent;
        height: 100%;
        min-height: 300px;
      }
      
      @media only screen and (max-width: 1080px) {
        flex-direction: column;
        .content-left, .content-right {
          width: 100%;
        }
        
      }

    }

    .log {
      position: relative;
      width: 100%;
      min-height: 300px;
      max-height: 400px;
      background: #000000;
      overflow-y: auto;
      color: #ffffff;
      padding: 16px;
    }

    
  }
  .container.dark {
    background: #000000 !important;
  }
  .container.dark .text {
    color: #ffffff !important;
  }

  .footer {
    position: fixed;
    background: @background;
    padding: 32px 64px;
    width: 100%;
    bottom: 0;
    right: 0;
  }
  @media only screen and (max-width: 1080px) {
    .container, .footer {
      padding: 16px;
      font-size: 0.9em;
    }
  }

  a {
    font-weight: 500;
    color: inherit
  }

  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateY(10px);
    opacity: 0;
  }
</style>
