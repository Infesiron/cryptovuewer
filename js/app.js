Vue.component('crypto-icon', {
    props: ['symbol'],
    template: '<i class="cc" :class="symbol"></i>'
});

Vue.component('num-checker', {
    template: '<div class="input-group col-md-4 offset-md-4"><input type="number" v-model="limit" class="form-control" placeholder="Currencies to display" min="5" max="50"> \
    <div class="input-group-append"> \
        <button class="btn btn-success" @click="fireUpdateEvent(limit)" type="button">Go</button> \
    </div></div>',
    data() {
        return {
            limit: null
        }
    },
    methods: {
        fireUpdateEvent: function () {
            if (this.limit > 50) this.limit = 50;
            if (this.limit < 5) this.limit = 5;
            
            this.$root.$emit('limit_changed', this.limit)
        }
    }
});

var mainStats = new Vue({
    el: '#main-stats',
    data: {
        coins: [],
        loading: true,
        sortColumns: {},
        activeColumn: null
    },
    methods: {
        getData: function (limit = 12) {
            vm = this
            axios.get('https://api.coinmarketcap.com/v2/ticker/?limit='+limit)
            .then(function (response) {
                vm.coins = [];
                var data = response.data.data;
                for (var prop in data) {
                    if ( data.hasOwnProperty(prop) ) {
                        var temp = data[prop]['quotes']['USD']
                        delete data[prop]['quotes']

                        vm.coins.push(Object.assign(data[prop], temp))
                    }
                }
                vm.loading = false;
            })
            .catch(function (error) {
                console.log(error)
            })
            
        },
        updateTable: function () {
            this.loading = true;
            this.getData()
        },
        sortBy: function (field) {
            if (this.sortColumns[field] === undefined) {
                this.sortColumns[field] = false;
            }
            this.activeColumn = field;
            if (!this.sortColumns[field]) {
                this.coins = this.coins.sort(function(item1, item2) {
                    if(item1[field] < item2[field]) return -1;
                    if(item1[field] > item2[field]) return 1;
                    return 0;
                });
                this.sortColumns[field] = true;
            } else {
                this.coins = this.coins.sort(function(item1, item2) {
                    if(item1[field] > item2[field]) return -1;
                    if(item1[field] < item2[field]) return 1;
                    return 0;
                });
                this.sortColumns[field] = false;
            }
                
        },
        isGrowing: function (num) {
            return num > 0;
        },
        isActive: function (column) {
            return this.activeColumn == column;
        }
    },
    created() {
        this.getData()
    },
    mounted: function () { 
        this.$on('limit_changed', (limit) => {
            this.loading = true
            this.getData(limit)
        })
      }
})