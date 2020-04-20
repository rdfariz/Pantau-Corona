export const state = () => ({
  indonesiaData: null,
  allProvinsi: null,
  selectedProvinsi: null,
  isLoading: false
})
export const getters = {
  indonesia: state => {
    return state.indonesiaData
  },
  selectedProvinsi: state => {
    return state.selectedProvinsi
  },
  allProvinsi: state => {
    return state.allProvinsi
  },
  isLoading: state => {
    return state.isLoading
  }
}
export const mutations = {
  setIndonesiaData(state, newData) {
    state.indonesiaData = newData
  },
  setAllProvinsi(state, newData) {
    state.allProvinsi = newData
  },
  setSelectedProvinsi(state, newData) {
    state.selectedProvinsi = newData
  },
  setLoading(state, newData) {
    state.isLoading = newData
  }
}
export const actions = {
  async getIndonesia({commit}) {
    await this.$axios.get('/api/indonesia/')
    .then((result)=>{
      const data = result.data
      commit('setIndonesiaData', data)
    }).catch((err)=>{

    }).finally((end)=>{
      
    })
  },
  async getProvinsi({dispatch, commit, state}, req) {
    commit('setLoading', true)
    await this.$axios.get('/api/indonesia/provinsi/')
    .then((result) => {
      const data = result.data.find(el => el.attributes.FID == req)
      commit('setSelectedProvinsi', data.attributes)
    }).catch((err) => {

    }).finally((end) => {
      commit('setLoading', false)
    })
  }
}
