import { acceptHMRUpdate, defineStore } from "pinia";

export const useSeriesStore = defineStore({
  id: "series-store",
  state: () =>{
    return {
      series: [] as any[]
    }
  },
  getters:{
    names(state) {
      let seriesNames = [] as string[];
      state.series.forEach(element => {
        seriesNames.push(element.title);
      });
      return seriesNames;
    }
  },
  actions: {
    addSeries(data:any) {

      if (this.series.findIndex(x => x.$id == data.$id) < 0){
        this.series.push(data);
      }
    },
    updateSeries(series_id: string, title: string) {
      for (let i = 0; i < this.series.length; i++) {
        if (this.series[i].$id == series_id) {
          this.series[i].title = title; 
        }
      }
    },
    clear() {
      this.series = []
    },
    getNames() {
      let seriesNames = [] as string[];
      this.series.forEach(element => {
        seriesNames.push(element.title);
      });
      return seriesNames;
    },
    getSeries() {
      let seriesNames = [] as any[];
      this.series.forEach(element => {
        seriesNames.push(element);
      });
      return seriesNames;
    },
    getSeriesWithId(series_id:string) {
      return this.series.find(x => x.$id == series_id);
    },
    removeSeries(series_id:string) {
      let index = this.series.findIndex( (x) => x.$id == series_id);
      this.series.splice(index, 1);
    }
  }
});


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSeriesStore, import.meta.hot));
}